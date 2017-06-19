require 'rails_helper'

describe Admin::Export::SessionsController do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  let!(:user) { create :user }
  let!(:admin) { create :user, admin: true }

  context 'as normal user' do
    it 'refuses access' do
      sign_in(user)

      get :index

      expect(response.status).to eq 401
    end
  end

  context 'as normal user' do
    let!(:first_session) { create :session, :with_answers, user: user }
    let!(:second_session) { create :session, :with_answers, user: user }

    it 'downloads a list with session data' do
      sign_in(admin)

      get :index

      expect(response.status).to eq 200

      sessions = JSON.parse response.body

      expect(sessions.first['description']).to eq first_session.description
      expect(sessions.first['answers'].first['key']).to eq first_session.answers.first.key

      expect(sessions.last['description']).to eq second_session.description
      expect(sessions.last['answers'].first['key']).to eq second_session.answers.first.key
    end
  end
end
