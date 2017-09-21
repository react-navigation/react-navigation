import React from 'react';
const Markdown = require('react-markdown');
const DocsMD = require('../docs-dist.json');
import Link from './Link';
import PhoneGraphic from './PhoneGraphic';
const slugify = require('slugify');
import CodeBlock from './CodeBlock';

const safeString = s =>
  slugify(s)
    .replace(/\)/g, '-')
    .replace(/\(/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');

const getHeadingForLevel = level => {
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

const MDPage = ({ navigation, docPath }) =>
  <Markdown
    source={DocsMD[docPath]}
    className="md-section"
    renderers={{
      CodeBlock: function CodeBlockComponent({ literal, language }) {
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
        return <CodeBlock code={literal} />;
      },
      Heading: function HeadingComponent({ level, children }) {
        let id = React.Children
          .map(children, child => {
            if (typeof child === 'string') {
              return safeString(child);
            } else if (typeof child.props.children === 'string') {
              return safeString(child.props.children);
            }
          })
          .join('-');
        const Header = getHeadingForLevel(level);
        const linkHeader = id ? '' : 'link-header';
        const className = `md-header ${linkHeader}`;
        return (
          <Header id={id} className={className}>
            {children}{' '}
            <a href={`#${id}`} title={children}>
              #
            </a>
          </Header>
        );
      },
      link: function LinkComponent({ children, href }) {
        if (href.indexOf('PhoneGraphic:') === 0) {
          const graphicName = href.split('PhoneGraphic:')[1];
        }
        return (
          <Link href={href}>
            {children}
          </Link>
        );
      },
    }}
  />;

export default MDPage;
