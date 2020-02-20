"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with news
 */
const { validate } = use("Validator");
const News = use("App/Models/News");
class NewsController {
  /**
   * Show a list of all news.
   * GET news
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ view }) {
    return view.render("news.submit");
  }

  /**
   * Render a form to be used for creating a new news.
   * GET news/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async home({ view, auth }) {
    const user = await auth.getUser();
    // const news = await News.all();
    const news = await News.query()
      .where("user_id", user.id)
      .fetch();
    return view.render("home", { news: news.toJSON() });
  }

  /**
   * Create/save a new news.
   * POST news
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth, session }) {
    // user_id
    // news title
    // url
    const body = request.all();
    const user = await auth.getUser();
    const rules = {
      title: "required",
      url: "required"
    };
    const messages = {
      "title.required": "Title is required",
      "url.required": "URL is required"
    };
    const validation = await validate(body, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages());
      return response.redirect("back");
    }
    const news = await new News();
    news.user_id = user.id;
    news.title = body.title;
    news.url = body.url;
    await news.save();
    session.flash({ success: "News created successfully" });
    return response.redirect("/home");
  }

  /**
   * Display a single news.
   * GET news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, view, session, response, auth }) {
    // const news = await News.query()
    //   .where("id", params.id)
    //   .first();
    const user = await auth.getUser();
    const news = await News.find(params.id);
    if (news && news.user_id === user.id) {
      return view.render("news.edit", { news: news.toJSON() });
    } else {
      session.flash({
        error: "News not found or you don't have permission to edit"
      });
      return response.redirect("/home");
    }
  }

  /**
   * Render a form to update an existing news.
   * GET news/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update news details.
   * PUT or PATCH news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session, auth }) {
    const user = await auth.getUser();
    const news = await News.find(params.id);
    const body = request.all();
    if (news && news.user_id === user.id) {
      news.user_id = user.id;
      news.title = body.title;
      news.url = body.url;
      await news.save();
      session.flash({
        success: "News edited successfully"
      });
      return response.redirect("/home");
    } else {
      session.flash({
        error: "News not found or you don't have permission to edit"
      });
      return response.redirect("/home");
    }
  }

  /**
   * Delete a news with id.
   * DELETE news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, session, auth, response }) {
    const user = await auth.getUser();
    const news = await News.find(params.id);
    if (news && news.user_id === user.id) {
      await news.delete();
      session.flash({
        success: "News deleted successfully"
      });
      return response.redirect("/home");
    } else {
      session.flash({
        error: "News not found or you don't have permission to delete"
      });
      return response.redirect("/home");
    }
  }
}

module.exports = NewsController;
