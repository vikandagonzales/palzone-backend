const router = require("express").Router();
const translateController = require('../controller/translate')

router.post('/', translateController.createTranslate)
router.get('/', translateController.getLanguageList)

module.exports = router
