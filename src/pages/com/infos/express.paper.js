// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_EXPRESS } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';


const LANG_PREFIX = Lang[window.Lang].pages.com.infos.express;

class Express extends Component {
    componentDidMount() {
        if (getCache(DATA_TYPE_EXPRESS) !== undefined) {
            var data = getCache(DATA_TYPE_EXPRESS)
            this.setState({
                zip_code: data.zip_code,
                receive_address: data.receive_address,
                district: data.district,
                receiver: data.receiver,
                receive_phone: data.receive_phone
            });
        }
    }

    state = {
        zip_code: "", receive_address: "", district: "", receiver: "", receive_phone: ""
    }

    submit = () => {


        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {

                window.CacheData.express = arg.data;

                // arg.self.state.data = 
            }

        }

        var obj = {
            zip_code: this.state.zip_code,
            receive_address: this.state.receive_address,
            district:this.state.district,
            receiver: this.state.receiver,
            receive_phone: this.state.receive_phone,
        }
        getData(getRouter(UPDATE_COMPANY), { session: sessionStorage.session, company:obj }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <div>

                <Paper style={{ width: 600 }}>


                    <TextField
                        id="zip_code"
                        label={LANG_PREFIX.zip_code}
                        value={this.state.zip_code}
                        onChange={event => {
                            this.setState({
                                zip_code: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="receive_address"
                        label={LANG_PREFIX.receive_address}
                        value={this.state.receive_address}
                        onChange={event => {
                            this.setState({
                                receive_address: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>

                    <TextField
                        id="district"
                        label={LANG_PREFIX.district}
                        value={this.state.district}
                        onChange={event => {
                            this.setState({
                                district: event.target.value,
                            });
                        }}
                        fullWidth>

                    </TextField>

                    <TextField
                        id="receiver"
                        label={LANG_PREFIX.receiver}
                        value={this.state.receiver}
                        onChange={event => {
                            this.setState({
                                receiver: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>

                    <TextField
                        id="receive_phone"
                        label={LANG_PREFIX.receive_phone}
                        value={this.state.receive_phone}
                        onChange={event => {
                            this.setState({
                                receive_phone: event.target.value,
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

export default Express;
