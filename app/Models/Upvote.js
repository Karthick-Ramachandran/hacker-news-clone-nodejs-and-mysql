"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Upvote extends Model {
  // relationship
  // a upvote belongs to a user
  // a upvote belongs to a news
  news() {
    return this.belongsTo("App/Models/News");
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Upvote;
