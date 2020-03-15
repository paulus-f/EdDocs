class SupportMailer < ApplicationMailer
  SUPPORT_ADDRESS = 'deamteamrubylab@gmail.com'
  default to: SUPPORT_ADDRESS, from: SUPPORT_ADDRESS


  def message_to_support(message)
    @message = message
    mail(subject: @message['problem'], from: @message['email'])
  end
end
