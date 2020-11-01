class LevelsController < ApplicationController
  before_action :find_level, except: %i[create generate_by_template]

  def create
    @level = Level.new(level_params)
    @level.foundation = Foundation.find_by(id: params[:foundation_id])
    render json: @level.to_json(include: :groups) if @level.save
  end

  def update
    render json: @level.name if @level.update(level_params)
  end

  def destroy
    @level.destroy
    @foundation = @level.foundation
    render json: @foundation.students.includes(:profile).where(group_id: nil).to_json(include: :profile)
  end

  #TODO uniq foundation name 
  def get_levels
    if params[:levels_by_nf] == 'true'
      @foundation = Foundation.find_by(name: params[:name])
      if @foundation
        render json: {levels: @foundation.levels.pluck(:name)}, status: 200
      else
        render json: {
          levels: []
        }, status: 200
      end
      return
    end

    @foundation = Foundation.find_by(id: params[:id])
    if @foundation
      render template: 'levels/get_levels.json', status: 200
    else
      render json: {
        levels: []
      }, status: 200
    end
  end

  def generate_by_template
    @foundation = Foundation.find_by(id: params[:foundation_id])
    params[:levels_number].to_i.times do |timel|
      @level = Level.create(name: params[:level_name] + " #{timel+1}")
      params[:groups_number].to_i.times do |timeg|
        @group = Group.create(name: params[:group_name] + " #{timeg+1}")
        @level.groups << @group
      end
      @level.save
      @foundation.levels << @level
      @foundation.save
    end
    render template: 'levels/generate_by_template.json'
  end

  def get_info_certificate
    level_id = params[:level_id].to_i
    @certificate = Certificate.find_by(level_id: level_id)
    render json: { message: @certificate.message, header: @certificate.header, id: @certificate.id }, status: 200 
  end

  def certificate_add_profile
    level = Level.find_by(id: params[:level_id].to_i)
    users_id = params[:selected_users]
    profiles =  Profile.where(user_id: users_id)
    certificate = level.certificate
    certificate.profiles.push(profiles)
    profiles.each do |profile|
      profile.certificates.push(certificate)
    end
    render json: { message: "Users was added" }, status: 200
  end 
  
  private

  def find_level
    @level = Level.find_by(id: params[:id])
  end

  def level_params
    params.require(:level).permit!
  end
end

