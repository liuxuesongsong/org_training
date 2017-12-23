import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse, getTotalPage, getAreas } from '../../utils/helpers';

import { DEL_TRAIN,CHOOSE_STUDENT, ALERT, NOTICE, SELECT_ALL_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO, } from '../../enum';
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
class Student extends Component {
    state = {
        allData: [],
        tableData: [],
        queryCondition: { is_inlist:1,institution:0},
        selectedStudentID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        currentPage: 1,
       
        totalPage: 1,
        rowsPerPage: 20,             //每页显示数据
        count: 0,
        search_file_name: "",
        search_file_type: "",
        search_institution: 0,
        new_file_name:"",
        new_file_url:"",
        new_file_edit:"",
        new_select_file_type:"",
        change_select_file_type:"",

         // 提示状态
         alertOpen: false,
         alertType: ALERT,
         alertCode: Code.LOGIC_SUCCESS,
         alertContent: "",
         alertAction: [],
         openNewStudentDialog: false,
         openaddFileDialog: false,
         openchangeFileDialog:false,
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
    checkTrain = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.state.selectedStudentID = [];
                this.state.currentPageSelectedID = [];
                this.queryStudents(1, true)
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
           // clazz_id: id,
            student_ids: this.state.selectedStudentID
        }
        console.log(sessionStorage);
        getData(getRouter(CHOOSE_STUDENT), obj, cb, {});
    }
    handleRequestClose = () => {
        this.setState({
          
            openaddFileDialog: false,
            openchangeFileDialog:false
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
                           label={Lang[window.Lang].pages.org.document.info.file_name}
                           fullWidth>
                     </TextField>
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"new_file_url"}
                           id="new_file_url"
                           label={Lang[window.Lang].pages.org.document.info.file_url}
                           fullWidth>
                     </TextField>  
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"new_file_edit"}
                           id="new_file_edit"
                           label={Lang[window.Lang].pages.org.document.info.file_edit}
                           fullWidth>
                     </TextField>  
                     <p
                        style={{margin:0,marginTop:"1rem",color:"rgba(0, 0, 0, 0.53)"}}
                            >文件类型</p>
                            
                            <select
                               id="new_select_file_type"
                                style={{border:"none",borderBottom:"1px solid rgba(0, 0, 0, 0.53)",width:"20rem",padding:"0.5rem",paddingLeft:0}}                               
                                defaultValue={1}
                                onChange={(e) => {
                                    this.setState({
                                        new_select_file_type:e.target.value
                                    })
                                }}
                            >
                               
                                <option value="1">类型1</option>
                                <option value="2">类型2</option>
                            </select>  
                     
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                               if(this.state.new_select_file_type==""){
                                   this.state.new_select_file_type=1
                               }
                               console.log(this.state.new_select_file_type)
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
                           label={Lang[window.Lang].pages.org.document.info.file_name}
                           fullWidth>
                     </TextField>
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"change_file_url"}
                           id="change_file_url"
                           label={Lang[window.Lang].pages.org.document.info.file_url}
                           fullWidth>
                     </TextField>  
                     <TextField
                           style={{width:"20rem"}}
                           className="nyx-form-div"
                           key={"change_file_edit"}
                           id="change_file_edit"
                           label={Lang[window.Lang].pages.org.document.info.file_edit}
                           fullWidth>
                     </TextField>  
                     <p
                        style={{margin:0,marginTop:"1rem",color:"rgba(0, 0, 0, 0.53)"}}
                            >文件类型</p>
                            
                            <select
                               id="change_select_file_type"
                                style={{border:"none",borderBottom:"1px solid rgba(0, 0, 0, 0.53)",width:"20rem",padding:"0.5rem",paddingLeft:0}}                               
                               
                                defaultValue={this.state.change_select_file_type}
                                onChange={(e) => {
                                    this.setState({
                                        change_select_file_type:e.target.value
                                    })
                                }}
                            >
                               
                                <option value="1">类型1</option>
                                <option value="2">类型2</option>
                            </select>  
                     
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                               if(this.state.new_select_file_type==""){
                                   this.state.new_select_file_type=1
                               }
                               console.log(this.state.new_select_file_type)
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
                <div>
                <TextField
                        style={{top:"-0.5rem",left:"1rem"}}
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
                        className="nyx-org-btn-sm"
                        onClick={() => {
                            console.log(this.state.search_file_name)
                          //  this.queryStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"搜索"}
                    </Button>
                   
                    
                    <select
                        style={{marginLeft:"1rem",position:"relative",top:"-5px",height:"30px",borderColor:"#2196f3"}}
                        className="nyx-info-select-lg"
                        id={"search_file_type"}
                      //  defaultValue={null}
                      //  Value={this.state.search_file_type ? this.state.search_file_type : null}
                        onChange={(e) => {
                            this.state.search_file_type = e.target.value == "null"? null:e.target.value;
                         //   this.state.queryCondition.is_inlist = e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-类型-"}</option>
                        <option value={-1}>{"类型1"}</option>
                        <option value={0}>{"类型2"}</option>
                        <option value={1}>{"类型3"}</option>
                    </select>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                        onClick={() => {
                          //  console.log(this.state.search_file_name)
                          //  this.queryStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"类型管理"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                        onClick={() => {
                            this.setState({ openaddFileDialog: true });
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"新增文件"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                       
                        onClick={() => {
                          //  console.log(this.state.search_file_name)
                          //  this.queryStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px",float:"right"}}
                    >
                        {"历史记录"}
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
                                key: "file_name",
                                name: "文件名称",
                                width: 80,
                                resizable: true
                            },
                            {
                                key: "file_type",
                                name: "文件类型",
                                width: 100,
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
                                width: 100,
                                resizable: true
                            },
                            {
                                key: "file_edit",
                                name: "",
                                width: 100,
                                resizable: true
                            },
                            {
                                key: "file_delete",
                                name: "",
                                width: 100,
                                resizable: true
                            }
                        ]
                    }
                    
                    rowGetter={(i) => {
                        if (i === -1) { return {} }
                        return {
                            id: this.state.allData.indexOf(this.state.tableData[i]) + 1,
                            student_id: this.state.tableData[i].id,
                            file_name: this.state.tableData[i].student_name,
                            file_type: this.state.tableData[i].company_name,
                            file_edition: this.state.tableData[i].company_admin,
                            file_time: this.state.tableData[i].company_mobile,
                            file_upload: this.state.tableData[i].company_mail,
                            file_download:<Button
                            //raised
                            title="下载"
                            className="nyx-org-btn-sm"
                            color="primary"
                            style={{minHeight:"25px"}}
                            onClick={() => {
                                console.log("下载")
                            }}
                        >
                            {"下载"}
                        </Button>,
                        file_edit:<Button
                        //raised
                        title="编辑"
                        className="nyx-org-btn-sm"
                        color="primary"
                        style={{minHeight:"25px"}}
                        onClick={() => {
                            this.setState({ openchangeFileDialog: true });
                        }}
                    >
                        {"编辑"}
                    </Button>,
                    file_delete:<Button
                   // raised
                    className="nyx-org-btn-sm"
                    color="primary"
                    title="删除"
                    style={{minHeight:"25px"}}
                    onClick={() => {
                        this.popUpNotice(ALERT, 0, "是否删除该文件？", [
                            () => {
                                this.closeNotice();
                            }, () => {
                                this.closeNotice();
                            }]);
                    }}
                >
                    {"删除"}
                </Button>,

                            
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
             
                
                {this.addFileDialog()}
                {this.changeFileDialog()}
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