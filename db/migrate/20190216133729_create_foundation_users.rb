class CreateFoundationUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :foundations_users, id: false do |t|
      t.belongs_to :foundation, index: true
      t.belongs_to :user, index: true
    end
  end
end
