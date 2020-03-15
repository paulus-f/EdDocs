class UsersController < ApplicationController
  def get_children
    children = current_user.children
    render json: {children: children}, status: 200
  end
end