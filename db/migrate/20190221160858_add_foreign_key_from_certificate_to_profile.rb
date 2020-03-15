class AddForeignKeyFromCertificateToProfile < ActiveRecord::Migration[5.2]
  def change
    add_reference :profiles, :certificate, index: true
  end
end
