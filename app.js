const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const multer = require("multer");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// =====================================================
// DATABASE CONNECTION
// =====================================================
const db = mysql.createConnection({
    host: "c237-meilan-mysql.mysql.database.azure.com",
    user: "c237_010",
    password: "c237010@2026!",
    database: "c237_010_team2_ca2_project",
    ssl: { rejectUnauthorized: false }
});

db.connect(error => error ? console.error("Database connection failed:", error.message) : console.log("Connected to MySQL database successfully"));

// =====================================================
// EXPRESS SETTINGS
// =====================================================
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("resources/public"));
// Stylesheets use /resources/... while public images use /images/...
app.use("/resources", express.static("resources"));

app.use(session({
    secret: "student-project-management-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.successMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    next();
});

// =====================================================
// MULTER CONFIGURATION
// =====================================================
const allowedImageTypes = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const profileStorage = multer.diskStorage({
    destination: "resources/public/images/profile-pictures",
    filename: (req, file, callback) => callback(null, "profile-" + Date.now() + "-" + Math.round(Math.random() * 1000000000) + allowedImageTypes[file.mimetype])
});

const uploadProfilePicture = multer({
    storage: profileStorage,
    fileFilter: (req, file, callback) => allowedImageTypes[file.mimetype] ? callback(null, true) : callback(new Error("Only JPG, PNG and WEBP images are allowed.")),
    limits: { fileSize: 5 * 1024 * 1024 }
});

const allowedResourceTypes = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "application/zip": ".zip",
    "application/x-zip-compressed": ".zip"
};

