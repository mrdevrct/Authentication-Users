const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return false;
    } else {
      await mongoose.connect("mongodb://localhost:27017/next-auth");
      console.log("Connected to Database :)");
    }
  } catch (e) {
    console.log(e);
  }
};

export default connectToDB;