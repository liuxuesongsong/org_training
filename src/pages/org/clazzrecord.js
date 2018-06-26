import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { initCache, getData, getRouter, getCache, getCity, getInst, getCourse,getCourses, getTotalPage, getAreas,getClasstypes ,getClasstype} from '../../utils/helpers';

import {  ALERT, NOTICE, QUERY,CLASSTEACHER_ADD,CLASSTEACHER_INFOS,CLASSTEACHER_DEL,CLASSTEACHER_UPDATA,SPONSOR_ADD,SPONSOR_INFOS,SPONSOR_DEL,SPONSOR_UPDATA,
    TEACHER_ADD,TEACHER_INFOS,TEACHER_DEL,TEACHER_UPDATA,EXPERT_ADD,EXPERT_INFOS,EXPERT_DEL,EXPERT_UPDATA,ADDRESS_ADD,ADDRESS_INFOS,ADDRESS_DEL,ADDRESS_UPDATA,CLASS_RECORD,MANAGE_LISTS,DETAIL_AREA_LIST,EDIT_CLAZZ,
} from '../../enum';
import Drawer from 'material-ui/Drawer';
import BeingLoading from '../../components/BeingLoading'

import ReactDataGrid from 'angon_react_data_grid';
import Code from '../../code';
import Lang from '../../language';
import CommonAlert from '../../components/CommonAlert';
import { fstat } from 'fs';
class Clazzrecord extends Component {
    state = {
        clazzes:[],
        allData: [],
        tableData: [],
        queryCondition: {},
        selectedClazzID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        currentPage: 1,
        totalPage: 1,
        rowsPerPage: 25,             //每页显示数据
        pno:1,
        psize:10,
        count: 0,
        islength:"",
        search_year:null,
        search_month:null,
        search_area_id: null,
        search_course_id: null,
        search_institution: null,
        showStudents:false,
        openDialog:false,
        opentheory:false,
        openhead:false,
        opensponsor:false,
        openpractice:false,
        openimplement:false,//实施地点管理模块
        openEditClazzDialog: false,
        beingLoading: false,
        see_manage_list:[],
        see_manage_head_list:[],//查看班主任管理列表
        see_manage_sponser_list:[],//查看主办方管理列表
        see_manage_theory_list:[],//查看理论讲师管理列表
        see_manage_expert_list:[],//查看实践讲师管理列表
        detail_area_list:[],
        head_number:"",
        sponsor_number:"",
        theory_number:"",
        expert_number:"",
        edit_state:0,
        create_name:"",
        create_number:"",
        selected: {},
         // 提示状态
         alertOpen: false,
         alertType: ALERT,
         alertCode: Code.LOGIC_SUCCESS,
         alertContent: "",
         alertAction: [],
         openNewStudentDialog: false
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

    cacheToState() {
        window.currentPage.queryStudents();
        window.currentPage.see_module_lists();
        window.currentPage.state.areas = getAreas();
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
        if (reload) {
            this.state.allData = [];
            this.state.tableData = [];
            this.currentPage = 1;
            this.setState({
                totalPage: 1,
                count: 0,
                
                
            })
        }
      //  console.log(this.state.queryCondition)
        //this.state.queryCondition.train_year=="null"?this.state.queryCondition.train_month=="":""
        getData(getRouter("select_all_class"), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
    }

    handleUptateAllData = (newData) => {
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
            // this.handleQueryRechargeCode(false, false);
            this.queryStudents((Math.floor((this.state.currentPage - 1) / 4) + 1));
        } else {
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.state.onloading = false;
            this.state.tableData = data;
            this.setState({ tableData: data });
            if (data.length > 0) {
                var allCheckBox = true;
               // this.state.currentPageSelectedID = [];
                for (var i = 0; i < data.length; i++) {
                  //  console.log(data[i])
                    if (this.state.selectedClazzID.indexOf(data[i].id) === -1) {
                        //console.log(data[i])
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
    onRowsDeselected = (rowArray) => {
        var tranform = new Set(this.state.selectedClazzID);
        this.state.selectedClazzID = [...tranform];
        if (rowArray.length > 1) {
            for (var j = 0; j < rowArray.length; j++) {
                if (this.state.selectedClazzID.indexOf(rowArray[j].row.id) === -1) {
                } else {
                    this.state.selectedClazzID.splice(this.state.selectedClazzID.indexOf(rowArray[j].row.id), 1);
                }
                if (this.state.currentPageSelectedID.indexOf(rowArray[j].row.id) === -1) {

                } else {
                    this.state.currentPageSelectedID.splice(this.state.currentPageSelectedID.indexOf(rowArray[j].row.id), 1);
                }
            }
        } else {
            var index = this.state.selectedClazzID.indexOf(rowArray[0].row.id);
            this.state.selectedClazzID.splice(index, 1);
            var currentPageIndex = this.state.currentPageSelectedID.indexOf(rowArray[0].row.id);
            this.state.currentPageSelectedID.splice(currentPageIndex, 1);
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedClazzID: this.state.selectedClazzID
        })
    }
    onRowsSelected = (rowArray) => {
        if (rowArray.length > 1) {
            for (var i = 0; i < rowArray.length; i++) {
                this.state.selectedClazzID.push(rowArray[i].row.id);
                this.state.currentPageSelectedID.push(rowArray[i].row.id);
            }
        } else {
            this.state.selectedClazzID.push(rowArray[0].row.id);
            this.state.currentPageSelectedID.push(rowArray[0].row.id)
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedClazzID: this.state.selectedClazzID
        })
    }
    handleSelection = (index, row) => {
        if (this.state.selectedClazzID.indexOf(row.id) === -1) {
            this.state.selectedClazzID.push(row.id);
            this.state.currentPageSelectedID.push((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1)
        } else {
            this.state.selectedClazzID.splice(this.state.selectedClazzID.indexOf(row.id), 1);
            if (this.state.currentPageSelectedID.indexOf((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1) !== -1) {
                this.state.currentPageSelectedID.splice(this.state.currentPageSelectedID.indexOf((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1), 1)
            }
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedClazzID: this.state.selectedClazzID
        })
    }
    handleRequestClose = () => {
        this.setState({
            openheadDialog: false,
            openDialog:false,
            opentheory:false,
            openhead:false,
            opensponsor:false,//主办方
            openpractice:false,//实践
            openimplement:false,//实施
            beingLoading: false,//loading结束
            openEditClazzDialog: false,//修改班级
            edit_state:0,
            islength:""
         
        })
    }
    modifyClazz = (id, clazz) => {

        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.selectedClazzID = [];
                this.state.currentPageSelectedID = [];
               // this.fresh();
                this.queryStudents(1, true);
                // this.setState({ clazzes: message.clazz })
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(EDIT_CLAZZ), { session: sessionStorage.session, id: id, data: clazz }, cb, {});

    }
    detail_area_list= (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                
               this.state.detail_area_list=message.data.detailed;
                this.popUpNotice(NOTICE, 0, message.msg);
              
            }
        }
        getData(getRouter(DETAIL_AREA_LIST), { session: sessionStorage.session, address_area_id: id }, cb, { id: id });
    }
    class_record =()=>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
              
              
            }
            
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(CLASS_RECORD), { session: sessionStorage.session, ids:this.state.selectedClazzID}, cb, {});
    }
    date_arr() {
        var components = [],
         d = new Date(),
        new_date=d.getFullYear();
    for(var i=2017;i<=new_date;i++){
        var first_date = new Date(i+"-01-01 00:00:00"),
            first_time = first_date.getTime().toString(),
            first_time = first_time.substring(0,10),
            second_date = new Date(i+"-12-31 23:59:59"),
            second_time = second_date.getTime().toString(),
            second_time = second_time.substring(0,10);
            components.push(
                <option 
                // selected={true?"i=new_date":""}
                value={i} key={i}>{i+"年"}</option>
            )
        }
        return components
    }
    month_arr() {
        var components = [];
       
    for(var i=1;i<=12;i++){
            components.push(
                <option 
                // selected={true?"i=new_date":""}
                value={i<10?"0"+i:i} key={i}>{i<10?"0"+i+"月":i+"月"}</option>
            )
        }
        return components
    }
    //查看管理模块总列表
    see_module_lists = () =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.setState({
                beingLoading: false
               })
                this.state.see_manage_head_list=message.data.classteacher ;
                this.state.see_manage_sponser_list=message.data.sponsor;
                this.state.see_manage_theory_list=message.data.teachermanage;
                this.state.see_manage_expert_list=message.data.expert;
              
            }
          
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(MANAGE_LISTS), { session: sessionStorage.session }, cb, {});
    }
    //查看管理模块
    see_module = (see_module) =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.setState({
                beingLoading: false
               })
                this.state.see_manage_list=message.data;
              
            }
            {this.state.see_manage_list.length==0?this.state.islength="暂无相关信息，请点击新增！":""}
            
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(see_module), { session: sessionStorage.session }, cb, {});
    }
    //创建管理模块
    create_module = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_state:0,
                   // beingLoading: false
                })
                {this.state.openhead? this.see_module(CLASSTEACHER_INFOS):""}
                {this.state.opensponsor? this.see_module(SPONSOR_INFOS):""}
                {this.state.opentheory? this.see_module(TEACHER_INFOS):""}
                {this.state.openpractice? this.see_module(EXPERT_INFOS):""}
                {this.state.openimplement? this.see_module(ADDRESS_INFOS):""}
                
            //    {this.state.openimplement? this.see_module(EXPERT_INFOS):""}
                
                //this.fresh();
               
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
       //班主任 
       {this.state.openhead?getData(getRouter(CLASSTEACHER_ADD), { session: sessionStorage.session, name:this.state.create_name,number:this.state.create_number }, cb, {}):""}
       //主办方联系人 
       {this.state.opensponsor?getData(getRouter(SPONSOR_ADD), { session: sessionStorage.session, name:this.state.create_name,number:this.state.create_number }, cb, {}):""}
       //理论讲师
       {this.state.opentheory?getData(getRouter(TEACHER_ADD), { session: sessionStorage.session, name:this.state.create_name,number:this.state.create_number }, cb, {}):""}
       //实践讲师
       {this.state.openpractice?getData(getRouter(EXPERT_ADD), { session: sessionStorage.session, name:this.state.create_name,number:this.state.create_number }, cb, {}):""}
      //实施地点
       {this.state.openimplement?getData(getRouter(ADDRESS_ADD), { session: sessionStorage.session, address_area_id:this.state.create_name,detailed:this.state.create_number }, cb, {}):""}

       //  {this.state.openimplement?console.log(this.state.create_name+this.state.create_number+"implement"):""}
     //   getData(getRouter(CREATE_TYPE), { session: sessionStorage.session, type_name:this.state.create_type_name }, cb, {});

    }
    //删除管理模块
    del_module = (id) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_state:0
                })
                {this.state.openhead? this.see_module(CLASSTEACHER_INFOS):""}
                {this.state.opensponsor? this.see_module(SPONSOR_INFOS):""}
                {this.state.opentheory? this.see_module(TEACHER_INFOS):""}
                {this.state.openpractice? this.see_module(EXPERT_INFOS):""}
                {this.state.openimplement? this.see_module(ADDRESS_INFOS):""}
                
            //    {this.state.openimplement? this.see_module(EXPERT_INFOS):""}
                
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        {this.state.openhead?getData(getRouter(CLASSTEACHER_DEL), { session: sessionStorage.session,id:id }, cb, {}):""}
        //主办方联系人 
        {this.state.opensponsor?getData(getRouter(SPONSOR_DEL), { session: sessionStorage.session, id:id }, cb, {}):""}
        //理论讲师
        {this.state.opentheory?getData(getRouter(TEACHER_DEL), { session: sessionStorage.session, id:id }, cb, {}):""}
        //实践讲师
        {this.state.openpractice?getData(getRouter(EXPERT_DEL), { session: sessionStorage.session, id:id }, cb, {}):""}
  //实施地点
  {this.state.openimplement?getData(getRouter(ADDRESS_DEL), { session: sessionStorage.session, id:id }, cb, {}):""}
 

    }

    //修改管理模块
    edit_module = (id,name,number) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_state:0
                })
               // this.fresh()
              //  this.state.allData = [];
              {this.state.openhead? this.see_module(CLASSTEACHER_INFOS):""}
              {this.state.opensponsor? this.see_module(SPONSOR_INFOS):""}
              {this.state.opentheory? this.see_module(TEACHER_INFOS):""}
              {this.state.openpractice? this.see_module(EXPERT_INFOS):""}
              {this.state.openimplement? this.see_module(ADDRESS_INFOS):""}
                
          //    {this.state.openimplement? this.see_module(EXPERT_INFOS):""}
              
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        
    var name= document.getElementById(name).value;
    var number = document.getElementById(number).value;
    //console.log(name+number)
    {this.state.openhead?getData(getRouter(CLASSTEACHER_UPDATA), { session: sessionStorage.session,id:id,name:name,number:number }, cb, {}):""}
    //主办方联系人 
    {this.state.opensponsor?getData(getRouter(SPONSOR_UPDATA), { session: sessionStorage.session, id:id,name:name,number:number }, cb, {}):""}
    //理论讲师
    {this.state.opentheory?getData(getRouter(TEACHER_UPDATA), { session: sessionStorage.session, id:id,name:name,number:number }, cb, {}):""}
    //实践讲师
    {this.state.openpractice?getData(getRouter(EXPERT_UPDATA), { session: sessionStorage.session, id:id,name:name,number:number  }, cb, {}):""}

