import React, { Component } from 'react';

import Button from 'material-ui/Button';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse, getTotalPage, getAreas } from '../../utils/helpers';

import { DEL_TRAIN, ALERT, NOTICE, SELECT_ALL_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO, } from '../../enum';


import ReactDataGrid from 'angon_react_data_grid';
import Code from '../../code';
import Lang from '../../language';

class Student extends Component {
    state = {
        allData: [],
        tableData: [],
        currentPage: 1,
        totalPage: 1,
        rowsPerPage: 25,             //每页显示数据
        count: 0,
    }

    componentDidMount() {
        window.currentPage = this;
        this.fresh();
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
                count: 0
            })
        }
        getData(getRouter("select_all_students"), { session: sessionStorage.session, query_condition: { page: query_page, page_size: 100 } }, cb, {});
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
    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: this.state.alertOpen });
    }
    render() {
        return (
            <div style={{ marginTop: 80, width: "100%" }}>
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
                                name: "单位全称",
                                width: 200,
                                resizable: true
                            },
                            {
                                key: "company_admin",
                                name: "联系人",
                                width: 80,
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
                                width: 120,
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
                    maxHeight={800}
                    enableRowSelect={true}
                    minHeight={500}
                    rowHeight={20}
                    rowSelection={{
                        showCheckbox: false,
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
                {this.state.currentPage + "/" + this.state.totalPage}
                <Button
                    color="primary"
                    onClick={() => {
                        this.showNext();
                    }}
                    style={{ margin: 10 }}
                >
                    {"下页"}
                </Button>
            </div>
        )
    }
}
export default Student;