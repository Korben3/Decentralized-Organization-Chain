const {
  BaseTransaction,
  TransactionError,
  utils
} = require("@liskhq/lisk-transactions");

class RegisterInvestorTransaction extends BaseTransaction {
  static get TYPE() {
    return 101;
  }

  static get FEE() {
    return utils.convertLSKToBeddows("1000");
  }

  async prepare(store) {
    await store.account.cache([
      {
        address: this.senderId
      }
    ]);
  }

  validateAsset() {
    const errors = [];

    // get the user object and validate each property
    let { user } = this.asset;

    if (!user.name || typeof user.name !== "string" || user.name.length > 32) {
      errors.push(new TransactionError("User name missing or invalid."));
    }

    if (!user.type || user.type !== "investor") {
      errors.push(
        new TransactionError("Invalid user type for this transaction.")
      );
    }

    if (Object.keys(this.asset).length > 1) {
      errors.push(
        new TransactionError(this.id, "Only one user object allowed.")
      );
    }

    if (Object.keys(user).length > 2) {
      errors.push(
        new TransactionError(
          this.id,
          "User object contains incorrect properties."
        )
      );
    }

    return errors;
  }

  applyAsset(store) {
    const sender = store.account.get(this.senderId);

    let { user } = this.asset;
    sender.asset.user = user;
    store.account.set(sender.address, sender);

    return [];
  }

  undoAsset(store) {
    const errors = [];
    const sender = store.account.get(this.senderId);

    sender.asset.user = null;
    store.account.set(sender.address, sender);
    return errors;
  }
}
module.exports = RegisterInvestorTransaction;
