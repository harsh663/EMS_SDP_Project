const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const { sendEmailMsgCtrl } = require("../../controllers/emailMsg/emailMsgCtrl");
const emailMsgRoute = express.Router();

emailMsgRoute.post("/", authMiddleware, sendEmailMsgCtrl);

module.exports = emailMsgRoute;
