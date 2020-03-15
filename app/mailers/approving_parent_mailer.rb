class ApprovingParentMailer < ApplicationMailer
  ADMIN_ADDRESS = 'deamteamrubylab@gmail.com'
  default to: ADMIN_ADDRESS, from: ADMIN_ADDRESS

  def send_approving(parent_email,student_email)
    @parent_email = parent_email
    @student_email = student_email
    mail(to: student_email, from: parent_email)
  end
end
