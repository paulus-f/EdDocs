require 'rails_helper'

RSpec.describe Group, type: :model do
  before(:each) do
    @foundation = FactoryBot.create(:foundation)
    @level = Level.create(foundation_id: @foundation.id, name: 'Test')
  end
  subject { Group.new }

  it 'is invalid without name' do
    subject.level_id = @level.id
    expect(subject).to be_invalid
  end

  it 'is invalid without level' do
    subject.name = 'Test'
    expect(subject).to be_invalid
  end

  it 'is valid with name and level' do
    subject.name = 'Test name'
    subject.level_id = @level.id
    expect(subject).to be_valid
  end

  it 'is not valid when group with the same name already exist' do
    subject.name = 'Test'
    subject.level_id = @level.id
    @level.groups.create(name: 'Test')
    expect(subject).to be_invalid
  end
end
