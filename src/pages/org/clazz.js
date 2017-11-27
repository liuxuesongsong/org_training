import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List, {
    ListItem, ListItemSecondaryAction, ListItemText,
    ListSubheader,
} from 'material-ui/List';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Drawer from 'material-ui/Drawer';
import { LabelRadio, RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse, getTotalPage, getAreas, getTimeString, downloadTimeString } from '../../utils/helpers';

import ReactDataGrid from 'angon_react_data_grid';

import Code from '../../code';
import Lang from '../../language';
import { DEL_TRAIN, UNCHOOSE_STUDENT, INST_QUERY, STATUS_AGREE_CLAZZ, STATUS_ARRANGED_DID, AGREE_ARRANGE, ALERT, NOTICE, SELECT_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLAZZ, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO, } from '../../enum';

import CommonAlert from '../../components/CommonAlert';

class Clazz extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
    };
    state = {
        clazzes: [],
        students: [],
        areas: [],
        allData: [],                //表格中所有数据
        tableData: [],              //表格内当前显示数据
        queryCondition: {},         //搜索条件
        selectedStudentID: [],      //所有选择的学生ID
        currentPageSelectedID: [],  //当前页面选择的序列ID
        clazzStudents: [],          //班级内的学生
        showInfo: false,
        showStudents: false,
        openNewClazzDialog: false,
        openEditClazzDialog: false,
        currentPage: 1,
        totalPage: 1,
        rowsPerPage: 25,             //每页显示数据
        count: 0,
        onloading: false,
        selected: {},
        search_input: "",
        search_area_id: null,
        search_course_id: null,
        my_id: 0,
        type: '',
        selectedStudentId: undefined,
        // 下载相关
        filename: "",

        // 提示状态
        alertOpen: false,
        alertType: ALERT,
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "",
        alertAction: [],
        openNewStudentDialog: false,
        alertType: "notice",
        alertContent: "登录成功",
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true;
        window.currentPage = this;
        this.fresh();
    }

    fresh = () => {
        initCache(this.cacheToState);
    }

    cacheToState() {
        window.currentPage.queryStudents();
        window.currentPage.state.areas = getAreas();
        var cb = (router, message, arg) => {
            window.currentPage.setState({
                my_id: message.data.myinfo.my_id

            })

            // all_students
        }
        getData(getRouter(INST_QUERY), { session: sessionStorage.session }, cb, {});
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
        //console.log(this.state.count)
        if (reload) {
            this.state.allData = [];
            this.state.tableData = [];
            this.currentPage = 1;
            this.setState({
                totalPage: 1,
                count: 0
            })
        }
        getData(getRouter(SELECT_STUDNETS), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
    }

    // 查询一个班级的学生
    queryClazzStudents = (id) => {
        var cb = (route, message, arg) => {

            if (message.code === Code.LOGIC_SUCCESS) {
                // console.log(message.data)
                arg.self.setState({ clazzStudents: message.data });
                arg.self.handleMakeDownloadData(message.data)
            }
        }
        getData(getRouter(SELECT_CLAZZ_STUDENTS), { session: sessionStorage.session, clazz_id: id }, cb, { self: this });
    }

    newClazz = (clazz) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                Object.assign({ id: message.data.clazz_id }, clazz)
                this.state.clazzes.push(clazz)
                this.setState({ clazzes: this.state.clazzes })
                this.fresh();
            }
            //console.log(message.msg)
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        var obj = {
            session: sessionStorage.session,
        }
        getData(getRouter(CREATE_CLAZZ), Object.assign(clazz, obj), cb, {});
    }

    createTrain = (id) => {
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
            clazz_id: id,
            student_ids: this.state.selectedStudentID
        }
        getData(getRouter(CREATE_TRAIN), obj, cb, {});
    }

    modifyClazz = (id, clazz) => {

        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.fresh();
                // this.setState({ clazzes: message.clazz })
            }
            this.popUpNotice(NOTICE, 0, message.msg);
        }
      //  console.log(clazz)
        getData(getRouter(EDIT_CLAZZ), { session: sessionStorage.session, id: id, data: clazz }, cb, {});

    }

    deleteClazz = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < this.state.clazzes.length; i++) {
                    if (this.state.clazzes[i].id === arg.id) {
                        this.state.clazzes.splice(i, 1);
                        this.setState({
                            clazzes: this.state.clazzes
                        })
                        break;
                    }
                }
                this.popUpNotice(NOTICE, 0, message.msg);
                this.fresh();
                // this.setState({ clazzes: this.state.clazzes })
            }
        }
        getData(getRouter(DELETE_CLAZZ), { session: sessionStorage.session, clazz_id: id }, cb, { id: id });
    }

    agreeAllStudent = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                for (var i = 0; i < this.state.clazzes.length; i++) {
                    if (this.state.clazzes[i].id === arg.id) {
                        this.state.clazzes.splice(i, 1);
                        this.setState({
                            clazzes: this.state.clazzes
                        })
                        break;
                    }
                }
                this.popUpNotice(NOTICE, 0, message.msg);
                this.fresh();
                // this.setState({ clazzes: this.state.clazzes })
            }
        }
        console.log(sessionStorage.session);
        console.log(id);
        getData(getRouter(STATUS_AGREE_CLAZZ), { session: sessionStorage.session, clazz_id: id }, cb, { id: id });
    }

    editClazzDialog = () => {
        return (
            <Dialog open={this.state.openEditClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    修改班级
            </DialogTitle>
                <DialogContent>
                    <div>
                        <TextField
                            className="nyx-form-div"
                            key={"class_head"}
                            id={"class_head"}
                            label={"班主任"}
                            value={this.state.selected["class_head"] === null ? "" : this.state.selected["class_head"]}
                            onChange={(event) => {
                                this.state.selected["class_head"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-form-div"
                            key={"teacher"}
                            id={"teacher"}
                            label={"老师"}
                            value={this.state.selected["teacher"] === null ? "" : this.state.selected["teacher"]}
                            onChange={(event) => {
                                this.state.selected["teacher"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-form-div"
                            key={"address"}
                            id={"address"}
                            label={"开班地址"}
                            value={this.state.selected["address"] === null ? "" : this.state.selected["address"]}
                            onChange={(event) => {
                                this.state.selected["address"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-form-div"
                            key={"train_starttime"}
                            id={"train_starttime"}
                            label={"开班时间"}
                            value={this.state.selected["train_starttime"] === null ? "" : this.state.selected["train_starttime"]}
                            onChange={(event) => {
                                this.state.selected["train_starttime"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-form-div"
                            key={"train_endtime"}
                            id={"train_endtime"}
                            label={"结束时间"}
                            value={this.state.selected["train_endtime"] === null ? "" : this.state.selected["train_endtime"]}
                            onChange={(event) => {
                                this.state.selected["train_endtime"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-form-div"
                            key={"class_code"}
                            id={"class_code"}
                            label={"班级编号"}
                            value={this.state.selected["class_code"] === null ? "" : this.state.selected["class_code"]}
                            onChange={(event) => {
                                this.state.selected["class_code"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                        <TextField
                            className="nyx-form-div"
                            key={"mobile"}
                            id={"mobile"}
                            label={"班主任电话"}
                            value={this.state.selected["mobile"] === null ? "" : this.state.selected["mobile"]}
                            onChange={(event) => {
                                this.state.selected["mobile"] = event.target.value
                                this.setState({
                                    selected: this.state.selected
                                });
                            }}>
                        </TextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                var class_head = (document.getElementById("class_head").value);
                                var teacher = (document.getElementById("teacher").value);
                                var address = (document.getElementById("address").value);
                                var train_starttime = Number(document.getElementById("train_starttime").value);
                                var train_endtime = Number(document.getElementById("train_endtime").value);
                                var class_code = document.getElementById("class_code").value;
                                var mobile = (document.getElementById("mobile").value);
                                this.modifyClazz(this.state.selected.id, {
                                    class_head: class_head,
                                    teacher: teacher,
                                    address: address,
                                    train_starttime: train_starttime,
                                    train_endtime: train_endtime,
                                    class_code: class_code,
                                    mobile:mobile
                                })
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


    newClazzDialog = () => {
        return (
            <Dialog open={this.state.openNewClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    +新增班级
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Typography type="headline" component="h3">
                            {Lang[window.Lang].pages.org.clazz.new}
                        </Typography>
                        <select
                            id="area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            {this.state.areas.map((area) => {
                                return <option key={area.id} value={area.id}>{area.area_name}</option>
                            })}
                        </select>
                        <select
                            id="course_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={""}
                        >
                            <option value={1}>{"中级"}</option>
                            <option value={2}>{"高级"}</option>
                        </select>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            onClick={() => {
                                var area_id = Number(document.getElementById("area_id").value);
                                var course_id = Number(document.getElementById("course_id").value);
                                if (isNaN(area_id)) {
                                    return;
                                }
                                if (isNaN(course_id)) {
                                    return
                                }
                                this.newClazz({
                                    area_id: area_id,
                                    course_id: course_id
                                })
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

    handleRequestClose = () => {
        this.setState({
            openNewClazzDialog: false,
            openEditClazzDialog: false
        })
    }

    handleDownloadFile = () => {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        var that = this;
        window.webkitStorageInfo.requestQuota(window.PERSISTENT, 1024 * 1024, function (grantedBytes) {
            window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
                fs.root.getFile(that.state.filename + '.csv', { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            if (fileWriter.length === 0) {
                                var bolb = new Blob(that.state.download_data, { type: "text/plain;charset=utf-8" });
                                fileWriter.write(bolb);
                            } else {
                                if (that.state.download_flag === false) {
                                }
                            }
                        };
                        fileWriter.onerror = function (e) {
                            //文件创建失败  
                        };
                        /**************************************************************/

                        var url = fileEntry.toURL();
                        document.getElementById("downloadData").href = url;
                        document.getElementById("downloadData").download = that.state.filename + ".csv"
                        that.state.download_flag = true;
                        fileWriter.truncate(0);

                    }, function () { });

                }, function () { });
            });
        }, function (e) {
        });
    }



    /**
     * 按班级建造下载数据
     */
    handleMakeDownloadData = (result) => {
        var downloadData = [new Uint8Array([0xEF, 0xBB, 0xBF])];
        var tableHeadKey = ['id', 'student_name', 'company_name', 'company_admin', 'mobile', 'mail', 'time'];
        var tableHeadTitle = ['学生id', '姓名', '公司', '管理员', '电话', '邮箱', '注册时间']
        var tableContent = [];
        var item = [];
        // console.log(result)
        tableContent.push(tableHeadTitle.join(','));
        for (var j = 0; j < result.length; j++) {
            item = [];
            for (var key = 0; key <= tableHeadKey.length; key++) {
                switch (tableHeadKey[key]) {
                    case 'time':
                        item.push(getTimeString(result[j][tableHeadKey[key]]));
                        break;
                    default:
                        // console.log(result[j][tableHeadKey[key]]);
                        item.push(result[j][tableHeadKey[key]]);
                        break;
                }
            }
            tableContent.push(item.join(','));
        }

        downloadData.push(tableContent.join('\n'));
        this.setState({
            // download_num: message.count,
            filename: downloadTimeString(Math.round(new Date().getTime())) + "_" + result.length,
            // showRechargeInfo: "download"
        })
        this.state.download_data = downloadData;
        this.state.filename = downloadTimeString(Math.round(new Date().getTime())) + "_" + result.length;
        this.handleDownloadFile();

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
            this.setState({ tableData: data });
            this.state.tableData = data;
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


    handleSelection = (index, row) => {
        if (this.state.selectedStudentID.indexOf(row.student_id) === -1) {
            this.state.selectedStudentID.push(row.student_id);
            this.state.currentPageSelectedID.push((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1)
        } else {
            this.state.selectedStudentID.splice(this.state.selectedStudentID.indexOf(row.student_id), 1);
            if (this.state.currentPageSelectedID.indexOf((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1) !== -1) {
                this.state.currentPageSelectedID.splice(this.state.currentPageSelectedID.indexOf((this.state.currentPage - 1) * this.state.rowsPerPage + index + 1), 1)
            }
        }
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedStudentID: this.state.selectedStudentID
        })
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

    toggleDrawer = (open) => () => {
        this.setState({
            right: open,
            showInfo: true
        });
    };

    getCondition = () => {
        var chips = []
        for (var k in this.state.queryCondition) {
            if (k === "area_id" && this.state.queryCondition.area_id != null) {
                chips.push(
                    <Chip className="nyx-chip"
                        label={"地区" + ":" + getCity(this.state.queryCondition[k])}
                        onRequestDelete={() => {
                            delete (this.state.queryCondition[k]);
                            this.setState({ queryCondition: this.state.queryCondition })
                        }}
                    />
                )
            } else if (k === "course_id" && this.state.queryCondition.course_id != null) {
                chips.push(
                    <Chip className="nyx-chip"
                        label={"课程" + ":" + getCourse(this.state.queryCondition[k])}
                        onRequestDelete={() => {
                            delete (this.state.queryCondition[k]);
                            this.setState({ queryCondition: this.state.queryCondition })
                        }}
                    />

                )
            } else if (k === "company_name" && this.state.queryCondition[k] !== "") {
                chips.push(
                    <Chip className="nyx-chip"
                        label={"公司" + ":" + this.state.queryCondition[k]}
                        onRequestDelete={() => {
                            delete (this.state.queryCondition[k]);
                            this.setState({ queryCondition: this.state.queryCondition })
                        }}
                    />
                )
            }
        }
        return chips
    }
    cancelTrain = (id) => {
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

        getData(getRouter(UNCHOOSE_STUDENT), obj, cb, {});
    }

    render() {
        return (
            <div style={{ marginTop: 80, width: "100%" }}>

                <div className="nyx-left-list" >
                    {this.state.clazzStudents.map(student => {
                        // console.log(student);
                        <Card
                            key={student.id}
                        >

                            <CardContent>
                                <Typography>
                                    {student.id}
                                </Typography>
                                <Typography component="h2">
                                    {student.student_name}
                                </Typography>
                                <Typography component="p">
                                    {student.company_name}
                                </Typography>
                                <Typography component="p">
                                    {student.company_admin}
                                </Typography>
                                <Typography type="body1">
                                    {student.mobile}
                                </Typography>
                                <Typography component="p">
                                    {student.mail}
                                </Typography>
                                <Typography component="p">
                                    {student.time}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    dense
                                    onClick={() => {

                                    }}>
                                    {"删除"}
                                </Button>
                            </CardActions>
                        </Card>
                    })}
                    <List className="nyx-clazz-list" subheader={<ListSubheader className="nyx-class-list-title" >{Lang[window.Lang].pages.org.clazz.clazz_list}</ListSubheader>}>
                        <ListSubheader>
                            <Button className="nyx-btn-circle"
                            style={{marginTop:"40px"}}
                                color="primary"
                                onClick={() => {
                                    this.setState({
                                        openNewClazzDialog: true
                                    });
                                }}
                            >
                                {Lang[window.Lang].pages.org.clazz.new}
                            </Button>
                        </ListSubheader>
                        {this.state.clazzes.map(
                            clazz =>
                                <div key={clazz.id} className="nyx-clazz-card">
                                    <div className="nyx-card-body">
                                        {clazz.id} - {getInst(clazz.ti_id)} - {getCity(clazz.area_id)} - {getCourse(clazz.course_id)} - {"(" + (clazz.num ? clazz.num : 0)+"/"+ (clazz.agree_num ? clazz.agree_num : 0) + ")"}
                                    </div>
                                    {
                                        this.state.stateSelected && this.state.selected.id === clazz.id ? <div>
                                            <CardActions className="nyx-card-action">
                                                <Button
                                                    className="nyx-clazz-card-button"
                                                    dense
                                                    onClick={() => {
                                                        this.setState({
                                                            queryCondition: {},
                                                            selected: {},
                                                            stateSelected: false
                                                        })
                                                        this.createTrain(clazz.id);
                                                    }}>
                                                    {"确定"}
                                                </Button>
                                                <Button
                                                    className="nyx-clazz-card-button"
                                                    dense
                                                    onClick={() => {
                                                        this.setState({
                                                            queryCondition: {},
                                                            selected: {},
                                                            stateSelected: false
                                                        })
                                                        this.state.queryCondition = {};
                                                        this.queryStudents(1, true);
                                                        return
                                                        this.state.selected = clazz;
                                                        this.deleteClazz(clazz.id);
                                                        this.popUpNotice(ALERT, 0, "删除该班级", [
                                                            () => {
                                                                this.removeStudent(clazz.id);
                                                                this.closeNotice();
                                                            }, () => {
                                                                this.closeNotice();
                                                            }]);
                                                    }}>
                                                    {"取消"}
                                                </Button>
                                            </CardActions>
                                        </div> :
                                            <div>
                                                <CardActions style={{ height: "45px" }} className="nyx-card-action">
                                                    <i
                                                        className="glyphicon glyphicon-pencil"
                                                        onClick={() => {
                                                            this.state.selected = clazz;
                                                            // this.state.showInfo = true;
                                                            this.setState({ openEditClazzDialog: true });
                                                            {/* this.toggleDrawer(true)() */ }
                                                        }}>
                                                    </i>
                                                    <i
                                                        className="glyphicon glyphicon-trash"
                                                        onClick={() => {
                                                            //  return
                                                            this.popUpNotice(ALERT, 0, "删除该班级", [
                                                                () => {
                                                                    // this.removeStudent(clazz.id);
                                                                    this.state.selected = clazz;
                                                                    this.deleteClazz(clazz.id);
                                                                    this.closeNotice();
                                                                }, () => {
                                                                    this.closeNotice();
                                                                }]);
                                                        }}>
                                                    </i>
                                                    <i
                                                        className="glyphicon glyphicon-search"
                                                        onClick={() => {
                                                            this.state.selected = clazz;
                                                            this.state.stateSelected = false;
                                                            this.state.showStudents = false;
                                                            this.queryClazzStudents(clazz.id);
                                                            this.toggleDrawer(true)()
                                                        }}>
                                                    </i>
                                                    <Button
                                                        raised
                                                        color="primary"
                                                        style={{ minWidth:"70px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                                                        onClick={() => {

                                                            this.state.selected = clazz;
                                                            this.state.showStudents = true;
                                                            this.state.queryCondition = {}
                                                            this.state.queryCondition.course_id = clazz.course_id;
                                                            this.state.queryCondition.area_id = clazz.area_id;
                                                            this.setState({
                                                                stateSelected: true
                                                            })
                                                            this.queryStudents(1, true);
                                                        }}>
                                                        {"添加学生"}
                                                    </Button>
                                                   
                                                    <Button
                                                   // data_id={clazz.num}
                                                   disabled={clazz.num-clazz.agree_num == 0 ? true : false}
                                                        raised
                                                        color="primary"
                                                        style={{ minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                                                        className="nyx-home-button"
                                                        onClick={() => {
                                                            
                                                            this.popUpNotice(ALERT, 0, "全部同意考试", [
                                                                () => {
                                                                    this.state.selected = clazz;
                                                                    this.agreeAllStudent(clazz.id);
                                                                    this.closeNotice();
                                                                }, () => {
                                                                    this.closeNotice();
                                                                }]);
                                                            // this.agreeAllStudent(); 
                                                        }}>
                                                        {"同意"}
                                                    </Button>
                                                </CardActions>
                                            </div>
                                    }
                                </div>
                        )}
                    </List>
                    <Drawer

                        anchor="right"
                        open={this.state.right}
                        onRequestClose={this.toggleDrawer(false)}
                    >
                        <div key="draw-class" style={{ width: "500px" }}>


                            <Button
                                color="primary"
                                id='downloadData'
                                href="#"
                                download
                                onClick={() => {

                                }}
                                style={{ margin: 10 }}
                            >
                                {"下载"}
                            </Button>
                            <Button
                                color="primary"
                                onClick={
                                    () => {
                                        this.popUpNotice(ALERT, 0, "导出本班级学生信息", [
                                            () => {
                                                // console.log(this.state.my_id);
                                                var href = getRouter("export_csv_classid").url + "&session=" + sessionStorage.session + "&clazz_id=" + this.state.selected.id;
                                                var a = document.createElement('a');
                                                a.href = href;
                                                // console.log(href);
                                                a.click();
                                                this.closeNotice();
                                            }, () => {
                                                this.closeNotice();
                                            }]);
                                    }
                                }
                            >
                                {"导出详细信息"}
                            </Button>
                            {this.state.clazzStudents.map(
                                student => {
                                    return <div className="nyx-clazz-student-name"

                                    >{student.id} - {student.student_name} - {student.company_name} - {"联系人" + student.company_admin} - {student.mobile}
                                        {/* {console.log(student.reg_status)} */}
                                       
                                        <Button
                                            color="primary"
                                           // key={class.id}
                                            raised
                                            disabled={student.reg_status == 2 ? true : false}
                                            style={{ float:"right",right:"1rem",minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                                            onClick={() => {
                                                var id = student.id;
                                               
                                                var cb = (router, message, arg) => {
                                                    console.log(message.msg)
                                                    // if (message.code === Code.LOGIC_SUCCESS) {
                                                    //     getStudent(arg.id).is_inlist = STATUS_ARRANGED_DID;
                                                    //     this.fresh();
                                                    // }
                                                    this.popUpNotice(NOTICE, 0, message.msg);
                                                }

                                                getData(getRouter(AGREE_ARRANGE), { session: sessionStorage.session, id: id }, cb, { id: id });
                                                //this.removeClassStudent(student.id)
                                            }}
                                        >{"同意"}</Button>
                                         <Button
                                            color="primary"
                                            raised
                                           // disabled={student.reg_status == 2 ? true : false}
                                           style={{ float:"right",right:"1rem",minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                                            onClick={() => {
                                                // console.log("123")
                                                this.removeClassStudent(student.id)
                                            }}
                                        >{"删除"}</Button>

                                    </div>

                                })}
                        </div>
                    </Drawer>

                </div>
                <div className="nyx-clazz-form">
                    <div className="nyx-right-top-search">

                        <TextField
                            style={{ top: "0rem", marginLeft: 30 }}
                            id="search_input"
                            label={"搜索公司名称"}
                            value={this.state.search_input}
                            onChange={event => {
                                this.setState({
                                    search_input: event.target.value,
                                });
                            }}
                        />
                        <select
                            style={{ marginLeft: "1rem",position:"relative",top:"0.5rem" }}
                            className="nyx-info-select-lg"
                            id="search_area_id"
                            label={Lang[window.Lang].pages.org.clazz.info.area}
                            defaultValue={this.state.search_area_id === null ? "" : this.state.search_area_id}
                            onChange={(e) => {
                                console.log(e.target.value)
                                this.state.search_area_id = e.target.value == "null" ? null : e.target.value;
                                this.state.queryCondition.area_id = e.target.value == "null" ? null : e.target.value;
                            }}
                        >
                            <option value={"null"}>{"-省市-"}</option>
                            {getAreas().map(area => {
                                return <option key={area.id} value={area.id}>{area.area_name}</option>
                            })}
                        </select>
                        <select
                            style={{ marginLeft: "1rem",position:"relative",top:"0.5rem" }}
                            className="nyx-info-select-lg"
                            id={"search_course_id"}
                            defaultValue={this.state.search_course_id === null ? "" : this.state.search_course_id}
                            disabled={this.state.search_course_id == -1 ? true : false}
                            onChange={(e) => {
                                this.state.search_course_id = e.target.value == "null" ? null : e.target.value;
                                this.state.queryCondition.course_id = e.target.value == "null" ? null : e.target.value;
                            }}
                        >
                            <option value={"null"}>{"-中项或高项-"}</option>
                            <option value={1}>{"项目经理"}</option>
                            <option value={2}>{"高级项目经理"}</option>

                        </select>
                        <Button
                            color="primary"
                            raised 
                            onClick={() => {
                                this.state.queryCondition.company_name = document.getElementById("search_input").value;
                                this.state.selectedStudentID = [];
                                this.state.currentPageSelectedID = [];
                                this.queryStudents(1, true);
                            }}
                            style={{ minWidth:"50px",minHeight:"30px",margin: 15,marginLeft:30,position:"relative",top:"5px",padding:"0.5rem" }}
                        >
                            {"搜索"}
                        </Button>

                        {this.getCondition()}
                    </div>
                    <div className="nyx-right-bottom-table" >
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
                                    course_name: getCourse(this.state.tableData[i].course_id)
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
                    </div>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.showPre();
                        }}
                        style={{ margin: 10 }}
                    >
                        {"上页"}
                    </Button>
                    {"第" + this.state.currentPage + "页" + "/" + "共" + this.state.totalPage + "页"}
                    <Button
                        color="primary"
                        onClick={() => {
                            this.showNext();
                        }}
                        style={{ margin: 10 }}
                    >
                        {"下页"}
                    </Button>

                    {"已选择" + this.state.selectedStudentID.length + "人/共" + this.state.count + "人"}
                    <Button
                    raised
                    color="primary"
                    style={{ minWidth:"50px",minHeight:"30px",margin: 0,marginLeft:5,padding:"0" }}
                        onClick={() => {
                            var all_area;
                            var all_course;
                            { this.state.search_area_id === null ? all_area = "所有地区" : all_area = getCity(this.state.search_area_id) }
                            { this.state.search_course_id === null ? all_course = "所有级别" : all_course = getCourse(this.state.search_course_id) }
                            this.popUpNotice(ALERT, 0, "导出的学生信息:【" + all_area + "】【 " + all_course + "】的人员", [
                                () => {
                                    // console.log(this.state.my_id);
                                    var href = getRouter("export_csv").url + "&session=" + sessionStorage.session + "&is_inlist=1&institution=" + this.state.my_id;
                                    if (this.state.queryCondition.area_id != undefined && this.state.queryCondition.area_id != null) {
                                        href = href + "&area_id=" + this.state.queryCondition.area_id;
                                    }
                                    if (this.state.queryCondition.course_id != undefined && this.state.queryCondition.course_id != null) {
                                        href = href + "&course_id=" + this.state.queryCondition.course_id;
                                    }
                                    var a = document.createElement('a');
                                    a.href = href;
                                    console.log(href);
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
                    style={{minWidth:"70px",minHeight:"30px",margin:"0.2rem",padding:0}}
                        onClick={() => {
                            this.cancelTrain();
                        }}
                    >退回学生</Button>
                    {this.state.showStudents === true ?
                        <Drawer
                            anchor="right"
                            open={this.state.right}
                            onRequestClose={this.toggleDrawer(false)}
                        >
                        </Drawer> : <div />}

                    {this.newClazzDialog()}

                    {this.editClazzDialog()}


                    <CommonAlert
                        show={this.state.alertOpen}
                        type={this.state.alertType}
                        code={this.state.alertCode}
                        content={this.state.alertContent}
                        action={this.state.alertAction}
                    >
                    </CommonAlert>

                </div>

            </div>
        )
    }

    removeClassStudent(id) {
        var cb = (route, message, arg) => {
            // if (message.code === Code.LOGIC_SUCCESS) {
            //     // this.setState({ clazzes: message.clazz })
            // }
            this.queryClazzStudents(this.state.selected.id);
            this.fresh();
            this.popUpNotice(NOTICE, 0, message.msg);
        }
        getData(getRouter(DEL_TRAIN), { session: sessionStorage.session, id: id }, cb, {});
    }

}
export default Clazz;