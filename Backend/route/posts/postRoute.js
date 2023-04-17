const express = require("express");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  RegisterToPostCtrl,

} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const { photoUpload, postImgResize, } = require("../../middlewares/uploads/photoUpload");

const postRoute = express.Router();

postRoute.post("/", authMiddleware, photoUpload.single("image"), postImgResize, createPostCtrl);

postRoute.put("/register", authMiddleware, RegisterToPostCtrl);


postRoute.get("/", fetchPostsCtrl);
postRoute.get("/:id", fetchPostCtrl);
postRoute.put("/:id", authMiddleware, updatePostCtrl);
postRoute.delete("/:id", authMiddleware, deletePostCtrl);

module.exports = postRoute;
