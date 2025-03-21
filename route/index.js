const express = require("express");
const router = express.Router();
const projectRoute = require("./project");
const taskRoute = require("./task");

router.use("/project", projectRoute);
router.use("/task", taskRoute);

module.exports = router;
