require 'base64'
require 'stringio'

class FoundationsController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!, :current_foundation, only: %i[get_foundation edit update destroy preload image_purge]
  PATH_IMAGE = 'public/assets/'.freeze
  REGEXP = /\Adata:([-\w]+\/[-\w\+\.]+)?;base64,(.*)/m

  def new
  end

  def create
    manager = User.find_by(email: params[:foundation][:selected_manager])
    @foundation = Foundation.new(foundation_params)
    @foundation.managers << manager unless manager.nil?
    new_image(params[:foundation][:image], @foundation)
    if @foundation.save!
      render json: {}, status: 200
      return
    else
      render json: { message: 'Erron in form' }, status: 400
    end
  end

  def edit
    @end_date = @foundation.end_academic_year.to_date unless @foundation.end_academic_year.nil? 
    @begin_date = @foundation.begin_academic_year.to_date unless @foundation.end_academic_year.nil?
    @image = url_for(@foundation.image) if @foundation.image.attached?
  end

  def list_foundations
    render json: {
      schools: Foundation.where(type_foundation: :school).select(:name, :id),
      colleges: Foundation.where(type_foundation: :college).select(:name, :id),
      universities: Foundation.where(type_foundation: :university).select(:name, :id),
      kindergartens: Foundation.where(type_foundation: :kindergarten).select(:name, :id) 
    }, status: 200
  end

  def show
    @foundation = Foundation.find_by(id: params[:id])
  end

  def destroy
  end

  def update
    @foundation.update_attributes(foundation_params)
    render template: 'foundations/show.json'
  end

  def image_purge
    @foundation.image.purge
    render json: { message: 'Complete' }, status: 200
  end

  def preload
    base64_image = params[:image][0]
    new_image(base64_image, @foundation)
    render json: { url: url_for(@foundation.image) }, status: 200
  end

  def get_foundation
    @f_image = nil
    @f_image = url_for(@foundation.image) if @foundation.image.attached?
    render json: {
      foundation: @foundation.to_json,
      foundation_image: @f_image
    }, status: 200
  end

  private

  def new_image(img_base64, foundation)
    data_uri_parts = img_base64.match(REGEXP) || []
    extension = MIME::Types[data_uri_parts[1]].first.preferred_extension
    file_name = "#{PATH_IMAGE}file#{Time.now.strftime("%Y%jT%T%z")}.#{extension}"
    File.open(file_name, 'wb') do |file|
      file.write(Base64.decode64(data_uri_parts[2]))
    end
    foundation.image.attach(io: File.open("#{Rails.root}/#{file_name}"), filename: file_name)
  end

  def current_foundation
    @foundation = Foundation.find_by(id: params[:id])
  end

  def foundation_params
    params.require(:foundation)
          .permit(
            :name,
            :description,
            :address,
            :type_foundation,
            :end_academic_year,
            :begin_academic_year
          )
  end
end
