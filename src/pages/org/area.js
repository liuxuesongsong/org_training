import React, { Component } from 'react';
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
import BeingLoading from '../../components/BeingLoading'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';

import { initCache, getData, getRouter, getCache, getStudent,getAreas, getCity, getCourse } from '../../utils/helpers';


import { ALERT, NOTICE, ADMIN_ADD,INST_QUERY,ADMIN_DEL,ADMIN_EDIT, AREA_INFOS, QUERY,CLASSTEACHER_ADD,CLASSTEACHER_INFOS,CLASSTEACHER_DEL,CLASSTEACHER_UPDATA,SPONSOR_ADD,SPONSOR_INFOS,SPONSOR_DEL,SPONSOR_UPDATA,
    TEACHER_ADD,TEACHER_INFOS,TEACHER_DEL,TEACHER_UPDATA,EXPERT_ADD,EXPERT_INFOS,EXPERT_DEL,EXPERT_UPDATA,ADDRESS_ADD,ADDRESS_INFOS,ADDRESS_DEL,ADDRESS_UPDATA,CLASS_RECORD,MANAGE_LISTS,DETAIL_AREA_LIST, } from '../../enum';

import Code from '../../code';
import Lang from '../../language';

import CommonAlert from '../../components/CommonAlert';

class Area extends Component {
    state = {
        areas: [],
        clazz: [],
        clazzes:[],
        role_model:[],
        selected_role_model:[],
        check_area_val: [],//选中area的id
        check_list_val:[],//选中nav的id
        account_info:[],
        selected: {},
        showInfo: false,
        openNewAreaDialog: false,
        openEditAreaDialog: false,
        islength:"",
        openDialog:false,
        opentheory:false,
        openhead:false,
        opensponsor:false,
        openpractice:false,
        openimplement:false,//实施地点管理模块
        beingLoading: false,
        see_clazzhead_list:[],//查看班主任管理列表
        see_manage_list:[],
        edit_state:0,
        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
       alertContent: ""
    }

    componentDidMount() {
        window.currentPage = this;
        
        this.queryArea();
        this.fresh()
    }

    fresh = () => {
        initCache(this.cacheToState);
       
    }
    cacheToState() {
        window.currentPage.state.areas = getAreas();
        var cb = (router, message, arg) => {
            window.currentPage.setState({
                my_id: message.data.myinfo.my_id, 
                role_model:message.data.role_model,
                selected_role_model:message.data.role_model[0].roles
            })
        }
        getData(getRouter(INST_QUERY), { session: sessionStorage.session }, cb, {});
        window.currentPage.state.account_info = getCache("account_info").sort((a, b) => {
            return b.id - a.id
        });
        window.currentPage.state.clazzes = getCache("clazzes").sort((a, b) => {
            return b.id - a.id
        });
        
        

    }

