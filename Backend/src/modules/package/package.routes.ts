import { Router } from 'express'
import * as PackageController from '@/modules/package/package.controller'
import { protectRoute } from '@/middleware/auth.middleware'
import { rbac } from '@/middleware/rbac.middleware'

const packageRouter = Router()

packageRouter.use(protectRoute)

packageRouter.post('/', rbac('admin'), PackageController.addPackage)
packageRouter.get('/', PackageController.getPackages)
packageRouter.get('/:_id', PackageController.getPackage)
packageRouter.put('/:_id', rbac('admin'), PackageController.updatePackage)
packageRouter.delete('/:_id', rbac('admin'), PackageController.deletePackage)
packageRouter.get('/packages-list', rbac('admin', 'member'), PackageController.getPackagesList)

export default packageRouter
