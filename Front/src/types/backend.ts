export interface Category {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
  category: Category;
}

export interface Subtype {
  id: number;
  name: string;
  productType: ProductType;
}

export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: Category;
  productType: ProductType;
  subtype: Subtype | null;
}