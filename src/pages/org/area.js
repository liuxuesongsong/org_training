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
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';

import { initCache, getData, getRouter, getCache, getStudent,getAreas, getCity, getCourse } from '../../utils/helpers';


import { ALERT, NOTICE, ADMIN_ADD,INST_QUERY,ADMIN_DEL,ADMIN_EDIT, AREA_INFOS, QUERY, } from '../../enum';

import Code from '../../code';
import Lang from '../../language';

import CommonAlert from '../../components/CommonAlert';

class Area extends Component {
    state = {
        areas: [],
        clazz: [],
        clazzes:[],
        check_area_val: [],//选中area的id
        check_list_val:[],//选中nav的id
        account_info:[],
        selected: {},
        showInfo: false,
        openNewAreaDialog: false,
        openEditAreaDialog: false,
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
                my_id: message.data.myinfo.my_id 
                
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
    
        nav_list = (name) => {
            var components = []
            var list = {1:"首页",2:"学生信息",3:"班级安排",4:"服务区域"}
            for(var id in list){
                components.push(
                    <label style={{width:"33%",float:"left",display:"block"}} key={id} value={id}><input name={name} key={id} value={id} type="checkbox"></input>{list[id]}</label>
                )
            }
            return components
        }
     select_list = (name) => {
        var obj =  document.getElementsByName(name);
        this.state.check_list_val = [];
         for(var k in obj){
             if(obj[k].checked)
             this.state.check_list_val.push(obj[k].value);
         }
     }
    //  check_area_id =(id,modules_arr)=>{
    //     for(var i in modules_arr){
    //         if(modules_arr[i]==id){
    //             return true           
    //         }
    //     }
    //     return false
    //  }
     selected_list = () => {
        
        var components = []
        var list = {1:"首页",2:"学生信息",3:"班级安排",4:"服务区域"}
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
                    <div>
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
                      <p style={{marginTop:"4.5rem"}}>选择所属服务区</p>
                      <div style={{minHeight:"270px"}}>
                        {this.state.selected.areas_id?getAreas().map(area => {
                  return <label style={{width:"33%",float:"left",display:"block"}} key={area.id} value={area.id}><input name={"change_checkbox_area"} key={area.id} defaultChecked={this.state.selected.areas_id.indexOf(area.id.toString())!=-1?true:false} value={area.id} type="checkbox"></input>{area.area_name}</label>}):""}
                        </div>
                        <p>班主任分配</p>
                        {this.state.selected.clazz_id?this.state.clazzes.map(
                                clazz =>
                               {
                                   return <label style={{display:"block"}} key={clazz.id} value={clazz.id}><input name={"change_checkbox_clazz"} key={clazz.id} value={clazz.id} defaultChecked={this.state.selected.clazz_id.indexOf(clazz.id)!=-1?true:false} type="checkbox"></input>{clazz.class_code}{"-"}{getCity(clazz.area_id)}{"-"}{getCourse(clazz.course_id)}</label>
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
                        <p>可显示区域</p>
                        {
                           this.nav_list("checkbox_list") 
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
                                // console.log(this.state.check_area_val);
                               // console.log(this.state.check_list_val);
                                
                                this.newArea({
                                    account: document.getElementById("account_area").value,
                                    password: document.getElementById("area_name_password").value,
                                    modules_id:this.state.check_list_val,
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
            modules_id:this.state.check_list_val,
            areas_id:this.state.check_area_val,
            clazz_id:this.state.check_clazz_val
        }
        console.log(obj);
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
        
     // console.log(id);
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
             areas_id:this.state.check_area_val,
             clazz_id:this.state.check_clazz_val,
        }
       // console.log(obj);
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
            openEditAreaDialog: false
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

    render() {
        return <div>

            <div style={{ margin: 10, marginLeft: 50, width: 400, float: "left" }}>
                <List subheader={<ListSubheader>{Lang[window.Lang].pages.com.students.list_title}</ListSubheader>}>
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
                            style={{ display: 'flex', }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <CardContent>
                                    {/* <Typography type="body1">
                                        {account_info.id}
                                    </Typography> */}
                                    <Typography style={{width:"150px"}} type="body1" component="h2">
                                        {account_info.account}
                                    </Typography>

                                </CardContent>
                            </div>
                            <div>
                                <CardActions>

                                    <Button
                                        color="primary"
                                        dense
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
                                            
                                            // this.state.showInfo = true;
                                            this.setState({ openEditAreaDialog: true });
                                        }}>
                                        {Lang[window.Lang].pages.com.card.modify}
                                    </Button>
                                </CardActions>
                            </div>
                        </Card>
                    )}
                </List>
            </div>




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