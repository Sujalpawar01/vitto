# Vitto - Technical Assessment Write-up

## 📄 Overview
I have built a **Loan Application Portal** representing a simplified operational setup for tracking borrower loan requests. The project implements:
1. A public borrower portal where applicants submit loan details with strict client and server-side validations.
2. A secure agent dashboard for operations teams, featuring JWT-protected metrics, list tables, search capabilities, status filters, and one-click loan approvals/rejections.

---

## 🏗️ Architectural Decisions

* **Split Client-Server Workspace**: Keeping `backend` and `frontend` in decoupled workspaces makes deployment on modern static hosting (like Vercel) and dynamic containers (like Render) seamless and cost-free.
* **Auto-Running Database Migrations**: On backend startup, the server reads `migrations/001_init.sql` and runs schema updates. This guarantees tables and seeds exist without requiring reviewer database interventions.
* **JWT Agent Authentication**: Added a login interface for agents. JWT tokens are verified on all list, summary, and action requests, keeping borrower financial data private and secure.
* **Native HSL Dark styling (Vanilla CSS)**: Built custom glassmorphic styling utilizing CSS variables and keyframe animations. It is highly responsive for agents using phones in the field and contains color-coded badges for statuses and communication languages.
* **Debounced Search (Bonus)**: Added real-time search by applicant name or mobile number on the dashboard with 400ms debouncing to minimize API calls and improve UX.
* **Native Node Testing**: Leveraged the `node:test` runner to build fast integration tests with zero testing packages.

---

## ⚠️ Known Issues, Assumptions, & Limitations
* **Database Pagination**: Currently, the dashboard retrieves all applications. If the volume grows, it will cause load delays. 
* **Public Route Rate-Limiting**: The application creation route is public. In a production environment, this is vulnerable to spam submissions.
* **Agent Creation**: For the scope of this assignment, we assume the agent account is seeded by default (`agent1` / `Password123`) inside migrations.

---

## 🚀 Future Enhancements (What I'd Improve)
1. **API Rate Limiting & CAPTCHA**: Add `express-rate-limit` middleware on `POST /api/applications` to block bot spam.
2. **Paginated Data Fetches**: Implement database-level limit and offset parameters (`?page=1&limit=20`) to support millions of borrower entries.
3. **SMS Alerts (Twilio/WhatsApp)**: Trigger automatic notifications to the borrower's mobile when the operations team approves or rejects a loan.
4. **Audit Logging Table**: Add a database logging table to track which agent approved or rejected which loan and when.
