import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="maps"
export default class extends Controller {
  static targets = ["container"]

  connect() {
    var map = L.map(this.containerTarget).setView([43.39, -79.20], 8.5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }

  disconnect() {
    this.map.remove();
  }
}