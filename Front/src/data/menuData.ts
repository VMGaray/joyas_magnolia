import {
  Category,
  ProductType,
  getSubtypesForProductType,
} from "@/lib/classification.enum";

export type MenuSubtype = {
  label: string;
  value: string;
};

export type MenuSection = {
  label: string;
  value: string;
  subtypes: MenuSubtype[];
};

export type MainCategory = {
  title: string;
  href: string;
  category?: string;
  sections?: MenuSection[];
};

// Tipos de producto que se muestran como columnas del mega menu para cada metal.
// Se excluye "Combos" porque no forma parte de la jerarquía del formulario de carga.
const PRODUCT_TYPES_IN_MENU = [
  ProductType.Rings,
  ProductType.Earrings,
  ProductType.Chains,
  ProductType.Bracelets,
  ProductType.Pendants,
  ProductType.Sets,
];

function buildSections(): MenuSection[] {
  return PRODUCT_TYPES_IN_MENU.map((type) => ({
    label: type,
    value: type,
    subtypes: Object.values(getSubtypesForProductType(type)).map((value) => ({
      label: value,
      value,
    })),
  }));
}

export const MENU_ITEMS: MainCategory[] = [
  {
    title: "Plata 925",
    href: "/categoria/plata-925",
    category: Category.Silver925,
    sections: buildSections(),
  },
  {
    title: "Oro 18k",
    href: "/categoria/oro-18k",
    category: Category.Gold18k,
    sections: buildSections(),
  },
  {
    title: "Enchapado",
    href: "/categoria/enchapado",
    category: Category.Plated,
    sections: buildSections(),
  },
  {
    title: "Personalizados",
    href: "/categoria/personalizados",
    category: Category.Personalized,
  },
  {
    title: "Insumos",
    href: "/categoria/insumos",
    category: Category.Supplies,
  },
];
