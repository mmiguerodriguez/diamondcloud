# Diamond Cloud

Diamond Cloud is a web and mobile platform where teams can work collaboratively in real time, in the cloud, and have all their communications in one place. Each team can create boards where teammates can draw and place modules such as a Google Drive integration, task manager, and video conferencing.

We also provide an easy to use API for third-party developers to create their own modules.

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
