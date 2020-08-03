const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({status: false, message: 'Invalid email or password'});
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send({status: false, message: 'Invalid email or password'});

	const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');
    res.send({ status: true, message: 'Login Successfull', token: token });
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(50).email(),
		password: Joi.string().min(5).max(255),
	});
	return schema.validate(req) 
}

module.exports = router;