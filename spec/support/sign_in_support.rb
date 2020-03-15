# module for helping controller specs
module ValidUserHelper
  def signed_in_as_a_manager
    @user ||= FactoryBot.create :manager
    @foundation ||= FactoryBot.build :foundation
    @foundation.managers << @user
    @foundation.save
    @user.confirm
    sign_in @user # method from devise:TestHelpers
  end

  def signed_in_as_a_student
    @user ||= FactoryBot.create :student
    @user.confirm
    sign_in @user # method from devise:TestHelpers
  end

  def signed_in_as_an_admin
    @user ||= FactoryBot.create :admin
    @user.confirm
    sign_in @user # method from devise:TestHelpers
  end

  def signed_in_as_a_parent
    @user ||= FactoryBot.create :admin
    @user.confirm
    sign_in @user
  end
end
