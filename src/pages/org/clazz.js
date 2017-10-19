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

import { initCache, getData, getRouter, getCache, getStudent } from '../../utils/helpers';

import Code from '../../code';
import Lang from '../../language';
import { ALERT, NOTICE, STUDENT_INFOS, INSERT_STUDENT, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, NEW_CLASS, EDIT_CLASS, DELETE_CLASS, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO } from '../../enum';

import CommonAlert from '../../components/CommonAlert';

class Clazz extends Component {
    state = {
        clazzes: [],
        students: [],
        showInfo: false,
        openNewClazzDialog: false,
        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "登录成功"
    }

    componentDidMount() {
        window.currentPage = this;
        this.queryClazzes();
        // this.fresh()
    }

    fresh = () => {
    }

    queryClazzes = () => {
        var cb = (route, message, arg) => {
            if (message.code === 10027) {
                this.setState({ clazzes: message.clazz })
            }
            console.log(message)
        }
        getData(getRouter(CLASS_INFOS), { session: sessionStorage.session }, cb, {});
    }

    newClazzDialog = () => {
        return (
            <Dialog open={this.state.openNewClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    新增班级
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.org.clazz.new}
                        </Typography>
                        <TextField
                            id="area"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                            fullWidth
                        />
                        <TextField
                            id="class_name"
                            label={Lang[window.Lang].pages.org.clazz.info.class_name}
                            defaultValue={""}
                            fullWidth
                        />
                        <form noValidate>
                            <TextField
                                id="train_starttime"
                                label={Lang[window.Lang].pages.org.clazz.info.train_starttime}
                                type="date"
                                defaultValue="2017-05-24"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                this.newClazz({
                                    area: document.getElementById("area").value,
                                    class_name: document.getElementById("class_name").value,
                                    train_starttime: document.getElementById("train_starttime").value
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

    newClazz = (clazz) => {
        var cb = (route, message, arg) => {
            if (message.code === 10026) {
                this.state.clazzes.push(clazz)
                this.setState({ clazzes: this.state.clazzes })
            }
            console.log(message)
        }
        var obj = {
            session: sessionStorage.session,
            clazz: clazz

        }
        getData(getRouter(NEW_CLASS), obj, cb, {});
    }

    modifyClazz = (id, clazz) => {
        var cb = (route, message, arg) => {
            if (message.code === 10026) {
                this.setState({ clazzes: message.clazz })
            }
        }
        getData(getRouter(EDIT_CLASS), { session: sessionStorage.session, id: id, "class": clazz }, cb, {});

    }

    deleteClazz = (id) => {
        var cb = (route, message, arg) => {
            console.log(message)
            if (message.code === 10029) {
                for (var i = 0; i < this.state.clazzes.length; i++) {
                    if (this.state.clazzes[i].id === arg.id) {
                        this.state.clazzes.splice(i, 1);
                        this.setState({
                            clazzes: this.state.clazzes
                        })
                        break;
                    }
                }
                // this.setState({ clazzes: this.state.clazzes })
            }
        }
        getData(getRouter(DELETE_CLASS), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    handleRequestClose = () => {
        this.setState({
            openNewClazzDialog: false
        })
    }

    freshStudents = () => {

    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    render() {
        return <div>
            <div style={{ margin: 10, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.students.list_title}</ListSubheader>}>
                    <ListSubheader>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.setState({
                                    openNewClazzDialog: true
                                });
                            }}
                            style={{ margin: 10 }}
                        >
                            {Lang[window.Lang].pages.org.clazz.new}
                        </Button>
                    </ListSubheader>
                    {this.state.clazzes.map(clazz =>
                        <Card
                            key={clazz.id}
                            style={{ display: 'flex', }}>
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
                                        {clazz.train_starttime}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.class_head}
                                    </Typography>
                                    <Typography type="body1">
                                        {clazz.ti_name}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.address}
                                    </Typography>
                                    <Typography component="p">
                                        {clazz.time}
                                    </Typography>
                                </CardContent>
                            </div>
                            <div>
                                <CardActions>
                                    <Button
                                        dense
                                        onClick={() => {
                                            this.state.selected = clazz;
                                            this.setState({
                                                showInfo: true
                                            })
                                        }}>
                                        {Lang[window.Lang].pages.com.card.modify}
                                    </Button>
                                    <Button
                                        dense
                                        onClick={() => {
                                            this.state.selected = clazz;
                                            this.deleteClazz(clazz.id);
                                            return
                                            this.popUpNotice(ALERT, 0, "删除该班级", [
                                                () => {
                                                    this.removeStudent(clazz.id);
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
            <div style={{ margin: 10, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.students.list_title}</ListSubheader>}>
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
            {this.newClazzDialog()}
            <CommonAlert
                show={this.state.alertOpen}
                type={this.state.alertType}
                code={this.state.alertCode}
                content={this.state.alertContent}
                action={this.state.alertAction}
            >
            </CommonAlert>
        </div >
    }

}
export default Clazz;