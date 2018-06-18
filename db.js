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

exports.getUserByEmail = function(email) {
    return db.query(
        `SELECT * FROM users WHERE email = $1
        `,
        [email]
    );
};

exports.getUserById = function(id) {
    return db.query(
        `SELECT * FROM users WHERE id = $1
        `,
        [id]
    );
};

exports.loggedUser = function(id) {
    return db.query(
        `
        SELECT id, first, last, bio, image_url
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.uploadImage = function(id, image_url) {
    return db.query(
        `UPDATE users
        SET image_url = $2
        WHERE id = $1
        RETURNING image_url`,
        [id || null, image_url]
    );
};

exports.bioUpload = function(id, bio) {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING bio`,
        [id || null, bio]
    );
};

exports.requestFriendship = function(sender_id, recipient_id) {
    return db.query(
        `INSERT INTO friendships(sender_id, recipient_id, status)
        VALUES ($1, $2, 1) RETURNING sender_id, recipient_id, status`,
        [sender_id, recipient_id]
    );
};

exports.acceptRequest = function(sender_id, recipient_id) {
    return db.query(
        `UPDATE friendships
        SET status = 2
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`,
        [sender_id, recipient_id]
    );
};

exports.deleteRequest = function(sender_id, recipient_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`,
        [sender_id, recipient_id]
    );
};

exports.getPendingAndFriends = function(id) {
    console.log("running db");
    return db.query(
        `SELECT users.id, first, last, image_url, status
        FROM friendships
        JOIN users
        ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

exports.friendStatus = function(sender_id, recipient_id) {
    return db.query(
        `SELECT status, recipient_id, sender_id FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (sender_id = $1 AND recipient_id = $2)
        ORDER BY created_at DESC LIMIT 1
        `,
        [sender_id, recipient_id]
    );
};

exports.getUsersbyIds = function(arrayOfIds) {
    return db.query(
        `
        SELECT id, first, last, image_url
        FROM users
        WHERE id = ANY($1)`,
        [arrayOfIds]
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
