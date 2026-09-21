# MEDICONSULT: Doctor Consultation & Medical Guidance System
### Production-Ready Node.js / Express Backend Architecture

MediConsult is a secure, decoupled REST API backend designed for modern healthcare platforms. It provides automated AI-assisted symptom guidance using Google's `gemini-3.5-flash-lite` model, physician discovery with slot scheduling, conflict-free appointment booking, user medical history, notifications, and role-based administration.

---

## 1. Features

- **Decoupled Architecture**: Standalone Express.js server consumable by any frontend (React, React Native, Vue, Next.js).
- **JWT Authentication & Authorization**: Token-based security with bcrypt password hashing, input sanitization, and role-based access control (`user`, `doctor`, `admin`).
- **AI Symptom Analysis (`gemini-3.5-flash-lite`)**:
  - Isolated AI service layer communicating with Google Gemini API.
  - Strict medical safety guards: **never** diagnoses, **never** prescribes drugs or dosages, always frames findings as "possible causes", and flags emergency alerts.
  - Runtime validation & safe fallback engine prevents malformed AI outputs from reaching the client.
- **Doctor Catalog & Availability**:
  - Filter by specialization, availability, and keyword search.
  - Granular slot management (`isBooked` status per date/time slot).
- **Double-Booking & Race Condition Protection**:
  - Concurrency-safe booking logic using MongoDB compound indices and atomic slot status updates.
- **Auditable Medical Records**: Automatic logging of symptom evaluations and doctor consultations to personal medical history.
- **In-App Notification Dispatcher**: Automatic notifications for bookings, cancellations, rescheduling, and critical health alerts.
- **Admin Dashboard & Management**: Real-time aggregated metrics across users, appointments, doctors, and checks.

---

## 2. Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.x (CommonJS)
- **Database**: MongoDB (Atlas or Local) via Mongoose 8.x
- **AI Engine**: Google Gemini API (`gemini-3.5-flash-lite`) via official `@google/genai` SDK
- **Security**: Helmet, CORS, bcryptjs, JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Logging**: Morgan

---

## 3. Directory Structure

```
backend/
│
├── config/
│   ├── db.js                     # Mongoose connection with error handling
│   └── env.js                    # Centralized environment variable accessor
│
├── controllers/
│   ├── authController.js         # Register, login, logout, me, password reset
│   ├── userController.js         # Profile and consolidated dashboard
│   ├── symptomController.js      # Symptom analysis and history
│   ├── doctorController.js       # Doctor listings, profiles, slots
│   ├── appointmentController.js  # Booking, rescheduling, cancel, status
│   ├── medicalHistoryController.js # Medical history access and deletion
│   ├── notificationController.js # In-app notifications
│   └── adminController.js        # Admin metrics and doctor management
│
├── middleware/
│   ├── authMiddleware.js         # Bearer token verification (protect)
│   ├── roleMiddleware.js         # Role check (user, doctor, admin)
│   ├── errorMiddleware.js        # Centralized error handler
│   ├── notFoundMiddleware.js     # 404 handler
│   └── validationMiddleware.js   # express-validator result handler
│
├── models/
│   ├── User.js                   # Patient, Doctor, Admin account schema
│   ├── Doctor.js                 # Doctor profile & availability calendar
│   ├── SymptomCheck.js           # AI symptom assessment records
│   ├── Appointment.js            # Booking records with unique compound index
│   ├── MedicalHistory.js         # User health timeline
│   └── Notification.js           # User notification records
│
├── routes/
│   ├── authRoutes.js             # /api/auth
│   ├── userRoutes.js             # /api/users
│   ├── symptomRoutes.js          # /api/symptoms
│   ├── doctorRoutes.js           # /api/doctors
│   ├── appointmentRoutes.js      # /api/appointments
│   ├── medicalHistoryRoutes.js   # /api/medical-history
│   ├── notificationRoutes.js     # /api/notifications
│   └── adminRoutes.js            # /api/admin
│
├── services/
│   ├── aiService.js              # Gemini API caller, prompt & schema validator
│   ├── symptomService.js         # Symptom assessment business logic
│   ├── appointmentService.js     # Booking & concurrency logic
│   └── notificationService.js    # Notification persistence & queries
│
├── validators/
│   ├── authValidator.js          # Auth input rules
│   ├── symptomValidator.js       # Symptom array and severity rules
│   ├── appointmentValidator.js   # Booking rules
│   └── userValidator.js          # User profile update rules
│
├── utils/
│   ├── asyncHandler.js           # Promise resolution wrapper
│   ├── generateToken.js          # JWT generator
│   └── apiResponse.js            # Standardized API response format
│
├── seed/
│   └── doctorSeed.js             # 10 fictional doctors & admin seeder
│
├── .env                          # Local environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Ignored artifacts
├── package.json                  # Scripts and dependencies
├── server.js                     # Express app setup and listener
└── README.md                     # Documentation & API Contract
```

