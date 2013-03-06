describe('server/lib/levels', function() {
  var levels = require('../../../src/server/lib/levels');
  var Level = require('../../../src/server/models/level').model;
  var Status = require('../../../src/server/models/status').model;
  var verifier = require('../../../src/server/lib/verifier');
  var app;
  var req;
  var res;
  var next;

  beforeEach(function() {
    app = {};
    app.operations = {
      get: {},
      post: {}
    };
    app.get = function(path, fn) {
      app.operations.get[path] = fn;
    };

    app.post = function(path, fn) {
      app.operations.post[path] = fn;
    };

    req = {
      params: {},
      body: {}
    };
    res = {
      send: jasmine.createSpy()
    };
    next = jasmine.createSpy();

    levels.addRoutes(app);
  });

  describe('GET /levels/', function() {
    it('handles error loading levels', function() {
      var error = new Error();
      spyOn(Level, 'find').andCallFake(function(query, callback) {
        callback(error);
      });
      spyOn(Status, 'findForUser').andCallFake(function(user, callback) {
        callback(undefined, []);
      });
      app.operations.get['/levels/'](req, res, next);
      expect(Level.find.callCount).toBe(1);
      expect(Level.find.argsForCall[0][0]).toEqual({});
      expect(next.callCount).toBe(1);
      expect(next.argsForCall[0][0]).toBe(error);
    });

    it('handles no levels', function() {
      spyOn(Level, 'find').andCallFake(function(query, callback) {
        callback(undefined, []);
      });
      spyOn(Status, 'findForUser').andCallFake(function(user, callback) {
        callback(undefined, []);
      });
      app.operations.get['/levels/'](req, res, next);
      expect(Level.find.callCount).toBe(1);
      expect(Level.find.argsForCall[0][0]).toEqual({});
      expect(res.send.callCount).toBe(1);
      expect(res.send.argsForCall[0][0]).toEqual([]);
    });

    it('returns levels', function() {
      var level = new Level();
      spyOn(level, 'toClient').andReturn('LEVEL');
      spyOn(Level, 'find').andCallFake(function(query, callback) {
        callback(undefined, [level]);
      });
      spyOn(Status, 'findForUser').andCallFake(function(user, callback) {
        callback(undefined, []);
      });
      app.operations.get['/levels/'](req, res, next);
      expect(Level.find.callCount).toBe(1);
      expect(Level.find.argsForCall[0][0]).toEqual({});
      expect(res.send.callCount).toBe(1);
      expect(res.send.argsForCall[0][0]).toEqual(['LEVEL']);
    });
  });

  describe('GET /levels/:id', function() {
    it('handles error loading level', function() {
      var error = new Error();
      spyOn(Level, 'findById').andCallFake(function(id, callback) {
        callback(error);
      });
      spyOn(Status, 'findByUserAndLevelId').andCallFake(function(user, levelId, callback) {
        callback();
      });
      req.params.id = '123';
      app.operations.get['/levels/:id'](req, res, next);
      expect(Level.findById.callCount).toBe(1);
      expect(Level.findById.argsForCall[0][0]).toBe(req.params.id);
      expect(next.callCount).toBe(1);
      expect(next.argsForCall[0][0]).toBe(error);
    });

    it('handles no level', function() {
      spyOn(Level, 'findById').andCallFake(function(id, callback) {
        callback();
      });
      spyOn(Status, 'findByUserAndLevelId').andCallFake(function(user, levelId, callback) {
        callback();
      });
      req.params.id = '123';
      app.operations.get['/levels/:id'](req, res, next);
      expect(Level.findById.callCount).toBe(1);
      expect(Level.findById.argsForCall[0][0]).toBe(req.params.id);
      expect(next.callCount).toBe(1);
    });

    it('returns level', function() {
      var level = new Level();
      spyOn(level, 'toClient').andReturn('LEVEL');
      spyOn(Level, 'findById').andCallFake(function(id, callback) {
        callback(undefined, level);
      });
      spyOn(Status, 'findByUserAndLevelId').andCallFake(function(user, levelId, callback) {
        callback();
      });
      req.params.id = '123';
      app.operations.get['/levels/:id'](req, res, next);
      expect(Level.findById.callCount).toBe(1);
      expect(Level.findById.argsForCall[0][0]).toBe(req.params.id);
      expect(level.toClient.callCount).toBe(1);
      expect(level.toClient.argsForCall[0][0]).toBe(false);
      expect(res.send.callCount).toBe(1);
      expect(res.send.argsForCall[0][0]).toBe('LEVEL');
    });
  });

  // TODO add unit tests that show update/create of status object
  describe('POST /levels/:id/verify', function() {
    it('handles verification error', function() {
      var error = new Error();
      var level = new Level({
        layout: JSON.stringify('LAYOUT')
      });
      spyOn(Level, 'findById').andCallFake(function(id, callback) {
        callback(undefined, level);
      });
      spyOn(Status, 'findByUserAndLevelId').andCallFake(function(user, levelId, callback) {
        callback();
      });
      spyOn(verifier, 'check').andCallFake(function(layout, solution, callback) {
        callback(error);
      });
      req.params.id = '123';
      req.body.solution = 'SOLUTION';
      app.operations.post['/levels/:id/verify'](req, res, next);
      expect(verifier.check.callCount).toBe(1);
      expect(verifier.check.argsForCall[0][0]).toBe('LAYOUT');
      expect(verifier.check.argsForCall[0][1]).toBe('SOLUTION');
      expect(next.callCount).toBe(1);
      expect(next.argsForCall[0][0]).toBe(error);
    });

    it('verifies level', function() {
      var level = new Level({
        layout: JSON.stringify('LAYOUT')
      });
      spyOn(Level, 'findById').andCallFake(function(id, callback) {
        callback(undefined, level);
      });
      spyOn(Status, 'findByUserAndLevelId').andCallFake(function(user, levelId, callback) {
        callback();
      });
      spyOn(verifier, 'check').andCallFake(function(layout, solution, callback) {
        callback(undefined, 'CHECKED');
      });
      req.params.id = '123';
      req.body.solution = 'SOLUTION';
      app.operations.post['/levels/:id/verify'](req, res, next);
      expect(verifier.check.callCount).toBe(1);
      expect(verifier.check.argsForCall[0][0]).toBe('LAYOUT');
      expect(verifier.check.argsForCall[0][1]).toBe('SOLUTION');
      expect(res.send.callCount).toBe(1);
      expect(res.send.argsForCall[0][0]).toBe('CHECKED');
    });
  });
});
