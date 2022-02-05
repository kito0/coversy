const router = require('express').Router();
const { Router } = require('express');
const {
	registerUser,
	getAllUsers,
	getUserById,
	getUserByFirstName,
	getUserByLastName,
	getUserByEmail,
	getUserBySite,
	updateUserById,
	deleteUserById,
	deleteUserByEmail,
	deleteUserBySite,
} = require('../controllers/user.controller');

// CREATE
router.post('/', registerUser);

// READ
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.get('/:siteId', getUserBySite);
router.get('/:firstName/:siteId', getUserByFirstName);
router.get('/:lastName/:siteId', getUserByLastName);
router.get('/:email/:siteId', getUserByEmail);

// UPDATE
router.put('/:userId', updateUserById);

// DELETE
router.delete('/:userId', deleteUserById);
router.delete('/:email', deleteUserByEmail);
router.delete('/:siteId', deleteUserBySite);

module.exports = router;
