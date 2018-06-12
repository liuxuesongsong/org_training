/**
 * APP类型
 */
export const APP_TYPE_UNLOGIN = 0; // 未登录
export const APP_TYPE_COMPANY = 1; // 公司
export const APP_TYPE_ORANIZATION = 2; // 培训机构
/**
 * Alert 類型
 */
export const WARNING = 'warning';
export const ALERT = 'alert';
export const NOTICE = 'notice';
/**
 * 数据类型枚举
 */
export const DATA_TYPE_ALL = 'all'; // 全部数据
export const DATA_TYPE_STUDENT = 'students'; // 学生数据
export const DATA_TYPE_RESITS = 'resits'; // 补考学生数据
export const DATA_TYPE_MESSAGE = 'messages'; //通知消息
export const DATA_TYPE_CANCEL_STUDENT = 'cancels'; // 学生数据
export const DATA_TYPE_CLAZZ = 'clazzes'; // 班级数据
export const DATA_TYPE_AREA = 'areas';
export const DATA_TYPE_COURSE = 'courses';
export const DATA_TYPE_CLASSTYPE = 'classtype';
export const DATA_TYPE_TI = 'ti';
export const DATA_TYPE_BASE = 'base'; // 基础数据
export const DATA_TYPE_FINANCE = 'finance'; // 财政数据
export const DATA_TYPE_EXPRESS = 'express'; // 邮寄数据
export const DATA_TYPE_ADMIN = 'admin'; // 管理员数据

/**
 * 状态枚举
 */

export const STATUS_AGREE_CLAZZ = 'agree_clazz';
export const BATCH_AGREE_STUDENT = 'batch_agree_student';
export const BATCH_DELETE_STUDENT = 'batch_delete_train';

export const STATUS_ENROLLED = 'enrolled'; // 报名
export const STATUS_ARRANGED = 'arranged';
export const STATUS_AGREED = 'agreed';
export const STATUS_PASSED = 'passed';
/**
 * 状态参数
 */
export const STATUS_RETRY_TIMES = 'retry_times'; // 重考次数
export const STATUS_EXAM_RESULT_SCORE = 'score'; // 考试成绩

/**
 * 报名状态枚举
 * 设置STATUS_ENROLLED_DID 同时 STATUS_ARRANGED 为 UNDO
 */
export const STATUS_FK_UNDO = -1;//特殊的导入学生
export const STATUS_ENROLLED_UNDO = 0; // 未报名
export const STATUS_ENROLLED_DID = 1; // 已经报名
export const STATUS_ARRANGED_DID = 2;
// export const STATUS_ENROLLED_REDO = 2;//重报名

/**
 * 课程安排状态枚举
 * 设置STATUS_ARRANGED_DOING 同时 STATUS_AGREED 为 UNDO
 */
export const STATUS_ARRANGED_UNDO = 0; // 未安排
export const STATUS_ARRANGED_DOING = 1; // 已安排
// export const STATUS_ARRANGED_DID = 2;//已回访 电话询问能否上课

/**
 * 电话回访结果
 */
export const STATUS_AGREED_UNDO = 0;
export const STATUS_AGREED_AGREE = 1;
export const STATUS_AGREED_REFUSED = 2;
export const STATUS_AGREED_KNOW = 3;

/**
 * 考试安排枚举
 */
export const STATUS_EXAMING_CANTDO = 0; // 培训未结束 不能参加考试
export const STATUS_EXAMING_UNDO = 1; // 培训结束 未安排考试
export const STATUS_EXAMING_DOING = 2; // 已经安排考试
export const STATUS_EXAMING_DID = 3; // 考试已结束

/**
 * 考试结果枚举
 */
export const STATUS_PASSED_UNDO = 0; // 考试未通过
export const STATUS_PASSED_DID = 1; // 考试通过
export const STATUS_PASSED_REDO = 2; // 等待重新考试
export const STATUS_PASSED_CANTDO = 3; // 补考失败重安排上课

/**
 * 路由枚举
 */
//export const LOGIN = 'login';
export const CHECK_CODE = 'creat_checkcode';
export const CREATE_FILE = 'create_file';
export const EDIT_FILE = 'edit_file';
export const NOTE_LIST = 'note_list';

