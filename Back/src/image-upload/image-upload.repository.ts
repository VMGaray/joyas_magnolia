/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class FileUploadRepository {
  constructor(@Inject('CLOUDINARY') private readonly cloudinaryInstance: any) {}
  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'auto',
      };

      // Agregar folder si se especifica
      if (folder) {
        uploadOptions.folder = folder;
      }

      const upload = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            // Verificación adicional para asegurar que result no es undefined
            resolve(result);
          } else {
            // Caso en que tanto error como result son undefined/null
            reject(new Error('Upload failed: No response from Cloudinary'));
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Delete failed: No response from Cloudinary'));
        }
      });
    });
  }

  async deleteImageByUrl(imageUrl: string): Promise<any> {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      if (!publicId) {
        console.warn(`No se pudo extraer public_id de la URL: ${imageUrl}`);
        // Retornar un objeto en lugar de lanzar error
        return { result: 'not_found' };
      }

      const result = await this.deleteImage(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  extractPublicIdFromUrl(imageUrl: string): string | null {
    try {
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.findIndex((part) => part === 'upload');

      if (uploadIndex === -1) return null;

      const publicIdWithVersion = urlParts.slice(uploadIndex + 1).join('/');
      const publicId = publicIdWithVersion.replace(/^v\d+\//, '');

      return publicId.replace(/\.[^/.]+$/, '');
    } catch (error) {
      return null;
    }
  }
}
