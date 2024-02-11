class CreatePathMarkersAndAddToLocation < ActiveRecord::Migration[7.1]
  def change
    create_table :path_markers do |t|
      t.string :name

      t.timestamps
    end

    add_reference :locations, :path_marker, foreign_key: true
  end
end
