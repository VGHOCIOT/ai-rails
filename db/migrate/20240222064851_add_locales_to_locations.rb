class AddLocalesToLocations < ActiveRecord::Migration[7.1]
  def change
    add_column :locations, :shortened_address, :string
    add_column :locations, :country, :string
    add_column :locations, :county, :string
    add_column :locations, :country_code, :string
    add_column :locations, :postcode, :string
    add_column :locations, :street, :string
    add_column :locations, :suburb, :string
    add_column :locations, :state_code, :string
    add_column :locations, :website, :string
  end
end
