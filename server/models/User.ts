import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema(
  {
    nonce: {
      type: Number,
      default: () => Math.floor(Math.random() * 1000000),
      required: true,
    },
    publicAddress: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

export default mongoose.model("User", UserSchema);
