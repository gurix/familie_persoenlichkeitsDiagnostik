require 'rails_helper'

describe ProfilesController do
  let!(:user) { create :user }

  describe '#index' do
    it 'redirects to the user profile via view_token' do
      sign_in(user)
      response = get :index, locale: :de

      expect(response).to redirect_to profile_path(user.view_token)
    end
  end
end
