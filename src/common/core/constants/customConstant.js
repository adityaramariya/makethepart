let amazonURL = () => {
  let amazonURL = "";
  switch (window.location.hostname) {
    case "103.76.253.133":
      amazonURL = "https://s3.ap-south-1.amazonaws.com/dev-makethepart/";
      break;
    case "103.76.253.134":
      amazonURL = "https://s3.ap-south-1.amazonaws.com/qa-makethepart/";
      break;
    case "qa1.lmsin.com":
      amazonURL = "https://s3.ap-south-1.amazonaws.com/qa-makethepart/";
      break;
    default:
      amazonURL = "https://s3.ap-south-1.amazonaws.com/dev-makethepart/";
      break;
  }
  return amazonURL;
};

export default {
  paginationPerPageSize: 15,
  amazonURL: amazonURL(),
  acceptedFormat: {
    imageAcceptFormat:
      "image/jpeg, image/png, image/gif, video/mp4, video/webm",
    documentAcceptFormat: ".doc, .docx, .pdf, .txt, .tex, .xls, .xlxs"
  },

  urlForDownload: {
    NDA_document_url:
      "https://s3.ap-south-1.amazonaws.com/dev-makethepart/contract-nda.doc"
  },

  webNotificationURL: {
    node_server_URL: "103.76.253.133:5000"
  }
};
