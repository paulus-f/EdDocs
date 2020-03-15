class RenameColumnFoundation < ActiveRecord::Migration[5.2]
  def change
    rename_column :foundations, :type, :type_foundation
  end
end
