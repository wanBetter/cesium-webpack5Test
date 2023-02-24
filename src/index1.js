import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { OSM, Vector as VectorSource, XYZ } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import proj4Tool from 'proj4'
import { register } from 'ol/proj/proj4';
import shp from './shp';


const viewer = new Viewer("cesiumContainer");
const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: 'red', width: 1 }),
});

const styles = {
  'Point': new Style({
    image: image,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiPoint': new Style({
    image: image,
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)',
    }),
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2,
    }),
    fill: new Fill({
      color: 'magenta',
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta',
      }),
    }),
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
  }),
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};
function defineExtarProject () {

  proj4Tool.defs([
    [
      'EPSG:4543',
      '+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
    ],
    [
      'EPSG:4546',
      '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs'
    ],
    [
      'EPSG:4542',
      '+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
    ],
    [
      'EPSG:26713',
      '+proj=utm +zone=13 +ellps=clrk66 +datum=NAD27 +units=m +no_defs'
    ]
  ]);
  register(proj4Tool);
}
defineExtarProject();
// const vectorSource = new VectorSource({
//   features: new GeoJSON().readFeatures(geojsonObject),
// });
let reg = '(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<town>[^区]+区|.+镇)?(?<village>.*)'

let str = '内蒙古自治区通辽市扎鲁特旗'
str.match(reg)

/* [
    "内蒙古自治区通辽市扎鲁特旗",
    "内蒙古自治区",
    "通辽市",
    "扎鲁特旗",
    null,
    ""
] */

str = '天津市/市辖区/河东区/北斗大厦'
let str1 = str.match(reg)
console.log(str1);



const mapGeoJson = new Map({
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'http://t{4-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=bcd146f55a3d95f0265607886fdc9802'
      })
    }
    ),
    new TileLayer({
      source: new XYZ({
        url: 'http://t{4-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=c96efe76d453095433f941beb574e921'
      }),
    }),

  ],
  target: 'map',
  view: new View({
    center: [435378.107, 3483718.980],
    zoom: 10,
    projection: 'EPSG:4546'
  }),
  // controls: 
});
//方法1
//vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));
// shp("http://localhost:8091/waterCopy").then(function (geojson) {
//   //do something with your geojson
//   //console.log(geojson)
//   const vectorSource = new VectorSource({
//     features: new GeoJSON().readFeatures(geojson),
//   });
//   const vectorLayerShpFile = new VectorLayer({
//     source: vectorSource,
//     style: styleFunction,
//   });
//   mapGeoJson.addLayer(vectorLayerShpFile);
// });
//方法二

// shp("http://localhost:8091/waterCopy.zip").then(function (geojson) {
//   const vectorSource = new VectorSource({
//     features: new GeoJSON().readFeatures(geojson),
//   });
//   const vectorLayerShpFile = new VectorLayer({
//     source: vectorSource,
//     style: styleFunction,
//   });
//   mapGeoJson.addLayer(vectorLayerShpFile);
// });
var shpArrayBuffer;
$("#shpFileOpen").on("change", async function () {
  let file = this.files[0];
  let fr = new FileReader();
  fr.readAsArrayBuffer(file);
  fr.onload = async () => {
    shpArrayBuffer = fr.result;
    let geoshpJson = await shp(shpArrayBuffer);
    console.log(geoshpJson);
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoshpJson),
    });
    const vectorLayerShpFile = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });
    mapGeoJson.addLayer(vectorLayerShpFile);
  };

});



var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(6),//获取位置
  projection: 'EPSG:4546',
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'), //将位置数据放到那里
  undefinedHTML: '&nbsp'
});
mapGeoJson.addControl(mousePositionControl);
