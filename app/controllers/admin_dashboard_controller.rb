class AdminDashboardController < ApplicationController
  before_action :authenticate_user!
  def get_manager_dashboard
    @foundation = Foundation.find_by(id: params[:foundation_id].to_i)
    authorize! :manager, @foundation
    render 'manager_dashboard', status: 200
  end

  def get_free_managers
    @managers_email = User.where(approve: true, role: :manager).select(:email, :id)
    render json: {emails: @managers_email }, status: 200 
  end 

  def add_manager
    foundation_id = params[:id_foundation].to_i
    user_email = params[:selected_manager]
    @foundation = Foundation.find_by(id: foundation_id)
    User.transaction do
      @user = User.find_by(email: user_email)
      if @foundation.managers.find_by(id: @user.id) 
        render json: {message: "Such manager already exists", managers: @foundation.managers} 
        return
      end
      @user.update_attribute(:foundation_id, foundation_id)
    end
    render json: {message: "Complete!!! #{@user.email} was added", managers: @foundation.managers} 
  end

  def delete_manager
    foundation_id = params[:id_foundation].to_i
    user_id = params[:selected_manager]
    User.transaction do
      @user = User.find_by(id: user_id)
      @user.update_attribute(:foundation_id, nil)
    end
    managers = Foundation.find_by(id: foundation_id).managers
    render json: {message: "Complete!!! #{@user.email}  was fired", managers: managers} 
  end

  def delete_foundation
    @foundation = Foundation.find_by(id: params[:id_foundation].to_i)
    if(@foundation.destroy)
      render json: {message: "Complete", id: params[:id_foundation].to_i}, status: 200
    else
      render json: {message: "Ups"}, status: 418
    end
  end

  def foundation_managers
    @foundation = Foundation.find_by(id: params[:id_foundation].to_i)
    managers = []
    managers = @foundation.managers.select(:email, :id) unless @foundation.nil?
    render json: {managers: managers}, status: 200
  end

  def user_table_filter
    @result = User.where(role: :manager) if params[:filter_category] == 'managers'    
    @result = User.where(role: :student) if params[:filter_category] == 'students'   
    @result = User.where(role: :parent) if params[:filter_category] == 'parents'    
    @result = User.where(approve: true) if params[:filter_category] == 'approve'    
    @result = User.where(approve: false) if params[:filter_category] == 'not_approve'    
    @result = User.all if params[:filter_category] == 'all'
    @result = [] if @result.nil?
    render json: { users: @result.to_json }, status: 200
  end
end
