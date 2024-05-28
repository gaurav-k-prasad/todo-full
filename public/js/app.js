let addButton = document.querySelector("#add-button");
let addInput = document.querySelector("#add-input");
let content = document.querySelector(".content");
let todo = document.querySelector(".todo");
let html = document.querySelector("html");
let body = document.querySelector("body");
let completedSound = new Audio("/assets/completed.mp3");
let deleteSound = new Audio("/assets/delete.mp3");
let nothing = document.querySelector(".nothing");
let tasks = document.querySelectorAll(".task");
let upArrow = document.querySelector(".up-arrow");
let menu = document.querySelector("#menu");
let navbar = document.querySelector(".navbar");
let navClose = document.querySelector("#close");
let container = document.querySelector(".container");
let theme = document.querySelector(".theme-icon");
let importantTasks = document.querySelector(
	".important-tasks .left-panel-task-list"
);
let allImportantTasks = document.querySelectorAll(
	".important-tasks .left-panel-task-list .left-panel-task"
);
let allCompletedTasks = document.querySelectorAll(
	".completed .left-panel-task-list .left-panel-task"
);
let completedTasks = document.querySelector(".completed .left-panel-task-list");
let verticalSeparator = document.querySelector(".vertical-separator");
let noCompletedTask = document.querySelector("#no-completed-task");
let noImportantTask = document.querySelector("#no-important-task");
let loader = document.querySelector("#preloader");
let cover = document.querySelector(".cover");
let landscape = window.matchMedia("(orientation: landscape)");
let checkWrapper = document.querySelector(".check-wrapper");
let tick = document.querySelector(".tick");
let isListening = true;

let activityUrl = "https://bored-api.appbrewery.com/random";

// * Lists
let todoList = [];
let importantList = [];
let completedList = [];
let scrollPercent,
	recActivity = "";

// ? Solution of navbar click in portrait and then going to landscape causing issue
landscape.addEventListener("change", function (e) {
	if (e.matches && navbar.classList.contains("slide-out")) {
		navBarClosing(0);
	}
});

// * Functions

function remToPixels(rem) {
	return (
		rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
	);
}

async function getActivity() {
	let result = await fetch("/activity");
	result = await result.text();
	if (result) recActivity = result;
}

async function mainCheckForEmpty() {
	if (todoList.length === 0 && !nothing.classList.contains("nothing-view")) {
		content.style.flexDirection = "row";
		content.style.justifyContent = "center";
		nothing.innerHTML = "Got nothing to do?" + "</br>" + recActivity;
		// console.log(nothing.innerHTML);
		nothing.classList.add("nothing-view");
	} else if (
		todoList.length !== 0 &&
		nothing.classList.contains("nothing-view")
	) {
		nothing.classList.remove("nothing-view");
		content.style.flexDirection = "column";
		content.style.justifyContent = "start";
	}
}

function navBarClosing(time = 250) {
	let navbarClasses = navbar.classList;
	cover.setAttribute("style", "display:none");
	cover.classList.remove("cover-activate");

	if (!navbarClasses.contains("slide-in")) {
		navbarClasses.toggle("slide-in");

		// !
		if (navbarClasses.contains("slide-out")) {
			navbarClasses.toggle("slide-out");
		}
		setTimeout(() => {
			menu.classList.toggle("display-none");
			navbarClasses.remove("slide-in");
		}, time);
	}
}

function impCheckForEmpty() {
	if (
		importantList.length === 0 &&
		!noImportantTask.classList.contains("display-unset")
	) {
		importantTasks.style.flexDirection = "row";
		importantTasks.style.justifyContent = "center";
		// console.log(noImportantTask.innerHTML);
		noImportantTask.classList.add("display-unset");
	} else if (
		importantList.length !== 0 &&
		noImportantTask.classList.contains("display-unset")
	) {
		noImportantTask.classList.remove("display-unset");
		importantTasks.style.flexDirection = "column";
		importantTasks.style.justifyContent = "start";
	}
}

