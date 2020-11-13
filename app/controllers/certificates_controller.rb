class CertificatesController < ApplicationController
  load_and_authorize_resource
  before_action :current_certificate, only: %i[show update]

  def show
    @foundation = @certificate.foundation
    @profiles = current_user.admin? || current_user.manager? ? @certificate.profiles : @certificate.profiles.find_by(user: current_user.id)
    respond_to do |format|
      format.pdf do
        render pdf: "Course_#{@certificate.level.name}",
               page_size: 'A4',
               template: 'certificates/show.html.erb',
               layout: 'pdf.html',
               orientation: 'Landscape',
               lowquality: true,
               zoom: 1,
               dpi: 75
      end
    end
  end

  def update
    @certificate.update_attributes(certificate_params)
    render json: { msg: 'Updated' }, status: 200
  end

  private

  def certificate_params
    params
      .require(:certificate)
      .permit(
        :header,
        :message
      )
  end

  def current_certificate
    @certificate = Certificate.find(params[:id])
  end
end
