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
import Menu, { MenuItem } from 'material-ui/Menu';
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
import { APP_TYPE_COMPANY, APP_TYPE_ORANIZATION, APP_TYPE_UNLOGIN, NOTICE, LOGIN, REGISTER_COMPANY, CHECK_AVAILABLE } from '../enum';

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
    menuOpen: false,
    open: false,
    anchorEl: undefined,
    logged: Boolean(sessionStorage.getItem("logged")),
    showRegister: true,
    name: Lang[window.Lang].pages.main.input_your_account,
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

  componentDidMount() {
    window.CacheData = {};
    window.currentPage = this;
    this.getRoutes();
    if (!sessionStorage.logged || sessionStorage.logged === false) {
      this.context.router.push("/");
    } else {
      switch (Number(sessionStorage.apptype)) {
        case APP_TYPE_COMPANY:
          this.context.router.push("/com/home");
          // window.location = "/com/home";
          break;
        case APP_TYPE_ORANIZATION:
          this.context.router.push("/org/home");
          // window.location = "/org/home";
          break;
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.logged === false && this.state.logged === true) {
      switch (Number(sessionStorage.apptype)) {
        case APP_TYPE_COMPANY:
          // this.context.router.push("/com/home");
          window.location = "/com/home";
          break;
        case APP_TYPE_ORANIZATION:
          // this.context.router.push("/org/home");
          window.location = "/org/home";
          break;
      }
    }
  }

  getRoutes = () => {
    var cb = (route, message, arg) => {
      try {
        for (var key in message) {
          sessionStorage.setItem(key, message[key]);
        }
      } catch (e) {
        // console.log("回调出错");
      }
    }

    getData(config.routers, { type: APP_TYPE_COMPANY, version: config.version }, cb);
  }

  check_available = (account) => {
    var cb = (route, message, arg) => {
      if (message.code === Code.LOGIC_SUCCESS) {
        this.setState({
          unavailable: false,
          available_result: Lang[window.Lang].pages.com.home.available
        })
      } else {
        if (message.code === 0) {
          this.setState({
            unavailable: false,
            available_result: Lang[window.Lang].pages.com.home.available
          })
        } else {
          this.setState({
            unavailable: true,
            available_result: Lang[window.Lang].ErrorCode[message.code]
          })
        }
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
      if (message.code === Code.LOGIC_SUCCESS) {
        this.handleNext();
        this.popUpNotice(NOTICE, LOGIC_SUCCESS, Lang[window.Lang].pages.main.register_success);
      }
      this.popUpNotice(NOTICE, message.code, Lang[window.Lang].ErrorCode[message.code]);
    }
    getData(getRouter(REGISTER_COMPANY), { account: account, password: password, type: APP_TYPE_COMPANY }, cb, {});
  }

  login = (account, password) => {
    var cb = (route, message, arg) => {

      console.log(message);
      // Code.LOGIC_SUCCESS
      if (message.code === 10007) {
        sessionStorage.logged = true;
        sessionStorage.account = arg["account"];
        sessionStorage.session = message.session;
        sessionStorage.apptype = arg["type"];
        // 登录成功后跳转到相应界面
        switch (Number(sessionStorage.apptype)) {
          case APP_TYPE_COMPANY:
            this.context.router.push("/com/home");
            break;
          case APP_TYPE_ORANIZATION:
            this.context.router.push("/org/home");
            break;
        }
        let e = new Event("login_success");
        dispatchEvent(e);
        console.log(Lang[window.Lang].pages.main.login_success)
        this.popUpNotice(NOTICE, 0, Lang[window.Lang].pages.main.login_success);
        // this.popUpNotice(NOTICE, message.code, Lang[window.Lang].pages.main.login_success);
      } else {
        this.popUpNotice(NOTICE, message.code, Lang[window.Lang].ErrorCode[message.code]);
      }
    }

    var apptype;
    if (this.state.index === COMPANY_LOING_INDEX) {
      apptype = APP_TYPE_COMPANY;
    } else if (this.state.index === ORANIZATION_LOING_INDEX) {
      apptype = APP_TYPE_ORANIZATION;
    }
    getData(getRouter(LOGIN), { account: account, password: password, type: apptype }, cb, { account: account, type: apptype });
  }

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
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
      // 注册账号密码
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
          // defaultValue={Lang[window.Lang].pages.main.input_your_password}
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
          // defaultValue={Lang[window.Lang].pages.main.input_your_password}
          />
          {/* <Checkbox
                    label="记住密码"
                    // checked={this.state.rememberLogin}
                    style={{
                        checkbox: {
                            marginTop: 10,
                            marginBottom: 10
                        },
                    }}
                    onCheck={() => { }}
                /> */}
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
          nextButtonText={Lang[window.Lang].pages.main.next_step}
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
          disableNext={this.state.activeStep === 5 || this.state.activeStep === 1}
        />

      </paper>
    )
  }

  LoginView = () => {
    return (
      <div>
        <TextField
          id="login_name"
          label={COMPANY_LOING_INDEX === this.state.index ? Lang[window.Lang].pages.main.com_account : Lang[window.Lang].pages.main.org_account}
          style={{
            marginLeft: 200,//styleManager.theme.spacing.unit,
            marginRight: 200,//theme.spacing.unit,  
            width: 200,
          }}
          // defaultValue={Lang[window.Lang].pages.main.input_your_account}
          // value={this.state.name}
          onChange={event => this.setState({ name: event.target.value })}
        />
        <TextField
          label={Lang[window.Lang].pages.main.password}
          id={"login_password" + this.state.index}
          type="password"
        // defaultValue={Lang[window.Lang].pages.main.input_your_password}
        />
        <Button
          raised
          color="accent"
          onClick={() => {
            var name = document.getElementById("login_name").value;
            var password = document.getElementById("login_password" + this.state.index).value;

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
    this.setState({ logged: sessionStorage.getItem("logged") });
  }

  handleMenuClick = event => {
    this.setState({ menuOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuOpen: false });
  };

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
      // alertType: type,
      // alertCode: code,
      // alertContent: content,
      alertOpen: true,
      // alertAction: action
    });
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
              title="Toggle light/dark theme"
              color="contrast"
              onClick={this.handleToggleShade}
            >
              <LightbulbOutline />
            </IconButton>
            <IconButton
              color="contrast"
              onClick={() => {
                window.currentPage.fresh();
              }}>
              <Refresh />
            </IconButton>
            <IconButton
              color="contrast"
              onClick={this.handleMenuClick}
              aria-owns="api-menu"
              aria-haspopup="true"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="api-menu"
              anchorEl={this.state.anchorEl}
              open={this.state.menuOpen}
              onRequestClose={this.handleMenuClose}
            >
              <MenuItem key="info"
                onClick={() => {
                  this.handleOpenDetail();
                  if (sessionStorage.appType === undefined) {

                  } else if (sessionStorage.appType === APP_TYPE_COMPANY) {

                  } else if (sessionStorage.appType === APP_TYPE_ORANIZATION) {

                  }
                }} >
                {Lang[window.Lang].components.AppFrame.Info}
              </MenuItem>
              <MenuItem
                key="reset"
                onClick={() => {
                  this.handleOpenReset();
                }} >
                {Lang[window.Lang].components.AppFrame.Reset}
              </MenuItem>
              <MenuItem
                key="logout"
                onClick={() => {
                  // location.reload();
                  // location.replace("/web_client");
                  this.logout();
                }}>
                {Lang[window.Lang].components.AppFrame.Logout}
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <AppDrawer
          className={classes.drawer}
          docked={drawerDocked}
          routes={routes}
          onRequestClose={this.handleDrawerClose}
          open={(drawerDocked || this.state.drawerOpen)}
        />
        {sessionStorage.getItem("logged") === "true" ? children : <div style={{ flex: '1 0 100%', }}>
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
        </div>}
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
