import { Schema, model } from 'mongoose';
import { IGym } from '../types/Gym.types'
import bcrypt from 'bcrypt '

// payment history schema for gym service payment details
const PaymentHistorySchema = new Schema({
	paymentId: { type: String, required: true },
	amount: { type: Number, required: true },
	currency: { type: String, default: 'INR' },
	provider: { type: String, enum: ['RAZORPAY', 'STRIPE'], required: true },
	plan: { type: String, enum: ['FREE', 'BASIC', 'PREMIUM'] },
	status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
	paidAt: { type: Date, default: Date.now }
}, { _id: false })

// gym schema for gym owners who want this service
const Gym_Schema = new Schema<IGym>({
	gymName: { type: String, required: true, minlength: 3, maxlength: 50 },
	gymCode: { type: String, required: true, unique: true },
	email: { type: String, required: true , unique: true },
	password: { type: String, required: true },
	address: { type: String, required: true },
	phone: { type: String },
	subscriptionPlan: { type: String,
	 enum: ['FREE', 'BASIC', 'PREMIUM'],
	 default: 'FREE' },
	subscriptionStatus: { type: String, enum: ['ACTIVE', 'EXPIRED', 'SUSPENDED'],
	 default: 'ACTIVE' },
	paymentProvider: { type: String, enum: [ 'RAZORPAY', 'STRIPE'] },
	lastPayment: { type: String },
 
	isActive: { type: Boolean, default: true },
	payment_history: {
		type: [PaymentHistorySchema],
		default: []
	}
}, {
	timestamps: true
})

// iondexing 
Gym_Schema.index({ gymCode: 1 })
Gym_Schema.index({ email: 1 })
Gym_Schema.index({ isActive: 1 })
Gym_Schema.index({ subscriptionStatus: 1 })


// compare password - input password, saved password
Gym_Schema.methods.comparePassword = async function ( password: string ) {
	return bcrypt.compare(password, this.password);
}

Gym_Schema.pre('save', async function (next)  {
	if(!this.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
})

export const Gym_Model = model<IGym> ("Gym", Gym_Schema); 
export default Gym_Model;