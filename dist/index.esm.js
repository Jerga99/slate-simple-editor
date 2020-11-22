import { css, cx } from '@emotion/css';
import escapeHtml from 'escape-html';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createEditor, Editor, Node, Range, Text, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var it,
      normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n        position: relative;\n        padding: 1px 18px 17px;\n        margin: 0 -20px;\n        border-bottom: 2px solid #eee;\n        margin-bottom: 20px;\n      "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n        & > * {\n          display: inline-block;\n        }\n        & > * + * {\n          margin-left: 15px;\n        }\n      "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n        white-space: pre-wrap;\n        margin: 0 -20px 10px;\n        padding: 10px 20px;\n        font-size: 14px;\n        background: #f8f8e8;\n      "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n        font-size: 18px;\n        vertical-align: text-bottom;\n      "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n            color: #404040;\n            font: 12px monospace;\n            white-space: pre-wrap;\n            padding: 10px 20px;\n            div {\n              margin: 0 0 0.5em;\n            }\n          "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n            font-size: 14px;\n            padding: 5px 20px;\n            color: #404040;\n            border-top: 2px solid #eeeeee;\n            background: #f8f8f8;\n          "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n            margin: 30px -20px 0;\n          "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n          cursor: pointer;\n          color: ", ";\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var Button = React.forwardRef(function (_ref, ref) {
  var className = _ref.className,
      active = _ref.active,
      reversed = _ref.reversed,
      props = _objectWithoutProperties(_ref, ["className", "active", "reversed"]);

  return /*#__PURE__*/React.createElement("span", _extends({}, props, {
    ref: ref,
    className: cx(className, css(_templateObject(), reversed ? active ? 'white' : '#aaa' : active ? 'black' : '#ccc'))
  }));
});
var EditorValue = React.forwardRef(function (_ref2, ref) {
  var className = _ref2.className,
      value = _ref2.value,
      props = _objectWithoutProperties(_ref2, ["className", "value"]);

  var textLines = value.document.nodes.map(function (node) {
    return node.text;
  }).toArray().join('\n');
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, props, {
    className: cx(className, css(_templateObject2()))
  }), /*#__PURE__*/React.createElement("div", {
    className: css(_templateObject3())
  }, "Slate's value as text"), /*#__PURE__*/React.createElement("div", {
    className: css(_templateObject4())
  }, textLines));
});
var Icon = React.forwardRef(function (_ref3, ref) {
  var className = _ref3.className,
      props = _objectWithoutProperties(_ref3, ["className"]);

  return /*#__PURE__*/React.createElement("span", _extends({}, props, {
    ref: ref,
    className: cx('material-icons', className, css(_templateObject5()))
  }));
});
var Instruction = React.forwardRef(function (_ref4, ref) {
  var className = _ref4.className,
      props = _objectWithoutProperties(_ref4, ["className"]);

  return /*#__PURE__*/React.createElement("div", _extends({}, props, {
    ref: ref,
    className: cx(className, css(_templateObject6()))
  }));
});
var Menu = React.forwardRef(function (_ref5, ref) {
  var className = _ref5.className,
      props = _objectWithoutProperties(_ref5, ["className"]);

  return /*#__PURE__*/React.createElement("div", _extends({}, props, {
    ref: ref,
    className: cx(className, css(_templateObject7()))
  }));
});
var Portal = function Portal(_ref6) {
  var children = _ref6.children;
  return ReactDOM.createPortal(children, document.body);
};
var Toolbar = React.forwardRef(function (_ref7, ref) {
  var className = _ref7.className,
      props = _objectWithoutProperties(_ref7, ["className"]);

  return /*#__PURE__*/React.createElement(Menu, _extends({}, props, {
    ref: ref,
    className: cx(className, css(_templateObject8()))
  }));
});

var ELEMENT_TAGS = {
  BLOCKQUOTE: function BLOCKQUOTE() {
    return {
      type: 'block-quote'
    };
  },
  H1: function H1() {
    return {
      type: 'heading-one'
    };
  },
  H2: function H2() {
    return {
      type: 'heading-two'
    };
  },
  LI: function LI() {
    return {
      type: 'list-item'
    };
  },
  UL: function UL() {
    return {
      type: 'bulleted-list'
    };
  },
  OL: function OL() {
    return {
      type: 'numbered-list'
    };
  },
  P: function P() {
    return {
      type: 'paragraph'
    };
  }
}; // COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.

var TEXT_TAGS = {
  CODE: function CODE() {
    return {
      code: true
    };
  },
  EM: function EM() {
    return {
      italic: true
    };
  },
  STRONG: function STRONG() {
    return {
      bold: true
    };
  },
  U: function U() {
    return {
      underlined: true
    };
  }
};

