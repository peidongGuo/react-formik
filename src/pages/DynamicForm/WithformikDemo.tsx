import * as React from 'react';
import { Formik, Form, Field, ErrorMessage, withFormik } from 'formik';
import * as Yup from 'yup';
import { observer, PropTypes } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { string, any } from 'prop-types';

interface Props {}

interface State {}

// 注意将props的类型设为any
class FormikChild extends React.Component<Props | any, State> {
  render() {
    const { values, touched, errors, handleChange, handleBlur, handleSubmit } = this.props;
    return (
      <div>
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.firstName} name="firstName" />
          {errors.firstName && touched.firstName && <div id="feedback">{errors.firstName}</div>}
          <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.lastName} name="lastName" />
          {errors.lastName && touched.lastName && <div id="feedback">{errors.lastName}</div>}
          <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
          {errors.email && touched.email && <div id="feedback">{errors.email}</div>}
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

const SignupForm = (props) => {
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.firstName} name="firstName" />
      {errors.firstName && touched.firstName && <div id="feedback">{errors.firstName}</div>}
      <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.lastName} name="lastName" />
      {errors.lastName && touched.lastName && <div id="feedback">{errors.lastName}</div>}
      <input type="text" onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" />
      {errors.email && touched.email && <div id="feedback">{errors.email}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

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

const WithformikDemo = withFormik({
  mapPropsToValues: () => ({
    firstName: '',
    lastName: '',
    email: ''
  }),
  validationSchema: SignupSchema,
  handleSubmit: (values) => {
    console.log(values);
  }
})(FormikChild);

export default WithformikDemo;
