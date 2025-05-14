module GraphQL
  module Public
    module Types
      class QueryType < ::Groovestack::Base::GraphQL::Base::Object
        include ::Groovestack::Base::GraphQL::Providers::ReactAdmin::Resource

        include ::Groovestack::Config::GraphQL::App::Queries
        include ::GraphQL::Identity::Queries
        include ::GraphQL::User::Queries
      end
    end
    
    class GroovestackSchema < ::Groovestack::Base::GraphQL::SchemaAbstract    
      query(::GraphQL::Public::Types::QueryType)
    end
  end
end