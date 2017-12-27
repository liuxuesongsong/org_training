import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import GridList from 'material-ui/Grid';
import Button from 'material-ui/Button';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';

import { initCache, getData, getRouter,getInst, getCache, getCity, getCourse } from '../../utils/helpers';
import {
    LAST_COUNT, DATA_TYPE_BASE,UPDATE_COUNT,INST_QUERY, DATA_TYPE_CLAZZ, STATUS_ENROLLED, STATUS_ARRANGED, STATUS_ARRANGED_DOING, STATUS_ARRANGED_UNDO,
    STATUS_ENROLLED_DID, STATUS_EXAMING, STATUS_EXAMING_DID, STATUS_PASSED, STATUS_PASSED_DID, QUERY, DATA_TYPE_STUDENT,ALERT,NOTICE,EDIT_PASSWORD
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
        m_max:0,
        h_max:0,
        registered_nums: 0,
        all_registered_nums: 0,
        clazzes: [],
        areas: [],
        clazz_count:[],
        train_count:[],
        unarrange_count:[],
        myinfo:[],
        modules_id:[],
        // 界面状态

        // 提示状态
         alertOpen: false,
         alertType: ALERT,
         alertCode: Code.LOGIC_SUCCESS,
         alertContent: "",
         alertAction: [],
         openNewStudentDialog: false,
         openPasswordDialog: false,
         alertType: "notice",
         alertContent: "登录成功",
    };

    componentWillMount() {
        window.currentPage = this;
        this.fresh()
        
    }
