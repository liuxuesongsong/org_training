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

import StudentCard from '../studentCard.js';

import { initCache, getData, getRouter, getStudent, getCache } from '../../../utils/helpers';
import {
    QUERY, ENROLL_STUDENT, STATUS_ENROLLED, AGREE_ARRANGE, REFUSE_ARRANGE, DATA_TYPE_STUDENT, STATUS_ARRANGED_DOING,
    STATUS_ENROLLED_UNDO, STATUS_ARRANGED_UNDO, STATUS_AGREED_AGREE, STATUS_ENROLLED_DID, STATUS_ARRANGED, STATUS_AGREED,
    CARD_TYPE_ENROLL, CARD_TYPE_ARRANGE, CARD_TYPE_UNARRANGE, STATUS_ARRANGED_DID, ALERT, STATUS_AGREED_REFUSED
} from '../../../enum';
import Lang from '../../../language';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

const Style = {
    paper: { margin: 10, width: 400, float: "left" }
}

class Enrolled extends Component {
    state = {
        newStudents: [],
        unarragedStudents: [],
        arrangedStudents: [],
        // 界面状态
        selectedStudentId: undefined,
        // 提示状态
        alertOpen: false,
        alertType: ALERT,
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: []
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
        let students = getCache(DATA_TYPE_STUDENT);
        let newStudents = [], unarragedStudents = [], arrangedStudents = [];
        for (var i = 0; i < students.length; i++) {
            if (students[i].status[STATUS_ENROLLED].status === STATUS_ENROLLED_UNDO) {
                newStudents.push(students[i]);
            }
            if (students[i].status[STATUS_ENROLLED].status === STATUS_ENROLLED_DID && students[i].status[STATUS_ARRANGED].status === STATUS_ARRANGED_UNDO) {
                unarragedStudents.push(students[i]);
            }
            if (students[i].status[STATUS_AGREED].status === STATUS_ARRANGED_DOING || students[i].status[STATUS_AGREED].status === STATUS_ARRANGED_DID) {
                arrangedStudents.push(students[i]);
            }
        }
        window.currentPage.setState({
            newStudents: newStudents,
            unarragedStudents: unarragedStudents,
            arrangedStudents: arrangedStudents
        })
    }

    // 将新加入的学生排队
    erollStudent() {
        var id = this.state.selectedStudentId;
        var cb = (router, message, arg) => {
            console.log(message);
            if (message.code === Code.LOGIC_SUCCESS) {
                let student = getStudent(arg.id);
                student.status[STATUS_ENROLLED].status = STATUS_ENROLLED_DID;
                student.status[STATUS_ARRANGED].status = STATUS_ARRANGED_UNDO;
                this.fresh();
            }
        }
        getData(getRouter(ENROLL_STUDENT), { session: sessionStorage.session, id: id }, cb, { id: id });
    }

    agreeArrange() {
        var id = this.state.selectedStudentId;
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                getStudent(arg.id).status[STATUS_AGREED].status = STATUS_AGREED_AGREE;
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

    render() {
        return (
            <div style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}>
                <Paper style={Style.paper}>
                    <List subheader={<ListSubheader>{Lang[window.Lang].pages.company.enrolled.unenrolled}</ListSubheader>}>
                        {this.state.newStudents.map(student =>
                            <StudentCard
                                type={CARD_TYPE_ENROLL}
                                key={student.id}
                                name={student.base_info.name}
                                tel={student.base_info.tel}
                                email={student.base_info.email}
                                level={student.base_info.level}
                                city={student.base_info.city}
                                action={[() => {
                                    this.state.selectedStudentId = student.id;
                                    this.popUpNotice(ALERT, 0, "为" + student.base_info.name + "报名", [
                                        () => {
                                            this.erollStudent();
                                            this.closeNotice();
                                        }, () => {
                                            this.closeNotice();
                                        }]);
                                }]}>
                            </StudentCard>
                        )}
                    </List>
                </Paper>
                <Paper style={Style.paper}>
                    <List subheader={<ListSubheader>{Lang[window.Lang].pages.company.enrolled.unarrange}</ListSubheader>}>
                        {this.state.unarragedStudents.map(student =>
                            <StudentCard
                                type={CARD_TYPE_UNARRANGE}
                                key={student.id}
                                name={student.base_info.name}
                                tel={student.base_info.tel}
                                email={student.base_info.email}
                                level={student.base_info.level}
                                city={student.base_info.city}
                                action={[() => {
                                    this.state.selectedStudentId = student.id;
                                    this.popUpNotice(ALERT, 0, "通过" + student.base_info.name + "课程安排？", [
                                        () => {
                                            this.enrolled();
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
                <Paper style={Style.paper}>
                    <List subheader={<ListSubheader>{Lang[window.Lang].pages.company.enrolled.arranged}</ListSubheader>}>
                        {this.state.arrangedStudents.map(student =>
                            <StudentCard
                                type={CARD_TYPE_ARRANGE}
                                key={student.id}
                                name={student.base_info.name}
                                tel={student.base_info.tel}
                                email={student.base_info.email}
                                level={student.base_info.level}
                                city={student.base_info.city}
                                action={[
                                    () => {
                                        this.state.selectedStudentId = student.id;
                                        this.popUpNotice(ALERT, 0, "通过" + student.base_info.name + "课程安排？", [
                                            () => {
                                                console.log("agreeArrange" + student.id);
                                                this.agreeArrange();
                                                this.closeNotice();
                                            }, () => {
                                                this.closeNotice();
                                            }]);
                                    },
                                    () => {
                                        this.state.selectedStudentId = student.id;

                                        this.popUpNotice(ALERT, 0, "通过" + student.base_info.name + "课程安排？", [
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