function comCheckForEmpty() {
	if (
		completedList.length === 0 &&
		!noCompletedTask.classList.contains("display-unset")
	) {
		completedTasks.style.flexDirection = "row";
		completedTasks.style.justifyContent = "center";
		// console.log(noCompletedTask.innerHTML);
		noCompletedTask.classList.add("display-unset");
	} else if (
		completedList.length !== 0 &&
		noCompletedTask.classList.contains("display-unset")
	) {
		noCompletedTask.classList.remove("display-unset");
		completedTasks.style.flexDirection = "column";
		completedTasks.style.justifyContent = "start";
	}
}

function removeFromTodoList(word) {
	let elementIndex = todoList.indexOf(word);
	if (elementIndex != -1) todoList.splice(elementIndex, 1);
	// console.log(todoList);
}

function getValue() {
	let input = addInput.value;
	// console.log(todoList);
	addInput.value = "";
	return input;
}

function checkArrow() {
	if (content.scrollTop > 10) {
		upArrow.style.display = "unset";
		scrollPercent = Math.round(
			(content.scrollTop * 100) /
				(content.scrollHeight - content.clientHeight)
		);

		upArrow.style.background = `conic-gradient(#32c932 ${scrollPercent}%, #bbb ${scrollPercent}%)`;
		// console.log(scrollPercent);
	} else {
		upArrow.style.display = "none";
	}
}

function addTaskDom(input) {
	if (input != "") {
		todoList.push(input);
		let task = document.createElement("div");
		task.classList.add("task");
		let check = document.createElement("div");
		check.className = "check-wrapper";
		let tick = document.createElement("img");
		tick.src = "/assets/check.png";
		tick.classList.add("tick");
		check.appendChild(tick);

		let taskText = document.createElement("span");
		taskText.innerText = input;
		taskText.classList.add("task-text", "breaking-text");

		let outlineStar = document.createElement("i");
		outlineStar.classList.add("fa-regular", "fa-star", "star");

		let trash = document.createElement("i");
		trash.classList.add("fa-solid", "fa-trash", "delete-task");

		task.appendChild(check);
		task.appendChild(taskText);
		task.appendChild(outlineStar);
		task.appendChild(trash);
		content.appendChild(task);
		content.scrollTop = content.scrollHeight;
		mainCheckForEmpty();
		checkArrow();
	}
}

function addCompletedDom(inputText) {
	let task = document.createElement("div");
	task.classList.add("left-panel-task");
	let taskText = document.createElement("span");
	taskText.innerText = inputText;
	taskText.classList.add("left-panel-task-text");

	let trash = document.createElement("i");
	trash.classList.add("fa-solid", "fa-trash", "delete-task");

	task.appendChild(taskText);
	task.appendChild(trash);
	completedTasks.appendChild(task);
	completedTasks.scrollTop = completedTasks.scrollHeight;
}

function addImportantDom(inputText) {
	if (importantList.indexOf(inputText) === -1) {
		importantList.push(inputText);
		let task = document.createElement("div");
		task.classList.add("left-panel-task");
		let taskText = document.createElement("span");
		taskText.innerText = inputText;
		taskText.classList.add("left-panel-task-text");

		let addIcon = document.createElement("i");
		addIcon.classList.add("fa-solid", "fa-plus", "add-icon");

		let trash = document.createElement("i");
		trash.classList.add("fa-solid", "fa-trash", "delete-task");

		task.appendChild(taskText);
		task.appendChild(addIcon);
		task.appendChild(trash);
		importantTasks.appendChild(task);
		importantTasks.scrollTop = content.scrollHeight;
	}
}

