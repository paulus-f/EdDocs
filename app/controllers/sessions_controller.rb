# frozen_string_literal: true

class SessionsController < Devise::SessionsController
  def create
    resource = warden.authenticate(auth_options)
    
    if resource
      sign_in(resource_name, resource)
      #redirect_to :root
    else
      render json: { message: 'Error in Sigh In' }
    end
  end

  def destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    redirect_to :root
  end
end
