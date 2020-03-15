class ParentsController < ApplicationController
  before_action :authenticate_user!

  def edit
    @children_profile = get_child(params[:id])
    if @children_profile
      render 'pages/enrollment_form'
    else
      render 'pages/404'
    end
  end

  def show
    @children_profile = manager_get_child(params[:id])
    if @children_profile
      render 'pages/enrollment_show'
    else
      render 'pages/404'
    end
  end

  private

  def get_children
    current_user.children.all
  end

  def manager_get_child(child_id)
    if current_user.role == 'admin'
      child = User.find_by(id: child_id)
    else
      request = current_user.foundation.requests.find_by(student_id: child_id)
      child = current_user.foundation.students.find_by(id: child_id)
      child = request.student if request && !child
    end

    unless child.nil?
      return child.profile
    else
      return false
    end
  end

  def get_child(child_id)
    child = current_user.children.find_by(id: child_id)
    unless child.nil?
      return child.profile
    else
      return false
    end
  end
end