var applyTag = function applyTag(node) {
  node.text = node.text && escapeHtml(node.text);

  if (node.bold) {
    node.text = "<strong>".concat(node.text, "</strong>");
  }

  if (node.italic) {
    node.text = "<em>".concat(node.text, "</em>");
  }

  if (node.underlined) {
    node.text = "<u>".concat(node.text, "</u>");
  }

  if (node.code) {
    node.text = "<code>".concat(node.text, "</code>");
  }

  return node.text;
};

var serialize = function serialize(node) {
  if (Text.isText(node)) {
    return applyTag(_objectSpread2({}, node));
  }

  var children = node.children.map(function (n) {
    return serialize(n);
  }).join('');

  switch (node.type) {
    case 'block-quote':
      return "<blockquote>".concat(children, "</blockquote>");

    case 'bulleted-list':
      return "<ul>".concat(children, "</ul>");

    case 'heading-one':
      return "<h1>".concat(children, "</h1>");

    case 'heading-two':
      return "<h2>".concat(children, "</h2>");

    case 'list-item':
      return "<li>".concat(children, "</li>");

    case 'numbered-list':
      return "<ol>".concat(children, "</ol>");

    case 'paragraph':
      return "<p>".concat(children, "</p>");

    default:
      return children;
  }
};

var deserialize = function deserialize(el) {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  var nodeName = el.nodeName;
  var parent = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
  }

  var children = Array.from(parent.childNodes).map(deserialize).flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    var attrs = ELEMENT_TAGS[nodeName](el);

    var _children = children.length === 0 ? [""] : children;

    return jsx('element', attrs, _children);
  }

  if (TEXT_TAGS[nodeName]) {
    var _attrs = TEXT_TAGS[nodeName](el);

    return children.map(function (child) {
      return jsx('text', _attrs, child);
    });
  }

  return children;
};

var isBlockActive = function isBlockActive(editor, format) {
  var _Editor$nodes = Editor.nodes(editor, {
    match: function match(n) {
      return n.type === format;
    }
  }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      match = _Editor$nodes2[0];

  return !!match;
};

var isFormatActive = function isFormatActive(editor, format) {
  var _Editor$nodes3 = Editor.nodes(editor, {
    match: function match(n) {
      return n[format] === true;
    },
    mode: 'all'
  }),
      _Editor$nodes4 = _slicedToArray(_Editor$nodes3, 1),
      match = _Editor$nodes4[0];

  return !!match;
};

var toggleFormat = function toggleFormat(editor, format) {
  var isActive = isFormatActive(editor, format);
  Transforms.setNodes(editor, _defineProperty({}, format, isActive ? null : true), {
    match: Text.isText,
    split: true
  });
};

var LIST_TYPES = ['numbered-list', 'bulleted-list'];

var toggleBlock = function toggleBlock(editor, format) {
  var isActive = isBlockActive(editor, format);
  var isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: function match(n) {
      return LIST_TYPES.includes(n.type);
    },
    split: true
  });
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  });

  if (!isActive && isList) {
    var block = {
      type: format,
      children: []
    };
    Transforms.wrapNodes(editor, block);
  }
};

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n          padding: 8px 7px 6px;\n          position: absolute;\n          z-index: 1;\n          top: -10000px;\n          left: -10000px;\n          margin-top: -6px;\n          opacity: 0;\n          background-color: #222;\n          border-radius: 4px;\n          transition: opacity 0.75s;\n        "]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}

var BlockButton = function BlockButton(_ref) {
  var format = _ref.format,
      icon = _ref.icon;
  var editor = useSlate();
  return /*#__PURE__*/React.createElement(Button, {
    reversed: true,
    active: isBlockActive(editor, format),
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();
      toggleBlock(editor, format);
    }
  }, /*#__PURE__*/React.createElement(Icon, null, icon));
};

var FormatButton = function FormatButton(_ref2) {
  var format = _ref2.format,
      icon = _ref2.icon;
  var editor = useSlate();
  return /*#__PURE__*/React.createElement(Button, {
    reversed: true,
    active: isFormatActive(editor, format),
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();
      toggleFormat(editor, format);
    }
  }, /*#__PURE__*/React.createElement(Icon, null, icon));
};

