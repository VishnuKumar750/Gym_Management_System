import { z } from 'zod';
import { BillStatus, PaymentMethod } from '../enums/bill.enums';

export const createBillSchema = z.object({
  body: z.object({
    member: z.string({ required_error: 'Member ID required' }),
    amount: z.number().min(1),
    dueDate: z.string(),
    status: z.nativeEnum(BillStatus).optional(),
  }),
});

export const updateBillStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BillStatus),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    paidDate: z.string().optional(),
  }),
});
