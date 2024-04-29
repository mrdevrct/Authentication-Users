const mongoose = require("mongoose");

const schema = mongoose.Schema({
  username: {
    type: "string",
    required: true,
    min: 3,
  },

  password: {
    type: "string",
    required: true,
    minLength: 8,
  },

  email: {
    type: "string",
    required: true,
    min: 3,
  },

  lastname: {
    type: "string",
    required: true,
    min: 3,
  },

  firstname: {
    type: "string",
    required: true,
    min: 3,
  },

  phone: {
    type: "string",
    required: true,
    min: 11,
    max : 11,
  },

  role: {
    type: "string",
    // required: true,
    // default: "USER",
  },
});

const model = mongoose.models.User || mongoose.model("User", schema);

export default model;
