class Course < ApplicationRecord
  has_attached_file :photo, default_url: 'notfound.png'
  belongs_to :level
  has_many :video_channels

  validates_attachment_content_type :photo, content_type: ["image/jpg", "image/jpeg", "image/png"]

  #validates :description, length: { maximum: 500, message: "it's to long, allows only 500 symbols" }
  validates :name, presence: true, uniqueness: { scope: :level_id, message: 'should be unique for level' }
end
