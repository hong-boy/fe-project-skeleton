const program = require("commander");
const path = require("path");
const mkdirp = require("mkdirp");
// const fs = require("mz/fs");
// const chalk = require("chalk");
const ora = require("ora");
const readline = require("readline-sync");
const which = require("which");
const kopy = require("kopy");
const spawn = require("cross-spawn");
const mustache = require("jstransformer-mustache");
const pkg = require("../package.json");

// 获取项目根路径
const ROOT_DIR = path.join(__dirname, "..");
// 获取templates目录
const TEMPLATES_DIR = path.join(ROOT_DIR, "templates");
const spinner = ora();

// 定义命令行选项参数
program
    .name(pkg.name)
    .version(pkg.version, " --version")
    .usage("[options] [dir]")
    .on("--help", () => {})
    .parse(process.argv);

// 获取模板目录
const dest = program.args.shift() || ".";

function question(msg, defaultInput, options) {
    return readline.question(msg, {
        defaultInput,
        ...options
    });
}

// 问答交互
function inquiry() {
    const project = question(
        "Please input project name: ($<defaultInput>)",
        "fe-hello-world"
    );

    const version = question(
        "Please input project version: ($<defaultInput>)",
        "0.0.1"
    );

    const desc = question("Please input project desc:", "");

    return { project, version, desc };
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

// 查找nodejs包管理器，优先使用yarn
function getCmd() {
    let cmd = null;
    try {
        cmd = which.sync("yarn.cmd");
    } catch (error) {
        cmd = which.sync("npm.cmd");
    } finally {
        console.log("Use [%s]", cmd);
    }
    return cmd;
}

// 安装依赖
function install() {
    const installDeps = question(
        "Would you like to install dependency automaticlly? (Y/n)",
        "y"
    );
    if (!!~["y", "yes"].indexOf(installDeps.toLowerCase())) {
        // 自动安装依赖
        // 查找npm或yarn路径
        let cmd = getCmd();
        process.chdir(dest);
        spawn.sync(cmd, ["install"], { stdio: "inherit" });
    }
}

async function startup() {
    const locals = await inquiry();
    await mkdir(dest);
    // console.log(`Start to generate directory [${dest}]`); // eslint-disable-line
    spinner.start(`generating directory [${dest}]...`);
    await Promise.all([
        copyFiles(TEMPLATES_DIR, dest),
        copyMustacheFiles(TEMPLATES_DIR, dest, locals)
    ]);
    spinner.succeed();
    // console.log("Generating directory done"); // eslint-disable-line
    install();
    spinner.succeed("All done").stop();
}

// 入口
startup();
