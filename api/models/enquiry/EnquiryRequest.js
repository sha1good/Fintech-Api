//const  LocalDate= require("@js-joda/core").LocalDate;
 const mongoose = require("mongoose");
 const EnquirySchema =  mongoose.Schema( {
  requestId: {
    type: String,
    required: true,
  },
  walletId: {
    type: String,
    required: true,
    unique: true,
  },
  transactionReference: {
    type: String,
    required: true,
},
  mac: {
    type: String,
    required: true,
 },
  transactionDateTime: {
    type: Date,
    required: true,
},
  terminalId: {
    type: String,
    required: true,
},
  terminalType: {
    type: String,
    required: true,
 },
  terminalType: {
    type: String,
    required: true,
},
  merchantId: {
    type: String,
    required: true,
   },
  acquiringInstitutionId: {
    type: String,
    required: true,
   
  },
  currencyCode: {
    type: String,
    required: true,
   
  },
  cardAcceptorNameLocation: {
    type: String,
    required: true,
   
  },
  rrn: {
    type: String,
    required: true,
   
  },
  stan: {
    type: String,
    required: true,
   
  },
 additionalFields :{
    processingCode: String,
    merchantType: String,
  }
},
{ timestamps: true }
 )


module.exports = mongoose.model("Enquiry", EnquirySchema);