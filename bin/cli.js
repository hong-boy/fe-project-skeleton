const pkg = require("../package.json");
const program = require("commander");
const path = require("path");
const mkdir = require("mkdirp");
const fs = require("mz/fs");
const kopy = require('kopy');

// 获取项目根路径
const ROOT_DIR = path.join(__dirname, "..");
// 获取templates目录
const TEMPLATES_DIR = path.join(ROOT_DIR, "templates");

// 定义命令行选项参数
program
    .name(pkg.version)
    .version(pkg.version, " --version")
    .usage("[options] [dir]")
    .parse(process.argv);

// 获取模板目录
const dest = program.args.shift() || "./";

console.log(dest);

// 生成目标目录
// TODO - 判断目标目录是否为空
//如果目标目录为空或者不存在，则直接创建
//如果目标目录不为空，则提示可能会覆盖同名文件
mkdir(dest);

kopy(TEMPLATES_DIR, dest, {
    template: require("jstransformer-handlebars"),
    data: {
      foo: true
    }
}).catch(e=>console.log(e))






