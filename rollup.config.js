// rollup.config.js
import { defineConfig } from 'rollup'
import userScriptHeader from 'rollup-plugin-tampermonkey-header'
import path from 'path'
import fs from 'fs'

const userDefinedOptions = {
  metaPath: path.resolve(__dirname, 'src', 'meta.json')
}

const isObject = (arg) => {
  return Object.prototype.toString.call(arg) === '[object Object]'
}
const mergeRollupConfigs = function (object, ...sources) {
  sources.forEach((source) => {
    if (!isObject(source)) {
      return
    }
    Object.entries(source).forEach(([name, value]) => {
      if (name in object) {
        if (value === null || value === undefined) {
          return
        }
        const objectValue = object[name]
        if (Array.isArray(objectValue)) {
          if (name === 'plugins') {
            const pluginNames = objectValue.map((plugin) => plugin.name)
            value.forEach((plugin) => {
              const index = pluginNames.indexOf(plugin.name)
              if (index > -1) {
                Object.assign(objectValue[index], plugin)
              } else {
                objectValue.push(plugin)
              }
            })
          } else {
            object[name] = Array.from(
              new Set([
                ...objectValue,
                ...(typeof value === 'object' ? Object.values(value) : [value])
              ])
            )
          }
        } else if (isObject(objectValue)) {
          Object.assign(object[name], value)
        } else {
          object[name] = value
        }
      } else {
        object[name] = value
      }
    })
  })
  return object
}

const commonConfigs = require('./rollup_configs/default.js')
const rollupConfigsPath = require('path').join(__dirname, 'rollup_configs')
try {
  const files = fs.readdirSync(rollupConfigsPath)
  files.forEach(function (file) {
    if (file === 'default.js') return
    const configs = require('./rollup_configs/' + file).default
    mergeRollupConfigs(commonConfigs, configs)
  })
} catch (err) {
  console.log(err)
}

function devConfigs() {
  let userScriptHeaderContent = []
  return defineConfig({
    input: 'src/main.ts',
    output: {
      file: 'dist/dev.user.js',
      format: 'iife',
      sourcemap: 'inline'
    },
    watch: {
      exclude: 'dist'
    },
    plugins: [
      ...commonConfigs.plugins,
      userScriptHeader({
        metaPath: userDefinedOptions.metaPath,
        transformHeaderContent(items) {
          const newItems = items
            .filter(([name]) => !['@supportURL', '@updateURL', '@downloadURL'].includes(name))
            .map(([name, value]) => {
              if (name === '@name') {
                return [name, `${value} Dev`]
              } else {
                return [name, value]
              }
            })
          userScriptHeaderContent = [...newItems]
          return newItems
        }
      }),
      {
        name: 'show-dev-path',
        generateBundle(options, bundle) {
          const filePath = path.resolve(__dirname, options.file)
          console.log(
            '\n✅Dev plugin is ready. Please paste the path to browser and install in Tampermonkey: \n\x1b[1m\x1b[4m\x1b[36m%s\x1b[0m\n',
            filePath
          )
        }
      }
    ]
  })
}

function prodConfigs() {
  const outputFile = 'main.user.js'
  return defineConfig({
    input: 'src/main.ts',
    output: {
      file: outputFile,
      format: 'iife'
    },
    plugins: [
      ...commonConfigs.plugins,
      userScriptHeader({
        metaPath: userDefinedOptions.metaPath,
        outputFile
      })
    ]
  })
}

const isDev = process.env.BUILD === 'development'
export default isDev ? devConfigs() : prodConfigs()
