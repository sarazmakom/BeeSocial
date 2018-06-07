const express = require("express");
const app = express();
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

app.use(
    cookieSession({
        secret: `Deepest of all the secrets`,
        maxAge: 1000 * 60 * 60 * 24 * 30
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    // console.log(req.csrfToken);
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

app.get("/user", function(req, res) {
    db
        .loggedUser(req.session.userId)
        .then(function(data) {
            // console.log(data.rows[0]);
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
            // console.log(userId);
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
    let userId;
    let first;
    let last;

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

app.listen(8080, function() {
    console.log("I'm listening.");
});
