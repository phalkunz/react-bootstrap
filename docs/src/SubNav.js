import React, { cloneElement } from 'react';
import classNames from 'classnames';
import { splitBsProps } from '../../src/utils/bootstrapUtils';

import Nav from '../../src/Nav';
import SafeAnchor from '../../src/SafeAnchor';
import ValidComponentChildren from '../../src/utils/ValidComponentChildren';
import createChainedFunction from '../../src/utils/createChainedFunction';

const propTypes = {
  onSelect: React.PropTypes.func,
  active: React.PropTypes.bool,
  activeKey: React.PropTypes.any,
  activeHref: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  eventKey: React.PropTypes.any,
  href: React.PropTypes.string,
  text: React.PropTypes.node,
};

const defaultProps = {
  active: false,
  disabled: false,
};

class SubNav extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { onSelect, disabled, eventKey } = this.props;

    if (onSelect) {
      e.preventDefault();

      if (disabled) {
        return;
      }

      onSelect(eventKey, e);
    }
  }

  isActive({ props }, activeKey, activeHref) {
    if (
      props.active ||
      activeKey != null && props.eventKey === activeKey ||
      activeHref && props.href === activeHref
    ) {
      return true;
    }

    if (props.children) {
      return ValidComponentChildren.some(props.children, child => (
        this.isActive(child, activeKey, activeHref)
      ));
    }

    return props.active;
  }

  render() {
    const {
      onSelect,
      disabled,
      activeKey,
      activeHref,
      text,
      className,
      style,
      children,
      ...props,
    } = this.props;
    const [, elementProps] = splitBsProps(props);

    delete elementProps.active; // Accessed via this.isActive().
    delete elementProps.eventKey; // Accessed via this.isActive().

    const classes = {
      active: this.isActive(this, activeKey, activeHref),
      disabled,
    };

    return (
      <li className={classNames(className, classes)} style={style}>
        <SafeAnchor {...elementProps}>
          {text}
        </SafeAnchor>

        <Nav>
          {ValidComponentChildren.map(children, child => (
            cloneElement(child, {
              active: this.isActive(child, activeKey, activeHref),
              onSelect: createChainedFunction(child.props.onSelect, onSelect),
            })
          ))}
        </Nav>
      </li>
    );
  }
}

SubNav.propTypes = propTypes;
SubNav.defaultProps = defaultProps;

export default SubNav;
