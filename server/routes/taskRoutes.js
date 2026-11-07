const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
});



router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = await Task.create({
      title,
      description,
      user: req.userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to create task",
      error: error.message
    });
  }
});


router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      updates.description = req.body.description;
    }

    if (req.body.completed !== undefined) {
      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update"
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId
      },
      {
        $set: updates
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to update task",
      error: error.message
    });
  }
});



router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
});

module.exports = router;