import React from 'react';
import { toast } from 'react-toastify';
import Transition from 'react-transition-group/Transition';
import 'react-toastify/dist/ReactToastify.css';
import crypto from 'crypto';
import CONSTANTS from './core/config/appConfig';
import Cryptr from 'cryptr';
import moment from 'moment';

const cryptr = new Cryptr(CONSTANTS.CRYPTER_KEY);
let toastId = '';

//used to encryption of localstorage data
export const encryptedData = data => {
  return cryptr.encrypt(data);
};

//used to decrypt localstorage data
export const decryptedData = data => {
  return cryptr.decrypt(data);
};

// used to set localstorage item
export const setLocalStorage = (key, value) => {
  value = JSON.stringify(value);
  const encodedData = encryptedData(value);
  localStorage.setItem(key, encodedData);
};

// used to get localstorage item
export const getLocalStorage = key => {
  let data = localStorage.getItem(key);
  if (data) {
    data = JSON.parse(decryptedData(data));
    return data;
  }
  return null;
};

// used to remove localstorage item
export const removeLocalStorage = key => {
  localStorage.removeItem(key);
};

// used to clear localstorage
export const clearLocalStorage = () => {
  localStorage.clear();
};

// toastr messages for error
export const showErrorToast = (errorMessage, event) => {
  if (!toast.isActive(toastId)) {
    toastId = toast.error(errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true
    });
  }
};

// toastr messages for success
export const showSuccessToast = message => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true
  });
};

// toastr messages for warning
export const showWarningToast = message => {
  toast.warn(message, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true
  });
};

// used zoomin and zoomout of toastr messages
export const ZoomInAndOut = ({ children, position, ...props }) => (
  <Transition
    {...props}
    timeout={200}
    onEnter={node => node.classList.add('zoomIn', 'animate')}
    onExit={node => {
      node.classList.remove('zoomIn', 'animate');
      node.classList.add('zoomOut', 'animate');
    }}
  >
    {children}
  </Transition>
);

// used to render validation message
export const renderMessage = message => {
  return <span className="error">{message}</span>;
};

// used for password encryptions
export const encrypt = text => {
  let iv = crypto.randomBytes(CONSTANTS.IV_LENGTH);
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    new Buffer(CONSTANTS.ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// used to get apiurl for different servers
export const getAPIURL = () => {
  let returnUrl = '';
  switch (window.location.hostname) {
    case '104.42.51.157':
      returnUrl = '104.42.51.157';
      break;

    case '103.76.253.131':
      returnUrl = '103.76.253.131';
      break;

    default:
      returnUrl = '103.76.253.131';
      break;
  }
  return returnUrl;
};

// used to convert timestamp to date
export const timeStampToDate = timestamp => {
  timestamp = timestamp.toString();
  timestamp = timestamp.slice(0, -3);
  timestamp = parseInt(timestamp);
  let momentDate = moment.unix(timestamp);
  return momentDate;
};

// used to convert date to timestamp
export const convertToTimeStamp = momentObject => {
  return moment(momentObject).valueOf();
  //return moment(momentObject).format('x');
  //return moment(momentObject);
};

export const convertToDate = momentObject => {
  return moment(momentObject).format('DD/MM/YYYY');
  //return moment(momentObject).format('x');
  //return moment(momentObject);
};

// used to top Position
export const topPosition = message => {
  return window.scrollTo(0, 0);
};

// used to convert timestamp to date
export const removeUnderScore = name => {
  name = name ? name.replace(/_/g, ' ') : '';
  return name;
};
