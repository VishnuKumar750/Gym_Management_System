import cron from 'node-cron';
import Member from '../models/member.model';
import DietPlan from '../models/diet.model';
import { NotificationService } from '../services/notification.service';
import { BillStatus } from '../enums/bill.enums';
import { NotificationType } from '../enums/notification.enums';
import Bill from '../models/bills.models';

export const startCronJobs = () => {
  // 1️⃣ Bill Payment Reminder - every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    const upcomingBills = await Bill.find({
      status: BillStatus.PENDING,
      dueDate: { $gt: new Date(), $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }, // next 3 days
    });

    for (const bill of upcomingBills) {
      await NotificationService.createNotification({
        member: bill.member,
        title: 'Payment Reminder',
        message: `Your bill ${bill.billNumber} is due soon.`,
        type: NotificationType.PAYMENT_REMINDER,
      });
    }
    console.log('Payment reminders sent');
  });

  // 2️⃣ Overdue Bill Notification - daily at 9 AM
  cron.schedule('0 9 * * *', async () => {
    const overdueBills = await Bill.find({
      status: BillStatus.PENDING,
      dueDate: { $lt: new Date() },
    });

    for (const bill of overdueBills) {
      await NotificationService.createNotification({
        member: bill.member,
        title: 'Payment Overdue',
        message: `Your bill ${bill.billNumber} is overdue. Please pay immediately.`,
        type: NotificationType.PAYMENT_OVERDUE,
      });
    }
    console.log('Overdue notifications sent');
  });

  // 3️⃣ Membership Expiry Alert - daily at 10 AM
  cron.schedule('0 10 * * *', async () => {
    const expiringMembers = await Member.find({
      'membership.endDate': {
        $gt: new Date(),
        $lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    for (const member of expiringMembers) {
      await NotificationService.createNotification({
        member: member._id,
        title: 'Membership Expiring Soon',
        message: 'Your gym membership is expiring in a few days!',
        type: NotificationType.MEMBERSHIP_EXPIRY,
      });
    }
    console.log('Membership expiry alerts sent');
  });

  // 5️⃣ Expired Diet Plan Notification & Auto Update
  cron.schedule('0 6 * * *', async () => {
    const expired = await DietPlan.find({
      status: 'ACTIVE',
      endDate: { $lt: new Date() },
    });

    for (const diet of expired) {
      diet.status = 'COMPLETED';
      await diet.save();

      await NotificationService.createNotification({
        member: diet.member,
        title: 'Diet Plan Completed',
        message: 'Your diet plan has ended. Please contact trainer for update.',
        type: NotificationType.DIET_PLAN_UPDATED,
      });
    }
    console.log('Diet plan status updated');
  });
};
