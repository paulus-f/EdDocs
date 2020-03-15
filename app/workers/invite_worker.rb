class InviteWorker
  include Sidekiq::Worker

  def perform(student, foundation, *info)
    @student = User.find_by(id: student)
    @foundation = Foundation.find_by(id: foundation)
    if info[1]
      @group = Group.find_by(id: info[1])
      info[1] = @group
    end
    InviteMailer.invite(@student, @foundation, *info).deliver
  end
end