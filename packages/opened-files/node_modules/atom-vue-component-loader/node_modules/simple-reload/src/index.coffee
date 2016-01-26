# out: ../lib/index.js

path = require "path"
fs = require "fs"
if require.cache[module.id]
  delete require.cache[module.id]

recursiveDelete = (children) ->
  for child in children
    if require.cache[child.id]
      children = require.cache[child.id].children
      delete require.cache[child.id]
      recursiveDelete children if children?
  null

module.exports = (name,  deep=false) ->
  if name[0] == '.'
    dirname = module.parent.filename
    stat = fs.statSync dirname
    if stat.isFile()
      dirname = path.dirname dirname
    name = path.resolve dirname, name

  fullname = require.resolve(name)
  if require.cache[fullname]
    if deep
      recursiveDelete require.cache[fullname].children
    delete require.cache[fullname]
  require(fullname)
