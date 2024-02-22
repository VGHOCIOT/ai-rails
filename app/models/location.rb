class Location < ApplicationRecord  
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode

  belongs_to :path_marker
  # add a before? after? creation function that will list the correct venue of the location; cannot do this based off of
  # https://stackoverflow.com/questions/55010460/find-near-banks-schools-from-latitude-and-longitude-using-geocoder-gem


  # before final save, need a callback method that will call the Google Places API and define the name of the location if 
  # it has a proper name

  # function that will take in the Google Places information (along with a relevant picture) and populate a new location to be 
  # listed using turbo stream

  # make a function that will determine if a location is in the current viewpoint for the map

  # need to define a search method that will handle the populated locations that are stored 
  def self.search(q)
    matching_designation = Location.find_by(designation: q)
    if matching_designation
      self.where(location_id: matching_designation)
    else
      Location.all
    end
  end
end
