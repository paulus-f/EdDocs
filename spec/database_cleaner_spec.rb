require 'database_cleaner'
describe 'Config database cleaner before all specs' do
  before(:all) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end
end

describe 'Clean database after all specs' do
  after(:all) do
   DatabaseCleaner.clean
  end
end
