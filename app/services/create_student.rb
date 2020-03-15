class CreateStudent
  class << self 
    def perform(parent, student_email, first_name, last_name, foundation)
      if student_email != parent.email 
        @foundation = foundation
        @password = Devise.friendly_token
        @student = User.create!(email: student_email,
                                role: 'student',
                                confirmed_at: DateTime.now,
                                password: @password)
        @student.profile.update!(first_name: first_name,
                                 last_name: last_name)
        PasswordWorker.perform_async(@student.email, @password)
        @student.parent = parent
        parent.children << @student
        return @student
      end
      nil
    end
  end
end