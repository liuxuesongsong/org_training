var fetch = require('node-fetch');
var chai = require('chai');
// var config = require('../src/config');

let expect = chai.expect;

let routers = "http://47.93.26.208:8001/index.php?m=train&c=route&a=client_route";
let addr = ""
var routes = {
    "login": addr + "users/login",
    "register": addr + "users/regist",
    "available": addr + "users/available",
    "logout": addr + "users/logout",
    "reset": addr + "users/reset",
    "info": addr + "users/info",

    "insert": addr + "students/insert",
    "remove": addr + "students/remove",
    "base": addr + "students/base",
    "self": addr + "students/self",
    "addexp": addr + "students/addexp",
    "delexp": addr + "students/delexp",

    "examing": addr + "exams/examing",
    "pass": addr + "exams/pass",
    "retry": addr + "exams/retry",
    "score": addr + "exams/score",
    "over": addr + "exams/over",

    "enroll": addr + "enrolled/enroll",
    "agree": addr + "enrolled/agree",
    "refuse": addr + "enrolled/refuse",

    "new": addr + "clazz/new",
    "entrance": addr + "clazz/entrance",
    "exit": addr + "clazz/exit",

    "query": addr + "query",
}

let header = {
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www.form-urlencoded'
    },
}

describe('服务器API测试', function () {

    it('请求路由', function () {
        return fetch(routers, Object.assign(header,
            { body: JSON.stringify({ version: "0.0.1" }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
        });
    });

    // it('请求登录', function () {
    //     return fetch(routes.login, Object.assign(header,
    //         { body: JSON.stringify({ account: "tishoy", password: "hantishoy123", type: 1 }) }
    //     )).then(function (res) {
    //         return res.json();
    //     }).then(function (json) {
    //         expect(json).to.be.an('object');
    //     });
    // });

    // it('请求注册', function () {
    //     return fetch(routes.register, Object.assign(header,
    //         { body: JSON.stringify({ account: "tishoy", password: "hantishoy123", type: 1 }) }
    //     )).then(function (res) {
    //         return res.json();
    //     }).then(function (json) {
    //         expect(json).to.be.an('object');
    //     });
    // });

    // it('用户名可用', function () {
    //     return fetch(routes.available, Object.assign(header,
    //         { body: JSON.stringify({ account: "tishoy", password: "hantishoy123", type: 1 }) }
    //     )).then(function (res) {
    //         return res.json();
    //     }).then(function (json) {
    //         expect(json).to.be.an('object');
    //     });
    // });

    // it('用户登出', function () {
    //     return fetch(routes.logout, Object.assign(header,
    //         { body: JSON.stringify({ session: "tishoy" }) }
    //     )).then(function (res) {
    //         return res.json();
    //     }).then(function (json) {
    //         expect(json).to.be.an('object');
    //     });
    // });

    // it('请求数据', function () {
    //     return fetch(routes.query, Object.assign(header, {
    //         body: JSON.stringify({ session: "tishoy" })
    //     })).then(function (res) {
    //         return res.json();
    //     }).then(function (json) {
    //         expect(json).to.be.an('object');
    //     })
    // })
});