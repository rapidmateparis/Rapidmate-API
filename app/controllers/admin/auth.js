const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Role = require("../../models/Role");
const UserAccess = require("../../models/userAccess");
const utils = require("../../middleware/utils");
const { addHours } = require("date-fns");
const { matchedData } = require("express-validator");
const auth = require("../../middleware/auth");
const { runQuery } = require("../../middleware/db");
const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
/*********************
 * Private functions *
 *********************/

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (user) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES;
  // returns signed and encrypted token
  return jwt.sign(
    {
      data: {
        userId: user._id,
      },
      exp: expiration,
    },
    JWT_SECRET_KEY
  )
};

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const getRole = async (role) => {
  const roleData = await Role.findById(role);
  return roleData;
};
const setUserInfo = async (req) => {
  const role = await getRole(req.role);
  let user = {
    _id: req._id,
    username: req.username,
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    role: role?.name,
    verified: req.verified,
  };
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== "production") {
    user = {
      ...user,
      verification: req.verification,
    };
  }
  return user;
};

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req),
    });
    userAccess.save(async (err) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      const userInfo = await setUserInfo(user);
      // Returns data with access token
      resolve({
        token: generateToken(user),
        user: userInfo,
      });
    });
  });
};

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK);
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      if (result) {
        resolve(utils.buildErrObject(409, "BLOCKED_USER"));
      }
    });
  });
};

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      if (result) {
        resolve(true);
      }
    });
  });
};

/**
 * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now
 * @param {Object} user - user object
 */
const blockIsExpired = (user) =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date();

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async (user) => {
  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0;
      user.save((err, result) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message));
        }
        if (result) {
          resolve(true);
        }
      });
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true);
    }
  });
};

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async (user) => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(utils.buildErrObject(409, "BLOCKED_USER"));
    }
    resolve(true);
  });
};

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      { email },
      "password loginAttempts blockExpires username firstName lastName email role verified verification",
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
      resolve(item);
    });
  });
};

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user) => {
  user.loginAttempts += 1;
  await saveLoginAttemptsToDB(user);
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, "WRONG_PASSWORD"));
    } else {
      resolve(blockUser(user));
    }
    reject(utils.buildErrObject(422, "ERROR"));
  });
};

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false,
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, "NOT_FOUND_OR_ALREADY_VERIFIED");
        resolve(user);
      }
    );
  });
};

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.verified = true;
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve({
        email: item.email,
        verified: item.verified,
      });
    });
  });
};

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
const checkPermissions = async (data, next) => {
  return new Promise((resolve, reject) => {
    User.findById(data.id, async (err, result) => {
      utils.itemNotFound(err, result, reject, "NOT_FOUND");
      const role = await getRole(result?.role);
      const roleIdStr = role._id.toString().trim();
      const dataRolesStr = data.roles.toString();
      if (roleIdStr === dataRolesStr) {
        return resolve(next());
      }
      return reject(utils.buildErrObject(401, "UNAUTHORIZED"));
    });
  });
};

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(token,JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, "BAD_TOKEN"));
      }
      resolve(decoded.data.userId);
    });
  });
};

/********************
 * Public functions *
 ********************/

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res) => {
  try {
    const data = matchedData(req);

    const user = await findUser(data.email);
    await userIsBlocked(user);
    await checkLoginAttemptsAndBlockExpires(user);
    const isPasswordMatch = await auth.checkPassword(data.password, user);
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch(user));
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0;
      await saveLoginAttemptsToDB(user);
      return res
        .status(200)
        .json(await saveUserAccessAndReturnToken(req, user));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
  try {
    req = matchedData(req);
    const user = await verificationExists(req.id);
    res.status(200).json(await verifyUser(user));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace("Bearer ", "")
      .trim();
    const userId = await getUserIdFromToken(tokenEncrypted);
    const user = await findUserById(userId);
    const token = await saveUserAccessAndReturnToken(req, user);
    // Removes user info from response
    delete token.user;
    res.status(200).json(token);
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleAuthorization = () => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles: req.user.role,
    };
    data;
    await checkPermissions(data, next);
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.register = async (req, res) => {
  try {
    // const { username, email,password} = req.body; 
    const username="Admin";
    const email="techajsborrne@gmail.com";
    const password="Admin@123$";
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    if (existingUserByUsername) {
      return res.status(400).json({ message: 'User with this username already exists.' });
    }

    // Step 2: Create a role if not already created
    const roleData = {
      name: "admin",  // Example role
      permissions: []
    };
    
    let role = await Role.findOne({ name: roleData.name });
    if (!role) {
      role = new Role(roleData);
      await role.save();
    }

    const userData = {
      username: username,
      firstName: "Ajs",
      lastName: "Borne",
      email: email,
      password: password, 
      role: role._id,
      avatar: "admin.jpg",
      enablePushNotification: true,
      enableEmailNotification: true,
      city: "New Delhi",
      country: "India",
      verification: email,
      verified: true,
    };

    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({
      message: "Admin user registered successfully!",
      user: newUser
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error during registration", error: error.message });
  }
};

