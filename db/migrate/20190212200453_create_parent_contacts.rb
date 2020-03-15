class CreateParentContacts < ActiveRecord::Migration[5.2]
	  def change
	    create_table :parent_contacts do |t|
	    	t.string :first_name
	    	t.string :second_name
	    	t.string :third_name
	    	t.string :phone_number
	      t.timestamps
	    end
	  end
	end
