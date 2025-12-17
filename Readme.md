# Gym Management System

This is the backend for a Gym Management System. It includes modules for members, billing, diet plans, supplements, notifications, and reports. Role-based access control ensures proper authorization for Admins and Members.

---

## **Table of Contents**

1. [Diet Module](#diet-module)
2. [Supplement Module](#supplement-module)
3. [Report Module](#report-module)
4. [Notification Module](#notification-module)
5. [Member Module](#member-module)
6. [Bill Module](#bill-module)
7. [Role-Based Access](#role-based-access)

---

## **Diet Module**

| Method | Endpoint                     | Role   | Description                                    |
| ------ | ---------------------------- | ------ | ---------------------------------------------- |
| POST   | `/api/diet/create`           | ADMIN  | Create a new diet plan for members.            |
| GET    | `/api/diet/member/:memberId` | MEMBER | Fetch diet plan assigned to a specific member. |
| PUT    | `/api/diet/:id`              | ADMIN  | Update an existing diet plan.                  |

---

## **Supplement Module**

| Method | Endpoint              | Role           | Description                         |
| ------ | --------------------- | -------------- | ----------------------------------- |
| POST   | `/api/supplement/`    | ADMIN          | Add a new supplement to the store.  |
| GET    | `/api/supplement/`    | ADMIN / MEMBER | Fetch all active supplements.       |
| GET    | `/api/supplement/:id` | ADMIN / MEMBER | Get details of a single supplement. |
| PUT    | `/api/supplement/:id` | ADMIN          | Update supplement information.      |
| DELETE | `/api/supplement/:id` | ADMIN          | Remove a supplement from the store. |

---

## **Report Module**

| Method | Endpoint                                              | Role  | Description                                               |
| ------ | ----------------------------------------------------- | ----- | --------------------------------------------------------- |
| GET    | `/api/reports/revenue?startDate=&endDate=&format=csv` | ADMIN | Fetch revenue report for a date range. Can export as CSV. |

---

## **Notification Module**

| Method | Endpoint                      | Role   | Description                                  |
| ------ | ----------------------------- | ------ | -------------------------------------------- |
| POST   | `/api/notification/create`    | ADMIN  | Create a custom notification for any member. |
| GET    | `/api/notification/:memberId` | MEMBER | Get all notifications for a member.          |
| GET    | `/api/notification/read/:id`  | MEMBER | Mark a notification as read.                 |

---

## **Member Module**

| Method | Endpoint                  | Role  | Description                       |
| ------ | ------------------------- | ----- | --------------------------------- |
| POST   | `/api/member/`            | ADMIN | Create a new member (admin-only). |
| GET    | `/api/member/all-members` | ADMIN | Fetch all registered members.     |

---

## **Bill Module**

| Method | Endpoint               | Role   | Description                 |
| ------ | ---------------------- | ------ | --------------------------- |
| POST   | `/api/bills/`          | ADMIN  | Create a bill for a member. |
| GET    | `/api/bills/:memberId` | MEMBER | Get all bills for a member. |
| PATCH  | `/api/bills/:id`       | ADMIN  | Update bill status.         |

---

## **Role-Based Access**

- **protectRoute**: Ensures the user is authenticated.
- **authorizeRoles(UserRole.X)**: Restricts access to a specific role (`ADMIN`, `MEMBER`, `USER`).
- **Validation Middleware**: Ensures API request payloads are correct using Zod schemas.

---

## **Usage**

- Base URL: `/api/`
- All routes are prefixed with `/api` and are protected by authentication middleware.

---

## **Example**

Create a member (Admin only):

```bash
POST /api/member/
Content-Type: application/json
Authorization: Bearer <ADMIN_TOKEN>

{
  "user": "6933e2a485f06b64ed3d45b1",
  "fullName": "John Member",
  "phone": "9876543210",
  "age": 25
}
```
