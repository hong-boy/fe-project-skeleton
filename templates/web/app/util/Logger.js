const log4js = require("log4js");
const conf = require("../../config/index").log4js;

log4js.configure(conf);
const logger = log4js.getLogger("console");
// eslint-disable-next-line
console.log = logger.info.bind(logger);

/**
 * Logger工具类
 * （此类必须是无依赖的）
 */
exports.logger = name => log4js.getLogger(name);