const resourceStorage = multer.diskStorage({
    destination: "resources/public/uploads/resources",
    filename: (req, file, callback) => callback(null, Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_"))
});

const uploadResource = multer({
    storage: resourceStorage,
    fileFilter: (req, file, callback) => allowedResourceTypes[file.mimetype] ? callback(null, true) : callback(new Error("That file type is not allowed.")),
    limits: { fileSize: 20 * 1024 * 1024 }
});

// =====================================================
// OPTIONS AND VALIDATION
// =====================================================
const diplomaOptions = [
    "Common ICT Programme (R58)", "Diploma in Applied AI & Analytics (R13)",
    "Diploma in Cybersecurity & Digital Forensics (R55)", "Diploma in Enterprise Cloud Computing & Management (R12)",
    "Diploma in Financial Technology (R18)", "Diploma in Information Technology (R47)"
];

const yearSemesterOptions = [
    "Year 1 Semester 1", "Year 1 Semester 2", "Year 2 Semester 1",
    "Year 2 Semester 2", "Year 3 Semester 1", "Year 3 Semester 2"
];

const priorityOptions = ["Low", "Medium", "High"];
const taskStatusOptions = ["Not Started", "In Progress", "Completed"];
const bucketOptions = ["went_well", "improvement", "thanks"];

const cleanText = value => value ? value.trim() : "";
const isValidPriority = priority => priorityOptions.includes(priority);
const isValidTaskStatus = status => taskStatusOptions.includes(status);
const isValidBucket = bucketType => bucketOptions.includes(bucketType);

// =====================================================
// DATABASE HELPERS
// =====================================================
function getUserById(userId, callback) {
    const sql = `
        SELECT user_id AS userId, username, name, email,
               contact_number AS contactNumber, diploma,
               year_semester AS yearSemester, bio,
               profile_picture AS profilePicture
        FROM users
        WHERE user_id = ?
        LIMIT 1
    `;
    db.query(sql, [userId], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function getUserByEmail(email, callback) {
    const sql = `
        SELECT user_id AS userId, username, name, email,
               contact_number AS contactNumber, diploma,
               year_semester AS yearSemester, bio,
               profile_picture AS profilePicture
        FROM users
        WHERE LOWER(email) = LOWER(?)
        LIMIT 1
    `;
    db.query(sql, [email], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function getUserByUsername(username, callback) {
    const sql = `SELECT user_id AS userId FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1`;
    db.query(sql, [username], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function getProjectContext(projectId, userId, callback) {
    const sql = `
        SELECT p.project_id AS projectId, p.project_name AS projectName,
               p.description, pm.role
        FROM projects p
        INNER JOIN project_members pm ON p.project_id = pm.project_id
        WHERE p.project_id = ? AND pm.user_id = ?
        LIMIT 1
    `;
    db.query(sql, [projectId, userId], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function getProjectMembers(projectId, callback) {
    const sql = `
        SELECT u.user_id AS userId, u.username, u.name, u.email,
               u.contact_number AS contactNumber, u.diploma,
               u.year_semester AS yearSemester, u.bio,
               u.profile_picture AS profilePicture, pm.role
        FROM project_members pm
        INNER JOIN users u ON pm.user_id = u.user_id
        WHERE pm.project_id = ?
        ORDER BY CASE WHEN pm.role = 'Project Leader' THEN 0 ELSE 1 END, u.name
    `;
    db.query(sql, [projectId], (error, results) => error ? callback(error) : callback(null, results));
}

function getTaskById(taskId, projectId, callback) {
    const sql = `SELECT t.task_id AS taskId, t.project_id AS projectId, t.task_name AS taskName, t.description, t.assigned_user_id AS assignedUserId, t.created_by_user_id AS createdByUserId, t.priority, t.status, DATE_FORMAT(t.due_date, '%Y-%m-%d') AS dueDate, t.created_at AS createdAt, t.updated_at AS updatedAt, u.name AS assignedUserName FROM tasks t LEFT JOIN users u ON t.assigned_user_id = u.user_id WHERE t.task_id = ? AND t.project_id = ? LIMIT 1`;
    db.query(sql, [taskId, projectId], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function getMeetingById(meetingId, projectId, callback) {
    const sql = `SELECT meeting_id AS meetingId, project_id AS projectId, meeting_title AS meetingTitle, DATE_FORMAT(meeting_date, '%Y-%m-%d') AS meetingDate, TIME_FORMAT(meeting_time, '%H:%i') AS meetingTime, TIME_FORMAT(meeting_time, '%h:%i %p SGT') AS meetingTimeText, location, agenda, created_by_user_id AS createdByUserId FROM meetings WHERE meeting_id = ? AND project_id = ? LIMIT 1`;
    db.query(sql, [meetingId, projectId], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function getRetrospectiveById(retrospectiveId, projectId, callback) {
    const sql = `SELECT retrospective_id AS retrospectiveId, project_id AS projectId, user_id AS userId, bucket_type AS bucketType, content FROM retrospective_items WHERE retrospective_id = ? AND project_id = ? LIMIT 1`;
    db.query(sql, [retrospectiveId, projectId], (error, results) => error ? callback(error) : callback(null, results[0] || null));
}

function addActivity(projectId, userId, description, callback) {
    db.query(`INSERT INTO activities (project_id, user_id, description) VALUES (?, ?, ?)`, [projectId, userId, description], error => error ? callback(error) : callback(null));
}

// =====================================================
// LOAD CURRENT USER AND PROJECT
// =====================================================
app.use((req, res, next) => {
    res.locals = { ...res.locals, currentUser: null, selectedProject: null, currentProjectRole: null, diplomaOptions, yearSemesterOptions };
    if (!req.session.userId) return next();

    getUserById(req.session.userId, (userError, currentUser) => {
        if (userError) return next(userError);
        if (!currentUser) { req.session.userId = null; req.session.selectedProjectId = null; return next(); }
        res.locals.currentUser = currentUser;
        if (!req.session.selectedProjectId) return next();

        getProjectContext(req.session.selectedProjectId, currentUser.userId, (projectError, projectContext) => {
            if (projectError) return next(projectError);
            if (!projectContext) { req.session.selectedProjectId = null; return next(); }
            res.locals.selectedProject = { projectId: projectContext.projectId, projectName: projectContext.projectName, description: projectContext.description };
            res.locals.currentProjectRole = projectContext.role;
            next();
        });
    });
});

// =====================================================
// PERMISSION MIDDLEWARE
// =====================================================
function requireLogin(req, res, next) {
    if (res.locals.currentUser) return next();
    req.flash("error", "Please log in before accessing that page.");
    res.redirect("/login");
}

function requireSelectedProject(req, res, next) {
    if (res.locals.selectedProject) return next();
    req.flash("error", "Please select a project first.");
    res.redirect("/projects");
}

function requireProjectLeader(req, res, next) {
    if (res.locals.currentProjectRole === "Project Leader") return next();
    req.flash("error", "Only the Project Leader can perform that action.");
    res.redirect("/dashboard");
}

// =====================================================
// HOME, LOGIN AND LOGOUT
// =====================================================
app.get("/", (req, res) => {
    if (!res.locals.currentUser) return res.redirect("/login");
    if (!res.locals.selectedProject) return res.redirect("/projects");
    res.redirect("/dashboard");
});

app.get("/login", (req, res) => {
    if (res.locals.currentUser) return res.redirect("/projects");
    res.render("login");
});

app.post("/login", (req, res, next) => {
    const username = cleanText(req.body.username), password = req.body.password || "";
    const sql = `
        SELECT user_id AS userId, name,
               password = SHA2(?, 256) AS passwordMatches,
               failed_attempts AS failedAttempts,
               lockout_level AS lockoutLevel,
               locked_until > UTC_TIMESTAMP() AS isLocked,
               GREATEST(TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(), locked_until), 0) AS lockSeconds,
               DATE_FORMAT(DATE_ADD(locked_until, INTERVAL 8 HOUR), '%d %b %Y, %h:%i %p SGT') AS unlockTime
        FROM users
        WHERE LOWER(username) = LOWER(?)
        LIMIT 1
    `;
    db.query(sql, [password, username], (error, results) => {
        if (error) return next(error);
        const user = results[0];
        if (!user) { req.flash("error", "The username or password is incorrect."); return res.redirect("/login"); }

        if (user.isLocked) {
            const minutes = Math.max(1, Math.ceil(user.lockSeconds / 60));
            req.flash("error", "Your account is locked until " + user.unlockTime + " (about " + minutes + " minute(s) remaining).");
            return res.redirect("/login");
        }

        if (!user.passwordMatches) {
            const failedAttempts = user.failedAttempts + 1;
            // First lock: after 3 failures. After that lock expires, one more failure locks for 1 day.
            if (failedAttempts >= 3 || user.lockoutLevel > 0) {
                const lockMinutes = user.lockoutLevel === 0 ? 5 : 1440;
                const updateSql = `UPDATE users SET failed_attempts = 0, locked_until = DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? MINUTE), lockout_level = lockout_level + 1 WHERE user_id = ?`;
                return db.query(updateSql, [lockMinutes, user.userId], updateError => {
                    if (updateError) return next(updateError);
                    req.flash("error", lockMinutes === 5 ? "Too many failed attempts. Your account is locked for 5 minutes." : "Too many failed attempts. Your account is locked for 1 day.");
                    res.redirect("/login");
                });
            }

            return db.query(`UPDATE users SET failed_attempts = ? WHERE user_id = ?`, [failedAttempts, user.userId], updateError => {
                if (updateError) return next(updateError);
                req.flash("error", "The username or password is incorrect. " + (3 - failedAttempts) + " attempt(s) remaining.");
                res.redirect("/login");
            });
        }

        db.query(`UPDATE users SET failed_attempts = 0, locked_until = NULL, lockout_level = 0 WHERE user_id = ?`, [user.userId], updateError => {
            if (updateError) return next(updateError);
            req.session.userId = user.userId;
            req.session.selectedProjectId = null;
            req.flash("success", "Welcome, " + user.name + ".");
            res.redirect("/projects");
        });
    });
});

// Ask for confirmation before ending the session.
app.get("/logout", requireLogin, (req, res) => res.render("logout"));

// Log the user out after confirmation.
app.post('/logout', requireLogin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to log out.');
        }

        // Redirect the user to the login page.
        res.redirect('/login');
    });
});

// =====================================================
// REGISTER
// =====================================================
app.get("/register", (req, res) => res.locals.currentUser ? res.redirect("/projects") : res.render("register"));

app.post("/register", uploadProfilePicture.single("profilePicture"), (req, res, next) => {
    const username = cleanText(req.body.username), name = cleanText(req.body.name), email = cleanText(req.body.email).toLowerCase();
    const password = req.body.password || "", confirmPassword = req.body.confirmPassword || "";
    const contactNumber = cleanText(req.body.contactNumber), diploma = cleanText(req.body.diploma), yearSemester = cleanText(req.body.yearSemester), bio = cleanText(req.body.bio);

    if (!username || !name || !email || !password || !confirmPassword || !diploma || !yearSemester) { req.flash("error", "Please complete every required field."); return res.redirect("/register"); }
    if (password.length < 8) { req.flash("error", "Your password must contain at least eight characters."); return res.redirect("/register"); }
    if (password !== confirmPassword) { req.flash("error", "The passwords do not match."); return res.redirect("/register"); }

    getUserByUsername(username, (usernameError, existingUsername) => {
        if (usernameError) return next(usernameError);
        if (existingUsername) { req.flash("error", "That username is already taken."); return res.redirect("/register"); }

        getUserByEmail(email, (emailError, existingEmail) => {
            if (emailError) return next(emailError);
            if (existingEmail) { req.flash("error", "That email is already registered."); return res.redirect("/register"); }

            const profilePicture = req.file ? "/images/profile-pictures/" + req.file.filename : "/images/profile-pictures/default-profile.svg";
            const values = [username, password, name, email, contactNumber, diploma, yearSemester, bio, profilePicture];

            db.query(`INSERT INTO users (username, password, name, email, contact_number, diploma, year_semester, bio, profile_picture) VALUES (?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?)`, values, insertError => {
                if (insertError) return next(insertError);
                req.flash("success", "Your account has been created. Please log in.");
                res.redirect("/login");
            });
        });
    });
});

// =====================================================
// PROJECT SELECTION & CRUD
// =====================================================
app.get("/projects", requireLogin, function (req, res, next) {
    const userId = res.locals.currentUser.userId;
    const sql = "SELECT p.project_id AS projectId, p.project_name AS projectName, p.description, p.endDate, p.status, pm.role FROM project_members pm INNER JOIN projects p ON pm.project_id = p.project_id WHERE pm.user_id = ? AND p.status != 'Archived' ORDER BY p.project_name";

    db.query(sql, [userId], function (error, userProjects) {
        if (error) {
            return next(error);
        } else {
            res.render("projectselection", { userProjects: userProjects });
        }
    });
});

app.post("/projects/select", requireLogin, function (req, res, next) {
    const projectId = req.body.projectId;
    const userId = res.locals.currentUser.userId;

    getProjectContext(projectId, userId, function (error, projectContext) {
        if (error) {
            return next(error);
        } else {
            if (!projectContext) {
                req.flash("error", "You are not a member of that project.");
                return res.redirect("/projects");
            } else {
                req.session.selectedProjectId = projectId;
                // Show the reminder popup once when this project is opened.
                req.session.remindersSeen = false;
                req.flash("success", "Project selected successfully.");
                res.redirect("/dashboard");
            }
        }
    });
});

//Show project form
app.get('/addproject', requireLogin, function (req, res) {
    res.render('addproject');
});

//Submit project
app.post('/addproject', requireLogin, function (req, res, next) {
    const name = req.body.projectName;
    const desc = req.body.description;
    const userId = res.locals.currentUser.userId;

    const sqlProject = "INSERT INTO projects (project_name, description, endDate, status, created_by_user_id) VALUES (?, ?, ?, 'Active', ?)";
    db.query(sqlProject, [name, desc, req.body.endDate, userId], function (error, result) {
        if (error) {
            return next(error);
        } else {
            const newProjectId = result.insertId;
            const sqlMember = "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'Project Leader')";
            db.query(sqlMember, [newProjectId, userId], function (memberError) {
                if (memberError) {
                    return next(memberError);
                } else {
                    req.flash("success", "Project created and leadership assigned successfully!");
                    res.redirect("/projects");
                }
            });
        }
    });
});

app.get('/editproject/:id', requireLogin, function (req, res, next) {
    const projectId = req.params.id, userId = res.locals.currentUser.userId;
    const sql = `SELECT p.project_id AS projectId, p.project_name AS projectName, p.description, DATE_FORMAT(p.endDate, '%Y-%m-%d') AS endDate FROM projects p INNER JOIN project_members pm ON p.project_id = pm.project_id WHERE p.project_id = ? AND pm.user_id = ? AND pm.role = 'Project Leader'`;

    db.query(sql, [projectId, userId], function (error, results) {
        if (error) return next(error);
        if (!results[0]) { req.flash("error", "Only the Project Leader can edit this project."); return res.redirect("/projects"); }
        res.render("editproject", { project: results[0] });
    });
});

app.post('/editproject/:id', requireLogin, function (req, res, next) {
    const projectId = req.params.id, userId = res.locals.currentUser.userId;
    const name = cleanText(req.body.projectName), description = cleanText(req.body.description), endDate = cleanText(req.body.endDate);
    if (!name || !endDate) { req.flash("error", "Project name and due date are required."); return res.redirect("/editproject/" + projectId); }

    const sql = `UPDATE projects p INNER JOIN project_members pm ON p.project_id = pm.project_id SET p.project_name = ?, p.description = ?, p.endDate = ? WHERE p.project_id = ? AND pm.user_id = ? AND pm.role = 'Project Leader'`;
    db.query(sql, [name, description, endDate, projectId, userId], function (error, result) {
        if (error) return next(error);
        if (result.affectedRows === 0) { req.flash("error", "Only the Project Leader can edit this project."); return res.redirect("/projects"); }
        req.flash("success", "Project details updated successfully.");
        res.redirect("/projects");
    });
});

app.post("/archiveproject/:id", requireLogin, function (req, res, next) {
    const projectId = req.params.id;
    const userId = res.locals.currentUser.userId;

    // A project ID must be present in the URL.
    if (!projectId) {
        req.flash("error", "Invalid project.");
        return res.redirect("/projects");
    }

    // The membership check is part of the UPDATE, so only this project's leader can archive it.
    const sql = `
        UPDATE projects p
        INNER JOIN project_members pm ON p.project_id = pm.project_id
        SET p.status = 'Archived'
        WHERE p.project_id = ? AND pm.user_id = ? AND pm.role = 'Project Leader'
    `;
    db.query(sql, [projectId, userId], function (error, result) {
        if (error) return next(error);

        if (result.affectedRows === 0) {
            req.flash("error", "Only the Project Leader of this project can archive it.");
            return res.redirect("/projects");
        }

        if (req.session.selectedProjectId == projectId) {
            req.session.selectedProjectId = null;
        }
        req.flash("success", "Project archived successfully.");
        res.redirect("/projects");
    });
});

app.get("/archivedprojects", requireLogin, function (req, res, next) {
    const userId = res.locals.currentUser.userId;
    const sql = "SELECT p.project_id AS projectId, p.project_name AS projectName, p.description, p.endDate, p.status, pm.role FROM project_members pm INNER JOIN projects p ON pm.project_id = p.project_id WHERE pm.user_id = ? AND p.status = 'Archived' ORDER BY p.project_name";

    db.query(sql, [userId], function (error, userProjects) {
        if (error) {
            return next(error);
        } else {
            res.render("archivedprojects", { userProjects: userProjects });
        }
    });
});

app.post("/deleteproject/:id", requireLogin, function (req, res, next) {
    const projectId = req.params.id, userId = res.locals.currentUser.userId;
    const returnPage = req.body.returnPage === "projects" ? "/projects" : "/archivedprojects";
    const checkSql = `SELECT 1 FROM projects p INNER JOIN project_members pm ON p.project_id = pm.project_id WHERE p.project_id = ? AND pm.user_id = ? AND pm.role = 'Project Leader'`;

    db.query(checkSql, [projectId, userId], function (error, rows) {
        if (error) return next(error);
        if (!rows[0]) { req.flash("error", "Only the Project Leader can delete this project."); return res.redirect(returnPage); }

        db.beginTransaction(transactionError => {
            if (transactionError) return next(transactionError);
            db.query(`DELETE FROM resources WHERE project_id = ?`, [projectId], resourceError => {
                if (resourceError) return db.rollback(() => next(resourceError));
                db.query(`DELETE FROM projects WHERE project_id = ?`, [projectId], deleteError => {
                    if (deleteError) return db.rollback(() => next(deleteError));
                    db.commit(commitError => {
                        if (commitError) return db.rollback(() => next(commitError));
                        if (req.session.selectedProjectId === projectId) req.session.selectedProjectId = null;
                        req.flash("success", "Project deleted successfully.");
                        res.redirect(returnPage);
                    });
                });
            });
        });
    });
});

app.post("/restoreproject/:id", requireLogin, function (req, res, next) {
    const projectId = req.params.id, userId = res.locals.currentUser.userId;
    const sql = `UPDATE projects p INNER JOIN project_members pm ON p.project_id = pm.project_id SET p.status = 'Active' WHERE p.project_id = ? AND pm.user_id = ? AND pm.role = 'Project Leader'`;
    db.query(sql, [projectId, userId], function (error, result) {
        if (error) return next(error);
        req.flash(result.affectedRows ? "success" : "error", result.affectedRows ? "Project restored successfully." : "Only the Project Leader can restore this project.");
        res.redirect(result.affectedRows ? "/projects" : "/archivedprojects");
    });
});

// =====================================================
// DASHBOARD
// =====================================================
app.get("/dashboard", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId;

    const summarySql = `SELECT COUNT(*) AS totalTasks, SUM(status = 'Completed') AS completedTasks, SUM(status = 'In Progress') AS inProgressTasks FROM tasks WHERE project_id = ?`;

    db.query(summarySql, [projectId], (summaryError, summaryRows) => {
        if (summaryError) return next(summaryError);

        const s = summaryRows[0];
        const total = s.totalTasks || 0;
        const comp = s.completedTasks || 0;
        const prog = s.inProgressTasks || 0;

        const completionPercentage = total > 0 ? Math.round((comp / total) * 100) : 0;
        const teamProductivity = total > 0 ? Math.round(((comp + prog * 0.5) / total) * 100) : 0;

        const usersSql = `SELECT user_id AS userId, username FROM users ORDER BY username`;

        db.query(usersSql, (usersError, users) => {
            if (usersError) return next(usersError);

            const deadlinesSql = `SELECT task_id AS taskId, task_name AS taskName, status, DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate FROM tasks WHERE project_id = ? AND status <> 'Completed' AND due_date >= CURDATE() ORDER BY due_date ASC LIMIT 5`;

            db.query(deadlinesSql, [projectId], (deadlineError, upcomingDeadlines) => {
                if (deadlineError) return next(deadlineError);

                const activitySql = `SELECT activity_id AS activityId, description, DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%d %b %Y, %h:%i %p SGT') AS createdAtText FROM activities WHERE project_id = ? ORDER BY created_at DESC LIMIT 5`;

                db.query(activitySql, [projectId], (activityError, recentActivities) => {
                    if (activityError) return next(activityError);

                    const meetingSql = `SELECT meeting_id AS meetingId, meeting_title AS meetingTitle, DATE_FORMAT(meeting_date, '%Y-%m-%d') AS meetingDate, TIME_FORMAT(meeting_time, '%h:%i %p SGT') AS meetingTime, location, agenda FROM meetings WHERE project_id = ? AND YEARWEEK(meeting_date, 1) = YEARWEEK(CURDATE(), 1) ORDER BY meeting_date, meeting_time`;

                    db.query(meetingSql, [projectId], (meetingError, meetingsThisWeek) => {
                        if (meetingError) return next(meetingError);

                        const reminderTaskSql = `SELECT task_name AS taskName, priority, DATE_FORMAT(due_date, '%d %b %Y') AS dueDate FROM tasks WHERE project_id = ? AND status <> 'Completed' AND due_date >= CURDATE() ORDER BY due_date LIMIT 5`;
                        db.query(reminderTaskSql, [projectId], (reminderTaskError, reminderTasks) => {
                            if (reminderTaskError) return next(reminderTaskError);

                            const reminderMeetingSql = `SELECT meeting_title AS meetingTitle, DATE_FORMAT(meeting_date, '%d %b %Y') AS meetingDate, TIME_FORMAT(meeting_time, '%h:%i %p SGT') AS meetingTime FROM meetings WHERE project_id = ? AND meeting_date >= CURDATE() ORDER BY meeting_date LIMIT 5`;
                            db.query(reminderMeetingSql, [projectId], (reminderMeetingError, reminderMeetings) => {
                                if (reminderMeetingError) return next(reminderMeetingError);

                                const reminders = reminderTasks.map(task => ({
                                    title: task.taskName,
                                    message: "Due " + task.dueDate + " - " + task.priority + " priority",
                                    type: "task"
                                })).concat(reminderMeetings.map(meeting => ({
                                    title: meeting.meetingTitle,
                                    message: meeting.meetingDate + " at " + meeting.meetingTime,
                                    type: "meeting"
                                })));

                                const showRemindersPopup = !req.session.remindersSeen && reminders.length > 0;
                                if (showRemindersPopup) req.session.remindersSeen = true;

                                res.render("dashboard", {
                                    user: res.locals.currentUser,
                                    selectedProject: res.locals.selectedProject,
                                    currentProjectRole: res.locals.currentProjectRole,
                                    dashboard: { completionPercentage, teamProductivity, totalTasks: total },
                                    upcomingDeadlines,
                                    recentActivities,
                                    meetingsThisWeek,
                                    users,
                                    reminders,
                                    showRemindersPopup,
                                    notificationCount: recentActivities.length
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
// =====================================================
// PROJECT MEMBERS
// =====================================================
app.post("/projects/:id/assignmember", requireLogin, requireSelectedProject, requireProjectLeader, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId;
    const userId = req.body.userId;
    const AssignMemberSql = "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'Project Member')";
    db.query(AssignMemberSql, [projectId, userId], (error) => {
        if (error) return next(error);
        res.redirect("/dashboard");
    });
});

// Every project member may view the team list.
app.get("/project-members", requireLogin, requireSelectedProject, (req, res, next) => {
    getProjectMembers(res.locals.selectedProject.projectId, (error, members) => {
        if (error) return next(error);
        res.render("userlist", { members, diplomaOptions, yearSemesterOptions });
    });
});
// =====================================================
// PROFILE
// =====================================================
app.get("/profile", requireLogin, (req, res) => res.render("profile", { user: res.locals.currentUser }));
app.get("/profile/edit", requireLogin, (req, res) => res.render("editprofile", { user: res.locals.currentUser, diplomaOptions, yearSemesterOptions }));

app.post("/profile/edit", requireLogin, uploadProfilePicture.single("profilePicture"), (req, res, next) => {
    const currentUser = res.locals.currentUser, name = cleanText(req.body.name), email = cleanText(req.body.email).toLowerCase();
    if (!name || !email) { req.flash("error", "Name and email are required."); return res.redirect("/profile/edit"); }

    getUserByEmail(email, (emailError, existingUser) => {
        if (emailError) return next(emailError);
        if (existingUser && existingUser.userId !== currentUser.userId) { req.flash("error", "That email is already used by another user."); return res.redirect("/profile/edit"); }
        const pic = req.file ? "/images/profile-pictures/" + req.file.filename : currentUser.profilePicture;
        const values = [name, email, cleanText(req.body.contactNumber), cleanText(req.body.diploma), cleanText(req.body.yearSemester), cleanText(req.body.bio), pic, currentUser.userId];

        db.query(`UPDATE users SET name = ?, email = ?, contact_number = ?, diploma = ?, year_semester = ?, bio = ?, profile_picture = ? WHERE user_id = ?`, values, updateError => {
            if (updateError) return next(updateError);
            req.flash("success", "Your profile has been updated.");
            res.redirect("/profile");
        });
    });
});

app.get("/profile/change-password", requireLogin, (req, res) => res.render("changepassword", { user: res.locals.currentUser }));
app.post("/profile/change-password", requireLogin, (req, res, next) => {
    const cur = res.locals.currentUser, oldP = req.body.currentPassword || "", newP = req.body.newPassword || "", confP = req.body.confirmPassword || "";
    if (!oldP || !newP || !confP) { req.flash("error", "Please complete every password field."); return res.redirect("/profile/change-password"); }
    if (newP.length < 8) { req.flash("error", "The new password must contain at least eight characters."); return res.redirect("/profile/change-password"); }
    if (newP !== confP) { req.flash("error", "The new passwords do not match."); return res.redirect("/profile/change-password"); }
    if (newP === oldP) { req.flash("error", "The new password must be different from the current password."); return res.redirect("/profile/change-password"); }

    db.query(`SELECT password = SHA2(?, 256) AS passwordMatches FROM users WHERE user_id = ?`, [oldP, cur.userId], (error, rows) => {
        if (error) return next(error);
        if (!rows[0] || !rows[0].passwordMatches) { req.flash("error", "The current password is incorrect."); return res.redirect("/profile/change-password"); }
        db.query(`UPDATE users SET password = SHA2(?, 256) WHERE user_id = ?`, [newP, cur.userId], updateError => updateError ? next(updateError) : (req.flash("success", "Your password has been changed."), res.redirect("/profile")));
    });
});

// =====================================================
// TASKS
// =====================================================
app.get("/tasks", requireLogin, requireSelectedProject, (req, res, next) => {
    const sql = `
        SELECT t.task_id AS taskId, t.task_name AS taskName, t.description,
               t.priority, t.status,
               DATE_FORMAT(t.due_date, '%Y-%m-%d') AS dueDate,
               COALESCE(u.name, 'Unassigned') AS assignedUserName
        FROM tasks t
        LEFT JOIN users u ON t.assigned_user_id = u.user_id
        WHERE t.project_id = ?
        ORDER BY t.due_date, t.task_name
    `;
    db.query(sql, [res.locals.selectedProject.projectId], (error, projectTasks) => error ? next(error) : res.render("tasks", { tasks: projectTasks }));
});

app.get("/addtask", requireLogin, requireSelectedProject, (req, res, next) => {
    getProjectMembers(res.locals.selectedProject.projectId, (error, members) => error ? next(error) : res.render("addtask", { members }));
});

app.post("/addtask", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, taskName = cleanText(req.body.taskName), description = cleanText(req.body.description);
    const assignedUserId = req.body.assignedUserId, priority = cleanText(req.body.priority), status = cleanText(req.body.status), dueDate = cleanText(req.body.dueDate);

    db.query(`SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ? LIMIT 1`, [projectId, assignedUserId], (membershipError, membershipRows) => {
        if (membershipError) return next(membershipError);
        if (!taskName || !dueDate || membershipRows.length === 0) { req.flash("error", "Task name, due date and a valid project member are required."); return res.redirect("/addtask"); }
        if (!isValidPriority(priority) || !isValidTaskStatus(status)) { req.flash("error", "Please select a valid priority and status."); return res.redirect("/addtask"); }

        const values = [projectId, taskName, description, assignedUserId, res.locals.currentUser.userId, priority, status, dueDate];
        db.query(`INSERT INTO tasks (project_id, task_name, description, assigned_user_id, created_by_user_id, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, values, insertError => {
            if (insertError) return next(insertError);

            function finishAddingTask() {
                addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' added the task "' + taskName + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Task added successfully."), res.redirect("/tasks")));
            }

            if (status !== "Completed") return finishAddingTask();
            checkAchievements(assignedUserId, achievementError => achievementError ? next(achievementError) : finishAddingTask());
        });
    });
});

app.get("/tasks/:id", requireLogin, requireSelectedProject, (req, res, next) => {
    getTaskById(req.params.id, res.locals.selectedProject.projectId, (error, task) => {
        if (error) return next(error);
        if (!task) { req.flash("error", "Task not found in the selected project."); return res.redirect("/tasks"); }

        const commentSql = `SELECT c.comment_id AS commentId, c.comment, DATE_FORMAT(DATE_ADD(c.created_at, INTERVAL 8 HOUR), '%d %b %Y, %h:%i %p SGT') AS createdAtText, u.name AS userName FROM task_comments c INNER JOIN users u ON c.user_id = u.user_id WHERE c.task_id = ? ORDER BY c.created_at DESC`;
        db.query(commentSql, [task.taskId], (commentError, comments) => {
            if (commentError) return next(commentError);
            res.render("taskdetails", { task: task, assignedUser: task.assignedUserId ? { userId: task.assignedUserId, name: task.assignedUserName } : null, comments });
        });
    });
});

app.post("/tasks/:id/comment", requireLogin, requireSelectedProject, (req, res, next) => {
    const taskId = req.params.id, comment = cleanText(req.body.comment);
    if (!comment) { req.flash("error", "Comment cannot be empty."); return res.redirect("/tasks/" + taskId); }

    getTaskById(taskId, res.locals.selectedProject.projectId, (taskError, task) => {
        if (taskError) return next(taskError);
        if (!task) { req.flash("error", "Task not found in the selected project."); return res.redirect("/tasks"); }

        db.query(`INSERT INTO task_comments (task_id, user_id, comment) VALUES (?, ?, ?)`, [taskId, res.locals.currentUser.userId, comment], insertError => {
            if (insertError) return next(insertError);
            req.flash("success", "Comment added.");
            res.redirect("/tasks/" + taskId);
        });
    });
});

app.get("/tasks/:id/edit", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId;
    getTaskById(req.params.id, projectId, (taskError, task) => {
        if (taskError) return next(taskError);
        if (!task) { req.flash("error", "Task not found in the selected project."); return res.redirect("/tasks"); }
        getProjectMembers(projectId, (memberError, members) => memberError ? next(memberError) : res.render("editTasks", { task, members }));
    });
});

app.post("/tasks/:id/edit", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, taskId = req.params.id, taskName = cleanText(req.body.taskName);
    const assignedUserId = req.body.assignedUserId, priority = cleanText(req.body.priority), status = cleanText(req.body.status), dueDate = cleanText(req.body.dueDate), description = cleanText(req.body.description);

    getTaskById(taskId, projectId, (taskError, task) => {
        if (taskError) return next(taskError);
        if (!task) { req.flash("error", "Task not found in the selected project."); return res.redirect("/tasks"); }

        db.query(`SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ? LIMIT 1`, [projectId, assignedUserId], (membershipError, membershipRows) => {
            if (membershipError) return next(membershipError);
            if (!taskName || !dueDate || membershipRows.length === 0) { req.flash("error", "Please provide valid task information."); return res.redirect("/tasks/" + taskId + "/edit"); }
            if (!isValidPriority(priority) || !isValidTaskStatus(status)) { req.flash("error", "Please select a valid priority and status."); return res.redirect("/tasks/" + taskId + "/edit"); }

            const values = [taskName, description, assignedUserId, priority, status, dueDate, taskId, projectId];
            db.query(`UPDATE tasks SET task_name = ?, description = ?, assigned_user_id = ?, priority = ?, status = ?, due_date = ? WHERE task_id = ? AND project_id = ?`, values, updateError => {
                if (updateError) return next(updateError);

                function finishUpdatingTask() {
                    addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' updated the task "' + taskName + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Task updated successfully."), res.redirect("/tasks/" + taskId)));
                }

                if (status !== "Completed") return finishUpdatingTask();
                checkAchievements(assignedUserId, achievementError => achievementError ? next(achievementError) : finishUpdatingTask());
            });
        });
    });
});

// =====================================================
// MEETINGS
// =====================================================
app.get("/meetings", requireLogin, requireSelectedProject, (req, res, next) => {
    const sql = `SELECT meeting_id AS meetingId, meeting_title AS meetingTitle, DATE_FORMAT(meeting_date, '%Y-%m-%d') AS meetingDate, TIME_FORMAT(meeting_time, '%h:%i %p SGT') AS meetingTime, location, agenda FROM meetings WHERE project_id = ? ORDER BY meeting_date, meeting_time`;
    db.query(sql, [res.locals.selectedProject.projectId], (error, projectMeetings) => error ? next(error) : res.render("meetings", { meetings: projectMeetings }));
});

app.get("/meetings/add", requireLogin, requireSelectedProject, requireProjectLeader, (req, res) => res.render("addmeeting"));

app.post("/meetings/add", requireLogin, requireSelectedProject, requireProjectLeader, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, meetingTitle = cleanText(req.body.meetingTitle), meetingDate = cleanText(req.body.meetingDate);
    const meetingTime = cleanText(req.body.meetingTime), location = cleanText(req.body.location), agenda = cleanText(req.body.agenda);
    if (!meetingTitle || !meetingDate || !meetingTime) { req.flash("error", "Meeting title, date and time are required."); return res.redirect("/meetings/add"); }

    const values = [projectId, meetingTitle, meetingDate, meetingTime, location, agenda, res.locals.currentUser.userId];
    db.query(`INSERT INTO meetings (project_id, meeting_title, meeting_date, meeting_time, location, agenda, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, values, insertError => {
        if (insertError) return next(insertError);
        addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' scheduled the meeting "' + meetingTitle + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Meeting scheduled successfully."), res.redirect("/meetings")));
    });
});

app.get("/meetings/:id", requireLogin, requireSelectedProject, (req, res, next) => {
    getMeetingById(req.params.id, res.locals.selectedProject.projectId, (error, meeting) => error ? next(error) : (!meeting ? (req.flash("error", "Meeting not found in the selected project."), res.redirect("/meetings")) : res.render("meetingdetails", { meeting })));
});

app.get("/meetings/:id/edit", requireLogin, requireSelectedProject, requireProjectLeader, (req, res, next) => {
    getMeetingById(req.params.id, res.locals.selectedProject.projectId, (error, meeting) => error ? next(error) : (!meeting ? (req.flash("error", "Meeting not found in the selected project."), res.redirect("/meetings")) : res.render("editmeeting", { meeting })));
});

app.post("/meetings/:id/edit", requireLogin, requireSelectedProject, requireProjectLeader, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, meetingId = req.params.id, meetingTitle = cleanText(req.body.meetingTitle);
    const meetingDate = cleanText(req.body.meetingDate), meetingTime = cleanText(req.body.meetingTime), location = cleanText(req.body.location), agenda = cleanText(req.body.agenda);

    getMeetingById(meetingId, projectId, (meetingError, meeting) => {
        if (meetingError) return next(meetingError);
        if (!meeting) { req.flash("error", "Meeting not found in the selected project."); return res.redirect("/meetings"); }
        if (!meetingTitle || !meetingDate || !meetingTime) { req.flash("error", "Meeting title, date and time are required."); return res.redirect("/meetings/" + meetingId + "/edit"); }

        const values = [meetingTitle, meetingDate, meetingTime, location, agenda, meetingId, projectId];
        db.query(`UPDATE meetings SET meeting_title = ?, meeting_date = ?, meeting_time = ?, location = ?, agenda = ? WHERE meeting_id = ? AND project_id = ?`, values, updateError => {
            if (updateError) return next(updateError);
            addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' updated the meeting "' + meetingTitle + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Meeting updated successfully."), res.redirect("/meetings/" + meetingId)));
        });
    });
});

app.post("/meetings/:id/delete", requireLogin, requireSelectedProject, requireProjectLeader, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, meetingId = req.params.id;
    getMeetingById(meetingId, projectId, (meetingError, meeting) => {
        if (meetingError) return next(meetingError);
        if (!meeting) { req.flash("error", "Meeting not found in the selected project."); return res.redirect("/meetings"); }

        db.query(`DELETE FROM meetings WHERE meeting_id = ? AND project_id = ?`, [meetingId, projectId], deleteError => {
            if (deleteError) return next(deleteError);
            addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' deleted the meeting "' + meeting.meetingTitle + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Meeting deleted successfully."), res.redirect("/meetings")));
        });
    });
});

// =====================================================
// RETROSPECTIVE
// =====================================================
app.get("/retrospective", requireLogin, requireSelectedProject, (req, res, next) => {
    const sql = `SELECT r.retrospective_id AS retrospectiveId, r.user_id AS userId, u.name AS userName, r.bucket_type AS bucketType, r.content, r.created_at AS createdAt FROM retrospective_items r LEFT JOIN users u ON r.user_id = u.user_id WHERE r.project_id = ? ORDER BY r.created_at DESC`;
    db.query(sql, [res.locals.selectedProject.projectId], (error, projectItems) => {
        if (error) return next(error);
        res.render("retrospective", {
            wentWell: projectItems.filter(item => item.bucketType === "went_well"),
            improvements: projectItems.filter(item => item.bucketType === "improvement"),
            thanks: projectItems.filter(item => item.bucketType === "thanks")
        });
    });
});

app.post("/retrospective/add", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, bucketType = cleanText(req.body.bucketType), content = cleanText(req.body.content);
    if (!isValidBucket(bucketType) || !content) { req.flash("error", "Please enter valid retrospective information."); return res.redirect("/retrospective"); }

    db.query(`INSERT INTO retrospective_items (project_id, user_id, bucket_type, content) VALUES (?, ?, ?, ?)`, [projectId, res.locals.currentUser.userId, bucketType, content], insertError => {
        if (insertError) return next(insertError);
        addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + " added a retrospective entry.", activityError => activityError ? next(activityError) : (req.flash("success", "Retrospective entry added."), res.redirect("/retrospective")));
    });
});

app.post("/retrospective/:id/edit", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, retrospectiveId = req.params.id;
    getRetrospectiveById(retrospectiveId, projectId, (itemError, item) => {
        if (itemError) return next(itemError);
        if (!item) { req.flash("error", "Retrospective entry not found."); return res.redirect("/retrospective"); }
        if (res.locals.currentProjectRole !== "Project Leader" && item.userId !== res.locals.currentUser.userId) { req.flash("error", "You can only edit your own retrospective entries."); return res.redirect("/retrospective"); }

        const bucketType = cleanText(req.body.bucketType), content = cleanText(req.body.content);
        if (!isValidBucket(bucketType) || !content) { req.flash("error", "Please enter valid retrospective information."); return res.redirect("/retrospective"); }

        db.query(`UPDATE retrospective_items SET bucket_type = ?, content = ? WHERE retrospective_id = ? AND project_id = ?`, [bucketType, content, retrospectiveId, projectId], updateError => {
            if (updateError) return next(updateError);
            addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + " updated a retrospective entry.", activityError => activityError ? next(activityError) : (req.flash("success", "Retrospective entry updated."), res.redirect("/retrospective")));
        });
    });
});

app.post("/retrospective/:id/delete", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, retrospectiveId = req.params.id;
    getRetrospectiveById(retrospectiveId, projectId, (itemError, item) => {
        if (itemError) return next(itemError);
        if (!item) { req.flash("error", "Retrospective entry not found."); return res.redirect("/retrospective"); }
        if (res.locals.currentProjectRole !== "Project Leader" && item.userId !== res.locals.currentUser.userId) { req.flash("error", "You can only delete your own retrospective entries."); return res.redirect("/retrospective"); }

        db.query(`DELETE FROM retrospective_items WHERE retrospective_id = ? AND project_id = ?`, [retrospectiveId, projectId], deleteError => {
            if (deleteError) return next(deleteError);
            addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + " deleted a retrospective entry.", activityError => activityError ? next(activityError) : (req.flash("success", "Retrospective entry deleted."), res.redirect("/retrospective")));
        });
    });
});

// =====================================================
// ACHIEVEMENTS
// =====================================================
const achievementLabels = {
    first_task_completed: "First Task Completed",
    early_finisher: "Early Finisher",
    no_overdue_tasks: "No Overdue Tasks",
    team_mvp: "Team MVP"
};

function checkAchievements(userId, callback = () => {}) {
    if (!userId) return callback();

    const sql = `
        SELECT COUNT(*) AS totalCount,
               SUM(status = 'Completed') AS completedCount,
               SUM(status = 'Completed' AND DATE(updated_at) <= due_date) AS earlyCount,
               SUM(status <> 'Completed' AND due_date < CURDATE()) AS overdueCount
        FROM tasks
        WHERE assigned_user_id = ?
    `;
    db.query(sql, [userId], (error, rows) => {
        if (error) return callback(error);
        const stats = rows[0], earnedTypes = [];
        const totalCount = stats.totalCount || 0, completedCount = stats.completedCount || 0;
        if (completedCount >= 1) earnedTypes.push("first_task_completed");
        if (completedCount >= 5) earnedTypes.push("team_mvp");
        if ((stats.earlyCount || 0) >= 1) earnedTypes.push("early_finisher");
        if (totalCount > 0 && (stats.overdueCount || 0) == 0) earnedTypes.push("no_overdue_tasks");
        if (earnedTypes.length === 0) return callback();

        const placeholders = earnedTypes.map(() => "(?, ?, UTC_TIMESTAMP())").join(", ");
        const values = earnedTypes.flatMap(type => [userId, type]);
        db.query(`INSERT IGNORE INTO achievements (user_id, achievement_type, earned_at) VALUES ${placeholders}`, values, callback);
    });
}

app.get("/achievements", requireLogin, (req, res, next) => {
    const userId = res.locals.currentUser.userId;
    const sql = `SELECT achievement_id AS achievementId, achievement_type AS achievementType, DATE_FORMAT(DATE_ADD(earned_at, INTERVAL 8 HOUR), '%d %b %Y, %h:%i %p SGT') AS earnedAtText FROM achievements WHERE user_id = ? ORDER BY earned_at DESC`;
    checkAchievements(userId, achievementError => {
        if (achievementError) return next(achievementError);
        db.query(sql, [userId], (error, rows) => {
            if (error) return next(error);
            const achievements = rows.map(row => ({ ...row, label: achievementLabels[row.achievementType] || row.achievementType }));
            const completedSql = `SELECT COUNT(*) AS completedTaskCount FROM tasks WHERE assigned_user_id = ? AND status = 'Completed'`;
            db.query(completedSql, [userId], (countError, countRows) => {
                if (countError) return next(countError);
                res.render("achievements", {
                    achievements,
                    completedTaskCount: countRows[0].completedTaskCount || 0
                });
            });
        });
    });
});

// =====================================================
// RESOURCES
// =====================================================
app.get("/resources", requireLogin, requireSelectedProject, (req, res, next) => {
    const sql = `
        SELECT r.resources_id AS resourceId, r.resource_name AS resourceName,
               r.description, r.file_name AS fileName, r.file_type AS fileType,
               DATE_FORMAT(r.uploaded_at, '%Y-%m-%d') AS uploadDate,
               u.name AS uploadedBy
        FROM resources r
        LEFT JOIN users u ON r.uploaded_by_user_id = u.user_id
        WHERE r.project_id = ?
        ORDER BY r.uploaded_at DESC
    `;
    db.query(sql, [res.locals.selectedProject.projectId], (error, resources) => error ? next(error) : res.render("resources", { resources }));
});

app.get("/resources/upload", requireLogin, requireSelectedProject, (req, res) => res.render("addresources"));

app.post("/resources/upload", requireLogin, requireSelectedProject, uploadResource.single("resourceFile"), (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId, resourceName = cleanText(req.body.resourceName), description = cleanText(req.body.description);
    if (!resourceName || !req.file) { req.flash("error", "Resource name and file are required."); return res.redirect("/resources/upload"); }

    const fileType = req.file.originalname.split(".").pop().toLowerCase();
    const sql = `
        INSERT INTO resources
            (project_id, resource_name, description, file_name, file_type, uploaded_by_user_id, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [projectId, resourceName, description, req.file.filename, fileType, res.locals.currentUser.userId];
    db.query(sql, values, insertError => {
        if (insertError) return next(insertError);
        addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' uploaded "' + resourceName + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Resource uploaded successfully."), res.redirect("/resources")));
    });
});

app.get("/resources/:id/edit", requireLogin, requireSelectedProject, (req, res, next) => {
    const resourceId = req.params.id, projectId = res.locals.selectedProject.projectId;
    db.query(`SELECT resources_id AS resourceId, resource_name AS resourceName, description, file_name AS fileName, file_type AS fileType FROM resources WHERE resources_id = ? AND project_id = ? LIMIT 1`, [resourceId, projectId], (error, rows) => {
        if (error) return next(error);
        if (rows.length === 0) { req.flash("error", "Resource not found."); return res.redirect("/resources"); }
        res.render("editresources", { resource: rows[0] });
    });
});

app.post("/resources/:id/edit", requireLogin, requireSelectedProject, uploadResource.single("resourceFile"), (req, res, next) => {
    const resourceId = req.params.id, projectId = res.locals.selectedProject.projectId, resourceName = cleanText(req.body.resourceName), description = cleanText(req.body.description);

    db.query(`SELECT file_name AS fileName, file_type AS fileType FROM resources WHERE resources_id = ? AND project_id = ? LIMIT 1`, [resourceId, projectId], (findError, rows) => {
        if (findError) return next(findError);
        if (rows.length === 0) { req.flash("error", "Resource not found."); return res.redirect("/resources"); }

        const fileName = req.file ? req.file.filename : rows[0].fileName;
        const fileType = req.file ? req.file.originalname.split(".").pop().toLowerCase() : rows[0].fileType;

        db.query(`UPDATE resources SET resource_name = ?, description = ?, file_name = ?, file_type = ? WHERE resources_id = ? AND project_id = ?`, [resourceName, description, fileName, fileType, resourceId, projectId], updateError => {
            if (updateError) return next(updateError);
            addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + ' updated resource "' + resourceName + '".', activityError => activityError ? next(activityError) : (req.flash("success", "Resource updated successfully."), res.redirect("/resources")));
        });
    });
});

app.get("/resources/:id/download", requireLogin, requireSelectedProject, (req, res, next) => {
    const resourceId = req.params.id, projectId = res.locals.selectedProject.projectId;
    db.query(`SELECT file_name AS fileName FROM resources WHERE resources_id = ? AND project_id = ? LIMIT 1`, [resourceId, projectId], (error, rows) => {
        if (error) return next(error);
        if (rows.length === 0) { req.flash("error", "Resource not found."); return res.redirect("/resources"); }
        res.download("resources/public/uploads/resources/" + rows[0].fileName);
    });
});

app.post("/resources/:id/delete", requireLogin, requireSelectedProject, (req, res, next) => {
    const resourceId = req.params.id, projectId = res.locals.selectedProject.projectId;
    db.query(`DELETE FROM resources WHERE resources_id = ? AND project_id = ?`, [resourceId, projectId], deleteError => {
        if (deleteError) return next(deleteError);
        addActivity(projectId, res.locals.currentUser.userId, res.locals.currentUser.name + " deleted a resource.", activityError => activityError ? next(activityError) : (req.flash("success", "Resource deleted."), res.redirect("/resources")));
    });
});


// =====================================================
// CALENDAR, TIMELINE AND NOTIFICATIONS
// =====================================================
app.get("/calendar", requireLogin, requireSelectedProject, (req, res, next) => {
    const projectId = res.locals.selectedProject.projectId;
    const taskSql = `
        SELECT task_id AS taskId, task_name AS taskName, description,
               priority, status, DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate
        FROM tasks
        WHERE project_id = ?
    `;
    db.query(taskSql, [projectId], (taskError, tasks) => {
        if (taskError) return next(taskError);

        const meetingSql = `
            SELECT meeting_id AS meetingId, meeting_title AS meetingTitle,
                   DATE_FORMAT(meeting_date, '%Y-%m-%d') AS meetingDate,
                   TIME_FORMAT(meeting_time, '%H:%i') AS meetingTime,
                   TIME_FORMAT(meeting_time, '%h:%i %p SGT') AS meetingTimeText, location
            FROM meetings
            WHERE project_id = ?
        `;
        db.query(meetingSql, [projectId], (meetingError, meetings) => {
            if (meetingError) return next(meetingError);

            const taskEvents = tasks.map(task => ({
                id: "task-" + task.taskId,
                title: task.taskName,
                start: task.dueDate,
                allDay: true,
                color: task.status === "Completed" ? "#198754" : task.priority === "High" ? "#dc3545" : task.priority === "Medium" ? "#fd7e14" : "#0d6efd",
                extendedProps: { type: "task", taskId: task.taskId, description: task.description || "No description", priority: task.priority, status: task.status }
            }));
            const meetingEvents = meetings.map(meeting => ({
                id: "meeting-" + meeting.meetingId,
                title: meeting.meetingTitle,
                start: meeting.meetingDate,
                allDay: true,
                color: "#6f42c1",
                extendedProps: { type: "meeting", meetingId: meeting.meetingId, timeText: meeting.meetingTimeText, location: meeting.location || "Not specified" }
            }));

            const calendarEventsJson = JSON.stringify(taskEvents.concat(meetingEvents)).replace(/</g, "\\u003c");
            res.render("calendar", { calendarEventsJson });
        });
    });
});

app.get("/timeline", requireLogin, requireSelectedProject, (req, res, next) => {
    // Azure MySQL stores the activity time in UTC, so add 8 hours for Singapore.
    const sql = `
        SELECT description,
               DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%d %b %Y, %h:%i %p SGT') AS time
        FROM activities
        WHERE project_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    `;
    db.query(sql, [res.locals.selectedProject.projectId], (error, activities) => error ? next(error) : res.render("timeline", { activities }));
});

app.get("/notifications", requireLogin, requireSelectedProject, (req, res, next) => {
    const sql = `SELECT description, DATE_FORMAT(DATE_ADD(created_at, INTERVAL 8 HOUR), '%d %b %Y, %h:%i %p SGT') AS time FROM activities WHERE project_id = ? ORDER BY created_at DESC LIMIT 20`;
    db.query(sql, [res.locals.selectedProject.projectId], (error, rows) => {
        if (error) return next(error);
        const notifications = rows.map(row => ({ title: "Project Activity", message: row.description, time: row.time }));
        res.render("notification", { notifications });
    });
});

// =====================================================
// SEARCH
// =====================================================
app.get("/search", requireLogin, requireSelectedProject, (req, res, next) => {
    const query = cleanText(req.query.query);
    if (!query) {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/dashboard");
    }

    const projectId = res.locals.selectedProject.projectId;
    const searchTerm = "%" + query + "%";
    const taskSql = `SELECT task_id AS taskId, task_name AS taskName, description, priority, status, DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate FROM tasks WHERE project_id = ? AND (task_name LIKE ? OR description LIKE ?) ORDER BY due_date`;
    const meetingSql = `SELECT meeting_id AS meetingId, meeting_title AS meetingTitle, agenda, DATE_FORMAT(meeting_date, '%Y-%m-%d') AS meetingDate, TIME_FORMAT(meeting_time, '%h:%i %p SGT') AS meetingTime FROM meetings WHERE project_id = ? AND (meeting_title LIKE ? OR agenda LIKE ?) ORDER BY meeting_date, meeting_time`;

    db.query(taskSql, [projectId, searchTerm, searchTerm], (taskError, tasks) => {
        if (taskError) return next(taskError);
        db.query(meetingSql, [projectId, searchTerm, searchTerm], (meetingError, meetings) => {
            if (meetingError) return next(meetingError);
            res.render("searchResults", { query, tasks, meetings, totalResults: tasks.length + meetings.length });
        });
    });
});


// =====================================================
// ERROR HANDLING
// =====================================================
app.use((error, req, res, next) => {
    console.error(error);
    if (error instanceof multer.MulterError) {
        req.flash("error", error.code === "LIMIT_FILE_SIZE" ? "The profile picture must not exceed 5 MB." : "The profile picture could not be uploaded.");
        return res.redirect("/profile/edit");
    }
    if (error.message === "Only JPG, PNG and WEBP images are allowed.") { req.flash("error", error.message); return res.redirect("/profile/edit"); }
    if (error.code === "ER_NO_SUCH_TABLE") {
        const tableMatch = (error.sqlMessage || error.message || "").match(/Table '[^']+\.([^']+)' doesn't exist/i);
        const tableName = tableMatch ? tableMatch[1] : "unknown";
        return res.status(500).send(`Required database table '${tableName}' is missing. Run database_setup.sql, then restart the application.`);
    }
    if (error.code === "ER_DUP_ENTRY") { req.flash("error", "That value already exists in the database."); return res.redirect(req.get("referer") || "/"); }
    res.status(500).send("An unexpected server error occurred. Check the terminal for details.");
});

app.use((req, res) => res.status(404).send("Page not found."));

app.listen(PORT, () => console.log("Server is running on http://localhost:" + PORT));
