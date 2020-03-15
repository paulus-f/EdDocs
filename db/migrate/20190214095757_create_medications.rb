class CreateMedications < ActiveRecord::Migration[5.2]
  def change
    create_table :medications do |t|
    	t.string :name
    	t.datetime :time
    	t.float :dose
      t.timestamps
    end
  end
end
