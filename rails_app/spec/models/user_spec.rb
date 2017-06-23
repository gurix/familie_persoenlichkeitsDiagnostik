require 'rails_helper'

describe User do
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_presence_of(:first_name) }
  it { is_expected.to validate_presence_of(:last_name) }
  it { is_expected.to validate_presence_of(:gender) }
  it { is_expected.to validate_presence_of(:birth_date) }

  it { expect(subject).to validate_uniqueness_of(:view_token) }

  it 'generates a view token automatically' do
    user = create :user
    expect(user.view_token).not_to be_empty
  end

  it { expect(subject).to have_many(:sessions).with_dependent(:destroy) }
end
