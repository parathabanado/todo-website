const mongoose = require("mongoose");
// Define mongoose schemas
const todoSchema= new mongoose.Schema({
    id: String,
    title: String,
    description: String
});
const userSchema = new mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true},
    todoList: [todoSchema]
  });

const User=mongoose.model('User',userSchema);

module.exports={
    User
}