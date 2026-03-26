# Supabase 存储桶创建指南

## 1. 登录 Supabase 控制台

1. 访问 [Supabase 控制台](https://app.supabase.com/)
2. 输入您的邮箱和密码登录
3. 在项目列表中找到您的项目（项目 URL：https://dvfwipwswnfhvrsspfej.supabase.co）
4. 点击项目名称进入项目控制台

## 2. 创建存储桶

1. 在左侧导航栏中，找到并点击 "Storage" 选项
2. 点击 "Create a new bucket" 按钮
3. 在弹出的对话框中：
   - **Name**: 输入 "covers"（必须使用这个名称，因为代码中已经指定）
   - **Public**: 勾选 "Make public" 选项，这样上传的图片可以通过公共 URL 访问
   - **File size limit**: 可以保持默认值
4. 点击 "Create Bucket" 按钮

## 3. 配置存储策略

1. 存储桶创建完成后，点击 "Policies" 标签页
2. 点击 "New Policy" 按钮
3. 在 "Policy name" 中输入 "Allow public access"
4. 在 "Allowed operation" 中选择 "ALL"
5. 在 "Target roles" 中选择 "public"
6. 点击 "Review" 按钮
7. 点击 "Save Policy" 按钮

## 4. 测试图片上传

1. 刷新您的网站页面（http://localhost:5173/）
2. 进入后台管理页面
3. 尝试上传一张图片作为文章封面
4. 检查图片是否成功上传并显示

如果您在执行过程中遇到任何问题，请提供具体的错误信息，我会进一步帮助您解决。