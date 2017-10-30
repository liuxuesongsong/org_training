// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import ListSubheader from 'material-ui/List/ListSubheader';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Divider from 'material-ui/Divider';

import BackIcon from 'material-ui-icons/ArrowBack';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Mail';
import DeleteIcon from 'material-ui-icons/Delete';
import ReportIcon from 'material-ui-icons/Report';

import Area from './area.paper';
import Qualification from './qualification.paper';
import Base from './base.paper';
import Finance from './finance.paper';
import Express from './express.paper';
import Admin from './admin.paper';

import { initCache, getCache, getData, getRouter, getCity, getAreas } from '../../../utils/helpers';
import Lang from '../../../language';
import Code from '../../../code';

import { DATA_TYPE_AREA, DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_FINANCE, DATA_TYPE_EXPRESS, DATA_TYPE_ADMIN } from '../../../enum';

import CommonAlert from '../../../components/CommonAlert';

const LANG_PREFIX = Lang[window.Lang].pages.com.infos;

class Info extends Component {

    state = {
        gotData: false,
        drawOpen: false,
        show: "all",
        city: "",
        chooseCity: "",
        base: {
            account: "",
            name: "",
            mobile: "",
            tel: "",
            mail: "",
            department: "",
            duty: "",
            wechat: "",
            c_area_id: null,
            c_level: null
        },
        finance: {
            allname: "公司名称未设置",
            taxpayer_number: "纳税人识别号未设置",
            opening_bank: "开户银行未设置",
            bank_account: "开户账号未设置",
            c_address: "联系电话未设置",
            financial_call: "地址未设置"
        },
        express: {
            zip_code: "未设置",
            receive_address: "未设置",
            district: "未设置",
            receiver: "未设置",
            receive_phone: "未设置"
        },
        admin: {
            account: "未设置",
            name: "未设置",
            mobile: "未设置",
            mail: "未设置"
        },

        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: []
    }

