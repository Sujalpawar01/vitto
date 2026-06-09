# REST API Documentation

All endpoints return JSON payloads and expect body requests to be in JSON format (`Content-Type: application/json`).

---

## 🔐 Authentication Route

### 1. Agent Login
Authenticates an agent and returns a JWT bearer token.
 Route: `POST /api/auth/login`
 Auth Required: No
 Request Body:
  ```json
  {
    "username": "agent1",
    "password": "Password123"
  }
  }
  ```
 Success Response (200 OK):
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiZWNh...",
    "agent": {
      "id": "4beca98e-4a6c-485a-8b89-fc4bfb68c2d1",
      "username": "agent1",
      "name": "Operations Agent"
    }
  }
  ```

---

## 📂 Applications Routes

### 2. Submit Loan Application
Submits a new loan application. All fields are required.
 Route: `POST /api/applications`
 Auth Required: No
 Request Body:
  ```json
  {
    "name": "Sujal Pawar",
    "mobile": "9876543210",
    "amount": 45000,
    "purpose": "Purchase shop inventory",
    "language": "Hindi"
  }
  ```
  Allowed languages: `Hindi`, `Tamil`, `Telugu`, `Marathi`, `English` (case-insensitive, normalized by server).
 Success Response (201 Created):
  ```json
  {
    "success": true,
    "message": "Loan application submitted successfully.",
    "application": {
      "id": "e9b5f543-9876-4abc-99ef-88d7f6c5e4d3",
      "name": "Sujal Pawar",
      "mobile": "9876543210",
      "amount": "45000.00",
      "purpose": "Purchase shop inventory",
      "language": "Hindi",
      "status": "pending",
      "created_at": "2026-06-09T13:50:00.000Z"
    }
  }
  ```
 Validation Error Response (400 Bad Request):
  ```json
  {
    "success": false,
    "errors": [
      "Invalid mobile number. Please enter a valid 10-digit mobile number.",
      "Loan amount must be a positive number greater than ₹0."
    ]
  }
  ```

---

### 3. List Applications
Retrieves a list of all submitted applications, sorted by latest first.
 Route: `GET /api/applications`
 Auth Required: Yes (Bearer Token in Header: `Authorization: Bearer <token>`)
 Query Parameters (Optional):
   `status`: Filters by status (`pending`, `approved`, `rejected`).
   `search`: Case-insensitive text search filtering applicant names or mobile numbers.
 Success Response (200 OK):
  ```json
  {
    "success": true,
    "count": 1,
    "applications": [
      {
        "id": "e9b5f543-9876-4abc-99ef-88d7f6c5e4d3",
        "name": "Sujal Pawar",
        "mobile": "9876543210",
        "amount": "45000.00",
        "purpose": "Purchase shop inventory",
        "language": "Hindi",
        "status": "pending",
        "created_at": "2026-06-09T13:50:00.000Z"
      }
    ]
  }
  ```

---

### 4. Update Application Status
Approve or reject a loan application.
 Route: `PATCH /api/applications/:id/status`
 Auth Required: Yes (Bearer Token)
 URL Parameters:
   `id`: The UUID of the application.
 Request Body:
  ```json
  {
    "status": "approved"
  }
  ```
  Allowed status values: `approved`, `rejected`.
 Success Response (200 OK):
  ```json
  {
    "success": true,
    "message": "Application status updated to approved.",
    "application": {
      "id": "e9b5f543-9876-4abc-99ef-88d7f6c5e4d3",
      "name": "Sujal Pawar",
      "mobile": "9876543210",
      "amount": "45000.00",
      "purpose": "Purchase shop inventory",
      "language": "Hindi",
      "status": "approved",
      "created_at": "2026-06-09T13:50:00.000Z"
    }
  }
  ```

---

### 5. Fetch Dashboard Summary
Fetches aggregate statistics to populate the agent dashboard counters.
 Route: `GET /api/summary`
 Auth Required: Yes (Bearer Token)
 Success Response (200 OK):
  ```json
  {
    "success": true,
    "summary": {
      "totalApplications": 12,
      "totalAmount": 580000.00,
      "statusCounts": {
        "pending": 5,
        "approved": 5,
        "rejected": 2
      }
    }
  }
  ```

