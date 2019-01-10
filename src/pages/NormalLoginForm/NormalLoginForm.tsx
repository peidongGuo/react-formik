import * as React from 'react';
import 'antd/dist/antd.css';
import './NormalLoginForm.css';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
interface Props {}

interface State {}
class NormalLoginForm extends React.Component<Props, State> {
  render() {
    const SignupSchema = Yup.object().shape({
      username: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
      password: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required')
    });
    return (
      <div className="form-wrapper">
        <Formik
          initialValues={{
            username: '',
            password: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {({ values, errors, handleBlur, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="login-form">
              <Form.Item
                validateStatus={errors && errors.username ? 'error' : ''}
                help={errors && errors.username ? errors.username : ''}
              >
                {/*可行方式一： */}
                {/* <Input
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                /> */}
                {/*可行方式二： */}
                <Field
                  name="username"
                  render={({ field /* _form */ }) => (
                    <Input
                      {...field}
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Username"
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                validateStatus={errors && errors.password ? 'error' : ''}
                help={errors && errors.password ? errors.password : ''}
              >
                <Input
                  name="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox>Remember me</Checkbox>
                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
                Or <a href="">register now!</a>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default NormalLoginForm;
