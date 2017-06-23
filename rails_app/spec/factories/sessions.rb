FactoryGirl.define do
  factory :session do
    started_at { 12.hours.ago }
    situation { [:family, :work, :recreation, :holidays, :transportation].sample }
    version { 0 }
    description { Faker::Hacker.say_something_smart }
    local_id { SecureRandom.hex(5) }
    
    trait :with_answers do
      after(:build) do |session|
        items = %w(mrs20_e1 mrs20_e2 mrs20_e3 mrs20_e4 mrs20_g1 gmrs20_g2 mrs20_g3 mrs20_g4 mrs20_n1 mrs20_n2 mrs20_n3
                   mrs20_n4 mrs20_k1 mrs20_k2 mrs20_k3 mrs20_k4 mrs20_v1 mrs20_v2 mrs20_v3 mrs20_v4 panava_pa1 panava_pa3
                   panava_na1 panava_na3 panava_va1 panava_va2)
        items.shuffle.each_with_index do |key, position|
          session.answers << build(:answer, key: key, position: position)
        end
        session.answers << build(:answer, key: 'lalelu', meta: { key: 'lalelu' })
        session.answers << build(:answer, key: 'Yo Yo Yo', meta: { key: 'Yo Yo Yo' })
      end
    end
  end
end
