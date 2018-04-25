import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import classnames from 'classnames';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Drawer from 'material-ui/Drawer';
import { LabelRadio, RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse,getCourses, getTotalPage, getAreas, getTimeString, downloadTimeString } from '../../utils/helpers';

import ReactDataGrid from 'angon_react_data_grid';

import Code from '../../code';
import Lang from '../../language';
import { DEL_TRAIN, UNCHOOSE_STUDENT, INST_QUERY, STATUS_ARRANGED_DID, AGREE_ARRANGE, ALERT, NOTICE, SELECT_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO,SELECT_STUDNETS_BY,BATCH_AGREE_STUDENT,BATCH_DELETE_STUDENT,CANCEL_LIST,BATCH_AGREE_CANCEL,AGREE_CANCEL,SELECT_RESITS,CREATE_RESIT,DEL_RESIT,AGREE_RESIT } from '../../enum';

import CommonAlert from '../../components/CommonAlert';
import BeingLoading from '../../components/BeingLoading';

class Clazz extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
    };
    state = {
        clazzes: [],
        search_clazzes:[],
        students: [],
        areas: [],
        allData: [],                //表格中所有数据
        tableData: [],              //表格内当前显示数据
        tableSearchData:[],
        queryCondition: {},         //搜索条件
        selectedStudentID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        clazzStudents: [],          //班级内的学生
        clazzResitStudents:[],
        cancelClazzStudent:[],
        leading_in_arr:[],
        checklist_arr:[],
        same_check_arr:[],
        agree_checklist_arr:[],
        del_checklist_arr:[],
        class_cancel_arr:[],
        class_cancecl:[],
        showInfo: false,
        cancelshowInfo: false,
        showStudents: false,
        openNewClazzDialog: false,
        searchClazzDialog: false,
        openEditClazzDialog: false,
        openResitTrain:false,
        currentPage: 1,
        totalPage: 1,
        rowsPerPage: 25,             //每页显示数据
        count: 0,
        btns:0,
        resit_btn:0,
        change_area:0,
        change_course:0,
        onloading: false,
        loading:false,
        selected: {},
        search_input: "",
        search_company: "",
        search_account: "",
        search_id:"",
        selected_start_year:"",
        selected_start_month:"",
        selected_start_date:"",
        selected_end_year:"",
        selected_end_month:"",
        selected_end_date:"",
        cancel_list:[],
        arr:[],
        search_area_id: null,
        search_clazz_course_id: null,
        search_clazz_area_id: null,
        search_course_id: null,
      
        my_institution: 0,
        type: '',
        selectedStudentId: undefined,
        // 下载相关
        filename: "",
        expanded: false,
        // 提示状态
        alertOpen: false,
        alertType: ALERT,
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: [],
        openNewStudentDialog: false,
        alertType: "notice",
        alertContent: "登录成功",
    }
    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
      };
    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true;
        window.currentPage = this;
        this.fresh();
    }

    fresh = () => {
        this.state.allData=[];
       // this.state.class_number=0;
        initCache(this.cacheToState);
    }

    cacheToState() {
        window.currentPage.queryStudents();
        window.currentPage.state.areas = getAreas();
        var cb = (router, message, arg) => {
            window.currentPage.setState({
                my_institution: message.data.myinfo.my_institution

            })

            // all_students
        }
        getData(getRouter(INST_QUERY), { session: sessionStorage.session }, cb, {});
        window.currentPage.state.clazzes = getCache("clazzes").sort((a, b) => {
            return b.id - a.id
        });
    }

    /**
     * 按条件查询所有学生
     * @param query_page 查询页码
     * @param reload 重新载入数据
     */
    queryStudents = (query_page = 1, reload = false) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.students;
                this.handleUptateAllData(result);
                this.handleUpdateData(this.state.currentPage);
                this.setState({
                    totalPage: getTotalPage(message.data.count, this.state.rowsPerPage),
                    count: message.data.count
                })
                this.state.count = message.data.count
                // this.setState({ students: message.data, tableData: message.data })
            } else {

            }
        }
        //console.log(this.state.count)
        if (reload) {
            this.state.allData = [];
            this.state.tableData = [];
            this.currentPage = 1;
            this.setState({
                totalPage: 1,
                count: 0
            })
        }
        getData(getRouter(SELECT_STUDNETS), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
    }
    resitStudents = (query_page = 1, reload = false) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.resitinfos;
                this.handleUptateAllData(result);
                this.handleUpdateData(this.state.currentPage);
                this.setState({
                    totalPage: getTotalPage(message.data.count, this.state.rowsPerPage),
                    count: message.data.count
                })
                this.state.count = message.data.count
                // this.setState({ students: message.data, tableData: message.data })
            } else {

            }
        }
        //console.log(this.state.count)
        if (reload) {
            this.state.allData = [];
            this.state.tableData = [];
            this.currentPage = 1;
            this.setState({
                totalPage: 1,
                count: 0
            })
        }
        getData(getRouter(SELECT_RESITS), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
    }

    // 查询一个班级的学生
    queryClazzStudents = (id) => {
        var cb = (route, message, arg) => {

            if (message.code === Code.LOGIC_SUCCESS) {
                // console.log(message.data)
                arg.self.setState({ clazzStudents: message.data.studentinfos,clazzResitStudents: message.data.resitinfos });
                arg.self.handleMakeDownloadData(message.data.studentinfos);
              //  this.cancel_list();
            }
        }
        getData(getRouter(SELECT_CLAZZ_STUDENTS), { session: sessionStorage.session, clazz_id: id }, cb, { self: this });
    }

    newClazz = (clazz) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                Object.assign({ id: message.data.clazz_id }, clazz)
                this.state.clazzes.push(clazz)
                this.setState({ clazzes: this.state.clazzes })
                this.fresh()
            }
            //console.log(message.msg)
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
        }
        getData(getRouter(CREATE_CLAZZ), Object.assign(clazz, obj), cb, {});
    }
    distinct=(clazz)=>{
        this.state.arr = clazz;
        var i,
            j,
            len = this.state.arr.length;

            this.state.class_cancecl=[];
            for(i = 0; i < len; i++){
            for(j = i + 1; j < len; j++){
            if(this.state.arr[i] === this.state.arr[j]){
                j = ++i;
            }
            }
            this.state.class_cancecl.push(this.state.arr[i]);
            }
 return this.state.class_cancecl;
 
    }
    cancel_list = (clazz) => {
        var cb = (route, message, arg) => {
            this.setState({
                cancel_list:message.data
            })
            this.state.class_cancel_arr=[];
            for(var i=0;i<message.data.length;i++){
               this.state.class_cancel_arr.push(message.data[i].class_id)
            }
            this.distinct(this.state.class_cancel_arr);
           if(message.data.length>0){
            this.popUpNotice(NOTICE, 0, message.msg);
           }
            
        }
        getData(getRouter(CANCEL_LIST), { session: sessionStorage.session }, cb, {});
    }
    
    createTrain = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.selectedStudentID = [];
                this.state.currentPageSelectedID = [];
                this.fresh();
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            clazz_id: id,
            student_ids: this.state.selectedStudentID
        }
        this.state.btns=0;
        getData(getRouter(CREATE_TRAIN), obj, cb, {});
    }
    createResitTrain = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.selectedStudentID = [];
                this.state.openResitTrain=false;
                this.state.currentPageSelectedID = [];
                this.fresh();
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            clazz_id: id,
            resit_ids: this.state.selectedStudentID
        }
        this.state.btns=0;
        console.log(obj)
        getData(getRouter(CREATE_RESIT), obj, cb, {});
    }

    modifyClazz = (id, clazz) => {

        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.fresh();
                // this.setState({ clazzes: message.clazz })
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
      //  console.log(clazz)
        getData(getRouter(EDIT_CLAZZ), { session: sessionStorage.session, id: id, data: clazz }, cb, {});

    }

    deleteClazz = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < this.state.clazzes.length; i++) {
                    if (this.state.clazzes[i].id === arg.id) {
                        this.state.clazzes.splice(i, 1);
                        this.setState({
                            clazzes: this.state.clazzes
                        })
                        break;
                    }
                }
               
                this.popUpNotice(NOTICE, 0, message.msg);
               // this.fresh();
                // this.setState({ clazzes: this.state.clazzes })
            }
        }
        getData(getRouter(DELETE_CLAZZ), { session: sessionStorage.session, clazz_id: id }, cb, { id: id });
    }
    search_message = () => {
        
                var cb = (route, message, arg) => {
                    if (message.code === Code.LOGIC_SUCCESS) {
                        this.setState({
                            tableSearchData:message.data
                        })
                        this.state.loading=false;
                    }
                   
                    this.popUpNotice(NOTICE, 0, message.msg);
                }
               
                getData(getRouter(SELECT_STUDNETS_BY), { session: sessionStorage.session, company_name:this.state.search_company,student_name:this.state.search_account,student_id:this.state.search_id }, cb, {});
        
            }
            agreecheckCancelStudent = (cancel_id) => {
                var cb = (route, message, arg) => {
                    if (message.code === Code.LOGIC_SUCCESS) {
                        this.queryClazzStudents(this.state.selected.cancel_id);
                        this.popUpNotice(NOTICE, 0, message.msg);
                        this.fresh();
                        this.state.arr=[];
                        this.cancel_list()
                    }
                }
                var checklist = document.getElementsByName("cancelselected");
                this.state.agree_checklist_arr=[];
                for(var i=0;i<checklist.length;i++){
                   if(checklist[i].checked==true)
                     this.state.agree_checklist_arr.push(checklist[i].value)
                }   
        
                getData(getRouter(BATCH_AGREE_CANCEL), { session: sessionStorage.session, cancel_ids: this.state.agree_checklist_arr }, cb, {});
            }
            agreeCancelStudent=(cancel_id)=>{
                var cb = (route, message, arg) => {
                    if (message.code === Code.LOGIC_SUCCESS) {
                        this.popUpNotice(NOTICE, 0, message.msg);
                        this.fresh();
                        this.state.arr=[];
                        this.cancel_list()
                    }
                }    
                getData(getRouter(AGREE_CANCEL), { session: sessionStorage.session, cancel_id: cancel_id }, cb, { });
            }
        agreecheckStudent = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.queryClazzStudents(this.state.selected.id);
                this.popUpNotice(NOTICE, 0, message.msg);
                this.state.allData=[];
                this.fresh();
            }
        }
            var checklist = document.getElementsByName("selected");
            this.state.agree_checklist_arr=[];
            for(var i=0;i<checklist.length;i++){
            if(checklist[i].checked==true)
                this.state.agree_checklist_arr.push(checklist[i].value)
            }   
          console.log(this.state.agree_checklist_arr)

        getData(getRouter(BATCH_AGREE_STUDENT), { session: sessionStorage.session, ids: this.state.agree_checklist_arr }, cb, {});
    }
    delcheckStudent = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.queryClazzStudents(this.state.selected.id);
                this.popUpNotice(NOTICE, 0, message.msg);  
                this.fresh();
                this.state.allData=[];
                var checklist = document.getElementsByName("selected");
                for(var i=0;i<checklist.length;i++){
                    checklist[i].checked=false
                   
                }
            }
        }
        var checklist = document.getElementsByName("selected");
        this.state.del_checklist_arr=[];
        for(var i=0;i<checklist.length;i++){
           if(checklist[i].checked==true)
             this.state.del_checklist_arr.push(checklist[i].value)
        }   

         var reason = document.getElementById("del_reason_arr").value;
        //  if(reason=="1"){
        //     console.log("未联系")
        //    // getData(getRouter(BATCH_DELETE_STUDENT), { session: sessionStorage.session, ids: this.state.del_checklist_arr,reason:reason }, cb, { id: id });
        // }else if(reason=="2"){
        //      console.log("短期内无法参加培训")
        //  }else if(reason=="3"){
        //     console.log("该人员已离职")
        // }
        getData(getRouter(BATCH_DELETE_STUDENT), { session: sessionStorage.session, ids: this.state.del_checklist_arr,reason:reason }, cb, { id: id });     
    }
    editClazzDialog = () => {
        return (
            <Dialog open={this.state.openEditClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    修改班级-{this.state.selected["id"]}-{this.state.selected["ti_id"]?getInst(this.state.selected["ti_id"]):""}
                    -{this.state.selected["area_id"]?getCity(this.state.selected["area_id"]):""}
                    -{this.state.selected["course_id"]?getCourse(this.state.selected["course_id"]):""}
            </DialogTitle>
                <DialogContent>
                    <div>
                        <TextField
                            className="nyx-clazz-message"
                            key={"class_head"}
                            id={"class_head"}
                            label={"班主任"}
                            value={this.state.selected["class_head"] === null ? "" : this.state.selected["class_head"]}
                            onChange={(event) => {
                                this.state.selected["class_head"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-clazz-message"
                            key={"teacher"}
                            id={"teacher"}
                            label={"老师"}
                            value={this.state.selected["teacher"] === null ? "" : this.state.selected["teacher"]}
                            onChange={(event) => {
                                this.state.selected["teacher"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-clazz-message"
                            key={"address"}
                            id={"address"}
                            label={"开班地址"}
                            value={this.state.selected["address"] === null ? "" : this.state.selected["address"]}
                            onChange={(event) => {
                                this.state.selected["address"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                       <div
                       className="nyx-input-date nyx-clazz-message"
                       >
                       <span 
                       >开始时间</span>
                        <input
                       // id="train_starttime"
                         style={{}}
                          type="date"
                          defaultValue={this.state.selected_start_year+"-"+this.state.selected_start_month+"-"+this.state.selected_start_date}
                          onChange={(event) => {
                              var year=event.target.value.substr(0,4),
                                  month=event.target.value.substr(5,2),
                                  date=event.target.value.substr(8,2)
                                  this.state.selected["train_starttime"]=year+month+date;
                             
                          }}
                        />
                       </div>
                       <div
                       className="nyx-input-date nyx-clazz-message"
                       >
                       <span 
                       >结束时间</span>
                        <input
                       // id="train_starttime"
                         style={{}}
                          type="date"
                          defaultValue={this.state.selected_end_year+"-"+this.state.selected_end_month+"-"+this.state.selected_end_date}
                          onChange={(event) => {
                              var end_year=event.target.value.substr(0,4),
                                  end_month=event.target.value.substr(5,2),
                                  end_date=event.target.value.substr(8,2)
                                  this.state.selected["train_endtime"]=end_year+end_month+end_date;
                             
                          }}
                        />
                       </div>
                        <TextField
                            className="nyx-clazz-message"
                            key={"class_code"}
                            id={"class_code"}
                            label={"班级编号"}
                            value={this.state.selected["class_code"] === null ? "" : this.state.selected["class_code"]}
                            onChange={(event) => {
                                this.state.selected["class_code"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-clazz-message"
                            key={"mobile"}
                            id={"mobile"}
                            label={"班主任电话"}
                            value={this.state.selected["mobile"] === null ? "" : this.state.selected["mobile"]}
                            onChange={(event) => {
                                this.state.selected["mobile"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                var class_head = (document.getElementById("class_head").value);
                                var teacher = (document.getElementById("teacher").value);
                                var address = (document.getElementById("address").value);
                                var train_starttime =  this.state.selected["train_starttime"];
                                var train_endtime = this.state.selected["train_endtime"];
                                var class_code = document.getElementById("class_code").value;
                                var mobile = (document.getElementById("mobile").value);
                                this.modifyClazz(this.state.selected.id, {
                                    class_head: class_head,
                                    teacher: teacher,
                                    address: address,
                                    train_starttime: train_starttime,
                                    train_endtime: train_endtime,
                                    class_code: class_code,
                                    mobile:mobile
                                })
                                this.handleRequestClose()
                                this.state.btns=0;
                                
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button>
                        <Button
                            onClick={() => {
                                this.handleRequestClose()
                            this.state.btns=0;

                            }}
                        >
                            {Lang[window.Lang].pages.main.cancel_button}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog >
        )

    }


    newClazzDialog = () => {
        return (
            <Dialog open={this.state.openNewClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    +新增班级
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.org.clazz.new}
                        </Typography>
                        <select
                            id="area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            {this.state.areas.map((area) => {
                                return <option key={area.id} value={area.id}>{area.area_name}</option>
                            })}
                        </select>
                        <select
                            id="course_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}
                        </select>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                var area_id = Number(document.getElementById("area_id").value);
                                var course_id = Number(document.getElementById("course_id").value);
                                if (isNaN(area_id)) {
                                    return;
                                }
                                if (isNaN(course_id)) {
                                    return
                                }
                                this.newClazz({
                                    area_id: area_id,
                                    course_id: course_id
                                })
                               // this.fresh();
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
            </Dialog >
        )
    }
    searchClazzDialog = () => {
        return (
            <Dialog
           
            open={this.state.searchClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    查询
                    <Button className="nyx-org-btn-sm"
                           style={{marginRight:"0.5rem",marginTop:"-0.5rem",float:"right"}}
                                color="primary"
                                raised 
                                onClick={() => {
                                    this.state.loading=true;
                                    if(this.state.search_company==""&&this.state.search_account==""&&this.state.search_id==""){
                                        this.state.loading=false;
                                        this.popUpNotice(NOTICE, 0, "请输入查询信息");
                                        return
                                    }
                                this.search_message()
                               // console.log( this.state.tableSearchData);
                                }}
                            >
                             {Lang[window.Lang].pages.org.clazz.search}
                        </Button>
                        </DialogTitle>
                    
                        <DialogContent
                        style={{padding:0,fontSize:"12px"}}
                        >
                        <TextField
                        style={{ top: "0rem", marginLeft: 10,width:"200px" }}
                        id="search_company"
                        label={"搜索公司名称"}
                        onChange={event => {
                            this.setState({
                                search_company: event.target.value,
                            });
                        }}
                    />
             <TextField
                style={{ top: "0rem", marginLeft: 10,width:"175px" }}
                id="search_account"
                label={"学员"}
                onChange={event => {
                    this.setState({
                        search_account: event.target.value,
                    });
                }}
            />
             <TextField
                style={{ top: "0rem", marginLeft: 10,width:"175px" }}
                id="search_id"
                label={"学员编号"}
                onChange={event => {
                    this.setState({
                        search_id: event.target.value,
                    });
                }}
            />




            <div id="search_list">
            {this.state.loading==true?<BeingLoading /> : ''}
            <table 
            className="nyx-search-table"
            >
                <tr>
                    <td>学员编号</td><td>班级号</td><td>姓名</td><td>公司全称</td>
                </tr>
                    {this.state.tableSearchData.map(student => {
                        return <tr>
                        <td title={student.student_id}>{student.student_id}</td><td title={student.class_id}>{student.class_id}</td><td title={student.student_name}>{student.student_name}</td><td title={student.company_name}>{student.company_name}</td>
                    </tr>
                    })}
            </table>
            </div>
                </DialogContent>
                <DialogActions>
                    <div>
                       
                        <Button
                            onClick={() => {
                                this.handleRequestClose()
                            }}
                        >
                            {Lang[window.Lang].pages.main.cancel_button}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog >
        )
    }

    handleRequestClose = () => {
        this.setState({
            openNewClazzDialog: false,
            searchClazzDialog: false,
            openEditClazzDialog: false
        })
    }

    handleDownloadFile = () => {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        var that = this;
        window.webkitStorageInfo.requestQuota(window.PERSISTENT, 1024 * 1024, function (grantedBytes) {
            window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
                fs.root.getFile(that.state.filename + '.csv', { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            if (fileWriter.length === 0) {
                                var bolb = new Blob(that.state.download_data, { type: "text/plain;charset=utf-8" });
                                fileWriter.write(bolb);
                            } else {
                                if (that.state.download_flag === false) {
                                }
                            }
                        };
                        fileWriter.onerror = function (e) {
                            //文件创建失败  
                        };
                        /**************************************************************/

                        var url = fileEntry.toURL();
                        document.getElementById("downloadData").href = url;
                        document.getElementById("downloadData").download = that.state.filename + ".csv"
                        that.state.download_flag = true;
                        fileWriter.truncate(0);

                    }, function () { });

                }, function () { });
            });
        }, function (e) {
        });
    }



    /**
     * 按班级建造下载数据
     */
    handleMakeDownloadData = (result) => {
        var downloadData = [new Uint8Array([0xEF, 0xBB, 0xBF])];
        var tableHeadKey = ['student_id', 'student_name', 'company_name', 'company_admin', 'mobile', 'mail', 'time'];
        var tableHeadTitle = ['学生id', '姓名', '公司', '管理员', '电话', '邮箱', '注册时间']
        var tableContent = [];
        var item = [];
         console.log(result)
        tableContent.push(tableHeadTitle.join(','));
        for (var j = 0; j < result.length; j++) {
            item = [];
            for (var key = 0; key <= tableHeadKey.length; key++) {
                switch (tableHeadKey[key]) {
                    case 'time':
                        item.push(getTimeString(result[j][tableHeadKey[key]]));
                        break;
                    default:
                        // console.log(result[j][tableHeadKey[key]]);
                        item.push(result[j][tableHeadKey[key]]);
                        break;
                }
            }
            tableContent.push(item.join(','));
        }

        downloadData.push(tableContent.join('\n'));
        this.setState({
            // download_num: message.count,
            filename: downloadTimeString(Math.round(new Date().getTime())) + "_" + result.length,
            // showRechargeInfo: "download"
        })
        this.state.download_data = downloadData;
        this.state.filename = downloadTimeString(Math.round(new Date().getTime())) + "_" + result.length;
        this.handleDownloadFile();

    }

    handleUptateAllData = (newData) => {
      //  this.state.allData=[];
        this.state.allData = this.state.allData.concat(newData);
        

    }

    handleUpdateData = (page) => {
        if (page <= 0) {
            page = 1;
        }
        if (page > this.state.totalPage) {
            page = this.state.totalPage;
        }
        this.state.currentPage = page;
        if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
           this.queryStudents((Math.floor((this.state.currentPage - 1) / 4) + 1));
        } else {
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.state.onloading = false;
            this.state.tableData = data;
            this.setState({ tableData: data }); 
            if (data.length > 0) {
                var allCheckBox = true;
                this.state.currentPageSelectedID = [];
                for (var i = 0; i < data.length; i++) {
                    if (this.state.selectedStudentID.indexOf(data[i].id) === -1) {
                        allCheckBox = false;
                    } else {
                        this.state.currentPageSelectedID.push((this.state.currentPage - 1) * this.state.rowsPerPage + i + 1)
                    }
                }

                if (allCheckBox === true) {
                    document.getElementById('select-all-checkbox').checked = true;
                } else {
                    document.getElementById('select-all-checkbox').checked = false;
                }
            }
        }
    }

    showPre = () => {
        this.handleUpdateData(this.state.currentPage - 1);
    }

    showNext = () => {
        if (this.state.onloading === true) {
            return;
        } else {
            this.handleUpdateData(this.state.currentPage + 1);
        }
    }

    onRowsDeselected = (rowArray) => {
        var tranform = new Set(this.state.selectedStudentID);
        this.state.selectedStudentID = [...tranform];
        if (rowArray.length > 1) {
            for (var j = 0; j < rowArray.length; j++) {
                if (this.state.selectedStudentID.indexOf(rowArray[j].row.student_id) === -1) {
                } else {
                    this.state.selectedStudentID.splice(this.state.selectedStudentID.indexOf(rowArray[j].row.student_id), 1);
                }
                if (this.state.currentPageSelectedID.indexOf(rowArray[j].row.id) === -1) {

                } else {
                    this.state.currentPageSelectedID.splice(this.state.currentPageSelectedID.indexOf(rowArray[j].row.id), 1);
                }
            }
        } else {
            var index = this.state.selectedStudentID.indexOf(rowArray[0].row.student_id);
            this.state.selectedStudentID.splice(index, 1);
            var currentPageIndex = this.state.currentPageSelectedID.indexOf(rowArray[0].row.id);
            this.state.currentPageSelectedID.splice(currentPageIndex, 1);
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedStudentID: this.state.selectedStudentID
        })
    }

    onRowsSelected = (rowArray) => {
        if (rowArray.length > 1) {
            for (var i = 0; i < rowArray.length; i++) {
                this.state.selectedStudentID.push(rowArray[i].row.student_id);
                this.state.currentPageSelectedID.push(rowArray[i].row.id);
            }
        } else {
            this.state.selectedStudentID.push(rowArray[0].row.student_id);
            this.state.currentPageSelectedID.push(rowArray[0].row.id)
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedStudentID: this.state.selectedStudentID
        })
    }


    handleSelection = (index, row) => {
        if (this.state.selectedStudentID.indexOf(row.student_id) === -1) {
            this.state.selectedStudentID.push(row.student_id);
            this.state.currentPageSelectedID.push((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1)
        } else {
            this.state.selectedStudentID.splice(this.state.selectedStudentID.indexOf(row.student_id), 1);
            if (this.state.currentPageSelectedID.indexOf((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1) !== -1) {
                this.state.currentPageSelectedID.splice(this.state.currentPageSelectedID.indexOf((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1), 1)
            }
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedStudentID: this.state.selectedStudentID
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
       if(open==false){
           this.state.btns=0;
       }
        this.setState({
            right: open,
            showInfo: true
        });
    };
    cancelDrawer = (open) => () => {
        if(open==false){
           // this.state.btns=0;
        }
         this.setState({
             cancelright: open,
             cancelshowInfo: true
         });
     };

    getCondition = () => {
        var chips = []
        for (var k in this.state.queryCondition) {
            if (k === "area_id" && this.state.queryCondition.area_id != null) {
                chips.push(
                    <Chip className="nyx-chip"
                        label={"地区" + ":" + getCity(this.state.queryCondition[k])}
                        onRequestDelete={() => {
                            delete (this.state.queryCondition[k]);
                            this.setState({ queryCondition: this.state.queryCondition })
                        }}
                    />
                )
            } else if (k === "course_id" && this.state.queryCondition.course_id != null) {
                chips.push(
                    <Chip className="nyx-chip"
                        label={"课程" + ":" + getCourse(this.state.queryCondition[k])}
                        onRequestDelete={() => {
                            delete (this.state.queryCondition[k]);
                            this.setState({ queryCondition: this.state.queryCondition })
                        }}
                    />

                )
            } else if (k === "company_name" && this.state.queryCondition[k] !== "") {
                chips.push(
                    <Chip className="nyx-chip"
                        label={"公司" + ":" + this.state.queryCondition[k]}
                        onRequestDelete={() => {
                            delete (this.state.queryCondition[k]);
                            this.setState({ queryCondition: this.state.queryCondition })
                        }}
                    />
                )
            }
        }
        return chips
    }
    cancelTrain = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.selectedStudentID = [];
                this.state.currentPageSelectedID = [];
                this.queryStudents(1, true)
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            // clazz_id: id,
            student_ids: this.state.selectedStudentID
        }

        getData(getRouter(UNCHOOSE_STUDENT), obj, cb, {});
    }


    clazz_item = (clazz) => {
           
        return (
                 <div key={clazz.id}
                                className={this.state.btns==clazz.id?"nyx-clazz-card-block":"nyx-clazz-card"}
                               >
                                <div className="nyx-card-body" style={{minHeight:"40px"}}>
                                <span title={clazz.id} className="nyx-clazz-id">{clazz.id}</span>
                                <span title={getCity(clazz.area_id)} className="nyx-clazz-area-id">{getCity(clazz.area_id)}</span>
                                <span title={clazz.address?clazz.address:""} className="nyx-clazz-address">{clazz.address?clazz.address:""}</span>
                                <span title={getCourse(clazz.course_id)} className="nyx-clazz-course-id">{getCourse(clazz.course_id)}</span>
                                <span title={getInst(clazz.ti_id)} className="nyx-clazz-ti-id">{getInst(clazz.ti_id)}</span>
                                <span title={clazz.class_head?clazz.class_head:""} className="nyx-clazz-head">{clazz.class_head?clazz.class_head:""}</span>
                                <span title={clazz.train_starttime?clazz.train_starttime:""} className="nyx-clazz-start-time">{clazz.train_starttime?clazz.train_starttime:""}</span>
                                
                          <span className="nyx-clazz-num">{clazz.agree_num ? "("+clazz.agree_num :"(0"}<span className="nyx-clazz-nums">/{clazz.num ? clazz.num + ")": "0)"}</span></span>
                                        </div>
                                   
                                    {
                                        this.state.stateSelected && this.state.selected.id === clazz.id ? <div>
                                            <CardActions className="nyx-card-action">
                                                <Button
                                                    className="nyx-clazz-card-button"
                                                    dense
                                                    onClick={() => {
                                                        this.state.resit_btn=0;
                                                        this.setState({
                                                            queryCondition: {},
                                                            selected: {},
                                                            stateSelected: false
                                                        })
                                                        {this.state.openResitTrain==true?this.createResitTrain(clazz.id): this.createTrain(clazz.id)}
                                                       
                                                        
                                                        if(this.state.selectedStudentID.length==0){
                                                            {this.fresh()
                                                            
                                                            }
                                                        }
                                                       
                                                        document.getElementById("search_course_id").value=null;
                                                        document.getElementById("search_area_id").value=null;
                                                    }}>
                                                    {"确定"}
                                                </Button>
                                                <Button
                                                    className="nyx-clazz-card-button"
                                                    dense
                                                    onClick={() => {
                                                        this.setState({
                                                            queryCondition: {},
                                                            selected: {},
                                                            stateSelected: false,
                                                            openResitTrain:false
                                                        })
                                                        this.state.queryCondition = {};
                                                        this.queryStudents(1, true);
                                                        this.state.btns=0;
                                                        this.state.resit_btn=0;
                                                        document.getElementById("search_course_id").value=null;
                                                        document.getElementById("search_area_id").value=null;
                                                        return
                                                    }}>
                                                    {"取消"}
                                                </Button>
                                            </CardActions>
                                        </div> :
                                            <div 
                                          
                                            >
                                                <CardActions style={{ height: "45px",marginLeft:"1.5rem" }}  className="nyx-card-action">
                                                    <i
                                                        className="glyphicon glyphicon-pencil"
                                                        onClick={(e) => {
                                                            this.state.btns=clazz.id;
                                                           // var event_parent=e.target.parentNode.parentNode;
                                                            //event_parent.style.display="block"
                                                           // console.log(e.target.parentNode.parentNode)
                                                          // this.state.btns=true
                                                       //   this.state.selected.btns=true;
                                                            this.state.selected = clazz;
                                                            this.state.selected_start_year = this.state.selected["train_starttime"]==null?"":this.state.selected["train_starttime"].substr(0,4)
                                                            this.state.selected_start_month = this.state.selected["train_starttime"]==null?"":this.state.selected["train_starttime"].substr(4,2)
                                                            this.state.selected_start_date = this.state.selected["train_starttime"]==null?"":this.state.selected["train_starttime"].substr(6,2)

                                                            this.state.selected_end_year = this.state.selected["train_endtime"]==null?"":this.state.selected["train_endtime"].substr(0,4)
                                                            this.state.selected_end_month = this.state.selected["train_endtime"]==null?"":this.state.selected["train_endtime"].substr(4,2)
                                                            this.state.selected_end_date = this.state.selected["train_endtime"]==null?"":this.state.selected["train_endtime"].substr(6,2)
                                                           
                                                            // this.state.showInfo = true;
                                                            this.setState({ openEditClazzDialog: true });
                                                        }}>
                                                    </i>
                                                    <i
                                                        className="glyphicon glyphicon-trash"
                                                        onClick={() => {
                                                            //  return
                                                            this.state.btns=clazz.id;
                                                            this.popUpNotice(ALERT, 0, "删除该班级", [
                                                                () => {
                                                                    // this.removeStudent(clazz.id);
                                                                    this.state.btns=0;
                                                                    this.state.selected = clazz;
                                                                    this.deleteClazz(clazz.id);
                                                                    //this.fresh();
                                                                    this.closeNotice();
                                                                }, () => {
                                                                    this.state.btns=0;
                                                                    this.closeNotice();
                                                                }]);
                                                        }}>
                                                    </i>
                                                    <i
                                                        className="glyphicon glyphicon-search"
                                                        onClick={() => {
                                                            this.state.btns=clazz.id;
                                                            this.state.selected = clazz;
                                                            this.state.stateSelected = false;
                                                            this.state.showStudents = false;
                                                            this.queryClazzStudents(clazz.id);
                                                            this.toggleDrawer(true)()
                                                        }}>
                                                    </i>
                                                    <Button
                                                        raised
                                                        color="primary"
                                                        className="nyx-org-btn-sm"
                                                      //  style={{ minWidth:"70px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                                                        onClick={() => {
                                                            this.state.btns=clazz.id;
                                                            this.state.selected = clazz;
                                                            this.state.showStudents = true;
                                                            this.state.queryCondition = {}
                                                            this.state.queryCondition.course_id = clazz.course_id;
                                                            document.getElementById("search_course_id").value=clazz.course_id;
                                                            document.getElementById("search_area_id").value=clazz.area_id;
                                                            this.state.queryCondition.area_id = clazz.area_id;
                                                            this.setState({
                                                                stateSelected: true,
                                                                selectedStudentID:[]
                                                                //search_course_id:clazz.course_id,
                                                               // search_area_id:search_area_id
                                                            })
                                                            this.queryStudents(1, true);
                                                        }}>
                                                        {"+培训"}
                                                    </Button>
                                                    <Button
                                                        raised
                                                        color="primary"
                                                        className="nyx-org-btn-sm"
                                                      //  style={{ minWidth:"70px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                                                        onClick={() => {
                                                            this.state.resit_btn=1;
                                                            this.state.btns=clazz.id;
                                                            this.state.selected = clazz;
                                                            this.state.showStudents = true;
                                                            this.state.queryCondition = {}
                                                            this.state.queryCondition.course_id = clazz.course_id;
                                                            document.getElementById("search_course_id").value=clazz.course_id;
                                                            document.getElementById("search_area_id").value=clazz.area_id;
                                                            this.state.queryCondition.area_id = clazz.area_id;
                                                            this.setState({
                                                                stateSelected: true,
                                                                selectedStudentID:[],
                                                                openResitTrain:true
                                                                //search_course_id:clazz.course_id,
                                                               // search_area_id:search_area_id
                                                            })
                                                            this.resitStudents(1, true);
                                                        }}>
                                                        {"+补考"}
                                                    </Button>
                                                   
                                                </CardActions>
                                            </div>
                                    }
                                </div>)
      
       
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{ marginTop: 80, width: "100%" }}>

                <div className="nyx-left-list" >
                    {this.state.clazzStudents.map(student => {
                        // console.log(student);
                        <Card
                            key={student.id}
                        >

                            <CardContent>
                                <Typography>
                                    {student.id}
                                </Typography>
                                <Typography component="h2">
                                    {student.student_name}
                                </Typography>
                                <Typography component="p">
                                    {student.company_name}
                                </Typography>
                                <Typography component="p">
                                    {student.company_admin}
                                </Typography>
                                <Typography type="body1">
                                    {student.mobile}
                                </Typography>
                                <Typography component="p">
                                    {student.mail}
                                </Typography>
                                <Typography component="p">
                                    {student.time}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    dense
                                    onClick={() => {

                                    }}>
                                    {"删除"}
                                </Button>
                            </CardActions>
                        </Card>
                    })}
                    <List className="nyx-clazz-list" subheader={<ListSubheader
                    style={{margin:0,float:"left",width:"35%"}}
                    className="nyx-class-list-title" >{Lang[window.Lang].pages.org.clazz.clazz_list}</ListSubheader>}>
                         <Button className="nyx-org-btn-sm"
                            style={{marginTop:"19px",top:"-0.5rem"}}
                                color="primary"
                                raised 
                                onClick={() => {
                                    this.state.tableSearchData=[],
                                    this.setState({
                                        searchClazzDialog: true
                                    });
                                }}
                            >
                                {Lang[window.Lang].pages.org.clazz.search}
                            </Button>
                            <Button className="nyx-org-btn-sm"
                           style={{marginTop:"19px",top:"-0.5rem"}}
                                color="primary"
                                raised 
                                onClick={() => {
                                    this.setState({
                                        openNewClazzDialog: true
                                    });
                                }}
                            >
                                {Lang[window.Lang].pages.org.clazz.new}
                            </Button>
                           
                       <select
                            style={{ marginLeft: "0.5rem",position:"relative",marginBottom:"1rem",width:"5rem" }}
                            className="nyx-info-select-lg"
                            id="search_clazz_area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                           
                            defaultValue={this.state.search_clazz_area_id === null ? "" : this.state.search_clazz_area_id}
                            onChange={(e) => {
                                //this.state.class_number=0;
                                this.state.change_area=1;
                                this.state.search_clazz_area_id = e.target.value == "null" ? null : e.target.value;
                                this.state.search_clazzes=[];
                                //console.log(this.state.clazzes)
                                {this.state.clazzes.map(
                                    clazz =>{
                                        if(this.state.search_clazz_area_id == null&&this.state.search_clazz_course_id==null){
                                            this.state.search_clazzes.push(clazz)
                                        }else if(clazz.area_id==this.state.search_clazz_area_id&&this.state.search_clazz_course_id==null){
                                            this.state.search_clazzes.push(clazz)
                                            }else  if(this.state.search_clazz_area_id == clazz.area_id&&clazz.course_id==this.state.search_clazz_course_id){
                                                this.state.search_clazzes.push(clazz) 
                                            }else if(this.state.search_clazz_area_id == null&&clazz.course_id==this.state.search_clazz_course_id){
                                                this.state.search_clazzes.push(clazz)
                                            }    

                                        // if(clazz.area_id==this.state.search_clazz_area_id){
                                        //     this.state.search_clazzes.push(clazz)
                                            
                                        // }
                                    })}
                                    {this.fresh()}
                                
                            }}
                        >
                            <option value={"null"}>{"-省市-"}</option>
                            {getAreas().map(area => {
                                return <option key={area.id} value={area.id}>{area.area_name}</option>
                            })}
                        </select>
                        <select
                            style={{ marginLeft: "0.5rem",position:"relative",marginBottom:"1rem",width:"6rem"}}
                            className="nyx-info-select-lg"
                            id={"search_clazz_course_id"}
                            //defaultValue={this.state.search_clazz_course_id === null ? "" : this.state.search_clazz_course_id}
                            onChange={(e) => {
                                //this.state.class_number=0;
                                this.state.change_course=1;
                                this.state.search_clazz_course_id = e.target.value == "null" ? null : e.target.value;
                                this.state.search_clazzes=[];
                                //console.log(this.state.clazzes)
                                {this.state.clazzes.map(
                                    clazz =>{
                                        if(this.state.search_clazz_area_id == null&&this.state.search_clazz_course_id==null){
                                            this.state.search_clazzes.push(clazz)
                                        }else if(clazz.area_id==this.state.search_clazz_area_id&&this.state.search_clazz_course_id==null){
                                            this.state.search_clazzes.push(clazz)
                                            }else  if(this.state.search_clazz_area_id == clazz.area_id&&clazz.course_id==this.state.search_clazz_course_id){
                                                this.state.search_clazzes.push(clazz) 
                                            }else if(this.state.search_clazz_area_id == null&&clazz.course_id==this.state.search_clazz_course_id){
                                                this.state.search_clazzes.push(clazz)
                                            }    

                                        // if(clazz.area_id==this.state.search_clazz_area_id){
                                        //     this.state.search_clazzes.push(clazz)
                                            
                                        // }
                                    })}
                                    {this.fresh()}
                            }}
                        >
                            <option value={"null"}>{"-课程名称-"}</option>
                            {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                        </select>
                        <span style={{
                            marginLeft:"0.5rem"
                        }}>开班数:{this.state.change_area==0&&this.state.change_course==0?this.state.clazzes.length:this.state.search_clazzes.length}</span>
                      {this.state.clazzes.map(
                            clazz =>{
                             if(this.state.search_clazz_area_id == null&&this.state.search_clazz_course_id==null){
                                return <div>
                                {this.clazz_item(clazz)}
                            </div>    
                            }else if(clazz.area_id==this.state.search_clazz_area_id&&this.state.search_clazz_course_id==null){
                                   return <div>
                                    {this.clazz_item(clazz)}
                                </div>
                                }else  if(this.state.search_clazz_area_id == clazz.area_id&&clazz.course_id==this.state.search_clazz_course_id){
                                    return <div>
                                    {this.clazz_item(clazz)}
                                </div>    
                                }else if(this.state.search_clazz_area_id == null&&clazz.course_id==this.state.search_clazz_course_id){
                                    return <div>
                                    {this.clazz_item(clazz)}
                                </div>    
                                }

                                //  this.setState({search_clazzes:this.state.search_clazzes})
                            })}
                       {/* {console.log(this.state.search_clazzes)}
                       {console.log(this.state.clazzes)} */}
                    </List>
                    <Drawer

                        anchor="right"
                        open={this.state.right}
                        onRequestClose={this.toggleDrawer(false)}
                    >
                        <div key="draw-class"  style={{ width: "500px" }}>

                        <div className="nyx-clazz-list" style={{boxShadow:"none",width:"100%",paddingTop:10}}>
                            <Button
                            raised
                                color="primary"
                                id='downloadData'
                                href="#"
                                download
                                onClick={() => {

                                }}
                               // className="nyx-org-btn-sm"            
                              // className="nyx-org-btn-sm"
                               style={{margin: 0,marginLeft:15,padding:"0",minHeight:30,minWidth:50 }}
                            >
                                {"下载"}
                            </Button>
                            <Button
                            raised
                                color="primary"
                                className="nyx-org-btn-lg"
                                style={{margin: 0,marginLeft:5,padding:"0" }}
                                onClick={
                                    () => {
                                        this.popUpNotice(ALERT, 0, "导出本班级学生信息", [
                                            () => {
                                                // console.log(this.state.my_institution);
                                                var href = getRouter("export_csv_classid").url + "&session=" + sessionStorage.session + "&clazz_id=" + this.state.selected.id;
                                                var a = document.createElement('a');
                                                a.href = href;
                                                // console.log(href);
                                                a.click();
                                                this.closeNotice();
                                            }, () => {
                                                this.closeNotice();
                                            }]);
                                    }
                                }
                            >
                                {"导出详细信息"}
                            </Button>
                           


                                                    <TextField
                                                    style={{width:"70%",marginLeft:"1rem"}}
                                                        className="nyx-form-div"
                                                        key={"id_list"}
                                                        id="id_list"
                                                        
                                                        >
                                                    </TextField>
                                                    <Button
                                                        raised
                                                            color="primary"
                                                            id='checked_id_list'
                                                           
                                                            onClick={() => {
                                                                 var checklist = document.getElementsByName("selected");
                                                                  this.state.checklist_arr=[];
                                                                for(var m=0;m<this.state.clazzStudents.length;m++){
                                                                    this.state.checklist_arr.push(this.state.clazzStudents[m].student_id)
                                                                }

                                                                 for(var i=0;i<checklist.length;i++){
                                                                    checklist[i].checked=false;
                                                                     
                                                                 }
                                                                 var leading_in =document.getElementById("id_list").value;
                                                                  this.state.leading_in_arr=[];
                                                                 var leading_ins=leading_in.split(" ");
                                                                for (i=0;i<leading_ins.length ;i++ ) 
                                                                { 
                                                                    this.state.leading_in_arr.push(leading_ins[i])
                                                                } 
                                                               this.state.same_check_arr=[];
                                                                for(var i=0;i<this.state.leading_in_arr.length;i++){
                                                                    for(var j=0;j<this.state.clazzStudents.length;j++){

                                                                        if(this.state.leading_in_arr[i]==this.state.clazzStudents[j].student_id){
                                                                           

                                                                            for(var m=0;m<checklist.length;m++){
                                                                                if(this.state.clazzStudents[j].id==checklist[m].value){
                                                                                    this.state.same_check_arr.push(checklist[m].value)
                                                                                    checklist[j].checked=true;
                                                                                   
                                                                                }
                                                                            }
                                                                          
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        style={{margin: 0,marginLeft:15,padding:"0",minHeight:30,minWidth:50 }}
                                                        >
                                                            {"选择"}
                                                        </Button>
                                                        <i
                                                        title="将学生id输入,以空格符分隔，进行批量选择"
                                                        style={{marginTop:"-1px",marginLeft:"5px"}}
                                                        >?</i>
                                                        <br/>
                                                        <input 
                                                        id="controlAll"
                                                        style={{margin:"1rem 0rem 0 1.39rem"}}
                                                        onClick={()=>{
                                                            var checklist = document.getElementsByName("selected");
                                                            if(document.getElementById("controlAll").checked) {
                                                                for(var i = 0; i < checklist.length; i++) {
                                                                    checklist[i].checked = 1;
                                                                }
                                                            } else {
                                                                for(var j = 0; j < checklist.length; j++) {
                                                                    checklist[j].checked = 0;
                                                                }
                                                            }
                                                        }}
                                                        type="checkbox"/> <span>全选</span>
                                                        
                                                        <Button
                                                        raised
                                                        color="primary"
                                                        className="nyx-org-btn-sm"
                                                        style={{margin: 0,marginLeft:20,padding:"0" }}
                                                        onClick={() => {
                                                            var checklist = document.getElementsByName("selected");
                                                            
                                                                for(var i = 0; i < checklist.length; i++) {
                                                                    if(checklist[i].checked==true){
                                                                        checklist[i].checked =false
                                                                    }else{
                                                                        checklist[i].checked =true
                                                                    }
                                                                }
                                                        }}>
                                                        {"反选"}
                                                    </Button>
                                                  <Button
                                                   // data_id={clazz.num}
                                                   disabled={this.state.selected.num-this.state.selected.agree_num == 0 ? true : false}
                                                        raised
                                                        color="primary"
                                                        className="nyx-org-btn-md"
                                                        style={{margin: 0,marginLeft:20,padding:"0" }}
                                                        onClick={() => {
                                                            var checklist = document.getElementsByName("selected");
                                                            var m=0;
                                                            for(var i = 0; i < checklist.length; i++) {

                                                                if(checklist[i].checked==true){
                                                                    m++
                                                                }
                                                            }
                                                           if(m==0){
                                                            this.popUpNotice(NOTICE, 0, "请选择学员");
                                                            return false
                                                           }
                                                           // console.log(this.state.selected.id);
                                                            this.popUpNotice(ALERT, 0, "同意已选择学员考试", [
                                                                () => {
                                                                    
                                                                  //  console.log(this.state.clazzStudents)
                                                                  //  this.state.selected = clazz;
                                                                    this.agreecheckStudent(this.state.selected.id);
                                                                    this.closeNotice();
                                                                }, () => {
                                                                    this.closeNotice();
                                                                }]);
                                                            // this.agreeAllStudent(); 
                                                        }}>
                                                        {"批量同意"}
                                                    </Button>
                                                    <Button
                                                   // data_id={clazz.num}
                                                        raised
                                                        color="primary"
                                                        className="nyx-org-btn-md"
                                                        style={{margin: 0,marginLeft:20,padding:"0" }}
                                                        onClick={() => {
                                                            var checklist = document.getElementsByName("selected");
                                                            var m=0;
                                                            for(var i = 0; i < checklist.length; i++) {
                                                                if(checklist[i].checked==true){
                                                                    m++
                                                                }
                                                            }
                                                           if(m==0){
                                                            this.popUpNotice(NOTICE, 0, "请选择学员");
                                                            return false
                                                           }
                                                           // console.log(this.state.selected.id);
                                                            this.popUpNotice(ALERT, 0,  <select
                                                                style={{marginLeft:"1rem"}}
                                                                id="del_reason_arr"
                                                                >
                                                                    <option value="0">未联系</option>
                                                                    <option value="1">1个月内参加</option>
                                                                    <option value="2">1-2个月内参加</option>
                                                                    <option value="3">2个月后参加</option>
                                                                    <option value="-1">该人员已离职</option>
                                                                </select>, [
                                                                () => {
                                                                this.delcheckStudent(this.state.selected.id)
                                                                    this.closeNotice();
                                                                }, () => {
                                                                    this.closeNotice();
                                                                }]);
                                                            // this.agreeAllStudent(); 
                                                        }}>
                                                        {"批量删除"}
                                                    </Button>
                            <p style={{marginLeft:"1.5rem"}}>培训学员</p>
                            {console.log(this.state.clazzStudents.sort(function(a,b){
                         return a.student_id-b.student_id;}))}
                            {this.state.clazzStudents.map(
                                student => {
                                   
                                    return <div className="nyx-clazz-student-name"

                                    >
                                     <input name={student.is_cancel == 1? "noselected" : "selected"} 
                                     disabled={student.is_cancel == 1? true : false}
                                     value={student.id} type="checkbox"/> 
                                    <div name="student_id_select" style={{width:"3rem"}} title={student.student_id} className="nyx-clazz-student-message">{student.student_id}</div><div style={{width:"3rem"}} title={student.student_name} className="nyx-clazz-student-message">{student.student_name}</div><div style={{width:"200px"}} title={student.company_name} className="nyx-clazz-student-message">{student.company_name}</div>
                                    {/* {this.state.cancel_list.map(cancel_list=>{
                                       console.log() 
                                    })} */}
                                        {student.is_cancel=="0"?<i
                                           className="glyphicon glyphicon-ok"
                                            style={student.reg_status == 2 ?{ float:"right",right:"1rem",color:"#9E9E9E",top:"-0.5rem"}:{ float:"right",right:"1rem",top:"-0.5rem"}}
                                            onClick={(e) => {
                                                if(student.reg_status == 2){
                                                    return;
                                                }
                                                var id = student.id;
                                                var cb = (router, message, arg) => {
                                                    this.popUpNotice(NOTICE, 0, message.msg);
                                                    this.state.allData=[];
                                                   this.fresh();
                                                }
                                                var event=e.target;
                                                event.style.color="#9E9E9E"
                                                getData(getRouter(AGREE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
                                            }}
                                        ></i>:<i
                                                title="该学员已申请取消报名"
                                                className="glyphicon glyphicon-exclamation-sign"
                                                style={{float:"right",right:"1rem",color:"#9E9E9E",top:"-0.5rem"}}
                                     ></i>}
                                        
                                         <i
                                             className="glyphicon glyphicon-trash" 
                                             title={student.is_cancel==1?"该学员已申请取消报名":""}
                                             style={student.is_cancel == 1 ?{ float:"right",right:"1rem",color:"#9E9E9E",top:"-0.5rem"}:{ float:"right",right:"1rem",top:"-0.5rem"}}                       
                                             //style={{ float:"right",right:"1rem",top:"-0.5rem"}}
                                             onClick={() => {
                                                if(student.is_cancel == 1){
                                                    return;
                                                }
                                                this.popUpNotice(ALERT, 0, <select
                                                style={{marginLeft:"1rem"}}
                                                id="del_reason"
                                                >
                                                    <option value="0">未联系</option>
                                                    <option value="1">1个月内参加</option>
                                                    <option value="2">1-2个月内参加</option>
                                                    <option value="3">2个月后参加</option>
                                                    <option value="-1">该人员已离职</option>
                                                    
                                                </select>, [
                                                    () => {
                                                        this.removeClassStudent(student.id)
                                                        this.closeNotice();
                                                    }, () => {
                                                        this.closeNotice();
                                                    }]);
                                                //this.removeClassStudent(student.id);
                                            }}
                                        ></i>
                                    </div>
                                    

                                })}
                                {this.state.clazzResitStudents.length!=0?<p style={{marginLeft:"1.5rem"}}>补考学员</p>:""}
                                {this.state.clazzResitStudents.map(
                                student => {
                                   
                                    return <div className="nyx-clazz-student-name"

                                    >
                                    
                                    <div style={{width:"3rem",marginLeft:"1.2rem"}} title={student.user_id} className="nyx-clazz-student-message">{student.user_id}</div><div style={{width:"3rem"}} title={student.student_name} className="nyx-clazz-student-message">{student.student_name}</div><div style={{width:"200px"}} title={student.company_name} className="nyx-clazz-student-message">{student.company_name}</div>
                                    {/* {this.state.cancel_list.map(cancel_list=>{
                                       console.log() 
                                    })} */}
                                       <i
                                           className="glyphicon glyphicon-ok"
                                            style={student.state == 2 ?{ float:"right",right:"1rem",color:"#9E9E9E",top:"-0.5rem"}:{ float:"right",right:"1rem",top:"-0.5rem"}}
                                            onClick={(e) => {
                                               
                                                var id = student.resit_id;
                                                var cb = (router, message, arg) => {
                                                    this.popUpNotice(NOTICE, 0, message.msg);
                                                    this.state.allData=[];
                                                   this.fresh();
                                                }
                                                var event=e.target;
                                                event.style.color="#9E9E9E"
                                                getData(getRouter(AGREE_RESIT), { session: sessionStorage.session, resit_id: id }, cb, { });
                                            }}
                                        ></i>
                                        
                                         <i
                                             className="glyphicon glyphicon-trash" 
                                           //  title={student.is_cancel==1?"该学员已申请取消报名":""}
                                             style={{float:"right",right:"1rem",top:"-0.5rem"}}                       
                                             //style={{ float:"right",right:"1rem",top:"-0.5rem"}}
                                             onClick={() => {
                                              
                                                this.popUpNotice(ALERT, 0, "删除"+student.student_name+"参加本次补考", [
                                                    () => {
                                                        this.removeResitClassStudent(student.resit_id)
                                                        this.closeNotice();
                                                    }, () => {
                                                        this.closeNotice();
                                                    }]);
                                                //this.removeClassStudent(student.id);
                                            }}
                                        ></i>
                                    </div>
                                    

                                })}
                        </div>
                        </div>
                    </Drawer>
                 
                </div>
                <Drawer
                       
                        anchor="right"
                        open={this.state.cancelright}
                        onRequestClose={this.cancelDrawer(false)}
                    >
                    <div style={{width:"600px"}}>                    
                      <input 
                         id="cancelControlAll"
                         style={{margin:"1rem 0rem 0 2rem"}}
                         onClick={()=>{
                             var checklist = document.getElementsByName("cancelselected");
                             if(document.getElementById("cancelControlAll").checked) {
                                 for(var i = 0; i < checklist.length; i++) {
                                     checklist[i].checked = 1;
                                 }
                             } else {
                                 for(var j = 0; j < checklist.length; j++) {
                                     checklist[j].checked = 0;
                                 }
                             }
                         }}
                         type="checkbox"/> <span>全选</span>
                         <Button
                            raised
                            color="primary"
                            className="nyx-org-btn-md"
                            style={{margin: 0,marginLeft:20,padding:"0" }}
                            onClick={() => {
                                var checklist = document.getElementsByName("cancelselected");
                                var m=0;
                                for(var i = 0; i < checklist.length; i++) {

                                    if(checklist[i].checked==true){
                                        m++
                                    }
                                }
                                if(m==0){
                                this.popUpNotice(NOTICE, 0, "请选择学员");
                                return false
                                }
                                
                                this.popUpNotice(ALERT, 0, "同意已选择学员取消报名", [
                                    () => {
                                      //  console.log(this.state.selected.id)
                                    //  console.log(this.state.clazzStudents)
                                    //  this.state.selected = clazz;
                                        this.agreecheckCancelStudent(this.state.selected.cancel_id);
                                        this.closeNotice();
                                    }, () => {
                                        this.closeNotice();
                                    }]);
                                // this.agreeAllStudent(); 
                            }}>
                            {"批量同意"}
                        </Button>
                    {this.state.class_cancecl.map(class_cancecl =>{
                         return <div>
                             <div>
                             {
                                 this.state.clazzes.map(
                                    clazz =>{
                                        if(clazz.id==class_cancecl){
                                            return <div
                                            style={{margin:"1rem 1rem 0 1.39rem",borderTop:"1px solid #2196F3",paddingTop:"1rem"}}>
                                                {/* <input 
                                                    style={{margin:"1rem 0rem 0 1.39rem"}}
                                                    name={"cancelselected"}
                                                    onClick={()=>{
                                                        
                                                    }}
                                                    type="checkbox"/> */}
                                                班级{class_cancecl}-{getCity(clazz.area_id)}-{getCourse(clazz.course_id)}-{clazz.train_starttime}
                                               
                                        </div>
                                        }
                                    })
                             }
                             </div>
                             <div>
                            {this.state.cancel_list.map(cancel_list => {
                               // console.log(cancel_list.name)
                                if(cancel_list.class_id==class_cancecl){
                                    return <div 
                                    ><input 
                                    style={{margin:"1rem 0.5rem 0 2rem",height:"16px"}}
                                    name={"cancelselected"}
                                    value={cancel_list.cancel_id}
                                    type="checkbox"/> 
                                    <div
                                        title={cancel_list.name}
                                        className="nyx-clazz-student-message"
                                        style={{width:"80px"}}
                                    >{cancel_list.name}</div>
                                     <div
                                        title={cancel_list.c_name}
                                        className="nyx-clazz-student-message"
                                        style={{width:"150px"}}
                                    >{cancel_list.c_name}</div>
                                    <div
                                        title={cancel_list.reason}
                                        className="nyx-clazz-student-message"
                                        style={{width:"200px"}}
                                    >{cancel_list.reason}</div>
                                    <Button
                                        color="primary"
                                        raised 
                                        onClick={() => {
                                            this.agreeCancelStudent(cancel_list.cancel_id)
                                       
                                        }}
                                        className="nyx-org-btn-sm"                                            
                                        style={{ position:"relative",top:"-6px"}}
                                    >
                                        {"同意"}
                                    </Button>
                                  </div>
                                }
                                    })}

                             </div>
                         </div>
                    })}
                    
                    </div>
                     </Drawer>
                <div className="nyx-clazz-form">
                    <div className="nyx-right-top-search">
                        <TextField
                            style={{ top: "0rem", marginLeft: 30 }}
                            id="search_input"
                            label={"搜索公司名称"}
                          //  value={this.state.search_input}
                            onChange={event => {
                                this.setState({
                                    search_input: event.target.value,
                                });
                            }}
                        />
                        <i className="glyphicon glyphicon-remove nyx-company-empty"
                        onClick={()=>{
                            document.getElementById("search_input").value="";
                        }}
                        ></i>
                        {/* <button>X</button> */}
                        <select
                            style={{ marginLeft: "1rem",position:"relative",top:"0.5rem"}}
                            className="nyx-info-select-lg"
                            id="search_area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={this.state.search_area_id == null ? "" : this.state.search_area_id}
                            onChange={(e) => {
                                this.state.search_area_id = e.target.value == "null" ? null : e.target.value;
                                this.state.queryCondition.area_id = e.target.value == "null" ? null : e.target.value;
                            }}
                            disabled={this.state.stateSelected==true?true:false}
                            // disabled={this.state.stateSelected && this.state.selected.id === clazz.id?true:false}
                        >
                            <option value={"null"}>{"-省市-"}</option>
                            {getAreas().map(area => {
                                return <option key={area.id} value={area.id}>{area.area_name}</option>
                            })}
                        </select>
                        <select
                            style={{ marginLeft: "1rem",position:"relative",top:"0.5rem" }}
                            className="nyx-info-select-lg"
                            id={"search_course_id"}
                            defaultValue={this.state.search_course_id === null ? "" : this.state.search_course_id}
                            disabled={this.state.stateSelected==true?true:false}
                            onChange={(e) => {
                                this.state.search_course_id = e.target.value == "null" ? null : e.target.value;
                                this.state.queryCondition.course_id = e.target.value == "null" ? null : e.target.value;
                            }}
                        >
                            <option value={"null"}>{"-课程名称-"}</option>
                            {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                        </select>
                        <Button
                            color="primary"
                            raised 
                            onClick={() => {
                                this.state.queryCondition.company_name = document.getElementById("search_input").value;
                                this.state.selectedStudentID = [];
                                this.state.currentPageSelectedID = [];
                                {this.state.openResitTrain==true?this.resitStudents(1,true): this.queryStudents(1, true)}
                                                       
                            }}
                            className="nyx-org-btn-sm"                                            
                            style={{ margin: 15,marginLeft:30,position:"relative",top:"5px"}}
                        >
                            {"搜索"}
                        </Button>
                        <p style={{float:"right",margin:0,marginRight:"3rem",marginTop:"1.5rem",fontSize:"1rem",color:"#2196f3"}}>{this.state.openResitTrain==true?"补考报名列表":"培训报名列表"}</p>
                                                       
                        <br/>

                        {this.getCondition()}
                    </div>
                    <div className="nyx-right-bottom-table" >
                        <ReactDataGrid
                            rowKey="id"
                            columns={this.state.resit_btn==0?
                                [
                                    {
                                        key: "id",
                                        name: "序号",
                                        width: 40,
                                        resizable: true
                                    },
                                    {
                                        key: "student_name",
                                        name: "姓名",
                                        width: 80,
                                        resizable: true
                                    },
                                    {
                                        key: "company_name",
                                        name: "公司全称",
                                        width: 200,
                                        resizable: true
                                    },
                                    {
                                        key: "company_admin",
                                        name: "联系人",
                                        width: 80,
                                        resizable: true
                                    },
                                    
                                    {
                                        key: "detail",
                                        name: "分班记录",
                                        width: 100,
                                        resizable: true
                                    },
                                    {
                                        key: "area_name",
                                        name: "培训城市",
                                        width: 100,
                                        resizable: true
                                    },
                                    {
                                        key: "course_name",
                                        name: "课程",
                                        width: 100,
                                        resizable: true
                                    },{
                                        key: "company_mobile",
                                        name: "联系电话",
                                        width: 100,
                                        resizable: true
                                    },
                                    {
                                        key: "company_mail",
                                        name: "联系邮箱",
                                        width: 120,
                                        resizable: true
                                    },
                                ]:[
                                    {
                                        key: "id",
                                        name: "序号",
                                        width: 40,
                                        resizable: true
                                    },
                                    {
                                        key: "student_name",
                                        name: "姓名",
                                        width: 80,
                                        resizable: true
                                    },
                                    {
                                        key: "company_name",
                                        name: "公司全称",
                                        width: 200,
                                        resizable: true
                                    },
                                    {
                                        key: "company_admin",
                                        name: "联系人",
                                        width: 80,
                                        resizable: true
                                    },
                                    
                                    {
                                        key: "old_class_id",
                                        name: "培训班级",
                                        width: 100,
                                        resizable: true
                                    },
                                    {
                                        key: "area_name",
                                        name: "培训城市",
                                        width: 100,
                                        resizable: true
                                    },
                                    {
                                        key: "course_name",
                                        name: "课程",
                                        width: 100,
                                        resizable: true
                                    },{
                                        key: "company_mobile",
                                        name: "联系电话",
                                        width: 100,
                                        resizable: true
                                    },
                                    {
                                        key: "company_mail",
                                        name: "联系邮箱",
                                        width: 120,
                                        resizable: true
                                    },
                                ]
                            }
                            onGridSort={(sortColumn, sortDirection) => {
                                this.state.sort = {}
                                if (sortDirection === 'ASC') {
                                    this.state.sort[sortColumn] = 1
                                } else {
                                    this.state.sort[sortColumn] = -1
                                }
                            }}
                            
                            rowGetter={(i) => {
                                if (i === -1) { return {} }
                                return this.state.resit_btn==0?{
                                   
                                    id: this.state.allData.indexOf(this.state.tableData[i]) + 1,
                                    student_id: this.state.tableData[i].id,
                                    student_name: this.state.tableData[i].student_name,
                                    company_name: this.state.tableData[i].company_name,
                                    company_admin: this.state.tableData[i].company_admin,
                                    detail: this.state.tableData[i].detail,
                                    area_name: getCity(this.state.tableData[i].area_id),
                                    course_name: getCourse(this.state.tableData[i].course_id),
                                    company_mobile: this.state.tableData[i].company_mobile,
                                    company_mail: this.state.tableData[i].company_mail,
                                    
                                }:{
                                   
                                    id: this.state.allData.indexOf(this.state.tableData[i]) + 1,
                                    student_id: this.state.tableData[i].resit_id,
                                    student_name: this.state.tableData[i].student_name,
                                    company_name: this.state.tableData[i].company_name,
                                    company_admin: this.state.tableData[i].company_admin,
                                    old_class_id: getInst(this.state.tableData[i].train_institution)+this.state.tableData[i].train_class_id,
                                    area_name: getCity(this.state.tableData[i].area_id),
                                    course_name: getCourse(this.state.tableData[i].course_id),
                                    company_mobile: this.state.tableData[i].company_mobile,
                                    company_mail: this.state.tableData[i].company_mail,
                                    
                                }
                            }}
                            rowsCount={this.state.tableData.length}
                            onRowClick={(rowIdx, row) => {
                                if (rowIdx !== -1) {
                                    this.handleSelection(rowIdx, row);
                                }
                            }}
                            renderColor={(idx) => { return "black" }}
                            maxHeight={800}
                            enableRowSelect={true}
                            minHeight={500}
                            rowHeight={20}
                            rowSelection={{
                                showCheckbox: true,
                                onRowsSelected: this.onRowsSelected,
                                onRowsDeselected: this.onRowsDeselected,
                                selectBy: {
                                    keys: {
                                        rowKey: 'id',
                                        values: this.state.currentPageSelectedID
                                    }
                                }
                            }}
                            onGridKeyDown={(e) => {
                                if (e.ctrlKey && e.keyCode === 65) {
                                    e.preventDefault();

                                    let rows = [];
                                    this.state.tableData.forEach((r) => {
                                        rows.push(Object.assign({}, r, { isSelected: true }));
                                    });

                                    this.setState({ rows });
                                }
                            }}
                        />
                    </div>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.showPre();
                        }}
                        style={{ margin: 10 }}
                    >
                        {"上页"}
                    </Button>
                    {"第" + this.state.currentPage + "页" + "/" + "共" + this.state.totalPage + "页"}
                    <Button
                        color="primary"
                        onClick={() => {
                            this.showNext();
                        }}
                        style={{ margin: 10 }}
                    >
                        {"下页"}
                    </Button>

                    {"已选择" + this.state.selectedStudentID.length + "人/共" + this.state.count + "人"}
                    <Button
                    raised
                    color="primary"
                    className="nyx-org-btn-sm"
                  //  style={{ minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                        onClick={() => {
                            var all_area;
                            var all_course;
                            { this.state.search_area_id === null ? all_area = "所有地区" : all_area = getCity(this.state.search_area_id) }
                            { this.state.search_course_id === null ? all_course = "所有级别" : all_course = getCourse(this.state.search_course_id) }
                            this.popUpNotice(ALERT, 0, "导出的学生信息:【" + all_area + "】【 " + all_course + "】的人员", [
                                () => {
                                    // console.log(this.state.my_institution);
                                    var href = getRouter("export_csv").url + "&session=" + sessionStorage.session + "&is_inlist=1&institution=" + this.state.my_institution;
                                    if (this.state.queryCondition.area_id != undefined && this.state.queryCondition.area_id != null) {
                                        href = href + "&area_id=" + this.state.queryCondition.area_id;
                                    }
                                    if (this.state.queryCondition.course_id != undefined && this.state.queryCondition.course_id != null) {
                                        href = href + "&course_id=" + this.state.queryCondition.course_id;
                                    }
                                    var a = document.createElement('a');
                                    a.href = href;
                                    a.click();
                                    this.closeNotice();
                                }, () => {
                                    this.closeNotice();
                                }]);
                        }}
                    >导出</Button>
                    <Button
                    raised
                    color="primary"
                    className="nyx-org-btn-md"
                    //style={{minWidth:"70px",minHeight:"30px",margin:"0.2rem",padding:0}}
                        onClick={() => {
                            this.cancelTrain();
                        }}
                    >退回学生</Button>
                   
                    <Button
                    raised
                    color="primary"
                    className="nyx-org-btn-lg"
                    style={{top:"0.1rem"}}
                    //style={{minWidth:"70px",minHeight:"30px",margin:"0.2rem",padding:0}}
                        onClick={() => {
                            this.cancelDrawer(true)()
                            this.cancel_list()
                          //  this.cancelTrain();
                        }}
                    >
                     <i
                    className="glyphicon glyphicon-tasks"
                    style={{marginRight:"0.2rem",marginTop:"-2px"}}
                    ></i>
                    取消报名列表</Button>
                    {/* {this.state.showStudents === true ?
                        <Drawer
                            anchor="right"
                            open={this.state.right}
                            onRequestClose={this.toggleDrawer(false)}
                        >
                        </Drawer> : <div />} */}

                    {this.newClazzDialog()}
                    {this.searchClazzDialog()}
                    {this.editClazzDialog()}


                    <CommonAlert
                        show={this.state.alertOpen}
                        type={this.state.alertType}
                        code={this.state.alertCode}
                        content={this.state.alertContent}
                        action={this.state.alertAction}
                    >
                    </CommonAlert>

                </div>

            </div>
        )
    }

    removeClassStudent(id) {
        var cb = (route, message, arg) => {
            // if (message.code === Code.LOGIC_SUCCESS) {
            //     // this.setState({ clazzes: message.clazz })
            // }
            this.state.allData=[];
            this.fresh();
            this.queryClazzStudents(this.state.selected.id);
           
            this.popUpNotice(NOTICE, 0, message.msg);
            var checklist = document.getElementsByName("selected");
            for(var i=0;i<checklist.length;i++){
                checklist[i].checked=false
               
            }
            
        }
        var reason = document.getElementById("del_reason").value;
        // if(reason=="1"){
        //     console.log("未联系")
        //     getData(getRouter(BATCH_DELETE_STUDENT), { session: sessionStorage.session, ids: this.state.del_checklist_arr,reason:reason }, cb, { id: id });
        // }else if(reason=="2"){
        //      console.log("短期内无法参加培训")
        //  }else if(reason=="3"){
        //     console.log("该人员已离职")
        // }
        getData(getRouter(DEL_TRAIN), { session: sessionStorage.session, id: id ,reason:reason}, cb, {});
        
    }
    removeResitClassStudent(id) {
        var cb = (route, message, arg) => {
            // if (message.code === Code.LOGIC_SUCCESS) {
            //     // this.setState({ clazzes: message.clazz })
            // }
            this.fresh();
            this.queryClazzStudents(this.state.selected.id);
           
            this.popUpNotice(NOTICE, 0, message.msg);
            
        }
        console.log("删除补考学员"+id)
       getData(getRouter(DEL_RESIT), { session: sessionStorage.session, resit_id: id }, cb, {});
        
    }

}
export default Clazz;