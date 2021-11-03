/**********************
Dependencies
***********************/

require('dotenv').config();
const {PORT = 3000, MONGODB_URL} = process.env;
const express = require('express');
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose")

const app = express();

/**********************
Database Connection
***********************/

// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected to Mongo"))
.on("error", (error) => console.log(error))

/**********************
Schema And Model
***********************/

//People Schema
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
});

//Create People Model
const People = mongoose.model("People", PeopleSchema)


/**********************
Middleware
***********************/

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

/**********************
Routes
***********************/

app.get('/', (req, res) => {
    res.send('hello world');
})

//Index Route
app.get("/people", async (req,res) => {
    try {
        res.json( await People.find({}));
    } catch (error) {
        res.status(400).json({error});
    }
});

//Create Route
app.post("/people", async (req,res) => {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json({error});
    }
});

//Update Route
app.put("/people/:id", async (req,res) => {
    try {
        res.json( await People.findByIdAndUpdate(req.params.id, req.body, {new:true}));
    } catch (error) {
        res.status(400).json({error}); 
    }
});

//Delete Route
app.delete('/people/:id', async (req,res) => {
    try{
        res.json( await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json({error}); 
    }
});

/**********************
Listener
***********************/

app.listen(PORT, () => console.log(`listening on port ${PORT}`));