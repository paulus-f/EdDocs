class RegistrationsController < Devise::RegistrationsController
  respond_to :json
  NEWFOUNDATION = 'Create New Foundation'
  CNF = 'CNF'

   def create
    build_resource(sign_up_params)
    resource.save
    resource.profile.update(profile_up_params)
    create_foundation(resource) if resource.role == 'manager'
    check_student(params, resource) if resource.role == 'parent'
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        msg = find_message(:signed_up, {})
        sign_up(resource_name, resource)
        redirect_to :root
        return
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
        msg = find_message(:"signed_up_but_#{resource.inactive_message}", {})
        expire_data_after_sign_in!
        render json: {message: msg}, status: 200
      end
    else
      clean_up_passwords resource
      msg = ""
      resource.errors.full_messages.each{ |message| msg += message }
      render json: {message: msg}
    end
  end

  def approve_users
    users_id = params[:users_id]
    @message = params[:message]
    users = User.where(id: users_id)
    users.each do |user|
      user.update_attribute(:approve, true)
      AdminMessageWorker.perform_async(@message, user.email) 
    end
    render json: { message: "Complete" }, status: 200
  end
 
  def delete_users
    users_id = params[:users_id]
    @message = params[:message]
    users = User.where(id: users_id)
    users.each do |user|
      AdminMessageWorker.perform_async(@message, user.email)
      if(user.profile)
        user.profile.allergy.destroy
      end
      user.destroy
    end
    render json:  {message: "Complete"}, status: 200
  end
   
  private
  
  def create_foundation(resource)
    if NEWFOUNDATION == params.require(:foundation)[:name]
      @foundation = Foundation.new(foundation_up_params)
      @foundation.managers << resource
      @foundation.name = CNF + (Foundation.last.id + 1).to_s
      @foundation.save!
    else
      @foundation = Foundation.find_by(name: params.require(:foundation)[:name])
      resource.foundation = @foundation
    end
  end

  def check_student(params, resource)
    @student = User.find_by(email: params[:student][:student_email])
    if @student
      unless @student.parent.nil?
        render json: {message: 'The student already has a parent'}
        return 
      else
        resource.children << @student
        @student.parent = resource
      end
    else
      if params[:student][:student_email] != current_user 
        @foundation = Foundation.find_by(name: params.require(:foundation)[:name])
        CreateStudent.perform(resource,params[:student][:student_email], @foundation)
      else
        render json: {message: 'The email of student equals to parent email'}
        return
      end
    end
  end

  def sign_up_params
    params.require(:user).permit(
      :email,
      :role,
      :password, 
      :password_confirmation
    )
  end

  def profile_up_params
    params.require(:profile).permit(:first_name, :last_name)
  end

  def foundation_up_params
    params.require(:foundation).permit(:type_foundation, :name, :end_academic_year, :begin_academic_year)
  end

  def account_update_params
    params.require(:user).permit(
      :password,
      :password_confirmation
    )
  end
end