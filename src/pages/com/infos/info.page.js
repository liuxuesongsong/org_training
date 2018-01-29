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

import { initCache, getCache, getData,companyRegex, getRouter, getCity, getAreas } from '../../../utils/helpers';
import Lang from '../../../language';
import Code from '../../../code';

import { NOTICE,DATA_TYPE_AREA, DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_FINANCE, DATA_TYPE_EXPRESS, DATA_TYPE_ADMIN } from '../../../enum';

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
    company_message = () =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                window.CacheData.base = arg.data;
            }
            this.fresh();
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var account = this.state.base["account"];
        account=account.replace(/（/g,'(');  
        account=account.replace(/ /g,''); 
        account=account.replace(/）/g,')');  
   
        var name = this.state.base["name"],
            mobile = this.state.base["mobile"],
            tel = this.state.base["tel"],
            mail = this.state.base["mail"],
            department = this.state.base["department"],
            duty = this.state.base["duty"],
            wechat = this.state.base["wechat"],
            c_area_id = this.state.base["c_area_id"],
            c_level = this.state.base["c_level"],
            district=this.state.express["district"],
            receive_phone=this.state.express["receive_phone"],
            receiver=this.state.express["receiver"],
            zip_code=this.state.express["zip_code"],
            bank_account=this.state.finance["bank_account"],
            c_address=this.state.finance["c_address"],
            financial_call=this.state.finance["financial_call"],
            opening_bank=this.state.finance["opening_bank"],
            taxpayer_number=this.state.finance["taxpayer_number"];
        
        var obj = {
            c_name: account === "" ? null : account,
            name: name === "" ? null : name,
            mobile: mobile === "" ? null : mobile,
            tel: tel === "" ? null : tel,
            mail: mail === "" ? null : mail,
            department: department === "" ? null : department,
            duty: duty === "" ? null : duty,
            wechat: wechat === "" ? null : wechat,
            "c_area_id": c_area_id === "" ? null : Number(c_area_id),
            "c_level": c_level === "" ? null : Number(c_level),
            receiver: receiver === "" ? null : receiver,
            district: district === "" ? null : district,
            receive_phone: receive_phone === "" ? null : receive_phone,
            zip_code: zip_code === "" ? null : zip_code,
            taxpayer_number: taxpayer_number === "" ? null : taxpayer_number,
            opening_bank: opening_bank === "" ? null : opening_bank,
            bank_account: bank_account === "" ? null : bank_account,
            c_address: c_address === "" ? null : c_address,
            financial_call: financial_call === "" ? null : financial_call,
        }
        getData(getRouter(UPDATE_COMPANY), {
            session: sessionStorage.session, company: obj
        }, cb, { self: this, data: obj });
    }

    toggleDrawer = (open) => () => {
        this.setState({
            drawOpen: false,
        });
    };

    qualificationItems = () => {
        var components = []
        var items = ["1级", "2级", "3级", "4级","无等级"];
        items.map((item) => {
            components.push(
                <ListItem button key={item} onClick={() => {
                    this.submit("base", {
                        c_level: item
                    })
                    this.setState({ show: "all" })
                }}>
                    <ListItemText primary={(item)} />
                </ListItem>)
        });
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
                                {"公司全称"}
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
                                {"修改发票信息"}
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
                                {"修改发票信息"}
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
                                    {"修改通讯信息"}
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
                                    {"修改密码"}
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
                    <h2 className="myx-info-title" style={{ marginTop: 20 }}>{"基本信息"}</h2>
                        <Paper 
                        className="nyx-form">
                        
                            <TextField
                                className="nyx-form-div"
                                key={"account"}
                                id={"input_account"}
                                disabled
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
                            <div style={{float:"none",display:"inline-block"}} className="nyx-info-select-div">
                            <p
                            className="nyx-info-select-label"
                            >公司注册地</p>
                            
                            <select
                                className="nyx-info-select-lg"
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
                             <option value={null}>{"-省市-"}</option>
                                {getAreas().map(area => {
                                    return <option key={area.id} value={area.id}>{area.area_name}</option>
                                })}
                            </select>
                            </div>
                            <div style={{float:"none",display:"inline-block"}} className="nyx-info-select-div">
                            <p
                            className="nyx-info-select-label"
                            >企业资质等级</p>
                            <select
                                className="nyx-info-select-lg"
                                id="input_c_level"
                                label={"企业资质等级"}
                                value={this.state.base.c_level === null ? "" : this.state.base.c_level}
                                onChange={(e) => {
                                    this.state.base["c_level"] = Number(e.target.value);
                                    this.setState({
                                        base: this.state.base
                                    });
                                }}
                            >
                                <option value={null}>{"-等级-"}</option>
                                <option value={1}>{"1级"}</option>
                                <option value={2}>{"2级"}</option>
                                <option value={3}>{"3级"}</option>
                                <option value={4}>{"4级"}</option>
                                <option value={5}>{"无等级"}</option>
                            </select>
                            </div>
                            <Button
                                raised
                                style={{position:"relative",
                                       marginTop:"0.5rem"}}
                                color="accent"
                                onClick={() => {
                                   this.company_message();

                                }}
                            >
                                {Lang[window.Lang].pages.main.certain_button}
                            </Button>
                        </Paper>
                        <h2 className="myx-info-title" style={{ marginTop: 20 }}>{"通讯信息"}</h2>
                        <Paper className="nyx-form nyx-info-listitem">
                        <TextField
                                className="nyx-form-div"
                                key={"receiver"}
                                id={"input_receiver"}
                                label={Lang[window.Lang].pages.com.infos.express.receiver}
                                value={this.state.express["receiver"] === null ? "" : this.state.express["receiver"]}
                                onChange={(event) => {
                                    this.state.express["receiver"] = event.target.value
                                    this.setState({
                                        express: this.state.express
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"district"}
                                id={"input_district"}
                                label={Lang[window.Lang].pages.com.infos.express.district}
                                value={this.state.express["district"] === null ? "" : this.state.express["district"]}
                                onChange={(event) => {
                                    this.state.express["district"] = event.target.value
                                    this.setState({
                                        express: this.state.express
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"receive_phone"}
                                id={"input_receive_phone"}
                                label={Lang[window.Lang].pages.com.infos.express.receive_phone}
                                value={this.state.express["receive_phone"] === null ? "" : this.state.express["receive_phone"]}
                                onChange={(event) => {
                                    this.state.express["receive_phone"] = event.target.value
                                    this.setState({
                                        express: this.state.express
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"zip_code"}
                                id={"zip_code"}
                                label={Lang[window.Lang].pages.com.infos.express.zip_code}
                                value={this.state.express["zip_code"] === null ? "" : this.state.express["zip_code"].toString()}
                                onChange={(event) => {
                                    this.state.express["zip_code"] = event.target.value
                                    this.setState({
                                        express: this.state.express
                                    });
                                }}>  
                                </TextField>
                                <Button
                                raised
                                style={{position:"relative",
                                       marginTop:"0.5rem"}}
                                color="accent"
                                onClick={() => {
                                    var cb = (route, message, arg) => {
                                        if (message.code === Code.LOGIC_SUCCESS) {
                                            window.CacheData.base = arg.data;
                                            
                                        }
                                        
                                        this.fresh();
                                        this.popUpNotice(NOTICE, 0, message.msg);
                                    }
                                    this.company_message();
                                }}
                            >
                                {Lang[window.Lang].pages.main.certain_button}
                            </Button>
                        </Paper>
                        <h2 className="myx-info-title" style={{ marginTop: 20 }}>{"发票信息"}</h2>
                        <Paper style={{ marginBottom: 20 }} className="nyx-form nyx-info-listitem">
                        <TextField
                                className="nyx-form-div"
                                key={"allname"}
                                id={"input_allname"}
                                label={Lang[window.Lang].pages.com.infos.finance.allname}
                                value={this.state.finance["allname"] === null ? "" : this.state.finance["allname"]}
                                disabled
                                onChange={(event) => {
                                   
                                    this.state.finance["allname"] = event.target.value
                                    this.setState({
                                        finance: this.state.finance
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"taxpayer_number"}
                                id={"input_taxpayer_number"}
                                label={Lang[window.Lang].pages.com.infos.finance.taxpayer_number}
                                value={this.state.finance["taxpayer_number"] === null ? "" : this.state.finance["taxpayer_number"]}
                                onChange={(event) => {
                                    this.state.finance["taxpayer_number"] = event.target.value
                                    this.setState({
                                        finance: this.state.finance
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"opening_bank"}
                                id={"input_opening_bank"}
                                label={Lang[window.Lang].pages.com.infos.finance.opening_bank}
                                value={this.state.finance["opening_bank"] === null ? "" : this.state.finance["opening_bank"]}
                                onChange={(event) => {
                                    this.state.finance["opening_bank"] = event.target.value
                                    this.setState({
                                        finance: this.state.finance
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"bank_account"}
                                id={"input_bank_account"}
                                label={Lang[window.Lang].pages.com.infos.finance.bank_account}
                                value={this.state.finance["bank_account"] === null ? "" : this.state.finance["bank_account"]}
                                onChange={(event) => {
                                    this.state.finance["bank_account"] = event.target.value
                                    this.setState({
                                        finance: this.state.finance
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"c_address"}
                                id={"input_c_address"}
                                label={Lang[window.Lang].pages.com.infos.finance.c_address}
                                value={this.state.finance["c_address"] === null ? "" : this.state.finance["c_address"]}
                                onChange={(event) => {
                                    this.state.finance["c_address"] = event.target.value
                                    this.setState({
                                        finance: this.state.finance
                                    });
                                }}>  
                                </TextField>
                                <TextField
                                className="nyx-form-div"
                                key={"financial_call"}
                                id={"input_financial_call"}
                                label={Lang[window.Lang].pages.com.infos.finance.financial_call}
                                value={this.state.finance["financial_call"] === null ? "" : this.state.finance["financial_call"]}
                                onChange={(event) => {
                                    this.state.finance["financial_call"] = event.target.value
                                    this.setState({
                                        finance: this.state.finance
                                    });
                                }}>  
                                </TextField>
                                <Button
                                raised
                                style={{position:"relative",
                                       marginTop:"0.5rem"}}
                                color="accent"
                                onClick={() => {
                                    var cb = (route, message, arg) => {
                                        if (message.code === Code.LOGIC_SUCCESS) {
                                            window.CacheData.base = arg.data;
                                        }
                                        this.fresh();
                                        this.popUpNotice(NOTICE, 0, message.msg);
                                    }

                                    this.company_message();

                                }}
                            >
                                {Lang[window.Lang].pages.main.certain_button}
                            </Button>
                        </Paper>
                        {/* <ListSubheader style={{ marginTop: 20}}>{"修改密码"}</ListSubheader>
                        <Paper style={{marginBottom: 80}} >
                            <div className="nyx-info-line-height"
                                onClick={() => { this.setState({ show: "admin", }) }}>
                                <div><span className="nyx-info-span">公司全称</span>{this.state.admin.account}</div>
                                <div><span className="nyx-info-span">密码</span>******</div>
                            </div>
                        </Paper> */}
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
