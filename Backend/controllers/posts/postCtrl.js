const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");


const nodemailer = require('nodemailer');
const cron = require('node-cron');


//----------------------------------------------------------------
//CREATE POST
//----------------------------------------------------------------
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.file);
  const { _id } = req.user;
  //   validateMongodbId(req.body.user);
  console.log('user is here...', req.user);
  console.log('Request is :', req.body);
  //1. Get the oath to img
  const localPath = `public/images/posts/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);
  try {
    const post = await Post.create({
      ...req.body,
      user: _id,
      image: imgUploaded?.url,

    });
    res.json(imgUploaded);
    //Remove uploaded img
    //fs.unlinkSync(localPath);
    var { minutes, hour, day, month, dayofweek } = req.body;
    console.log(minutes, hour, day, month, dayofweek);
    if (minutes == '') {
      minutes = '*';
    } else {
      minutes = `*/${minutes}`;
    }
    if (hour == '') {
      hour = '*';
    } else {
      hour = `*/${hour}`;
    }
    if (day == '') {
      day = '*';
    } else {
      day = `*/${day}`;
    }
    if (month == '') {
      month = '*';
    } else {
      month = `*/${month}`;
    }
    if (dayofweek == '') {
      dayofweek = '*';
    } else {
      dayofweek = `*/${dayofweek}`;
    }
    var recepient = [];
    console.log('Hey man...!');

    var obj = await User.find({});
    for (var i = 0; i < obj.length; i++) {
      if (!obj[i].isAdmin) recepient.push(obj[i].email);
    }
    //email message option
    const mailOptions = {
      from: req.user.email,
      to: recepient,
      subject: req.body.title,
      text: req.body.description,
    };

    //email transport configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    console.log('Sending emails..!');

    console.log('We are here...!');
    cron.schedule(`${minutes} ${hour} ${day} ${month} ${dayofweek}`, () => {
      console.log('Email send..');
      //send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email send: ' + info.response);
        }
      });
    });


  } catch (error) {
    res.json(error);
  }
});

//-------------------------------
//Fetch all posts
//-------------------------------
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  const hasCategory = req.query.category;
  try {
    //check if it has a category
    if (hasCategory) {
      const posts = await Post.find({ category: hasCategory }).populate("user");
      res.json(posts);
    } else {
      const posts = await Post.find({}).populate("user").populate("Register");
      res.json(posts);
    }
  } catch (error) { }
});


//------------------------------
//Fetch a single post
//------------------------------


const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findById(id)
      .populate("user").populate("Register")
    //update number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
// Update post
//------------------------------

const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Delete Post
//------------------------------

const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findOneAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Registration 
//------------------------------

const RegisterToPostCtrl = expressAsyncHandler(async (req, res) => {
  //1.Find the user Register
  const { postId } = req.body;
  const post = await Post.findById(postId).populate('Register')
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Find is this user has Register this event?
  const isRegister = post?.isRegister;
  //4.Chech if this user has Register this event?
  const alreadyRegister = post?.Register?.find(
    userId => userId?.toString() === loginUserId?.toString()
  );
  //5.send msg to the user from Register array if exists
  if (alreadyRegister) {
    res.json("You have alraedy Registered!!");
  }

  if (isRegister) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { Register: loginUserId },
        isRegister: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    //add to Register
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { Register: loginUserId },
        isRegister: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

module.exports = {

  RegisterToPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
};
