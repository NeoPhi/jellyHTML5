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

  function moveObjects(objects, dx, dy) {
    objects.forEach(function(object) {
      object.move(dx, dy);
    });
  }

  function fallObjects(objects) {
    objects.forEach(function(object) {
      var objectsToMove;
      do {
        objectsToMove = canMove(object, 0, 1);
        moveObjects(objectsToMove, 0, 1);
      } while(objectsToMove.length !== 0);
    });
  }

  function move(object, dx, dy) {
    var objectsToMove = canMove(object, dx, dy);
    moveObjects(objectsToMove, dx, dy);
    fallObjects(objectsToMove);
    return (objectsToMove.length !== 0);
  }

  function moveLeft(object) {
    return move(object, -1, 0);
  }

  function moveRight(object) {
    return move(object, 1, 0);
  }

  return {
    addObject: addObject,
    moveLeft: moveLeft,
    moveRight: moveRight
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

