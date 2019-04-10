import { string } from 'prop-types';

export default {
  buyerLogin: {
    url:
      '/userauth/oauth/token?grant_type=password&username=:userName&password=:password&roleId=:roleId',
    method: 'POST',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  logout: {
    url: '/userauth/oauth/revokeToken/:roleId/:userId',
    method: 'DELETE',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },
  register: {
    url: '/api/v1/public/user/register',
    method: 'POST',
    data: {
      companyName: '',
      roleId: 0,
      addressRequests: [
        {
          address: '',
          phone: '',
          latitude: 0,
          longitude: 0,
          city: '',
          country: '',
          state: '',
          zipcode: '',
          flag: 0,
          createdTimestamp: 0,
          lastUpdatedTimestamp: 0
        }
      ],
      companyLogoURL: '',
      listOfUserUserIds: [''],
      createdTimestamp: 0,
      lastUpdatedTimestamp: 0,
      userDetailRequests: [
        {
          firstName: '',
          lastName: '',
          password: '',
          userProfile: '',
          mobile: '',
          email: '',
          accessToken: '',
          isEnabled: false,
          profileImageURL: '',
          isPrimaryUser: false,
          emailOTP: 0,
          mobileOTP: 0,
          creatorUserId: '',
          roleId: 0,
          createdTimestamp: 0,
          lastUpdatedTimestamp: 0,
          userType: '',
          listOfBuyerApproval: ['']
        }
      ]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  otpVerification: {
    url: '/api/v1/public/user/confirm/registration',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      emailOTP: '',
      mobileOTP: '',
      password: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getApproverList: {
    url: '/api/v1/user/unapproved?userId=:userId&roleId=:roleId',
    method: 'GET',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  generateOTPToAddUser: {
    url: '/api/v1/user/add/otp?userId=:userId&roleId=:roleId',
    method: 'PUT',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  supplierAddUser: {
    url: '/api/v1/user/add',
    method: 'PUT',
    data: {
      userDetailRequests: [
        {
          userId: 'string',
          firstName: 'string',
          lastName: 'string',
          password: 'string',
          designation: 'string',
          mobile: 'string',
          email: 'string',
          accessToken: 'string',
          isEnabled: false,
          profileImageURL: 'string',
          isPrimaryUser: false,
          emailOTP: 0,
          mobileOTP: 0,
          creatorUserId: 'string',
          roleId: 0,
          createdTimestamp: 0,
          lastUpdatedTimestamp: 0,
          userType: 'string',
          userProfile: 'string',
          addApproval: 'string',
          listOfOtherApprovers: ['string'],
          defaultApprover: 'string'
        }
      ],
      parentUserId: 'string',
      roleId: 0,
      emailOTP: 0
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getProjectList: {
    url: '/api/v1/user/project/all',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  addProject: {
    url: '/api/v1/user/project/create',
    method: 'POST',
    data: {
      projectCode: '',
      projectTitle: '',
      creatorId: '',
      totalPartsPlanned: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  addPart: {
    url: '/api/v1/user/part/create',
    method: 'PUT',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  uploadImage: {
    url: '/api/v1/cloud/aws/upload',
    method: 'POST',
    data: {
      filePath: '',
      mFile: '',
      thumbnailHeight: '',
      thumbnailWidth: '',
      isCreateThumbnail: '',
      fileKey: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  createPartWithMedia: {
    url: '/api/v1/user/part/media',
    method: 'POST',
    data: {
      projectId: '',
      creatorUserId: '',
      roleId: '',
      listOfPartMediaRequest: [
        {
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: ''
        }
      ]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  // pendingApprovalPartList: {
  //   url: '/api/v1/user/part/details?userId=:userId&roleId=:roleId',
  //   method: 'GET',
  //   data: {},
  //   showResultMessage: false,
  //   showErrorMessage: true
  // },
  pendingApprovalPartList: {
    url: '/api/v1/user/part/details',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      pageNumber: '',
      pageSize: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  approveRejectPart: {
    url: '/api/v1/user/part/set/approval',
    method: 'PUT',
    data: {
      approverUserId: '',
      roleId: '',
      approvalId: '',
      status: '',
      comment: '',
      assignedToId: '',
      // listOfString: [],
      listOfSelectedTeams: []
    },

    showResultMessage: true,
    showErrorMessage: true
  },
  approveRejectQuotation: {
    url: '/api/v1/user/quotation/set/approval',
    method: 'PUT',
    data: {
      quotationId: '',
      approverUserId: '',
      roleId: '',
      approvalId: '',
      status: '',
      comment: ''
    },

    showResultMessage: true,
    showErrorMessage: true
  },
  partListForQuotation: {
    url: '/api/v1/user/quotation/partdetails?userId=:userId&roleId=:roleId',
    method: 'GET',
    data: {},

    showResultMessage: false,
    showErrorMessage: true
  },
  actionSubmitQuotation: {
    url: '/api/v1/user/quotation/create',
    method: 'POST',
    data: {
      quotationForPart: '',
      typeOfQuotation: '',
      creatorSupplierUserDetails: '',
      roleId: '',
      quotationForQuantity: '',
      deliveryLeadTime: '',
      deliveryLeadTimeUnit: '',
      deliveryTargetDate: '',
      currency: '',
      quotationTool: '',
      quotationCost: '',
      quotationProcess: '',
      packagingCost: '',
      logisticsCost: '',
      quotationForQuantity: 0,
      deliveryLeadTime: 0,
      deliveryLeadTimeUnit: 0,
      deliveryLeadTimeAfter: 0,
      deliveryTargetDate: '',
      currency: '',
      listOfTermsAndConditions: ''
    },

    showResultMessage: true,
    showErrorMessage: true
  },
  valueAnalysis: {
    url: '/api/v1/user/quotation/create/buyer',
    method: 'POST',
    data: {
      quotationForPart: '',
      typeOfQuotation: '',
      creatorBuyerUserId: '',
      roleId: '',
      quotationForQuantity: '',
      deliveryLeadTime: '',
      deliveryLeadTimeUnit: '',
      deliveryTargetDate: '',
      currency: '',
      quotationTool: '',
      quotationCost: '',
      quotationProcess: '',
      packagingCost: '',
      logisticsCost: '',
      quotationForQuantity: 0,
      deliveryLeadTime: 0,
      deliveryLeadTimeUnit: 0,
      deliveryLeadTimeAfter: 0,
      deliveryTargetDate: '',
      currency: '',
      listOfApprovers: '',
      approvalId: '',
      userId: ''
    },

    showResultMessage: true,
    showErrorMessage: true
  },
  updateQuotation: {
    url: '/api/v1/user/quotation/update',
    method: 'PUT',
    data: {
      quotationId: '',
      quotationForPart: '',
      typeOfQuotation: '',
      creatorSupplierUserDetails: '',
      roleId: '',
      quotationForQuantity: '',
      deliveryLeadTime: '',
      deliveryLeadTimeUnit: '',
      deliveryTargetDate: '',
      currency: '',
      quotationTool: '',
      quotationCost: '',
      quotationProcess: '',
      packagingCost: '',
      logisticsCost: '',
      quotationForQuantity: 0,
      deliveryLeadTime: 0,
      deliveryLeadTimeUnit: 0,
      deliveryLeadTimeAfter: 0,
      deliveryTargetDate: '',
      currency: '',
      listOfTermsAndConditions: ''
    },

    showResultMessage: true,
    showErrorMessage: true
  },
  actionSummaryQuotationList: {
    url: '/api/v1/user/quotations/part',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      sortByDeliveryDate: '',
      sortByTotalAmount: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  actionSummaryReviewData: {
    url: '/api/v1/user/quotation/buyer',
    data: {
      partId: '',
      userId: '',
      roleId: '',
      sortByDeliveryDate: '',
      sortByTotalAmount: '',
      sortBySupplierRating: ''
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },

  downloadImage: {
    url: '/api/v1/cloud/aws/download?filePath=:filePath',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },

  downloadZip: {
    url: '/api/v1/cloud/aws/download',
    method: 'POST',
    data: {
      partCode: '',
      listOfFilePath: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getPartDetail: {
    url: '/api/v1/user/part/:partId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },

  updateMediaForRevision: {
    url: '/api/v1/user/part/media/update',
    method: 'PUT',
    data: {
      projectId: '',
      creatorUserId: '',
      roleId: '',
      partId: '',
      partNumber: '',
      listOfPartMediaRequest: [],
      revisionNumber: 0
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getSummaryQuotationList: {
    url: '/api/v1/user/quotations/part',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      partId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  actionDashboardBuyerData: {
    url: '/api/v1/user/project/counts',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      pageNumber: '',
      pageSize: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },

  getUserPartHistory: {
    url: '/api/v1/user/part/media/history',
    method: 'POST',
    data: {
      projectId: '',
      partId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },

  actionPartOrder: {
    url: '/api/v1/user/quotation/approval/po',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      sortByTotalAmount: '',
      pageNumber: '',
      pageSize: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },

  actionApproveStatus: {
    url: '/api/v1/user/part/approval/status',
    method: 'PUT',
    data: {
      partId: '',
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  deleteAttachment: {
    url: '/api/v1/cloud/aws/delete?filePath=:filePath',
    method: 'DELETE',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },
  actionDeletePart: {
    url: '/api/v1/user/quotation/remove',
    method: 'POST',
    data: {
      removerUserId: '',
      listOfIds: [
        {
          partId: '',
          projectId: ''
        }
      ]
    },

    showResultMessage: true,
    showErrorMessage: true
  },
  releasePOList: {
    url: '/api/v1/user/processorder/po/release',
    method: 'POST',
    data: {
      buyerUserId: '',
      partId: '',
      partNumber: '',
      projectId: []
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  submitReleasePOList: {
    url: '/api/v1/user/processorder/po/submit',
    method: 'POST',
    data: {
      buyerUserId: '',
      projectDeliveryAt: '',
      listOfPOReleaseRequest: {
        partId: '',
        quotationId: '',
        purchaseOrderNo: '',
        poGeneratedWith: '',
        listOfTaxIds: '',
        listOfTermsAndConditions: []
      },
      listOfTermsAndConditions: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  submitReleasePOListSupplier: {
    url: '/api/v1/user/processorder/po/submit',
    method: 'PUT',
    data: {
      roleId: '',
      userId: '',
      buyerUserId: '',
      listOfPOReleaseRequest: {
        partId: '',
        quotationId: '',
        purchaseOrderNo: '',
        poGeneratedWith: '',
        listOfTaxIds: '',
        listOfTermsAndConditions: [],
        uploadPictures: '',
        // [
        //   {
        //     mediaName: ""
        //   }
        // ],
        uploadPPAPQuualityInspectionReport: {},
        uploadPerfomaInvoice: {},
        uploadMaterialInward: {},
        uploadFinalInvoice: {}
      }
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  approveRejectOrder: {
    url: '/api/v1/user/processorder/approve/po',
    method: 'POST',
    data: {
      quotationId: '',
      partId: '',
      approverUserId: '',
      approvalId: '',
      roleId: '',
      status: '',
      comment: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  updatePartStatus: {
    url: '/api/v1/user/processorder/po/enlist',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  summaryPartStatus: {
    url: '/api/v1/user/processorder/po/enlist',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  submitOrderDetail: {
    url: '/api/v1/user/select/quotation',
    method: 'PUT',
    data: {
      quotationId: '',
      partId: '',
      userId: '',
      roleId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getSupplierQuotationData: {
    url: '/api/v1/user/processorder/quotation',
    method: 'POST',
    data: {
      roleId: '',
      userId: '',
      partId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  submitPPAPDocuments: {
    url: '/api/v1/user/part/ppap/create',
    method: 'POST',
    data: {
      roleId: '',
      userId: '',
      partId: '',
      buyerUserId: '',
      otherPpapDocumentRequests: [],
      ppapDocumentRequests: [
        {
          documentNo: '',
          documentType: '',
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: '',
          buyerDocReviewStatus: '',
          documentStatus: '',
          deviationApproved: '',
          buyerComments: [],
          supplierComments: [],
          designerComments: []
        }
      ]
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  updatePPAPDocuments: {
    url: '/api/v1/user/part/ppap/update',
    method: 'PUT',
    data: {
      roleId: '',
      userId: '',
      partId: '',
      ppapId: '',
      otherPpapDocumentRequests: [],
      ppapDocumentRequests: [
        {
          documentNo: '',
          documentType: '',
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: '',
          buyerDocReviewStatus: '',
          documentStatus: '',
          deviationApproved: '',
          buyerComments: [],
          supplierComments: [],
          designerComments: []
        }
      ]
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  getPPAPDocuments: {
    url: '/api/v1/user/part/get/ppap',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      partId: '',
      partNumber: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  updatePPAPOtherDocuments: {
    url: '/api/v1/user/part/ppap/update',
    method: 'PUT',
    data: {
      roleId: '',
      userId: '',
      partId: '',
      ppapId: '',
      otherPpapDocumentRequests: [
        {
          documentNo: '',
          documentType: '',
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: '',
          buyerDocReviewStatus: '',
          documentStatus: '',
          deviationApproved: '',
          buyerComments: '',
          supplierComments: '',
          designerComments: ''
        }
      ],
      ppapDocumentRequests: []
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  forgotPassword: {
    url: '/api/v1/public/user/forgotpassword?email=:email&roleId=:roleId',
    method: 'PUT',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },

  resetPassword: {
    url: '/api/v1/public/user/newpassword',
    method: 'PUT',
    data: {
      roleId: '',
      password: '',
      token: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  searchQuotationData: {
    url: '/api/v1/user/quotation/part',
    method: 'POST',
    data: {
      roleId: '',
      partNumber: '',
      userId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  addSpecificationList: {
    url: '/api/v1/user/part/specification',
    method: 'POST',
    data: {
      roleId: '',
      listOfPartId: '',
      userId: '',
      listOfSpecificationRequest: [
        {
          mediaName: '',
          mediaURL: '',
          mediaType: '',
          mediaSize: '',
          mediaExtension: '',
          isDeleted: ''
        }
      ]
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getQuotationData: {
    url: '/api/v1/user/quotation/get',
    method: 'POST',
    data: {
      partId: '',
      roleId: '',
      userId: '',
      quotationId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getBuyerDetails: {
    url: '/api/v1/user/buyerlist',
    method: 'POST',
    data: {
      partId: '',
      roleId: '',
      userId: '',
      buyerId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  actionSummaryQuotationForPart: {
    url: '/api/v1/user/quotations/part',
    method: 'PUT',
    data: {
      partId: '',
      userId: '',
      roleId: '',
      sortByDeliveryDate: '',
      sortByTotalAmount: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  editProfile: {
    url: '/api/v1/user/add/update',
    method: 'PUT',
    data: {
      userDetailRequests: [
        {
          userId: 'string',
          firstName: 'string',
          lastName: 'string',
          password: 'string',
          designation: 'string',
          mobile: 'string',
          email: 'string',
          accessToken: 'string',
          isEnabled: false,
          profileImageURL: 'string',
          isPrimaryUser: false,
          emailOTP: 0,
          mobileOTP: 0,
          creatorUserId: 'string',
          roleId: 0,
          createdTimestamp: 0,
          lastUpdatedTimestamp: 0,
          userType: 'string',
          userProfile: 'string',
          addApproval: 'string',
          listOfOtherApprovers: ['string'],
          defaultApprover: 'string',
          departmentId: 'string',
          budgetPlanner: 'string',
          addressRequest: []
        }
      ],
      parentUserId: 'string',
      roleId: 0,
      emailOTP: 0
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getAllAddedUser: {
    url: '/api/v1/user/all/added/:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  submitVendor: {
    url: '/api/v1/user/register/supplier',
    method: 'POST',
    data: {
      userId: '',
      buyerId: '',
      partId: '',
      roleId: '',
      ndaDocument: '',
      globalPurchasingCode: '',
      listOfDocumentsOfSuppliers: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteUserProfile: {
    url:
      '/api/v1/user/delete/added?parentId=:parentId&roleId=:roleId&userId=:userId',
    method: 'DELETE',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  getPartHistory: {
    url: '/api/v1/user/part/history/full',
    method: 'POST',
    data: {
      userId: '',
      partId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getDashboardHistory: {
    url: '/api/v1/user/project/count/summary',
    method: 'POST',
    data: {
      userId: '',
      key: '',
      projectCode: '',
      pageNumber: 0,
      pageSize: 0,
      quotationCount: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  saveApprovalLimit: {
    url: '/api/v1/user/group',
    method: 'POST',
    data: {
      roleId: '',
      userId: '',
      currency: '',
      groupNumber: '',
      groupLimitAmount: '',
      groupMemberList: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getUserByGroup: {
    url: '/api/v1/user/group/get',
    method: 'POST',
    data: {
      roleId: '',
      userId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  updateApprovalLimit: {
    url: '/api/v1/user/group/update',
    method: 'PUT',
    data: {
      roleId: '',
      userId: '',
      id: '',
      currency: '',
      groupLimitAmount: '',
      groupMemberList: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  editPartDetail: {
    url: '/api/v1/user/part/all/edit',
    method: 'POST',
    data: {
      roleId: '',
      userId: '',
      pageNumber: '',
      pageSize: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  deletePartDetail: {
    url: '/api/v1/user/part/delete',
    method: 'DELETE',
    data: {
      roleId: '',
      userId: '',
      partId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  deletePartDatabase: {
    url: '/api/v1/user/part/media/delete',
    method: 'DELETE',
    data: {
      roleId: '',
      userId: '',
      partId: '',
      mediaUrl: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  updatePart: {
    url: '/api/v1/user/part/update',
    method: 'POST',
    data: {
      partRequest: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getDiscloserData: {
    url: '/api/v1/user/list/register/approval',
    method: 'POST',
    data: {
      roleId: '',
      userId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  approveRejectNonDisclosure: {
    url: '/api/v1/user/set/register/approval',
    method: 'PUT',
    data: {
      roleId: '',
      userId: '',
      approvalId: '',
      comments: '',
      status: '',
      supplierUserId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  affectedUserCheckBeforeDelete: {
    url:
      '/api/v1/user/ondelete/affected?parentId=:parentId&roleId=:roleId&userId=:userId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },
  getPartDetailsByPartNumber: {
    url: '/api/v1/user/part/search',
    method: 'POST',
    data: {
      roleId: '',
      userId: '',
      partNumber: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getUserDetails: {
    url: '/api/v1/user/get?roleId=:roleId&userId=:userId',
    method: 'GET',
    showResultMessage: true,
    showErrorMessage: true
  },
  updateUserProfile: {
    url: '/api/v1/user/update',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      firstName: '',
      lastName: '',
      //userProfile: "",
      mobile: '',
      email: '',
      profileImageURL: '',
      mobileOTP: '',
      emailOTP: '',
      companyLogoUrl: '',
      globalPurchasingCode: '',
      nonDisclosureAgreement: {}
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  checkToken: {
    url: '/api/v1/user/checkToken',
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: false
  },
  sendOtpForUpdate: {
    url: '/api/v1/user/update/send/otp?roleId=:roleId&userId=:userId&key=:key',
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },

  saveAudit: {
    url: '/api/v1/user/audit',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      researchAndDevRequest: '',
      qualityRequest: '',
      manufacturingRequest: '',
      environmentalAndCSRRequest: '',
      auditDocumentRequest: '',
      isOandOtherCertificateRequest: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getBusinessDetails: {
    url: '/api/v1/user/supplier/business',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  uploadTestimonial: {
    url: '/api/v1/user/upload/testimonial',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      buyerId: '',
      testmonialDocReq: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getUserProfileList: {
    url: '/api/v1/user/userprofile',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  generateOTPToEditUser: {
    url: '/api/v1/user/edit/otp?userId=:userId&roleId=:roleId',
    method: 'PUT',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  getCommentDetail: {
    url: '/api/v1/user/part/comments',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      partId: '',
      pageNumber: '',
      pageSize: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  submitComment: {
    url: '/api/v1/user/part/add/comments',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      approvalId: '',
      status: '',
      comment: '',
      partId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getPartNotification: {
    url: '/api/v1/user/notification/get',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      pageNumber: '',
      pageSize: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  clearNotification: {
    url: '/api/v1/user/notification/clear',
    method: 'PUT',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getPurchaseCategoryData: {
    url: '/api/v1/user/purchase/default/list',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  readNotification: {
    url: '/api/v1/user/notification/read',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      listOfNotificationIds: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getProjectListForIndirectPurchase: {
    url: '/api/v1/user/project/indirectpurchase/all',
    method: 'PUT',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getPartListByProject: {
    url: '/api/v1/user/part/indirectpurchase/refer',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      projectId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  submitIndirectPurchase: {
    url: '/api/v1/user/purchase/indirect/create',
    method: 'POST',
    data: {
      roleId: '',
      userId: '',
      indirectPurchaseRequestList: {}
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  checkAccountNo: {
    url: '/api/v1/user/purchase/account/check',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      accountNo: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getListOfIndirectPurchase: {
    url: '/api/v1/user/purchase/indirect/get',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  deleteOfIndirectPurchase: {
    url: '/api/v1/user/purchase/indirect/delete',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      listOfIds: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getCommentCount: {
    url: '/api/v1/user/part/comment/count/:partId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },
  savePurchaseData: {
    url: '/api/v1/user/purchase/indirect/category',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      listOfPurchaseCategories: {}
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getListOfRevisionUsers: {
    url: '/api/v1/user/unapproved?userId=:userId&roleId=:roleId',
    method: 'GET',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  savebudgetOneData: {
    url: '/api/v1/user/budget/create',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      revisionNo: '',
      forecastNo: '',
      forecastYear: 'string',
      budgetInputBy: 0,
      budgetGroupBy: 'string',
      budgetItemRequests: [],
      listOfApprovers: [],
      financialBudgetId: 'string',
      fromYear: '',
      toYear: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getCompanyDetails: {
    url: '/api/v1/user/company/details?userId=:userId&roleId=:roleId',
    method: 'GET',
    data: {},
    showResultMessage: true,
    showErrorMessage: true
  },
  createECOData: {
    url: '/api/v1/user/bom/eco/create',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      ecoDescription: 'string',
      priorityLevel: '',   
      ecoCategory: 'string',
      ecoChangeDescription: 'string',
      otherSpecialDescription: 'string',
      designer: 'string',  
      shippingPlantAddress: {},
      receivingPlantAddress: {},
      designLocation: {},
      listOfEcoRequest: [
        {
          ecoNumber: '',
          project: '',
          modelFamilyOfPart: '',
          modelOfPart: '',
          technicalTypeOfPart: '',
          variantOfPart: '',
          ecoBomXDataRequests: [
            {
              id: '',
              partToBeChanged: '',
              oldCost: 0,
              newEstimatedCost: 0,
              actualNewCost: 0,
              estimatedManufactureCostImpact: 0,
              actualManufactureCostImpact: 0,
              estimatedManufactureInvestment: 0,
              actualManufactureInvestment: 0,
              estimatedServiceCostImpact: 0,
              actualServiceCostImpact: 0,
              estimatedVendorTooling: 0,
              actualVendorTooling: 0,
              targetImplementationDate: 0,
              actualImplementationDate: 0,
              otherMandatoryEnggChangeForImplementationId: '',
              serialNumberBreakMandatory: 'No',
              serialNumberBreak: 'No',
              stockOnHand: '',
              stockOnOrder: '',
              stockInServiceParts: '',
              totalEstimatedScrap: 0,
              totalActualScrap: 0,
              paint: '',
              specialManufacturingInstructions: [],
              specialPackagingInstructions: [],
              partsInterchangeableInService: 'No',
              scrapPartsInService: 'No',
              specialServiceInstructions: '',
              apqpDesignReviewRecord: '',
              apqpManufacturingReviewRecord: '',
              apqpValidationTestingRecord: '',
              apqpDesignerId: '',
              apqpImplementedById: '',
              apqpQualityApprovalById: '',
              oldSupplier: '',
              oldSupplierPartNumber: '',
              newSupplier: '',
              newSupplierPartNumber: '',
              currentImage: {},
              newImage: {}
            }
          ]
        }
      ]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getECODropDownData: {
    url: '/api/v1/user/bom/eco/get/dropdowns',
    method: 'PUT',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  saveGeographicalData: {
    url: '/api/v1/user/admin/create/geographical/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      geoCostCenterRequests: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getGeographicalData: {
    url: '/api/v1/user/admin/get/geographical/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deleteGeographicalData: {
    url: '/api/v1/user/admin/delete/geographical/classification',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      id: '',
      globalRegionId: '',
      globalSubRegions: [],
      rowDeletion: ''
    },
    showResultMessage: true,
    showErrorMessage: false
  },
  getBuildPlanData: {
    url: '/api/v1/user/bom/project/buildplan/get',
    method: 'PUT',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  createBuildPlanData: {
    url: '/api/v1/user/bom/project/buildplan/create',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      listOfBuildPlanRevision: [
        {
          revisionNumber: '',
          listOfBuildPhase: [
            {
              buildPhase: '',
              listOfVariantBuildPlan: [
                {
                  bomOrVariant: '',
                  refrenceVariant: '',
                  variantDescription: '',
                  eco: '',
                  buildLocations: [
                    {
                      buildLocation: {},
                      noOfUnitsInTheBuild: '',
                      bufferParts: '',
                      buildInCharge: '',
                      materialAvailabilityTartgetDate: '',
                      buildFinishTargetDate: '',
                      productShipTargetDate: ''
                    }
                  ]
                }
              ]
            }
          ],
          listOfBuildPlanApprovers: []
        }
      ],
      project: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getECOPartDropDownData: {
    url: '/api/v1/user/part/by/project?projectId=:projectId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  getBOMBuildPlanDropDownData: {
    url: '/api/v1/user/bom/buildplan/dropdown?project=:projectId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  updateBuildPlanData: {
    url: '/api/v1/user/bom/project/buildplan/update',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      id: '',
      listOfBuildPlanRevision: [
        {
          revisionNumber: '',
          id: '',
          listOfBuildPhase: [
            {
              buildPhase: '',
              listOfVariantBuildPlan: [
                {
                  id: '',
                  bomOrVariant: '',
                  refrenceVariant: '',
                  variantDescription: '',
                  eco: '',
                  buildLocations: [
                    {
                      buildLocation: {},
                      noOfUnitsInTheBuild: '',
                      bufferParts: '',
                      buildInCharge: '',
                      materialAvailabilityTartgetDate: '',
                      buildFinishTargetDate: '',
                      productShipTargetDate: ''
                    }
                  ]
                }
              ]
            }
          ],
          listOfBuildPlanApprovers: []
        }
      ]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getApproverData: {
    url: '/api/v1/user/buildplan/approvers?userId=:userId&roleId=:roleId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },

  addApproverUser: {
    url: '/api/v1/user/bom/buildplan/approvers/add',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      approverIds: [],
      buildPlanRevisionId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  addCommentOfRevision: {
    url: '/api/v1/user/bom/buildplan/set/approval',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      approvalStatus: '',
      buildPlanRevision: '',
      comment: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getRegionDetails: {
    url: '/api/v1/user/admin/get/region',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      region: '',
      regionTwo: '',
      classificationFor: ''
      //  listOfRegions: []
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  saveClassificationData: {
    url: '/api/v1/user/admin/create/added/geographical/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      geoCostCenterRequests: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getAllProjectList: {
    url: '/api/v1/user/project/allcompanyprojects',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },

  saveSpendingCategoryData: {
    url: '/api/v1/user/admin/create/spending/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      listOfMajorCategory: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getSpendingCategoryData: {
    url: '/api/v1/user/admin/get/category',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deleteSpendingCategoryData: {
    url: '/api/v1/user/admin/delete/spending/classification',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      listOfIds: [],
      classificationType: ''
    },
    showResultMessage: true,
    showErrorMessage: false
  },

  saveFunctionalAreaData: {
    url: '/api/v1/user/admin/create/department/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      listOfDept: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getFunctionalAreaData: {
    url: '/api/v1/user/admin/get/department/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deleteFunctionalAreaData: {
    url: '/api/v1/user/admin/delete/department/classification',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      id: ''
    },
    showResultMessage: true,
    showErrorMessage: false
  },

  saveProductCostData: {
    url: '/api/v1/user/admin/create/productline/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      listOfSectorCategory: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getProductCostData: {
    url: '/api/v1/user/admin/get/productline/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deleteProductCostData: {
    url: '/api/v1/user/admin/delete/productline/classification',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      id: ''
    },
    showResultMessage: true,
    showErrorMessage: false
  },

  saveBrandCostData: {
    url: '/api/v1/user/admin/create/brand/classification',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      listOfBrands: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getBrandCostData: {
    url: '/api/v1/user/admin/get/brand',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deleteBrandCostData: {
    url: '/api/v1/user/admin/delete/brand/classification',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      id: ''
    },
    showResultMessage: true,
    showErrorMessage: false
  },
  getBOMVariantData: {
    url: '/api/v1/user/bom/variant/get?projectId=:projectId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  getBOMSubVariantData: {
    url:
      '/api/v1/user/bom/get?bomId=:bomId&index=:index&partContaingBomId=:partContaingBomId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },

  saveFinancialYearData: {
    url: '/api/v1/user/budget/financial',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      annualOperationPlan: {},
      yearStartFrom: '',
      monthStartFrom: '',
      forecasts: [{}],
      budgetCycle: '',
      id: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getFinancialYearData: {
    url: '/api/v1/user/budget/get/financial',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getProductLineData: {
    url: '/api/v1/user/bom/productLine/all',
    method: 'PUT',
    data: {
      userId: '',
      roleId: 0
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getModelFamilyData: {
    url: '/api/v1/user/bom/modelfamily/all?productLineId=:productLineId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: false
  },

  saveLocationData: {
    url: '/api/v1/user/admin/update/locations',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      addressRequests: [{}]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getLocationData: {
    url: '/api/v1/user/admin/get/locations',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getPartByKeyword: {
    url:
      '/api/v1/user/part/by/keyword?keyword=:keyword&projectId=:projectId&bomId=:bomId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  getClassificationsData: {
    url: '/api/v1/user/purchase/get/classifications',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      classificationType: '',
      id: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getBOMCalculationData: {
    url: '/api/v1/user/bom/get/calculation/table/?bomId=:bomId&index=:index',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  updateBOMData: {
    url: '/api/v1/user/bom/update',
    method: 'PUT',
    data: {
      userId: '',
      roleId: 0,
      billOfMaterialRequests: [
        {
          id: '',
          bomCode: '',
          partnumber: '',
          bomDescription: '',
          quantity: 0,
          uom: '',
          bomlevel: 0,
          levelType: '',
          levelName: '',
          oldCost: 0,
          newCost: 0,
          manufactureImpact: '',
          stock: '',
          onOrder: '',
          servicePartDepot: '',
          servicePartDisposition: '',
          specialManufaturingInstruction: '',
          specialServiceInstruction: ''
        }
      ]
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getPurchaseData: {
    url: '/api/v1/user/purchase/all',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getDescriptionData: {
    url: '/api/v1/user/purchase/description',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      brandId: '',
      subBrandId: '',
      departmentId: '',
      subDepartmentId: '',
      teamId: '',
      majorCategoryId: '',
      categoryId: '',
      subCategoryId: '',
      subSubCategoryId: '',
      sectorId: '',
      productLineId: '',
      modelFamilyId: '',
      programId: '',
      geogrophyId: '',
      globalRegionId: '',
      globalSubRegionId: '',
      countryId: '',
      zone: '',
      localBussinessRegion: '',
      district: '',
      circle: '',
      area: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deletePurchaseData: {
    url: '/api/v1/user/purchase/category/delete',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      id: ''
    },
    showResultMessage: true,
    showErrorMessage: false
  },
  getSuggessionData: {
    url: '/api/v1/user/suggession',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      firstName: '',
      isBudgetPlanner: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getAccountNumberData: {
    url: '/api/v1/user/purchase/get/accountNo',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      brandId: '',
      subBrandId: '',
      departmentId: '',
      subDepartmentId: '',
      teamId: '',
      majorCategoryId: '',
      categoryId: '',
      subCategoryId: '',
      subSubCategoryId: '',
      sectorId: '',
      productLineId: '',
      modelFamilyId: '',
      programId: '',
      geogrophyId: '',
      globalRegionId: '',
      globalSubRegionId: '',
      countryId: '',
      zone: '',
      localBussinessRegion: '',
      district: '',
      circle: '',
      area: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getBudgetExtraData: {
    url: '/api/v1/user/budget/dropdowns',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      revisionNo: '',
      forecastNo: '',
      forecastYear: '',
      listBy: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getBOMECOFilter: {
    url: '/api/v1/user/bom/filtered/get',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      projectId: '',
      modelFamilyId: '',
      modelId: '',
      variantId: '',
      technnicalTypeId: ''
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getSuggessionFilterData: {
    url: '/api/v1/user/bom/filtered/part',
    method: 'PUT',
    data: {
      userId: '',
      roleId: '',
      projectId: '',
      modelFamilyId: '',
      modelId: '',
      technnicalTypeId: '',
      variantId: '',
      searchKeyword: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  getWhereUsedData: {
    url: '/api/v1/user/bom/whereused?partId=:partId',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
  getFindAllBOMData: {
    url: '/api/v1/user/bom/findall',
    method: 'POST',
    data: {
      listOfBomIds: []
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  deleteOfBudget: {
    url: '/api/v1/user/budget/delete/detail',
    method: 'DELETE',
    data: {
      userId: '',
      roleId: '',
      listOfIds: []
    },
    showResultMessage: false,
    showErrorMessage: true
  },
  getBudgetData: {
    url: '/api/v1/user/budget/get/approvals',
    method: 'POST',
    data: {
      userId: '',
      roleId: ''
    },
    showResultMessage: false,
    showErrorMessage: false
  },
  setBudgetApprovalData: {
    url: '/api/v1/user/budget/set/approval',
    method: 'POST',
    data: {
      userId: '',
      roleId: '',
      levelOfApproval: '',
      approvalStatus: '',
      id: '',
      comment: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getSuggessionUserData: {
    url: '/api/v1/user/search?userId=:userId&roleId=:roleId&keyword=:keyword',
    method: 'GET',
    data: {},
    showResultMessage: false,
    showErrorMessage: true
  },
};
