// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Link from 'react-router/lib/Link';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import MobileStepper from 'material-ui/MobileStepper';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import AppFrame from '../components/AppFrame';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import SwipeableViews from 'react-swipeable-views';

import { getData, getRouter } from '../utils/helpers';
import { APP_TYPE_COMPANY, APP_TYPE_ORANIZATION, LOGIN, REGISTER_COMPANY, CHECK_AVAILABLE } from '../enum';
import config from '../config';
import Lang from '../language';
import Code from '../code';

import Base from './company/infos/base.paper';
import Finance from './company/infos/finance.paper';
import Express from './company/infos/express.paper';
import Admin from './company/infos/admin.paper';

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

class Home extends Component {


  static contextTypes = {
    router: PropTypes.object.isRequired,
  }


  state = {
    logged: Boolean(sessionStorage.getItem("logged")),
    showRegister: true,
    name: "",
    activeStep: 0,
    index: 0,
    unavailable: false,
    available_result: ""
  }

  componentDidMount() {
    window.CacheData = {};
    window.currentPage = this;
    this.getRoutes();
  }

  fresh = () => {
    return;
    this.setState({ index: 0 })
  }

  getRoutes = () => {
    var cb = (route, message, arg) => {
      try {
        console.log(route);
        console.log(message);
        for (var key in message) {
          sessionStorage.setItem(key, message[key]);
        }
        console.log(sessionStorage);
      } catch (e) {
        console.log("回调出错");
      }
    }

    getData(config.routers, { type: APP_TYPE_COMPANY, version: config.version }, cb);
  }

  check_available = (account) => {
    var cb = (route, message, arg) => {
      if (message.code === Code.LOGIC_SUCCESS) {
        // 与其他玩家不冲突
      } else {
        if (message.code === 0) {
          this.setState({
            unavailable: false,
            available_result: Lang[window.Lang].pages.company.home.available
          })
        }
        console.log(message.code);
        this.setState({
          unavailable: true,
          available_result: Lang[window.Lang].ErrorCode[message.code]
        })
        // 名字已经被占用，需要重新起一个有特色的名字
      }

      console.log(route);
      console.log(message);
    }
    getData(getRouter(CHECK_AVAILABLE), { account: account, type: APP_TYPE_COMPANY }, cb);
  }

  register = (account, password, repeat) => {
    // 判断两次密码是否一致
    if (password !== repeat) {
      this.setState({
        password_error: true,
        password_result: Lang[window.Lang].ErrorCode["PASSWORD_NOT_SAME"]
      })
      return;
    }
    if (account === "") {

    }
    if (password === "") {

    }
    var cb = (route, message, arg) => {
      console.log(route);
      console.log(message);
      this.handleNext();
    }
    getData(getRouter(REGISTER_COMPANY), { account: account, password: password, type: APP_TYPE_COMPANY }, cb, {});
  }

  login = (account, password) => {
    var cb = (route, message, arg) => {
      console.log(route);
      console.log(message);

      // window.location = "http://localhost:8805/company/home";
      if (message.code === Code.LOGIC_SUCCESS) {
        sessionStorage.logged = true;
        sessionStorage.account = arg["account"];
        sessionStorage.session = message.session;
        sessionStorage.apptype = arg["type"];
        // window.CacheData = message.data;
        // 严谨检查服务端传过来的数据正确性
        if (message.data.base !== undefined) {
          window.CacheData.base = message.data.base;
        } else {

        }
        if (message.data.finance !== undefined) {
          window.CacheData.finance = message.data.finance;
        } else {

        }
        if (message.data.express !== undefined) {
          window.CacheData.express = message.data.express;
        } else {

        }
        if (message.data.admin !== undefined) {
          window.CacheData.admin = message.data.admin;
        } else {

        }
        if (message.data.student !== undefined) {
          window.CacheData.student = message.data.student;
        } else {

        }
        if (message.data.clazz !== undefined) {
          window.CacheData.clazz = message.data.clazz;
        } else {

        }

        console.log(window.CacheData);
        switch (sessionStorage.apptype) {
          case APP_TYPE_COMPANY:
            console.log(window.location);
            window.location = window.location + "/company/home";
            break;
          case APP_TYPE_ORANIZATION:
            window.location = "http://localhost:8805/organization/home";
            break;
        }
        // window.
        // this.context.router.push("/company/home");
      }
    }
    var apptype;
    if (this.state.index === COMPANY_LOING_INDEX) {
      apptype = APP_TYPE_COMPANY;
    } else if (this.state.index === ORANIZATION_LOING_INDEX) {
      apptype = APP_TYPE_ORANIZATION;
    }
    console.log(apptype);
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
            label={Lang[window.Lang].pages.main.account}
            fullWidth={true}
            defaultValue={sessionStorage.account}
            onFocus={() => {
              this.setState({
                unavailable: false,
                available_result: ""
              })
            }}
            onBlur={() => {
              this.check_available(document.getElementById("register_account").value);
            }}
            helperText={this.state.available_result}
          />
          <TextField
            name="register_password"
            id="register_password"
            label={Lang[window.Lang].pages.main.password}
            style={{
              marginTop: 20,
            }}
            type="password"
            fullWidth={true}
          // defaultValue={Lang[window.Lang].pages.main.input_your_password}
          />
          <TextField
            name="repeat_password"
            id="repeat_password"
            label={Lang[window.Lang].pages.main.repeat_password}
            type="password"
            fullWidth={true}
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
              console.log("123");
              let account = document.getElementById("register_account").value;
              console.log(account);
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
          label={Lang[window.Lang].pages.main.account}
          style={{
            marginLeft: 200,//styleManager.theme.spacing.unit,
            marginRight: 200,//theme.spacing.unit,  
            width: 200,
          }}
          defaultValue={Lang[window.Lang].pages.main.input_your_account}
          value={this.state.name}
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
            console.log(name);

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

  render() {
    return (
      <div style={{ flex: '1 0 100%', }}>
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
    )
  }
}

export default Home;
