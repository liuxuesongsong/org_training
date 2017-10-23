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

import { initCache, getData, getRouter, getCache, getStudent } from '../../../utils/helpers';
import {
    STUDENT_INFOS, STATUS_ENROLLED_UNDO,
    DATA_TYPE_BASE, DATA_TYPE_CLAZZ, STATUS_ENROLLED, STATUS_ARRANGED, STATUS_ARRANGED_DOING, STATUS_ARRANGED_UNDO,
    STATUS_ENROLLED_DID, STATUS_EXAMING, STATUS_EXAMING_DID, STATUS_PASSED, STATUS_PASSED_DID, QUERY, DATA_TYPE_STUDENT,
    CARD_TYPE_UNARRANGE, CARD_TYPE_ARRANGE, AGREE_ARRANGE, REFUSE_ARRANGE, STATUS_AGREED_AGREE, STATUS_AGREED, STATUS_AGREED_UNDO,
    STATUS_AGREED_REFUSED, STATUS_ENROLLED_REDO, NOTICE, ALERT, CARD_TYPE_COMMON, STATUS_ARRANGED_DID
} from '../../../enum';
import Lang from '../../../language';
import StudentCard from '../studentCard.js';
import Code from '../../../code';

import Style from '../../../Style';

import CommonAlert from '../../../components/CommonAlert';

class Home extends Component {

    state = {
        // 数据状态
        name: "",
        enrolled: 0,
        arranged: 0,
        examing: 0,
        passed: 0,
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
        // this.getStudents();
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
            if (students[i].is_inlist == STATUS_ARRANGED_DID) {
                enrolled++;
                arranged++;
                arrangedStudents.push(students[i]);
            }
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


    agreeArrange() {
        var id = this.state.selectedStudentId;
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                getStudent(arg.id).status[STATUS_AGREED].status = STATUS_AGREED_AGREE;
                this.fresh();

            }
            this.popUpNotice(NOTICE, Code.ERROE_REQUEST_ROUTER, Lang[window.Lang].ErrorCode[Code.ERROE_REQUEST_ROUTER]);
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
            <div>
                <div
                    style={Style.pages.com.home.page}
                >
                    <div style={Style.pages.com.home.papers}>
                        <Paper id="companyid" width="400px">
                            <Typography type="headline" component="h5">
                                {this.state.name}
                            </Typography>
                            <Typography type="body1" component="p">
                                {Lang[window.Lang].pages.com.home.arranged + "/" + Lang[window.Lang].pages.com.home.enrolled + ":"
                                    + this.state.arranged + Lang[window.Lang].pages.com.home.human + "/" + this.state.enrolled + Lang[window.Lang].pages.com.home.human}
                            </Typography>
                            {// 当前版本未使用
                                /**<Typography type="body1" component="p">
                                {Lang[window.Lang].pages.com.home.passed + "/" + Lang[window.Lang].pages.com.home.trained + ":"
                                    + this.state.passed + Lang[window.Lang].pages.com.home.human + "/" + this.state.examing + Lang[window.Lang].pages.com.home.human}
        </Typography>*/
                            }
                        </Paper>
                        <Paper elevation={4} style={Style.pages.com.home.buttom_paper}>
                            <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.home.unarranged_title}</ListSubheader>}>
                                {this.state.unarragedStudents.map(student =>
                                    <StudentCard
                                        type={CARD_TYPE_UNARRANGE}
                                        key={CARD_TYPE_UNARRANGE + student.id}
                                        name={student.name}
                                        tel={student.mobile}
                                        email={student.mail}
                                        level={student.course_id}
                                        city={student.area_id}
                                    /* status={student.status.enrolled.status === STATUS_ENROLLED_REDO ? Lang[window.Lang].pages.com.home.being_reroll : ""} */
                                    >
                                    </StudentCard>
                                )}
                            </List>
                        </Paper>
                    </div>
                    <div style={Style.pages.com.home.papers}>
                        <Paper elevation={4}>

                            <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.home.arranged_title}</ListSubheader>}>
                                {this.state.arrangedStudents.map(student => {
                                    switch (student.is_inlist) {
                                        case STATUS_AGREED_UNDO:
                                            return (<StudentCard
                                                type={CARD_TYPE_ARRANGE}
                                                key={CARD_TYPE_ARRANGE + student.id}
                                                name={student.name}
                                                tel={student.mobile}
                                                email={student.mail}
                                                level={student.course_id}
                                                city={student.area_id}
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
                                        case STATUS_AGREED_AGREE:
                                            return (<StudentCard
                                                type={CARD_TYPE_ARRANGE}
                                                key={CARD_TYPE_ARRANGE + student.id}
                                                name={student.name}
                                                tel={student.mobile}
                                                email={student.mail}
                                                level={student.course_id}
                                                city={student.area_id}
                                                status={"已通过"}
                                            >
                                            </StudentCard>)
                                        case STATUS_AGREED_REFUSED:
                                            return (<StudentCard
                                                type={CARD_TYPE_ARRANGE}
                                                key={CARD_TYPE_ARRANGE + student.id}
                                                name={student.name}
                                                tel={student.mobile}
                                                email={student.mail}
                                                level={student.course_id}
                                                city={student.area_id}
                                                status={"已拒绝"}
                                            >
                                            </StudentCard>)
                                    }
                                })}
                            </List>


                        </Paper>
                    </div>
                    <div style={Style.pages.com.home.papers}>
                        <Paper elevation={4}>

                            <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.home.clazz_title}</ListSubheader>}>
                                {this.state.clazzes.map(clazz =>
                                    <ListItem dense button key={clazz.id}>
                                        <Card style={{maxWidth: 345,}}>
                                            <CardMedia
                                            style={{height: 120,}}
                                                image="/static/images/cards/contemplative-reptile.jpg"
                                                title="Contemplative Reptile"
                                            />
                                            <CardContent>
                                                <Typography type="headline" component="h2">
                                                    {clazz.area_id}
                                                </Typography>
                                                <Typography component="p">
                                                    {clazz.course_id}
                                                </Typography>
                                                <Typography component="p">
                                                    {clazz.ti_id}
                                                </Typography>
                                                <Typography component="p">
                                                    {clazz.train_starttime}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button dense color="primary">
                                                    {"分享"}
                                                </Button>
                                                <Button dense color="primary">
                                                    {"了解详情"}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </ListItem>,
                                )}
                            </List>


                        </Paper>

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