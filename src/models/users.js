const knex = require("../../db");
const bcrypt = require("bcrypt-as-promised");

function getOneUser(user_id) {
  return knex("users")
    .where({ id: user_id })
    .first();
}

function getUserByEmail(email) {
  return knex("users")
    .where({ email: email })
    .first();
}

function getAllUsers() {
  return knex("users").returning("*");
}

function createUser(body) {
  return getUserByEmail(body.email)
    .then(data => {
      if (data)
        throw {
          status: 400,
          message: "User email already exists"
        };
      return bcrypt.hash(body.password, 10);
    })
    .then(new_password => {
      return knex("users")
        .insert({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password: new_password,
          photo: body.photo
        })
        .returning("*");
    })
    .then(function([{ password, ...data }]) {
      return data;
    });
}

module.exports = {
  getOneUser,
  getUserByEmail,
  getAllUsers,
  createUser
};
