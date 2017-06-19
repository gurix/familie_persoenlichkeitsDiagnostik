require 'spec_helper'

RSpec.describe 'clinical sessions', js: true, type: :feature do
  before do
    register_user('clinical')

    @current_user_id = page.evaluate_script 'angular.element(document.body).scope().user.id'

    custom_fields = [
      {
        key: 'wetter',
        title: 'Wie ist das Wetter gerade jetzt?',
        lower_value: 'misserabel',
        upper_value: 'super sonnig'
      },
      {
        key: 'arbeitsumfeld',
        title: 'Wie ist die Stimmung in ihrem Arbeitsumfeld heute?',
        lower_value: 'depressiv',
        upper_value: 'heiter'
      }
    ]

    page.execute_script "localforage.setItem('custom_fields', #{custom_fields.to_json})"

    visit '/'
  end

  scenario 'A user can capture a new clinical session' do
    click_link 'Situation erfassen'

    expect(page).to have_content 'Wie fühlen Sie sich gerade jetzt?'

    expect(page).to have_content 'Situation erfassen (1/11)'

    expect(page.evaluate_script('angular.element(document.body).scope().sessions.length')).to eq 0

    expect(page.evaluate_script('angular.element(document.getElementById("sessions_new_session_controller")).scope().session.group')).to eq 'clinical'

    5.times do
      touch_action '#item0 .noUi-handle', :flick, axis: 'x', distance: 1000, duration: 50
      sleep 0.5
    end

    3.times do |i|
      touch_action "#item#{i} .noUi-handle", :flick, axis: 'x', distance: 1000, duration: 50
      sleep 0.5
    end

    find('a', text: 'Weiter').click
    sleep 0.5

    expect(page).to have_content 'Situation erfassen (2/11)'

    5.times do |i|
      touch_action "#item#{i} .noUi-handle", :flick, axis: 'x', distance: 1000, duration: 50
      sleep 0.5
    end

    find('a', text: 'Weiter').click
    sleep 0.5

    expect(page).to have_content 'Situation erfassen (3/11)'
    expect(page).to have_content 'Wie ist das Wetter gerade jetzt?'
    touch_action '#item0 .noUi-handle', :flick, axis: 'x', distance: 1000, duration: 50
    sleep 0.5
    find('a', text: 'Weiter').click
    sleep 0.5

    expect(page).to have_content 'Situation erfassen (4/11)'
    expect(page).to have_content 'Wie ist die Stimmung in ihrem Arbeitsumfeld heute?'
    touch_action '#item0 .noUi-handle', :flick, axis: 'x', distance: 1000,  duration: 50
    sleep 0.5
    find('a', text: 'Weiter').click
    sleep 0.5

    expect(page).to have_content 'Situation erfassen (5/11)'
    expect(page).to have_content 'Auf den ersten Blick'
    find('a', text: 'Weiter').click
    sleep 0.5

    3.times do |i|
      expect(page).to have_content "Situation erfassen (#{i + 6}/11)"
      touch_action '#item0 .noUi-handle', :move, path: { xdist: 1700, ydist: 0 }, duration: 50
      sleep 0.5
      find('a', text: 'Weiter').click
      sleep 0.5
    end

    expect(page).to have_content 'Situation erfassen (9/11)'

    find('.item', text: 'Bei der Familie').click

    expect(page).to have_content 'Situation erfassen (10/11)'

    fill_in('description', with: 'Keep calm and carry on')

    find('a', text: 'Weiter').click

    expect(page).to have_content 'Situation erfassen (11/11)'

    click_button 'Speichern'

    expect(page).to have_content 'Persönlichkeitsdiagnostik'

    # Ensure recoding
    13.times do |i|
      answer = page.evaluate_script "angular.element(document.body).scope().sessions[0].answers[#{i}]"
      next unless answer
      expect(answer['value']).to eq '50.00'

      if answer['recoded'] == 1
        expect(answer['recoded_value']).to eq(-50)
      else
        expect(answer['recoded_value']).to eq '50.00'
      end
    end

    expect(page.evaluate_script('angular.element(document.body).scope().sessions.length')).to eq 1
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].situation')).to eq 'family'
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].user_id')).to eq @current_user_id
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].description')).to eq 'Keep calm and carry on'
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].group')).to eq 'clinical'
  end
end
