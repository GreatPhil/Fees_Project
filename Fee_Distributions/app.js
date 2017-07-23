// "include" express:
const express = require("express");
const app = express();

// "include" app modules:
const constants = require("./utilities/constants.js");
const utilities = require("./utilities/utilities.js");
const api       = require("./api/api.js");


// End Point 1: Returns a JSON summary to the client containing the summary of
// order price information (i.e price per order item, and total order price)
// given an array of order numbers.
app.get("/orderPriceSummary/:input_array", api.orderPriceSummary);

// End Point 2: Returns a JSON summary to the client containing the summary of
// order distribution information (i.e distribution of the fees from the order
// to each fund, per rules in distributions.json)
app.get("/orderDistributions/:input_array", api.orderDistributions);


// Start the server:
app.listen(3000, function () {
  console.log("Listening on port 3000.");
});
