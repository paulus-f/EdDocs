class AddRalation < ActiveRecord::Migration[5.2]
  def change
    create_table :certificates_profiles, id: false do |t|
      t.belongs_to :profile, index: true
      t.belongs_to :certificate, index: true
    end
  end
end
