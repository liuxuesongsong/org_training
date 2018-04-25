import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import GridList from 'material-ui/Grid';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
	ListSubheader,
} from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';

import { initCache, getData, getRouter, getCache, getStudent, getCourse, getCity, getInst, getCourses, getMessage } from '../../../utils/helpers';
import {
	UNROLL_STUDENT,
	DATA_TYPE_BASE, DATA_TYPE_CLAZZ, STATUS_ENROLLED, STATUS_ARRANGED, STATUS_ARRANGED_DOING, STATUS_ARRANGED_UNDO,
	STATUS_ENROLLED_DID, QUERY, DATA_TYPE_STUDENT,DATA_TYPE_MESSAGE,BE_READ,
	CARD_TYPE_UNARRANGE, CARD_TYPE_UNARRANGE_ING, CARD_TYPE_ARRANGE,AGREE_ARRANGE,REFUSE_ARRANGE,STATUS_AGREED_AGREE,
	STATUS_AGREED,
	STATUS_AGREED_UNDO,
	STATUS_AGREED_REFUSED,
	NOTICE,
	ALERT,
	STATUS_ARRANGED_DID,
	STATUS_AGREED_KNOW,
	CARD_TYPE_KNOW,
	DATA_TYPE_CANCEL_STUDENT,
	APPLY_CANCEL,
	RECALL_CANCEL
} from '../../../enum';
import Lang from '../../../language';
import StudentCard from '../studentCard.js';
import Code from '../../../code';

import CommonAlert from '../../../components/CommonAlert';

class Home extends Component {

	state = {
		// 数据状态
		name: "",
		cancel_reason: "",
		must_cancel_reason: "",
		cancel_student_name: "",
		cancel_student_id: "",
		enrolled: 0,
		arranged: 0,
		examing: 0,
		passed: 0,
		btns:0,
		unarranged_height: 1,
		arranged_height: 1,
		message_height:1,
		unarragedStudents: [],
		arrangedStudents: [],
		messages:[],
		clazzes: [],
		// 界面状态
		selectedStudentId: undefined,
		// 提示状态
		alertOpen: false,
		alertType: ALERT,
		alertCode: Code.LOGIC_SUCCESS,
		alertContent: "",
		alertAction: [],
		openCancelReason: false
	};

	componentWillMount() {
		window.currentPage = this;
		this.fresh();
	}

	fresh = () => {
		initCache(this.cacheToState);
	}

	cacheToState() {

		let students = getCache(DATA_TYPE_STUDENT);
		//let messages = getCache(DATA_TYPE_MESSAGE);
		let cancel_students = getCache(DATA_TYPE_CANCEL_STUDENT);
		let enrolled = 0, arranged = 0, passed = 0, examing = 0,
			unarragedStudents = [], arrangedStudents = [];
		for (var i = 0; i < students.length; i++) {
			if (students[i].is_inlist == STATUS_ENROLLED_DID||students[i].is_inlist == STATUS_ARRANGED_DID) {
				enrolled++;
				unarragedStudents.push(students[i]);
			}
			if (students[i].is_inlist == 3) {
				enrolled++;
				arranged++;
				arrangedStudents.push(students[i]);
			}
		}
		for(var i = 0; i < cancel_students.length; i++) {
			unarragedStudents.push(cancel_students[i]);
		}
		window.currentPage.state.messages = getCache("messages").sort((a, b) => {
            return b.message_id - a.message_id
        });
		// for(var i = 0; i<messages.length;i++){
		// 	this.state.messages.push(messages[i])
		// }
		//已安排占已报名的百分比
		var per = (arranged / enrolled * 288);
		if (arranged != 0) {
			document.getElementById("enrolled-per").style.width = per + "px";
		}
		var name = getCache(DATA_TYPE_BASE) !== undefined ? getCache(DATA_TYPE_BASE).c_name : "";
		window.currentPage.setState({
			name: name,
			enrolled: enrolled,
			arranged: arranged,
			examing: examing,
			passed: passed,
			unarragedStudents: unarragedStudents,
			arrangedStudents: arrangedStudents,
			clazzes: getCache(DATA_TYPE_CLAZZ) ? getCache(DATA_TYPE_CLAZZ) : []
		})
	}

