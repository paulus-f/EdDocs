class CreateStudent
  class << self
    def perform(student:, parent:, student_email:, first_name:, last_name:, foundation:)
      if parent && student_email != parent.email
        create_student_via_parent(parent: parent, student_email: student_email,
                                  first_name: first_name, last_name: last_name)
      end

      if student
        update_student(student: student, first_name: first_name,
                       last_name: last_name, foundation: foundation)
      end
    end

    private

    def update_student(student:, first_name:, last_name:, foundation:)
      student.profile.update!(first_name: first_name, last_name: last_name)
      student.update!(foundation: foundation)
    end

    def create_student_via_parent(parent:, student_email:, first_name:, last_name:)
      password = Devise.friendly_token
      student = User.create!(email: student_email,
                             role: 'student',
                             confirmed_at: DateTime.now,
                             password: password)
      student.profile.update!(first_name: first_name, last_name: last_name)
      PasswordWorker.perform_async(student.email, password)
      student.parent = parent
      parent.children << @student
      parent.save
    end
  end
end
