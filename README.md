# Summary
Solidified has a set of three main contracts that aim to provide a consistent and safe accounting system for the platform. It can handle receiving, storing and withdrawing eth, as well managing balances.
The system considers a total of three actors: an owner, a controller, and everyone else. The owner is responsible for authorizing sensitive operation and the controller is the one allowed to make operations that control user balances. And the only state-changing operation that is not made by any of those two is making transactions into the system.
The three contracts are `MainHub`, `Vault`, `Depositable`. The simplest one is the latter, which is only responsible for receiving eth from users and forwarding to `MainHub`, which is responsible for managing user balances, but not holding actual eth, which is done by the Vault.

### Depositable Contract
A new instance is deployed every time a new user wants to deposit any amount of coins. It has a constructor and the fallback function, along with two other variables: the `MainHub` contract address and the user address that will be credited in the system.
Everytime the fallback function is triggered, the contract, calls a receiving function in the `MainHub`, passing the value received and the destinatary user.

### MainHub Contract
It's the connecting piece between all other contracts in the system. The Main is the entry point of almost all controller functions and the only one that constantly manipulate state. It has four different groups of function beyond the functions that only fetch data:
Config function: which are functions that allow to configure the system, such as changing the depositable factory and the vault address.
`Depositable` related functions: which take care of the deployment and registration of depositable contracts.
User Credit functions: these control the user balance throughout the system. The controller can add or take credit from user.
Vault oriented functions: Which receive and forward funds to the Vault contract, request for withdrawal, etc.
In summary, the `Mainhub` is a basic accounting module: it handles flow of eth as well the amount that each user has.

### Vault Contract
The vault is a contract that serves as a security layer for holding and transferring ETH. It's based on a simplified multisig wallet, managed by the owner and the mainHub contracts. It basically receive incoming eth and accept withdrawal requests, which must be authorized by the owner. Since it's a fixed purpose contract, the functionality of adding and removing new owners, as well the data parameters in transactions, were removed.  

### Remaining contracts
The other contracts in the system are helpers that serve as base contracts, such as `Ownable`, Controlled, or as interfaces, for other contracts to import. There's also the safe math contract and a  `depositable` factory, which it's only purpose is to forward a request for deploying a `depositable` contract.
