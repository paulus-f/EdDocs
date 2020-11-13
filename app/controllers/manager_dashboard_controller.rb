class ManagerDashboardController < ApplicationController
  before_action :find_invites, except: %i[student_approve reload_data]
  before_action :validate_csv_columns, only: :upload

  def invite_student
    @student = User.find_by(email: params.required(:invite)[:email])
    create_student unless @student
    InviteWorker.perform_async(@student.id, @foundation.id, @password) 
    render json: @student, include: :profile unless @invites.include?(@student)
    @invites << @student unless @invites.include?(@student)
  end

  def delete_invite
    @keys = params.required(:selected)
    @keys.each do |id|
      @invites.delete(User.find_by(id: id))
    end
    select_only
    render json: @invites.eager_load(:profile), include: :profile
  end

  def upload
    @csv_table.each_with_index do |row, index|
      @succes = create_student_from_csv(row.to_hash)
      if @succes
        InviteWorker.perform_async(@student.id, @foundation.id, @password)
        @invites << @student unless @invites.include?(@student)
      else
        select_only
        if @student.nil?
          render json: {
            students: @invites.eager_load(:profile).to_json(include: :profile),
            alertType: 'warning',
            alertMessage: "Invalid data error - string #{index + 2}"
          }
        end
      end
    end

    select_only
    render json: {
      students: @invites.eager_load(:profile).to_json(include: :profile),
      alertType: 'success',
      alertMessage: @invites.empty? ? 'Empty to import' : 'Import from file succesfully done!'
    }
  rescue CSV::MalformedCSVError
    select_only
    render json: { students: @invites.eager_load(:profile).to_json(include: :profile),
                   alertType: 'error',
                   alertMessage: 'File error! Wrong format...' }
  end

  def student_approve
    data = JsonWebToken.decode(params[:jwt])
    foundation = Foundation.find_by(id: data['foundation_id'])
    student = User.find_by(id: data['student_id'])
    group = Group.find_by(id: data['group_id'])
    jwt = JwtToken.find_by(token: (data['token']))
    if check_correct_token(jwt, student)
      student.jwt_tokens.delete(jwt)
      if student.foundation || !foundation.invites.include?(student)
        render json: { alertType: 'warning', message: 'You are already join to foundation or your invite have been deleted' }
      else
        User.transaction do
          foundation.students << student
          group.students << student if group
          student.update(approve: true)
          foundation.save || group.save
        end
        redirect_to root_path
      end
    else
      render json: { alertType: 'error', message: 'Uncorrect token' }
    end
  end

  def reload_data
    @foundation = Foundation.find_by(id: params[:id])
    render template: 'pages/manager_dashboard.json'
  end

  def filter_invites
    select_only
    render json: @invites.eager_load(:profile), include: :profile
  end

  def reports
    @foundation = Foundation.find_by(id: params[:foundation_id].to_i)
    @amount_student = @foundation.students.count
    calculating_statistics_form(@foundation.students)
    render json: { amount_student: @amount_student,
                   count_full_completed_form: @count_full_completed_form,
                   count_medication: @count_medication,
                   count_allergies: @count_allergies,
                   count_limited: @count_limited }, status: 200
  end

  private

  def find_invites
    @foundation = Foundation.find_by(id: params[:foundation_id].to_i)
    @invites = @foundation.invites
  end

  def validate_csv_columns
    csv_file_path = Paperclip.io_adapters.for(params[:file]).path
    @csv_table = CSV.read(csv_file_path, headers: true)
    render json: { alertType: 'warning', alertMessage: 'Incorrect headers' }, status: 200 unless User::CSV_HEADERS == @csv_table.headers
  end

  def calculating_statistics_form(students)
    @count_full_completed_form = 0
    @count_allergies = 0
    @count_medication = 0
    @count_limited = 0
    students.each do |student|
      if (check_allergy(student.profile.allergy) && 
        check_emergency_conn(student.profile.emergency_conn) &&
        check_general_info(student.profile.general_info) &&
        check_medication(student.profile.medication) &&
        check_parent_contact(student.profile.parent_contact) &&
        check_signature(student.profile.signature) &&
        check_questionnaire(student.profile.questionnaire))
        @count_full_completed_form += 1
      end
    end
  end

  def check_questionnaire(questionnaire)
    return false unless questionnaire

    unless questionnaire.sportF.nil? && questionnaire.glasses.nil? && questionnaire.hearing.nil?
      @count_limited += 1 if questionnaire.hearing || questionnaire.glasses || questionnaire.sportF
      return true
    end
    false
  end

  def check_signature(signature)
    return false unless signature

    unless signature.signature.nil?
      @count_full_completed_form += 1
      return true
    end
    false
  end

  def check_allergy(allergy)
    unless allergy.nil?
      @count_allergies += 1 if allergy.cause && allergy.source
      return true
    end
    false
  end

  def check_medication(medication)
    unless medication.nil?
      @count_medication += 1
      return true
    end
    false
  end

  def check_general_info(general_info)
    return false unless general_info
    return false unless general_info.first_name
    return false unless general_info.second_name
    return false unless general_info.third_name
    return false unless general_info.birth_date
    return false unless general_info.hobbie

    true
  end

  def check_emergency_conn(emergency_conn)
    return false unless emergency_conn
    return false unless emergency_conn.first_name
    return false unless emergency_conn.second_name
    return false unless emergency_conn.third_name
    return false unless emergency_conn.phone_number

    true
  end

  def check_parent_contact(parent_contact)
    return false unless parent_contact
    return false unless parent_contact.first_name
    return false unless parent_contact.second_name
    return false unless parent_contact.third_name
    return false unless parent_contact.phone_number

    true
  end

  def select_only
    @invites = @invites.where.not(foundation_id: @foundation.id).or(@invites.where(foundation_id: nil)) if params[:selectOnly] == 'notaccepted'
    @invites = @invites.where(foundation_id: @foundation.id) if params[:selectOnly] == 'accepted'
  end

  def create_student
    @password = Devise.friendly_token
    @student = User.create!(email: params.required(:invite)[:email],
                            role: 'student',
                            confirmed_at: DateTime.now,
                            password: @password)
    @student.profile.update!(first_name: params.required(:invite)[:first_name],
                             last_name: params.required(:invite)[:last_name])
  end

  def create_student_from_csv(row)
    if row['email'] && row['first_name'] && row['last_name']
      @student = User.find_by(email: row['email'])

      unless @student
        @password = Devise.friendly_token
        @student = User.new(email: row['email'],
                            role: 'student',
                            confirmed_at: DateTime.now,
                            password: @password,
                            password_confirmation: @password)
        if @student.save
          @student.profile.update!(first_name: row['first_name'],
                                   last_name: row['last_name'])
          true
        else
          false
        end
      end

      true
    else
      false
    end
  end

  def check_correct_token(jwt, student)
    jwt.user == student if jwt
  end
end
