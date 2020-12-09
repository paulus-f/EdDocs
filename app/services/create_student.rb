class CreateStudent
  class << self
    def perform(student:, parent:, student_email:, first_name:, last_name:, foundation:, group:)
      if parent && student_email != parent.email
        return create_student_via_parent(parent: parent,
                                         student_email: student_email,
                                         first_name: first_name,
                                         last_name: last_name,
                                         foundation: foundation,
                                         group: group)
      end

      if student
        update_student(student: student, first_name: first_name,
                       last_name: last_name, foundation: foundation,
                       group: group)
        student.reload
      end
    end

    private

    def update_student(student:, first_name:, last_name:, foundation:, group:)
      student.profile.update!(first_name: first_name, last_name: last_name)
      student.update!(foundation: foundation, group: group)
    end

    def create_student_via_parent(parent:, student_email:, first_name:, last_name:, foundation:, group:)
      password = Devise.friendly_token
      student = User.create!(email: student_email,
                             role: 'student',
                             confirmed_at: DateTime.now,
                             password: password,
                             foundation: foundation,
                             group: group)
      student.profile.update!(first_name: first_name, last_name: last_name)
      PasswordWorker.perform_async(student.email, password)
      student.parent = parent
      parent.children << student
      parent.save
      student
    end
  end
end
