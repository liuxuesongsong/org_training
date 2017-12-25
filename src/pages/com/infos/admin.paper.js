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
import { NOTICE,DATA_TYPE_BASE, UPDATE_COMPANY, DATA_TYPE_ADMIN, UPDATE_ADMIN,EDITCOMPANYNAME } from '../../../enum';
import Code from '../../../code';
import Lang from '../../../language';
import CommonAlert from '../../../components/CommonAlert';
class Admin extends Component {
    state = {
        gotData: false,
        show: "all",
        admin: {
            account: "",
            password: ""
        },
        change_company:"",
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
                
                window.CacheData.admin = arg.data;
                // for (var key in this.state.temObj) {
                //     console.log(temObj);
                //     window.CacheData.admin[key] = this.state.temObj[key];
                // }
            }
        }
        var obj = {
            password: document.getElementById("check_password_com").value,
        }

        getData(getRouter(UPDATE_ADMIN), { session: sessionStorage.session, admin: obj }, cb, { self: this, data: obj });
    }
    company_submit = (sendObj) => {
        var cb = (route, message, arg) => {
            this.popUpNotice(NOTICE, 0, message.msg);
            if (message.code === Code.LOGIC_SUCCESS) {
                
                window.CacheData.admin = arg.data;
              this.fresh()
            }
        }
       

        getData(getRouter(EDITCOMPANYNAME), { session: sessionStorage.session, company_name: this.state.change_company }, cb, {});
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
                    <div>
                    <TextField
                                    className="nyx-form-div"
                                    key={"newpasswordcom"}
                                    id="new_password_com"
                                    type="password"
                                    label={Lang[window.Lang].pages.org.home.new_password}
                                    
                                    fullWidth>
                                </TextField>
                                <TextField
                                    className="nyx-form-div"
                                    key={"checkpasswordcom"}
                                    id="check_password_com"
                                    type="password"
                                    label={Lang[window.Lang].pages.org.home.check_password}
                                    
                                    fullWidth>
                                </TextField>
                        
                        
                     
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                if(document.getElementById("new_password_com").value!=document.getElementById("check_password_com").value){
                                    this.popUpNotice(NOTICE, 0, "两次密码不一致");
                                    return
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
    changeCompanyDialog = () => {
        return (
            <Dialog open={this.state.openCompanyDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    修改公司名称
            </DialogTitle>
                <DialogContent>
                    <div>
                    <TextField
                        className="nyx-form-div"
                        key={"changecompanynamecom"}
                        id="change_company_com"
                        style={{width:"20rem"}}
                        label={Lang[window.Lang].pages.com.infos.admin.change_company}
                        onChange={(e)=>{
                              this.setState({
                                  change_company:e.target.value
                              })
                        }}
                        fullWidth>
                    </TextField>            
                               
                        
                        
                     
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                //console.log(this.state.change_company);
                                this.company_submit();
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
                                    this.setState({ openPasswordDialog: true });
                                }}
                                >
                                <i
                                 style={{marginRight:"0.2rem"}}
                                className="glyphicon glyphicon-pencil"></i>
                                修改密码</span>
                                </div>
                               
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
