require 'factory_girl'
require 'faker'

# Delete old user data
User.where(email: 'hans@muster.de').each do |u|
  u.delete
  puts 'User deleted'
end

# Create a new user
user = FactoryGirl.create(:user, email: 'hans@muster.de', password: 'test')
puts 'User created'

# For each image, create a random situation
1000.times do |i|
  FactoryGirl.create(:session, :with_answers, user: user)
  puts "Session #{i} created"
end
