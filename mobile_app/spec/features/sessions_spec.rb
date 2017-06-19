require 'spec_helper'

RSpec.describe 'sessions', js: true, type: :feature do
  before do
    register_user

    @current_user_id = page.evaluate_script 'angular.element(document.body).scope().user.id'
  end

  scenario 'mentions if the session list is empty' do
    click_link 'Meine Situationen'

    expect(page).to have_content 'Sie haben noch keine Situationen erfasst.'
  end

  scenario 'A user can list all sessions ordered my date' do
    sessions = []
    [2.days.ago, 12.days.ago].each_with_index do |date, i|
      sessions << {
        started_at: date,
        answers: [],
        local_id: "session_#{i}",
        user_id: @current_user_id,
        version: 0,
        situation: [:family, :work, :recreation].sample,
        description: Faker::Hacker.say_something_smart
      }
    end

    sessions << {
      started_at: 33.days.ago,
      answers: [],
      local_id: 'session_xxxxx',
      user_id: 'doesnotexist', # Ensure we don't display other users data
      version: 0,
      situation: 'work',
      description: 'should not appear'
    }

    sessions.each do |session|
      page.execute_script "angular.element(document.body).scope().sessions.push(#{session.to_json})"
    end

    click_link 'Meine Situationen'

    expect(page).not_to have_content 'should not appear'

    expect(all('ion-item').first).to have_content sessions[0][:description]
    expect(all('ion-item').last).to have_content sessions[1][:description]
  end

  scenario 'A user can delete a session' do
    session = {
      started_at: 12.days.ago,
      answers: [],
      local_id: 'ABCDE',
      user_id: @current_user_id,
      version: 0,
      situation: 'work',
      description: 'You shall delete it'
    }

    page.execute_script "angular.element(document.body).scope().sessions.push(#{session.to_json})"

    click_link 'Meine Situationen'

    expect(page).to have_content 'You shall delete it'

    touch_action '#ABCDE', :tap # Simulate sliding left needs initial tap
    sleep 1
    touch_action '#ABCDE', :swipe, axis: 'x', distance: -200, duration: 50

    find('#ABCDE ion-option-button').click

    expect(page).not_to have_content 'You shall delete it'
    expect(page).to have_content 'Sie haben noch keine Situationen erfasst.'

    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].deleted_at')).to be_truthy
  end
end
