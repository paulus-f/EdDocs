json.videoChannel do
  json.id @video_channel.id
  json.name @video_channel.name
  json.open @video_channel.open || false
  json.creator @video_channel.creator
  json.group @video_channel.group
  json.conversation @video_channel.conversation
  json.course @video_channel.course
end

json.currentUser current_user