import dva, { message } from 'dva';
import './index.less';
import createLoading from 'dva-loading'
import Router from './router'
import indexPage from './models/indexPage'
import cameraManagement from './models/cameraManagement'
import cesiumPublic from "./models/cesiumPublic"
import trajectoryBrowsing from "./models/trajectoryBrowsing"
import flightPathManagement from "./models/flightPathManagement"
import cameraAnalysis from "./models/cameraAnalysis"
import personnelTrajectory from "./models/personnelTrajectory"
import threeCameraManagement from "./models/threeCameraManagement"
import mapPublic from "./models/mapPublic"
import areaSpecialMap from "./models/areaSpecialMap"
import simulatedMapBrowsing from "./models/simulatedMapBrowsing"
import caseManagment from "./models/caseManagment"
import pavementAnalysis from "./models/pavementAnalysis"
import statistics from "./models/statistics"
import caseEntry from "./models/caseEntry"
import users from "./models/users"
import cesium from "./models/cesium"
import map from "./models/map"
import leftMenu from "./models/leftMenu"
import layout from "./models/layout"
import userlist from './models/userlist'
import userrole from './models/userrole'
import range from './models/range'
import policeArea from './models/policeArea'

// 1. Initialize
const app = dva({
	...createLoading(),
  //history: createHistory(),
  onAction: [],
	onError:(error)=> {
		message.error(error.message)
  }, 
  initialState: {
	},
});

// 2. Plugins
app.use({});

// 3. Model

app.model(indexPage);

app.model(cameraManagement);

app.model(cesiumPublic);

app.model(trajectoryBrowsing);

app.model(flightPathManagement);

app.model(cameraAnalysis);

app.model(personnelTrajectory);

app.model(threeCameraManagement);

app.model(mapPublic);

app.model(areaSpecialMap);
app.model(simulatedMapBrowsing);
app.model(caseManagment);
app.model(pavementAnalysis);
app.model(statistics);
app.model(caseEntry);
app.model(users);
app.model(cesium);
app.model(map);
app.model(leftMenu);
app.model(layout);
app.model(userlist);
app.model(userrole);
app.model(range);
app.model(policeArea);

// 4. Router
app.router(Router);

// 5. Start
app.start('#root');
