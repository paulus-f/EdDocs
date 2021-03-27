class VideoChannelsController < ApplicationController
  def create
    conversation = Conversation.get(current_user.id, params[:group_id], 'Group')
    course = Course.find params[:course_id]
    group = Group.find params[:group_id]
    amount_vc = VideoChannel.where(
      course_id: course.id,
      group_id: group.id,
    ).size

    video_channel = VideoChannel.create(
      creator_id: current_user.id,
      group_id: params[:group_id],
      course_id: params[:course_id],
      conversation_id: conversation.id,
      name: "#{group.level&.name}-#{group.name}-#{course.name}-##{amount_vc + 1}"
    )

    render json: { video_channel: video_channel }, status: 200
  end

  def show
    @video_channel = VideoChannel.find(params[:id])
  end
end
