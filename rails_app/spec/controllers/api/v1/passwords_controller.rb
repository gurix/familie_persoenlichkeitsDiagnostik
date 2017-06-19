require 'rails_helper'

describe Api::V1::PasswordsController do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  let!(:user) { create :user, email: 'test@bla.de' }

  it 'sends passwort recover instructions' do
    expect do
      post :create, params: { user: { email: 'test@bla.de' } }
    end.to change { user.reload.reset_password_token }

    expect(ActionMailer::Base.deliveries.count).to eq 1
  end
end
