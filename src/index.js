// @flow
/* eslint-disable import/prefer-default-export */

import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import App from 'training/src/components/App';

// Warns about potential accessibility issues with your React elements.
//
// import a11y from 'react-a11y';
// if (process.env.NODE_ENV !== 'production') {
//   a11y(React, { includeSrcNode: true, ReactDOM });
// }

const training = (state = { dark: false }, action) => {
  if (action.type === 'TOGGLE_THEME_SHADE') {
    return {
      ...state,
      dark: !state.dark,
    };
  }
  return state;
};

export const store = createStore(training);

const rootEl = document.querySelector('#app');

render(
  <AppContainer
    errorReporter={({ error }) => {
      throw error;
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  rootEl,
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default; // eslint-disable-line global-require

    render(
      <AppContainer
        errorReporter={({ error }) => {
          throw error;
        }}
      >
        <Provider store={store}>
          <NextApp />
        </Provider>
      </AppContainer>,
      rootEl,
    );
  });
}
