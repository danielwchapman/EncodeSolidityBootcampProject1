We were unable to finish the entire project. We did finish the unit tests, got contract deployed, gave voting rights, and could query the proposals. We did this through the scripts in the `scripts` directory.

## Deploy

```
% yarn run ts-node --files ./scripts/Ballot/deployment.ts "p1" "p2" "p3"

yarn run v1.22.18
$ /Users/dan/workspace/encodeBootcamp/3-tools/04-Tests-Scripts/Project/node_modules/.bin/ts-node --files ./scripts/Ballot/deployment.ts p1 p2 p3
Using address 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
Wallet balance 10
Deploying Ballot contract
Proposals: 
Proposal N. 1: p1
Proposal N. 2: p2
Proposal N. 3: p3
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Awaiting confirmations
Completed
Contract deployed at 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
✨  Done in 91.87s.

Transaction:
https://ropsten.etherscan.io/tx/0x0c87df081556e8ad20775445c18fdad00ae583e41a0cb1e338a6dcbb0380137b

Contract:
https://ropsten.etherscan.io/address/0x4259caaa30c782898344470ad49797fa26c0d9aa
```

## Get Addresses
Used to get address to test with:
```
dan@Daniels-MacBook-Air Project % yarn run ts-node --files ./scripts/Ballot/getAddresses.ts
yarn run v1.22.18
$ /Users/dan/workspace/encodeBootcamp/3-tools/04-Tests-Scripts/Project/node_modules/.bin/ts-node --files ./scripts/Ballot/getAddresses.ts
Using address 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
Using address2 0xDBc83362CB7055aD651756919e19F11F92626E73
Using address3 0xA52953E56Fa9f679f998Ec9ff9a4A3400cC1ea8f
Using address4 0x010B84B392d5E05F6967F117dCE4e504631E646b
```

## Give Voting Rights
Gave 3 addresses voting rights:
```
yarn run ts-node --files ./scripts/Ballot/giveVotingRights.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa "0xDBc83362CB7055aD651756919e19F11F92626E73"
yarn run v1.22.18
$ /Users/dan/workspace/encodeBootcamp/3-tools/04-Tests-Scripts/Project/node_modules/.bin/ts-node --files ./scripts/Ballot/giveVotingRights.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa 0xDBc83362CB7055aD651756919e19F11F92626E73
Using address 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
Wallet balance 9.998313723971895
Attaching ballot contract interface to address 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
Giving right to vote to 0xDBc83362CB7055aD651756919e19F11F92626E73
Awaiting confirmations
Transaction completed. Hash: 0x1b803b9638c740f29dc33e25bf728075cece33b3fe188113e90e497bcd228aae
✨  Done in 57.11s.




yarn run ts-node --files ./scripts/Ballot/giveVotingRights.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa 0xA52953E56Fa9f679f998Ec9ff9a4A3400cC1ea8f  
yarn run v1.22.18
$ /Users/dan/workspace/encodeBootcamp/3-tools/04-Tests-Scripts/Project/node_modules/.bin/ts-node --files ./scripts/Ballot/giveVotingRights.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa 0xA52953E56Fa9f679f998Ec9ff9a4A3400cC1ea8f
Using address 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
Wallet balance 9.998240738452676
Attaching ballot contract interface to address 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
Giving right to vote to 0xA52953E56Fa9f679f998Ec9ff9a4A3400cC1ea8f
Awaiting confirmations
Transaction completed. Hash: 0x53efcd137f1f40faa27dee3a85ea93c68d6837d4afa70af8d21d2cdc6e57f771
✨  Done in 40.30s.



yarn run ts-node --files ./scripts/Ballot/giveVotingRights.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa 0x010B84B392d5E05F6967F117dCE4e504631E646b
yarn run v1.22.18
$ /Users/dan/workspace/encodeBootcamp/3-tools/04-Tests-Scripts/Project/node_modules/.bin/ts-node --files ./scripts/Ballot/giveVotingRights.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa 0x010B84B392d5E05F6967F117dCE4e504631E646b
Using address 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
Wallet balance 9.998167752931316
Attaching ballot contract interface to address 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
Giving right to vote to 0x010B84B392d5E05F6967F117dCE4e504631E646b
Awaiting confirmations
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Transaction completed. Hash: 0x3d2ff7a2236ac363e8b9043fa8341066050ac82f7c1dfdb9f0196d2c15a1c014
✨  Done in 60.18s.
```

## Query Proposals

```
yarn run ts-node --files ./scripts/Ballot/queryProposals.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
yarn run v1.22.18
$ /Users/dan/workspace/encodeBootcamp/3-tools/04-Tests-Scripts/Project/node_modules/.bin/ts-node --files ./scripts/Ballot/queryProposals.ts 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
Using address 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Wallet balance 9.998094767405139
Attaching ballot contract interface to address 0x4259cAaA30C782898344470aD49797fA26C0d9Aa
Getting proposal 0..
Transaction completed. Vote count: 0
Getting proposal 1..
Transaction completed. Vote count: 0
Getting proposal 2..
Transaction completed. Vote count: 0
✨  Done in 14.80s.
```
