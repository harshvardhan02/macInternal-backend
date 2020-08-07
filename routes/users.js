const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/users', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send({status: false, message: 'User with this email is already registered'});

	// user = new User({
	// 	name: req.body.name,
	// 	email: req.body.email,
	// 	password: req.body.password
	// });

	user = new User(_.pick(req.body, ['name', 'email', 'password', 'gender', 'state']));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	// let row = { status: true, message: 'User Created Successfuly', data: user}
	await user.save();
	const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');
	user.token = token
	res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'gender', 'state', 'token']));   
});

module.exports = router;