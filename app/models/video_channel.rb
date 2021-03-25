class VideoChannel < ApplicationRecord
  belongs_to :conversation
  belongs_to :creator, foreign_key: :creator_id, class_name: 'User'
  belongs_to :group
  belongs_to :course
end
