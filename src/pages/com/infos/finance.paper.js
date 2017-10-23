// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_FINANCE } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';

const LANG_PREFIX = Lang[window.Lang].pages.com.infos.finance;

class Finance extends Component {

    state = {
        allname: "", taxpayer_number: "", opening_bank: "", bank_account: "", c_address: "", financial_call: ""
    }

    componentDidMount() {
        if (getCache(DATA_TYPE_FINANCE) !== undefined) {
            var data = getCache(DATA_TYPE_FINANCE)
            this.setState({
                allname: data.allname,
                taxpayer_number: data.taxpayer_number,
                opening_bank: data.opening_bank,
                bank_account: data.bank_account,
                c_address: data.c_address,
                financial_call: data.financial_call
            });
        }
    }

    submit = () => {

        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                window.CacheData.finance = arg.data;
            }
        }
        var obj = {
            allname: this.state.allname,
            taxpayer_number: this.state.taxpayer_number,
            opening_bank: this.state.opening_bank,
            bank_account: this.state.bank_account,
            c_address: this.state.c_address,
            financial_call: this.state.financial_call,
        }
        getData(getRouter(UPDATE_COMPANY), { session: sessionStorage.session, company: obj }, cb, { self: this, data: obj });
    }

    render() {

        return (
            <div>

                <Paper style={{ width: 600 }}>
                    <TextField
                        id="allname"
                        label={LANG_PREFIX.allname}
                        value={this.state.allname}
                        onChange={event => {
                            this.setState({
                                allname: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="taxpayer_number"
                        label={LANG_PREFIX.taxpayer_number}
                        value={this.state.taxpayer_number}
                        onChange={event => {
                            this.setState({
                                taxpayer_number: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="opening_bank"
                        label={LANG_PREFIX.opening_bank}
                        value={this.state.opening_bank}
                        onChange={event => {
                            this.setState({
                                opening_bank: event.target.value,
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
                        id="c_address"
                        label={LANG_PREFIX.c_address}
                        value={this.state.c_address}
                        onChange={event => {
                            this.setState({
                                c_address: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="financial_call"
                        label={LANG_PREFIX.financial_call}
                        value={this.state.financial_call}
                        onChange={event => {
                            this.setState({
                                financial_call: event.target.value,
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
