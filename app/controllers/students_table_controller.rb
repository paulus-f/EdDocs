class StudentsTableController < ApplicationController
  before_action :find_students

  def kick_student
    @keys = params.required(:selected)
    @keys.each do |id|
      @students.delete(User.find_by(id: id))
    end
    select_only
    render template: 'students_table/index.json'
  end

  def filter_students
    select_only
    render template: 'students_table/index.json'
  end

  private

  def find_students
    @students = Foundation.find_by(id: params[:foundation_id]).students
  end

  def select_only
    @students.where!(group_id: nil) if params[:selectOnly] == 'notgroup'
    @students = @students.where.not(group_id: nil) if params[:selectOnly] == 'group'
  end
end
