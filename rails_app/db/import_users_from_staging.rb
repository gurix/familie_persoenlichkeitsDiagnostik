client = Mongo::Client.new(ENV['STAGING_MONGO_URL'])

client[:users].find().each do |d|
  # Try to find the corresponding user on the productive server
  user  = User.where(email: d['email'])
  next if user.any? # Skip if there is already one
  
  # Instantiate a new user
  u = User.new
  
  # Copy the content of all fields from staging to the new user 
  User.fields.keys.each do |key|
    u[key] = d[key]
    u.password = '1234'
  end
  u.save
  
  puts "Added " +  d['email'] 
end

client[:sessions].find().each do |d| 
  session = Session.where(local_id: d['local_id'])
  next if session.any? # Skip if there is already one

  # Instantiate a new session
  s = Session.new

  # Copy the content of all fields from staging to the new user 
  Session.fields.keys.each do |key|
    s[key] = d[key]
    s['answers'] = d['answers']
  end
  s.save

  puts "Added " +  d['local_id']
end