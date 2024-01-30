import { Controller } from "@hotwired/stimulus"
import L from "leaflet"
import { get, post, destroy } from '@rails/request.js'
// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container", "clear"]
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

    // this marker adding seciton should not be hit on first load of the map
    // this.addMarkers(map, true)
    console.log(this.markers)
    // inside of here need to create handlers for clicking on the maps, this can be combined with MouseEvents to determine
    // the point at which the user clicked, this should be possible using the stimulus event listeners

    map.on('click', (ev) => {
      this.addMarkers(map, false),
      this.defineLocation(ev, map, layer)
    })

    this.clearTarget.addEventListener('click', () => { this.ClearAllLocations(map, layer) })
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
    // this.addMarkers(map)
    // if the marker doesn't already exist, create it 
    var lat = ev.latlng.lat
    var lng = ev.latlng.lng
    console.log(lat,lng) 
    var existing = false
    // if the marker already exists at that location, within an abs differnce of .0002 lat or long, then remove the marker and hit a delete
    this.markers.forEach(async (field) => {
      if ((Math.abs(lat - field.latitude) <= 0.0003) && (Math.abs(lng - field.longitude) < 0.0003)) {
        existing = true
        const responseDestroy = await destroy(`/locations/${field.id}`, { responseKind: 'json'})
        if (responseDestroy.ok) {
          map.removeLayer(L.marker[field.latitude,field.longitude])
          // window.notifier.success('Successfully created a new location', {})
        } else {
          // const error = await response.json
          // window.notifier.alert(`Error creating a location: ${JSON.stringify(error)}.`)
        }
      }
    // })
    })
    console.log(existing)
    if (existing === false) {
      L.marker([lat,lng]).addTo(layer)
      const url = '/locations'
      const data = {
        latitude: lat,
        longitude: lng,
      }
      const response = await post(url, {responseKind: 'json', body: data})
      console.log(response)
      if (response.ok) {
        // window.notifier.success('Successfully created a new location', {})
      } else {
        // const error = await response.json
        // window.notifier.alert(`Error creating a location: ${JSON.stringify(error)}.`)
      }
    }
  }

  // change this function to refresh the map to show the selected locations (potentially optimized path and markers?) in the grouping the 
  // user selects, make the 
  async addMarkers(map, addMarkers) {
    // $.getJSON("/locations", function(result){
      // console.log(result)
      // result.forEach((field) => {
      //   console.log(field)
      //   L.marker([field.latitude,field.longitude]).addTo(map)

      // })
      // })
      // var marker1  = L.marker([result[0].latitude,result[0].longitude]).addTo(map)
      // marker1.remove()
      const response = await get('/locations', { responseKind: 'json'})
      if (response.ok){
        const data = await response.json
        data.forEach((field) => {
          // console.log(field)
          if (addMarkers) {
            map.addLayer(L.marker([field.latitude,field.longitude]))
          }
          this.markers.push(field)
        })
      }
  }

  // Function will take in all selected markers and populate them as locations in the database only then will the new 
  // endpoint will be hit that will automatically create the new optimized path (need to decide what this needs to be 
  // at first, will process need a data structure for the path points to be passed in)
  async SetPathLocations() {

  }

  // Cancel function that will enable at any moment to remove all markers and all listed makers in array 
  ClearAllLocations(map, layer) {
    layer.eachLayer(field => {
      layer.removeLayer(field)
    })
  }
  // Edit the current option? How would that work
}