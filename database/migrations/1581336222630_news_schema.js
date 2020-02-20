"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NewsSchema extends Schema {
  up() {
    this.create("news", table => {
      table.increments();
      table
        .integer("user_id")
        .notNullable()
        .unsigned();
      table.string("title");
      table.string("url");
      table
        .foreign("user_id")
        .references("id")
        .inTable("users");
      table.timestamps();
    });
  }

  down() {
    this.drop("news");
  }
}

module.exports = NewsSchema;
