class ConversationsController < ApplicationController

	before_action :authenticate_user!

  protect_from_forgery with: :exception

	def index
    session[:conversations] ||= []

    @users = current_user.foundation.students.where.not(id: current_user)
    @conversations = Conversation.includes(:recipient, :messages)
                                 .find(session[:conversations])
    render layout: false                              
  end

  def create
    @conversation = Conversation.get(current_user.id, params[:user_id])
    
    add_to_conversations unless conversated?
    
    respond_to do |format|
      format.js
    end
  end

  def close
    @conversation = Conversation.find(params[:id])

    session[:conversations].delete(@conversation.id)

    respond_to do |format|
      format.js
    end
  end

  private

  def add_to_conversations
    session[:conversations] ||= []
    session[:conversations] << @conversation.id
  end

  def conversated?
    session[:conversations].include?(@conversation.id)
  end
end
