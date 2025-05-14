module Api
  module V1
    module Public
      class GraphQLController < ApplicationController
        include ::Groovestack::Base::GraphQL::Controllers::Helpers
        include ::Groovestack::Base::GraphQL::Controllers::Execute
        # include BugsnagNotify
        
        def groovestack_graphql_schema
          @groovestack_graphql_schema ||= ::GraphQL::Public::GroovestackSchema
        end
      end
    end
  end
end