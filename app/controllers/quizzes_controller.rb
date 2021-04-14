class QuizzesController < ApplicationController
  def create
    quiz = Quiz.create(
      user_id: current_user.id,
      course_id: params[:course_id],
      name: params[:name]
    )
    render json: { quiz: quiz }, status: 200
  end

  def show
    @quiz = Quiz.find(params[:id])
    #no_permission unless @video_channel.user_has_access?(current_user.id)
  end

  private

  def no_permission
    render text: 'Not Found', status: '404'
  end
end
