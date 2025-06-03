const BlogPost = require("../models/Blog.model");

exports.newBlogPost = async (req, res) => {
    try {
        const { title, content, author, excerpt, image, tags, slug, status, metaDescription } = req.body;
        const Data = new BlogPost({ title, content, author, excerpt, image, tags, slug, status, metaDescription });
        await Data.save();
        res.status(200).send({ msg: "Blog post successfully created" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({ msg: "Duplicate key error: A blog post with this slug already exists", error });
        } else {
            res.status(500).send({ msg: "Invalid data", error });
        }
    }
};

exports.getBlog = async (req, res) => {
    try {
        const data = await BlogPost.find();
        if (!data) {
            res.status(401).json({ msg: "data not found" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getBlogPostBySlug = async (req, res) => {
    const { slug } = req.params;
  
    try {
        const blogPost = await BlogPost.findOne({ slug });
  
        if (!blogPost) {
            return res.status(404).json({ msg: 'Blog post not found' });
        }
  
        res.status(200).json(blogPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updateBlogPostBySlug = async (req, res) => {
    const { slug } = req.params;
    const { title, content, author, excerpt, image, tags, status, metaDescription } = req.body;
  
    try {
        const updatedBlogPost = await BlogPost.findOneAndUpdate(
            { slug },
            { title, content, author, excerpt, image, tags, status, metaDescription, lastUpdated: Date.now() },
            { new: true, runValidators: true }
        );
  
        if (!updatedBlogPost) {
            return res.status(404).json({ msg: "Blog post not found" });
        }
  
        res.status(200).json({ msg: "Blog post updated successfully", updatedBlogPost });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.deleteBlogPostBySlug = async (req, res) => {
    const { slug } = req.params;
  
    try {
        const deletedBlogPost = await BlogPost.findOneAndDelete({ slug });
  
        if (!deletedBlogPost) {
            return res.status(404).json({ msg: "Blog post not found" });
        }
  
        res.status(200).json({ msg: "Blog post deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};




// Search blogs by title or tags
exports.searchBlogs = async (req, res) => {
    const { query } = req.params;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
  
         // Constructing a case-insensitive regex pattern for the search query
         const searchPattern = new RegExp(query, 'i');
  
         // Querying blogs based on title or tags containing the search pattern
         const blogs = await BlogPost.find({
           $or: [
             { title: { $regex: searchPattern } },
             { tags: { $in: [query] } } 
           ]
         });
  
      if (blogs.length === 0) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      res.json(blogs);
    } catch (error) {
      console.error('Error searching blogs:', error);
      res.status(500).json({ error: 'An error occurred while searching for blogs' });
    }
  };

  // Search blogs by tags
exports.searchBlogsByTags = async (req, res) => {
    const { query } = req.params;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
      // Querying blogs based on tags containing the search query
      const blogs = await BlogPost.find({
        tags: { $in: [query] }
      });
  
      if (blogs.length === 0) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      res.json(blogs);
    } catch (error) {
      console.error('Error searching blogs:', error);
      res.status(500).json({ error: 'An error occurred while searching for blogs' });
    }
  };
  



  // Controller for posting a comment
  exports.postComment = async (req, res) => {
    const { slug } = req.params;
    const { username, text, userImage } = req.body;
  
    try {
      const blogPost = await BlogPost.findOne({ slug });
  
      if (!blogPost) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      const newComment = {
        username,
        text,
        userImage,
        date: new Date()
      };
  
      blogPost.comments.push(newComment);
      await blogPost.save();
  
      res.status(201).json({ msg: 'Comment added', comments: blogPost.comments });
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  };
  
  // Controller for getting comments of a specific blog post
  exports.getComments = async (req, res) => {
    const { slug } = req.params;
  
    try {
      const blogPost = await BlogPost.findOne({ slug });
  
      if (!blogPost) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      res.status(200).json(blogPost.comments);
    } catch (error) {
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  };

  // Controller for deleting a comment
exports.deleteComment = async (req, res) => {
  const { slug, commentId } = req.params;
  const { username } = req.body;  // Assuming you send the username from the client

  try {
    // Find the blog post by slug
    const blogPost = await BlogPost.findOne({ slug });

    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Find the comment by ID
    const commentIndex = blogPost.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if the username matches the comment's username (i.e., the user is the owner)
    if (blogPost.comments[commentIndex].username !== username) {
      return res.status(403).json({ msg: 'You can only delete your own comment' });
    }

    // Remove the comment from the blog post
    blogPost.comments.splice(commentIndex, 1);

    // Save the updated blog post
    await blogPost.save();

    res.status(200).json({ msg: 'Comment deleted successfully', comments: blogPost.comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};

  
exports.editComment = async (req, res) => {
  const { slug, commentId } = req.params;
  const { username, text } = req.body;  // Assuming you send the username and the updated comment text from the client

  if (!text || text.trim() === '') {
    return res.status(400).json({ msg: 'Comment text cannot be empty' });
  }

  try {
    // Find the blog post by slug
    const blogPost = await BlogPost.findOne({ slug });

    if (!blogPost) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Find the comment by ID
    const commentIndex = blogPost.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if the username matches the comment's username (i.e., the user is the owner)
    if (blogPost.comments[commentIndex].username !== username) {
      return res.status(403).json({ msg: 'You can only edit your own comment' });
    }

    // Update the comment text
    blogPost.comments[commentIndex].text = text;
    blogPost.comments[commentIndex].date = new Date(); // Optional: Update the date of the comment edit

    // Save the updated blog post
    await blogPost.save();

    res.status(200).json({ msg: 'Comment updated successfully', comment: blogPost.comments[commentIndex] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};
