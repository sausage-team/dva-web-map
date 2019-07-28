import React from 'react';
import styles from './Layout.css';
import { connect } from 'dva';
import { Helmet } from 'react-helmet'
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Loader from '../Loader/Loader';
import favicon from '../../assets/favicon.ico';
import logo from '../../assets/logo.png'
import LeftMenu from '../LeftMenu/LeftMenu'
import { withRouter } from 'dva/router'
const { Header, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;

class SiderDemo extends React.Component {
  constructor(props,{location}) {
    super(props);
  }
  render() {
    let { pathname } = location;
    let openPages=['/login'];
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    if (openPages && openPages.includes(pathname)) {
      return (<div>
        {this.props.children}
      </div>)
    } else {
      return (
        <Layout style={{ minHeight: '100vh' }}>
         <Loader fullScreen spicnning={this.props.loading.effects['layout/query']} />
          <link rel="shortcut icon" href={favicon} />
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href={logo} type="image/x-icon" />
          </Helmet>
          <Header className="header">
            <div className={styles.logo} >
            </div>
          </Header>
          <Layout>
            <LeftMenu />
            <Layout>
              <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                {this.props.children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
    }
  }
}
function layoutModel({layout,loading}) {
  return {layout,loading};
}
export default withRouter(connect(layoutModel)(SiderDemo));
