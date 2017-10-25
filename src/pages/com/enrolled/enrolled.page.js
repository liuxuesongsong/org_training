import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { LabelRadio, RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';

import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/ArrowBack';

import StudentCard from '../studentCard.js';

import { initCache, getData, getRouter, getStudent, getCache } from '../../../utils/helpers';
import {
    UNROLL_STUDENT, REMOVE_STUDENT, UPDATE_STUDENT, INSERT_STUDENT, QUERY, ENROLL_STUDENT, EXIT_CLASS, STATUS_ENROLLED, AGREE_ARRANGE, REFUSE_ARRANGE, DATA_TYPE_STUDENT, STATUS_ARRANGED_DOING,
    STATUS_ENROLLED_UNDO, STATUS_ARRANGED_UNDO, STATUS_AGREED_AGREE, STATUS_ENROLLED_DID, STATUS_ARRANGED, STATUS_AGREED,
    CARD_TYPE_ENROLL, CARD_TYPE_ARRANGE, CARD_TYPE_UNARRANGE, STATUS_ARRANGED_DID, ALERT, STATUS_AGREED_REFUSED, NOTICE
} from '../../../enum';
import Lang from '../../../language';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

const Style = {
    paper: { margin: 10, width: 400, float: "left" }
}

class Enrolled extends Component {
    state = {
        course: "0",
        students: [],
        newStudents: [],
        unarragedStudents: [],
        arrangedStudents: [],
        // 界面状态
        selectedStudentId: undefined,
        selected: {},
        showInfo: false,
        right: false,
        // 提示状态
        alertOpen: false,
        alertType: ALERT,
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: [],
        openNewStudentDialog: false
    };


    componentWillMount() {
        window.currentPage = this;
        this.fresh()
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    cacheToState() {
        // 设置界面
        var students = getCache(DATA_TYPE_STUDENT);
        window.currentPage.state.students = students === undefined ? [] : students;
        window.currentPage.updateStudents();
    }

    updateStudents = () => {
        let newStudents = [], unarragedStudents = [], arrangedStudents = [];
        for (var i = 0; i < this.state.students.length; i++) {

            if (this.state.students[i].is_inlist == STATUS_ENROLLED_UNDO) {
                newStudents.push(this.state.students[i]);
            }
            if (this.state.students[i].is_inlist == STATUS_ENROLLED_DID) {
                unarragedStudents.push(this.state.students[i]);
            }
            if (this.state.students[i].is_inlist == STATUS_ARRANGED_DID) {
                arrangedStudents.push(this.state.students[i]);
            }
        }
        this.setState({
            newStudents: newStudents,
            unarragedStudents: unarragedStudents,
            arrangedStudents: arrangedStudents
        })
    }

    cancelEnroll(id) {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.fresh();
            }
            this.handleRequestClose()
        }
        getData(getRouter(UNROLL_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    // 将新加入的学生排队
    erollStudent(id) {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                let student = getStudent(arg.id);
                student.is_inlist = STATUS_ENROLLED_DID;
                this.updateStudents();
                // this.fresh();
            }
        }
        getData(getRouter(ENROLL_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    newStudent(student) {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                window.CacheData.students.push(Object.assign(arg.student, { id: message.id }));
                this.fresh();
            }
            this.handleRequestClose()
        }
        getData(getRouter(INSERT_STUDENT), { session: sessionStorage.session, student: student }, cb, { student: student });
    }

    removeStudent(id) {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < window.CacheData.students.length; i++) {
                    if (window.CacheData.students[i].id === arg.id) {
                        window.CacheData.students.splice(i, 1);
                        break;
                    }
                }
                this.fresh();
            }
            this.popUpNotice(NOTICE, message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        getData(getRouter(REMOVE_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    modifyStudent = () => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    right: false,
                });
                arg.self.fresh();
            }
        }
        var id = this.state.selected.id;
        var obj = {
            name: document.getElementById("student_name").value,
            identity_card: document.getElementById("licence.code").value,
            course_id: Number(this.state.course),
            register: document.getElementById("register").value,
            department: document.getElementById("department").value,
            duty: document.getElementById("duty").value,
            mobile: document.getElementById("mobile").value,
            mail: document.getElementById("mail").value,
            wechat: document.getElementById("wechat").value,
        }
        getData(getRouter(UPDATE_STUDENT), { session: sessionStorage.session, id: this.state.selectedStudentId, student: obj }, cb, { self: window.currentPage, data: obj });
    }

    agreeArrange() {
        var id = this.state.selectedStudentId;
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                getStudent(arg.id).is_inlist = STATUS_ARRANGED_DID;
                this.fresh();
            }
        }
        getData(getRouter(AGREE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    refuseArrange() {
        var id = this.state.selectedStudentId;
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                let student = getStudent(arg.id);
                student.status[STATUS_AGREED].status = STATUS_AGREED_REFUSED;
                student.status[STATUS_ARRANGED].status = STATUS_ARRANGED_UNDO;
                this.fresh();
            }
        }
        getData(getRouter(REFUSE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    selectedStudent(student) {
        this.state.selectedStudentId = student.id;
        this.state.selected = student;
        this.state.course = student.course_id.toString();
    }

    newStudentDialog() {
        return (
            <Dialog open={this.state.openNewStudentDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    新增学员
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.com.students.title}
                        </Typography>
                        <TextField
                            id="new_name"
                            label={Lang[window.Lang].pages.com.students.name}
                            defaultValue={""}
                            fullWidth
                        />
                        <TextField
                            id="new_tel"
                            label={Lang[window.Lang].pages.com.students.tel}
                            defaultValue={""}
                            fullWidth
                        />
                        <TextField
                            id="new_mail"
                            label={Lang[window.Lang].pages.com.students.email}
                            defaultValue={""}
                            fullWidth
                        />
                        <FormControl required>
                            <FormLabel>{"等级"}</FormLabel>
                            <RadioGroup
                                aria-label="gender"
                                name="gender"
                                selectedValue={this.state.course}
                                onChange={(e, value) => {
                                    this.handleChangeCourse(e, value)
                                }}
                            >
                                <LabelRadio value={"1"} label="中级" />
                                <LabelRadio value={"2"} label="高级" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                this.newStudent({
                                    name: document.getElementById("new_name").value === "" ? "未命名" + new Date().getTime() : document.getElementById("new_name").value,
                                    mobile: document.getElementById("new_tel").value,
                                    mail: document.getElementById("new_mail").value,
                                    course_id: Number(this.state.course),
                                })
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

    handleRequestClose = () => {
        this.setState({
            openNewStudentDialog: false,
        })
    }

    closeNotice = () => {
        this.setState({
            alertOpen: false,
        })
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

    toggleDrawer = (open) => () => {
        this.setState({
            showInfo: open,
            right: open,
        });
    };


    handleChangeCourse = (event, value) => {
        this.setState({ course: value });
    };

    render() {
        return (
            <div className={'nyx-page'}>
                <Paper className={'nyx-paper nyx-list-paper'}>
                    <List subheader={<ListSubheader className={'nyx-paper-header'}>{Lang[window.Lang].pages.com.enrolled.unenrolled}
                        <Button fab color="primary" aria-label="add" className={'nyx-paper-header-btn'}
                            onClick={() => {
                                this.setState({
                                    openNewStudentDialog: true,
                                    course: "1",
                                })
                            }}
                        >
                            {"新增"}
                        </Button>
                    </ListSubheader>}>
                        {this.state.newStudents.map(student =>
                            <StudentCard
                                type={CARD_TYPE_ENROLL}
                                key={student.id}
                                name={student.name.toString()}
                                mobile={student.mobile === undefined ? "" : student.mobile.toString()}
                                email={student.mail.toString() === undefined ? "" : student.mail.toString()}
                                level={Number(student.course_id)}
                                city={Number(student.area_id)}
                                action={[() => {
                                    this.selectedStudent(student);
                                    this.toggleDrawer(true)()
                                }, () => {
                                    this.state.selectedStudentId = student.id;
                                    this.popUpNotice(ALERT, 0, "为" + student.name + "报名", [
                                        () => {
                                            this.erollStudent(student.id);
                                            this.closeNotice();
                                        }, () => {
                                            this.closeNotice();
                                        }]);
                                }, () => {
                                    this.state.selected = student;
                                    this.popUpNotice(ALERT, 0, "删除学生" + student.name, [
                                        () => {
                                            this.removeStudent(student.id);
                                            this.closeNotice();
                                        }, () => {
                                            this.closeNotice();
                                        }]);
                                }]}>
                            </StudentCard>
                        )}
                    </List>
                </Paper>
                <Paper className={'nyx-paper nyx-list-paper'}>
                    <List subheader={<ListSubheader className={'nyx-paper-header'}>{Lang[window.Lang].pages.com.enrolled.unarrange}</ListSubheader>}>
                        {this.state.unarragedStudents.map(student =>
                            <StudentCard
                                type={CARD_TYPE_UNARRANGE}
                                key={student.id}
                                name={student.name.toString()}
                                tel={student.mobile === undefined ? "" : student.mobile}
                                email={student.mail === undefined ? "" : student.mail}
                                level={Number(student.course_id)}
                                city={Number(student.area_id)}
                                action={[() => {
                                    this.state.selectedStudentId = student.id;
                                    this.popUpNotice(ALERT, 0, "通过" + student.name + "课程安排？", [
                                        () => {
                                            this.cancelEnroll(student.id);
                                            this.closeNotice();
                                        }, () => {
                                            this.closeNotice();
                                        }]);
                                }]}
                            >
                            </StudentCard>
                        )}
                    </List>
                </Paper>
                <Paper className={'nyx-paper nyx-list-paper'}>
                    <List subheader={<ListSubheader className={'nyx-paper-header'}>{Lang[window.Lang].pages.com.enrolled.arranged}</ListSubheader>}>
                        {this.state.arrangedStudents.map(student =>
                            <StudentCard
                                type={CARD_TYPE_ARRANGE}
                                key={student.id}
                                name={student.name.toString()}
                                tel={student.mobile === undefined ? "" : student.mobile}
                                email={student.mail === undefined ? "" : student.mail}
                                level={Number(student.course_id)}
                                city={Number(student.area_id)}
                                action={[
                                    () => {
                                        this.state.selectedStudentId = student.id;
                                        this.popUpNotice(ALERT, 0, "通过" + student.name + "课程安排？", [
                                            () => {
                                                this.agreeArrange();
                                                this.closeNotice();
                                            }, () => {
                                                this.closeNotice();
                                            }]);
                                    },
                                    () => {
                                        this.state.selectedStudentId = student.id;

                                        this.popUpNotice(ALERT, 0, "通过" + student.name + "课程安排？", [
                                            () => {
                                                this.refuseArrange();
                                                this.closeNotice();
                                            }, () => {
                                                this.closeNotice();
                                            }]);
                                    }]}>
                            </StudentCard>
                        )}
                    </List>
                </Paper>
                <Drawer
                    anchor="right"
                    open={this.state.right}
                    onRequestClose={this.toggleDrawer(false)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                    // onClick={this.toggleDrawer(false)}
                    // onKeyDown={this.toggleDrawer(false)}
                    >
                        <Paper style={{ margin: 10, width: 800, float: "left" }} elevation={4}>
                            <Typography type="headline" component="h3">
                                {Lang[window.Lang].pages.com.students.base_info}
                            </Typography>
                            <TextField
                                id="student_name"
                                label={Lang[window.Lang].pages.com.students.name}
                                defaultValue={this.state.selected.name ? this.state.selected.name.toString() : "未设置"}
                                fullWidth
                            />
                            <TextField
                                id="licence.code"
                                label={Lang[window.Lang].pages.com.students.personal_info.licence_code[1]}
                                defaultValue={this.state.selected.identity_card ? this.state.selected.identity_card.toString() : "未设置"}
                                fullWidth>
                            </TextField>
                            <FormControl required>
                                <FormLabel>{"等级"}</FormLabel>
                                <RadioGroup
                                    aria-label="gender"
                                    name="gender"
                                    selectedValue={this.state.course}
                                    onChange={(e, value) => {
                                        this.handleChangeCourse(e, value)
                                    }}
                                >
                                    <LabelRadio value={"1"} label="中级" />
                                    <LabelRadio value={"2"} label="高级" />
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                id="register"
                                label={Lang[window.Lang].pages.com.students.register}
                                defaultValue={this.state.selected.register ? this.state.selected.register.toString() : "未设置"}
                                fullWidth>
                            </TextField>

                            <Typography type="headline" component="h3">
                                {Lang[window.Lang].pages.com.students.personal_info.title}
                            </Typography>
                            <TextField
                                id="department"
                                label={Lang[window.Lang].pages.com.students.personal_info.department}
                                defaultValue={this.state.selected.department ? this.state.selected.department.toString() : "未设置"}
                                fullWidth>
                            </TextField>
                            <TextField
                                id="duty"
                                label={Lang[window.Lang].pages.com.students.personal_info.duty}
                                defaultValue={this.state.selected.duty ? this.state.selected.duty.toString() : "未设置"}
                                fullWidth>
                            </TextField>
                            <TextField
                                id="mobile"
                                label={Lang[window.Lang].pages.com.students.tel}
                                defaultValue={this.state.selected.mobile ? this.state.selected.mobile.toString() : "未设置"}
                                fullWidth
                            />
                            <TextField
                                id="mail"
                                label={Lang[window.Lang].pages.com.students.email}
                                defaultValue={this.state.selected.mail ? this.state.selected.mail.toString() : "未设置"}
                                fullWidth
                            />
                            <TextField
                                id="wechat"
                                label={Lang[window.Lang].pages.com.students.personal_info.wechat}
                                defaultValue={this.state.selected.wechat ? this.state.selected.wechat.toString() : "未设置"}
                                fullWidth
                            />


                            <Button
                                color="primary"
                                style={{ margin: 10 }}
                                onClick={(e) => {
                                    this.modifyStudent(e)
                                }}>
                                {Lang[window.Lang].pages.main.certain_button}
                            </Button>
                        </Paper>
                    </div>
                </Drawer>
                {this.newStudentDialog()}
                <CommonAlert
                    show={this.state.alertOpen}
                    type={this.state.alertType}
                    code={this.state.alertCode}
                    content={this.state.alertContent}
                    action={this.state.alertAction}>
                </CommonAlert>
            </div>
        )
    }
}

export default Enrolled;