function initResizerFn(resizer, sidebar) {
	// Tracker current mouse position in x var
	let x, w;

	function rs_mousedownHandler(e) {
		if (e.clientX) x = e.clientX;
		else x = e.touches[0].clientX;

		let sbWidth = window.getComputedStyle(sidebar).width;
		w = parseInt(sbWidth);

		document.addEventListener("touchmove", rs_mousemoveHandler);
		document.addEventListener("touchend", rs_mouseupHandler);

		document.addEventListener("mousemove", rs_mousemoveHandler);
		document.addEventListener("mouseup", rs_mouseupHandler);
		document.body.classList.add("block-selection");
	}

	function rs_mousemoveHandler(e) {
		let dx;
		if (e.clientX) dx = e.clientX - x;
		else dx = e.touches[0].clientX - x;

		let cw = w + dx;
		if (cw < remToPixels(25) && cw > remToPixels(13.5)) {
			sidebar.style.minWidth = `${cw}px`;
			sidebar.style.maxWidth = `${cw}px`;
		}
	}

	function rs_mouseupHandler() {
		// remove event mouse up && mouseup
		document.removeEventListener("mouseup", rs_mouseupHandler);
		document.removeEventListener("mousemove", rs_mousemoveHandler);
		document.removeEventListener("touchend", rs_mouseupHandler);
		document.removeEventListener("touchmove", rs_mousemoveHandler);
		document.body.classList.remove("block-selection");
	}

	resizer.addEventListener("mousedown", rs_mousedownHandler);
	resizer.addEventListener("touchstart", rs_mousedownHandler);
}

// * Flow
async function main() {
	await getActivity();
	initResizerFn(verticalSeparator, navbar);

	for (let task of tasks) {
		todoList.push(task.querySelector(".task-text").innerText);
	}
	mainCheckForEmpty();

	for (let element of allCompletedTasks) {
		completedList.push(element.innerText);
	}
	comCheckForEmpty();

	for (let element of allImportantTasks) {
		importantList.push(element.innerText);
	}
	impCheckForEmpty();
}
main();

// * Event Listeners

// ? Button Click Add
addButton.addEventListener("click", () => {
	addTaskDom(getValue());
});

// ? Enter Click add
addInput.addEventListener("keydown", (event) => {
	if (!navbar.classList.contains("slide-out")) {
		if (event.code == "Enter") {
			addTaskDom(getValue());
		}
	}
});

// ? completed task
content.addEventListener("click", (event) => {
	completedSound.pause();
	completedSound.currentTime = 0;
	if (event.target.classList.contains("check-wrapper")) {
		if (isListening) {
			isListening = false;
			event.target.classList.add("check-wrapper-bg-change");
			event.target.children[0].classList.add(
				"check-tick-clr-change",
				"opacity-1"
			);
			completedSound.play();
			setTimeout(() => {
				isListening = true;
				removeFromTodoList(event.target.parentElement.innerText);
				completedList.push(event.target.parentElement.innerText);
				addCompletedDom(event.target.parentElement.innerText);
				event.target.parentElement.remove();
				mainCheckForEmpty();
				checkArrow();
				comCheckForEmpty();
			}, 200);
		}
	} else if (event.target.classList.contains("tick")) {
		if (isListening) {
			isListening = false;
			event.target.parentElement.classList.add("check-wrapper-bg-change");
			event.target.classList.add("check-tick-clr-change", "opacity-1");
			completedSound.play();
			setTimeout(() => {
				isListening = true;
				removeFromTodoList(
					event.target.parentElement.parentElement.innerText
				);
				completedList.push(
					event.target.parentElement.parentElement.innerText
				);
				addCompletedDom(
					event.target.parentElement.parentElement.innerText
				);
				event.target.parentElement.parentElement.remove();
				mainCheckForEmpty();
				checkArrow();
				comCheckForEmpty();
			}, 200);
		}
	}
});

// ? Remove .delete-task
content.addEventListener("click", (event) => {
	deleteSound.pause();
	deleteSound.currentTime = 0;
	if (event.target.classList.contains("delete-task")) {
		removeFromTodoList(event.target.parentElement.innerText);
		event.target.parentElement.remove();
		deleteSound.play();
		mainCheckForEmpty();
		checkArrow();
	}
});

// ? Focus with "Slash"
html.addEventListener("keydown", (event) => {
	if (!navbar.classList.contains("slide-out")) {
		if (event.code == "Slash") {
			setTimeout(() => {
				addInput.focus();
			}, 0);
		}
	}
});

