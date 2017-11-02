// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import List, { ListItem } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import withWidth, { isWidthUp } from 'material-ui/utils/withWidth';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import LightbulbOutline from 'material-ui-icons/LightbulbOutline';
import ArrowDropRight from 'material-ui-icons/ChevronLeft';
import Refresh from 'material-ui-icons/Refresh';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import MobileStepper from 'material-ui/MobileStepper';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import AppDrawer from 'training/src/components/AppDrawer';
import AppSearch from 'training/src/components/AppSearch';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';

import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';

import Lang from '../language';
import Code from '../code';
import config from '../config';
import { initCache, getData, getRouter, getCache } from '../utils/helpers';
import { APP_TYPE_COMPANY, CHECK_CODE, APP_TYPE_ORANIZATION, APP_TYPE_UNLOGIN, NOTICE, LOGIN, ORG_LOGIN, REGISTER_COMPANY, CHECK_AVAILABLE } from '../enum';

import Base from '../pages/com/infos/base.paper'
import Express from '../pages/com/infos/express.paper'
import Finance from '../pages/com/infos/finance.paper'
import Admin from '../pages/com/infos/admin.paper'

import CommonAlert from './CommonAlert';
import BeingLoading from './BeingLoading';

function getTitle(routes) {
  for (let i = routes.length - 1; i >= 0; i -= 1) {
    if (routes[i].hasOwnProperty('title')) {
      return routes[i].title;
    }
  }

  return null;
}

const styleSheet = createStyleSheet('AppFrame', theme => ({
  '@global': {
    html: {
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      lineHeight: '1.2',
      overflowX: 'hidden',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      fontFamily: '"Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif'
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
      width: 'auto',
    },
  },
  appFrame: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
  grow: {
    flex: '1 1 auto',
  },
  title: {
    marginLeft: 40,
    flex: '0 1 auto',
  },
  appBar: {
    transition: theme.transitions.create('width'),
  },
  appBarHome: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  [theme.breakpoints.up('lg')]: {
    drawer: {
      width: '150px',
    },
    appBarShift: {
      width: 'calc(100% - 150px)',
    },
    navIconHide: {
      display: 'none',
    },
  },
}));

const COMPANY_LOING_INDEX = 0;
const COMPANY_REGISTER_INDEX = 1;
const ORANIZATION_LOING_INDEX = 2;

const palette = createPalette({
  primary: blue,
  accent: pink,

});
const theme = createMuiTheme({ palette });

