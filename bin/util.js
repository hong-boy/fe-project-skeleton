const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const mustache = require("jstransformer-mustache");
const kopy = require("kopy");
const chalk = require("chalk");
const which = require("which");
const spawn = require("cross-spawn");

// templates目录
const TEMPLATES_DIR = path.join(__dirname, "../templates");


/**
 * 判断文件夹名称是否合法
 */
function isLegalDirName(dir) {
    // 判断文件夹名称是否合法
    const flag = /^[a-z][a-z|0-9|\-|_]+$/.test(dir);
    if (!flag) {
        // eslint-disable-next-line
        console.log(chalk.red(`文件夹名称不合法：[${dir}]！仅支持小写字母、数字、中横线、下划线，例如：fe-hello-world-web`));
    }
    return flag;
}

/**
 * 判断文件夹是否已经存在
 */
function isExistDir(dir) {
    const fullPath = path.join(process.cwd(), dir);
    const flag = fs.existsSync(fullPath);
    if (flag) {
        // eslint-disable-next-line
        console.log(chalk.red(`文件夹已存在：[${dir}, ${fullPath}]`));
    }
    return flag;
}

/**
 * 通用问卷调查
 * @param {string} dir
 * @param {function} anotherQuestions 可选
 */
async function inquiry(dir, anotherQuestions){

    const questions = [
        {
            type: "input",
            name: "project",
            message: "请输入项目名称:",
            default: dir
        },
        {
            type: "input",
            name: "version",
            message: "请输入项目版本号:",
            default: "0.0.1"
        },
        {
            type: "input",
            name: "desc",
            message: "请输入项目描述:"
        }
    ];

    const answers = await inquirer.prompt(questions);
    // 扩展
    let anotherAnswers = {};
    if (typeof anotherQuestions === "function") {
        anotherAnswers = await anotherQuestions(answers);
    }

    return {...answers, ...anotherAnswers};
}


/**
 * 创建项目根目录
 * @param {string} dir
 */
function mkdir(dir) {
    // 创建文件夹
    fs.ensureDirSync(dir);
}

/**
 * 直接复制普通文件
 */
async function copyFiles(src, dest) {
    // TODO - kopy默认使用ejs引擎来解析文件、默认忽略二进制文件，因此可能要特别处理
    await kopy(src, dest, {
        glob: ["**", "!**/*.mustache"],
    });
}

/**
 * 解析.mustache文件，然后复制到目标目录
 */
async function copyMustacheFiles(src, dest, locals) {
    await kopy(src, dest, {
        glob: ["**/*.mustache"],
        template: mustache,
        data: {
            locals,
        },
        move: {
            "**/*.mustache": filepath => filepath.replace(/(\.mustache)$/, ""),
        },
    });
}

/**
 * 查找nodejs包管理器，优先使用yarn
 */
function getCmd() {
    // 判断平台win32 or mac/*nux，windows平台下可执行文件以.cmd结尾
    let cmd = null;
    const managers =
        process.platform === "win32"
            ? ["yarn.cmd", "cnpm.cmd", "npm.cmd"]
            : ["yarn", "cnpm", "npm"];

    // 查找包管理工具： yarn > cnpm > npm
    for (let i = 0; i < managers.length; i++) {
        try {
            cmd = which.sync(managers[i]);
            // eslint-disable-next-line
            console.log("包管理器: ", managers[i]);
            break;
        } catch (e) {
            // eslint-disable-line
        }
    }

    if (!cmd) {
        throw Error("没有找到npm安装路径，请确认是否正确安装npm");
    }

    return cmd;
}

/**
 * 安装依赖
 */
async function install(dest) {

    const {isInstall} = await inquirer.prompt({
        type: "confirm",
        name: "isInstall",
        message: "是否自动安装依赖包:",
        default: true
    });

    if (isInstall) {
        // 进入新项目目录
        process.chdir(dest);
        // 执行npm install
        spawn.sync(getCmd(), ["install"], {stdio: "inherit"});
    }
}


module.exports = {
    TEMPLATES_DIR,
    isLegalDirName,
    isExistDir,
    inquiry,
    mkdir,
    copyFiles,
    copyMustacheFiles,
    install,
};
