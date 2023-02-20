import React from 'react';
import ReactDOM from 'react-dom/client';

// eslint-disable-next-line
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App/App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
/*

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<About />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
