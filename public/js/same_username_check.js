let username = document.querySelector("#username");
let username_exist = document.querySelector("#username-exists");
let username_not_exist = document.querySelector("#username-not-exists");
let username_required_text = document.querySelector("#username-required");
let register = document.querySelector("#register");

username.addEventListener("input", async () => {
	let exists = await fetch("/u_same", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username: username.value }),
	});
	exists = await exists.text();
	if (exists === "true") {
		username_not_exist.classList.add("d-none");
		username_exist.classList.remove("d-none");
		username_required_text.classList.add("d-none");
		username.setCustomValidity("Invalid field.");
		// register.disabled = true;
	} else {
		username_not_exist.classList.remove("d-none");
		username_exist.classList.add("d-none");
		username.setCustomValidity("");
	}

	if (username.value === "") {
		if (!username_exist.classList.contains("d-none"))
			username_exist.classList.add("d-none");
		if (!username_not_exist.classList.contains("d-none"))
			username_not_exist.classList.add("d-none");
	}
});
