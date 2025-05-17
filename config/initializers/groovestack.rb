class FailureWithMetadata < Devise::FailureApp
  def unauthenticated_api_request?
    ::Rails.application.routes.url_helpers.api_v1_gql_path == request.original_fullpath.split('?').first
  end

  def respond
    if unauthenticated_api_request?
      json_error_response({ errors: [{ message: i18n_message }] }) # expected gql format
    elsif request.format.json?
      json_error_response
    else
      ::Rails.logger.info "responding to unauthenticated request with super"
      super
    end
  end

  def json_error_response(response_body = [{ message: i18n_message }])
    self.status = 401
    self.content_type = 'application/json'
    self.response_body = response_body.to_json
  end
end

Devise.setup do |config|
  config.warden do |manager|
    #   manager.intercept_401 = false
    #   manager.default_strategies(scope: :user).unshift :some_external_strategy
    manager.failure_app = FailureWithMetadata
  end
end

::Groovestack::Base.configure do |config|
  config.error_notifier.notify_method = :info
end
