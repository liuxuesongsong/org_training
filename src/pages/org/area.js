import React, { Component } from 'react';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';

import { initCache, getData, getRouter, getCache, getStudent } from '../../utils/helpers';


import { ALERT, NOTICE, NEW_AREA, DEL_AREA, AREA_INFOS, QUERY, } from '../../enum';

import Code from '../../code';
import Lang from '../../language';

import CommonAlert from '../../components/CommonAlert';

class Area extends Component {
    state = {
        areas: [],
        clazz: [],
        showInfo: false,
        openNewAreaDialog: false,
        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "登录成功"
    }

    componentDidMount() {
        window.currentPage = this;
        this.queryArea();
        //this.fresh()
    }

    fresh = () => {
    }

    queryArea = () => {
        var cb = (router, message, arg) => {
            if (message.code === 10033) {
                this.setState({ areas: message.area })
            }
        }
        getData(getRouter(AREA_INFOS), { session: sessionStorage.session }, cb, {});
    }

    newAreaDialog = () => {
        return (
            <Dialog open={this.state.openNewAreaDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    新增服务区
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.org.new_service}
                        </Typography>
                        <TextField
                            id="area_name"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                this.newArea({
                                    area_name: document.getElementById("area_name").value
                                })
                                this.handleRequestClose()
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button>
                        <Button
                            onClick={() => {
                                this.handleRequestClose()
                            }}
                        >
                            {Lang[window.Lang].pages.main.cancel_button}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        )
    }




    newArea = (area) => {
        var cb = (router, message, arg) => {
            if (message.code === 10032) {
                Object.assign(arg.area, { id: message.id })
                this.state.areas.push(arg.area)
                this.setState({ areas: this.state.areas })
            }
        }
        var obj = {
            session: sessionStorage.session,
            area: area
        }
        getData(getRouter(NEW_AREA), obj, cb, { area: area });

    }

    delArea = (id) => {
        var cb = (router, message, arg) => {
            if (message.code === 10034) {
                for (var i = 0; i < this.state.areas.length; i++) {
                    if (this.state.areas[i].id === arg.id) {
                        this.state.areas.splice(i, 1);
                        this.setState({
                            areas: this.state.areas
                        })
                        break;
                    }
                }
            }
        }
        getData(getRouter(DEL_AREA), { session: sessionStorage.session, id: id }, cb, { id: id });
    }



    queryClazzInArea = () => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.areas = message.area
            }
        }
        getData(getRouter(), { session: sessionStorage.session, id: id }, cb, { id: id });

    }

    handleRequestClose = () => {
        this.setState({
            openNewAreaDialog: false
        })
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    render() {
        return <div>

            <div style={{ margin: 10, marginLeft: 50, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.students.list_title}</ListSubheader>}>
                    <ListSubheader>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.setState({
                                    openNewAreaDialog: true
                                });
                            }}
                            style={{ margin: 10 }}
                        >
                            {Lang[window.Lang].pages.org.new_service}
                        </Button>
                    </ListSubheader>
                    {this.state.areas.map(area =>
                        <Card
                            key={area.id}
                            style={{ display: 'flex', }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    <Typography type="body1">
                                        {area.id}
                                    </Typography>
                                    <Typography type="body1" component="h2">
                                        {area.area_name}
                                    </Typography>

                                </CardContent>
                            </div>
                            <div>
                                <CardActions>

                                    <Button
                                        dense
                                        onClick={() => {
                                            this.state.selected = area;
                                            this.delArea(area.id);
                                            return
                                            this.popUpNotice(ALERT, 0, "删除服务区", [
                                                () => {
                                                    this.removeStudent(area.id);
                                                    this.closeNotice();
                                                }, () => {
                                                    this.closeNotice();
                                                }]);
                                        }}>
                                        {Lang[window.Lang].pages.com.card.remove}
                                    </Button>
                                </CardActions>
                            </div>
                        </Card>
                    )}
                </List>
            </div>




            {this.newAreaDialog()}
            <CommonAlert
                show={this.state.alertOpen}
                type={this.state.alertType}
                code={this.state.alertCode}
                content={this.state.alertContent}
                action={this.state.alertAction}
            >
            </CommonAlert>
        </div>
    }
}

export default Area;