class QuizResult < ApplicationRecord
  belongs_to :user
  belongs_to :quiz
  has_many :quiz_asnwers
end
