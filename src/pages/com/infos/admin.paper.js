// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import { initCache, getData, getCache, getRouter } from '../../../utils/helpers';
import { NOTICE,DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_ADMIN, UPDATE_ADMIN } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';
import CommonAlert from '../../../components/CommonAlert';
class Admin extends Component {
    state = {
        gotData: false,
        show: "all",
        admin: {
            account: "",
            password: ""
        },
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


    subShow = () => {
        switch (this.state.show) {
            default:
                return (
                    <div className="nyx-info">
                        <List style={{
                            height: "100%"
                        }} disablePadding>
                            <Paper
                                className={"nyx-form"}>
                                <TextField
                                    className="nyx-form-div"
                                    key={"account"}
                                    id="account"
                                    label={Lang[window.Lang].pages.com.infos.admin.account}
                                    value={this.state.admin["account"] === null ? "" : this.state.admin["account"]}
                                    onChange={(event, value) => {

                                        this.setState({

                                            admin: this.state.admin

                                        });
                                    }}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    className="nyx-form-div"
                                    key={"password"}
                                    type="password"
                                    label={Lang[window.Lang].pages.com.infos.admin.old_password}
                                    value={this.state.admin["password"] === null ? "" : this.state.admin["password"]}
                                    onChange={(event, value) => {

                                        this.setState({

                                            admin: this.state.admin

                                        });
                                    }}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    className="nyx-form-div"
                                    key={"newpassword"}
                                    id="new_password"
                                    type="password"
                                    label={Lang[window.Lang].pages.com.infos.admin.new_password}
                                    
                                    fullWidth>
                                </TextField>
                                <TextField
                                    className="nyx-form-div"
                                    key={"checkpassword"}
                                    id="check_password"
                                    type="password"
                                    label={Lang[window.Lang].pages.com.infos.admin.check_password}
                                    
                                    fullWidth>
                                </TextField>
                                <Button
                                    style={{
                                        position: "relative",
                                        marginTop: "0.5rem"
                                    }}
                                    raised
                                    color="accent"
                                    onClick={() => {
                                        if(document.getElementById("new_password").value!=document.getElementById("check_password").value){
                                            this.popUpNotice(NOTICE, 0, "两次密码不一致");
                                            return
                                        }
                                        this.submit();
                                    }}
                                    className=""
                                >
                                    {Lang[window.Lang].pages.main.certain_button}
                                </Button>
                            </Paper>
                        </List>
                    </div>
                )
        }
    }

    submit = (sendObj) => {
        var cb = (route, message, arg) => {
            this.popUpNotice(NOTICE, 0, message.msg);
            if (message.code === Code.LOGIC_SUCCESS) {
                
                window.CacheData.admin = arg.data;
                // for (var key in this.state.temObj) {
                //     console.log(temObj);
                //     window.CacheData.admin[key] = this.state.temObj[key];
                // }
            }
        }
        var obj = {
            password: document.getElementById("check_password").value,
        }

        getData(getRouter(UPDATE_ADMIN), { session: sessionStorage.session, admin: obj }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <div style={{ marginTop: 20 }} className={'nyx-page'}>
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

export default Admin;
