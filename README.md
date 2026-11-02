# 🎫 Ticketing & Email Support System

A full-stack customer support and ticket management platform built using the MERN stack. It allows customers to create and track support tickets, support agents to manage and respond to tickets, and administrators to manage support operations.

## 🚀 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Nodemailer

## 👥 User Roles

### Customer
- Register and log in.
- Verify email using OTP.
- Create support tickets.
- View and track personal tickets.
- Reply to tickets.
- Close and reopen eligible tickets.

### Support Agent
- View assigned tickets.
- Respond to customer queries.
- Add internal notes.
- Update ticket status and priority.
- Resolve and reopen tickets.

### Admin
- View and manage all tickets.
- Assign and reassign tickets.
- Manage users and support agents.
- Monitor ticket activity.
- View dashboard statistics.

## ✨ Key Features

- Role-based authentication and authorization.
- Email OTP verification.
- Forgot and reset password.
- JWT-based authentication.
- Ticket creation and management.
- Ticket assignment and reassignment.
- Ticket conversation system.
- Internal notes for support staff.
- Ticket activity history.
- Priority and status management.
- Dashboard statistics.
- Responsive user interface.
- Email notification integration.

## 📁 Project Structure

```text
SupportDesk/
│
├── Backend/
│   ├── Src/
│   │   ├── Config/
│   │   ├── Controller/
│   │   ├── Models/
│   │   ├── Routes/
│   │   ├── Middleware/
│   │   ├── Repository/
│   │   ├── Service/
│   │   ├── Seed/
│   │   │   └── createAdmin.js
│   │   └── utils/
│   ├── scripts/
│   ├── .env.example
│   └── package.json
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── store/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

*Folder names may vary depending on your existing project structure.*

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/manish-Raghav/Ticketing-Email-Support-System.git
```

```bash
cd Ticketing-Email-Support-System
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file using `.env.example`.

Configure the following environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Add all other environment variables required by your backend configuration.

### 3. Create the First Admin Account

The first Admin account is created using a secure seed script.

Public registration does not allow users to register as Admin. The initial Admin must be created manually by the company during project setup.

Add the following variables to your `Backend/.env` file:

```env
ADMIN_NAME=Company Admin
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=YourStrongTemporaryPassword123!
```

Use your own Admin details and a strong password. Never commit your `.env` file to GitHub.

Run the following command from the `Backend` directory:

```bash
npm run seed:admin
```

If successful, you should see:

```text
MongoDB connected
Admin created successfully!
Admin Email: admin@yourcompany.com
Admin ID: ...
```

The first Admin can now log in using the configured email and password.

**Important Security Notes:**
- Run the Admin seed command only when creating the initial Admin account.
- The script will not create another account if the email already exists.
- Public users cannot select the Admin role during registration.
- Admin accounts should be created through a secure administrative process.
- Change the temporary Admin password after the first login.

### 4. Start the Backend

```bash
npm run dev
```

### 5. Frontend Setup

Open another terminal:

```bash
cd FrontEnd
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## 🔗 API Modules

| Module | Description |
|---|---|
| Authentication | Registration, login, OTP and password reset |
| Tickets | Ticket creation and management |
| Messages | Customer and agent conversations |
| Categories | Ticket categories |
| Dashboard | Ticket statistics |
| Email | Email notifications and inbound webhook adapter |
| Admin | User and agent management |

## 🔐 Security

- Password hashing with bcryptjs.
- JWT authentication.
- Role-based access control.
- CORS configuration.
- Helmet security headers.
- API rate limiting.
- Environment-based secrets.
- Restricted public Admin registration.

## 🚧 Future Improvements

- Complete two-way email integration using IMAP or provider webhooks.
- Refresh-token rotation and session management.
- Phone OTP authentication.
- Real-time notifications using Socket.IO.
- File attachment uploads.
- Redis and BullMQ background email processing.
- Swagger API documentation.
- Automated testing.

## 👨‍💻 Author

**Manish Kumar**

Software Developer

GitHub: https://github.com/manish-Raghav

---

⭐ If you find this project useful, consider giving it a star!
