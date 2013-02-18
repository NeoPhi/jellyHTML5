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

  function addIfMissing(src, dest) {
    src.forEach(function(object) {
      if (dest.indexOf(object) === -1) {
        dest.push(object);
      }
    });
  }

  function canMove(object, dx, dy) {
    var objectsToTest = [object];
    var objectsToMove = [object];
    while (objectsToTest.length > 0) {
      var objectToTest = objectsToTest.pop();
      if (!objectToTest.movable) {
        return [];
      }
      var targetCoordinates = objectToTest.targetCoordinates(dx, dy);
      var hits = collidesWith(targetCoordinates, objectToTest);
      addIfMissing(hits, objectsToTest);
      addIfMissing(hits, objectsToMove);
    }
    return objectsToMove;
  }

  function move(object, dx, dy) {
    var objectsToMove = canMove(object, dx, dy);
    if (objectsToMove.length === 0) {
      return false;
    }
    objectsToMove.forEach(function(object) {
      object.move(dx, dy);
    });
    return true;
  }

  return {
    addObject: addObject,
    move: move
  };
}

function createJelly(x, y) {
  var coordinates = [];

  function addCoordinates(x, y) {
    coordinates.push({
      x: x,
      y: y
    });
  }

  function targetCoordinates(dx, dy) {
    return transposeCoordinates(coordinates, dx, dy);
  }

  function collides(testCoordinates) {
    return overlappingCoordinates(coordinates, testCoordinates);
  }

  function move(dx, dy) {
    coordinates = transposeCoordinates(coordinates, dx, dy);
  }

  addCoordinates(x, y);
  return {
    addCoordinates: addCoordinates,
    targetCoordinates: targetCoordinates,
    movable: true,
    move: move,
    collides: collides
  };
}

function createWall(x, y) {
  var coordinates = [{
    x: x,
    y: y
  }];

  function collides(testCoordinates) {
    return overlappingCoordinates(coordinates, testCoordinates);
  }

  return {
    movable: false,
    collides: collides
  };
}

module.exports.createGameBoard = createGameBoard;
module.exports.createJelly = createJelly;
module.exports.createWall = createWall;

