import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';

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

// Access data from the 'admin' collection
Admin.find({})
  .then(admins => {
    console.log('Admins:', admins);
    // Handle retrieved admin data as needed
  })
  .catch(err => {
    console.error(err);
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

app.post("/student_login", function(req, res) {
  console.log(req.body);
  res.render("success", {
    userType: "student",
    opType: "login"
  });
  let username = req.body.username;
  let password = req.body.password;
  if (username === "admin" && password === "admin") {
    res.render("success");
  } else {
    res.render("signin_page");
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

app.post("/admin_login", function(req, res) {
  console.log(req.body);
  res.render("success");
});



Admin.find({})
  .then(admins => {
    console.log('Admins:', admins);
    // Handle retrieved admin data as needed
  })
  .catch(err => {
    console.error(err);
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