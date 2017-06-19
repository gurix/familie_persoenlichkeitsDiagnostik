require 'spec_helper'

describe ApplicationHelper do
  describe '.title' do
    it 'sets content for :title' do
      helper.title 'test'
      expect(view.content_for(:title)).to eq 'test'
    end
  end
end
