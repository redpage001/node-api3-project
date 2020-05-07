const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      console.log(user)
      res.status(201).json(user)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error creating User" })
    })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  Posts.insert({...req.body, user_id: req.params.id})
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: "Error in adding post." })
    })
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving users." })
    });
});

router.get('/:id', validateUserId, (req, res) => {
  if(req.user){
    res.status(200).json(req.user)
  } else if(!req.user){
    res.status(404).json({ message: "User with specified ID was not be found" })
  }else{
    console.log(error)
    res.status(500).json({ message: "Error retrieving user with specified ID." })
  }
});

router.get('/:id/posts', (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    if(posts.length > 0){
      res.status(200).json(posts)
    } else {
      res.status(404).json({ message: "User with specified ID or Posts by User do no exist." })
    };
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving specified users posts." })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    if(user){
      Users.remove(req.params.id)
        .then(item => {
          if(item > 0){
            res.status(200)
          } else {
            express.status(404).json({ message: 'User with specified ID was not found.' })
          };
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ messsage: 'Error deleting user with specified ID.' })
        })
      res.json(user);
    }else{
      express.status(404).json({ message: 'User with specified ID was not found.' })
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ messsage: 'Error deleting user with specified ID.' })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(req.body)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error updating user with specific ID.'})
    })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user){
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: 'User with the specified ID was not found.' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: 'Error retrieving the user with specified ID.' })
    })
}

function validateUser(req, res, next) {
  if(req.body){
    if(req.body.name){
      next();
    } else {
      res.status(400).json({ message: 'User does not have a name.' });
    }
  } else {
    res.status(400).json({ message: 'User is missing data.' })
  }
}

function validatePost(req, res, next) {
  if(req.body){
    if(req.body.text){
      next();
    }else{
      res.status(400).json({ message: "Missing Required text field." })
    }
  }else{
    res.status(400).json({ message: "Missing post data." })
  }
}

module.exports = router;
