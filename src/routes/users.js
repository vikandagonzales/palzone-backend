const express = require("express");
const router = express.Router();
const userController = require("../controller/users");

router.get("/:user_id", userController.getOneUser);
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = router;
