const express = require("express");
const router = express.Router();
const { addProject, listProject, deleteProject } = require("../controllers");

router.post("/add", addProject);
router.get("/list", listProject);
router.delete("/delete/:id", deleteProject);

module.exports = router;
