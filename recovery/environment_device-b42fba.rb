require "ipaddress"

# EnvironmentDevice Model
class EnvironmentDevice < ApplicationRecord
  include ApplicationHelper

  # Use nodes along with factor to ensure correct clustering.
  attr_accessor :nodes

  belongs_to :build
  belongs_to :device, optional: true
  belongs_to :environment
  belongs_to :parent, class_name: "EnvironmentDevice", optional: true, inverse_of: :children
  has_many :children, class_name: "EnvironmentDevice", foreign_key: "parent_id", inverse_of: :parent

  enum device_type: { esm: 0, rec: 1, elm: 2, adm: 3, dem: 4, ace: 5, esmcombo: 6, recelm: 7, els: 8 }
  enum host_type: { hardware: 0, vm: 1 }

  validates :device_type, :build_id, :environment_id, presence: true
  validates :device_id, uniqueness: true, allow_nil: true
  validate :check_fips_enabled
  validate :check_ip_address
  validate :verify_proper_clustering

  before_destroy :set_device_to_idle

  # This validation will perform the following operations to
  # ensure clustering is properly done on the devices:
  # 1) Ensure the build version is at least 10.1
  # 2) Ensure cluster_count % factor == 0
  def verify_proper_clustering
    # only perform the tests using a parent node.
    if ( parent_id.nil? && factor.positive? )
      if factor > 0
          version = build["version"]
          major, minor, patch = version.split( "." ).map( &:to_i )
          result = ( major >= 10 && minor >= 1 ) ? true : false
          errors.add( 'Build version is too low' ) unless result
       end

       if factor.positive?
         result = nodes % factor
         errors.add( 'nodes is not equally divisible by factor' ) unless result == 0
       end
    end
  end

  # Ensure the IP is in the correct format
  def check_ip_address
    if ip_address
      result = IPAddress.valid? ip_address
      errors.add( 'Incorrect IP formatting' ) unless result
    end
  end

  def check_fips_enabled
    fips_enabled = false if fips_enabled.nil?
    errors.add( 'FIPS Enabled flag invalid' ) unless is_boolean?( fips_enabled )
  end

  def set_device_to_idle
    if device && !device.disabled?
      device.idle!
    end
  end

  # Counts the number of children that are keying to this Esm.
  #
  # @return [Fixnum] The number of children currently keying to
  #   this Esm.
  def keying_children
    return children.inject( 0 ) do |product, value|
      product += 1 if value.try( :device ).try( :keying? )
      product
    end
  end
end
