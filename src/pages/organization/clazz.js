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

class Clazz extends Component {
    state = {
        clazzes: [],
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

    newClazz = () => {

    }

    modifyClazz = () => {

    }

    deleteClazz = () => {

    }

    freshStudents = () => {

    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    render() {
        return <div>
            <div style={{ margin: 10, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.company.students.list_title}</ListSubheader>}>
                    {this.state.clazzes.map(clazz =>
                        <Card style={{ display: 'flex', }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    <Typography type="body1">
                                        {clazz.id}
                                    </Typography>
                                    <Typography type="body1" component="h2">
                                        {clazz.name}
                                    </Typography>
                                    <Typography type="body1">
                                        {clazz.area}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.master}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.tiid}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.teacher}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.address}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.start}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.end}
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
export default Clazz;