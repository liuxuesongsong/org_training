import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import GridList from 'material-ui/Grid';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';

import { initCache, getData, getRouter, getCache, getStudent, getCourse, getCity, getInst } from '../../../utils/helpers';
import {
    UNROLL_STUDENT,
    DATA_TYPE_BASE, DATA_TYPE_CLAZZ, STATUS_ENROLLED, STATUS_ARRANGED, STATUS_ARRANGED_DOING, STATUS_ARRANGED_UNDO,
    STATUS_ENROLLED_DID, QUERY, DATA_TYPE_STUDENT,
    CARD_TYPE_UNARRANGE, CARD_TYPE_ARRANGE, AGREE_ARRANGE, REFUSE_ARRANGE, STATUS_AGREED_AGREE, STATUS_AGREED, STATUS_AGREED_UNDO,
    STATUS_AGREED_REFUSED, NOTICE, ALERT, STATUS_ARRANGED_DID,STATUS_AGREED_KNOW,CARD_TYPE_KNOW
} from '../../../enum';
import Lang from '../../../language';
import StudentCard from '../studentCard.js';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

class Home extends Component {

    state = {
        // 数据状态
        name: "",
        enrolled: 0,
        arranged: 0,
        examing: 0,
        passed: 0,
        unarranged_height: 1,
        arranged_height: 1,
        unarragedStudents: [],
        arrangedStudents: [],
        clazzes: [],
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
        this.fresh();
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    cacheToState() {

        let students = getCache(DATA_TYPE_STUDENT);
        let enrolled = 0, arranged = 0, passed = 0, examing = 0,
            unarragedStudents = [], arrangedStudents = [];
        for (var i = 0; i < students.length; i++) {
            if (students[i].is_inlist == STATUS_ENROLLED_DID) {
                enrolled++;
                unarragedStudents.push(students[i]);
            }
            if (students[i].is_inlist == STATUS_ARRANGED_DID||students[i].is_inlist == 3) {
                enrolled++;
                arranged++;
                arrangedStudents.push(students[i]);
            }
        }
        //已安排占已报名的百分比
        var per = (arranged / enrolled * 288);
        if (arranged != 0) {
            document.getElementById("enrolled-per").style.width = per + "px";
        }
        var name = getCache(DATA_TYPE_BASE) !== undefined ? getCache(DATA_TYPE_BASE).c_name : "";
        window.currentPage.setState({
            name: name,
            enrolled: enrolled,
            arranged: arranged,
            examing: examing,
            passed: passed,
            unarragedStudents: unarragedStudents,
            arrangedStudents: arrangedStudents,
            clazzes: getCache(DATA_TYPE_CLAZZ) ? getCache(DATA_TYPE_CLAZZ) : []
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

    agreeArrange() {
        var id = this.state.selectedStudentId;
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                getStudent(arg.id).status[STATUS_AGREED].status = STATUS_AGREED_AGREE;
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
        }
        getData(getRouter(REFUSE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
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

    closeNotice = () => {
        this.setState({
            alertOpen: false,
        })
    }

    render() {
        return (
            <div className={'nyx-page'}>
                <div style={{ paddingTop: "0" }} className={'nyx-paper'}>

                    <Paper id="companyid" >

                        <div className="nyx-head-name">
                            {"企业报名信息统计"} <i className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
                        </div>
                        <div className="nyx-arranger-enrolled-title">
                            <span>
                                {Lang[window.Lang].pages.com.home.arranged + ":"
                                    + this.state.arranged + Lang[window.Lang].pages.com.home.human}
                            </span>
                            <span style={{ float: "right" }}>
                                {Lang[window.Lang].pages.com.home.unarranged + ":"
                                    + (this.state.enrolled-this.state.arranged) + Lang[window.Lang].pages.com.home.human}
                            </span>
                        </div>
                        <span className="nyx-arranged-per">

                        </span>
                        <span id="enrolled-per" className="nyx-enrolled-per">

                        </span>
                        <div className="nyx-arranger-enrolled-title" style={{ paddingTop:"1rem",textAlign: "center"}}>
                        <span>
                                {Lang[window.Lang].pages.com.home.enrolled + "共:"
                                    + this.state.enrolled + Lang[window.Lang].pages.com.home.human}
                            </span>
                        </div>
                    </Paper>

                </div>
                <Paper style={{ padding: 0 }} className={'nyx-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{ marginBottom: "1rem" }} className="nyx-head-name">
                            {Lang[window.Lang].pages.com.home.unarranged_title} <i
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
                                    key={CARD_TYPE_UNARRANGE + student.id}
                                    name={student.name === null ? "" : student.name.toString()}
                                    mobile={student.mobile === null ? "" : student.mobile.toString()}
                                    email={student.mail === null ? "" : student.mail.toString()}
                                    level={student.course_id === "" ? 0 : Number(student.course_id)}
                                    city={student.area_id === "" ? 0 : Number(student.area_id)}
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
                        </div>
                    </List>
                </Paper>
                <Paper style={{ padding: 0 }} className={'nyx-paper'}>

                    <List style={{ padding: 0 }}>
                        <div style={{ marginBottom: "1rem" }} className="nyx-head-name">
                            {Lang[window.Lang].pages.com.home.arranged_title} <i
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

                            {this.state.arrangedStudents.map(student => {
                                switch (student.is_inlist) {
                                    case "0":
                                        return (<StudentCard
                                            type={CARD_TYPE_ARRANGE}
                                            key={CARD_TYPE_ARRANGE + student.id}
                                            name={student.name === null ? "" : student.name}
                                            mobile={student.mobile === null ? "" : student.mobile}
                                            email={student.mail === null ? "" : student.mail}
                                            level={student.course_id === "" ? 0 : Number(student.course_id)}
                                            city={student.area_id === "" ? 0 : Number(student.area_id)}
                                            action={[
                                                () => {
                                                    this.state.selectedStudentId = student.id;
                                                    this.popUpNotice(ALERT, 0, "通过" + student.base_info.name + "课程安排？", [
                                                        () => {
                                                            this.agreeArrange();
                                                            this.closeNotice();
                                                        }, () => {
                                                            this.closeNotice();
                                                        }]);
                                                },
                                                () => {
                                                    this.state.selectedStudentId = student.id;
                                                    this.popUpNotice(ALERT, 0, "拒绝" + student.base_info.name + "课程安排？", [
                                                        () => {
                                                            this.refuseArrange();
                                                            this.closeNotice();
                                                        }, () => {
                                                            this.closeNotice();
                                                        }]);
                                                }]}
                                        >
                                        </StudentCard>)
                                    case "1":
                                        return (<StudentCard
                                            type={CARD_TYPE_ARRANGE}
                                            key={CARD_TYPE_ARRANGE + student.id}
                                            name={student.name === null ? "" : student.name.toString()}
                                            mobile={student.mobile === null ? "" : student.mobile.toString()}
                                            email={student.mail === null ? "" : student.mail.toString()}
                                            level={student.course_id === "" ? 0 : Number(student.course_id)}
                                            city={student.area_id === "" ? 0 : Number(student.area_id)}
                                            status={"已通过"}
                                        >
                                        </StudentCard>)
                                    case "2":
                                        return (<StudentCard
                                            type={CARD_TYPE_ARRANGE}
                                            key={CARD_TYPE_ARRANGE + student.id}
                                            name={student.name === null ? "" : student.name.toString()}
                                            mobile={student.mobile === null ? "" : student.mobile.toString()}
                                            email={student.mail === null ? "" : student.mail.toString()}
                                            level={student.course_id === "" ? 0 : Number(student.course_id)}
                                            city={student.area_id === "" ? 0 : Number(student.area_id)}
                                            status={"已拒绝"}
                                        >
                                        </StudentCard>)
                                    case "3":
                                        return (<StudentCard
                                            type={CARD_TYPE_KNOW}
                                            key={CARD_TYPE_KNOW + student.id}
                                            name={student.name === null ? "" : student.name.toString()}
                                            mobile={student.mobile === null ? "" : student.mobile.toString()}
                                            email={student.mail === null ? "" : student.mail.toString()}
                                            level={student.course_id === "" ? 0 : Number(student.course_id)}
                                            city={student.area_id === "" ? 0 : Number(student.area_id)}
                                            status={"已通知"}
                                        >
                                        </StudentCard>)
                                }
                            })}
                        </div>
                    </List>
                </Paper>
                
                <div className="nyx-notice-button nyx-display-none">
                    <div  className="nyx-notice-title">报名流程</div>
                    <div className="nyx-notice-box">
                    </div>
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

export default Home;