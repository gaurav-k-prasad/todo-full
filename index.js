const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const path = require("path");
const TodoUser = require("./models/user.js");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/"));

function asyncWrap(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((err) => {
			next(err);
		});
	};
}

async function main() {
	await mongoose.connect("mongodb://localhost:27017/users");
}
main()
	.then((res) => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.get("/activity", async (req, res) => {
	try {
		let activity = await axios.get(
			"https://bored-api.appbrewery.com/random"
		);
		res.send(activity.data.activity);
	} catch (error) {
		console.error(error);
		res.send("");
	}
});

app.get("/", (req, res) => {
	res.redirect("/login");
});

app.get("/login", (req, res) => {
	const { id } = req.query;
	if (!id) {
		res.render("login.ejs");
	}
});

app.get("/register", (req, res) => {
	res.render("register.ejs");
});

app.post("/u_same", async (req, res) => {
	try {
		const result = await TodoUser.findOne({ username: req.body.username });
		if (result) {
			res.send(true);
		} else {
			res.send(false);
		}
	} catch (error) {
		res.send(true);
	}
});

app.post(
	"/authenticate",
	asyncWrap(async (req, res, next) => {
		const { username, password } = req.body;
		const result = await TodoUser.findOne({
			username: username,
			password: password,
		});

		if (result) {
			res.redirect(`/todo/${result._id}`);
		} else {
			res.redirect("/login");
		}
	})
);

app.get(
	"/todo/:id",
	asyncWrap(async (req, res) => {
		const { id } = req.params;
		const data = await TodoUser.findById(id);
		// console.log(data);
		res.render("index.ejs", { data });
	})
);

app.post(
	"/todo/:id",
	asyncWrap(async (req, res) => {
		if (req.body.where === "todo") {
			const { id } = req.params;
			const user = await TodoUser.findById(id);
			user.todo.push(req.body.task.toString());
			user.save();
			res.status(200).send("success");
			// console.log(user);
		} else if (req.body.where === "complete") {
			const { id } = req.params;
			const user = await TodoUser.findById(id);
			user.completed.push(req.body.task.toString());
			user.save();
			res.status(200).send("success");
			// console.log(user);
		} else if (req.body.where === "important") {
			const { id } = req.params;
			const user = await TodoUser.findById(id);
			user.important.push(req.body.task.toString());
			user.save();
			res.status(200).send("success");
			// console.log(user);
		}
	})
);

app.delete(
	"/todo/:id",
	asyncWrap(async (req, res) => {
		if (req.body.where === "todo") {
			const { id } = req.params;
			const user = await TodoUser.findById(id);
			user.todo.splice(user.todo.indexOf(req.body.task.toString()), 1);
			user.save();
			res.status(200).send("success");
			// console.log(user);
		} else if (req.body.where === "complete") {
			const { id } = req.params;
			const user = await TodoUser.findById(id);
			user.completed.splice(
				user.completed.indexOf(req.body.task.toString()),
				1
			);
			user.save();
			res.status(200).send("success");
			// console.log(user);
		} else if (req.body.where === "important") {
			const { id } = req.params;
			const user = await TodoUser.findById(id);
			console.log(user.todo);
			console.log(req.body.task);
			console.log(
				user.important.splice(
					user.important.indexOf(req.body.task.toString()),
					1
				)
			);

			user.save();
			res.status(200).send("success");
			// console.log(user);
		}
	})
);

app.post(
	"/register",
	asyncWrap(async (req, res) => {
		const { username, password } = req.body;
		const user1 = TodoUser({
			username: username,
			password: password,
			todo: [],
			completed: [],
			important: [],
		});
		const result = await user1.save();
		console.log(result);
		res.redirect("/");
	})
);

app.use((err, req, res, next) => {
	res.render("error.ejs", { err });
	next();
});

app.all("*", (req, res) => {
	const err = { message: "Page not found", status: 404 };
	res.status(404).render("error.ejs", { err });
});

app.listen(port, () => {
	console.log(`app listening to port ${port}`);
});
