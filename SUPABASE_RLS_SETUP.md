# Supabase RLS 策略配置指南

## 1. 登录 Supabase 控制台

1. 访问 [Supabase 控制台](https://app.supabase.com/)
2. 输入您的邮箱和密码登录
3. 在项目列表中找到您的项目（项目 URL：https://dvfwipwswnfhvrsspfej.supabase.co）
4. 点击项目名称进入项目控制台

## 2. 启用 RLS（行级安全）

### 2.1 为 posts 表启用 RLS

1. 在左侧导航栏中，点击 "Database" 选项
2. 点击 "Tables" 标签页
3. 找到 "posts" 表，点击其右侧的 "..." 按钮，选择 "Edit table"
4. 在 "Table settings" 中，找到 "Row Level Security" 选项
5. 点击 "Enable RLS" 按钮

### 2.2 为 covers 存储桶启用 RLS

1. 在左侧导航栏中，点击 "Storage" 选项
2. 找到 "covers" 存储桶，点击其右侧的 "..." 按钮，选择 "Edit bucket"
3. 在 "Bucket settings" 中，找到 "Row Level Security" 选项
4. 点击 "Enable RLS" 按钮

## 3. 配置 RLS 策略

### 3.1 为 posts 表配置策略

1. 在 "Database" > "Tables" 中，找到 "posts" 表，点击其右侧的 "..." 按钮，选择 "Policies"
2. 点击 "New Policy" 按钮

#### 3.1.1 允许所有人读取文章

- **Policy name**: `Allow public read`
- **Allowed operation**: `SELECT`
- **Target roles**: 选择 `public`
- **Using expression**: 留空（表示允许所有操作）
- 点击 "Review" 按钮，然后点击 "Save Policy"

#### 3.1.2 只允许已登录用户修改文章

- **Policy name**: `Allow authenticated write`
- **Allowed operation**: `INSERT`, `UPDATE`, `DELETE`
- **Target roles**: 选择 `authenticated`
- **Using expression**: 留空（表示允许所有已登录用户操作）
- 点击 "Review" 按钮，然后点击 "Save Policy"

### 3.2 为 covers 存储桶配置策略

1. 在 "Storage" 中，找到 "covers" 存储桶，点击其右侧的 "..." 按钮，选择 "Policies"
2. 点击 "New Policy" 按钮

#### 3.2.1 允许所有人读取图片

- **Policy name**: `Allow public read`
- **Allowed operation**: `SELECT`
- **Target roles**: 选择 `public`
- **Using expression**: 留空（表示允许所有操作）
- 点击 "Review" 按钮，然后点击 "Save Policy"

#### 3.2.2 只允许已登录用户上传和修改图片

- **Policy name**: `Allow authenticated write`
- **Allowed operation**: `INSERT`, `UPDATE`, `DELETE`
- **Target roles**: 选择 `authenticated`
- **Using expression**: 留空（表示允许所有已登录用户操作）
- 点击 "Review" 按钮，然后点击 "Save Policy"

## 4. 创建管理员用户

1. 在左侧导航栏中，点击 "Authentication" 选项
2. 点击 "Users" 标签页
3. 点击 "Add user" 按钮
4. 填写用户信息：
   - **Email**: 输入管理员邮箱
   - **Password**: 设置管理员密码
   - **Role**: 选择 "authenticated"
5. 点击 "Add user" 按钮

## 5. 测试权限控制

1. 刷新您的网站页面（http://localhost:5173/）
2. 尝试直接访问 `/admin` 页面，应该会被重定向到登录页面
3. 使用刚才创建的管理员账号登录
4. 登录后，应该可以访问 `/admin` 页面并进行文章的增删改查操作
5. 尝试上传图片，应该可以成功上传
6. 退出登录后，再次尝试访问 `/admin` 页面，应该会被重定向到登录页面

## 6. 注意事项

- 只有使用 Supabase 控制台创建的用户才能登录后台管理系统
- 普通访客只能浏览文章列表和详情，不能进行任何写操作
- 已登录的管理员可以管理文章和上传图片
- RLS 策略确保了即使有人直接调用 API，也无法绕过权限控制

如果您在执行过程中遇到任何问题，请提供具体的错误信息，我会进一步帮助您解决。