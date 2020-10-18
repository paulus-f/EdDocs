class ApprovingMailer < ApplicationMailer
  ADMIN_ADDRESS = 'deamteamrubylab@gmail.com'
  default to: ADMIN_ADDRESS, from: ADMIN_ADDRESS

  def message_from_admin(message, user_email)
    @message = message
    @admin_email = ADMIN_ADDRESS
    mail(subject: @message, from: ADMIN_ADDRESS, to: user_email)
  end
end

