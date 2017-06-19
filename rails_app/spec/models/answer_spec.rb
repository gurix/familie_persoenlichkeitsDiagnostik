require 'rails_helper'

describe Answer do
  it { is_expected.to validate_presence_of(:key) }
  it { is_expected.to validate_presence_of(:value) }
  it { is_expected.to validate_presence_of(:recoded) }
  it { is_expected.to validate_presence_of(:recoded_value) }
  it { is_expected.to validate_presence_of(:position) }

  it { expect(subject).to be_embedded_in(:session) }
end
