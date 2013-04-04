/**
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * Implementing Drag and Drop functionality in AngularJS is easier than ever.
 * Demo: http://codef0rmer.github.com/angular-dragdrop/
 * 
 * @version 1.0.0
 *
 * (c) 2013 Amit Gharat a.k.a codef0rmer <amit.2006.it@gmail.com> - amitgharat.wordpress.com
 */
var jqyoui = angular.module('ngDragDrop', []).directive('jqyouiDraggable', function() {
  return {
    require: '?jqyouiDroppable',
    restrict: 'A',
    link: function(scope, element, attrs) {
      var dragSettings;
      var updateDraggable = function(newValue, oldValue) {
        if (newValue) {
          dragSettings = scope.$eval(element.attr('jqyoui-draggable')) || [];
          element
            .draggable({disabled: false})
            .draggable(scope.$eval(attrs.jqyouiOptions) || {})
            .draggable({
              start: function(event, ui) {
                $(this).css('z-index', 99999);
                jqyoui.startXY = $(this).offset();

                if (dragSettings.onStart) {
                  if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dragSettings.onStart)) {
                    dragSettings.startFunc = dragSettings.onStart.match(/^[a-zA-Z0-9_\$]*\(/);
                    dragSettings.startFunc = dragSettings.startFunc[0].substr(0, dragSettings.startFunc[0].length - 1);
                    dragSettings.startInput = dragSettings.onStart.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
                    eval('scope[dragSettings.startFunc](event, ui, ' + dragSettings.startInput + ')');
                  }
                  else {
                    scope[dragSettings.onStart](event, ui);
                  }
                }
              },
              stop: function(event, ui) {
                if (dragSettings.onStop) {
                  if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dragSettings.onStop)) {
                    dragSettings.stopFunc = dragSettings.onStop.match(/^[a-zA-Z0-9_\$]*\(/);
                    dragSettings.stopFunc = dragSettings.stopFunc[0].substr(0, dragSettings.stopFunc[0].length - 1);
                    dragSettings.stopInput = dragSettings.onStop.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
                    eval('scope[dragSettings.stopFunc](event, ui, ' + dragSettings.stopInput + ')');
                  }
                  else {
                    scope[dragSettings.onStop](event, ui);
                  }
                }
              },
              drag: function(event, ui) {
                if (dragSettings.onDrag) {
                  if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dragSettings.onDrag)) {
                    dragSettings.dragFunc = dragSettings.onDrag.match(/^[a-zA-Z0-9_\$]*\(/);
                    dragSettings.dragFunc = dragSettings.dragFunc[0].substr(0, dragSettings.dragFunc[0].length - 1);
                    dragSettings.dragInput = dragSettings.onDrag.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
                    eval('scope[dragSettings.dragFunc](event, ui, ' + dragSettings.dropInput + ')');
                  }
                  else {
                    scope[dragSettings.onDrag](event, ui);
                  }
                }
              }
            });
        } else {
          element.draggable({disabled: true});
        }
      };
      scope.$watch(function() { return scope.$eval(attrs.drag); }, updateDraggable);
      updateDraggable();
    }
  };
}).directive('jqyouiDroppable', ['$timeout',function($timeout) {
  return {
    restrict: 'A',
    priority: 1,
    link: function(scope, element, attrs) {
      var updateDroppable = function(newValue, oldValue) {
        if (newValue) {
          element
            .droppable({disabled: false})
            .droppable(scope.$eval(attrs.jqyouiOptions) || {})
            .droppable({
              over: function(event, ui) {
                var dropSettings = scope.$eval(angular.element(this).attr('jqyoui-droppable')) || [];
                if (dropSettings.onOver) {
                  if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dropSettings.onOver)) {
                    dropSettings.overFunc = dropSettings.onOver.match(/^[a-zA-Z0-9_\$]*\(/);
                    dropSettings.overFunc = dropSettings.overFunc[0].substr(0, dropSettings.overFunc[0].length - 1);
                    dropSettings.overInput = dropSettings.onOver.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
                    eval('scope[dropSettings.overFunc](event, ui, ' + dropSettings.overInput + ')');
                  }
                  else {
                    scope[dropSettings.onOver](event, ui);
                  }
                }
              },
              out: function(event, ui) {
                var dropSettings = scope.$eval(angular.element(this).attr('jqyoui-droppable')) || [];
                if (dropSettings.onOut) {
                  if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dropSettings.onOut)) {
                    dropSettings.outFunc = dropSettings.onOut.match(/^[a-zA-Z0-9_\$]*\(/);
                    dropSettings.outFunc = dropSettings.outFunc[0].substr(0, dropSettings.outFunc[0].length - 1);
                    dropSettings.outInput = dropSettings.onOut.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
                    eval('scope[dropSettings.outFunc](event, ui, ' + dropSettings.outInput + ')');
                  }
                  else {
                    scope[dropSettings.onOut](event, ui);
                  }
                }
              },
              drop: function(event, ui) {
                jqyoui.invokeDrop(angular.element(ui.draggable), angular.element(this), scope, $timeout, event, ui);
              }
            });
        } else {
          element.droppable({disabled: true});
        }
      };

      scope.$watch(function() { return scope.$eval(attrs.drop); }, updateDroppable);
      updateDroppable();
    }
  };
}]);