// ? unfocus with esc
addInput.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		addInput.blur();
	}
});

// ? Important .important
content.addEventListener("click", (event) => {
	if (
		event.target.classList.contains("star") &&
		!event.target.parentElement.classList.contains("important")
	) {
		event.target.classList.toggle("fa-solid");
		let importantTask = event.target.parentElement;
		importantTask.classList.add("important");
		importantTask.remove();
		importantTask
			.querySelector(".task-text")
			.classList.add("important-bold");
		content.insertAdjacentElement("afterbegin", importantTask);
		addImportantDom(importantTask.innerText);
		// console.log(importantList);
		impCheckForEmpty();
	} else if (
		event.target.classList.contains("star") &&
		event.target.parentElement.classList.contains("important")
	) {
		let importantTask = event.target.parentElement;
		event.target.classList.toggle("fa-solid");
		importantTask.classList.remove("important");
		importantTask.remove();
		content.insertAdjacentElement("beforeend", importantTask);
		importantTask
			.querySelector(".task-text")
			.classList.remove("important-bold");
	}
});

// ? Up arrow click
upArrow.addEventListener("click", () => {
	content.scrollTop = 0;
});

// ? Up arrow appear
content.addEventListener("scroll", () => {
	checkArrow();
});

// ? menu click
menu.addEventListener("click", () => {
	let navbarClasses = navbar.classList;

	if (!navbarClasses.contains("slide-out")) {
		cover.setAttribute("style", "display:unset");
		cover.classList.add("cover-activate");

		menu.classList.toggle("display-none");
		navbarClasses.toggle("slide-out");
		if (navbarClasses.contains("slide-in")) {
			navbarClasses.toggle("slide-in");
		}
	}
});

// ? X clicked
navClose.addEventListener("click", () => {
	let navbarClasses = navbar.classList;
	cover.setAttribute("style", "display:none");
	cover.classList.remove("cover-activate");

	if (!navbarClasses.contains("slide-in")) {
		navbarClasses.toggle("slide-in");
		// !
		if (navbarClasses.contains("slide-out")) {
			navbarClasses.toggle("slide-out");
		}
		setTimeout(() => {
			menu.classList.toggle("display-none");
			navbarClasses.remove("slide-in");
		}, 250);
	}
});

// ? Important task delete
importantTasks.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete-task")) {
		event.target.parentElement.remove();
		importantList.splice(
			importantList.indexOf(event.target.parentElement.innerText),
			1
		);
		impCheckForEmpty();
		// console.log("importantList :>> ", importantList);
	}
});

// ? completed task delete
completedTasks.addEventListener("click", (event) => {
	if (event.target.classList.contains("delete-task")) {
		event.target.parentElement.remove();
		completedList.splice(
			completedList.indexOf(event.target.parentElement.innerText),
			1
		);
		comCheckForEmpty();
		// console.log("completedList :>> ", completedList);
	}
});

// ? Add task from important list
navbar.addEventListener("click", (event) => {
	if (event.target.classList.contains("add-icon")) {
		addTaskDom(event.target.parentElement.innerText);
	}
});

// ? close navbar on clicking anywhere
todo.addEventListener("click", () => {
	if (navbar.classList.contains("slide-out")) {
		navClose.click();
	}
});

// ? close nav bar when clicked out of focus
cover.addEventListener("click", () => {
	navClose.click();
});

// ? Change theme
theme.addEventListener("click", () => {
	if (theme.classList.contains("light")) {
		theme.src = "/assets/dark.png";
		theme.classList.remove("light");
		theme.classList.add("dark");
	} else if (theme.classList.contains("dark")) {
		theme.src = "/assets/light.png";
		theme.classList.remove("dark");
		theme.classList.add("light");
	}
	document.body.classList.toggle("light-theme");
});

// * -----------------------------
// ? Loading
window.addEventListener("load", () => {
	setTimeout(() => {
		loader.classList.add("hide-slowly");
	}, 700);
	setTimeout(() => {
		loader.classList.add("display-none");
	}, 950);
});
