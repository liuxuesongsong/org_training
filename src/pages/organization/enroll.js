import React, { Component } from 'react';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Code from '../../code';
import Lang from '../../language';

import CommonAlert from '../../components/CommonAlert';

class Enroll extends Component {
    state = {
        areas: [],
        students: [],
        // 提示状态
        alertOpen: true,
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

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }


    render() {
        return <div>
            <div style={{ margin: 10, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.company.students.list_title}</ListSubheader>}>
                    {this.state.areas.map(area =>
                        <Card style={{ display: 'flex', }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    <Typography type="body1">
                                        {area.name}
                                    </Typography>
                                    <Typography type="body1">
                                        {area.arrange + "/" + area.enroll}
                                    </Typography>
                                    <Typography component="p">
                                        {area.clazzes}
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
            <div style={{ margin: 10, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.company.students.list_title}</ListSubheader>}>
                    {this.state.students.map(student =>
                        <Card style={{ display: 'flex', }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    <Typography type="body1">
                                    </Typography>
                                    <Typography type="body1" component="h2">
                                    </Typography>
                                    <Typography type="body1">
                                    </Typography>
                                    <Typography component="p">
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

export default Enroll;