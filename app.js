// Import required modules and set up Express
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const path = require("path");
const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Define port
const port = process.env.PORT || 8000;

// MongoDB connection
mongoose.connect("mongodb+srv://aashu123:IpqI6cwvONcH3Axz@aayushfinance.odq1jqp.mongodb.net/aayushfinance?retryWrites=true&w=majority&", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create data schemas
const dataSchema = new mongoose.Schema({
  name: String,
  emailId: String,
  currentbalance: Number,
});

const tranSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  ts: Date,
});

const Data = mongoose.model("Data", dataSchema);
const Tran = mongoose.model("Tran", tranSchema);

const data1 = new Data({
    name: "Rajesh Sharma",
    emailId: "rajeshsharma@gmail.com",
    currentbalance: 30000
});

const data2 = new Data({
    name: "Rishabh Pant",
    emailId: "rishabhpant2@gmail.com",
    currentbalance: 50000
});

const data3 = new Data({
    name: "Aashutosh Mishra",
    emailId: "am199@gmail.com",
    currentbalance: 60000
});

const data4 = new Data({
    name: "Sarthak gupta",
    emailId: "sarthak56@gmail.com",
    currentbalance: 80000
});

const data5 = new Data({
    name: "Jai kumar shukla",
    emailId: "js78@gmail.com",
    currentbalance: 89000
});

const data6 = new Data({
    name: "Sonali Singh",
    emailId: "ss1992@gmail.com",
    currentbalance: 80000
});

const data7 = new Data({
    name: "Diksha yadav",
    emailId: "yadavd99@gmail.com",
    currentbalance: 70000
});

const data8 = new Data({
    name: "Dilip kumar yadav",
    emailId: "dkyadav88@gmail.com",
    currentbalance: 30000
});

const data9 = new Data({
    name: "Raunak Tyagi",
    emailId: "rtyagi8@gmail.com",
    currentbalance: 80000
});

const data10 = new Data({
    name: "Raksha patel",
    emailId: "Raksha40@gmail.com",
    currentbalance: 50000
});

const defaultData = [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10];






  

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Define a route to serve the index1.html file
app.get("/index1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index1.html"));
});

// Routes and handlers
app.get("/customer", function (req, res) {
  Data.find({}, function (err, foundData) {
    if (foundData.length === 0) {
      Data.insertMany(defaultData, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Default data inserted into the database");
        }
      });
      res.redirect("/customer");
    } else {
      res.render("customer", { newData: foundData });
    }
  });
});

app.get("/customer/:data", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.data);

  Data.find({ name: { $ne: req.params.data } }, function (err, founddata) {
    Data.find({ name: req.params.data }, function (err, usr) {
      res.render("customerdata", {
        name: usr[0].name,
        emailId: usr[0].emailId,
        currentbalance: usr[0].currentbalance,
        newdata: founddata,
      });
    });
  });
});

app.post("/customer/:data", function (req, res) {
  const amount = req.body.inputvalue;
  const reqTitle = req.body.actholder;
  Data.updateOne({ name: reqTitle }, {
    $inc: { currentbalance: amount }
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Balance updated successfully for recipient");
    }
  });

  Data.updateOne({ name: req.params.data }, {
    $inc: { currentbalance: -amount }
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Balance updated successfully for sender");
    }
  });

  Tran.create(new Tran({
    from: req.params.data,
    to: reqTitle,
    amount: amount,
    ts: new Date()
  }), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Transaction entry saved");
    }
  });

  res.redirect("/success");
});

app.get("/success", function (req, res) {
  res.render("success");
});

app.get("/transaction", function (req, res) {
  Tran.find({}, function (err, transactions) {
    res.render("transaction", { newData: transactions });
  });
});

// Route to add new customer data
app.get("/adddetails", function (req, res) {
  res.render("adddetails");
});

app.post("/adddetails", function (req, res) {
  const { name, emailId, currentbalance } = req.body;

  const newData = new Data({
    name: name,
    emailId: emailId,
    currentbalance: currentbalance
  });

  newData.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("New customer data added successfully");
      res.redirect("/customer");
    }
  });
});

// Start the server
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
