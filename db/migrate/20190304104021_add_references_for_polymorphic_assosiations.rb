class AddReferencesForPolymorphicAssosiations < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.references :parent, polymorphic: true, index: true
    end
  remove_column :users, :user_id, :bigint
  end
end
