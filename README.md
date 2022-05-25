# e-wallet-system
This system allow users to fund their account, transfer funds and withdraw from their account.

# Features
- Basic Authentication (Register & Login)
- Set Wallet Pin
- Fund Wallet
- Verify Wallet Funding
- Fund Transfer
- Withdraw Fund

# API Documentation
https://documenter.getpostman.com/view/5916628/UVkqrEs8

# How to install

## Using Git (recommended)
1. Clone the project from github.

```
git clone https://github.com/devwalex/e-wallet-system.git
```

## Using manual download ZIP

1. Download repository
2. Uncompress to your desired directory

## Install npm dependencies

```
npm install
```

## Setting up environments
1. You will find a file named `.env.example` on root directory of project.
2. Create a new file by copying and pasting the file and then renaming it to just `.env`

```
cp .env.example .env
```
3. The file `.env` is already ignored, so you never commit your credentials.
4. Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## Running and resetting migrations

1. To run migrations
```
npm run migrate
```
2. To reset migrations
```
npm run migrate:reset
```

# How to run

## Running API server locally
```
npm start
```
You will know server is running by checking the output of the command `npm start`



# Running Tests

```
npm test
```
**Note:** Make sure you set up the test variable in the `.env` file

# Author
Usman Salami

# License
MIT
