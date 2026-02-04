import { Request, Response, NextFunction } from 'express'
import {
  createBill,
  getAllBills,
  getMemberBills,
  getBill,
  updateBill,
  deleteBill
} from '@/service/bill.service'
import { HTTPSTATUS } from '@/config/http.config'

// ============================================
// CREATE BILL (admin only)
// ============================================

export const createBillController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?.id // inject authenticated admin's ID
    }
    const result = await createBill(payload)
    res.status(HTTPSTATUS.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// GET ALL BILLS (admin only)
// ============================================

export const getAllBillsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      paymentMethod: req.query.paymentMethod as string | undefined,
      search: req.query.search as string | undefined
    }
    const result = await getAllBills(filters)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// GET MEMBER BILLS (admin | member-self)
// ============================================

export const getMemberBillsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      paymentMethod: req.query.paymentMethod as string | undefined,
      search: req.query.search as string | undefined
    }
    const result = await getMemberBills(
      req.user?.id, // requesterId
      req.user?.role, // requesterRole — service uses this for ownership check
      req.params.memberId,
      filters
    )
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// GET SINGLE BILL (admin | member-self)
// ============================================

export const getBillController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getBill(
      req.user?.id, // requesterId
      req.user?.role, // requesterRole
      req.params.id // billId
    )
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// UPDATE BILL (admin only)
// ============================================

export const updateBillController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateBill(req.params.id, req.body)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}

// ============================================
// DELETE BILL (admin only)
// ============================================

export const deleteBillController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteBill(req.params.id)
    res.status(HTTPSTATUS.OK).json(result)
  } catch (err) {
    next(err)
  }
}
