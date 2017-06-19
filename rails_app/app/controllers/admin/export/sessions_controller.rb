module Admin
  module Export
    class SessionsController < ApplicationController
      include Admin::Exportable

      def index
        json_response_header_for('sessions')
        response_data
      ensure
        response.stream.close
      end

      private

      def response_data
        response.stream.write '['
        Session.without(:image).each_with_index do |session, index|
          response.stream.write session.as_document.to_json
          response.stream.write ',' if index < Session.count - 1
        end
        response.stream.write ']'
      end
    end
  end
end
