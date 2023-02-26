// npm install axios --save
// npm install fs --save
// path作用实现创建多层目录
// npm install path --save
const {
    updateAll,
    updateYY,
    updateYYMM,
} = require('./utils/FileUtils');
const {
    getArticleMap,
} = require('./utils/ArticleUtils');

const http = require("./utils/Http");
const VuepressUtils = require("./utils/VuepressUtils");
// const user_id = "2840793779295133"; // 用户id
// const column_id = "7107151273765371941"; // 《酱酱们的每日掘金》专栏id
// const column_id = "7140398633710518302"; // 专栏id（）

// 获取参数，process是node环境下全局变量，可以直接拿来用. argv属性返回一个数组.
// 第一个参数是node.exe的执行绝对路径
// 第二个参数是当前执行的js文件的绝对路径
// 第三个参数就是user_id
// 第四个参数就是column_id
const argv = process.argv
// return;
if (argv.length < 3) {
    console.log("需要输入参数 node x.js user_id column_id");
    console.log("（其中 column_id 是可选填; user_id 是必须）");
    return;
}
console.log(JSON.stringify(argv))
const user_id = argv[2]; // 用户id
const column_id = argv[3]; // 专栏id
// console.log(column_id)

const mkdirPath = "./docs/sort/"; // 生成文件的地址
// 链接
const columnUrl = "https://api.juejin.cn/content_api/v1/column/articles_cursor"; // 请求指定专栏里的文章列表

var columnData = {
    column_id, // 专栏id
    // "cursor": cursor, 这里在 Http.js 文件里有做处理
    "limit": 20, // 页大小
    "sort": 2, // 排序（1最早 2最新） 
}
// console.log(qs.stringify(data));

const articleUrl = "https://api.juejin.cn/content_api/v1/article/query_list"; // 请求获取文章列表
var articleData = {
    "sort_type": 2,
    user_id, // 用户id
}

// return;

// 获取数据
async function catchTxt() {
    var articleList = [];
    if (column_id) { // 专栏id存在，只选择爬取专栏的
        articleList = await http.juejinPost(columnUrl, columnData, 1); // 获取指定专栏
    } else {
        articleList = await http.juejinPost(articleUrl, articleData, 10); // 获取个人所有文章
    }
    // console.log(articleList);
    // return;
    console.log("articleList.length：" + articleList.length)
    var articleMap = getArticleMap(articleList, mkdirPath); // 解析数据
    console.log("articleMap.size：", articleMap.size);
    // 生成 vuepress 相关配置文件
    initVuepress(user_id, column_id, articleMap, articleList[0]);
    // 添加文章和文章内容
    update(articleMap);
    // updateYY(YY + ".md", str, mkdirPath + "/" + YY + "/");
}

// 初始化 vuepress 相关配置的生成（和 user_id 和 column_id 关联）
async function initVuepress(user_id, column_id, articleMap, article) {
    var userBean = await VuepressUtils.getJuejinUserInfo(user_id);
    var yyMap = new Map(); // 年月日的已经排序好，不过是倒序的，所以遍历一般好让年月的时间正序起来
    var yyList = [];
    articleMap.forEach((str, yymm) => {
        const yy = yymm.substring(0, 4);
        var yyStr = yyMap.get(yy);
        if (!yyStr) {
            yyMap.set(yy, true);
            yyList.push(yy);
        }
    });
    var cover_png = ""
    if (column_id) { // 指定专栏，把专栏的导图放入
        var {
            article_info
        } = article;
        cover_png = article_info.cover_png; // 专栏导图（有可能没有）
    }
    userBean.cover_png = cover_png;
    VuepressUtils.initREADME(userBean); // 初始化 vuepress 的 README 文件

    // 添加分类（按年的分类）
    var time_sort_template = `{
    text: '{{year}}',
        link: '/categories/{{year}}/'
    }, `;
    var time_sort_list_str = `[`;
    var start_year = Number(yyList[0]);
    for (var yy of yyList) {
        if (start_year > Number(yy)) {
            start_year = Number(yy);
        }
        time_sort_list_str += time_sort_template.replace("{{year}}", yy).replace("{{year}}", yy);
    }
    time_sort_list_str += "]"
    userBean.time_sort_list_str = time_sort_list_str; // 
    userBean.start_year = start_year; // 写作开始的年份
    userBean.baidu_count_url = `\`var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f7c04e5ddb588d9604e7d1ef5b7483af";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      \``; // 百度统计
    userBean.find_me_url = "https://juejin.cn/user/" + user_id; // 找到我
    userBean.favicon_ico = userBean.avatar_large; // 页面标题旁的小图标
    userBean.logo_png = userBean.avatar_large; // 头像
    if (column_id) {
        userBean.order_column_url = "https://juejin.cn/column/" + column_id; // 订阅地址 （如果是指定用户所有文章，那么订阅就会变成该用户下的专栏页）
    } else {
        userBean.order_column_url = "https://juejin.cn/user/" + user_id + "/columns"; // 订阅地址 （如果是指定用户所有文章，那么订阅就会变成该用户下的专栏页）
    }

    VuepressUtils.initConfig(userBean);
}


// 进一步处理文章和更新操作
function update(articleMap) {
    var yymmMapList = []; // 年月日的已经排序好，不过是倒序的，所以遍历一般好让年月的时间正序起来
    articleMap.forEach((str, yymm) => {
        yymmMapList.push({
            yymm,
            str
        });
    });
    // console.log(yymmMapList);
    // return;
    for (var backIndex in yymmMapList) {
        var oneMap = yymmMapList[yymmMapList.length - backIndex - 1];
        var {
            yymm,
            str
        } = oneMap;
        // console.log(oneMap, str, yymm)
        const yy = yymm.substring(0, 4);
        updateYYMM(yymm, str, mkdirPath + yy + "/");
        updateYY(yymm, str, mkdirPath + yy + "/");
        updateAll(yymm, str, mkdirPath + "/");
    }
    return;
}

catchTxt();