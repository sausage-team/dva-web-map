import React from 'react';
import { Router, Route, Switch, IndexRoute, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import Layout from './components/layout/Layout';
const { ConnectedRouter } = routerRedux
function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/IndexPage/IndexPage'),
  });
  const Users = dynamic({
    app,
    component: () => import('./routes/Users/Users'),
  });
  const UserManagement = dynamic({
    app,
    component: () => import('./routes/SystemManagement/UserManagement'),
  });
  const RoleManagement = dynamic({
    app,
    component: () => import('./routes/SystemManagement/RoleManagement'),
  });
  const RangeQuery = dynamic({
    app,
    component: () => import('./routes/Community/RangeQuery'),
  });
  const PoliceAreaQuery = dynamic({
    app,
    component: () => import('./routes/Community/PoliceAreaQuery'),
  });
  const SimulatedMapBrowsing = dynamic({
    app,
    component: () => import('./routes/ThreeDimensionalSituation/SimulatedMapBrowsing'),
  });
  const ThreeCameraManagement = dynamic({
    app,
    component: () => import('./routes/ThreeDimensionalSituation/ThreeCameraManagement'),
  });
  const PavementAnalysis = dynamic({
    app,
    component: () => import('./routes/InformationAnalysis/NetworkAnalysis/PavementAnalysis'),
  });
  const CaseEntry = dynamic({
    app,
    component: () => import('./routes/CaseAnalysis/CaseEntry'),
  });
  const Error = dynamic({
    app,
    component: () => import('./routes/Error/Error'),
  });
  const NuclearDensityAnalysis = dynamic({
    app,
    component: () => import('./routes/InformationAnalysis/PoliceStationAnalysis/NuclearDensityAnalysis'),
  })
  const CaseInquiry = dynamic({
    app,
    component: () => import('./routes/InformationAnalysis/PoliceStationAnalysis/CaseInquiry'),
  })
  const CaseManagement = dynamic({
    app,
    component: () => import('./routes/Community/CaseManagement'),
  })
  const AreaSpecialMap = dynamic({
    app,
    component: () => import('./routes/Community/AreaSpecialMap'),
  })
  const PersonnelTrajectory = dynamic({
    app,
    component: () => import('./routes/ThreeDimensionalSituation/PersonnelTrajectory'),
  })
  const CameraAnalysis = dynamic({
    app,
    component: () => import('./routes/InformationAnalysis/NetworkAnalysis/CameraAnalysis'),
  })
  const FlightPathManagement = dynamic({
    app,
    component: () => import('./routes/ThreeDimensionalSituation/FlightPathManagement'),
  })
  const FlightManagement = dynamic({
    app,
    component: () => import('./routes/ThreeDimensionalSituation/FlightManagement'),
  })
  const TrajectoryBrowsing = dynamic({
    app,
    component: () => import('./routes/ThreeDimensionalSituation/TrajectoryBrowsing'),
  })
  const CameraManagement = dynamic({
    app,
    component: () => import('./routes/Community/CameraManagement'),
  })
  const PersonnelManagement = dynamic({
    app,
    component:()=>import('./routes/InformationManagement/PersonnelManagement')
  })
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Switch>
          <Route exact path="/" exact component={PavementAnalysis} />
          <Route exact path="/indexPage" exact component={IndexPage} />
          <Route exact path="/NuclearDensityAnalysis" exact component={NuclearDensityAnalysis} />
          <Route exact path="/CaseEntry" exact component={CaseEntry} />
          <Route exact path="/login" exact component={Users} />
          <Route exact path="/CaseManagement" exact component={CaseManagement} />
          <Route exact path="/UserManagement" exact component={UserManagement} />
          <Route exact path="/RoleManagement" exact component={RoleManagement} />
          <Route exact path="/RangeQuery" exact component={RangeQuery} />
          <Route exact path="/PoliceAreaQuery" exact component={PoliceAreaQuery} />
          <Route exact path="/SimulatedMapBrowsing" exact component={SimulatedMapBrowsing} />
          <Route exact path="/PavementAnalysis" exact component={PavementAnalysis} />
          <Route exact path="/CaseInquiry" exact component={CaseInquiry} />
          <Route exact path="/AreaSpecialMap" exact component={AreaSpecialMap} />
          <Route exact path="/PersonnelTrajectory" exact component={PersonnelTrajectory} />
          <Route exact path="/ThreeCameraManagement" exact component={ThreeCameraManagement} />
          <Route exact path="/CameraAnalysis" exact component={CameraAnalysis} />
          <Route exact path="/FlightPathManagement" exact component={FlightPathManagement} />
          <Route exact path="/FlightManagement" exact component={FlightManagement} />
          <Route exact path="/TrajectoryBrowsing" exact component={TrajectoryBrowsing} />
          <Route exact path="/CameraManagement" exact component={CameraManagement} />
          <Route exact path="/PersonnelManagement" exact component={PersonnelManagement} />
          <Route component={Error} />
        </Switch>
      </Layout>
    </ConnectedRouter>
  );
}

export default RouterConfig;
