const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");

const PORT = 5000;

const app = Express();
app.use(Cors());
app.use(BodyParser.json());

const KahootRoute = require("./routes/kahoot");

app.use("/kahoot", KahootRoute);

app.get("/", (req, res) => {
	res.send("Home page");
});

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}, Link: http://127.0.0.1:${PORT}`);
});
