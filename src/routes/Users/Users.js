import React from 'react';
import styles from './Users.css';
import { Input, Button } from 'antd';
import { connect } from 'dva';
import style from 'antd/dist/antd.min.css'
import login from '../../../public/img/login.png'
import log from '../../../public/img/log.png'
class Users extends React.Component {
  constructor(props) {
    super(props);
  }
  handleInput = (text, e) => {
    let login = this.props.users.login;
    login[text] = e.target.value;
    this.props.dispatch({
      type: 'users/setLogin',
      payload: login
    })
  }
  login = () => {
    this.props.dispatch({
      type: 'users/login'
    })
  }
  render() {
    return (
      <div className={styles.normal} style={{background:'#0e1736 url('+login+')  no-repeat  center '}}>
      <img src={log} className = {styles.log}/>
        <div className={styles.center}>
          <Input onChange={this.handleInput.bind(this, 'username')} placeholder="请输入账户" className={styles.marginTop} style={{marginBottom:'26px'}}/>
          <Input type={'password'} onChange={this.handleInput.bind(this, 'password')} placeholder="请输入密码" className={styles.marginTop} />
          <Button className={styles.but} onClick={this.login} type="primary">登录</Button>
        </div>
      </div>
    );
  }
}
function usersFun(users) {
  return users;
}
export default connect(usersFun)(Users);