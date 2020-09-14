'use strict';

const crossfetch = require('cross-fetch');
const regionmapdata = require('./RegionMapData.json');
const regions = regionmapdata.regions;
const regionmap = regionmapdata.regionmap;

const x0 = -49985;
const y0 = -40985;
const z0 = -24105;

function findRegion(x, y, z){
    let px = Math.floor((x - x0) * 83 / 4096);
    let pz = Math.floor((z - z0) * 83 / 4096);

    if (px < 0 || pz < 0 || pz > regionmap.length){
        return null;
    } else {
        let row = regionmap[pz];
        let rx = 0;
        let pv = 0;

        for (var v of row) {
            let rl = v[0];
            if (px < rx + rl){
                pv = v[1];
                break;
            } else {
                rx += rl;
            }
        }

        if (pv == 0){
            return { id: 0, name: null };
        } else {
            return { id: pv, name: regions[pv] };
        }
    }
}

async function findRegionsForSystems(sysname){
    const response = await crossfetch.fetch('https://www.edsm.net/api-v1/systems?systemName=' + encodeURIComponent(sysname) + '&coords=1&showId=1');
    const systems = await response.json();
    return systems.map(system => {
        let systemdata = {
            name: system.name,
            id64: system.id64
        };

        if (system.coords) {
            let x = system.coords.x;
            let y = system.coords.y;
            let z = system.coords.z;
            systemdata.x = x;
            systemdata.y = y;
            systemdata.z = z;

            systemdata.region = findRegion(x, y, z);
        }

        if (system.id64) {
            let masscode = system.id64 & 7;
            let x = (((system.id64 >> (30 - masscode * 2)) & (16383 >> masscode)) << masscode) * 10 + x0;
            let y = (((system.id64 >> (17 - masscode)) & (8191 >> masscode)) << masscode) * 10 + y0;
            let z = (((system.id64 >> 3) & (16383 >> masscode)) << masscode) * 10 + z0;

            systemdata.boxel = {
                x: x,
                y: y,
                z: z,
                region: findRegion(x, y, z)
            };
        }

        return systemdata;
    });
}

module.exports.findRegion = findRegion;
module.exports.findRegionsForSystems = findRegionsForSystems;