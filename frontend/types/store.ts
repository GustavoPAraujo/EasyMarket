
export type Store = {
  id: number;
  name: string;
  description?: string;
  adminId: number;
  createdAt: Date;
  products: Product[]
}

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  storeId: number;
  createdAt: Date;
  updatedAt: Date | null;
  categoryId: number;
}
