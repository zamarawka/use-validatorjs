[![Ci Status](https://github.com/zamarawka/use-validatorjs/workflows/CI/badge.svg)](https://github.com/zamarawka/use-validatorjs/actions)
[![Npm version](https://img.shields.io/npm/v/use-validatorjs.svg?style=flat&logo=npm)](https://www.npmjs.com/package/use-validatorjs)
[![React version](https://img.shields.io/npm/dependency-version/use-validatorjs/peer/react.svg?style=flat&logo=react)](https://reactjs.org/)

# use-validatorjs

Tiny tree-shakable package for validation any data-model by rules for [React.js](https://reactjs.org/).
Provides hook for manage validation state and run validations agnostic from way to input data.
It also knows about i18n of your app and don't try to force use of internal translation engine.

Package includes its TypeScript Definitions

# Install

```sh
npm install use-validatorjs
```

# Usage

Validation rules here - is plain javascript functions.
We don't create abstract language based on strings, magic or other spiritual tactics. We use javascript.
As result it give us to a lot of pros:

- Easy way to create rules - you should simply write js function
- Powerful language to describe validation rules - native js structs is flexible
- Fully type-safe in ts usage - all rules has additional typecheck of validation value

```tsx
import useValidator, { required, min } from 'use-validatorjs';

// Some i18n function like https://github.com/zamarawka/i18n-lite#t or https://www.i18next.com/overview/api#t
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
Based on this ideology `useValidator` return 2 objects with errors:

1. `validation` - realtime validation messages
2. `errors` - empty object untill you need to show errors

To fill errors object you should use `showErrors` function, which could receive boolean value with state, by default it's `true`.
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
It should return `undefined` if validation pass or string with validaiton message if validation failed.

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
You can do it with helper function `customMessage`.

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

## i18n

Typically in semi-size apps we already have some i18n engine.
In this case synchronize language output from a lot of libraries really painful.
For example: we have i18next as base engine, moment.js for date view, data-validation with own interpolation dialect, some ui-component library with included texts for close buttons of modals.
To reach consistent translation of app we should sync all of these libs on several lifecycles and cases:

- at app loading phase - there is no seanse to download all langs on app startup
- change language - all libs should pre-load it's translation and call change current language at one moment
- sync translation files - should remebemer all interpolation dialects (sometimes it is `{{}}`, sometimes it is `:value:`) and don't miss to add new lang for your libs
- undestanding how to change whole translation file for some of libs - sometimes texts too casual for your ui

We faced with this problem too often. So, `useValidation` don't use own translation engine under the hood.
It receive translation function as first argument. Function should have compatible interface with [t from react-i18next](https://www.i18next.com/overview/api#t) or [t from i18n-lite](https://github.com/zamarawka/i18n-lite#t). If you use one of this libs you could simply pass this function with binded namespace:

```tsx
import useValidator, { required, min customMessage } from 'use-validatorjs';
import { useTranslation } from 'i18n-lite';

function App() {
  const { t: validationT } = useTranslation('validation');
  const data = {
    some: '',
    price: 3
  };

  const { isErrors, errors } = useValidator(validationT, data, {
    some: customMessage(validationT('custom.required.key'), required),
    price: min(6)
  });

  // ... render logic errors here
}
```

In other cases it is up to you create your own implementation according with your environment.

Bad news: at this moment there are no out of the box translation files for rules. It is under development and will appear as soon as possible.

## Rules

### required

Check value is required

```tsx
// Negative cases
const data = {
  num: NaN,
  str: '',
  bool: false,
};

// Positive cases
const data = {
  num: 0,
  str: 'any not empty string',
  bool: true,
};

// Example
const rules = {
  num: required,
  str: required,
  bool: required,
};
```

### requiredIf

Check value required if other value equals

```tsx
// Negative cases
const data = {
  other: 3,
  some: false,
};

// Positive cases
const data = {
  other: 3,
  some: true,
};

const data = {
  other: 5,
  some: true,
};

// Example
const rules = {
  some: requiredIf(data.other, 3),
};
```

### requiredUnless

Check value required if other value not equals

```tsx
// Negative cases
const data = {
  other: 5,
  some: false,
};

// Positive cases
const data = {
  other: 3,
  some: false,
};

const data = {
  other: 5,
  some: true,
};

// Example
const rules = {
  some: requiredUnless(data.other, 3),
};
```

### requiredWith

Check value required if other value is positive

```tsx
// Negative cases
const data = {
  other: 1,
  some: false,
};

// Positive cases
const data = {
  other: 1,
  some: true,
};

const data = {
  other: 0,
  some: false,
};

// Example
const rules = {
  some: requiredWith(data.other),
};
```

### requiredWithAll

Check value required if every of other values are positive

```tsx
// Negative cases
const data = {
  other: 1,
  foo: 'some',
  some: false,
};

// Positive cases
const data = {
  other: 1,
  foo: 'some',
  some: true,
};

const data = {
  other: 0,
  foo: 'some', // or ''
  some: false,
};

// Example
const rules = {
  some: requiredWithAll([data.other, data.foo, true]),
};
```

### requiredWithout

Check value required if other value is negative

```tsx
// Negative cases
const data = {
  other: 0,
  some: false,
};

// Positive cases
const data = {
  other: 0,
  some: true,
};

const data = {
  other: 1,
  some: false,
};

// Example
const rules = {
  some: requiredWithout(data.other),
};
```

### requiredWithoutAll

Check value required if every of other values are negative

```tsx
// Negative cases
const data = {
  other: 0,
  foo: '',
  some: false,
};

// Positive cases
const data = {
  other: 0,
  foo: '',
  some: true,
};

const data = {
  other: 0, // or 1
  foo: 'some',
  some: false,
};

// Example
const rules = {
  some: requiredWithoutAll([data.other, data.foo, false]),
};
```

### same

Check value are same

```tsx
// Negative cases
const data = {
  some: 5,
  other: 'foo',
};

// Positive cases
const data = {
  some: 3,
  other: 'str',
};

// Example
const rules = {
  some: same(3),
  some: same('str'),
};
```

### different

Check value are different

```tsx
// Negative cases
const data = {
  some: 3,
  other: 'str',
};

// Positive cases
const data = {
  some: 5,
  other: 'foo',
};

// Example
const rules = {
  some: different(3),
  some: different('str'),
};
```

### min

Check value more than

```tsx
// Negative cases
const data = {
  some: 2,
};

// Positive cases
const data = {
  some: 5,
};

// Example
const rules = {
  some: min(3),
};
```

### max

Check value less than

```tsx
// Negative cases
const data = {
  some: 5,
};

// Positive cases
const data = {
  some: 2,
};

// Example
const rules = {
  some: max(3),
};
```

### email

Check value is valid email adress

```tsx
// Negative cases
const data = {
  some: 'some-random-string',
};

// Positive cases
const data = {
  some: 'some@example.com',
};

// Example
const rules = {
  some: email,
};
```

### accepted

Check value is accepted. Typically checkboxes.

```tsx
// Negative cases
const data = {
  some: 0,
  other: false,
};

// Positive cases
const data = {
  some: 1,
  other: true,
};

// Example
const rules = {
  some: accepted,
};
```

# Development

```sh
npm run format # code fomatting
npm run lint # linting
npm run test # testing
```

Active maintenance with care and ❤️.

Feel free to send a PR.
