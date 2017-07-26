# Fees_Project:

This project implements the response to challenge.md in Javascript, and runs
in Node.js.  To execute challenges part 1 and part 2, download this project,
navigate to the directory where it is stored, and enter:

- node fees.js
- node distributions.js

To execute part 3 of the challenge, make sure the node modules are up-to-date.
This may include ("npm install express --save").  After than, enter:

- node app.js

This will start the server on the local host.  Then, open a browser and type in:

- http://localhost:3000/orderPriceSummary/[<order_num_1>,<order_num_2>...]

or

- http://localhost:3000/orderDistributions/[<order_num_1>,<order_num_2>...]

Replace the order_nums with any order number of interest.  The API should return
a JSON message with the requested content.  To see the format for the JSON
message, please take a look at the comments in api/api.js.
