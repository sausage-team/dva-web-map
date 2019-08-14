import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
import { React } from 'react'
import { connect } from 'dva';
import PropTypes from 'prop-types';
class AddUser extends React.Component {
  state = {
    confirmDirty: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let roleList=new Array();
      roleList.push(values.roleId);
      values["roleIdList"]=roleList;
      if (!err) {
        this.props.dispatch({
          type: 'userlist/userAddUpdate',
          payload: {
            type:'add',
            user:values
          }
        })
        //
      }
    });
  }

  isCancel=()=>{
    this.props.dispatch({
      type: 'userlist/updateStateData',
      payload: {
        modalVisible:false
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {policeData,modalVisible,curItem,roleData}=this.props.userlist;
    //判断 当前是否需要可编辑角色权限
    const user=localStorage.getItem('user');
    let {roleList,pcsname}=JSON.parse(user);
    let pcsDefault='';
    let pcsIsDisable=false;
    let roleIdDefault='';
    let roleIsDisable=false;
    if(roleList.length>0){
      let userRole=roleList[0];
      if(userRole.roleCode=='fenju_admin' || userRole.roleCode=='sys_admin'){//分局管理员 (可选择派出所、可选择角色)

      }else if(userRole.roleCode=='pcs_admin'){//派出所管理员
        pcsDefault=pcsname;
        pcsIsDisable=true;
        roleIsDisable=true;
        for (var i=0;i<roleData.length;i++){
          if(roleData[i].roleCode=='pcs_user'){
            roleIdDefault=roleData[i].roleId
            break;
          }
        }
      }
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        xk: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        xk: { span: 16 },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
      </Select>
    );
    return (
      <Modal
          title="添加"
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.isCancel}
          okText="确认"
          cancelText="取消"
          destroyOnClose={true}
        >
      <Form onSubmit={this.handleSubmit}>
      <FormItem
          {...formItemLayout}
          label="警员编号"
        >
          {getFieldDecorator('username',{
            rules: [{
              initialValue:curItem.username || '',
              required: true, message: '请输入登录用户名!',
            },],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              姓名&nbsp;
              <Tooltip title="真实姓名">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('realname', {
            initialValue:curItem.realname || '',
            rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="派出所"
          hasFeedback
        >
          {
            getFieldDecorator('pcsname', {
              initialValue:pcsDefault,
              rules: [
                { required: true, message: '请选择管辖派出所!' },
              ],
            })(
              <Select placeholder="请选择派出所" disabled={pcsIsDisable}>
                <Option value="江岸区分局">江岸区分局</Option>
                {policeData.map(item => <Option key={item.policeNum} value={item.policeName}>{item.policeName}</Option>) }
              </Select>
            )
         }
        </FormItem>
        <FormItem
         {...formItemLayout}
         label="角色"
         hasFeedback>
        {getFieldDecorator('roleId',
          {
            initialValue:roleIdDefault,
            rules: [{ required: true, message: '请选择系统角色!' },],
          })(
            <Select placeholder="请选择角色" disabled={roleIsDisable}>
              {roleData.map(item => <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>) }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            initialValue:curItem.password || '',
            rules: [{
              required: true, message: '请输入密码!',
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="再次输入密码"
        >
          {getFieldDecorator('confirm', {
            initialValue:curItem.confirm || '',
            rules: [{
              required: true, message: '请再次输入密码!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            initialValue:curItem.email || '',
            rules: [{
              type: 'email', message: '无效的 E-mail!',
            }, {
              required: false, message: '请输入 E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('mobile', {
            initialValue:curItem.mobile ||'',
            rules: [{ required: false, message: '请输入手机号!' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem>
        {getFieldDecorator('status',
          {
            initialValue:1,
            rules: [],
          })(
            <Input  type="hidden" />
          )}
        </FormItem>

      </Form>
      </Modal>
    );
  }
}
function usersFun(userlist) {
  return userlist;
}
export default connect(usersFun)(Form.create()(AddUser));
//Form.create()
