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

import { DATA_TYPE_BASE, RESET_INFO, DATA_TYPE_FINANCE, DATA_TYPE_EXPRESS, DATA_TYPE_ADMIN } from '../../../enum';

import CommonAlert from '../../../components/CommonAlert';

const LANG_PREFIX = Lang[window.Lang].pages.com.infos;

class Info extends Component {

    state = {
        gotData: false,
        drawOpen: false,
        show: "all",
        base: {},
        finance: {
            name: "公司名称未设置",
            taxpayer_identify: "纳税人识别号未设置",
            bank: "开户银行未设置",
            bank_account: "开户账号未设置",
            tel: "联系电话未设置",
            address: "地址未设置"
        },
        express: {},
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

    submit = (sendObj) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {

                console.log(arg.data);

                window.CacheData.base = arg.data;

                console.log(getCache(DATA_TYPE_BASE));
                // arg.self.state.data = 
            }

        }

        var obj = {
            qualification: document.getElementById("qualification").value
        }
        console.log(obj);
        getData(getRouter(RESET_INFO), { session: sessionStorage.session, base: JSON.stringify(obj) }, cb, { self: this, data: obj });
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
                <ListItem id={i} onClick={() => { }}>
                    <ListItemText primary={(i) + "级"} />
                </ListItem>
            )
        }
        return items
    }

    subShow = () => {
        switch (this.state.show) {
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
                                    修改财务信息
                </Typography>
                            </Toolbar>
                        </AppBar>
                        <List style={{
                            height: "100%"
                        }} disablePadding>
                            <ListItem onClick={() => { this.setState({ show: "area", }) }}>
                                <ListItemText primary={"所属服务区"} />

                            </ListItem>
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
                                    修改财务信息
                </Typography>
                            </Toolbar>
                        </AppBar>
                        <List style={{
                            height: "100%"
                        }} disablePadding>
                            {
                                this.qualificationItems()
                            }
                        </List>
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
                                修改财务信息
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
                                修改财务信息
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <TextField
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
                    </Button>
                </div>);
            case "express":
                return <Express />;
            case "admin":
                return <Admin />;
            default:
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
                                修改财务信息
                    </Typography>
                        </Toolbar>
                    </AppBar>
                    <List style={{
                        height: "100%"
                    }} disablePadding>
                        <div>
                            <ListSubheader>{"企业信息"}</ListSubheader>
                            <ListItem button
                                onClick={() => { this.setState({ show: "area", }) }}>
                                <ListItemText primary={"所属服务区"} />
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "qualification", }) }}>
                                <ListItemText primary={"企业等级"} />
                            </ListItem>
                            <ListSubheader>{"邮政信息"}</ListSubheader>
                            <ListItem button
                                onClick={() => { this.setState({ show: "express", }) }}>
                                <ListItemText primary={LANG_PREFIX.express.title} />
                            </ListItem>
                            <ListSubheader>{"财务信息"}</ListSubheader>
                            <ListItem button
                                onClick={() => { this.setState({ show: "finance", }) }}>
                                纳税信息&nbsp;&nbsp;&nbsp;&nbsp; {this.state.finance.name}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.taxpayer_identify}<br />
                                银行信息&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.bank}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.bank_account}<br />
                                联系方式&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.tel}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.finance.address}
                            </ListItem>
                            <ListSubheader>{"管理员信息"}</ListSubheader>
                            <ListItem button
                                onClick={() => { this.setState({ show: "admin", }) }}>
                                <ListItemText primary={LANG_PREFIX.admin.title} />
                            </ListItem>
                        </div>
                    </List>
                </div>)
        }
    }

    render() {
        return (
            <div>

                <div style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}>
                    <Paper style={{ width: window.innerWidth, height: window.innerHeight }}>
                        {this.subShow()}
                    </Paper>
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
