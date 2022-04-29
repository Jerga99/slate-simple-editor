import React from 'react';
import { createRoot } from 'react-dom/client';
import { Editor } from './lib/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './lib/index.scss';

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <div className="container">
    <Editor
      initialContent="<p>Some very nice content</p>"
      onSave={() => {console.log('saving')}} />
  </div>
);
