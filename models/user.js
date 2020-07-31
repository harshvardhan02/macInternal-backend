const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxlength: 50
	},
	email: {
		type: String,
		minlength: 3,
		maxlength: 200,
		unique: true
	},
	password: {
		type: String,
		minlength: 3,
		maxlength: 1024
	}
})); 

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50),
		email: Joi.string().min(5).max(50).email(),
		password: Joi.string().min(5).max(255),
	});
	return schema.validate(user) 
}

exports.User =  User;
exports.validate = validateUser;