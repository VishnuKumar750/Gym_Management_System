export interface Member {
  _id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: "active" | "inactive" | "suspended";

  assignedPackage?: {
    _id: string;
    packageName: string;
  };

  address: {
    state: string;
    city: string;
    street: string;
    zipCode: string;
  };

  createdAt: string;
}
