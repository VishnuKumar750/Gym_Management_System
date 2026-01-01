// gym interface for gym_sass_service_db_design
exoprt interface IGym {
	gymName: string;
	gymCode: string;

	address: string;
	email: string;
	phone?: string;
	password: string;

	subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM';
	subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
	subscriptionExpiry?: Date;

	paymentProvider?: string;
	lastPayment?: string;

	isActive: boolean;

	payment_history: [
		{
			paymentId: string;
			amount: number;
			currency: string;
			provider: 'RAZORPAY' | 'STRIPE';
			plan: 'FREE' | 'BASIC' | 'PREMIUM',
			status: 'SUCCESS' | 'FAILED';
			paidAt: Date, 
		}
	];
	
}