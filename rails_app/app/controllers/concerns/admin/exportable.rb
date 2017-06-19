module Admin
  module Exportable
    extend ActiveSupport::Concern

    included do
      before_action :authenticate_administrator
    end

    def json_response_header_for(collection_name)
      response.headers['Content-Disposition'] = "attachment; filename=#{collection_name}.json"
      response.headers['Content-Type'] = 'application/json'
    end
  end
end
