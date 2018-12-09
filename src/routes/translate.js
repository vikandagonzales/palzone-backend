const router = require("express").Router();
const translateController = require('../controller/translate')

router.post('/:user_id', translateController.createTranslate)

module.exports = router
