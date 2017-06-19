require 'json'
require 'open-uri'
require 'factory_girl'
require 'faker'

# Download the actuall gallery from imgur.com
images = JSON.parse(open('http://imgur.com/gallery.json').read)['data']
# Filter Jpegs and ignore albums
only_jpgs = images.select { |img| img['ext'] == '.jpg' && img['is_album'] == false }
# Just sample 100 and create a list of arrays with urls to the image
image_paths = only_jpgs.sample(100).map { |img| "http://i.imgur.com/#{img['hash']}#{img['ext']}" }

# Delete old user data
User.where(email: 'hans@muster.it').each do |u|
  u.delete
  puts 'User deleted'
end

# Create a new user
user = FactoryGirl.create(:user, email: 'hans@muster.it', password: 'test')
puts 'User created'

# For each image, create a random situation
image_paths.each_with_index do |url, i|
  sleep 0.5
  image = "data:image/jpeg;base64,#{Base64.encode64(open(url).read)}"
  puts "Download #{url}"
  FactoryGirl.create(:session, :with_answers, user: user, image: image)
  puts "Session #{i} created"
end
