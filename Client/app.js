let Pin = 0;
let Username = "wag1memeing.com";
let Delay = 0;

function Submit() {
	let placeholder = document.querySelector("input").placeholder;
	switch (placeholder) {
		case "Game PIN":
			if (document.querySelector("input").value != "") {
				if (isNaN(document.querySelector("input").value)) {
					alert("Game pin has to be a number");
				} else {
					Pin = document.querySelector("input").value;
					document.querySelector("input").value = "";
					document.querySelector("input").placeholder = "Username";
				}
			} else {
				alert("Game Pin cannot be empty");
			}
			break;
		case "Username":
			if (document.querySelector("input").value != "") {
				Username = document.querySelector("input").value;
				document.querySelector("input").value = "";
				document.querySelector("input").placeholder = "Answer delay (ms)";
			} else {
				alert("Username cannot be empty");
			}
			break;
		case "Answer delay (ms)":
			if (document.querySelector("input").value != "") {
				if (isNaN(document.querySelector("input").value)) {
					alert("Answer delay has to be a number");
				} else {
					Delay = document.querySelector("input").value;
					Show();
					SendRequest(Pin, Username, Delay);
				}
			} else {
				alert("Delay cannot be empty (Try 0)");
			}
			break;
	}
}

async function SendRequest(PIN, USERNAME, DELAY) {
	const RequestURL = "http://127.0.0.1:5000/kahoot/";

	const data = {
		pin: PIN,
		username: USERNAME,
		delay: DELAY,
	};

	const options = {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(data),
	};

	let res = await fetch(RequestURL, options);

	switch (await res.text()) {
		case "All good":
			Show("Request succesfull");
			break;
		case "Incorrect pin":
			Show("Invalid game PIN");
			break;
		case "Information incorrect":
			Show("Information in incorrect format");
			break;
		case "Pin or Delay is not a number":
			Show("Pin or Delay is not a number");
			break;
	}
}

function Show(msg = "Sending request") {
	document.querySelector(".wrapper").innerHTML = `
		<div class="output">
			<h3 class="output-header">${msg}</h3>
			<span>
				<a href="https://github.com/charleywright/Kahoot-auto-answer"
					>Source code</a
				>
				|
				<a href="https://charleyw.com/discord">Discord server</a>
				|
				<a href="https://charleyw.com">My website</a>
			</span>
		</div>
	`;
}
