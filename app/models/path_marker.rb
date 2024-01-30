class PathMarker < ApplicationRecord
  has_many :locations

  after_create_commit -> { broadcast_append_to "path_markers", partial: "path_markers/path_marker", locals: { path_marker: self }, target: "path_markers" }
end
