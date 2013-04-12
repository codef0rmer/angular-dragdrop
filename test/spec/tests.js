

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
  var scope, rootScope, timeout, jqyoui_pos, $compile, $draggable, dropSettings, dragSettings, dragModel, dropModel, dropItem, ui;

  beforeEach(module('ngDragDrop'));
  beforeEach(inject(function(_$httpBackend_, $rootScope, _$compile_, $controller, $timeout) {
    $compile = _$compile_;
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
    ui = {};
    $draggableList1 = $('<div></div>').attr('ng-model', 'list1').attr('data-drag', 'true');
    $droppableList1 = $('<div></div>').attr('ng-model', 'list1').attr('data-drop', 'true');
    $draggableList2 = $('<div></div>').attr('ng-model', 'list2').attr('data-drag', 'true');
    $droppableList2 = $('<div></div>').attr('ng-model', 'list2').attr('data-drop', 'true');
    $draggableList4 = $('<div></div>').attr('ng-model', 'list4').attr('data-drag', 'true');
    $droppableList4 = $('<div></div>').attr('ng-model', 'list4').attr('data-drop', 'true');

    var dragElems = [
      $draggableList1,
      $draggableList2,
      $draggableList4
    ];

    var dropElems = [
      $droppableList1,
      $droppableList2,
      $droppableList4
    ];

    for (var i = 0; i < dragElems.length; i++) {
      var offset = {left: 0, top: 150};
      var proportions = {width: 50, height: 50};
      var elem = dragElems[i];
      elem.offset(offset);
    }

    for (var i = 0; i < dropElems.length; i++) {
      offset = {left: 100 * i, top: 0}
      elem = dropElems[i];
    }
  }));

  it('should move items from list1(array) to list2(array)', function() {
    // Move item1 from list1 to list2
    $draggableList1.attr('jqyoui-draggable', '{index: 0, placeholder: true}');
    $droppableList2.attr('jqyoui-droppable', true);

    $compile($draggableList1)(scope);
    $compile($droppableList2)(scope);

    scope.$digest();

    // $draggableList1 has offset {left: 0, top: 150}, $droppableList2 has offset {left: 100, top: 0}
    $draggableList1.simulate('drag', {
      dx: 150,
      dy: 0
    }).simulate('drag', {
      dx: 0,
      dy: -100
    });

    timeout.flush(); // http://goo.gl/XEss1
    expect(scope.list1[0]).toEqual({});
    expect(scope.list2.length).toBe(1);
    expect(scope.list2[0].title).toBe('Item 1');

    // Move item2 from list1 to list2
    $draggableList1.attr('jqyoui-draggable', '{index: 1, placeholder: true}');
    $droppableList2.attr('jqyoui-droppable', '{}');

    $compile($draggableList1)(scope);
    $compile($droppableList2)(scope);

    // $draggableList1 has offset {left: 150, top: 50}, $droppableList2 has offset {left: 100, top: 0}
    $draggableList1.simulate('drag', {
      dx: 1,
      dy: 1
    });

    timeout.flush();
    expect(scope.list1[2]).toEqual({});
    expect(scope.list2.length).toBe(2);
    expect(scope.list2[0].title).toBe('Item 2');

    // Move item2 from list2 to list1 at 0th position
    $draggableList2.attr('jqyoui-draggable', '{index: 1, placeholder: true}');
    $droppableList1.attr('jqyoui-droppable', '{}');
    
    $compile($draggableList2)(scope);
    $compile($droppableList1)(scope)

    // $draggableList2 has offset {left: 0, top: 150}, $droppableList1 has offset {left: 0, top: 0}
    $draggableList2.simulate('drag', {
      dx: 0,
      dy: -100
    });

    timeout.flush();
    expect(scope.list1[2]).toEqual({});
    expect(scope.list2.length).toBe(2);
    expect(scope.list2[0].title).toBe('Item 2');

    // Switch items between list2 and list1 at 0th position
    $draggableList1.attr('jqyoui-draggable', '{index: 0}');
    $droppableList1.attr('jqyoui-droppable', '{index: 0}');
    
    // Reset $draggableList1 offset to {left: 0, top: 150}
    $draggableList1.offset({left: 0, top: 150});

    // $droppableList1 has offset {left: 0, top: 0}
    $draggableList1.simulate('drag', {
      dx: 0,
      dy: -100
    });

    timeout.flush();
    expect(scope.list1[0].title).toBe('Item 1');
    expect(scope.list2.length).toBe(1);
    expect(scope.list2[0].title).toBe('Item 2');

    // Switch items between same list at 0th and 2nd positions
    $draggableList1.attr('jqyoui-draggable', '{index: 0}');
    $droppableList1.attr('jqyoui-droppable', '{index: 2}');
    
    // $draggableList1 has offset {left: 0, top: 50}, $droppableList has offset {left: 0, top: 0}
    $draggableList1.simulate('drag', {
      dx: 1,
      dy: 1
    });

    timeout.flush();
    expect(scope.list1[0].title).toBe('Item 3');
    expect(scope.list1[2].title).toBe('Item 1');
  });
  it('should move items from list1(array) to list4(object)', function() {
    // Move item1 from list1 to list4 without placeholder
    $draggableList1.attr('jqyoui-draggable', '{index: 0}');
    $droppableList4.attr('jqyoui-droppable', '{}');
    
    $compile($draggableList1)(scope);
    $compile($droppableList4)(scope);

    // $draggableList1 has offset {left: 0, top: 150}, $droppableList4 has offset {left: 300, top: 0}
    $draggableList1.simulate('drag', {
      dx: 350,
      dy: 0
    }).simulate('drag', {
      dx: 0,
      dy: -100
    });

    timeout.flush();
    expect(scope.list1.length).toBe(3);
    expect(scope.list4.title).toBe('Item 1');

    // Move item1 from list1 to list4 with placeholder
    $draggableList1.attr('jqyoui-draggable', '{index: 0, placeholder: true}');
    $droppableList4.attr('jqyoui-droppable', '{}');
    
    $compile($draggableList1)(scope);

    // $draggableList1 has offset {left: 350, top: 50}, $droppableList4 has offset {left: 300, top: 0}
    $draggableList1.simulate('drag', {
      dx: 1,
      dy: 1
    });

    timeout.flush();
    expect(scope.list1.length).toBe(3);
    expect(scope.list4.title).toBe('Item 1');
    expect(scope.list4.title).toBe('Item 2');
  });

  it('should fire a callback when drop is triggered', function() {
    var dropTrigger = false;

    scope.dropCallback = function(event, ui, val) {
      dropTrigger = val;
    };

    $draggableList1.attr('jqyoui-draggable', '{index: 0}')
    $droppableList2.attr('jqyoui-droppable', '{onDrop:dropCallback(true)}');
    
    $compile($draggableList1)(scope);
    $compile($droppableList2)(scope);

    // $draggableList1 has offset {left: 0, top: 150}, $droppableList2 has offset {left: 100, top: 0}
    $draggableList1.simulate('drag', {
      dx: 150,
      dy: 0
    }).simulate('drag', {
      dx: 0,
      dy: -100
    });

    timeout.flush();
    expect(dropTrigger).toBe(true);
  });
});