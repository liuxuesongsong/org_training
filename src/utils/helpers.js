// @flow
import config from "../config";
import { DATA_TYPE_ALL, QUERY, INST_QUERY, APP_TYPE_COMPANY, APP_TYPE_ORANIZATION, DATA_TYPE_STUDENT, DATA_TYPE_AREA } from "../enum";
import Code from "../code";

export function kebabCase(string: String) {
  return string
    .split(/ |_|-/)
    .join('-')
    .split('')
    .map((a, index) => {
      if (a.toUpperCase() === a && a !== '-') {
        return (index !== 0 ? '-' : '') + a.toLowerCase();
      }
      return a;
    })
    .join('')
    .toLowerCase();
}

export function titleize(string: String) {
  return string
    .split('-')
    .map(word => word.split(''))
    .map(letters => {
      const first = letters.shift();
      return [first.toUpperCase(), ...letters].join('');
    })
    .join(' ');
}

function formatTimeNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function getTimeString(timeStamp) {
  let date;
  let ts = parseInt(timeStamp);
  if (isNaN(ts)) {
    date = new Date();
  } else if (ts > 1000000000000) {
    date = new Date(ts);
  } else {
    date = new Date(ts * 1000);
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  return [year, month, day].map(formatTimeNumber).join('/') + ' ' + [hour, minute, second].map(formatTimeNumber).join(':')
}

/**
 * 向服务器发送消息
 * @param {*} router 
 * @param {*} json 
 * @param {*} callback 
 * @param {*} args 
 */
export function getData(router, json, callback = null, args = {}) {
  if (!isJson(json)) {
    console.log("request必须为json");
  }
  for (var key in router.request) {
    if (json[key] === null) {
      console.log("发送的json中" + key + "字段不能为null");
      return;
    } else {
      var request_low = router.request[key].split(":");
      switch (request_low[0]) {
        case "string":
          json[key] = json[key].toString();
          if (request_low.length > 1) {
            console.log(String(json[key]).length);
            if (String(json[key]).length !== Number(request_low[1])) {
              console.log("发送的json中" + key + "字段只能为" + request_low[1] + "位字符");
              return;
            }
          }
          break;
        case "int":
          if (request_low.length > 1) {
            if (json[key] >= Math.pow(2, Number(request_low[1]))) {
              console.log("发送的json中" + key + "字段只能为" + Math.pow(2, Number(request_low[1])) + "位数字");
              return;
            }
          }
          if (isNaN(Number(json[key]))) {
            console.log("发送的json中" + key + "字段需要为数字");
            return
          }
          break;
        case "list":
          if (!json[key].length) {
            console.log("发送的json中" + key + "字段需要为数组");
            return
          }
          if (request_low.length > 1) {

          }
          break;
        case "enum":
          if (request_low.length > 1) {
            var enum_list = eval(request_low[1]);
            if (enum_list.indexOf(json[key]) === -1) {
              console.log("发送的json中" + key + "字段需要为" + request_low[1] + "中的一项");
              return
            }
          } else {
            return;
          }
          break;
        case "student":
          break;
        case "clazz":
          break;
        case "area":
          break;
        case "object":
          if (isJson(json[key])) {
            console.log("is object");
          } else {
            console.log("is not object");
          }
          break;
      }
    }
  }
  let e = new Event("loading");
  dispatchEvent(e);
  fetch(router.url, {
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www.form-urlencoded'
    },
    body: JSON.stringify(json)
  }).then(function status(response) {
    let e = new Event("dataOnload");
    dispatchEvent(e);
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    else {
      return Promise.reject(new Error(response.statusText));
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (callback !== null) {
      if (data.code === 10099) {
        logout();
      }
      callback(router, data, args);
    }
    return data;
  }).catch(function (e) {
    console.log(e);
    console.log("调用" + router.url + "接口出错");
  });
  return
}

function logout() {
  let e = new Event("session_invalid");
  dispatchEvent(e);
}

export function getTotalPage(count, rows = 10) {
  let pageNum = Math.ceil(count / rows);
  if (pageNum === 0) {
    pageNum = 1;
  }
  return pageNum;
}

export function getStudent(id) {
  for (var i = 0; i < window.CacheData.students.length; i++) {
    if (window.CacheData.students[i].id === id) {
      return window.CacheData.students[i];
    }
  }
  return {}
}

export function getInst(id) {
  return window.CacheData.insts[id];
}

export function getCourse(id) {
  return window.CacheData.courses[id];
}

/**
 * areaData 中序列从1开始
 */
export function getAreas() {
  var areas = [], areaData = getCache(DATA_TYPE_AREA);
  if (areaData === undefined) {
    return [];
  }
  var area;
  for (var i = 1; i <= areaData.length; i++) {
    if (areaData[i] === undefined) {
      continue;
    }
    area = new Object();
    area.id = i;
    area.area_name = areaData[i];
    areas.push(area)
  }
  return areas;
}

export function getCity(id) {
  return window.CacheData.areas[id];
}

export function isJson(obj) {
  return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}

/**
 * 获取路由
 * @param {*路由键} key 
 */
export function getRouter(key) {
  var router = JSON.parse(sessionStorage.getItem(key));
  return router === null ? { url: config.routers } : router;
}


/**
 * 获取保存所有数据
 * - info 个人与公司信息
 *  - base
 *  - finance
 *  - express
 *  - admin
 * - students 所有学生
 * - clazz 所属班级
 */
export function getCache(key = DATA_TYPE_ALL) {
  if (key === DATA_TYPE_ALL) {
    return window.CacheData;
  }
  // if(key==="students"){
  //   var len = window.CacheData["students"].length;
  //   var res = [];
  //   for(var i = 0;i<len;i++){
  //     res[i] = window.CacheData["students"][i];
  //     res[i]["mobile"] = res[i]["mobile"].toString();
  //     // res[i]["wechat"] = res[i]["wechat"].toString();
  //   }
  //   return res;
  // }
  return window.CacheData[key];
}

/**
 * 每个页面初始化使用的cache
 * @param {*回调函数} callback 
 */
export function initCache(callback = () => { }) {
  if (sessionStorage.logged === "true" || sessionStorage.session !== undefined) {
    var cb = (route, message, arg) => {
      if (message.code === Code.LOGIC_SUCCESS) {
        window.CacheData = message.data;
        callback()
      }
    }
    if (Number(sessionStorage.apptype) === APP_TYPE_COMPANY) {
      getData(getRouter(QUERY), { session: sessionStorage.session }, cb, { callback: callback });

    } else if (Number(sessionStorage.apptype) === APP_TYPE_ORANIZATION) {
      getData(getRouter(INST_QUERY), { session: sessionStorage.session }, cb, { callback: callback });
    } else {
      console.log("error app type query");
    }
  } else {
    logout();
  }
}

/**
 * 服务器通知
 */
export function notification() {
  var source = new EventSource(config.notification);
  source.onmessage = function (event) {
    console.log(event.data);

  };
}