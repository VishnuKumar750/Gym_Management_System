import Bill, { IBill } from '../models/bills.models';
// import { Parser } from 'json2csv'

export class ReportService {
  static async getRevenueReport(startDate?: string, endDate?: string): Promise<IBill[]> {
    const filter: any = {};

    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

    const bills = await Bill.find(filter)
      .populate('member', 'memberId fullName')
      .sort({ createdAt: -1 })
      .exec();

    return bills;
  }

  static async exportRevenueReportCSV(bills: IBill[]): Promise<string> {
    const data = bills.map((bill) => ({
      billNumber: bill.billNumber,
      memberId: (bill.member as any)?.memberId,
      memberName: (bill.member as any)?.fullName,
      amount: bill.amount,
      status: bill.status,
      paidDate: bill.paidDate ? bill.paidDate.toISOString().split('T')[0] : '',
      dueDate: bill.dueDate.toISOString().split('T')[0],
    }));

    // const json2csvParser = new Parser();
    // return json2csvParser.parse(data);
    return '';
  }
}
