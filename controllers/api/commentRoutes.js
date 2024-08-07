const router = require("express").Router();
const { User, Blog, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/:id", withAuth, async (req, res) => {
  // Above is a get route used to render the log in page.
  try {
    const blogId = req.params.id;
    const blogData = await Blog.findByPk(blogId, {
      include: [
        {
          model: Comment,
          include: [{ model: User, attributes: { exclude: ["password"] } }],
        },
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
      ],
    });
    // Above, we fetch the blog data.
    if (!blogData) {
      res.status(200).json({ message: "No data found!" });
      return;
    }
    // Above we check that the data exists.
    const newBlogData = blogData.get({ plain: true });
    // Above, we set the blog data plain to true

    const loggedIn = req.session.loggedIn;
    // Above we passed in the value to our logged in varaible in sessions.

    res.status(200).render("comment", {
      newBlogData,
      loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/create", withAuth, async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "No data to create blog!" });
      return;
    }

    // Above we check if the req. body exists.

    const user_id = req.session.userId;
    const comment = req.body.comment;
    const blog_id = req.body.blog_id;
    // Above, we get our expected values from the req body
    const newComment = await Comment.create({ comment, blog_id, user_id });
    //Above, we create a new blog with the items from the body

    res
      .status(200)
      .json({ comment: newComment, message: "New comment Created!" });
    // Above is our response to the user once the blog is created.
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



router.delete("/delete", withAuth, async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "No data found" });
      return;
    }

    const commentID = req.body.commentIdInt;
    const commentUserID = req.body.commentUserIDInt;
    const blog_id = req.body.blogIDInt;
    const user_id = req.session.userId;
    

   // Above, we get our values from the body
  



    if (commentUserID === user_id) {
      const deleteComment = await Comment.destroy({
        where: {
          id: commentID,
          blog_id: blog_id,
          user_id: user_id,
        },
      });

      // Above, we delete  comment with all above entries.
      // for this to happen the comment user id must match the user id. 

      res.status(200).json("Delete request successfull!");
    } else {
      res.status(404).json({ message: "Cannot delete other user Comments !" });
      return;
    }

    // Above, we create a new applicant with all the entries.
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});















module.exports = router;
