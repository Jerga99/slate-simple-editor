import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useSlate, ReactEditor, withReact, Slate, Editable } from 'slate-react';
import { withHistory } from 'slate-history';
import { Text, Editor, Transforms, Range, createEditor, Node } from 'slate';
import ReactDOM from 'react-dom';
import { cx, css } from 'emotion';
import { jsx } from 'slate-hyperscript';
import escapeHtml from 'escape-html';

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

const Button = /*#__PURE__*/React.forwardRef(({
  className,
  active,
  reversed,
  ...props
}, ref) => /*#__PURE__*/React.createElement("span", _extends({}, props, {
  ref: ref,
  className: cx(className, css`
          cursor: pointer;
          color: ${reversed ? active ? 'white' : '#aaa' : active ? 'black' : '#ccc'};
        `)
})));
const Icon = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("span", _extends({}, props, {
  ref: ref,
  className: cx('material-icons', className, css`
        font-size: 18px;
        vertical-align: text-bottom;
      `)
})));
const Menu = /*#__PURE__*/React.forwardRef(({
  className,
  ...props
}, ref) => /*#__PURE__*/React.createElement("div", _extends({}, props, {
  ref: ref,
  className: cx(className, css`
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
  return /*#__PURE__*/ReactDOM.createPortal(children, document.body);
};

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
  if (Text.isText(node)) {
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
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);

    const _children = children.length === 0 ? [""] : children;

    return jsx('element', attrs, _children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map(child => jsx('text', attrs, child));
  }

  return children;
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });
  return !!match;
};

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all'
  });
  return !!match;
};

const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(editor, {
    [format]: isActive ? null : true
  }, {
    match: Text.isText,
    split: true
  });
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  });

  if (!isActive && isList) {
    const block = {
      type: format,
      children: []
    };
    Transforms.wrapNodes(editor, block);
  }
};

const BlockButton = ({
  format,
  icon
}) => {
  const editor = useSlate();
  return /*#__PURE__*/React.createElement(Button, {
    reversed: true,
    active: isBlockActive(editor, format),
    onMouseDown: event => {
      event.preventDefault();
      toggleBlock(editor, format);
    }
  }, /*#__PURE__*/React.createElement(Icon, null, icon));
};

const FormatButton = ({
  format,
  icon
}) => {
  const editor = useSlate();
  return /*#__PURE__*/React.createElement(Button, {
    reversed: true,
    active: isFormatActive(editor, format),
    onMouseDown: event => {
      event.preventDefault();
      toggleFormat(editor, format);
    }
  }, /*#__PURE__*/React.createElement(Icon, null, icon));
};

const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate();
  useEffect(() => {
    const el = ref.current;
    const {
      selection
    } = editor;

    if (!el) {
      return;
    }

    if (!selection || !ReactEditor.isFocused(editor) || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
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
  return /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement(Menu, {
    ref: ref,
    className: css`
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

const Leaf = ({
  attributes,
  children,
  leaf
}) => {
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

const Element = ({
  attributes,
  children,
  element
}) => {
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
        Transforms.insertNodes(editor, title, {
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
        Transforms.insertNodes(editor, subtitle, {
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
        Transforms.insertNodes(editor, paragraph, {
          at: path.concat(2)
        });
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        const type = childPath[0] === 0 ? 'heading-one' : childPath[0] === 1 ? 'heading-two' : 'paragraph';
        const canAdd = childPath[0] === 0 || childPath[0] === 1 || childPath[0] === 2;

        if (canAdd && child.type !== type) {
          Transforms.setNodes(editor, {
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
  const [value, setValue] = useState(initialValue);
  const editor = useMemo(() => withLayout(withHistory(withReact(createEditor()))), []);
  const renderElement = useCallback(props => /*#__PURE__*/React.createElement(Element, props), []);
  const renderLeaf = useCallback(props => /*#__PURE__*/React.createElement(Leaf, props), []);
  useEffect(() => {
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
    onChange: value => setValue(value)
  }, /*#__PURE__*/React.createElement(HoveringToolbar, null), /*#__PURE__*/React.createElement(Editable, {
    renderElement: renderElement,
    renderLeaf: renderLeaf,
    onKeyDown: onKeyDown
  }), /*#__PURE__*/React.createElement("style", null, `
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
  const [value, setValue] = useState([]);
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback(props => /*#__PURE__*/React.createElement(Element, props), []);
  const renderLeaf = useCallback(props => /*#__PURE__*/React.createElement(Leaf, props), []);

  const Leaf = ({
    attributes,
    children,
    leaf
  }) => {
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

  const Element = ({
    attributes,
    children,
    element
  }) => {
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

  useEffect(() => {
    if (initialContent) {
      const document = new DOMParser().parseFromString(initialContent, 'text/html');
      setValue(deserialize(document.body));
    }
  }, [initialContent]);
  return /*#__PURE__*/React.createElement(Slate, {
    editor: editor,
    value: value,
    onChange: value => setValue(value)
  }, /*#__PURE__*/React.createElement(Editable, {
    readOnly: true,
    renderElement: renderElement,
    renderLeaf: renderLeaf
  }));
};

export { BlogEditor as Editor, SlateView };
