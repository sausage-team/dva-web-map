import React from 'react';
import styles from './Layout.css';
import { connect } from 'dva';
import { Helmet } from 'react-helmet'
// import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Icon, LocaleProvider } from 'antd';
import Loader from '../Loader/Loader';
import favicon from '../../assets/favicon.ico';
import logo from '../../../public/img/guohui.png'
import LeftMenu from '../LeftMenu/LeftMenu'
import { withRouter } from 'dva/router'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Header, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;

class SiderDemo extends React.Component {
  constructor(props, { location }) {
    super(props);
  }
  render() {
    let { hash } = location;
    let openPages = ['/#/login'];
    hash = hash.startsWith('/') ? hash : `/${hash}`
    if (openPages && openPages.includes(hash)) {
      return (<Layout style={{ minHeight: '100vh' }}>
        <link rel="shortcut icon" href={favicon} />
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={logo} type="image/x-icon" />
        </Helmet>
        <LocaleProvider locale={zhCN}>
          {this.props.children}
        </LocaleProvider>
      </Layout>)
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
              <img src={logo} style={{ width: '40px', height: '40px', margin: 0, lineHeight: '44px', float: 'left' }} /><span style={{ float: 'left', marginTop: '0', fontSize: '20px', color: '#fff', marginLeft: '10px' }}>门头沟地理信息防控平台</span>
            </div>
          </Header>
          <Layout>
            <LeftMenu />
            <Layout>
              <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                <LocaleProvider locale={zhCN}>
                  {this.props.children}
                </LocaleProvider>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
    }
  }
}
function layoutModel({ layout, loading }) {
  return { layout, loading };
}
export default withRouter(connect(layoutModel)(SiderDemo));
