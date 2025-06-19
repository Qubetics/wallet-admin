import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './Redux/store';
import WalletContextProvider from './WalletProvider';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter basename={`${process.env.REACT_APP_DOMAIN_KEY}`}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          <App />
        </WalletContextProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
