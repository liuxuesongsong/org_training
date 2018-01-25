// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { initCache, getData, getCache, getRouter } from '../../../utils/helpers';
import { NOTICE,DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_ADMIN, UPDATE_ADMIN,EDITCOMPANYNAME,CHECK_AVAILABLE,INST_QUERY,SEND_CODE,CHECK_CODE_PASSWORD } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';
import CommonAlert from '../../../components/CommonAlert';
import document from '../../org/document';
class Admin extends Component {
    state = {
        gotData: false,
        show: "all",
        admin: {
            account: "",
            password: ""
        },
        base: {
            account:"",
            name: "",
            mobile: ""
        },
        change_company:"",
        new_password:"",
        check_password:"",
        check_code:"",
        count:60,
        liked:"true",
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: [],
        openPasswordDialog: false,
        openCompanyDialog:false
    }
    componentDidMount() {
        window.currentPage = this;
        this.fresh()
    }
    fresh = () => {
        initCache(this.cacheToState);
    }
    cacheToState() {
        window.currentPage.setState({
            gotData: true

        });
        if (getCache(DATA_TYPE_ADMIN) !== undefined) {
            var data = getCache(DATA_TYPE_ADMIN);
            window.currentPage.setState({
                admin: data
            });
        }
        if (getCache(DATA_TYPE_BASE) !== undefined) {
            var data = getCache(DATA_TYPE_BASE);
            window.currentPage.setState({
                base: data
            });
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
    submit = (sendObj) => {
        var cb = (route, message, arg) => {
            this.popUpNotice(NOTICE, 0, message.msg);
            if (message.code === Code.LOGIC_SUCCESS) {
                
              
            }
        }
       

        getData(getRouter(CHECK_CODE_PASSWORD), { session: sessionStorage.session, password: this.state.check_password,code:this.state.check_code }, cb, {});
    }
    send_check_code = () => {
        var cb = (route, message, arg) => {
            this.popUpNotice(NOTICE, 0, message.msg);
            if (message.code === Code.LOGIC_SUCCESS) {

            }
        }
        getData(getRouter(SEND_CODE), { session: sessionStorage.session, c_name:this.state.base["account"],mobile:this.state.base["mobile"] }, cb, {});
    }
    company_submit = (sendObj) => {
        var cb = (route, message, arg) => {
            this.popUpNotice(NOTICE, 0, message.msg);
            if (message.code === Code.LOGIC_SUCCESS) {
                
                window.CacheData.admin = arg.data;
              this.fresh()
            }
        }
        var account = this.state.change_company;
                                    account=account.replace(/（/g,'(');  
                                    account=account.replace(/ /g,''); 
                                    account=account.replace(/）/g,')');  

        getData(getRouter(EDITCOMPANYNAME), { session: sessionStorage.session, company_name: account}, cb, {});
    }
    handleRequestClose = () => {
        this.setState({
          
            openPasswordDialog: false,
            openCompanyDialog:false
        })
    }
    changePasswordDialog = () => {
        return (
            <Dialog open={this.state.openPasswordDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    修改密码
            </DialogTitle>
                <DialogContent>
                    <div  style={{width:"20rem",position:"relative",paddingLeft:"0.5rem"}}>
                    <TextField
                     style={{width:"19rem"}}
                     className="nyx-form-div"
                     key={"newpasswordcom"}
                     id="new_password_com"
                     type="password"
                     label={Lang[window.Lang].pages.org.home.new_password}
                      onChange={(e) => {
                          this.setState({new_password:e.target.value})
                      }
                        }
                     fullWidth>
                     </TextField>
                     <TextField
                       style={{width:"19rem"}}
                       className="nyx-form-div"
                       key={"checkpasswordcom"}
                       id="check_password_com"
                       type="password"
                       label={Lang[window.Lang].pages.org.home.check_password}
                       onChange={(e) => {
                           this.setState({check_password:e.target.value})
                       }
                         }          
                      fullWidth>
                        </TextField>
                        <TextField
                           style={{width:"19rem"}}
                           className="nyx-form-div"
                           key={"checkcode"}
                           id="check_code"
                           label={Lang[window.Lang].pages.com.infos.admin.check_code}
                           onChange={(e) => {
                               this.setState({check_code:e.target.value})
                           }
                             } 
                             fullWidth>         
                                </TextField>
                                <span
                                disabled={this.state.liked?false:true}
                                className="nyx-check-code"
                                onClick={()=>{
                                    if(this.state.liked){
                                        this.timer = setInterval(function () {
                                          var count = this.state.count;
                                          this.state.liked = false;
                                          count -= 1;
                                          if (count < 1) {
                                            this.setState({
                                              liked: true
                                            });
                                            count = 60;
                              　　　　　　　　clearInterval(this.timer);
                                          }
                                          this.setState({
                                            count: count
                                          });
                                        }.bind(this), 1000);
                                      }
                                      if(this.state.count==60){
                                       this.send_check_code()
                                      }
                                     
                                }}
                                
                                >
                               {this.state.liked ? '获取验证码' : this.state.count + '秒后重新获取验证码'}
                                </span>             
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                if(this.state.new_password==""){
                                    return false
                                }
                                if(this.state.new_password!=this.state.check_password){
                                    this.popUpNotice(NOTICE, 0, "两次密码不一致");
                                    return false
                                }
                                if(this.state.check_code==""){
                                    this.popUpNotice(NOTICE, 0, "请输入验证码");
                                    return false
                                }
                                this.submit();
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
    check_available = () => {
        var cb = (route, message, arg) => {
           if(message.msg=="该名称已存在"){
            this.popUpNotice(NOTICE, 0, message.msg);
            return false
           }else{
            this.company_submit();
            this.handleRequestClose()
           }
          
    
        }
        var account = this.state.change_company;
                                    account=account.replace(/（/g,'(');  
                                    account=account.replace(/ /g,''); 
                                    account=account.replace(/）/g,')');  
        getData(getRouter(CHECK_AVAILABLE), { key: "account", value: account }, cb);
      }
    changeCompanyDialog = () => {
        return (
            <Dialog open={this.state.openCompanyDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    修改公司名称/登录全称
            </DialogTitle>
                <DialogContent>
                    <div style={{paddingLeft:"0.5rem",width:"20rem"}}>
                    <TextField
                        className="nyx-form-div"
                        key={"changecompanynamecom"}
                        id="change_company_com"
                        style={{width:"19rem"}}
                        label={Lang[window.Lang].pages.com.infos.admin.change_company}
                        defaultValue={this.state.change_company}
                        onChange={(e)=>{
                          

                            this.setState({change_company:e.target.value})
                        }}
                        // defaultValue={""}
                        
                        fullWidth>
                    </TextField>            
                               
                        
                        
                     
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                //console.log(document.getElementById("change_company_com").value);
                                if(this.state.change_company==""){
                                    return false
                                }
                                else {
                                  this.check_available(this.state.change_company);
                                }
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
    subShow = () => {
        switch (this.state.show) {
            default:
                return (
                    <div className="nyx-info">
                        <List style={{
                            height: "100%"
                        }} disablePadding>
                            <Paper
                                className={"nyx-form"}>
                                <div style={{display:"inline",position:"relative"}}><TextField
                                    className="nyx-form-div"
                                    key={"account"}
                                    id="account"
                                    disabled
                                    label={Lang[window.Lang].pages.com.infos.admin.account}
                                    value={this.state.admin["account"] === null ? "" : this.state.admin["account"]}
                                    fullWidth>
                                </TextField>
                                <span
                                style={{position:"absolute",top:"0",right:"1rem",color:"#2196F3",cursor:"pointer"}}
                                onClick={()=>{
                                    this.setState({ openCompanyDialog: true });
                                }}
                                >
                                 <i
                                style={{marginRight:"0.2rem"}}
                                  className="glyphicon glyphicon-pencil"> </i>
                                修改公司全称</span></div>
                                <div style={{display:"inline",position:"relative"}}>
                                <TextField
                                    className="nyx-form-div"
                                    key={"password"}
                                    type="password"
                                    disabled
                                    label={Lang[window.Lang].pages.com.infos.admin.old_password}
                                    value={this.state.admin["password"] === null ? "" : this.state.admin["password"]}
                                    
                                    fullWidth>
                                </TextField>
                                <span
                                
                                style={{position:"absolute",top:"0",right:"1rem",color:"#2196F3",cursor:"pointer"}}
                                onClick={()=>{
                                    this.state.base["mobile"]?this.setState({ openPasswordDialog: true }): this.popUpNotice(NOTICE, 0, "请在企业信息中添加手机号") 
                                }}
                                >
                                <i
                                 style={{marginRight:"0.2rem"}}
                                className="glyphicon glyphicon-pencil"></i>
                                修改密码</span>
                                </div>
                                <TextField
                                    className="nyx-form-div"
                                    key={"name"}
                                    disabled
                                    label={Lang[window.Lang].pages.com.infos.admin.name}
                                    value={this.state.base["name"] === null ? "" : this.state.base["name"]}
                                    
                                    fullWidth>
                                </TextField>
                                <TextField
                                    className="nyx-form-div"
                                    key={"mobile"}
                                    disabled
                                    label={Lang[window.Lang].pages.com.infos.admin.mobile}
                                    value={this.state.base["mobile"] === null ? "" : this.state.base["mobile"]}
                                    fullWidth>
                                </TextField>
                            </Paper>
                        </List>
                    </div>
                )
        }
    }



    render() {
        return (
            <div style={{ marginTop: 20 }} className={'nyx-page'}>
                <div className={'nyx-company-paper'}>
                    <div>
                        {this.subShow()}
                    </div>
                </div>
                {this.changePasswordDialog()}
                {this.changeCompanyDialog()}
                <CommonAlert
                    show={this.state.alertOpen}
                    type={this.state.alertType}
                    code={this.state.alertCode}
                    content={this.state.alertContent}
                    action={this.state.alertAction}
                >
                </CommonAlert>
            </div>
        );
    }



};

export default Admin;
