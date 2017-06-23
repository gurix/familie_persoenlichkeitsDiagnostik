require 'spec_helper'

feature 'Account Settings' do
  let!(:user) { sign_in_as_user }

  scenario 'A user edits his account settings' do
    visit edit_user_registration_path

    fill_in 'E-Mail-Adresse', with: 'trouble@bettercallsaul.com'

    click_button 'Speichern'

    expect(user.reload.email).to eq 'trouble@bettercallsaul.com'
  end

  scenario 'A user resets his profile url' do
    visit edit_user_registration_path

    expect do
      click_button 'Speichern'
    end.not_to change { user.reload.view_token }

    visit edit_user_registration_path
    check 'Neue Profiladresse erstellen'

    expect do
      click_button 'Speichern'
    end.to change { user.reload.view_token }
  end
end
