const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// ミドルウェア
app.use(bodyParser.json());
app.use(express.static('public')); // フロントエンド用のファイルを公開

// タスクデータを保存するファイル
const dataFile = 'tasks.json';

// タスクをロード
function loadTasks() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// タスクを保存
function saveTasks(tasks) {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
}

// タスク一覧を取得
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// タスクを追加
app.post('/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    status: 'ToDo',  // 新規タスクは「ToDo」ステータスから始まる
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json(newTask);
});

// タスクを削除
app.delete('/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.json({ success: true });
});

// タスクのステータスを更新
app.put('/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find(task => task.id === parseInt(req.params.id));
  if (task) {
    task.status = req.body.status;  // ステータスを更新
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// サーバー起動
app.listen(port, () => {
  console.log(`Task manager app listening at http://localhost:${port}`);
});
