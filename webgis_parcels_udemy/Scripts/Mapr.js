import 'ol/ol.css';
import {Map,View} from 'ol/';
//import TileLayer from 'ol/layer/Tile' Used at start of the training;
//import OSM from 'ol/source/OSM';
import {Image as ImageLayer} from 'ol/layer';
import ImageWMS from'ol/source/ImageWMS';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import Projection from 'ol/proj/Projection';


const serverUrl="http://localhost:8080/geoserver/wms";

const mapProjection=new Projection ({

    code: 'EPSG:32632',
    //code: 'EPSG:28191',
    units: 'm', 
    axisOrientation: 'neu',
    global:false
});
  

// Definition of the orthophoto source
const orthophotoSource=new TileWMS ({ 
    url: serverUrl,
    //params:{"LAYERS":"Training:orthophoto", "VERSION":"1.1.1", "FORMAT":"image/jpeg" }
    params:{"LAYERS":"Training:orthophot", "VERSION":"1.1.1", "FORMAT":"image/jpeg" }
});

// calling the orthophoto layer
const orthophotoLayer=new TileLayer ({
    source:orthophotoSource, 
    // @ts-ignore
    name: 'Orthophoto'
});
 
// Definition of the parcel layer

const parcelsSource=new ImageWMS({
    url: serverUrl,
    //params:{"LAYERS":"Training:Parcels", "VERSION":"1.1.1", "FORMAT":"image/png" }
    params:{"LAYERS":"Training:parcel1", "VERSION":"1.1.1", "FORMAT":"image/png" }

});
// calling the Parcels layer
const parcelsLayer=new ImageLayer({
    source:parcelsSource, 
    name: 'Parcels'
});


// Definition of the building laye


const BuildingsSource=new ImageWMS({
    url: serverUrl,
    //params:{"LAYERS":"Training:Buildings", "VERSION":"1.1.1", "FORMAT":"image/png" }
    params:{"LAYERS":"Training:Building", "VERSION":"1.1.1", "FORMAT":"image/png" }
});

// Calling the Building Layer
const BuildingsLayer=new ImageLayer ({
    source:BuildingsSource,
    name: 'Buildings'
});

/*const osmLayer=new TileLayer({
    source:new OSM
}); */

const view= new View({
    //extent: [165217.233, 151185.7259,172973.3239, 155713.6059],
    //center: [168540,153370],
    extent: [526590.2218252672, 459028.8116037153,528608.1761278327, 459748.55362365395],
    center: [527655.4,459442.5],
    zoom:0,
    projection:mapProjection
});
const map=new Map ({

target:"map",
layers:[orthophotoLayer, parcelsLayer, BuildingsLayer],
view:view


})

$('#map').data('map',map);