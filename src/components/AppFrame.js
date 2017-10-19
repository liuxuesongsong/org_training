// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
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
import { APP_TYPE_COMPANY, APP_TYPE_ORANIZATION, APP_TYPE_UNLOGIN, NOTICE, LOGIN, ORG_LOGIN, REGISTER_COMPANY, CHECK_AVAILABLE } from '../enum';

import Base from '../pages/com/infos/base.paper'
import Express from '../pages/com/infos/express.paper'
import Finance from '../pages/com/infos/finance.paper'
import Admin from '../pages/com/infos/admin.paper'

import CommonAlert from './CommonAlert';

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
    marginLeft: 24,
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
      width: '100px',
    },
    appBarShift: {
      width: 'calc(100% - 100px)',
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
  <div style={{ padding: 24 }}>
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
    activeStep: 0,
    index: 0,
    unavailable: false,
    password_error: false,
    repeat_error: false,
    available_result: "",
    password_result: "",
    repeat_result: "",

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
    if (!sessionStorage.logged || sessionStorage.logged === false) {
      this.context.router.push("/");
      addEventListener("login_success", (e) => {
        switch (Number(sessionStorage.apptype)) {
          case APP_TYPE_COMPANY:
            window.location = "/com/home";
            break;
          case APP_TYPE_ORANIZATION:
            window.location = "/org/home";
            break;
        }
      })
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
  }

  getRoutes = () => {
    var cb = (route, message, arg) => {
      try {
        if (message.code === Code.ROUTER_SUCCESS) {
          for (var key in message) {
            if (key !== "code") {
              sessionStorage.setItem(key, message[key]);
            }
          }
        } else {
          this.popUpNotice(NOTICE, Code.ERROE_REQUEST_ROUTER, Lang[window.Lang].ErrorCode[Code.ERROE_REQUEST_ROUTER]);
        }
      } catch (e) {
        // console.log("回调出错");
      }
    }

    getData(config.routers, { type: APP_TYPE_COMPANY, version: config.version }, cb);
  }

  check_available = (account) => {
    var cb = (route, message, arg) => {
      if (message.code === Code.ACCOUNT_CAN_USE) {
        this.setState({
          unavailable: false,
          available_result: Lang[window.Lang].pages.com.home.available
        })
      } else {
        this.setState({
          unavailable: true,
          available_result: Lang[window.Lang].ErrorCode[message.code]
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
    getData(getRouter(CHECK_AVAILABLE), { account: account, type: APP_TYPE_COMPANY }, cb);
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
      if (message.code === Code.REGISTER_SUCCESS) {
        this.handleNext();
        this.popUpNotice(NOTICE, Code.REGISTER_SUCCESS, Lang[window.Lang].ErrorCode[Code.REGISTER_SUCCESS]);
      }
      this.popUpNotice(NOTICE, message.code, Lang[window.Lang].ErrorCode[message.code]);
    }
    getData(getRouter(REGISTER_COMPANY), { account: account, password: password, type: APP_TYPE_COMPANY }, cb, {});
  }

  login = (account, password) => {
    var cb = (route, message, arg) => {
      // Code.LOGIC_SUCCESS
      console.log(message.code);
      if (message.code === Code.LOGIN_SUCCESS || message.code === 10031) {
        sessionStorage.logged = true;
        sessionStorage.account = arg["account"];
        sessionStorage.session = message.session;
        sessionStorage.apptype = arg["type"];

        let e = new Event("login_success");
        dispatchEvent(e);
        this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
        // this.popUpNotice(NOTICE, message.code, Lang[window.Lang].pages.main.login_success);
      } else {
        this.popUpNotice(NOTICE, message.code, Lang[window.Lang].ErrorCode[message.code]);
      }
    }

    var apptype;
    console.log(APP_TYPE_ORANIZATION);
    console.log(this.state.index);
    if (this.state.index === COMPANY_LOING_INDEX) {
      apptype = APP_TYPE_COMPANY;
      getData(getRouter(LOGIN), { account: account, password: password }, cb, { account: account, type: apptype });
    } else if (this.state.index === ORANIZATION_LOING_INDEX) {
      apptype = APP_TYPE_ORANIZATION;
      console.log("123")
      getData(getRouter(ORG_LOGIN), { account: account, password: password }, cb, { account: account, type: apptype });
    }
    // { account: account, password: password, type: apptype }
  }

  handleNext = () => {
    if (this.state.activeStep === 5) {
      login()
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
      case 0:
        return <div>
          <Typography>遵循中软科技以下条款</Typography>
        </div>
      case 1:
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
                available_result: ""
              })
            }}
            onBlur={(e) => {
              this.check_available(document.getElementById("register_account").value);
            }}
            helperText={this.state.available_result}
          />
          <TextField
            error={this.state.password_error}
            name="register_password"
            id="register_password"
            label={Lang[window.Lang].pages.main.password}
            style={{
              marginTop: 20,
            }}
            type="password"
            fullWidth={true}
            onBlur={(e) => {
              if (document.getElementById("register_password").value === "") {
                this.setState({
                  password_error: true,
                  password_result: Lang[window.Lang].ErrorCode[1001]
                })
              } else if (document.getElementById("repeat_password").value !== document.getElementById("register_password").value) {
                this.setState({
                  password_error: true,
                  password_result: Lang[window.Lang].ErrorCode[1000]
                })
              } else {
                this.setState({
                  password_error: false,
                  password_result: ""
                })
              }
            }}
            helperText={this.state.password_result}
          />
          <TextField
            error={this.state.repeat_error}
            name="repeat_password"
            id="repeat_password"
            label={Lang[window.Lang].pages.main.repeat_password}
            type="password"
            fullWidth={true}
            onBlur={(e) => {
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
            }}
            helperText={this.state.repeat_result}
          />
          <Button
            raised
            color="accent"
            onClick={() => {
              let account = document.getElementById("register_account").value;
              let password = document.getElementById("register_password").value;
              let repeat = document.getElementById("repeat_password").value;
              this.register(account, password, repeat);
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
      <paper>
        {this.RegisterStep()}
        <MobileStepper
          nextButtonText={this.state.activeStep === 5 ? Lang[window.Lang].pages.main.next_step : "登陆"}
          backButtonText={Lang[window.Lang].pages.main.pre_step}
          type="text"
          steps={6}
          position="static"
          activeStep={this.state.activeStep}
          style={{
            maxWidth: 400,
            flexGrow: 1,
          }}
          onBack={this.handleBack}
          onNext={this.handleNext}
          disableBack={this.state.activeStep === 0 || this.state.activeStep === 2}
          disableNext={this.state.activeStep === 1}
        />

      </paper>
    )
  }

  LoginView = () => {
    return (
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
        <Button
          raised
          color="accent"
          style={{
            margin: "20px 20px",
          }}
          onClick={() => {
            var name = this.state.name;
            var password = this.state.password;
            console.log(password)
            if (name === "" || password === "") {
              return
            }

            this.login(name, password);
          }}
        >
          {Lang[window.Lang].pages.main.login_button}
        </Button>
      </div>
    )
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
    this.popUpNotice("notice", 0, "登出成功")
    this.state.logged = false;
    this.setState({ logged: sessionStorage.getItem("logged"), apptype: 0 });
    addEventListener("login_success", (e) => {
      switch (Number(sessionStorage.apptype)) {
        case APP_TYPE_COMPANY:
          window.location = "/com/home";
          break;
        case APP_TYPE_ORANIZATION:
          window.location = "/org/home";
          break;
      }
      this.setState({ logged: Boolean(sessionStorage.getItem("logged")), apptype: Number(sessionStorage.getItem("apptype")) })
    })
  }

  logout = () => {
    sessionStorage.logged = false;
    sessionStorage.account = "";
    sessionStorage.session = "";
    sessionStorage.apptype = APP_TYPE_UNLOGIN;
    this.context.router.push("/");
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
    return <div style={{ flex: '1 0 100%', }}>
      <div style={{
        minHeight: '100vh', // Makes the hero full height until we get some more content.
        flex: '0 0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary[500],
        color: theme.palette.getContrastText(theme.palette.primary[500]),
      }}>
        <div style={{
          padding: '60px 30px',
          textAlign: 'center',
          [theme.breakpoints.up('sm')]: {
            padding: '120px 30px',
          },
        }}>
          <div style={{
            backgroundColor: theme.palette.background.paper,
            width: 500
          }}>
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
                <Tab label="机构登陆" />
              </Tabs>
            </AppBar>
            <SwipeableViews index={this.state.index} onChangeIndex={this.handleChangeIndex}>
              <TabContainer>
                {this.LoginView()}
              </TabContainer>
              <TabContainer>
                {this.RegisterView()}
              </TabContainer>
              <TabContainer>
                {this.LoginView()}
              </TabContainer>
            </SwipeableViews>
          </div>
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
      <div>
        {sessionStorage.getItem("logged") === "true" ?
          <div className={classes.appFrame}>
            <AppBar className={appBarClassName}>
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
              className={classes.drawer}
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
