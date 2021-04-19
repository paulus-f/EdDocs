class PagesController < ApplicationController
  #load_and_authorize_resource
  before_action :authenticate_user!, except: %i[index show support foundation_form]

  def index
    @foundations = GetUrlAndObjectFoundationService.get(Foundation.all).to_json

    if current_user
      return render_waiting_page      unless current_user.approve
      return render 'admin_dashboard' if current_user.admin?
      return render_manager_page      if current_user.manager?
      return render_profile_page      if current_user.parent? || current_user.student?
        
      render 'waiting_page'
    else
      render 'index'
    end
  end

  def manager_dashboard
    @foundation = current_user.foundation
    authorize! :manager_dashboard, @foundation
    return redirect_to root_path unless current_user.manager?

    render 'manager_dashboard'
  end

  def support
    @message = params.require(:message).permit!.to_h
    SupportWorker.perform_async(@message)
    head :no_content
  end

  private

  def render_waiting_page
    return waiting_manager_page if current_user.manager?
    return render 'waiting_page' if current_user.student? || current_user.parent?
  end

  def render_manager_page
    if current_user.foundation.nil?
      foundation_is_nil
    else
      redirect_to manager_dashboard_path
    end
  end

  def render_profile_page
    return profile_registration_page unless current_user.enrollment_form

    render 'profile_dashboard'
  end

  def waiting_manager_page
    return render 'waiting_page' if current_user.foundation.nil?

    current_user.foundation.address ? render('waiting_page') : render('foundation_form')
  end

  def profile_registration_page
    @children_profile = current_user.university_student? ? current_user.profile : current_user.children[0].profile
    render('registration_children', 
      locals: { 
        profile: @children_profile 
      }
    )
  end

  def foundation_is_nil
    render 'waiting_to_receive_foundation'
  end
end
