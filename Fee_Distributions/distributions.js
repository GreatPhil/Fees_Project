const constants = require("./utilities/constants.js");
const utilities = require("./utilities/utilities.js");

// Read Input JSON files:
var fee_data   = utilities.load_fees();
var order_data = utilities.load_orders();

// Print Report:
print_output();


// Prints the order distribution summary to the console.  This includes the
// order number, fee distributions for any funds associated with the items
// on the order.  This function also prints a summary of the total fee
// distributions for all funds for all orders.  NOTE: Total_distributions and
// order_distributions are objects for holding key-value pairs in which the Key
// = Fund name, and Value = Fee distribution amount.

function print_output() {

  var total_distributions = {};  // Fee distributions for all orders
  var order_distributions = {};  // Fee distributions for current order

  var order;                     // Current order
  var order_item;                // Current order item

  for (i in order_data) {

    order = order_data[i];

    // Print order number
    console.log("Order ID: " + order.order_number);

    // Re-initialize fee distributions for the current order
    order_distributions = {};

    // Add fee distributions from each order item
    for (j in order.order_items) {

      order_item = order.order_items[j];

      utilities.update_distributions(order_item.type, order_item.pages, fee_data, order_distributions);
      utilities.update_distributions(order_item.type, order_item.pages, fee_data, total_distributions);

    }

    // Print the total for each fee distribution in the Current Order
    for (j in order_distributions) {
      if (j != "Other") {
        console.log("  Fund - " + j + ": $" + order_distributions[j]);
      }
    }

    // Print "Other" fee distribution last
    console.log("  Fund - Other: $" + order_distributions.Other);
    console.log(" ");

  } // for (i in order_data)

  // Print the total Per-Fund fee distributions
  console.log("Total distributions:");

  for (i in total_distributions) {
    if (i != "Other") {
      console.log("  Fund - " + i + ": $" + total_distributions[i]);
    }
  }

  // Print "Other" fee distribution last
  console.log("  Fund - Other: $" + total_distributions.Other);

}
