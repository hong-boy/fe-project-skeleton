#!/usr/bin/env node
const program = require("commander");
const chalk = require("chalk");
const pkg = require("../package.json");
const registerCommand4Init = require("./cmd.init");

// eslint-disable-next-line
pkg.commandName = Object.keys(pkg.bin)[0];

// 运行命令行
function startup() {
    program
        .name(pkg.commandName)
        .version(pkg.version, "-V, --version") // 查看脚手架版本号
        .usage("<command>") // 用例
        .description(`脚手架工具 v${pkg.version}`)
        .on("--help", () => {
            /* eslint-disable */
            console.log("");
            console.log("Examples:");
            console.log("");
            console.log(`  $ ${pkg.commandName} init --help`);
            /* eslint-enable */
        });

    // 注册命令 - init
    registerCommand4Init(program, pkg);

    // 匹配无效命令
    program.on("command:*", () => {
        // eslint-disable-next-line
        console.error(chalk.red(`无效的命令：${program.args.join(" ")}\n`));
        program.help();
        process.exit();
    });

    // 开始解析命令
    program.parse(process.argv);

    // 默认打印
    // if (!program.args.length) {
    //     console.log(program);
    //     program.help();
    //     process.exit();
    // }
}

// 入口
startup();
