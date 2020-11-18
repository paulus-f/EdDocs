class SupportWorker
  include Sidekiq::Worker

  def perform(message)
    SupportMailer.message_to_support(message).deliver_now
  end
end
