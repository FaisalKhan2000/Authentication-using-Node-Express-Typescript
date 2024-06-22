import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Name"],
  },
  email: {
    type: String,
    unique: [true, "Email already Exist"],
    required: [true, "Please enter Name"],
    validator: validator.default.isEmail,
  },
  refreshToken: {
    type: String,
  },
});

export const User = mongoose.model("User", schema);
