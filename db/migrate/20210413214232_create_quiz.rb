class CreateQuiz < ActiveRecord::Migration[5.2]
  def change
    create_table :quizzes do |t|
      t.string :name
      t.references :user, index: true
      t.references :course, index: true

      t.timestamps
    end
  end
end
