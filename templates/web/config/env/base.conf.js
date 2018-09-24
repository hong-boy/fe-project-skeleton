const path = require("path");

const rootdir = path.join(__dirname, ".."); // 项目根路径

/**
 * 通用配置
 */
module.exports = {
    rootdir,
    version: "1.0.0.0", // 版本号
    log4js: {
        pm2: true,
        appenders: {
            // 定义日志输出的地方
            console: {
                // 控制台
                type: "console",
            },
            file: {
                // 日志文件
                type: "file",
                maxLogSize: 10 * Math.pow(1024, 3), // 10MB
                catagory: "normal",
                backups: 5, // 当单个日志超过maxLogSize之后最多允许存在5个
                compress: true,
                filename: path.join(rootdir, "/logs/app.log"),
            },
        },
        categories: {
            default: { appenders: ["console", "file"], level: "debug" },
        },
    },
};
