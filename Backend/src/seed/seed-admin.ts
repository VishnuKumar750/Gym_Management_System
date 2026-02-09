import bcrypt from 'bcryptjs'
import User from '@/modules/user/user.model'

export const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD not set')
  }

  const existingAdmin = await User.findOne({
    email: adminEmail,
    role: 'admin'
  })

  if (existingAdmin) {
    console.log('Admin already exists')
    return
  }

  const user = new User({
    name: 'Super Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    phone: '1234567890'
  })

  await user.save()
  console.log('Admin seeded successfully')
}
