const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewares/uploads/photoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.put(
  "/profilephoto-upload",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadCtrl
);
userRoutes.get("/", authMiddleware, fetchUsersCtrl);

// Password reset
userRoutes.post("/forget-password-token", forgetPasswordToken);
userRoutes.put("/reset-password", passwordResetCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
//email
userRoutes.post("/generate-verify-email-token",authMiddleware,generateVerificationTokenCtrl);
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl);

//User CRUD
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/update/:id", authMiddleware, updateUserCtrl);
userRoutes.delete("/:id", deleteUsersCtrl);
userRoutes.get("/:id", fetchUserDetailsCtrl);

module.exports = userRoutes;