---

## 4. Prerequisites & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cluster
- **Google Gemini API Key**: Free key from Google AI Studio

### Installation
1. Navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy environment template to `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 5. Environment & Service Setup

### 5.1 MongoDB Atlas Setup
1. Create a free account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free **M0 Sandbox** cluster.
3. In **Database Access**, create a database user (e.g., `mediconsult_user`) with read/write privileges.
4. In **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) or your current IP.
5. Click **Connect** -> **Drivers** -> **Node.js** to obtain your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mediconsult?retryWrites=true&w=majority
   ```
6. Paste into your `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mediconsult?retryWrites=true&w=majority
   ```

### 5.2 Google Gemini API Key Setup
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Get API key** and create a key in your project.
3. In `backend/.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   GEMINI_MODEL=gemini-3.5-flash-lite
   ```

---

## 6. Running the Server

### Seed Demo Data (10 Doctors + 1 Admin)
Run the automated seed script to populate doctors with next 7-day schedule slots and create default administrator:
```bash
npm run seed
```
*Default Admin Credentials:*
- Email: `admin@mediconsult.local`
- Password: `AdminPassword123!`

### Start in Development Mode (Live reload)
```bash
npm run dev
```

### Start in Production Mode
```bash
npm start
```
The server will bind to `http://localhost:5000` (or `PORT` specified in `.env`).

---

## 7. Frontend Integration Contract

### Base API URL
```
http://localhost:5000/api
```

### Authentication Header
For all protected endpoints, the React frontend must include:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Unified Response Formats

#### Success Response (200 / 201)
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

#### Error Response (400 / 401 / 403 / 404 / 409 / 500)
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

---

## 8. Complete API Documentation

### 8.1 Authentication Endpoints (`/api/auth`)

#### 1. Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "Password123!",
    "dateOfBirth": "1995-06-15",
    "gender": "male",
    "phone": "+15551234567"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "660c1d2e...",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "role": "user",
        "dateOfBirth": "1995-06-15",
        "gender": "male",
        "phone": "+15551234567"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Error Response (409 Conflict / 400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "An account with this email already exists",
    "errors": []
  }
  ```

#### 2. Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "660c1d2e...",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "errors": []
  }
  ```

#### 3. Logout User
- **Method**: `POST`
- **URL**: `/api/auth/logout`
- **Auth Required**: No
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully",
    "data": {}
  }
  ```

#### 4. Get Current User (`/me`)
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Current user retrieved",
    "data": {
      "user": {
        "_id": "660c1d2e...",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "role": "user"
      }
    }
  }
  ```

#### 5. Forgot Password
- **Method**: `POST`
- **URL**: `/api/auth/forgot-password`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "alex@example.com"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password reset token generated",
    "data": {
      "resetToken": "a3f890e...",
      "expiresIn": "30 minutes"
    }
  }
  ```

#### 6. Reset Password
- **Method**: `POST`
- **URL**: `/api/auth/reset-password`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "a3f890e...",
    "newPassword": "NewSecurePassword123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password has been successfully reset",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

---

### 8.2 User & Profile Endpoints (`/api/users`)

#### 1. Get User Profile
- **Method**: `GET`
- **URL**: `/api/users/profile`
- **Auth Required**: Yes

#### 2. Update User Profile
- **Method**: `PUT`
- **URL**: `/api/users/profile`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "phone": "+1 (555) 987-6543",
    "basicHealthInfo": {
      "bloodGroup": "O+",
      "allergies": ["Penicillin", "Peanuts"],
      "chronicConditions": ["Asthma"],
      "height": 178,
      "weight": 72
    }
  }
  ```

