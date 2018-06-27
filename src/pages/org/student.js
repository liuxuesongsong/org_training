import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse,getCourses, getTotalPage, getAreas } from '../../utils/helpers';

import { DEL_TRAIN,CHOOSE_STUDENT, ALERT, NOTICE, SELECT_ALL_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO, NOTE_LIST,UNLOCK_STUDENT,STUDENT_TRAIN_DETAIL,CHANGE_CREDIT,COMPANY_CREDIT_LOG} from '../../enum';
import Drawer from 'material-ui/Drawer';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import ReactDataGrid from 'angon_react_data_grid';
import Code from '../../code';
import Lang from '../../language';
import CommonAlert from '../../components/CommonAlert';
import { fstat } from 'fs';
class Student extends Component {
    state = {
        allData: [],
        tableData: [],
        allResitData: [],
        tableResitData: [],
        queryCondition: { is_inlist:1,institution:0},
        queryResitCondition: {class_state:2,state:1},
        selectedStudentID: [],      //所有选择的学生ID
        selectedCOMPANYID: "",      //所有选择的公司ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        resit_list:[],
        student_train_detail_list:[],//详细信息列表
        company_credit_log_list:[],//失信记录列表
        currentPage: 1,
        resitcurrentPage:1,
        totalPage: 1,
        resittotalPage:1,
        rowsPerPage: 25,             //每页显示数据
        pno:1,
        psize:10,
        count: 0,
        resitcount: 0,
        search_input: "",
        idcard:"",
        creditname:"",
        creditcompany_id:"",
        creditclass_id:"",
        comany_name_log:"",
        search_resit_area_id:null,
        search_resit_course_id:null,
        search_resit_is_inlist: null,
        search_resit_institution:null,
        search_resit_class_state:null,
        search_area_id: null,
        search_course_id: null,
        search_is_inlist: 1,
        search_institution: 0,
        resitshowInfo: false,
        creditshowInfo:false,
        creditlogshowInfo:false,
        showStudents:false,
        credit_log_state:false,
         // 提示状态
         alertOpen: false,
         alertType: ALERT,
         alertCode: Code.LOGIC_SUCCESS,
         alertContent: "",
         alertAction: [],
         openNewStudentDialog: false,
         openunlockDialog:false,
         opencreditDialog:false
    }
    componentDidMount() {
        window.currentPage = this;
        this.fresh();
    }
    closeNotice = () => {
        this.setState({
            alertOpen: false,
        })
    }
    
