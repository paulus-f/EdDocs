class Course < ApplicationRecord
  belongs_to :level
  has_many :video_channels
  has_many :quizzes
  has_attached_file :photo, default_url: 'notfound.png'

  validates_attachment_content_type :photo, content_type: ["image/jpg", "image/jpeg", "image/png"]
  validates :name, presence: true, uniqueness: { scope: :level_id, message: 'should be unique for level' }
end
