export interface IBill {
  _id: string;
  billNumber: string;
  memberId: {
    _id: string;
    name: string;
    memberId: string;
    phone?: string;
    email?: string;
  };
  packageId: {
    _id: string;
    packageName: string;
  };
  amount: number;
  discount: number;
  taxAmount: number;
  finalAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: string;
  remarks?: string;
}
