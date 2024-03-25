# Melipayamak NodeJs Api Module

This is a Node.js module that allows you to interact with the Melipayamak API.

## Installation

```bash
npm install --save @mfrtn/melipayamak-api
```

## Usage

### Initialization

Replace 'your-username' and 'your-password' with your actual username and password.

```typescript
import { MelipayamakApi } from '@mfrtn/melipayamak-api';
// OR
const { MelipayamakApi } = require('@mfrtn/melipayamak-api');

const api = new MelipayamakApi({
  username: 'your-username',
  password: 'your-password'
});
```

### Send a single SMS

```typescript
async function sendSingleSMS() {
  const result = await api.send({
    from: 'your-number',
    to: 'recipient-number',
    text: 'Hello, world!'
    });
  console.log('Single SMS sent:', result);
}
```

### Send multiple SMS messages at once

```typescript
async function sendMultipleSMS() {
  const result = await api.send({
    from: 'your-number',
    to: ['recipient-number1', 'recipient-number2', 'recipient-number3'],
    text: 'Hello, world!'
    });
  console.log('Multiple SMS sent:', result);
}
```

## Future Developments

Stay tuned for more functions and features in the future updates of this module.

Feel free to customize and expand these examples according to your needs!

This README provides clear instructions on how to use the Melipayamak API module and includes examples for some of its functions.

For more information, visit the [Melipayamak official website](https://www.melipayamak.com/api/).
