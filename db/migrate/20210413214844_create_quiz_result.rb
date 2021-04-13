class CreateQuizResult < ActiveRecord::Migration[5.2]
  def change
    create_table :quiz_results do |t|
      t.float :result
      t.boolean :finished, default: false
      t.references :quiz
      t.references :user
    end
  end
end
