const User = require('../models/user')
const Post = require('../models/post')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

module.exports = {
  create,
  login,
  postBookMark,
  postLike,
  userLikePosts,
  userBookMarkPosts
}
async function create(req, res) {
  try {
    // NOTE: here we are storing a plaintext password. VERY VERY DANGEROUS. We will replace this in a second:
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS)
    const user = await User.create({username: req.body.username, email:req.body.email, password:hashedPassword,});
    // creating a jwt: 
    // the first parameter specifies what we want to put into the token (in this case, our user document)
    // the second parameter is a "secret" code. This lets our server verify if an incoming jwt is legit or not.
    const token = jwt.sign({ user }, process.env.SECRET,{ expiresIn: '24h' });
    res.status(200).json(token); // send it to the frontend
  } catch (err) {
    res.status(400).json(err);
  }
}


async function login(req,res){
 
  try{
    const user = await User.findOne({username:req.body.username})
    // check password. if it's bad throw an error.
    if (!(await bcrypt.compare(req.body.password, user.password))) throw new Error();
     // if we got to this line, password is ok. give user a new token.
    const token = jwt.sign({ user }, process.env.SECRET,{ expiresIn: '24h' });
    res.status(200).json(token)
  }catch(err){
    res.status(400).json('Bad Credentials');
  }
}

async function postBookMark(req,res){
  try{
    let user = await User.findById(req.body.user)
    if(!user.bookmarks.includes(req.body.postId)){
      user.bookmarks.push(req.body.postId)
      await user.save()
      console.log(user)
      res.status(200).json(user)
    }else{
      res.status(400).json('Bad Credentials');
    }
  }catch(err){
    res.status(400).json('Bad Credentials');
  }
}

async function postLike(req,res){
  try{
    let user = await User.findById(req.body.user)
    if(!user.likes.includes(req.body.postId)){
      user.likes.push(req.body.postId)
      await user.save()
      res.status(200).json(user)
    }else{
      res.status(400).json('Bad Credentials');
    }
  }catch(err){
    res.status(400).json('Bad Credentials');
  }
}

async function userLikePosts(req,res){
  console.log(req.user._id)
  try{
    let user = await User.find({_id:req.user._id}).populate('likes')
    console.log(user)
    // let userLikes = await user.likes.populate('likes')
    
    res.status(200).json(user)
  }catch(err){
    res.status(400).json('Bad Credentials');
  }
}

async function userBookMarkPosts(req,res){
  console.log(req.user._id)
  try{
    // let user = await User.findById(req.user._id)
    let user = await User.find({_id:req.user._id}).populate('bookmarks')
    console.log(user)
    // console.log(user.bookmarks)
    res.status(200).json(user)
  }catch(err){
    res.status(400).json('Bad Credentials');
  }
}