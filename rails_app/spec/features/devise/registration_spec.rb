require 'spec_helper'

feature 'Registration' do
  scenario 'A guest signs up' do
    visit new_user_registration_path

    fill_in 'E-Mail-Adresse', with: 'hans.muster@somedomain.tld'
    fill_in 'E-Mail-Adresse wiederholen', with: 'hans.muster@somedomain.tld'

    fill_in 'Passwort', with: 'test123'
    fill_in 'Passwort wiederholen', with: 'xxxx'

    fill_in 'Vorname', with: 'Hans'
    fill_in 'Nachname', with: 'Muster'

    choose 'Gruppe A'

    fill_in 'Geburtsdatum', with: '12.12.1988'

    click_button 'Registrieren'

    expect(page).to have_content 'Konnte konto nicht speichern: ein Fehler'

    fill_in 'Passwort', with: 'Peugeot403'
    fill_in 'Passwort wiederholen', with: 'Peugeot403'

    click_button 'Registrieren'

    expect(page).to have_content 'Sie haben sich erfolgreich registriert'

    expect(User.count).to eq 1
  end
end
