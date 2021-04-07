class VideoChannel < ApplicationRecord
  belongs_to :conversation
  belongs_to :creator, foreign_key: :creator_id, class_name: 'User'
  belongs_to :group
  belongs_to :course

  def user_has_access?(user_id)
    creator_id == user_id ||
      group.students.find_by(id: user_id).present?
  end

  def change_state
    update(open: !open)
    open
  end
end
