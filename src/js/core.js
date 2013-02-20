// TODO Rework API, tie everything to game board instead of having
// separate objects and instead expose create/update methods on
// game board directly
function transposeCoordinates(coordinates, dx, dy) {
  return coordinates.map(function(coordinates) {
    return {
      x: coordinates.x + dx,
      y: coordinates.y + dy
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

function createGameBoard() {
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
    var objectsToTest = object.affected();
    var objectsToMove = object.affected();
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
      return object.mergable();
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

  function slide(object, dx) {
    var objectsToMove = canMove(object, dx, 0);
    moveObjects(objectsToMove, dx, 0);
    gravityAll();
    mergeAll();
    return (objectsToMove.length !== 0);
  }

  function slideLeft(object) {
    return slide(object, -1, 0);
  }

  function slideRight(object) {
    return slide(object, 1, 0);
  }

  function postSetup() {
    gravityAll();
    mergeAll();
  }

  function getObjects() {
    return objects;
  }

  return {
    addObject: addObject,
    slideLeft: slideLeft,
    slideRight: slideRight,
    postSetup: postSetup,
    getObjects: getObjects
  };
}

function createJelly(x, y, color) {
  var jelly;

  function addCoordinates(x, y) {
    jelly.coordinates.push({
      x: x,
      y: y
    });
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

  function matches(testCoordinates) {
    if (testCoordinates.length !== jelly.coordinates.length) {
      return false;
    }
    var lookup = {};
    jelly.coordinates.forEach(function(coordinates) {
      lookup[coordinates.x + ':' + coordinates.y] = true;
    });
    var hits = 0;
    testCoordinates.forEach(function(coordinates) {
      if (lookup[coordinates.x + ':' + coordinates.y]) {
        hits += 1;
      }
    });
    return (hits === jelly.coordinates.length);
  }

  function collides(testCoordinates) {
    return overlappingCoordinates(jelly.coordinates, testCoordinates);
  }

  function merges(object, testCoordinates) {
    if (object.color !== jelly.color) {
      return false;
    }
    return collides(testCoordinates);
  }

  function merge(object) {
    object.coordinates.forEach(function(coordinates) {
      addCoordinates(coordinates.x, coordinates.y);
    });
    addIfMissing(object.attachments, jelly.attachments);
    object.attachments.forEach(function(attachment) {
      attachment.updateAttachment(object, jelly);
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
    coordinates: [],
    attachments: [],
    affected: affected,
    attach: attach,
    updateAttachment: updateAttachment,
    addCoordinates: addCoordinates,
    targetCoordinates: targetCoordinates,
    matches: matches,
    movable: movable,
    move: move,
    collides: collides,
    color: color,
    mergable: mergable,
    merge: merge,
    merges: merges
  };
  addCoordinates(x, y);
  return jelly;
}

function createWall(x, y) {
  var coordinates = [{
    x: x,
    y: y
  }];

  function collides(testCoordinates) {
    return overlappingCoordinates(coordinates, testCoordinates);
  }

  function movable() {
    return false;
  }

  function mergable() {
    return false;
  }

  return {
    movable: movable,
    collides: collides,
    mergable: mergable,
    coordinates: coordinates
  };
}

module.exports.createGameBoard = createGameBoard;
module.exports.createJelly = createJelly;
module.exports.createWall = createWall;

