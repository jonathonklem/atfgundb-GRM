import React from 'react';
import Authenticated from './components/authenticated';
import Dashboard from './components/dashboard';

// app takes prop LocalDev, which is a boolean
// if true, it will not use auth0
// if false, it will use auth0
const App = (props) => {
  if (props.LocalDev) {
      return (<Dashboard authToken="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRFUkNHRnYwNjJJZV85clYwdUtrVSJ9.eyJpc3MiOiJodHRwczovL2F1dGguYXRmZ3VuZGIuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTEwNTIyNTc5NzUwNTg2ODI0NjU4IiwiYXVkIjpbImh0dHBzOi8vdHhkY3Ixc2l6aC5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS8iLCJodHRwczovL2Rldi1ieHpoYTY2NWtmZ3owbHR6LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDUwODY0MjEsImV4cCI6MTcwNTE3MjgyMSwiYXpwIjoianVLMHVIemdOajdINWxwc2tiUHgzNENFemxxVllIdkYiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.Kavy_TpY4UF0EcBD66gQ835sNhSd1dsk5OlznXJCkKvKCTdZ0FxZjv5-QDhQq-J78dvsWrtm5y0wDyJ37EgSX1yVviNLnbJnu2o6KlAsq2TO4sSXxJNsjYHDMqICrRA5XHIVJT9OvhEQAbEoS_dTFq1D73MBwkyazvbR4fRFQsh-kT-W1gBVcnbQgaOjBBM3_UWTeOXUIcFuk474H1V6RvKQxAMkUL5Lm3c9Z9KJrvn4LPKazAlEval_uv5evdcRJrtq0yG8PmKTqMQLftQP1fPu5iukRjefugzjUMoqUYR8F-1FfNzzhEODl10T_q23_oMdrgkoUQqLaCWlYVpqjw" LocalDev={props.LocalDev}/>);
  } else {
      return (<Authenticated/>);
  }
}

export default App;
