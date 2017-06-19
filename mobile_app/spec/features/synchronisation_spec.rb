require 'spec_helper'
require 'net/http'
require 'uri'

RSpec.describe 'Synchronisation', js: true, type: :feature do
  before do
    register_user

    @current_user_email = page.evaluate_script 'angular.element(document.body).scope().user.email'
    @current_user_token = page.evaluate_script 'angular.element(document.body).scope().user.authentication_token'
    @current_user_id =    page.evaluate_script 'angular.element(document.body).scope().user.id'
  end

  scenario 'It updates the user remotely when the user changes localy' do
    click_link 'Meine persönlichen Daten'

    fill_in 'Vorname', with: 'Peter'
    fill_in 'Nachname', with: 'Griffin'

    fill_in 'Geburtsdatum', with: '12121999'
    sleep 1

    find('.item', text: 'Gruppe B').click

    click_button 'Speichern'

    page.find('a', text: 'Meine Daten synchronisieren').click

    sleep 1
    result = Net::HTTP.get(URI.parse("http://localhost:3000/api/v1/user?user_email=#{@current_user_email}&user_token=#{@current_user_token}"))

    expect(result).to have_content 'Peter'
    expect(result).to have_content 'Griffin'
    expect(result).to have_content 'occupational'
  end

  scenario 'It changes the user locally when the user changes remotely' do
    user = { first_name: 'Puffel',
             last_name: 'Knuffel',
             gender: 12,
             group: 'occupational' }

    Net::HTTP.start('localhost', 3000) do |http|
      http.put("/api/v1/user?user_email=#{@current_user_email}&user_token=#{@current_user_token}", { user: user }.to_http_params)
    end

    page.find('a', text: 'Meine Daten synchronisieren').click
    sleep 1

    expect(page.evaluate_script('angular.element(document.body).scope().user.first_name')).to eq 'Puffel'
    expect(page.evaluate_script('angular.element(document.body).scope().user.last_name')).to eq 'Knuffel'
    expect(page.evaluate_script('angular.element(document.body).scope().user.gender')).to eq 12
    expect(page.evaluate_script('angular.element(document.body).scope().user.group')).to eq 'occupational'
  end

  scenario 'It uploads a situation when it does not exist on the server' do
    session = {
      started_at: 12.days.ago,
      local_id: 'ABCDE',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      group: 'occupational'
    }

    page.execute_script "angular.element(document.body).scope().sessions.push(#{session.to_json})"

    page.find('a', text: 'Meine Daten synchronisieren').click
    sleep 1
    expect(page).not_to have_selector('progress')

    result = Net::HTTP.get(URI.parse("http://localhost:3000/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}"))
    remote_sessions = JSON.parse(result)

    expect(remote_sessions.first['local_id']).to eq 'ABCDE'
  end

  scenario 'It downloads a session when it does not exist locally' do
    remote_session = {
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'It comes from the server',
      group: 'occupational'
    }

    Net::HTTP.start('localhost', 3000) do |http|
      http.post("/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}", { session: remote_session }.to_http_params)
    end

    page.find('a', text: 'Meine Daten synchronisieren').click
    sleep 1

    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].local_id')).to eq 'FGHIJ'
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].description')).to eq 'It comes from the server'
  end

  scenario 'It downloads a session when the remote one is newer' do
    remote_session = {
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'This is newer',
      group: 'occupational'
    }

    Net::HTTP.start('localhost', 3000) do |http|
      http.post("/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}", { session: remote_session }.to_http_params)
    end

    # We have to download the session afterwards to set the session id for the local id
    result = Net::HTTP.get(URI.parse("http://localhost:3000/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}"))
    remote_sessions = JSON.parse(result)
    session_id = remote_sessions.first['_id']['$oid']

    local_session = {
      id: session_id,
      updated_at: 42.days.ago, # Ensure local updated_at date is past now
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'This is older',
      group: 'occupational'
    }

    page.execute_script "angular.element(document.body).scope().sessions.push(#{local_session.to_json})"

    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].description')).to eq 'This is older'

    page.find('a', text: 'Meine Daten synchronisieren').click
    sleep 1
    expect(page).not_to have_selector('progress')

    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].description')).to eq 'This is newer'
  end

  scenario 'It uploads a session when the local one is newer' do
    remote_session = {
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'This is older',
      group: 'occupational'
    }

    Net::HTTP.start('localhost', 3000) do |http|
      http.post("/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}", { session: remote_session }.to_http_params)
    end

    # We have to download the session afterwards to set the session id for the local id
    result = Net::HTTP.get(URI.parse("http://localhost:3000/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}"))
    remote_sessions = JSON.parse(result)
    session_id = remote_sessions.first['_id']['$oid']

    local_session = {
      id: session_id,
      updated_at: 42.days.from_now, # Ensure local updated_at date is past future
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'This is newer',
      group: 'occupational'
    }

    page.execute_script "angular.element(document.body).scope().sessions.push(#{local_session.to_json})"

    page.find('a', text: 'Meine Daten synchronisieren').click
    sleep 1
    expect(page).not_to have_selector('progress')

    result = Net::HTTP.get(URI.parse("http://localhost:3000/api/v1/sessions/#{session_id}?user_email=#{@current_user_email}&user_token=#{@current_user_token}"))
    remote_session = JSON.parse(result)

    expect(remote_session['description']).to eq 'This is newer'
  end

  scenario 'It deletes a session remotely when a session is marked as deleted locally' do
    remote_session = {
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'This is older',
      group: 'occupational'
    }

    Net::HTTP.start('localhost', 3000) do |http|
      http.post("/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}", { session: remote_session }.to_http_params)
    end

    # We have to download the session afterwards to set the session id for the local id
    result = Net::HTTP.get(URI.parse("http://localhost:3000/api/v1/sessions?user_email=#{@current_user_email}&user_token=#{@current_user_token}"))
    remote_sessions = JSON.parse(result)
    session_id = remote_sessions.first['_id']['$oid']

    local_session = {
      id: session_id,
      deleted_at: 42.days.from_now, # Mark the local session as deleted
      updated_at: 42.days.from_now, # Ensure local updated_at date is past future
      started_at: 12.days.ago,
      local_id: 'FGHIJ',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'This is newer',
      group: 'occupational'
    }

    page.execute_script "angular.element(document.body).scope().sessions.push(#{local_session.to_json})"

    page.find('a', text: 'Meine Daten synchronisieren').click

    sleep 1
    expect(page).not_to have_selector('progress')

    result = Net::HTTP.get_response(URI.parse("http://localhost:3000/api/v1/sessions/#{session_id}?user_email=#{@current_user_email}&user_token=#{@current_user_token}")) # rubocop:disable LineLength

    expect(result.code).to eq '404'
  end
end
