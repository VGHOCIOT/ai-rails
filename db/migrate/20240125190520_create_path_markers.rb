class CreatePathMarkers < ActiveRecord::Migration[7.1]
  def change
    create_table :path_markers do |t|
      t.string :name
      t.references :location, foreign_key: true

      t.timestamps
    end
  end
end
