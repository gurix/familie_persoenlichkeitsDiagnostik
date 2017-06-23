module Api
  module V1
    class SessionsController < ApplicationController
      include Base
      before_action :authenticate_user!
      before_action :load_session, only: [:show, :update]

      def void; end

      def show
        render json: @session.to_json
      end

      def index
        @sessions = current_user.sessions
        render json: @sessions.to_json(only: [:_id, :updated_at, :local_id])
      end

      def update
        @session.update_attributes session_params
        render json: @session.to_json(only: [:_id, :updated_at, :local_id])
      end

      def create
        @session = current_user.sessions.create(session_params)
        render json: @session.to_json(only: [:_id, :updated_at, :local_id])
      end

      private

      def load_session
        @session = current_user.sessions.find(params[:id])
      rescue Mongoid::Errors::DocumentNotFound
        render text: 'Not Found', status: 404
      end

      def answer_fields
        meta = []
        if params[:session][:answers]
          meta = params[:session][:answers].map do |answer|
            meta = answer.try(:fetch, :meta, {})
            meta.respond_to?('keys') ? meta.keys : []
          end.flatten.uniq
        end
        [:key, :value, :recoded, :recoded_value, :position, meta: meta]
      end

      def session_params
        params.require(:session).permit(:local_id,
                                        :started_at,
                                        :image,
                                        :situation,
                                        :description,
                                        :version,
                                        :deleted_at,
                                        gps_position: [:lat, :long],
                                        answers: answer_fields)
      end
    end
  end
end
