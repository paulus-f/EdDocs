class AdminMessageWorker
  include Sidekiq::Worker

  def perform(message, user_email)
    ApprovingMailer.message_from_admin(message, user_email).deliver
  end
end