// user for gym
// user role -> 'ADMIN' | 'MEMBER' | 'USER(STAFF, TRAINER)'
import { Document } from 'mongoose';

export interface IUser extends Document {
	_id?: string;
	gymId: string; // tenant isolation 
	
	name: string;
	email: string;
	password: string;
	
	role: 'ADMIN' | 'STAFF' | 'TRAINER' | 'MEMBER';
	isActive: boolean;

}

// interface for member
export interface IMember extends Document {
	_id?: string;

	gymId: string;
	userId: string;

	phone: string;	
	avatar?: string;

	membershipStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

	package_history: string[];

	joinDate?: Date;
	expiryDate?: Date;
	
}

// fee_package
export interface IFeePackage extends Document {
	_id?: string;

	gymId: string;
	
	title: string;
	durationMonths: number;
	amount: number;

	isActive: boolean;

}

// bill
export interface IBill extends Document {
	_id?: string;

	gymId: string;
	memberId: string;
	
	packageSnapshot: {
		type: string;
		durationMonths: number;
		amount: number;
	};

	paymentMode: 'UPI' | 'CARD' | 'CASH';
	paymentStatus: 'SUCCESS' | 'FAILED' | 'REFUNDED';
	paymentDate: Date;


}

// notification 
export interface INotification extends Document {
	_id?: string;
	gymId: string;
	memberId: string;

	notificationType: 'FEE_REMAINDER' | 'ANNOUNCEMENT' | 'EXPIRY_ALERT';

	message: string;
	sentAt: Date;
	sentStatus: 'SENT' | 'FAILED';
}

//  diet plan
export interface IDietPlan extends Document {
	_id?: string;

	gymId: string;

	title: string;
	description: string;
	isActive: boolean;

	createdBy?: string; // adminId or trainerId
}

// member diet 
export interface IMemberDiet extends Document {
	gymId: string;
	memberId: string;

	dietPlanId: string;
	startDate: date;
	endDate: date;
	customNotes: string;
	status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

// supplement
export interface ISupplement extends Document {
	_id?: string;

	gymId: string;
	
	name: string;
	price: string;
	stock: number;
	category: 'PROTEIN' | 'PRE_WORKOUT' | 'RECOVERY' | 'VITAMINS' | 'WEIGHT_LOSS',

	isActive: boolean;

}








