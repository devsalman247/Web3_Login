const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  secret = require("../config/env/index").secret;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "is required."],
    },
    email: {
      type: String,
      required: [true, "is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    about: {
      type: String,
      required: [true, "is required."],
    },
    hash: {
      type: String,
      required: [true, "is required"],
    },
    requests: [
      {
        requestId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        status: {
          type: Number,
          enum: [
            0, //requested
            1, //pending
          ],
        },
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    archivedChats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    salt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.setPassword = function () {
  this.salt = bcrypt.genSaltSync();
  this.hash = bcrypt.hashSync(this.hash, this.salt);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.hash);
};

const autoPopulate = function (next) {
  this.populate("groups");
  this.populate("archivedChats");
  next();
};

UserSchema.pre("findOne", autoPopulate);
UserSchema.pre("find", autoPopulate);
UserSchema.pre("findById", autoPopulate);

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this.id,
      name: this.name,
      email: this.email,
    },
    secret,
    { expiresIn: "4h" }
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    name: this.name,
    email: this.email,
    token: this.generateJWT(),
  };
};

UserSchema.methods.toJSON = function () {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    about: this.about,
    requests: this.requests,
    friends: this.friends,
    groups: this.groups,
    blocked: this.blocked,
    archivedChats: this.archivedChats,
  };
};

module.exports = mongoose.model("User", UserSchema);
