class ConnectionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "connection_channel"
  end

  def unsubscribed
    stop_all_streams
  end
end