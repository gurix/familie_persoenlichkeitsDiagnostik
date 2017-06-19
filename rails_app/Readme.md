# Persönlichkeitsdiagnostik Ruby on Rails application
## Development
Starting a local rails instance (by default on localhost:3000)
```
rails s
```

## Deployment
### Heroku
```
git subtree push --prefix rails_app heroku master
```
### Capistrano
Deployment via capistrano needs some configuration using environment variables. We simply use dotenv (https://github.com/bkeepers/dotenv) to load environment variables from .env into ENV.

`.env`:
```
PRODUCTION_SERVER=user@server
PRODUCTION_BRANCH=master
PRODUCTION_DIR=/directory/to/my/app
```

`.env.production`:
```
FROM_EMAIL="My name <my@email>"
SMTP_HOST=my_smtp_server
SMTP_USER=smtp_user@smtp_server
SMTP_PASSWORD=password
SMTP_PORT=587
SMTP_DOMAIN=my_domain
MONGO_URL=mongodb://user:password@localhost:27017/database
SECRET_KEY_BASE=change_this_value_with_a_random_string
```
Also copy the files to your production servers shared folder `/directory/to/my/app/shared`.

`bundle exec cap production deploy` finally deploys your app.
 
## Testing
You can test the whole rails app with using rspec:
```
rspec
```
