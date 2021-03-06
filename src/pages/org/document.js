import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse, getTotalPage, getAreas } from '../../utils/helpers';

import { DEL_TRAIN,CHOOSE_STUDENT, ALERT, NOTICE, SELECT_ALL_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO,CREATE_FILE,SEARCH_FILE,DEL_FILE,CREATE_TYPE,TYPE_INFOS,DEL_TYPE,EDIT_FILE,EDIT_TYPE,SEARCH_TYPE,NOTE_LIST} from '../../enum';
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
import { type } from 'os';
class Student extends Component {
    state = {
        allData: [],
        tableData: [],
        queryCondition: { is_inlist:1,institution:0},
        selectedStudentID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        currentPage: 1,
        selected:{},
        totalPage: 1,
        rowsPerPage: 10,             //每页显示数据
        count: 0,
        search_file_name: "",
        search_file_type: "",
        search_institution: 0,
        new_file_name:"",
        new_file_url:"",
        new_file_edit:"",
        new_select_file_type:"",
        change_select_file_type:"",
        change_file_name:"",
        change_type_name:"",
        changed_type_name:"",
        change_edition:"",
        change_url:"",
        change_id:"",
        down_file_url:"",
        del_file_id:"",
        create_type_name:"",
        type_info_name:"",
        selected_type_id:"",
        edit_type_name:0,
        type_infos:[],
        note_list:[],
        barcon:"",
        pno:1,
        psize:10,
        filepno:1,
        filepsize:10,
         // 提示状态
         alertOpen: false,
         alertType: ALERT,
         alertCode: Code.LOGIC_SUCCESS,
         alertContent: "",
         alertAction: [],
         openNewStudentDialog: false,
         openaddFileDialog: false,
         openchangeFileDialog:false,
         opentypeDialog: false,
         opendownFileDialog:false,
         openhistoryFileDialog:false,
         isblock:"",
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
        this.state.allData=[];
        initCache(this.cacheToState);
    }

