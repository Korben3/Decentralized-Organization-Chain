const { RegisterBoardMemberTransaction } = require("../transactions");
const transactions = require("@liskhq/lisk-transactions");
const { EPOCH_TIME } = require("@liskhq/lisk-constants");
const { APIClient } = require("@liskhq/lisk-api-client");

// config
const client = new APIClient(["http://167.179.98.242:4000"]); // SDK test server
const passphrase = ""; // enter a passphrase

const getTimestamp = () => {
  const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
  const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
  return parseInt(inSeconds);
};

const tx = new RegisterBoardMemberTransaction({
  asset: {
    user: {
      name: "Alset",
      type: "board" // board or investor
    }
  },
  amount: 0,
  fee: `${transactions.utils.convertLSKToBeddows("100000")}`,
  recipientId: "123L",
  timestamp: getTimestamp()
});

tx.sign(passphrase);

client.transactions
  .broadcast(tx.toJSON())
  .then(res => {
    console.log(res.data.message);
  })
  .catch(res => {
    console.log("\nTransaction failed:");
    console.log(res);
  });
