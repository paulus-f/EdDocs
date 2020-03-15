class AddAcademicYear < ActiveRecord::Migration[5.2]
  def change
    add_column :foundations, :end_academic_year, :date
    add_column :foundations, :begin_academic_year, :date
  end
end
