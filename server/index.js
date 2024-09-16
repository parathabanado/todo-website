const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRouter = require("./routes/todos");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/todos", todoRouter)
app.get("/", (req, res) => res.json({msg: "hello world after the class"}));

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://parathacodes:parathacodespassword@cluster0.cv2fstq.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Todo-Users" });

app.listen(3000, () => console.log('Server running on port 3000'));
