require 'rails_helper'

RSpec.describe SupportMailer, type: :mailer do
  describe 'Support' do
    before(:each) do
      @message = {'email' => 'test@mail', 'problem' => 'problem', 'description' => 'description'}
    end
    let(:mail) { SupportMailer.message_to_support(@message) }

    it 'renders the headers' do
      expect(mail.subject).to eq('problem')
      expect(mail.to).to eq(['deamteamrubylab@gmail.com'])
      expect(mail.from).to eq(['test@mail'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match('test@mail')
    end
  end
end
