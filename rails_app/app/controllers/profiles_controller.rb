class ProfilesController < ApplicationController
  skip_before_action :authenticate_user!, only: :show

  def index
    redirect_to profile_path(current_user.view_token)
  end

  def show
    @user = User.find_by(view_token: params[:id])
  end
end
