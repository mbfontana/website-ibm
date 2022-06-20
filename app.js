import express from "express";
import { User } from "./model/User.js";
import cookieParser from "cookie-parser";

const app = express();
app.set("view engine", "hbs");
app.set("views", "view");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.listen(3000);

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const response = await User.login(req);

  if (response != undefined) {
    const { token, login, email } = response;
    res.cookie("loginToken", token);
    res.cookie("email", email);
    res.cookie("login", login);
    res.status(200);
    res.json({ token: token, login: login, email: email });
    return;
  }
  res.status(403);
  res.render("login");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const token = await User.register(req);
  if (token != undefined) {
    res.cookie("loginToken", token);
    res.cookie("email", req.body.token);
    res.cookie("login", req.body.login);
    res.redirect("/");
    return;
  }
  res.redirect("register");
});

app.get("/profile", async (req, res) => {
  if (req.cookies && req.cookies.loginToken) {
    res.render("profile");
    return;
  }
  res.redirect("login");
});

app.get("/posts/:login", async (req, res) => {
  const userPosts = await User.getContent(req);
  res.json(userPosts);
});

app.post("/posts/:login", async (req, res) => {
  User.postContent(req);
  res.end();
});

app.get("/posts/:login/:query", async (req, res) => {
  const userPosts = await User.getContent(req);
  res.json(userPosts);
});

app.get("/getCookies", async (req, res) => {
  res.json(req.cookies);
});
