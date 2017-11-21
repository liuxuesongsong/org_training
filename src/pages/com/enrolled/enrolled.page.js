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

import { initCache, getData,getCity,getCourse, getRouter, getStudent, getCache } from '../../../utils/helpers';
import {
    UNROLL_STUDENT,DATA_TYPE_BASE, REMOVE_STUDENT, UPDATE_STUDENT, INSERT_STUDENT, QUERY, ENROLL_STUDENT, EXIT_CLASS, STATUS_ENROLLED, AGREE_ARRANGE, REFUSE_ARRANGE, DATA_TYPE_STUDENT, STATUS_ARRANGED_DOING,
    STATUS_ENROLLED_UNDO, STATUS_FK_UNDO, STATUS_ARRANGED_UNDO, STATUS_AGREED_AGREE, STATUS_ENROLLED_DID, STATUS_ARRANGED, STATUS_AGREED,
    CARD_TYPE_ENROLL, CARD_TYPE_FK, CARD_TYPE_ARRANGE, CARD_TYPE_UNARRANGE, STATUS_ARRANGED_DID, ALERT, STATUS_AGREED_KNOW, STATUS_AGREED_REFUSED, NOTICE, CARD_TYPE_KNOW
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
        course_id:"",
        a_id:"",
        c_area_id: "",
        is_register:"",
        fkenrolled_height: 1,
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
        if (getCache(DATA_TYPE_BASE) !== undefined) {
            var data = getCache(DATA_TYPE_BASE);
           // var currentCity = getCity(data.c_area_id);
           // console.log(data.c_area_id)
            window.currentPage.setState({
                c_area_id: data.c_area_id,
            });
            
        }
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
            if (this.state.students[i].is_inlist == STATUS_ARRANGED_DID || this.state.students[i].is_inlist == 3) {
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
            course_id:document.getElementById("student_course_id").value,
            area_id:document.getElementById("new_area_id").value,
            register: document.getElementById("register").value,
            department: document.getElementById("department").value,
            duty: document.getElementById("duty").value,
            mobile: document.getElementById("mobile").value,
            mail: document.getElementById("mail").value,
            wechat: document.getElementById("wechat").value,
            detail: document.getElementById("detail").value,
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
                    <div style={{paddingTop:20}} className="nyx-form">
                    <TextField
                 className="nyx-form-div nyx-must-content"
                key={"name"}
                 id={"new_name"}
                label={Lang[window.Lang].pages.com.students.input.name}
                
               
            />
            <div className="nyx-form-div">
            <div style={{width:"50%",float:"left",marginTop:"1px"}} className="nyx-info-select-div">
            <p className="nyx-info-select-label">{Lang[window.Lang].pages.com.students.input.register}</p>
                        <select
                        style={{margin:0,fontSize:"16px",paddingBottom:"10px"}}
                            className="nyx-info-select-lg"
                            id="new_register_select"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            onChange={(e)=>{
                                this.setState({is_register:e.target.value})
                                
                                if(e.target.value==2){
                                   document.getElementById("new_register").value="培训考试报名"
                                }else{
                                    document.getElementById("new_register").value=""
                                }
                               // console.log(e.target.value);
                            }}
                        >
                            <option value={1}>{"临时登记编号"}</option>
                            <option value={2}>{"培训考试报名"}</option>
                            <option value={3}>{"空"}</option>
                        </select>
                        </div>
                        <TextField
                 style={{width:"50%",marginLeft:"-3px",marginTop:"16px"}}
                key={"register"}
                 id={"new_register"}
                 disabled={this.state.is_register == 3||this.state.is_register == 2 ? true : false}
                
              
                
            />

            </div>
           
                        <div>
                            {/* <p
                                className="nyx-info-select-label"
                            >培训城市</p> */}
                            
                        </div>
                        {/* <select
                            className="nyx-info-select"
                            id="new_area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            {this.newStudentCity()}
                        </select> */}
                        {/* <TextField
                 className="nyx-form-div"
                key={"area_id"}
                 id={"new_area_id"}
                 value={this.state.c_area_id}
                 disabled
                label={Lang[window.Lang].pages.com.students.select.area_id}
               
            /> */}
            

                        <div className="nyx-info-select-div">
                            <p className="nyx-info-select-label">中项或高项</p>
                        <select
                            className="nyx-info-select-lg"
                            id="new_course_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                        >
                            <option value={1}>{"项目经理"}</option>
                            <option value={2}>{"高级项目经理"}</option>
                        </select>
                        </div>
                        <div className="nyx-info-select-div">
                            <p className="nyx-info-select-label">培训城市</p>
                        <select
                            className="nyx-info-select-lg"
                            id="new_area_id"
                            value={this.state.c_area_id === null ? "" : this.state.c_area_id}
                                onChange={(e) => {
                                    this.state.c_area_id = Number(e.target.value);
                                    this.setState({
                                        c_area_id: this.state.c_area_id
                                    });
                                }}
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                        >
                        {this.newStudentCity()}
                        </select>
                        </div>
                        <TextField
                 className="nyx-form-div nyx-must-content"
                key={"mobile"}
                 id={"new_mobile"}
                label={Lang[window.Lang].pages.com.students.input.mobile}
                defaultValue={""}
            />
            
            <TextField
                 className="nyx-form-div nyx-must-content"
                key={"mail"}
                 id={"new_mail"}
                label={Lang[window.Lang].pages.com.students.input.mail}
                defaultValue={""}
              
            />
            <div style={{float:"left"}} className="nyx-info-select-div">
                            <p className="nyx-info-select-label">证件类型</p>
                        <select
                            className="nyx-info-select-lg"
                            id="new_id_type"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                        >
                            <option value={"身份证"}>{"身份证"}</option>
                            <option value={"护照"}>{"护照"}</option>
                        </select>
                        </div>
            {/* <TextField
                 className="nyx-form-div nyx-must-content"
                key={"id_type"}
                 id={"new_id_type"}
                label={Lang[window.Lang].pages.com.students.input.id_type}
                defaultValue={""}
                
            /> */}
            <TextField
                className="nyx-form-div nyx-must-content"
                key={"identity_card"}
                id={"new_identity_card"}
                label={Lang[window.Lang].pages.com.students.input.identity_card}
                
            />
            <TextField
                className="nyx-form-div"
                key={"department"}
                id={"new_department"}
                label={Lang[window.Lang].pages.com.students.input.department}
               
            />
            <TextField
                className="nyx-form-div"
                key={"duty"}
                id={"new_duty"}
                label={Lang[window.Lang].pages.com.students.input.duty}
                
            />
            <TextField
                className="nyx-form-div"
                key={"wechat"}
                id={"new_wechat"}
                label={Lang[window.Lang].pages.com.students.input.wechat}
                
            />
            <div className="nyx-remark">
                <h4>备注栏:</h4>
                <p>1.临时登记人员填写临时登记证书编号(网站可查);</p>
                <p>2.原来在项目管理人员登记系统已报名培训考试填写培训考试报名;</p>
                <p>3.不是上述两种情况,备注栏目为空,不用填写。</p>
                
            </div>
                    </div>
                    
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
                            onClick={() => {
                                var new_info_array={new_name:"您没有输入姓名",new_mobile:"您没有输入手机",
                                new_mail:"您没有输入邮箱",new_id_type:"您没有输入证件类型",
                                new_department:"您没有输入部门",new_duty:"您没有输入职务"
                            }
                                for(var key in new_info_array){
                                    if (document.getElementById(key).value === "") {
                                        this.popUpNotice(NOTICE, 0, new_info_array[key])
                                        return
                                      }
                           }
                              
                                
                                this.newStudent({


                                    name: document.getElementById("new_name").value,
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
                        <Button style={{backgroundColor:"rgba(0, 0, 0, 0.12)"}}
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
        this.setState({ course_id: value });
    };
    
    handleChangeCity = (event, value) => {
        this.setState({ course: value });
    };

    render() {
        return (
            <div style={{width:"800px"}} className={'nyx-page'}>
                <div className={'nyx-tips nyx-display-none'}><p>{"【已临时登记的项目经理】" +
                    "第一步：请在下表中点击【修改】补充完整人员信息。" +
                    "第二步：点击【报名】进行培训报名"}</p>
                    <p style={{marginLeft:"0.4rem"}}>{"特别提醒:在“报名”提交前必须填完“企业相关信息”。"}</p>
                    </div>
                <Paper className={'nyx-paper nyx-enroller-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{  color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
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
                                    duty={student.duty === null ? "" : student.duty.toString()}
                                    department={student.department === null ? "" : student.department.toString()}
                                    institution={student.institution === null ? "" : Number(student.institution)}
                                    action={[() => {
                                        this.selectedStudent(student);
                                        this.toggleDrawer(true)()
                                    }, () => {
                                        var info_completed=getCache("info_completed");
                                        var info_completed_per=info_completed/20;
                                        console.log(info_completed_per);
                                        if(info_completed_per<1){
                                            this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
                                            return
                                        }
                                        if(student.duty===""||student.department===""||student.mobile===""||student.mail===""){
                                            this.popUpNotice("alert", 0, '请先补全报名人员信息');
                                            return
                                        }
                                        console.log(student);
                                        this.state.selectedStudentId = student.id;
                                        


                                        this.popUpNotice(ALERT, 0, "为" + student.name + "报名"+ getCity(student.area_id) + "的"+getCourse(student.course_id)+ "培训班", [
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
                <div className={'nyx-tips nyx-display-none'}>
                    {"【未临时登记的项目经理】" +
                        "第一步：请在下表中点击【添加】新增人员，输入完整信息。" +
                        "第二步：点击【报名】进行报名"
                    }
                    <p style={{marginLeft:"0.4rem"}}>{"特别提醒:在“报名”提交前必须填完“企业相关信息”。"}</p>
                    </div>
                <Paper className={'nyx-paper nyx-enroller-paper'}>
                    <List style={{ padding: 0 }}>
                        <div style={{ color:"#2196F3", marginBottom: "1rem", position: "relative" }} className="nyx-head-name">
                            {Lang[window.Lang].pages.com.enrolled.unenrolled} <i
                                onClick={() => {
                                    if (this.state.unenrolled_height == 0) {
                                        this.setState({ unenrolled_height: 1 })
                                    } else {
                                        this.setState({ unenrolled_height: 0 })
                                    }
                                }}

                                className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
                            <Button style={{ position: "absolute", right: "28px", top: "0" }} fab color="primary" aria-label="add" className={'nyx-paper-header-btn'}
                                onClick={() => {
                                    if (getCache("base").c_area_id === 0) {
                                        this.popUpNotice("alert", 0, "请先补全企业相关信息");
                                        return
                                    }else if(getCache("base").name === ""){
                                        this.popUpNotice("alert", 0, "请先补全企业相关信息");
                                        return
                                    }
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
                                    duty={student.duty === null ? "" : student.duty.toString()}
                                    department={student.department === null ? "" : student.department.toString()}
                                    institution={student.institution === null ? "" : Number(student.institution)}
                                    action={[() => {
                                        this.selectedStudent(student);
                                        this.toggleDrawer(true)()
                                    }, () => {
                                       // console.log(getCache("info_completed"));
                                       var info_completed=getCache("info_completed");
                                       var info_completed_per=info_completed/20;
                                       console.log(info_completed_per);
                                       if(info_completed_per<1){
                                           this.popUpNotice("alert", 0, '企业相关信息完成'+info_completed_per*100+'%, 请先补全企业相关信息');
                                           return
                                       }
                                       console.log(student);

                                       if(student.duty===null||student.department===null||student.mobile===null||student.mail===null){
                                        this.popUpNotice("alert", 0, '请先补全报名人员信息');
                                        return
                                    }
                                        this.state.selectedStudentId = student.id;
                                        this.popUpNotice(ALERT, 0, "为" + student.name + "报名"+ getCity(student.area_id) + "的"+getCourse(student.course_id)+ "培训班", [
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
                        <div style={{ color:"#2196F3", marginBottom: "1rem" }} className="nyx-head-name">
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
                                    duty={student.duty === null ? "" : student.duty.toString()}
                                    institution={student.institution === null ? "" : Number(student.institution)}
                                    department={student.department === null ? "" : student.department.toString()}
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
                        <div style={{ color:"#2196F3", marginBottom: "1rem" }} className="nyx-head-name">
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
                            {this.state.arrangedStudents.map(student => {

                                switch (student.is_inlist) {
                                    case "2":
                                        return (
                                            <StudentCard
                                                type={CARD_TYPE_ARRANGE}
                                                key={student.id}
                                                
                                                name={student.name === null ? "" : student.name.toString()}
                                                mobile={student.mobile === null ? "" : student.mobile.toString()}
                                                email={student.mail === null ? "" : student.mail.toString()}
                                                level={Number(student.course_id)}
                                                city={Number(student.area_id)}
                                                duty={student.duty === null ? "" : student.duty.toString()}
                                                department={student.department === null ? "" : student.department.toString()}
                                                institution={student.institution === null ? "" : Number(student.institution)}
                                                // action={[
                                                //     () => {
                                                //         this.state.selectedStudentId = student.id;
                                                //         this.popUpNotice(ALERT, 0, "请等待培训机构告知具体培训时间和地点", [
                                                //             () => {
                                                //                 this.agreeArrange();
                                                //                 this.closeNotice();
                                                //             }, () => {
                                                //                 this.closeNotice();
                                                //             }]);
                                                //     },
                                                //     () => {
                                                //         this.state.selectedStudentId = student.id;

                                                //         this.popUpNotice(ALERT, 0, "通过" + student.name + "课程安排？", [
                                                //             () => {
                                                //                 this.refuseArrange();
                                                //                 this.closeNotice();
                                                //             }, () => {
                                                //                 this.closeNotice();
                                                //             }]);
                                                //     }]}
                                                >
                                            </StudentCard>)
                                    case "3":
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
                                                    duty={student.duty === null ? "" : student.duty.toString()}
                                                    department={student.department === null ? "" : student.department.toString()}
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
                        <Paper className="nyx-enrolled-change-drawer" style={{boxShadow:"none"}}  elevation={4}>
                            <h2 className="nyx-enrolled-change-title">
                                {Lang[window.Lang].pages.com.students.base_info}
                            </h2>
                            <TextField
                                id="student_name"
                                label={Lang[window.Lang].pages.com.students.name}
                                defaultValue={this.state.selected.name ? this.state.selected.name : ""}
                                fullWidth
                                disabled={this.state.selected.a_id == -1 ? true : false}
                            />
                           
                            <TextField
                                style={{marginTop:"1em"}}
                                id="licence.code"
                                label={Lang[window.Lang].pages.com.students.personal_info.licence_code[1]}
                                
                                defaultValue={this.state.selected.identity_card ? this.state.selected.identity_card : ""}
                                disabled={this.state.selected.a_id == -1 ? true : false}
                                fullWidth>
                            </TextField>
                           <p className="nyx-card-enrroll-select-label-lg">
                               中项或高项
                           </p>
                            <select
                            className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
                                id={"student_course_id"}
                                defaultValue={this.state.selected.course_id ? this.state.selected.course_id : ""}
                                    disabled={this.state.selected.a_id == -1 ? true : false}
                            >
                                <option value={1}>{"项目经理"}</option>
                                <option value={2}>{"高级项目经理"}</option>
                                
                            </select>
                            <p className="nyx-card-enrroll-select-label-lg">培训城市</p>
                        <select
                            className={this.state.selected.a_id == -1 ?"nyx-card-enrroll-select-lg-dashed":"nyx-card-enrroll-select-lg"}
                            id="new_area_id"
                           
                            defaultValue={this.state.selected.area_id === null ? "" : this.state.selected.area_id}
                           
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                        >
                        {this.newStudentCity()}
                        </select>
                       

                            {/* <FormControl required>
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
                            </FormControl> */}
                            <TextField
                                style={{marginTop:"1em"}}
                                id="register"
                                label={Lang[window.Lang].pages.com.students.register}
                                defaultValue={this.state.selected.register ? this.state.selected.register : ""}
                                disabled={this.state.selected.a_id == -1 ? true : false}
                                fullWidth>
                            </TextField>

                            <h2 className="nyx-enrolled-change-title" style={{marginTop:20}}>
                                {Lang[window.Lang].pages.com.students.personal_info.title}
                            </h2>
                            <TextField
                                id="department"
                                label={Lang[window.Lang].pages.com.students.personal_info.department}
                                defaultValue={this.state.selected.department ? this.state.selected.department : ""}
                                fullWidth>
                            </TextField>
                            <TextField
                            style={{marginTop:"1em"}}
                                id="duty"
                                label={Lang[window.Lang].pages.com.students.personal_info.duty}
                                defaultValue={this.state.selected.duty ? this.state.selected.duty : ""}
                                fullWidth>
                            </TextField>
                            <TextField
                            style={{marginTop:"1em"}}
                                id="mobile"
                                label={Lang[window.Lang].pages.com.students.tel}
                                defaultValue={this.state.selected.mobile ? this.state.selected.mobile : ""}
                                fullWidth
                            />
                            <TextField
                                id="mail"
                                style={{marginTop:"1em"}}
                                label={Lang[window.Lang].pages.com.students.email}
                                defaultValue={this.state.selected.mail ? this.state.selected.mail : ""}
                                fullWidth
                            />
                            <TextField
                                id="wechat"
                                style={{marginTop:"1em"}}
                                label={Lang[window.Lang].pages.com.students.personal_info.wechat}
                                defaultValue={this.state.selected.wechat ? this.state.selected.wechat : ""}
                                fullWidth
                            />
                            <TextField
                                id={"detail"}
                                style={{marginTop:"1em"}}
                                label={Lang[window.Lang].pages.com.students.input.detail}
                                helperText={Lang[window.Lang].pages.com.students.input.detail_helper}
                                defaultValue={this.state.selected.detail ? this.state.selected.detail : ""}
                                fullWidth
                            />
                            <Button
                                
                                style={{backgroundColor:"#2196f3", color:"#FFF",margin: 10, float: "right" }}
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