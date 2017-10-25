// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_ADMIN,UPDATE_ADMIN } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';

class Admin extends Component {
    state = {
        account: "",
        password: "",
        name: "",
        mobile: "",
        mail: "",
        duty: "",
        department: "",
        temObj: {}
    }

    componentDidMount() {
        if (getCache(DATA_TYPE_ADMIN) !== undefined) {
            var data = getCache(DATA_TYPE_ADMIN);
            this.setState({
                account: data.account,
                password: data.password,
                name: data.name,
                mobile: data.mobile,
                mail: data.mail,
                duty: data.duty,
                department: data.department
            });
        }
    }

    submit = (sendObj) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {

                for (var key in this.state.temObj) {
                    window.CacheData.admin[key] = this.state.temObj[key];
                }
            }
        }
        var obj = {
            account: this.state.account,
            password: this.state.password,
            name: this.state.name,
            mobile: this.state.mobile,
            mail: this.state.mail,
            duty: this.state.duty,
            department: this.state.department,
        }

        getData(getRouter(UPDATE_ADMIN), { session: sessionStorage.session, admin: obj }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <Paper className={"nyx-form"}>
                <TextField
                    className="nyx-form-div"
                    id="account"
                    label={Lang[window.Lang].pages.com.infos.admin.account}
                    value={this.state.account}
                    onChange={(event, value) => {
                        this.state.temObj.account = value;
                        // this.setState({
                        //     account: event.target.value,
                        // });
                    }}
                    fullWidth>
                </TextField>
                <TextField
                    className="nyx-form-div"
                    id="password"
                    label={Lang[window.Lang].pages.com.infos.admin.password}
                    value={this.state.password}
                    onChange={event => {
                        this.setState({
                            password: event.target.value,
                        });
                    }}
                    fullWidth>
                </TextField>
                <TextField
                    className="nyx-form-div"
                    id="name"
                    label={Lang[window.Lang].pages.com.infos.admin.name}
                    value={this.state.name}
                    onChange={(event, value) => {
                        this.state.temObj.account = value;
                        this.setState({
                            name: event.target.value,
                        });
                    }}
                    fullWidth>
                </TextField>
                <TextField
                    className="nyx-form-div"
                    id="duty"
                    label={Lang[window.Lang].pages.com.infos.admin.duty}
                    value={this.state.duty}
                    onChange={event => {
                        this.setState({
                            duty: event.target.value,
                        });
                    }}
                    fullWidth>
                </TextField>
                <TextField
                    className="nyx-form-div"
                    id="department"
                    label={Lang[window.Lang].pages.com.infos.admin.department}
                    value={this.state.department}
                    onChange={event => {
                        this.setState({
                            department: event.target.value,
                        });
                    }}
                    fullWidth>
                </TextField>
                <TextField
                    className="nyx-form-div"
                    id="mobile"
                    label={Lang[window.Lang].pages.com.infos.admin.mobile}
                    value={this.state.mobile}
                    onChange={event => {
                        this.setState({
                            mobile: event.target.value,
                        });
                    }}
                    fullWidth>
                </TextField>
                <TextField
                    className="nyx-form-div"
                    id="mail"
                    label={Lang[window.Lang].pages.com.infos.admin.mail}
                    value={this.state.mail}
                    onChange={event => {
                        this.setState({
                            mail: event.target.value,
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
                    className=""
                >
                    {Lang[window.Lang].pages.main.certain_button}
                </Button>
            </Paper>
        );
    }



};

export default Admin;
