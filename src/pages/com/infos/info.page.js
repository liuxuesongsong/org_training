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

import { initCache, getCache } from '../../../utils/helpers';
import Lang from '../../../language';
import Code from '../../../code';

import { DATA_TYPE_AREA, DATA_TYPE_BASE, RESET_INFO, DATA_TYPE_FINANCE, DATA_TYPE_EXPRESS, DATA_TYPE_ADMIN } from '../../../enum';

import CommonAlert from '../../../components/CommonAlert';

const LANG_PREFIX = Lang[window.Lang].pages.com.infos;

class Info extends Component {

    state = {
        gotData: false,
        drawOpen: false,
        show: "all",
        base: {},
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
            window.currentPage.setState({
                base: data
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
            console.log(data);
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
                console.log(arg.data);
                for (var k in arg.data) {
                    window.CacheData[arg.objType][k] = arg.data[k];
                }
                console.log(getCache(DATA_TYPE_BASE));
                // arg.self.state.data = 
            }
        }
        console.log(sendObj);
        getData(getRouter(RESET_INFO), { session: sessionStorage.session, company: sendObj }, cb, { self: this, type: objType, data: sendObj });
    }

    toggleDrawer = (open) => () => {
        this.setState({
            drawOpen: false,
        });
    };

    queryArea = () => {
        var cb = (router, message, arg) => {
            console.log(message);
            if (message.code === 10033) {
                this.setState({ areas: message.area })
            }
        }
        getData(getRouter(AREA_INFOS), { session: sessionStorage.session }, cb, {});
    }

    qualificationItems = () => {
        var items = [];
        for (var i = 1; i <= 4; i++) {
            items.push(
                <ListItem id={i} onClick={() => {

                }}>
                    <ListItemText primary={(i) + "级"} />
                </ListItem>
            )
        }
        return items
    }

    subShow = () => {
        switch (this.state.show) {
            case "componyName":
                return (<div>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <IconButton className={{
                                marginLeft: -12,
                                marginRight: 20,
                            }} color="default" aria-label="Menu">
                                <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                            </IconButton>
                            <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                {"修改公司简称"}
                            </Typography>
                            <TextField
                                id="bank_account"
                                label={LANG_PREFIX.bank_account}
                                value={this.state.bank_account}
                                onChange={event => {
                                    this.setState({
                                        bank_account: event.target.value,
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
                            </Button>
                        </Toolbar>
                    </AppBar>
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
                                    onClick={() => {
                                        this.submit("base", {
                                            c_area_id: area.id
                                        })
                                    }}>
                                    {area.area_name}
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
                                <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
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
                                <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
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
                        id="tel"
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
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
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
                                    <BackIcon onClick={() => { this.setState({ show: "all" }) }} />
                                </IconButton>
                                <Typography type="title" color="inherit" className={{ flex: 1 }}>
                                    {"修改管理员信息"}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Admin />
                    </div>);
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
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "area", }) }}>
                                <ListItemText primary={"所属服务区"} />
                            </ListItem>

                            <ListItem button
                                onClick={() => { this.setState({ show: "qualification", }) }}>
                                <ListItemText primary={"企业等级"} />
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
                        </Paper >
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
                                onClick={() => { this.setState({ show: "admin", }) }}>
                                登陆信息&nbsp;&nbsp;&nbsp;&nbsp; {this.state.admin.account}
                            </ListItem>
                        </Paper>
                    </List>
                </div>)
        }
    }

    render() {
        return (
            <div>

                <div style={{ paddingTop: 80, paddingLeft: window.innerWidth * 0.1, justifyContent: 'space-between' }}>
                    <div style={{ width: window.innerWidth * 0.8, height: window.innerHeight }}>
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
