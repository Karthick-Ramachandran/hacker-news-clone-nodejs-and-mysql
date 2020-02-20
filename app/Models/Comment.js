"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Comment extends Model {
  news() {
    return this.belongsTo("App/Models/News");
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Comment;
