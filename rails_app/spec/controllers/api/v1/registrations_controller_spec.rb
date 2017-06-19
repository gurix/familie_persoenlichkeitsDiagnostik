require 'rails_helper'

describe Api::V1::RegistrationsController do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  it 'registers a new user' do
    expect do
      post :create, params: { user: { email: 'test@bla.de',
                                      password: 'xxxx',
                                      password_confirmation: 'xxxx',
                                      first_name: 'Hans',
                                      last_name: 'Muster',
                                      gender: 23,
                                      birth_date: 32.years.ago,
                                      group: 'edelweiss' } }
    end.to change { User.count }.by(1)

    expect(User.find_by(email: 'test@bla.de').group).to eq 'edelweiss'
  end

  it 'tests whether an email already exists' do
    create :user, email: 'hans@wurst.at'

    get :email_exists, params: { email: 'hans@wurst.at' }
    expect(JSON.parse(response.body)).to eq 'email_exists' => true

    get :email_exists, params: { email: 'max@muster.at' }
    expect(JSON.parse(response.body)).to eq 'email_exists' => false
  end
end
