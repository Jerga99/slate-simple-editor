'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var slateReact = require('slate-react');
var slateHistory = require('slate-history');
var slate = require('slate');
var ReactDOM = _interopDefault(require('react-dom'));
var emotion = require('emotion');
var slateHyperscript = require('slate-hyperscript');
var escapeHtml = _interopDefault(require('escape-html'));

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

const Button = React__default.forwardRef(({
  className,
  active,
  reversed,
  ...props
}, ref) => /*#__PURE__*/React__default.createElement("span", _extends({}, props, {
  ref: ref,
  className: emotion.cx(className, emotion.css`
          cursor: pointer;
          color: ${reversed ? active ? 'white' : '#aaa' : active ? 'black' : '#ccc'};
        `)
})));
const EditorValue = React__default.forwardRef(({
  className,
  value,
  ...props
}, ref) => {
  const textLines = value.document.nodes.map(node => node.text).toArray().join('\n');
  return /*#__PURE__*/React__default.createElement("div", _extends({
    ref: ref
  }, props, {
    className: emotion.cx(className, emotion.css`
            margin: 30px -20px 0;
          `)
  }), /*#__PURE__*/React__default.createElement("div", {
    className: emotion.css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `
  }, "Slate's value as text"), /*#__PURE__*/React__default.createElement("div", {
    className: emotion.css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `
  }, textLines));
});
const Icon = React__default.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React__default.createElement("span", _extends({}, props, {
  ref: ref,
  className: emotion.cx('material-icons', className, emotion.css`
        font-size: 18px;
        vertical-align: text-bottom;
      `)
})));
const Instruction = React__default.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React__default.createElement("div", _extends({}, props, {
  ref: ref,
  className: emotion.cx(className, emotion.css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `)
})));
const Menu = React__default.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React__default.createElement("div", _extends({}, props, {
  ref: ref,
  className: emotion.cx(className, emotion.css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `)
})));
const Portal = ({
  children
}) => {
  return ReactDOM.createPortal(children, document.body);
};
const Toolbar = React__default.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React__default.createElement(Menu, _extends({}, props, {
  ref: ref,
  className: emotion.cx(className, emotion.css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `)
})));

const ELEMENT_TAGS = {
  BLOCKQUOTE: () => ({
    type: 'block-quote'
  }),
  H1: () => ({
    type: 'heading-one'
  }),
  H2: () => ({
    type: 'heading-two'
  }),
  LI: () => ({
    type: 'list-item'
  }),
  UL: () => ({
    type: 'bulleted-list'
  }),
  OL: () => ({
    type: 'numbered-list'
  }),
  P: () => ({
    type: 'paragraph'
  })
}; // COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.

const TEXT_TAGS = {
  CODE: () => ({
    code: true
  }),
  EM: () => ({
    italic: true
  }),
  STRONG: () => ({
    bold: true
  }),
  U: () => ({
    underlined: true
  })
};

const applyTag = node => {
  node.text = node.text && escapeHtml(node.text);

  if (node.bold) {
    node.text = `<strong>${node.text}</strong>`;
  }

  if (node.italic) {
    node.text = `<em>${node.text}</em>`;
  }

  if (node.underlined) {
    node.text = `<u>${node.text}</u>`;
  }

  if (node.code) {
    node.text = `<code>${node.text}</code>`;
  }

  return node.text;
};

const serialize = node => {
  if (slate.Text.isText(node)) {
    return applyTag({ ...node
    });
  }

  const children = node.children.map(n => serialize(n)).join('');

  switch (node.type) {
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`;

    case 'bulleted-list':
      return `<ul>${children}</ul>`;

    case 'heading-one':
      return `<h1>${children}</h1>`;

    case 'heading-two':
      return `<h2>${children}</h2>`;

    case 'list-item':
      return `<li>${children}</li>`;

    case 'numbered-list':
      return `<ol>${children}</ol>`;

    case 'paragraph':
      return `<p>${children}</p>`;

    default:
      return children;
  }
};

const deserialize = el => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const {
    nodeName
  } = el;
  let parent = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
  }

  const children = Array.from(parent.childNodes).map(deserialize).flat();

  if (el.nodeName === 'BODY') {
    return slateHyperscript.jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);

    const _children = children.length === 0 ? [""] : children;

    return slateHyperscript.jsx('element', attrs, _children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map(child => slateHyperscript.jsx('text', attrs, child));
  }

  return children;
};

const isBlockActive = (editor, format) => {
  const [match] = slate.Editor.nodes(editor, {
    match: n => n.type === format
  });
  return !!match;
};

const isFormatActive = (editor, format) => {
  const [match] = slate.Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all'
  });
  return !!match;
};

const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  slate.Transforms.setNodes(editor, {
    [format]: isActive ? null : true
  }, {
    match: slate.Text.isText,
    split: true
  });
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  slate.Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });
  slate.Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  });

  if (!isActive && isList) {
    const block = {
      type: format,
      children: []
    };
    slate.Transforms.wrapNodes(editor, block);
  }
};

