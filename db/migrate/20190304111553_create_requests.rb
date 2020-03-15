class CreateRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :requests do |t|
      t.references :parent, class_name: :user, index: true
      t.references :student, class_name: :user, index: true
      t.references :level, index: true
      t.references :group, index: true
      t.references :foundation, index: true
      t.timestamps
    end
  end
end
