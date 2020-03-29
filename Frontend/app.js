let GAMEPIN;
let USERNAME;
let DELAY;

const KAHOOT_PAGE_HTML = `
			<img src="Kahoot.png" class="img" alt="Kahoot" class="logo" />
			<form>
				<input
					type="text"
					placeholder="Game PIN"
					name="Game Pin"
					id="GamePin"
					class="pin"
				/>
				<button id="button" onclick="Kahoot(); return false" type="button" class="enter">Enter</button>
			</form>`;

const LOGIN_HTML = `
			<img src="Kahoot.png" class="img" alt="Kahoot" class="logo" />
			<form>
				<input
					type="text"
					placeholder="Username"
					name="Username"
					id="Username"
					class="username"
				/>
				<input
					type="password"
					placeholder="Password"
					name="Password"
					id="Password"
					class="password"
				/>
				<button id="button" onclick="Login(); return false" type="button" class="enter">Login</button>
			</form>

			<a id="Register" href="#" onclick="RegisterPage(); return false" >Register</a>`;

const REGISTER_HTML = `
			<img src="Kahoot.png" class="img" alt="Kahoot" class="logo" />
			<form>
				<input
					type="text"
					placeholder="Username"
					name="Username"
					id="Username"
					class="username"
				/>
				<input
					type="password"
					placeholder="Password"
					name="Password"
					id="Password"
					class="password"
				/>
				<input
					type="text"
					placeholder="Key"
					name="Key"
					id="Key"
					class="key"
				/>
				<button id="button" onclick="Register(); return false" type="button" class="enter">Register</button>
			</form>

			<a id="Login" href="#" onclick="LoginPage(); return false" >Login</a>`;

function RegisterPage() {
	document.getElementById("wrapper").innerHTML = REGISTER_HTML;

	return false;
}

function LoginPage() {
	document.getElementById("wrapper").innerHTML = LOGIN_HTML;

	return false;
}

function Register() {
	let Username = document.getElementById("Username").value;
	let Password = document.getElementById("Password").value;
	let Key = document.getElementById("Key").value;

	let xhr = new XMLHttpRequest();
	let url = "https://api.charleyw.com/Kahoot/register";

	let data = `user=${Username}&password=${Password}&key=${Key}`;

	xhr.open("POST", url);

	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {
		if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Account Created"
		) {
			alert("Account Created");
			document.getElementById("wrapper").innerHTML = KAHOOT_PAGE_HTML;
		} else if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Key already redeemed"
		) {
			alert("Key already redeemed");
		} else if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Account Exists"
		) {
			alert("Account Exists");
		} else if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Key Invalid"
		) {
			alert("Key Invalid");
		} else {
			// alert("Error")
		}
	};

	xhr.send(data);
}

function Login() {
	let Username = document.getElementById("Username").value;
	let Password = document.getElementById("Password").value;

	let xhr = new XMLHttpRequest();
	let url = "https://api.charleyw.com/Kahoot/login";

	let data = `user=${Username}&password=${Password}`;

	xhr.open("POST", url);

	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {
		if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Login Succesful"
		) {
			document.getElementById("wrapper").innerHTML = KAHOOT_PAGE_HTML;
		} else if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Account Not Found"
		) {
			alert("Account Not Found");
		} else if (
			xhr.readyState == 4 &&
			xhr.status == 200 &&
			xhr.responseText == "Incorrect Password"
		) {
			alert("Password Incorrect");
		} else {
			// alert("The request failed");
		}
	};

	xhr.send(data);
}

function Kahoot() {
	let textField = document.getElementById("GamePin");

	switch (textField.placeholder) {
		case "Game PIN":
			GAMEPIN = textField.value;

			textField.value = null;
			textField.placeholder = "Username";
			break;
		case "Username":
			USERNAME = textField.value;

			textField.value = null;
			textField.placeholder = "Delay (ms)";
			break;
		case "Delay (ms)":
			DELAY = textField.value;

			textField.value = null;
			textField.style.fontSize = "14px";
			textField.placeholder = "Sending data";

			let url = `https://api.charleyw.com/Kahoot/${USERNAME}/${GAMEPIN}/${DELAY}`;

			let xhr = new XMLHttpRequest();

			xhr.open("GET", url);
			xhr.send();

			break;
	}
}
