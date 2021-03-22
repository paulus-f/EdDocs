class AddPolymorphycToConversation < ActiveRecord::Migration[5.2]
  def change
    add_column :conversations, :recipient_type, :string, default: 'User'
  end
end
