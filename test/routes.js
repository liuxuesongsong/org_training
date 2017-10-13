var fetch = require('node-fetch');
var chai = require('chai');
var assert = require('assert');
// var config = require('../src/config');

let expect = chai.expect;

let routers = "http://47.93.26.208:8001/index.php?m=train&c=route&a=client_route";
let addr = "http://47.93.26.208:8001/index.php?m=train";
var routes = {
    "login": "http://47.93.26.208:8001/index.php?m=train&c=users&a=login",
    "register": "http://47.93.26.208:8001/index.php?m=train&c=users&a=regist",
    "available": "http://47.93.26.208:8001/index.php?m=train&c=users&a=available",
    "logout": addr + "&c=users&a=logout",
    "reset": addr + "&c=users&a=reset",
    "info": addr + "&c=users&a=info",

    "insert": addr + "&c=students&a=insert",
    "remove": addr + "&c=students&a=remove",
    "base": addr + "&c=students&a=base",
    "self": addr + "&c=students&a=self",
    "addexp": addr + "&c=students&a=addexp",
    "delexp": addr + "&c=students&a=delexp",

    "examing": addr + "&c=exams&a=examing",
    "pass": addr + "&c=exams&a=pass",
    "retry": addr + "&c=exams&a=retry",
    "score": addr + "&c=exams&a=score",
    "over": addr + "&c=exams&a=over",

    "enroll": addr + "&c=enrolled&a=enroll",
    "agree": addr + "&c=enrolled&a=agree",
    "refuse": addr + "&c=enrolled&a=refuse",

    "new": addr + "&c=clazz&a=new",
    "entrance": addr + "&c=clazz&a=entrance",
    "exit": addr + "&c=clazz&a=exit",

    "query": "http://47.93.26.208:8001/index.php?m=train&c=query&a=info",
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

    it('请求登录', function () {
        return fetch(routes.login, Object.assign(header,
            { body: JSON.stringify({ account: "tishoy", password: "hantishoy123", type: 1 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            
            // message
            // success
            // session

            // console.log()
            expect(json).to.be.an('object');
            assert.equal(json.code, 10004)
            expect(json.code);
            expect(json.data);
        });
    });

    it('请求注册', function () {
        return fetch(routes.register, Object.assign(header,
            { body: JSON.stringify({ account: "tishoy", password: "hantishoy123", type: 1 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
        });
    });

    it('用户名可用', function () {
        return fetch(routes.available, Object.assign(header,
            { body: JSON.stringify({ account: "tishoy", password: "hantishoy123", type: 1 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
        });
    });

    it('用户登出', function () {
        return fetch(routes.logout, Object.assign(header,
            { body: JSON.stringify({ session: "tishoy" }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
        });
    });

    it('用户设置', function () {
        return fetch(routes.reset, Object.assign(header,
            { body: JSON.stringify({ session: "tishoy" }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
        });
    });

    it('用户信息', function () {
        return fetch(routes.info, Object.assign(header,
            { body: JSON.stringify({ session: "tishoy" }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
        });
    });


    it('插入学生', function() {
        return 
    })

    it('请求数据', function () {
        return fetch(routes.query, Object.assign(header, {
            body: JSON.stringify({ session: "tishoy" })
        })).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json.code)
            // assert.equal(json.code, 10004)
            expect(json).to.be.an('object');
        })
    })
});