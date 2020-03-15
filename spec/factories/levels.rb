FactoryBot.define do
  factory :level do
    name {Faker.Internet.Nickname}
    foundation_id {Foundation.last.id}
  end
end
