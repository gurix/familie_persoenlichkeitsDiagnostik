role :web, ENV['PRODUCTION_SERVER']
role :app, ENV['PRODUCTION_SERVER']

set :branch, ENV['PRODUCTION_BRANCH']

set :deploy_to, ENV['PRODUCTION_DIR']
set :linked_files, fetch(:linked_files, []).push('.env.production')
