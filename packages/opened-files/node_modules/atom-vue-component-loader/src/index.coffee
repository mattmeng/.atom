# out: ../lib/index.js

path = require "path"
fs = require "fs"
Vue = require "vue"
simpleReload = require "simple-reload"


decamelize = (str) ->
  str.replace /\B([A-Z]{1})/g, (match, chr) ->
    "-#{chr.toLowerCase()}"

camelize = (str) ->
  str.replace /-+(.)?/g, (match, chr) ->
    if chr
      chr.toUpperCase()
    else
      ""

registry = {}
getByName = (name, options) ->
  return registry[name] if registry[name]?
  try
    fullname =  require.resolve("#{name}")
  catch
    fullname = require.resolve("#{options.cwd}/#{name}")
  if options.reload
    registry[name] = simpleReload(fullname, options.deep)
  else
    registry[name] = require(fullname)

getComponents = (dependencyTree, options) ->
  components = {}
  for componentName, children of dependencyTree
    componentName = decamelize componentName
    component = getByName componentName, options
    components[componentName] = component
    if children?
      component.components = getComponents children, options
  return components

vues = {}
module.exports = (dependencyTree, options={}) ->
  options.cwd ?= "./"
  if options.cwd[0] == '.'
    console.log module.parent
    dirname = module.parent.filename
    stat = fs.statSync dirname
    if stat.isFile()
      dirname = path.dirname dirname
    options.cwd = path.resolve dirname, options.cwd
  options.reload ?= false
  options.deep ?= false
  options.debug ?= false
  Vue.config.debug = options.debug
  if options.reload
    vues = {}
    registry = {}
  for vueName,vue of getComponents(dependencyTree, options)
    vues[vueName] ?= new Vue(vue)
  return vues
