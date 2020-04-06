const { Application, genesisBlockDevnet, configDevnet } = require("lisk-sdk");

const {
  RegisterBoardMemberTransaction,
  RegisterInvestorTransaction,
  AddPollTransaction,
  CastVoteTransaction
} = require("./transactions");

configDevnet.app.label = "Decentra_Organization_Chain";
configDevnet.components.storage.password = "password";
configDevnet.modules.http_api.access.public = true;

const app = new Application(genesisBlockDevnet, configDevnet);

app.registerTransaction(RegisterBoardMemberTransaction);
app.registerTransaction(RegisterInvestorTransaction);
app.registerTransaction(CastVoteTransaction);
app.registerTransaction(AddPollTransaction);

app
  .run()
  .then(() => app.logger.info("App started..."))
  .catch(error => {
    console.error("Faced error in application", error);
    process.exit(1);
  });
