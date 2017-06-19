require 'spec_helper'

RSpec.describe 'User', js: true, type: :feature do
  before do
    register_user

    @current_user_id = page.evaluate_script 'angular.element(document.body).scope().user.id'
  end

  scenario 'A user changes his account settings' do
    click_link 'Meine persönlichen Daten'

    fill_in 'Vorname', with: 'Peter'
    fill_in 'Nachname', with: 'Griffin'

    fill_in 'Geburtsdatum', with: '12121999'

    find('.item', text: 'Andere').click

    find('.item', text: 'Gruppe B').click

    sleep 1
    click_button 'Speichern'

    expect(page.evaluate_script('angular.element(document.body).scope().user.first_name')).to eq 'Peter'
    expect(page.evaluate_script('angular.element(document.body).scope().user.last_name')).to eq 'Griffin'
    expect(page.evaluate_script('angular.element(document.body).scope().user.gender')).to eq 50
    expect(page.evaluate_script('angular.element(document.body).scope().user.birth_date')).to have_content '1999'
  end
end
