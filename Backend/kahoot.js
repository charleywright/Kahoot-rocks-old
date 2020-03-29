// Environment vars
process.env.EMAIL = "";
process.env.PASSWORD = "";
process.env.PORT = 3003;

let Kahoots = [];

// Requirements
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3003);
const http = require("http").createServer(app);
const fs = require("fs");
const bcrypt = require("bcrypt");
let users = [];

app.use(cors({ methods: ["POST"] }));

// When the app is called serve the html page
app.get("/Kahoot/:username/:pin/:delay", function(req, res) {
	res.send(`<h1>Kahoot joined at ${req.params.pin}</h1>`);
	kahoot(req);
});

app.post("/Kahoot/login", function(req, res) {
	const USERNAME = req.body.user;
	const PASSWORD = req.body.password;

	let usernameFound = false;
	let passFound = false;

	users = LoadConfig();

	for (let i = 0; i < users.length; i++) {
		if (USERNAME == users[i].username) {
			usernameFound = true;
		}

		if (bcrypt.compareSync(PASSWORD, users[i].password) == true) {
			passFound = true;
		}
	}

	users = [];

	if (usernameFound == true && passFound == true) {
		res.end("Login Succesful");
	}
	if (usernameFound == true && passFound == false) {
		res.end("Incorrect Password");
	} else {
		res.end("Account Not Found");
	}
});

app.get("/Kahoot/", function(req, res) {
	res.send("<h1>Welcome...</h1>");
});

app.post("/Kahoot/register", function(req, res) {
	const USERNAME = req.body.user;
	const PASSWORD = req.body.password;
	const KEY = req.body.key;

	let usernameFound = false;
	let keyFound = false;
	let keyValid = false;

	let keys = LoadKeys();

	users = LoadConfig();

	keys.forEach(key => {
		if (keyValid == false) {
			if (KEY == key) keyValid = true;
		}
	});

	for (let i = 0; i < users.length; i++) {
		if (USERNAME == users[i].username) {
			usernameFound = true;
		}

		if (KEY == users[i].key) {
			keyFound = true;
		}
	}

	users = [];

	res.type("text/plain");

	if (keyValid == true && usernameFound == false && keyFound == false) {
		users = LoadConfig();

		users.push({
			username: USERNAME,
			password: bcrypt.hashSync(PASSWORD, 10),
			key: KEY
		});

		SaveConfig(users);
		users = [];

		res.end("Account Created");
	} else if (keyFound == true) {
		res.end("Key already redeemed");
	} else if (usernameFound == true) {
		res.end("Account Exists");
	} else if (keyValid == false) {
		res.end("Key Invalid");
	}
});

// Listen for any events
http.listen(process.env.PORT, function() {
	console.log(`listening on *:${process.env.PORT}`);
});

function LoadConfig() {
	let file = fs.readFileSync(
		"/var/www/api.charleyw.com/Configs/Kahoot_Credentials.json"
	);
	return JSON.parse(file);
}

function LoadKeys() {
	let file = fs.readFileSync(
		"/var/www/api.charleyw.com/Configs/Kahoot_Keys.json"
	);
	return JSON.parse(file);
}

function SaveConfig(users) {
	let file = JSON.stringify(users, null, 2);
	fs.writeFileSync(
		"/var/www/api.charleyw.com/Configs/Kahoot_Credentials.json",
		file
	);
}

function kahoot(request) {
	const data = request.params;
	const USERNAME = data.username;
	const PIN = data.pin;
	const DELAY = data.delay;

	const KahootJS = require("kahoot.js-updated");
	const client = new KahootJS();
	const puppeteer = require("puppeteer");
	// Join the kahoot
	client.join(PIN, USERNAME);

	// When the kahoot starts...
	client.on("quizStart", quiz => {
		// Generate the search URL to find the answers
		const URL = `https://create.kahoot.it/search?filter=1&query=${quiz.name}&tags=${quiz.name}`;
		(async () => {
			try {
				do {
					// Launch a browser
					const browser = await puppeteer.launch({
						args: ["--no-sandbox", "--disable-setuid-sandbox"]
					});
					// const browser = await puppeteer.launch({
					// 	// headless: false,
					// 	// defaultViewport: null,
					// 	args: ["--no-sandbox", "--disable-setuid-sandbox"]
					// });
					// Make a new browser page
					const page = await browser.newPage();

					// Set a user agent so it is not detected as a bot
					page.setUserAgent(
						"Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion"
					);
					// Naviagte to the url
					await page.goto(URL);
					// Sign in
					await page.type(".username-email-input-field", process.env.EMAIL);
					await page.type(".password-input-field", process.env.PASSWORD);
					page.click(".button");

					// Wait for the links to load
					await page.waitForSelector(".kahoot-card__title-link");
					// Get an array of the links
					let searchResults = await page.$$(".search-result-kahoot-card");

					// Loop over the search links
					for (searchResult of searchResults) {
						const kahootName = await searchResult.$eval(
							".kahoot-card__title-link",
							e => e.innerText
						);
						let questionCount = await searchResult.$eval(
							".kahoot-card__number-of-questions > span",
							e => e.innerText
						);
						questionCount = questionCount.split(" ")[0];
						if (
							kahootName == quiz.name &&
							questionCount == quiz.questionCount
						) {
							const kahootLink = await searchResult.$eval(
								".kahoot-card__title-link",
								e => e.href
							);
							let QuestionsTemp = [];
							let AnswersTemp = [];

							// Create a new browser page
							const kahootPage = await browser.newPage();
							// Go to the Kahoot link
							await kahootPage.goto(kahootLink);

							// Select the page
							await kahootPage.bringToFront();

							// Get an array of the question links
							await kahootPage.waitForSelector(".question-list__item");
							let questionWrappers = await kahootPage.$$(
								".question-list__item"
							);
							let i = 0;

							for (QuestionWrapper of questionWrappers) {
								QuestionsTemp.push(
									await QuestionWrapper.$eval(
										".question-media__text-inner-wrapper > span",
										e => e.innerText
									)
								);
								i++;
								await kahootPage.click(`#question-${i}`);
								let choices = await QuestionWrapper.$$(".choices__choice");
								let counter = 1;
								let noAnswer = true;
								for (choice of choices) {
									if (noAnswer) {
										try {
											if (
												(await choice.$(".choices__choice--correct")) !== null
											) {
												AnswersTemp.push(counter);
												noAnswer = false;
											}
										} catch (error) {
										} finally {
											counter++;
										}
									}
								}
							}

							Kahoots.push({
								Name: quiz.name,
								Length: quiz.questionCount,
								Questions: QuestionsTemp,
								Answers: AnswersTemp
							});
						}
					}
					await browser.close();
				} while (Kahoots == []);

				client.on("questionStart", RecievedQuestion => {
					let answer;
					if (Kahoots != []) {
						answer = Kahoots[0].Answers[RecievedQuestion.index];
					} else {
						answer = Math.ceil(Math.random() * 4);
					}

					setTimeout(function() {
						RecievedQuestion.answer(answer - 1);
					}, DELAY);
				});
			} catch (e) {
				console.log("our error " + e);
			}
		})();
	});
}
