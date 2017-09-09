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
import { DATA_TYPE_BASE, RESET_INFO, DATA_TYPE_EXPRESS } from '../../../enum';
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

const LANG_PREFIX = Lang[window.Lang].pages.company.infos.express;

class Express extends Component {
    componentDidMount() {
        if (getCache(DATA_TYPE_EXPRESS) !== undefined) {
            var data = getCache(DATA_TYPE_EXPRESS)
            this.setState({
                express_code: data.express_code,
                express_address: data.address,
                address: data.address,
                express_person: data.express_person,
                contact_way: data.contact_way
            });
        }
    }

    state = {
        express_code: "", express_address: "", address: "", express_person: "", contact_way: ""
    }

    submit = () => {


        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {

                window.CacheData.express = arg.data;

                console.log(getCache(DATA_TYPE_EXPRESS));
                // arg.self.state.data = 
            }

        }

        var obj = {
            express_code: express_code,
            express_address: express_address,
            contact_way: contact_way,
            address: address,
            contact_way: qualification
        }
        getData(getRouter(RESET_INFO), { session: sessionStorage.session, base: JSON.stringify(obj) }, cb, { self: this, data: obj });
    }

    render() {
        return (
            <div>

                <Paper style={{ width: 600 }}>


                    <TextField
                        id="express_code"
                        label={LANG_PREFIX.express_code}
                        value={this.state.express_code}
                        onChange={event => {
                            this.setState({
                                express_code: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>
                    <TextField
                        id="express_address"
                        label={LANG_PREFIX.express_address}
                        value={this.state.express_address}
                        onChange={event => {
                            this.setState({
                                express_address: event.target.value,
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
                        id="express_person"
                        label={LANG_PREFIX.express_person}
                        value={this.state.express_person}
                        onChange={event => {
                            this.setState({
                                express_person: event.target.value,
                            });
                        }}
                        fullWidth>
                    </TextField>

                    <TextField
                        id="contact_way"
                        label={LANG_PREFIX.contact_way}
                        value={this.state.contact_way}
                        onChange={event => {
                            this.setState({
                                contact_way: event.target.value,
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
