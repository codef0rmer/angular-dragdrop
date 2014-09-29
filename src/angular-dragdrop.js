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
 * @version 1.0.7
 *
 * (c) 2013 Amit Gharat a.k.a codef0rmer <amit.2006.it@gmail.com> - amitgharat.wordpress.com
 */

(function (window, angular, undefined) {
'use strict';

var jqyoui = angular.module('ngDragDrop', []).service('ngDragDropService', ['$timeout', '$parse', function($timeout, $parse) {
    this.callEventCallback = function (scope, callbackName, event, ui) {
      if (!callbackName) return;

      var objExtract = extract(callbackName),
          callback = objExtract.callback,
          constructor = objExtract.constructor,
          args = [event, ui].concat(objExtract.args);
      
      // call either $scoped method i.e. $scope.dropCallback or constructor's method i.e. this.dropCallback
      scope.$apply((scope[callback] || scope[constructor][callback]).apply(scope, args));
      
      function extract(callbackName) {
        var atStartBracket = callbackName.indexOf('(') !== -1 ? callbackName.indexOf('(') : callbackName.length,
            atEndBracket = callbackName.lastIndexOf(')') !== -1 ? callbackName.lastIndexOf(')') : callbackName.length,
            args = callbackName.substring(atStartBracket + 1, atEndBracket), // matching function arguments inside brackets
            constructor = callbackName.match(/^[^.]+.\s*/)[0].slice(0, -1); // matching a string upto a dot to check ctrl as syntax
            constructor = scope[constructor] && typeof scope[constructor].constructor === 'function' ? constructor : null;

        return {
          callback: callbackName.substring(constructor && constructor.length + 1 || 0, atStartBracket),
          args: (args && args.split(',') || []).map(function(item) { return $parse(item)(scope); }),
          constructor: constructor
        }
      }
    };

    this.invokeDrop = function ($draggable, $droppable, event, ui) {
      var dragModel = '',
        dropModel = '',
        dragSettings = {},
        dropSettings = {},
        jqyoui_pos = null,
        dragItem = {},
        dropItem = {},
        dragModelValue,
        dropModelValue,
        $droppableDraggable = null,
        droppableScope = $droppable.scope(),
        draggableScope = $draggable.scope();

      dragModel = $draggable.ngattr('ng-model');
      dropModel = $droppable.ngattr('ng-model');
      dragModelValue = draggableScope.$eval(dragModel);
      dropModelValue = droppableScope.$eval(dropModel);

      $droppableDraggable = $droppable.find('[jqyoui-draggable]:last,[data-jqyoui-draggable]:last');
      dropSettings = droppableScope.$eval($droppable.attr('jqyoui-droppable') || $droppable.attr('data-jqyoui-droppable')) || [];
      dragSettings = draggableScope.$eval($draggable.attr('jqyoui-draggable') || $draggable.attr('data-jqyoui-draggable')) || [];

      // Helps pick up the right item
      dragSettings.index = this.fixIndex(draggableScope, dragSettings, dragModelValue);
      dropSettings.index = this.fixIndex(droppableScope, dropSettings, dropModelValue);

      jqyoui_pos = angular.isArray(dragModelValue) ? dragSettings.index : null;
      dragItem = angular.copy(angular.isArray(dragModelValue) ? dragModelValue[jqyoui_pos] : dragModelValue);

      if (angular.isArray(dropModelValue) && dropSettings && dropSettings.index !== undefined) {
        dropItem = dropModelValue[dropSettings.index];
      } else if (!angular.isArray(dropModelValue)) {
        dropItem = dropModelValue;
      } else {
        dropItem = {};
      }
      dropItem = angular.copy(dropItem);

      if (dragSettings.animate === true) {
        this.move($draggable, $droppableDraggable.length > 0 ? $droppableDraggable : $droppable, null, 'fast', dropSettings, null);
        this.move($droppableDraggable.length > 0 && !dropSettings.multiple ? $droppableDraggable : [], $draggable.parent('[jqyoui-droppable],[data-jqyoui-droppable]'), jqyoui.startXY, 'fast', dropSettings, angular.bind(this, function() {
          $timeout(angular.bind(this, function() {
            // Do not move this into move() to avoid flickering issue
            $draggable.css({'position': 'relative', 'left': '', 'top': ''});
            // Angular v1.2 uses ng-hide to hide an element not display property
            // so we've to manually remove display:none set in this.move()
            $droppableDraggable.css({'position': 'relative', 'left': '', 'top': '', 'display': ''});

            this.mutateDraggable(draggableScope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable);
            this.mutateDroppable(droppableScope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos);
            this.callEventCallback(droppableScope, dropSettings.onDrop, event, ui);
          }));
        }));
      } else {
        $timeout(angular.bind(this, function() {
          this.mutateDraggable(draggableScope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable);
          this.mutateDroppable(droppableScope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos);
          this.callEventCallback(droppableScope, dropSettings.onDrop, event, ui);
        }));
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
        fromPos = $fromEl[dropSettings.containment || 'offset'](),
        wasVisible = $toEl && $toEl.is(':visible'),
        hadNgHideCls = $toEl.hasClass('ng-hide');

      if (toPos === null && $toEl.length > 0) {
        if (($toEl.attr('jqyoui-draggable') || $toEl.attr('data-jqyoui-draggable')) !== undefined && $toEl.ngattr('ng-model') !== undefined && $toEl.is(':visible') && dropSettings && dropSettings.multiple) {
          toPos = $toEl[dropSettings.containment || 'offset']();
          if (dropSettings.stack === false) {
            toPos.left+= $toEl.outerWidth(true);
          } else {
            toPos.top+= $toEl.outerHeight(true);
          }
        } else {
          // Angular v1.2 uses ng-hide to hide an element 
          // so we've to remove it in order to grab its position
          if (hadNgHideCls) $toEl.removeClass('ng-hide');
          toPos = $toEl.css({'visibility': 'hidden', 'display': 'block'})[dropSettings.containment || 'offset']();
          $toEl.css({'visibility': '','display': wasVisible ? 'block' : 'none'});
        }
      }

      $fromEl.css({'position': 'absolute', 'z-index': zIndex})
        .css(fromPos)
        .animate(toPos, duration, function() {
          // Angular v1.2 uses ng-hide to hide an element
          // and as we remove it above, we've to put it back to
          // hide the element (while swapping) if it was hidden already
          // because we remove the display:none in this.invokeDrop()
          if (hadNgHideCls) $toEl.addClass('ng-hide');
          if (callback) callback();
        });
    };

    this.mutateDroppable = function(scope, dropSettings, dragSettings, dropModel, dragItem, jqyoui_pos) {
      var dropModelValue = scope.$eval(dropModel);

      scope.dndDragItem = dragItem;

      if (angular.isArray(dropModelValue)) {
        if (dropSettings && dropSettings.index >= 0) {
          dropModelValue[dropSettings.index] = dragItem;
        } else {
          dropModelValue.push(dragItem);
        }
        if (dragSettings && dragSettings.placeholder === true) {
          dropModelValue[dropModelValue.length - 1]['jqyoui_pos'] = jqyoui_pos;
        }
      } else {
        $parse(dropModel + ' = dndDragItem')(scope);
        if (dragSettings && dragSettings.placeholder === true) {
          dropModelValue['jqyoui_pos'] = jqyoui_pos;
        }
      }
    };

    this.mutateDraggable = function(scope, dropSettings, dragSettings, dragModel, dropModel, dropItem, $draggable) {
      var isEmpty = angular.equals(dropItem, {}),
        dragModelValue = scope.$eval(dragModel);

      scope.dndDropItem = dropItem;

      if (dragSettings && dragSettings.placeholder) {
        if (dragSettings.placeholder != 'keep'){
          if (angular.isArray(dragModelValue) && dragSettings.index !== undefined) {
            dragModelValue[dragSettings.index] = dropItem;
          } else {
            $parse(dragModel + ' = dndDropItem')(scope);
          }
        }
      } else {
        if (angular.isArray(dragModelValue)) {
          if (isEmpty) {
            if (dragSettings && ( dragSettings.placeholder !== true && dragSettings.placeholder !== 'keep' )) {
              dragModelValue.splice(dragSettings.index, 1);
            }
          } else {
            dragModelValue[dragSettings.index] = dropItem;
          }
        } else {
          // Fix: LIST(object) to LIST(array) - model does not get updated using just scope[dragModel] = {...}
          // P.S.: Could not figure out why it happened
          $parse(dragModel + ' = dndDropItem')(scope);
          if (scope.$parent) {
            $parse(dragModel + ' = dndDropItem')(scope.$parent);
          }
        }
      }

      $draggable.css({'z-index': '', 'left': '', 'top': ''});
    };

    this.fixIndex = function(scope, settings, modelValue) {
      if (settings.applyFilter && angular.isArray(modelValue) && modelValue.length > 0) {
        var dragModelValueFiltered = scope[settings.applyFilter](),
            lookup = dragModelValueFiltered[settings.index],
            actualIndex = undefined;

        modelValue.forEach(function(item, i) {
           if (angular.equals(item, lookup)) {
             actualIndex = i;
           }
        });

        return actualIndex;
      }

      return settings.index;
    };
  }]).directive('jqyouiDraggable', ['ngDragDropService', function(ngDragDropService) {
    return {
      require: '?jqyouiDroppable',
      restrict: 'A',
      link: function(scope, element, attrs) {
        var dragSettings, jqyouiOptions, zIndex;
        var updateDraggable = function(newValue, oldValue) {
          if (newValue) {
            dragSettings = scope.$eval(element.attr('jqyoui-draggable') || element.attr('data-jqyoui-draggable')) || {};
            jqyouiOptions = scope.$eval(attrs.jqyouiOptions) || {};
            element
              .draggable({disabled: false})
              .draggable(jqyouiOptions)
              .draggable({
                start: function(event, ui) {
                  zIndex = angular.element(jqyouiOptions.helper ? ui.helper : this).css('z-index');
                  angular.element(jqyouiOptions.helper ? ui.helper : this).css('z-index', 9999);
                  jqyoui.startXY = angular.element(this)[dragSettings.containment || 'offset']();
                  ngDragDropService.callEventCallback(scope, dragSettings.onStart, event, ui);
                },
                stop: function(event, ui) {
                  angular.element(jqyouiOptions.helper ? ui.helper : this).css('z-index', zIndex);
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

        scope.$on('$destroy', function() {
          element.draggable('destroy');
        });
      }
    };
  }]).directive('jqyouiDroppable', ['ngDragDropService', function(ngDragDropService) {
    return {
      restrict: 'A',
      priority: 1,
      link: function(scope, element, attrs) {
        var dropSettings;
        var updateDroppable = function(newValue, oldValue) {
          if (newValue) {
            dropSettings = scope.$eval(angular.element(element).attr('jqyoui-droppable') || angular.element(element).attr('data-jqyoui-droppable')) || {};
            element
              .droppable({disabled: false})
              .droppable(scope.$eval(attrs.jqyouiOptions) || {})
              .droppable({
                over: function(event, ui) {
                  ngDragDropService.callEventCallback(scope, dropSettings.onOver, event, ui);
                },
                out: function(event, ui) {
                  ngDragDropService.callEventCallback(scope, dropSettings.onOut, event, ui);
                },
                drop: function(event, ui) {
                  if (angular.element(ui.draggable).ngattr('ng-model') && attrs.ngModel) {
                    ngDragDropService.invokeDrop(angular.element(ui.draggable), angular.element(this), event, ui);
                  } else {
                    ngDragDropService.callEventCallback(scope, dropSettings.onDrop, event, ui);
                  }
                }
              });
          } else {
            element.droppable({disabled: true});
          }
        };

        scope.$watch(function() { return scope.$eval(attrs.drop); }, updateDroppable);
        updateDroppable();

        scope.$on('$destroy', function() {
          element.droppable('destroy');
        });
      }
    };
  }]);

  angular.element.prototype.ngattr = function(name, value) {
    var element = angular.element(this).get(0);

    return element.getAttribute(name) || element.getAttribute('data-' + name);
  };
})(window, window.angular);
