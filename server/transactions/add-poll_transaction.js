const {
  BaseTransaction,
  TransactionError,
  utils
} = require("@liskhq/lisk-transactions");

class AddPollTransaction extends BaseTransaction {
  static get TYPE() {
    return 103;
  }

  static get FEE() {
    return utils.convertLSKToBeddows("1000");
  }

  async prepare(store) {
    await store.account.cache([
      {
        address: this.senderId
      },
      {
        address: this.recipientId
      }
    ]);
  }

  validateAsset() {
    const errors = [];

    let { poll } = this.asset;

    if (
      !poll.question ||
      typeof poll.question !== "string" ||
      poll.question.length < 20 ||
      poll.question.length > 256
    ) {
      errors.push(new TransactionError("Poll question missing or invalid."));
    }

    if (poll.votes) {
      errors.push(new TransactionError("Poll cannot start with votes."));
    }

    let answersLength = Object.keys(poll.answers).length;
    if (answersLength < 2 || answersLength > 5) {
      errors.push(
        new TransactionError(
          this.id,
          "Poll object has a minimum of 2 and maximum of 5 answers."
        )
      );
    }

    // loop through answers and validate
    const answers = Object.values(poll.answers);
    for (const answer of answers) {
      if (answer.length < 2 || answer.length > 128) {
        errors.push(new TransactionError("Only 128 characters allowed."));
      }
    }

    return errors;
  }

  applyAsset(store) {
    const errors = [];

    const sender = store.account.get(this.senderId);

    // check if sender is registered as a board member and allowed to add a poll
    if (sender.asset.user.type !== "board") {
      errors.push(
        new TransactionError("Sender is not registered as a board member.")
      );
    } else {
      let { poll } = this.asset;

      console.log(`log: ${JSON.stringify(poll)}`);

      const recipient = store.account.getOrDefault(this.recipientId);

      // check if address already contains a poll, we don't want people overwriting it
      if (!recipient.asset.poll) {
        recipient.asset.poll = poll;
        recipient.asset.timestamp = this.timestamp; // add timestamp of transaction/ creating of poll
        store.account.set(recipient.address, recipient);
      } else {
        errors.push(
          new TransactionError("Recipient address already contains a poll.")
        );
      }
    }
    return errors;
  }

  undoAsset(store) {
    // remove the added poll
    const errors = [];

    const recipient = store.account.get(this.recipientId);

    recipient.asset.poll = null;
    recipient.asset.timestamp = null;
    store.account.set(recipient.address, recipient);

    return errors;
  }
}
module.exports = AddPollTransaction;
