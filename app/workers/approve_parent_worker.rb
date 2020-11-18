class ApproveParentWorker
  include Sidekiq::Worker

  def perform(parent_email, student_email)
    ApprovingParentMailer.send_approving(parent_email, student_email).deliver
  end
end
