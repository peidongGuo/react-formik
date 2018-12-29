import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import ModelEditor from './components/ModelEditor/ModelEditor';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ModelEditor />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
