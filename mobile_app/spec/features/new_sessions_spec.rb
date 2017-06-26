require 'spec_helper'

RSpec.describe 'new session', js: true, type: :feature do
  before do
    register_user

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
    
    touch_action 'body', :flick, axis: 'x', distance: 10, duration: 50
    
    sleep 1
  end

  scenario 'A user can capture a new occupational session' do
    click_link 'Situation erfassen'

    expect(page).to have_content 'Beschreiben Sie die aktuelle Situation'

    expect(page).to have_content 'Situation erfassen (1/7)'

    expect(page.evaluate_script('angular.element(document.body).scope().sessions.length')).to eq 0
    
    # Seems we have to trigger the first touch action for a couple of times
    #5.times do
     # touch_action '#item0 .noUi-handle', :flick, axis: 'x', distance: 1000, duration: 50
    #end
    #sleep 0.5
    
    6.times do |i|
      touch_action "#item#{i} .noUi-handle", :flick, axis: 'x', distance: 1000, duration: 50
      sleep 2
    end
   
    touch_action "#item0", :move, path: {xdist: 0, ydist: -20}, duration: 50
    
    sleep 2

    find('a', text: 'Weiter').click
    sleep 1
    
    expect(page).to have_content 'Wie geht es Ihnen gerade?'
    expect(page).to have_content "Situation erfassen (2/7)"

    4.times do |i|
      touch_action "#item#{i} .noUi-handle", :flick, axis: 'x', distance: 1000, duration: 50
      sleep 2
    end

    find('a', text: 'Weiter').click
    sleep 1


    expect(page).to have_content 'Situation erfassen (3/7)'
    expect(page).to have_content 'Wie ist das Wetter gerade jetzt?'
    touch_action '#item0 .noUi-handle', :flick, axis: 'x', distance: 1000, duration: 50
    sleep 2
    find('a', text: 'Weiter').click
    sleep 1

    expect(page).to have_content 'Situation erfassen (4/7)'
    expect(page).to have_content 'Wie ist die Stimmung in ihrem Arbeitsumfeld heute?'
    touch_action '#item0 .noUi-handle', :flick, axis: 'x', distance: 1000,  duration: 50
    sleep 2
    find('a', text: 'Weiter').click
    sleep 1

    expect(page).to have_content 'Situation erfassen (5/7)'
    expect(page).to have_content 'Wo befinden Sie sich zurzeit? '

    find('.item', text: 'Unterwegs').click
    sleep 2

    expect(page).to have_content 'Bitte beschreiben Sie ihre aktuelle Situation'
    expect(page).to have_content 'Situation erfassen (6/7)'

    fill_in('description', with: 'Keep calm and carry on')

    find('a', text: 'Weiter').click

    expect(page).to have_content 'Nehmen Sie ein Photo auf'
    expect(page).to have_content 'Situation erfassen (7/7)'

    click_button 'Speichern'

    expect(page).to have_content 'Beziehung und Erziehungskompetenz'

    # Ensure recoding
    10.times do |i|
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
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].situation')).to eq 'on_the_way'
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].user_id')).to eq @current_user_id
    expect(page.evaluate_script('angular.element(document.body).scope().sessions[0].description')).to eq 'Keep calm and carry on'
  end
end
