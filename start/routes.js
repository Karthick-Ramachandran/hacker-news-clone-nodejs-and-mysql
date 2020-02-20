"use strict";

const Route = use("Route");

Route.get("/", "HomeController.index");
Route.get("/new", "HomeController.new");
Route.get("/past", "HomeController.past");

Route.get("/register", "AuthController.index");
Route.get("/login", "AuthController.login");

Route.post("/register", "AuthController.register");
Route.post("/login", "AuthController.auth");

Route.get("/logout", "AuthController.logout");
Route.get("/news/comments/:id", "HomeController.show");

Route.group(() => {
  Route.get("/home", "NewsController.home");
  Route.get("/submit", "NewsController.index");
  Route.post("/submit", "NewsController.store");
  Route.get("/news/:id", "NewsController.show");
  // method OVERR
  Route.post("/news/:id", "NewsController.update").as("edit");
  Route.get("/delete/news/:id", "NewsController.destroy");
  Route.post("/upvote/:id", "HomeController.upvote").as("upvote");
  Route.post("/news/comments/:id", "HomeController.comment").as("comment");
}).middleware("authenticated");
