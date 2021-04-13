class CreateQuizQuestion < ActiveRecord::Migration[5.2]
  def change
    create_table :quiz_questions do |t|
      t.string :prompt
      t.boolean :quiz_type, default: false
      t.string :a
      t.string :b
      t.string :c
      t.string :d
      t.string :input
      t.string :asnwer
      t.references :quiz, index: true
    end
  end
end
