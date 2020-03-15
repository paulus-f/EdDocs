class Certificate < ApplicationRecord
  belongs_to :level
  has_and_belongs_to_many :profiles

  def foundation
    level.foundation
  end
end
