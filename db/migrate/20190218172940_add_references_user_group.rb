class AddReferencesUserGroup < ActiveRecord::Migration[5.2]
  def change
    add_reference :users, :group, index: true
  end
end
