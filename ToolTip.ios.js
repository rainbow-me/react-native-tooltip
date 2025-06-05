'use strict';

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  requireNativeComponent,
  TouchableHighlight,
  View,
  NativeModules,
  findNodeHandle,
} from 'react-native';

const ToolTipMenu = NativeModules.ToolTipMenu;
const RCTToolTipText = requireNativeComponent('RCTToolTipText', null);

export default class ToolTip extends PureComponent {
    static propTypes = {
        actions: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            onPress: PropTypes.func
        })),
        arrowDirection: PropTypes.oneOf(['up', 'down', 'left', 'right', 'default']),
        longPress: PropTypes.bool,
        onHide: PropTypes.func,
        onShow: PropTypes.func,
        ...TouchableHighlight.propTypes
    };

    static defaultProps = {
        arrowDirection: 'default',
        onHide: () => true,
        onShow: () => true
    };

    toolTipText = React.createRef();

    showMenu = () => {
        ToolTipMenu.show(findNodeHandle(this.toolTipText.current), this.getOptionTexts(), this.props.arrowDirection);
        this.props.onShow();
    };

    hideMenu = () => {
        ToolTipMenu.hide();
        this.props.onHide();
    };

    getOptionTexts = () => {
        return this.props.actions.map((option) => option.text);
    };

    // Assuming there is no actions with the same text
    getCallback = (optionText) => {
        const selectedOption = this.props.actions.find((option) => option.text === optionText);

        if (selectedOption) {
            return selectedOption.onPress;
        }

        return null;
    };

    handleToolTipTextChange = (event) => {
        const callback = this.getCallback(event.nativeEvent.text);
        if (callback) {
            callback(event);
        }
    };

    handleBlurToolTip = () => {
        this.hideMenu();
    };

    render() {
        const { children, ...props } = this.props;

        return (
            <RCTToolTipText ref={this.toolTipText} onChange={this.handleToolTipTextChange} onBlur={this.handleBlurToolTip}>
              <TouchableHighlight {...props}>
                <View>
                    {children}
                </View>
              </TouchableHighlight>
            </RCTToolTipText>
        );
    }
}
