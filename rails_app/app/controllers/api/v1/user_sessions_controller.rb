module Api
  module V1
    class UserSessionsController < Devise::SessionsController
      include Base
      skip_before_action :verify_authenticity_token

      def create
        self.resource = warden.authenticate!(auth_options)
        sign_in(resource_name, resource)
        render json: resource
      end
    end
  end
end
