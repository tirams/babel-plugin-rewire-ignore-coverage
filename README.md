# babel-plugin-review-no-cover

This plugin disables rewire injected methods from istanbul coverage counts.

We get ES6/7 syntax and JSX transpiling out of the box with babel-loader (webpack module). The rewire plugin to babel is used to mock out other components when unit testing a component. The rewiring injects some code (setters/getters/resetters) when the system under test accesses the other dependent mocked components. The coverage sweep reported those injected methods as not covered by tests. This new babel-plugin-rewire-ignore-coverage plugin marks those injected code functions to be ignored by istanbul, after the rewiring



## Example

**In**

```javascript
 
function __GetDependency__(name) {
    return __$Getters__[name]();
}
 
 
function __Rewire__(name, value) {
    __$Setters__[name](value);
}
 
 
function __ResetDependency__(name) {
    __$Resetters__[name]();
}
 
__$Getters__['React'] = function () {
    return React;
};
 
__$Setters__['React'] = function (value) {
    React = value;
};
 
__$Resetters__['React'] = function () {
    React = _react2['default'];
}; 

```

**Out**

```javascript
// istanbul ignore next
 
function __GetDependency__(name) {
    return __$Getters__[name]();
}
 
// istanbul ignore next
 
function __Rewire__(name, value) {
    __$Setters__[name](value);
}
 
// istanbul ignore next
 
function __ResetDependency__(name) {
    __$Resetters__[name]();
}
 
__$Getters__['React'] = // istanbul ignore next 
function () {
    return React;
};
 

__$Setters__['React'] = // istanbul ignore next 
function (value) {
    React = value;
};
 
__$Resetters__['React'] = // istanbul ignore next 
function () {
    React = _react2['default'];
}; 
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