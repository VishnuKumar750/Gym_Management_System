import { Types } from 'mongoose';
import { HTTPSTATUS } from '../config/http.config';
import Member, { IMember } from '../models/member.model';
import User from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler.utils';
import { MembershipStatus } from '../enums/day.enums';
import FeePackage from '../models/feePackage.model';
import Bill from '../models/bills.models';
import { BillStatus } from '../enums/bill.enums';
import { NotificationService } from './notification.service';
import { NotificationStatus, NotificationType } from '../enums/notification.enums';

export interface CreateMemberDTO {
  user: string;
  fullName: string;
  phone: string;
  age: number;
}

export class MemberService {
  // create a new Member
  static async createMember(data: CreateMemberDTO): Promise<IMember> {
    // check if member already exists for the user
    const existing = await Member.findOne({ user: data.user });

    if (existing) {
      throw new ErrorHandler(HTTPSTATUS.CONFLICT, 'Member already exists');
    }

    // generate memberId automatically (example: GYM-0001)
    const newMemberId = `GYM-${new Types.ObjectId().toHexString().slice(-6).toUpperCase()}`;

    const member = new Member({
      ...data,
      memberId: newMemberId,
      membership: [],
    });

    return await member.save();
  }

  // get all members
  static async getAllMembers(): Promise<IMember[]> {
    return Member.find().populate('user', 'email role').exec();
  }

  // get member by id
  static async getMemberById(id: string): Promise<IMember | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return Member.findById(id).populate('user', 'email role').exec();
  }

  // Update member by ID
  static async updateMember(
    id: string,
    updateData: Partial<CreateMemberDTO>
  ): Promise<IMember | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Member.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Delete member by ID
  static async deleteMember(id: string): Promise<IMember | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Member.findByIdAndDelete(id).exec();
  }

  static async assignPackage(
    memberId: string,
    packageId: string,
    paymentStatus: 'PAID' | 'UNPAID' = 'UNPAID'
  ) {
    const member = await Member.findById(memberId);
    if (!member) throw new ErrorHandler(404, 'Member not found');

    const pkg = await FeePackage.findById(packageId);
    if (!pkg) throw new ErrorHandler(404, 'Package not found');

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + pkg.durationInMonths);

    // Update current membership info
    member.membership = {
      plan: pkg.plan,
      startDate,
      endDate,
      status: MembershipStatus.ACTIVE,
    };

    // Add to package history
    member.packageHistory.push({
      packageId,
      plan: pkg.plan,
      startDate,
      endDate,
      amount: pkg.amount,
      paymentStatus,
    });

    await member.save();

    // Auto-create a new bill for this package
    const billNumber = `BILL-${new Types.ObjectId().toHexString().slice(-6).toUpperCase()}`;
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + 7); // 7 days to pay the bill

    const bill = new Bill({
      member: member._id,
      packageId,
      billNumber,
      amount: pkg.amount,
      discount: 0,
      finalAmount: pkg.amount,
      startDate,
      endDate,
      dueDate,
      status: BillStatus.PENDING,
      paymentMethod: null,
      paidDate: null,
      description: `Membership Bill for ${pkg.plan}`,
    });

    await bill.save();

    await NotificationService.createNotification({
      member: member._id,
      title: 'New Package Assigned',
      message: `Your ${pkg.plan} membership package has been assigned. A bill of ₹${
        pkg.amount
      } is generated and due by ${dueDate.toDateString()}.`,
      type: NotificationType.NEW_BILL,
      status: NotificationStatus.SENT,
    });

    return {
      message: 'Package assigned and bill generated successfully.',
      member,
      bill,
    };
  }
}
