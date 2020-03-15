require 'rails_helper'

RSpec.describe StudentsTableController, type: :controller do
  before(:each) do
    @foundation = FactoryBot.create(:foundation)
  end
  describe 'POST #kick_student' do
    context 'When selected only one student' do
      before(:each) do
        @student = FactoryBot.create :student
        @foundation.students << @student
      end
      it 'delete student students list' do
        expect {
          post(:kick_student, params: { selected: [@student.id], foundation_id: @foundation.id })
          expect(response).to render_template('students_table/index.json')
        }.to change(@foundation.students, :count).by(-1)
      end
    end
    context 'When selected more then one student' do
      before(:each) do
        @selected = []
        5.times do 
          @student = FactoryBot.create :student
          @selected << @student.id
          @foundation.students << @student
        end
      end
      it 'delete all selected students and render empty data' do
        expect {
          post(:kick_student, params: { selected: [@selected], foundation_id: @foundation.id })
          expect(response).to render_template('students_table/index.json')
        }.to change(@foundation.students, :size).by(-5)
      end
    end
  end
  describe 'POST #filter_students' do
    before(:each) do
      @level = @foundation.levels.create(name: 'Test')
      @group = @level.groups.create(name: 'Test', level_id: @level.id)
      @student1 = FactoryBot.create :student
      @student2 = FactoryBot.create :student
      @foundation.students << @student1
      @foundation.students << @student2
      @group.students << @student1
    end
    context 'when filter select all' do
      it 'render all students' do
        post(:filter_students, params: { foundation_id: @foundation.id, selectOnly: 'all' })
        expect(response).to render_template('students_table/index.json')
      end
    end
    context 'when filter select only with group' do
      it 'render students with group' do
        post(:filter_students, params: { foundation_id: @foundation.id, selectOnly: 'group' })
        expect(response).to render_template('students_table/index.json')
      end
    end
    context 'when filter select only without group' do
      it "render students without group" do
        post(:filter_students, params: { foundation_id: @foundation.id, selectOnly: 'notgroup' })
        expect(response).to render_template('students_table/index.json')
      end
    end
  end
end
