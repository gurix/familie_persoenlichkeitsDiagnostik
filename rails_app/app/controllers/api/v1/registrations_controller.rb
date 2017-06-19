module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      include Base

      skip_before_action :verify_authenticity_token

      def email_exists
        render json: { email_exists: User.where(email: params[:email]).count > 0 }
      end
    end
  end
end
