class AddColumnRoleAndApproveToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :role, :string, null: false
    add_column :users, :approve, :boolean, default: false
  end
end
