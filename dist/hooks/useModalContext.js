import React, { useContext } from "react";
var ModalContext = React.createContext(null);
export var ModalProvider = ModalContext.Provider;
export var useModalContext = function () { return useContext(ModalContext); };
//# sourceMappingURL=useModalContext.js.map