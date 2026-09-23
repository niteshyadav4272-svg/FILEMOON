const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {

    image:{
         type: String
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email",
      ],
    },

    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);



userSchema.pre("save", async function () {
  if (!this.isNew) return;

  const count = await this.constructor.countDocuments({
    mobile: this.mobile,
  });

  if (count > 0) {
    throw new Error("mobile number already exists");
  }
});


userSchema.pre("save", async function () {
  if (!this.isNew) return;
  const count = await this.constructor.countDocuments({
    email: this.email,
  });

  if (count > 0) {
    throw new Error("email already exists");
  }
});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
  this.password = encryptedPassword;
});

const UserModel = model("User", userSchema);
module.exports = UserModel;
