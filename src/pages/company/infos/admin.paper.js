// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, RESET_INFO, DATA_TYPE_ADMIN } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';

const styleSheet = createStyleSheet('PaperSheet', theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
    }),
    paper: {
        padding: 16,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

class Admin extends Component {
    state = {
        account: "", password: "", name: "", tel: "", email: ""
    }

    componentDidMount() {
        if (getCache(DATA_TYPE_ADMIN) !== undefined) {
            var data = getCache(DATA_TYPE_ADMIN);
            this.setState({
                account: data.account, 
                password: data.password, 
                name: data.name, 
                tel: data.tel, 
                email: data.email
            });
        }
    }

    submit = () => {

        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {

                window.CacheData.admin = arg.data;

                console.log(getCache(DATA_TYPE_ADMIN));
                // arg.self.state.data = 
            }

        }
        var obj = {
            account: this.state.account,
            password: this.state.password,
            name: this.state.name,
            tel: this.state.tel,
            email: this.state.email
        }
        getData(getRouter(RESET_INFO), { session: sessionStorage.session, base: JSON.stringify(obj) }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <div

            >
                <Paper style={{ width: 600 }}>
                    <TextField
                        id="account"
                        label={Lang[window.Lang].pages.company.infos.admin.account}
                        value={this.state.account}
                        onChange={event => {
                            this.setState({
                                account: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="password"
                        label={Lang[window.Lang].pages.company.infos.admin.password}
                        value={this.state.password}
                        onChange={event => {
                            this.setState({
                                password: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="name"
                        label={Lang[window.Lang].pages.company.infos.admin.name}
                        value={this.state.name}
                        onChange={event => {
                            this.setState({
                                name: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="tel"
                        label={Lang[window.Lang].pages.company.infos.admin.tel}
                        value={this.state.tel}
                        onChange={event => {
                            this.setState({
                                tel: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="email"
                        label={Lang[window.Lang].pages.company.infos.admin.email}
                        value={this.state.email}
                        onChange={event => {
                            this.setState({
                                email: event.target.value,
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
                </Paper>

            </div>
        );
    }



};

export default Admin;
