class CreateQuizAsnwer < ActiveRecord::Migration[5.2]
  def change
    create_table :quiz_asnwers do |t|
      t.string :input
      t.string :asnwer
      t.references :quiz_question
      t.references :quiz_results
    end
  end
end