    queryArea = () => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({ areas: message.area })
            }
        }
        getData(getRouter(AREA_INFOS), { session: sessionStorage.session }, cb, {});
    }
    select_area = (name) =>{
       var obj =  document.getElementsByName(name);
       this.state.check_area_val = [];
        for(var k in obj){
            if(obj[k].checked)
            this.state.check_area_val.push(obj[k].value);
        }
        
    }
    select_clazz = (name) =>{
        var obj =  document.getElementsByName(name);
        this.state.check_clazz_val = [];
         for(var k in obj){
             if(obj[k].checked)
             this.state.check_clazz_val.push(obj[k].value);
         }
         
     }
     select_list = (name) => {
        var obj =  document.getElementsByName(name);
        this.state.check_list_val = [];
         for(var k in obj){
             if(obj[k].checked)
             this.state.check_list_val.push(obj[k].value);
         }
     }

    selected_roles = () => {
        
        var components = []
        var list = {1:"首页",2:"学生信息",3:"班级安排"}
        var modules_arr = this.state.selected_role_model;
        for(var id in list){
            components.push(
                <label style={{width:"33%",float:"left",display:"block"}}  key={id}  value={id}><input name={"checkbox_list"} key={id} checked={this.state.selected_role_model.indexOf(id)!=-1?true:false} value={id} type="checkbox"></input>{list[id]}</label>
            )
        }
        return components
       
     }
     selected_list = () => {
        
        var components = []
        var list = {1:"首页",2:"学生信息",3:"班级安排"}
        var modules_arr = this.state.selected.modules_id;
        for(var id in list){
            components.push(
                <label style={{width:"33%",float:"left",display:"block"}}  key={id}  value={id}><input name={"change_checkbox_list"} key={id} defaultChecked={modules_arr.indexOf(id)!=-1?true:false} value={id} type="checkbox"></input>{list[id]}</label>
            )
        }
        return components
       
     }
   

     editAreaDialog = () => {
        return (
            <Dialog open={this.state.openEditAreaDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    
            </DialogTitle>
                <DialogContent>
                    <div style={{width:"515px"}}>
                    <TextField
                            style={{width:"100%"}}
                            className="nyx-form-div"
                            key={"account"}
                            id={"change_area_account"}
                            label={"用户名"}
                            defaultValue={this.state.selected.account === null ? "" : this.state.selected.account}
                         
                            >
                        </TextField>
                        <div>
                        <p>可显示区域</p>
                       {/* {this.nav_list("change_checkbox_list")} */}
                      { this.state.selected.modules_id?this.selected_list():""}
                      {/* <p style={{marginTop:"4.5rem"}}>选择所属服务区</p>
                      <div style={{minHeight:"270px"}}>
                        {this.state.selected.areas_id?getAreas().map(area => {
                          return <label style={{width:"33%",float:"left",display:"block"}} key={area.id} value={area.id}><input name={"change_checkbox_area"} key={area.id} defaultChecked={this.state.selected.areas_id.indexOf(area.id.toString())!=-1?true:false} value={area.id} type="checkbox"></input>{area.area_name}</label>}):""}
                        </div> */}
                        <p style={{paddingTop:"2.5rem"}}>班主任分配</p>
                        
                        {this.state.selected.clazz_id?this.state.see_clazzhead_list.map(
                                clazzhead =>
                               {
                                  
                                   
                                   return <label style={{display:"block"}} key={clazzhead.id} value={clazzhead.id}><input name={"change_checkbox_clazz"} key={clazzhead.id} value={clazzhead.id} 
                                   defaultChecked={this.state.selected.clazz_id.indexOf(clazzhead.id)!=-1?true:false}
                                    type="checkbox"></input>{clazzhead.name}</label>
                               }
                            ):""}
                        
                        </div>
                       
                        
                        
                        
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                               this.select_list("change_checkbox_list");
                               this.select_area("change_checkbox_area");
                               this.select_clazz("change_checkbox_clazz");
                               this.changeArea({
                                id:this.state.selected.id,
                                account: document.getElementById("change_area_account").value,
                               // password: document.getElementById("area_name_password").value,
                                modules_id:this.state.check_list_val,
                                areas_id:this.state.check_area_val,
                                clazz_id:this.state.check_clazz_val,
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








    newAreaDialog = () => {
        return (
            <Dialog open={this.state.openNewAreaDialog} onRequestClose={this.handleRequestClose} >
                {/* <DialogTitle>
                    新增服务区
                </DialogTitle> */}
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.org.new_service}
                        </Typography>
                        <TextField
                            id="account_area"
                            label={Lang[window.Lang].pages.org.clazz.info.account}
                            defaultValue={""}
                            fullWidth
                        />
                        <TextField
                            id="area_name_password"
                            type="password"
                            label={Lang[window.Lang].pages.org.clazz.info.password}
                            defaultValue={""}
                            fullWidth
                        />
                         <TextField
                            id="area_name_check_password"
                            type="password"
                            label={Lang[window.Lang].pages.org.clazz.info.check_password}
                            defaultValue={""}
                            fullWidth
                        />
                        <p><select
                            id="select_role"
                            defaultValue={""}
                            onChange={(e)=>{
                                var obj = document.getElementsByName("checkbox_list");
                                this.state.selected_role_model=e.target.value.split(",");
                                for(var id=0;id<obj.length;id++){
                                  obj[id].checked=this.state.selected_role_model.indexOf(obj[id].value)!=-1?true:false
                                  //  obj[id].checked=this.change_check_role(id,this.state.selected_role_model);
                                }
                         
                            }}
                            >
                            {this.state.role_model.map((role) => {
                          return <option key={role.roles} value={role.roles}>{role.name}</option>
                            })}
                            </select></p>
                        
                          
                        {
                            this.selected_roles()
                          // this.nav_list("checkbox_list") 
                        }
                        
                        
                      <p style={{marginTop:"4.5rem"}}>选择所属服务区</p>
                        <div style={{minHeight:"270px"}}>
                        {getAreas().map(area => {
                                return <label style={{width:"33%",float:"left",display:"block"}} key={area.id} value={area.id}><input name={"checkbox_area"} key={area.id} value={area.id} type="checkbox"></input>{area.area_name}</label>
                            })}
                        </div>
                             <p>班主任分配</p>
                            {this.state.clazzes.map(
                                clazz =>
                               {
                                   return <label style={{display:"block"}} key={clazz.id} value={clazz.id}><input name={"checkbox_clazz"} key={clazz.id} value={clazz.id} type="checkbox"></input>{clazz.class_code}{"-"}{getCity(clazz.area_id)}{"-"}{getCourse(clazz.course_id)}</label>
                               }
                            )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                if(document.getElementById("area_name_password").value!=document.getElementById("area_name_check_password").value){
                                    this.popUpNotice(NOTICE, 0, "两次密码不一致");
                                    return
                                }
                                this.select_area("checkbox_area");
                                this.select_list("checkbox_list");
                                this.select_clazz("checkbox_clazz");
                                this.newArea({
                                    account: document.getElementById("account_area").value,
                                    password: document.getElementById("area_name_password").value,
                                    modules_id:this.state.selected_role_model,
                                    areas_id:this.state.check_area_val,
                                    clazz_id:this.state.check_clazz_val

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
            </Dialog>
        )
    }




    newArea = (area) => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                Object.assign(arg.area, { id: message.id })
                this.state.account_info.push(arg.area)
                this.setState({ account_info: this.state.account_info })
                this.fresh();
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            account: document.getElementById("account_area").value,
            password: document.getElementById("area_name_password").value,
            modules_id:this.state.selected_role_model,
            areas_id:this.state.check_area_val,
            clazz_id:this.state.check_clazz_val
        }
        getData(getRouter(ADMIN_ADD), obj, cb, { area: area });

    }

    delArea = (id) => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < this.state.account_info.length; i++) {
                    if (this.state.account_info[i].id === arg.id) {
                        this.state.account_info.splice(i, 1);
                        this.setState({
                            account_info: this.state.account_info
                        })
                        break;
                    }
                }
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(ADMIN_DEL), { session: sessionStorage.session, id: id }, cb, { id: id });
    }
    changeArea = (area) => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                Object.assign(arg.area, { id: message.id })
                this.setState({ account_info: this.state.account_info })
                this.fresh();
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
            id:this.state.selected.id,
            account: document.getElementById("change_area_account").value,
             modules_id:this.state.check_list_val,
            // areas_id:this.state.check_area_val,
             clazz_id:this.state.check_clazz_val,
        }
        getData(getRouter(ADMIN_EDIT), obj, cb, { area: area });

    }



    queryClazzInArea = () => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.areas = message.area
            }
        }
        getData(getRouter(), { session: sessionStorage.session, id: id }, cb, { id: id });

    }

    handleRequestClose = () => {
        this.setState({
            openNewAreaDialog: false,
            openEditAreaDialog: false,
            openheadDialog: false,
            openDialog:false,
            opentheory:false,
            openhead:false,
            opensponsor:false,//主办方
            openpractice:false,//实践
            openimplement:false,//实施
            beingLoading: false,//loading结束
            edit_state:0,
            islength:""
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
    see_clazzhead = () =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
              
                this.state.see_clazzhead_list=message.data;
              
            }
            
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(CLASSTEACHER_INFOS), { session: sessionStorage.session }, cb, {});
    }
     //查看管理模块
     see_module = (see_module) =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.setState({
                beingLoading: false
               })
                this.state.see_manage_list=message.data;
              if(see_module==CLASSTEACHER_INFOS){
                  this.state.see_clazzhead_list = message.data;
              }
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
                })
                {this.state.openhead? this.see_module(CLASSTEACHER_INFOS):""}
                {this.state.opensponsor? this.see_module(SPONSOR_INFOS):""}
                {this.state.opentheory? this.see_module(TEACHER_INFOS):""}
                {this.state.openpractice? this.see_module(EXPERT_INFOS):""}
                {this.state.openimplement? this.see_module(ADDRESS_INFOS):""}
               
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
                this.fresh()
                
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
              {this.state.openhead? this.see_module(CLASSTEACHER_INFOS):""}
              {this.state.opensponsor? this.see_module(SPONSOR_INFOS):""}
              {this.state.opentheory? this.see_module(TEACHER_INFOS):""}
              {this.state.openpractice? this.see_module(EXPERT_INFOS):""}
              {this.state.openimplement? this.see_module(ADDRESS_INFOS):""}
                this.fresh()
              
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        
    var name= document.getElementById(name).value;
    var number = document.getElementById(number).value;
    {this.state.openhead?getData(getRouter(CLASSTEACHER_UPDATA), { session: sessionStorage.session,id:id,name:name,number:number }, cb, {}):""}
    //主办方联系人 
    {this.state.opensponsor?getData(getRouter(SPONSOR_UPDATA), { session: sessionStorage.session, id:id,name:name,number:number }, cb, {}):""}
    //理论讲师
    {this.state.opentheory?getData(getRouter(TEACHER_UPDATA), { session: sessionStorage.session, id:id,name:name,number:number }, cb, {}):""}
    //实践讲师
    {this.state.openpractice?getData(getRouter(EXPERT_UPDATA), { session: sessionStorage.session, id:id,name:name,number:number  }, cb, {}):""}

