const { Translate } = require("@google-cloud/translate");
const userModel = require("./users");
const { PALZONE_GOOGLE_PROJECT_ID } = process.env;

async function createTranslate(userId, body) {
  let user = await userModel.getOneUser(userId)
  const projectId = PALZONE_GOOGLE_PROJECT_ID;
  const translate = new Translate({
    projectId: projectId
  });

  let target = user.preferred_language;
  let text = body.text;

  console.log("USER TARGET:", target);
  console.log("USER TEXT:", text);

  return translate
  .translate(text, target)
  .then(results => {
    const translation = results[0];

    console.log(`Text: ${text}`);
    console.log(`Translation: ${translation}`);

    return {translation}
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

}

module.exports = {
  createTranslate
};
