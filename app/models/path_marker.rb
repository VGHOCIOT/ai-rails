class PathMarker < ApplicationRecord
  has_many :locations
  accepts_nested_attributes_for :locations
end
