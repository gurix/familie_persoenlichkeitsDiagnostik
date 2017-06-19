require 'rails_helper'

describe Api::V1::UserSessionsController do
  let!(:user) { create :user, email: 'toni@svp.ch', password: 'Christoph isch geil!' }

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  it 'sign_in an existing user' do
    post :create, params: { user: { email: 'toni@svp.ch', password: 'Christoph isch geil!' } }

    result = JSON.parse(response.body)

    expect(result['_id']['$oid']).to eq user.id.to_s
    expect(result['authentication_token']).to eq user.authentication_token
    expect(result['email']).to eq 'toni@svp.ch'
  end

  it 'does not sign_in an existing user with false password' do
    post :create, params: { user: { email: 'toni@svp.ch', password: 'Obama isch geil!' } }

    expect(response.body).to be_empty
  end
end
