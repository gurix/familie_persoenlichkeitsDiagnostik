class Answer
  include Mongoid::Document

  embedded_in :session

  field :key,           type: String
  field :value,         type: Integer
  field :meta,          type: Hash
  field :recoded,       type: Boolean
  field :recoded_value, type: Integer
  field :position,      type: Integer

  validates :key, presence: true
  validates :value, presence: true
  validates :recoded, presence: true
  validates :recoded_value, presence: true
  validates :position, presence: true
end
