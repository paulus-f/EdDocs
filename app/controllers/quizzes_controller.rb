class QuizzesController < ApplicationController
  def create
    quiz = Quiz.create(
      user_id: current_user.id,
      course_id: params[:course_id],
      name: params[:name]
    )
    render json: { quiz: quiz }, status: 200
  end

  def add_question
    quiz_question = QuizQuestion.create(quiz_question_params)

    render json: { quiz_question: quiz_question }, status: 200
  end

  def quiz_editor_data
    quiz = Quiz.includes(:quiz_questions, :quiz_results).find(params[:quiz_id])
    render json: { 
      quiz: quiz,
      quiz_questions: quiz&.quiz_questions,
      quiz_results: quiz&.quiz_results
    }, status: 200
  end

  def show
    @quiz = Quiz.find(params[:id])
    #no_permission unless @video_channel.user_has_access?(current_user.id)
  end

  private

  def quiz_question_params
    params.require(:quizNewQuestion).permit(:prompt, :a, :b, :c, :d, :asnwer).merge(quiz_id: params[:quiz_id])
  end

  def no_permission
    render text: 'Not Found', status: '404'
  end
end
