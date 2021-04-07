json.videoChannel do
  json.id @video_channel.id
  json.name @video_channel.name
  json.open @video_channel.open
  json.creator @video_channel.creator
  json.group @video_channel.group
  json.conversation @video_channel.conversation
  json.course @video_channel.course
end

json.currentUser current_user
json.isCreator current_user.id == @video_channel.creator_id
json.isConnected @video_channel.open