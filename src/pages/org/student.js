import React, { Component } from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse, getTotalPage, getAreas } from '../../utils/helpers';

import { DEL_TRAIN,CHOOSE_STUDENT, ALERT, NOTICE, SELECT_ALL_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO, } from '../../enum';


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
        rowsPerPage: 25,             //每页显示数据
        count: 0,
        search_input: "",
        search_area_id: null,
        search_course_id: null,
        search_is_inlist: null,
        search_institution: null,
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
        console.log(window)
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
                        <option value={"null"}>{"-中项或高项-"}</option>
                        <option value={1}>{"项目经理"}</option>
                        <option value={2}>{"高级项目经理"}</option>

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_is_inlist"}
                        defaultValue={this.state.search_is_inlist ? this.state.is_inlist : "1"}
                        disabled={this.state.search_is_inlist == -2 ? true : false}
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
                        <option value={3}>{"已通知"}</option>

                    </select>
                    <select
                        style={{marginLeft:"1rem"}}
                        className="nyx-info-select-lg"
                        id={"search_institution"}
                        defaultValue={this.state.search_institution ? this.state.institution : ""}
                        disabled={this.state.search_institution == -2 ? true : false}
                        onChange={(e) => {
                            this.state.search_institution =  e.target.value == "null"? null:e.target.value;
                            this.state.queryCondition.institution =  e.target.value == "null"? null:e.target.value;
                        }}
                    >
                        <option value={0}>{"-培训机构-"}</option>
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
                        color="primary"
                        onClick={() => {
                            this.state.queryCondition.company_name = document.getElementById("search_input").value;
                            this.state.selectedStudentID = [];
                            this.state.currentPageSelectedID = [];
                            this.queryStudents(1, true);
                        }}
                        style={{ margin: 10 }}
                    >
                        {"搜索"}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.state.queryCondition={ is_inlist:1,institution:0},
                            this.queryStudents(1, true);
                        }}
                        style={{ margin: 10 }}
                    >
                        {"取消筛选"}
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
                onClick={()=>{
                    this.checkTrain();
                }}
                >添加为该机构学员</Button>
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