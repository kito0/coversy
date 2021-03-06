const User = require('../models/user.model');
const Rate = require('../models/rate.model');
const escape = require('escape-html');
const aws = require('aws-sdk');
const {
  updateValidation,
  updateValidationAdmin,
} = require('../util/validation');
const { checkSamePeriod, checkRatelogHasPeriod } = require('../util/date.util');

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_DEFAULT_REGION,
});
const s3 = new aws.S3();

/** @module user_controller */

/**
 * This function returns users by user id.
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User corresponding to the id
 */
exports.getUserById = async (req, res) => {
  const userId = escape(req.params.userId);

  try {
    const user = await User.findById(userId).lean().populate('site');
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function returns users by site.
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object[]} - Users corresponding to the site
 */
exports.getUsersBySite = async (req, res) => {
  const siteId = escape(req.params.siteId);

  try {
    const users = await User.find({ site: siteId, type: 2 }).lean();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function updates users by id.
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Updated user
 */
exports.updateUserById = async (req, res) => {
  const updateQuery = {};
  if (req.body.firstName) updateQuery.firstName = escape(req.body.firstName);
  if (req.body.lastName) updateQuery.lastName = escape(req.body.lastName);
  if (req.body.phone) updateQuery.phone = escape(req.body.phone);
  if (req.body.email) updateQuery.email = escape(req.body.email);
  if (req.body.avatar) updateQuery.avatar = escape(req.body.avatar);
  if (req.body.bio) updateQuery.bio = escape(req.body.bio);
  if (req.body.verified) updateQuery.verified = escape(req.body.verified);
  if (req.body.site) updateQuery.site = escape(req.body.site);
  const userId = escape(req.params.userId);

  const { error } = updateValidation(updateQuery);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const user = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    }).populate('site');
    if (!user) return res.status(404).json('Error: User ID does not exist.');
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function updates users by id as admin
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Updated user
 */
exports.updateUserAsAdmin = async (req, res) => {
  const userId = escape(req.params.userId);
  const updateQuery = {};
  if (req.body.firstName) updateQuery.firstName = escape(req.body.firstName);
  if (req.body.lastName) updateQuery.lastName = escape(req.body.lastName);
  if (req.body.hourlyRate) updateQuery.hourlyRate = escape(req.body.hourlyRate);
  if (req.body.taxRate) updateQuery.taxRate = escape(req.body.taxRate);

  const { error } = updateValidationAdmin(updateQuery);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const user = await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });
    if (!user) return res.status(404).json('Error: User ID does not exist.');

    const rate = await Rate.findOne({ user: userId });
    if (!rate) {
      rate = await Rate.create({
        user: userId,
        site: user.site,
        ratelog: {
          hourlyRate: user.hourlyRate,
          taxRate: user.taxRate,
        },
      });
    }

    const currDate = new Date();
    if (!checkRatelogHasPeriod(rate.ratelog, currDate)) {
      rate.ratelog.push({
        date: currDate,
        hourlyRate: user.hourlyRate,
        taxRate: user.taxRate,
      });
    }
    for (let i = 0; i < rate.ratelog.length; i++) {
      if (checkSamePeriod(rate.ratelog[i].date, currDate)) {
        rate.ratelog[i].hourlyRate = user.hourlyRate;
        rate.ratelog[i].taxRate = user.taxRate;
      }
    }
    await rate.save();

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function activates/deactivates users by id.
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User activation toggled
 */
exports.toggleUserActivatedById = async (req, res) => {
  const userId = escape(req.params.userId);
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    return res.status(404).send('User not found.');
  }

  if (!user) return res.status(404).json('Error: User ID does not exist.');
  if (user.site != req.user.site)
    return res.status(404).json('User is not part of this site.');

  try {
    user.activated = !user.activated;

    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function gets the users Profile Picture
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - User profile picture
 */
exports.getProfilePicture = async (req, res) => {
  try {
    const fileKey = escape(req.params.key);
    const downloadParams = {
      Key: fileKey,
      Bucket: process.env.S3_PROFILE_BUCKET,
    };

    const readStream = await s3.getObject(downloadParams);
    readStream
      .createReadStream()
      .on('error', (err) => {
        return res.status(err.statusCode).json(err.message);
      })
      .pipe(res);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function checks if a password reset code exists
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {String} - Password verification message
 */
exports.findUserByPasswordResetCode = async (req, res) => {
  const passwordResetCode = escape(req.params.code);

  try {
    const user = await User.findOne({ passwordResetCode }).lean();

    if (!user) {
      return res.status(404).json('Error: Password reset code not exist.');
    }

    return res.status(200).json('Password reset code is valid.');
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

/**
 * This function updates the users Profile Picture
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Updated user profile picture
 */
exports.updateProfilePicture = async (req, res) => {
  if (!req.file) return res.status(400).send('No image uploaded');
  const userId = escape(req.params.userId);

  try {
    let user = await User.findById(userId).populate('site');
    if (user.avatar) {
      const deleteParams = {
        Key: user.avatar.split('/')[2],
        Bucket: process.env.S3_PROFILE_BUCKET,
      };
      await s3.deleteObject(deleteParams).promise();
    }

    user.avatar = 'user/images/' + req.file.key;
    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json('Error: User does not exist.');
  }
};
