require 'spec_helper'

RSpec.describe 'custom fields', js: true, type: :feature do
  before do
    register_user
  end

  it 'adds custom fields' do
    click_link 'Meine Entwicklungsgedanken'
    within '#custom_field_0' do
      expect(page).to have_content '1. Entwicklungsgedanke'

      expect(page).to have_content 'Füllen Sie alle Felder aus um den Entwicklungsgedanken zu aktivieren.'

      fill_in 'Name des Entwicklungsgedanken', with: 'Test'
      fill_in 'Titel / Frage', with: 'Wo ist Walter?'
      fill_in 'Text für tiefe Ausprägung', with: 'Links'
      fill_in 'Text für hohe Ausprägung', with: 'Rechts'

      expect(page).not_to have_content 'Füllen Sie alle Felder aus um den Entwicklungsgedanken zu aktivieren.'
      expect(page).to have_content 'Dieser Entwicklungsgedanke wird in der nächsten Situation miteinbezogen.'
    end
    within '#custom_field_1' do
      expect(page).to have_content '2. Entwicklungsgedanke'

      fill_in 'Name des Entwicklungsgedanken', with: 'Test'
      expect(page).to have_content 'Sie haben mehrere Entwicklungsgedanken gleich benannt, bitte geben Sie jedem einen eigenen Namen'

      fill_in 'Name des Entwicklungsgedanken', with: 'NotTest'
      expect(page).to_not have_content 'Sie haben mehrere Entwicklungsgedanken gleich benannt, bitte geben Sie jedem einen eigenen Namen'
    end
  end
end