const BlockButton = ({
  format,
  icon
}) => {
  const editor = slateReact.useSlate();
  return /*#__PURE__*/React__default.createElement(Button, {
    reversed: true,
    active: isBlockActive(editor, format),
    onMouseDown: event => {
      event.preventDefault();
      toggleBlock(editor, format);
    }
  }, /*#__PURE__*/React__default.createElement(Icon, null, icon));
};

const FormatButton = ({
  format,
  icon
}) => {
  const editor = slateReact.useSlate();
  return /*#__PURE__*/React__default.createElement(Button, {
    reversed: true,
    active: isFormatActive(editor, format),
    onMouseDown: event => {
      event.preventDefault();
      toggleFormat(editor, format);
    }
  }, /*#__PURE__*/React__default.createElement(Icon, null, icon));
};

const HoveringToolbar = () => {
  const ref = React.useRef();
  const editor = slateReact.useSlate();
  React.useEffect(() => {
    const el = ref.current;
    const {
      selection
    } = editor;

    if (!el) {
      return;
    }

    if (!selection || !slateReact.ReactEditor.isFocused(editor) || slate.Range.isCollapsed(selection) || slate.Editor.string(editor, selection) === '') {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });
  return /*#__PURE__*/React__default.createElement(Portal, null, /*#__PURE__*/React__default.createElement(Menu, {
    ref: ref,
    className: emotion.css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `
  }, /*#__PURE__*/React__default.createElement(FormatButton, {
    format: "bold",
    icon: "format_bold"
  }), /*#__PURE__*/React__default.createElement(FormatButton, {
    format: "italic",
    icon: "format_italic"
  }), /*#__PURE__*/React__default.createElement(FormatButton, {
    format: "underlined",
    icon: "format_underlined"
  }), /*#__PURE__*/React__default.createElement(FormatButton, {
    format: "code",
    icon: "code"
  }), /*#__PURE__*/React__default.createElement(BlockButton, {
    format: "heading-one",
    icon: "looks_one"
  }), /*#__PURE__*/React__default.createElement(BlockButton, {
    format: "heading-two",
    icon: "looks_two"
  }), /*#__PURE__*/React__default.createElement(BlockButton, {
    format: "block-quote",
    icon: "format_quote"
  }), /*#__PURE__*/React__default.createElement(BlockButton, {
    format: "numbered-list",
    icon: "format_list_numbered"
  }), /*#__PURE__*/React__default.createElement(BlockButton, {
    format: "bulleted-list",
    icon: "format_list_bulleted"
  })));
};

const Leaf = ({
  attributes,
  children,
  leaf
}) => {
  if (leaf.bold) {
    children = /*#__PURE__*/React__default.createElement("strong", null, children);
  }

  if (leaf.italic) {
    children = /*#__PURE__*/React__default.createElement("em", null, children);
  }

  if (leaf.underlined) {
    children = /*#__PURE__*/React__default.createElement("u", null, children);
  }

  if (leaf.code) {
    children = /*#__PURE__*/React__default.createElement("code", null, children);
  }

  return /*#__PURE__*/React__default.createElement("span", attributes, children);
};

const Element = ({
  attributes,
  children,
  element
}) => {
  switch (element.type) {
    case 'block-quote':
      return /*#__PURE__*/React__default.createElement("blockquote", attributes, children);

    case 'bulleted-list':
      return /*#__PURE__*/React__default.createElement("ul", attributes, children);

    case 'heading-one':
      return /*#__PURE__*/React__default.createElement("h1", attributes, children);

    case 'heading-two':
      return /*#__PURE__*/React__default.createElement("h2", attributes, children);

    case 'list-item':
      return /*#__PURE__*/React__default.createElement("li", attributes, children);

    case 'numbered-list':
      return /*#__PURE__*/React__default.createElement("ol", attributes, children);

    case 'paragraph':
      return /*#__PURE__*/React__default.createElement("p", attributes, children);

    default:
      return /*#__PURE__*/React__default.createElement("p", attributes, children);
  }
};

const withLayout = (editor, value) => {
  const {
    normalizeNode
  } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title = {
          type: 'heading-one',
          children: [{
            text: ''
          }]
        };
        slate.Transforms.insertNodes(editor, title, {
          at: path.concat(0)
        });
      }

      if (editor.children.length < 2) {
        const subtitle = {
          type: 'heading-two',
          children: [{
            text: ''
          }]
        };
        slate.Transforms.insertNodes(editor, subtitle, {
          at: path.concat(1)
        });
      }

      if (editor.children.length < 3) {
        const paragraph = {
          type: 'paragraph',
          children: [{
            text: ''
          }]
        };
        slate.Transforms.insertNodes(editor, paragraph, {
          at: path.concat(2)
        });
      }

      for (const [child, childPath] of slate.Node.children(editor, path)) {
        const type = childPath[0] === 0 ? 'heading-one' : childPath[0] === 1 ? 'heading-two' : 'paragraph';
        const canAdd = childPath[0] === 0 || childPath[0] === 1 || childPath[0] === 2;

        if (canAdd && child.type !== type) {
          slate.Transforms.setNodes(editor, {
            type
          }, {
            at: childPath
          });
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

const BlogEditor = ({
  saveMessage = "saving...",
  onSave,
  header = "Write your story",
  loading,
  initialContent
}) => {
  const [value, setValue] = React.useState(initialValue);
  const editor = React.useMemo(() => withLayout(slateHistory.withHistory(slateReact.withReact(slate.createEditor()))), []);
  const renderElement = React.useCallback(props => /*#__PURE__*/React__default.createElement(Element, props), []);
  const renderLeaf = React.useCallback(props => /*#__PURE__*/React__default.createElement(Leaf, props), []);
  React.useEffect(() => {
    if (initialContent) {
      const document = new DOMParser().parseFromString(initialContent, 'text/html');
      const deserialized = deserialize(document.body);

      if (deserialized && deserialized.length === 1 && deserialized[0].text) {
        deserialized[0].children = [{ ...deserialized[0]
        }];
        deserialized[0].type = 'paragraph';
        delete deserialized[0].text;
        setValue([...initialValue, ...deserialized]);
      } else {
        setValue(deserialize(document.body));
      }
    }
  }, [initialContent]);

  const save = () => {
    const serialized = serialize({
      children: value
    });
    const title = value[0] && value[0].children.map(n => n.text).join('') || '';
    const subTitle = value[1] && value[1].children.map(n => n.text).join('') || '';
    onSave({
      content: serialized,
      title,
      subTitle
    });
  };

  const onKeyDown = event => {
    if (!loading && event.which === 83 && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      save();
    }
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "slate-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "editor-header"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "editor-title"
  }, header), /*#__PURE__*/React__default.createElement("div", {
    className: "save-button-container"
  }, loading && /*#__PURE__*/React__default.createElement("div", {
    className: "save-message"
  }, saveMessage), /*#__PURE__*/React__default.createElement("button", {
    onClick: save,
    className: "btn btn-success"
  }, "Save"))), /*#__PURE__*/React__default.createElement("hr", null), /*#__PURE__*/React__default.createElement(slateReact.Slate, {
    editor: editor,
    value: value,
    onChange: value => setValue(value)
  }, /*#__PURE__*/React__default.createElement(HoveringToolbar, null), /*#__PURE__*/React__default.createElement(slateReact.Editable, {
    renderElement: renderElement,
    renderLeaf: renderLeaf,
    onKeyDown: onKeyDown
  }), /*#__PURE__*/React__default.createElement("style", null, `
            @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
          `)));
};

const initialValue = [{
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

const SlateView = ({
  initialContent
}) => {
  const [value, setValue] = React.useState([]);
  const editor = React.useMemo(() => slateReact.withReact(slate.createEditor()), []);
  const renderElement = React.useCallback(props => /*#__PURE__*/React__default.createElement(Element, props), []);
  const renderLeaf = React.useCallback(props => /*#__PURE__*/React__default.createElement(Leaf, props), []);

  const Leaf = ({
    attributes,
    children,
    leaf
  }) => {
    if (leaf.bold) {
      children = /*#__PURE__*/React__default.createElement("strong", null, children);
    }

    if (leaf.italic) {
      children = /*#__PURE__*/React__default.createElement("em", null, children);
    }

    if (leaf.underlined) {
      children = /*#__PURE__*/React__default.createElement("u", null, children);
    }

    if (leaf.code) {
      children = /*#__PURE__*/React__default.createElement("code", null, children);
    }

    return /*#__PURE__*/React__default.createElement("span", attributes, children);
  };

  const Element = ({
    attributes,
    children,
    element
  }) => {
    switch (element.type) {
      case 'block-quote':
        return /*#__PURE__*/React__default.createElement("blockquote", attributes, children);

      case 'bulleted-list':
        return /*#__PURE__*/React__default.createElement("ul", attributes, children);

      case 'heading-one':
        return /*#__PURE__*/React__default.createElement("h1", attributes, children);

      case 'heading-two':
        return /*#__PURE__*/React__default.createElement("h2", attributes, children);

      case 'list-item':
        return /*#__PURE__*/React__default.createElement("li", attributes, children);

      case 'numbered-list':
        return /*#__PURE__*/React__default.createElement("ol", attributes, children);

      case 'paragraph':
        return /*#__PURE__*/React__default.createElement("p", attributes, children);

      default:
        return /*#__PURE__*/React__default.createElement("p", attributes, children);
    }
  };

  React.useEffect(() => {
    if (initialContent) {
      const document = new DOMParser().parseFromString(initialContent, 'text/html');
      setValue(deserialize(document.body));
    }
  }, [initialContent]);
  return /*#__PURE__*/React__default.createElement(slateReact.Slate, {
    editor: editor,
    value: value,
    onChange: value => setValue(value)
  }, /*#__PURE__*/React__default.createElement(slateReact.Editable, {
    readOnly: true,
    renderElement: renderElement,
    renderLeaf: renderLeaf
  }));
};

exports.Editor = BlogEditor;
exports.SlateView = SlateView;
