import React, { Component } from 'react';
// import PropTypes from 'proptypes';
// import { withStyles, createStyleSheet } from 'materialui/styles';

import Paper from 'material-ui/Paper';
// import GridList from 'materialui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';


import StudentCard from '../studentCard';

import Lang from '../../../language';
import Code from '../../../code';
import { initCache, getData, getRouter, getCache } from '../../../utils/helpers';
import { INSERT_STUDENT, REMOVE_STUDENT, BASE_INFO, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO } from '../../../enum';

import CommonAlert from '../../../components/CommonAlert';

const Style = {
    paper: { paddingTop: 80, paddingLeft: 40, display: 'flex', FlexDirection: 'row', justifyContent: 'spacebetween' }

}


class Students extends Component {

    state = {
        students: [],
        selected: {},
        showInfo: false,

        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: []
    }

    componentDidMount() {
        window.currentPage = this;
        this.fresh()
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    cacheToState() {
        let students = getCache(DATA_TYPE_STUDENT);
        window.currentPage.setState({ students: students })
    }

    getStudents() {

    }

    newStudent(student) {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                getCache(DATA_TYPE_STUDENT).push(student)
            }
        }
        getData(getRouter(INSERT_STUDENT), { session: sessionStorage.session, student: student }, cb, { student: student });
    }

    removeStudent() {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < getCache(student).length; i++) {
                    if (getCache(DATA_TYPE_STUDENT)[i].id === student.id) {
                        getCache(DATA_TYPE_STUDENT).splice(i, 1);
                        break;
                    }
                }
            }
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

    render() {
        return (
            <div>
                <div
                    style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}
                >
                    <div style={{ margin: 10, width: 400, float: "left" }}>
                        <List subheader={
                            <ListSubheader>
                                <Button
                                    color="primary"
                                    style={{ margin: 10 }}
                                    onClick={() => {
                                        var student = {};
                                        this.newStudent(student);
                                    }}>
                                    {Lang[window.Lang].pages.company.students.new_student}
                                </Button>
                            </ListSubheader>}>
                            {this.state.students.map(student =>
                                <StudentCard
                                    type={CARD_TYPE_INFO}
                                    key={student.id}
                                    name={student.base_info.name}
                                    tel={student.base_info.tel}
                                    email={student.base_info.email}
                                    level={student.base_info.level}
                                    city={student.base_info.city}
                                    action={[() => {
                                        this.state.selected = student;
                                        this.setState({
                                            showInfo: true
                                        })
                                    }, () => {

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
                                    {Lang[window.Lang].pages.company.students.base_info}
                                </Typography>
                                <TextField
                                    id="student_name"
                                    label={Lang[window.Lang].pages.company.students.name}
                                    defaultValue={this.state.selected.base_info.name}
                                    fullWidth
                                />
                                <TextField
                                    id="tel"
                                    label={Lang[window.Lang].pages.company.students.tel}
                                    defaultValue={this.state.selected.base_info.tel}
                                    fullWidth
                                />
                                <TextField
                                    id="email"
                                    label={Lang[window.Lang].pages.company.students.email}
                                    defaultValue={this.state.selected.base_info.email}
                                    fullWidth
                                />
                                <TextField
                                    id="city"
                                    label={Lang[window.Lang].pages.company.students.city}
                                    defaultValue={this.state.selected.base_info.city}
                                    fullWidth
                                />
                                <TextField
                                    id="level"
                                    label={Lang[window.Lang].pages.company.students.level.title}
                                    defaultValue={this.state.selected.base_info.level}
                                    fullWidth
                                />

                                <Button color="primary" style={{ margin: 10 }}>
                                    {Lang[window.Lang].pages.main.certain_button}
                                </Button>
                            </div>
                            <div>
                                <Typography type="headline" component="h3">
                                    {Lang[window.Lang].pages.company.students.personal_info.title}
                                </Typography>
                                <TextField
                                    id="licence"
                                    label={Lang[window.Lang].pages.company.students.personal_info.licence}
                                    defaultValue={this.state.selected.personal_info.licence}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="edu"
                                    label={Lang[window.Lang].pages.company.students.personal_info.edu}
                                    defaultValue={this.state.selected.personal_info.edu}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="working_time"
                                    label={Lang[window.Lang].pages.company.students.personal_info.working_time}
                                    defaultValue={this.state.selected.personal_info.working_time}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="total_amount"
                                    label={Lang[window.Lang].pages.company.students.personal_info.total_amount}
                                    defaultValue={this.state.selected.personal_info.total_amount}
                                    fullWidth>
                                </TextField>
                                <TextField
                                    id="soft_amount"
                                    label={Lang[window.Lang].pages.company.students.personal_info.soft_amount}
                                    defaultValue={this.state.selected.personal_info.soft_amount}
                                    fullWidth>
                                </TextField>
                                <Button color="primary" style={{ margin: 10 }}>
                                    {Lang[window.Lang].pages.main.certain_button}
                                </Button>
                            </div>
                            <div>
                                <Typography type="headline" component="h3">
                                    {Lang[window.Lang].pages.company.students.proj_exp.title}
                                </Typography>
                                {
                                    this.state.selected.proj_exp.map(exp =>
                                        <div id={exp.id}>
                                            <Typography type="body1" component="p">
                                                {exp.name}
                                            </Typography>

                                            <Typography type="body1" component="p">
                                                {exp.time}
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
                                        label={Lang[window.Lang].pages.company.students.proj_exp.name}
                                        defaultValue={this.state.selected.proj_exp.name}>
                                    </TextField>
                                    <TextField
                                        id="time"
                                        label={Lang[window.Lang].pages.company.students.proj_exp.time}
                                        defaultValue={this.state.selected.proj_exp.time}>
                                    </TextField>
                                    <TextField
                                        id="actor"
                                        label={Lang[window.Lang].pages.company.students.proj_exp.actor}
                                        defaultValue={this.state.selected.proj_exp.actor}>
                                    </TextField>
                                    <TextField
                                        id="exp_total_amount"
                                        label={Lang[window.Lang].pages.company.students.proj_exp.total_amount}
                                        defaultValue={this.state.selected.proj_exp.total_amount}>
                                    </TextField>
                                    <TextField
                                        id="exp_soft_amount"
                                        label={Lang[window.Lang].pages.company.students.proj_exp.soft_amount}
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