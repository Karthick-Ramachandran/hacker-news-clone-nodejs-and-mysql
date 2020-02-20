"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CommentSchema extends Schema {
  up() {
    this.create("comments", table => {
      table.increments();
      table.integer("user_id").unsigned();
      table.integer("news_id").unsigned();
      table.text("comment");
      table.string("user_name");
      table.timestamps();
    });
  }

  down() {
    this.drop("comments");
  }
}

module.exports = CommentSchema;