var HoveringToolbar = function HoveringToolbar() {
  var ref = useRef();
  var editor = useSlate();
  useEffect(function () {
    var el = ref.current;
    var selection = editor.selection;

    if (!el) {
      return;
    }

    if (!selection || !ReactEditor.isFocused(editor) || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      el.removeAttribute('style');
      return;
    }

    var domSelection = window.getSelection();
    var domRange = domSelection.getRangeAt(0);
    var rect = domRange.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.top = "".concat(rect.top + window.pageYOffset - el.offsetHeight, "px");
    el.style.left = "".concat(rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2, "px");
  });
  return /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement(Menu, {
    ref: ref,
    className: css(_templateObject$1())
  }, /*#__PURE__*/React.createElement(FormatButton, {
    format: "bold",
    icon: "format_bold"
  }), /*#__PURE__*/React.createElement(FormatButton, {
    format: "italic",
    icon: "format_italic"
  }), /*#__PURE__*/React.createElement(FormatButton, {
    format: "underlined",
    icon: "format_underlined"
  }), /*#__PURE__*/React.createElement(FormatButton, {
    format: "code",
    icon: "code"
  }), /*#__PURE__*/React.createElement(BlockButton, {
    format: "heading-one",
    icon: "looks_one"
  }), /*#__PURE__*/React.createElement(BlockButton, {
    format: "heading-two",
    icon: "looks_two"
  }), /*#__PURE__*/React.createElement(BlockButton, {
    format: "block-quote",
    icon: "format_quote"
  }), /*#__PURE__*/React.createElement(BlockButton, {
    format: "numbered-list",
    icon: "format_list_numbered"
  }), /*#__PURE__*/React.createElement(BlockButton, {
    format: "bulleted-list",
    icon: "format_list_bulleted"
  })));
};

var Leaf = function Leaf(_ref) {
  var attributes = _ref.attributes,
      children = _ref.children,
      leaf = _ref.leaf;

  if (leaf.bold) {
    children = /*#__PURE__*/React.createElement("strong", null, children);
  }

  if (leaf.italic) {
    children = /*#__PURE__*/React.createElement("em", null, children);
  }

  if (leaf.underlined) {
    children = /*#__PURE__*/React.createElement("u", null, children);
  }

  if (leaf.code) {
    children = /*#__PURE__*/React.createElement("code", null, children);
  }

  return /*#__PURE__*/React.createElement("span", attributes, children);
};

var Element = function Element(_ref2) {
  var attributes = _ref2.attributes,
      children = _ref2.children,
      element = _ref2.element;

  switch (element.type) {
    case 'block-quote':
      return /*#__PURE__*/React.createElement("blockquote", attributes, children);

    case 'bulleted-list':
      return /*#__PURE__*/React.createElement("ul", attributes, children);

    case 'heading-one':
      return /*#__PURE__*/React.createElement("h1", attributes, children);

    case 'heading-two':
      return /*#__PURE__*/React.createElement("h2", attributes, children);

    case 'list-item':
      return /*#__PURE__*/React.createElement("li", attributes, children);

    case 'numbered-list':
      return /*#__PURE__*/React.createElement("ol", attributes, children);

    case 'paragraph':
      return /*#__PURE__*/React.createElement("p", attributes, children);

    default:
      return /*#__PURE__*/React.createElement("p", attributes, children);
  }
};

