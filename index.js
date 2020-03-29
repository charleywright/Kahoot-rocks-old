const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const KahootJS = require("kahoot.js-updated");
const https = require("https");

process.env.PORT = 3000;
process.env.NoSearchResults = 50;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ methods: ["POST"] }));
app.set("port", process.env.PORT || 3000);

app.post("/", function(req, res) {
	const PIN = req.body.Pin;
	const USERNAME = req.body.Username;
	const DELAY = req.body.Delay;

	if (PIN == undefined || USERNAME == undefined || DELAY == undefined) {
		res.end("Bad request");
	} else {
		res.end("Good request");

		Kahoot(PIN, USERNAME, DELAY);
	}
});

app.get("/", function(req, res) {
	res.end("Go away");
});

// Listen for any events
http.listen(process.env.PORT, function() {
	console.log(`listening on *:${process.env.PORT}`);
});

function Kahoot(PIN, USERNAME, DELAY) {
	const client = new KahootJS();

	let KahootName = "Corey - Small - Brain";
	let answerCounts = [3, 2, 2, 2, 4, 2, 3, 2, 4, 3, 3];
	let KahootLength = 11;
	const URL = `https://create.kahoot.it/rest/kahoots/?query=${KahootName.replace(
		/\s-\s/g,
		"-"
	)}&cursor=0&limit=${
		process.env.NoSearchResults
	}&orderBy=relevance&searchCluster=1&includeExtendedCounters=false`;

	console.log(URL);

	https.get(URL, resp => {
		let data = "";
		let FilteredResults = [];
		let GoodKahoots = [];

		resp.on("data", chunk => {
			data += chunk;
		});

		resp.on("end", () => {
			data = JSON.parse(data);

			data.entities.forEach(KahootSearchResult => {
				if (
					KahootSearchResult.card.title == KahootName &&
					KahootSearchResult.card.number_of_questions == KahootLength
				) {
					FilteredResults.push(KahootSearchResult);
				}
			});

			FilteredResults.forEach(Kahoot => {
				https.get(
					`https://play.kahoot.it/rest/kahoots/${Kahoot.card.uuid}`,
					resp => {
						let resultData = "";

						resp.on("data", chunk => {
							resultData += chunk;
						});

						resp.on("end", () => {
							resultData = JSON.parse(resultData);

							let isGood = true;
							answerCounts.forEach((answerCount, i) => {
								if (resultData.questions[i].choices.length != answerCount) {
									isGood = false;
								}
							});
							if (isGood == true) {
								GoodKahoots.push(Kahoot);
								console.log(Kahoot);
							}
						});
					}
				);
			});

			console.log(GoodKahoots);
		});
	});

	client.join(PIN, USERNAME);

	client.on("quizStart", Quiz => {
		let KahootName = Quiz.name;
		const URL = `https://create.kahoot.it/rest/kahoots/?query=${KahootName}&cursor=0&limit=${process.env.NoSearchResults}&orderBy=relevance&searchCluster=1&includeExtendedCounters=false`;

		https.get(URL, resp => {
			let data = "";

			resp.on("data", chunk => {
				data += chunk;
			});

			resp.on("end", () => {});
		});
	});
}
