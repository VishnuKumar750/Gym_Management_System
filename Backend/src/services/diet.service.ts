// services/diet.service.ts
import { NotificationType } from '../enums/notification.enums';
import DietPlan from '../models/diet.model';
import { NotificationService } from './notification.service';

export class DietService {
  static async createDietPlan(data: any) {
    const diet = await DietPlan.create(data);

    await NotificationService.createNotification({
      member: data.member,
      title: 'Diet Plan Assigned',
      message: 'A new diet plan has been assigned to you!',
      type: NotificationType.DIET_PLAN_UPDATED,
    });

    return diet;
  }

  static async getDietByMember(memberId: string) {
    return await DietPlan.find({ member: memberId, status: 'ACTIVE' }).sort({ createdAt: -1 });
  }

  static async updateDietPlan(id: string, updates: any) {
    return await DietPlan.findByIdAndUpdate(id, updates, { new: true });
  }
}