var withLayout = function withLayout(editor, value) {
  var normalizeNode = editor.normalizeNode;

  editor.normalizeNode = function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        node = _ref4[0],
        path = _ref4[1];

    if (path.length === 0) {
      if (editor.children.length < 1) {
        var title = {
          type: 'heading-one',
          children: [{
            text: ''
          }]
        };
        Transforms.insertNodes(editor, title, {
          at: path.concat(0)
        });
      }

      if (editor.children.length < 2) {
        var subtitle = {
          type: 'heading-two',
          children: [{
            text: ''
          }]
        };
        Transforms.insertNodes(editor, subtitle, {
          at: path.concat(1)
        });
      }

      if (editor.children.length < 3) {
        var paragraph = {
          type: 'paragraph',
          children: [{
            text: ''
          }]
        };
        Transforms.insertNodes(editor, paragraph, {
          at: path.concat(2)
        });
      }

      var _iterator = _createForOfIteratorHelper(Node.children(editor, path)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              child = _step$value[0],
              childPath = _step$value[1];

          var type = childPath[0] === 0 ? 'heading-one' : childPath[0] === 1 ? 'heading-two' : 'paragraph';
          var canAdd = childPath[0] === 0 || childPath[0] === 1 || childPath[0] === 2;

          if (canAdd && child.type !== type) {
            Transforms.setNodes(editor, {
              type: type
            }, {
              at: childPath
            });
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

var BlogEditor = function BlogEditor(_ref5) {
  var _ref5$saveMessage = _ref5.saveMessage,
      saveMessage = _ref5$saveMessage === void 0 ? "saving..." : _ref5$saveMessage,
      onSave = _ref5.onSave,
      _ref5$header = _ref5.header,
      header = _ref5$header === void 0 ? "Write your story" : _ref5$header,
      loading = _ref5.loading,
      initialContent = _ref5.initialContent;

  var _useState = useState(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var editor = useMemo(function () {
    return withLayout(withHistory(withReact(createEditor())));
  }, []);
  var renderElement = useCallback(function (props) {
    return /*#__PURE__*/React.createElement(Element, props);
  }, []);
  var renderLeaf = useCallback(function (props) {
    return /*#__PURE__*/React.createElement(Leaf, props);
  }, []);
  useEffect(function () {
    if (initialContent) {
      var document = new DOMParser().parseFromString(initialContent, 'text/html');
      var deserialized = deserialize(document.body);

      if (deserialized && deserialized.length === 1 && deserialized[0].text) {
        deserialized[0].children = [_objectSpread2({}, deserialized[0])];
        deserialized[0].type = 'paragraph';
        delete deserialized[0].text;
        setValue([].concat(initialValue, _toConsumableArray(deserialized)));
      } else {
        setValue(deserialize(document.body));
      }
    }
  }, [initialContent]);

  var save = function save() {
    var serialized = serialize({
      children: value
    });
    var title = value[0] && value[0].children.map(function (n) {
      return n.text;
    }).join('') || '';
    var subTitle = value[1] && value[1].children.map(function (n) {
      return n.text;
    }).join('') || '';
    onSave({
      content: serialized,
      title: title,
      subTitle: subTitle
    });
  };

  var onKeyDown = function onKeyDown(event) {
    if (!loading && event.which === 83 && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      save();
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "slate-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-title"
  }, header), /*#__PURE__*/React.createElement("div", {
    className: "save-button-container"
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "save-message"
  }, saveMessage), /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: "btn btn-success"
  }, "Save"))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: value,
    onChange: function onChange(value) {
      return setValue(value);
    }
  }, /*#__PURE__*/React.createElement(HoveringToolbar, null), /*#__PURE__*/React.createElement(Editable, {
    renderElement: renderElement,
    renderLeaf: renderLeaf,
    onKeyDown: onKeyDown
  }), /*#__PURE__*/React.createElement("style", null, "\n            @import url(\"https://fonts.googleapis.com/icon?family=Material+Icons\");\n          ")));
};

var initialValue = [{
  type: 'heading-one',
  children: [{
    text: 'Title'
  }]
}, {
  type: 'heading-two',
  children: [{
    text: 'Subtitle'
  }]
}];

var SlateView = function SlateView(_ref) {
  var initialContent = _ref.initialContent;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var editor = useMemo(function () {
    return withReact(createEditor());
  }, []);
  var renderElement = useCallback(function (props) {
    return /*#__PURE__*/React.createElement(Element, props);
  }, []);
  var renderLeaf = useCallback(function (props) {
    return /*#__PURE__*/React.createElement(Leaf, props);
  }, []);

  var Leaf = function Leaf(_ref2) {
    var attributes = _ref2.attributes,
        children = _ref2.children,
        leaf = _ref2.leaf;

    if (leaf.bold) {
      children = /*#__PURE__*/React.createElement("strong", null, children);
    }

    if (leaf.italic) {
      children = /*#__PURE__*/React.createElement("em", null, children);
    }

    if (leaf.underlined) {
      children = /*#__PURE__*/React.createElement("u", null, children);
    }

    if (leaf.code) {
      children = /*#__PURE__*/React.createElement("code", null, children);
    }

    return /*#__PURE__*/React.createElement("span", attributes, children);
  };

  var Element = function Element(_ref3) {
    var attributes = _ref3.attributes,
        children = _ref3.children,
        element = _ref3.element;

    switch (element.type) {
      case 'block-quote':
        return /*#__PURE__*/React.createElement("blockquote", attributes, children);

      case 'bulleted-list':
        return /*#__PURE__*/React.createElement("ul", attributes, children);

      case 'heading-one':
        return /*#__PURE__*/React.createElement("h1", attributes, children);

      case 'heading-two':
        return /*#__PURE__*/React.createElement("h2", attributes, children);

      case 'list-item':
        return /*#__PURE__*/React.createElement("li", attributes, children);

      case 'numbered-list':
        return /*#__PURE__*/React.createElement("ol", attributes, children);

      case 'paragraph':
        return /*#__PURE__*/React.createElement("p", attributes, children);

      default:
        return /*#__PURE__*/React.createElement("p", attributes, children);
    }
  };

  useEffect(function () {
    if (initialContent) {
      var document = new DOMParser().parseFromString(initialContent, 'text/html');
      setValue(deserialize(document.body));
    }
  }, [initialContent]);
  return /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: value,
    onChange: function onChange(value) {
      return setValue(value);
    }
  }, /*#__PURE__*/React.createElement(Editable, {
    readOnly: true,
    renderElement: renderElement,
    renderLeaf: renderLeaf
  }));
};

export { BlogEditor as Editor, SlateView };
