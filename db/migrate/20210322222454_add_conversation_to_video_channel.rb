class AddConversationToVideoChannel < ActiveRecord::Migration[5.2]
  def change
    add_reference :video_channels, :conversation, index: true
  end
end
