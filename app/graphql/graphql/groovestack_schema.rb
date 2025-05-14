module Types
  class QueryType < ::Groovestack::Auth::GraphQL::VisibleObject
    include ::Groovestack::Base::GraphQL::Providers::ReactAdmin::Resource

    include ::Groovestack::Config::GraphQL::App::Queries
    include ::GraphQL::Identity::Queries
    include ::GraphQL::User::Queries
  end

  class MutationType < ::Groovestack::Auth::GraphQL::VisibleObject


    # CORE modules
    field :update_user, mutation: ::GraphQL::User::Mutations::Update, visibility_permission: :basic
    field :delete_identity, mutation: ::GraphQL::Identity::Mutations::Delete, visibility_permission: :basic
  end

  class SubscriptionType < ::Groovestack::Auth::GraphQL::VisibleObject
  #   # CORE modules
  #   include ::Core::Jobs::GraphQL::Job::Subscriptions
  end
end

module GraphQL
  class GroovestackSchema < ::Groovestack::Base::GraphQL::SchemaAbstract
    include ::Groovestack::Auth::GraphQL::SchemaVisibility

    query(::Types::QueryType)
    mutation(::Types::MutationType)
    subscription(::Types::SubscriptionType)
  end
end