//实施地点
{this.state.openimplement?getData(getRouter(ADDRESS_UPDATA), { session: sessionStorage.session, id:id,address_area_id:name,detailed:number  }, cb, {}):""}


    }
    Dialogs = (title,type,islength) => {
        return (
            <Dialog  open={this.state.openDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle >
                {this.state.beingLoading ?
          <BeingLoading /> : ''
        }

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
                        onChange={(e) => {
                            this.state.create_name =  e.target.value == "null"? null:e.target.value;
                        }}
                    >   
                        <option value={"null"}>{"-省市-"}</option>
                        {getAreas().map(area => {
                            return <option key={area.id} value={area.id}>{area.area_name}</option>
                        })}
                    </select>: <TextField
                                    key={"create_name"}
                                    id="create_name"
                                    className="nyx-file-text"
                                    onChange={(e)=>{
                                        this.setState({
                                            create_name:e.target.value
                                        })
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
                                    }
                                        this.create_module();
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
                               <TextField
                               key={see_manages.detailed}
                                  id={"edit_number"+see_manages.id}
                                  className="nyx-file-text"
                                  title={see_manages.detailed}
                                  defaultValue={see_manages.detailed}
                                 disabled={this.state.edit_state==see_manages.id?false:true}
                                
                              />
                               </td>
                              <td>
                              <Button
                                  color="primary"
                                  className="nyx-org-btn-sm"
                                  style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"none":"block"}}
                                  onClick={() => {
                                   
                                    this.setState({
                                      edit_state:see_manages.id
                                    })
                                  }}
                                      >
                                  {"编辑"}
                                  </Button>
                                  <Button
                                 style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"block":"none"}}
                                  color="primary"
                                  className="nyx-org-btn-sm"
                                  onClick={() => {
                                      
                                      this.edit_module(see_manages.id,"implement_area"+see_manages.id,"edit_number"+see_manages.id);
                                  }}
                                      >
                                  {"保存"}
                                  </Button>
                              
                              </td><td>
                              <Button
                                  color="primary"
                                  className="nyx-org-btn-sm"
                                  onClick={() => {
                                      this.del_module(see_manages.id);
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
                                color="primary"
                                className="nyx-org-btn-sm"
                                style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"none":"block"}}
                                onClick={() => {
                                 
                                  this.setState({
                                    edit_state:see_manages.id
                                  })
                                }}
                                    >
                                {"编辑"}
                                </Button>
                                <Button
                               style={{margin: 0,marginLeft:20,display:this.state.edit_state==see_manages.id?"block":"none"}}
                                color="primary"
                                className="nyx-org-btn-sm"
                                onClick={() => {
                                    this.edit_module(see_manages.id,"edit_name"+see_manages.id,"edit_number"+see_manages.id);
                                }}
                                    >
                                {"保存"}
                                </Button>
                            
                            </td><td>
                            <Button
                                color="primary"
                                className="nyx-org-btn-sm"
                                onClick={() => {
                                    this.del_module(see_manages.id);
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

    render() {
        return <div style={{width:"100%"}}>

            <div style={{ width:"400px",margin:"auto",marginTop:"4rem" }}>
                    <ListSubheader>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.setState({
                                    openNewAreaDialog: true
                                });
                            }}
                            style={{ margin: 10 }}
                        >
                            {Lang[window.Lang].pages.org.new_service}
                        </Button>
                    </ListSubheader>
                  
                    {this.state.areas="undefined"?this.state.areas=[]:this.state.areas}
                 
                    {this.state.account_info.map(account_info =>
                        <Card
                            key={account_info.id}
                            //style={{ display: 'flex', }}
                            >
                           
                                    {/* <Typography type="body1">
                                        {account_info.id}
                                    </Typography> */}
                                    <div style={{width:"150px",marginLeft:"20px",marginTop:"16px",display:"inline-block"}}>
                                        {account_info.account}
                                    </div>

                            <div  style={{float:"right",marginRight:"1rem"}}>
                                <CardActions>

                                    <Button
                                        color="primary"
                                        dense
                                        style={{marginRight:"10px"}}
                                        raised
                                        onClick={() => {
                                           
                                        //   return
                                            this.popUpNotice(ALERT, 0, "删除"+account_info.account+"服务区", [
                                                () => {
                                                    this.state.selected = account_info;
                                                    this.delArea(account_info.id);
                                                   // this.removeAccountInfo(account_info.id);
                                                    this.closeNotice();
                                                }, () => {
                                                    this.closeNotice();
                                                }]);
                                        }}>
                                        {Lang[window.Lang].pages.com.card.remove}
                                    </Button>
                                    {/* 修改按钮 */}
                                    <Button
                                       
                                        color="primary"
                                        dense
                                        raised
                                        onClick={() => {
                                            this.state.selected = account_info;
                                            this.see_module(CLASSTEACHER_INFOS);
                                            // this.state.showInfo = true;
                                            this.setState({ openEditAreaDialog: true });
                                            
                                        }}>
                                        {Lang[window.Lang].pages.com.card.modify}
                                    </Button>
                                </CardActions>
                            </div>
                        </Card>
                    )}

                    <Card
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({openDialog: true , openhead: true ,beingLoading: true});
                        this.see_module(CLASSTEACHER_INFOS);
                    }}
                    className="nyx-module-card"
                    style={{marginTop:"1rem"}}
                            >
                           
                                    <div
                                     className="nyx-module-div">
                                        班主任管理
                                        <i
                                        className="glyphicon glyphicon-play nyx-module-i"></i>
                                    </div>
                                    
                           
                        </Card>
                        <Card
                            onClick={() => {
                                this.state.see_manage_list=[];
                                this.setState({ openDialog: true,opensponsor:true,beingLoading: true });
                                this.see_module(SPONSOR_INFOS);
                            }}
                           className="nyx-module-card"
                            >
                           
                                    <div
                                    className="nyx-module-div">
                                        主办方联系人管理
                                        <i
                                        className="glyphicon glyphicon-play nyx-module-i"></i>
                                    </div>
                                    
                           
                        </Card>
                        <Card
                            onClick={() => {
                                this.state.see_manage_list=[];
                                this.setState({ openDialog: true ,opentheory:true,beingLoading: true});
                                this.see_module(TEACHER_INFOS);
                            }}
                           className="nyx-module-card"
                            >
                           
                                    <div
                                    className="nyx-module-div">
                                        理论讲师管理
                                        <i
                                        className="glyphicon glyphicon-play nyx-module-i"></i>
                                    </div>
                                    
                           
                        </Card>
                        <Card
                            onClick={() => {
                                this.state.see_manage_list=[];
                                this.setState({ openDialog: true,openpractice:true,beingLoading: true });
                                this.see_module(EXPERT_INFOS);
                            }}
                           className="nyx-module-card"
                            >
                           
                                    <div
                                    className="nyx-module-div">
                                        实践讲师管理
                                        <i
                                        className="glyphicon glyphicon-play nyx-module-i"></i>
                                    </div>
                                    
                           
                        </Card>
                        <Card
                            onClick={() => {
                                this.state.see_manage_list=[];
                                this.setState({ openDialog: true,openimplement: true,beingLoading: true });
                                this.see_module(ADDRESS_INFOS);
                            }}
                            style={{marginBottom:"2rem"}}
                           className="nyx-module-card"
                            >
                           
                                    <div
                                    className="nyx-module-div">
                                        实施地点管理
                                        <i
                                        className="glyphicon glyphicon-play nyx-module-i"></i>
                                    </div>
                                    
                           
                        </Card>
            </div>
                  {this.state.openhead?this.Dialogs("班主任管理","电话","暂无班主任信息，请点击新增！"):""}
                  {this.state.opensponsor?this.Dialogs("主办方联系人管理","电话","暂无主办方联系人信息，请点击新增！"):""}
                  {this.state.opentheory?this.Dialogs("理论讲师管理","讲师编号","暂无理论讲师信息，请点击新增！"):""}
                  {this.state.openpractice?this.Dialogs("实践讲师管理","讲师编号","暂无实践讲师信息，请点击新增！"):""}
                  {this.state.openimplement?this.Dialogs("实施地点管理","详细地址","暂无实施地点信息，请点击新增！"):""}
            {this.newAreaDialog()}
            {this.editAreaDialog()}
           
            <CommonAlert
                show={this.state.alertOpen}
                type={this.state.alertType}
                code={this.state.alertCode}
                content={this.state.alertContent}
                action={this.state.alertAction}
            >
            </CommonAlert>
        </div>
    }
}

export default Area;