jqyoui.invokeDrop = function($draggable, $droppable, scope, $timeout, event, ui) {
  var dragModel = '',
      dropModel = '',
      dragSettings = {},
      dropSettings = {},
      jqyoui_pos = null,
      dragItem = {},
      dropItem = {},
      $droppableDraggable = null;

  dragModel = $draggable.attr('ng-model');
  dropModel = $droppable.attr('ng-model');
  $droppableDraggable = $droppable.find('[jqyoui-draggable]:last');
  dropSettings = scope.$eval($droppable.attr('jqyoui-droppable')) || [];
  dragSettings = scope.$eval($draggable.attr('jqyoui-draggable')) || [];
  jqyoui_pos = angular.isArray(scope[dragModel]) ? dragSettings.index : null,
  dragItem = angular.isArray(scope[dragModel]) ? scope[dragModel][jqyoui_pos] : scope[dragModel];
  dropItem = ( angular.isArray(scope[dropModel]) && dropSettings && dropSettings.index !== undefined ?
    scope[dropModel][dropSettings.index] :
    !angular.isArray(scope[dropModel]) ?
    scope[dropModel] :
    {}
  ) || {};

  if (dragSettings.animate === true) {
    jqyoui.move($draggable, $droppableDraggable.length > 0 ? $droppableDraggable : $droppable, null, 'fast', dropSettings, null);
    jqyoui.move($droppableDraggable.length > 0 && !dropSettings.multiple ? $droppableDraggable : [], $draggable.parent('[jqyoui-droppable]'), jqyoui.startXY, 'fast', dropSettings, function() {
      $timeout(function() {
        // Do not move this into move() to avoid flickering issue
        $draggable.css({'position': 'relative', 'left': '', 'top': ''});
        $droppableDraggable.css({'position': 'relative', 'left': '', 'top': ''});

        jqyoui.mutateDraggable(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable);
        jqyoui.mutateDroppable(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos);
        if (dropSettings.onDrop) {
          if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dropSettings.onDrop)) {
            dropSettings.dropFunc = dropSettings.onDrop.match(/^[a-zA-Z0-9_\$]*\(/);
            dropSettings.dropFunc = dropSettings.dropFunc[0].substr(0, dropSettings.dropFunc[0].length - 1);
            dropSettings.dropInput = dropSettings.onDrop.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
            eval('scope[dropSettings.dropFunc](event, ui, ' + dropSettings.dropInput + ')');
          }
          else {
            scope[dropSettings.onDrop](event, ui);
          }
        }
      });
    });
  } else {
    $timeout(function() {
      jqyoui.mutateDraggable(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable);
      jqyoui.mutateDroppable(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos);
      if (dropSettings.onDrop) {
        if (/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/.test(dropSettings.onDrop)) {
          dropSettings.dropFunc = dropSettings.onDrop.match(/^[a-zA-Z0-9_\$]*\(/);
          dropSettings.dropFunc = dropSettings.dropFunc[0].substr(0, dropSettings.dropFunc[0].length - 1);
          dropSettings.dropInput = dropSettings.onDrop.match(/\([a-zA-Z0-9_,:\'\s\$\[\]\{\}\.]*\)/).toString().replace(/\(/, '').replace(/\)/, '');
          eval('scope[dropSettings.dropFunc](event, ui, ' + dropSettings.dropInput + ')');
        }
        else {
          scope[dropSettings.onDrop](event, ui);
        }
      }
    });
  }
};
  
jqyoui.move = function($fromEl, $toEl, toPos, duration, dropSettings, callback) {
  if ($fromEl.length === 0) {
    if (callback) {
      window.setTimeout(function() {
        callback();
      }, 300);
    }
    return false;
  }

  var zIndex = 9999,
      fromPos = $fromEl.offset(),
      wasVisible = $toEl && $toEl.is(':visible');

  if (toPos === null && $toEl.length > 0) {
    if ($toEl.attr('jqyoui-draggable') !== undefined && $toEl.attr('ng-model') !== undefined && $toEl.is(':visible') && dropSettings && dropSettings.multiple) {
      toPos = $toEl.offset();
      if (dropSettings.stack === false) {
        toPos.left+= $toEl.outerWidth(true);
      } else {
        toPos.top+= $toEl.outerHeight(true);
      }
    } else {
      toPos = $toEl.css({'visibility': 'hidden', 'display': 'block'}).offset();
      $toEl.css({'visibility': '','display': wasVisible ? '' : 'none'});
    }
  }
  
  $fromEl.css({'position': 'absolute', 'z-index': zIndex})
    .css(fromPos)
    .animate(toPos, duration, function() {
      if (callback) callback();
    });
};

jqyoui.mutateDroppable = function(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos) {
  if (angular.isArray(scope[dropModel])) {
    if (dropSettings && dropSettings.index >= 0) {
      scope[dropModel][dropSettings.index] = dragItem;
    } else {
      scope[dropModel].push(dragItem);
    }
    if (dragSettings && dragSettings.placeholder) {
      scope[dropModel][scope[dropModel].length - 1]['jqyoui_pos'] = jqyoui_pos;
    }
  } else {
    scope[dropModel] = dragItem;
    if (dragSettings && dragSettings.placeholder) {
      scope[dropModel]['jqyoui_pos'] = jqyoui_pos;
    }
  }
};

jqyoui.mutateDraggable = function(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable) {
  var isEmpty = $.isEmptyObject(dropItem);

  if (dragSettings && dragSettings.placeholder) {
    if (angular.isArray(scope[dragModel]) && dragSettings.index !== undefined) {
      scope[dragModel][dragSettings.index] = dropItem;
    } else {
      scope[dragModel] = dropItem;
    }
  } else {
    if (angular.isArray(scope[dragModel])) {
      if (isEmpty) {
        scope[dragModel].splice(dragSettings.index, 1);
      } else {
        scope[dragModel][dragSettings.index] = dropItem;
      }
    } else {
      // Fix: LIST(object) to LIST(array) - model does not get updated using just scope[dragModel] = {...}
      // P.S.: Could not figure out why it happened
      scope[dragModel] = dropItem;
      if (scope.$parent) scope.$parent[dragModel] = dropItem;
    }
  }

  $draggable.css({'z-index': '', 'left': '', 'top': ''});
};