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

var jqyoui = angular.module('ngDragDrop', []).service('ngDragDropService', ['$timeout', function($timeout) {
  this.callEventCallback = function (scope, callbackName, event, ui) {
    if (!callbackName) {
      return;
    }
    var args = [event, ui];
    var match = callbackName.match(/^(.+)\((.+)\)$/);
    if (match !== null) {
      callbackName = match[1];
      values = eval('[' + match[0].replace(/^(.+)\(/, '').replace(/\)/, '') + ']');
      args.push.apply(args, values);
    }
    scope[callbackName].apply(scope, args);
  };

  this.invokeDrop = function ($draggable, $droppable, scope, event, ui) {
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
      this.move($draggable, $droppableDraggable.length > 0 ? $droppableDraggable : $droppable, null, 'fast', dropSettings, null);
      this.move($droppableDraggable.length > 0 && !dropSettings.multiple ? $droppableDraggable : [], $draggable.parent('[jqyoui-droppable]'), jqyoui.startXY, 'fast', dropSettings, function() {
        $timeout(function() {
          // Do not move this into move() to avoid flickering issue
          $draggable.css({'position': 'relative', 'left': '', 'top': ''});
          $droppableDraggable.css({'position': 'relative', 'left': '', 'top': ''});

          this.mutateDraggable(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable);
          this.mutateDroppable(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos);
          this.callEventCallback(scope, dropSettings.onDrop, event, ui);
        }.bind(this));
      }.bind(this));
    } else {
      $timeout(function() {
        this.mutateDraggable(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable);
        this.mutateDroppable(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos);
        this.callEventCallback(scope, dropSettings.onDrop, event, ui);
      }.bind(this));
    }
  };

  this.move = function($fromEl, $toEl, toPos, duration, dropSettings, callback) {
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

  this.mutateDroppable = function(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos) {
    if (angular.isArray(scope[dropModel])) {
      if (dropSettings && dropSettings.index >= 0) {
        scope[dropModel][dropSettings.index] = dragItem;
      } else {
        scope[dropModel].push(dragItem);
      }
      if (dragSettings && dragSettings.placeholder === true) {
        scope[dropModel][scope[dropModel].length - 1]['jqyoui_pos'] = jqyoui_pos;
      }
    } else {
      scope[dropModel] = dragItem;
      if (dragSettings && dragSettings.placeholder === true) {
        scope[dropModel]['jqyoui_pos'] = jqyoui_pos;
      }
    }
  };

  this.mutateDraggable = function(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable) {
    var isEmpty = $.isEmptyObject(dropItem);

    if (dragSettings && dragSettings.placeholder) {
      if (dragSettings.placeholder != 'keep'){
        if (angular.isArray(scope[dragModel]) && dragSettings.index !== undefined) {
          scope[dragModel][dragSettings.index] = dropItem;
        } else {
          scope[dragModel] = dropItem;
        }
      }
    } else {
      if (angular.isArray(scope[dragModel])) {
        if (isEmpty) {
          if (dragSettings && ( dragSettings.placeholder !== true && dragSettings.placeholder !== 'keep' )) {
            scope[dragModel].splice(dragSettings.index, 1);
          }
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
}]).directive('jqyouiDraggable', ['ngDragDropService', function(ngDragDropService) {
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
                ngDragDropService.callEventCallback(scope, dragSettings.onStart, event, ui);
              },
              stop: function(event, ui) {
                ngDragDropService.callEventCallback(scope, dragSettings.onStop, event, ui);
              },
              drag: function(event, ui) {
                ngDragDropService.callEventCallback(scope, dragSettings.onDrag, event, ui);
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
}]).directive('jqyouiDroppable', ['ngDragDropService', function(ngDragDropService) {
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
                ngDragDropService.callEventCallback(scope, dropSettings.onOver, event, ui);
              },
              out: function(event, ui) {
                var dropSettings = scope.$eval(angular.element(this).attr('jqyoui-droppable')) || [];
                ngDragDropService.callEventCallback(scope, dropSettings.onOut, event, ui);
              },
              drop: function(event, ui) {
                ngDragDropService.invokeDrop(angular.element(ui.draggable), angular.element(this), scope, event, ui);
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