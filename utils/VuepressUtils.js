const fs = require('fs');
const {
    replaceAll
} = require('./FileUtils');
const http = require('./Http');
const user_id = "2840793779295133";
// 生成 vuepress 配置相关
const readmeTemplatePath = "public/template/vuepress/readme-template.md"; // README 模板
const configTemplatePath = "public/template/vuepress/config-template.js"; // config 模板
const configFilePath = "docs/.vuepress/config.js"; // config 生成路径
const readMeFilePath = "docs/README.md"; // README 生成路径

const getREADME = (user_id, cover_png) => {
    var template = fs.readFileSync(readmeTemplatePath, 'utf-8');
    template = replaceAll(template, "{{user_id}}", user_id);
    // var cover_png = `/head.png`;
    if (!cover_png) cover_png = `/cat.jpg`
    template = replaceAll(template, "{{cover_png}}", cover_png);
    return template;
}

const initREADME = (initREADMEData) => {
    const {
        user_id,
        cover_png,
    } = initREADMEData;
    const readmeRes = getREADME(user_id, cover_png);
    fs.writeFileSync(readMeFilePath, readmeRes, (err) => { // 重写该文档（appendFile是追加并不存在就直接创建）
        if (err) throw err;
        console.log('写入成功' + readMeFilePath);
    })
}

// var readmeRes = getREADME("213", `"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8412ecb9f6d401587097529571f6045~tplv-k3u1fbpfcp-watermark.image?"`);
// console.log(readmeRes)


var replaceConfigData = {
    user_id,
    // column_id: user_id + "/columns",
    time_sort_list_str: `[{
            text: '2022',
            link: '/categories/2022/'
          },
          {
            text: '2023',
            link: '/categories/2023/'
          }
        ]
    `,
    user_name: "南方者",
    start_year: 2022,
    order_column_url: "https://juejin.cn/user/" + user_id + "/columns", // 订阅地址 （如果是指定用户所有文章，那么订阅就会变成该用户下的专栏页）
    // order_column_url: "https://juejin.cn/columns/" + column_id, // 订阅地址 （指定专栏）
    find_me_url: "https://juejin.cn/user/" + user_id, // 找到我
    baidu_count_url: `\`var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f7c04e5ddb588d9604e7d1ef5b7483af";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      \``, // 百度统计
    favicon_ico: "https://p3-passport.byteimg.com/img/user-avatar/db3b09f9ca107d8843cee3fe8f4f0cd4~180x180.awebp", // 页面标题旁的小图标
    logo_png: "https://p3-passport.byteimg.com/img/user-avatar/db3b09f9ca107d8843cee3fe8f4f0cd4~180x180.awebp", // 头像
}

const getConfig = (replaceData) => {
    var {
        user_name,
        time_sort_list_str, // 这个需要加双引号（即"{{[]}}"） 一个数组的时间
        find_me_url,
        order_column_url,
        baidu_count_url,
        start_year,
        favicon_ico,
        logo_png,
    } = replaceData;

    var template = fs.readFileSync(configTemplatePath, 'utf-8');
    template = replaceAll(template, "{{find_me_url}}", find_me_url);
    template = replaceAll(template, "{{order_column_url}}", order_column_url);
    template = replaceAll(template, "\"{{time_sort_list}}\"", time_sort_list_str);
    template = replaceAll(template, "{{user_name}}", user_name);
    template = replaceAll(template, "{{start_year}}", start_year);
    template = replaceAll(template, "`{{baidu_coutn_url}}`", baidu_count_url);
    template = replaceAll(template, "{{favicon_ico}}", favicon_ico);
    template = replaceAll(template, "{{logo_png}}", logo_png);
    return template;
}
const initConfig = (replaceConfigData) => {
    var res = getConfig(replaceConfigData);
    // console.log(res)
    var finalData = res;
    fs.writeFileSync(configFilePath, finalData, (err) => { // 重写该文档（appendFile是追加并不存在就直接创建）
        if (err) throw err;
        console.log('写入成功' + filePath);
    })

}
// return;
const userUrl = "https://api.juejin.cn/user_api/v1/user/get";

const isInit = () => { // 是否已经初始化
    return fs.existsSync(configFilePath);
}

async function getJuejinUserInfo(user_id) {
    var data = {
        user_id,
    };
    var res = await http.get(userUrl, data);
    var user_info = res.data.data;
    return getUserBean(user_info);
}

const getUserBean = (user_info) => {
    var {
        description, // 介绍
        blog_address, // 博客地址
        user_name, // 用户名
        user_id, // user_id
        avatar_large, // 头像
    } = user_info;
    var userBean = {
        description, // 介绍
        blog_address, // 博客地址
        user_name, // 用户名
        user_id, // user_id
        avatar_large, // 头像
        user_url: "https://juejin.cn/user/" + user_id, // 掘金主页
    }
    return userBean;
}

module.exports = {
    getJuejinUserInfo,
    initREADME,
    initConfig,
    isInit,
}