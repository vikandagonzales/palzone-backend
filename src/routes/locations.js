const express = require("express");
const router = express.Router();
const locationController = require("../controller/locations");

router.post("/", locationController.getOneLocation);
router.get("/", locationController.getAllLocations);

module.exports = router;
