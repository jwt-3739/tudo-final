// backend/server.js
// server.js
const express = require('express');
const cors = require('cors');
const connection = require('./db');
const app = express();
const port = 5000;

// 启用CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}));

// 解析JSON请求体
app.use(express.json());

// 注册接口
app.post('/register', (req, res) => {
  // 警告：实际生产环境必须使用密码哈希存储！
  // 此处明文存储仅用于测试环境！
  const { username, password } = req.body;
  
  connection.query(//直接明文存储密码，实际应用中请使用加密算法
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send('用户名已存在');
        }
        return res.status(500).send('服务器内部错误');
      }
      res.send('注册成功！');
    }
  );
});

// 登录接口
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 使用Promise方式查询
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    res.json({ 
      username: rows[0].username,
      token: '模拟Token',
      message: '登录成功'
    });
    
  } catch (error) {
    console.error('登录错误:', error); // 添加详细错误日志
    res.status(500).json({ message: '服务器错误' });
  }
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const [rows] = await connection.query(
      'SELECT username, avatar FROM users WHERE username = ?',
      [req.params.username]
    );
    if (rows.length === 0) return res.status(404).json({ message: '用户不存在' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

app.put('/api/users/:username', async (req, res) => {
  try {
    const { username: newUsername, avatar } = req.body;
    await connection.query(
      'UPDATE users SET username = ?, avatar = ? WHERE username = ?',
      [newUsername, avatar, req.params.username]
    );
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新失败' });
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`后端服务已启动：http://localhost:${port}`);
});