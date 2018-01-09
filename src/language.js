const Language = {
    Chin: {
        Lang: {
            Chin: "中文简体",
            Eng: "英文"
        },
        pages: {
            main: {
                company_title: "企业相关信息",
                student_title: "学员信息",
                enrolled_title: "报名信息",
                exam_title: "考试成绩",
                input_your_account: "输入账号",
                com_account: "公司全称",
                org_account: "机构账号",
                password: "密码",
                repeat_password: "密码确认",
                input_your_password: "输入密码",
                change_account: "切换账号",
                login_button: "登录",
                forget_password_button: "忘记密码",
                register_button: "注册",
                certain_button: "确定",
                cancel_button: "取消",
                next_step: "跳过",
                pre_step: "上一步",
                login_success: "登录成功",
                register_success: "注册成功"
            },
            com: {
                home: {
                    title: "首页",
                    arranged: "已安排",
                    unarranged: "待安排",
                    enrolled: "已报名",
                    passed: "已通过",
                    trained: "已培训",
                    human: "人",
                    unarranged_title: "待安排的培训报名学员",
                    arranged_title: "已安排的培训报名学员",
                    clazz_title: "企业所属地区正在开设班级的",
                    available: "公司名称可以使用",
                    being_reroll: "正在重新排队"
                },
                infos: {
                    title: "企业相关信息",
                    base: {
                        title: "基本信息",
                        base_info: {
                            account: "公司全称(在账户信息修改公司全称)",
                            name: "联系人",
                            mobile: "手机",
                            tel: "电话",
                            mail: "E-mail",
                            department: "部门",
                            duty: "职务",
                            wechat: "微信/QQ"
                        },
                        city: "企业名称",
                        c_area_id: "省市地区",
                        c_level: "企业资质"
                    },
                    finance: {
                        title: "发票信息",
                        allname: "公司全称(在账户信息修改公司全称)",
                        taxpayer_number: "纳税人识别号",
                        opening_bank: "开户银行",
                        bank_account: "开户行账号",
                        c_address: "地址",
                        financial_call: "电话"
                    },
                    express: {
                        title: "通讯信息",
                        zip_code: "邮编",
                        receive_address: "省市",
                        district: "详细地址",
                        receiver: "收件人",
                        receive_phone: "联系方式"
                    },
                    admin: {
                        title: "联系人信息",
                        account: "公司全称/登录全称",
                        account_info:"账户信息",
                        password: "修改密码",
                        old_password: "密码",
                        change_company:"修改公司全称",
                        new_password: "修改密码",
                        check_password: "确认修改密码",
                        name: "管理员姓名",
                        mobile: "手机",
                        mail: "邮箱",
                        duty: "职位",
                        department: "部门"
                    }
                },
                students: {
                    input:
                    {
                        "name": "姓名",
                        "department": "部门",
                        "duty": "职务",
                        "mobile": "手机",
                        "mail": "E-mail",
                        "wechat": "微信/QQ",
                        "id_type": "证件类型",
                        "identity_card": "证件编号",
                        "register": "备注",
                        "detail": "补充说明",
                        "detail_helper":"异常信息请注明"
                    },
                    select:
                    {
                        "course_id": "中项或高项",
                        "area_id": "培训城市"
                    },
                    title: "学生",
                    list_title: "学员列表",
                    new_student: "新增",
                    del_student: "删除",
                    exam_record: "考试记录",
                    fix_student: "修改",
                    base_info: "基本信息",
                    name: "姓名",
                    tel: "电话",
                    major: "考试级别",
                    register: "备注",
                    email: "电子邮件",
                    city: "地区",
                    level: {
                        title: "级别",
                        junior: "初级",
                        medium: "中级",
                        senior: "高级",
                    },

                    personal_info: {
                        title: "个人信息",
                        licence_type: "证件类型",
                        licence_code: {
                            0: "",
                            1: "身份证号码",
                            2: "护照号码"
                        },
                        "department": "部门",
                        "duty": "职务",
                        "wechat": "微信/QQ",
                        "edu": "学历",
                        "working_time": "从业时间",
                        "total_amount": "累计项目总金额",
                        "soft_amount": "累计项目软件服务金额"




                    },

                    proj_exp: {
                        title: "项目经历",
                        "id": "",
                        "name": "项目名称",
                        "time": "项目时间",
                        "actor": "担任角色",
                        "total_amount": "项目总额",
                        "soft_amount": "软件和IT服务金额"
                    }







                },
                exams: {
                    title: "考试",
                    examing: "待考试名单",
                    passed: "已通过考试",
                    unpassed: "未通过考试",
                },
                enrolled: {
                    title: "培训报名管理",
                    unenrolled: "报名人员信息及管理",
                    unarrange: "待安排培训报名列表",
                    arranged: "已安排培训报名列表",
                },
                instructions: {
                    title: "填报说明"
                },
                card: {
                    modify: "修改",
                    enroll: "报名",
                    agree: "同意",
                    refuse: "拒绝",
                    retry: "重考试",
                    giveup: "放弃",
                    remove: "删除",
                    status: {
                        1: "已通过",
                        2: "已拒绝",
                    }
                }
            },
            org: {
                area: "地区",
                arrange_rate: "待安排/已安排",
                classed: "已开班",
                new_class: "添加班级",
                new_service: "添加管理员",

                home: {
                    title: "首页",
                    arranged: "已安排学员",
                    all_students: "总学员",
                    registered:"临时登记已报名学员",
                    all_registered:"临时登记总学员",
                    new_password:"修改密码",
                    check_password:"确认修改密码"
                    
                },
                enroll: {
                    title: "报名查看"
                },
                student: {
                    title: "学生信息"
                },
                clazz: {
                    title: "班级安排",
                    new: "新建",
                    search: "搜索",
                    clazz_list: "班级列表",
                    info: {
                        area: "地区",
                        class_name: "级别",
                        train_starttime: "开班时间",
                        class_head: "班主任",
                        address: "开班地址",
                        account:"用户名",
                        password:"密码",
                        check_password:"确认密码"
                    }
                },
                score: {
                    title: "成绩管理",
                    daily_score: "平日成绩",
                    exam_score: "考试成绩",

                },
                area: {
                    title: "管理员区域",
                },
                document:{
                    title:"文档管理",
                    info:{
                       file_name:"文件名称",
                       file_url:"下载地址",
                       file_type:"类型名称",
                       file_edit:"文件版本",
                    }
                }

            },
        },

        components: {
            AppFrame: {
                ThemeColor: "主题颜色",
                Ligth: "明亮",
                Dark: "灰暗",
                Info: "联系人",
                Reset: "修改密码",
                Logout: "登出"
            },
            CommonAlert: {
                warning: " ",
                alert: " ",
                notice: " "
            }
        },
        ErrorCode: {
            0: "公司名称可用",
            10001: "该公司已注册",
            1000: "两次密码不相同",
            1001: "密码不能为空",
            1002: "账号不能为空",

            10002: "该账号可以使用",
            // 10101:""

        }
    },
    Eng: {
        Lang: {
            Chin: "Chinese",
            Eng: "English"
        },
        pages: {
            main: {
                company_title: "Company Detail",
                student_title: "Students Detail",
                enrolled_title: "Enroll Detail",
                exam_title: "Exam Score",
                input_your_account: "Account input",
                account: "Account",
                password: "Password",
                repeat_password: "Repeat password",
                input_your_password: "Password input",
                change_account: "Logout",
                login_button: "Login",
                register_button: "Register",
                certain_button: "OK",
                cancel_button: "Cancel",
                next_step: "Next",
                pre_step: "Previous",
            },
            company: {
                home: {
                    title: "Home",
                    arranged: "Already arrange",
                    enrolled: "Already enroll",
                    passed: "Already pass",
                    trained: "Already train",
                    human: "Numbers",
                    unarranged_title: "待安排的学员",
                    arranged_title: "已安排的学员",
                    clazz_title: "企业所属地区正在开设班级的",
                    available: "公司名称可以使用",
                    being_reroll: "正在重新排队"
                },
                infos: {
                    base: {
                        title: "基本信息",
                        base_info: {

                        },
                        company_name: "企业名称",
                        province: "省市地区",
                        qualification: "企业资质"
                    },
                    finance: {
                        title: "发票信息",
                        name: "公司全称",
                        taxpayer_identify: "纳税人识别号",
                        bank: "开户银行",
                        bank_account: "开户行账号",
                        address: "地址",
                        tel: "电话"
                    },
                    express: {
                        title: "通讯信息",
                        express_code: "邮编",
                        express_address: "收件地址",
                        address: "详细地址",
                        express_person: "收件人",
                        contact_way: "联系方式"
                    },
                    admin: {
                        title: "联系人信息",
                        account: "用户名",
                        password: "密码",
                        name: "管理员姓名",
                        tel: "手机",
                        email: "邮箱"
                    }
                },
                students: {
                    list_title: "学员列表",
                    new_student: "新增",
                    del_student: "删除",
                    exam_record: "考试记录",
                    fix_student: "修改",
                    base_info: "基本信息",
                    name: "姓名",
                    tel: "电话",
                    email: "电子邮件",
                    city: "地区",
                    level: {
                        title: "级别",
                        junior: "初级",
                        medium: "中级",
                        senior: "高级",
                    },

                    personal_info: {
                        title: "个人信息",
                        licence: "身份证号",
                        "edu": "学历",
                        "working_time": "从业时间",
                        "total_amount": "累计项目总金额",
                        "soft_amount": "累计项目软件服务金额"




                    },

                    proj_exp: {
                        title: "项目经历",
                        "id": "",
                        "name": "项目名称",
                        "time": "项目时间",
                        "actor": "担任角色",
                        "total_amount": "项目总额",
                        "soft_amount": "软件和IT服务金额"
                    }







                },
                exams: {
                    title: "考试",
                    examing: "待考试名单",
                    passed: "已通过考试",
                    unpassed: "未通过考试",
                },
                enrolled: {
                    title: "",
                    unenrolled: "未报名",
                    unarrange: "待安排",
                    arranged: "已安排",
                },
                card: {
                    modify: "修改",
                    enroll: "报名",
                    agree: "同意",
                    refuse: "拒绝",
                    retry: "重考试",
                    giveup: "放弃",
                    status: {
                        1: "已通过",
                        2: "已拒绝",
                    }
                }
            },

        },
        orgnization: {
            area: "地区",
            arrange_rate: "待安排/已安排",
            classed: "已开班",
            new_class: "添加班级",
            score: {
                title: "成绩录入",
                daily_score: "平日成绩",
                exam_score: "考试成绩",

            },
            new_service: "添加管理员"
        },
        components: {
            AppFrame: {
                ThemeColor: "主题颜色",
                Ligth: "明亮",
                Dark: "灰暗",
                Info: "联系人",
                Reset: "修改密码",
                Logout: "登出"
            },
            CommonAlert: {
                warning: " ",
                alert: " ",
                notice: " "
            }
        },
        ErrorCode: {
            0: "操作成功",
            1000: "两次密码不相同",
            10001: "账号已被注册",
            10002: "该账号可以使用",
            10003: "注册成功",
            10004: "发送信息失败",
            10005: "您尚未注册",
            10006: "您输入的密码不正确",
            10007: "登录成功",
            10008: "权限错误",
            10009: "验证码错误",
            10010: "验证码正确",
            10011: "更新成功",
            10012: "更新失败",
            10013: "退出登录",
            10014: "用户不存在",
            10015: "添加成功",
            10016: "添加失败",
            10017: "成功",
            10018: "无该学员",
            10019: "无删除权限",
            10020: "查看成功",
            10021: "查看成功",
            10022: "报名成功",
            10023: "报名失败",
            10024: "查看成功",
            10025: "查看成功",
            10026: "同意成功",
            10027: "同意失败",
            10028: "拒绝成功",
            10029: "放弃报名成功",
            10030: "放弃报名失败",
            10031: "创建班级成功",
            10032: "创建班级失败",
            10033: "创建班级失败",
            10034: "查看成功",
            10035: "查看失败",
            10036: "保存成功",
            10037: "保存失败",
            10038: "删除成功",
            10039: "删除失败",
            10040: "添加失败",
            10041: "删除失败",
        }

    }
}
export default Language;