import { Request, Response } from 'express'
import asyncHandler from '@/middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '@/config/http.config'
import { computeFinalAmount, generateBillNumber, validateObjectId } from '@/utils/helper.util'
import User from '@/modules/user/user.model'
import { Package } from '@/modules/package/Package.model'
import { Bill } from '@/modules/bill/bill.model'

// ADD BILL
export const addBill = asyncHandler(async (req: Request, res: Response) => {
  // admin id
  const { id } = req.user as { id?: string }
  if (!id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'admin id is required' })
  }
  validateObjectId(id, 'admin')

  const { memberId, packageId, paymentDate, paymentMethod, discount, taxAmount, status, remarks } =
    req.body
  validateObjectId(packageId, 'package')

  const packagedata = await Package.findOne({ _id: packageId })
  if (!packagedata) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({
      success: false,
      error: 'package not found'
    })
  }
  const user = await User.exists({ _id: memberId })
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({
      success: false,
      error: 'member not found'
    })
  }
  const billNumber = generateBillNumber()
  const finalAmount = computeFinalAmount(packagedata.price, discount, taxAmount)

  if (finalAmount < 0) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'final amount is less than 0' })
  }

  if (status === 'paid') {
    if (!paymentDate || isNaN(Date.parse(paymentDate))) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'valid payment date is required when payment done' })
    }
    if (!paymentMethod) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'payment method is required when payment done' })
    }
  }

  const bill = new Bill({
    billNumber,
    memberId,
    createdBy: id,
    packageId,
    amount: packagedata.price,
    paymentDate: status !== 'paid' ? null : new Date(paymentDate),
    paymentMethod: status !== 'paid' ? null : paymentMethod,
    status,
    discount,
    taxAmount,
    finalAmount,
    remarks
  })

  await bill.save()
  res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'bill created', data: bill })
})

// UPDATE BILL
export const updateBill = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'bill id is required' })
  validateObjectId(_id)

  const { id } = req.user as { id?: string }
  if (!id)
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'admin id is required' })
  validateObjectId(id)

  const existing = await Bill.findById(_id)
  if (!existing)
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'bill not found' })

  // payement method and status
  const { paymentMethod, status, paymentDate } = req.body

  if (typeof status !== 'string') {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'status is required' })
  }

  const updateBill: Record<string, any> = {
    status
  }

  if (status === 'paid') {
    if (typeof paymentMethod !== 'string') {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'valid paymentMethod is required when payment is made' })
    }
    if (typeof paymentDate !== 'string' || isNaN(Date.parse(paymentDate))) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'valid paymentDate is required when payment is made' })
    }
    updateBill.paymentMethod = paymentMethod
    updateBill.paymentDate = new Date(paymentDate)
  }

  const bill = await Bill.findByIdAndUpdate(
    _id,
    { $set: updateBill },
    { new: true, runValidators: true }
  )

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'bill updated', data: bill })
})

// GET BILLS
export const getBills = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string }

  const allowedStatus = ['pending', 'paid', 'overdue']
  const query: Record<string, any> = {}
  if (status) {
    if (!allowedStatus.includes(status)) {
      return res
        .status(HTTPSTATUS.BAD_REQUEST)
        .json({ success: false, error: 'invalid status code' })
    } else {
      query.status = status
    }
  }

  const bills = await Bill.find(query)
    .populate('memberId', '_id name memberId email phone')
    .populate('packageId', '_id packageName')
    .sort({ createdAt: -1 })
    .lean()

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: 'bills fetched',
    data: bills
  })
})

// GET MEMBER BILL
export const getMemberBills = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as { id?: string }
  if (!id) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ success: false, error: 'member id is required' })
  }
  validateObjectId(id, 'member id')

  const member = await User.findById({ _id: id }).lean()
  if (!member)
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'member not foudn' })

  const bills = await Bill.find({ memberId: member._id })
    .populate('packageId', '_id packageName')
    .sort({ createdAt: -1 })
    .lean()

  res.status(HTTPSTATUS.OK).json({ success: true, message: 'member bills', data: bills })
})

// GET BILL
export const getBill = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params as { _id?: string }
  if (!_id) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ success: false, error: 'bill id is required' })
  }
  validateObjectId(_id)

  const bill = await Bill.findById(_id)
    .populate('memberId', '_id name email phone')
    .populate('packageId', '_id packageName price')
    .lean()

  if (!bill) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ success: false, error: 'bill not found' })
  }
  res.status(HTTPSTATUS.OK).json({ success: true, message: 'bill fetched', data: bill })
})
