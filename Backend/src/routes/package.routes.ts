import { Router } from 'express'

import {
  createPackageController,
  getAllPackagesController,
  getPackageController,
  updatePackageController,
  deletePackageController
} from '@/controller/package.controller'
import { protectRoute } from '@/middleware/auth.middleware'

const packageRouter = Router()

// ---------------------------------------------------------------------------
// Permission matrix
//
//   Route                          admin   staff   member
//   ─────────────────────────────  ──────  ──────  ──────
//   POST   /                        ✔       ✘       ✘
//   GET    /                        ✔       ✔       ✔  (members see active only — enforced in service)
//   GET    /:packageId              ✔       ✔       ✔  (members see active only — enforced in service)
//   PUT    /:packageId              ✔       ✘       ✘
//   DELETE /:packageId              ✔       ✘       ✘
// ---------------------------------------------------------------------------

// POST /api/packages          – create a new package (admin only)
packageRouter.post('/', protectRoute, createPackageController)

// GET  /api/packages          – list all packages (role-filtered in service)
packageRouter.get('/', protectRoute, getAllPackagesController)

// GET  /api/packages/:packageId  – single package (role-filtered in service)
packageRouter.get('/:packageId', getPackageController)

// PUT  /api/packages/:packageId  – update a package (admin only)
packageRouter.put('/:packageId', updatePackageController)

// DELETE /api/packages/:packageId – delete a package (admin only)
packageRouter.delete('/:packageId', deletePackageController)

export default packageRouter