    cacheToState() {
        window.currentPage.queryStudents();
        window.currentPage.type_infos();
       // window.currentPage.note_list();
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
                var result = message.data.files;
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
        getData(getRouter("file_list"), { session: sessionStorage.session }, cb, {});
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

                // if (allCheckBox === true) {
                //     document.getElementById('select-all-checkbox').checked = true;
                // } else {
                //     document.getElementById('select-all-checkbox').checked = false;
                // }
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

 
 
    create_type = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_type_name:0
                })
               
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(CREATE_TYPE), { session: sessionStorage.session, type_name:this.state.create_type_name }, cb, {});

    }
    del_type = (id) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_type_name:0
                })
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(DEL_TYPE), { session: sessionStorage.session, id:id }, cb, {});

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
    note_list = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.state.note_list=message.data
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(NOTE_LIST), { session: sessionStorage.session}, cb, {});

    }
    goPage= (pno,psize) =>{
        // {this.historyFileDialog()}
        var components = [];
        var num = this.state.note_list.length;//表格所有行数(所有记录数)
        var totalPage = 0;//总页数
        var pageSize = psize;//每页显示行数
       // //总共分几页 
       if(num/pageSize > parseInt(num/pageSize)){   
               totalPage=parseInt(num/pageSize)+1;   
          }else{   
              totalPage=parseInt(num/pageSize);   
          }   
       var currentPage = pno;//当前页数
        var startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31 
        var endRow = currentPage * pageSize;//结束显示的行   40
        endRow = (endRow > num)? num : endRow;    40
        this.state.note_list.map((note_list)=>{
          components.push (<tr
                  style={{maxHeight:"25px",display:this.state.note_list.indexOf(note_list)+1>=startRow &&this.state.note_list.indexOf(note_list)+1<=endRow?"":"none"}}
                  key = {note_list.id}> 
                  <td width={60} height={25} style={{textAlign:"center"}}>{this.state.note_list.indexOf(note_list)+1}</td>
                  <td title={this.timestamp2Time(note_list.time+"000", "-")} width={100} style={{textAlign:"center"}}>{this.timestamp2Time(note_list.time+"000", "-")}</td>
                  <td title={note_list.user} width={120}  style={{textAlign:"center"}}>{note_list.user}</td>
                  <td title={note_list.content} width={180}>{note_list.content}</td>
                </tr>
       
        )});
         return components
        
     }
     filePage= (filepno,psize) =>{
        // {this.historyFileDialog()}
        var components = [];
        var num = this.state.allData.length;//表格所有行数(所有记录数)
        var totalPage = 0;//总页数
        var pageSize = psize;//每页显示行数
       // //总共分几页 
       if(num/pageSize > parseInt(num/pageSize)){   
               totalPage=parseInt(num/pageSize)+1;   
          }else{   
              totalPage=parseInt(num/pageSize);   
          }   
       var currentPage = filepno;//当前页数
        var startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31 
        var endRow = currentPage * pageSize;//结束显示的行   40
        endRow = (endRow > num)? num : endRow;    40
        this.state.allData.map((file_list)=>{   
          components.push (<tr
                  style={{maxHeight:"25px",display:this.state.allData.indexOf(file_list)+1>=startRow &&this.state.allData.indexOf(file_list)+1<=endRow?"":"none"}}
                  key = {file_list.id}> 
                  <td width={60} height={25}>{this.state.allData.indexOf(file_list)+1}</td>
                  <td title={file_list.file_name} width={140} style={{textAlign:"left",paddingLeft:"1rem"}}>{file_list.file_name}</td>
                  <td title={file_list.type_name} width={120}>{file_list.type_name}</td>
                  <td title={file_list.edition} width={80}>{file_list.edition}</td>
                  <td title={file_list.time} width={80}>{file_list.time}</td>
                  <td title={file_list.uploader} width={80}>{file_list.uploader}</td>
                  <td>
                  <div
                            title="下载"
                            className="nyx-file-list-btn"
                            onClick={() => {
                                this.state.down_file_url=file_list.url
                                this.setState({ opendownFileDialog: true });
                                
                            }}
                        >
                            {"下载"}
                        </div>
                  </td>
                  <td><div
                                    title="编辑"
                                    className="nyx-file-list-btn"
                                    onClick={() => {
                                        this.state.selected = file_list;
                                        this.setState({ openchangeFileDialog: true });
                                         this.state.change_id=file_list.id;
                                        {this.state.type_infos.map((type_infos)=>{
                                            if(file_list.type_name==type_infos.type_name){
                                                this.setState({
                                                    selected_type_id:type_infos.id
                                                })
                                            }
                                        })}
                                    }}
                                >
                        {"编辑"}
                    </div></td>
                  <td><div
                        className="nyx-file-list-btn"
                        title="删除"
                        onClick={() => {
                            this.state.del_file_id=file_list.id;
                            this.popUpNotice(ALERT, 0, "是否删除该文件？", [
                                () => {
                                this.del_file();
                                //this.state.allData = [];
                               // this.fresh();
                                    this.closeNotice();
                                }, () => {
                                    this.closeNotice();
                                }]);
                    }}
                >
                    {"删除"}
                </div></td>
                </tr>
       
        )});
         return components
        
     }
     change_file_page = (pno,psize)=>{
        var num = this.state.allData.length;//表格所有行数(所有记录数)
        var totalPage = 0;//总页数
        var pageSize = psize;//每页显示行数
       // //总共分几页 
       if(num/pageSize > parseInt(num/pageSize)){   
               totalPage=parseInt(num/pageSize)+1;   
          }else{   
              totalPage=parseInt(num/pageSize);   
          }   
       var currentPage = this.state.filepno;//当前页数
        var startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31 
        var endRow = currentPage * pageSize;//结束显示的行   40
        endRow = (endRow > num)? num : endRow;    40
        var components =<div>
            <span>{"共"+num+"条记录 分"+totalPage+"页 当前第"+currentPage+"页"}</span>
        <a 
         className="nyx-change-page-href"
         onClick={()=>{
             this.setState({
                 filepno:1
             })
            currentPage>1?this.filePage(this.state.filepno,"+psize+"):""
         }}
         >首页</a>
        <a 
            className="nyx-change-page-href" onClick={()=>{
            currentPage>1?this.setState({filepno:this.state.filepno-1}):""
            currentPage>1?this.filePage(this.state.filepno,"+psize+"):""
        }}
         >{"<上一页"}</a>
         
        <a 
            className="nyx-change-page-href" 
            onClick={()=>{
            currentPage<totalPage?this.setState({filepno:this.state.filepno+1}):""
           { this.filePage("+(currentPage+1)+","+psize+")}
            currentPage<totalPage?this.filePage(this.state.filepno,"+psize+"):""
        }}
         >{"下一页>"}</a>
        <a 
             className="nyx-change-page-href"
             onClick={()=>{
             currentPage<totalPage?this.setState({filepno:totalPage}):""
            currentPage<totalPage?this.filePage(this.state.filepno,"+psize+"):""} }
        >{"尾页"}</a>
        </div>

     return components
     }
     change_page = (pno,psize)=>{
        var num = this.state.note_list.length;//表格所有行数(所有记录数)
        var totalPage = 0;//总页数
        var pageSize = psize;//每页显示行数
       // //总共分几页 
       if(num/pageSize > parseInt(num/pageSize)){   
               totalPage=parseInt(num/pageSize)+1;   
          }else{   
              totalPage=parseInt(num/pageSize);   
          }   
       var currentPage = this.state.pno;//当前页数
        var startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31 
        var endRow = currentPage * pageSize;//结束显示的行   40
        endRow = (endRow > num)? num : endRow;    40
        var components =<div>
            <span>{"共"+num+"条记录 分"+totalPage+"页 当前第"+currentPage+"页"}</span>
        <a 
         className="nyx-change-page-href"
         onClick={()=>{
             this.setState({
                 pno:1
             })
            currentPage>1?this.goPage(this.state.pno,"+psize+"):""
         }}
         >首页</a>
        <a 
            className="nyx-change-page-href" onClick={()=>{
            currentPage>1?this.setState({pno:this.state.pno-1}):""
            currentPage>1?this.goPage(this.state.pno,"+psize+"):""
        }}
         >{"<上一页"}</a>
        <a 
            className="nyx-change-page-href" 
            onClick={()=>{
            currentPage<totalPage?this.setState({pno:this.state.pno+1}):""
           { this.goPage("+(currentPage+1)+","+psize+")}
            currentPage<totalPage?this.goPage(this.state.pno,"+psize+"):""
        }}
         >{"下一页>"}</a>
        <a 
             className="nyx-change-page-href"
             onClick={()=>{
             currentPage<totalPage?this.setState({pno:totalPage}):""
            currentPage<totalPage?this.goPage(this.state.pno,"+psize+"):""} }
        >{"尾页"}</a>
        </div>

     return components
     }
    type_infos = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.state.type_infos=message.data
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(TYPE_INFOS), { session: sessionStorage.session}, cb, {});

    }
    edit_type = (id,type_name) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({
                    edit_type_name:0
                })
                this.state.allData = [];
                this.fresh();
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
    var type_name= document.getElementById(type_name).value;
        getData(getRouter(EDIT_TYPE), { session: sessionStorage.session,id:id,type_name:type_name}, cb, {});

    }
    create_file = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.allData=[];
                document.getElementById("search_file_type").value="";
               this.fresh()
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(CREATE_FILE), { session: sessionStorage.session, name:this.state.new_file_name,edition:this.state.new_file_edit,url:this.state.new_file_url,type_id:this.state.new_select_file_type }, cb, {});

    }
    edit_file = (id) => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               
                for(var i=0;i<this.state.tableData.length;i++){
                    if(this.state.tableData[i].id==this.state.change_id){
                        for(var j = 0;j<this.state.type_infos.length;j++){
                   
                            if(this.state.type_infos[j].id==message.data.type_id){
                               // console.log(this.state.type_infos[j].type_name)
                                this.state.changed_type_name=this.state.type_infos[j].type_name
                            }
                        }
                        this.state.tableData[i].file_name=message.data.name;
                        this.state.tableData[i].edition=message.data.edition;
                        this.state.tableData[i].url=message.data.url;
                        this.state.tableData[i].type_name=this.state.changed_type_name;
                        this.state.tableData[i].time=this.timestamp2Time(message.data.time+"000", "-");
                    }
                }
                console.log(this.state.tableData)
              //  document.getElementById("search_file_type").value!=""?this.search_type(1,true,document.getElementById("search_file_type").value):this.searchFile(1,true)
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
         // change_file_name change_file_url change_file_edit change_select_file_type
         var name = document.getElementById("change_file_name").value,
             url = document.getElementById("change_file_url").value,
             edition = document.getElementById("change_file_edit").value,
        
             type_id = this.state.change_type_name==""?this.state.selected_type_id:this.state.change_type_name;
               getData(getRouter(EDIT_FILE), { session: sessionStorage.session,id:this.state.change_id, name:name,edition:edition,url:url,type_id:type_id }, cb, {});
             }
    del_file = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                document.getElementById("search_file_type").value!=""?this.search_type(1,true,document.getElementById("search_file_type").value):this.searchFile(1,true)
            //    for(var i=0;i<this.state.tableData.length;i++){
            //        //console.log(this.state.tableData[i].id)
            //     if(this.state.tableData[i].id==this.state.del_file_id){
            //         console.log(this.state.tableData)
            //         {this.state.tableData.remove(this.state.tableData[i])}
            //     }
            // }
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var id = this.state.del_file_id;
        getData(getRouter(DEL_FILE), { session: sessionStorage.session,id:id }, cb, {});

    }
    searchFile = (query_page = 1, reload = false) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.files;
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
            this.popUpNotice(NOTICE, 0, message.msg);
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
     

       
        getData(getRouter(SEARCH_FILE), {session:sessionStorage.session,name:this.state.search_file_name}, cb, {});
    }
    search_type =  (query_page = 1, reload = false,id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.files;
                this.handleUptateAllData(result);
               // this.handleUpdateData(this.state.currentPage);
                this.setState({
                    totalPage: getTotalPage(message.data.count, this.state.rowsPerPage),
                    count: message.data.count,
                    allData:message.data.files
                })
                this.state.count = message.data.count
                // this.setState({ students: message.data, tableData: message.data })
            } else {

            }
            this.popUpNotice(NOTICE, 0, message.msg);
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
       
        getData(getRouter(SEARCH_TYPE), {session:sessionStorage.session,type_id:id}, cb, {});
    }
    
    handleRequestClose = () => {
        this.setState({
          
            openaddFileDialog: false,
            openchangeFileDialog:false,
            opentypeDialog: false,
            opendownFileDialog:false,
            openhistoryFileDialog:false,
        })
    }
    addFileDialog = () => {
        return (
            <Dialog open={this.state.openaddFileDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    新增文件
            </DialogTitle>
                <DialogContent>
                    <div style={{width:"21rem"}}>
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"new_file_name"}
                           id="new_file_name"
                           onChange={(e)=>{
                            this.setState({
                                new_file_name:e.target.value
                            })
                      }}
                           label={Lang[window.Lang].pages.org.document.info.file_name}
                           fullWidth>
                     </TextField>
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"new_file_url"}
                           id="new_file_url"
                           onChange={(e)=>{
                            this.setState({
                                new_file_url:e.target.value
                            })
                      }}
                           label={Lang[window.Lang].pages.org.document.info.file_url}
                           fullWidth>
                     </TextField>  
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"new_file_edit"}
                           id="new_file_edit"
                           onChange={(e)=>{
                            this.setState({
                                new_file_edit:e.target.value
                            })
                      }}
                           label={Lang[window.Lang].pages.org.document.info.file_edit}
                           fullWidth>
                     </TextField>  
                     <p
                        style={{margin:0,marginTop:"0.1rem",fontSize:"12px",color:"rgba(0, 0, 0, 0.53)"}}
                            >文件类型</p>
                            
                            <select
                               id="new_select_file_type"
                                className="nyx-file-type-select"                             
                                onChange={(e) => {
                                    this.setState({
                                        new_select_file_type:e.target.value
                                        
                                    })
                                }}
                            >
                              <option selected>-类型-</option>
                               {this.state.type_infos.map((type_infos)=>{
                                return <option value={type_infos.id}  key={type_infos.id}>{type_infos.type_name}</option>
                            })}
                            </select>  
                     
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                               if(this.state.new_select_file_type==""){
                                this.popUpNotice(NOTICE, 0, "请选择文件类型");
                                return false;
                               }
                               console.log(this.state.new_select_file_type)
                               this.create_file();
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
    changeFileDialog = () => {
        return (
            <Dialog open={this.state.openchangeFileDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    修改文件
            </DialogTitle>
                <DialogContent>
                    <div style={{width:"21rem"}}>
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"change_file_name"}
                           id="change_file_name"
                         
                           defaultValue={this.state.selected["file_name"] ? this.state.selected["file_name"] : ""}
                           label={Lang[window.Lang].pages.org.document.info.file_name}
                           fullWidth>
                     </TextField>
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"change_file_url"}
                           id="change_file_url"
                           defaultValue={this.state.selected["url"] ? this.state.selected["url"] : ""}
                           label={Lang[window.Lang].pages.org.document.info.file_url}
                           fullWidth>
                     </TextField>  
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"change_file_edit"}
                           id="change_file_edit"
                           defaultValue={this.state.selected["edition"] ? this.state.selected["edition"] : ""}
                           label={Lang[window.Lang].pages.org.document.info.file_edit}
                           fullWidth>
                     </TextField>  
                     <p
                        style={{margin:0,marginTop:"0.1rem",fontSize:"12px",color:"rgba(0, 0, 0, 0.53)"}}
                            >文件类型</p>
                            
                            <select
                               id="change_select_file_type"
                               className="nyx-file-type-select"
                                defaultValue={this.state.selected_type_id}
                                onChange={(e) => {
                                    this.setState({
                                        change_type_name:e.target.value
                                    })
                                }}
                            >
                               {this.state.type_infos.map((type_infos)=>{
                                return <option  value={type_infos.id} key={type_infos.id}>{type_infos.type_name}</option>
                            })}
                            </select>  
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                 this.edit_file();
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
    downFileDialog = () => {
        return (
            <Dialog open={this.state.opendownFileDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    下载地址
            </DialogTitle>
                <DialogContent>
                    <div style={{width:"33rem"}}>
                    {this.state.down_file_url}
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        {/* <Button
                            onClick={() => {
                            //    if(this.state.new_select_file_type==""){
                            //        this.state.new_select_file_type=1
                            //    }
                                this.handleRequestClose()
                                
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button> */}
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
    historyFileDialog = () => {
        return (
            <Dialog  open={this.state.openhistoryFileDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    历史记录
            </DialogTitle>
                <DialogContent>
                  <div
                  style={{height:"300px"}}
                  >
                    <table
                    className="nyx-history-list"
                   id="idData"
                   >
                       <tr style={{textAlign:"center",maxHeight:"25px"}}>
                           <td  height={25} width={60}>序号</td>
                           <td width={100}>操作时间</td>
                           <td width={120}>操作人</td>
                           <td width={180}>操作信息</td>
                        </tr>
                       {this.goPage(this.state.pno,this.state.psize)}
                   </table>
                  </div>
                   
                  
                    <div className="nyx-change-page"
                      
                    >{this.change_page(1,10)}</div>
               
                </DialogContent>
                <DialogActions>
                    <div>
                        {/* <Button
                            onClick={() => {
                            //    if(this.state.new_select_file_type==""){
                            //        this.state.new_select_file_type=1
                            //    }
                                this.handleRequestClose()
                                
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button> */}
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
    typeDialog = () => {
        return (
            <Dialog open={this.state.opentypeDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle style={{width:"26rem"}}>
                {/* {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} */}
                    类型管理
                    <Button
                        raised 
                        color="primary"
                       
                        className="nyx-org-btn-md"
                        onClick={() => {
                            if(this.state.edit_type_name!=0){
                                this.popUpNotice(NOTICE, 0, "请保存正在编辑的文档");
                                return false
                            }
                         this.setState({
                            edit_type_name:-1
                         })
                        }}
                        style={{float:"right",marginTop:"-5px"}}
                    >
                        {"新增类型"}
                    </Button>
            </DialogTitle>
                <DialogContent>
                    
                    <table 
                       style={{textAlign:"center",marginTop:"10px"}}
                        >
                        <tr>
                            <td>编号</td><td style={{width:"215px"}}>类型名称</td><td></td><td></td>
                        </tr>
                        <tr style={{display:this.state.edit_type_name==-1?"":"none"}}>
                            <td></td>
                            <td style={{width:"215px"}}>
                            <TextField
                                    className="nyx-form-div"
                                    key={"change_file_edit"}
                                    id="change_file_edit"
                                    className="nyx-file-text"
                                    onChange={(e)=>{
                                        this.state.create_type_name=e.target.value
                                    }}
                                    label={Lang[window.Lang].pages.org.document.info.file_type}
                                    fullWidth>
                                </TextField>  
                            </td>
                            <td>
                            <Button
                                    color="primary"
                                    className="nyx-org-btn-sm"
                                    onClick={() => {
                                    

                                        this.create_type();
                                        this.state.allData = [];
                                        this.fresh();
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
                                            edit_type_name:0
                                        })
                                    }}
                                    style={{margin: 0,marginLeft:6,top:7}}
                                >
                                    {"取消"}
                                </Button>      
                                </td>
                        </tr>
                            {this.state.type_infos.map(type_infos => {
                              
                                return <tr>
                                <td title={type_infos.id}>{this.state.type_infos.indexOf(type_infos)+1}</td><td
                                 style={{width:"215px"}}
                                >
                              {/* <input
                              
                              value={type_infos.type_name}/> */}
                                 <TextField
                                 key={type_infos.type_name}
                                    id={"type_name"+type_infos.id}
                                    className="nyx-file-text"
                                    defaultValue={type_infos.type_name}
                                    disabled={this.state.edit_type_name==type_infos.id?false:true}
                                    // onChange={event => {
                                       
                                    //     type_infos.type_name= event.target.value
                                       
                                    // }}
                                />
                                 </td>
                                <td>
                                <Button
                                   // raised 
                                    color="primary"
                                    className="nyx-org-btn-sm"
                                    style={{margin: 0,marginLeft:20,display:this.state.edit_type_name==type_infos.id?"none":"block"}}
                                    onClick={() => {
                                     
                                      this.setState({
                                        edit_type_name:type_infos.id
                                      })
                                      console.log(type_infos.type_name)
                                    }}
                                        >
                                    {"编辑"}
                                    </Button>
                                    <Button
                                   // raised 
                                   style={{margin: 0,marginLeft:20,display:this.state.edit_type_name==type_infos.id?"block":"none"}}
                                    color="primary"
                                    className="nyx-org-btn-sm"
                                    onClick={() => {
                                        this.edit_type(type_infos.id,"type_name"+type_infos.id);
                                       
                                        this.setState({
                                            edit_type_name:0
                                        })
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
                                        this.del_type(type_infos.id);
                                        this.state.allData = [];
                                        this.fresh();
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
                                edit_type_name:0
                                })
                                this.handleRequestClose()
                                
                            }}
                        >
                            {Lang[window.Lang].pages.main.certain_button}
                        </Button> */}
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
            <div style={{ marginTop: 80, width: "100%",marginLeft:"3rem"}}>
                <div>
                <TextField
                        style={{top:"-0.5rem"}}
                        id="search_file_name"
                        label={"搜索文件名称"}
                        value={this.state.search_file_name}
                        onChange={event => {
                            this.setState({
                                search_file_name: event.target.value,
                            });
                        }}
                    />
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-sm nyx-document-btn"
                        onClick={() => {
                            this.searchFile(1,true);
                            document.getElementById("search_file_type").value="";
                            console.log(this.state.search_file_name)
                          //  this.queryStudents(1, true);
                        }}
                       
                    >
                        {"搜索"}
                    </Button>
                   
                    
                    <select
                        style={{marginLeft:"1rem",position:"relative",top:"-5px",height:"30px",borderColor:"#2196f3"}}
                        className="nyx-info-select-lg"
                        id={"search_file_type"}
                        onChange={(e) => {
                            this.setState({
                                search_file_name: "",
                            });
                           this.search_type(1,true,e.target.value);
                        }}
                    >
                        <option value="">{"-类型-"}</option>
                        {this.state.type_infos.map((type_infos)=>{
                            return <option value={type_infos.id} key={type_infos.id}>{type_infos.type_name}</option>
                        })}
                    </select>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md nyx-document-btn"
                        onClick={() => {
                            this.setState({ opentypeDialog: true });
                        }}
                    >
                        {"类型管理"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md nyx-document-btn"
                        onClick={() => {
                            this.setState({ openaddFileDialog: true,new_file_url:"",new_file_name:"",new_select_file_type:"" });
                            
                        }}
                    >
                        {"新增文件"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md nyx-document-btn"
                        onClick={() => {
                            this.note_list()
                            this.setState({ openhistoryFileDialog: true,pno:1});
                        }}
                        style={{float:"right"}}
                    >
                        {"历史记录"}
                    </Button>
                    
                </div>
                {/* <ReactDataGrid
                   
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
                                key: "file_name",
                                name: "文件名称",
                                width: 220,
                                resizable: true
                            },
                            {
                                key: "file_type",
                                name: "文件类型",
                                width: 200,
                                resizable: true
                            },
                            {
                                key: "file_edition",
                                name: "文件版本",
                                width: 100,
                                resizable: true
                            },
                            {
                                key: "file_time",
                                name: "更新时间",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "file_upload",
                                name: "上传人",
                                width: 120,
                                resizable: true
                            },
                            {
                                key: "file_download",
                                name: "",
                                width: 90,
                                resizable: true
                            },
                            {
                                key: "file_edit",
                                name: "",
                                width: 90,
                                resizable: true
                            },
                            {
                                key: "file_delete",
                                name: "",
                                width: 90,
                                resizable: true
                            }
                        ]
                    }
                    
                    rowGetter={(i) => {
                        if (i === -1) { return {} }
                        return {
                            id: this.state.tableData.indexOf(this.state.tableData[i]) + 1,
                            student_id: this.state.tableData[i].id,
                            file_name:  <div title={this.state.tableData[i].file_name}
                                            style={{textAlign:"left",paddingLeft:"0.5rem"}}>
                                            {this.state.tableData[i].file_name}
                                        </div>,
                            file_type: this.state.tableData[i].type_name,
                            file_edition: this.state.tableData[i].edition,
                            file_time: this.state.tableData[i].time,
                            file_upload: this.state.tableData[i].uploader,
                            file_download:<div
                            //raised
                            title="下载"
                            className="nyx-file-list-btn"
                            onClick={() => {
                                this.state.down_file_url=this.state.tableData[i].url
                                this.setState({ opendownFileDialog: true });
                                
                            }}
                        >
                            {"下载"}
                        </div>,
                        file_edit:<div
                                    title="编辑"
                                    className="nyx-file-list-btn"
                                    onClick={() => {
                                        this.state.selected = this.state.tableData[i];
                                        console.log(this.state.selected)
                                        this.setState({ openchangeFileDialog: true });
                                    //     this.state.change_file_name=this.state.tableData[i].file_name;
                                    // // this.state.change_type_name=this.state.tableData[i].type_name;
                                    //     this.state.change_edition=this.state.tableData[i].edition;
                                    //     this.state.change_url=this.state.tableData[i].url;
                                         this.state.change_id=this.state.tableData[i].id;
                                        {this.state.type_infos.map((type_infos)=>{
                                            if(this.state.tableData[i].type_name==type_infos.type_name){
                                                this.setState({
                                                    selected_type_id:type_infos.id
                                                })
                                            }
                                        })}
                                    }}
                                >
                        {"编辑"}
                    </div>,
                    file_delete:<div
                        className="nyx-file-list-btn"
                        title="删除"
                        onClick={() => {
                            this.state.del_file_id=this.state.tableData[i].id;
                            this.popUpNotice(ALERT, 0, "是否删除该文件？", [
                                () => {
                                this.del_file();
                                //this.state.allData = [];
                               // this.fresh();
                                    this.closeNotice();
                                }, () => {
                                    this.closeNotice();
                                }]);
                    }}
                >
                    {"删除"}
                </div>,

                            
                        }
                    }}
                    rowsCount={this.state.tableData.length}
                    // onRowClick={(rowIdx, row) => {
                    //     if (rowIdx !== -1) {
                    //         this.handleSelection(rowIdx, row);
                    //     }
                    // }}
                    renderColor={(idx) => { return "black" }}
                    maxHeight={900}
                  //  enableRowSelect={true}
                    minHeight={535}
                    rowHeight={30}
                    // rowSelection={{
                    //   //  showCheckbox: true,
                    //     onRowsSelected: this.onRowsSelected,
                    //     onRowsDeselected: this.onRowsDeselected,
                    //     // selectBy: {
                    //     //     keys: {
                    //     //         rowKey: 'id',
                    //     //         values: this.state.currentPageSelectedID
                    //     //     }
                    //     // }
                    // }}
                  
                /> */}
                 <div
                 style={{height:"355px"}}
                 ><table
                 className="nyx-file-list"
                >
                    <tr style={{textAlign:"center",maxHeight:"25px"}}>
                        <td  height={25} width={60}>序号</td>
                        <td width={140}>文件名称</td>
                        <td width={120}>文件类型</td>
                        <td width={80}>文件版本</td>
                        <td width={80}>更新时间</td>
                        <td width={80}>上传人</td>
                        <td width={80}></td>
                        <td width={80}></td>
                        <td width={80}></td>
                     </tr>
                    {this.filePage(this.state.filepno,this.state.filepsize)}
                </table>
                 </div>
                   
                  
                    <div
                      //style={{position:"absolute",bottom:"5rem"}}
                    >{this.change_file_page(1,10)}</div>
                {/* <Button
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
                </Button> */}
             
                
                {this.addFileDialog()}
                {this.changeFileDialog()}
                {this.typeDialog()}
                {this.downFileDialog()}
                {this.historyFileDialog()}
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