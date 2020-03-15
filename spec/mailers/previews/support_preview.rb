# Preview all emails at http://localhost:3000/rails/mailers/support
class SupportPreview < ActionMailer::Preview
  def message_to_support
    @message = {'problem' => 'problem', 'email' => 'email', 'description' => 'description'}
    SupportMailer.message_to_support(@message)
  end
end
