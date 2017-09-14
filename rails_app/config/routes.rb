Rails.application.routes.draw do
  root to: 'home#index'
  devise_for :users, controllers: { registrations: 'registrations' }

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      devise_scope :user do
        # Allows the mobile app to check whether an email is already signed up
        match 'email_exists', via: [:get, :options], to: 'registrations#email_exists'

        # Sign up and sign in via api
        match 'sign_up', via: [:post, :options], to: 'registrations#create'
        match 'sign_in', via: [:post, :options], to: 'user_sessions#create'

        match 'sessions', via: [:options], to: 'sessions#void'
        match 'sessions/:id', via: [:options], to: 'sessions#void'
        resources :sessions
        resource :passwords

        match 'user', via: [:options], to: 'users#void'
        resource :user, only: [:show, :update]
      end
    end
  end

  localized do
    get 'terms_and_conditions', to: 'home#terms_and_conditions', as: :terms_and_conditions
    get 'support', to: 'home#support', as: :support
  end

  resources :profiles do
    resources :sessions, module: 'profiles'
  end

  namespace :admin do
    namespace :export do
      resources :users, only: :index
      resources :sessions, only: :index
    end
  end
end
