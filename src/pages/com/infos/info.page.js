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

import { initCache, getCache, getData, getRouter, getCity } from '../../../utils/helpers';
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
            c_name: "未设置",
            c_area_id: "未设置",
            city: "未设置",
            c_level: "未设置",
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
        admin: {},

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
            console.log(data);
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

    queryArea = () => {
        var cb = (router, message, arg) => {
            if (message.code === 10033) {
                this.setState({ areas: message.area })
            }
        }
        getData(getRouter(AREA_INFOS), { session: sessionStorage.session }, cb, {});
    }

    qualificationItems = () => {
        var components = []
        var items = [1, 2, 3, 4];
        items.map((item) => {
            components.push(
                <ListItem button id={item} onClick={() => {
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
                            <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                {"修改公司简称"}
                            </Typography>

                        </Toolbar>
                    </AppBar>
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
                </div>)
            case "area":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton className={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                    {"修改所在区域"}
                                </Typography>

                            </Toolbar>
                        </AppBar>
                        <List style={{
                            height: "100%"
                        }} disablePadding>
                            {getCache(DATA_TYPE_AREA).map(area =>
                                <ListItem button
                                    onClick={(e) => {
                                        this.submit("base", {
                                            c_area_id: area.id
                                        })
                                        this.setState({ show: "all" })
                                    }}>
                                    {area.area_name}
                                    <div>
                                        {area.id === this.state.base.c_area_id ? this.state.city : ""}
                                    </div>
                                </ListItem>)}

                        </List>
                    </div>
                )
            case "qualification":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton className={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" className={{ flex: 1 }}>
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
                            <IconButton className={{
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
                            <Typography type="title" color="inherit" className={{ flex: 1 }}>
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
                            <IconButton className={{
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
                            <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                {"修改邮政信息"}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Finance />
                    {/* <TextField
                        id="name"
                        label={LANG_PREFIX.finance.name}
                        value={this.state.finance.name}
                        onChange={event => {
                            this.setState({
                                name: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="taxpayer_identify"
                        label={LANG_PREFIX.finance.taxpayer_identify}
                        value={this.state.finance.taxpayer_identify}
                        onChange={event => {
                            this.setState({
                                taxpayer_identify: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="bank"
                        label={LANG_PREFIX.finance.bank}
                        value={this.state.finance.bank}
                        onChange={event => {
                            this.setState({
                                bank: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="bank_account"
                        label={LANG_PREFIX.finance.bank_account}
                        value={this.state.finance.bank_account}
                        onChange={event => {
                            this.setState({
                                bank_account: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="address"
                        label={LANG_PREFIX.finance.address}
                        value={this.state.finance.address}
                        onChange={event => {
                            this.setState({
                                address: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="mobile"
                        label={LANG_PREFIX.finance.tel}
                        value={this.state.finance.tel}
                        onChange={event => {
                            this.setState({
                                tel: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <Button
                        raised
                        color="accent"
                        onClick={() => {
                            this.submit();
                        }}
                    >
                        {Lang[window.Lang].pages.main.certain_button}
                    </Button> */}
                </div>);
            case "express":
                return (
                    <div>
                        <AppBar position="static" color="default">
                            <Toolbar>
                                <IconButton className={{
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
                                <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                    {"修改邮政信息"}
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
                                <IconButton className={{
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
                                <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                    {"修改管理员信息"}
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
                                <IconButton className={{
                                    marginLeft: -12,
                                    marginRight: 20,
                                }} color="default" aria-label="Menu">
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" className={{ flex: 1 }}>
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
                return (<div>

                    <List style={{
                        height: "100%"
                    }} disablePadding>
                        <ListSubheader>{"企业信息"}</ListSubheader>
                        <Paper>
                            <ListItem button
                                onClick={() => { this.setState({ show: "componyName", }) }}>
                                <ListItemText primary={"公司简称"} />
                                <div>
                                    {this.state.base.c_name}
                                </div>
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "area", }) }}>
                                <ListItemText primary={"所属服务区"} />
                                <div>
                                    {this.state.city}
                                </div>
                            </ListItem>

                            <ListItem button
                                onClick={() => { this.setState({ show: "qualification", }) }}>
                                <ListItemText primary={"企业等级"} />
                                <div>
                                    {this.state.base.c_level}
                                </div>
                            </ListItem>
                        </Paper>
                        <ListSubheader style={{ marginTop: 20 }}>{"邮政信息"}</ListSubheader>
                        <Paper>
                            <ListItem button
                                onClick={() => { this.setState({ show: "express", }) }}>
                                {/* <ListItemText primary={LANG_PREFIX.express.title} /> */}
                                收件人&nbsp;&nbsp;&nbsp;&nbsp; {this.state.express.receiver}<br />
                                联系电话&nbsp;&nbsp;&nbsp;&nbsp;{this.state.express.receive_phone}<br />
                                所在区域&nbsp;&nbsp;&nbsp;&nbsp;{this.state.express.receive_address}&nbsp;&nbsp;{this.state.express.zip_code}<br />
                                收件地址&nbsp;&nbsp;&nbsp;&nbsp;{this.state.express.district}
                            </ListItem>
                        </Paper>
                        <ListSubheader style={{ marginTop: 20 }}>{"财务信息"}</ListSubheader>
                        <Paper>
                            <ListItem button
                                onClick={() => { this.setState({ show: "finance", }) }}>
                                纳税信息&nbsp;&nbsp;&nbsp;&nbsp; {this.state.finance.allname}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.taxpayer_number}<br />
                                银行信息&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.opening_bank}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.bank_account}<br />
                                联系方式&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.c_address}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.financial_call}
                            </ListItem>
                        </Paper>
                        <ListSubheader style={{ marginTop: 20 }}>{"管理员信息"}</ListSubheader>
                        <Paper>
                            <ListItem button
                                onClick={() => { this.setState({ show: "admin", }) }}>
                                管理员信息&nbsp;&nbsp;&nbsp;&nbsp; {this.state.admin.name}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.admin.mobile}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.admin.mail}
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "logout", }) }}>
                                登陆信息&nbsp;&nbsp;&nbsp;&nbsp; {this.state.admin.account}
                            </ListItem>
                        </Paper>
                    </List>
                </div>)
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
