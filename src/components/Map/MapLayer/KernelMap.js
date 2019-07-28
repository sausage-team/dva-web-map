require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class KernelMap {
    constructor(map, data) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this);
        this.dataUrl = iserverBasePath;
    }
    MapLayData(data) {

    }
    addMapLay(data, value) {
        let url = 'http://localhost:8090/iserver/services/spatialAnalysis-mtgdata/restjsr/spatialanalyst';
        var geoBufferAnalystParams = new SuperMap.DensityKernelAnalystParameters({
            dataset: '路网分析_道路@data',
            searchRadius: 10,
            resultGridName: 'densityData',
            fieldName: 'CASE_NUM',
            deleteExistResultDataset: true
        });
        new mapboxgl.supermap.SpatialAnalystService(url).densityAnalysis(geoBufferAnalystParams, (serviceResult) => {
            console.log(serviceResult)
            let mathExpressionAnalysisResult = serviceResult.result;
            //let themeService = new SuperMap.Theme('raster');

            let themeService = new mapboxgl.supermap.ThemeService('http://localhost:8090/iserver/services/map-mvt-mapdark/rest/maps/mapdark');
            var themeGridRangeIteme1 = new SuperMap.ThemeGridRangeItem({
                start: 0,
                end: 650,
                color: new SuperMap.ServerColor(40, 140, 40)
            }),
                themeGridRangeIteme2 = new SuperMap.ThemeGridRangeItem({
                    start: 650,
                    end: 750,
                    color: new SuperMap.ServerColor(170, 198, 40)
                }),
                themeGridRangeIteme3 = new SuperMap.ThemeGridRangeItem({
                    start: 750,
                    end: 900,
                    color: new SuperMap.ServerColor(191, 191, 0)
                }),
                themeGridRangeIteme4 = new SuperMap.ThemeGridRangeItem({
                    start: 900,
                    end: 1350,
                    color: new SuperMap.ServerColor(191, 95, 0)
                }),
                themeGridRangeIteme5 = new SuperMap.ThemeGridRangeItem({
                    start: 1350,
                    end: 3600,
                    color: new SuperMap.ServerColor(127, 0, 0)
                });
            let themeGridRange = new SuperMap.ThemeGridRange({
                reverseColor: false,
                rangeMode: SuperMap.RangeMode.EQUALINTERVAL,
                //栅格分段专题图子项数组
                items: [themeGridRangeIteme1,
                    themeGridRangeIteme2,
                    themeGridRangeIteme3,
                    themeGridRangeIteme4,
                    themeGridRangeIteme5
                ]
            });
            let themeParameters = new SuperMap.ThemeParameters({
                //制作专题图的数据集
                datasetNames: [mathExpressionAnalysisResult.dataset.split('@')[0]],
                dataSourceNames: [mathExpressionAnalysisResult.dataset.split('@')[1]],
                joinItems: null,
                themes: [themeGridRange]
            });
            themeService.getThemeInfo(themeParameters, (serviceResult1) => {
                var result = serviceResult1.result;
                console.log(serviceResult1)
                if (result && result.newResourceID) {
                    this.map.addLayer({
                        "id": "themeLayer",
                        "type": "raster",
                        "source": {
                            "type": "raster",
                            "tiles": ["http://localhost:8090/iserver/services/map-mvt-mapdark/rest/maps/mapdark/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true&z={z}&x={x}&y={y}&transparent=true&cacheEnabled=false&layersID=" + result.newResourceID],
                            "tileSize": 256
                        },
                        "minzoom": 11,
                        "maxzoom": 18
                    });
                }
            });
        });
    }
    showAnalysisResult_ThemeGridRange() {

    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 365], ["<=", "time", time + 365]]
        this.map.setFilter('KernelMap', filters);
    }
    removeMapLay() {
        if (this.map.getLayer("KernelMap")) {
            this.map.removeLayer("KernelMap");
            this.map.removeSource("KernelMap");
        }
    }
}
export default KernelMap;
