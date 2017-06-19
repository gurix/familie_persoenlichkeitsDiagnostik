class RegistrationsController < Devise::RegistrationsController
  protected

  def update_resource(resource, params)
    resource.reset_view_token if params['reset_profile_url'] == '1'
    resource.update_without_password(params)
  end
end
