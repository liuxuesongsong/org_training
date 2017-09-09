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
import Github from 'training/src/components/Github';
import ArrowDropRight from 'material-ui/svg-icons/navigation/chevron-left';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AppDrawer from 'training/src/components/AppDrawer';
import AppSearch from 'training/src/components/AppSearch';

import Lang from '../language';
import { initCache, getData, getRouter, getCache } from '../utils/helpers';
import { APP_TYPE_COMPANY, APP_TYPE_ORANIZATION, APP_TYPE_UNLOGIN } from '../enum';

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

class AppFrame extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    drawerOpen: false,
    menuOpen: false,
    open: false,
    anchorEl: undefined,
    logged: sessionStorage.getItem("logged"),
  };

  componentDidMount() {
    console.log("frame mouted");
    if (!sessionStorage.logged || sessionStorage.logged === false) {
      console.log("123")
      this.context.router.push("/");
    }
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

  handleLogin = () => {
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
    this.handleLogin();
  }

  render() {


    console.log("render frame")

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
            <AppSearch />

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
        {children}
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
