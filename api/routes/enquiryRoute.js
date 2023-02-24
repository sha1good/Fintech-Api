const verifyToken = require("../util/verifyToken");
const router = require("express").Router();
const crypto = require("crypto");
const createError = require("../util/error");
const EnquiryRequest = require("../models/enquiry/EnquiryRequest");
const WALLETID = require("../util/global");

router.post("/enquiry", verifyToken, async (request, response, next) => {
  const getRequestHmac = (key, str) => {
    if (
      str.transactionReference === null ||
      str.requestId === null ||
      str.walletId
    ) {
      next(createError(12, "All the required field should be set"));
    }

    if (str.transactionReference === null || str.requestId) {
      next(createError(12, "Invalid valid macData"));
    }
    let hmac = crypto.createHmac("sha512", key);
    let signed = hmac.update(str).digest("hex");
    return signed;
  };
  const getResponseHmac = (key, str) => {
    //console.log(str);
    if (str === null) {
      throw Error("All the required field should be set");
    }
    let hmac = crypto.createHmac("sha512", key);
    let signed = hmac.update(str).digest("hex");
    return signed;
  };

  try {
    const reqMacData = getRequestHmac(
      "test",
      request.body.transactionReference +
        request.body.requestId +
        request.body.walletId +
        request.body.stan +
        request.body.rrn
    );
    const newEquiryRequest = new EnquiryRequest({
      ...request.body,
      mac: reqMacData,
    });
    await newEquiryRequest.save();

    // await EnquiryRequest.create({
    //   ...request.body,
    //   mac: reqMacData,
    // });

    const responseInvalidMacData = getResponseHmac(
      "test",
      request.body.transactionReference + request.body.requestId
    );

    const responseMacData = getResponseHmac(
      "test",
      request.body.transactionReference +
        request.body.requestId +
        WALLETID.walletBalance +
        "Sheriff Adebisi" +
        "00"
    );

    if (request.body === null || !request.body) {
      //console.log("entered");
      response.status(200).json({
        responseCode: "05",
        name: "Sheriff",
        transactionReference: request.body.transactionReference,
        requestId: request.body.requestId,
        mac: responseInvalidMacData,
      });
    }

    
    response.status(200).json({
      responseCode: "00",
      name: "Sheriff",
      transactionReference: request.body.transactionReference,
      requestId: request.body.requestId,
      mac: responseMacData,
    });
  } catch (error) {
    //console.log(error);
    next(createError(error.status, error.message));
  }
});

module.exports = router;
