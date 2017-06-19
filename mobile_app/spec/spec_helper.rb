Encoding.default_external = 'UTF-8' # Force the use of UTF-8 in external IO objects

require 'rubygems'
require 'mongoid'
require 'capybara'
require 'capybara/dsl'
require 'capybara/rspec'
require 'touch_action'
require 'pry'
require 'faker'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir.glob('spec/support/**/*.rb').each { |f| require f.sub(%r{^spec/}, '') }

Mongoid.load!('../rails_app/config/mongoid.yml', :test)

Capybara.run_server = false

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.javascript_driver = :selenium

Capybara.app_host = 'http://localhost:8100'

Capybara.default_max_wait_time = 5 # Give angular some extra time, capybara is to fast at the moment

RSpec.configure do |config|
  config.after(:each) do
    Mongoid.purge!
    Capybara.current_session.driver.quit
  end
end
