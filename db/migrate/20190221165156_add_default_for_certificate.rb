class AddDefaultForCertificate < ActiveRecord::Migration[5.2]
  def up
    change_column :certificates, :header, :string, default: 'Certificate'
    change_column :certificates, :message, :string, default: 'Congratulation'
  end
  
  def down
    change_column :certificates, :header, :string, default: 'Certificate'
    change_column :certificates, :message, :string, default: 'Congratulation'
  end
end
