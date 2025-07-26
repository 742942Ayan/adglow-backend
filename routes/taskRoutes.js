router.post('/', authMiddleware, isAdmin, async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
