class CreateQuestionnaires < ActiveRecord::Migration[5.2]
  def change
    create_table :questionnaires do |t|
    	t.boolean :sportF
    	# F - Forbbiden
    	t.boolean :glasses
    	t.boolean :hearing
      t.timestamps
    end
  end
end
