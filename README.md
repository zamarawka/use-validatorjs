[![Ci Status](https://github.com/zamarawka/use-validatorjs/workflows/CI/badge.svg)](https://github.com/zamarawka/use-validatorjs/actions)
[![Npm version](https://img.shields.io/npm/v/use-validatorjs.svg?style=flat&logo=npm)](https://www.npmjs.com/package/use-validatorjs)
[![React version](https://img.shields.io/npm/dependency-version/use-validatorjs/peer/react.svg?style=flat&logo=react)](https://reactjs.org/)

# use-validatorjs

Package includes its TypeScript Definitions

# Install

```sh
npm install use-validatorjs
```

# Usage

Validation rules here is plain javascript functions.
We don't create abstract language based on strings, we use javascript.
As rusult it becomes us to as lot of pros:

- Fully type-safe - all rules has additional typecheck
- Easy way to create rules - you should simply write js function
- Powerful language to describe validation rules - native js structs is flexible

```tsx
import useValidator, { required, min } from 'use-validatorjs';

// Some i18n function like https://www.i18next.com/overview/api#t
function t(key, params) {
  return key;
}

function App() {
  const data = {
    some: '',
    other: 3,
  };

  const { isErrors, isShowErrors, errors, showErrors, validation } = useValidator(t, data, {
    some: required, // pass 1 rule
    other: [required, min(2)], // pass many rules
  });

  return (
    <div>
      <div>
        <div>Some: {data.some}</div>
        {validation.some && <div styles={{ color: 'red' }}>{validation.some}</div>}
      </div>
      <div>
        <div>Other: {data.other}</div>
        {validation.other && <div styles={{ color: 'red' }}>{validation.other}</div>}
      </div>
    </div>
  );
}
```

## UI/UX

Good practice is don't shock users untill they try to do something wrong.
Based on this ideology `useValidator` return have 2 objects with errors.

1. `validation` - realtime validation messages
2. `errors` - empty object untill you need to show errors

To fill errors object you should use `showErrors` function, which could receive boolean value, with state with `true` as default.
To check current state of view errors you should use `isShowErrors`.

For example, render validation errors only then form submitted and disable submit button if errors is shown and still exists:

```tsx
import useValidator from 'use-validatorjs'; // ... rules here

function App() {
  const data = {
    // some data object
  };

  const { isErrors, isShowErrors, errors, showErrors, validation } = useValidator(t, data, {
    // ... validation rules
  });

  function handleSubmit() {
    if (isErrors) {
      return showErrors();
    }

    // business logic here: api calls, calculation, etc...
  }

  return (
    <div>
      <div>
        <div>Some: {data.some}</div>
        {errors.some && <div styles={{ color: 'red' }}>{errors.some}</div>}
      </div>
      <div>
        <div>Other: {data.other}</div>
        {errors.other && <div styles={{ color: 'red' }}>{errors.other}</div>}
      </div>
      <button onClick={handleSubmit} disabled={isShowErrors && isErrors}>
        Submit
      </button>
    </div>
  );
}
```

## Custom validation rule

You could create custom validation rule by create implementation for `CheckerFn` type.
`CheckerFn` receive translation function as first argument, validation value as second argument.
It should return `undefined` if validation pass or string if validation failed.
`CheckerFn` - is generic type wich await type of validation value.

```tsx
import useValidator, { CheckerFn } from 'use-validatorjs';

// Custom validation function
const myAwesomeValidation: CheckerFn<number | string> = (t, val) => {
  if (val !== 'strict-rule') {
    return t('myAwesomeValidation');
  }
};

// Custom validation function with parameters
// In fact this is any function which return `CheckerFn`
const myAwesomeValidationWithParams = (param: number): CheckerFn<number> => (t, val) => {
  if (val !== param) {
    return t('myAwesomeValidationWithParams', { param });
  }
}

function App() {
  const data = {
    some: 'strict-rule'
    other: 3,
  };

  const { isErrors, errors } = useValidator(t, data, {
    some: myAwesomeValidation,
    other: [myAwesomeValidation, myAwesomeValidationWithParams(3)],
  });

  // ... render logic errors here
}
```

## Custom validation message

In some cases you need to render custom validation message for rule.
We can do it with helper function `customMessage`.
`customMessage` receive validation message as first argument, rule as second.

```tsx
import useValidator, { required, min customMessage } from 'use-validatorjs';

function App() {
  const data = {
    some: '',
    price: 3
  };

  const { isErrors, errors } = useValidator(t, data, {
    some: customMessage('This is very important field', required),
    price: customMessage('Price field should be as least 6', min(6))
  });

  // ... render logic errors here
}
```

# Development

```sh
npm run format # code fomatting
npm run lint # linting
npm run test # testing
```

Active maintenance with care and ❤️.

Feel free to send a PR.
