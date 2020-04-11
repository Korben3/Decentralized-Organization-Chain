import {
  BaseTransaction,
  TransactionError,
  utils
} from "@liskhq/lisk-transactions";
const { EPOCH_TIME } = require("@liskhq/lisk-constants");

export class CastVoteTransaction extends BaseTransaction {
  static get TYPE() {
    return 104;
  }

  static get FEE() {
    return utils.convertLSKToBeddows("100");
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

    let { vote } = this.asset;

    if (!vote || typeof vote !== "number" || vote < 1 || vote > 5) {
      errors.push(new TransactionError("Incorrect vote asset."));
    }

    if (Object.keys(this.asset).length > 1) {
      errors.push(new TransactionError("Only one vote asset allowed."));
    }

    return errors;
  }

  applyAsset(store) {
    const errors = [];

    let { vote } = this.asset;

    const recipient = store.account.get(this.recipientId);

    const sender = store.account.get(this.senderId);

    // check if sender is registered as a board member or investor and allowed to vote
    if (
      sender.asset.user.type !== "board" &&
      sender.asset.user.type !== "investor"
    ) {
      errors.push(
        new TransactionError(
          "Sender is not registered as a board member or investor."
        )
      );
    } else {
      // check if address contains a poll
      if (recipient.asset.poll) {
        // check if poll still active, if not throw an error
        const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
        const inSeconds = (millisSinceEpoc / 1000).toFixed(0);
        let currentTimestamp = parseInt(inSeconds);
        let pollTimestamp = recipient.asset.timestamp;
        const maxPollTime = 604800; // seconds, default = 604800, 7 days

        console.log(`current time: ${currentTimestamp}`);
        console.log(`poll time: ${pollTimestamp}`);
        if (currentTimestamp - pollTimestamp < maxPollTime) {
          // check if vote <=answers
          let answersLength = Object.keys(recipient.asset.poll.answers).length;
          if (vote <= answersLength) {
            // check if there are already votes present
            if (recipient.asset.poll.votes) {
              let votes = recipient.asset.poll.votes;
              if (votes[vote]) {
                ++votes[vote];
                recipient.asset.poll.votes = votes;
              } else {
                recipient.asset.poll.votes = { ...votes, [vote]: 1 };
              }
            } else {
              recipient.asset.poll.votes = { [vote]: 1 };
            }

            store.account.set(recipient.address, recipient);
          } else {
            errors.push(
              new TransactionError(
                `Vote asset contains an incorrect answer option. Only ${answersLength} answers are present.`
              )
            );
          }
        } else {
          errors.push(new TransactionError("Poll no longer active."));
        }
      } else {
        errors.push(
          new TransactionError("Recipient address does not contain a poll.")
        );
      }
    }

    return errors;
  }

  undoAsset(store) {
    // remove the added vote
    const errors = [];

    let { vote } = this.asset;

    const recipient = store.account.get(this.recipientId);

    let votes = recipient.asset.poll.votes;

    if (votes[vote]) {
      --votes[vote];
      recipient.asset.poll.votes = votes;
    } else {
      recipient.asset.poll.votes = { ...votes, [vote]: null };
    }

    store.account.set(recipient.address, recipient);

    return errors;
  }
}
