// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

cr.define('cr.ui', function() {
  /**
   * Constructor for FocusManager singleton. Checks focus of elements to ensure
   * that elements in "background" pages (i.e., those in a dialog that is not
   * the topmost overlay) do not receive focus.
   * @constructor
   */
  function FocusManager() {
  }

  FocusManager.prototype = {
    /**
     * Whether focus is being transferred backward or forward through the DOM.
     * @type {boolean}
     * @private
     */
    focusDirBackwards_: false,

    /**
     * Determines whether the |child| is a descendant of |parent| in the page's
     * DOM.
     * @param {Element} parent The parent element to test.
     * @param {Element} child The child element to test.
     * @return {boolean} True if |child| is a descendant of |parent|.
     * @private
     */
    isDescendantOf_: function(parent, child) {
      var current = child;

      while (current) {
        current = current.parentNode;
        if (typeof(current) == 'undefined' ||
            typeof(current) == 'null' ||
            current === document.body) {
          return false;
        } else if (current === parent) {
          return true;
        }
      }

      return false;
    },

    /**
     * Returns the parent element containing all elements which should be
     * allowed to receive focus.
     * @return {Element} The element containing focusable elements.
     */
    getFocusParent: function() {
      return document.body;
    },

    /**
     * Returns the elements on the page capable of receiving focus.
     * @return {Array.Element} The focusable elements.
     */
    getFocusableElements_: function() {
      var focusableDiv = this.getFocusParent();

      // Create a TreeWalker object to traverse the DOM from |focusableDiv|.
      var treeWalker = document.createTreeWalker(
          focusableDiv,
          NodeFilter.SHOW_ELEMENT,
          { acceptNode: function(node) {
              var style = window.getComputedStyle(node);
              // Reject all hidden nodes. FILTER_REJECT also rejects these
              // nodes' children, so non-hidden elements that are descendants of
              // hidden <div>s will correctly be rejected.
              if (node.hidden || style.display == 'none' ||
                  style.visibility == 'hidden') {
                return NodeFilter.FILTER_REJECT;
              }

              // Skip nodes that cannot receive focus. FILTER_SKIP does not
              // cause this node's children also to be skipped.
              if (node.disabled || node.tabIndex < 0)
                return NodeFilter.FILTER_SKIP;

              // Accept nodes that are non-hidden and focusable.
              return NodeFilter.FILTER_ACCEPT;
            }
          },
          false);

      var focusable = [];
      while (treeWalker.nextNode())
        focusable.push(treeWalker.currentNode);

      return focusable;
    },

    /**
     * Dispatches an 'elementFocused' event to notify an element that it has
     * received focus. When focus wraps around within the a page, only the
     * element that has focus after the wrapping receives an 'elementFocused'
     * event. This differs from the native 'focus' event which is received by
     * an element outside the page first, followed by a 'focus' on an element
     * within the page after the FocusManager has intervened.
     * @param {Element} element The element that has received focus.
     * @private
     */
    dispatchFocusEvent_: function(element) {
      cr.dispatchSimpleEvent(element, 'elementFocused', true, false);
    },

    /**
     * Seems to be only called when firsthand focus attempt fail
     * Attempts to focus the appropriate element in the current dialog.
     * @private
     */
    setFocus_: function() {
      // If |this.focusDirBackwards_| is true, the user has pressed "Shift+Tab"
      // and has caused the focus to be transferred backward, outside of the
      // current dialog. In this case, loop around and try to focus the last
      // element of the dialog; otherwise, try to focus the first element of the
      // dialog.
      var focusableElements = this.getFocusableElements_();
      var element = this.focusDirBackwards_ ? focusableElements.pop() :
                                              focusableElements.shift();
      if (element) {
        element.focus();
        this.dispatchFocusEvent_(element);
      }
    },

    /**
     * Attempts to focus the first element in the current dialog.
     */
    focusFirstElement: function() {
      this.focusFirstElement_();
    },

    /**
     * Handler for focus events on the page.
     * @param {Event} event The focus event.
     * @private
     */
    onDocumentFocus_: function(event) {
      // If the element being focused is a descendant of the currently visible
      // page, focus is valid.
      if (this.isDescendantOf_(this.getFocusParent(), event.target)) {
        this.dispatchFocusEvent_(event.target);
        return;
      }

      // The target of the focus event is not in the topmost visible page and
      // should not be focused.
      event.target.blur();

      // Attempt to wrap around focus within the current page.
      this.setFocus_();
    },

    /**
     * Handler for keydown events on the page.
     * @param {Event} event The keydown event.
     * @private
     */
    onDocumentKeyDown_: function(event) {
      /** @const */ var tabKeyCode = 9;

      if (event.keyCode == tabKeyCode) {
        // If the "Shift" key is held, focus is being transferred backward in
        // the page.
        this.focusDirBackwards_ = event.shiftKey ? true : false;
      }
    },

    /**
     * Initializes the FocusManager by listening for events in the document.
     */
    initialize: function() {
      document.addEventListener('focus', this.onDocumentFocus_.bind(this),
          true);
      document.addEventListener('keydown', this.onDocumentKeyDown_.bind(this),
          true);
    },
  };

  return {
    FocusManager: FocusManager,
  };
});
