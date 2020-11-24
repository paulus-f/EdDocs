class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  NEWFOUNDATION = 'Create New Foundation'.freeze
  CNF = 'CNF'.freeze

  def create
    build_resource(sign_up_params)
    resource.save
    return render json: { message: resource_error_messages } if resource.errors.present?

    resource.profile.update(profile_up_params)
    create_foundation(resource) if resource.role == 'manager'
    check_student(params, resource) if resource.role == 'parent'
    create_university_student(resource) if resource.role == 'student'

    yield resource if block_given?

    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_flashing_format?
        sign_up(resource_name, resource)

        render json: { message: 'Complete' }
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_flashing_format?
        msg = find_message(:"signed_up_but_#{resource.inactive_message}", {})
        expire_data_after_sign_in!

        render json: { message: msg }, status: 200
      end
    else
      clean_up_passwords resource

      render json: { message: resource_error_messages }
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

    render json: { message: 'Complete' }, status: 200
  end

  def delete_users
    users_id = params[:users_id]
    @message = params[:message]
    users = User.where(id: users_id)
    users.each do |user|
      AdminMessageWorker.perform_async(@message, user.email)
      user&.profile&.allergy&.destroy if user.profile
      user&.destroy
    end
    render json: { message: 'Complete' }, status: 200
  end

  private

  def resource_error_messages
    resource.errors.full_messages.join(',')
  end

  def create_foundation(resource)
    if NEWFOUNDATION == params.require(:foundation)[:name]
      @foundation = Foundation.new(foundation_up_params)
      @foundation.managers << resource
      @foundation.name = CNF + (Foundation.last.id + 1).to_s
      @foundation.save!
    else
      @foundation = Foundation.find_by(name: params.require(:foundation)[:name])
      resource.update(foundation_id: @foundation.id)
    end
  end

  def check_student(params, resource)
    @student = User.find_by(email: params[:student][:student_email])
    return create_student(parent: resource) if params[:student][:student_email] && @student.nil?

    if @student&.parent.nil?
      resource.children << @student
      @student.parent = resource
    else
      render json: { message: 'The student already has a parent' }
    end
  end

  def create_university_student(resource)
    create_student(student: resource)
  end

  def create_student(parent: nil, student: nil)
    @foundation = Foundation.find_by(name: params.require(:foundation)[:name])
    group = @foundation.groups.find_by(name: params[:student][:foundationLvl])
    group ||= @foundation.levels.find_by(name: params[:student][:foundationLvl]).first unless group

    CreateStudent.perform(
      student: student,
      parent: parent,
      student_email: params[:student][:student_email],
      first_name: params[:profile][:first_name],
      last_name: params[:profile][:last_name],
      foundation: @foundation,
      group: group
    )
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
    params.require(:foundation).permit(:type_foundation, :name,
                                       :end_academic_year, :begin_academic_year)
  end

  def account_update_params
    params.require(:user).permit(
      :password,
      :password_confirmation
    )
  end
end
