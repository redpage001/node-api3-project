const express = require('express');
const Posts = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
       .then(posts => {
         res.status(200).json(posts)
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error retrieving posts" })
       })
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
       .then(item => {
          if(item){
            res.status(200).end()
          }else{
            res.status(404).json({ message: "Post with specified id not found" })
          }
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error deleting post with specified id" })
       })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const { user_id } = req.post;

  Posts.update(id, { text, user_id })
       .then(post => {
          Posts.getById(id)
               .then(updatedPost => {
                 if(updatedPost){
                   res.status(200).json(updatedPost)
                 }else{
                  res.status(404).json({ message: "Updated post can not be found" })
                 }
               })
               .catch(error => {
                console.log( error )
                res.status(500).json({ message: "Error finding updated post with specified id" })
               })
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "There was an error updating the post with specified id" })
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
          }else{
            res.status(404).json({ message: "Post with specified id could not be found" })
          }
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error retrieving post with specified id" })
       })
}

function validatePost(req, res, next) {
  const { text } = req.body;
 
  if(Object.entries(req.body).length === 0){
    res.status(400).json({ message: 'No User Data' })
  }else if(!text){
    res.status(400).json({ message: 'Missing required text field' })
  }else{
    next();
  }
}

module.exports = router;
