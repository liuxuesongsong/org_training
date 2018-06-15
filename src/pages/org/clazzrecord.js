import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { initCache, getData, getRouter, getCache, getCity, getInst, getCourse,getCourses, getTotalPage, getAreas } from '../../utils/helpers';

import {  ALERT, NOTICE, QUERY} from '../../enum';
import Drawer from 'material-ui/Drawer';


import ReactDataGrid from 'angon_react_data_grid';
import Code from '../../code';
import Lang from '../../language';
import CommonAlert from '../../components/CommonAlert';
import { fstat } from 'fs';
class Clazzrecord extends Component {
    state = {
        allData: [],
        tableData: [],
        queryCondition: {},
        selectedStudentID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        currentPage: 1,
        totalPage: 1,
        rowsPerPage: 25,             //每页显示数据
        pno:1,
        psize:10,
        count: 0,
        showStudents:false,
        openDialog:false,
        opentheory:false,
        openhead:false,
        opensponsor:false,
        openpractice:false,
        openimplement:false,//实施地点管理模块
        see_manage_list:[],
        edit_state:0,
        create_name:"",
        create_number:"",
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
                is_inlist:1
                
            })
        }
        getData(getRouter("select_all_students"), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
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
    handleRequestClose = () => {
        this.setState({
            openheadDialog: false,
            openDialog:false,
            opentheory:false,
            openhead:false,
            opensponsor:false,//主办方
            openpractice:false,//实践
            openimplement:false,//实施
            edit_state:0
         
        })
    }
    //查看管理模块
    see_module = (see_module) =>{
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               // console.log(message.data);
                this.state.see_manage_list=message.data;
               
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(see_module), { session: sessionStorage.session }, cb, {});
    }
    //创建管理模块
    create_module = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_state:0
                })
               
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        
        console.log(this.state.create_name+this.state.create_number)
     //   getData(getRouter(CREATE_TYPE), { session: sessionStorage.session, type_name:this.state.create_type_name }, cb, {});

    }
    //删除管理模块
    del_module = (id) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_state:0
                })
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        console.log(id)
      //  getData(getRouter(DEL_TYPE), { session: sessionStorage.session, id:id }, cb, {});

    }

    //修改管理模块
    edit_module = (id,name,number) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_state:0
                })
              //  this.state.allData = [];
                this.fresh();
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
    var name= document.getElementById(name).value;
    var number = document.getElementById(number).value;
    console.log(name+number)
       // getData(getRouter(EDIT_TYPE), { session: sessionStorage.session,id:id,type_name:type_name}, cb, {});

    }
     Dialogs = (title,type) => {
        return (
            <Dialog open={this.state.openDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle style={{width:"515px"}}>
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
                            edit_state:-1
                         })
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
                        <tr>
                            <td style={{width:"110px"}}>{this.state.openimplement?"地区":"姓名"}</td><td style={{width:"215px"}}>{type}</td><td></td><td></td>
                        </tr>
                        <tr style={{display:this.state.edit_state==-1?"":"none"}}>
                           
                            <td style={{width:"110px"}}>
                            {this.state.openimplement?<select
                    style={{
                        border:"none",borderBottom:"1px solid rgba(0, 0, 0, 0.54)",marginLeft:"1rem",height:"36px",outline:"none"
                    }}
                        className="nyx-info-select-lg"
                        id="search_area_id"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        // defaultValue={this.state.search_area_id === null ? "" : this.state.search_area_id}
                        // onChange={(e) => {
                        //     this.state.search_area_id =  e.target.value == "null"? null:e.target.value;
                        //     this.state.queryCondition.area_id =  e.target.value == "null"? null:e.target.value;
                        // }}
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
                                        this.popUpNotice(NOTICE, 0, "请输入姓名");  
                                        return
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
                                            edit_state:0
                                        })
                                    }}
                                    style={{margin: 0,marginLeft:6,top:7}}
                                >
                                    {"取消"}
                                </Button>      
                                </td>
                        </tr>
                        {this.state.see_manage_list.map(see_manages => {
                              
                              return <tr>
                              <td>
                              <TextField
                               key={see_manages.category}
                               style={{width:"110px"}}
                                  id={"edit_name"+see_manages.id}
                                  className="nyx-file-text"
                                  defaultValue= {see_manages.category}
                                 disabled={this.state.edit_state==see_manages.id?false:true}
                                
                              />
                             </td><td
                               style={{width:"215px"}}
                              >
                            {/* <input
                            
                            value={type_infos.type_name}/> */}
                               <TextField
                               key={see_manages.type_name}
                                  id={"edit_number"+see_manages.id}
                                  className="nyx-file-text"
                                  defaultValue={see_manages.type_name}
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
    render() {
        return (
            <div style={{ marginTop: 80, width: "100%" }}>
                <div>
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg nyx-document-btn"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({openDialog: true , openhead: true });
                        this.see_module("type_infos");
                    }}
                >
                    {"班主任管理"}
                </Button>
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg nyx-document-btn"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true,opensponsor:true });
                    }}
                >
                    {"主办方联系人管理"}
                </Button>
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg nyx-document-btn"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true ,opentheory:true});
                    }}
                >
                    {"理论讲师管理"}
                </Button>   
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg nyx-document-btn"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true,openpractice:true });
                    }}
                >
                    {"实践讲师管理"}
                </Button>   
                <Button
                    raised 
                    color="primary"
                    className="nyx-org-btn-lg nyx-document-btn"
                    onClick={() => {
                        this.state.see_manage_list=[];
                        this.setState({ openDialog: true,openimplement: true });
                    }}
                >
                    {"实施地点管理"}
                </Button>   
                    
                   
                   
                   
                </div>
                
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
                            company_name: this.state.tableData[i].company_name,
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
                {/* {"已选择"+this.state.selectedStudentID.length + "人/"}

                共{this.state.count}人
                 */}
                 {/* {this.headDialog()} */}
                  
                  {this.state.openhead?this.Dialogs("班主任管理","电话"):""}
                  {this.state.opensponsor?this.Dialogs("主办方联系人管理","电话"):""}
                  {this.state.opentheory?this.Dialogs("理论讲师管理","讲师编号"):""}
                  {this.state.openpractice?this.Dialogs("实践讲师管理","讲师编号"):""}
                  {this.state.openimplement?this.Dialogs("实施地点管理","详细地址"):""}
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