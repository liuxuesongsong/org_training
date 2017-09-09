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
import { APP_TYPE_UNLOGIN } from '../enum';

let styleManager;

class App extends Component {

  state = {
    apptype: sessionStorage.apptype | 0
  }

  static propTypes = {
    dark: PropTypes.bool.isRequired,
  };

  render() {
    const { dark } = this.props;

    const palette = createPalette({
      primary: blue,
      accent: pink,
      type: dark ? 'dark' : 'light',
    });

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

    console.log("changing");

    return (
      <MuiThemeProvider theme={theme} styleManager={styleManager}>
        {AppRouter[this.state.apptype]}
      </MuiThemeProvider>
    );
  }
}

export default connect(state => ({ dark: state.dark }))(App);
