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
    while (objectsToTest.length > 0) {
      var objectToTest = objectsToTest.pop();
      if (!objectToTest.movable()) {
        return [];
      }
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

  function gravity(objects) {
    objects.forEach(function(object) {
      var objectsToMove;
      do {
        objectsToMove = canMove(object, 0, 1);
        moveObjects(objectsToMove, 0, 1);
      } while(objectsToMove.length !== 0);
    });
  }

  function slide(object, dx) {
    var objectsToMove = canMove(object, dx, 0);
    moveObjects(objectsToMove, dx, 0);
    gravity(objectsToMove);
    return (objectsToMove.length !== 0);
  }

  function slideLeft(object) {
    return slide(object, -1, 0);
  }

  function slideRight(object) {
    return slide(object, 1, 0);
  }

  return {
    addObject: addObject,
    slideLeft: slideLeft,
    slideRight: slideRight
  };
}

function createJelly(x, y) {
  var jelly;

  var coordinates = [];
  var attachments = [];

  function addCoordinates(x, y) {
    coordinates.push({
      x: x,
      y: y
    });
  }

  function affected() {
    var result = attachments.slice(0);
    result.push(jelly);
    return result;
  }

  function attach(object, notify) {
    attachments.push(object);
    if (notify) {
      object.attach(jelly, false);
    }
  }

  function targetCoordinates(dx, dy) {
    return transposeCoordinates(coordinates, dx, dy);
  }

  function matches(testCoordinates) {
    if (testCoordinates.length !== coordinates.length) {
      return false;
    }
    var lookup = {};
    coordinates.forEach(function(coordinates) {
      lookup[coordinates.x + ':' + coordinates.y] = true;
    });
    var hits = 0;
    testCoordinates.forEach(function(coordinates) {
      if (lookup[coordinates.x + ':' + coordinates.y]) {
        hits += 1;
      }
    });
    return (hits === coordinates.length);
  }

  function collides(testCoordinates) {
    return overlappingCoordinates(coordinates, testCoordinates);
  }

  function move(dx, dy) {
    coordinates = transposeCoordinates(coordinates, dx, dy);
  }

  function movable() {
    return true;
  }

  addCoordinates(x, y);
  jelly = {
    affected: affected,
    attach: attach,
    addCoordinates: addCoordinates,
    targetCoordinates: targetCoordinates,
    matches: matches,
    movable: movable,
    move: move,
    collides: collides
  };
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

  return {
    movable: movable,
    collides: collides
  };
}

module.exports.createGameBoard = createGameBoard;
module.exports.createJelly = createJelly;
module.exports.createWall = createWall;

