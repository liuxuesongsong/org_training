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
import Button from 'material-ui/Button';
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
    STATUS_ENROLLED_UNDO,STATUS_FK_UNDO, STATUS_ARRANGED_UNDO, STATUS_AGREED_AGREE, STATUS_ENROLLED_DID, STATUS_ARRANGED, STATUS_AGREED,
    CARD_TYPE_ENROLL,CARD_TYPE_FK, CARD_TYPE_ARRANGE, CARD_TYPE_UNARRANGE, STATUS_ARRANGED_DID, ALERT, STATUS_AGREED_KNOW, STATUS_AGREED_REFUSED, NOTICE,CARD_TYPE_KNOW
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
        city: "0",
        fkenrolled_height:1,
        unarranged_height: 1,
        arranged_height: 1,
        unenrolled_height: 1,
        students: [],
        areas: [],
        fkStudents: [],
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
        window.currentPage.state.areas = getCache("areas");
        window.currentPage.state.students = students === undefined ? [] : students;
        window.currentPage.updateStudents();
    }

    updateStudents = () => {
        let fkStudents = [], newStudents = [], unarragedStudents = [], arrangedStudents = [];
        for (var i = 0; i < this.state.students.length; i++) {
            if (this.state.students[i].is_inlist == STATUS_FK_UNDO) {
                fkStudents.push(this.state.students[i]);
            }
            if (this.state.students[i].is_inlist == STATUS_ENROLLED_UNDO) {
                newStudents.push(this.state.students[i]);
            }
            if (this.state.students[i].is_inlist == STATUS_ENROLLED_DID) {
                unarragedStudents.push(this.state.students[i]);
            }
            if (this.state.students[i].is_inlist == STATUS_ARRANGED_DID || this.state.students[i].is_inlist == 3 ) {
                arrangedStudents.push(this.state.students[i]);
            }
        }
        this.setState({
            fkStudents: fkStudents,
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
            this.popUpNotice(NOTICE, 0, message.msg);
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
                this.popUpNotice(NOTICE, 0, message.msg);
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
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(INSERT_STUDENT), { session: sessionStorage.session, student: student }, cb, { student: student });
    }

    newStudentList() {
        var components = [];
        var newStudentInput = Lang[window.Lang].pages.com.students.input;
        for (var p in newStudentInput) {
            components.push(<TextField
                className="nyx-form-div"
                key={p}
                id={"new_" + p}
                label={newStudentInput[p]}
                defaultValue={""}
            />)
        }
        return components
    }

    newStudentCity() {
        var components = [];
        var newStudentAreas = window.CacheData.areas;
        for (var p in newStudentAreas) {
            components.push(
                <option value={p} key={p}>{newStudentAreas[p]}</option>
            )
        }
        return components
    }

    newStudentInst() {
        var components = [];
        var newStudentInsts = window.CacheData.insts;
        for (var p in newStudentInsts) {
            components.push(

                <option value={p} key={p}>{newStudentInsts[p]}</option>
            )
        }
        return components
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
            this.popUpNotice(NOTICE, 0, message.msg);
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
            this.popUpNotice(NOTICE, 0, message.msg);
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
            this.popUpNotice(NOTICE, 0, message.msg);
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
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(REFUSE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    selectedStudent(student) {
        this.state.selectedStudentId = student.id;
        this.state.selected = student;
        this.state.course = student.course_id;
    }

    newStudentDialog() {
        return (
            <Dialog open={this.state.openNewStudentDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    添加学员
                </DialogTitle>
                <DialogContent>
                    <div className="nyx-form">
                        {this.newStudentList()}
                        <div>
                            <p
                                className="nyx-info-select-label"
                            >培训城市</p>
                            <p
                                className="nyx-info-select-label"
                            >中项或高项</p>
                        </div>
                        <select
                            className="nyx-info-select"
                            id="new_area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            {this.newStudentCity()}
                        </select>

                        <select
                            className="nyx-info-select"
                            id="new_course_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            <option value={1}>{"项目经理"}</option>
                            <option value={2}>{"高级项目经理"}</option>
                        </select>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                this.newStudent({


                                    name: document.getElementById("new_name").value === "" ? "未命名" + new Date().getTime() : document.getElementById("new_name").value,
                                    department: document.getElementById("new_department").value,
                                    duty: document.getElementById("new_duty").value,
                                    mobile: document.getElementById("new_mobile").value,
                                    mail: document.getElementById("new_mail").value,
                                    wechat: document.getElementById("new_wechat").value,
                                    id_type: document.getElementById("new_id_type").value,
                                    identity_card: document.getElementById("new_identity_card").value,
                                    register: document.getElementById("new_register").value,
                                    area_id: document.getElementById("new_area_id").value,
                                    course_id: document.getElementById("new_course_id").value
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
    handleChangeCity = (event, value) => {
        this.setState({ course: value });
    };

    render() {
        return (
            <div className={'nyx-page'}>
                <div className={'nyx-tips'}><p>{"【已临时登记的项目经理】"+
                        "第一步：请在下表中点击【修改】补充完整人员信息。"+
                        "第二步：点击【报名】进行培训报名"}</p></div>
                <Paper className={'nyx-paper nyx-enroller-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{ marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
                            {"已临时登记的报名人员信息及管理"} <i
                                onClick={() => {
                                    if (this.state.fkenrolled_height == 0) {
                                        this.setState({ fkenrolled_height: 1 })
                                    } else {
                                        this.setState({ fkenrolled_height: 0 })
                                    }
                                }}

                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>

                        </div>
                        <div className={this.state.fkenrolled_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
                            {this.state.fkStudents.map(student =>
                                <StudentCard
                                    type={CARD_TYPE_FK}
                                    key={student.id}
                                    name={student.name === null ? "" : student.name.toString()}
                                    mobile={student.mobile === null ? "" : student.mobile.toString()}
                                    email={student.mail === null ? "" : student.mail.toString()}
                                    level={Number(student.course_id)}
                                    city={Number(student.area_id)}
                                    institution={student.institution === null ? "" : Number(student.institution)}
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
                        </div>
                    </List>
                </Paper>
                <div className={'nyx-tips'}>
                        {"【未临时登记的项目经理】"+
                        "第一步：请在下表中点击【添加】新增人员，输入完整信息。"+
                        "第二步：点击【报名】进行报名"
                        }</div>
                <Paper className={'nyx-paper nyx-enroller-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{ marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
                            {Lang[window.Lang].pages.com.enrolled.unenrolled} <i
                                onClick={() => {
                                    if (this.state.unenrolled_height == 0) {
                                        this.setState({ unenrolled_height: 1 })
                                    } else {
                                        this.setState({ unenrolled_height: 0 })
                                    }
                                }}

                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
                            <Button style={{ position: "absolute", right: "28px",top:"0" }} fab color="primary" aria-label="add" className={'nyx-paper-header-btn'}
                                onClick={() => {
                                    this.setState({
                                        openNewStudentDialog: true,
                                        course: "1",
                                    })
                                }}
                            >
                                {"添加"}
                            </Button>
                        </div>
                        <div className={this.state.unenrolled_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
                            {this.state.newStudents.map(student =>
                                <StudentCard
                                    type={CARD_TYPE_ENROLL}
                                    key={student.id}
                                    name={student.name === null ? "" : student.name.toString()}
                                    mobile={student.mobile === null ? "" : student.mobile.toString()}
                                    email={student.mail === null ? "" : student.mail.toString()}
                                    level={Number(student.course_id)}
                                    city={Number(student.area_id)}
                                        institution={student.institution === null ? "" : Number(student.institution)}
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
                        </div>
                    </List>
                </Paper>
                <Paper style={{ padding: 0 }} className={'nyx-paper nyx-enroller-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{ marginBottom: "1rem" }} className="nyx-head-name">
                            {Lang[window.Lang].pages.com.enrolled.unarrange} <i
                                onClick={() => {
                                    if (this.state.unarranged_height == 0) {
                                        this.setState({ unarranged_height: 1 })
                                    } else {
                                        this.setState({ unarranged_height: 0 })
                                    }
                                }}

                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
                        </div>
                        <div className={this.state.unarranged_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
                            {this.state.unarragedStudents.map(student =>
                                <StudentCard
                                    type={CARD_TYPE_UNARRANGE}
                                    key={student.id}
                                    name={student.name === null ? "" : student.name.toString()}
                                    mobile={student.mobile === null ? "" : student.mobile.toString()}
                                    email={student.mail === null ? "" : student.mail.toString()}
                                    level={Number(student.course_id)}
                                    city={Number(student.area_id)}
                                        institution={student.institution === null ? "" : Number(student.institution)}
                                    action={[() => {
                                        this.state.selectedStudentId = student.id;
                                        this.popUpNotice(ALERT, 0, "取消" + student.name + "报名", [
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
                        </div>
                    </List>
                </Paper>
                <Paper style={{ padding: 0 }} className={'nyx-paper nyx-enroller-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{ marginBottom: "1rem" }} className="nyx-head-name">
                            {Lang[window.Lang].pages.com.enrolled.arranged} <i
                                onClick={() => {
                                    if (this.state.arranged_height == 0) {
                                        this.setState({ arranged_height: 1 })
                                    } else {
                                        this.setState({ arranged_height: 0 })
                                    }
                                }}

                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
                        </div>
                        <div className={this.state.arranged_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
                            {this.state.arrangedStudents.map(student =>{

                            switch (student.is_inlist) {
                                case 2:
                                    return (
                                        <StudentCard
                                        type={CARD_TYPE_ARRANGE}
                                        key={student.id}
                                        name={student.name === null ? "" : student.name.toString()}
                                        mobile={student.mobile === null ? "" : student.mobile.toString()}
                                        email={student.mail === null ? "" : student.mail.toString()}
                                        level={Number(student.course_id)} 
                                        city={Number(student.area_id)}
                                        institution={student.institution === null ? "" : Number(student.institution)}
                                        action={[
                                            () => {
                                                this.state.selectedStudentId = student.id;
                                                this.popUpNotice(ALERT, 0, "请等待培训机构告知具体培训时间和地点", [
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
                                    </StudentCard>)
                                case 3:
                                {
                                     return (
                                        <StudentCard
                                        type={CARD_TYPE_KNOW}
                                        key={student.id}
                                        name={student.name === null ? "" : student.name.toString()}
                                        mobile={student.mobile === null ? "" : student.mobile.toString()}
                                        email={student.mail === null ? "" : student.mail.toString()}
                                        level={Number(student.course_id)}
                                        city={Number(student.area_id)}
                                        institution={student.institution === null ? "" : Number(student.institution)}
                                        action={[
                                            () => {
                                                this.state.selectedStudentId = student.id;
                                                this.popUpNotice(ALERT, 0, "请通知 " + student.name + " 参加培训", [
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
                                    </StudentCard>)
                                }
                            }
                                })
                            }
                        </div>
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
                        <Paper style={{ margin: 10, width: 800, float: "left", boxShadow: "none", fontSize: "12px" }} elevation={4}>
                            <Typography type="headline" component="h3">
                                {Lang[window.Lang].pages.com.students.base_info}
                            </Typography>
                            <TextField
                                id="student_name"
                                label={Lang[window.Lang].pages.com.students.name}
                                defaultValue={this.state.selected.name ? this.state.selected.name : ""}
                                fullWidth
                            />
                            <TextField
                                id="licence.code"
                                label={Lang[window.Lang].pages.com.students.personal_info.licence_code[1]}
                                defaultValue={this.state.selected.identity_card ? this.state.selected.identity_card : ""}
                                fullWidth>
                            </TextField>
                            <FormControl required>
                                <FormLabel>{"等级"}</FormLabel>
                                <RadioGroup
                                    style={{ display: "block" }}
                                    aria-label="gender"
                                    name="gender"
                                    selectedValue={this.state.course}
                                    onChange={(e, value) => {
                                        this.handleChangeCourse(e, value)
                                    }}
                                >
                                    <LabelRadio value={"1"} label="项目经理" />
                                    <LabelRadio value={"2"} label="高级项目经理" />
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                id="register"
                                label={Lang[window.Lang].pages.com.students.register}
                                defaultValue={this.state.selected.register ? this.state.selected.register : ""}
                                fullWidth>
                            </TextField>

                            <Typography type="headline" component="h3">
                                {Lang[window.Lang].pages.com.students.personal_info.title}
                            </Typography>
                            <TextField
                                id="department"
                                label={Lang[window.Lang].pages.com.students.personal_info.department}
                                defaultValue={this.state.selected.department ? this.state.selected.department : ""}
                                fullWidth>
                            </TextField>
                            <TextField
                                id="duty"
                                label={Lang[window.Lang].pages.com.students.personal_info.duty}
                                defaultValue={this.state.selected.duty ? this.state.selected.duty : ""}
                                fullWidth>
                            </TextField>
                            <TextField
                                id="mobile"
                                label={Lang[window.Lang].pages.com.students.tel}
                                defaultValue={this.state.selected.mobile ? this.state.selected.mobile : ""}
                                fullWidth
                            />
                            <TextField
                                id="mail"
                                label={Lang[window.Lang].pages.com.students.email}
                                defaultValue={this.state.selected.mail ? this.state.selected.mail : ""}
                                fullWidth
                            />
                            <TextField
                                id="wechat"
                                label={Lang[window.Lang].pages.com.students.personal_info.wechat}
                                defaultValue={this.state.selected.wechat ? this.state.selected.wechat : ""}
                                fullWidth
                            />
                            <Button
                                color="primary"
                                style={{ margin: 10, float: "right" }}
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