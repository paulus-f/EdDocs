# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

FactoryBot.create :admin

10.times do
  foundation ||= FactoryBot.create :foundation
  FactoryBot.create :manager, foundation_id: foundation.id
  FactoryBot.create :student, foundation_id: foundation.id
end