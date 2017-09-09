// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List from 'material-ui/List';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import AppDrawerNavItem from 'training/src/components/AppDrawerNavItem';
import Link from 'training/src/components/Link';

const styleSheet = createStyleSheet('AppDrawer', theme => ({
  paper: {
    width: 125,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary[500],
    },
  },
  toolbar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  anchor: {
    color: theme.palette.text.secondary,
  },
}));

function renderNavItems(props, navRoot) {
  let navItems = null;

  if (navRoot.childRoutes && navRoot.childRoutes.length) {
    // eslint-disable-next-line no-use-before-define
    navItems = navRoot.childRoutes.reduce(reduceChildRoutes.bind(null, props), []);
  }

  return (
    <List>
      {navItems}
    </List>
  );
}

function reduceChildRoutes(props, items, childRoute, index) {
  if (childRoute.nav) {
    if (childRoute.childRoutes && childRoute.childRoutes.length) {
      const openImmediately = props.routes.indexOf(childRoute) !== -1 || false;
      items.push(
        <AppDrawerNavItem key={index} openImmediately={openImmediately} title={childRoute.title}>
          {renderNavItems(props, childRoute)}
        </AppDrawerNavItem>,
      );
    } else {
      items.push(
        <AppDrawerNavItem
          key={index}
          title={childRoute.title}
          to={childRoute.path}
          onClick={props.onRequestClose}
        />,
      );
    }
  }
  return items;
}

function AppDrawer(props) {
  const classes = props.classes;
  const GITHUB_RELEASE_BASE_URL = 'https://github.com/callemall/material-ui/releases/tag/';

  return (
    <Drawer
      className={props.className}
      classes={{
        paper: classes.paper,
      }}
      open={props.open}
      onRequestClose={props.onRequestClose}
      docked={props.docked}
      keepMounted
    >
      <div className={classes.nav}>
        <Toolbar className={classes.toolbar}>
          <Typography type="title" gutterBottom color="inherit">
            企业登陆
            </Typography>
          {
            /**<Link className={classes.title} to="/" onClick={props.onRequestClose}>
            
          </Link>*/
          }
          <Divider absolute />
        </Toolbar>
        {renderNavItems(props, props.routes[0])}
      </div>
    </Drawer>
  );
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  docked: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  routes: PropTypes.array.isRequired,
};

export default withStyles(styleSheet)(AppDrawer);
