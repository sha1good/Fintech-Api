const mongoose = require("mongoose");
const verifyToken = require("../util/verifyToken");
const router = require("express").Router();
const crypto = require("crypto");
const createError = require("../util/error");
const WALLETID = require("../util/global");
const PlaceLienRequest = require("../models/placeLien/PlaceLienRequest");

router.post("/lien/place", verifyToken, async (request, response, next) => {
  const getRequestHmac = (key, str) => {
    if (str === null) {
      next(createError("All the required field should be set"));
    }
    let hmac = crypto.createHmac("sha512", key);
    let signed = hmac.update(str).digest("hex");
    return signed;
  };
  const getResponseHmac = (key, str) => {
    //console.log(str);
    if (str === null) {
      next(createError("All the required field should be set"));
    }
    let hmac = crypto.createHmac("sha512", key);
    let signed = hmac.update(str).digest("hex");
    return signed;
  };

  const reqInvalidMacData = getRequestHmac(
    "test",
    request.body.transactionReference +
      request.body.requestId +
      request.body.walletId +
      request.body.amount +
      request.body.currencyCode
  );

  const reqMacData = getRequestHmac(
    "test",
    request.body.transactionReference +
      request.body.requestId +
      request.body.walletId +
      request.body.amount +
      request.body.currencyCode +
      request.body.stan +
      request.body.rrn +
      request.body.transactionFee
  );

  try {
    const placeLienRequest = new PlaceLienRequest({
      ...request.body,
      mac: reqMacData,
    });
    await placeLienRequest.save();

    const resMacData = getResponseHmac(
      "test",
      request.body.transactionReference + request.body.requestId + "00"
    );

    const inSufficientMacData = getResponseHmac(
      "test",
      request.body.transactionReference + request.body.requestId + "51"
    );

    const resInvalidMacData = getResponseHmac(
      "test",
      request.body.transactionReference + request.body.requestId + "12"
    );

    if (+request.body.amount > +WALLETID.walletBalance) {
      response.status(200).json({
        responseCode: "51",
        amount: request.body.amount,
        transactionReference: request.body.transactionReference,
        requestId: request.body.requestId,
        mac: inSufficientMacData,
      });
    } else if (reqInvalidMacData) {
      response.status(200).json({
        responseCode: "12",
        amount: request.body.amount,
        transactionReference: request.body.transactionReference,
        requestId: request.body.requestId,
        mac: resInvalidMacData,
      });
    } else {
      response.status(200).json({
        responseCode: "00",
        amount: request.body.amount,
        transactionReference: request.body.transactionReference,
        requestId: request.body.requestId,
        mac: resMacData,
      });
    }
  } catch (error) {
    next(createError(error.status, error.message));
  }
});

module.exports = router;
