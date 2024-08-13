/*import Map from 'ol/Map.js';*/
import 'ol/ol.css';
import Overlay from 'ol/Overlay';
/*import View from 'ol/View'; no more needed*/
import {toStringHDMS} from 'ol/coordinate';
/*import TileLayer from 'ol/layer/Tile'; no more needed*/
import {toLonLat} from 'ol/proj';
/*import TileJSON from 'ol/source/TileJSON'; no more needed*/
import {getLayerByName} from './Scripts/customFunctions.js'; 
/*import XYZ from 'ol/source/XYZ.js';*/


/*var key = 'Your Mapbox access token from https://mapbox.com/ here'; not used*/

const map=$('#map').data('map');


/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const key = 'Get your own API key at https://www.maptiler.com/cloud/';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

map.addOverlay(overlay);
/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));


  //Getting the Layer Source: Getting the layer itself, and then getting its source
  //Create a function to get the layer by name

// Get the layer by its name

const parcelsLayer=getLayerByName('Parcels');
const parcelsSource=parcelsLayer.getSource();

const buildingsLayer=getLayerByName('Buildings');
const buildingsSource=buildingsLayer.getSource();

const view=map.getView();
const resolution=view.getResolution();
const projection=view.getProjection();

const parcelInfo=$('#parcel-info');
parcelInfo.html('');

const buildingInfo=$('#building-info');
buildingInfo.html('');

const noFeatures=$('#no-features');
noFeatures.html('<p>No features</p>');


const parcelUrl=parcelsSource.getFeatureInfoUrl(coordinate,resolution,projection,
    {'INFO_FORMAT':'application/json'});


    
const buildinglUrl=buildingsSource.getFeatureInfoUrl(coordinate,resolution,projection,
    {'INFO_FORMAT':'application/json'});


if(parcelUrl)
{
    debugger;
    $.ajax({
        url:parcelUrl,
        method: 'GET',
        success:function(result){
          console.log('this is the result from db ',result.features);
                const parcel=result.features[0];
                //console.log('this one parcel',parcel);
            if(parcel){
                const parcelNumber=parcel.properties.parcel_n;
                const blockNumber=parcel.properties.block_n;
               // const parcelArea=parcel.properties.shape_area;
                const parcelArea=parcel.properties.share_area;

                parcelInfo.html(`<h5>Parcel Info</h5>
                       <p>Block Number: ${blockNumber}</p> 
                   <p>Parcel Number: ${parcelNumber}</p>
                       <p>Area (sqm): ${parcelArea.toFixed(2)}</p>`)

                        noFeatures.html('');
                }
        }

    
    })
}


if(buildinglUrl)
    {
        $.ajax({
            url:buildinglUrl,
            method: 'GET',
            success:function(result){
               console.log('this is the result from db ',result.features);
                    const building=result.features[0];
                   // console.log('this one building',building);
                if(building){    
                    const buildingNumber=building.properties.building_n;
                    const buildingArea=building.properties.shape_area;

                    buildingInfo.html(`<h5>Building Info</h5>
                         <p>Building Number: ${buildingNumber}</p>
                        <p>Area (sqm): ${buildingArea.toFixed(2)}</p>`)
    
                        noFeatures.html('');
                    }
    
            }
    
        
        })
    }

  
  
    /* content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';*/
    overlay.setPosition(coordinate); 
 

 
});
