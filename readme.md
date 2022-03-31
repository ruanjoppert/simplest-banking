
# Simplest banking

Simple~~st~~ banking service I could think of using some good practices. 

## Installation
1. Clone this project
2. Install dependencies using `yarn` or `npm install`

```bash
git clone git@github.com
cd simplest-banking
yarn
```

## API Reference

### Reset state
Use this route to reset the service state

**Request**
```http
POST /reset
```

**Response**
```http
Status: 200 OK
```

### Get balance
Returns the balance from account

**Request**
```http
GET /balance?account_id=1234
```

| Parameter    | Type     | Description                       |
| :----------- | :------- | :-------------------------------- |
| `account_id` | `string` | **Required**. Id of item to fetch |

**Response** - existing account
```http
Status: 200 OK

20
```

**Response** - non-existing account
```http
Status: 404 Not Found

0
```

### Make transaction

Make an account transaction

**Request**
```http
POST /event
```

| Event    | Description                                                        |
| :---------------------- | :-------------------------------------------------- |
| [`deposit`](#deposit)   | deposit fund to account                             |
| [`transfer`](#transfer) | transfer from origin account to destination account |
| [`withdraw`](#withdraw) | withdraw fund from account                          |

**Response** - Create account with initial balance
```http
Status: 201 Created

{"destination": {"id":"100", "balance":10}}
```

**Response** - Deposit into existing account
```http
Status: 201 Created

{"destination": {"id":"100", "balance":20}}
```

**Response** - Withdraw from non-existing account
```http
Status: 404 Not found

0
```

**Response** - Withdraw from existing account
```http
Status: 201 Created

{"origin": {"id":"100", "balance":15}}
```

**Response** - Transfer from existing account
```http
Status: 201 Created

{"origin": {"id":"100", "balance":0}, "destination": {"id":"300", "balance":15}}
```

**Response** - Transfer from non-existing account
```http
Status: 404 Not found

0
```


### Events

#### Deposit

| Parameter     | Type     |  Description                          | Required |
| :------------ | :------- | :------------------------------------ | :------- |
| `type`        | `string` | deposit                               | yes      |
| `destination` | `number` | account id where it will be deposited | yes      |
| `amount`      | `number` | amount to be to be transacted         | yes      |

Sample
```
{"type":"deposit", "destination":"100", "amount":10}
```

#### Withdraw

| Parameter    | Type     |  Description                          | Required |
| :----------- | :------- | :------------------------------------ | :------- |
| `type`       | `string` | withdraw                              | yes      |
| `origin`     | `number` | account id where it will be withdrawn | yes      |
| `amount`     | `number` | amount to be to be transacted         | yes      |

Sample
```
{"type":"withdraw", "origin":"100", "amount":5}
```

#### Transfer

| Parameter     | Type     |  Description                          | Required |
| :------------ | :------- | :------------------------------------ | :------- |
| `type`        | `string` | transfer                              | yes      |
| `origin`      | `number` | account id where it will be withdrawn | yes      |
| `destination` | `number` | account id where it will be deposited | yes      |
| `amount`      | `number` | amount to be to be transacted         | yes      |

Sample
```
{"type":"transfer", "origin":"200", "amount":15, "destination":"300"}
```

### Build and run
The service uses typescript, so it is necessary to build 
```bash
yarn build
yarn start
```

### Running Tests

To run tests, run the following command

```bash
yarn test
```