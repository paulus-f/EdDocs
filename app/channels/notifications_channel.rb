class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    id = params[:id]
    
    stream_from "notify_message:#{id}" if id.present?
  end

  def unsubscribed
    stop_all_streams
  end 

end
