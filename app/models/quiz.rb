class Quiz < ApplicationRecord

  ACCESS_TO_CERTIFICATE = 70

  belongs_to :user
  belongs_to :course
  has_many :quiz_questions
  has_many :quiz_results
end
