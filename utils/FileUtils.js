const fs = require('fs');
const path = require("path");
const https = require('https');
const yymmTemplatePath = "public/template/article/year-month-template.md"; // 年月模板文件路径
const yyTemplatePath = "public/template/article/year-template.md"; // 年模板文件路径
const allTemplatePath = "public/template/article/all-template.md"; // 年模板文件路径

// 递归创建参考代码来源地址：https://blog.csdn.net/liruiqing520/article/details/107262653
// 递归创建目录 异步方法  
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            // console.log(path.dirname(dirname));  
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
                console.log('在' + path.dirname(dirname) + '目录创建好' + dirname + '目录');
            });
        }
    });
}
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

// 更新年月的文档（YYYYMM）
function updateYYMM(startyymm, addData, dirPath) { // 更新文档
    var isMkdir = mkdirsSync(dirPath);
    if (!isMkdir) {
        console.log('新建文件夹有误！');
        return;
    }
    // 判断该文档是否存在
    console.log(dirPath)
    const YY = startyymm.substring(0, 4);
    const MM = startyymm.substring(4);
    const YY_MM = YY + "-" + MM;
    updateFile(yymmTemplatePath, dirPath, addData, YY, MM, YY_MM, startyymm);
}
// 更新年的文档（YYYY）
function updateYY(startyymm, addData, dirPath) { // 更新文档
    var isMkdir = mkdirsSync(dirPath);
    if (!isMkdir) {
        console.log('新建文件夹有误！');
        return;
    }
    // 判断该文档是否存在
    // console.log(dirPath)
    const YY = startyymm.substring(0, 4);
    const MM = startyymm.substring(4);
    const YY_MM = YY + "-" + MM;
    updateFile(yyTemplatePath, dirPath, addData, YY, MM, YY_MM, YY);
}
// 更新总的文档（all.md）
function updateAll(startyymm, addData, dirPath) { // 更新文档
    var isMkdir = mkdirsSync(dirPath);
    if (!isMkdir) {
        console.log('新建文件夹有误！');
        return;
    }
    // 判断该文档是否存在
    // console.log(dirPath)
    const YY = startyymm.substring(0, 4);
    const MM = startyymm.substring(4);
    const YY_MM = YY + "-" + MM;
    const fileName = "all";
    updateFile(allTemplatePath, dirPath, addData, YY, MM, YY_MM, fileName);
}

function updateFile(templatePath, dirPath, addData, YY, MM, titleName, fileName) {
    var filePath = dirPath + fileName + ".md";
    var finalData = new String();
    console.log(filePath)
    try {
        if (fs.existsSync(filePath)) {
            // 文档存在，读取里面内容
            finalData = fs.readFileSync(filePath, 'utf-8');
        } else {
            // 文档不存在，读取模板文件
            finalData = fs.readFileSync(templatePath, 'utf-8');
            // finalData = finalData.replace("/YY/g", YY);
            finalData = replaceAll(finalData, "&{YY}&", YY);
            finalData = replaceAll(finalData, "&{MM}&", MM);
        }
        var finalDataMap = isUpdateYYOrYYMM("## " + titleName, finalData);
        var {
            content,
            optPosition
        } = finalDataMap;
        finalData = updateOptPosition(optPosition, addData, content);
        fs.writeFileSync(filePath, finalData, (err) => { // 重写该文档（appendFile是追加并不存在就直接创建）
            if (err) throw err;
            console.log('写入成功' + filePath);
        })
    } catch (err) {
        console.log(err)
    }
}

// "## 年月" 判断是否需要添加，不需要则返回原文和位置；需要添加后再返回原文和位置
function isUpdateYYOrYYMM(findOrUpdateStr, content) {
    var findPosition = content.indexOf(findOrUpdateStr);
    if (findPosition !== -1) { // 已经存在，返回这个位置和原文
        return {
            optPosition: findPosition + findOrUpdateStr.length,
            content,
        };
    }
    // 不存在，添加插入
    const templateValue = "的模板 -->";
    var findTemplatePosition = content.indexOf(templateValue) + templateValue.length;
    content = updateOptPosition(findTemplatePosition, "\r\n" + findOrUpdateStr, content);
    return {
        optPosition: findTemplatePosition + "\r\n".length + findOrUpdateStr.length,
        content,
    };
}

// 插入内容更新到指定位置
function updateOptPosition(optPosition, addTxt, content) {
    content = content.substring(0, optPosition) + addTxt + content.substring(optPosition);
    return content;
}

function downloadFile(downUrl, fileNamePath) {
    // Download the file
    https.get(downUrl, (res) => {
        // Open file in local filesystem
        const file = fs.createWriteStream(fileNamePath);
        // Write data into local file
        res.pipe(file);
        // Close the file
        file.on('finish', () => {
            file.close();
            console.log(`File downloaded!`, fileNamePath);
        });
    }).on("error", (err) => {
        console.log("Error: ", err.message, fileNamePath);
    });

}

// downloadFile(`https://p3-passport.byteimg.com/img/user-avatar/db3b09f9ca107d8843cee3fe8f4f0cd4~180x180.awebp`, `./docs/.vuepress/public/favicon.ico`);

// node14 不支持replaceAll，手写一个（不然就升级到node16）
function replaceAll(str, match, replacement) {
    return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = {
    mkdirs,
    mkdirsSync,
    updateYYMM,
    updateYY,
    updateAll,
    replaceAll,
}