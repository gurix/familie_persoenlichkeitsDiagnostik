module Admin
  module Export
    class UsersController < ApplicationController
      include Admin::Exportable

      def index
        json_response_header_for('users')
        response_data
      ensure
        response.stream.close
      end

      private

      def response_data
        response.stream.write '['
        User.each_with_index do |user, index|
          response.stream.write user.as_document.to_json(except: %w(authentication_token view_token))
          response.stream.write ',' if index < User.count - 1
        end
        response.stream.write ']'
      end
    end
  end
end
