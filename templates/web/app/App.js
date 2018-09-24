const express = require("express");
const ConnectCas = require("connect-cas2");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("session-memory-store")(session);
const createError = require("http-errors");
const request = require("request");
const path = require("path");
const ejs = require("ejs");
const logger = require("./util/Logger");

const app = express();
app.use(express.static(path.join(__dirname, "dist")));

ejs.delimiter = "$";
// eslint-disable-next-line
app.engine("html", ejs.__express);
app.set("views", path.join(__dirname));
app.set("view engine", "html");

app.use(cookieParser());
// cas url 和认证service
app.use(
    session({
        name: "NSESSIONID",
        secret: "Hello I am a long long long secret",
        store: new MemoryStore(),
    })
);

// eslint-disable-next-line
const config = require(path.join(__dirname, "./config.json"));

logger.debug("configconfigconfigconfig", config);

const casClient = new ConnectCas({
    debug: true,
    // 忽略权限认证地址
    ignore: [],
    match: [],
    // NODE服务地址
    servicePrefix: config.production.appUrl,
    // CAS服务端地址
    serverPath: config.production.ssoUrl,
    paths: {
        validate: "/cas/validate",
        serviceValidate: "/sso/serviceValidate",
        proxy: "",
        login: "/sso/login",
        logout: "/sso/logout",
        proxyCallback: "",
    },
    redirect: false,
    gateway: false,
    renew: false,
    slo: true,
    cache: {
        enable: false,
        ttl: 5 * 60 * 1000,
        filter: [],
    },
    fromAjax: {
        header: "x-client-ajax",
        status: 418,
    },
});

app.use(casClient.core());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 应用登录退出调用接口
app.get("/logout", casClient.logout());

// 哪些请求能进到这个路由里面呢？？？
app.use("*", (req, res, next) => {
    // eslint-disable-next-line
    const config = require(path.join(__dirname, "./config.json"));
    // const usercode = req.session.usercode;

    // const username = req.session.username;
    const { usercode, username } = req.session;
    logger.debug(
        "config``````````````````````````````",
        config,
        usercode,
        username
    );

    if (!usercode || !username) {
        res.cookie("usercode", usercode);
        const url = `${config.production.apiOrigin}/users/${usercode}`;
        logger.debug("requestrequestrequest---------------------------", url);

        request(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const data = body;
                res.cookie("username", escape(JSON.parse(data).user_name));
                logger.info(
                    "escape(JSON.parse(data).user_name)",
                    escape(JSON.parse(data).user_name)
                );
                res.render("index", {
                    config,
                });
            }
        });
    } else {
        logger.debug("renderrenderrenderrender-----------------");
        res.render("index", {
            config,
        });
    }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    logger.error("err---------------------------------", err);
    // render the error page
    res.status(err.status || 500);
    res.send("<p>something blew up</p>");
});

module.exports = app;
