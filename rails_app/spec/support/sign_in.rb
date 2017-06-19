module FeatureSpecsLoginHelper
  # See https://github.com/plataformatec/devise/wiki/How-To%3a-Test-with-Capybara
  include Warden::Test::Helpers
  Warden.test_mode!

  def sign_in_as(user)
    login_as user
    user
  end

  def sign_in_as_user(options = {})
    user = create :user, options
    sign_in_as user
  end
end

module ControllerSpecsLoginHelper
  # Use this method to sign in via authenticate_or_request_with_http_basic
  def sign_in_via_http
    password = 'pass'
    user = create :user, password: password
    request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Basic.encode_credentials(user.email, password)
    user
  end
end

RSpec.configure do |config|
  config.include FeatureSpecsLoginHelper, type: :feature
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.include ControllerSpecsLoginHelper, type: :controller
end