    fresh = () => {
        initCache(this.cacheToState);
    }
    timestamp2Time = (timestamp, separator) =>{
        var result = "";  
              
        if(timestamp) {  
            var reg = new RegExp(/\D/, "g"); //提取数字字符串  
            var timestamp_str = timestamp.replace(reg, "");  

            var d = new Date();  
            d.setTime(timestamp_str);  
            var year = d.getFullYear();  
            var month = d.getMonth() + 1;  
            var day = d.getDate();  
            if(month < 10) {  
                month = "0" + month;  
            }  
            if(day < 10) {  
                day = "0" + day;  
            }  
            result = year + separator + month + separator + day;  
        }  
        return result;  
    }
    resitDrawer = (open) => () => {
        if(!open){
           //this.state.queryResitCondition.class_state="2";
          // this.state.queryCondition 
        }
        this.setState({
            resitshowInfo: true,
            resitright: open,
        });
     
    };
    creditDrawer = (open) => () => {
        if(!open){
           //this.state.queryResitCondition.class_state="2";
          // this.state.queryCondition 
        }
        this.setState({
            creditshowInfo: true,
            creditright: open,
        });
     
    };
    creditlogDrawer = (open) => () => {
        if(!open){
           //this.state.queryResitCondition.class_state="2";
          // this.state.queryCondition 
        }
        this.setState({
            creditlogshowInfo: true,
            creditlogright: open,
        });
     
    };
    cacheToState() {
        window.currentPage.queryStudents();
        //window.currentPage.queryResitStudents();
        window.currentPage.state.areas = getAreas();
        window.currentPage.state.clazzes = getCache("clazzes").sort((a, b) => {
            return b.id - a.id
        });
    }
    handleRequestClose = () => {
        this.setState({
            openunlockDialog: false,
            opencreditDialog:false
            
        })
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
        if (reload) {
            this.state.allData = [];
            this.state.tableData = [];
            this.currentPage = 1;
            this.setState({
                totalPage: 1,
                count: 0,
                is_inlist:1
                
            })
        }
        getData(getRouter("select_all_students"), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
    }
    queryResitStudents = (query_page = 1, reload = false) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.resitinfos;
                this.handleUptateAllResitData(result);
                this.handleUpdateResitData(this.state.resitcurrentPage);
                this.setState({
                    resittotalPage: getTotalPage(message.data.count, this.state.rowsPerPage),
                    resitcount: message.data.count
                })
                this.state.resitcount = message.data.count
            } else {

            }
        }
        if (reload) {
            this.state.allResitData = [];
            this.state.tableResitData = [];
            this.state.resitcurrentPage = 1;
            this.setState({
                resittotalPage: 1,
                resitcount: 0,
               // is_inlist:1
                
            })
        }
        getData(getRouter("select_all_resits"), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 500 },this.state.queryResitCondition) }, cb, {});
    }


    handleUptateAllData = (newData) => {
        this.state.allData = this.state.allData.concat(newData);
        
    }
    handleUptateAllResitData = (newData) => {
        this.state.allResitData = this.state.allResitData.concat(newData);
        
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
            // this.handleQueryRechargeCode(false, false);
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
    showResitPre = () => {
        this.handleUpdateResitData(this.state.resitcurrentPage - 1);
    }

    showResitNext = () => {
        if (this.state.onloading === true) {
            return;
        } else {
            this.handleUpdateResitData(this.state.resitcurrentPage + 1);
        }
    }
    handleUpdateResitData = (page) => {
        if (page <= 0) {
            page = 1;
        }
        if (page > this.state.resittotalPage) {
            page = this.state.resittotalPage;
        }
        this.state.resitcurrentPage = page;
        if (this.state.allResitData.length <= this.state.rowsPerPage * (page - 1) && this.state.allResitData.length < this.state.resitcount) {
            // this.handleQueryRechargeCode(false, false);
            this.queryResitStudents((Math.floor((this.state.resitcurrentPage - 1) / 4) + 1));
        } else {
            var data = this.state.allResitData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.state.onloading = false;
            this.state.tableResitData = data;
            this.setState({ tableResitData: data });
           
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
    checkTrain = (id) => {
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
        getData(getRouter(CHOOSE_STUDENT), obj, cb, {});
    } 
    //获取失信详细信息
    student_train_detail = () => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               // this.state.selectedStudentID = [];
               // this.state.currentPageSelectedID = [];
               // this.queryStudents(1, true)
                this.state.student_train_detail_list=message.data;
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            user_ids: this.state.selectedStudentID
        }
        getData(getRouter(STUDENT_TRAIN_DETAIL), obj, cb, {});
    }
    //获取是失信记录
    company_credit_log = (company_id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               // this.state.selectedStudentID = [];
               // this.state.currentPageSelectedID = [];
               // this.queryStudents(1, true)
               this.state.company_credit_log_list=[];
               this.state.credit_log_state=false;
               if(message.data.length>0){
                this.setState({
                    credit_log_state:true,
                    company_credit_log_list:message.data
                  })
               }else(
                this.popUpNotice(NOTICE, 0, "该企业暂无失信记录") 
               )
               // this.state.company_credit_log_list=message.data;
            }
          //  this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            company_id: company_id
        }
        getData(getRouter(COMPANY_CREDIT_LOG), obj, cb, {});
    }
    change_credit = (name,company_id,class_id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.selectedStudentID = [];
                this.state.currentPageSelectedID = [];
                this.queryStudents(1, true)
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var msg = document.getElementById("change_credit_reason").value;
      
        getData(getRouter(CHANGE_CREDIT), {session: sessionStorage.session,company_id:company_id,class_id:class_id,msg:name+"-"+msg,type:1}, cb, {});
    }
    unlock_student = () =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        console.log(this.state.idcard);
        getData(getRouter(UNLOCK_STUDENT), { session: sessionStorage.session,idcard:this.state.idcard}, cb, {});
    }
    unlockDialog = () => {
        return (
            <Dialog  open={this.state.openunlockDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    取消学员90天锁定
                </DialogTitle>
                <DialogContent>
                    <div>
                        
                    <TextField
                            className="nyx-clazz-message"
                            key={"class_head"}
                            id={"class_head"}
                            style={{width:"260px"}}
                            label={"解锁学员身份证号"}
                            onChange={(event) => {
                               this.state.idcard=event.target.value
                            }}>
                        </TextField>   
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                if(this.state.idcard==""){
                                    this.popUpNotice(NOTICE, 0, "请输入有效身份证号");
                                    return;
                                }
                              this.unlock_student()
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
    creditDialog = (name,company_id,class_id) => {
        return (
            <Dialog open={this.state.opencreditDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle style={{width:"26rem"}}>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                   标注失信原因 
                    
            </DialogTitle>
                <DialogContent>
                                <TextField
                                style={{width:"22rem",marginTop:"0.5rem"}}
                                //  className="nyx-form-div"
                                  key={"change_credit_reason"}
                                  id="change_credit_reason"
                                  className="nyx-file-text"
                                  label={"失信原因"}
                                  fullWidth>
                              </TextField>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                if(document.getElementById("change_credit_reason").value==""){
                                    this.popUpNotice(NOTICE, 0, "请填写失信原因");
                                    return;
                                }
                                this.change_credit(name,company_id,class_id);
                                this.handleRequestClose()
                                
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button>
                        <Button
                            onClick={() => {
                                this.setState({
                                    edit_type_name:0
                                })
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
    render() {
        return (
            <div style={{ marginTop: 80, width: "100%" }}>
                <div>
                    
                    <select
                    style={{marginLeft:20}}
                        className="nyx-info-select-lg"
                        id="search_area_id"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        defaultValue={this.state.search_area_id === null ? "" : this.state.search_area_id}
                        onChange={(e) => {
                            this.state.search_area_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.area_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >   
                        <option value={"null"}>{"-省市-"}</option>
                        {getAreas().map(area => {
                            return <option key={area.id} value={area.id}>{area.area_name}</option>
                        })}
                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_course_id"}
                        defaultValue={this.state.search_course_id ? this.state.search_course_id : ""}
                        disabled={this.state.search_course_id == -1 ? true : false}
                        onChange={(e) => {
                            this.state.search_course_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.course_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-课程名称-"}</option>
                        {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_is_inlist"}
                        defaultValue={1}
                        Value={this.state.search_is_inlist ? this.state.search_is_inlist : 0}
                        onChange={(e) => {
                            this.state.search_is_inlist = e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.is_inlist = e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-所有状态-"}</option>
                        <option value={-1}>{"待报名-导入"}</option>
                        <option value={0}>{"待报名"}</option>
                        <option value={1}>{"待安排"}</option>
                        <option value={2}>{"已安排"}</option>
                        <option value={3}>{"已确认"}</option>

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_institution"}
                        defaultValue={0}
                        Value={this.state.search_institution ? this.state.institution : 0}
                        onChange={(e) => {
                            this.state.search_institution =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.institution =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-培训机构-"}</option>
                        <option value={0}>{"无培训机构"}</option>
                        <option value={1}>{"中软培训"}</option>
                        <option value={2}>{"赛迪"}</option>
                        <option value={3}>{"赛宝"}</option>

                    </select>
                    <TextField
                        style={{top:"-0.5rem",left:"1rem"}}
                        id="search_input"
                        label={"搜索公司名称"}
                        value={this.state.search_input}
                        onChange={event => {
                            this.setState({
                                search_input: event.target.value,
                            });
                        }}
                    />
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-sm"
                        onClick={() => {
                            this.state.queryCondition.company_name = document.getElementById("search_input").value;
                            this.state.selectedStudentID = [];
                            this.state.currentPageSelectedID = [];
                            this.queryStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"搜索"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                        onClick={() => {
                            this.state.queryCondition={ is_inlist:1,institution:0},
                            this.queryStudents(1, true);
                            this.setState(
                                {search_is_inlist:1,search_institution:0},
                                ()=>{
                                }
                            );
                        }}
                        style={{margin: 15,marginLeft:0,position:"relative",top:"-5px"}}
                    >
                        {"取消筛选"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-lg"
                        onClick={() => {
                            this.resitDrawer(true)()//打开补考抽屉
                            this.queryResitStudents(1,true) //查看补考列表
                           // this.state.queryResitCondition.class_state=="2";
                            
                          
                        }}
                        style={{marginRight:"1rem",top:"-0.25rem",minWidth:"100px"}}
                    >
                        <i
                    className="glyphicon glyphicon-tasks"
                    style={{marginRight:"0.2rem",marginTop:"-2px"}}
                    ></i>{"补考列表"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-lg"
                        onClick={() => {
                           this.setState({
                            openunlockDialog:true
                           })
                            
                          
                        }}
                        style={{top:"-0.25rem",minWidth:"100px"}}
                    >
                        {"取消企业锁定"}
                    </Button>
                </div>
                <Drawer
                       
                       anchor="right"
                       open={this.state.resitright}
                       onRequestClose={this.resitDrawer(false)}
                   >
                    <div style={{width:"1000px",paddingLeft:"1rem",paddingTop:"1rem",overflow:"hidden"}}> 

                    <select
                    style={{marginLeft:20}}
                        className="nyx-info-select-lg"
                        id="search_resit_area_id"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        defaultValue={this.state.search_resit_area_id === null ? "" : this.state.search_resit_area_id}
                        onChange={(e) => {
                            this.state.search_resit_area_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.area_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >   
                        <option value={"null"}>{"-省市-"}</option>
                        {getAreas().map(area => {
                            return <option key={area.id} value={area.id}>{area.area_name}</option>
                        })}
                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_resit_course_id"}
                        defaultValue={this.state.search_resit_course_id ? this.state.search_resit_course_id : ""}
                        disabled={this.state.search_resit_course_id == -1 ? true : false}
                        onChange={(e) => {
                            this.state.search_resit_course_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.course_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-课程名称-"}</option>
                        {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_resit_is_inlist"}
                        defaultValue={this.state.queryResitCondition.state}
                        onChange={(e) => {
                            this.state.search_resit_is_inlist = e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.state = e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-所有状态-"}</option>
                        <option value={0}>{"报名作废"}</option>
                        <option value={1}>{"待安排"}</option>
                        <option value={2}>{"已安排"}</option>
                    </select> 
                     <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_resit_state"}
                        defaultValue={this.state.queryResitCondition.class_state}
                        onChange={(e) => {
                            this.state.search_resit_class_state = e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.class_state = e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-排班情况-"}</option>
                        <option value={1}>{"已进入班级"}</option>
                        <option value={2}>{"未排班"}</option>
                    </select>
                    <TextField
                        style={{top:"-0.5rem",left:"1rem"}}
                        id="search_resit_input"
                        label={"搜索公司名称"}
                        value={this.state.search_input}
                        onChange={event => {
                            this.setState({
                                search_input: event.target.value,
                            });
                        }}
                    />
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-sm"
                        onClick={() => {
                            this.state.queryResitCondition.company_name = document.getElementById("search_resit_input").value;
                            this.queryResitStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"搜索"}
                    </Button>
                    <ReactDataGrid
                       rowKey="id"
                       columns={
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
                               width: 70,
                               resizable: true
                           },
                           {
                               key: "company_name",
                               name: "公司全称",
                               width: 130,
                               resizable: true
                           },
                           {
                               key: "area_name",
                               name: "培训城市",
                               width: 80,
                               resizable: true
                           },
                           {
                               key: "course_name",
                               name: "课程",
                               width: 80,
                               resizable: true
                           },
                           {
                               key: "old_class_id",
                               name: "上次培训班级id",
                               width: 60,
                               resizable: true
                           },{
                               key: "institution",
                               name: "上次培训机构",
                               width: 100,
                               resizable: true
                           },{
                               key: "resit_state",
                               name: "补考状态",
                               width: 80,
                               resizable: true
                           },
                           {
                            key: "resit_clazz_state",
                            name: "排班情况",
                            width: 100,
                            resizable: true
                        },
                           {
                               key: "company_admin",
                               name: "联系人",
                               width: 80,
                               resizable: true
                           },
                           
                           {
                               key: "company_mobile",
                               name: "联系电话",
                               width: 100,
                               resizable: true
                           },
                           
                           {
                               key: "company_mail",
                               name: "联系邮箱",
                               width: 100,
                               resizable: true
                           }
                       ]
                   }
                   
                   rowGetter={(i) => {
                       if (i === -1) { return {} }
                       return {
                           id: this.state.allResitData.indexOf(this.state.tableResitData[i]) + 1,
                           student_id: this.state.tableResitData[i].id,
                           student_name: this.state.tableResitData[i].student_name,
                           company_name: this.state.tableResitData[i].company_name,
                           company_admin: this.state.tableResitData[i].company_admin,
                           company_mobile: this.state.tableResitData[i].company_mobile,
                           company_mail: this.state.tableResitData[i].company_mail,
                           resit_state:this.state.tableResitData[i].state === "0"?"报名作废":
                           this.state.tableResitData[i].state === "1"?"待安排":this.state.tableResitData[i].state === "2"?"已安排":"",

                        //    this.state.tableResitData[i].state === 
                        //   resit_state:this.state.tableResitData[i].state === "1" ? "待安排" :
                        //   this.state.tableResitData[i].state === "2" ? "已安排" :"",
                         resit_clazz_state:this.state.tableResitData[i].resit_class_id=="0"?"未排班": getInst(this.state.tableResitData[i].resit_train_institution)+this.state.tableResitData[i].resit_class_id,
                          old_class_id: this.state.tableResitData[i].train_class_id,
                          institution: getInst(this.state.tableResitData[i].train_institution),
                           area_name: getCity(this.state.tableResitData[i].area_id),
                           course_name: getCourse(this.state.tableResitData[i].course_id),
                          
                       }
                   }}
                   rowsCount={this.state.tableResitData.length}
                   onRowClick={(rowIdx, row) => {
                       if (rowIdx !== -1) {
                           this.handleSelection(rowIdx, row);
                       }
                   }}
                   renderColor={(idx) => { return "black" }}
                   maxHeight={1000}
                   minHeight={535}
                   rowHeight={20}
               />
               <Button
                   color="primary"
                   onClick={() => {
                       this.showResitPre();
                   }}
                   style={{ margin: 10 }}
               >
                   {"上页"}
               </Button>
               {"第"+this.state.resitcurrentPage+"页"+ "/" + "共"+this.state.resittotalPage+"页"}
               <Button
                   color="primary"
                   onClick={() => {
                       this.showResitNext();
                   }}
                   style={{ margin: 10 }}
               >
                   {"下页"}
               </Button>
               <Button
                raised
                color="primary"
                className="nyx-org-btn-sm"
               onClick={() => {
                   var all_area;
                   var all_course;
                   var all_is_inlist;
                   var all_class_state;
                   var all_institution;
                  // {this.state.search_resit_class_state===null?all_class_state="所有排班情况":}
                   {this.state.search_resit_area_id===null?all_area="所有地区":all_area=getCity(this.state.search_resit_area_id)}
                   {this.state.search_resit_course_id===null?all_course="所有级别":all_course=getCourse(this.state.search_resit_course_id)}
                   var my_select_is_inlist=document.getElementById('search_resit_is_inlist');
                    var is_inlist_index=my_select_is_inlist.selectedIndex;

                    var my_select_class_state=document.getElementById('search_resit_state');
                    var class_state_index=my_select_class_state.selectedIndex;
                    console.log(class_state_index)
                    {my_select_is_inlist.options[is_inlist_index].text=="-报名状态-"?all_is_inlist="已报名":all_is_inlist=my_select_is_inlist.options[is_inlist_index].text}
                    {my_select_class_state.options[class_state_index].text=="-排班情况-"?all_class_state="所有排班情况":all_class_state=my_select_class_state.options[class_state_index].text}

                    console.log(all_class_state)
                   this.popUpNotice(ALERT, 0, "导出的学生信息:【"+all_area+"】【 "+all_course+"】【"+all_is_inlist+"】【"+all_class_state+"】的人员", [
                       () => {
                           var href =  getRouter("export_resit").url+"&session=" + sessionStorage.session;
                           if(this.state.queryResitCondition.area_id!=undefined && this.state.queryResitCondition.area_id!=null){
                                href = href+"&area_id=" + this.state.queryResitCondition.area_id;
                           }
                           if(this.state.queryResitCondition.state!=undefined && this.state.queryResitCondition.state!=null){
                            href = href+"&state=" + this.state.queryResitCondition.state;
                           }
                           if(this.state.queryResitCondition.course_id!=undefined && this.state.queryResitCondition.course_id!=null){
                            href = href+"&course_id=" + this.state.queryResitCondition.course_id;
                           } 
                           console.log(this.state.queryResitCondition.class_state)
                           if(this.state.queryResitCondition.class_state!=undefined && this.state.queryResitCondition.class_state!=null){
                            href = href+"&class_state=" + this.state.queryResitCondition.class_state;
                           } 
                           var a = document.createElement('a');
                           console.log(a)
                           a.href = href;
                           a.click();  
                           this.closeNotice();
                       }, () => {
                           this.closeNotice();
                       }]);
               }}
               >导出</Button>
                   </div>
                   </Drawer>
                   {/* 失信抽屉 */}
                   <Drawer
                       
                       anchor="right"
                       open={this.state.creditright}
                       onRequestClose={this.creditDrawer(false)}
                   >
                    <div style={{width:"700px",paddingLeft:"1rem",paddingTop:"1rem",overflow:"hidden"}}> 
                    <p style={{color:"#2196f3",fontSize:"18px",marginLeft:"2rem"}}>企业失信标注</p>
                    <div style={{height:"30px"}} className="nyx-clazz-student-name">
                    
                    <div style={{width:"4rem",textAlign:"center"}} className="nyx-clazz-student-message">
                     姓名</div>
                    <div style={{width:"180px",textAlign:"center"}} className="nyx-clazz-student-message">
                    公司全称</div>
                    <div style={{width:"6rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    报名状态</div>
                    <div style={{width:"4rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    班级编号</div>
                    <div style={{width:"5rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    培训机构</div>
                    </div>
                    {this.state.student_train_detail_list.map(detail_message => {
                    return    <div style={{height:"30px"}} className="nyx-clazz-student-name">
                    
                    <div style={{width:"4rem",textAlign:"center"}} title=   {detail_message.user_name} className="nyx-clazz-student-message">
                        {detail_message.user_name}</div>
                     <div style={{width:"180px",textAlign:"center"}} title={detail_message.comany_name} className="nyx-clazz-student-message">{detail_message.comany_name}</div>
                     <div style={{width:"6rem",textAlign:"center"}} title={detail_message.is_inlist==-1?"待报名-导入":
                    detail_message.is_inlist==0?"待报名":detail_message.is_inlist==1?"待安排":detail_message.is_inlist==2?"已安排":detail_message.is_inlist==3?"已确认":""
                    } className="nyx-clazz-student-message">
                     {detail_message.is_inlist==-1?"待报名-导入":
                    detail_message.is_inlist==0?"待报名":detail_message.is_inlist==1?"待安排":detail_message.is_inlist==2?"已安排":detail_message.is_inlist==3?"已确认":""}</div>
                     <div style={{width:"4rem",textAlign:"center"}} title={detail_message.class_id==0?"未排班":detail_message.class_id} className="nyx-clazz-student-message">
                     {detail_message.class_id==0?"未排班":detail_message.class_id}</div>
                     <div style={{width:"5rem",textAlign:"center"}} title={getInst(detail_message.ti_id)} className="nyx-clazz-student-message">
                     {getInst(detail_message.ti_id)}</div>
                     <Button
                        color="primary"
                        raised 
                        onClick={() => {
                            this.state.comany_name_log  = detail_message.comany_name;
                            console.log(detail_message.comany_name)
                          this.company_credit_log(detail_message.company_id)
                          
                        //   this.setState({
                        //     credit_log_state:true,

                        //   })
                          console.log(this.state.company_credit_log_list)
                        }}
                        className="nyx-org-btn-md"                                            
                        style={{ position:"relative",top:"-9px",float:"right",right:"0.5rem",minHeight:"26px"}}
                    >
                        {"失信记录"}
                    </Button>
                     <Button
                        color="primary"
                        raised 
                        onClick={() => {
                            this.setState({
                                opencreditDialog:true,
                                creditname:detail_message.user_name,
                                creditcompany_id:detail_message.company_id,
                                creditclass_id:detail_message.class_id
                            })
                           
                       
                        }}
                        className="nyx-org-btn-sm"                                            
                        style={{ position:"relative",top:"-9px",float:"right",right:"0.5rem",minHeight:"26px"}}
                    >
                        {"标注"}
                    </Button>  
                                                           
                     </div>                
                })}
                <div style={this.state.credit_log_state?{display:"block"}:{display:"none"}}>
                <p style={{color:"#2196f3",fontSize:"18px",marginLeft:"2rem"}}>{this.state.comany_name_log}失信记录</p>
                <div style={{height:"30px"}} className="nyx-clazz-student-name">
                   <div style={{width:"3rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    序号</div>
                    <div style={{width:"260px",textAlign:"center"}} className="nyx-clazz-student-message">
                    失信原因</div>
                    <div style={{width:"4rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    班级编号</div>
                    <div style={{width:"6rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    标注机构</div>
                    <div style={{width:"6rem",textAlign:"center"}} className="nyx-clazz-student-message">
                    标注时间</div>
                    </div>
                    {this.state.company_credit_log_list.map(company_credit_log => {
                        
                        return <div style={{height:"30px"}} className="nyx-clazz-student-name">
                        <div style={{width:"3rem",textAlign:"center"}} className="nyx-clazz-student-message">
                        {this.state.company_credit_log_list.indexOf(company_credit_log)+1}</div>
   
                                    <div style={{width:"260px",textAlign:"center"}} title={company_credit_log.msg} className="nyx-clazz-student-message">{company_credit_log.msg}</div>
                                    <div style={{width:"4rem",textAlign:"center"}} className="nyx-clazz-student-message">
                                     {company_credit_log.class_id==0?"未排班":company_credit_log.class_id}</div>
                                   
                                    <div style={{width:"6rem",textAlign:"center"}} title={getInst(company_credit_log.ti_id)} className="nyx-clazz-student-message">
                                    {getInst(company_credit_log.ti_id)}</div>
                                    <div style={{width:"6rem",textAlign:"center"}} className="nyx-clazz-student-message">
                                    {this.timestamp2Time(company_credit_log.time+"000", "-")}
                                    </div>
                         </div>
                    })}
                </div>
                
                   </div>
                   </Drawer>
                <ReactDataGrid
                    
                    rowKey="id"
                    columns={
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
                                width: 300,
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
                                width: 125,
                                resizable: true
                            },
                            {
                                key: "register",
                                name: "备注",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "detail",
                                name: "分配记录",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "institution",
                                name: "培训机构",
                                width: 100,
                                resizable: true
                            },
                            {
                                key: "is_inlist",
                                name: "报名状态",
                                width: 100,
                                resizable: true
                            }
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
                        return {
                            id: this.state.allData.indexOf(this.state.tableData[i]) + 1,
                            student_id: this.state.tableData[i].id,
                            student_name: this.state.tableData[i].student_name,
                            company_name: this.state.tableData[i].company_credit!=100?<span style={{color:"red"}}>{this.state.tableData[i].company_name}*</span>:this.state.tableData[i].company_name,
                           //company_name:this.state.tableData[i].company_name,
                            company_admin: this.state.tableData[i].company_admin,
                            company_mobile: this.state.tableData[i].company_mobile,
                            company_mail: this.state.tableData[i].company_mail,
                            register: this.state.tableData[i].register,
                            detail: this.state.tableData[i].detail,
                            institution: getInst(this.state.tableData[i].institution),
                            area_name: getCity(this.state.tableData[i].area_id),
                            course_name: getCourse(this.state.tableData[i].course_id),
                            is_inlist: this.state.tableData[i].is_inlist === "-1" ? "待报名-导入" :
                                this.state.tableData[i].is_inlist === "0" ? "待报名" :
                                    this.state.tableData[i].is_inlist === "1" ? "待安排" :
                                        this.state.tableData[i].is_inlist === "2" ? "已安排" :
                                            this.state.tableData[i].is_inlist === "3" ? "已确认" : ""
                        }
                    }}
                    rowsCount={this.state.tableData.length}
                    onRowClick={(rowIdx, row) => {
                        if (rowIdx !== -1) {
                            this.handleSelection(rowIdx, row);
                        }
                    }}
                    renderColor={(idx) => { return "black" }}
                    maxHeight={900}
                    enableRowSelect={true}
                    minHeight={535}
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
                <Button
                    color="primary"
                    onClick={() => {
                        this.showPre();
                    }}
                    style={{ margin: 10 }}
                >
                    {"上页"}
                </Button>
                {"第"+this.state.currentPage+"页"+ "/" + "共"+this.state.totalPage+"页"}
                <Button
                    color="primary"
                    onClick={() => {
                        this.showNext();
                    }}
                    style={{ margin: 10 }}
                >
                    {"下页"}
                </Button>
                {"已选择"+this.state.selectedStudentID.length + "人/"}

                共{this.state.count}人
                <Button
                 raised
                 color="primary"
                 className="nyx-org-btn-sm"
                onClick={() => {
                    var all_area;
                    var all_course;
                    var all_is_inlist;
                    var all_institution;
                    {this.state.search_area_id===null?all_area="所有地区":all_area=getCity(this.state.search_area_id)}
                    {this.state.search_course_id===null?all_course="所有级别":all_course=getCourse(this.state.search_course_id)}
                    var my_select_is_inlist=document.getElementById('search_is_inlist');
                    var is_inlist_index=my_select_is_inlist.selectedIndex;
                    var my_select_institution=document.getElementById('search_institution');
                    var institution_index=my_select_institution.selectedIndex;
                    {my_select_is_inlist.options[is_inlist_index].text=="-报名状态-"?all_is_inlist="已报名":all_is_inlist=my_select_is_inlist.options[is_inlist_index].text}
                    {my_select_institution.options[institution_index].text=="-培训机构-"?all_institution="无培训机构":all_institution=my_select_institution.options[institution_index].text}
                    this.popUpNotice(ALERT, 0, "导出的学生信息:【"+all_area+"】【 "+all_institution+"】【 "+all_is_inlist+"】【 "+all_course+"】的人员", [
                        () => {
                            var href =  getRouter("export_csv").url+"&session=" + sessionStorage.session;
                            if(this.state.queryCondition.area_id!=undefined && this.state.queryCondition.area_id!=null){
                                 href = href+"&area_id=" + this.state.queryCondition.area_id;
                            }
                            if(this.state.queryCondition.is_inlist!=undefined && this.state.queryCondition.is_inlist!=null){
                             href = href+"&is_inlist=" + this.state.queryCondition.is_inlist;
                            }
                            if(this.state.queryCondition.institution!=undefined && this.state.queryCondition.institution!=null){
                                 href = href+"&institution=" + this.state.queryCondition.institution;
                            }
                            if(this.state.queryCondition.course_id!=undefined && this.state.queryCondition.course_id!=null){
                             href = href+"&course_id=" + this.state.queryCondition.course_id;
                            } 
                            var a = document.createElement('a');
                            a.href = href;
                            console.log(a)
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
                className="nyx-org-btn-lg"
                disabled={this.state.search_is_inlist == 1 ? false : true }
                onClick={()=>{
                    this.state.search_is_inlist == 1? this.checkTrain():"";
                }}
                >添加为该机构学员</Button>
                <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-lg"
                        onClick={() => {
                            //console.log(this.state.selectedStudentID.length)
                            if(this.state.selectedStudentID.length==0){
                                this.popUpNotice(NOTICE, 0, "请选择失信企业相关信息");
                                return;
                            }
                            this.state.company_credit_log_list=[];
                            this.state.credit_log_state=false;
                            this.creditDrawer(true)()//打开失信抽屉
                            this.student_train_detail();
                            
                        }}
                        style={{minWidth:"100px"}}
                    >
                        <i
                    className="glyphicon glyphicon-tasks"
                    style={{marginRight:"0.2rem",marginTop:"-2px"}}
                    ></i>{"失信标注"}
                    </Button>
                    
               
                 {this.unlockDialog()}
                 {this.creditDialog(this.state.creditname,this.state.creditcompany_id,this.state.creditclass_id)}
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
export default Student;