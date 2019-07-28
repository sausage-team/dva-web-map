import dva, { message } from 'dva';
import './index.less';
import 'antd/dist/antd.css';
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory';
import 'babel-polyfill';
// 1. Initialize
const app = dva({
	...createLoading(),
	//history: createHistory(),
	onError(error) {
		message.error(error.message)
	}, initialState: {
	},
});

// 2. Plugins
app.use({});

// 3. Model

app.model(require('./models/indexPage'));

app.model(require("./models/cameraManagement"));

app.model(require("./models/cesiumPublic"));

app.model(require("./models/trajectoryBrowsing"));

app.model(require("./models/flightPathManagement"));

app.model(require("./models/cameraAnalysis"));

app.model(require("./models/personnelTrajectory"));

app.model(require("./models/threeCameraManagement"));

app.model(require("./models/mapPublic"));

app.model(require("./models/areaSpecialMap"));
app.model(require("./models/simulatedMapBrowsing"));
app.model(require("./models/caseManagment"));
app.model(require("./models/pavementAnalysis"));
app.model(require("./models/statistics"));
app.model(require("./models/caseEntry"));
app.model(require("./models/users"));
app.model(require("./models/cesium"));
app.model(require("./models/map"));
app.model(require("./models/leftMenu"));
app.model(require("./models/layout"));
app.model(require('./models/userlist'));
app.model(require('./models/userrole'));
app.model(require('./models/range'));
app.model(require('./models/policeArea'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
