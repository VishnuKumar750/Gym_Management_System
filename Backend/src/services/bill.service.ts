import { BillStatus } from '../enums/bill.enums';
import Bill, { IBill } from '../models/bills.models';

export class BillService {
  static async createBill(data: Partial<IBill>) {
    const lastBill = await Bill.findOne().sort({ createdAt: -1 }).exec();
    const lastId = lastBill ? parseInt(lastBill.billNumber.split('-')[2]) : 0;
    const newBillNumber = `BILL-${new Date().getFullYear()}-${(lastId + 1)
      .toString()
      .padStart(4, '0')}`;

    return await Bill.create({
      ...data,
      billNumber: newBillNumber,
      status: data.status || BillStatus.PENDING,
    });
  }

  static async markBillPaid(id: string, updateData: Partial<IBill>) {
    return Bill.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async getMemberBills(memberId: string) {
    return Bill.find({ member: memberId }).sort({ createdAt: -1 });
  }

  static async getAllBills() {
    return Bill.find().populate('member', 'fullName phone');
  }
}
