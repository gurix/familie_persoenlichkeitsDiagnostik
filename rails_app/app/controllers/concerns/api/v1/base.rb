module Api
  module V1
    module Base
      extend ActiveSupport::Concern

      included do
        respond_to :json
        protect_from_forgery with: :null_session
        skip_before_action :authenticate_user!

        acts_as_token_authentication_handler_for User
      end
    end
  end
end
