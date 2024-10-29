const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                reject('Error hashing password');
            } else {
                resolve(hashedPassword);
            }
        });
    });
}

module.exports = {
    hashPassword
};
