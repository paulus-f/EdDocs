class QuizAsnwers < ApplicationRecord
  belongs_to :quiz_question
  belongs_to :quiz_results
end
