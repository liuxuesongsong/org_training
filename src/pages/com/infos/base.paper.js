// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import { getData, getCache, getRouter } from '../../../utils/helpers';
import { DATA_TYPE_BASE, UPDATE_COMPANY } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';

class Base extends Component {
    state = {
        c_name: "",
        c_area_id: "",
        c_level: "",
        submit_obj: {}
    }

    componentDidMount() {
        this.setState({
            c_name: "",
            c_area_id: 0,
            c_level: ""
        });
        if (getCache(DATA_TYPE_BASE) !== undefined) {
            var data = getCache(DATA_TYPE_BASE);
            this.setState({
                c_name: data.c_name,
                c_area_id: data.c_area_id,
                c_level: data.c_level
            });
        }
    }

    submit = () => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                window.CacheData.base = arg.data;
            }
        }

        var obj = {
            "c_name": document.getElementById("c_name").value,
            "c_area_id": document.getElementById("c_area_id").value,
            "c_level": document.getElementById("c_level").value,
        }

        getData(getRouter(UPDATE_COMPANY), { session: sessionStorage.session, company: obj }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <div>
                <Paper style={{ width: 600 }}>
                    <TextField
                        id="c_name"
                        label={Lang[window.Lang].pages.com.infos.base.c_name}
                        value={this.state.c_name}
                        onChange={event => {
                            this.setState({
                                c_name: event.target.value,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        id="c_area_id"
                        label={Lang[window.Lang].pages.com.infos.base.c_area_id}
                        value={this.state.c_area_id}
                        onChange={event => {
                            this.setState({
                                c_area_id: event.target.value,
                            });
                        }}
                        fullWidth
                    />
                    <TextField
                        id="c_level"
                        label={Lang[window.Lang].pages.com.infos.base.c_level}
                        value={this.state.c_level}
                        onChange={event => {
                            this.setState({
                                c_level: event.target.value,
                            });
                        }}
                        fullWidth
                    />
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

export default Base;
