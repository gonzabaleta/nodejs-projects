const express = require("express");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const model = require("./models/user.js");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-local");
const parseArgs = require("minimist");
const { fork } = require("child_process");

// Config dotenv && dirname
dotenv.config();

// config EXPRESS
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Session
app.use(
  session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 },
  })
);

// Set up Template Engines
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Connect MONGO
const { MONGO_ATLAS_URL } = process.env;
mongoose.connect(MONGO_ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**********
 *
 * PASSPORT
 *
 *********/

app.use(passport.initialize());
app.use(passport.session());

// Password validation helper:
const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

// Create local strategy
passport.use(
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      const user = await model.findOne({ email });

      if (!user) {
        console.log("User not found");
        return done(null, false);
      }

      if (!validatePassword(user, password)) {
        console.log("invalid password");
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => model.findById(id, done));

// ROUTES
app.get("/login", (req, res) => {
  // If user is authenticated, redirect to home, else render login screen
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

// If user is authenticated, redirect to home, else reject login
app.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.send("CREDENCIALES INVALIDAS");
  }
});

// If user is authenticated, render home, else redirect to login
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home", { email: req.user.email });
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("register");
  }
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const user = { email, password: hash };
  const userSaveModel = new model(user);
  await userSaveModel.save();

  res.redirect("/login");
});

app.get("/info", (req, res) => {
  const response = {
    Args: parseArgs(process.argv.slice(2)),
    SO: process.platform,
    Version: process.version,
    rss: process.memoryUsage(),
    Path: process.title,
    ID: process.id,
    Directory: process.cwd(),
  };

  res.send(JSON.stringify(response));
});

app.get("/api/random", (req, res) => {
  const amount = req.query.cant || 100000000;

  const child = fork("./generateNumbers");
  child.send(amount);
  child.on("message", (numbers) => {
    res.json(numbers);
  });
});

// Configure PORT
const args = parseArgs(process.argv.slice(2));
const PORT = args.p || 8080;

app.listen(PORT, (err) => {
  if (err) throw new Error(`Error de servidor ${err}`);
  console.log("Escuchando puerto ", PORT);
});
