class PagesController < ApplicationController
  #load_and_authorize_resource
  before_action :authenticate_user!, except: %i[index show support foundation_form]

  def index
    @foundations = Foundation.all
    if current_user
      if current_user.admin?
        @users = User.all.to_json
        @foundations = @foundations.to_json(include: %i[managers students])
        render 'admin_dashboard'
        return
      end
      unless current_user.approve
        @foundations = GetUrlAndObjectFoundationService.get(@foundations).to_json
        waiting_manager_page if current_user.manager?
        render 'waiting_page' if current_user.student?
        waiting_parent_page if current_user.parent?
        return
      else
        if current_user.manager?
          @foundation = current_user.foundation
          if @foundation.nil?
            @foundations = GetUrlAndObjectFoundationService.get(@foundations).to_json
            foundation_is_nil
          else
            redirect_to manager_dashboard_path if current_user.manager?
          end
          return
        end
        if current_user.parent? or current_user.student?
          render 'profile_dashboard'
          return
        end
      end
    end
    @foundations = GetUrlAndObjectFoundationService.get(@foundations).to_json
    render 'index'
  end

  def apply_foundation_form
  end

  def manager_dashboard
    @foundation = current_user.foundation
    authorize! :manager_dashboard, @foundation
    render 'manager_dashboard'
  end

  def support
    @message = (params.require(:message).permit!).to_h
    SupportWorker.perform_async(@message)
    head :no_content
  end

  private
    def waiting_manager_page
      return render 'waiting_page' if current_user.foundation.nil?
      current_user.foundation.address ? (render 'waiting_page') : (render 'foundation_form')
    end

    def waiting_parent_page
      @children_profile = current_user.children[0].profile
      current_user.enrollment_form ? (render 'waiting_page') : (render 'registration_children')
    end

    def foundation_is_nil
      render 'waiting_to_receive_foundation'
    end
end
