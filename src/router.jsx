import React from 'react';
import { Router, Route, Switch, IndexRoute, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import Layout from './components/layout/Layout';

const { ConnectedRouter } = routerRedux
function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import(/* webpackChunkName: "IndexPage" */ './routes/IndexPage/IndexPage'),
  });
  const Users = dynamic({
    app,
    component: () => import(/* webpackChunkName: "Users" */ './routes/Users/Users'),
  });
  const UserManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "UserManagement" */ './routes/SystemManagement/UserManagement'),
  });
  const RoleManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "RoleManagement" */ './routes/SystemManagement/RoleManagement'),
  });
  const RangeQuery = dynamic({
    app,
    component: () => import(/* webpackChunkName: "RangeQuery" */ './routes/Community/RangeQuery'),
  });
  const PoliceAreaQuery = dynamic({
    app,
    component: () => import(/* webpackChunkName: "PoliceAreaQuery" */ './routes/Community/PoliceAreaQuery'),
  });
  const SimulatedMapBrowsing = dynamic({
    app,
    component: () => import(/* webpackChunkName: "SimulatedMapBrowsing" */ './routes/ThreeDimensionalSituation/SimulatedMapBrowsing'),
  });
  const ThreeCameraManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "ThreeCameraManagement" */ './routes/ThreeDimensionalSituation/ThreeCameraManagement'),
  });
  const PavementAnalysis = dynamic({
    app,
    component: () => import(/* webpackChunkName: "PavementAnalysis" */ './routes/InformationAnalysis/NetworkAnalysis/PavementAnalysis'),
  });
  const CaseEntry = dynamic({
    app,
    component: () => import(/* webpackChunkName: "CaseEntry" */ './routes/CaseAnalysis/CaseEntry'),
  });
  const Error = dynamic({
    app,
    component: () => import(/* webpackChunkName: "Error" */ './routes/Error/Error'),
  });
  const NuclearDensityAnalysis = dynamic({
    app,
    component: () => import(/* webpackChunkName: "NuclearDensityAnalysis" */ './routes/InformationAnalysis/PoliceStationAnalysis/NuclearDensityAnalysis'),
  })
  const CaseInquiry = dynamic({
    app,
    component: () => import(/* webpackChunkName: "CaseInquiry" */ './routes/InformationAnalysis/PoliceStationAnalysis/CaseInquiry'),
  })
  const CaseManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "CaseManagement" */ './routes/Community/CaseManagement'),
  })
  const AreaSpecialMap = dynamic({
    app,
    component: () => import(/* webpackChunkName: "AreaSpecialMap" */ './routes/Community/AreaSpecialMap'),
  })
  const PersonnelTrajectory = dynamic({
    app,
    component: () => import(/* webpackChunkName: "PersonnelTrajectory" */ './routes/ThreeDimensionalSituation/PersonnelTrajectory'),
  })
  const CameraAnalysis = dynamic({
    app,
    component: () => import(/* webpackChunkName: "CameraAnalysis" */ './routes/InformationAnalysis/NetworkAnalysis/CameraAnalysis'),
  })
  const FlightPathManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "FlightPathManagement" */  './routes/ThreeDimensionalSituation/FlightPathManagement'),
  })
  const FlightManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "FlightManagement" */ './routes/ThreeDimensionalSituation/FlightManagement'),
  })
  const TrajectoryBrowsing = dynamic({
    app,
    component: () => import(/* webpackChunkName: "TrajectoryBrowsing" */ './routes/ThreeDimensionalSituation/TrajectoryBrowsing'),
  })
  const CameraManagement = dynamic({
    app,
    component: () => import(/* webpackChunkName: "CameraManagement" */ './routes/Community/CameraManagement'),
  })
  const PersonnelManagement = dynamic({
    app,
    component:()=>import(/* webpackChunkName: "PersonnelManagement" */ './routes/InformationManagement/PersonnelManagement')
  })
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Switch>
          <Route exact path="/" component={PavementAnalysis} />
          <Route exact path="/indexPage" component={IndexPage} />
          <Route exact path="/NuclearDensityAnalysis" component={NuclearDensityAnalysis} />
          <Route exact path="/CaseEntry" component={CaseEntry} />
          <Route exact path="/login" component={Users} />
          <Route exact path="/CaseManagement" component={CaseManagement} />
          <Route exact path="/UserManagement" component={UserManagement} />
          <Route exact path="/RoleManagement" component={RoleManagement} />
          <Route exact path="/RangeQuery" component={RangeQuery} />
          <Route exact path="/PoliceAreaQuery" component={PoliceAreaQuery} />
          <Route exact path="/SimulatedMapBrowsing" component={SimulatedMapBrowsing} />
          <Route exact path="/PavementAnalysis" component={PavementAnalysis} />
          <Route exact path="/CaseInquiry" component={CaseInquiry} />
          <Route exact path="/AreaSpecialMap" component={AreaSpecialMap} />
          <Route exact path="/PersonnelTrajectory" component={PersonnelTrajectory} />
          <Route exact path="/ThreeCameraManagement" component={ThreeCameraManagement} />
          <Route exact path="/CameraAnalysis" component={CameraAnalysis} />
          <Route exact path="/FlightPathManagement" component={FlightPathManagement} />
          <Route exact path="/FlightManagement" component={FlightManagement} />
          <Route exact path="/TrajectoryBrowsing" component={TrajectoryBrowsing} />
          <Route exact path="/CameraManagement" component={CameraManagement} />
          <Route exact path="/PersonnelManagement" component={PersonnelManagement} />
          <Route component={Error} />
        </Switch>
      </Layout>
    </ConnectedRouter>
  );
}

export default RouterConfig;
