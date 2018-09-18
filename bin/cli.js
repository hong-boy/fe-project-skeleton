const program = require("commander");
const path = require("path");
const mkdirp = require("mkdirp");
// const fs = require("mz/fs");
// const chalk = require("chalk");
const readline = require("readline-sync");
const kopy = require("kopy");
const mustache = require("jstransformer-mustache");
const pkg = require("../package.json");

// 获取项目根路径
const ROOT_DIR = path.join(__dirname, "..");
// 获取templates目录
const TEMPLATES_DIR = path.join(ROOT_DIR, "templates");

// 定义命令行选项参数
program
    .name(pkg.version)
    .version(pkg.version, " --version")
    .parse(process.argv);

// 获取模板目录
const dest = program.args.shift() || "./";

// 问答交互
function inquiry() {
    const project = readline.question("Please input project name ($<defaultInput>): ", {
        defaultInput: "fe-hello-world"
    });

    return { project };
}

function mkdir(dir) {
    // 生成目标目录
    // TODO - 判断目标目录是否为空
    // 如果目标目录为空或者不存在，则直接创建
    // 如果目标目录不为空，则提示可能会覆盖同名文件
    mkdirp(dir);
}

// 直接复制普通文件
async function copyFiles(src, dest) {
    // TODO - kopy默认使用ejs引擎来解析文件、默认忽略二进制文件，因此要特别处理
    await kopy(src, dest, {
        glob: ["**", "!**/*.mustache"]
    });
}
// 拷贝.mustache文件
async function copyMustacheFiles(src, dest, locals) {
    kopy(src, dest, {
        glob: ["**/*.mustache"],
        template: mustache,
        data: {
            locals
        },
        move: {
            "*.mustache": filepath => filepath.replace(/(\.mustache)$/, "")
        }
    });
}

async function startup() {
    const locals = await inquiry();
    await mkdir(dest);
    copyFiles(TEMPLATES_DIR, dest);
    copyMustacheFiles(TEMPLATES_DIR, dest, locals);
}

startup();