//    componentDidMount(){
//        this.canvas_content()
//    }
    fresh = () => {
        initCache(this.cacheToState);
       
    }


    cacheToState() {
        var cb = (router, message, arg) => {
            window.currentPage.setState({
                areas: message.data.info.areas,
                clazzes: window.CacheData.clazzes,
                arranged_nums: message.data.info.sum.all_arrange_count,
                all_students_nums: message.data.info.sum.all_count,
                m_max:message.data.info.sum.m_max,
                h_max:message.data.info.sum.h_max,
                //已临时登记人数
                registered_nums:  message.data.info.sum.registered_nums,
                all_registered_nums: message.data.info.sum.all_registered_nums
                // arranged_nums: message.data.info.sum.all_student_inlist,
                // all_students_nums: message.data.info.sum.all_student_reg,
            })
            // all_students
        }
        getData(getRouter(LAST_COUNT), { session: sessionStorage.session }, cb, {});

        var cb = (router, message, arg) => {
            window.currentPage.setState({
                clazz_count: message.data.clazz_count,
                train_count: message.data.train_count,
                unarrange_count: message.data.unarrange_count,
                myinfo:message.data.myinfo,
                modules_id:message.data.myinfo.modules_id
               
                
            })
            
        }
       
        getData(getRouter(INST_QUERY), { session: sessionStorage.session }, cb, {});
        window.currentPage.state.clazz_count = getCache("clazz_count").sort((a, b) => {
            return b.id - a.id
        });
        window.currentPage.state.train_count = getCache("train_count").sort((a, b) => {
            return b.id - a.id
        });
        window.currentPage.state.unarrange_count = getCache("unarrange_count").sort((a, b) => {
            return b.id - a.id
        });
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


    init_num(num){
        return num?num:0
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
       
         var  password=document.getElementById("check_password_org").value;
        console.log(password)

        getData(getRouter(EDIT_PASSWORD), { session: sessionStorage.session, password: password }, cb, {});
    }
    handleRequestClose = () => {
        this.setState({
          
            openPasswordDialog: false
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
                                    key={"newpasswordorg"}
                                    id="new_password_org"
                                    type="password"
                                    label={Lang[window.Lang].pages.org.home.new_password}
                                    
                                    fullWidth>
                                </TextField>
                                <TextField
                                    className="nyx-form-div"
                                    key={"checkpasswordorg"}
                                    id="check_password_org"
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
                                if(document.getElementById("new_password_org").value!=document.getElementById("check_password_org").value){
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
    // canvas(area){
    //     var components=<canvas ref={this.canvas_content} className="canvas"  id={"canvas"+area.area_id} style={{width:300,height:150,position:"absolute",top:"3rem",backgroundColor:"#fff"
    //     ,zIndex:"1000"}}></canvas>
    //     // console.log("render")
    //     return components
    // }
    // refCb(instance){
    //   console.log(instance.id)
    // }
 
    render() {
        return (
            <div>
                <div
                    style={{ paddingTop: 80, paddingLeft: 40, justifyContent: 'space-between' }}
                >
              {this.state.modules_id.indexOf('1')==-1?"":
                    <div style={{ margin: 10,float: "left"}}>
                        <Paper id="companyid" width="500px" style={{ padding: 10 }}>
                            <Typography type="headline" component="h5">
                                {this.state.name}
                                
                            </Typography>
                            <Typography type="body1" component="div">
                            <div>
                                {Lang[window.Lang].pages.org.home.arranged + "/" + Lang[window.Lang].pages.org.home.all_students + ":"
                                    + this.state.arranged_nums + Lang[window.Lang].pages.com.home.human + "/" + this.state.all_students_nums + Lang[window.Lang].pages.com.home.human}
                                <Button
                                raised
                                color="primary"
                                className="nyx-org-btn-md"
                                // className="nyx-home-button"
                                    onClick={()=>{
                                        var cb = (router, message, arg) => {
                                            window.currentPage.setState({
                                                areas: message.data.info.areas,
                                                clazzes: window.CacheData.clazzes,
                                                arranged_nums: message.data.info.sum.all_arrange_count,
                                                all_students_nums: message.data.info.sum.all_count,
                                                //已临时登记人数
                                                registered_nums:  message.data.info.sum.registered_nums,
                                                all_registered_nums: message.data.info.sum.all_registered_nums
                                                // arranged_nums: message.data.info.sum.all_student_inlist,
                                                // all_students_nums: message.data.info.sum.all_student_reg,
                                            })
                                            // all_students
                                        }
                                        // console.log(this.state.all_registered_nums)
                                        getData(getRouter(UPDATE_COUNT),{ session: sessionStorage.session }, cb, {});
                                        //console.log("刷新数据");
                                    }}
                                    >刷新数据</Button>
                            </div>
                            <div>
                            {Lang[window.Lang].pages.org.home.registered + "/" + Lang[window.Lang].pages.org.home.all_registered + ":"
                                    + this.state.registered_nums + Lang[window.Lang].pages.com.home.human + "/" + this.state.all_registered_nums + Lang[window.Lang].pages.com.home.human}
                            </div>
                            <div  style={{width:200,float:"left"}}>
                            {this.state.clazz_count.map(
                                clazz_count =>
                            <div key={clazz_count.ti_id}><span style={{display:"block",float:"left",width:"100px"}}>{getInst(clazz_count.ti_id)}</span><span>{"已建立:"+clazz_count.num+"班"}</span></div>
                                )}
                            </div>
                            <div style={{width:100,float:"left"}}>
                            {this.state.train_count.map(
                                train_count =>
                            <div key={train_count.ti_id}><span>{"已安排:"+train_count.num+"人"}</span></div>)}
                            </div>

                            <div style={{width:100,float:"left"}}>
                            {this.state.unarrange_count.map(
                                unarrange_count =>
                            <div key={unarrange_count.ti_id}><span>{"未安排:"+unarrange_count.num+"人"}</span></div>)}
                            </div>                            
                            
                            </Typography>

                        </Paper>
                    </div>
                    }
                    <div style={{ margin: 10,float: "left",marginRight:"1rem",width:"300px" }}>
                        <Paper  style={{ padding: 10,height:"150px" }}>
                            <Typography type="headline" component="h5">
                               个人信息
                            </Typography>
                            <Typography type="body1" component="div">
                            <div>
                            
                             用户名:{this.state.myinfo.my_name}
                          
                            
                                <Button
                                raised
                                style={{float:"right"}}
                                color="primary"
                                className="nyx-org-btn-md"
                                // className="nyx-home-button"
                                    onClick={()=>{
                                        this.setState({ openPasswordDialog: true });
                                    }}
                                    >修改密码</Button>
                                     <div>
                                 所属机构:{this.state.myinfo.my_institution?getInst(this.state.myinfo.my_institution):""}
                             </div>
                            </div>
                    
                        
                                                       
                            
                            </Typography>

                        </Paper>
                    </div>
                    {this.state.modules_id.indexOf('1')==-1?"":
                    <div className="nyx-areacount-list">
                        <div className="nyx-areacount-title">各省市报名情况(按照中级未安排顺序排列)
                        <Button
                        style={{
                            float:"right",
                            right:"8rem"
                        }}
                         raised
                         color="primary"
                         className="nyx-org-btn-md"
                         onClick={() => {
                          
                            this.popUpNotice(ALERT, 0, "导出各地区开班情况", [
                                () => {
                                    var href =  getRouter("export_csv_count").url+"&session=" + sessionStorage.session;
                                    console.log(href);
                                    var a = document.createElement('a');
                                    a.href = href;
                                 //    console.log(href);
                                    a.click();  
                                    this.closeNotice();
                                }, () => {
                                    this.closeNotice();
                                }]);
        
        
                          
                        }}
                        >{"导出"}</Button>
                        </div>
                        
                        {console.log(this.state.areas.sort(function(b,a){
                            return ((a.m_count?a.m_count:0)-(a.m_arrange_count?a.m_arrange_count:0))-((b.m_count?b.m_count:0)-(b.m_arrange_count?b.m_arrange_count:0))
                            }))
                        }
                        {
                            this.state.areas.map(area => {
                            var all_num = this.state.all_students_nums;
                            var m_max =this.state.m_max;
                            var h_max = this.state.h_max;
                            var z_max;
                            if(parseInt(m_max)>parseInt(h_max)){
                                z_max=m_max;
                            }else{
                                z_max=h_max;
                            }
                            var m_all_count = area.m_count ? area.m_count : 0;
                            var m_arrange_count = area.m_arrange_count ? area.m_arrange_count : 0;
                            var h_all_count = area.h_count ? area.h_count : 0;
                            var h_arrange_count = area.h_arrange_count ? area.h_arrange_count : 0;
                            var m_pre_all = 100 * m_all_count / z_max;
                            var m_pre_arr = 100 * m_arrange_count / z_max;
                            var h_pre_all = 100 * h_all_count / z_max;
                            var h_pre_arr = 100 * h_arrange_count / z_max;
                            return (
                                <div style={{position:"relative"}} key={area.area_id} className="nyx-areacount-list-item">
                                    <div className="nyx-area-name">{area.area_name}
                                    <span style={{float:"right",marginRight:"50px"}}>
                                        <span style={{width:70,display:"inline-block",textAlign:"right"}}>{"无"}/{"未"}</span>
                                        <span style={{width:70,display:"inline-block",textAlign:"right"}}>{"已"}/{"总"}</span>
                                    </span>
                                    </div>
                                    <div className="nyx-area-bar"
                                    onMouseOver={(event)=>{
                                        var canvas=document.getElementById("z_canvas"+area.area_id);
                                        var m_canvas=document.getElementById("m_canvas"+area.area_id);
                                        
                                        // console.log("ref_render")
                                        m_canvas.style.display="block"
                                         canvas.width="300";
                                         canvas.height="200";
                                         var context=canvas.getContext("2d");
                                          var data = [{
                                            "value": area.m_unarrange_zr/area.m_count,
                                            "color": "#F44336",
                                            "title": "中软未排"+area.m_unarrange_zr
                                        },{
                                          "value":area.m_inclass_zr/area.m_count,
                                          "color": "#B71C1C",
                                          "title": "中软已排"+area.m_inclass_zr
                                         }
                                      ,{
                                            "value":  area.m_unarrange_sb/area.m_count,
                                            "color": "#4CAF50",
                                            "title": "赛宝未排"+area.m_unarrange_sb
                                        },{
                                              "value":  area.m_inclass_sb/area.m_count,
                                              "color": "#1B5E20",
                                              "title": "赛宝已排"+area.m_inclass_sb
                                          },{
                                            "value": area.m_unarrange_sd/area.m_count,
                                            "color": "#2196F3",
                                            "title": "赛迪未排"+area.m_unarrange_sd
                                        },{
                                            "value": area.m_inclass_sd/area.m_count,
                                            "color": "#0D47A1",
                                            "title": "赛迪已排"+area.m_inclass_sd
                                        },{
                                              "value": area.m_uninst_count/area.m_count,
                                              "color": "#BDBDBD",
                                              "title": "未安排机构"+area.m_uninst_count
                                          }
                                     ];
                                          var tempAngle=-90; 
                                          var x0=100,y0=100,r=70;
                                          for(var i=0;i<data.length;i++){
                                              
                                              if(data[i].value!=0){
                                                 // console.log(data[i].value)
                                                  var obj=data[i];
                                                  context.beginPath();
                                                  context.moveTo(150,100);
                                                  context.fillStyle=obj.color;
                                                  context.strokeStyle="#FFFFFF";
                                                  var currentAngle=obj.value*360; 
                                                  var startAngle=tempAngle*Math.PI/180;
                                                  var endAngle=(currentAngle+tempAngle)*Math.PI/180;
                                                  context.arc(150,100,r,startAngle,endAngle);
                                                  context.fill();
                                                  context.stroke();
                                                  context.beginPath();
                                                  var text=obj.title;
                                                  var textAngle=tempAngle+1/2*currentAngle;
                                                  var x=150+Math.cos(textAngle*Math.PI/180)*(r+5);
                                                  var y=100+Math.sin(textAngle*Math.PI/180)*(r+10);
                                                 //  console.log(x)
                                                  context.font="bold 12px '微软雅黑'";
                                                  if(textAngle>90&&tempAngle<270){
                                                      context.textAlign="end"
                                                  }
                                                  context.fillText(text,x,y);
                                                 //  console.log(text);
                                                  context.fill();
                                                  tempAngle+=currentAngle;
                                                 //  console.log(tempAngle)
                                              }
                                          }
                                          
                                    }}
                                    onMouseOut={()=>{
                                        var m_canvas=document.getElementById("m_canvas"+area.area_id);
                                        // console.log("ref_render")
                                        m_canvas.style.display="none"
                                    }}
                                  
                                    >
                                   
                                        <span className="nyx-area-bar-left">中级</span>
                                        <span className="nyx-area-bar-mid">
                                            <span className="nyx-area-bar-bot" style={{ width: m_pre_all + "%" }}> </span>
                                            <span className="nyx-area-bar-top" style={{ width: m_pre_arr + "%" }}> </span>
                                        </span>
                                        <span className="nyx-area-bar-right">
                                            <span style={{width:70,display:"inline-block"}}>{this.init_num(area.m_uninst_count)}/{((area.m_count ? area.m_count : 0)-(area.m_arrange_count ? area.m_arrange_count : 0))}</span>
                                            <span style={{width:70,display:"inline-block"}}>{(area.m_arrange_count ? area.m_arrange_count : 0)}/{(area.m_count ? area.m_count : 0)}</span>
                                        </span>
                                       <div id={"m_canvas"+area.area_id} 
                                       className="nyx-z3"
                                       style={{display:"none",position:"absolute",top:"3rem",width:300,height:240,backgroundColor:"#ffffff",zIndex:"1000"}} >
                                       <p style={{margin:0,textAlign:"center",fontSize:"16px",color:"#2196f3"}}>{area.area_name}-中级</p>
                                       <canvas  id={"z_canvas"+area.area_id} style={{width:300,height:200,}}>
                                    
                                    </canvas>
                                       </div>
                                   
                                    </div>
                                    <div className="nyx-area-bar"
                                    onMouseOver={(event)=>{
                                        var canvas=document.getElementById("g_canvas"+area.area_id);
                                        var h_canvas=document.getElementById("h_canvas"+area.area_id);
                                        
                                        // console.log("ref_render")
                                        h_canvas.style.display="block"
                                         canvas.width="300";
                                         canvas.height="200";
                                         var context=canvas.getContext("2d");
                                          var data = [{
                                            "value": area.h_unarrange_zr/area.h_count,
                                            "color": "#F44336",
                                            "title": "中软未排"+area.h_unarrange_zr
                                        },{
                                          "value":area.h_inclass_zr/area.h_count,
                                          "color": "#B71C1C",
                                          "title": "中软已排"+area.h_inclass_zr
                                         }
                                      ,{
                                            "value":  area.h_unarrange_sb/area.h_count,
                                            "color": "#4CAF50",
                                            "title": "赛宝未排"+area.h_unarrange_sb
                                        },{
                                              "value":  area.h_inclass_sb/area.h_count,
                                              "color": "#1B5E20",
                                              "title": "赛宝已排"+area.h_inclass_sb
                                          },{
                                            "value": area.h_unarrange_sd/area.h_count,
                                            "color": "#2196F3",
                                            "title": "赛迪未排"+area.h_unarrange_sd
                                        },{
                                            "value": area.h_inclass_sd/area.h_count,
                                            "color": "#0D47A1",
                                            "title": "赛迪已排"+area.h_inclass_sd
                                        },{
                                              "value": area.h_uninst_count/area.h_count,
                                              "color": "#BDBDBD",
                                              "title": "未安排机构"+area.h_uninst_count
                                          }
                                     ];
                                          var tempAngle=-90; 
                                          var x0=100,y0=100,r=70;
                                          for(var i=0;i<data.length;i++){
                                              
                                              if(data[i].value!=0){
                                                 // console.log(data[i].value)
                                                  var obj=data[i];
                                                  context.beginPath();
                                                  context.moveTo(150,100);
                                                  context.fillStyle=obj.color;
                                                  context.strokeStyle="#FFFFFF";
                                                  var currentAngle=obj.value*360; 
                                                  var startAngle=tempAngle*Math.PI/180;
                                                  var endAngle=(currentAngle+tempAngle)*Math.PI/180;
                                                  context.arc(150,100,r,startAngle,endAngle);
                                                  context.fill();
                                                  context.stroke();
                                                  context.beginPath();
                                                  var text=obj.title;
                                                  var textAngle=tempAngle+1/2*currentAngle;
                                                  var x=150+Math.cos(textAngle*Math.PI/180)*(r+5);
                                                  var y=100+Math.sin(textAngle*Math.PI/180)*(r+10);
                                                 //  console.log(x)
                                                  context.font="bold 12px '微软雅黑'";
                                                  if(textAngle>90&&tempAngle<270){
                                                      context.textAlign="end"
                                                  }
                                                  context.fillText(text,x,y);
                                                 //  console.log(text);
                                                  context.fill();
                                                  tempAngle+=currentAngle;
                                                 //  console.log(tempAngle)
                                              }
                                          }
                                          
                                    }}
                                    onMouseOut={()=>{
                                        var h_canvas=document.getElementById("h_canvas"+area.area_id);
                                        // console.log("ref_render")
                                        h_canvas.style.display="none"
                                    }}
                                    >
                                        <span className="nyx-area-bar-left">高级</span>
                                        <span className="nyx-area-bar-mid">
                                            <span className="nyx-area-bar-bot" style={{ width: h_pre_all + "%" }}> </span>
                                            <span className="nyx-area-bar-top" style={{ width: h_pre_arr + "%" }}> </span>
                                        </span>
                                        <span className="nyx-area-bar-right">
                                            <span style={{width:70,display:"inline-block"}}>{this.init_num(area.h_uninst_count)}/{((area.h_count ? area.h_count : 0)-(area.h_arrange_count ? area.h_arrange_count : 0))}</span>
                                            <span style={{width:70,display:"inline-block"}}>{(area.h_arrange_count ? area.h_arrange_count : 0)}/{(area.h_count ? area.h_count : 0)}</span>
                                        </span>
                                        <div id={"h_canvas"+area.area_id}
                                        className="nyx-z3"
                                        style={{display:"none",position:"absolute",top:"1.7rem",width:300,height:240,backgroundColor:"#ffffff",zIndex:"1000"}} >
                                       <p style={{margin:0,textAlign:"center",fontSize:"16px",color:"#2196f3"}}>{area.area_name}-高级</p>
                                       <canvas  id={"g_canvas"+area.area_id} style={{width:300,height:200,}}>
                                    
                                    </canvas>
                                       </div>
                                       
                                    </div>
                                    
                                </div>
                            )
                        }
                        )}
                    </div>
                    }
                    <div style={{ margin: 10, width: 300,height:150, float: "left" }}>
                       
                    </div>
                </div>
                {this.changePasswordDialog()}
               
                <CommonAlert
                    show={this.state.alertOpen}
                    type={this.state.alertType}
                    code={this.state.alertCode}
                    content={this.state.alertContent}
                    action={this.state.alertAction}
                    >
                </CommonAlert>
                
            </div>
        )
    }
}

export default Home;