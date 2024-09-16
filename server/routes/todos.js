const mongoose = require("mongoose");
const express = require("express");
const {User} = require("../db");
const jwt = require('jsonwebtoken');
const { SECRET } = require("../middleware/auth")
const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(user) {
      if (user) {
        res.status(403).json({ message: 'User already exists' });
      } else {
        const obj = { username: username, password: password };
        const newUser= new User(obj);
        newUser.save();

        const token = jwt.sign({username}, SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
      }
  
    }
    User.findOne({ username }).then(callback);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

router.post('/todos', authenticateJwt, async (req, res) => {
    console.log(req.body);
    const user=await User.findOne({username:req.user.username});
    console.log(req.headers.authorization);
    const {todo_title,todo_description} = req.body;
    const id=Math.floor(Math.random() * 1000000);
    const todo={id,todo_title,todo_description};
    if(user){
        user.todoList.push(todo);
        await user.save();
        res.json({message:"Todo added successfully",id:todo.id});
    }
    else {
        res.status(403).json({ message: 'User not found' });
    }
});

router.put('/todos/:id', authenticateJwt, async (req, res) => {
    const user=await User.findOne({username:req.user.username});
    const todo=await user.findByIdAndUpdate(req.params.id,req.body,{new:true});
    await user.save();
    if(todo){
        res.json({message:"Todo Updated"});
    }
    else{
        res.status(403).json({message:"Todo Id not found"});
      }
});

router.delete('/todos/:id', authenticateJwt, async (req, res) => {
    const user=await User.findOne({username:req.user.username});
    const todo=await user.findByIdAndDelete(req.params.id,{new:true});
    if(todo){
        res.json({message:"Todo Updated"});
    }
    else{
        res.status(403).json({message:"Todo Id not found"});
      }
});
module.exports = router