	cancelEnroll(id) {
		var cb = (route, message, arg) => {
			if(message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.handleRequestClose()
		}
		getData(getRouter(UNROLL_STUDENT), {
			session: sessionStorage.session,
			id: id
		}, cb, {
			id: id
		});
	}
	send_cancel() {
		var cb = (route, message, arg) => {
			if(message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(APPLY_CANCEL), {
			session: sessionStorage.session,
			user_id: this.state.cancel_student_id,
			reason: this.state.cancel_reason
		}, cb, {});
	}
	recall_cancel(id) {
		var cb = (route, message, arg) => {
			if(message.code === Code.LOGIC_SUCCESS) {
				this.fresh();
			}
			this.handleRequestClose()
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(RECALL_CANCEL), {
			session: sessionStorage.session,
			cancel_id: id
		}, cb, {});
	}

	agreeArrange() {
		var id = this.state.selectedStudentId;
		var cb = (router, message, arg) => {
			if (message.code === Code.LOGIC_SUCCESS) {
				getStudent(arg.id).status[STATUS_AGREED].status = STATUS_AGREED_AGREE;
				this.fresh();

			}
			this.popUpNotice(NOTICE, 0, message.msg);
		}
		getData(getRouter(AGREE_ARRANGE), {
			session: sessionStorage.session,
			id: id
		}, cb, {
			id: id
		});
	}
	cancel_reason() {
		return(
			<Dialog open={this.state.openCancelReason} onRequestClose={this.handleRequestClose} >
<DialogTitle>
系统正在排班，是否继续{this.state.cancel_student_name}取消报名？
</DialogTitle>
<TextField
style={{width:"94%",marginLeft:"3%",marginBottom:"2rem"}}
className="nyx-clazz-message"
key={"cancel_reason"}
id={"cancel_reason"}
label={"取消原因"}
// value={this.state.selected["class_head"] === null ? "" : this.state.selected["class_head"]}
onChange={(event) => {
this.setState({
cancel_reason:event.target.value 
});
}}
>
</TextField> 
<DialogActions>
<div>
<Button style={{backgroundColor:"#2196F3",color:"#FFF",marginRight:"1rem"}}
onClick={() => {
if (this.state.cancel_reason === "") {
this.popUpNotice(NOTICE, 0, "请填写取消原因")
return
}
if(this.state.cancel_reason.length>300){
this.popUpNotice(NOTICE, 0, "请填写取消原因在300字以内")
return
}
this.send_cancel()
this.handleRequestClose()
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
			openCancelReason: false
		})
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
		}
		getData(getRouter(REFUSE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
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

	closeNotice = () => {
		this.setState({
			alertOpen: false,
		})
	}
	check_message = (id) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.fresh();
               
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(BE_READ), { session: sessionStorage.session,message_id:id  }, cb, {});

	}
	timestampToTime(timestamp){
        var date = new Date(timestamp * 1000),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '/',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/',
        D = date.getDate()<10?'0'+date.getDate():date.getDate();
        return Y+M+D;
    }

	render() {
		return (
			<div className={'nyx-page'}>
<div style={{ paddingTop: "0" }} className={'nyx-paper'}>

		<Paper id="companyid" >

		<div className="nyx-head-name">
		{"企业报名信息统计"} <i className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
		</div>
		<div className="nyx-arranger-enrolled-title">
		<span>
		{Lang[window.Lang].pages.com.home.arranged + ":"
		+ this.state.arranged + Lang[window.Lang].pages.com.home.human}
		</span>
		<span style={{ float: "right" }}>
		{Lang[window.Lang].pages.com.home.unarranged + ":"
		+ (this.state.enrolled-this.state.arranged) + Lang[window.Lang].pages.com.home.human}
		</span>
		</div>
		<span className="nyx-arranged-per">

		</span>
		<span id="enrolled-per" className="nyx-enrolled-per">

		</span>
		<div className="nyx-arranger-enrolled-title" style={{ paddingTop:"1rem",textAlign: "center"}}>
		<span>
		{Lang[window.Lang].pages.com.home.enrolled + "共:"
		+ this.state.enrolled + Lang[window.Lang].pages.com.home.human}
		</span>
		</div>
		</Paper>

		<Paper style={{marginTop:"1rem"}} >
		<List style={{ padding: 0 }}>
		<div className="nyx-head-name">
		{"通知中心"} <i
		onClick={() => {
		//	console.log(this.state.message_height)
			if (this.state.message_height == 0) {
			this.setState({ message_height: 1 })
			} else {
			this.setState({ message_height: 0 })
			}
			}}
		className="glyphicon glyphicon-menu-down nyx-flexible" aria-hidden="true"></i>
		</div>
		<div style={{paddingTop:0}} className={this.state.message_height ? "nyx-list-paper" : "nyx-list-paper-change"}>
		{this.state.messages.map((message,index) => {

           switch (message.type_id) {
			case "1":
			return (
				 <div
				 className={this.state.btns==message.message_id?"nyx-message-card-block":"nyx-message-card" }
					onClick={() => {
						if(message.is_read==0){
							this.check_message(message.message_id);
						  }
						this.setState({
							btns:message.message_id
						})
						}}>
					<div className={message.is_read==1?"nyx-message-read":"nyx-message-unread"}>
                <div>
					<span
					className={message.is_read==1?"nyx-message-read":"nyx-message-unread-name"}
					//style={{color:"#0D47A1"}}
					><p 
					style={{width:"1.2rem",float:"left",margin:"0"}}
					>{index+1}.</p>{getMessage(message.type_id)}</span><span 
					style={{marginLeft:"0.5rem"}}
					>{message.name}</span>
					<Button  raised
					 style={message.is_read==0?{backgroundColor:"#2196f3",color:"#FFFFFF",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}:{backgroundColor:"#ececec",color:"#9E9E9E",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}}>查看</Button>
					<span
					style={{float:"right"}}
					>{message.is_read==0?"未读":"已读"} {this.timestampToTime(message.time)}</span>
					
				</div>
				<div style={{height:"18px"}}>
				<p title={message.name} className="nyx-message-hidden" style={{width:"2.5rem",marginLeft:"1.2rem"}}>{message.name}</p> 
					<p  className="nyx-message-hidden"
					> {message.message}。</p>
					
				</div>
				<div 
				style={{marginLeft:"1.2rem"}}>
				<span
					>无法参加 {getInst(message.ti_id)} 组织的 {message.train_starttime ==null?"":message.train_starttime.substr(0,4)+"/"+message.train_starttime.substr(4,2)+"/"+message.train_starttime.substr(6,2)}<br/> {getCourse(message.course_id)}培训。</span>
				</div>
				</div>
				</div>
			)
			case "2":
			return (
				<div
				className={this.state.btns==message.message_id?"nyx-message-card-block-lg":"nyx-message-card" }
				   onClick={() => {
					if(message.is_read==0){
						this.check_message(message.message_id);
					  }
					   this.setState({
						   btns:message.message_id
					   })
					   }}>
				   <div className={message.is_read==1?"nyx-message-read":"nyx-message-unread"}>
			   <div>
				   <span
				   className={message.is_read==1?"nyx-message-read":"nyx-message-unread-name"}
				   ><p 
				   style={{width:"1.2rem",float:"left",margin:"0"}}
				   >{index+1}.</p>{getMessage(message.type_id)}</span><span 
				   style={{marginLeft:"0.5rem"}}
				   >{message.name}</span>
				  <Button  raised
					 style={message.is_read==0?{backgroundColor:"#2196f3",color:"#FFFFFF",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}:{backgroundColor:"#ececec",color:"#9E9E9E",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}}>查看</Button>
					<span
					style={{float:"right"}}
					>{message.is_read==0?"未读":"已读"} {this.timestampToTime(message.time)}</span>
			   </div>
			   <div style={{height:"18px"}}>
			   <p title={message.name} className="nyx-message-hidden" style={{width:"2.5rem",marginLeft:"1.2rem"}}>{message.name}</p> 
				  <p className="nyx-message-hidden"
				   > 无法参加 {getInst(message.ti_id)} 组织的 {message.train_starttime ==null?"":message.train_starttime.substr(0,4)+"/"+message.train_starttime.substr(4,2)+"/"+message.train_starttime.substr(6,2)}</p>
				   
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem",height:"18px"}}>
			 <span>{getCity(message.area_id)} {getCourse(message.course_id)}培训</span> 
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem",height:"18px"}}>
                <p className="nyx-message-hidden" style={{width:"15rem"}}> 取消成功,请手动重新报名</p>
			     </div>
			   <div 
			   style={{marginLeft:"1.2rem"}}>
			 原因:{message.message}
			   </div>
			   </div>
			   </div>
		   )
		   case "3":
			return (
				<div
				className={this.state.btns==message.message_id?"nyx-message-card-block":"nyx-message-card" }
				   onClick={() => {
					  if(message.is_read==0){
						this.check_message(message.message_id);
					  }
					   this.setState({
						   btns:message.message_id
					   })
					  
					   }}>
				   <div className={message.is_read==1?"nyx-message-read":"nyx-message-unread"}>
			   <div>
				   <span
				   className={message.is_read==1?"nyx-message-read":"nyx-message-unread-name"}
				   ><p 
				   style={{width:"1.2rem",float:"left",margin:"0"}}
				   >{index+1}.</p>{getMessage(message.type_id)}</span><span 
				   style={{marginLeft:"0.5rem"}}
				   >{message.name}</span>
				  <Button  raised
					 style={message.is_read==0?{backgroundColor:"#2196f3",color:"#FFFFFF",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}:{backgroundColor:"#ececec",color:"#9E9E9E",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}}>查看</Button>
					<span
					style={{float:"right"}}
					>{message.is_read==0?"未读":"已读"} {this.timestampToTime(message.time)}</span>
			   </div>
			   <div style={{height:"18px"}}>
			   <p title={message.name} className="nyx-message-hidden" style={{width:"2.5rem",marginLeft:"1.2rem"}}>{message.name}</p> 
				  <p className="nyx-message-hidden"
				   > 无法参加 {getInst(message.ti_id)} 组织的 {message.train_starttime ==null?"":message.train_starttime.substr(0,4)+"/"+message.train_starttime.substr(4,2)+"/"+message.train_starttime.substr(6,2)}</p>
				   
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem",height:"18px"}}>
			 <p title={getCity(message.area_id)} className="nyx-message-hidden" style={{width:"2.5rem"}}>{getCity(message.area_id)}</p> 
			 <p title={getCourse(message.course_id)} className="nyx-message-hidden" style={{width:"3.2rem"}}>{getCourse(message.course_id)}</p>
			 <p  className="nyx-message-hidden" style={{width:"10rem"}}> 培训,已累计3次,请重新报名</p>
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem"}}>
			 原因:{message.message}
			   </div>
			   </div>
			   </div>
		   )
		   case "4":
			return (
				<div
				className={this.state.btns==message.message_id?"nyx-message-card-block":"nyx-message-card" }
				   onClick={() => {
					  if(message.is_read==0){
						this.check_message(message.message_id);
					  }
					   this.setState({
						   btns:message.message_id
					   })
					  
					   }}>
				   <div className={message.is_read==1?"nyx-message-read":"nyx-message-unread"}>
			   <div>
				   <span
				   className={message.is_read==1?"nyx-message-read":"nyx-message-unread-name"}
				   ><p 
				   style={{width:"1.2rem",float:"left",margin:"0"}}
				   >{index+1}.</p>{getMessage(message.type_id)}</span><span 
				   style={{marginLeft:"0.5rem"}}
				   >{message.name}</span>
				  <Button  raised
					 style={message.is_read==0?{backgroundColor:"#2196f3",color:"#FFFFFF",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}:{backgroundColor:"#ececec",color:"#9E9E9E",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}}>查看</Button>
					<span
					style={{float:"right"}}
					>{message.is_read==0?"未读":"已读"} {this.timestampToTime(message.time)}</span>
			   </div>
			   <div style={{height:"18px"}}>
			   <p title={message.name} className="nyx-message-hidden" style={{width:"2.5rem",marginLeft:"1.2rem"}}>{message.name}</p> 
				  <p className="nyx-message-hidden"
				   > 无法参加 {getInst(message.ti_id)} 组织的 {message.train_starttime ==null?"":message.train_starttime.substr(0,4)+"/"+message.train_starttime.substr(4,2)+"/"+message.train_starttime.substr(6,2)}</p>
				   
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem",height:"18px"}}>
			 <p title={getCity(message.area_id)} className="nyx-message-hidden" style={{width:"2.5rem"}}>{getCity(message.area_id)}</p> 
			 <p title={getCourse(message.course_id)} className="nyx-message-hidden" style={{width:"3.2rem"}}>{getCourse(message.course_id)}</p>
			 <p  className="nyx-message-hidden" style={{width:"10rem"}}> 培训,等待重新分班。</p>
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem"}}>
			 原因:{message.message}
			   </div>
			   </div>
			   </div>
		   )
		   case "5":
			return (
				<div
				className={this.state.btns==message.message_id?"nyx-message-card-block":"nyx-message-card" }
				   onClick={() => {
					  if(message.is_read==0){
						this.check_message(message.message_id);
					  }
					   this.setState({
						   btns:message.message_id
					   })
					  
					   }}>
				   <div className={message.is_read==1?"nyx-message-read":"nyx-message-unread"}>
			   <div>
				   <span
				   className={message.is_read==1?"nyx-message-read":"nyx-message-unread-name"}
				   ><p 
				   style={{width:"1.2rem",float:"left",margin:"0"}}
				   >{index+1}.</p>{getMessage(message.type_id)}</span><span 
				   style={{marginLeft:"0.5rem"}}
				   >{message.name}</span>
				  <Button  raised
					 style={message.is_read==0?{backgroundColor:"#2196f3",color:"#FFFFFF",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}:{backgroundColor:"#ececec",color:"#9E9E9E",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}}>查看</Button>
					<span
					style={{float:"right"}}
					>{message.is_read==0?"未读":"已读"} {this.timestampToTime(message.time)}</span>
			   </div>
			   <div
			    style={{marginLeft:"1.2rem",height:"18px"}}>
				<p title={message.name} className="nyx-message-hidden" style={{width:"2.5rem"}}>{message.name}</p> 
				    <p className="nyx-message-hidden"> 成功报名 {getInst(message.ti_id)} </p>
				    <p title={getCourse(message.course_id)+"培训班"} className="nyx-message-hidden" style={{width:"6.5rem",marginLeft:"0.2rem"}}>{getCourse(message.course_id)}培训班</p>
					
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem",height:"18px"}}>
			    {message.train_starttime ==null?"":"开班时间:"+message.train_starttime.substr(0,4)+"/"+message.train_starttime.substr(4,2)+"/"+message.train_starttime.substr(6,2)} {message.class_head==null?"":"班主任:"+message.class_head}
				
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem"}}>
			   {message.mobile==null?"":"联系方式:"+message.mobile}
			
			   </div>
			   </div>
			   </div>
		   )
		   case "6":
			return (
				<div
				className={this.state.btns==message.message_id?"nyx-message-card-block":"nyx-message-card" }
				   onClick={() => {
					  if(message.is_read==0){
						this.check_message(message.message_id);
					  }
					   this.setState({
						   btns:message.message_id
					   })
					  
					   }}>
				   <div className={message.is_read==1?"nyx-message-read":"nyx-message-unread"}>
			   <div>
				   <span
				   className={message.is_read==1?"nyx-message-read":"nyx-message-unread-name"}
				   ><p 
				   style={{width:"1.2rem",float:"left",margin:"0"}}
				   >{index+1}.</p>{getMessage(message.type_id)}</span><span 
				   style={{marginLeft:"0.5rem"}}
				   >{message.name}</span>
				  <Button  raised
					 style={message.is_read==0?{backgroundColor:"#2196f3",color:"#FFFFFF",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}:{backgroundColor:"#ececec",color:"#9E9E9E",float:"right",margin:0,padding:0,minHeight:"18px",minWidth:"34px",marginLeft:"0.3rem"}}>查看</Button>
					<span
					style={{float:"right"}}
					>{message.is_read==0?"未读":"已读"} {this.timestampToTime(message.time)}</span>
			   </div>
			   <div
			    style={{marginLeft:"1.2rem",height:"18px"}}>
				<p title={message.name} className="nyx-message-hidden" style={{width:"2.5rem"}}>{message.name}</p> 
				    <p className="nyx-message-hidden"> 成功报名 {getInst(message.ti_id)} </p>
				    <p title={getCourse(message.course_id)+"培训班"} className="nyx-message-hidden" style={{width:"6.5rem",marginLeft:"0.2rem"}}>{getCourse(message.course_id)}培训班</p>
					
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem",height:"18px"}}>
			    {message.train_starttime ==null?"":"开班时间:"+message.train_starttime.substr(0,4)+"/"+message.train_starttime.substr(4,2)+"/"+message.train_starttime.substr(6,2)} {message.class_head==null?"":"班主任:"+message.class_head}
				
			   </div>
			   <div 
			   style={{marginLeft:"1.2rem"}}>
			   {message.mobile==null?"":"联系方式:"+message.mobile}
			
			   </div>
			   </div>
			   </div>
		   )
		
		}


				
             })}
		</div>
		</List>
		</Paper>
		</div>
		<Paper style={{ padding: 0 }} className={'nyx-paper'}>
		<List style={{ padding: 0 }}>
		<div style={{ marginBottom: "1rem" }} className="nyx-head-name">
		{Lang[window.Lang].pages.com.home.unarranged_title} <i
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
		{this.state.unarragedStudents.map(student => {
		switch (student.is_cancel) {
		case "0":
		return (
		<StudentCard
		type={CARD_TYPE_UNARRANGE}
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
		this.state.cancel_reason="";
		this.state.selectedStudentId = student.id;
		student.is_inlist==1?this.popUpNotice(ALERT, 0, "取消" + student.name + "报名", [
		() => {
		this.cancelEnroll(student.id);
		this.closeNotice();
		}, () => {
		this.closeNotice();
		}]):this.setState({
		openCancelReason:true,
		cancel_student_name:student.name,
		cancel_student_id:student.id
		})
		}]}
		>
		</StudentCard>)
		case "1":
		{
		return (
		<StudentCard
		type={CARD_TYPE_UNARRANGE_ING}
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
		this.popUpNotice(ALERT, 0, "撤销" + student.name + "的取消报名", [
		() => {
		this.recall_cancel(student.cancel_id);
		this.closeNotice();
		}, () => {
		this.closeNotice();
		}])
		}]}
		>
		</StudentCard>)
		}
		}
		})
		}
		</div>
		</List>
		</Paper>
		<Paper style={{ padding: 0 }} className={'nyx-paper'}>

		<List style={{ padding: 0 }}>
		<div style={{ marginBottom: "1rem" }} className="nyx-head-name">
		{Lang[window.Lang].pages.com.home.arranged_title} <i
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
		case "0":
		return (<StudentCard
		type={CARD_TYPE_ARRANGE}
		key={CARD_TYPE_ARRANGE + student.id}
		name={student.name === null ? "" : student.name}
		mobile={student.mobile === null ? "" : student.mobile}
		email={student.mail === null ? "" : student.mail}
		level={student.course_id === "" ? 0 : Number(student.course_id)}
		city={student.area_id === "" ? 0 : Number(student.area_id)}
		action={[
		() => {
		this.state.selectedStudentId = student.id;
		this.popUpNotice(ALERT, 0, "通过" + student.base_info.name + "课程安排？", [
		() => {
		this.agreeArrange();
		this.closeNotice();
		}, () => {
		this.closeNotice();
		}]);
		},
		() => {
		this.state.selectedStudentId = student.id;
		this.popUpNotice(ALERT, 0, "拒绝" + student.base_info.name + "课程安排？", [
		() => {
		this.refuseArrange();
		this.closeNotice();
		}, () => {
		this.closeNotice();
		}]);
		}]}
		>
		</StudentCard>)
		case "1":
		return (<StudentCard
		type={CARD_TYPE_ARRANGE}
		key={CARD_TYPE_ARRANGE + student.id}
		name={student.name === null ? "" : student.name.toString()}
		mobile={student.mobile === null ? "" : student.mobile.toString()}
		email={student.mail === null ? "" : student.mail.toString()}
		level={student.course_id === "" ? 0 : Number(student.course_id)}
		city={student.area_id === "" ? 0 : Number(student.area_id)}
		status={"已通过"}
		>
		</StudentCard>)
		case "2":
		return (<StudentCard
		type={CARD_TYPE_ARRANGE}
		key={CARD_TYPE_ARRANGE + student.id}
		name={student.name === null ? "" : student.name.toString()}
		mobile={student.mobile === null ? "" : student.mobile.toString()}
		email={student.mail === null ? "" : student.mail.toString()}
		level={student.course_id === "" ? 0 : Number(student.course_id)}
		city={student.area_id === "" ? 0 : Number(student.area_id)}
		status={"已拒绝"}
		>
		</StudentCard>)
		case "3":
		return (<StudentCard
		type={CARD_TYPE_KNOW}
		key={CARD_TYPE_KNOW + student.id}
		name={student.name === null ? "" : student.name.toString()}
		mobile={student.mobile === null ? "" : student.mobile.toString()}
		email={student.mail === null ? "" : student.mail.toString()}
		level={student.course_id === "" ? 0 : Number(student.course_id)}
		city={student.area_id === "" ? 0 : Number(student.area_id)}
		status={"已通知"}
		>
		</StudentCard>)
		}
		})}
		</div>
		</List>
		</Paper>
		
		<div className="nyx-notice-button nyx-display-none">
			<div  className="nyx-notice-title">报名流程</div>
		<div className="nyx-notice-box">
		</div>
		</div>
		{this.cancel_reason()}
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