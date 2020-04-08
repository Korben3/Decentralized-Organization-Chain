# Decentralized Organization Chain
Decentralized blockchain application build with the [Lisk SDK](http://lisk.io) allowing startups to receive funding and investors to influence company decisions.

### Docs and Demo

For a live demo: [doc.korben3.com](http://doc.korben3.com)

For the public API: http://167.179.98.242:4000

Example calls:

- [Retrieve balance of an account](http://167.179.98.242:4000/api/accounts?address=10572594784286738319L)
- [See the status of the node](http://167.179.98.242:4000/api/node/status)
- [Account info](http://167.179.98.242:4000/api/accounts?address=10572594784286738319L)

For client documentation: [Client - Readme](https://github.com/Korben3/Decentralized-Organization-Chain/tree/master/client)

For Server documentation: [Server - Readme](https://github.com/Korben3/Decentralized-Organization-Chain/tree/master/server)

You can find helpful tools and examples to make transactions in the [server/tools](https://github.com/Korben3/Decentralized-Organization-Chain/tree/master/server/tools) directory.

### Custom transactions

There are 4 custom transactions implemented:

**Type 101 Register as an investor. 1000 DOC**
```
User object:
 name: string (32 char)
 type: string "investor"
```

**Type 102 Register as a board member. 100000 DOC**
```
User object:
 name: string (32 char)
 type: string "board"
```

**Type 103 Add a new poll. 1000 DOC**
```
Poll object:
 question: string (256 char)
 answers: array of answer 1-5
  answer 1-5: string (128 char)
```

**Type 104 Cast a vote.	100 DOC**
```
Vote: number (1-5)
```
