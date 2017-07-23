//**********************************************************************
// file name: api.js
//  - Implements API end points:
//     1) orderPriceSummary  - Returns to client a JSON summary of order prices
//     2) orderDistributions - Returns to client a JSON summary of order fund distributions
//**********************************************************************

// "include" utilities:
const utilities = require("./../utilities/utilities.js");


// orderPriceSummary -- Implements End Point #1.  This takes as input an array
// of order numbers, and returns to the client a JSON response containing the
// order item prices and total order price.
//
// JSON Structure for HTTP response data to the client is:
//  [
//    {
//      "order_number": <order #>,
//      "order_items": [
//        {
//          "item_id": <item id #>,
//          "price": <$item_price>
//        }
//        ...
//      ],
//      "total_price": <$total_price>
//    },
//    ...
//  ]
//

const _orderPriceSummary = function (req, res) {

  var i, j, k;              // Generic local counters
  var order_ref;            // Object containing SERVER order info
  var order_obj;            // Object to hold CLIENT order info
  var order_item_obj;       // Object to hold CLIENT order item info
  var order_partial_price;  // Price for the single order item (for CLIENT)
  var order_total_price;    // Total price for the order (for CLIENT)

  // Read input JSON files (i.e. Server Data)
  var fee_data   = utilities.load_fees();
  var order_data = utilities.load_orders();

  // Get array of input order numbers (from Client)
  var input_orders = JSON.parse(req.params.input_array);

  // Initialize output array for the HTTP response
  var output_array = [];

  // Loop through input order numbers
  for (i in input_orders) {

    // Push new order object to output array
    output_array.push({"order_number" : input_orders[i]});
    order_obj = output_array[i];

    // Find matching order number in Server's order data
    for (j in order_data) {
      if (input_orders[i] === parseInt(order_data[j].order_number)) {

        // Initialize order items array and total price
        order_obj.order_items = [];
        order_total_price = 0;

        // Process all order items
        for (k in order_data[j].order_items) {

          order_ref = order_data[j].order_items[k];

          // Create new order item object
          order_item_obj = {"item_id" : order_ref.order_item_id};

          // Add order item price
          order_partial_price = utilities.item_price(order_ref.type, order_ref.pages, fee_data);
          order_item_obj.price = order_partial_price;
          order_total_price += order_partial_price;

          // Push order item to output array
          order_obj.order_items.push(order_item_obj);

        }

        // Update total order price
        order_obj.total_price = order_total_price;

      }
    }
  }

  // Send JSON back to client:
  res.json(output_array);
  console.log("Server responded to Order Price Summary Request.");

}


// orderDistributions -- Implements End Point #2.  This takes as input an array
// of order numbers, and returns to the client a JSON response containing the
// fund distributions for the order
//
// JSON Structure for HTTP response data to the client is:
//  [
//    {
//      "order_number": <order #>,
//      "funds": {
//        <fund_name> : <$fund_distribution>
//        ...
//      }
//    },
//    ...
//  ]
//

const _orderDistributions = function(req, res) {

  var i, j, k;      // Generic local counters
  var order_ref;    // Object containing SERVER order info
  var order_obj;    // Object to hold CLIENT order info
  var funds_obj;    // Object to hold CLIENT funds info

  // Read input JSON files (i.e. Server Data)
  var fee_data   = utilities.load_fees();
  var order_data = utilities.load_orders();

  // Get array of input order numbers (from Client)
  var input_orders = JSON.parse(req.params.input_array);

  // Initialize output array for the HTTP response
  var output_array = [];

  // Loop through input order numbers
  for (i in input_orders) {

    // Push new order object to output array
    output_array.push({"order_number" : input_orders[i]});
    order_obj = output_array[i];

    // Initialize the funds distributions array for the current order
    funds_obj = {};

    // Find matching order number in the server's order data
    for (j in order_data) {
      if (input_orders[i] === parseInt(order_data[j].order_number)) {

        // Add fee distributions from each order item
        for (k in order_data[j].order_items) {
          order_ref = order_data[j].order_items[k];
          utilities.update_distributions(order_ref.type, order_ref.pages, fee_data, funds_obj);
        }

      }
    }

    // Update funds
    order_obj.funds = funds_obj;

  }

  // Send JSON back to client:
  res.json(output_array);
  console.log("Server responded to Order Funds Distributions Request.");

}


// Export all API endpoint implementations:
module.exports = {
  orderPriceSummary  : _orderPriceSummary,
  orderDistributions : _orderDistributions
};
