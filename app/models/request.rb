class Request < ApplicationRecord
  belongs_to :parent, class_name: 'User'
  belongs_to :student, class_name: 'User'
  belongs_to :level
  belongs_to :group
  belongs_to :foundation
end
