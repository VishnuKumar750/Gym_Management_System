# Gym Management System

Gym Management System is a dashboard-oriented web application that helps gym owners, staff, and members manage memberships, billing, diets, supplements, and notifications online. The system supports analytics, report exports, and invoice downloads with role-based access control. report export and bill invoice download. 

## Features

1. Role-based access control (Admin, Staff, Member)
2. Create and manage members, staff, and admins
3. Assign and manage fee packages
4. Bill generation with invoice download
5. Staff access to member records
6. Analytics dashboard for Admin, Staff, and Members
7. Notification reminders for members
8. Supplement store (add, view, update, delete)
9. Export reports (CSV / PDF)

## Tech Stack

• Frontend: React, TypeScript, Vite

• Backend: Node.js, Express, TypeScript

• Database: MongoDB

• Authentication: JWT

• State / Data Fetching: React Query

• form validation - zod validation

• Styling: Tailwindcss / ShadcnUI components


## Project Structure
#### Backend
```text
Backend/
├── src/
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── db.config.ts
│   │   ├── http.config.ts
│   ├── middleware/
│   │   ├── asyncHandler.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── morganLogger.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── bill/
│   │   ├── diet/
│   │   ├── notification/
│   │   ├── package/
│   │   ├── supplement/
│   │   ├── user/
│   ├── seed/
│   │   ├── seed-admin.ts
│   ├── utils/
│   ├── server.ts
│── .env
│── .prettierignore
│── .prettierrc
│── .eslint.config.js
│── package.json
│── package-lock.json

```
#### Client
```text
client/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── axios/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── App.css
├── .env
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts

```

## Installation & Setup

clone the repository

```bash
git clone https://github.com/VishnuKumar750/Gym_Management_System.git
cd Gym_Management_System
```

#### Backend Setup
```bash
cd Backend
```

##### create .env file 
```bash 
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_jwt_expires

FRONTEND_ORIGIN=http://localhost:5173
LOCAL_HOST=http://localhost:5173
LOCAL_HOST_PRODUCTION=http://localhost:4173
```

## Install & run 
```bash 
npm install
npm run dev
```

##### Backend runs on:
```bash

http://localhost:4000

```
## Client Setup
```bash 
cd client
```

#### create .env file 
```bash

LOCAL_BACKEND_URL=http://localhost:4000/api/v1
PRODUCTION_BACKEND_URL=your_production_backend_url

```

## Install & run
```bash 
npm install
npm run dev
```


##### Frontend runs on:
```bash

http://localhost:5173

```

## Contributing

Contributions are welcome.
Please open an issue for major changes before submitting a pull request.

Ensure code quality and tests are updated where applicable.

## License

This project is open-source and available under the MIT License.
