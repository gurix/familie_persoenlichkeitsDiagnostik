require 'rails_helper'

describe Session do
  it { is_expected.to validate_presence_of(:started_at) }
  it { is_expected.to validate_presence_of(:situation) }
  it { is_expected.to validate_presence_of(:version) }
  it { is_expected.to validate_presence_of(:local_id) }
  it { is_expected.to validate_uniqueness_of(:local_id).scoped_to(:user_id) }

  it { expect(subject).to belong_to(:user) }
  it { is_expected.to embed_many(:answers) }
end
