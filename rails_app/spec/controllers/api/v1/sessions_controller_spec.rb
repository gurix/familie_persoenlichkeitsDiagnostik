require 'rails_helper'

describe Api::V1::SessionsController do
  let!(:user) { create :user }

  let!(:another_user) { create :user, email: 'christoph@svp.ch' }

  let!(:first_session) { create :session, updated_at: 12.days.ago, user: user }
  let!(:second_session) { create :session, updated_at: 2.minutes.ago, user: user }
  let!(:another_session) { create :session, updated_at: 13.days.ago, user: another_user }

  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  it 'returns a list with all sessions and their update timestamps' do
    get :index, params: { user_token: user.authentication_token, user_email: user.email }

    result = JSON.parse(response.body)
    expect(result.first['local_id']).to eq first_session.local_id
    expect(result.last['local_id']).to eq second_session.local_id
  end

  it 'updates an existing session' do
    put :update, params: { id: first_session, session: { started_at: Time.utc(2011, 7, 20) }, user_token: user.authentication_token, user_email: user.email }

    expect(first_session.reload.started_at).to eq Time.utc(2011, 7, 20)
  end

  it 'adding a new session' do
    expect do
      session = build(:session, :with_answers)
      post :create, params: { session: session.as_document, user_token: user.authentication_token, user_email: user.email }
    end.to change { Session.count }.by(1)

    inserted_session = Session.asc(:created_at).last

    expect(inserted_session.answers.first.meta['unicorns']).to eq '3'
    expect(inserted_session.answers.first.meta['owner']).to eq 'hans'
  end
end
