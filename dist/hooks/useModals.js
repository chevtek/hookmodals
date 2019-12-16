var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState } from "react";
var modalStore = null;
export var useModals = function () { return modalStore || {}; };
export var useModalProvider = function (renderers) {
    var _a = useState({}), visible = _a[0], setVisible = _a[1];
    if (!modalStore && renderers) {
        var modals = {};
        var _loop_1 = function (name_1) {
            visible[name_1] = false;
            modals[name_1] = {
                isVisible: false,
                open: function (options) {
                    var _this = this;
                    this.options = options;
                    this.isVisible = visible[name_1] = true;
                    setVisible(__assign({}, visible));
                    return new Promise(function (resolve, reject) {
                        _this._promise = { resolve: resolve, reject: reject };
                    });
                },
                close: function (err) {
                    this.isVisible = visible[name_1] = false;
                    setVisible(__assign({}, visible));
                    if (!this._promise)
                        return;
                    if (err)
                        return this._promise.reject(err);
                    this._promise.resolve();
                },
                render: renderers[name_1]
            };
        };
        for (var name_1 in renderers) {
            _loop_1(name_1);
        }
        setVisible(visible);
        modalStore = modals;
    }
    var renderModals = function () {
        return modalStore && Object.keys(modalStore)
            .filter(function (name) { return visible[name]; })
            .map(function (name) {
            var _a = modalStore[name], render = _a.render, options = _a.options, close = _a.close;
            return (React.createElement(React.Fragment, { key: name }, render(options, close, modalStore)));
        });
    };
    return function () { return React.createElement("div", null, renderModals()); };
};
//# sourceMappingURL=useModals.js.map