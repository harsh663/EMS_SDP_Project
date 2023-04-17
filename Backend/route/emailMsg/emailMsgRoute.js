const express = require("express");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const emailMsgRoute = express.Router();
const sendMail = require("../../utils/sendMail");

emailMsgRoute.post("/", authMiddleware, sendMail);

module.exports = emailMsgRoute;
