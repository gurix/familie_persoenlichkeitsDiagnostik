require 'rails_helper'

describe Api::V1::UsersController do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  it 'returns my user data' do
    expect_any_instance_of(User).to receive(:updated_at).and_return(Date.new(2013, 5, 6))

    user = create :user, email:      'toni@svp.ch',
                         password:   'Christoph isch geil!',
                         first_name: 'Toni',
                         last_name:  'Brunner',
                         gender:     12,
                         birth_date: Date.new(1974, 8, 23),
                         group:       'clinical'

    get :show, params: { user_token: user.authentication_token, user_email: user.email }

    result = JSON.parse(response.body)

    expect(result['_id']['$oid']).to eq user.id.to_s
    expect(result['authentication_token']).to eq user.authentication_token
    expect(result['email']).to eq 'toni@svp.ch'
    expect(result['first_name']).to eq 'Toni'
    expect(result['last_name']).to eq 'Brunner'
    expect(result['gender']).to eq 12
    expect(result['birth_date']).to eq '1974-08-23T00:00:00.000Z'
    expect(result['updated_at']).to eq '2013-05-06'
    expect(result['group']).to eq 'clinical'
  end

  it 'updates an existing user' do
    expect_any_instance_of(User).to receive(:updated_at).and_return(Date.new(2013, 5, 6))

    user = create :user, email:      'toni@svp.ch',
                         password:   'Christoph isch geil!',
                         first_name: 'Toni',
                         last_name:  'Brunner',
                         gender:     12,
                         birth_date: Date.new(1974, 8, 23),
                         group:       'clinical'

    changes = {
      first_name: 'Walter',
      last_name:  'Müller',
      gender:     70,
      birth_date: Date.new(1984, 4, 12),
      group:       'abcdefg'
    }

    put :update, params: { user: changes, user_token: user.authentication_token, user_email: user.email }

    result = JSON.parse(response.body)

    expect(result['_id']['$oid']).to eq user.id.to_s
    expect(result['authentication_token']).to eq user.authentication_token
    expect(result['email']).to eq 'toni@svp.ch'
    expect(result['first_name']).to eq 'Walter'
    expect(result['last_name']).to eq 'Müller'
    expect(result['gender']).to eq 70
    expect(result['birth_date']).to eq '1984-04-12T00:00:00.000Z'
    expect(result['updated_at']).to eq '2013-05-06'
    expect(result['group']).to eq 'abcdefg'
  end
end
