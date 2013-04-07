

// Jasmine Documentation: http://pivotal.github.com/jasmine/
//
// This introduction file is coming from Jasmine reposutory:
//
// - https://raw.github.com/pivotal/jasmine/gh-pages/src/introduction.js
//

// Jasmine
// =======
//
// Jasmine is a behavior-driven development framework for testing
// JavaScript code. It does not depend on any other JavaScript
// frameworks. It does not require a DOM. And it has a clean, obvious
// syntax so that you can easily write tests.

//
// ## Suites: `describe` Your Tests
//
// A test suite begins with a call to the global Jasmine function
// `describe` with two parameters: a string and a function. The string is a
// name or title for a spec suite - usually what is under test. The
// function is a block of code that implements the suite.
//
// ## Specs
//
// Specs are defined by calling the global Jasmine function `it`, which,
// like `describe` takes a string and a function. The string is a title for
// this spec and the function is the spec, or test. A spec contains one
// or more expectations that test the state of the code under test.
//
// An expectation in Jasmine is an assertion that can be either true or
// false. A spec with all true expectations is a passing spec. A spec with
// one or more expectations that evaluate to false is a failing spec.
//

describe('jQueryUI Drag and Drop Directive', function() {
  var scope, rootScope, timeout, jqyoui_pos, $draggable, dropSettings, dragSettings, dragModel, dropModel, dropItem;

  beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $timeout) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    scope['list1'] = [
      { 'title': 'Item 1', 'drag': true},
      { 'title': 'Item 2', 'drag': true},
      { 'title': 'Item 3', 'drag': true},
      { 'title': 'Item 4', 'drag': true}
    ];
    scope['list2'] = [];
    scope['list4'] = {};
    scope['list3'] = { 'title': 'Item 1', 'drag': true};
    timeout = $timeout;
    $draggableList1 = $('<div class="draggable" />').attr('ng-model', 'list1');
    $droppableList1 = $('<div class="droppable" />').attr('ng-model', 'list1');
    $draggableList2 = $('<div class="draggable" />').attr('ng-model', 'list2');
    $droppableList2 = $('<div class="droppable" />').attr('ng-model', 'list2');
    $draggableList4 = $('<div class="draggable" />').attr('ng-model', 'list4');
    $droppableList4 = $('<div class="droppable" />').attr('ng-model', 'list4');
  }));

  describe('Drag and Drop', function() {
    it('should move items from list1(array) to list2(array)', function() {
      // Move item1 from list1 to list2
      jqyoui.invokeDrop(
        $draggableList1.attr('jqyoui-draggable', '{index: 0, placeholder: true}'),
        $droppableList2.attr('jqyoui-droppable', '{}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush(); // http://goo.gl/XEss1
      expect(scope.list1[0]).toEqual({});
      expect(scope.list2.length).toBe(1);
      expect(scope.list2[0].title).toBe('Item 1');

      // Move item2 from list1 to list2
      jqyoui.invokeDrop(
        $draggableList1.attr('jqyoui-draggable', '{index: 1, placeholder: true}'),
        $droppableList2.attr('jqyoui-droppable', '{}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush();
      expect(scope.list1[1]).toEqual({});
      expect(scope.list2.length).toBe(2);
      expect(scope.list2[1].title).toBe('Item 2');

      // Move item2 from list2 to list1 at 0th position
      jqyoui.invokeDrop(
        $draggableList2.attr('jqyoui-draggable', '{index: 1}'),
        $droppableList1.attr('jqyoui-droppable', '{index: 0}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush();
      expect(scope.list1[0].title).toBe('Item 2');
      expect(scope.list2.length).toBe(1);

      // Switch items between list2 and list1 at 0th position
      jqyoui.invokeDrop(
        $draggableList2.attr('jqyoui-draggable', '{index: 0}'),
        $droppableList1.attr('jqyoui-droppable', '{index: 0}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush();
      expect(scope.list1[0].title).toBe('Item 1');
      expect(scope.list2.length).toBe(1);
      expect(scope.list2[0].title).toBe('Item 2');

      // Switch items within same list at 0th & 2nd positions
      jqyoui.invokeDrop(
        $draggableList1.attr('jqyoui-draggable', '{index: 0}'),
        $droppableList1.attr('jqyoui-droppable', '{index: 2}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush();
      expect(scope.list1[0].title).toBe('Item 3');
      expect(scope.list1[2].title).toBe('Item 1');
    });

    it('should move items from list1(array) to list4(object)', function() {
      // Move item1 from list1 to list4 without placeholder
      jqyoui.invokeDrop(
        $draggableList1.attr('jqyoui-draggable', '{index: 0}'),
        $droppableList4.attr('jqyoui-droppable', '{}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush();
      expect(scope.list1.length).toBe(3);
      expect(scope.list4.title).toBe('Item 1');

      // Move item1 from list1 to list4 with placeholder
      jqyoui.invokeDrop(
        $draggableList1.attr('jqyoui-draggable', '{index: 0, placeholder: true}'),
        $droppableList4.attr('jqyoui-droppable', '{}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush();
      expect(scope.list1.length).toBe(3);
      expect(scope.list1[0].title).toBe('Item 1');
      expect(scope.list4.title).toBe('Item 2');
    });
    it('should keep the original items on list1(array) when placeholder == "keep"', function(){
      // Move item1 from list1 to list2
      jqyoui.invokeDrop(
        $draggableList1.attr('jqyoui-draggable', '{index: 0, placeholder: "keep"}'),
        $droppableList2.attr('jqyoui-droppable', '{}'),
        scope,
        timeout,
        null,
        null
      );
      timeout.flush(); // http://goo.gl/XEss1
      expect(scope.list1.length).toBe(4);
      expect(scope.list2.length).toBe(1);
      expect(scope.list1[0].title).toBe('Item 1');
      expect(scope.list2[0].title).toBe('Item 1');
    });
  });
});