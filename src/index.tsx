import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import PreviewForm from './pages/DynamicForm/PreviewForm';
import FormikDemo from './pages/DynamicForm/FormikDemo';
import LoginForm from './pages/LoginForm';
import NormalLoginForm from './pages/NormalLoginForm/NormalLoginForm';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<NormalLoginForm />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
