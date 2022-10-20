# FairSplit

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
![CI](https://github.com/IsaacCheng9/fairsplit/actions/workflows/main.yml/badge.svg)

A bill-splitting application to track shared expenses in a group, developed with
Node and React.

## Explanation of Transaction Minimisation Algorithm

We implemented a greedy algorithm to minimise the number of transactions
required to settle the debts between all members of a group when the user
toggles 'Smart Split'. The algorithm runs in O(n log n), where n is the number
of users – this means that it scales well with the number of users.

A simple example of this algorithm is shown below. In this example, Alice owes
Bob £10 and Bob owes Charlie £10 for a total of two transactions. The algorithm
will suggest that Alice pays Charlie £10 directly, meaning only one transaction
is required to settle the debts.

![FairSplit - Minimising Transactions@2x Simple](https://user-images.githubusercontent.com/47993930/193157219-12522cfb-f831-48d3-9140-bf1cab09d3b5.png)

This may seem like a trivial problem to solve, but it becomes more complex as
the number of users increases. The following diagram shows a more complex
example when there are six users with six transactions between them. This is
reduced to only four transactions by the algorithm.

![FairSplit - Minimising Transactions@2x](https://user-images.githubusercontent.com/47993930/193157096-98f00f14-8548-4093-a213-8e8975a6e036.png)

## Screenshots

![Screenshot 2022-09-30 at 00 23 22](https://user-images.githubusercontent.com/47993930/193159080-2e312e29-a5a1-4f75-afa5-dbd22d45cd9c.jpg)
![Screenshot 2022-09-30 at 00 23 52](https://user-images.githubusercontent.com/47993930/193159103-97d5e28d-e330-4804-a0b8-d3e3ece88747.jpg)
![Screenshot 2022-09-30 at 00 27 59](https://user-images.githubusercontent.com/47993930/193159498-3b7ba9de-e972-4425-85ae-34c6abfdb838.jpg)
![Screenshot 2022-09-30 at 00 29 59](https://user-images.githubusercontent.com/47993930/193159686-2ffb1f4d-e09b-4325-9056-be97ca315a10.jpg)

## Installation and Usage

### Setting up the MongoDB Database

1. Create a file in the `server` directory with the name: `.env`
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
