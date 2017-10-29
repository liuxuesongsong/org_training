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
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';

import { initCache, getData, getRouter, getCache, getCity, getCourse } from '../../utils/helpers';
import {
    LAST_COUNT, DATA_TYPE_BASE, DATA_TYPE_CLAZZ, STATUS_ENROLLED, STATUS_ARRANGED, STATUS_ARRANGED_DOING, STATUS_ARRANGED_UNDO,
    STATUS_ENROLLED_DID, STATUS_EXAMING, STATUS_EXAMING_DID, STATUS_PASSED, STATUS_PASSED_DID, QUERY, DATA_TYPE_STUDENT
} from '../../enum';
import Lang from '../../language';
import Code from '../../code';

import CommonAlert from '../../components/CommonAlert';

class Home extends Component {

    state = {
        // 数据状态
        name: "",
        arranged_nums: 0,
        all_students_nums: 0,
        clazzes: [],
        areas: [],
        // 界面状态

        // 提示状态
        alertOpen: false,
        alertType: "alert",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "登录成功"
    };

    componentWillMount() {
        window.currentPage = this;
        this.fresh()
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    // areas insts courses 

    cacheToState() {

        // window.currentPage.state.clazzes = window.CacheData.clazzes;
        // window.currentPage.state.areas = window.CacheData.areas;

        var cb = (router, message, arg) => {
            // window.currentPage.state.clazzes = message.clazzes;
            // window.currentPage.state.areas = message.areas;
            console.log(message)

            window.currentPage.setState({
                areas: message.data.info.areas,
                clazzes: message.data.info.clazzes,
                arranged_nums: message.data.info.sum.all_student_inlist,
                all_students_nums: message.data.info.sum.all_student_reg,
            })
            // all_students
        }
        getData(getRouter(LAST_COUNT), { session: sessionStorage.session }, cb, {});

        // let students = getCache(DATA_TYPE_STUDENT);
        // let enrolled = 0, arranged = 0, passed = 0, examing = 0,
        //     unarragedStudents = [], arrangedStudents = [];
        // for (var i = 0; i < students.length; i++) {
        //     if (students[i].status[STATUS_ENROLLED].status === STATUS_ENROLLED_DID) {
        //         enrolled++
        //         if (students[i].status[STATUS_ARRANGED].status === STATUS_ARRANGED_UNDO) {
        //             unarragedStudents.push(students[i]);
        //         }
        //     }
        //     if (students[i].status[STATUS_ARRANGED].status === STATUS_ARRANGED_DOING) {
        //         arranged++
        //         arrangedStudents.push(students[i]);
        //     }
        //     // if (students[i].status['agreed'].status === 1) {
        //     //     this.state.agreed.push(students[i]);
        //     // }
        //     if (students[i].status[STATUS_EXAMING].status === STATUS_EXAMING_DID) {
        //         examing++
        //     }
        //     if (students[i].status[STATUS_PASSED].status === STATUS_PASSED_DID) {
        //         passed++
        //     }
        //     // if (students[i].status['retry'].status === 1) {
        //     //     this.state.retry.push(students[i]);
        //     // }

        // }
        // window.currentPage.setState({
        //     name: getCache(DATA_TYPE_BASE).company_name,
        //     arranged_nums: enrolled,
        //     arranged: arranged,
        //     examing: examing,
        //     passed: passed,
        //     unarragedStudents: unarragedStudents,
        //     arrangedStudents: arrangedStudents,
        //     clazz: getCache(DATA_TYPE_CLAZZ)
        // })
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    render() {
        return (
            <div>
                <div
                    style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}
                >
                    <div style={{ margin: 10, width: 400, float: "left" }}>
                        <Paper id="companyid" width="500px">
                            <Typography type="headline" component="h5">
                                {this.state.name}
                            </Typography>
                            <Typography type="body1" component="p">
                                {Lang[window.Lang].pages.org.home.arranged + "/" + Lang[window.Lang].pages.org.home.all_students + ":"
                                    + this.state.arranged_nums + Lang[window.Lang].pages.com.home.human + "/" + this.state.all_students_nums + Lang[window.Lang].pages.com.home.human}
                            </Typography>

                        </Paper>
                        {/* <Paper elevation={4} style={{ width: "500px", }}>

                            <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.home.unarranged_title}</ListSubheader>}>
                                {this.state.areas.map(area =>
                                    <Card>
                                    </Card>
                                )}
                            </List>
                        </Paper> */}
                    </div>
                    <div style={{ margin: 10, width: 800, float: "left" }}>
                        <Paper elevation={4}>

                            <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.home.arranged_title}</ListSubheader>}>
                                {this.state.areas.map(area => {
                                    console.log(area)
                                    return <div key={area.id}>{getCity(area.id) + getCourse(area.course[0].id) + area.course[0].inlist + "/" + area.course[0].reg + "\n" +
                                        getCourse(area.course[1].id) + area.course[1].inlist + "/" + area.course[1].reg}</div>
                                }

                                )}
                            </List>


                        </Paper>
                    </div>
                    <div style={{ margin: 10, width: 400, float: "left" }}>
                        <Paper elevation={4}>

                            <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.home.clazz_title}</ListSubheader>}>
                                {this.state.clazzes.map(value =>
                                    <ListItem dense button key={value}>
                                        {/* <Avatar alt="Remy Sharp" src={remyImage} /> */}
                                        <ListItemText primary={`班级 ${value + 1}`} />
                                        <ListItemSecondaryAction>
                                            {/* <Checkbox
                  onClick={event => this.handleToggle(event, value)}
                  checked={this.state.checked.indexOf(value) !== -1}
                /> */}
                                        </ListItemSecondaryAction>
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
                    handleCertainClose={() => {
                        this.setState({ alertOpen: false });
                    }}
                    handleCancelClose={() => {
                        this.setState({ alertOpen: false })
                    }}>
                </CommonAlert>
            </div>
        )
    }
}

export default Home;