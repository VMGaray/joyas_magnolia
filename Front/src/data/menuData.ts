export type SubCategoryItem = {
    name: string;
    href: string;
  };
  
  export type CategorySection = {
    title: string;
    items: SubCategoryItem[];
  };
  
  export type MainCategory = {
    title: string;
    href: string;
    sections?: CategorySection[];
  };
  
  export const MENU_ITEMS: MainCategory[] = [
    // 1. PLATA 925 (Completo con todo el detalle)
    {
      title: "Plata 925",
      href: "/categoria/plata-925",
      sections: [
        {
          title: "Anillos",
          items: [
            { name: "Piedras naturales", href: "/categoria/plata-925/anillos/piedras-naturales" },
            { name: "Cubic y misopavé", href: "/categoria/plata-925/anillos/cubic" },
            { name: "Plata lisa", href: "/categoria/plata-925/anillos/plata-lisa" },
            { name: "Elastizados", href: "/categoria/plata-925/anillos/elastizados" },
            { name: "Midis", href: "/categoria/plata-925/anillos/midis" },
            { name: "Inflados", href: "/categoria/plata-925/anillos/inflados" },
            { name: "Nacar y Perlas", href: "/categoria/plata-925/anillos/nacar-perlas" },
            { name: "Plata y Oro", href: "/categoria/plata-925/anillos/plata-oro" },
          ],
        },
        {
          title: "Cadenas",
          items: [
            { name: "Denarios y Rosarios", href: "/categoria/plata-925/cadenas/denarios" },
            { name: "Finas y Clásicas", href: "/categoria/plata-925/cadenas/finas" },
            { name: "Nacar y Perlas", href: "/categoria/plata-925/cadenas/nacar-perlas" },
            { name: "Piedras", href: "/categoria/plata-925/cadenas/piedras" },
            { name: "Tanzas", href: "/categoria/plata-925/cadenas/tanzas" },
            { name: "Cristales", href: "/categoria/plata-925/cadenas/cristales" },
            { name: "Gamuzas", href: "/categoria/plata-925/cadenas/gamuzas" },
            { name: "Con Dijes", href: "/categoria/plata-925/cadenas/con-dijes" },
            { name: "Otras", href: "/categoria/plata-925/cadenas/otras" },
            { name: "Hombres", href: "/categoria/plata-925/cadenas/hombres" },
          ],
        },
        {
          title: "Pulseras",
          items: [
            { name: "Exclusivas e Importadas", href: "/categoria/plata-925/pulseras/exclusivas" },
            { name: "Elásticas", href: "/categoria/plata-925/pulseras/elasticas" },
            { name: "Plata lisa", href: "/categoria/plata-925/pulseras/plata-lisa" },
            { name: "Nacar y Perla", href: "/categoria/plata-925/pulseras/nacar-perla" },
            { name: "Cristales", href: "/categoria/plata-925/pulseras/cristales" },
            { name: "Cubic y Micro", href: "/categoria/plata-925/pulseras/cubic" },
            { name: "Esclavas", href: "/categoria/plata-925/pulseras/esclavas" },
            { name: "Con dijes", href: "/categoria/plata-925/pulseras/con-dijes" },
            { name: "Gamuzas y Cueros", href: "/categoria/plata-925/pulseras/gamuzas" },
            { name: "Plata y Oro", href: "/categoria/plata-925/pulseras/plata-oro" },
            { name: "Hombres", href: "/categoria/plata-925/pulseras/hombres" },
          ],
        },
        {
          title: "Aros",
          items: [
            { name: "Argollas", href: "/categoria/plata-925/aros/argollas" },
            { name: "Colgantes", href: "/categoria/plata-925/aros/colgantes" },
            { name: "Pasantes", href: "/categoria/plata-925/aros/pasantes" },
            { name: "Abridores", href: "/categoria/plata-925/aros/abridores" },
            { name: "Inflados", href: "/categoria/plata-925/aros/inflados" },
            { name: "Con dijes", href: "/categoria/plata-925/aros/con-dijes" },
            { name: "Cuff", href: "/categoria/plata-925/aros/cuff" },
            { name: "Trepadores", href: "/categoria/plata-925/aros/trepadores" },
            { name: "Micro y Cubic", href: "/categoria/plata-925/aros/micro-cubic" },
            { name: "Otros", href: "/categoria/plata-925/aros/otros" },
          ],
        },
        {
          title: "Dijes",
          items: [
            { name: "Para grabar", href: "/categoria/plata-925/dijes/grabar" },
            { name: "Cristales", href: "/categoria/plata-925/dijes/cristales" },
            { name: "Religiosos", href: "/categoria/plata-925/dijes/religiosos" },
            { name: "Esmaltados", href: "/categoria/plata-925/dijes/esmaltados" },
            { name: "Exclusivos e Importantes", href: "/categoria/plata-925/dijes/exclusivos" },
            { name: "Piedras", href: "/categoria/plata-925/dijes/piedras" },
            { name: "Inflados", href: "/categoria/plata-925/dijes/inflados" },
            { name: "Micro y Cubic", href: "/categoria/plata-925/dijes/micro-cubic" },
            { name: "Liso", href: "/categoria/plata-925/dijes/liso" },
            { name: "Iniciales", href: "/categoria/plata-925/dijes/iniciales" },
            { name: "Otros", href: "/categoria/plata-925/dijes/otros" },
          ],
        },
        {
            title: "Conjuntos",
            items: [
                { name: "Conjuntos y Combos", href: "/categoria/plata-925/conjuntos" }
            ]
        }
      ],
    },
  
    // 2. ORO 18KL (Estructura base, items vacíos por ahora)
    {
      title: "Oro 18kl",
      href: "/categoria/oro-18kl",
      sections: [
        { title: "Aros", items: [] },
        { title: "Anillos", items: [] },
        { title: "Cadenas", items: [] },
        { title: "Pulseras", items: [] },
        { title: "Dijes", items: [] },
        { title: "Conjuntos y Combos", items: [] },
      ]
    },
  
    // 3. ENCHAPADO (Estructura base, items vacíos por ahora)
    {
      title: "Enchapado",
      href: "/categoria/enchapado",
      sections: [
        { title: "Aros", items: [] },
        { title: "Anillos", items: [] },
        { title: "Cadenas", items: [] },
        { title: "Pulseras", items: [] },
        { title: "Dijes", items: [] },
        { title: "Conjuntos y Combos", items: [] },
      ]
    },
  
    // 4. INSUMOS
    {
      title: "Insumos",
      href: "/categoria/insumos",
    },
  
    // 5. PERSONALIZADOS
    {
      title: "Personalizados",
      href: "/categoria/personalizados",
    },
  ];