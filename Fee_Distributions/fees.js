const constants = require("./utilities/constants.js");
const utilities = require("./utilities/utilities.js");

// Read Input JSON files:
var fee_data   = utilities.load_fees();
var order_data = utilities.load_orders();

// Print Report:
print_output();


// Prints the order summary to the console.  This includes the order number,
// price for each order item within the order, and total price.  This function
// repeats this for each order in the order_data array (or orders.json file).

function print_output() {

  var order;              // current order
  var order_item;         // current order item
  var order_item_price;   // price for current order item
  var order_total_price;  // price for total order

  for (i in order_data) {

    order = order_data[i];
    order_total_price = 0;

    // Print order number
    console.log("Order ID: " + order.order_number);

    // Calculate and print prices for each order
    for (j in order.order_items) {

      order_item = order.order_items[j];

      // Calculate item price and update total order price
      order_item_price = utilities.item_price(order_item.type, order_item.pages, fee_data);
      order_total_price += order_item_price;

      // Print the order item price
      console.log("   Order item " + order_item.type + ": $" + order_item_price);

    }

    // Print the TOTAL order price
    console.log("   Order total: $" + order_total_price);
    console.log(" ");

  }
}
