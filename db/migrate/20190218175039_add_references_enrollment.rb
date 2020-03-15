class AddReferencesEnrollment < ActiveRecord::Migration[5.2]
  
  def change
    add_reference :medications, :profile, index: true
    add_reference :parent_contacts, :profile, index: true
    add_reference :questionnaires, :profile, index: true
    add_reference :emergency_conns, :profile, index: true
    add_reference :general_infos, :profile, index: true
  end

end
