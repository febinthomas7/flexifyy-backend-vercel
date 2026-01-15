require("dotenv").config();
require("./Models/db");
const { app, server } = require("./socket/socket.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const AuthRouter = require("./Routes/AuthRouter");
const MovieSeriesRouter = require("./Routes/MovieSeriesRouter.js");
const UserChat = require("./Routes/UserChat");

var corsOptions = {
  origin: process.env.BASE_URL,
  method: ["GET", "POST"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/auth", AuthRouter);
app.use("/api", MovieSeriesRouter);
app.use("/chat", UserChat);
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
