import { Types } from 'mongoose'
import { Bill } from '@/model/bill.model'
import { User } from '@/model/user.model'
import { Package } from '@/model/Package.model'
import ApiError from '@/utils/ApiError'
import { HTTPSTATUS } from '@/config/http.config'

// ============================================
// TYPES
// ============================================

interface CreateBillPayload {
  member: string
  package: string
  amount: number
  paymentDate?: string
  paymentMethod: 'cash' | 'card' | 'upi' | 'netbanking' | 'other'
  validFrom: string
  validUntil: string
  discount?: number
  taxAmount?: number
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
  remarks?: string
  createdBy: string // injected from req.user._id in controller
}

interface UpdateBillPayload {
  paymentMethod?: string
  status?: 'paid' | 'pending' | 'overdue' | 'cancelled'
  discount?: number
  taxAmount?: number
  remarks?: string
  paymentDate?: string
}

interface BillQueryFilters {
  status?: string
  paymentMethod?: string
  search?: string // searches billNumber
}

// ============================================
// HELPERS
// ============================================

const validateObjectId = (id: string, label = 'ID'): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${label}`, HTTPSTATUS.BAD_REQUEST)
  }
}

// BLL-20250201-A3K9
const generateBillNumber = (): string => {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BLL-${date}-${random}`
}

const computeFinalAmount = (amount: number, discount: number, taxAmount: number): number => {
  const final = amount - discount + taxAmount
  if (final < 0) {
    throw new ApiError(
      'Final amount cannot be negative. Check discount value.',
      HTTPSTATUS.BAD_REQUEST
    )
  }
  return Math.round(final * 100) / 100 // round to 2 decimal places
}

// Shared populate shape — used everywhere a bill is returned
const BILL_POPULATE = [
  { path: 'member', select: 'name email memberId phone' },
  { path: 'package', select: 'packageName price duration' },
  { path: 'createdBy', select: 'name email' }
]

// ============================================
// CREATE BILL (admin only)
// ============================================

export const createBill = async (payload: CreateBillPayload) => {
  // Validate all ObjectId references
  validateObjectId(payload.member, 'Member ID')
  validateObjectId(payload.package, 'Package ID')
  validateObjectId(payload.createdBy, 'Admin ID')

  // Verify member exists and is active
  const member = await User.findOne({ _id: payload.member, role: 'member' }).lean()
  if (!member) {
    throw new ApiError('Member not found', HTTPSTATUS.NOT_FOUND)
  }
  if (member.status !== 'active') {
    throw new ApiError(
      'Cannot create bill for an inactive or suspended member',
      HTTPSTATUS.BAD_REQUEST
    )
  }

  // Verify package exists and is active
  const pkg = await Package.findOne({ _id: payload.package, isActive: true }).lean()
  if (!pkg) {
    throw new ApiError('Package not found or is inactive', HTTPSTATUS.NOT_FOUND)
  }

  // Date validation
  const validFrom = new Date(payload.validFrom)
  const validUntil = new Date(payload.validUntil)
  if (validUntil <= validFrom) {
    throw new ApiError('Valid until date must be after valid from date', HTTPSTATUS.BAD_REQUEST)
  }

  // Compute amounts
  const discount = payload.discount ?? 0
  const taxAmount = payload.taxAmount ?? 0
  const finalAmount = computeFinalAmount(payload.amount, discount, taxAmount)

  // Generate unique bill number
  const billNumber = generateBillNumber()

  const bill = await Bill.create({
    billNumber,
    member: payload.member,
    package: payload.package,
    amount: payload.amount,
    paymentDate: payload.paymentDate || new Date(),
    paymentMethod: payload.paymentMethod,
    validFrom,
    validUntil,
    status: payload.status,
    discount,
    taxAmount,
    finalAmount,
    remarks: payload.remarks,
    createdBy: payload.createdBy
  })

  // Return with populated refs
  const created = await Bill.findById(bill._id).populate(BILL_POPULATE).lean()

  return {
    success: true,
    message: 'Bill created successfully',
    data: created
  }
}

// ============================================
// GET ALL BILLS (admin — across all members)
// ============================================

