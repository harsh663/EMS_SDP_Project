const expressAsyncHandler = require("express-async-handler");
const EmailMsg = require("../../model/EmailMessaging/EmailMessaging");
const sendMail = require("../../utils/sendMail");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    //buld up msg
    const msg = {
      to: req?.body?.to,
      subject: req?.body?.subject,
      text: req?.body?.message,
      from: process.env.USER,
    };


    // send mail
    await sendMail(to, subject, message);


    //save to our db
    await EmailMsg.create({
      sentBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });
    res.json("Mail sent");
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };
