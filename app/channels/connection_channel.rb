class ConnectionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "connection_channel"
  end

  def unsubscribed
  end
end