#### 3. Change Password
- **Method**: `PUT`
- **URL**: `/api/users/change-password`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "currentPassword": "Password123!",
    "newPassword": "BrandNewPassword123!"
  }
  ```

#### 4. Get User Consolidated Dashboard
- **Method**: `GET`
- **URL**: `/api/users/dashboard`
- **Auth Required**: Yes
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Dashboard data loaded successfully",
    "data": {
      "user": {},
      "upcomingAppointment": null,
      "recentSymptomChecks": [],
      "recentMedicalHistory": [],
      "unreadNotifications": []
    }
  }
  ```

---

### 8.3 AI Symptom Checker (`/api/symptoms`)

#### 1. Analyze Symptoms (Powered by `gemini-3.5-flash-lite`)
- **Method**: `POST`
- **URL**: `/api/symptoms/analyze`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "symptoms": ["fever", "cough", "sore throat", "headache"],
    "duration": "1-3 days",
    "severity": "moderate"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Symptom analysis completed successfully",
    "data": {
      "_id": "6612b7a9...",
      "user": "660c1d2e...",
      "symptoms": ["fever", "cough", "sore throat", "headache"],
      "duration": "1-3 days",
      "severity": "moderate",
      "possibleCauses": [
        "Common Cold",
        "Seasonal Influenza",
        "Acute Viral Pharyngitis"
      ],
      "urgencyLevel": "moderate",
      "generalGuidance": [
        "Ensure adequate hydration with warm fluids and electrolyte solutions.",
        "Get plenty of physical rest to support immune recovery.",
        "Monitor your body temperature regularly.",
        "Consider consulting a doctor if fever persists beyond 3 days."
      ],
      "doctorRecommendation": true,
      "urgentWarning": null,
      "createdAt": "2026-09-21T06:50:00.000Z"
    }
  }
  ```

#### 2. Get Symptom Check History
- **Method**: `GET`
- **URL**: `/api/symptoms/history?page=1&limit=10`
- **Auth Required**: Yes

#### 3. Get Symptom Check by ID
- **Method**: `GET`
- **URL**: `/api/symptoms/:id`
- **Auth Required**: Yes (Private to owning user)

---

### 8.4 Doctors & Slots (`/api/doctors`)

#### 1. Get Doctor Directory
- **Method**: `GET`
- **URL**: `/api/doctors`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search name, qualification, specialization
  - `specialization`: e.g. `Cardiologist`, `General Physician`
  - `available`: `true` or `false`
- **Example**:
  `GET /api/doctors?specialization=Cardiologist&available=true`

#### 2. Get Doctor Details
- **Method**: `GET`
- **URL**: `/api/doctors/:id`

#### 3. Get Doctor Availability Calendar
- **Method**: `GET`
- **URL**: `/api/doctors/:id/availability`

#### 4. Get Doctor Slots for a Given Date
- **Method**: `GET`
- **URL**: `/api/doctors/:id/slots?date=2026-09-25`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Slots for 2026-09-25 retrieved",
    "data": {
      "doctorId": "660f91a...",
      "doctorName": "Dr. Sarah Jenkins",
      "date": "2026-09-25",
      "allSlots": [
        { "time": "10:00 AM", "isBooked": false },
        { "time": "10:30 AM", "isBooked": true }
      ],
      "availableSlots": [
        { "time": "10:00 AM", "isBooked": false }
      ],
      "hasAvailableSlots": true
    }
  }
  ```

---

### 8.5 Appointments (`/api/appointments`)

