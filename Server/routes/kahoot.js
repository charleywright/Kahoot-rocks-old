const Kahoot = require("kahoot.js-updated");
const Fetch = require("node-fetch");

module.exports = (function() {
	"use strict";
	const kahootRoute = require("express").Router();
	kahootRoute.get("/", function(req, res) {
		res.send("Kahoot GET page!");
	});
	kahootRoute.post("/", async function(req, res) {
		res.type("text");
		let pin = req.body.pin;
		let username = req.body.username;
		let delay = req.body.delay;
		if (pin == undefined || username == undefined || delay == undefined) {
			res.end("Information incorrect");
			return;
		}
		if (isNaN(pin) || isNaN(delay)) {
			res.end("Pin or Delay is not a number");
			return;
		}
		Go(pin, username, delay);
		res.end("All good");
	});
	return kahootRoute;
})();

function Go(PIN, USERNAME, DELAY) {
	let Kahoots = [];
	let gotAnswers = false;
	const client = new Kahoot();
	client.join(PIN, USERNAME);
	client.on("quizStart", async QUIZ => {
		let regExp = /\s+/g;
		let URL = `https://create.kahoot.it/rest/kahoots/?query=${QUIZ.name}&cursor=0&limit=50&topics=&grades=&orderBy=relevance&searchCluster=1&includeExtendedCounters=false`;
		URL = URL.replace(regExp, "");
		let possibleResults = [];
		let res = await Fetch(URL);
		let body = await res.json();

		for (entity of body.entities) {
			if (
				entity.card.title == QUIZ.name &&
				entity.card.number_of_questions == QUIZ.questionCount
			) {
				let newRes = await Fetch(
					`https://play.kahoot.it/rest/kahoots/${entity.card.uuid}`
				);
				let newBody = await newRes.json();

				let possible = true;
				if (QUIZ.type == newBody.quizType) {
					let QuestionsTemp = [];
					let AnswersTemp = [];
					let AnswersText = [];
					newBody.questions.forEach((question, index) => {
						if (
							newBody.questions[index].choices.length !=
							QUIZ.answerCounts[index]
						)
							possible = false;
						QuestionsTemp.push(question.question);
						let gotAnswer = false;
						question.choices.forEach((choice, index) => {
							if (!gotAnswer && choice.correct == true) {
								AnswersTemp.push(index);
								AnswersText.push(choice.answer);
								gotAnswer = true;
							}
						});
					});
					if (possible) {
						Kahoots.push({
							Name: newBody.title,
							Uuid: newBody.uuid,
							Questions: QuestionsTemp,
							Answers: AnswersTemp,
							AnswersText: AnswersText
						});
						gotAnswers = true;
					}
				}
			}
		}
		client.on("questionStart", Question => {
			setTimeout(() => {
				if (!gotAnswers) {
					Question.answer(Math.floor(Math.random() * 4));
				} else {
					Question.answer(Kahoots[0].Answers[Question.index]);
				}
			}, DELAY);
		});

		client.on("questionEnd", QuestionEnd => {
			Kahoots.forEach((Kahoot, index) => {
				if (
					Kahoot.AnswersText[QuestionEnd.question.index] !=
					QuestionEnd.correctAnswer
				) {
					Kahoots.splice(index);
				}
			});
		});
	});
}
