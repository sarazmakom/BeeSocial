const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
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
            console.log(userId);
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
    db
        .getUserByEmail(req.body.email)
        .then(function(data) {
            return db.checkPassword(req.body.password, data.rows[0].password);
        })
        .then(function(data) {
            if (data == false) {
                throw new Error();
                res.json({
                    error: true
                });
            } else {
                req.session.userId = userId;
                req.session.first = first;
                req.session.last = last;
                req.session.email = email;
            }
        });
    res.json({
        success: true
    });
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
