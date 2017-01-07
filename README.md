# babel-plugin-rewire-ignore-coverage


This plugin disables rewire injected methods from istanbul coverage counts.

We get ES6/7 syntax and JSX transpiling out of the box with babel-loader (webpack module). The rewire plugin to babel is used to mock out other components when unit testing a component. The rewiring injects some code (setters/getters/resetters) when the system under test accesses the other dependent mocked components. The coverage sweep reported those injected methods as not covered by tests. This new babel-plugin-rewire-ignore-coverage plugin marks those injected code functions to be ignored by istanbul, after the rewiring

Works with Babel 6.x


## Example

**In**

```javascript
 

function _get__(variableName) {
    if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
        return _get_original__(variableName);
    } else {
        var value = _RewiredData__[variableName];

        if (value === INTENTIONAL_UNDEFINED) {
            return undefined;
        } else {
            return value;
        }
    }
}

function _get_original__(variableName) {
    switch (variableName) {
    case 'React':
        return _react2.default;
    }

    return undefined;
}

function _assign__(variableName, value) {
    if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
        return _set_original__(variableName, value);
    } else {
        return _RewiredData__[variableName] = value;
    }
}

function _set_original__(variableName, _value) {
    switch (variableName) {}

    return undefined;
}

function _update_operation__(operation, variableName, prefix) {
    var oldValue = _get__(variableName);

    var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

    _assign__(variableName, newValue);

    return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
    if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
        Object.keys(variableName).forEach(function(name) {
            _RewiredData__[name] = variableName[name];
        });
    } else {
        if (value === undefined) {
            _RewiredData__[variableName] = INTENTIONAL_UNDEFINED;
        } else {
            _RewiredData__[variableName] = value;
        }

        return function() {
            _reset__(variableName);
        };
    }
}

function _reset__(variableName) {
    delete _RewiredData__[variableName];
}

function _with__(object) {
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};

    function reset() {
        rewiredVariableNames.forEach(function(variableName) {
            _RewiredData__[variableName] = previousValues[variableName];
        });
    }

    return function(callback) {
        rewiredVariableNames.forEach(function(variableName) {
            previousValues[variableName] = _RewiredData__[variableName];
            _RewiredData__[variableName] = object[variableName];
        });
        var result = callback();

        if (!!result && typeof result.then === 'function') {
            result.then(reset).catch(reset);
        } else {
            reset();
        }

        return result;
    };
}

```

**Out**

```javascript
// istanbul ignore next
function _get__(variableName) {
    if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
        return _get_original__(variableName);
    } else {
        var value = _RewiredData__[variableName];

        if (value === INTENTIONAL_UNDEFINED) {
            return undefined;
        } else {
            return value;
        }
    }
}

// istanbul ignore next
function _get_original__(variableName) {
    switch (variableName) {
    case 'React':
        return _react2.default;
    }

    return undefined;
}

// istanbul ignore next
function _assign__(variableName, value) {
    if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
        return _set_original__(variableName, value);
    } else {
        return _RewiredData__[variableName] = value;
    }
}

// istanbul ignore next
function _set_original__(variableName, _value) {
    switch (variableName) {}

    return undefined;
}

// istanbul ignore next
function _update_operation__(operation, variableName, prefix) {
    var oldValue = _get__(variableName);

    var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

    _assign__(variableName, newValue);

    return prefix ? newValue : oldValue;
}

// istanbul ignore next
function _set__(variableName, value) {
    if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
        Object.keys(variableName).forEach(function(name) {
            _RewiredData__[name] = variableName[name];
        });
    } else {
        if (value === undefined) {
            _RewiredData__[variableName] = INTENTIONAL_UNDEFINED;
        } else {
            _RewiredData__[variableName] = value;
        }

        return function() {
            _reset__(variableName);
        };
    }
}

// istanbul ignore next
function _reset__(variableName) {
    delete _RewiredData__[variableName];
}

// istanbul ignore next
function _with__(object) {
    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};

    function reset() {
        rewiredVariableNames.forEach(function(variableName) {
            _RewiredData__[variableName] = previousValues[variableName];
        });
    }

    return function(callback) {
        rewiredVariableNames.forEach(function(variableName) {
            previousValues[variableName] = _RewiredData__[variableName];
            _RewiredData__[variableName] = object[variableName];
        });
        var result = callback();

        if (!!result && typeof result.then === 'function') {
            result.then(reset).catch(reset);
        } else {
            reset();
        }

        return result;
    };
}
```

## Installation

```sh
$ npm install babel-plugin-rewire-ignore-coverage
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["rewire", "rewire-ignore-coverage"]
}
```

### Via CLI

```sh
$ babel --plugins rewire-ignore-coverage  script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["rewire-ignore-coverage"]
});
```


### Via Karma config
```
       webpack: {
            devtool: "source-map",
            module: {
                loaders: [
                    {
                        // all js src and test files get treated by babel
                        test: /\.js?$/,
                        include: [
                            path.resolve(__dirname, "client/src"),
                            path.resolve(__dirname, "client/test")
                        ],
                        exclude: [nodeModulesPath],
                        loader: "babel-loader",
                        query: {
                            plugins: ['babel-plugin-rewire', 
                                      'babel-plugin-rewire-ignore-coverage']
                        }
                    },
                    
```