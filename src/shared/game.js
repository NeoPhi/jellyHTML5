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
      spawners: coordinates.spawners,
      attachments: coordinates.attachments
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
    spawners: [],
    attachments: []
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

  function gravityAll() {
    var movableObjects = objects.filter(function(object) {
      return object.movable();
    });
    movableObjects.forEach(function(object) {
      var objectsToMove;
      do {
        objectsToMove = canMove(object, 0, 1);
        moveObjects(objectsToMove, 0, 1);
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
  function spawnAll() {
    var lookup = {};
    var targets = [];
    objects.forEach(function(object) {
      object.coordinates.forEach(function(coordinates) {
        var position = coordinates.x + ',' + coordinates.y;
        lookup[position] = object;
        coordinates.spawners.forEach(function(spawner) {
          if (spawner.activated) {
            return;
          }
          targets.push({
            object: object,
            coordinates: coordinates,
            spawner: spawner
          });
        });
      });
    });

    // Only loop until the first viable spawner is found
    for (var i = 0; i < targets.length; i += 1) {
      var target = targets[i];
      var object = target.object;
      var coordinates = target.coordinates;
      var spawner = target.spawner;

      var newX = coordinates.x + spawner.dx;
      var newY = coordinates.y + spawner.dy;
      var key = newX + ',' + newY;
      var destination = lookup[key];
      if (destination && (spawner.color === destination.color)) {
        var dx = spawner.dx;
        var dy = spawner.dy;
        var objectsToMove = canMove(destination, dx, dy);
        // Try moving the spawner instead
        if (objectsToMove.length === 0) {
          dx *= -1;
          dy *= -1;
          newX = coordinates.x;
          newY = coordinates.y;
          objectsToMove = canMove(object, dx, dy);
        }
        if (objectsToMove.length > 0) {
          moveObjects(objectsToMove, dx, dy);
          var newJelly = createJelly(spawner.color, spawner.color);
          newJelly.addCoordinates(createCoordinates(newX, newY));
          addObject(newJelly);
          if (spawner.fixed) {
            newJelly.attach(object, object.movable());
          }
          // A spawner goes away once spawned
          spawner.activated = true;
          return true;
        }
      }
    }
    return false;
  }

  function slide(object, dx) {
    var objectsToMove = canMove(object, dx, 0);
    if (objectsToMove.length === 0) {
      return false;
    }
    moveObjects(objectsToMove, dx, 0);
    gravityAll(objectsToMove);
    var spawned;
    do {
      mergeAll();
      spawned = spawnAll();
    } while(spawned);
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
      var activated = object.coordinates.every(function(coordinates) {
        return coordinates.spawners.every(function(spawner) {
          return spawner.activated;
        });
      });
      if (!activated) {
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

  function purpleJelly(type) {
    var value = parseInt(type, 10);
    return ((value >= 0) && (value <= 9));
  }

  var DIRECTIONS = {
    top: {
      dx: 0,
      dy: -1
    },
    right: {
      dx: 1,
      dy: 0
    },
    bottom: {
      dx: 0,
      dy: 1
    },
    left: {
      dx: -1,
      dy: 0
    }
  };

  var SPAWN_COLORS = {
    r: true,
    g: true,
    b: true,
    y: true
  };

  function addOptions(options, coordinates) {
    for (var direction in DIRECTIONS) {
      if (DIRECTIONS.hasOwnProperty(direction)) {
        var deltas = DIRECTIONS[direction];
        var option = options[direction];
        if (option === ' ') {
          continue;
        }
        if (option === 'a') {
          coordinates.attachments.push({
            direction: direction,
            dx: deltas.dx,
            dy: deltas.dy
          });
          continue;
        }
        if (SPAWN_COLORS[option.toLowerCase()]) {
          coordinates.spawners.push({
            direction: direction,
            dx: deltas.dx,
            dy: deltas.dy,
            color: option.toLowerCase(),
            fixed: option !== option.toLowerCase()
          });
        }
      }
    }
  }

  function createObject(type) {
    if (purpleJelly(type)) {
      return createJelly('l', type);
    }
    if (type === 'x') {
      return createWall();
    }
    return createJelly(type, type);
  }

  function constructGridRow(y, top, middle, bottom) {
    var topParts = top.split(/(?:)/);
    var middleParts = middle.split(/(?:)/);
    var bottomParts = bottom.split(/(?:)/);
    var numberOfColumns = middleParts.length / 3;
    var gridRow = [];
    for (var x = 0; x < numberOfColumns; x += 1) {
      var offset = x * 3;
      var type = middleParts[offset + 1];
      if (type === ' ') {
        continue;
      }

      var object = createObject(type, x, y);
      addObject(object);
      gridRow[x] = object;

      var coordinates = createCoordinates(x, y);
      object.addCoordinates(coordinates);

      addOptions({
        top: topParts[offset + 1],
        right: middleParts[offset + 2],
        bottom: bottomParts[offset + 1],
        left: middleParts[offset]
      }, coordinates);
    }
    return gridRow;
  }

  function construct(layout) {
    var grid = [];
    var numberOfRows = layout.length / 3;
    for (var y = 0; y < numberOfRows; y += 1) {
      var offset = y * 3;
      grid.push(constructGridRow(y, layout[offset], layout[offset + 1], layout[offset + 2], grid));
    }
    objects.forEach(function(object) {
      object.coordinates.forEach(function(coordinates) {
        coordinates.attachments.forEach(function(attachment) {
          var dest = grid[coordinates.y + attachment.dy][coordinates.x + attachment.dx];
          object.attach(dest, dest.movable());
        });
      });
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
