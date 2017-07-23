//**********************************************************************
// file name: utilities.js
//  - Implements utility functions for fees.js, distributions.js, and the API.
//**********************************************************************

var fs = require("fs");

// Reads the input fees JSON file:
var _load_fees = function() {
  return JSON.parse(fs.readFileSync("./data/fees.json", "utf8"));
}

// Reads the input orders JSON file:
var _load_orders = function() {
  return JSON.parse(fs.readFileSync("./data/orders.json", "utf8"));
}

// Calculates the total price for the order item, given a type, number of pages,
// and the fees array imported from data/fees.json.  NOTE: In the case of a
// duplicate order item type within the fees_array, this function adds each
// instance of the order item type's fees to the total item price.  Therefore,
// the order item type is NOT considered a unique key within the fees array.

var _item_price = function(type, pages, fees_array) {

  var current_fee;  // current fee
  var total = 0;    // total of all fees

  // Generic local counters:
  var i, j;

  // Search fees array for matching item types:
  for (i in fees_array) {
    if (fees_array[i].order_item_type === type) {

      // Loop through all fees for the matching item type:
      for (j in fees_array[i].fees) {
        current_fee = fees_array[i].fees[j];

        switch(current_fee.type) {

          case FLAT_FEE:
            total += parseFloat(current_fee.amount);
            break;

          case PAGE_FEE:
            total += Math.max((parseFloat(current_fee.amount) * (pages-1)), 0);
            break;

          default:
            break;
        }

      } // for (j in fees[i].fees)
    } // if (fees[i].order_item_type === type)
  } // for (i in fees)

  return total;

}

// Updates the fee distributions (dist), given an item type and number of pages
// for a new order item.  If the item type is new to the dist object and has new
// funds associated with it, this functuion adds the new fund AND the fees
// associated with it.  Otherwise, it just adds the fees to a pre-existing
// attribute with the matching fund name.  All remaining fees will go into a
// catch-all "Other" fund.  NOTE: The dist object is an object for holding key-
// value pairs in which the Key = Fund name, and Value = Fee distribution amount.

var _update_distributions = function(type, pages, fees_array, dist) {

  var i, j;      // Generic local counters
  var sum_dist;  // Sum of distributions (remainder goes to "Other")

  // Search fees array for matching item types:
  for (i in fees_array) {
    if (fees_array[i].order_item_type === type) {

      // Initialize sum of distributions
      sum_dist = 0;

      // Loop through all distributions for the matching item type:
      for (j in fees_array[i].distributions) {

        // Get fund name and amount:
        var current_distr = fees_array[i].distributions[j];
        var fund_name     = current_distr.name;
        var amount        = parseFloat(current_distr.amount);

        // Add to "output" distributions:
        if (!(fund_name in dist)) {
          dist[fund_name] = amount;
        } else {
          dist[fund_name] += amount;
        }

        // Increment total distributions
        sum_dist += amount;

      }

      // Put remainder in "Other" fund distribution
      if (!("Other" in dist)) {
        dist.Other = _item_price(type, pages, fees_array) - sum_dist;
      } else {
        dist.Other += _item_price(type, pages, fees_array) - sum_dist;
      }

    } // if (fees_array[i].order_item_type === type)
  } // for (i in fees_array)

}


// Export all utilities:
module.exports = {
  load_fees            : _load_fees,
  load_orders          : _load_orders,
  item_price           : _item_price,
  update_distributions : _update_distributions
};
