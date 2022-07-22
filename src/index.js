import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AppContextProvider } from "./components/Context";
import { SnackbarProvider } from "notistack";
import App from './App';
import * as serviceWorker from "./serviceWorker";
import reportWebVitals from './reportWebVitals';
import Slide from '@mui/material/Slide';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const notistackRef = React.createRef();
const onClickDismiss = key => () => { 
    notistackRef.current.closeSnackbar(key);
}

const action = (key) => (
  <React.Fragment>
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={onClickDismiss(key)}
    >
      <CloseIcon />
    </IconButton>
  </React.Fragment>
);

ReactDOM.render(
  <AppContextProvider>
    <SnackbarProvider
      preventDuplicate
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      TransitionComponent={Slide}
      ref={notistackRef}
      action={action}
      style={{ width: '100%' }}
    >
      <App />
    </SnackbarProvider>
  </AppContextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
