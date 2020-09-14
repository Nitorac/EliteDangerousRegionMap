The primary function of these scripts and classes is to take a set of coordinates and determine which Elite Dangerous codex region they are in.

Each implementation has a `main()` entrypoint which takes one or more system names as command-line arguments, which are looked up using EDSM, and their region and the region of their boxel (if different) are output.

Each implements a `findRegion(x, y, z)` function / method, and a `findRegionsForSystems(sysname)` function / method.

## Functions

`findRegion(x, y, z)`

This takes a set of coordinates and determine which Elite Dangerous codex region they are in.

`findRegionsForSystems(sysname)`

This takes a system name, looks it up on EDSM, and returns details on which region each of the returned systems is in.

## Implementations
### Python

The functions are implemented in `RegionMap.py`

### C#

The methods are implemented in the `EliteDangerousRegionMap.RegionMap` static class in `RegionMap.cs`

### Javascript

The functions are exported by the `RegionMap.js` CommonJS module

# Background

There are 42 regions in a 93 segment by 30 ring polar grid.

By probing the edges of the regions (using the region name displayed when jumping between systems), it has been determined that the actual region map is on a 49.3494ly grid (essentially 4096 / 83 ly).

The region name displayed when jumping between systems is the region at the coordinates the system being jumped to are at.

The region name in the galaxy map is the name of the region at the 0/0/0 corner of the 10 ly (A) boxel the cursor is in.

The region name written to the journal and shown on the main page of the codex is the region at the 0/0/0 corner of the system's boxel.

The regions were mapped by following the edges of the regions on the galaxy map (taking into account that the galaxy map is accurate to 10ly).

# Files

`RegionMap.svg` has the region bounds as determined by mapping their edges.

`RegionMap.png` is a grayscale map of the regions, with #000000 being outside the map, #A8A8A8 being region 1 (Galactic Centre), going down in steps of #040404, down to region 42 (The Void) which is #040404.

`RegionMapData.py` was generated from `RegionMap.png` using `RegionMap-datagen.py` - it contains (length,region) tuples of the run-length encoded data, with the rows going from bottom (minimum Z) to top.
