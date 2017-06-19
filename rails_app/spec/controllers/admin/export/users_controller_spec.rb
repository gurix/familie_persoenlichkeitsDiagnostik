require 'rails_helper'

describe Admin::Export::UsersController do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  let!(:user) { create :user, email: 'mary.jane@hightimes.com', first_name: 'Mary', last_name: 'Jane', gender: 42 }
  let!(:admin) { create :user, admin: true, email: 'hanf.ueli@win.ch' }

  context 'as normal user' do
    it 'refuses access' do
      sign_in(user)

      get :index

      expect(response.status).to eq 401
    end
  end

  context 'as normal user' do
    it 'downloads a list with user data' do
      sign_in(admin)

      get :index

      expect(response.status).to eq 200

      users = JSON.parse response.body

      expect(users.first['id']).to eq user.id.to_s
      expect(users.first['email']).to eq 'mary.jane@hightimes.com'
      expect(users.first['first_name']).to eq 'Mary'
      expect(users.first['last_name']).to eq 'Jane'
      expect(users.first['gender']).to eq 42
      expect(users.first['admin']).to eq false

      expect(users.last['id']).to eq admin.id.to_s
      expect(users.last['email']).to eq 'hanf.ueli@win.ch'
      expect(users.last['admin']).to eq true
    end
  end
end
