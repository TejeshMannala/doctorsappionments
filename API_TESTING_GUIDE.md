# API Testing Guide

Complete testing guide for Doctor Appointment System APIs using cURL or Postman.

## 🚀 Base URLs

- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`

---

## 📋 Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "role": "patient"
  }'
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

---

### 2. Login User

**Endpoint**: `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "profileImage": "https://via.placeholder.com/150"
  }
}
```

---

### 3. Verify Token

**Endpoint**: `GET /api/auth/verify`

```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "profileImage": "https://via.placeholder.com/150"
  }
}
```

---

## 👨‍⚕️ Doctor Endpoints

### 1. Get All Doctors

**Endpoint**: `GET /api/doctors`

```bash
curl -X GET http://localhost:5000/api/doctors
```

**Response**:
```json
{
  "success": true,
  "count": 2,
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "specialization": "Cardiology",
      "experience": 10,
      "qualification": "MBBS, MD",
      "consultationFee": 1000,
      "rating": 4.5,
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "fullName": "Dr. Sarah Smith",
        "email": "sarah@example.com"
      }
    }
  ]
}
```

---

### 2. Get Doctor by ID

**Endpoint**: `GET /api/doctors/:id`

```bash
curl -X GET http://localhost:5000/api/doctors/507f1f77bcf86cd799439012
```

---

### 3. Search Doctors by Specialization

**Endpoint**: `GET /api/doctors/search?specialization=cardiology`

```bash
curl -X GET "http://localhost:5000/api/doctors/search?specialization=cardiology"
```

---

### 4. Create Doctor Profile

**Endpoint**: `POST /api/doctors/profile` (Protected - Doctor Role Required)

```bash
curl -X POST http://localhost:5000/api/doctors/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{
    "specialization": "Cardiology",
    "experience": 10,
    "qualification": "MBBS, MD Cardiology",
    "licenseNumber": "LIC123456",
    "consultationFee": 1000
  }'
```

---

### 5. Update Doctor Profile

**Endpoint**: `PUT /api/doctors/profile` (Protected - Doctor Role Required)

```bash
curl -X PUT http://localhost:5000/api/doctors/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{
    "consultationFee": 1200,
    "experience": 11
  }'
```

---

## 📅 Appointment Endpoints

### 1. Book Appointment

**Endpoint**: `POST /api/appointments` (Protected - Patient)

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{
    "doctorId": "507f1f77bcf86cd799439012",
    "date": "2024-04-15T10:00:00Z",
    "timeSlot": "10:00 AM - 10:30 AM",
    "symptoms": "Chest pain and shortness of breath",
    "consultationType": "online"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439013",
    "patientId": "507f1f77bcf86cd799439010",
    "doctorId": "507f1f77bcf86cd799439012",
    "date": "2024-04-15T10:00:00.000Z",
    "timeSlot": "10:00 AM - 10:30 AM",
    "status": "pending",
    "symptoms": "Chest pain and shortness of breath",
    "consultationType": "online",
    "isPaid": false
  }
}
```

---

### 2. Get Patient's Appointments

**Endpoint**: `GET /api/appointments/patient` (Protected - Patient)

```bash
curl -X GET http://localhost:5000/api/appointments/patient \
  -H "Authorization: Bearer PATIENT_TOKEN"
```

---

### 3. Get Doctor's Appointments

**Endpoint**: `GET /api/appointments/doctor` (Protected - Doctor)

```bash
curl -X GET http://localhost:5000/api/appointments/doctor \
  -H "Authorization: Bearer DOCTOR_TOKEN"
```

---

### 4. Update Appointment Status

**Endpoint**: `PUT /api/appointments/:id/status` (Protected)

```bash
curl -X PUT http://localhost:5000/api/appointments/507f1f77bcf86cd799439013/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

---

### 5. Cancel Appointment

**Endpoint**: `DELETE /api/appointments/:id/cancel` (Protected)

```bash
curl -X DELETE http://localhost:5000/api/appointments/507f1f77bcf86cd799439013/cancel \
  -H "Authorization: Bearer TOKEN"
