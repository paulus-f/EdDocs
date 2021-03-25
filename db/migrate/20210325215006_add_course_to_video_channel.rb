class AddCourseToVideoChannel < ActiveRecord::Migration[5.2]
  def change
    change_table :video_channels do |t|
      t.references :course, index: true
    end
  end
end
