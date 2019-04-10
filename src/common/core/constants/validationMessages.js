export default {
  email: {
    required: 'Please enter your email address',
    invalid: 'Please enter a valid email address'
  },
  parentEmail: {
    required: "Please enter student's email address"
  },
  password: {
    required: 'Please enter your password',
    newPassword: 'Please enter new password',
    oldPassword: 'Please enter current password',
    confirmNewPassword: 'Please enter confirm new password',
    passwordPattern:
      'Password should be min 8 characters long with one special character, number, lower and upper case letter',
    same: 'Mismatch new password and confirm new password',
    confirmed: 'Password and Confirm password do not match',
    foo_confirmation: 'Password and Confirm password do not match'
  },
  firstName: {
    required: 'Please enter first name',
    alphaOnly: 'Please enter a valid first name'
  },
  lastName: {
    required: 'Please enter last name',
    alphaOnly: 'Please enter a valid last name'
  },
  companyName: {
    required: 'Please enter company name',
    alphaOnly: 'Please enter a valid company name'
  },
  address: {
    required: 'Please enter address',
    alphaOnly: 'Please enter a valid address'
  },
  fullName: {
    required: 'Please enter name',
    alphaOnly: 'Please enter a valid name'
  },
  mobile: {
    required: 'Please enter mobile number',
    min: 'Mobile number should be minimum 7 number',
    max: 'Mobile number should be maximum 11 number'
  },
  designation: {
    required: 'Please enter designation',
    alphaOnly: 'Please enter a valid designation'
  },
  OTP: {
    required: 'Please enter OTP value'
  },
  acceptTermsCondition: {
    required: 'Please accept terms and conditions'
  },
  projectTitle: {
    required: 'Please enter Project Title',
    alphaOnly: 'Please enter a valid Project Title'
  },
  projectCode: {
    required: 'Please enter Project Code',
    alphaOnly: 'Please enter a valid Project Code'
  },
  day: { required: 'Please select day' },
  month: { required: 'Please select month' },
  year: { required: 'Please select year' },
  city: { required: 'Please enter city' },
  state: { required: 'Please enter state' },
  country: { required: 'Please enter country' },
  summary: { required: 'Please enter summary' },
  instituteName: { required: 'Please enter institute' },
  startDate: { required: 'Please select date' },
  endDate: { required: 'Please select date' },
  addApproval: { required: 'Please enter add approval' },
  departmentId: { required: 'Please enter departmentId' },
  userProfile: { required: 'Please enter user profile' },
  userType: { required: 'Please enter user type' },
  totalPartsPlanned: {
    required: 'Please enter Project Quantity',
    numberOnly: 'Please enter a valid Project Quantity'
  },
  vendor: {
    buyerName: {
      required: 'Buyer is required'
    },
    nda: {
      required: 'Please upload NDA document'
    },
    document_mes: 'Please upload all documents before submit'
  },
  part: {
    shipmentError:
      'Shipment target date should be greater than previous shipment target date',
    checkForward: 'Please select list of Team first'
  },
  Indirect: {
    milestoneError: 'Please select item',
    deleteError: 'Please select item',
    deleteProject: 'Please select item',
    projectError: 'Please enter all details first'
  },
  ecoNumber: {
    required: 'ECO Number is required'
  },
  projectId: {
    required: 'Project Code is required'
  },
  ecoCategory: {
    required: 'ECO Category is required'
  },
  geographical: {
    deleteItem: 'Please select item',
    addItem: 'All region is selected. Please delete a region then add new',
    commonErrorMsg: 'Please enter all details'
  },
  buildPlanECO: {
    variantError: 'Please enter all variant detail first',
    moreVariantError: 'Please add more variant detail first',
    locationError: 'Please enter location detail first',
    moreLocationError: 'Please add more location detail first',
    projctError: 'Please select project name',
    revisionError: 'Please submit Revision First',
    approverError: 'Please Add Approver First',
    commentError: 'Comment is required field',
    revisionAddSuccess: 'Revision has been added',
    projectAddSuccess: 'Project has been added'
  },
  spendingCategory: {
    commonErrorMsg: 'Please enter all details'
  },
  costCenterClassification: {
    commonErrorMsg: 'Please enter all details'
  },
  financialYear: {
    commonErrorMsg: 'Please enter all details',
    yearError: 'Please select month and year'
  }
};
