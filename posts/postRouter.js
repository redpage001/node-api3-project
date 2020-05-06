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

router.get('/:id', (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    };
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving post.'});
  })
});

router.delete('/:id', (req, res) => {
  Posts.getById(req.params.id)
      .then(post => {
        if(post){
          Posts.remove(req.params.id)
            .then(item => {
              if(item > 0){
                res.status(200)
              } else {
                express.status(404).json({ message: 'Post with specified ID was not found.'});
              };
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({ messsage: 'Error deleting post with specified ID.'})
            })
          res.json(post);
        }else{
          express.status(404).json({ message: 'Post with specified ID was not found.'});
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ messsage: 'Error deleting post with specified ID.'})
      })
});

router.put('/:id', (req, res) => {
  Posts.getById(req.params.id)
    .then(post => {
      if(post){
        let updatedPost = { ...req.body, user_id: post.user_id }
        Posts.update(req.params.id, updatedPost)
          .then(count => {
            if(count === 1){
              res.status(200).json(updatedPost)
            } else {
              res.status(404).json({ message: 'Post with specified ID was not found.'})
            }
          })
          .catch(error => {
            res.status(500).json({ message: 'Error updating posts.'})
          })
      }
    })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
