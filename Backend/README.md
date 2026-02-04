## Gym Management System API (Node.js + TypeScript)

A scalable gym management backend built with Node.js and TypeScript.
It supports role-based access (Admin, Staff, Member), authentication,
membership management, billing, and notifications using a modular
architecture and clean coding practices.

## Features
- Role-based access control (Admin, Staff, Member)
- Secure authentication with JWT
- Modular architecture (controller, service, route pattern)
- Centralized error handling and validation
- Environment-based configuration
- Scalable and maintainable folder structure

## Tech Stack
- Node.js
- TypeScript
- Express.js
- JWT Authentication
- ESLint + Prettier
- MongoDB 
- zod validation
- jest testing 

Backend/
├── src/
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── db.config.ts
│   │   └── http.config.ts
│   │
│   ├── middleware/
│   │   ├── asyncHandler.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.routes.ts
│   │   │   ├── admin.services.ts
│   │   │   └── admin.validate.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.services.ts
│   │   │   ├── auth.types.ts
│   │   │   └── auth.validate.ts
│   │   │
│   │   ├── member/
│   │   │   ├── member.controller.ts
│   │   │   ├── member.routes.ts
│   │   │   ├── member.services.ts
│   │   │   ├── member.types.ts
│   │   │   └── member.validate.ts
│   │   │
│   │   ├── model/
│   │   │   ├── bill.model.ts
│   │   │   ├── feePackage.model.ts
│   │   │   ├── model.types.ts
│   │   │   ├── notification.model.ts
│   │   │   ├── supplement.model.ts
│   │   │   └── user.model.ts
│   │   │
│   │   └── staff/
│   │       ├── staff.controller.ts
│   │       ├── staff.routes.ts
│   │       ├── staff.services.ts
│   │       ├── staff.types.ts
│   │       └── staff.validate.ts  
│   │
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── getEnv.ts
│   │   └── jwt.utils.ts
│   │
│   └── server.ts
│
├── .env
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

## Installation

```bash
git clone <Repo_URL>
cd Gym_Mangement_System\Backend
npm install
```

## Run Project
```bash
npm run dev
```

```md
Create a `.env` file and add required environment variables.
```
## Environment Variables
- MONGO_URI=YOUR_MONGO_URI
- JWT_SECRET=YOUR_JWT_SECRET
- JWT_EXPIRES=YOUR_JWT_EXPIRES
- FRONTEND_ORIGIN=http://localhost:3000
- PORT=LOCALHOST_PORT
- BCRYPT_SALT=YOUR_BCRYPT_SALT

## Api EndPoints
- admin
POST /api/v1/
GET /api/v1/

## Why This Project?
This project demonstrates real-world backend practices such as
modular design, role-based authorization, secure authentication,
and clean error handling suitable for production environments.
