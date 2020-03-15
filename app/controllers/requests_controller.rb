class RequestsController < ApplicationController
  def create
    Request.create(foundation_id: params[:foundation_id],
                   level_id: params[:level_id],
                   group_id: params[:group_id],
                   parent_id: params[:parent_id],
                   student_id: params[:student_id])
  end

  def destroy
    requests_id = params[:requests_id]
    @message = params[:message]
    requests = Request.where(id: requests_id)
    requests.each do |request|
      AdminMessageWorker.perform_async(@message, request.parent.email)
      request.destroy
    end
  end
  
  def approve
    requests_id = params[:requests_id]
    @message = params[:message]
    requests = Request.where(id: requests_id)
    requests.each do |request|
      AdminMessageWorker.perform_async(@message, request.parent.email)
      request.foundation.invites << request.student
      InviteWorker.perform_async(request.student.id,
                                 request.foundation.id,
                                 false,
                                 request.group.id)
      request.destroy
    end
  end
end
