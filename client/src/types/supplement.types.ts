export type ISupplement = {
  _id: string;
  imageUrl?: string;
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  stockQuantity: number;
  unit: string;
  updatedAt: string;
};

export type SupplementCardProps = {
  data: ISupplement;
};
