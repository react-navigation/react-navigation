import React from 'react';
const Markdown = require('react-markdown');
import Link from './Link';
import PhoneGraphic from './PhoneGraphic';
const slugify = require('slugify');
import CodeBlock from './CodeBlock';

const safeString = s => slugify(s).replace(/\)/g, '-').replace(/\(/g, '-').replace(/^-/,'').replace(/-$/,'');

const getHeadingForLevel = (level) => {
  switch (level) {
    case 2:
      return 'h2';
    case 3:
      return 'h3';
    case 4:
      return 'h4';
    case 5:
      return 'h5';
    case 6:
      return 'h6';
    case 7:
      return 'h7';
    default:
    case 1:
      return 'h1';
  }
};

const isDefined = (obj) => obj !== undefined;

const getDocsMD = (docPath, navigation) => {
  const { state } = navigation;
  const docVersion = (isDefined(state) && isDefined(state.params))
    ? state.params.version
    : 'edge';
  const DocsMD = require(`../docs/${docVersion}.json`);
  return DocsMD[docPath];
};

const MDPage = ({navigation, docPath}) => (
  <Markdown
    source={getDocsMD(docPath, navigation)}
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
        const Header = getHeadingForLevel(level);
        return (
          <Header id={id} className="md-header">
            {children} <a href={`#${id}`} title={children}>#</a>
          </Header>
        );
      },
      link: ({children, href}) => {
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
