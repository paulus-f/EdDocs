class GroupsController < ApplicationController
  before_action :find_group, except: %i[create enroll]

  def create
    @group = Group.new(group_params)
    @group.level = Level.find_by(id: params[:level_id])
    render json: @group.to_json(include: :students) if @group.save
  end

  def update
    render json: @group.name if @group.update(group_params)
  end

  def destroy
    @foundation = @group.level.foundation
    @group.destroy
    render json: @foundation.students.includes(:profile).where(group_id: nil).to_json(include: :profile)
  end

  def enroll
    @group = Group.find_by(id: params[:group_id])
    params[:students].each do |student_id|
      @student = User.find_by(id: student_id)
      @group.students << @student
    end
    @group.save
    @foundation = Level.find_by(id: params[:level_id]).foundation
    render template: 'groups/enroll.json'
  end

  def kick_from_group
    @student = User.find_by(id: params[:student_id])
    @student.update(group_id: nil)
    head :no_content
  end

  def get_foundation_end_year
    group = Group.find_by(id: params[:group_id].to_i)
    @foundation = group.level.foundation
    render json: { end_academic_year: @foundation.end_academic_year }, status: 200
  end

  private

  def find_group
    @group = Group.find_by(id: params[:id])
  end

  def group_params
    params.require(:group).permit!
  end
end
