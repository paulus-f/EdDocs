class CreateFoundations < ActiveRecord::Migration[5.2]
  def change
    create_table :foundations do |t|
      t.string :name
      t.text :description
      t.references :user, foreign_key: true
      t.string :type
      t.string :address

      t.timestamps
    end
  end
end
