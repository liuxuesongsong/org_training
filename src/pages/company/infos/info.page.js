// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Mail';
import DeleteIcon from 'material-ui-icons/Delete';
import ReportIcon from 'material-ui-icons/Report';

import Base from './base.paper';
import Finance from './finance.paper';
import Express from './express.paper';
import Admin from './admin.paper';

import { initCache, getCache } from '../../../utils/helpers';
import Lang from '../../../language';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

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

const LANG_PREFIX = Lang[window.Lang].pages.company.infos;

class Info extends Component {

    state = {
        gotData: false,
        open: true,
        show: "all",

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

    render() {

        return (
            <div>
                {/* <Drawer
                    open={this.state.open}
                    onRequestClose={this.handleLeftClose}
                    onClick={this.handleLeftClose}
                > */}

                {/* </Drawer> */}

                <div style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}>
                    <List style={{
                        height: "100%"
                    }} disablePadding>
                        <div>
                            <ListItem button
                                onClick={() => { this.setState({ show: "base" }) }}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary={LANG_PREFIX.base.title} />
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "finance" }) }}>
                                <ListItemIcon>
                                    <StarIcon />
                                </ListItemIcon>
                                <ListItemText primary={LANG_PREFIX.finance.title} />
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "express" }) }}>
                                <ListItemIcon>
                                    <SendIcon />
                                </ListItemIcon>
                                <ListItemText primary={LANG_PREFIX.express.title} />
                            </ListItem>
                            <ListItem button
                                onClick={() => { this.setState({ show: "admin" }) }}>
                                <ListItemIcon>
                                    <DraftsIcon />
                                </ListItemIcon>
                                <ListItemText primary={LANG_PREFIX.admin.title} />
                            </ListItem>
                        </div>
                    </List>
                    {this.state.gotData === true ?
                        <Grid container gutter={24}>
                            {this.state.show === "all" || this.state.show === "base" ? <Grid item xs={12} sm={6}>
                                <Base />
                            </Grid> : ""}
                            {this.state.show === "all" || this.state.show === "finance" ? <Grid item xs={12} sm={6}>
                                <Finance />
                            </Grid> : ""}
                            {this.state.show === "all" || this.state.show === "express" ? <Grid item xs={12} sm={6}>
                                <Express />
                            </Grid> : ""}
                            {this.state.show === "all" || this.state.show === "admin" ? <Grid item xs={12} sm={6}>
                                <Admin />
                            </Grid> : ""}
                        </Grid> : <div />
                    }
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
