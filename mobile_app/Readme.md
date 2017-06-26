# Beziehung und Erziehungskompetenz mobile application

## Database
We are using Mongoid as backend database. Ensure you have a mongodb server running during development and testing.


## Development in browser
x 1. Start a rails instance (by default on http://localhost:3000) that runs in the development environment:
```
cd rails_app
rails s
```
The app is now be able to manage data over the rails instance.

x 2. You can start the mobile app in your browser that creates an instance on http://localhost:8100.
```
cd mobile_app
ionic serve
```

## Testing
x 1. Start a rails instance (by default on http://localhost:3000) that runs in the test environment
```
cd rails_app
RAILS_ENV=test rails s
```
x 2. Ensure your url to the backend in `app.js` is configured to `http://localhost:3000`

x 3. Start an instantce of the application as browser plattform
```
cd mobile_app
ionic serve
```
x 4. Now we can just use rspec for feature testing...
```
cd mobile_app
rspec
```
