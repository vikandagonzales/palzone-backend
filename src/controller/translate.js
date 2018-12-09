const translateModel = require("../models/translate");

async function createTranslate(req, res, next) {
  try {
    const userId = req.params.user_id;

    const response = await translateModel.createTranslate(userId, req.body);

    res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTranslate
};