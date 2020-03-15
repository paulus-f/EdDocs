class AddCheckEnrollmentForm < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :enrollment_form, :boolean, default: false
  end
end
