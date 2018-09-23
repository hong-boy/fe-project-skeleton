const fs = require("fs-extra");
const path = require("path");
const readline = require("readline-sync");
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
 * 提问
 * @param {string} msg 问题描述
 * @param {string} defaultInput 默认答案
 * @param {object} options
 */
function question(msg, defaultInput, options) {
    // TODO - 似乎不支持中文
    return readline.question(msg, {
        defaultInput,
        ...options,
    });
}

/**
 * 通用问卷调查
 * @param {string} dir
 * @param {function} anotherQuestions 可选
 */
function inquiry(dir, anotherQuestions) {
    const project = question(
        "Please input project name: ($<defaultInput>) ",
        dir,
    );

    const version = question(
        "Please input project version: ($<defaultInput>) ",
        "0.0.1",
    );

    const desc = question("Please input description: ", "");

    // 扩展
    let anotherAnswers = {};
    if (typeof anotherQuestions === "function") {
        anotherAnswers = anotherQuestions({project, version, desc});
    }

    return {project, version, desc, ...anotherAnswers};
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
function install(dest) {
    const installDeps = question(
        "Would you like to install dependency automaticlly? (Y/n) ",
        "y",
    );
    if (["y", "yes"].indexOf(installDeps.toLowerCase()) !== -1) {
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
    question,
    mkdir,
    copyFiles,
    copyMustacheFiles,
    install,
};
