Overview

I built a Loan Application Portal to simulate a simple system for managing borrower loan requests.

The project has two main parts:

1. A public borrower portal where applicants can fill out and submit loan details, with proper validation on both the frontend and backend.
2. A secure agent dashboard for the operations team, protected with JWT login, where they can view loan applications, search them, filter by status, and approve or reject requests with one click.

Architectural Decisions

I made a few important choices while building the project:

Separated frontend and backend: I kept the client and server in different workspaces so the app can be deployed easily on platforms like Vercel and Render.
Automatic database setup: When the backend starts, it automatically runs the SQL migration file to create the required tables and sample data. This makes setup easier for reviewers.

JWT-based agent login: I added login protection for agents so that loan data stays private and only authorized users can access the dashboard.

Custom dark theme styling: I designed the UI using plain CSS with a modern glass-like look, responsive layout, and color-coded status labels.

Debounced search: I added live search with a short delay so the dashboard feels smooth and does not send too many API requests.

Built-in Node testing: I used Node’s default test runner to keep testing fast and simple without extra packages.

 Known Issues and Limitations

* Right now, the dashboard loads all applications at once, so it may become slow if the number of records grows too large.
* The application form is public, so in a real production environment it could be misused for spam submissions.
* For this assignment, I assumed the agent account already exists in the database with the username **agent1** and password **Password123**.

 Future Improvements

Here are some things I would improve next:

1. Add rate limiting and CAPTCHA to stop spam and bot submissions.
2. Add pagination so applications load in smaller chunks instead of all at once.
3. Send SMS or WhatsApp alerts when a loan is approved or rejected.
4. Add an audit log table to record which agent took each action and when.


