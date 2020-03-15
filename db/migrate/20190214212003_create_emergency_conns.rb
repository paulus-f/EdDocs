class CreateEmergencyConns < ActiveRecord::Migration[5.2]
  def change
    create_table :emergency_conns do |t|
    	t.string :first_name
	    t.string :second_name
	    t.string :third_name
	    t.string :phone_number
      t.timestamps
    end
  end
end
