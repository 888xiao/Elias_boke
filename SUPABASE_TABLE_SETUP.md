# Supabase 数据库表创建详细指南

## 1. 登录 Supabase 控制台

1. 访问 [Supabase 控制台](https://app.supabase.com/)
2. 输入您的邮箱和密码登录
3. 在项目列表中找到您的项目（项目 URL：https://dvfwipwswnfhvrsspfej.supabase.co）
4. 点击项目名称进入项目控制台

## 2. 打开 SQL Editor

1. 在左侧导航栏中，找到并点击 "SQL Editor" 选项
2. 您会看到一个 SQL 编辑器界面

## 3. 执行 SQL 语句

1. 在 SQL 编辑器中，粘贴以下 SQL 语句：
   ```sql
   CREATE TABLE posts (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     cover_image VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
2. 点击编辑器上方的 "Run" 按钮执行 SQL 语句
3. 等待执行完成，您会看到 "Success" 提示

## 4. 验证表创建

1. 在左侧导航栏中，点击 "Database" 选项
2. 点击 "Tables" 标签页
3. 您应该能看到刚刚创建的 "posts" 表

## 5. 测试网站功能

1. 刷新您的网站页面（http://localhost:5173/）
2. 尝试创建一篇新文章，看看是否能成功保存

如果您仍然遇到问题，请提供具体的错误信息，我会进一步帮助您解决。