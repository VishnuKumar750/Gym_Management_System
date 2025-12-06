// services/supplement.service.ts
import Purchase from '../models/purchase.model';
import Bill from '../models/bills.models';
import { Types } from 'mongoose';
import { BillStatus, PaymentMethod } from '../enums/bill.enums';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification.enums';
import ErrorHandler from '../utils/ErrorHandler.utils';
import { HTTPSTATUS } from '../config/http.config';
import Supplement, { ISupplement } from '../models/supplementstore.model';

export class SupplementService {
  /** --------------------- ADMIN METHODS --------------------- **/

  // Create a new supplement
  static async createSupplement(data: Partial<ISupplement>) {
    return await Supplement.create(data);
  }

  // Update a supplement by ID
  static async updateSupplement(supplementId: string, data: Partial<ISupplement>) {
    const supplement = await Supplement.findByIdAndUpdate(supplementId, data, { new: true });
    if (!supplement) throw new ErrorHandler(HTTPSTATUS.NOT_FOUND, 'Supplement not found');
    return supplement;
  }

  // Delete a supplement by ID (soft delete by isActive)
  static async deleteSupplement(supplementId: string) {
    const supplement = await Supplement.findByIdAndUpdate(
      supplementId,
      { isActive: false },
      { new: true }
    );
    if (!supplement) throw new ErrorHandler(HTTPSTATUS.NOT_FOUND, 'Supplement not found');
    return supplement;
  }

  // Get all supplements (active only)
  static async getAllSupplements() {
    return await Supplement.find({ isActive: true });
  }

  // Get supplement by ID
  static async getSupplementById(supplementId: string) {
    const supplement = await Supplement.findById(supplementId);
    if (!supplement || !supplement.isActive)
      throw new ErrorHandler(HTTPSTATUS.NOT_FOUND, 'Supplement not found');
    return supplement;
  }

  /** --------------------- MEMBER METHODS --------------------- **/

  // Purchase supplement by member
  static async purchaseSupplement(memberId: string, supplementId: string, quantity: number) {
    const supplement = await Supplement.findById(supplementId);
    if (!supplement) throw new ErrorHandler(HTTPSTATUS.NOT_FOUND, 'Supplement not found');
    if (supplement.stock < quantity)
      throw new ErrorHandler(HTTPSTATUS.BAD_REQUEST, 'Insufficient stock');

    const totalAmount = supplement.price * quantity;

    // Deduct stock
    supplement.stock -= quantity;
    await supplement.save();

    // Create purchase record
    const purchase = await Purchase.create({
      member: memberId,
      supplement: supplementId,
      quantity,
      totalAmount,
      paymentStatus: 'UNPAID',
    });

    // Generate bill
    const billNumber = `SUP-${new Types.ObjectId().toHexString().slice(-6).toUpperCase()}`;
    await Bill.create({
      member: memberId,
      billNumber,
      amount: totalAmount,
      status: BillStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
      description: `Supplement Purchase - ${supplement.name}`,
    });

    // Send notification
    await NotificationService.createNotification({
      member: memberId,
      title: 'Supplement Purchase',
      message: `Purchased ${quantity} x ${supplement.name}`,
      type: NotificationType.PAYMENT_SUCCESS,
    });

    return purchase;
  }

  // Get all purchases of a member
  static async getMemberPurchases(memberId: string) {
    return await Purchase.find({ member: memberId }).populate('supplement', 'name price');
  }

  // Get all bills for a member's supplement purchases
  static async getMemberBills(memberId: string) {
    return await Bill.find({ member: memberId, description: /Supplement Purchase/i }).sort({
      createdAt: -1,
    });
  }
}
