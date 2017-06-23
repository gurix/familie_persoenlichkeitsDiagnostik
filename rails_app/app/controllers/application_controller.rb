class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use with :null_session instead.
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!

  def configure_permitted_parameters
    additional_keys = [:email_confirmation, :first_name, :last_name, :gender, :birth_date, :reset_profile_url]
    devise_parameter_sanitizer.permit(:sign_up, keys: additional_keys)
    devise_parameter_sanitizer.permit(:account_update, keys: additional_keys)
  end

  def authenticate_administrator
    return if current_user.try :admin?
    authenticate_or_request_with_http_basic do |user_name, password|
      user = User.find_by(email: user_name)
      result = user.valid_password?(password) && user.admin?
      sign_in(:user, user) if result
      result
    end
  end
end