#### 1. Book Appointment
- **Method**: `POST`
- **URL**: `/api/appointments`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "doctorId": "660f91a...",
    "date": "2026-09-25",
    "time": "10:00 AM",
    "reason": "Persistent fever and headache"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Appointment booked successfully",
    "data": {
      "_id": "6614a1c...",
      "doctor": {
        "name": "Dr. Sarah Jenkins",
        "specialization": "General Physician",
        "clinic": { "name": "MediConsult Health Center" }
      },
      "patient": {
        "name": "Alex Johnson",
        "email": "alex@example.com"
      },
      "date": "2026-09-25",
      "time": "10:00 AM",
      "reason": "Persistent fever and headache",
      "status": "confirmed"
    }
  }
  ```
- **Double Booking Error Response (409 Conflict)**:
  ```json
  {
    "success": false,
    "message": "This appointment slot is already booked",
    "errors": []
  }
  ```

#### 2. Get User Appointments
- **Method**: `GET`
- **URL**: `/api/appointments` (or `/api/appointments/upcoming` or `/api/appointments/past`)
- **Auth Required**: Yes

#### 3. Cancel Appointment
- **Method**: `PATCH`
- **URL**: `/api/appointments/:id/cancel`
- **Auth Required**: Yes
- **Action**: Marks status `cancelled`, automatically frees slot in Doctor availability.

#### 4. Reschedule Appointment
- **Method**: `PATCH`
- **URL**: `/api/appointments/:id/reschedule`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "date": "2026-09-26",
    "time": "11:00 AM"
  }
  ```

#### 5. Doctor Appointment Management
- `GET /api/appointments/doctor/appointments` (Doctor / Admin only)
- `PATCH /api/appointments/doctor/appointments/:id/status` (Doctor / Admin only)
  Body: `{ "status": "completed" }`

---

### 8.6 Medical History (`/api/medical-history`)

- `GET /api/medical-history`: List user's consultation logs and AI assessment history.
- `GET /api/medical-history/:id`: View individual record (Strict privacy enforced: only owning user).
- `DELETE /api/medical-history/:id`: Remove historical record.

---

### 8.7 Notifications (`/api/notifications`)

- `GET /api/notifications`: Get notification list with unread counter.
- `PATCH /api/notifications/:id/read`: Mark single notification as read.
- `PATCH /api/notifications/read-all`: Mark all notifications as read.
- `DELETE /api/notifications/:id`: Delete notification.

---

### 8.8 Admin APIs (`/api/admin`)
*Requires `role === 'admin'`*

- `GET /api/admin/dashboard`: Metrics (`totalUsers`, `totalDoctors`, `totalAppointments`, `pendingAppointments`, `completedAppointments`, `totalSymptomChecks`).
- `GET /api/admin/users`: Paginated list of all users.
- `GET /api/admin/doctors`: List all doctors.
- `POST /api/admin/doctors`: Add new doctor profile.
- `PUT /api/admin/doctors/:id`: Update doctor profile.
- `DELETE /api/admin/doctors/:id`: Delete doctor profile.
- `GET /api/admin/appointments`: View all bookings across platform.

---

## 9. React Frontend Integration Example

```javascript
// src/services/api.js in React/Vite
const API_BASE = "http://localhost:5000/api";

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("mediconsult_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

// Example: Symptom Checker
export async function analyzeSymptoms(symptoms, duration, severity) {
  return await request("/symptoms/analyze", {
    method: "POST",
    body: JSON.stringify({ symptoms, duration, severity }),
  });
}
```

---

## 10. Troubleshooting

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `[MongoDB] Database connection error` | Invalid `MONGO_URI` or network blocked | Check MongoDB Atlas Network Access IP whitelist (add `0.0.0.0/0`) and verify credentials in `.env`. |
| `401 Token missing / invalid` | Frontend didn't include `Authorization: Bearer <token>` | Verify token is stored upon login and attached in request headers. |
| `409 Slot already booked` | Another booking exists for doctor at same date/time | Slot is reserved. Refresh slots via `/api/doctors/:id/slots?date=YYYY-MM-DD`. |
| AI returns safe fallback | Missing or invalid `GEMINI_API_KEY` | Set valid `GEMINI_API_KEY` in `backend/.env`. Fallback response protects service from crash. |
| CORS Blocked in Browser | Frontend URL doesn't match `CLIENT_URL` | Set `CLIENT_URL=http://localhost:5173` in `backend/.env`. |

---
*Developed for MediConsult Academic Mini-Project & Healthcare Prototyping.*
