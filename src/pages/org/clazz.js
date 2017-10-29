import React, { Component } from 'react';
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

import { initCache, getData, getRouter, getCache, getStudent, getCity, getInst, getCourse, getTotalPage } from '../../utils/helpers';

import ReactDataGrid from 'angon_react_data_grid';

import Code from '../../code';
import Lang from '../../language';
import { ALERT, NOTICE, SELECT_STUDNETS, INSERT_STUDENT, SELECT_CLAZZ_STUDENTS, CREATE_TRAIN, CREATE_CLAZZ, REMOVE_STUDENT, BASE_INFO, CLASS_INFOS, EDIT_CLASS, DELETE_CLAZZ, SELF_INFO, ADDEXP, DELEXP, DATA_TYPE_STUDENT, QUERY, CARD_TYPE_INFO } from '../../enum';

import CommonAlert from '../../components/CommonAlert';

class Clazz extends Component {
    state = {
        clazzes: [],
        students: [],
        areas: [],
        allData: [],
        queryCondition: {},
        tableData: [],
        selectedStudentID: [],
        currentPageSelectedID: [],
        clazzStudents: [],
        currentPage: 1,
        showInfo: false,
        showStudents: false,
        openNewClazzDialog: false,
        totalPage: 1,
        rowsPerPage: 5,
        count: 0,
        onloading: false,
        selected: {},
        search_input: "",


        // 提示状态
        alertOpen: false,
        alertType: "notice",
        alertCode: Code.LOGIC_SUCCESS,
        alertContent: "登录成功"
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
        window.currentPage.state.areas = getCache("areas");
        window.currentPage.state.clazzes = getCache("clazzes").sort((a, b) => {
            return b.id - a.id
        });
    }

