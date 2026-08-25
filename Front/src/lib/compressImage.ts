'use client';

// Dimensión máxima (en px, del lado más largo) que dejamos pasar.
const MAX_DIMENSION = 1600;
// Calidad de re-encode para JPEG (0-1).
const JPEG_QUALITY = 0.82;
// Si el archivo ya pesa menos que esto, no vale la pena procesarlo.
const SKIP_THRESHOLD_BYTES = 800 * 1024; // 800KB

/**
 * Redimensiona/recomprime una imagen en el navegador antes de subirla.
 *
 * Pensado para fotos de cámara (típicamente Mac/iPhone vía la app Fotos)
 * que suelen exportarse a resolución original y pesar varios MB, lo que
 * puede superar límites de tamaño del proveedor de imágenes (Cloudinary)
 * o simplemente hacer la carga lenta/propensa a timeouts.
 *
 * Si algo falla (formato no soportado por el canvas, navegador viejo, etc.)
 * devuelve el archivo original sin tocar, para no bloquear la carga del producto.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  if (file.size <= SKIP_THRESHOLD_BYTES) {
    return file;
  }

  try {
    const source = await loadImageSource(file);
    const { width: rawWidth, height: rawHeight } = getSize(source);

    if (!rawWidth || !rawHeight) return file;

    const { width, height } = fitWithin(rawWidth, rawHeight, MAX_DIMENSION);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(source as CanvasImageSource, 0, 0, width, height);

    if ('close' in source) source.close();

    // Preservamos PNG (puede tener transparencia real); todo lo demás sale como JPEG.
    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, outputType === 'image/jpeg' ? JPEG_QUALITY : undefined)
    );

    if (!blob || blob.size >= file.size) {
      // La "compresión" no ayudó (imagen ya optimizada, o algo raro): nos quedamos con el original.
      return file;
    }

    const newName =
      outputType === 'image/jpeg' && !/\.(jpe?g)$/i.test(file.name)
        ? file.name.replace(/\.[^/.]+$/, '') + '.jpg'
        : file.name;

    return new File([blob], newName, { type: outputType, lastModified: Date.now() });
  } catch (err) {
    console.warn('No se pudo comprimir la imagen, se sube el archivo original:', err);
    return file;
  }
}

async function loadImageSource(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Algunos navegadores no soportan createImageBitmap con ciertos formatos: seguimos al fallback.
    }
  }

  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function getSize(source: ImageBitmap | HTMLImageElement): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

function fitWithin(width: number, height: number, max: number) {
  if (width <= max && height <= max) return { width, height };
  const scale = max / Math.max(width, height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}
