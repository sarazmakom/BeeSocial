const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const config = require("./config");
const s3 = require("./s3.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const csurf = require("csurf");

const db = require("./db");

app.use(express.static("public"));

app.use(compression());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const cookieSessionMiddleware = cookieSession({
    secret: `Victoria's secret`,
    maxAge: 1000 * 60 * 60 * 24 * 30
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    db
        .uploadImage(req.session.userId, config.s3Url + req.file.filename)
        .then(function(result) {
            res.json(result.rows[0].image_url);
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/bioupload", function(req, res) {
    console.log(req.body);
    db
        .bioUpload(req.session.userId, req.body.newBio)
        .then(function(data) {
            res.json(data.rows[0].bio);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/user", function(req, res) {
    db
        .loggedUser(req.session.userId)
        .then(function(data) {
            res.json(data.rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/register", function(req, res) {
    db
        .hashPass(req.body.password)
        .then(function(hashedPass) {
            return db.getUsers(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPass
            );
        })
        .then(function(userId) {
            req.session.userId = userId.rows[0].id;
        })
        .then(function() {
            res.json({
                success: true
            });
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.post("/login", function(req, res) {
    let userId, first, last;
    db
        .getUserByEmail(req.body.email)
        .then(function(data) {
            userId = data.rows[0].id;
            first = data.rows[0].first;
            last = data.rows[0].last;
            return db.checkPassword(req.body.password, data.rows[0].password);
        })
        .then(function(data) {
            if (data == false) {
                throw new Error();
            } else {
                req.session.userId = userId;
                req.session.first = first;
                req.session.last = last;
                res.json({
                    success: true
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.json({
                success: false
            });
        });
});

app.get("/users/:id/info", function(req, res) {
    let userId, first, last, profilePic, bio;
    if (req.params.id == req.session.userId) {
        return res.json({
            redirectToProfile: true
        });
    }
    db.getUserById(req.params.id).then(({ rows }) => {
        // console.log("rows are here", rows);
        userId = rows[0].id;
        first = rows[0].first;
        last = rows[0].last;
        profilePic = rows[0].image_url;
        bio = rows[0].bio;
        res.json({
            userId,
            first,
            last,
            profilePic,
            bio
        });
    });
});

app.get("/friendstatus/:id", function(req, res) {
    db.friendStatus(req.session.userId, req.params.id).then(data => {
        res.json(data.rows[0]);
        // console.log("friendstatus", data);
    });
});

app.post("/requestFriendship", function(req, res) {
    db
        .requestFriendship(req.session.userId, req.body.recipient)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.post("/acceptRequest", function(req, res) {
    db
        .acceptRequest(req.body.recipient, req.body.sender)
        .then(data => {
            res.json(data.rows[0]);
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.post("/deleteRequest", function(req, res) {
    db
        .deleteRequest(req.body.sender, req.body.recipient)
        .then(() => {
            res.json({ deleted: true });
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get("/getfriendslist", function(req, res) {
    db
        .getPendingAndFriends(req.session.userId)
        .then(data => {
            console.log("data from index", data.rows);
            res.json(data.rows);
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get("/logout", function(req, res) {
    req.session.userId = null;
    res.redirect("/welcome");
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening on 8080...");
});
//
// let onlineUsers = {};
//
// io.on("connection", function(socket) {
//     if (!socket.request.session || !socket.request.session.userId) {
//         return socket.disconnect(true);
//     }
//     const userId = socket.request.session.userId;
//
//     onlineUsers[socket.id] = userId;
//
// db.getUsersbyIds(Object.values(onlineUsers)).then(({ rows }) => {
//     socket.emit("onlineUsers", rows);
// });
//
//     socket.on("disconnect", function() {
//         delete onlineUsers[socketId];
//     });
// });
