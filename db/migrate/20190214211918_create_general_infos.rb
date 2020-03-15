class CreateGeneralInfos < ActiveRecord::Migration[5.2]
  def change
    create_table :general_infos do |t|
    	t.string :first_name
	    t.string :second_name
	    t.string :third_name
	    t.datetime :birth_date
	    t.string :hobbie
      t.timestamps  
    end
  end
end
