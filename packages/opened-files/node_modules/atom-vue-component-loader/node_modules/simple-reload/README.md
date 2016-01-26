# simple-reload

deletes a package from cache and reloads it - zero dependencies.

## Install

```sh
npm install simple-reload

```

## Usage
requiring `simple-reload`

returns a `Function(name,  deep=false)`

| Parameter | Type    | Usage                                   |
| --------: | ------- | :--------------------------------------|
| name      | string  | name of the package you want to reload  |
| deep      | boolean | if set, reloads all nested dependencies |

## Example
```coffee
reload = require "simple-reload"
yourPackage = reload "name-of-your-package"
```



## Release History

 - *v0.0.2*: First bugfix
 - *v0.0.1*: First release

## License
Copyright (c) 2015 Paul Pflugradt
Licensed under the MIT license.
