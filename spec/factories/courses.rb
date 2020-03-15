FactoryBot.define do
  factory :course do
    name { Faker::Lorem.word }
    start { Foundation.last.begin_academic_year }
    finish { Foundation.last.end_academic_year }
    hours { 200 }
    level_id { Foundation.last.levels.order('random()').first.id }
  end
end
