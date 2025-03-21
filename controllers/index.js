const db = require("../common/database");
const util = require("util");

const query = util.promisify(db.query).bind(db);

const addProject = async (req, res) => {
  try {
    const { title } = req.body;

    const sql = `INSERT INTO tbl_project (title) VALUES (?)`;
    const result = await query(sql, [title]);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Failed to add project" });
    } else {
      res.json({ status: true, message: "Project added successfully" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: "Failed to add project" });
  }
};

const listProject = async (req, res) => {
  try {
    const sql = `SELECT 
                p.*, 
                COALESCE(ROUND((COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) * 100.0) / NULLIF(COUNT(t.id), 0), 0), 0) AS progress
            FROM tbl_project p
            LEFT JOIN tbl_task t ON p.id = t.projectId
            WHERE p.isDelete = 0 AND p.isActive = 1
            GROUP BY 
                p.id
            ORDER BY 
                p.id DESC`;
    const result = await query(sql);
    res.json({
      status: true,
      message: "Success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: false, message: "Failed to fatch project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const sql = `UPDATE tbl_project SET isDelete = 1 WHERE id = ${req.params.id}`;
    const result = await query(sql);

    if (result.affectedRows > 0) {
      //Remove all task of this project
      const sql = `UPDATE tbl_task SET isDelete = 1 WHERE projectId = ${req.params.id}`;
      const result1 = await query(sql);

      return res
        .status(200)
        .json({ status: true, message: "Project deleted successfully" });
    } else {
      res
        .status(400)
        .json({ status: false, message: "Failed to delete project" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: "Failed to delete project" });
  }
};

const addTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, projectId, parentTaskId } =
      req.body;

    const sql = `INSERT INTO tbl_task (title,description,due_date,status,projectId,parentTaskId) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [
      title,
      description,
      dueDate,
      status,
      projectId,
      parentTaskId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Failed to add task" });
    } else {
      res.json({ status: true, message: "Task added successfully" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: false, message: "Failed to add task" });
  }
};

const listTask = async (req, res) => {
  try {
    const { status, search } = req.query;

    var statusQuery = "";
    var searchQuery = "";
    if (search != null && search != undefined)
      searchQuery = `AND title LIKE '%${search}%'`;
    if (status != null && status != undefined)
      statusQuery = `AND status = ${status}`;

    const sql = `SELECT * FROM tbl_task WHERE projectId=${req.params.projectId} ${statusQuery} ${searchQuery} AND isDelete = 0 AND isActive=1 ORDER BY id DESC`;

    const result = await query(sql);

    res.json({
      status: true,
      message: "Success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: false, message: "Failed to fatch task" });
  }
};

const detailTask = async (req, res) => {
  try {
    const sql = `SELECT * FROM tbl_task WHERE id=${req.params.id} AND isDelete = 0 AND isActive=1`;

    const result = await query(sql);

    res.json({
      status: true,
      message: "Success",
      data: result[0],
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: false, message: "Failed to fatch task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId, title, description, dueDate, status } = req.body;

    if (!taskId) {
      return res
        .status(400)
        .json({ status: false, message: "Task ID is required" });
    }

    const sql = `UPDATE tbl_task SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?`;
    const result = await query(sql, [
      title,
      description,
      dueDate,
      status,
      taskId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found or no changes made" });
    }

    res.json({ status: true, message: "Task updated successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: false, message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const sql = `DELETE FROM tbl_task WHERE id = ${req.params.id}`;
    const result = await query(sql);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ status: true, message: "Task deleted successfully" });
    } else {
      res.status(400).json({ status: false, message: "Failed to delete task" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: "Failed to delete task" });
  }
};

module.exports = {
  addProject,
  listProject,
  deleteProject,
  addTask,
  listTask,
  updateTask,
  detailTask,
  deleteTask,
};
