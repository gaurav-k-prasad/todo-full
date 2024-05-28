const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	password: String,
	todo: [{ type: String }],
	completed: [{ type: String }],
	important: [{ type: String }],
});

const TodoUser = mongoose.model("TodoUser", userSchema);
module.exports = TodoUser;
