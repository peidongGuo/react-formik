import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { observer, PropTypes } from 'mobx-react';
import { observable, toJS, values } from 'mobx';
import { string } from 'prop-types';
import { Form as AntdForm, Icon, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';
interface Props {}

interface State {}

@observer
class LoginForm extends React.Component<Props, State> {
  @observable
  dynamicJsonSchema = null;
  @observable
  errorMessagesConfig = {};

  componentWillReceiveProps(nextProps: Props) {
    console.log('will receive props!');
  }

  componentDidMount() {
    console.log('mounted component');
  }

  render() {
    const SignupSchema = Yup.object().shape({
      firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
      lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email')
        .required('Required')
    });
    return (
      <div>
        <h1>Signup</h1>
        <Formik
          initialValues={{
            firstName: 'asdfasdf',
            lastName: '',
            email: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <AntdForm>
              <AntdForm.Item
                validateStatus={errors.firstName && touched.firstName ? 'error' : null}
                help={errors.firstName && touched.firstName ? errors.firstName : null}
              >
                <Input
                  //   prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                  name="firstName"
                  id="error"
                  value={values.firstName}
                  //   defaultValue={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntdForm.Item>
              <AntdForm.Item>
                <Field name="lastName" />
                {errors.lastName && touched.lastName ? <div>{errors.lastName}</div> : null}
              </AntdForm.Item>
              <AntdForm.Item>
                <Field name="email" type="email" />
                {errors.email && touched.email ? <div>{errors.email}</div> : null}
              </AntdForm.Item>
              <AntdForm.Item>
                <Button type="primary">Submit</Button>
              </AntdForm.Item>
            </AntdForm>
          )}
        </Formik>
      </div>
    );
  }
}

export default LoginForm;
