# atom-vue-component-loader

loads a pack of vue components.

## Install

```sh
npm install atom-vue-component-loader

```

## Usage
requiring `atom-vue-component-loader`

returns a `Function(tree, options={})`

| Parameter | Type    | Usage                                   |
| --------: | ------- | :-------------------------------------- |
| names     | array   | dependency tree of your components |
| options   | object  | object containing all options |

| options   | Type    | Usage                                   |
| --------: | ------- | :-------------------------------------- |
| cwd       | string  | current working directory - where packages will be searched |
| reload    | boolean | if set, deletes cache before loading    |
| deep      | boolean | only if reload is true, deletes nested dependencies from cache |
| debug     | boolean | sets `Vue.options.debug` |

## Example
```coffee
loader = require "atom-vue-component-loader"

tree =
  "main-app":
    "nested-comp": null
  "app2":
    "another-comp": null

vueApps = loader tree, reload: true
vueApps["main-app"] # reference to vue apps
vueApps["app2"]
vueApps["nested-comp"] # will not work!

```



## Release History
 - *v0.0.5*: added debug option
 - *v0.0.4*: introduced the dependency tree
 - *v0.0.3*: Switched to kebab case
 - *v0.0.2*: First bugfix
 - *v0.0.1*: First release

## License
Copyright (c) 2015 Paul Pflugradt
Licensed under the MIT license.
