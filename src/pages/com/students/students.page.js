import React, { Component } from 'react';
// import PropTypes from 'proptypes';
// import { withStyles, createStyleSheet } from 'materialui/styles';

import Paper from 'material-ui/Paper';
// import GridList from 'materialui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';


import StudentCard from '../studentCard';

import Lang from '../../../language';
import Code from '../../../code';
import { initCache, getData, getRouter, getCache, getTimeString } from '../../../utils/helpers';
import { ALERT, NOTICE, STUDENT_INFOS, INSERT_STUDENT, REMOVE_STUDENT, BASE_INFO, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO } from '../../../enum';

import CommonAlert from '../../../components/CommonAlert';

const Style = {
    paper: { paddingTop: 80, paddingLeft: 40, display: 'flex', FlexDirection: 'row', justifyContent: 'spacebetween' }

}


class Students extends Component {

    state = {
        students: [],
        selected: {},
        showInfo: false,
        openNewStudentDialog: false,

        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: []
    }

    componentDidMount() {
        // this.getStudents();
        window.currentPage = this;
        this.fresh()
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    cacheToState() {
        let students = getCache(DATA_TYPE_STUDENT);
        students = students === undefined ? [] : students;
        window.currentPage.setState({ students: students })
    }

    getStudents() {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({ students: message.student })
            }
            console.log(message)
        }
        getData(getRouter(STUDENT_INFOS), { session: sessionStorage.session }, cb, {});
    }

    newStudent(student) {
        var cb = (route, message, arg) => {
            if (message.code === Code.INSERT_SUCCESS) {
                this.state.students.push(student)
                console.log("123")
                this.setState({
                    students: this.state.students
                })
            }
        }
        getData(getRouter(INSERT_STUDENT), { session: sessionStorage.session, student: student }, cb, { student: student });
    }

    removeStudent(id) {
        var cb = (route, message, arg) => {
            if (message.code === Code.REMOVE_SUCCESS) {
                for (var i = 0; i < this.state.students.length; i++) {
                    if (this.state.students[i].id === arg.id) {
                        this.state.students.splice(i, 1);
                        this.setState({
                            students: this.state.students
                        })
                        break;
                    }
                }
            }
            this.popUpNotice(NOTICE, message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        getData(getRouter(REMOVE_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    updateStudent(id, key, info) {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < getCache(student).length; i++) {
                    if (getCache(DATA_TYPE_STUDENT)[i].id === arg.id) {
                        getCache(DATA_TYPE_STUDENT)[i][arg.key] = info;
                        break;
                    }
                }
            }
        }

        switch (key) {
            case BASE_INFO:
                getData(getRouter(BASE_INFO), { session: sessionStorage.session, id: id, info: info }, cb, { id: id, info: info, key: key });
                break;
            case SELF_INFO:
                getData(getRouter(SELF_INFO), { session: sessionStorage.session, id: id, info: info }, cb, { id: id, info: info, key: key });
                break;
            case ADDEXP:
                getData(getRouter(ADDEXP), { session: sessionStorage.session, id: id, info: info }, cb, { id: id, info: info, key: key });
                break;
            case DELEXP:
                getData(getRouter(DELEXP), { session: sessionStorage.session, id: id, info: info }, cb, { id: id, info: info, key: key });
                break;
        }
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

    handleRequestClose = () => {
        this.setState({
            openNewStudentDialog: false
        })
    }

    newStudentDialog() {
        var student = {
            "id": 12,
            "base_info": {
                "name": "",
                "tel": "",
                "email": "",
                "city": 0,
                "level": 0,
            },
            "personal_info": {
                "licence": {
                    type: 0,
                    id: ""
                },
                "edu": "",
                "working_time": "",
                "total_amount": "",
                "soft_amount": ""
            },
            "proj_exp": [
                {
                    "id": 1,
                    "name": "",
                    "time": 0,
                    "actor": "",
                    "total_amount": "",
                    "soft_amount": ""
                },

            ],
            // 状态 0 未进行 1 进行中 2 进行结束
            "status": {
                "enrolled": {
                    "status": 0,
                    "time": 1500262255
                },
                "arranged": {
                    "status": 2,
                    "time": 1500262255
                },
                "agreed": {
                    "status": 0,
                    "time": 1500262255
                },
                "examing": {
                    "status": 1,
                    "time": 1500262255
                },
                "passed": {
                    "status": 1,
                    "score": 96,
                    "time": 1500262255
                },
                "retry": {
                    "status": 1,
                    "time": 1500262255
                }
            }
        }
        return (
            <Dialog open={this.state.openNewStudentDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    新增学员
            </DialogTitle>
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.com.students.base_info}
                        </Typography>
                        <TextField
                            id="student_name"
                            label={Lang[window.Lang].pages.com.students.name}
                            defaultValue={student.base_info.name}
                            fullWidth
                        />
                        <TextField
                            id="tel"
                            label={Lang[window.Lang].pages.com.students.tel}
                            defaultValue={student.base_info.tel}
                            fullWidth
                        />
                        <TextField
                            id="email"
                            label={Lang[window.Lang].pages.com.students.email}
                            defaultValue={student.base_info.email}
                            fullWidth
                        />
                        <TextField
                            id="city"
                            label={Lang[window.Lang].pages.com.students.city}
                            defaultValue={student.base_info.city.toString()}
                            fullWidth
                        />
                        <TextField
                            id="level"
                            label={Lang[window.Lang].pages.com.students.level.title}
                            defaultValue={student.base_info.level.toString()}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                var base_info = {
                                    name: document.getElementById("student_name").value === "" ? "未命名" + new Date().getTime() : document.getElementById("student_name").value,
                                    tel: document.getElementById("tel").value,
                                    email: document.getElementById("email").value,
                                    city: document.getElementById("city").value,
                                    level: document.getElementById("level").value,
                                }
                                this.newStudent({ base_info: base_info })
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

    closeNotice = () => {
        this.setState({
            alertOpen: false,
        })
    }

    render() {
        return (
            <div>
                <div
                    style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}
                >
                    <div style={{ margin: 10, width: 400, float: "left" }}>
                        {this.newStudentDialog()}
                        <List subheader={
                            <ListSubheader>
                                <Button
                                    color="primary"
                                    style={{ margin: 10 }}
                                    onClick={() => {

                                        {/* this.newStudent(student); */ }
                                        {/* this.newStudentDialog(); */ }
                                        this.setState({
                                            openNewStudentDialog: true
                                        })
                                        {/* this.state.selected = student;
                                        this.setState({
                                            showInfo: true
                                        }) */}
                                    }}>
                                    {Lang[window.Lang].pages.com.students.new_student}
                                </Button>
                            </ListSubheader>}>
                           
                            {this.state.students.map(student =>
                                <StudentCard
                                    type={CARD_TYPE_INFO}
                                    key={student.id}
                                    name={student.base_info.name}
                                    tel={student.base_info.tel}
                                    email={student.base_info.email}
                                    level={Number(student.base_info.level)}
                                    city={Number(student.base_info.city)}
                                    action={[() => {
                                        this.state.selected = student;
                                        console.log(student);
                                        this.setState({
                                            showInfo: true
                                        })
                                    }, () => {
                                        this.state.selected = student;
                                        this.popUpNotice(ALERT, 0, "删除学生" + student.base_info.name, [
                                            () => {
                                                this.removeStudent(student.id);
                                                this.closeNotice();
                                            }, () => {
                                                this.closeNotice();
                                            }]);
                                    }]}
                                >
                                </StudentCard>
                            )}
                        </List>
                    </div>
                    {this.state.showInfo === true ?
                        <Paper style={{ margin: 10, width: 800, float: "left" }} elevation={4}>
                            <div>
                                <Typography type="headline" component="h3">
                                    {Lang[window.Lang].pages.com.students.base_info}
                                </Typography>
                                <TextField
                                    id="student_name"
                                    label={Lang[window.Lang].pages.com.students.name}
                                    defaultValue={this.state.selected.base_info.name}
                                    fullWidth
                                />
                                <TextField
                                    id="tel"
                                    label={Lang[window.Lang].pages.com.students.tel}
                                    defaultValue={this.state.selected.base_info.tel}
                                    fullWidth
                                />
                                <TextField
                                    id="email"
                                    label={Lang[window.Lang].pages.com.students.email}
                                    defaultValue={this.state.selected.base_info.email}
                                    fullWidth
                                />
                                <TextField
                                    id="city"
                                    label={Lang[window.Lang].pages.com.students.city}
                                    defaultValue={this.state.selected.base_info.city.toString()}
                                    fullWidth
                                />
                                <TextField
                                    id="level"
                                    label={Lang[window.Lang].pages.com.students.level.title}
                                    defaultValue={this.state.selected.base_info.level.toString()}
                                    fullWidth
                                />

                                <Button color="primary" style={{ margin: 10 }}>
                                    {Lang[window.Lang].pages.main.certain_button}
                                </Button>
                            </div>
                            <div>
                                <Typography type="headline" component="h3">
                                    {Lang[window.Lang].pages.com.students.personal_info.title}
                                </Typography>
                                {/* <Selection
                                    id="licence.type"
                                    label={Lang[window.Lang].pages.com.students.personal_info.licence_type}
                                    defaultValue={this.state.selected.personal_info.licence.type}
                                    fullWidth>
                                </Selection> */}
                                <TextField
                                    id="licence.code"
                                    label={Lang[window.Lang].pages.com.students.personal_info.licence_code[1]}
                                    defaultValue={this.state.selected.personal_info.licence.code}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="edu"
                                    label={Lang[window.Lang].pages.com.students.personal_info.edu}
                                    defaultValue={this.state.selected.personal_info.edu}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="working_time"
                                    label={Lang[window.Lang].pages.com.students.personal_info.working_time}
                                    defaultValue={this.state.selected.personal_info.working_time}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="total_amount"
                                    label={Lang[window.Lang].pages.com.students.personal_info.total_amount}
                                    defaultValue={this.state.selected.personal_info.total_amount}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="soft_amount"
                                    label={Lang[window.Lang].pages.com.students.personal_info.soft_amount}
                                    defaultValue={this.state.selected.personal_info.soft_amount}
                                    fullWidth>
                                </TextField>
                                <Button color="primary" style={{ margin: 10 }}>
                                    {Lang[window.Lang].pages.main.certain_button}
                                </Button>
                            </div>
                            <div>
                                <Typography type="headline" component="h3">
                                    {Lang[window.Lang].pages.com.students.proj_exp.title}
                                </Typography>
                                {
                                    this.state.selected.proj_exp.map(exp =>
                                        <div id={exp.id}>
                                            <Typography type="body1" component="p">
                                                {exp.name}
                                            </Typography>
                                            <Typography type="body1" component="p">
                                                {getTimeString(exp.time)}
                                            </Typography>
                                            <Typography type="body1" component="p">
                                                {exp.actor}
                                            </Typography>
                                            <Typography type="body1" component="p">
                                                {exp.total_amount}
                                            </Typography>
                                            <Typography type="body1" component="p">
                                                {exp.soft_amount}
                                            </Typography>
                                            <Button color="primary" style={{ margin: 10 }}>
                                                {Lang[window.Lang].pages.main.certain_button}
                                            </Button>
                                        </div>)
                                }
                                <div>
                                    <TextField
                                        id="proj_name"
                                        label={Lang[window.Lang].pages.com.students.proj_exp.name}
                                        defaultValue={this.state.selected.proj_exp.name}>
                                    </TextField>
                                    <TextField
                                        id="time"
                                        label={Lang[window.Lang].pages.com.students.proj_exp.time}
                                        defaultValue={this.state.selected.proj_exp.time}>
                                    </TextField>
                                    <TextField
                                        id="actor"
                                        label={Lang[window.Lang].pages.com.students.proj_exp.actor}
                                        defaultValue={this.state.selected.proj_exp.actor}>
                                    </TextField>
                                    <TextField
                                        id="exp_total_amount"
                                        label={Lang[window.Lang].pages.com.students.proj_exp.total_amount}
                                        defaultValue={this.state.selected.proj_exp.total_amount}>
                                    </TextField>
                                    <TextField
                                        id="exp_soft_amount"
                                        label={Lang[window.Lang].pages.com.students.proj_exp.soft_amount}
                                        defaultValue={this.state.selected.proj_exp.soft_amount}>
                                    </TextField>
                                </div>
                                <Button color="primary" style={{ margin: 10 }}>
                                    {Lang[window.Lang].pages.main.certain_button}
                                </Button>
                            </div>
                        </Paper> : <div />}

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
        )
    }
}

export default Students; 