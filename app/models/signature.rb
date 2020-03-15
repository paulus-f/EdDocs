class Signature < ApplicationRecord
  belongs_to :profile
  has_attached_file :signature, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :signature, content_type: /\Aimage\/.*\z/

end
