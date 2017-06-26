require 'net/http'
require 'uri'

# Procedures to register a user before each test

def user_attributes
  { email: 'hans@muster.ch',
    password: 'xxxx',
    password_confirmation: 'xxxx',
    first_name: 'Hans',
    last_name: 'Muster',
    gender: 100,
    birth_date: 32.years.ago}
end

def create_user_remotely(user)
  Net::HTTP.start('localhost', 3000) { |http| http.post('/api/v1/sign_up', { user: user }.to_http_params) }
end

def register_user
  create_user_remotely(user_attributes())

  sleep 0.2
  visit('/')

  click_link 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen'

  expect(page).not_to have_content 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen'

  fill_in 'E-Mail', with: 'hans@muster.ch'

  click_button 'Weiter'

  fill_in 'Passwort', with: 'xxxx', match: :prefer_exact

  click_button 'Weiter'

  expect(page).to have_content 'Beziehung und Erziehungskompetenz'
end
