var fetch = require('node-fetch');
var chai = require('chai');
var assert = require('assert');
// var config = require('../src/config');

let expect = chai.expect;

let routers = "http://47.93.26.208:8001/index.php?m=train&c=route&a=client_route";
let addr = "http://47.93.26.208:8001/index.php?m=train";
var routes = {
    "login": addr + "&c=users&a=login",
    "register": addr + "&c=users&a=regist",
    "available": addr + "&c=users&a=available",
    "logout": addr + "&c=users&a=logout",
    "reset": addr + "&c=users&a=reset",
    "info": addr + "&c=users&a=info",

    "insert": addr + "&c=students&a=insert",
    "remove": addr + "&c=students&a=remove",
    "base": addr + "&c=students&a=base",
    "self": addr + "&c=students&a=self",
    "addexp": addr + "&c=students&a=addexp",
    "delexp": addr + "&c=students&a=delexp",
    "studentsInfo": addr + "&c=students&a=info",
    "studentsInfos": addr + "&c=students&a=infos",

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

var session = "XSLIgL"

describe('服务器API测试', function () {

    it('请求路由', function () {
        return fetch(routers, Object.assign(header,
            { body: JSON.stringify({ version: "0.0.1" }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);

            expect(json).to.be.an('object');
            // 请求路由 希望也有错误码0 
            // expect(json.code).to.be.a('number');
        });
    });

    it('请求登录', function () {
        return fetch(routes.login, Object.assign(header,
            { body: JSON.stringify({ account:"tishoy", password: "hantishoy", type: 1 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            console.log(json.code);
            assert.notEqual([10005, 10006, 10007].indexOf(json.code), -1);
            if (json.code == 10006) {
                console.log(json.session);
                expect(json.data).to.be.an('object');
                expect(json.data.student).to.be.an('array');
            }
        });
    });

    return

    it('请求注册', function () {
        return fetch(routes.register, Object.assign(header,
            { body: JSON.stringify({ account: [1, 2, 3, 4], password: "123", type: 1 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            // 没有不成功的时候么？ 有！ 
            assert.notEqual([10001, 10003, 10004].indexOf(json.code), -1);
        });
    });

    it('用户名可用', function () {
        return fetch(routes.available, Object.assign(header,
            { body: JSON.stringify({ account: [1, 2, 3, 4], type: 1 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json)
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([10001, 10002].indexOf(json.code), -1);
        });
    });


    it('用户登出', function () {
        return fetch(routes.logout, Object.assign(header,
            { body: JSON.stringify({ session: session }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10013, 10014].indexOf(json.code), -1);
        });
    });

    it('用户设置', function () {
        return fetch(routes.reset, Object.assign(header,
            { body: JSON.stringify({ session: session, }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    });

    it('用户信息', function () {
        return fetch(routes.info, Object.assign(header,
            { body: JSON.stringify({ session: session }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10011, 10012].indexOf(json.code), -1);
        });
    });


    it('插入学生', function () {
        return fetch(routes.insert, Object.assign(header,
            {
                body: JSON.stringify({
                    session: session, student: {
                        "id": 13,
                        "base_info": {
                            "name": "tishoy1",
                            "tel": "13810100010",
                            "email": "tishoy",
                            "city": 0,
                            "level": 2,
                            "company": "中软"
                        },
                        "personal_info": {
                            "licence": "232700198902230021",
                            "edu": "QH University",
                            "working_time": "5 year",
                            "total_amount": "",
                            "soft_amount": ""
                        },
                        "proj_exp": [
                            {
                                "id": 1,
                                "name": "支付宝",
                                "time": 1587515789,
                                "actor": "经理",
                                "total_amount": "100万",
                                "soft_amount": "50万"
                            },

                        ],
                        // 状态 0 未进行 1 进行中 2 进行结束
                        "status": {
                            "enrolled": {
                                "status": 0,
                                "time": 1500262255
                            },
                            "arranged": {
                                "status": 2,
                                "time": 1500262255
                            },
                            "agreed": {
                                "status": 0,
                                "time": 1500262255
                            },
                            "examing": {
                                "status": 1,
                                "time": 1500262255
                            },
                            "passed": {
                                "status": 1,
                                "score": 96,
                                "time": 1500262255
                            },
                            "retry": {
                                "status": 1,
                                "time": 1500262255
                            }
                        }
                    }
                })
            }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            console.log(json.code)
            // 这里返回10002？ 
            assert.notEqual([0, 10015, 10016].indexOf(json.code), -1);
        });
    })



    it('删除学生', function () {
        return fetch(routes.remove, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10017, 10018, 10019].indexOf(json.code), -1);
        });
    })

    it('基础信息', function () {
        return fetch(routes.base, Object.assign(header,
            {
                body: JSON.stringify({
                    session: session, id: 12, base_info: {
                        "name": "tishoy1",
                        "tel": "13810100010",
                        "email": "tishoy",
                        "city": 0,
                        "level": 2,
                        "company": "中软"
                    }
                })
            }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('个人信息', function () {
        return fetch(routes.self, Object.assign(header,
            {
                body: JSON.stringify({
                    session: session, id: 12, "personal_info": {
                        "licence": "232700198902230021",
                        "edu": "QH University",
                        "working_time": "5 year",
                        "total_amount": "",
                        "soft_amount": ""
                    }
                })
            }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10020, 10021].indexOf(json.code), -1);
        });
    })

    it('增加经验', function () {
        return fetch(routes.addexp, Object.assign(header,
            {
                body: JSON.stringify({
                    session: session, id: 12, exp: {
                        "id": "1",
                        "name": "nonono",
                        "time": 1234567890,
                        "actor": "范德萨",
                        "total_amount": "范德萨",
                        "soft_amount": "放大"
                    }
                })
            }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('删除经验', function () {
        return fetch(routes.delexp, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12, exp_id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('单个学生信息', function () {
        return fetch(routes.studentsInfo, Object.assign(header,
            // 为12号学生安排 
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('所有学生信息', function () {
        return fetch(routes.studentsInfos, Object.assign(header,
            { body: JSON.stringify({ session: session }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
            if (json.code === 0) {
                expect(json.data.student).to.be.an('array');
            }
        });
    })


    it('安排考试', function () {
        return fetch(routes.examing, Object.assign(header,
            // 为12号学生安排 id为2的考试
            { body: JSON.stringify({ session: session, id: 12, exam: 2 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('考试通过', function () {
        return fetch(routes.pass, Object.assign(header,
            // 12号学生通过考试
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('重报名考试', function () {
        return fetch(routes.retry, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('考试分数', function () {
        return fetch(routes.score, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12, score: 80 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('考试结束', function () {
        return fetch(routes.over, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10029, 10030].indexOf(json.code), -1);
        });
    })

    it('学生报名', function () {
        return fetch(routes.enroll, Object.assign(header,
            // 为12号学生报名 
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10022, 10023].indexOf(json.code), -1);
        });
    })

    it('同意安排', function () {
        return fetch(routes.agree, Object.assign(header,
            // 12号学生同意安排
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10026, 10027].indexOf(json.code), -1);
        });
    })

    it('拒绝安排', function () {
        return fetch(routes.refuse, Object.assign(header,
            // 12号学生拒绝安排
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0, 10028, 10027].indexOf(json.code), -1);
        });
    })

    it('新建班级', function () {
        return fetch(routes.new, Object.assign(header,
            { body: JSON.stringify({ session: session, clazz_id: 2 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('进入班级', function () {
        return fetch(routes.entrance, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12, clazz_id: 2 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('退出班级', function () {
        return fetch(routes.exit, Object.assign(header,
            { body: JSON.stringify({ session: session, id: 12 }) }
        )).then(function (res) {
            return res.json();
        }).then(function (json) {
            expect(json).to.be.an('object');
            expect(json.code).to.be.a('number');
            assert.notEqual([0].indexOf(json.code), -1);
        });
    })

    it('请求数据', function () {
        return fetch(routes.query, Object.assign(header, {
            body: JSON.stringify({ session: session })
        })).then(function (res) {
            return res.json();
        }).then(function (json) {
            // assert.equal(json.code, 10004)
            expect(json).to.be.an('object');
            console.log(json)
            expect(json.code).to.be.a('number');
            expect(json.data.student).to.be.an('array');
            assert.notEqual([0, 10045].indexOf(json.code), -1);
        })
    })


});