import { Controller } from "@hotwired/stimulus"
import L from "leaflet"
// import { get, post, destroy } from '@rails/request.js'
// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container", "clear", "submit", "select", "text", "create"]
  static values = {
    pathMarkerId: Number
  }

  markers = new Array()
  map = L.map(this.containerTarget).setView([43.65, -79.38], 13.5)
  layer = L.layerGroup().addTo(this.map)

  initialize() {
    // creation of the first section of the map could first ask the user where they are taking their trip from, then the first
    // few locations could be created based on the view (this could involve smarter start-up, i.e give an option for abandoning
    // the previous trip and starting new with removal of previous locations and etc, this will also need a model rep for the
    // current map center)


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map)

    this.map.on('click', (ev) => {
      this.defineLocation(true, ev.latlng.lat, ev.latlng.lng)
    })
    // console.log(this.select12Target.innerText)

    // move these to just data actions on the targets, unnecessary here
    this.clearTarget.addEventListener('click', () => { this.ClearAllLocations() })
    this.submitTarget.addEventListener('click', () => { this.SetPathLocations() })
    // need to continue to call this here as well for the default 
    this.createTarget.addEventListener('click', () => { this.GetPlaces() })
    // this.selectTarget.addEventListener('click', () => { this.addMarkers})
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
  async defineLocation(initial, lat, lng) {
    // if the marker already exists at that location, within an abs differnce of .0002 lat or long, then remove the marker and hit a delete
    // this currently doesn't work as this needs to be hit every time the overall markers list has been updated, will not need to hit destroy, just need to remove marker
    // potentially make into a function?
    if (Object.values(this.layer._layers).find((field) => this.hasExistingMarker(field, lat, lng)) && initial) {
      this.layer.removeLayer(Object.values(this.layer._layers).find((field) => this.hasExistingMarker(field, lat, lng)))
      this.markers.splice(this.markers.indexOf([lat,lng]),1)
    } else {
      L.marker([lat,lng]).addTo(this.layer)
      this.markers.push([lat,lng])
    }
  }

  hasExistingMarker(field, lat, lng) {
    return (Math.abs(lat - field._latlng.lat) <= 0.0003 && Math.abs(lng - field._latlng.lng) < 0.0003)
  }

  // change this function to refresh the map to show the selected locations (potentially optimized path and markers?) in the grouping the 
  // user selects, make the 
  // On select of a exisiting marker on the map, call function that will remove the marker from the map and the list and then populate marker variable and map
  addMarkers() {
    // get associated locations from path marker selection
    // call ClearAllLocations, then repopulate layer (is there a path here where we reuse defineLocation? yes define another variable that will swap to the else
    // statement immediately)
    console.log("here")
    // const response = await  fetch(`/path_markers/${this.pathMarkerIdValue}`)
    // console.log(response)
  }

  // Function will take in all selected markers and populate them as locations in the database only then will the new 
  // endpoint will be hit that will automatically create the new optimized path (need to decide what this needs to be 
  // at first, will process need a data structure for the path points to be passed in)
  async SetPathLocations() {
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
    this.ClearAllLocations()
    this.textTarget.value = ""
  }

  async createLocation(field, pathMarkerId) {
    // as part of creation need to query for places api to be able to add in the required variables, make the location object here then call it in the request
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
  ClearAllLocations() {
    this.layer.eachLayer(field => {
      this.layer.removeLayer(field)
    })
    this.markers = []
  }

  // method that takes the bounding box of the current map space, defines x many types of spaces on search (based 
  // on searched category) and creates locations for each of them, on default if there is no input to the function 
  // just search for the first x locations on load

  // if the locations already exist then just show exisiting records (requires changes inside of filtering in controller)
  async GetPlaces() {
    const url = `https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=rect%3A-79.43398475646974%2C43.66147641046411%2C-79.32678222656251%2C43.63936736689097&limit=2&apiKey=${RAPID_API_KEY}`
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => { return res.json()})
    .then(async data => { 
      // console.log(data[0].properties.categories)
      // console.log(data[0].properties.datasource.raw['addr:city'])
      console.log(data)
      for (const field of data.features){
        // call function based on
        // await this.createLocation(field, null)
        console.log(field.properties.categories)
        console.log(field.properties.datasource.raw['addr:city'])
      }
    })
  }

  // method that will handle the firing of a selection on a search item, this should be identical to the addMarkers method
  AddToPath() {
    // add marker to the current path using define location
  }

  // Edit the current option? How would that work

}