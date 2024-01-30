class Location < ApplicationRecord  
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode

  belongs_to :path_markers
  # add a before? after? creation function that will list the correct venue of the location; cannot do this based off of
  # https://stackoverflow.com/questions/55010460/find-near-banks-schools-from-latitude-and-longitude-using-geocoder-gem


  # before final save, need a callback method that will call the Google Places API and define the name of the location if 
  # it has a proper name

  # function that will take in the Google Places information (along with a relevant picture) and populate a new location to be 
  # listed using turbo stream
end
