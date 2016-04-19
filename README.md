# migrate-comments
迁移站点间的多说评论

## 安装
```sh
npm install https://github.com/lulee007/migrate-comments
```

## 用法
 Usage: mc [options]

  Options:

    -h, --help                       output usage information
    -s, --source <source>            原有站点导出的 JSON 文件
    -d, --destination <destination>  新的站点导出的 JSON 文件
```sh
mc -s /Users/xxx/MyData/data/github/nodejs/migrate-comments/test/lulee007blog.json  -d /Users/xxx/MyData/data/github/nodejs/migrate-comments/test/devlu.json
```

## 参考
http://javascriptplayground.com/blog/2015/03/node-command-line-tool/
https://developer.atlassian.com/blog/2015/11/scripting-with-node/
http://blog.fens.me/nodejs-commander/
https://github.com/tj/commander.js
http://tool.chinaz.com/regex
