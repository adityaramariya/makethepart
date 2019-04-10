// used for passoword encryption
import validationMessages from '../constants/validationMessages';
import regExpressions from '../constants/regExpressions';
import customConstant from '../constants/customConstant';
import permissionConstant from '../constants/permissionConstant';
let getAPIURL = () => {
  let returnUrl = '';
  switch (window.location.hostname) {
    case '103.76.253.133':
      returnUrl = '103.76.253.133:8572';
      break;
    case '103.76.253.134':
      returnUrl = '103.76.253.134:8572';
      break;
    case 'qa1.lmsin.com':
      returnUrl = 'qa1.lmsin.com:8572';
      break;
    // case '18.219.145.205':
    // case 'ec2-18-219-145-205.us-east-2.compute.amazonaws.com':
    //   returnUrl = '18.219.145.205';
    //   break;

    default:
      returnUrl = '103.76.253.133:8572';
      break;
  }
  return returnUrl;
};

export default {
  IV_LENGTH: 16,
  ENCRYPTION_KEY: 'sd5b75nb7577#^%$%*&G#CGF*&%@#%*&',
  CRYPTER_KEY:
    '0xffffffff,0xffffffff,0xffffffff,0xffffffff,0xffffffff,0xfffffff8',
  regExpressions,
  validationMessages,
  customConstant,
  permissionConstant,
  azureStorageAccount: 'spikeviewmediastorage',
  azureContainer: 'spikeview-media',
  profileFolder: 'profile',
  API_URL_JAVA: 'https://' + getAPIURL()
};
