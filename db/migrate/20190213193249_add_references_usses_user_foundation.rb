class AddReferencesUssesUserFoundation < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.references :foundation
    end
  end
end