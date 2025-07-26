const Task = require("../models/Task");

// Admin: Upload a new task
exports.createTask = async (req, res) => {
  try {
    const { platform, taskType, title, link, reward, watchTime } = req.body;

    if (!platform || !taskType || !title || !link || !reward) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const newTask = new Task({
      platform,
      taskType,
      title,
      link,
      reward,
      watchTime,
      createdBy: req.user?.id || null, // Optional: set admin ID if using auth
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User: Fetch active tasks by platform
exports.getTasksByPlatform = async (req, res) => {
  try {
    const { platform } = req.query;

    if (!platform) {
      return res.status(400).json({ error: "Platform is required" });
    }

    const tasks = await Task.find({ platform, status: "active" }).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
