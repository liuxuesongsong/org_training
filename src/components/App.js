// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider, { MUI_SHEET_ORDER } from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import { lightTheme, darkTheme, setPrismTheme } from 'training/src/utils/prism';
import AppRouter from 'training/src/components/AppRouter';
import { initCache, getData, getRouter } from '../utils/helpers';
import { INST_QUERY } from '../enum';



let styleManager;

class App extends Component {

  static propTypes = {
    dark: PropTypes.bool.isRequired,
  };
  state = {
    modules_id: [1,2,3,4],
    logged:sessionStorage.logged
  }
  get_modules_id() {
    var cb = (router, message, arg) => {
      console.log("refresh");
      this.state.modules_id = message.data.myinfo.modules_id;
    }
    getData(getRouter(INST_QUERY), { session: sessionStorage.session }, cb, {});
  }

  render() {
    const { dark } = this.props;
    const palette = createPalette({
      primary: blue,
      accent: pink,
      type: dark ? 'dark' : 'light',
    });

    if (this.state.logged && window.type == 2 && this.state.modules_id == []) {
      this.state.get_modules_id();
    }
    const theme = createMuiTheme({ palette });

    if (!styleManager) {
      const themeContext = MuiThemeProvider.createDefaultContext({ theme });
      styleManager = themeContext.styleManager;
    } else {
      styleManager.updateTheme(theme);
    }

    styleManager.setSheetOrder(
      MUI_SHEET_ORDER.concat([
        'Link',
        'AppDrawer',
        'AppDrawerNavItem',
        'AppFrame',
      ]),
    );

    if (dark) {
      setPrismTheme(darkTheme);
    } else {
      setPrismTheme(lightTheme);
    }

    return (
      <MuiThemeProvider theme={theme} styleManager={styleManager}>
        {
          window.type != 2 ? AppRouter[window.type] : AppRouter[3](this.state.modules_id==[]?[1]:this.state.modules_id, AppRouter[4])
        }
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({ dark: state.dark }))(App);
