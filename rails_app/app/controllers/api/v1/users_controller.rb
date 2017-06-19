module Api
  module V1
    class UsersController < ApplicationController
      include Base

      def void; end

      def show
        render json: current_user.to_json
      end

      def update
        current_user.update_attributes user_params
        render json: current_user.to_json
      end

      def user_params
        params.require(:user).permit(:first_name,
                                     :last_name,
                                     :gender,
                                     :birth_date)
      end
    end
  end
end
