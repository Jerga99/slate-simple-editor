import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './lib/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './lib/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <Editor
        onSave={() => {}} />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
