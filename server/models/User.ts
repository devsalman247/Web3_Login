import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema(
  {
    nonce : {
      type : Number,
      required : true
    },
    publicAddress : {
      type : String,
      unique : true,
      lowercase : true
    },
    username : {
      type : String,
      unique : true
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
