module Api
  module V1
    class GraphQLController < ApplicationController
      include ::Groovestack::Base::GraphQL::Controllers::Helpers
      include ::Groovestack::Auth::GraphQL::Controllers::AuthedExecute
      # include BugsnagNotify
      # before_action :set_core_versions_actor

      def groovestack_graphql_schema
        @groovestack_graphql_schema ||= ::GraphQL::GroovestackSchema
      end
    end
  end
end