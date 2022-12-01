import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    cnic: {
      type: Number,
      default: null,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    participated: {
      type: Boolean,
      default: false,
    },
    role: {
      type: Number,
      default: 0, // voter = 0, candidate = 1, admin = 2
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.toJSON = function () {
  return {
    id: this.id,
    googleId: this.googleId,
    mail: this.mail,
    name: this.name,
    photo: this.photo,
    cnic: this.cnic,
    center: this.center,
    participated: this.participated,
    role: this.role,
  };
};

export default mongoose.model("User", UserSchema);
