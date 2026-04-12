"use strict";
exports.id = 857;
exports.ids = [857];
exports.modules = {

/***/ 1115:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ useUser),
/* harmony export */   d: () => (/* binding */ UserProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const DEFAULT_EMOTIONS = [
    {
        id: 1,
        name: "Fear"
    },
    {
        id: 2,
        name: "Greed"
    },
    {
        id: 3,
        name: "Joy"
    },
    {
        id: 4,
        name: "Neutral"
    }
];
const UserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
function UserProvider({ children }) {
    const [accountId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [emotions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(DEFAULT_EMOTIONS);
    const value = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>({
            accountId,
            emotions
        }), [
        accountId,
        emotions
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(UserContext.Provider, {
        value: value,
        children: children
    });
}
function useUser() {
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(UserContext);
    if (!context) {
        throw new Error("useUser must be used inside UserProvider");
    }
    return context;
}


/***/ }),

/***/ 5857:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_icons_material_LightMode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3684);
/* harmony import */ var _mui_icons_material_LightMode__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_LightMode__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _mui_icons_material_DarkMode__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5262);
/* harmony import */ var _mui_icons_material_DarkMode__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_DarkMode__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _lib_context_UserContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1115);







function App({ Component, pageProps }) {
    const [mode, setMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("light");
    const theme = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>(0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_2__.createTheme)({
            palette: {
                mode,
                primary: {
                    main: "#00695f"
                },
                secondary: {
                    main: "#ff6f00"
                }
            }
        }), [
        mode
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material_styles__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {
        theme: theme,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.CssBaseline, {}),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_lib_context_UserContext__WEBPACK_IMPORTED_MODULE_6__/* .UserProvider */ .d, {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.AppBar, {
                        position: "sticky",
                        color: "transparent",
                        elevation: 0,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Container, {
                            maxWidth: "lg",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Toolbar, {
                                disableGutters: true,
                                sx: {
                                    justifyContent: "space-between"
                                },
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Typography, {
                                        variant: "h6",
                                        component: "p",
                                        children: "Trading Journal"
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
                                        "aria-label": "toggle color mode",
                                        onClick: ()=>setMode((previous)=>previous === "light" ? "dark" : "light"),
                                        children: mode === "light" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_DarkMode__WEBPACK_IMPORTED_MODULE_5___default()), {}) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_LightMode__WEBPACK_IMPORTED_MODULE_4___default()), {})
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
                        component: "main",
                        sx: {
                            py: 4
                        },
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Container, {
                            maxWidth: "lg",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                                ...pageProps
                            })
                        })
                    })
                ]
            })
        ]
    });
}


/***/ })

};
;