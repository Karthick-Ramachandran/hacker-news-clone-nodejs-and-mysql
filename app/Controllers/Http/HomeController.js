"use strict";
const News = use("App/Models/News");
const Upvote = use("App/Models/Upvote");
const Comment = use("App/Models/Comment");
const { validate } = use("Validator");
class HomeController {
  async index({ view, request }) {
    const page = request.get().page || 1;
    const news = await News.query()
      .withCount("upvotes")
      .withCount("comments")
      .orderBy("upvotes_count", "desc")
      .paginate(page, 5);
    // return response.json(news);
    return view.render("welcome", { news: news.toJSON() });
  }
  async new({ view, request }) {
    const page = request.get().page || 1;

    const news = await News.query()
      .orderBy("created_at", "desc")
      .withCount("upvotes")
      .withCount("comments")
      .paginate(page, 5);
    return view.render("new", { news: news.toJSON() });
  }
  async past({ view, request }) {
    //   where
    // orderBy
    const page = request.get().page || 1;

    const news = await News.query()
      .orderBy("created_at", "asc")
      .withCount("upvotes")
      .withCount("comments")
      .paginate(page, 5);
    return view.render("past", { news: news.toJSON() });
  }
  async upvote({ auth, params, session, response }) {
    const user = await auth.getUser();
    const exist = await Upvote.query()
      .where("user_id", user.id)
      .where("news_id", params.id)
      .first();
    if (exist) {
      session.flash({ error: "You already upvoted" });
      return response.redirect("/");
    } else {
      const upvotes = await new Upvote();
      upvotes.user_id = user.id;
      upvotes.news_id = params.id;
      await upvotes.save();
      session.flash({ success: "Upvoted successfully" });
      return response.redirect("back");
    }
  }
  async show({ view, params }) {
    const news = await News.query()
      .where("id", params.id)
      .with("user")
      .with("comments")
      .withCount("comments")
      .first();
    // return response.json(news);
    return view.render("shownews", { news: news.toJSON() });
  }
  async comment({ params, request, response, auth, session }) {
    const body = request.all();
    const user = await auth.getUser();
    const rules = {
      comment: "required|min:10"
    };
    const messages = {
      "comment.required": "Comment is required",
      "comment.min": "Comment should have minimum 10 characters"
    };
    const validation = await validate(body, rules, messages);
    if (validation.fails()) {
      session.withErrors(validation.messages());
      return response.redirect("back");
    }
    const comment = await new Comment();
    comment.user_id = user.id;
    comment.news_id = params.id;
    comment.comment = body.comment;
    comment.user_name = user.name;
    await comment.save();
    session.flash({ success: "You commented successfully" });
    return response.redirect("back");
  }
}

module.exports = HomeController;