```

---

## 👤 Patient Endpoints

### 1. Get User Profile

**Endpoint**: `GET /api/patients/profile` (Protected)

```bash
curl -X GET http://localhost:5000/api/patients/profile \
  -H "Authorization: Bearer TOKEN"
```

---

### 2. Update User Profile

**Endpoint**: `PUT /api/patients/profile` (Protected)

```bash
curl -X PUT http://localhost:5000/api/patients/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "fullName": "John Doe Updated",
    "phone": "+1234567890",
    "address": "123 Main St, City, State 12345"
  }'
```

---

### 3. Get All Users (Admin Only)

**Endpoint**: `GET /api/patients` (Protected - Admin)

```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🏥 Health Check

**Endpoint**: `GET /api/health`

```bash
curl -X GET http://localhost:5000/api/health
```

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-04-06T10:30:45.123Z"
}
```

---

## 📝 Test Scenarios

### Scenario 1: Complete User Flow

1. **Register Patient**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Patient Name",
    "email": "patient@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "role": "patient"
  }'
```

2. **Login as Patient** (Save the token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePass123"
  }'
```

3. **Browse Doctors**
```bash
curl -X GET http://localhost:5000/api/doctors
```

4. **Book Appointment**
```bash
# Use the doctor ID from step 3
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{
    "doctorId": "DOCTOR_ID",
    "date": "2024-04-15T14:00:00Z",
    "timeSlot": "2:00 PM - 2:30 PM",
    "symptoms": "Regular checkup",
    "consultationType": "online"
  }'
```

5. **View My Appointments**
```bash
curl -X GET http://localhost:5000/api/appointments/patient \
  -H "Authorization: Bearer PATIENT_TOKEN"
```

---

### Scenario 2: Doctor Flow

1. **Register Doctor**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Dr. Jane Smith",
    "email": "doctor@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "role": "doctor"
  }'
```

2. **Login as Doctor** (Save token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "SecurePass123"
  }'
```

3. **Create Doctor Profile**
```bash
curl -X POST http://localhost:5000/api/doctors/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{
    "specialization": "Neurology",
    "experience": 8,
    "qualification": "MBBS, MD Neurology",
    "licenseNumber": "LIC-NEU-2024-001",
    "consultationFee": 1500
  }'
```

4. **View Patient Appointments**
```bash
curl -X GET http://localhost:5000/api/appointments/doctor \
  -H "Authorization: Bearer DOCTOR_TOKEN"
```

5. **Update Appointment Status**
```bash
curl -X PUT http://localhost:5000/api/appointments/APPOINTMENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

---

## ❌ Error Responses

### Invalid Email Format
```json
{
  "success": false,
  "message": "Please provide a valid email",
  "error": "..."
}
```

### Password Mismatch
```json
{
  "success": false,
  "message": "Passwords do not match."
}
```

### Unauthorized Access
```json
{
  "success": false,
  "message": "No token provided. Please authenticate."
}
```

### Insufficient Permissions
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### Not Found
```json
{
  "success": false,
  "message": "Doctor not found"
}
```

---

## 🛠️ Testing Tools

### Postman
1. Import the endpoints into Postman
2. Create environment variables for `BASE_URL` and `TOKEN`
3. Use Pre-request scripts to automate token handling

### cURL
- Copy-paste the curl commands in terminal
- Replace `DOCTOR_TOKEN`, `PATIENT_TOKEN` with actual tokens

### VS Code REST Client
```
@baseUrl = http://localhost:5000
@token = YOUR_TOKEN_HERE

###
GET {{baseUrl}}/api/health
```

---

## ✅ Quick Test Checklist

- [ ] Health check passes
- [ ] Register new patient account
- [ ] Login with patient credentials
- [ ] Verify token is returned
- [ ] Retrieve token from login
- [ ] View all doctors
- [ ] Book appointment
- [ ] View patient appointments
- [ ] Register doctor account
- [ ] Create doctor profile
- [ ] Cancel appointment
- [ ] Update appointment status

---

Enjoy testing! 🚀
