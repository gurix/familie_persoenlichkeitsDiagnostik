FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    password { Faker::Lorem.words(8).join }
    last_sign_in_at { 12.days.ago }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    gender { Random }
    birth_date { Faker::Date.backward(3650) }
    group { %w(clinical occupational).sample }
  end
end
