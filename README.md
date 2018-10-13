## Run project

```bash
yarn start
```

## Run tests

```bash
yarn test
```

## Add application to heroku

```bash
heroku create
```

## Push changes to heroku

```bash
git push heroku master
```

## Other heroku commands

```bash
// login
heroku login

// Open heroku app
heroku open

// Scale web app
heroku ps:scale web=1

// Show running processes
heroku ps

// Add mongodb plugin
heroku addons:create mongolab:sandbox

// mongodb docs
heroku addons:docs mongolab

// Rename web app
heroku apps:rename snapdev-cli-api
```
