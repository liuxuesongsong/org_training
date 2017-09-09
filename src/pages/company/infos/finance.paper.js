// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, RESET_INFO, DATA_TYPE_FINANCE } from '../../../enum';
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

const LANG_PREFIX = Lang[window.Lang].pages.company.infos.finance;

class Finance extends Component {

    state = {
        name: "", taxpayer_identify: "", bank: "", bank_account: "", address: "", tel: ""
    }

    componentDidMount() {
        if (getCache(DATA_TYPE_FINANCE) !== undefined) {
            var data = getCache(DATA_TYPE_FINANCE)
            this.setState({
                name: data.name,
                taxpayer_identify: data.taxpayer_identify,
                bank: data.bank,
                bank_account: data.bank_account,
                address: data.address,
                tel: data.tel
            });
        }
    }

    submit = () => {

        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                window.CacheData.finance = arg.data;
                console.log(getCache(DATA_TYPE_FINANCE));
            }
        }
        var obj = {
            name: this.state.name,
            taxpayer_identify: this.state.taxpayer_identify,
            bank: this.state.bank,
            bank_account: this.state.bank_account,
            address: this.state.address,
            tel: this.state.tel
        }
        getData(getRouter(RESET_INFO), { session: sessionStorage.session, base: JSON.stringify(obj) }, cb, { self: this, data: obj });
    }

    render() {

        return (
            <div>

                <Paper style={{ width: 600 }}>
                    <TextField
                        id="name"
                        label={LANG_PREFIX.name}
                        value={this.state.name}
                        onChange={event => {
                            this.setState({
                                name: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="taxpayer_identify"
                        label={LANG_PREFIX.taxpayer_identify}
                        value={this.state.taxpayer_identify}
                        onChange={event => {
                            this.setState({
                                taxpayer_identify: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="bank"
                        label={LANG_PREFIX.bank}
                        value={this.state.bank}
                        onChange={event => {
                            this.setState({
                                bank: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
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
                    <TextField
                        id="address"
                        label={LANG_PREFIX.address}
                        value={this.state.address}
                        onChange={event => {
                            this.setState({
                                address: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="tel"
                        label={LANG_PREFIX.tel}
                        value={this.state.tel}
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
                </Paper>
            </div>
        );
    }



};

export default Finance;
