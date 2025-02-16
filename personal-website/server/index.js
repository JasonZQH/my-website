const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

// 允许跨域
app.use(cors());
// 解析 JSON 请求体
app.use(bodyParser.json());

// 用于测试的 GET 接口
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// 接收匿名建议的 POST 接口
app.post('/api/suggestions', (req, res) => {
  const { field, canRefer, isRecruiter, content } = req.body;
  // 后续你可以将这些数据存到数据库; 这里先简单返回到客户端
  console.log('Received suggestion:', req.body);

  res.status(200).json({ message: 'Suggestion received successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
