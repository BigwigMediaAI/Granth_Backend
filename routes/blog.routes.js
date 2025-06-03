const router = require("express").Router();
const {
  newBlogPost,
  getBlog,
  getBlogPostBySlug,
  updateBlogPostBySlug,
  deleteBlogPostBySlug,
  searchBlogs,
  searchBlogsByTags,
  postComment,
  getComments,
  deleteComment,
  editComment,
} = require("../controller/Blog.controller");

router.post("/add", newBlogPost);
router.get("/viewblog", getBlog);
router.get("/:slug", getBlogPostBySlug);
router.put("/:slug", updateBlogPostBySlug);
router.delete("/:slug", deleteBlogPostBySlug);
router.get("/search/:query", searchBlogs);
router.get("/tags/:query", searchBlogsByTags);
router.post("/:slug/comments", postComment);
router.get("/:slug/comments", getComments);
router.delete("/:slug/comments/:commentId", deleteComment);
router.put("/:slug/comments/:commentId", editComment);

module.exports = router;
