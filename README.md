# Diamond Cloud

Diamond cloud is a ...

# Modules building
**Production build**
```sh
$ cd cloud/public/modules/{module_id}
$ webpack --config webpack.production.config.js
```

**Development build**
```sh
$ cd cloud/public/modules/{module_id}
$ webpack --config webpack.development.config.js
```

If you want to add information when building modules add the following
extra parameters when calling webpack
```sh
$ webpack --config ... --progress --profile --colors
```
