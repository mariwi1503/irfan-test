const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();
const port = config.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
app.use("/api", authRoute, userRoute);

// api health
app.get("/", (req, res) => {
  res.send("Welcome");
});

// unhandled route
app.all("*", (req, res) => {
  res.send("Wrong way ya!");
});

app.listen(port, () => {
  console.log(`App's running on port ${port}...`);
});
