class InviteMailer < ApplicationMailer
  default from: 'deamteamrubylab@gmail.com'
  def invite(student, foundation, *info)
    @student = student
    @password = info.first if info.first
    @group = info[1] if info[1]
    @manager = foundation.managers.first
    @foundation = foundation
    @JWT = create_jwt
    mail(
        subject: "Invite to foundation #{@foundation.name}", 
        to: "#{@student.email}"
      )
  end

  def send_password(student_email, password)
    @password = password
    mail(
      subject: 'Registration on Schooldocs',
      to: "#{student_email}"
    )
  end

  private

  def create_jwt
    jwt_token = @student.jwt_tokens.create!(token: SecureRandom.uuid)
    if @group
      JsonWebToken.encode(student_id: @student.id, group_id: @group.id, foundation_id: @foundation.id, token: jwt_token.token)
    else
      JsonWebToken.encode(student_id: @student.id, foundation_id: @foundation.id, token: jwt_token.token)
    end
  end
end
