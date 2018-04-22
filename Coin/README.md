Code: https://github.com/15Dkatz/sf-chain-guides

Run tests:
npm run test

Run server:
npm run dev

Run on defined args
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002  npm run dev

Transaction structure:
    - id
    - input:
        - timestamp
        - amount
        - sender's address (public key)
        - signature (signed outputs)
    - outputs = []
        - amount
        - receipent's address (public key)