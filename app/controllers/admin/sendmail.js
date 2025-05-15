const emailer = require("../../middleware/emailer");


exports.sendTestMail = async (req, res) => {
    
    try {
      const {email,name,verification}=req.body
      const locale=req.getLocale()
      const user={
        name,
        email,
        verification
      }
      emailer.sendTestMail(locale,user);
      return res.status(404).json(utils.buildErrorObject(404, "email send successfully.", 1001));
    } catch (err) {
      return res.status(500).json(utils.buildErrorMessage(500, "Unable to download invoice", 1001));
    }
  };