class CreateTableJwtTokens < ActiveRecord::Migration[5.2]
  def change
    create_table :jwt_tokens do |t|
      t.references :user
      t.string :token
    end
  end
end
