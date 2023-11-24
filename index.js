import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import fs from 'fs';
//import bcrypt from 'bcrypt'; // Required for password hashing

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

// Define the schema for student data
const studentSchema = new mongoose.Schema({
  username: String,
  password: String,
  // Other student fields
});

// Define the Student model
const Student = mongoose.model('Student', studentSchema);

// Define the schema for admin data
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  // Other admin fields
});

// Define the Admin model
const Admin = mongoose.model('Admin', adminSchema);

mongoose.connect('mongodb+srv://gprakhar141:myMongo@cluster0.plcr8dz.mongodb.net/yourDatabaseName', { useNewUrlParser: true, useUnifiedTopology: true })

  .then(async () => {
    console.log("Connected to MongoDB database");

    // Call a function to handle data retrieval after the connection is established
    await fetchAdminData();
  })
  .catch(err => {
    console.error("Connection error:", err);
  });

async function fetchAdminData() {
  try {
    const admins = await Admin.find({});
    console.log('Admins:', admins);
    // Handle retrieved admin data as needed
  } catch (err) {
    console.error(err);
  }
}

// Read the JSON file asynchronously
let jsonData;
fs.readFile("./file.json", 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  jsonData = JSON.parse(data);

  // Now, jsonData contains the parsed JSON data
});

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/student_login", function(req, res) {
  res.render("signin_page", {
    userType: "student",
    opType: "login"
  });
});

app.get("/student_signup", function(req, res) {
  res.render("signin_page", {
    userType: "student",
    opType: "signup"
  });
});

app.get("/admin_login", function(req, res) {
  res.render("signin_page", {
    userType: "admin",
    opType: "login"
  });
});

app.post("/student_login", async function(req, res) {
  console.log(req.body);
  const entered_username = req.body.username;
  const entered_password = req.body.password;

  try {
    // Find the student based on the provided username
    const student = await Student.findOne({ username: entered_username });

    if (student) {
      const storedPassword = student.password; // Retrieve stored password from the database

      if (entered_password === storedPassword) {
        // Passwords match, render success page or perform other actions
        res.render("success");
      } else {
        // Passwords do not match
        res.render("error");
      }
    } else {
      // Student not found
      res.render("error");
    }
  } catch (error) {
    // Handle any potential errors that might occur during the process
    console.error(error);
    res.render("error");
  }
});


app.post("/student_signup", function(req, res) {
  console.log(req.body);

  // Create a new Student instance and save it to the database
  const newStudent = new Student({
    username: req.body.username,
    password: req.body.password,
    // Set other student fields as needed
  });

  newStudent.save()
    .then(() => {
      res.render("success");
    })
    .catch(error => {
      console.error(error);
      res.render("error");
    });
});

app.post("/admin_login", async function(req, res) {
  console.log(req.body);
  const entered_username = req.body.username;
  const entered_password = req.body.password;

  try {
    // Find the admin based on the provided username
    const admin = await Admin.findOne({ username: entered_username });

    if (admin) {
      const storedPassword = admin.password; // Retrieve stored password from the database

      if (entered_password === storedPassword) {
        // Passwords match, render success page or perform other actions
        res.render("success");
      } else {
        // Passwords do not match
        res.render("error");
      }
    } else {
      // Admin not found
      res.render("error");
    }
  } catch (error) {
    // Handle any potential errors that might occur during the process
    console.error(error);
    res.render("error");
  }
});


// Routes for Student CRUD operations

app.get("/students", async function(req, res) {
  try {
    const students = await Student.find({});
    res.render("students", { students });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/students/:id", async function(req, res) {
  try {
    const student = await Student.findById(req.params.id);
    res.render("student_details", { student });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/students", async function(req, res) {
  try {
    const newStudent = new Student({
      username: req.body.username,
      password: req.body.password,
      // Set other student fields as needed
    });

    await newStudent.save();
    res.redirect("/students");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/students/:id", async function(req, res) {
  try {
    await Student.findByIdAndUpdate(req.params.id, {
      username: req.body.username,
      password: req.body.password,
      // Update other student fields as needed
    });

    res.send("Student updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/students/:id", async function(req, res) {
  try {
    await Student.findByIdAndRemove(req.params.id);
    res.send("Student deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// ... (rest of your routes)

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
