class CreateCertificates < ActiveRecord::Migration[5.2]
  def change
    create_table :certificates do |t|
      t.belongs_to :profile, index: true
      t.belongs_to :course, index: true
      t.string :header
      t.string :message
      t.timestamps
    end
  end
end
