# Decentralized Organization Chain - server

### Prerequisites

First install the dependencies as detailed in the [Lisk SDK documentation](https://lisk.io/documentation/lisk-sdk/setup).

- Node.js
- PostgreSQL
- Python
- pm2 (recommended)

### Installation

```
git clone https://github.com/Korben3/Decentralized-Organization-Chain
cd server
npm install
```

### Run

Run the node and view logs: `node index.js | npx bunyan -o short`

Run the node as a background service:

Register name `pm2 start --name doc index.js`

After changing parts of the code you need to stop and restart the node:

```
pm2 stop doc
pm2 start doc
```

### Tools

The tools directory contains example script to easily make a transaction.

You can connect with the chain using Lisk Desktop by adding the node: http://167.179.98.242:4000

Use `wagon stock borrow episode laundry kitten salute link globe zero feed marble` to transfer DOC tokens to your account to make transactions.
