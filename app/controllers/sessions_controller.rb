class SessionsController < Devise::SessionsController
  def create
    resource = warden.authenticate(auth_options)
    if(resource.nil?)
      render json: { message: "Error in Sigh In" }
    else
      sign_in(resource_name, resource)
      redirect_to :root
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    redirect_to :root
  end

end