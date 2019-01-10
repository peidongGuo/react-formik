import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { string } from 'prop-types';

interface Props {}

interface State {}

@observer
class FormikDemo extends React.Component<Props, State> {
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
            firstName: '',
            lastName: '',
            email: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="firstName" />
              {errors.firstName && touched.firstName ? <div>{errors.firstName}</div> : null}
              <Field name="lastName" />
              {errors.lastName && touched.lastName ? <div>{errors.lastName}</div> : null}
              <Field name="email" type="email" />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default FormikDemo;
