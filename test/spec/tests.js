var scope, rootScope, timeout, $compile, ngDragDropService, orderByFilter;

describe('Service: ngDragDropService', function() {
  beforeEach(module('ngDragDrop'));
  beforeEach(inject(function(_ngDragDropService_, _$httpBackend_, $rootScope, _$compile_, $controller, $timeout, $filter) {
    ngDragDropService = _ngDragDropService_;
    $compile = _$compile_;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    timeout = $timeout;
    orderByFilter = $filter('orderBy');
  }));

  it('should move item from list1[0]:placeholderTrue to list2[0]:dummy', function() {
    scope.list1 = [{ 'title': 'Item 1', 'drag': true}];
    scope.list2 = [{}];
    expect(scope.list1.length).toBe(1);
    expect(scope.list2.length).toBe(1);
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list1[0].drag + '" ng-model="list1" jqyoui-draggable="{index: 0, placeholder:true}">' + scope.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="list2" jqyoui-droppable="{index: 0}"></div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush(); // http://goo.gl/XEss1
    expect(scope.list1.length).toBe(1);
    expect(scope.list1[0]).toEqual({});
    expect(scope.list2.length).toBe(1);
    expect(scope.list2[0].title).toBe('Item 1');
  });

  it('should move item from list1[0]:placeholderTrue to list2[0]:nodummy', function() {
    scope.list1 = [{ 'title': 'Item 1', 'drag': true}];
    scope.list2 = [];
    expect(scope.list1.length).toBe(1);
    expect(scope.list2.length).toBe(0);
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list1[0].drag + '" ng-model="list1" jqyoui-draggable="{index: 0, placeholder:true}">' + scope.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="list2" jqyoui-droppable></div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush();
    expect(scope.list1.length).toBe(1);
    expect(scope.list1[0]).toEqual({});
    expect(scope.list2.length).toBe(1);
    expect(scope.list2[0].title).toBe('Item 1');
  });

  it('should move item from list1[0]:placeholderFalse to list2[0]:dummy', function() {
    scope.list1 = [{ 'title': 'Item 1', 'drag': true}];
    scope.list2 = [{}];
    expect(scope.list1.length).toBe(1);
    expect(scope.list2.length).toBe(1);
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list1[0].drag + '" ng-model="list1" jqyoui-draggable="{index: 0}">' + scope.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="list2" jqyoui-droppable="{index: 0}"></div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush();
    expect(scope.list1.length).toBe(0);
    expect(scope.list2.length).toBe(1);
    expect(scope.list2[0].title).toBe('Item 1');
  });

  it('should move item from list1[0]:placeholderFalse to list2[0]:nodummy', function() {
    scope.list1 = [{ 'title': 'Item 1', 'drag': true}];
    scope.list2 = [];
    expect(scope.list1.length).toBe(1);
    expect(scope.list2.length).toBe(0);
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list1[0].drag + '" ng-model="list1" jqyoui-draggable="{index: 0}">' + scope.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="list2" jqyoui-droppable></div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush();
    expect(scope.list1.length).toBe(0);
    expect(scope.list2.length).toBe(1);
    expect(scope.list2[0].title).toBe('Item 1');
  });

  it('should swap items between list1[0] to list2[0]', function() {
    scope.list1 = [{ 'title': 'Item 1', 'drag': true}];
    scope.list2 = [{ 'title': 'Item 2', 'drag': true}];
    expect(scope.list1.length).toBe(1);
    expect(scope.list2.length).toBe(1);
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list1[0].drag + '" ng-model="list1" jqyoui-draggable="{index: 0}">' + scope.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="' + scope.list2[0].drag + '" ng-model="list2" jqyoui-droppable="{index: 0}">' + scope.list2[0].title + '</div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush();
    expect(scope.list1.length).toBe(1);
    expect(scope.list2.length).toBe(1);
    expect(scope.list1[0].title).toBe('Item 2');
    expect(scope.list2[0].title).toBe('Item 1');
  });

  it('should keep item in list1[0] as well as clone it in list2[0]', function() {
    scope.list1 = [{ 'title': 'Item 1', 'drag': true}];
    scope.list2 = {};
    expect(scope.list1.length).toBe(1);
    expect(scope.list2).toEqual({});
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list1[0].drag + '" ng-model="list1" jqyoui-draggable="{index: 0, placeholder: \'keep\'}">' + scope.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="list2" jqyoui-droppable></div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush();
    expect(scope.list1.length).toBe(1);
    expect(scope.list1).toEqual([{title: 'Item 1', drag: true}]);
    expect(scope.list2).toEqual({title: 'Item 1', drag: true});
  });

  it('should move item from foo.list1[0]:placeholderTrue to foo.list2[0]:dummy', function() {
    scope.foo = {
      list1: [{ 'title': 'Item 1', 'drag': true}],
      list2: [{}]
    };
    expect(scope.foo.list1.length).toBe(1);
    expect(scope.foo.list2.length).toBe(1);
    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.foo.list1[0].drag + '" ng-model="foo.list1" jqyoui-draggable="{index: 0, placeholder:true}">' + scope.foo.list1[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="foo.list2" jqyoui-droppable="{index: 0}"></div>').data('$scope', scope),
      document.createEvent('Event'),
      {}
    );
    timeout.flush(); // http://goo.gl/XEss1
    expect(scope.foo.list1.length).toBe(1);
    expect(scope.foo.list1[0]).toEqual({});
    expect(scope.foo.list2.length).toBe(1);
    expect(scope.foo.list2[0].title).toBe('Item 1');
  });

  it('should move item from scope.list[0]:placeholderFalse to scope2.list[0]:dummy', function() {
    scope.list = [{'title': 'Item 1', 'drag': true}];
    scope2 = rootScope.$new();
    scope2.list = [{}];
    expect(scope.list.length).toBe(1);
    expect(scope2.list.length).toBe(1);

    ngDragDropService.invokeDrop(
      $('<div data-drag="' + scope.list[0].drag + '" ng-model="list" jqyoui-draggable="{index: 0}">' + scope.list[0].title + '</div>').data('$scope', scope),
      $('<div data-drop="true" ng-model="list" jqyoui-droppable="{index: 0}"></div>').data('$scope', scope2),
      document.createEvent('Event'),
      {}
    );
     timeout.flush();
     expect(scope.list.length).toBe(0);
     expect(scope2.list.length).toBe(1);
     expect(scope2.list[0].title).toBe('Item 1');
  });

  it('should fix the index in case of filters used with ngRepeat such as orderBy', function() {
    // Applicable only for array models
    scope.list = [{'title': 'Item 2', 'drag': true}, {'title': 'Item 1', 'drag': true}];
    scope.filterIt = function() {
      return orderByFilter(scope.list, 'title');
    };
    
    expect(ngDragDropService.fixIndex(scope, {index: 1, applyFilter: 'filterIt'}, scope.list)).toBe(0);
    expect(ngDragDropService.fixIndex(scope, {index: 0, applyFilter: 'filterIt'}, scope.list)).toBe(1);

    // Not applicable for object models
    scope.list = {title: 'Item 1'};
    expect(ngDragDropService.fixIndex(scope, {applyFilter: 'filterIt'}, scope.list)).toBe(undefined);
  });
  it('should parse json arguments as json', function(){
      var localScope = rootScope.$new();
      var expectedData = {r1: 1, r2:2};
      localScope.startDrag = function(event, ui, data){
         expect(data).toEqual(data);
      };
      var callbackName = "startDrag("+ JSON.stringify(expectedData) +")";
      ngDragDropService.callEventCallback(localScope, callbackName, {}, {});
  });
  it('should parse json objects along with non json objects', function(){
      var localScope = rootScope.$new();
      var expectedData = {r1: 1, r2:2};
      var expectedFirstArg = "arg1";
      localScope.arg1 = expectedFirstArg;
      localScope.startDrag = function(event, ui,firstArg, data, thirdArg){
         expect(firstArg).toEqual(expectedFirstArg);
         expect(data).toEqual(data);
      };
      var callbackName = "startDrag("+ expectedFirstArg +","+ JSON.stringify(expectedData) +")";
      ngDragDropService.callEventCallback(localScope, callbackName, {}, {});
  }); 
});