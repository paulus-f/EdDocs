class Group < ApplicationRecord
  belongs_to :level
  has_many :students, -> { where role: 'student' }, class_name: 'User', dependent: :nullify
  has_many :video_channels

  validates :name,
            presence: true,
            uniqueness: {
              scope: :level_id,
              message: 'should be unique for level'
            }
end
