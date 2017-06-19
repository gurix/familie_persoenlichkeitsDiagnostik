module Profiles
  class SessionsController < ApplicationController
    skip_before_action :authenticate_user!

    def index
      @sessions = user.sessions.desc(:started_at)
      render json: @sessions.to_json
    end

    private

    def user
      User.find_by(view_token: params[:profile_id])
    end
  end
end
