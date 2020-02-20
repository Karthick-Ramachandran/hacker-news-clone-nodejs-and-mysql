"use strict";
const User = use("App/Models/User");
const { validate } = use("Validator");
class AuthController {
  async index({ view }) {
    return view.render("auth.register");
  }
  async login({ view }) {
    return view.render("auth.login");
  }
  async register({ request, response, session }) {
    const body = request.all();
    const rules = {
      email: "required|email|unique:users",
      name: "required|min:4|max:30",
      password: "required|min:6"
    };
    const messages = {
      "email.required": "Email should be required",
      "email.unique": "Email is already used",
      "name.required": "Name is required",
      "name.min": "Name should have 4 characters",
      "name.max": "Name characters execeede, It should only have 4-30"
    };
    const validations = await validate(body, rules, messages);
    if (validations.fails()) {
      session.withErrors(validations.messages());
      return response.redirect("back");
    }
    const user = await new User();
    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    await user.save();
    session.flash({ success: "Registeration completed, Please login" });
    return response.redirect("/login");
  }
  async auth({ request, response, session, auth }) {
    const body = request.all();
    const rules = {
      email: "required|email",
      password: "required"
    };
    const messages = {
      "email.required": "Email should be required",
      "password.required": "Password is required"
    };
    const validations = await validate(body, rules, messages);
    if (validations.fails()) {
      session.withErrors(validations.messages());
    }
    await auth.attempt(body.email, body.password);
    session.flash({ success: "You are logged in" });
    return response.redirect("/home");
  }

  async logout({ auth, response, session }) {
    await auth.logout();
    session.flash({ success: "You are logged out" });
    return response.redirect("/login");
  }
}

module.exports = AuthController;
