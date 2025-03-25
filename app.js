const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./common/database");
const app = express();
const routes = require("./route");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Invalid Request AS 2 master ok as" });
});

app.listen(port, () => {
  console.log("Server is running on port.. Branch One Okay Then,,,", port);
});
