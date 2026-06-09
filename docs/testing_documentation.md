# Testing & Validation Documentation

This document describes the test suite designed for the Vitto Loan Application Portal and instructions to execute it.

---

## 🧪 Testing Methodology
To maintain clean, lightweight, and fast-executing tests, we use the **Node.js Native Test Runner** (`node:test` and `node:assert`), introduced in Node v18.
This removes the dependency on third-party test bloat like Jest, Mocha, or Chai, enabling testing at native speed.

### Features of the Test Suite
1. **Mock Database query runner**: Rather than spinning up a real local PostgreSQL server, the tests mock the SQL query driver. It captures queries and parameters, allowing us to inspect if queries are formed correctly while returning mock rows dynamically.
2. **Ephemeral Network Listeners**: On startup, the Express app is bound to port `0`. The operating system allocates a random free port for the duration of the test, ensuring tests never collide with already running services.
3. **Integration validations**: Submits HTTP requests using Node's native `fetch` module to verify that routing, middleware, CORS headers, JSON sanitizers, and validation helpers function together.

---

## 🏃 How to Run the Tests

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Execute the test command:
   ```bash
   npm test
   ```

### Expected Output
The tests report using the standard TAP (Test Anything Protocol) format, showing execution success for each endpoint:
```text
> vitto-backend@1.0.0 test
> node test/api.test.js

TAP version 13
# Subtest: Vitto API Endpoints and Validation Test Suite
    # Subtest: GET / - Should return health check response
    ok 1 - GET / - Should return health check response
    # Subtest: POST /api/applications - Should succeed with valid inputs
    ok 2 - POST /api/applications - Should succeed with valid inputs
    # Subtest: POST /api/applications - Should fail validation with invalid mobile number
    ok 3 - POST /api/applications - Should fail validation with invalid mobile number
    # Subtest: POST /api/applications - Should fail validation with invalid language option
    ok 4 - POST /api/applications - Should fail validation with invalid language option
    # Subtest: GET /api/applications - Should fail unauthorized access without JWT token
    ok 5 - GET /api/applications - Should fail unauthorized access without JWT token
    # Subtest: GET /api/applications - Should fail access with invalid token
    ok 6 - GET /api/applications - Should fail access with invalid token
ok 1 - Vitto API Endpoints and Validation Test Suite
1..1
# tests 7
# suites 0
# pass 7
# fail 0
```

---

## 📑 Test Coverage Scope

| Test Case | Target Endpoint | Description |
|---|---|---|
| Health Check | `GET /` | Verifies the root path returns an active status response. |
| Submit Application (Valid) | `POST /api/applications` | Tests server parsing, database insertions, and a 201 response. |
| Submit Application (Bad Mobile) | `POST /api/applications` | Submits bad phone formats and expects a 400 response with input warnings. |
| Submit Application (Bad Language) | `POST /api/applications` | Checks that only allowed language options (`Hindi`/`Tamil`/`Telugu`/`Marathi`/`English`) pass. |
| Unauthorized List | `GET /api/applications` | Confirms the route returns 401 if a JWT header is missing. |
| Invalid Token Check | `GET /api/applications` | Verifies that a malformed JWT token is blocked with a 403 response. |
