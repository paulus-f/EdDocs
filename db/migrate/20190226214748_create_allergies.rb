class CreateAllergies < ActiveRecord::Migration[5.2]
  def change
    create_table :allergies do |t|
      t.string :source
      t.string :cause
      t.references :profile, foreign_key: true

      t.timestamps
    end
  end
end
