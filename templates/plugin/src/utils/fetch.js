import fetch from "dva/fetch";

let baseUrl = null;

const opts = {
    method: "get",
    headers: {
        "Content-Type": "application/json",
    },
    body: null,
    redirect: "error",
    cache: "reload",

    // The following properties are node-fetch extensions
    follow: 20,
    timeout: 0,
    compress: true,
    size: 0,
};

/**
 * 获取 base url
 */
function getBaseUrl() {
    if (!baseUrl) {
        // 优先使用全局对象中的配置，否则默认使用测试环境地址
        const Sysconfig = window.Sysconfig || {};
        baseUrl = Sysconfig.apiOrigin ||  "/"; // "http://192.168.105.235/v0.1/";
        baseUrl = /\/$/.test(baseUrl) ? baseUrl : `${baseUrl}/`;
    }
    return baseUrl;

}

/**
 * 拼接url：baseUrl + url
 * @param {string} url
 */
function assembleUrl(url) {
    return [getBaseUrl(), url.replace(/^\//, "")].join("");
}


/**
 * 封装请求
 * @param {string} method 请求方式
 * @param {string} url 路径（不含baseUrl），形如：/list/users/0
 * @param {object} options 参加fetch.options
 */
export default function request(method, url, options) {
    return new Promise(async resolve => {
        let ret = await fetch(
            assembleUrl(url),
            {
                ...opts,
                ...options,
                method,
            },
        );
        let body = null;
        let cloned = ret.clone();
        try {
            body = await ret.json();
        }catch(e){
            body = await cloned.text();
        }
        resolve({ok: ret.ok, body});
    });
}


/**
 * GET 方式请求
 */
export function get(url, options) {
    return request.call(null, "get", url, options);
}

/**
 * POST 方式请求
 */
export function post(url, body, options) {
    return request.call(null, "post", url, {...options, body: JSON.stringify(body)});
}

/**
 * PUT 方式请求
 * @param {string} url
 * @param {object} body
 * @param {object} options
 */
export function put(url, body, options) {
    return request.call(null, "put", url, {...options, body: JSON.stringify(body)});
}

/**
 * DELETE 方式请求
 */
export function del(url, options) {
    return request.call(null, "delete", url, options);
}

