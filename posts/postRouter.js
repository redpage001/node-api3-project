const express = require('express');

const Posts = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving posts.' });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;

  Posts.getById(id)
      .then(item => {
        if(item){
          res.status(200).end()
        } else {
          res.status(404).json({ message: 'Post with specified ID was nof found.' })
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ messsage: 'Error deleting post with specified ID.'})
      })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const { user_id } = req.post;

  Posts.getById(id, { text, user_id })
    .then(post => {
      Posts.getById(id)
        .then(updatedPost => {
          if(updatedPost){
            res.status(200).json(updatedPost)
          } else {
            res.status(404).json({ message: "Updated post was not found." })
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ message: "Error finding updated post with specified ID." })
        })
    })
    .catch(error => {
      res.status(500).json({ message: 'THere was an error updating the post with specified ID.' })
    })
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  Posts.getById(id)
    .then(post => {
      if(post){
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: 'Post with specified ID was not found.' })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving post with specified ID.' })
    })
}

function validatePost(req, res, next) {
  const { text } = req.body;
  
  if(Object.entries(req.body).length === 0){
    res.status(400).json({ message: 'No User Data.'})
  } else if(!text){
    res.status(400).json({ message: 'Missing required name field.' })
  } else {
    next();
  }
}

module.exports = router;
