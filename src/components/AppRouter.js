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

import Enrolled from '../pages/company/enrolled/enrolled.page.js';
import CompanyHome from '../pages/company/home/home.page.js';
import Students from '../pages/company/students/students.page.js';
import Exams from '../pages/company/exams/exams.page.js';
import Infos from '../pages/company/infos/info.page.js';

import Enroll from '../pages/organization/enroll';
import OrganizationHome from '../pages/organization/home';
import Area from '../pages/organization/area';
import Score from '../pages/organization/score';
import Clazz from '../pages/organization/clazz';

import { APP_TYPE_UNLOGIN, APP_TYPE_COMPANY, APP_TYPE_ORANIZATION } from '../enum';

var AppRouter = {}
AppRouter[APP_TYPE_UNLOGIN] =
  <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route title="Training" path="/" component={AppFrame}>
      <IndexRoute dockDrawer title={null} nav component={Home} />
      <Route
        title={titleize("首页")}
        path={'/company/home'}
        content={Home}
      />
      <Route
        title={titleize("企业信息")}
        path={'/company/infos'}
        content={Home}
      />
      <Route
        title={titleize("学生")}
        path={'/company/students'}
        content={Home}
      />
      <Route
        title={titleize("报名")}
        path={'/company/enrolled'}
        content={Home}
      />
      <Route
        title={titleize("考试")}
        path={'/company/exams'}
        content={Home}
      />
      <Route
        title={titleize("首页")}
        path={'/organization/home'}
        content={Home}
      />
      <Route
        title={titleize("报名查看")}
        path={'/organization/enroll'}
        content={Home}
      />
      <Route
        title={titleize("班级安排")}
        path={'/organization/clazz'}
        content={Home}
      />
      <Route
        title={titleize("成绩管理")}
        path={'/organization/score'}
        content={Home}
      />
      <Route
        title={titleize("服务区域")}
        path={'/organization/area'}
        content={Home}
      />
    </Route>
  </Router>
AppRouter[APP_TYPE_COMPANY] =
  <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route title="Training" path="/" component={AppFrame}>
      <IndexRoute dockDrawer title={null} nav component={Home} />
      <Route
        title={titleize("首页")}
        path={'/company/home'}
        nav component={CompanyHome}
      />
      <Route
        title={titleize("企业信息")}
        path={'/company/infos'}
        content={Infos}
        nav component={Infos}
      />
      <Route
        title={titleize("学生")}
        path={'/company/students'}
        content={Students}
        nav component={Students}
      />
      <Route
        title={titleize("报名")}
        path={'/company/enrolled'}
        content={Enrolled}
        nav component={Enrolled}
      />
      <Route
        title={titleize("考试")}
        path={'/company/exams'}
        content={Exams}
        nav component={Exams}
      />
      <Route
        title={titleize("首页")}
        path={'/organization/home'}
        content={Home}
      />
      <Route
        title={titleize("报名查看")}
        path={'/organization/enroll'}
        content={Home}
      />
      <Route
        title={titleize("班级安排")}
        path={'/organization/clazz'}
        content={Home}
      />
      <Route
        title={titleize("成绩管理")}
        path={'/organization/score'}
        content={Home}
      />
      <Route
        title={titleize("服务区域")}
        path={'/organization/area'}
        content={Home}
      />
    </Route>
  </Router>
AppRouter[APP_TYPE_ORANIZATION] =
  <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route title="Training" path="/" component={AppFrame}>
      <IndexRoute dockDrawer title={null} nav component={Home} />
      <Route
        title={titleize("首页")}
        path={'/company/home'}
        content={OrganizationHome}
      />
      <Route
        title={titleize("企业信息")}
        path={'/company/infos'}
        content={OrganizationHome}
      />
      <Route
        title={titleize("学生")}
        path={'/company/students'}
        content={OrganizationHome}
      />
      <Route
        title={titleize("报名")}
        path={'/company/enrolled'}
        content={OrganizationHome}
      />
      <Route
        title={titleize("考试")}
        path={'/company/exams'}
        content={OrganizationHome}
      />
      <Route
        title={titleize("首页")}
        path={'/organization/home'}
        nav component={OrganizationHome}
      />
      <Route
        title={titleize("报名查看")}
        path={'/organization/enroll'}
        content={Enroll}
        nav component={Enroll}
      />
      <Route
        title={titleize("班级安排")}
        path={'/organization/clazz'}
        content={Clazz}
        nav component={Clazz}
      />
      <Route
        title={titleize("成绩管理")}
        path={'/organization/score'}
        content={Score}
        nav component={Score}
      />
      <Route
        title={titleize("服务区域")}
        path={'/organization/area'}
        content={Area}
        nav component={Area}
      />
    </Route>
  </Router>

export default AppRouter;
