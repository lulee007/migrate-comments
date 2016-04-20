#!/usr/bin/env node
var program = require('commander');
var fs = require("fs");

program
    .option('-s, --source <source>', '原有站点导出的 JSON 文件')
    .option('-d, --destination <destination>', '新的站点导出的 JSON 文件')
    .parse(process.argv);

if (typeof program.source === 'undefined') {
    console.error('不能缺少-s 参数!');
    process.exit(1);
}
if (typeof program.destination === 'undefined') {
    console.error('不能缺少-d 参数!');
    process.exit(1);
}

console.log('****%s******', '准备处理文件');
console.log('****源文件：%s******', program.source);
console.log('****目标文件：%s******', program.destination);

// Buffer 转为 String 并且把所有数字转为字符串 
var sourceContent = replaceBigIntToStrInJson(fs.readFileSync(program.source).toString());
console.log('****%s******', '处理源文件完成');

var destinationContent = replaceBigIntToStrInJson(fs.readFileSync(program.destination).toString());
console.log('****%s******', '处理目标完成');

var sourceOjb = JSON.parse(sourceContent);
var destinationObj = JSON.parse(destinationContent);

var sourceSiteId = '';
var sourceThreads = sourceOjb.threads.map(function (thread) {
    sourceSiteId = thread.site_id;
    var filterd = {
        thread_id: thread.thread_id + '',
        thread_key: thread.thread_key,
        url: thread.url
    };
    return filterd;
});

var desSiteId = '';
var desThreads = destinationObj.threads.map(function (thread) {
    desSiteId = thread.site_id;
    var filterd = {
        thread_id: thread.thread_id + '',
        thread_key: thread.thread_key,
        url: thread.url
    };
    return filterd;
});

if (sourceSiteId && desSiteId) {
    var reg = new RegExp(sourceSiteId, 'g');
    sourceContent = sourceContent.replace(reg, desSiteId);
    console.log('*****替换 site_id:%s>>%s', sourceSiteId, desSiteId);
}

desThreads.forEach(function (thread) {
    var matchThread = sourceThreads.filter(function (th) {
        return th.thread_key == thread.thread_key;
    });
    if (matchThread[0]) {
        var idReg = new RegExp('\"' + matchThread[0].thread_id + '\"', 'g');
        // console.log(sourceContent.match(idReg));
        sourceContent = sourceContent.replace(idReg, '\"' + thread.thread_id + '\"');

        var urlReg = new RegExp('\"' + matchThread[0].url + '\"', 'g');
        sourceContent = sourceContent.replace(urlReg, thread.url);
        var out = sourceThreads.splice(sourceThreads.indexOf(matchThread[0]), 1);
        console.log('*****替换 thread_id:%s>>%s', matchThread[0].thread_id, thread.thread_id);
        console.log('*****替换 url:%s>>%s', matchThread[0].url, thread.url);
    }

});
console.log('*****替换完成，共替换了 %s 条评论******', desThreads.length);

var result = JSON.parse(sourceContent);
delete result.threads;

var saveFile = process.cwd() + '/migrated.json';
fs.writeFileSync(saveFile, JSON.stringify(result));

console.log('*****处理完成，文件保存在：%s******', saveFile);


function replaceBigIntToStrInJson(_source) {
    // Buffer 转为 String 并且把所有数字转为字符串
    var newSourece = _source.replace(/:(\d+)([,\}])/g, ':"$1"$2');
    // 找出所有数字数组
    var tempSourceIntArray = newSourece.match(/\[((\d+)(,|\d+))+(\])/g);
    if (tempSourceIntArray) {
        tempSourceIntArray.forEach(function (item) {
            //将数字数组 替换为 字符串数组
            var newItem = '[\"' + item.replace(/\[|\]/g, '') + '\"]';
            newItem = newItem.replace(/,/g, '\",\"');
            newSourece = newSourece.replace(item, newItem);
        });
    }
    return newSourece;
}
