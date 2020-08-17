# Features
* Build with [webpack 4](https://webpack.js.org/) and [babel 7](https://babeljs.io/)
* Test with [jest](https://jestjs.io)
* Lint with [eslint](http://eslint.org/) (Using ["Standard JS" config](https://github.com/standard/eslint-config-standard) as default)
* Hot reloading with [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)

# Getting started
1. [Clone this repo from github](https://github.com/Naartti/npm-package-boilerplate)
1. Create a new repo on GitHub
1. Inside the local new repo directory run `git remote set-url origin git@github.com:yourname/NewProject.git`
1. Rename to your package name in package.json


# Usage
## Development
- ```npm run dev```
- This opens [localhost:8080/your-module-name](localhost:8080/your-module-name) in Chrome automatically (Can be removed from webpack.config.js)
- Edit your code and enjoy hot reloading

## Test driven development
- ```npm run watch```
- Edit your code and follow tests in your terminal

## Run tests
- ```npm run test```

## Build package
- ```npm run prod``` Run tests, lint and builds the module
- ```npm version patch``` (or ```minor```/```major``` etc.)
- ```npm publish```
