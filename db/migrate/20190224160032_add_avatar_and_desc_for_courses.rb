class AddAvatarAndDescForCourses < ActiveRecord::Migration[5.2]
  def change
    change_table :courses do |t|
      t.text :description
      t.attachment :photo
    end
  end
end
