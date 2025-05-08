const PayU = require("payu-websdk");
const dotenv = require("dotenv");
dotenv.config();

const payu_key = process.env.PAYU_MERCHANT_KEY;
const payu_salt = process.env.PAYU_SALT;
const payu_mode = process.env.PAYU_MODE || "test" ;  // Make sure you check for 'test' or 'production'


const payuClient = new PayU({
  key: payu_key,
  salt: payu_salt,
  env: payu_mode // This should be in the right position
});

module.exports = { payuClient };
