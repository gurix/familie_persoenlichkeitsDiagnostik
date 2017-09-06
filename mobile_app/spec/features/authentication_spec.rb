require 'spec_helper'

RSpec.describe 'Authentication', js: true, type: :feature do
  scenario 'signs up' do
    visit '/'

    click_link 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen'

    expect(page).not_to have_content 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen'

    fill_in 'E-Mail', with: 'hans.muster@bla.de'

    click_button 'Weiter'
    sleep 0.2
    fill_in 'Passwort', with: 1234, match: :prefer_exact # here we need exact values, otherwise it find two time "Passwort"
    sleep 0.2
    fill_in 'Passwort bestätigen', with: 1234, match: :prefer_exact

    fill_in 'Vorname', with: 'Hans'
    fill_in 'Nachname', with: 'Muster'

    fill_in 'Geburtsdatum', with: '01011998'
    sleep 1

    find('.item', text: 'Andere').click

    click_button 'Weiter'

    expect(page).to have_content 'Eltern im Fokus'
  end

  scenario 'signs out and sign in again' do
    register_user

    find('.item', text: 'Abmelden').click

    click_button 'Ok'

    expect(page).to have_content 'Mit Hilfe dieser Diagnostik-App erfassen Sie zu verschiedenen Tageszeiten Ihre elterlichen Bedürfnisse und ihr Kompetenzgefühl. Die App ist zur Unterstützung des Beratungsprozesses entwickelt worden und soll auch in die Beratung eingebettet werden.'

    fill_in 'E-Mail', with: 'hans@muster.ch'

    click_button 'Weiter'

    fill_in 'Passwort', with: 'xxxx', match: :prefer_exact

    click_button 'Weiter'

    expect(page).to have_content 'Eltern im Fokus'
  end
end
