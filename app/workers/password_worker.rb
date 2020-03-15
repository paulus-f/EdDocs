class PasswordWorker
  include Sidekiq::Worker

  def perform(student_email, password)
    InviteMailer.send_password(student_email, password).deliver
  end
end