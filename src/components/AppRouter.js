// @flow

import React from 'react';
import { applyRouterMiddleware, browserHistory, Router, Route, IndexRoute } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { kebabCase, titleize } from 'training/src/utils/helpers';
import AppFrame from 'training/src/components/AppFrame';
// import AppContent from 'training/src/components/AppContent';
// import MarkdownDocs from 'training/src/components/MarkdownDocs';
import Home from 'training/src/pages/Home';
// import { componentAPIs, requireMarkdown, demos, requireDemo } from 'training/src/components/files';

import Enrolled from '../pages/com/enrolled/enrolled.page.js';

import Instructions from '../pages/com/instructions/instructions.page.js';
import Password from '../pages/com/infos/admin.paper.js';
import CompanyHome from '../pages/com/home/home.page.js';
import Students from '../pages/com/students/students.page.js';
import Exams from '../pages/com/exams/exams.page.js';
import Infos from '../pages/com/infos/info.page.js';

import OrganizationHome from '../pages/org/home';
import Area from '../pages/org/area';
import Score from '../pages/org/score';
import Clazz from '../pages/org/clazz';

import Lang from '../language';

import { APP_TYPE_UNLOGIN, APP_TYPE_COMPANY, APP_TYPE_ORANIZATION } from '../enum';

var AppRouter = {
  1: (<Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route title="Training" path="/" component={AppFrame} >
      <IndexRoute dockDrawer title={titleize(Lang[window.Lang].pages.com.home.title)} nav component={CompanyHome} />
      <Route
        title={titleize(Lang[window.Lang].pages.com.home.title)}
        path={'/com/home'}
        content={CompanyHome}
        nav
        component={CompanyHome}
      />
      <Route
        title={titleize(Lang[window.Lang].pages.com.infos.title)}
        path={'/com/infos'}
        content={Infos}
        nav
        component={Infos}
      />
      
      <Route
        title={titleize(Lang[window.Lang].pages.com.enrolled.title)}
        path={'/com/enrolled'}
        content={Enrolled}
        nav
        component={Enrolled}
      />
      <Route
        title={titleize(Lang[window.Lang].pages.com.infos.admin.password)}
        path={'/com/password'}
        content={Password}
        nav
        component={Password}
      />
      <Route
        title={titleize(Lang[window.Lang].pages.com.instructions.title)}
        path={'/com/instructions'}
        content={Instructions}
        nav
        component={Instructions}
      />
    </Route>
    
  </Router>),
  2: (<Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route title="Training" path="/" component={AppFrame}>
      <IndexRoute dockDrawer title={titleize(Lang[window.Lang].pages.org.home.title)} nav component={OrganizationHome} />
      <Route
        title={titleize(Lang[window.Lang].pages.org.home.title)}
        path={'/org/home'}
        content={OrganizationHome}
        nav
        component={OrganizationHome}
      />
      <Route
        title={titleize(Lang[window.Lang].pages.org.clazz.title)}
        path={'/org/clazz'}
        content={Clazz}
        nav
        component={Clazz}
      />
      <Route
        title={titleize(Lang[window.Lang].pages.org.area.title)}
        path={'/org/area'}
        content={Area}
        nav
        component={Area}
      />
    </Route>
  </Router>)
}



export default AppRouter;