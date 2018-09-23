const ora = require("ora");
const path = require("path");
const chalk = require("chalk");

const {
    isLegalDirName,
    isExistDir,
    inquiry,
    question,
    mkdir,
    copyFiles,
    copyMustacheFiles,
    install,
    TEMPLATES_DIR,
} = require("./util");

const spinner = ora();

/**
 * 问卷
 * @param {object} cmd 对应命令的参数选项，如：init命令的参数选项为{web, plugin, webOnly}
 * @param {object} answers
 */
function anotherQuestions(cmd, answers) {
    const result = {};
    if(cmd.plugin){
        const moduleName = question(
            "Please input exported module name: ($<defaultInput>) ",
            answers.project,
            {
                validate: () => {
                },
            },
        );
        result.moduleName = moduleName;
    }

    return result;
}

async function action(dir, {web, plugin, webOnly}) {
    // 若文件夹命名不合法或文件夹是否已存在，则直接退出
    if (!isLegalDirName(dir) || isExistDir(dir)) {
        return process.exit();
    }

    let enableWeb = web; // 启用 "--web"
    const enableWebOnly = webOnly; // 启用 "--web-only"
    const enablePlugin = plugin; // 启用 "--plugin"

    // 若没有传入配置参数，则使用"--web"作为默认配置参数
    if (!(web || plugin || webOnly)) {
        // eslint-disable-next-line
        console.log(
            chalk.yellow("没有接收到参数配置项，将使用默认参数配置: --web"),
        );
        enableWeb = true;
    }

    let subDir = null;
    if (enableWeb || enableWebOnly) {
        subDir = "web";
    } else if (enablePlugin) {
        subDir = "plugin";
    }
    const src = path.join(TEMPLATES_DIR, subDir);

    // 开启问卷
    const locals = inquiry(dir, anotherQuestions.bind(null, {web, plugin, webOnly}));

    // 创建新目录
    mkdir(dir);
    spinner.start(`生成新项目目录 [${dir}]...`);
    await Promise.all([
        copyFiles(src, dir),
        copyMustacheFiles(src, dir, locals),
    ]);
    spinner.succeed();
    // 是否自动安装依赖
    install(dir);
    spinner.succeed("完成！").stop();
}

function printHelp({commandName}) {
    /* eslint-disable no-console */
    console.log("");
    console.log("Examples:");
    console.log("");
    console.log(`  $ ${commandName} init --help`);
    console.log(`  $ ${commandName} init --web react-hello-world-web`);
    console.log(
        `  $ ${commandName} init  --web-only react-hello-world-no-express-web`,
    );
    console.log(
        `  $ ${commandName} init  --plugin react-hello-world-plugin-web`,
    );
    /* eslint-enable no-console */
}

/**
 * commander - init
 * （用于创建项目结构）
 *      --web：创建Web项目结构（默认包含express服务器）
 *      --web-only：创建Web项目结构（不含express服务器）
 *      --plugin：创建用于编写通用组件的项目结构（默认基于react）
 */
module.exports = function registerCommand4Init(program, pkg) {
    program
        .command("init <dir>")
        .alias("i")
        .description("创建项目结构")
        .usage("<options> <dir>")
        .option("-W, --web", "创建Web项目结构（默认包含express服务器）")
        .option("--web-only", "创建Web项目结构（不含express服务器）")
        .option(
            "-P, --plugin",
            "创建用于编写通用组件的项目结构（默认基于react）",
        )
        .action(action)
        .on("--help", printHelp.bind(null, pkg));
};
