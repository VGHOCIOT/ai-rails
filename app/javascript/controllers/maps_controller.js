import { Controller } from "@hotwired/stimulus"
import L from "leaflet"
import { post } from '@rails/request.js'

// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container"]

  connect() {
    // creation of the first section of the map could first ask the user where they are taking their trip from, then the first
    // few locations could be created based on the view (this could involve smarter start-up, i.e give an option for abandoning
    // the previous trip and starting new with removal of previous locations and etc, this will also need a model rep for the
    // current map center)
    var map = L.map(this.containerTarget).setView([43.39, -79.20], 8.5)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    async function defineLocation(ev) {
      var lat = ev.latlng.lat
      var lng = ev.latlng.lng
      console.log(lat,lng); 
      L.marker([lat,lng]).addTo(map)
      const url = '/locations'
      const data = {
        latitude: lat,
        longitude: lng,
      }
      const response = await post(url, {responseKind: 'json', body: data})
      console.log(response)
      if (response.ok) {
        console.log('here')
        // window.notifier.success('Successfully created a new location', {})
      } else {
        // const error = await response.json
        // window.notifier.alert(`Error creating a location: ${JSON.stringify(error)}.`)
      }
    }
    // inside of here need to create handlers for clicking on the maps, this can be combined with MouseEvents to determine
    // the point at which the user clicked, this should be possible using the stimulus event listeners
    map.on('click', defineLocation)
  }

  disconnect() {
    this.map.remove()
  }
  // function will have to take in location data that was pressed and decide if the location already exists then call either
  // destroy or create methods in the location endpoint, this will be using Geocoder to take the lat,lng information to allow
  // for the reverse coding into actual address and landmark info

}