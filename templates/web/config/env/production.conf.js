const path = require("path");
const merge = require("lodash.defaultsdeep");

const base = require("./base.conf");

/**
 * 配置（生产环境）
 */
module.exports = merge(
    {
        development: false,
        apiOrigin: "http://192.168.108.234:8082/v0.1",
        appUrl: "http://192.168.108.234:8000",
        ssoUrl: "http://192.168.108.234:8083",
        logApiOrigin: "http://192.168.108.234:8081/v0.1",
        sysName: "华智安防系统管理",
    },
    base
);
