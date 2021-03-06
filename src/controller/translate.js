const translateModel = require("../models/translate");

async function createTranslate(req, res, next) {
  try {

    const response = await translateModel.createTranslate(req.body);

    res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
}

async function getLanguageList(req, res, next) {
  try {
    const response = await translateModel.getLanguageList()

    res.status(200).json({ response })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createTranslate,
  getLanguageList
};
