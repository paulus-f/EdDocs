class CoursesController < ApplicationController
  before_action :find_level, only: %i[create update]
  def create
    @course = Course.new(course_params)
    @course.level_id = @level.id
    render template: 'courses/one_course.json' if @course.save
  end

  def update
    @course = Course.find_by(id: params[:id])
    if params[:image] == ''
      @course.photo = nil
    else
      begin
        params[:course][:photo] = Paperclip.io_adapters.for(params[:image])
      rescue Paperclip::AdapterRegistry::NoHandlerError
        params[:course][:photo] = @course.photo
      end
    end
    @course.level_id = @level.id
    @level.courses << @course
    render template: 'courses/one_course.json' if @course.update(course_params)
  end

  def destroy
    @course = Course.find_by(id: params[:id])
    @course.destroy
    head :no_content
  end
  
  private

  def course_params
    params.require(:course).permit!
  end

  def find_level
    @level = Level.find_by(id: params[:level_id])
  end
end
