Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  Groovestack::Auth.draw_routes(self) if User.respond_to?(:devise_modules)

  namespace :api do
    namespace :v1 do
      namespace :public do
        post '/gql', to: 'graphql#execute', controller: 'graphql'
      end

      post '/gql', to: 'graphql#execute', controller: 'graphql'
    end
  end

  mount GraphiQL::Rails::Engine, at: 'docs/api/v1', graphql_path: '/api/v1/gql', as: :graphiql_rails if Rails.env.development?
  mount GraphiQL::Rails::Engine, at: 'docs/api/v1/public', graphql_path: '/api/v1/public/gql', as: :public_graphiql_rails if Rails.env.development?


  root "application#index"

  # Defines the root path route ("/")
  # root "posts#index"
end
