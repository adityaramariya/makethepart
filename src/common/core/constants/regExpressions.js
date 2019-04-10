export default {
  alphaOnly: '/^[A-Za-z\\s]+$/',
  // passwordPattern:
  //   '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&]{8,20}/',
  passwordPattern:
    '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$',
  numberOnly: '^[0-9\b]+$',
  taxOnly: '^[+-]?([0-9]*[.])?[0-9]+$'
};
