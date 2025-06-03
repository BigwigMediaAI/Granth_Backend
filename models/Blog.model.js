const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userImage:{
    type:String,
    required:true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: false
  },
  datePublished: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
  },
  metaDescription: {
    type: String,
    required: false
  },
  comments: [commentSchema]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