const TabContainer = props =>
  <div className={'nyx-login-body'}>
    {props.children}
  </div>;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class AppFrame extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    drawerOpen: false,
    open: false,
    anchorEl: undefined,
    logged: Boolean(sessionStorage.getItem("logged")),
    apptype: Number(sessionStorage.getItem("apptype")),
    showRegister: true,
    name: Lang[window.Lang].pages.main.input_your_account,
    password: "",
    check_code: "",
    code_img_url: "",
    image: "",
    activeStep: 0,
    index: 0,
    unavailable: false,
    password_error: false,
    repeat_error: false,
    available_result: "",
    password_result: "",
    repeat_result: "",
    phone_number: "",
    findPassword: false,
    phone_code: "",

    beingLoading: false,

    // 提示状态
    alertOpen: false,
    alertType: NOTICE,
    alertCode: Code.LOGIC_SUCCESS,
    alertContent: "",
    alertAction: []
  };

  componentWillMount() {
    window.CacheData = {};
    this.getRoutes();
    //document.getElementById("code_img").src=getRouter(CHECK_CODE).url;
    // this.get_check_code();
    if (!sessionStorage.logged || sessionStorage.logged === false) {
      this.context.router.push("/");

    } else {
      switch (Number(sessionStorage.apptype)) {
        case APP_TYPE_COMPANY:
          if (window.location.pathname === "/") {
            this.context.router.push("/com/home");
          }
          break;
        case APP_TYPE_ORANIZATION:
          if (window.location.pathname === "/") {
            this.context.router.push("/org/home");
          }
          break;
      }

    }
    addEventListener("loading", (e) => {
      this.setState({
        beingLoading: true
      })
    })
    addEventListener("dataOnload", () => {
      this.setState({
        beingLoading: false
      })
    })
    addEventListener("session_invalid", (e) => {
      console.log("123")
      // sessionStorage.logged = false;
      // sessionStorage.apptype = APP_TYPE_UNLOGIN;
      // sessionStorage.session = "";
      // window.location = "/";
      this.popUpNotice(NOTICE, 0, "您的session无效");
      this.logout();
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.findPassword === false && nextState.findPassword === true) {
      document.getElementById("login_password" + this.state.index).value = "";
      document.getElementById("check_code" + this.state.index).value = "";
    }
  }

  getRoutes = () => {
    var cb = (route, message, arg) => {
      try {
        if (message.code === Code.LOGIC_SUCCESS) {
          for (var key in message.data.routelist) {
            sessionStorage.setItem(key, JSON.stringify(message.data.routelist[key]));
          }
          var img_url = getRouter(CHECK_CODE).url;
          this.setState({ code_img_url: img_url });
          // this.setState({ code_img: this.getElementById("code_img" + this.state.index).src = getRouter(CHECK_CODE).url + "&time=" + Math.random() })
        } else {
          this.popUpNotice(NOTICE, 0, message.msg);
        }
      } catch (e) {
      }
    }
    getData({ url: config.routers }, { type: APP_TYPE_COMPANY, version: config.version }, cb);
  }

  check_available = (account) => {
    var cb = (route, message, arg) => {
      if (message.msg_code === Code.ACCOUNT_CAN_USE) {
        this.setState({
          unavailable: false,
          available_result: message.msg
        })
      } else {
        this.setState({
          unavailable: true,
          available_result: message.msg
        })
        // if (message.code === 0) {
        //   this.setState({
        //     unavailable: false,
        //     available_result: Lang[window.Lang].pages.com.home.available
        //   })
        // } else {
        //   this.setState({
        //     unavailable: true,
        //     available_result: Lang[window.Lang].ErrorCode[message.code]
        //   })
        // }
        // 名字已经被占用，需要重新起一个有特色的名字
      }

    }
    getData(getRouter(CHECK_AVAILABLE), { key: "account", value: account }, cb);
  }

  register = (account, password, repeat) => {
    // 判断两次密码是否一致
    if (password !== repeat) {
      return;
    }
    if (account === "" || password === "") {
      return;
    }
    var cb = (route, message, arg) => {
      if (message.code === Code.LOGIC_SUCCESS) {
        sessionStorage.session = message.data.session;
        sessionStorage.accent = arg.account;
        sessionStorage.apptype = 1;
        sessionStorage.logged = true;
        this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
        this.context.router.push("/com/home");
      }
      this.popUpNotice(NOTICE, 0, message.msg);
    }

    console.log({ account: account, password: password, type: APP_TYPE_COMPANY });
    getData(getRouter(REGISTER_COMPANY), { account: account, password: password, type: APP_TYPE_COMPANY }, cb, { account: account, password: password });
  }

  login = (account, password, check_code) => {
    var cb = (route, message, arg) => {
      // Code.LOGIC_SUCCESS
      if (message.code === Code.LOGIC_SUCCESS) {
        sessionStorage.logged = true;
        sessionStorage.account = arg["account"];
        sessionStorage.session = message.data.session;
        sessionStorage.apptype = arg["type"];

        // let e = new Event("login_success");
        // dispatchEvent(e);
        this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
        switch (Number(arg["type"])) {
          case APP_TYPE_COMPANY:
            this.context.router.push("/com/home");
            break;
          case APP_TYPE_ORANIZATION:
            this.context.router.push("/org/home");
            break;
        }
        // this.popUpNotice(NOTICE, message.code, Lang[window.Lang].pages.main.login_success);
      } else {
        console.log(message.msg)
        this.popUpNotice(NOTICE, 0, message.msg);
      }
    }

    var apptype;
    if (window.type === 1) {
      apptype = APP_TYPE_COMPANY;
      getData(getRouter(LOGIN), { account: account, password: password, type: 0, checkcode: check_code }, cb, { account: account, type: apptype });
    } else if (window.type === 2) {
      apptype = APP_TYPE_ORANIZATION;
      getData(getRouter(ORG_LOGIN), { account: account, password: password, type: 1, checkcode: check_code }, cb, { account: account, type: apptype });
    }
    // { account: account, password: password, type: apptype }
  }

  handleNext = () => {
    if (this.state.activeStep === 5) {
      this.login(name, password);
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleChange = (event, index) => {
    this.setState({ index });
  };

  handleChangeIndex = index => {
    this.setState({ index });
  };

  RegisterStep = () => {
    switch (this.state.activeStep) {
      // 遵守协议
      // case 0:
      //   return <div>
      //     <Typography>遵循中软科技以下条款</Typography>
      //   </div>
      case 0:
        return <div>
          <TextField
            error={this.state.unavailable}
            name="register_account"
            id="register_account"
            label={Lang[window.Lang].pages.main.com_account}
            fullWidth={true}
            defaultValue={sessionStorage.account}
            onFocus={(e) => {
              this.setState({
                unavailable: false,
                available_result: "请输入单位全称"
              })
            }}
            onBlur={(e) => {
              if (document.getElementById("register_account").value === "") { } else {
                this.check_available(document.getElementById("register_account").value);
              }
            }}
            helperText={this.state.available_result}
          />
          <TextField
            error={this.state.password_error}
            name="register_password"
            id="register_password"
            label={Lang[window.Lang].pages.main.password}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 20,
            }}
            type="password"
            fullWidth={true}
            onBlur={(e) => {
              // if (document.getElementById("register_password").value === "") {
              //   this.setState({
              //     password_error: true,
              //     password_result: Lang[window.Lang].ErrorCode[1001]
              //   })
              // } else if (document.getElementById("repeat_password").value !== document.getElementById("register_password").value) {
              //   this.setState({
              //     password_error: true,
              //     password_result: Lang[window.Lang].ErrorCode[1000]
              //   })
              // } else {
              //   this.setState({
              //     password_error: false,
              //     password_result: ""
              //   })
              // }
            }}
            helperText={this.state.password_result}
          />
          <TextField
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "75%",
              marginTop: 20,
            }}
            error={this.state.repeat_error}
            name="repeat_password"
            id="repeat_password"
            label={Lang[window.Lang].pages.main.repeat_password}
            type="password"
            fullWidth={true}
            onBlur={(e) => {
              if (document.getElementById("register_password").value === "" && document.getElementById("repeat_password").value === "") {
                this.setState({
                  repeat_error: false,
                  password_error: false,
                  repeat_result: "",
                  password_result: ""
                })
              } else {
                if (document.getElementById("register_password").value === "") {
                  this.setState({
                    repeat_error: true,
                    repeat_result: Lang[window.Lang].ErrorCode[1001]
                  })
                } else if (document.getElementById("repeat_password").value !== document.getElementById("register_password").value) {
                  this.setState({
                    repeat_error: true,
                    repeat_result: Lang[window.Lang].ErrorCode[1000]
                  })
                } else {
                  this.setState({
                    repeat_error: false,
                    password_error: false,
                    repeat_result: "",
                    password_result: ""
                  })
                }
              }
            }}
            helperText={this.state.repeat_result}
          />
          <Button
            className="nyx-btn-circle"
            raised
            color="primary"
            onClick={() => {
              let account = document.getElementById("register_account").value;
              let password = document.getElementById("register_password").value;
              let repeat = document.getElementById("repeat_password").value;
              this.register(account, password, repeat);//TODO

            }}
          >
            {Lang[window.Lang].pages.main.register_button}
          </Button>
        </div>
      case 2:
        return <div>
          <Base />
        </div>
      case 3:
        return <div>
          <Finance />
        </div>
      case 4:
        return <div>
          <Express />
        </div>
      case 5:
        return <div>
          <Admin />
        </div>
    }
  }

  RegisterView = () => {
    return (
      <div>
        {this.RegisterStep()}
      </div>
    )
  }

  LoginView = () => {
    return (
      this.state.findPassword ?
        <div>
          <TextField
            id={"login_name" + this.state.index}
            label={COMPANY_LOING_INDEX === this.state.index ? Lang[window.Lang].pages.main.com_account : Lang[window.Lang].pages.main.org_account}
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={
              event => this.setState({ name: event.target.value })}
          />
          <TextField
            label={"预留联系人手机号"}
            id={"phone_number"}
            type="phone_number"
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ phone_number: event.target.value })}
          />
          <a

            color="primary"
            className={'nyx-send-checkcode'}
            onClick={() => {
              var cb = (route, message, arg) => {
                // Code.LOGIC_SUCCESS
                this.popUpNotice(NOTICE, 0, message.msg);
              }
              getData(getRouter("forget_code"), { account: this.state.name, tel: this.state.phone_number, }, cb, {});

            }}
          >
            {"发送手机验证码"}
          </a>
          <TextField
            label={"验证码"}
            id={"phone_code" + this.state.index}
            type="phone_code"
            style={{
              width: "75%",
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ phone_code: event.target.value })}
          />
          <Button
            raised
            color="primary"
            className={'nyx-btn-circle'}
            onClick={() => {
              var cb = (route, message, arg) => {
                // Code.LOGIC_SUCCESS
                if (message.code === Code.LOGIC_SUCCESS) {
                  sessionStorage.logged = true;
                  sessionStorage.account = arg["account"];
                  sessionStorage.session = message.data.session;
                  sessionStorage.apptype = arg["type"];

                  let e = new Event("login_success");
                  dispatchEvent(e);
                  this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
                  // this.popUpNotice(NOTICE, message.code, Lang[window.Lang].pages.main.login_success);
                } else {
                  console.log(message.msg)
                  this.popUpNotice(NOTICE, 0, message.msg);
                }
              }
              // console.log(account)
              // var code = document.getElementById("phone_code").value;
              var apptype = APP_TYPE_COMPANY;
              getData(getRouter("forget_code_login"), { account: this.state.name, code: this.state.code, }, cb, {});
            }}
          >
            {"登录"}
          </Button>
        </div > :
        <div>
          <TextField
            id={"login_name" + this.state.index}
            label={COMPANY_LOING_INDEX === this.state.index ? Lang[window.Lang].pages.main.com_account : Lang[window.Lang].pages.main.org_account}
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ name: event.target.value })}
          />
          <TextField
            label={Lang[window.Lang].pages.main.password}
            id={"login_password" + this.state.index}
            type="password"
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit,  
            }}
            fullWidth={true}
            onChange={event => this.setState({ password: event.target.value })}
          />

          {this.state.index === 0 ? <a
            className="nyx-findpassword"
            onClick={() => {
              this.setState({
                findPassword: true
              })
            }}>忘记密码?</a> : ""}

          <TextField
            label={"验证码"}
            id={"check_code" + this.state.index}
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit, 
              width: "50%"
            }}
            onChange={event => this.setState({ check_code: event.target.value })}
            fullWidth={true}
          />

          <ListItem

            /* onClick={() => {this.get_check_code(); }} */
            style={{
              marginLeft: "auto",//styleManager.theme.spacing.unit,
              marginRight: "auto",//theme.spacing.unit, 
              width: "25%",
              display: "inline-block"
            }}>
            <img
              id={"code_img" + this.state.index}
              style={{
                height: "45px",
                position: "absolute",
                width: "80%"
              }}
              src={this.state.code_img_url}
              onClick={event => this.setState({ code_img: event.target.src = getRouter(CHECK_CODE).url + "&time=" + Math.random() })}


            />

          </ListItem>
          <Button
            raised
            color="primary"
            className={'nyx-btn-circle'}
            onClick={() => {
              var name = this.state.name;
              var password = this.state.password;
              var check_code = this.state.check_code;
              if (name === "") {
                this.popUpNotice(NOTICE, 0, "您没有输入账号")
                return
              } else if (password === "") {
                this.popUpNotice(NOTICE, 0, "您没有输入密码")
                return
              } else if (check_code === "") {
                this.popUpNotice(NOTICE, 0, "您没有输入验证码")
                return
              }

              this.login(name, password, check_code);
            }}
          >
            {Lang[window.Lang].pages.main.login_button}
          </Button>

        </div>

    )
  }

  OrgLoginView = () => {
    return this.LoginView();
  }

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleDrawerToggle = () => {
    if (!sessionStorage.logged || sessionStorage.logged === false) {
      return;
    }
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  handleToggleShade = () => {
    this.props.dispatch({ type: 'TOGGLE_THEME_SHADE' });
  };

  handleLogout = () => {
    this.state.logged = false;
    this.setState({ logged: sessionStorage.getItem("logged"), apptype: 0 });
  }

  logout = () => {
    sessionStorage.logged = false;
    sessionStorage.account = "";
    sessionStorage.session = "";
    sessionStorage.apptype = APP_TYPE_UNLOGIN;
    this.context.router.push("/");
    this.popUpNotice("notice", 0, "登出成功");
    this.handleLogout();
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
    this.state.alertContent = content;
    this.state.alertType = type;
    this.state.alertCode = code;
    this.state.alertAction = action;
    this.setState({
      alertOpen: true,
    });
  }

  LoginTable = () => {
    return <div className={'nyx-login-bg'}>
      <div className={'nyx-login'}>
        <div className={'nyx-login-window'}>


          {window.type === 1 ?
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  index={this.state.index}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="公司登陆" />
                  <Tab label="公司注册" />
                  {/* <Tab label="机构登陆" /> */}
                </Tabs>
              </AppBar>
              <SwipeableViews index={this.state.index} onChangeIndex={this.handleChangeIndex}>

                <TabContainer>
                  {this.LoginView()}
                </TabContainer>
                <TabContainer>
                  {this.RegisterView()}
                </TabContainer>
              </SwipeableViews>
              <div className="nyx-notice-login">
              <h3 style={{ color: "#FFFFFF" }}>特别提醒</h3>
              <div className="nyx-login-window-acctention">
                已经做过临时登记的企业用户以单位全称和初始密码进行登陆
              </div>
              <div className="nyx-login-window-acctention">
                未做过临时登记的企业用户以单位全称进行注册
              </div>
              <div className="nyx-login-window-acctention">
                系统维护电话：010-51527580
              </div>
              </div>
            </div> : this.LoginView()}
        </div>
      </div>
    </div>
  }

  render() {

    const { children, routes, width } = this.props;

    const classes = this.props.classes;
    const title = getTitle(routes);

    let drawerDocked = isWidthUp('lg', width);
    let navIconClassName = classes.icon;
    let appBarClassName = classes.appBar;

    if (title === null) {
      // home route, don't shift app bar or dock drawer
      drawerDocked = false;
      appBarClassName += ` ${classes.appBarHome}`;
    } else {
      navIconClassName += ` ${classes.navIconHide}`;
      appBarClassName += ` ${classes.appBarShift}`;
    }

    return (
      <div className="nyx">
        {sessionStorage.getItem("logged") === "true" ?
          <div className={classes.appFrame}>
            <AppBar className={appBarClassName + ' nyx-topbar'}>
              <Toolbar>
                <IconButton
                  color="contrast"
                  onClick={this.handleDrawerToggle}
                  className={navIconClassName}
                >
                  <MenuIcon />
                </IconButton>
                {title !== null &&
                  <Typography className={classes.title} type="title" color="inherit" noWrap>
                    {title}
                  </Typography>}
                <div className={classes.grow} />
                <h2 style={{ float: "right" }}>{"信息系统集成及服务项目管理人员培训报名系统"}</h2>
                <IconButton
                  color="contrast"
                  onClick={() => {
                    window.currentPage.fresh();
                  }}>
                  <Refresh />
                </IconButton>
              </Toolbar>
            </AppBar>
            <AppDrawer
              className={classes.drawer + ' nyx-sidebar'}
              docked={drawerDocked}
              routes={routes}
              onRequestClose={this.handleDrawerClose}
              open={sessionStorage.getItem("logged") === "true" ? (drawerDocked || this.state.drawerOpen) : false}
            />
            {children}
          </div> : this.LoginTable()}
        <CommonAlert
          show={this.state.alertOpen}
          type={this.state.alertType}
          code={this.state.alertCode}
          content={this.state.alertContent}
          action={this.state.alertAction}>
        </CommonAlert>
        {this.state.beingLoading ?
          <BeingLoading /> : ''
        }
      </div>
    );
  }
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
};

export default compose(withStyles(styleSheet), withWidth(), connect())(AppFrame);
