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

import { initCache, getData, getRouter, getCache, getStudent,getAreas } from '../../utils/helpers';


import { ALERT, NOTICE, ADMIN_ADD,INST_QUERY,ADMIN_DEL, AREA_INFOS, QUERY, } from '../../enum';

import Code from '../../code';
import Lang from '../../language';

import CommonAlert from '../../components/CommonAlert';

class Area extends Component {
    state = {
        areas: [],
        clazz: [],
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
    }

    queryArea = () => {
        var cb = (router, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({ areas: message.area })
            }
        }
        getData(getRouter(AREA_INFOS), { session: sessionStorage.session }, cb, {});
    }
    select_area = () =>{
       var obj =  document.getElementsByName("checkbox_area");
       this.state.check_area_val = [];
        for(var k in obj){
            if(obj[k].checked)
            this.state.check_area_val.push(obj[k].value);
        }
       
    }
        nav_list =() =>{
            var components = []
            var list = {1:"首页",2:"学生信息",3:"班级安排",4:"服务区域"}
            for(var id in list){
                components.push(
                    <label style={{width:"33%",float:"left",display:"block"}} key={id} value={id}><input name={"checkbox_list"} key={id} value={id} type="checkbox"></input>{list[id]}</label>
                )
            //    console.log(id);
            //   console.log(list[id]);
            }
            return components
        }
     select_list = () =>{
        var obj =  document.getElementsByName("checkbox_list");
        this.state.check_list_val = [];
         for(var k in obj){
             if(obj[k].checked)
             this.state.check_list_val.push(obj[k].value);
         }
     }
     editAreaDialog = () => {
        return (
            <Dialog open={this.state.openEditAreaDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    
            </DialogTitle>
                <DialogContent>
                    <div>
                    <TextField
                            className="nyx-form-div"
                            key={"account"}
                            id={"change_area_account"}
                            label={"用户名"}
                             value={this.state.selected["account"] === null ? "" : this.state.selected["class_head"]}
                            // onChange={(event) => {
                            //     this.state.selected["account"] = event.target.value
                            //     this.setState({
                            //         selected: this.state.selected
                            //     });
                            // }}
                            >
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
                                var train_starttime = Number(document.getElementById("train_starttime").value);
                                var train_endtime = Number(document.getElementById("train_endtime").value);
                                var class_code = document.getElementById("class_code").value;
                                this.modifyClazz(this.state.selected.id, {
                                    class_head: class_head,
                                    teacher: teacher,
                                    address: address,
                                    train_starttime: train_starttime,
                                    train_endtime: train_endtime,
                                    class_code: class_code
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
                           this.nav_list() 
                        }
                        
                        
                      <p style={{marginTop:"4.5rem"}}>选择所属服务区</p>
                        {getAreas().map(area => {
                                return <label style={{width:"33%",float:"left",display:"block"}} key={area.id} value={area.id}><input name={"checkbox_area"} key={area.id} value={area.id} type="checkbox"></input>{area.area_name}</label>
                            })}
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                if(document.getElementById("area_name_password").value!=document.getElementById("area_name_check_password").value){
                                    console.log("两次密码不一致")
                                    this.popUpNotice(NOTICE, 0, "两次密码不一致");
                                    return
                                }
                                this.select_area();
                                this.select_list();
                                // console.log(this.state.check_area_val);
                               // console.log(this.state.check_list_val);
                                
                                this.newArea({
                                    account: document.getElementById("account_area").value,
                                    password: document.getElementById("area_name_password").value,
                                    modules_id:this.state.check_list_val,
                                    areas_id:this.state.check_area_val
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
        }
        var obj = {
            session: sessionStorage.session,
            account: document.getElementById("account_area").value,
            password: document.getElementById("area_name_password").value,
            modules_id:this.state.check_list_val,
            areas_id:this.state.check_area_val
        }
       // console.log(obj);
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
                                    <Typography type="body1" component="h2">
                                        {account_info.account}
                                    </Typography>

                                </CardContent>
                            </div>
                            <div>
                                <CardActions>

                                    <Button
                                        dense
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
                                    {/* <Button
                                        dense
                                        onClick={() => {
                                            this.state.selected = account_info;
                                            // this.state.showInfo = true;
                                            this.setState({ openEditAreaDialog: true });
                                        }}>
                                        {Lang[window.Lang].pages.com.card.modify}
                                    </Button> */}
                                </CardActions>
                            </div>
                        </Card>
                    )}
                </List>
            </div>




            {this.newAreaDialog()}
            {/* {this.editAreaDialog()} */}
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