class Profile < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :certificates
  has_one :general_info
  has_many :medication
  has_one :parent_contact
  has_one :questionnaire
  has_one :emergency_conn
  has_one :signature
  has_one :allergy

  after_create do |profile|
    GeneralInfo.create(profile: profile)
    Medication.create(profile: profile)
    ParentContact.create(profile: profile)
    Questionnaire.create(profile: profile)
    EmergencyConn.create(profile: profile)
    Allergy.create(profile: profile)
    Signature.create(profile: profile)
  end
end
