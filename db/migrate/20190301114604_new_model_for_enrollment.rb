class NewModelForEnrollment < ActiveRecord::Migration[5.2]
  def change
    create_table :signatures do |t|
      t.references :profile
      t.attachment :signature
    end
  end
end
