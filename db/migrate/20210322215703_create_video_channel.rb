class CreateVideoChannel < ActiveRecord::Migration[5.2]
  def change
    create_table :video_channels do |t|
      t.string :name
      t.boolean :open
      t.references :creator, class_name: :user, index: true
      t.references :group, index: true

      t.timestamps
    end
  end
end
