# frozen_string_literal: true

class EnrollmentSaveController < ApplicationController
  before_action :authenticate_user!, :current_profile, only: %i[update]

  COMPLETEDPERTABLE = 16.666

  def new_children
    email_child = params[:email]
    first_name = params[:first_name]
    last_name = params[:last_name]
    @child = User.find_by(email: email_child)

    if @child.nil?
      foundation = Foundation.find_by(name: params[:foundation])
      @child = CreateStudent.perform(current_user, email_child, first_name, last_name, foundation)
      render json: { message: "Child with email #{@child.email} was created" }, status: 200
    else
      if @child.parent.nil?
        ApproveParentWorker.perform_async(current_user.email, @child.email)
        render json: { message: "Confirmation on email #{@child.email} was sent"}, status: 200
      else
        render json: {message: 'Student already has parent. If you have a question, you can contact support!' }
      end
    end
  end

  def get_free_children
    render json: { children: User.where(role: :student, parent_id: nil) }, status: 200
  end

  def student_confirm_parent
    student_email = params[:student_email]
    parent_email = params[:parent_email]
    parent = User.find_by(email: parent_email)
    student = User.find_by(email: student_email)
    parent.children << student
    student.parent = parent
    redirect_to root_path
  end 

  def get_children
    children = current_user.children
    render json: {children: children}, status: 200
  end

  def update
    model = params[:data][:model]
    msg = 'Error'

    case model
    when 'GeneralInfo'
      if @profile.general_info.nil?
        #404
      else
        @profile.general_info.update(general_info_params)
        @profile.update_attributes(
          first_name: params[:data][:params][:first_name],
          last_name: params[:data][:params][:second_name]
        )
        msg = 'General Info was added'
      end
    when 'ParentContact'
      if @profile.parent_contact.nil?
        #404
      else
        @profile.parent_contact.update(parent_contact_params)
        msg = 'Parent Contact was added'
      end
    when 'EmergencyConn'
      if @profile.emergency_conn.nil?
        #404
      else
        @profile.emergency_conn.update(emergency_conn_params)
        msg = 'Emmergency was added'
      end
    when 'Survey'
      if @profile.questionnaire.nil?
        #404
      else
        @profile.questionnaire.update(questionnaire_params)
        msg = 'Questionnaire Info was added'
      end
    when 'MedicationContact'
      if @profile.medication.nil?
      else
        medication_params
        @times.each_with_index do |time, i|
          @medication = Medication.create(profile: @profile, name: @names[i],
                                          time: time, dose: @doses[i])
          @profile.medication << @medication
        end
        msg = 'Medication was added'
      end
    when 'Signature'
      if @profile.signature.nil?
      else
        image_base64 = signature_image
        @profile.signature.update_attribute(:signature, image_base64)
        current_user.update_attribute(:enrollment_form, true)
        return render json: { message: 'Welcome. Waiting approving' }, status: 200
      end
    when 'Allergy'
      if @profile.allergy.nil?
      else
        @profile.allergy.update(allergy_params)
        msg = 'Allergy was added'
      end
    end

    render json: { message: msg }, status: 200
  end

  private

  def current_profile
    @profile = if current_user.parent?
                 current_user.children.find_by(id: params[:student_id]).profile
               else
                 current_user.profile
               end
  end

  def general_info_params
    params[:data].require(:params).permit(:first_name, :second_name,
                                          :third_name, :birth_date, :hobbie)
  end

  def medication_params
    @times =  params[:data][:timeSel]
    @doses =  params[:data][:dose]
    @names =  params[:data][:name]
  end

  def questionnaire_params
    params[:data].require(:params).permit(:sportF, :glasses, :hearing)
  end

  def parent_contact_params
    params[:data].require(:params).permit(:first_name, :second_name,
                                          :third_name, :phone_number)
  end

  def emergency_conn_params
    params[:data].require(:params).permit(:first_name, :second_name,
                                          :third_name, :phone_number)
  end

  def signature_image
    Paperclip.io_adapters.for(params[:data][:params][:signature])
  end

  def allergy_params
    params[:data].require(:params).permit(:source, :cause)
  end
end
