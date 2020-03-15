class CreateCourses < ActiveRecord::Migration[5.2]
  def change
    create_table :courses do |t|
      t.string :name, null: false
      t.integer :hours, null: false
      t.datetime :start, null: false
      t.datetime :finish, null: false
      t.belongs_to :level, index: true
      t.timestamps
    end
  end
end
