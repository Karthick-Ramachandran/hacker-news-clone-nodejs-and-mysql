"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UpvoteSchema extends Schema {
  up() {
    this.create("upvotes", table => {
      table.increments();
      table.integer("user_id").unsigned();
      table.integer("news_id").unsigned();
      table
        .foreign("news_id")
        .references("id")
        .inTable("news");
      table.timestamps();
    });
  }

  down() {
    this.drop("upvotes");
  }
}

module.exports = UpvoteSchema;
