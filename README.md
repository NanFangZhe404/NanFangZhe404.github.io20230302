# tea-blog
tea-blog

# 安装依赖 
npm install

# 启动项目 
npm start

# 构建项目 
npm run build

# 使用流程
## 快速使用(使用GitHub Action构建)

自动化执行任务: 获取掘金专栏文章， 并将文章目录链接更新至GitHub pages。\
自动化运行时间: 北京时间下午 16:00

1. [Fork 仓库](https://github.com/tea-blog/tea-blog.github.io)

2. 仓库 -> Settings -> Secrets -> New repository secret, 添加Secrets变量如下:

    | Name | Value | Required |
    | --- | --- | --- |
    | JUEJIN_USER_ID | 掘金用户id  | 是 |
    | JUEJIN_COLUMN_ID | 掘金专栏id  | 是 |
    | PRESS_TOKEN_JUEJIN_BLOG | GitHub Personal access tokens，用户推送仓库，同步GitHub pages  | 是 |

4. 仓库 -> Actions, 检查Workflows并启用。


## 问题

### 如何获取 JUEJIN_USER_ID
掘金查看个人主页，个人主页链接后面的数字，即为`JUEJIN_USER_ID`
> 例如: https://juejin.cn/user/2819602825362840 `JUEJIN_COLUMN_ID` 为 2819602825362840

### 如何获取 JUEJIN_COLUMN_ID
进入掘金专栏首页，该页面链接后面的数字，即为`JUEJIN_COLUMN_ID`

> 例如: https://juejin.cn/column/7107151273765371941 `JUEJIN_COLUMN_ID` 为 7107151273765371941


### 如何创建 PRESS_TOKEN_JUEJIN_BLOG
参考 [创建个人访问令牌](https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)