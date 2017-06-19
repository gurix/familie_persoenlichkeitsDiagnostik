class User
  include Mongoid::Document
  include Mongoid::Timestamps

  has_many :sessions, dependent: :destroy

  ## Database authenticatable
  field :email,              type: String, default: ''
  field :encrypted_password, type: String, default: ''

  ## Recoverable
  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  field :remember_created_at, type: Time

  ## Trackable
  field :sign_in_count,        type: Integer, default: 0
  field :current_sign_in_at,   type: Time
  field :last_sign_in_at,      type: Time
  field :current_sign_in_ip,   type: String
  field :last_sign_in_ip,      type: String

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Token Authenticatable
  acts_as_token_authenticatable
  field :authentication_token

  field :first_name,  type: String
  field :last_name,   type: String
  field :gender,      type: Integer, default: 50
  field :birth_date,  type: Time
  field :view_token,  type: String
  field :admin,       type: Boolean, default: false

  attr_accessor :reset_profile_url

  validates :email,       presence: true
  validates :first_name,  presence: true
  validates :last_name,   presence: true
  validates :gender,      presence: true
  validates :birth_date,  presence: true

  validates_confirmation_of :email

  def reset_view_token
    self.view_token = generate_token(5) until unique_token_for?(:view_token)
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  private

  def generate_token(size)
    SecureRandom.base64(size).delete('/+=')[0, size]
  end

  def unique_token_for?(field = :token)
    self.class.where(field => send(field)).blank? && send(field).present?
  end

  validates :view_token, uniqueness: true

  index created_at: 1
  index updated_at: 1

  before_create :reset_view_token
end
