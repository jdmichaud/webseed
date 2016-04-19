## Mock Promises

This is used to test services or controllers having to deal with Promises.
create the promise using the createPromise function and then call the resolve
and reject functions.
Implements the [ES6 Promise API](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Usage:
``` javascript
var loginServiceMock = {
  promise: jasmine.createSpy('login').and.callFake(mockPromiseModule.createPromise),
}
// Tell the provider to inject the mockService in lieu of the 'real' service
$provide.value('LoginService', loginServiceMock);
// Create your controller, which will be injected the mock service
[...]
// Call the controller API which will eventually call the service
$scope.login();
// You can assume now that the controller is waiting on the promise
// So resolve or reject the promise and see what happens
mockPromiseModule.reject({ result: false, error: errorMsg  });
// Run some expecation here
```

## Rest Mocker

Contains a javascript object which represent the mocked calls and what they are
supposed to return. This object is loaded and used by the module
mock-rest-request module when you do:
```
grunt serve
```

:warning: Use it parcimoniously and only for unformal test! All "real" testing
is done in the specification files!

## Wesocket mock

Contains a javascript function which acts as an handler for websocket event in
case of:
```
grunt serve
```
:warning: Use it parcimoniously and only for unformal test! All "real" testing
is done in the specification files!

