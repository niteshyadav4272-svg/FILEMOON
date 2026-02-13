const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
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

/* ===============================
   DUPLICATE MOBILE CHECK
================================ */
userSchema.pre("save", async function () {
  if (!this.isNew) return;

  const count = await this.constructor.countDocuments({
    mobile: this.mobile,
  });

  if (count > 0) {
    throw new Error("mobile number already exists");
  }
});

/* ===============================
   DUPLICATE EMAIL CHECK
================================ */
userSchema.pre("save", async function () {
  if (!this.isNew) return;

  const count = await this.constructor.countDocuments({
    email: this.email,
  });

  if (count > 0) {
    throw new Error("email already exists");
  }
});

/* ===============================
   PASSWORD ENCRYPTION
================================ */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const encryptedPassword = await bcrypt.hash(this.password, 12);
  this.password = encryptedPassword;
});

const UserModel = model("User", userSchema);
module.exports = UserModel;
