require 'spec_helper'

feature 'Authentication' do
  scenario 'A guest signs in' do
    create :user, email: 'hans.muster@somedomain.tld', password: 'Columbo'

    visit main_app.user_session_path

    fill_in 'E-Mail-Adresse', with: 'hans.muster@somedomain.tld'
    fill_in 'Passwort', with: 'Columbo'

    click_button 'Anmelden'

    expect(page).to have_content 'Erfolgreich angemeldet.'
  end
end
