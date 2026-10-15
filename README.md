# Project-Pulse
Project Pulse is a web application that helps students manage projects, collaborate with teammates, monitor progress, and keep track of important tasks in one centralised platform. This web applicatuon was developed as a five-member team project for the C237 Software Application Development module.

The application is designed to help students organise and manage collaborative projects in one place. Users can create and join projects, manage tasks and meetings, upload project resources, review project activity, and track project progress through a centralised dashboard.
🌐 Live Demo
Project Pulse is deployed on Render and can be accessed here:
👉 https://c237-team-02-student-project-managment.onrender.com/login
The deployed application may take a short moment to load after a period of inactivity.

✨ Features
- 🔐 User registration, login and session-based authentication
- 👥 Project creation, selection and team member management
- 🛡️ Role-based authorisation for Project Leaders and Project Members
- ✅ Task creation, assignment, editing, status tracking and comments
- 📅 Meeting scheduling, editing and project calendar integration
- 📊 Dashboard displaying project tasks, meetings, reminders and recent activity
- 📝 Project retrospectives for recording what went well, areas for improvement and appreciation
- 📁 Resource upload, download, editing and deletion
- 🏆 Achievement system for recognising task progress
- 🔎 Search across project tasks and meetings
- 🔔 Notifications and project activity timeline
- 👤 User profile management and profile-picture uploads
- 📦 Project archiving, restoration and deletion

👨‍💻 My Contributions
This application was developed collaboratively as a team project. My primary responsibility was the User Authentication and Access Control module, together with its security and session-management features.

User Registration
- Developed the user-registration flow and routes
- Implemented server-side input validation
- Added checks to prevent duplicate usernames and email addresses
- Implemented SHA-256 password hashing using MySQL SHA2() before passwords are stored
- Integrated registration with the application's authentication flow

Login & Authentication
- Developed the login flow and authentication logic
- Verified login credentials against SHA2-hashed passwords stored in MySQL
- Used parameterised SQL queries when retrieving and authenticating users
- Created authenticated sessions after successful login
- Stored the user's unique userId in the session instead of storing passwords or complete user records

Session Management & Logout
- Implemented session management using express-session
- Maintained the logged-in user's userId and selected project across requests
- Integrated middleware to load the current user and selected project from MySQL
- Developed a logout confirmation flow
- Implemented complete session destruction after confirmed logout
  
Authentication & Role-Based Authorisation
- Developed reusable middleware functions:
  - requireLogin
  - requireSelectedProject
  - requireProjectLeader
- Separated authentication from authorisation logic
- Enforced Project Leader and Project Member permissions across protected routes
- Collaborated with teammates to integrate the middleware into project, meeting, task and resource features
  
Login Security Enhancement
- Developed an account-lockout feature for repeated failed login attempts
- Tracked consecutive failed attempts in MySQL
- Temporarily locked accounts after three incorrect attempts
- Implemented progressive lockout durations for repeated failed-login cycles
- Calculated and displayed remaining lockout time to users
- Reset failed-attempt and lockout information after successful authentication
- Stored lockout information in the database so that it remains active even if the application server restarts

🛠️ Tech Stack
Frontend
- EJS
- HTML5
- CSS3
- Bootstrap
- FullCalendar
  
Backend
- Node.js
- Express.js
- express-session
- connect-flash
- Multer
Database
- MySQL
- mysql2
Deployment
- Render
- Azure Database for MySQL
