const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const { name } = req.body;

  Users.insert({ name })
       .then(user => {
         res.status(201).json(user)
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error creating user" })
       })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  const { id: user_id } = req.user;
  const { text } = req.body;
  console.log(req.user)

  Posts.insert({ text, user_id })
       .then(post => {
          res.status(201).json(post)
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error in adding post" })
       })
});

router.get('/', (req, res) => {
  Users.get()
       .then(users => {
         res.status(200).json(users)
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error retrieving users" })
       })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
       .then(posts => {
         console.log(posts)
         if(posts.length > 0){
           res.status(200).json(posts)
         }else{
           res.status(404).json({ message: "The specified user has no posts" })
         }
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error retrieving posts from user with specified id" })
       })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  Users.remove(id)
      .then(item => {
        if(item){
          res.status(204).end()
        }else{
          res.status(404).json({ message: "The specified user not found"})
        }
      })
      .catch(error => {
        console.log( error )
        res.status(500).json({ message: "Error deleting user with specified id" })
      })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Users.update(id, { name })
       .then(user => {
          Users.getById(id)
               .then(updatedUser => {
                 if(updatedUser){
                   res.status(200).json(updatedUser)
                 }else{
                   res.status(404).json({ message: "Updated user can not be found" })
                 }
               })
               .catch(error => {
                 console.log( error )
                 res.status(500).json({ message: "Error finding updated user with specified id" })
               })
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "There was an error updating the user with specified id" })
       })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  Users.getById(id)
       .then(user => {
         if(user){
           req.user = user;
           next();
         }else{
           res.status(404).json({ message: "User with specified id could not be found" })
         }
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error retrieving user with specified id" })
       })
}

function validateUser(req, res, next) {
  const { name } = req.body;
 
  if(Object.entries(req.body).length === 0){
    res.status(400).json({ message: 'No User Data' })
  }else if(!name){
    res.status(400).json({ message: 'Missing required name field' })
  }else{
    next();
  }
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
