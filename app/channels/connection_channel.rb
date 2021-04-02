class ConnectionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "connection_channel_#{params[:video_channel_id]}"
  end

  def unsubscribed
    stop_all_streams
  end
end