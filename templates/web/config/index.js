if (!process.env || !process.env.NODE_ENV || !process.env.NODE_ENV.length) {
    throw Error("请先设置环境变量NODE_ENV");
}

// eslint-disable-next-line
const NODE_ENV = process.env.NODE_ENV; // 获取环境变量

if (["development", "production"].indexOf(NODE_ENV) === -1) {
    throw Error(
        `环境变量NODE_ENV的值不正确！只能为"development"或"production"：${NODE_ENV}`
    );
}

const configFilePath = `./env/${NODE_ENV}.conf.js`;

// eslint-disable-next-line
console.info(`当前启用的配置文件为：${configFilePath}`);

/**
 * 导出配置
 */
// eslint-disable-next-line
module.exports = require(configFilePath);
