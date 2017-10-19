import React, { Component } from 'react';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import { ALERT, NOTICE, NEW_AREA, DEL_AREA, QUERY_AREA, QUERY, } from '../../enum';

import Code from '../../code';
import Lang from '../../language';

import CommonAlert from '../../components/CommonAlert';

class Area extends Component {
    state = {
        areas: [],
        clazz: [],
        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "登录成功"
    }

    componentDidMount() {
        window.currentPage = this;
        this.fresh()
    }

    fresh = () => {
    }

    newArea = (area) => {
        var cb = (router, message, arg) => {
            console.log(message);
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.areas.push(arg.area);
            }
        }
        getData(getRouter(NEW_AREA), { session: sessionStorage.session, id: id }, cb, { area: area });

    }

    delArea = () => {
        var cb = (router, message, arg) => {
            console.log(message);
            if (message.code === Code.LOGIC_SUCCESS) {
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
        getData(getRouter(QUERY_AREA), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    queryArea = () => {
        var cb = (router, message, arg) => {
            console.log(message);
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.areas = message.area
            }
        }
        getData(getRouter(NEW_AREA), { session: sessionStorage.session, id: id }, cb, { id: id });

    }

    queryClazzInArea = () => {
        var cb = (router, message, arg) => {
            console.log(message);
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.areas = message.area
            }
        }
        getData(getRouter(), { session: sessionStorage.session, id: id }, cb, { id: id });

    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    render() {
        return <div>
            <div style={{ margin: 10, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.students.list_title}</ListSubheader>}>
                    {this.state.areas.map(area =>
                        <Card style={{ display: 'flex', }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    <Typography type="body1">
                                        省市
                                    </Typography>
                                    <Typography type="body1" component="h2">
                                        地区
                                    </Typography>
                                    <Typography type="body1">
                                    </Typography>
                                    <Typography component="p">
                                    </Typography>
                                </CardContent>
                            </div>
                            <div>
                                {this.buttonActions()}
                            </div>
                        </Card>
                    )}
                </List>
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
    }
}

export default Area;