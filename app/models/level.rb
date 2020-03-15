class Level < ApplicationRecord
  validates :name, presence: true, uniqueness: { scope: :foundation_id, message: "should be unique for foundation" }
  belongs_to :foundation
  has_many :groups, dependent: :destroy
  has_many :courses, dependent: :destroy
  has_one :certificate, dependent: :destroy
  after_create do |level|
    Certificate.create(level: level)
  end
end
