import { Controller } from "@hotwired/stimulus"
import L from "leaflet"
import { get, post, destroy } from '@rails/request.js'
// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container", "clear", "submit", "text"]
  static values = {
    pathMarkerId: Number
  }

  markers = new Array()

  initialize() {
    // creation of the first section of the map could first ask the user where they are taking their trip from, then the first
    // few locations could be created based on the view (this could involve smarter start-up, i.e give an option for abandoning
    // the previous trip and starting new with removal of previous locations and etc, this will also need a model rep for the
    // current map center)
    var map = L.map(this.containerTarget).setView([43.65, -79.38], 13.5)
    var layer = L.layerGroup().addTo(map)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    map.on('click', (ev) => {
      // this.addMarkers(map, false),
      this.defineLocation(ev, map, layer)
    })

    this.clearTarget.addEventListener('click', () => { this.ClearAllLocations(map, layer) })
    this.submitTarget.addEventListener('click', () => { this.SetPathLocations(map, layer) })

  }

  connect() {
  }

  disconnect() {
    this.map.remove()
  }

  // Function will have to take in location data that was pressed and decide if the location already exists then call either
  // destroy or create methods in the location endpoint, this will be using Geocoder to take the lat,lng information to allow
  // for the reverse coding into actual address and landmark info

  // instead of using boolean check if point is already defined by searching for as close of a point as possible, change this 
  // method name to be marker movement related, remove calls to addition to location endpoint from here as well as removal, just adding to list
  async defineLocation(ev, map, layer) {
    // if the marker doesn't already exist, create it 
    var lat = ev.latlng.lat
    var lng = ev.latlng.lng
    // if the marker already exists at that location, within an abs differnce of .0002 lat or long, then remove the marker and hit a delete
    // this currently doesn't work as this needs to be hit every time the overall markers list has been updated, will not need to hit destroy, just need to remove marker
    // potentially make into a function?
    if (Object.values(layer._layers).find((field) => this.hasExistingMarker(field, lat, lng))) {
      layer.removeLayer(Object.values(layer._layers).find((field) => this.hasExistingMarker(field, lat, lng)))
      this.markers.splice(this.markers.indexOf([lat,lng]),1)
    } else {
      L.marker([lat,lng]).addTo(layer)
      this.markers.push([lat,lng])
    }
  }

  hasExistingMarker(field, lat, lng) {
    return (Math.abs(lat - field._latlng.lat) <= 0.0003 && Math.abs(lng - field._latlng.lng) < 0.0003)
  }

  // change this function to refresh the map to show the selected locations (potentially optimized path and markers?) in the grouping the 
  // user selects, make the 
  // On select of a exisiting marker on the map, call function that will remove the marker from the map and the list and then populate marker variable and map
  async addMarkers(map, addMarkers) {
    // get associated locations from path marker selection
    // call ClearAllLocations
  }

  // Function will take in all selected markers and populate them as locations in the database only then will the new 
  // endpoint will be hit that will automatically create the new optimized path (need to decide what this needs to be 
  // at first, will process need a data structure for the path points to be passed in)
  async SetPathLocations(map, layer) {
    const response = await fetch('/path_markers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({name: this.textTarget.value}),
    });
    if (!response.ok) {
      throw new Error(`Error creating Location: ${response.statusText}`);
    }
    const responseData = await response.json()
    const pathMarkerId = responseData.id
    for (const field of this.markers){
      await this.createLocation(field, pathMarkerId)
    }
    this.ClearAllLocations(map, layer)
    this.textTarget.value = ""
  }

  async createLocation(field, pathMarkerId) {
    const response = await fetch("/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({
        location: {
          // Location attributes
          path_marker_id: pathMarkerId,
          latitude: field[0],
          longitude: field[1]
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating Location: ${response.statusText}`);
    }
  }

  // Cancel function that will enable at any moment to remove all markers and all listed makers in array 
  ClearAllLocations(map, layer) {
    layer.eachLayer(field => {
      layer.removeLayer(field)
    })
    this.markers = []
  }

  // Edit the current option? How would that work

}