    queryStudents = (query_page = 1, reload = false) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                var result = message.data.students;
                this.handleUptateAllData(result);
                this.handleUpdateData(this.state.currentPage);
                console.log(message.data.count)
                this.setState({
                    totalPage: getTotalPage(message.data.count, 5),
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
        getData(getRouter(SELECT_STUDNETS), { session: sessionStorage.session, query_condition: Object.assign({ page: query_page, page_size: 100 }, this.state.queryCondition) }, cb, {});
    }

    queryClazzStudents = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                this.setState({ clazzStudents: message.data.students })
            }
        }
        getData(getRouter(SELECT_CLAZZ_STUDENTS), { session: sessionStorage.session, clazz_id: id }, cb, {});
    }

    newClazzDialog = () => {
        return (
            <Dialog open={this.state.openNewClazzDialog} onRequestClose={this.handleRequestClose} >
                <DialogTitle>
                    新增班级
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
                                return <option id={area.id} value={area.id}>{area.area_name}</option>
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

    newClazz = (clazz) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                Object.assign({ id: message.data.clazz_id }, clazz)
                this.state.clazzes.push(clazz)
                this.setState({ clazzes: this.state.clazzes })
                this.fresh();
            }
        }
        var obj = {
            session: sessionStorage.session,
        }
        getData(getRouter(CREATE_CLAZZ), Object.assign(clazz, obj), cb, {});
    }

    createTrain = (id) => {
        var cb = (route, message, arg) => {
            if (message.code === Code.LOGIC_SUCCESS) {
                console.log(message.data.train_id)
                this.state.selectedStudentID = [];
                this.state.currentPageSelectedID = [];
                this.queryStudents(1, true)
            }
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
                this.setState({ clazzes: message.clazz })
            }
        }
        getData(getRouter(EDIT_CLASS), { session: sessionStorage.session, id: id, "class": clazz }, cb, {});

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
                this.fresh();
                // this.setState({ clazzes: this.state.clazzes })
            }
        }
        getData(getRouter(DELETE_CLAZZ), { session: sessionStorage.session, clazz_id: id }, cb, { id: id });
    }

    handleRequestClose = () => {
        this.setState({
            openNewClazzDialog: false
        })
    }

    freshStudents = () => {

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

    handleDownloadRechargeCode = (search_selected = true) => {
        var cb = (id, message, arg) => {
            if (id != DOWNLOAD_RECHARGE_CODE_S2C) {
                return;
            }
            var self = arg[0];
            // var default_file_name = arg[1];
            var result = [];
            if (message.code === LOGIC_SUCCESS) {
                var downloadData = [new Uint8Array([0xEF, 0xBB, 0xBF])];
                result = message.rci;
                // var tableHeadEn = ['id', 'recharge_code', 'admin', 'game_coin', 'status', 'player', 'gen_time', 'use_time'];
                var tableContent = [];
                var item = [];
                var title = []
                for (let key in result[0]) {
                    switch (key) {
                        case 'id':
                            item.push(String(parseInt(result[0][key])));
                            title.push("充值码id")
                            break;
                        case 'game_coin':
                            item.push(String(result[0][key]));
                            title.push("充值金额");
                            break;
                        case 'gen_time':
                            item.push(Util.time.getTimeString(result[0][key]));
                            title.push("生成时间");
                            break;
                        case 'use_time':
                            item.push(result[0][key] === 0 ? '--' : Util.time.getTimeString(result[0][key]));
                            title.push("使用时间");
                            break;
                        case 'status':
                            // item.push(result[0][key]);
                            item.push(Lang[window.Lang].Setting.rechargeCodeStatus[result[0][key]]);
                            title.push("状态");
                            break;
                        case 'admin':
                            item.push(result[0][key]);
                            title.push("管理员");
                            break;
                        case 'player':
                            item.push(result[0][key] == 0 ? "--" : result[0][key]);
                            title.push("使用玩家");
                            break;
                        case 'recharge_code':
                            item.push(result[0][key]);
                            title.push("充值码");
                            break;
                        default:
                            break;
                    }
                }
                tableContent.push(title.join(','));
                tableContent.push(item.join(','));
                for (var j = 1; j < result.length; j++) {
                    item = [];

                    for (let key in result[j]) {
                        switch (key) {
                            case 'id':
                                item.push(String(parseInt(result[j][key])));
                                break;
                            case 'game_coin':
                                item.push(String(result[j][key]));
                                break;
                            case 'gen_time':
                                item.push(Util.time.getTimeString(result[j][key]));
                                break;
                            case 'use_time':
                                item.push(result[j][key] === 0 ? '--' : Util.time.getTimeString(result[j][key]));
                                break;
                            case 'status':
                                // item.push(result[j][key]);
                                item.push(Lang[window.Lang].Setting.rechargeCodeStatus[result[j][key]]);
                                break;
                            case 'admin':
                                item.push(result[j][key]);
                                break;
                            case 'player':
                                item.push(result[j][key] == 0 ? "--" : result[j][key]);
                                break;
                            case 'recharge_code':
                                item.push(result[j][key]);
                                break;
                            default:
                                break;
                        }
                    }
                    tableContent.push(item.join(','));
                }

                downloadData.push(tableContent.join('\n'));
                self.setState({
                    download_num: message.count,
                    filename: Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + message.count,
                    showRechargeInfo: "download"
                })
                self.state.filename = Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + message.count;
                self.state.download_data = downloadData;
                self.handleDownloadFile();
            } else {
                self.popUpNotice('notice', 0, "没有满足搜索条件的充值码");
            }
            // 
        }

        if (search_selected === true && this.state.selectedStudentID.length > 0) {
            var obj = {
                search: JSON.stringify({ id: this.state.selectedStudentID }),
                sort: JSON.stringify(this.state.sort)
            }
            MsgEmitter.emit(DOWNLOAD_RECHARGE_CODE_C2S, obj, cb, [this]);
        } else if (search_selected === false) {
            var obj = {
                search: this.makeSearchObj(),
                sort: JSON.stringify(this.state.sort)
            }
            MsgEmitter.emit(DOWNLOAD_RECHARGE_CODE_C2S, obj, cb, [this]);
        } else {
            var obj = {
                search: this.makeSearchObj(),
                sort: JSON.stringify(this.state.sort)
            }
            MsgEmitter.emit(DOWNLOAD_RECHARGE_CODE_C2S, obj, cb, [this]);
        }
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
            this.queryStudents((Math.floor((this.state.currentPage - 1) / 20) + 1));
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
            console.log(this.state.currentPage);
            this.handleUpdateData(this.state.currentPage + 1);
        }
    }


    onRowsDeselected = (rowArray) => {
        var tranform = new Set(this.state.selectedStudentID);
        this.state.selectedStudentID = [...tranform];
        console.log(rowArray);
        console.log(this.state.currentPageSelectedID);
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
        console.log(this.state.currentPageSelectedID)
        console.log(this.state.selectedStudentID)
        this.setState({
            currentPageSelectedID: this.state.currentPageSelectedID,
            selectedStudentID: this.state.selectedStudentID
        })
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    toggleDrawer = (open) => () => {
        this.setState({
            right: open,
        });
    };

    handleRequestDelete = () => {

    }

    getCondition = () => {
        var chips = []
        for (var k in this.state.queryCondition) {
            if (k === "area_id") {
                chips.push(
                    <Chip
                        label={"地区" + ":" + getCity(this.state.queryCondition[k])}
                        onRequestDelete={() => { this.state.queryCondition.delete(k) }}
                    />
                )
            } else if (k === "course_id") {
                chips.push(
                    <Chip
                        label={"课程" + ":" + getCourse(this.state.queryCondition[k])}
                        onRequestDelete={() => { this.state.queryCondition.delete(k) }}
                    />
                )
            } else if (k === "company_name") {
                chips.push(
                    <Chip
                        label={"公司" + ":" + this.state.queryCondition[k]}
                        onRequestDelete={() => { this.state.queryCondition.delete(k) }}
                    />
                )
            }
        }
        return chips
    }

    render() {
        return (
        <div style={{ marginTop: 80, width: "100%" }}>
            <div className="nyx-left-list" >
                
                <div className="nyx-left-top-list">
                    <List subheader={<ListSubheader >{Lang[window.Lang].pages.com.students.list_title}</ListSubheader>}>
                        <ListSubheader>
                            <Button
                                color="primary"
                                onClick={() => {
                                    this.setState({
                                        openNewClazzDialog: true
                                    });
                                }}
                                style={{ margin: 10 }}
                            >
                                {Lang[window.Lang].pages.org.clazz.new}
                            </Button>
                        </ListSubheader>
                        {this.state.clazzes.map(clazz =>
                            <Card
                                key={clazz.id} className="nyx-card"
                            >
                                <div className="nyx-card-body">
                                    <CardContent className="nyx-card-first-info">
                                        <div className={'nyx-card-name'}>
                                            {getInst(clazz.ti_id)}
                                        </div>
                                        <div className={'nyx-card-name'}>
                                            {getCity(clazz.area_id)}
                                        </div>
                                        <div className={'nyx-card-name'}>
                                            {getCourse(clazz.course_id)}
                                        </div>
                                    </CardContent>
                                    {/* <CardContent className="nyx-card-second-info">
                                        <div className={'nyx-card-value'}>
                                            {clazz.train_starttime}
                                        </div>
                                        <div className={'nyx-card-value'}>
                                            {clazz.class_head}
                                        </div>
                                        <div className={'nyx-card-value'}>
                                            {clazz.address}
                                        </div>
                                    </CardContent> */}
                                </div>
                                {
                                    this.state.stateSelected && this.state.selected.id === clazz.id ? <div>
                                        <CardActions className="nyx-card-action">
                                            <Button
                                                className="nyx-card-button"
                                                dense
                                                onClick={() => {
                                                    this.setState({
                                                        queryCondition: {},
                                                        selected: {},
                                                        stateSelected: false
                                                    })
                                                    console.log(clazz.id)
                                                    this.createTrain(clazz.id);
                                                }}>
                                                {"确定"}
                                            </Button>
                                            <Button
                                                className="nyx-card-button"
                                                dense
                                                onClick={() => {
                                                    this.setState({
                                                        queryCondition: {},
                                                        selected: {},
                                                        stateSelected: false
                                                    })
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
                                            <CardActions  className="nyx-card-action">
                                                <i
                                                className="glyphicon glyphicon-pencil"
                                                    dense
                                                    onClick={() => {
                                                        this.state.selected = clazz;
                                                        this.state.showInfo = true;
                                                        {/* this.toggleDrawer(true)() */ }
                                                    }}>
                                                    {Lang[window.Lang].pages.com.card.modify}
                                                </i>
                                                <i
                                                className="glyphicon glyphicon-trash" 
                                                    dense
                                                    onClick={() => {
                                                        this.state.selected = clazz;
                                                        this.deleteClazz(clazz.id);
                                                        return
                                                        this.popUpNotice(ALERT, 0, "删除该班级", [
                                                            () => {
                                                                this.removeStudent(clazz.id);
                                                                this.closeNotice();
                                                            }, () => {
                                                                this.closeNotice();
                                                            }]);
                                                    }}>
                                                    {Lang[window.Lang].pages.com.card.remove}
                                                </i>
                                                <i
                                                className="glyphicon glyphicon-search"
                                                    dense
                                                    onClick={() => {
                                                        console.log("123")
                                                        this.queryClazzStudents(clazz.id);
                                                        // this.state.selected = clazz;
                                                        // this.state.showInfo = true;
                                                        {/* this.toggleDrawer(true)() */ }
                                                    }}>
                                                    {"查看学生"}
                                                </i>
                                                <Button
                                                className="nyx-card-button"
                                                    dense
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
                                            </CardActions>
                                        </div>
                                }
                            </Card>
                        )}
                        {this.state.clazzStudents.map(student => {
                            <Card
                                key={clazz.id}
                                style={{ display: 'flex', }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <CardContent>
                                        <Typography>
                                            {student.id}
                                        </Typography>
                                        <Typography component="h2">
                                            {student.name}
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
                                </div>
                                <div>
                                    <CardActions>
                                        <Button
                                            dense
                                            onClick={() => {

                                            }}>
                                            {"删除"}
                                        </Button>
                                    </CardActions>
                                </div>
                            </Card>
                        })}
                    </List>
                
                
                </div>

                <div className="nyx-left-bottom-paper">

                </div>
            </div>
            <div className="nyx-right-form">
                <div className="nyx-right-top-search">
                <TextField
                    id="search_input"
                    label={"搜索"}
                    value={this.state.search_input}
                    onChange={event => {
                        this.setState({
                            search_input: event.target.value,
                        });
                    }}
                    fullWidth
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
                {this.getCondition()}
                </div>
                <div className="nyx-right-bottom-table">
                    <ReactDataGrid
                        rowKey="id"
                        columns={
                            [
                                {
                                    key: "id",
                                    name: "#",
                                    width: 100,
                                    resizable: true
                                },
                                {
                                    key: "student_name",
                                    name: "项目经理",
                                    width: 100,
                                    resizable: true
                                },
                                {
                                    key: "company_name",
                                    name: "公司",
                                    width: 100,
                                    resizable: true
                                },
                                {
                                    key: "company_admin",
                                    name: "联系人",
                                    width: 100,
                                    resizable: true
                                },
                                {
                                    key: "mobile",
                                    name: "电话",
                                    width: 100,
                                    resizable: true
                                },
                                {
                                    key: "mail",
                                    name: "邮箱",
                                    width: 100,
                                    resizable: true
                                },
                                {
                                    key: "area_name",
                                    name: "区域",
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
                                mobile: this.state.tableData[i].mobile,
                                mail: this.state.tableData[i].mail,
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
                        maxHeight={330}
                        enableRowSelect={true}
                        minHeight={440}
                        rowHeight={40}
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

                {this.state.selectedStudentID.length + "/" + this.state.count}

                {this.state.showStudents === true ?
                    <Drawer
                        anchor="right"
                        open={this.state.right}
                        onRequestClose={this.toggleDrawer(false)}
                    >
                    </Drawer> : <div />}
                {this.newClazzDialog()}
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

}
export default Clazz;