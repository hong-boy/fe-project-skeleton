const path = require("path");
const merge = require("lodash.defaultsdeep");

const base = require("./base.conf");

/**
 * 配置（开发环境）
 */
module.exports = merge(
    {
        development: true,
        apiOrigin: "http://192.168.105.235:80/v0.1",
        appUrl: "http://localhost:8000",
        logApiOrigin: "http://192.168.105.235:8081/v0.1",
        sysName: "华智安防系统管理",
    },
    base
);
