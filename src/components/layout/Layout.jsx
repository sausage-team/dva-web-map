import React from 'react';
import styles from './Layout.css';
import { connect } from 'dva';
import { Helmet } from 'react-helmet'
import { Layout, ConfigProvider} from 'antd';
import Loader from '../Loader/Loader';
import favicon from '../../assets/favicon.ico';
import logo from '../../../public/img/guohui.png'
import LeftMenu from '../LeftMenu/LeftMenu'
import { withRouter } from 'dva/router'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Header, Content } = Layout;

class SiderDemo extends React.Component {
  constructor(props,) {
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
        <ConfigProvider locale={zhCN}>
          {this.props.children}
        </ConfigProvider>
      </Layout>)
    } else {
      return (
        <Layout style={{ minHeight: '100vh' }}>
          {/* <Loader fullScreen spicnning={this.props.loading.effects['layout/query']} /> */}
          <Loader fullScreen spicnning={this.props.map.loading} />
          <link rel="shortcut icon" href={favicon} />
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href={logo} type="image/x-icon" />
          </Helmet>
          <Header className="header">
            <div className={styles.logo} >
              <img src={logo} style={{ width: '40px', height: '40px', margin: 0, lineHeight: '44px', float: 'left' }} />
              <span style={{ float: 'left', marginTop: '0', fontSize: '20px', color: '#fff', marginLeft: '10px' }}>后湖社区地理信息防控平台 </span>
            </div>
          </Header>
          <Layout>
            <LeftMenu />
            <Layout>
              <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: 280 }}>
                <ConfigProvider locale={zhCN}>
                  {this.props.children}
                </ConfigProvider>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
    }
  }
}
function layoutModel({ layout, loading, map }) {
  return { layout, loading, map };
}
export default withRouter(connect(layoutModel)(SiderDemo));
