const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        validate: {
          validator: validator.isEmail,
          message: 'EMAIL_IS_NOT_VALID'
        },
        lowercase: true,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    avatar: { type: String, required: false },
    token: { type: String, required: false },
    webToken: { type: String, required: false },
    enablePushNotification: { type: Boolean, default: true },
    enableEmailNotification: { type: Boolean, default: true },
    logoutOn: { type: Date, required: false },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    verification: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { timestamps: true }
);

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error);
    }
    user.password = newHash;
    return next();
  });
};
const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    return hash(user, salt, next);
  });
};

UserSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;
  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});
UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
};
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
