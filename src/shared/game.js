var WALL = 'wall';
var JELLY = 'jelly';

// TODO Rework API, tie everything to game board instead of having
// separate objects and instead expose create/update methods on
// game board directly
function transposeCoordinates(coordinates, dx, dy) {
  return coordinates.map(function(coordinates) {
    return {
      x: coordinates.x + dx,
      y: coordinates.y + dy,
      spawn: coordinates.spawn
    };
  });
}

function overlappingCoordinates(src, dest) {
  return dest.some(function(destCoordinates) {
    return src.some(function(srcCoordinates) {
      return ((destCoordinates.x === srcCoordinates.x) && (destCoordinates.y === srcCoordinates.y));
    });
  });
}

function addIfMissing(src, dest) {
  src.forEach(function(object) {
    if (dest.indexOf(object) === -1) {
      dest.push(object);
    }
  });
}

function createCoordinates(x, y) {
  return {
    x: x,
    y: y,
    spawn: {
    }
  };
}

function createJelly(color, family) {
  var jelly;

  function addCoordinates(coordinates) {
    jelly.coordinates.push(coordinates);
  }

  function affected() {
    var result = jelly.attachments.slice(0);
    result.push(jelly);
    return result;
  }

  function attach(object, notify) {
    addIfMissing([object], jelly.attachments);
    if (notify) {
      object.attach(jelly, false);
    }
  }

  function updateAttachment(oldObject, newObject) {
    var attachments = [];
    jelly.attachments.forEach(function(attachment) {
      if (oldObject === attachment) {
        addIfMissing([newObject], attachments);
      } else {
        addIfMissing([attachment], attachments);
      }
    });
    jelly.attachments = attachments;
  }

  function targetCoordinates(dx, dy) {
    return transposeCoordinates(jelly.coordinates, dx, dy);
  }

  function collides(testCoordinates) {
    return overlappingCoordinates(jelly.coordinates, testCoordinates);
  }

  function merges(object, testCoordinates) {
    if (object.family !== jelly.family) {
      return false;
    }
    return collides(testCoordinates);
  }

  function merge(object) {
    object.coordinates.forEach(function(coordinates) {
      addCoordinates(coordinates);
    });
    addIfMissing(object.attachments, jelly.attachments);
    object.attachments.forEach(function(attachment) {
      // TODO add unit test around need for this check
      if (attachment.updateAttachment) {
        attachment.updateAttachment(object, jelly);
      }
    });
  }

  function mergable() {
    return true;
  }

  function move(dx, dy) {
    jelly.coordinates = transposeCoordinates(jelly.coordinates, dx, dy);
  }

  function movable() {
    return true;
  }

  jelly = {
    type: JELLY,
    coordinates: [],
    attachments: [],
    affected: affected,
    attach: attach,
    updateAttachment: updateAttachment,
    addCoordinates: addCoordinates,
    targetCoordinates: targetCoordinates,
    movable: movable,
    move: move,
    collides: collides,
    color: color,
    family: family,
    mergable: mergable,
    merge: merge,
    merges: merges
  };

  return jelly;
}

function createWall() {
  var wall;

  function addCoordinates(coordinates) {
    wall.coordinates.push(coordinates);
  }

  function collides(testCoordinates) {
    return overlappingCoordinates(wall.coordinates, testCoordinates);
  }

  function movable() {
    return false;
  }

  function mergable() {
    return false;
  }

  wall = {
    type: WALL,
    color: 'x',
    movable: movable,
    collides: collides,
    mergable: mergable,
    coordinates: [],
    addCoordinates: addCoordinates
  };

  return wall;
}

