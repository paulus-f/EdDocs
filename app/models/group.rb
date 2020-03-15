class Group < ApplicationRecord
  validates :name, presence: true, uniqueness: { scope: :level_id, message: "should be unique for level" }
  belongs_to :level
  has_many :students, -> { where role: 'student' }, class_name: 'User', dependent: :nullify
end
