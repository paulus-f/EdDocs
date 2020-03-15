# Preview all emails at http://localhost:3000/rails/mailers/invite
class InvitePreview < ActionMailer::Preview
  def invite
    InviteMailer.invite(User.last, Foundation.last, Devise.friendly_token)
  end
  def send_password
    InviteMailer.send_password(User.students.last.email, Devise.friendly_token)
  end
end
