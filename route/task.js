const express = require("express");
const router = express.Router();
const {
  addTask,
  listTask,
  deleteTask,
  updateTask,
  detailTask,
} = require("../controllers");

router.post("/add", addTask);
router.get("/list/:projectId", listTask);
router.get("/detail/:id", detailTask);
router.put("/update", updateTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;
