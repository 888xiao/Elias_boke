# Supabase 项目创建和配置指南

## 1. 注册/登录 Supabase

1. 访问 [Supabase 官网](https://supabase.com/)
2. 点击右上角的 "Sign Up" 按钮注册账号，或 "Sign In" 登录现有账号
3. 按照提示完成注册/登录流程

## 2. 创建新项目

1. 登录后，在仪表盘页面点击 "New Project" 按钮
2. 填写项目信息：
   - **Project Name**: 输入项目名称，例如 "my-blog"
   - **Database Password**: 设置数据库密码，记住这个密码
   - **Region**: 选择离你最近的区域，例如 "Singapore (ap-southeast-1)"
3. 点击 "Create Project" 按钮，等待项目创建完成（通常需要几分钟）

## 3. 创建数据库表

1. 项目创建完成后，进入项目仪表盘
2. 在左侧导航栏中点击 "SQL Editor"
3. 在 SQL 编辑器中粘贴以下 SQL 语句：
   ```sql
   CREATE TABLE posts (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     cover_image VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
4. 点击 "Run" 按钮执行 SQL 语句，创建 posts 表

## 4. 获取 API 信息

1. 在左侧导航栏中点击 "Settings"
2. 选择 "API" 选项卡
3. 复制以下信息：
   - **Project URL**: 例如 "https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
   - **Anon Key**: 例如 "********************************************************************************************************************************************************************************************************"

## 5. 配置项目

将获取到的 API 信息保存好，稍后我们会在前端项目中使用这些信息来连接 Supabase 数据库。