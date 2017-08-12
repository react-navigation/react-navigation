import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

const CodeBlock = ({ code }) =>
  <pre>
    <code
      dangerouslySetInnerHTML={{
        __html: Prism.highlight(code, Prism.languages.jsx),
      }}
    />
  </pre>;

export default CodeBlock;
