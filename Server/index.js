const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const path = require("path");

const PORT = 5001;

const app = Express();
app.use(Cors());
app.use(BodyParser.json());

const PublicFolder = path.join(__dirname, "public");
const KahootRoute = require("./routes/kahoot");

app.use("/api", KahootRoute);
app.use("/", Express.static(PublicFolder));

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}, Link: http://127.0.0.1:${PORT}`);
});