// Layout specification:
// Array of strings of elements
// Each element is two characters:
// First is type:
//   r,g,b,y are mergable jellies
//   0-9 is an unmergable jelly
//   x is a wall
//   space is an open space
// Second is control:
//   for r,g,b,y it is either blank or t,l,b,r to indicate fixed to direction
//   for 0-9,x it is either blank or r,g,b,y to indicate spawn color (capatilize to spawn fixed)
function createGameBoard(layout) {
  var objects = [];

  function addObject(object) {
    objects.push(object);
  }

  function collidesWith(coordinates, excludeObject) {
    var collides = [];
    objects.forEach(function(object) {
      if (object === excludeObject) {
        return;
      }
      if (object.collides(coordinates)) {
        collides.push(object);
      }
    });
    return collides;
  }

  function canMove(object, dx, dy) {
    var objectsToTest = [object];
    var objectsToMove = [];
    var objectsTested = [];
    while (objectsToTest.length > 0) {
      var objectToTest = objectsToTest.pop();
      if (!objectToTest.movable()) {
        return [];
      }
      if (objectsTested.indexOf(objectToTest) !== -1) {
        continue;
      }
      objectsTested.push(objectToTest);
      var affected = objectToTest.affected();
      addIfMissing(affected, objectsToTest);
      addIfMissing(affected, objectsToMove);
      var targetCoordinates = objectToTest.targetCoordinates(dx, dy);
      var hits = collidesWith(targetCoordinates, objectToTest);
      addIfMissing(hits, objectsToTest);
      addIfMissing(hits, objectsToMove);
    }
    return objectsToMove;
  }

  function moveObjects(objects, dx, dy) {
    objects.forEach(function(object) {
      object.move(dx, dy);
    });
  }

  function gravityAll(movedObjects) {
    var movableObjects = objects.filter(function(object) {
      return object.movable();
    });
    movableObjects.forEach(function(object) {
      var objectsToMove;
      do {
        objectsToMove = canMove(object, 0, 1);
        moveObjects(objectsToMove, 0, 1);
        addIfMissing(objectsToMove, movedObjects);
      } while(objectsToMove.length !== 0);
    });
  }

  function removeMergedObjects(mergableObjects, objectsToMerge) {
    return mergableObjects.filter(function(object) {
      return (objectsToMerge.indexOf(object) === -1);
    });
  }

  function mergeObjects(objects, mergeInto) {
    objects.forEach(function(object) {
      mergeInto.merge(object);
    });
  }

  function canMerge(mergableObjects, index) {
    var objectsToMerge = [];
    var object = mergableObjects[index];
    [{
      x: -1,
      y: 0
    }, {
      x: 1,
      y: 0
    }, {
      x: 0,
      y: -1
    }, {
      x: 0,
      y: 1
    }].forEach(function(delta) {
      var targetCoordinates = object.targetCoordinates(delta.x, delta.y);
      for (var i = index + 1; i < mergableObjects.length; i+= 1) {
        var targetObject = mergableObjects[i];
        if (targetObject.merges(object, targetCoordinates)) {
          objectsToMerge.push(targetObject);
        }
      }
    });
    return objectsToMerge;
  }

  function mergeAll() {
    var mergableObjects = objects.filter(function(object) {
      return object.mergable();
    });
    var i = 0;
    while (i < mergableObjects.length) {
      var object = mergableObjects[i];
      var objectsToMerge = canMerge(mergableObjects, i);
      if (objectsToMerge.length > 0) {
        mergeObjects(objectsToMerge, object);
        mergableObjects = removeMergedObjects(mergableObjects, objectsToMerge);
        objects = removeMergedObjects(objects, objectsToMerge);
      } else {
        i += 1;
      }
    }
  }

  // TODO: Optimize
  // TODO: Multiple spawn points triggering at the same time
  function spawnAll(spawnLocations) {
    var lookup = {};
    var spawners = [];
    objects.forEach(function(object) {
      object.coordinates.forEach(function(coordinates) {
        var position = coordinates.x + ',' + coordinates.y;
        lookup[position] = object;
        if (coordinates.spawn.color) {
          spawners.push({
            object: object,
            coordinates: coordinates
          });
        }
      });
    });
    var spawned = false;
    spawners.forEach(function(spawner) {
      var key = spawner.coordinates.x + ',' + (spawner.coordinates.y - 1);
      var spawn = spawner.coordinates.spawn;
      var ontop = lookup[key];
      if (spawnLocations[key] && ontop && (spawn.color === ontop.color)) {
        var objectsToMove = canMove(ontop, 0, -1);
        if (objectsToMove.length > 0) {
          spawned = true;
          moveObjects(objectsToMove, 0, -1);
          var newJelly = createJelly(spawn.color, spawn.color);
          newJelly.addCoordinates(createCoordinates(spawner.coordinates.x, spawner.coordinates.y - 1));
          addObject(newJelly);
          if (spawn.fixed) {
            newJelly.attach(spawner.object, spawner.object.movable());
          }
          // A spawner goes away once spawned
          spawner.coordinates.spawn = {};
        }
      }
    });
    if (spawned) {
      mergeAll();
    }
  }

  function slide(object, dx) {
    var objectsToMove = canMove(object, dx, 0);
    if (objectsToMove.length === 0) {
      return false;
    }
    moveObjects(objectsToMove, dx, 0);
    gravityAll(objectsToMove);
    var spawnLocations = {};
    objectsToMove.forEach(function(object) {
      object.coordinates.forEach(function(coordinates) {
        spawnLocations[coordinates.x + ',' + coordinates.y] = true;
      });
    });
    mergeAll();
    spawnAll(spawnLocations);
    return true;
  }

  // TODO: Optimize
  function move(x, y, left) {
    var dx = 1;
    if (left) {
      dx = -1;
    }
    var coordinates = [{
      x: x,
      y: y
    }];
    for (var i = 0; i < objects.length; i += 1) {
      var object = objects[i];
      if (!object.collides(coordinates)) {
        continue;
      }
      if (!object.movable()) {
        return false;
      }
      return slide(object, dx);
    }
    return false;
  }

  function postSetup() {
    // Better define this logic
    mergeAll();
    gravityAll();
  }

  function getObjects() {
    return objects;
  }

  function solved() {
    var families = {};
    return getObjects().every(function(object) {
      // TODO optimize
      var noSpawners = object.coordinates.every(function(coordinates) {
        return !coordinates.spawn.hasOwnProperty('color');
      });
      if (!noSpawners) {
        return false;
      }
      if (!object.mergable()) {
        return true;
      }
      if (object.family in families) {
        return false;
      }
      families[object.family] = 1;
      return true;
    });
  }

  function addAttachment(control, x, y, attachments) {
    var dx = 0;
    var dy = 0;
    if (control === 't') {
      dy = -1;
    }
    if (control === 'r') {
      dx = 1;
    }
    if (control === 'b') {
      dy = 1;
    }
    if (control === 'l') {
      dx = -1;
    }
    attachments.push({
      src: x + ',' + y,
      dest: (x + dx) + ',' + (y + dy)
    });
  }
  function purpleJelly(type) {
    var value = parseInt(type, 10);
    return ((value >= 0) && (value <= 9));
  }

  function constructRow(row, y, objectLookup, attachments) {
    var parts = row.split(/(?:)/);
    for (var i = 0; i < parts.length; i += 2) {
      var type = parts[i];
      var control = parts[i + 1];
      var x = Math.floor(i / 2);
      if (type === ' ') {
        continue;
      }
      var object;
      var purple = purpleJelly(type);
      if (purple) {
        object = createJelly('l', type);
      } else if (type === 'x') {
        object = createWall();
      } else {
        object = createJelly(type, type);
      }
      var coordinates = createCoordinates(x, y);
      object.addCoordinates(coordinates);
      addObject(object);
      objectLookup[x + ',' + y] = object;
      if (control === ' ') {
        continue;
      }
      if (purple || (object.type === WALL)) {
        coordinates.spawn.color = control.toLowerCase();
        coordinates.spawn.fixed = (control !== coordinates.spawn.color);
      } else {
        addAttachment(control, x, y, attachments);
      }
    }
  }

  function construct(layout) {
    var attachments = [];
    var objectLookup = {};
    layout.forEach(function(row, y) {
      constructRow(row, y, objectLookup, attachments);
    });
    attachments.forEach(function(attachment) {
      var src = objectLookup[attachment.src];
      var dest = objectLookup[attachment.dest];
      src.attach(dest, dest.movable());
    });
    postSetup();
  }

  construct(layout);

  return {
    move: move,
    getObjects: getObjects,
    solved: solved
  };
}

module.exports.createGameBoard = createGameBoard;
module.exports.WALL = WALL;
module.exports.JELLY = JELLY;
