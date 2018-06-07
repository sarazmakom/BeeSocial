var spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social"
);

exports.getUsers = function(first, last, email, password, bio, image_url) {
    return db.query(
        `
    INSERT INTO users (first, last, email, password, bio, image_url)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `,
        [
            first || null,
            last || null,
            email || null,
            password || null,
            bio,
            image_url
        ]
    );
};

exports.insertPass = function(hashPass) {
    return db.query(
        `INSERT INTO users password VALUES $1
        `,
        [hashPass]
    );
};

exports.getUserByEmail = function getUserByEmail(email) {
    return db.query(
        `SELECT * FROM users WHERE email = $1
        `,
        [email]
    );
};

exports.hashPass = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            console.log(salt);
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                console.log(bcrypt.hash);
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.checkPassword = function(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};
