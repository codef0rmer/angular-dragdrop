#Drag and Drop for AngularJS (with Animation)

---
##Angular Draggable options
* **jqyoui-draggable** – A custom angular attribute to make any element draggable. It holds more settings such as:
    * **index** – number – $index of an item of a model (if it is an array) associated with it
    * **placeholder** – boolean/string – If true, the place will be occupied even though a dragggable is moved/dropped somewhere else. If 'keep' is supplied, the original item won't be removed from the draggable.
    * **animate** – boolean – If true, draggable will be animated towards droppable when dropped. If multiple is not set to true on droppable then its draggable will swap its position.
    * **onStart** – string – callback method to be invoked (has to be defined in a controller) when dragging starts
    * **onStop** – string – callback method to be invoked when dragging stops
    * **onDrag** – string – callback method to be invoked while the mouse is moved during the dragging
* **data-drag** – boolean – If true, element can be draggable. Disabled otherwise.
* **data-jqyoui-options** – object – should hold all the valid options supported by [jQueryUI Draggable](http://api.jqueryui.com/draggable)
* **ng-model** – string – An angular model defined in a controller. Should be a JS array or object

##Angular Droppable options
* **jqyoui-droppable** – A custom angular attribute to make any element droppable. It holds more settings such as:
    * **index** – number – $index of an item of a model (if it is an array) associated with it
    * **multiple** – boolean – Requires to be true only if animate is set to true for draggable and to avoid swapping.
    * **stack** – boolean – Requires if animate is set to true on draggable and if multiple draggables positioned one below the other
    * **onDrop** – string – callback method to be invoked a draggable is dropped into the droppable
    * **onOver** – string – callback method to be invoked when an accepted draggable is dragged over the droppable
    * **onOut** – string – callback method to be invoked when an accepted draggable is dragged out of the droppable
* **data-drop** – boolean – If true, element can be droppable. Disabled otherwise.
* **data-jqyoui-options** – object – should hold all the valid options supported by [jQueryUI Droppable](http://api.jqueryui.com/droppable)
* **ng-model** – string – An angular model defined in a controller. Should be a JS array or object.