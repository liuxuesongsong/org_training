import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse,getCourses, getTotalPage, getAreas } from '../../utils/helpers';

import { DEL_TRAIN,CHOOSE_STUDENT, ALERT, NOTICE, SELECT_ALL_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO, NOTE_LIST} from '../../enum';
import Drawer from 'material-ui/Drawer';


import ReactDataGrid from 'angon_react_data_grid';
import Code from '../../code';
import Lang from '../../language';
import CommonAlert from '../../components/CommonAlert';
class Student extends Component {
    state = {
        allData: [],
        tableData: [],
        allResitData: [],
        tableResitData: [],
        queryCondition: { is_inlist:1,institution:0},
        queryResitCondition: {},
        selectedStudentID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        resit_list:[],
        currentPage: 1,
        resitcurrentPage:1,
        totalPage: 1,
        resittotalPage:1,
        rowsPerPage: 25,             //每页显示数据
        pno:1,
        psize:10,
        count: 0,
        resitcount: 0,
        search_input: "",
        search_resit_area_id:null,
        search_resit_course_id:null,
        search_resit_is_inlist: null,
        search_resit_institution:null,
        search_area_id: null,
        search_course_id: null,
        search_is_inlist: 1,
        search_institution: 0,
        resitshowInfo: false,
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
    resitDrawer = (open) => () => {
        // if(!open){
            
        // }
        this.setState({
            resitshowInfo: open,
            right: open,
        });
     
    };

    cacheToState() {
        window.currentPage.queryStudents();
       // window.currentPage.queryResitStudents();
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
                console.log("学生列表")
                console.log(this.state.tableData)
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
    queryResitStudents = (query_page = 1, reload = false) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.resitinfos;
                this.handleUptateAllResitData(result);
                this.handleUpdateResitData(this.state.resitcurrentPage);
                this.setState({
                    resittotalPage: getTotalPage(message.data.count, this.state.rowsPerPage),
                    resitcount: message.data.count
                })
                console.log(this.state.tableResitData)
                this.state.resitcount = message.data.count
            } else {

            }
        }
        if (reload) {
            this.state.allResitData = [];
            this.state.tableResitData = [];
            this.resitcurrentPage = 1;
            this.setState({
                resittotalPage: 1,
                resitcount: 0,
               // is_inlist:1
                
            })
        }
        getData(getRouter("select_all_resits"), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 },this.state.queryResitCondition) }, cb, {});
    }


    handleUptateAllData = (newData) => {
        this.state.allData = this.state.allData.concat(newData);
        
    }
    handleUptateAllResitData = (newData) => {
        this.state.allResitData = this.state.allResitData.concat(newData);
        
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
    showResitPre = () => {
        this.handleUpdateResitData(this.state.resitcurrentPage - 1);
    }

    showResitNext = () => {
        if (this.state.onloading === true) {
            return;
        } else {
            this.handleUpdateResitData(this.state.resitcurrentPage + 1);
        }
    }
    handleUpdateResitData = (page) => {
        if (page <= 0) {
            page = 1;
        }
        if (page > this.state.resittotalPage) {
            page = this.state.resittotalPage;
        }
        this.state.resitcurrentPage = page;
        if (this.state.allResitData.length <= this.state.rowsPerPage * (page - 1) && this.state.allResitData.length < this.state.count) {
            // this.handleQueryRechargeCode(false, false);
            this.queryResitStudents((Math.floor((this.state.resitcurrentPage - 1) / 4) + 1));
        } else {
            var data = this.state.allResitData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.state.onloading = false;
            this.state.tableResitData = data;
            this.setState({ tableResitData: data });
           
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
    resit_list = () => {
        
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
               this.state.resit_list=message.data.resitinfos
               console.log(this.state.resit_list)
               //console.log(document.getElementById("idData").rows.length)
               
            }
           
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter("select_all_resits"), { session: sessionStorage.session, }, cb, {});

    }
    goPage= (pno,psize) =>{
        // {this.historyFileDialog()}
        var components = [];
        var num = this.state.resit_list.length;//表格所有行数(所有记录数)
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
       // console.log(startRow)

        this.state.resit_list.map((resit_list)=>{
      //  console.log(this.state.resit_list.indexOf(resit_list)+1>=startRow &&this.state.resit_list.indexOf(resit_list)+1<=endRow?"哈哈哈":"嘿嘿")
           
          components.push (<tr
                  style={{maxHeight:"25px",display:this.state.resit_list.indexOf(resit_list)+1>=startRow &&this.state.resit_list.indexOf(resit_list)+1<=endRow?"":"none"}}
                  key = {resit_list.id}> 
                  <td width={60} height={25} style={{textAlign:"center"}}>{this.state.resit_list.indexOf(resit_list)+1}</td>
                
                  <td title={resit_list.student_name} width={80}  style={{textAlign:"center"}}>{resit_list.student_name}</td>
                  <td title={resit_list.company_name} width={120} style={{textAlign:"center"}}>{resit_list.company_name}</td>
                  <td title={getCity(resit_list.area_id)} width={120} style={{textAlign:"center"}}>{getCity(resit_list.area_id)}</td>
                  <td title={getCourse(resit_list.course_id)} width={120} style={{textAlign:"center"}}>{getCourse(resit_list.course_id)}</td>
                  <td title={resit_list.train_class_id} width={80}  style={{textAlign:"center"}}>{resit_list.train_class_id}</td>
                  <td title={getInst(resit_list.train_institution)} width={120} style={{textAlign:"center"}}>{getInst(resit_list.train_institution)}</td>
                  <td title={resit_list.company_admin} width={80}  style={{textAlign:"center"}}>{resit_list.company_admin}</td>
                  <td title={resit_list.company_mobile} width={80}  style={{textAlign:"center"}}>{resit_list.company_mobile}</td>
                  <td title={resit_list.company_mail} width={80}  style={{textAlign:"center"}}>{resit_list.company_mail}</td>
                </tr>
        )});
         return components
        
     }
     change_page = (pno,psize)=>{
        var num = this.state.resit_list.length;//表格所有行数(所有记录数)
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
            // console.log("currentPage"+currentPage)
            // console.log("goPage("+(currentPage-1)+","+psize+")")
            currentPage>1?this.setState({pno:this.state.pno-1}):""
            currentPage>1?this.goPage(this.state.pno,"+psize+"):""
        }}
         >{"<上一页"}</a>
        <a 
            className="nyx-change-page-href" 
            onClick={()=>{
           // console.log("goPage("+(currentPage+1)+","+psize+")")
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
    render() {
        return (
            <div style={{ marginTop: 80, width: "100%" }}>
                <div>
                    
                    <select
                    style={{marginLeft:20}}
                        className="nyx-info-select-lg"
                        id="search_area_id"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        defaultValue={this.state.search_area_id === null ? "" : this.state.search_area_id}
                        onChange={(e) => {
                            console.log(e.target.value)
                            this.state.search_area_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.area_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >   
                        <option value={"null"}>{"-省市-"}</option>
                        {getAreas().map(area => {
                            return <option key={area.id} value={area.id}>{area.area_name}</option>
                        })}
                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_course_id"}
                        defaultValue={this.state.search_course_id ? this.state.search_course_id : ""}
                        disabled={this.state.search_course_id == -1 ? true : false}
                        onChange={(e) => {
                            this.state.search_course_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.course_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-课程名称-"}</option>
                        {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_is_inlist"}
                        defaultValue={1}
                        Value={this.state.search_is_inlist ? this.state.search_is_inlist : 0}
                        onChange={(e) => {
                            this.state.search_is_inlist = e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.is_inlist = e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-所有状态-"}</option>
                        <option value={-1}>{"待报名-导入"}</option>
                        <option value={0}>{"待报名"}</option>
                        <option value={1}>{"待安排"}</option>
                        <option value={2}>{"已安排"}</option>
                        <option value={3}>{"已确认"}</option>

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_institution"}
                        defaultValue={0}
                        Value={this.state.search_institution ? this.state.institution : 0}
                        onChange={(e) => {
                            this.state.search_institution =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.institution =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-培训机构-"}</option>
                        <option value={0}>{"无培训机构"}</option>
                        <option value={1}>{"中软培训"}</option>
                        <option value={2}>{"赛迪"}</option>
                        <option value={3}>{"赛宝"}</option>

                    </select>
                    <TextField
                        style={{top:"-0.5rem",left:"1rem"}}
                        id="search_input"
                        label={"搜索公司名称"}
                        value={this.state.search_input}
                        onChange={event => {
                            this.setState({
                                search_input: event.target.value,
                            });
                        }}
                    />
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-sm"
                        onClick={() => {
                            this.state.queryCondition.company_name = document.getElementById("search_input").value;
                            this.state.selectedStudentID = [];
                            this.state.currentPageSelectedID = [];
                            this.queryStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"搜索"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-md"
                        onClick={() => {
                            this.state.queryCondition={ is_inlist:1,institution:0},
                            this.queryStudents(1, true);
                            this.setState(
                                {search_is_inlist:1,search_institution:0},
                                ()=>{
                                    console.log(this.state.is_inlist)}
                            );
                        }}
                        style={{margin: 15,marginLeft:0,position:"relative",top:"-5px"}}
                    >
                        {"取消筛选"}
                    </Button>
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-lg"
                        onClick={() => {
                           
                            //this.state.allResitData=[];
                            //this.state.tableResitData=[];
                            this.resitDrawer(true)()//打开补考抽屉
                           // this.resit_list();//table
                          
                            this.queryResitStudents(1,true) //查看补考列表
                           // console.log(this.state.tableResitData)
                        }}
                        style={{float:"right",marginRight:"2rem",marginTop:"0.6rem",minWidth:"100px"}}
                    >
                        <i
                    className="glyphicon glyphicon-tasks"
                    style={{marginRight:"0.2rem",marginTop:"-2px"}}
                    ></i>{"补考列表"}
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
                {"已选择"+this.state.selectedStudentID.length + "人/"}

                共{this.state.count}人
                <Button
                 raised
                 color="primary"
                 className="nyx-org-btn-sm"
                // style={{ minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                onClick={() => {
                    var all_area;
                    var all_course;
                    var all_is_inlist;
                    var all_institution;
                    {this.state.search_area_id===null?all_area="所有地区":all_area=getCity(this.state.search_area_id)}
                    {this.state.search_course_id===null?all_course="所有级别":all_course=getCourse(this.state.search_course_id)}
                    var my_select_is_inlist=document.getElementById('search_is_inlist');
                    var is_inlist_index=my_select_is_inlist.selectedIndex;
                    var my_select_institution=document.getElementById('search_institution');
                    var institution_index=my_select_institution.selectedIndex;
                    //console.log(document.getElementById('search_is_inlist').value)
                    {my_select_is_inlist.options[is_inlist_index].text=="-报名状态-"?all_is_inlist="已报名":all_is_inlist=my_select_is_inlist.options[is_inlist_index].text}
                    {my_select_institution.options[institution_index].text=="-培训机构-"?all_institution="无培训机构":all_institution=my_select_institution.options[institution_index].text}
                    this.popUpNotice(ALERT, 0, "导出的学生信息:【"+all_area+"】【 "+all_institution+"】【 "+all_is_inlist+"】【 "+all_course+"】的人员", [
                        () => {
                            var href =  getRouter("export_csv").url+"&session=" + sessionStorage.session;
                            if(this.state.queryCondition.area_id!=undefined && this.state.queryCondition.area_id!=null){
                                 href = href+"&area_id=" + this.state.queryCondition.area_id;
                            }
                            if(this.state.queryCondition.is_inlist!=undefined && this.state.queryCondition.is_inlist!=null){
                             href = href+"&is_inlist=" + this.state.queryCondition.is_inlist;
                            }
                            if(this.state.queryCondition.institution!=undefined && this.state.queryCondition.institution!=null){
                                 href = href+"&institution=" + this.state.queryCondition.institution;
                            }
                            if(this.state.queryCondition.course_id!=undefined && this.state.queryCondition.course_id!=null){
                             href = href+"&course_id=" + this.state.queryCondition.course_id;
                            } 
                            var a = document.createElement('a');
                            a.href = href;
                         //    console.log(href);
                            a.click();  
                            this.closeNotice();
                        }, () => {
                            this.closeNotice();
                        }]);


                  
                }}
                >导出</Button>
                <Button
                raised
                color="primary"
                className="nyx-org-btn-lg"
                disabled={this.state.search_is_inlist == 1 ? false : true }
                onClick={()=>{
                    this.state.search_is_inlist == 1? this.checkTrain():"";
                }}
                >添加为该机构学员</Button>
                <Drawer
                       id="resit_drawer"
                       anchor="right"
                       open={this.state.right}
                       onRequestClose={this.resitDrawer(false)}
                   >
                    <div style={{width:"1000px",paddingLeft:"1rem",paddingTop:"2rem"}}> 

                    <select
                    style={{marginLeft:20}}
                        className="nyx-info-select-lg"
                        id="search_resit_area_id"
                        label={Lang[window.Lang].pages.org.clazz.info.area}
                        defaultValue={this.state.search_resit_area_id === null ? "" : this.state.search_resit_area_id}
                        onChange={(e) => {
                            console.log(e.target.value)
                            this.state.search_resit_area_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.area_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >   
                        <option value={"null"}>{"-省市-"}</option>
                        {getAreas().map(area => {
                            return <option key={area.id} value={area.id}>{area.area_name}</option>
                        })}
                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_resit_course_id"}
                        defaultValue={this.state.search_resit_course_id ? this.state.search_resit_course_id : ""}
                        disabled={this.state.search_resit_course_id == -1 ? true : false}
                        onChange={(e) => {
                            this.state.search_resit_course_id =  e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.course_id =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-课程名称-"}</option>
                        {getCourses().map(course => {
                                return <option key={course.id} value={course.id}>{course.course_name}</option>
                            })}

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_resit_is_inlist"}
                        //defaultValue={1}
                       // Value={this.state.search_resit_is_inlist ? this.state.search_resit_is_inlist : 0}
                        onChange={(e) => {
                            this.state.search_resit_is_inlist = e.target.value == "null"? null:e.target.value;
                            this.state.queryResitCondition.is_inlist = e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={"null"}>{"-所有状态-"}</option>
                      
                        <option value={1}>{"待安排"}</option>
                        <option value={2}>{"已安排"}</option>
                       

                    </select>
                   
                    <TextField
                        style={{top:"-0.5rem",left:"1rem"}}
                        id="search_resit_input"
                        label={"搜索公司名称"}
                        value={this.state.search_input}
                        onChange={event => {
                            this.setState({
                                search_input: event.target.value,
                            });
                        }}
                    />
                    <Button
                        raised 
                        color="primary"
                        className="nyx-org-btn-sm"
                        onClick={() => {
                            this.state.queryResitCondition.company_name = document.getElementById("search_resit_input").value;
                            this.queryResitStudents(1, true);
                        }}
                        style={{margin: 15,marginLeft:30,position:"relative",top:"-5px"}}
                    >
                        {"搜索"}
                    </Button>


                    <ReactDataGrid
                        
                     //style={{overflow:"hidden"}}
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
                               width: 70,
                               resizable: true
                           },
                           {
                               key: "company_name",
                               name: "公司全称",
                               width: 130,
                               resizable: true
                           },
                           {
                               key: "area_name",
                               name: "培训城市",
                               width: 80,
                               resizable: true
                           },
                           {
                               key: "course_name",
                               name: "课程",
                               width: 80,
                               resizable: true
                           },
                           {
                               key: "old_class_id",
                               name: "上次培训班级id",
                               width: 60,
                               resizable: true
                           },{
                               key: "institution",
                               name: "上次培训机构",
                               width: 100,
                               resizable: true
                           },{
                               key: "resit_state",
                               name: "补考状态",
                               width: 80,
                               resizable: true
                           },
                           {
                               key: "company_admin",
                               name: "联系人",
                               width: 100,
                               resizable: true
                           },
                           
                           {
                               key: "company_mobile",
                               name: "联系电话",
                               width: 100,
                               resizable: true
                           },
                           
                           {
                               key: "company_mail",
                               name: "联系邮箱",
                               width: 100,
                               resizable: true
                           }
                       ]
                   }
                   
                   rowGetter={(i) => {
                       if (i === -1) { return {} }
                       return {
                           id: this.state.allResitData.indexOf(this.state.tableResitData[i]) + 1,
                           student_id: this.state.tableResitData[i].id,
                           student_name: this.state.tableResitData[i].student_name,
                           company_name: this.state.tableResitData[i].company_name,
                           company_admin: this.state.tableResitData[i].company_admin,
                           company_mobile: this.state.tableResitData[i].company_mobile,
                           company_mail: this.state.tableResitData[i].company_mail,
                          resit_state:this.state.tableResitData[i].company_mail,
                          old_class_id: this.state.tableResitData[i].train_class_id,
                          institution: getInst(this.state.tableResitData[i].train_institution),
                           area_name: getCity(this.state.tableResitData[i].area_id),
                           course_name: getCourse(this.state.tableResitData[i].course_id),
                          
                       }
                   }}
                   rowsCount={this.state.tableResitData.length}
                   onRowClick={(rowIdx, row) => {
                       if (rowIdx !== -1) {
                           this.handleSelection(rowIdx, row);
                       }
                   }}
                   renderColor={(idx) => { return "black" }}
                   maxHeight={1000}
                   minHeight={535}
                   rowHeight={20}
                   
                   
               />
                {/* <table
                    className="nyx-history-list"
                   id="idData"
                   >
                       <tr style={{textAlign:"center",maxHeight:"25px"}}>
                           <td  height={25} width={60}>序号</td>
                           <td width={100}>姓名</td>
                           <td width={80}>公司全称</td>
                           <td width={120}>培训城市</td>
                           <td width={120}>培训课程</td>
                           <td width={120}>上次培训班级id</td>
                           <td width={120}>上次培训机构</td>
                           <td width={120}>联系人</td>
                           <td width={120}>联系电话</td>
                           <td width={120}>联系邮箱</td>
                        </tr>
                       {this.goPage(this.state.pno,this.state.psize)}
                   </table>
                  </div>
                   
                  
                    <div className="nyx-change-page"
                      
                    >{this.change_page(1,10)} */}
               <Button
                   color="primary"
                   onClick={() => {
                       this.showResitPre();
                   }}
                   style={{ margin: 10 }}
               >
                   {"上页"}
               </Button>
               {"第"+this.state.resitcurrentPage+"页"+ "/" + "共"+this.state.resittotalPage+"页"}
               <Button
                   color="primary"
                   onClick={() => {
                       this.showResitNext();
                   }}
                   style={{ margin: 10 }}
               >
                   {"下页"}
               </Button>
               <Button
                raised
                color="primary"
                className="nyx-org-btn-sm"
               // style={{ minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
               onClick={() => {
                   // var all_area;
                   // var all_course;
                   // var all_is_inlist;
                   // var all_institution;
                   // {this.state.search_area_id===null?all_area="所有地区":all_area=getCity(this.state.search_area_id)}
                   // {this.state.search_course_id===null?all_course="所有级别":all_course=getCourse(this.state.search_course_id)}
                   // var my_select_is_inlist=document.getElementById('search_is_inlist');
                   // var is_inlist_index=my_select_is_inlist.selectedIndex;
                   // var my_select_institution=document.getElementById('search_institution');
                   // var institution_index=my_select_institution.selectedIndex;
                   // //console.log(document.getElementById('search_is_inlist').value)
                   // {my_select_is_inlist.options[is_inlist_index].text=="-报名状态-"?all_is_inlist="已报名":all_is_inlist=my_select_is_inlist.options[is_inlist_index].text}
                   // {my_select_institution.options[institution_index].text=="-培训机构-"?all_institution="无培训机构":all_institution=my_select_institution.options[institution_index].text}
                   // this.popUpNotice(ALERT, 0, "导出的学生信息:【"+all_area+"】【 "+all_institution+"】【 "+all_is_inlist+"】【 "+all_course+"】的人员", [
                   //     () => {
                   //         var href =  getRouter("export_csv").url+"&session=" + sessionStorage.session;
                   //         if(this.state.queryCondition.area_id!=undefined && this.state.queryCondition.area_id!=null){
                   //              href = href+"&area_id=" + this.state.queryCondition.area_id;
                   //         }
                   //         if(this.state.queryCondition.is_inlist!=undefined && this.state.queryCondition.is_inlist!=null){
                   //          href = href+"&is_inlist=" + this.state.queryCondition.is_inlist;
                   //         }
                   //         if(this.state.queryCondition.institution!=undefined && this.state.queryCondition.institution!=null){
                   //              href = href+"&institution=" + this.state.queryCondition.institution;
                   //         }
                   //         if(this.state.queryCondition.course_id!=undefined && this.state.queryCondition.course_id!=null){
                   //          href = href+"&course_id=" + this.state.queryCondition.course_id;
                   //         } 
                   //         var a = document.createElement('a');
                   //         a.href = href;
                   //      //    console.log(href);
                   //         a.click();  
                   //         this.closeNotice();
                   //     }, () => {
                   //         this.closeNotice();
                   //     }]);


                 
               }}
               >导出</Button>
                   </div>
                   </Drawer>
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