    componentDidMount() {
        window.currentPage = this;
        this.fresh()
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    cacheToState() {

        window.currentPage.setState({
            gotData: true

        });
        if (getCache(DATA_TYPE_BASE) !== undefined) {
            var data = getCache(DATA_TYPE_BASE);
            var currentCity = getCity(data.c_area_id);
            window.currentPage.setState({
                base: data,
                city: currentCity,
                chooseCity: currentCity
            });
        }
        if (getCache(DATA_TYPE_FINANCE) !== undefined) {
            var data = getCache(DATA_TYPE_FINANCE)
            window.currentPage.setState({
                finance: data
            });
        }
        if (getCache(DATA_TYPE_EXPRESS) !== undefined) {
            var data = getCache(DATA_TYPE_EXPRESS)
            window.currentPage.setState({
                express: data
            });
        }
        if (getCache(DATA_TYPE_ADMIN) !== undefined) {
            var data = getCache(DATA_TYPE_ADMIN);
            window.currentPage.setState({
                admin: data
            });
        }
    }

    popUpNotice(type, code, content, action = [() => {
        this.setState({
            alertOpen: false,
        })
    }, () => {
        this.setState({
            alertOpen: false,
        })
    }]) {
        this.setState({
            alertType: type,
            alertCode: code,
            alertContent: content,
            alertOpen: true,
            alertAction: action
        });
    }

    submit = (objType, sendObj) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var k in arg.data) {
                    window.CacheData[arg.type][k] = arg.data[k];
                }
                this.fresh();
                // this.state.city = getCity()
                // arg.self.state.data = 
            }

        }
        getData(getRouter(UPDATE_COMPANY), { session: sessionStorage.session, company: sendObj }, cb, { self: this, type: objType, data: sendObj });
    }

    toggleDrawer = (open) => () => {
        this.setState({
            drawOpen: false,
        });
    };

    qualificationItems = () => {
        var components = []
        var items = [1, 2, 3, 4];
        items.map((item) => {
            components.push(
                <ListItem button key={item} onClick={() => {
                    this.submit("base", {
                        c_level: item
                    })
                    this.setState({ show: "all" })
                }}>
                    <ListItemText primary={(item) + "级"} />
                </ListItem>)
        })
        return components
    }

    subShow = () => {
        switch (this.state.show) {
            case "componyName":
                return (<div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <IconButton style={{
                                marginLeft: -12,
                                marginRight: 20,
                            }} color="default" aria-label="Menu">
                                <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                            </IconButton>
                            <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                {"单位全称"}
                            </Typography>

                        </Toolbar>
                    </AppBar>
                    <Paper className={"nyx-form"}>
                        <TextField
                            id="bank_account"
                            label={LANG_PREFIX.bank_account}
                            value={this.state.base.c_name}
                            onChange={event => {
                                this.state.base.c_name = event.target.value
                                this.setState({
                                    base: this.state.base,
                                });
                            }}
                            fullWidth>
                        </TextField>
                        <Button
                            raised
                            color="accent"
                            onClick={() => {
                                this.submit("base", { c_name: this.state.base.c_name });
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button>
                    </Paper>
                </div>)
            case "area":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton style={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                    {"注册省市"}
                                </Typography>

                            </Toolbar>
                        </AppBar>
                        <Paper style={{ marginBottom: 20 }}>
                            <List style={{
                                height: "100%"
                            }} disablePadding>
                                {getAreas().map(area =>
                                    <ListItem button key={area.id}
                                        onClick={(e) => {
                                            this.submit("base", {
                                                c_area_id: area.id
                                            })
                                            this.setState({ show: "all" })
                                        }}>
                                        {area.area_name}
                                        <div>
                                            {area.id === this.state.base.c_area_id ? " - 当前所属" : ""}
                                        </div>
                                    </ListItem>)}

                            </List>
                        </Paper>
                    </div>
                )
            case "qualification":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton style={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                    {"修改企业等级"}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Paper>
                            <List style={{
                                height: "100%"
                            }} disablePadding>
                                {
                                    this.qualificationItems()
                                }
                            </List>
                        </Paper>
                    </div>
                );
            case "base":
                return <div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <IconButton style={{
                                marginLeft: -12,
                                marginRight: 20,
                            }} color="default" aria-label="Menu">
                                <BackIcon onClick={() => {
                                    var data = getCache(DATA_TYPE_BASE);
                                    this.setState({
                                        show: "all",
                                        base: data
                                    });
                                }} />
                            </IconButton>
                            <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                {"修改财务信息"}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Base />
                </div>
            case "finance":
                return (<div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <IconButton style={{
                                marginLeft: -12,
                                marginRight: 20,
                            }} color="default" aria-label="Menu">
                                <BackIcon onClick={() => {
                                    if (getCache(DATA_TYPE_FINANCE) !== undefined) {
                                        var data = getCache(DATA_TYPE_FINANCE)
                                        this.setState({
                                            finance: data,
                                            show: "all"
                                        });
                                    }
                                }} />
                            </IconButton>
                            <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                {"修改财务信息"}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Finance />
                </div>);
            case "express":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton style={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => {
                                        var data = getCache(DATA_TYPE_EXPRESS)
                                        this.setState({
                                            show: "all",
                                            express: data
                                        });
                                    }} />
                                </IconButton>
                                <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                    {"修改邮寄信息"}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Express />
                    </div>);
            case "admin":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton style={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => {
                                        if (getCache(DATA_TYPE_ADMIN) !== undefined) {
                                            var data = getCache(DATA_TYPE_ADMIN);
                                            this.setState({
                                                admin: data,
                                                show: "all"
                                            });
                                        }
                                    }} />
                                </IconButton>
                                <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                    {"修改联系人信息"}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Admin />
                    </div>);
            case "logout":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton style={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                    {"登出当前账号"}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Button
                            raised
                            color="accent"
                            onClick={() => {
                                var cb = () => {

                                }
                                // getData(getCache(LOG))
                            }}>
                            {"登出"}
                        </Button>
                    </div>
                )
            default:
                return (<div className="nyx-info">

                    <List style={{
                        height: "100%"
                    }} disablePadding>
                        <Paper>
                            <h3>{"企业负责人相关信息"}</h3>
                            <TextField
                                className="nyx-form-div"
                                key={"account"}
                                id={"input_account"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["account"]}
                                value={this.state.base["account"] === null ? "" : this.state.base["account"]}
                                onChange={(event) => {
                                    this.state.base["account"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"name"}
                                id={"input_name"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["name"]}
                                value={this.state.base["name"] === null ? "" : this.state.base["name"]}
                                onChange={(event) => {
                                    this.state.base["name"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"mobile"}
                                id={"input_mobile"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["mobile"]}
                                value={this.state.base["mobile"] === null ? "" : this.state.base["mobile"]}
                                onChange={(event) => {
                                    this.state.base["mobile"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"tel"}
                                id={"input_tel"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["tel"]}
                                value={this.state.base["tel"] === null ? "" : this.state.base["tel"]}
                                onChange={(event) => {
                                    this.state.base["tel"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"mail"}
                                id={"input_mail"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["mail"]}
                                value={this.state.base["mail"] === null ? "" : this.state.base["mail"]}
                                onChange={(event) => {
                                    this.state.base["mail"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"department"}
                                id={"input_department"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["department"]}
                                value={this.state.base["department"] === null ? "" : this.state.base["department"]}
                                onChange={(event) => {
                                    this.state.base["department"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"duty"}
                                id={"input_duty"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["duty"]}
                                value={this.state.base["duty"] === null ? "" : this.state.base["duty"]}
                                onChange={(event) => {
                                    this.state.base["duty"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <TextField
                                className="nyx-form-div"
                                key={"wechat"}
                                id={"input_wechat"}
                                label={Lang[window.Lang].pages.com.infos.base.base_info["wechat"]}
                                value={this.state.base["wechat"] === null ? "" : this.state.base["wechat"]}
                                onChange={(event) => {
                                    this.state.base["wechat"] = event.target.value
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}>
                            </TextField>
                            <select
                                id="input_c_area_id"
                                label={Lang[window.Lang].pages.org.clazz.info.area}
                                value={this.state.base.c_area_id === null ? "" : this.state.base.c_area_id}
                                onChange={(e) => {
                                    this.state.base["c_area_id"] = Number(e.target.value);
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}
                            >
                                {getAreas().map(area => {
                                    return <option key={area.id} value={area.id}>{area.area_name}</option>
                                })}
                            </select>
                            <select
                                id="input_c_level"
                                label={"企业等级"}
                                value={this.state.base.c_level === null ? "" : this.state.base.c_level}
                                onChange={(e) => {
                                    this.state.base["c_level"] = Number(e.target.value);
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}
                            >
                                <option value={1}>{"1级"}</option>
                                <option value={2}>{"2级"}</option>
                                <option value={3}>{"3级"}</option>
                                <option value={4}>{"4级"}</option>
                            </select>
                            <Button
                                raised
                                color="accent"
                                onClick={() => {
                                    var cb = (route, message, arg) => {
                                        if (message.code === Code.LOGIC_SUCCESS) {
                                            window.CacheData.base = arg.data;
                                        }
                                        this.fresh();
                                    }

                                    var account = document.getElementById("input_account").value;
                                    var name = document.getElementById("input_name").value;
                                    var mobile = document.getElementById("input_mobile").value;
                                    var tel = document.getElementById("input_tel").value;
                                    var mail = document.getElementById("input_mail").value;
                                    var department = document.getElementById("input_department").value;
                                    var duty = document.getElementById("input_duty").value;
                                    var wechat = document.getElementById("input_wechat").value;
                                    var c_area_id = document.getElementById("input_c_area_id").value;
                                    var c_level = document.getElementById("input_c_level").value;
                                    var obj = {
                                        account: account === "" ? null : account,
                                        name: name === "" ? null : name,
                                        mobile: mobile === "" ? null : mobile,
                                        tel: tel === "" ? null : tel,
                                        mail: mail === "" ? null : mail,
                                        department: department === "" ? null : department,
                                        duty: duty === "" ? null : duty,
                                        wechat: wechat === "" ? null : wechat,
                                        "c_area_id": c_area_id === "" ? null : Number(c_area_id),
                                        "c_level": c_level === "" ? null : Number(c_level),
                                    }
                                    console.log(obj);

                                    getData(getRouter(UPDATE_COMPANY), {
                                        session: sessionStorage.session, company: obj
                                    }, cb, { self: this, data: obj });

                                }}
                            >
                                {Lang[window.Lang].pages.main.certain_button}
                            </Button>
                        </Paper>
                        <ListSubheader style={{ marginTop: 20 }}>{"邮寄信息"}</ListSubheader>
                        <Paper className="nyx-info-listitem nyx-info-listitem-hover">
                            <div className="nyx-info-line-height"
                                onClick={() => { this.setState({ show: "express", }) }}>
                                {/* <ListItemText primary={LANG_PREFIX.express.title} /> */}
                                <div><span className="nyx-info-span">收件人</span>{this.state.express.receiver}</div>
                                <div><span className="nyx-info-span">联系电话</span>{this.state.express.receive_phone}</div>
                                <div><span className="nyx-info-span">所在区域</span>{this.state.express.receive_address}&nbsp;&nbsp;{this.state.express.zip_code}</div>
                                <div><span className="nyx-info-span">收件地址</span>{this.state.express.district}</div>
                            </div>
                        </Paper>
                        <ListSubheader style={{ marginTop: 20 }}>{"财务信息"}</ListSubheader>
                        <Paper style={{ marginBottom: 20 }} className="nyx-info-listitem nyx-info-listitem-hover">
                            <div className="nyx-info-line-height"
                                onClick={() => { this.setState({ show: "finance", }) }}>
                                <div><span className="nyx-info-span">纳税信息</span><span>公司全称：</span> {this.state.finance.allname}<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纳税人识别号：</span>{this.state.finance.taxpayer_number}</div>
                                <div><span className="nyx-info-span">银行信息</span><span>开户行：</span> {this.state.finance.opening_bank}<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账号：</span>{this.state.finance.bank_account}</div>
                                <div><span className="nyx-info-span">联系方式</span><span>地址：</span> {this.state.finance.c_address}<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话：</span>{this.state.finance.financial_call}</div>
                            </div>
                        </Paper>
                        <ListSubheader style={{ marginTop: 20 }}>{"修改密码"}</ListSubheader>
                        <Paper>
                            <div className="nyx-info-line-height"
                                onClick={() => { this.setState({ show: "admin", }) }}>
                                <div><span className="nyx-info-span">用户名</span>{this.state.admin.account}</div>
                                <div><span className="nyx-info-span">管理员姓名</span>{this.state.admin.name}</div>
                                <div><span className="nyx-info-span">电话</span>{this.state.admin.mobile}</div>
                                <div><span className="nyx-info-span">邮箱</span>{this.state.admin.mail}</div>
                            </div>
                        </Paper>
                    </List>
                </div >)
        }
    }

    render() {
        return (
            <div className={'nyx-page'}>
                <div className={'nyx-company-paper'}>
                    <div>
                        {this.subShow()}
                    </div>
                </div>
                <CommonAlert
                    show={this.state.alertOpen}
                    type={this.state.alertType}
                    code={this.state.alertCode}
                    content={this.state.alertContent}
                    action={this.state.alertAction}
                >
                </CommonAlert>
            </div>
        );
    }



};

export default Info;
