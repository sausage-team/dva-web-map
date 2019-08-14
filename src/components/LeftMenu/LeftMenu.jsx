import React from 'react';
import styles from './LeftMenu.css';
import { connect } from 'dva';
import { Menu, Icon, Layout } from 'antd';
import { routerRedux } from 'dva/router'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  selectFun = (e) => {
    this.props.dispatch({
      type: 'map/clearMapLayer'
    })
    // this.props.dispatch({
    //   type: 'layout/query'
    // })
    this.props.dispatch(routerRedux.push('/' + e.key))
  }
  onOpenChange = (openKeys) => {
    const rootSubmenuKeys = ['menu1', 'menu2', 'menu3', 'menu4', 'menu5', 'menu6'];
    const latestOpenKey = openKeys.find(key => this.props.leftMenu.openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.props.dispatch({
        type: 'leftMenu/setOpenKeys',
        payload: openKeys
      });
    } else {
      this.props.dispatch({
        type: 'leftMenu/setOpenKeys',
        payload: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'leftMenu/setOpenKeys',
      payload: [],
    });
    this.props.dispatch({
      type: 'leftMenu/setCollapsed',
      payload: collapsed
    })
  }
  render() {
    return (
      <div style={{ backgroundColor: '#001529' }}>
        <Sider width={200}
          collapsible
          collapsed={this.props.leftMenu.collapsed}
          onCollapse={this.onCollapse}>
          <Menu className={styles.normal} theme="dark" openKeys={this.props.leftMenu.openKeys} mode="inline" defaultOpenKeys={['menu2']} onSelect={this.selectFun} onOpenChange={this.onOpenChange}>
            <SubMenu
              key="menu2"
              title={<span><Icon type="line-chart" /><span>情报分析</span></span>}>
              <SubMenu
                key="menu2menu2"
                title={<span><span>案件管理</span></span>}>
                <Menu.Item key="CaseEntry">案件导入</Menu.Item>
              </SubMenu>
              <Menu.Item key="PavementAnalysis">路网分析</Menu.Item>
              <Menu.Item key="CameraAnalysis">泰森分析</Menu.Item>
              <SubMenu
                key="menu2menu1"
                title={<span><span>派出所分析</span></span>}
              >
                <Menu.Item key="CaseInquiry">案件查询统计</Menu.Item>
                <Menu.Item key="PoliceAreaQuery">辖区查询</Menu.Item>
                <Menu.Item key="NuclearDensityAnalysis">案件分析</Menu.Item>
                {/* <Menu.Item key="CameraManagement">建筑物态势分析</Menu.Item> */}
                {/* <Menu.Item key="PersonnelManagement">人口态势分析</Menu.Item> */}
              </SubMenu>
              {/* <Menu.Item key="AreaSpecialMap">区域专题图</Menu.Item> */}
            </SubMenu>
            {/* <SubMenu
              key="menu3"
              title={<span><Icon type="safety" /><span>社区防控</span></span>}
            >
              <Menu.Item key="RangeQuery">社区查询</Menu.Item>
              <Menu.Item key="CaseManagement">案件防控</Menu.Item>
            </SubMenu> */}
            <SubMenu
              key="menu4"
              title={<span><Icon type="api" /><span>指挥调度</span></span>}
            >
              {/* <Menu.Item key="SimulatedMapBrowsing">场景浏览</Menu.Item> */}
              {/* <Menu.Item key="ThreeCameraManagement">人员定位</Menu.Item>
              <Menu.Item key="TrajectoryBrowsing">车辆定位</Menu.Item>
              <Menu.Item key="PersonnelTrajectory">轨迹浏览</Menu.Item> */}
              {/* <Menu.Item key="PersonnelTrajectory">车辆轨迹回放</Menu.Item> */}
              {/* <Menu.Item key="FlightPathManagement">摄像头管理</Menu.Item> */}
              <Menu.Item key="FlightManagement">摄像头管理</Menu.Item>
              {/* <Menu.Item key="CaseLocationTagging">两实管理</Menu.Item> */}
            </SubMenu>
            {/* <SubMenu
              key="menu5"
              title={<span><Icon type="user" /><span>信息管理</span></span>}
            >
              <Menu.Item key="VehicleManagement">车辆管理</Menu.Item>
              <Menu.Item key="PersonnelManagement">人员管理</Menu.Item>
            </SubMenu>
            <SubMenu
              key="menu6"
              title={<span><Icon type="user" /><span>系统管理</span></span>}
            >
              <Menu.Item key="UserManagement">用户管理</Menu.Item>
              <Menu.Item key="RoleManagement">角色管理</Menu.Item>
            </SubMenu> */}
          </Menu>
        </Sider>
      </div>
    );
  }
}
function leftMenuFun({ leftMenu, layout }) {
  return { leftMenu, layout };
}
export default connect(leftMenuFun)(LeftMenu);
