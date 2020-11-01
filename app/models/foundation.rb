class Foundation < ApplicationRecord
  extend Enumerize

  enumerize :type_foundation, in: %i[college school university kindergarten]

  has_one_attached :image
  has_and_belongs_to_many :invites, -> { where role: 'student' }, class_name: 'User'

  has_many :students, -> { where role: 'student' }, class_name: 'User'
  has_many :managers, -> { where role: 'manager' }, class_name: 'User'
  has_many :parents, -> { where role: 'parent' }, class_name: 'User'
  has_many :levels, dependent: :destroy
  has_many :groups, through: :levels
  has_many :courses, through: :levels
  has_many :requests, dependent: :destroy

  def get_url
    Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)
  end
end
