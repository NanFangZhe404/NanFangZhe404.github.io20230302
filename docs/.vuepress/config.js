// 官方参数参考地址：https://vuepress-theme-reco.recoluan.com/views/1.x/blog.html
module.exports = {
  locales: { // 默认语言代码为 en-US
    '/': {
      lang: 'zh-CN' // 这里修改中文
    }
  },
  title: "酱酱们的每日掘金的文章合集",
  description: "精选文章，每日掘金，工作日陪伴，文章数据库", // meta 中的描述文字，用于SEO
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['meta', {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,user-scalable=no'
    }],
    ['meta', {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }],
    ['meta', {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black'
    }],
    ['meta', {
      name: 'keywords',
      content: '前端, 技术文章, 移动端, pc端, 数据库, 后端, 酱酱们的每日掘金'
    }],
    [
      "link",
      {
        rel: "shortcut icon ",
        type: "images/x-icon",
        href: "https://p3-passport.byteacctimg.com/img/user-avatar/b72e991ee9b1c9bdca7b2bd4c8dc78a8~300x300.image"
      },
    ],
    [
      "script",
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f7c04e5ddb588d9604e7d1ef5b7483af";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
  ],
  serviceWorker: true, // 是否开启 PWA
  base: '/', // 部署到github相关的配置
  markdown: {
    lineNumbers: true // 代码块是否显示行号
  },
  theme: 'reco',
  themeConfig: { // 博客配置
    logo: 'https://p3-passport.byteacctimg.com/img/user-avatar/b72e991ee9b1c9bdca7b2bd4c8dc78a8~300x300.image',
    // authorAvatar: '/avatar.png',
    noFoundPageByTencent: true, // 关闭 404 腾讯公益
    author: 'github.com/tea-blog',
    modePicker: false, // 不显示模式调节按钮（true 显示）
    startYear: '2023',
    nav: [{
        text: "✍️总览",
        link: "/sort/all.html",
        // icon: 'reco-blog'
      }, {
        text: '🕙时间分类',
        items: [{
    text: '2023',
        link: '/categories/2023/'
    }, ]
        // [{
        //     text: '2022',
        //     link: '/categories/2022/'
        //   },
        //   {
        //     text: '2023',
        //     link: '/categories/2023/'
        //   }
        // ]
      },
      {
        text: "👣找到我",
        link: "https://juejin.cn/user/2819602825362840",
      },
      {
        text: "💌订阅",
        link: "https://juejin.cn/column/7107151273765371941",
      },
      {
        text: "🐛源码",
        link: "https://github.com/tea-blog/tea-blog.github.io",
      },
    ],
    displayAllHeaders: true,
    sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2,
    // 博客配置
    blogConfig: {}
  }
};