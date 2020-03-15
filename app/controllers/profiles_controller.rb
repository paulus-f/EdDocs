class ProfilesController < ApplicationController
  before_action :authenticate_user!
  # level foundation имя родители
  def show
    @user = User.find(params[:id])
    unless @user.nil?
      if @user.role == 'student'
        @foundation = @user.foundation
      end
      render 'pages/profile'
    else
      render 'pages/404'
    end

  end

  private
  #def same_foundation(user)
  #  if (current_user.foundation == user.foundation)
  #    return true
  #  else
  #    return false
  #  end
  #end
end
