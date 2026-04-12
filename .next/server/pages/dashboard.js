"use strict";
(() => {
var exports = {};
exports.id = 26;
exports.ids = [26,660];
exports.modules = {

/***/ 8598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderpage_2Fdashboard_preferredRegion_absolutePagePath_private_next_pages_2Fdashboard_jsx_absoluteAppPath_private_next_pages_2F_app_jsx_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_),
  getServerSideProps: () => (/* binding */ getServerSideProps),
  getStaticPaths: () => (/* binding */ getStaticPaths),
  getStaticProps: () => (/* binding */ getStaticProps),
  reportWebVitals: () => (/* binding */ reportWebVitals),
  routeModule: () => (/* binding */ routeModule),
  unstable_getServerProps: () => (/* binding */ unstable_getServerProps),
  unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),
  unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),
  unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),
  unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)
});

// NAMESPACE OBJECT: ./src/pages/dashboard.jsx
var dashboard_namespaceObject = {};
__webpack_require__.r(dashboard_namespaceObject);
__webpack_require__.d(dashboard_namespaceObject, {
  "default": () => (DashboardPage)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages/module.js
var pages_module = __webpack_require__(3185);
var module_default = /*#__PURE__*/__webpack_require__.n(pages_module);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(7182);
// EXTERNAL MODULE: ./node_modules/next/dist/pages/_document.js
var _document = __webpack_require__(2940);
var _document_default = /*#__PURE__*/__webpack_require__.n(_document);
// EXTERNAL MODULE: ./src/pages/_app.jsx
var _app = __webpack_require__(5857);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "@mui/material"
var material_ = __webpack_require__(5692);
;// CONCATENATED MODULE: ./src/pages/dashboard.jsx




function calculateWinRate(entries) {
    if (entries.length === 0) {
        return 0;
    }
    const wins = entries.filter((entry)=>Number(entry.close) > Number(entry.open)).length;
    return Math.round(wins / entries.length * 100);
}
function DashboardPage() {
    const [entries, setEntries] = (0,external_react_.useState)([]);
    const [error, setError] = (0,external_react_.useState)("");
    (0,external_react_.useEffect)(()=>{
        async function loadEntries() {
            try {
                const response = await fetch("/api/journal");
                if (!response.ok) {
                    throw new Error("Failed to load dashboard data.");
                }
                const data = await response.json();
                setEntries(data);
            } catch (loadError) {
                setError(loadError.message);
            }
        }
        loadEntries();
    }, []);
    const metrics = (0,external_react_.useMemo)(()=>{
        const totalRisk = entries.reduce((sum, entry)=>sum + Number(entry.risk || 0), 0);
        const averageRisk = entries.length ? (totalRisk / entries.length).toFixed(2) : "0.00";
        return {
            totalTrades: entries.length,
            winRate: calculateWinRate(entries),
            averageRisk
        };
    }, [
        entries
    ]);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Stack, {
        spacing: 3,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Stack, {
                direction: {
                    xs: "column",
                    sm: "row"
                },
                justifyContent: "space-between",
                spacing: 2,
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                        variant: "h4",
                        component: "h1",
                        children: "Dashboard"
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx(material_.Button, {
                        component: (link_default()),
                        href: "/journal",
                        variant: "contained",
                        children: "Add Entry"
                    })
                ]
            }),
            error ? /*#__PURE__*/ jsx_runtime.jsx(material_.Alert, {
                severity: "error",
                children: error
            }) : null,
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Grid, {
                container: true,
                spacing: 2,
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                        item: true,
                        xs: 12,
                        md: 4,
                        children: /*#__PURE__*/ jsx_runtime.jsx(material_.Card, {
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.CardContent, {
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                                        color: "text.secondary",
                                        children: "Total Trades"
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                                        variant: "h4",
                                        children: metrics.totalTrades
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                        item: true,
                        xs: 12,
                        md: 4,
                        children: /*#__PURE__*/ jsx_runtime.jsx(material_.Card, {
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.CardContent, {
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                                        color: "text.secondary",
                                        children: "Win Rate"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Typography, {
                                        variant: "h4",
                                        children: [
                                            metrics.winRate,
                                            "%"
                                        ]
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                        item: true,
                        xs: 12,
                        md: 4,
                        children: /*#__PURE__*/ jsx_runtime.jsx(material_.Card, {
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.CardContent, {
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                                        color: "text.secondary",
                                        children: "Average Risk"
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                                        variant: "h4",
                                        children: metrics.averageRisk
                                    })
                                ]
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime.jsx(material_.Paper, {
                children: /*#__PURE__*/ jsx_runtime.jsx(material_.TableContainer, {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Table, {
                        size: "small",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx(material_.TableHead, {
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.TableRow, {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            children: "Symbol"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            children: "Emotion"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            children: "Open"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            children: "Close"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            children: "Risk"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            children: "Created"
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.TableBody, {
                                children: [
                                    entries.map((entry)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.TableRow, {
                                            children: [
                                                /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                                    children: entry.symbol
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                                    children: entry.emotion?.name || "N/A"
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                                    children: entry.open
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                                    children: entry.close
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                                    children: entry.risk
                                                }),
                                                /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                                    children: new Date(entry.createdAt).toLocaleString()
                                                })
                                            ]
                                        }, entry.id)),
                                    entries.length === 0 ? /*#__PURE__*/ jsx_runtime.jsx(material_.TableRow, {
                                        children: /*#__PURE__*/ jsx_runtime.jsx(material_.TableCell, {
                                            colSpan: 6,
                                            children: "No entries yet. Add your first trade."
                                        })
                                    }) : null
                                ]
                            })
                        ]
                    })
                })
            })
        ]
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?page=%2Fdashboard&preferredRegion=&absolutePagePath=private-next-pages%2Fdashboard.jsx&absoluteAppPath=private-next-pages%2F_app.jsx&absoluteDocumentPath=next%2Fdist%2Fpages%2F_document&middlewareConfigBase64=e30%3D!

        // Next.js Route Loader
        
        

        // Import the app and document modules.
        
        

        // Import the userland code.
        

        // Re-export the component (should be the default export).
        /* harmony default export */ const next_route_loaderpage_2Fdashboard_preferredRegion_absolutePagePath_private_next_pages_2Fdashboard_jsx_absoluteAppPath_private_next_pages_2F_app_jsx_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(dashboard_namespaceObject, "default"));

        // Re-export methods.
        const getStaticProps = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "getStaticProps")
        const getStaticPaths = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "getStaticPaths")
        const getServerSideProps = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "getServerSideProps")
        const config = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "config")
        const reportWebVitals = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "reportWebVitals")
        

        // Re-export legacy methods.
        const unstable_getStaticProps = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "unstable_getStaticProps")
        const unstable_getStaticPaths = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "unstable_getStaticPaths")
        const unstable_getStaticParams = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "unstable_getStaticParams")
        const unstable_getServerProps = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "unstable_getServerProps")
        const unstable_getServerSideProps = (0,helpers/* hoist */.l)(dashboard_namespaceObject, "unstable_getServerSideProps")

        // Create and export the route module that will be consumed.
        const options = {"definition":{"kind":"PAGES","page":"/dashboard","pathname":"/dashboard","bundlePath":"","filename":""}}
        const routeModule = new (module_default())({
          ...options,
          components: {
            App: _app["default"],
            Document: (_document_default()),
          },
          userland: dashboard_namespaceObject,
        })
        
        
    

/***/ }),

/***/ 5262:
/***/ ((module) => {

module.exports = require("@mui/icons-material/DarkMode");

/***/ }),

/***/ 3684:
/***/ ((module) => {

module.exports = require("@mui/icons-material/LightMode");

/***/ }),

/***/ 5692:
/***/ ((module) => {

module.exports = require("@mui/material");

/***/ }),

/***/ 8442:
/***/ ((module) => {

module.exports = require("@mui/material/styles");

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 4140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 3100:
/***/ ((module) => {

module.exports = require("next/dist/server/render.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 1109:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-local-url.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 7782:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-href.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [940,812,664,857], () => (__webpack_exec__(8598)));
module.exports = __webpack_exports__;

})();