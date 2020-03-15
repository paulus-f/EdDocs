class ParentContact < ApplicationRecord
	belongs_to :profile
	#validates :first_name, :second_name, :phone_number
end