export const CREATE_TYPE = 'create_type';
export const EDIT_TYPE = 'edit_type';
export const TYPE_INFOS = 'type_infos';
export const DEL_TYPE = 'del_type';
export const REGISTER_COMPANY = 'register';
//export const CHECK_AVAILABLE = 'available';
//export const UPDATE_COMPANY = 'update_company';
export const UPDATE_ADMIN = 'update_admin';
//export const EDITCOMPANYNAME = 'edit_company_name';
export const EDIT_PASSWORD = 'edit_password';
//export const  APPLY_CANCEL= 'apply_cancel';
//export const  RECALL_CANCEL= 'recall_cancel';
export const  CANCEL_LIST= 'cancel_list';
export const  AGREE_CANCEL= 'agree_cancel';
//export const  BE_READ= 'be_read';
export const  BATCH_AGREE_CANCEL= 'batch_agree_cancel';
//export const INSERT_STUDENT = 'insert_student';
//export const UPDATE_STUDENT = 'update_student';
//export const REMOVE_STUDENT = 'remove_student';
//export const CLASS_INFO = 'class_info';
//export const ENROLL_STUDENT = 'enroll_student';
//export const UNROLL_STUDENT = 'unroll_student';
export const AGREE_ARRANGE = 'agree_student';
export const STUDENT_INFOS = 'studentsInfos';
export const DEL_TRAIN = 'del_train';
export const LOGOUT = 'logout';
export const QUERY = 'query';
//export const SEND_CODE='send_code';
//export const CHECK_CODE_PASSWORD='check_code';
//export const  REGISTER_CHECKCODE='register_checkcode';
//export const REGISTER_NEW = 'register_new';
export const SEARCH_COMPANYINFO = 'search_companyinfo';
export const RESET_PASSWORD = 'reset_password';
export const CLASS_COUNT_TIME = 'class_count_time';
export const INST_QUERY = 'inst_query';
export const ORG_LOGIN = 'login';
export const LAST_COUNT = 'last_count';
export const UPDATE_COUNT = 'update_count';
export const CREATE_CLAZZ = 'create_clazz';
export const DELETE_CLAZZ = 'delete_clazz';
export const CREATE_TRAIN = 'create_train';
export const CHOOSE_STUDENT = 'choose_student';
export const UNCHOOSE_STUDENT = 'unchoose_student';
export const EDIT_CLAZZ = 'edit_clazz';
export const SELECT_CLAZZ_STUDENTS = 'select_clazz_students'; // 查看班级学生
export const SELECT_STUDNETS = 'select_students'; // 查看待报名学生
export const SELECT_STUDNETS_BY = 'select_students_by';
export const RESIT_REG = 'resit_reg';//补考报名数组
export const RECALL_RESIT = 'recall_resit';//取消补考报名
export const RESIT_CLASSINFO = 'resit_classinfo';//查看补考人员班级
export const SELECT_RESITS = 'select_resits';//选择补考人员
export const CREATE_RESIT = 'create_resit';//报名补考人员
export const DEL_RESIT = 'del_resit';//删除补考人员
export const BATCH_DEL_RESIT = 'batch_del_resit';
export const AGREE_RESIT = 'agree_resit';//同意补考人员

export const ADMIN_ADD = 'admin_add';
export const ADMIN_DEL = 'admin_del';
export const ADMIN_EDIT = 'admin_edit';
export const SEARCH_FILE = 'search_file';
export const SEARCH_TYPE = 'search_type';
export const DEL_FILE = 'del_file';



// 卡片类型
export const CARD_TYPE_COMMON = 'common';
export const CARD_TYPE_INFO = 'info';
export const CARD_TYPE_ENROLL = 'enroll';
export const CARD_TYPE_FK = 'fkstudent';
export const CARD_TYPE_ARRANGE = 'arrange';
export const CARD_TYPE_EXAM = 'exam';
export const CARD_TYPE_UNARRANGE = 'unarrange';
export const CARD_TYPE_UNARRANGE_ing = 'unarrange_ing';
export const CARD_TYPE_KNOW = 'know';