export const getAllBills = async (filters: BillQueryFilters = {}) => {
  const query: any = {}

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.paymentMethod) {
    query.paymentMethod = filters.paymentMethod
  }

  if (filters.search) {
    const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    query.billNumber = new RegExp(escaped, 'i')
  }

  const [bills, total] = await Promise.all([
    Bill.find(query).populate(BILL_POPULATE).sort({ createdAt: -1 }).lean(),
    Bill.countDocuments(query)
  ])

  return {
    success: true,
    message: total > 0 ? 'Bills retrieved successfully' : 'No bills found',
    data: { bills, total }
  }
}

// ============================================
// GET MEMBER BILLS (admin sees any member, member sees own only)
// ============================================

export const getMemberBills = async (
  requesterId: string,
  requesterRole: string,
  targetMemberId: string,
  filters: BillQueryFilters = {}
) => {
  validateObjectId(targetMemberId, 'Member ID')

  // Members can only fetch their own bills
  if (requesterRole === 'member' && requesterId !== targetMemberId) {
    throw new ApiError(
      'Access denied. Members can only view their own bills.',
      HTTPSTATUS.FORBIDDEN
    )
  }

  // Verify target member exists
  const member = await User.exists({ _id: targetMemberId, role: 'member' })
  if (!member) {
    throw new ApiError('Member not found', HTTPSTATUS.NOT_FOUND)
  }

  const query: any = { member: targetMemberId }

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.paymentMethod) {
    query.paymentMethod = filters.paymentMethod
  }

  if (filters.search) {
    const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    query.billNumber = new RegExp(escaped, 'i')
  }

  const [bills, total] = await Promise.all([
    Bill.find(query).populate(BILL_POPULATE).sort({ createdAt: -1 }).lean(),
    Bill.countDocuments(query)
  ])

  return {
    success: true,
    message: total > 0 ? 'Bills retrieved successfully' : 'No bills found',
    data: { bills, total }
  }
}

// ============================================
// GET SINGLE BILL (admin sees any, member sees own only)
// ============================================

export const getBill = async (requesterId: string, requesterRole: string, billId: string) => {
  validateObjectId(billId, 'Bill ID')

  const bill = await Bill.findById(billId).populate(BILL_POPULATE).lean()

  if (!bill) {
    throw new ApiError('Bill not found', HTTPSTATUS.NOT_FOUND)
  }

  // Members can only view their own bills
  if (requesterRole === 'member' && bill.member._id.toString() !== requesterId) {
    throw new ApiError(
      'Access denied. Members can only view their own bills.',
      HTTPSTATUS.FORBIDDEN
    )
  }

  return {
    success: true,
    message: 'Bill retrieved successfully',
    data: bill
  }
}

// ============================================
// UPDATE BILL (admin only)
// ============================================

export const updateBill = async (billId: string, payload: UpdateBillPayload) => {
  validateObjectId(billId, 'Bill ID')

  const bill = await Bill.findById(billId).lean()
  if (!bill) {
    throw new ApiError('Bill not found', HTTPSTATUS.NOT_FOUND)
  }

  // If status is cancelled, block further updates
  if (bill.status === 'cancelled') {
    throw new ApiError('Cannot update a cancelled bill', HTTPSTATUS.BAD_REQUEST)
  }

  // Recompute finalAmount if any amount field changes
  const amount = bill.amount
  const discount = payload.discount ?? bill.discount ?? 0
  const taxAmount = payload.taxAmount ?? bill.taxAmount ?? 0
  const finalAmount = computeFinalAmount(amount, discount, taxAmount)

  const updated = await Bill.findByIdAndUpdate(
    billId,
    {
      $set: {
        ...payload,
        discount,
        taxAmount,
        finalAmount
      }
    },
    { new: true, runValidators: true }
  )
    .populate(BILL_POPULATE)
    .lean()

  return {
    success: true,
    message: 'Bill updated successfully',
    data: updated
  }
}

// ============================================
// DELETE BILL (admin only — hard delete)
// ============================================

export const deleteBill = async (billId: string) => {
  validateObjectId(billId, 'Bill ID')

  const bill = await Bill.findById(billId).lean()
  if (!bill) {
    throw new ApiError('Bill not found', HTTPSTATUS.NOT_FOUND)
  }

  // Only allow deletion of pending or cancelled bills — paid bills are financial records
  if (bill.status === 'paid') {
    throw new ApiError(
      'Cannot delete a paid bill. Update status to cancelled first.',
      HTTPSTATUS.BAD_REQUEST
    )
  }

  await Bill.findByIdAndDelete(billId)

  return {
    success: true,
    message: 'Bill deleted successfully',
    data: { deletedId: billId }
  }
}
