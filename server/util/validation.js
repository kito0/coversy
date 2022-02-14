const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.registerValidation = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().max(64).required(),
		lastName: Joi.string().max(64).required(),
		middleInitial: Joi.string().min(1).max(1),
		type: Joi.number().min(1).max(2).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(128).required(),
		site: Joi.objectId().required(),
	});
	return schema.validate(data);
};

exports.loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(128).required(),
	});
	return schema.validate(data);
};

exports.updateValidation = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().max(64).required(),
		lastName: Joi.string().max(64).required(),
		middleInitial: Joi.string().min(1).max(1),
	});
	return schema.validate(data);
};

exports.siteValidation = (data) => {
	const zipPattern = /^[A-Za-z]d[A-Za-z]d[A-Za-z]d$/;
	const provincePattern = /^(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)$/;

	const schema = Joi.object({
		name: Joi.string().max(128).required(),
		address: {
			street: Joi.string().max(256).required(),
			zip: Joi.string().regex(zipPattern).required(),
			city: Joi.string().max(64).required(),
			province: Joi.string().regex(provincePattern).required(),
		},
	});
	return schema.validate(data);
};