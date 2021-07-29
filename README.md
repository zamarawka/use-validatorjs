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

```jsx
import useValidator from 'use-validatorjs';

// Some i18n function like https://www.i18next.com/overview/api#t
function t(key, params) {
  return key;
}

const myAwesomeValidation (t, val) => {
  if (val !== 'strict-rule') {
    return t('myAwesomeValidation');
  }
}

function App() {
  cosnt data = {
    some: '',
    other: 3,
  };

  const { isErrors, isShowErrors, errors, showErrors, validation } = useValidator(t, data, {
      some: required,
      other: [required, min(2), myAwesomeValidation],
    });

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
    </div>
  );
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
