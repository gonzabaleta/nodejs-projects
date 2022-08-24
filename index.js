import express from "express";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import model from "./models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

// Config dotenv && dirname
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

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

const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) throw new Error(`Error de servidor ${err}`);
  console.log("Escuchando puerto ", PORT);
});