//实施地点
{this.state.openimplement?getData(getRouter(ADDRESS_UPDATA), { session: sessionStorage.session, id:id,address_area_id:name,detailed:number  }, cb, {}):""}

// getData(getRouter(EDIT_TYPE), { session: sessionStorage.session,id:id,type_name:type_name}, cb, {});

    }
     Dialogs = (title,type,islength) => {
        return (
            <Dialog open={this.state.openDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle style={{width:"515px"}}>
                {this.state.beingLoading ?
          <BeingLoading /> : ''
        }

                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    {title}
                    <Button
                        raised 
                        color="primary"
                       
                        className="nyx-org-btn-md"
                        onClick={() => {
                            if(this.state.edit_state!=0){
                                this.popUpNotice(NOTICE, 0, "请保存正在编辑的文档");
                                return false
                            }
                         this.setState({
                            edit_state:-1,
                            islength:""
                         })
                         {this.state.openimplement?document.getElementById("create_implement_area").value=null: document.getElementById("create_name").value=""}
                         //   document.getElementById("create_implement_area").value=null;
                           
                            document.getElementById("create_number").value="";
                        }}
                        style={{float:"right",marginTop:"-5px"}}
                    >
                        {"新增"}
                    </Button>
            </DialogTitle>
                <DialogContent>
                    
                    <table 
                       style={{textAlign:"center",marginTop:"10px"}}
                        >
                        <p>{this.state.islength}</p>
                        {/* <tr>
                 <td style={{width:"110px"}}>{this.state.openimplement?"地区":"姓名"}</td><td style={{width:"215px"}}>{type}</td><td></td><td></td>
             </tr> */}
                       {this.state.see_manage_list.length==0&&this.state.edit_state==0?"":<tr>
                 <td style={{width:"110px"}}>{this.state.openimplement?"地区":"姓名"}</td><td style={{width:"215px"}}>{type}</td><td></td><td></td>
             </tr>}
                        
                        <tr style={{display:this.state.edit_state==-1?"":"none"}}>
                           
                            <td style={{width:"110px"}}>
                            {this.state.openimplement?<select
                    style={{
                        border:"none",borderBottom:"1px solid rgba(0, 0, 0, 0.54)",marginLeft:"1rem",height:"36px",outline:"none"
                    }}
                        className="nyx-info-select-lg"
                        id="create_implement_area"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        // defaultValue={this.state.search_area_id === null ? "" : this.state.search_area_id}
                        onChange={(e) => {
                            this.state.create_name =  e.target.value == "null"? null:e.target.value;
                        }}
                    >   
                        <option value={"null"}>{"-省市-"}</option>
                        {getAreas().map(area => {
                            return <option key={area.id} value={area.id}>{area.area_name}</option>
                        })}
                    </select>: <TextField
                                  //  className="nyx-form-div"
                                    key={"create_name"}
                                    id="create_name"
                                    className="nyx-file-text"
                                    onChange={(e)=>{
                                        this.setState({
                                            create_name:e.target.value
                                        })
                                      //  this.state.create_head_name=e.target.value
                                    }}
                                    label={Lang[window.Lang].pages.org.clazzrecord.info.name}
                                    fullWidth>
                                </TextField>  }
                           
                            </td>
                            <td style={{width:"215px"}}>
                            <TextField
                                    className="nyx-form-div"
                                    key={"create_number"}
                                    id="create_number"
                                    className="nyx-file-text"
                                    onChange={(e)=>{
                                        this.setState({
                                            create_number:e.target.value
                                        })
                                        //this.state.create_head_mobile=e.target.value
                                    }}
                                    label={type}
                                    fullWidth>
                                </TextField>  
                            </td>
                            <td>
                            <Button
                                    color="primary"
                                    className="nyx-org-btn-sm"
                                    onClick={() => {
                                        
                                    if(this.state.create_name==""){
                                        {this.state.openimplement?"":this.popUpNotice(NOTICE, 0, "请输入姓名");return}
                                       // this.popUpNotice(NOTICE, 0, "请输入姓名");  
                                      //  return
                                    }
                                        this.create_module();
                                     //   this.state.allData = [];
                                     //   this.fresh();
                                    }}
                                    style={{margin: 0,marginLeft:20,top:7}}
                                >
                                    {"保存"}
                                </Button>
                                </td>
                                <td>
                                <Button
                                    color="primary"
                                    className="nyx-org-btn-sm"
                                    onClick={() => {
                                        this.setState({
                                            edit_state:0,
                                        })
                                        if(this.state.see_manage_list.length==0?this.state.islength="暂无相关信息，请点击新增！":"")
                                        {this.state.openimplement?document.getElementById("create_implement_area").value=null: document.getElementById("create_name").value=""}
                                     //   document.getElementById("create_implement_area").value=null;
                                       
                                        document.getElementById("create_number").value="";
                                    }}
                                    style={{margin: 0,marginLeft:6,top:7}}
                                >
                                    {"取消"}
                                </Button>      
                                </td>
                        </tr>
                        {this.state.openimplement?this.state.see_manage_list.map(see_manages => {
                              
                              return <tr>
                              <td>

                              <select
                                style={
                                    this.state.edit_state==see_manages.id?{border:"none",borderBottom:"1px solid rgba(0, 0, 0, 0.38)",marginLeft:"1rem",height:"26px",outline:"none",marginBottom:"6px",paddingBottom:"5px",fontSize:"12px",color:"rgba(0, 0, 0, 0.87)"}
                                    :{border:"none",borderBottom:"1px dashed rgba(0, 0, 0, 0.38)",marginLeft:"1rem",height:"26px",outline:"none",marginBottom:"6px",paddingBottom:"5px",fontSize:"12px",color:"rgba(0, 0, 0, 0.38)"}
                                    
                                }
                                    className="nyx-info-select-lg"
                                    id={"implement_area"+see_manages.id}
                                    disabled={this.state.edit_state==see_manages.id?false:true}
                                    defaultValue={see_manages.address_area_id}
                                    label={Lang[window.Lang].pages.org.clazz.info.area}
                                >   
                                    <option style={{marginBottom:"0.5rem"}} value={"null"}>{"-省市-"}</option>
                                    {getAreas().map(area => {
                                        return <option key={area.id} value={area.id}>{area.area_name}</option>
                                    })}
                                </select>
                                            </td><td
                                            style={{width:"215px"}}
                                            >
                            {/* <input
                            
                            value={type_infos.type_name}/> */}
                               <TextField
                               key={see_manages.detailed}
                                  id={"edit_number"+see_manages.id}
                                  className="nyx-file-text"
                                  defaultValue={see_manages.detailed}
                                 disabled={this.state.edit_state==see_manages.id?false:true}
                                
                              />
                               </td>
                              <td>
                              <Button
                                 // raised 
                                  color="primary"
                                  className="nyx-org-btn-sm"
                                  style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"none":"block"}}
                                  onClick={() => {
                                   
                                    this.setState({
                                      edit_state:see_manages.id
                                    })
                                  //  console.log(see_manages.type_name)
                                  }}
                                      >
                                  {"编辑"}
                                  </Button>
                                  <Button
                                 // raised 
                                 style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"block":"none"}}
                                  color="primary"
                                  className="nyx-org-btn-sm"
                                  onClick={() => {
                                      
                                      this.edit_module(see_manages.id,"implement_area"+see_manages.id,"edit_number"+see_manages.id);
                                     
                                    //   this.setState({
                                    //       edit_state:0
                                    //   })
                                  }}
                                      >
                                  {"保存"}
                                  </Button>
                              
                              </td><td>
                              <Button
                                 // raised 
                                  color="primary"
                                  className="nyx-org-btn-sm"
                                  onClick={() => {
                                      this.del_module(see_manages.id);
                                     // this.fresh();
                                  }}
                                  style={{margin:0,marginLeft:10}}
                                  >
                                  {"删除"}
                                  </Button>
                              </td>
                          </tr>
                          }):this.state.see_manage_list.map(see_manages => {
                              
                            return <tr>
                            <td>

                            <TextField
                                          key={see_manages.name}
                                          style={{width:"110px"}}
                                              id={"edit_name"+see_manages.id}
                                              className="nyx-file-text"
                                              defaultValue= {see_manages.name}
                                              disabled={this.state.edit_state==see_manages.id?false:true}
                                              
                                          />
                                          </td><td
                                          style={{width:"215px"}}
                                          >
                          {/* <input
                          
                          value={type_infos.type_name}/> */}
                             <TextField
                             key={see_manages.number}
                                id={"edit_number"+see_manages.id}
                                className="nyx-file-text"
                                defaultValue={see_manages.number}
                               disabled={this.state.edit_state==see_manages.id?false:true}
                              
                            />
                             </td>
                            <td>
                            <Button
                               // raised 
                                color="primary"
                                className="nyx-org-btn-sm"
                                style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"none":"block"}}
                                onClick={() => {
                                 
                                  this.setState({
                                    edit_state:see_manages.id
                                  })
                                //  console.log(see_manages.type_name)
                                }}
                                    >
                                {"编辑"}
                                </Button>
                                <Button
                               // raised 
                               style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"block":"none"}}
                                color="primary"
                                className="nyx-org-btn-sm"
                                onClick={() => {
                                    this.edit_module(see_manages.id,"edit_name"+see_manages.id,"edit_number"+see_manages.id);
                                   
                                  //   this.setState({
                                  //       edit_state:0
                                  //   })
                                }}
                                    >
                                {"保存"}
                                </Button>
                            
                            </td><td>
                            <Button
                               // raised 
                                color="primary"
                                className="nyx-org-btn-sm"
                                onClick={() => {
                                    this.del_module(see_manages.id);
                                   // this.fresh();
                                }}
                                style={{margin:0,marginLeft:10}}
                                >
                                {"删除"}
                                </Button>
                            </td>
                        </tr>
                        })}
                    </table>
                </DialogContent>
                <DialogActions>
                    <div>
                        {/* <Button
                            onClick={() => {
                               this.setState({
                                edit_state:0
                                })
                                this.handleRequestClose()
                                
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button> */}
                        <Button
                            onClick={() => {
                                this.setState({
                                    edit_state:0
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
    //修改班级信息弹出框
    editClazzDialog = () => {
        return (
            <Dialog name="editClazzDialog" open={this.state.openEditClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    修改班级-{this.state.selected["id"]}-{this.state.selected["ti_id"]?getInst(this.state.selected["ti_id"]):""}
                    -{this.state.selected["area_id"]?getCity(this.state.selected["area_id"]):""}
                    -{this.state.selected["course_id"]?getClasstype(this.state.selected["course_id"]):""}
            </DialogTitle>
                <DialogContent>
                    <div>
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">班主任</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",}}
                        id="class_head"
                        defaultValue={this.state.selected["class_head"] === null ? "" : this.state.selected["class_head"]}
                        onChange={(e)=>{
                            for(var i=0;i< this.state.see_manage_head_list.length;i++){
                                if(e.target.value== this.state.see_manage_head_list[i].name){
                                    this.setState({
                                        head_number:  this.state.see_manage_head_list[i].number
                                    })
                                    
                                }
                            }
                            if(e.target.value==0){
                                this.setState({
                                    head_number:  ""
                                })
                            }
                           
                        }}
                        >
                        <option value={0}>-班主任-</option>
                        
                        {
                            this.state.see_manage_head_list.map(see_manages => {
                                return  <option value={see_manages.name} key={see_manages.name}>{see_manages.name}</option>
                            })
                        }
                           
                        </select></div>
                        
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">班主任电话</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",borderBottom:"dashed 1px"}}
                        id="mobile"
                        disabled={true}
                        value={this.state.head_number==""?this.state.selected.mobile:this.state.head_number}
                        >
                        <option value={0}>-班主任电话-</option>
                        <option value={this.state.head_number}>{this.state.head_number==""?"-班主任电话-":this.state.head_number}</option>
                        <option value={this.state.selected.mobile}>{this.state.selected.mobile}</option>
                        </select></div>

                        {/* <TextField
                            className="nyx-clazz-message"
                            key={"teacher"}
                            style={{width:"24%"}}
                            id={"mobile"}
                            label={"班主任电话"}
                            disabled={true}
                            value={this.state.head_number==""?this.state.selected.mobile:this.state.head_number}
                            >
                             
                        </TextField> */}
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">主办方联系人</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",}}
                        id="manager"
                        defaultValue={this.state.selected.manager}
                        onChange={(e)=>{
                           
                            for(var i=0;i< this.state.see_manage_sponser_list.length;i++){
                                if(e.target.value== this.state.see_manage_sponser_list[i].name){
                                    this.setState({
                                        sponsor_number:  this.state.see_manage_sponser_list[i].number
                                    })
                                    
                                   // this.state.head_number=see_manage_sponser_list[i].number;
                                }
                                    if(e.target.value==0){
                                        this.setState({
                                            sponsor_number:  ""
                                        })
                                    }
                            }
                        }}
                        >
                        <option value={0}>-主办方联系人-</option>
                        {
                            this.state.see_manage_sponser_list.map(see_manages => {
                                return  <option value={see_manages.name} key={see_manages.name}>{see_manages.name}</option>
                            })
                        }
                           
                        </select></div>
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">主办方联系人电话</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",borderBottom:"dashed 1px"}}
                        id="manager_mobile"
                        disabled={true}
                        value={this.state.sponsor_number==""?this.state.selected.manager_mobile:this.state.sponsor_number}
                        >
                        <option value={0}>-主办方联系人电话-</option>
                        <option value={this.state.sponsor_number}>{this.state.sponsor_number}</option>
                        <option value={this.state.selected.manager_mobile}>{this.state.selected.manager_mobile}</option>
                        </select></div>
                       
                        {/* <TextField
                            className="nyx-clazz-message"
                            key={"manager_mobile"}
                            style={{width:"24%"}}
                            id={"manager_mobile"}
                            label={"主办方联系人电话"}
                            disabled={true}
                            value={this.state.sponsor_number==""?this.state.selected.manager_mobile:this.state.sponsor_number}
                            >
                             
                        </TextField> */}
                        <TextField
                            style={{width:"24%",margin:0,marginRight:"1px",fontSize:"14px"}}
                            className="nyx-clazz-message"
                            key={"plan_train_num"}
                            id={"plan_train_num"}
                            label={"培训人数"}
                            defaultValue={this.state.selected.plan_train_num==null?"65人(含15人补考)":this.state.selected.plan_train_num}
                            onChange={(event) => {
                               
                            }}>
                        </TextField>
                        <div className="nyx-class-lists-div" style={{width:"74%"}}>
                        <p className="nyx-class-lists-p">详细地址</p>
                        <select className="nyx-class-lists-select"
                        id="address"
                        defaultValue={this.state.selected.address==""?"":this.state.selected.address}
                        //defaultValue={}
                        onChange={(e)=>{
                           
                        }}

                        >
                        <option value={0}>-详细地址-</option>
                        {this.state.detail_area_list.map(detail => {
                          return <option>
                          {detail.detailed}</option>
                        })}
                       
                           
                        </select></div>
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">理论讲师</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",}}
                        id="teacher"
                        defaultValue={this.state.selected.teacher}
                        onChange={(e)=>{
                            for(var i=0;i< this.state.see_manage_theory_list.length;i++){
                                if(e.target.value== this.state.see_manage_theory_list[i].name){
                                    this.setState({
                                        theory_number:  this.state.see_manage_theory_list[i].number
                                    })
                                   // this.state.head_number=see_manage_theory_list[i].number;
                                }
                            }
                            if(e.target.value==0){
                                this.setState({
                                    theory_number:  ""
                                })
                            }
                        }}
                        >
                        <option value={0}>-理论讲师-</option>
                        {
                            this.state.see_manage_theory_list.map(see_manages => {
                                return  <option value={see_manages.name} key={see_manages.name}>{see_manages.name}</option>
                            })
                        }
                           
                        </select></div>
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">理论讲师编号</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",borderBottom:"dashed 1px"}}
                        id="teacher_number"
                         disabled={true}
                        value={this.state.theory_number==""?this.state.selected.teacher_number:this.state.theory_number}
                        >
                        <option value={0}>-理论讲师编号-</option>
                        <option value={this.state.theory_number}>{this.state.theory_number}</option>
                        <option value={this.state.selected.teacher_number}>{this.state.selected.teacher_number}</option>
                        </select></div>
                       
                        {/* <TextField
                            className="nyx-clazz-message"
                            key={"teacher_number"}
                            style={{width:"24%"}}
                            id={"teacher_number"}
                            label={"理论讲师编号"}
                            disabled={true}
                            value={this.state.theory_number==""?this.state.selected.teacher_number:this.state.theory_number}
                            >
                             
                        </TextField> */}
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">实践讲师</p>
                        <select className="nyx-class-lists-select"
                         style={{fontSize:"14px",fontFamily:"微软雅黑"}}
                        id="expert"
                        defaultValue={this.state.selected.expert==""?"":this.state.selected.expert}
                        onChange={(e)=>{
                            for(var i=0;i< this.state.see_manage_expert_list.length;i++){
                                if(e.target.value== this.state.see_manage_expert_list[i].name){
                                    this.setState({
                                        expert_number:  this.state.see_manage_expert_list[i].number
                                    })
                                }
                            }
                            if(e.target.value==0){
                                this.setState({
                                    expert_number:  ""
                                })
                            }
                        }}
                        >
                        <option value={0}>-实践讲师-</option>
                        {
                            this.state.see_manage_expert_list.map(see_manages => {
                                return  <option value={see_manages.name} key={see_manages.name}>{see_manages.name}</option>
                            })
                        }
                           
                        </select></div>
                        <div className="nyx-class-lists-div">
                        <p className="nyx-class-lists-p">实践讲师编号</p>
                        <select className="nyx-class-lists-select"
                        style={{fontSize:"14px",fontFamily:"微软雅黑",borderBottom:"dashed 1px"}}
                        id="expert_number"
                        disabled={true}
                        value={this.state.expert_number==""?this.state.selected.expert_number:this.state.expert_number}
                        >
                        <option value={0}>-实践讲师编号-</option>
                        <option value={this.state.expert_number}>{this.state.expert_number}</option>
                        <option value={this.state.selected.expert_number}>{this.state.selected.expert_number}</option>
                        </select></div>
                       
                        {/* <TextField
                            className="nyx-clazz-message"
                            key={"expert_number"}
                            style={{width:"24%"}}
                            id={"expert_number"}
                            label={"实践讲师编号"}
                            disabled={true}
                            value={this.state.expert_number}
                            >
                             
                        </TextField> */}
                       <div
                       style={{width:"24%",top:"1rem"}}
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
                       style={{width:"24%",top:"1rem"}}
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
                       <div
                       style={{width:"24%",top:"1rem"}}
                       className="nyx-input-date nyx-clazz-message"
                       >
                       <span 
                       >考试时间</span>
                        <input
                       // id="train_starttime"
                         style={{}}
                          type="date"
                          defaultValue={this.state.selected_test_year+"-"+this.state.selected_test_month+"-"+this.state.selected_test_date}
                          onChange={(event) => {
                              var test_year=event.target.value.substr(0,4),
                                 test_month=event.target.value.substr(5,2),
                                 test_date=event.target.value.substr(8,2)
                                  this.state.selected["test_time"]=test_year+test_month+test_date;
                             
                          }}
                        />
                       </div>
                       <TextField
                            className="nyx-clazz-message"
                            style={{width:"24%",top:"15px",fontSize:"14px"}}
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
                            key={"demo"}
                            style={{width:"96.5%",marginTop:"2rem",fontSize:"14px"}}
                            id={"demo"}
                            label={"备注"}
                            defaultValue={this.state.selected["demo"] === null ? "" : this.state.selected["demo"]}
                            >
                             
                        </TextField>
                       
                       
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                var class_head = (document.getElementById("class_head").value==0?"":document.getElementById("class_head").value);
                                var mobile =  (document.getElementById("mobile").value==0?"":document.getElementById("mobile").value);
                                var manager = (document.getElementById("manager").value==0?"":document.getElementById("manager").value);
                                var manager_mobile =  (document.getElementById("manager_mobile").value==0?"":document.getElementById("manager_mobile").value);
                                var plan_train_num = (document.getElementById("plan_train_num").value);
                                var class_code = document.getElementById("class_code").value;
                                var address = (document.getElementById("address").value==0?"":document.getElementById("address").value);
                                var teacher = (document.getElementById("teacher").value);
                                var teacher_number = (document.getElementById("teacher_number").value==0?"":document.getElementById("teacher_number").value);
                                var expert = (document.getElementById("expert").value==0?"":document.getElementById("expert").value);
                                var expert_number = (document.getElementById("expert_number").value==0?"":document.getElementById("expert_number").value);
                               
                                var train_starttime =  this.state.selected["train_starttime"];
                                var train_endtime = this.state.selected["train_endtime"];
                                var test_time=this.state.selected["test_time"];
                                var demo=(document.getElementById("demo").value);
                                
                               // var mobile = (document.getElementById("mobile").value);
                                this.modifyClazz(this.state.selected.id, {
                                    class_head: class_head,
                                    mobile:mobile,
                                    manager:manager,
                                    manager_mobile:manager_mobile,
                                    plan_train_num:plan_train_num,
                                    class_code: class_code,
                                    address: address,
                                    teacher: teacher,
                                    teacher_number:teacher_number,
                                    expert:expert,
                                    expert_number:expert_number,
                                    train_starttime: train_starttime,
                                    train_endtime: train_endtime,
                                    test_time:test_time,
                                    
                                    demo:demo
                                })
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
    render() {
        return (
            <div style={{ marginTop: 80, width: "100%" }}>
                <div style={{marginTop:"1rem"}}>
                <select
                    style={{marginLeft:10}}
                        className="nyx-info-select-lg"
                        id="search_record_area_id"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        defaultValue={this.state.search_area_id === null ? "" : this.state.search_area_id}
                        onChange={(e) => {
                            console.log( e.target.value)
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
                        style={{marginLeft:"0.5rem"}}
                        className="nyx-info-select-lg"
                        id={"search_record_course_id"}
                        defaultValue={this.state.search_course_id ? this.state.search_course_id : ""}
                        disabled={this.state.search_course_id == -1 ? true : false}
                        onChange={(e) => {
                            this.state.search_course_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.course_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-课程名称-"}</option>
                        {getClasstypes().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                    </select>
                    <select
                        style={{marginLeft:"0.5rem"}}
                        className="nyx-info-select-lg"
                        id={"search_record_institution"}
                        onChange={(e) => {
                            this.state.search_institution =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.institution =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-培训机构-"}</option>
                        {/* <option value={0}>{"无培训机构"}</option> */}
                        <option value={1}>{"中软培训"}</option>
                        <option value={2}>{"赛迪"}</option>
                        <option value={3}>{"赛宝"}</option>

                    </select>
                    <select
                     style={{marginLeft:"0.5rem"}}
                     className="nyx-info-select-lg"
                     id={"search_record_year"}
                     onChange={(e) => {
                        // console.log(e.target.value)
                        this.setState({search_year:e.target.value == "null"? null:e.target.value})
                        this.state.queryCondition.train_time=e.target.value == "null"? null:this.state.search_month==null?e.target.value:e.target.value+this.state.search_month;

                         this.state.search_year == "null"? this.state.queryCondition.train_month=="null":"";
                         console.log(e.target.value+this.state.queryCondition.train_month)
                       // this.state.search_year =  e.target.value == "null"? null:e.target.value;
                        //this.state.queryCondition.institution =  e.target.value == "null"? null:e.target.value;
                    }}
                     >
                    <option value={"null"}>{"-培训年份-"}</option>
                    {this.date_arr()}
                    </select>
                    <select
                     style={{marginLeft:"0.5rem"}}
                     value={ this.state.search_year==null?"null":this.state.search_month}
                     disabled={ this.state.search_year==null?true:false}
                     className="nyx-info-select-lg"
                     id={"search_record_month"}
                     onChange={(e) => {
                         this.setState({
                            search_month:e.target.value == "null"? null:e.target.value
                         })
                        // console.log(this.state.queryCondition.train_year)
                        //this.state.search_month =  e.target.value == "null"? null:e.target.value;
                        this.state.queryCondition.train_time =  e.target.value == "null"? this.state.search_year:this.state.search_year+e.target.value;
                         
                    }}
                     >
                    <option value={"null"}>{"-培训月份-"}</option>
                    {this.month_arr()}
                    </select>
                    <select
                        style={{marginLeft:"0.5rem"}}
                        className="nyx-info-select-lg"
                        id={"search_record_state"}
                        onChange={(e) => {
                            this.state.search_state=  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.state =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-备案情况-"}</option>
                        {/* <option value={0}>{"无培训机构"}</option> */}
                        <option value={1}>{"未备案"}</option>
                        <option value={2}>{"已备案"}</option>
                        

                    </select>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-sm"
                        onClick={() => {
                            this.state.selectedClazzID = [];
                            this.state.currentPageSelectedID = [];
                            this.queryStudents(1, true);
                        }}
                        style={{marginLeft:10,position:"relative",top:"-2px"}}
                    >
                        {"搜索"}
                    </Button>
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({openDialog: true , openhead: true ,beingLoading: true});
                        this.see_module(CLASSTEACHER_INFOS);
                    }}
                    style={{marginLeft:5,position:"relative",top:"-2px",minWidth:"85px"}}
                >
                    {"班主任管理"}
                </Button>
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true,opensponsor:true,beingLoading: true });
                        this.see_module(SPONSOR_INFOS);
                    }}
                    style={{marginLeft:5,position:"relative",top:"-2px",minWidth:"125px"}}
                >
                    {"主办方联系人管理"}
                </Button>
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true ,opentheory:true,beingLoading: true});
                        this.see_module(TEACHER_INFOS);
                    }}
                    style={{marginLeft:5,position:"relative",top:"-2px",minWidth:"95px"}}
                >
                    {"理论讲师管理"}
                </Button>   
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true,openpractice:true,beingLoading: true });
                        this.see_module(EXPERT_INFOS);
                    }}
                    style={{marginLeft:5,position:"relative",top:"-2px",minWidth:"95px"}}
                >
                    {"实践讲师管理"}
                </Button>   
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true,openimplement: true,beingLoading: true });
                        this.see_module(ADDRESS_INFOS);
                    }}
                    style={{marginLeft:5,position:"relative",top:"-2px",minWidth:"95px",marginBottom:"2rem"}}
                >
                    {"实施地点管理"}
                </Button>   
                    
                   
                   
                   
                </div>
                
                <ReactDataGrid
                    style={{marginTop:"1rem"}}
                    rowKey="id"
                    columns={
                        [
                            {
                                key: "id",
                                name: "班级id",
                                width: 70,
                                resizable: true
                            },
                            {
                                key: "course_id",
                                name: "培训类型",
                                width: 80,
                                resizable: true
                            },
                            {
                                key: "institution",
                                name: "培训机构",
                                width: 100,
                                resizable: true
                            },
                            {
                                key: "state",
                                name: "备案情况",
                                width: 80,
                                resizable: true
                            },
                            {
                                key: "train_time",
                                name: "培训时间",
                                width: 150,
                                resizable: true
                            },
                            {
                                key: "test_time",
                                name: "考试时间",
                                width: 100,
                                resizable: true
                            },
                            {
                                key: "plan_train_num",
                                name: "培训人数",
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
                                key: "address",
                                name: "培训地点",
                                width: 80,
                                resizable: true
                            },
                            {
                                key: "class_head",
                                name: "班主任-电话",
                                width: 125,
                                resizable: true
                            },
                            {
                                key: "manager",
                                name: "主办方负责人-电话",
                                width: 125,
                                resizable: true
                            },
                            {
                                key: "teacher",
                                name: "理论讲师-讲师编号",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "expert",
                                name: "实践讲师-讲师编号",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "class_code",
                                name: "班级编号",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "register",
                                name: "备注",
                                width: 120,
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
                            id: this.state.tableData[i].id,
                            //student_id: this.state.tableData[i].id,
                            course_id: getClasstype(this.state.tableData[i].course_id),
                            institution: getInst(this.state.tableData[i].ti_id),
                            state: this.state.tableData[i].state==1?"未备案":this.state.tableData[i].state==2?"已备案":"",
                            train_time: this.state.tableData[i].train_starttime==null?
                            this.state.tableData[i].train_endtime==null?"":"~"+this.state.tableData[i].train_endtime:this.state.tableData[i].train_endtime==null?this.state.tableData[i].train_starttime+"~":this.state.tableData[i].train_starttime+"~"+this.state.tableData[i].train_endtime,
                            test_time: this.state.tableData[i].test_time==null?"":this.state.tableData[i].test_time,
                            plan_train_num:this.state.tableData[i].plan_train_num==null?"":this.state.tableData[i].plan_train_num,
                            area_name: getCity(this.state.tableData[i].area_id),
                            address:this.state.tableData[i].address==null?"":this.state.tableData[i].address,
                            class_head:this.state.tableData[i].class_head==null?
                            this.state.tableData[i].mobile==null?"":"-"+this.state.tableData[i].mobile:this.state.tableData[i].mobile==null?this.state.tableData[i].class_head:this.state.tableData[i].class_head+"-"+this.state.tableData[i].mobile,
                            manager:this.state.tableData[i].manager==null?
                            this.state.tableData[i].manager_mobile==null?"":"-"+this.state.tableData[i].manager_mobile:this.state.tableData[i].manager_mobile==null?this.state.tableData[i].manager:this.state.tableData[i].manager+"-"+this.state.tableData[i].manager_mobile,
                            teacher:this.state.tableData[i].teacher==null?
                            this.state.tableData[i].teacher_number==null?"":"-"+this.state.tableData[i].teacher_number:this.state.tableData[i].teacher_number==null?this.state.tableData[i].teacher:this.state.tableData[i].teacher+"-"+this.state.tableData[i].teacher_number,
                            expert:this.state.tableData[i].expert==null?
                            this.state.tableData[i].expert_number==null?"":"-"+this.state.tableData[i].expert_number:this.state.tableData[i].expert_number==null?this.state.tableData[i].expert:this.state.tableData[i].expert+"-"+this.state.tableData[i].expert_number,
                            class_code:this.state.tableData[i].class_code,
                            register: this.state.tableData[i].demo,
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
                <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-lg"
                        onClick={() => {
                            console.log(this.state.selectedClazzID)
                           if(this.state.selectedClazzID.length!=1){
                            this.popUpNotice(NOTICE, 0, "请选择一个班级修改班级信息");
                            return false;
                           }
                           for(var i=0;i<this.state.selectedClazzID.length;i++){
                               this.state.thisClazzId=this.state.selectedClazzID[i];
                               
                           }
                           for(var i=0;i<this.state.allData.length;i++){
                               if(this.state.allData[i].id==this.state.thisClazzId){
                                   this.state.selected=this.state.allData[i];
                                   this.detail_area_list(this.state.selected.area_id)
                                   this.state.selected_start_year = this.state.selected["train_starttime"]==null?"":this.state.selected["train_starttime"].substr(0,4)
                                   this.state.selected_start_month = this.state.selected["train_starttime"]==null?"":this.state.selected["train_starttime"].substr(4,2)
                                   this.state.selected_start_date = this.state.selected["train_starttime"]==null?"":this.state.selected["train_starttime"].substr(6,2)

                                   this.state.selected_end_year = this.state.selected["train_endtime"]==null?"":this.state.selected["train_endtime"].substr(0,4)
                                   this.state.selected_end_month = this.state.selected["train_endtime"]==null?"":this.state.selected["train_endtime"].substr(4,2)
                                   this.state.selected_end_date = this.state.selected["train_endtime"]==null?"":this.state.selected["train_endtime"].substr(6,2)
                                   this.state.selected_test_year = this.state.selected["test_time"]==null?"":this.state.selected["test_time"].substr(0,4)
                                   this.state.selected_test_month = this.state.selected["test_time"]==null?"":this.state.selected["test_time"].substr(4,2)
                                   this.state.selected_test_date = this.state.selected["test_time"]==null?"":this.state.selected["test_time"].substr(6,2)
                                  
                                   this.setState({ openEditClazzDialog: true,
                                    expert_number:"",
                                    manager_mobile:"",
                                    theory_number:"",
                                    mobile:""})
                                   //console.log(this.state.allData[i])
                               }
                           }
                        ///   console.log(this.state.tableData)
                        //   console.log("修改班级信息")
                            
                        }}
                        style={{marginLeft:10,position:"relative",top:"-2px",minWidth:"110px"}}
                    >
                        {"修改班级信息"}
                    </Button>
                <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                        onClick={() => {
                           console.log( this.state.selectedClazzID)
                           this.class_record();
                            // this.state.selectedClazzID = [];
                            // this.state.currentPageSelectedID = [];
                            // this.queryStudents(1, true);
                        }}
                        style={{marginLeft:10,position:"relative",top:"-2px"}}
                    >
                        {"更新备案"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                        onClick={() => {
                           console.log( this.state.selectedClazzID)
                           
                           if(this.state.selectedClazzID.length!=1){
                            this.popUpNotice(NOTICE, 0, "请选择一个班级查询备案记录");
                           }
                            // this.state.selectedClazzID = [];
                            // this.state.currentPageSelectedID = [];
                            // this.queryStudents(1, true);
                        }}
                        style={{marginLeft:10,position:"relative",top:"-2px"}}
                    >
                        {"备案记录"}
                    </Button>
                    
                {/* {"已选择"+this.state.selectedClazzID.length + "人/"}

                共{this.state.count}人
                 */}
                 {/* {this.headDialog()} */}
                  
                  {this.state.openhead?this.Dialogs("班主任管理","电话","暂无班主任信息，请点击新增！"):""}
                  {this.state.opensponsor?this.Dialogs("主办方联系人管理","电话","暂无主办方联系人信息，请点击新增！"):""}
                  {this.state.opentheory?this.Dialogs("理论讲师管理","讲师编号","暂无理论讲师信息，请点击新增！"):""}
                  {this.state.openpractice?this.Dialogs("实践讲师管理","讲师编号","暂无实践讲师信息，请点击新增！"):""}
                  {this.state.openimplement?this.Dialogs("实施地点管理","详细地址","暂无实施地点信息，请点击新增！"):""}
                {this.editClazzDialog()}
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
export default Clazzrecord;