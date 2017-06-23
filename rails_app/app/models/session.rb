class Session
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Paranoia

  belongs_to :user

  embeds_many :answers

  field :started_at,     type: DateTime
  field :local_id,       type: String
  field :situation,      type: String
  field :version,        type: Integer
  field :image,          type: String
  field :description,    type: String
  field :gps_position,   type: Hash

  validates :started_at, presence: true
  validates :local_id,   presence: true
  validates :local_id,   uniqueness: { scope: :user_id }
  validates :situation,  presence: true
  validates :version,    presence: true

  index started_at: 1
end
