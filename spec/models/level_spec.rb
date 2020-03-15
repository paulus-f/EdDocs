require 'rails_helper'

RSpec.describe Level, type: :model do
  before(:each) do
    @foundation = FactoryBot.create(:foundation)
  end
  subject { Level.new }

  it 'is invalid without name' do
    subject.foundation_id = @foundation.id
    expect(subject).to be_invalid
  end

  it 'is invalid without foundation' do
    subject.name = 'Test'
    expect(subject).to be_invalid
  end

  it 'is valid with name and foundation' do
    subject.name = 'Test name'
    subject.foundation_id = @foundation.id
    expect(subject).to be_valid
  end

  it 'is not valid when level with the same name already exist' do
    subject.name = 'Test'
    subject.foundation_id = @foundation.id
    @foundation.levels.create(name: 'Test')
    expect(subject).to be_invalid
  end
end
