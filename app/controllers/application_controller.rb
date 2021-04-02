class ApplicationController < ActionController::Base
  protect_from_forgery unless: -> { request.format.json? }

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, alert: exception.message
  end
end
