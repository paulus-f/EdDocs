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
    #no_permission unless @video_channel.user_has_access?(current_user.id)
  end

  def change_connection_state
    channel = VideoChannel.find(params[:video_channel_id])
    state = channel.change_state

    render json: {
      isOpen: state
    }
  end

  def create_connection
    head :no_content
    ActionCable.server.broadcast "connection_channel_#{params[:video_channel_id]}", connection_params
  end

  private

  def no_permission
    render text: 'Not Found', status: '404'
  end
  
  def connection_params
    params.require(:connection).permit(:type, :from, :to, :sdp, :candidate)
  end
end
