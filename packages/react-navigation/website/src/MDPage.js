
import React from 'react';
const Markdown = require('react-markdown');
const DocsMD = require('../docs-dist.json');
import Link from './Link';
import PhoneGraphic from './PhoneGraphic';
const slugify = require('slugify');
import CodeBlock from './CodeBlock';

const safeString = s => slugify(s).replace(/\)/g, '-').replace(/\(/g, '-').replace(/^-/,'').replace(/-$/,'');

const MDPage = ({navigation, docPath}) => (
  <Markdown
    source={DocsMD[docPath]}
    className="md-section"
    renderers={{
      CodeBlock: ({literal, language}) => {
        if (language === 'phone-example') {
          const graphicName = literal.trim();
          return (
            <PhoneGraphic
              alt
              sources={{
                iphone: `/assets/examples/${graphicName}-iphone.png`,
                android: `/assets/examples/${graphicName}-android.png`,
              }}
            />
          );
        }
        return (
          <CodeBlock code={literal} />
        );
      },
      Heading: ({level, children}) => {
        let id = React.Children.map(children, (child) => {
          if (typeof child === 'string') {
            return safeString(child);
          } else if (typeof child.props.children === 'string') {
            return safeString(child.props.children);
          }
        }).join('-');
        switch (level) {
          case 2:
            return <h2 id={id}>{children}</h2>;
          case 3:
            return <h3 id={id}>{children}</h3>;
          case 4:
            return <h4 id={id}>{children}</h4>;
          case 5:
            return <h5 id={id}>{children}</h5>;
          case 6:
            return <h6 id={id}>{children}</h6>;
          case 7:
            return <h7 id={id}>{children}</h7>;
          default:
          case 1:
            return <h1 id={id}>{children}</h1>;
        }
      },
      link: ({children, href}) => {
        if (href.indexOf('PhoneGraphic:') === 0) {
          const graphicName = href.split('PhoneGraphic:')[1];

        }
        return (
          <Link
            children={children}
            href={href}
          />
        );
      },
    }}
  />
);

export default MDPage;
