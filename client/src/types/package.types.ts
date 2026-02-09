export interface IPackage {
  _id: string;
  packageName: string;
  duration: number;
  price: number;
  features: string[];
  description?: string;
  isActive: boolean;
  createdAt: string;
}
