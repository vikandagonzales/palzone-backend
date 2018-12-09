const userModel = require("../models/users");

function getOneUser(req, res, next) {
  if (!req.params.user_id) {
    return next({ status: 400, message: "No user id" });
  }
  userModel
    .getOneStaff(req.params.user_id)
    .then(data => {
      res.status(200).send({ data });
    })
    .catch(next);
}

function getAllUsers(req, res, next) {
  userModel
    .getAllUsers()
    .then(data => {
      delete data.password;
      res.status(200).send({ data });
    })
    .catch(next);
}

function createUser(req, res, next) {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.password
  ) {
    return next({ status: 400, message: "Need proper user inputs" });
  }
  userModel
    .createStaff(req.body)
    .then(data => {
      delete data.password;
      res.status(201).send({ data });
    })
    .catch(next);
}

module.exports = {
  getAllUsers,
  getOneUser,
  createUser
};
