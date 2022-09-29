# FairSplit

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![CI](https://github.com/IsaacCheng9/fairsplit/actions/workflows/main.yml/badge.svg)

A bill-splitting application to track shared expenses in a group, developed with
Node and React.

## Explanation of Transaction Minimisation Algorithm

We implemented a greedy algorithm to minimise the number of transactions
required to settle the debts between all members of a group.

The algorithm runs in O(n log n), where n is the number of users. This means
that it scales well with the number of users.

<!-- TODO: Explain simple example with Alice -> Bob -> Charlie, and then advanced example. -->

## Screenshots

<!-- TODO: Add screenshots here. -->

## Installation and Usage

### Setting up the MongoDB Database

1. Create a file in the root directory with the name: `.env`
2. Open the file in a text editor (such as Notepad or TextEdit).
3. Add the following line to the file, replacing `<uri>` with the URI of your
   MongoDB database:

```txt
MONGODB_URI="<uri>"
```

4. Save the file.

### Running the Server

1. Open a terminal window.
2. Ensure that you're in the root directory: `fairsplit`
3. Navigate to the server directory: `cd server`
4. Install dependencies: `npm install`
5. Run the server: `node app`

### Running the Client

1. Open a new terminal window (separate to the previous one).
2. Ensure that you're in the root directory: `fairsplit`
3. Navigate to the server directory: `cd client`
4. Install dependencies: `npm install`
5. Run the client: `npm start`
6. Browse to the URL provided in the terminal window.

## Running Tests

### Running Tests on the Server

1. Open a terminal window.
2. Ensure that you're in the root directory: `fairsplit`
3. Navigate to the server directory: `cd server`
4. Install dependencies: `npm install`
5. Run the unit tests: `npm test`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

For more information, please see the [Contributing Guide](CONTRIBUTING.md).
