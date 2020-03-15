class AddLevelToCourseAndDeleteCourse < ActiveRecord::Migration[5.2]
  def change
    remove_reference :certificates, :course, index: true
    add_reference :certificates, :level, index: true
  end
end
