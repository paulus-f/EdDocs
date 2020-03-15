require 'rails_helper'

RSpec.describe PagesController, type: :controller do
  describe 'POST #support' do
    before(:each) do
      @message = {problem: 'problem', description: 'description', email: 'test@mail'}
    end
    it 'increase count of jobs by 1 and render no content(204)' do
      expect {
          post(:support, params: { message: @message })
          expect(response).to have_http_status(204)
        }.to change(SupportWorker.jobs, :size).by(1)
    end
  end
end
