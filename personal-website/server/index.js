const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config(); 

const { MongoClient } = require('mongodb');
const { emit } = require('process');
const app = express();
const PORT = 4000;

// MongoDB Atlas 连接字符串（替换 <username>, <password>, <dbname>）
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env");
  process.exit(1);
}

// 创建 MongoClient 实例
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// 允许跨域
app.use(cors());
// 解析 JSON 请求体
app.use(bodyParser.json());

// 连接到数据库
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
connectToDB();

// 获取数据库和集合的引用（如果数据库和集合不存在，会在第一次写入时创建）
const db = client.db("suggestionsInfoDB");  // 数据库名称
const suggestionsCollection = db.collection("suggestions");  // 集合名称

// 用于测试的 GET 接口
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// 接收匿名建议的 POST 接口
app.post('/api/suggestions', async (req, res) => {
  // 解构前端提交的所有字段，包括 email
  const { field, canRefer, isRecruiter, content, email } = req.body;
  console.log('Received suggestion:', req.body);

  try {
    // 构建待插入文档
    const suggestionDoc = {
      field,
      canRefer,
      isRecruiter,
      content,
      submittedAt: new Date()
    };

    // 如果用户选择了 referral 且提供了 email，则加入 email 字段
    if (canRefer && email) {
      suggestionDoc.email = email;
    }

    const result = await suggestionsCollection.insertOne(suggestionDoc);
    res.status(200).json({ message: 'Suggestion received successfully!', id: result.insertedId });
  } catch (error) {
    console.error("Error inserting suggestion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 提供一个 GET 接口，返回所有建议数据
app.get('/api/suggestions', async (req, res) => {
  try {
    const suggestions = await suggestionsCollection.find({}).toArray();
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
