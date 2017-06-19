FactoryGirl.define do
  factory :answer do
    key { Faker::Lorem.characters(4) }
    value { rand(-50..50) }
    recoded { [true, false].sample }
    recoded_value { recoded ? value * -1 : value }
    position { rand(100) }
    meta { { unicorns: 3, owner: 'hans' } }
  end
end
