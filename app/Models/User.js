"use strict";

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }
  // profile() {
  //   return this.hasOne("App/Models/Profile");
  //   news_id
  // }
  // user() {
  //   return this.belongsTo("App/Models/User");
  // }
  news() {
    return this.hasMany("App/Models/News");
  }
  upvotes() {
    return this.hasMany("App/Models/Upvote");
  }
  comments() {
    return this.hasMany("App/Models/Comment");
  }
}

module.exports = User;
