"use strict";
(() => {
var exports = {};
exports.id = 564;
exports.ids = [564,660];
exports.modules = {

/***/ 316:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderpage_2Fjournal_preferredRegion_absolutePagePath_private_next_pages_2Fjournal_jsx_absoluteAppPath_private_next_pages_2F_app_jsx_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_),
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

// NAMESPACE OBJECT: ./src/pages/journal.jsx
var journal_namespaceObject = {};
__webpack_require__.r(journal_namespaceObject);
__webpack_require__.d(journal_namespaceObject, {
  "default": () => (JournalPage)
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
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "@mui/material"
var material_ = __webpack_require__(5692);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
;// CONCATENATED MODULE: ./src/components/EmotionSelector.jsx


function EmotionSelector({ emotions, value, onChange }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.FormControl, {
        fullWidth: true,
        children: [
            /*#__PURE__*/ jsx_runtime.jsx(material_.InputLabel, {
                id: "emotion-label",
                children: "Emotion"
            }),
            /*#__PURE__*/ jsx_runtime.jsx(material_.Select, {
                labelId: "emotion-label",
                label: "Emotion",
                value: value,
                onChange: (event)=>onChange(event.target.value),
                children: emotions.map((emotion)=>/*#__PURE__*/ jsx_runtime.jsx(material_.MenuItem, {
                        value: emotion.id,
                        children: emotion.name
                    }, emotion.id))
            })
        ]
    });
}

;// CONCATENATED MODULE: ./src/components/DocumentUploader.jsx


function formatNames(files) {
    return files.map((file)=>file.name);
}
function DocumentUploader({ onUpload, files }) {
    const onChange = (event)=>{
        const pickedFiles = Array.from(event.target.files || []);
        onUpload(formatNames(pickedFiles));
    };
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Stack, {
        spacing: 1,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Button, {
                component: "label",
                variant: "outlined",
                children: [
                    "Upload supporting files",
                    /*#__PURE__*/ jsx_runtime.jsx("input", {
                        hidden: true,
                        multiple: true,
                        accept: "application/pdf,image/png,image/jpeg",
                        type: "file",
                        onChange: onChange
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                variant: "caption",
                color: "text.secondary",
                children: files.length ? files.join(", ") : "No files selected"
            })
        ]
    });
}

// EXTERNAL MODULE: ./src/lib/context/UserContext.js
var UserContext = __webpack_require__(1115);
;// CONCATENATED MODULE: ./src/components/JournalForm.jsx






const INITIAL_FORM = {
    symbol: "",
    killzone: "",
    open: "",
    close: "",
    risk: "",
    notes: "",
    emotionId: 1,
    documents: []
};
function JournalForm({ onEntryCreated }) {
    const { accountId, emotions } = (0,UserContext/* useUser */.a)();
    const [form, setForm] = (0,external_react_.useState)(INITIAL_FORM);
    const [status, setStatus] = (0,external_react_.useState)({
        type: "",
        message: ""
    });
    const [submitting, setSubmitting] = (0,external_react_.useState)(false);
    const updateField = (field)=>(event)=>{
            setForm((previous)=>({
                    ...previous,
                    [field]: event.target.value
                }));
        };
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setSubmitting(true);
        setStatus({
            type: "",
            message: ""
        });
        try {
            const payload = {
                ...form,
                accountId,
                open: Number(form.open),
                close: Number(form.close),
                risk: Number(form.risk),
                emotionId: Number(form.emotionId)
            };
            const response = await fetch("/api/journal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || "Failed to save journal entry.");
            }
            const savedEntry = await response.json();
            setStatus({
                type: "success",
                message: "Journal entry saved."
            });
            setForm(INITIAL_FORM);
            if (onEntryCreated) {
                onEntryCreated(savedEntry);
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message
            });
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ jsx_runtime.jsx(material_.Paper, {
        component: "form",
        onSubmit: handleSubmit,
        sx: {
            p: 3
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Stack, {
            spacing: 2,
            children: [
                /*#__PURE__*/ jsx_runtime.jsx(material_.Typography, {
                    variant: "h5",
                    component: "h1",
                    children: "New Trade Entry"
                }),
                status.message ? /*#__PURE__*/ jsx_runtime.jsx(material_.Alert, {
                    severity: status.type,
                    children: status.message
                }) : null,
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(material_.Grid, {
                    container: true,
                    spacing: 2,
                    children: [
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            sm: 6,
                            children: /*#__PURE__*/ jsx_runtime.jsx(material_.TextField, {
                                fullWidth: true,
                                required: true,
                                label: "Symbol",
                                value: form.symbol,
                                onChange: updateField("symbol")
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            sm: 6,
                            children: /*#__PURE__*/ jsx_runtime.jsx(material_.TextField, {
                                fullWidth: true,
                                required: true,
                                label: "Killzone",
                                value: form.killzone,
                                onChange: updateField("killzone")
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            sm: 4,
                            children: /*#__PURE__*/ jsx_runtime.jsx(material_.TextField, {
                                fullWidth: true,
                                required: true,
                                label: "Open",
                                type: "number",
                                inputProps: {
                                    step: "0.01"
                                },
                                value: form.open,
                                onChange: updateField("open")
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            sm: 4,
                            children: /*#__PURE__*/ jsx_runtime.jsx(material_.TextField, {
                                fullWidth: true,
                                required: true,
                                label: "Close",
                                type: "number",
                                inputProps: {
                                    step: "0.01"
                                },
                                value: form.close,
                                onChange: updateField("close")
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            sm: 4,
                            children: /*#__PURE__*/ jsx_runtime.jsx(material_.TextField, {
                                fullWidth: true,
                                required: true,
                                label: "Risk",
                                type: "number",
                                inputProps: {
                                    step: "0.01"
                                },
                                value: form.risk,
                                onChange: updateField("risk")
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            children: /*#__PURE__*/ jsx_runtime.jsx(EmotionSelector, {
                                emotions: emotions,
                                value: form.emotionId,
                                onChange: (emotionId)=>setForm((previous)=>({
                                            ...previous,
                                            emotionId
                                        }))
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            children: /*#__PURE__*/ jsx_runtime.jsx(material_.TextField, {
                                fullWidth: true,
                                multiline: true,
                                minRows: 4,
                                label: "Notes",
                                value: form.notes,
                                onChange: updateField("notes")
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime.jsx(material_.Grid, {
                            item: true,
                            xs: 12,
                            children: /*#__PURE__*/ jsx_runtime.jsx(DocumentUploader, {
                                files: form.documents,
                                onUpload: (documents)=>setForm((previous)=>({
                                            ...previous,
                                            documents
                                        }))
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ jsx_runtime.jsx(material_.Box, {
                    children: /*#__PURE__*/ jsx_runtime.jsx(material_.Button, {
                        type: "submit",
                        variant: "contained",
                        disabled: submitting,
                        children: submitting ? "Saving..." : "Save Entry"
                    })
                })
            ]
        })
    });
}

;// CONCATENATED MODULE: ./src/pages/journal.jsx




function JournalPage() {
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
                        children: "Journal Entry"
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx(material_.Button, {
                        component: (link_default()),
                        href: "/dashboard",
                        variant: "outlined",
                        children: "View Dashboard"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime.jsx(JournalForm, {})
        ]
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?page=%2Fjournal&preferredRegion=&absolutePagePath=private-next-pages%2Fjournal.jsx&absoluteAppPath=private-next-pages%2F_app.jsx&absoluteDocumentPath=next%2Fdist%2Fpages%2F_document&middlewareConfigBase64=e30%3D!

        // Next.js Route Loader
        
        

        // Import the app and document modules.
        
        

        // Import the userland code.
        

        // Re-export the component (should be the default export).
        /* harmony default export */ const next_route_loaderpage_2Fjournal_preferredRegion_absolutePagePath_private_next_pages_2Fjournal_jsx_absoluteAppPath_private_next_pages_2F_app_jsx_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(journal_namespaceObject, "default"));

        // Re-export methods.
        const getStaticProps = (0,helpers/* hoist */.l)(journal_namespaceObject, "getStaticProps")
        const getStaticPaths = (0,helpers/* hoist */.l)(journal_namespaceObject, "getStaticPaths")
        const getServerSideProps = (0,helpers/* hoist */.l)(journal_namespaceObject, "getServerSideProps")
        const config = (0,helpers/* hoist */.l)(journal_namespaceObject, "config")
        const reportWebVitals = (0,helpers/* hoist */.l)(journal_namespaceObject, "reportWebVitals")
        

        // Re-export legacy methods.
        const unstable_getStaticProps = (0,helpers/* hoist */.l)(journal_namespaceObject, "unstable_getStaticProps")
        const unstable_getStaticPaths = (0,helpers/* hoist */.l)(journal_namespaceObject, "unstable_getStaticPaths")
        const unstable_getStaticParams = (0,helpers/* hoist */.l)(journal_namespaceObject, "unstable_getStaticParams")
        const unstable_getServerProps = (0,helpers/* hoist */.l)(journal_namespaceObject, "unstable_getServerProps")
        const unstable_getServerSideProps = (0,helpers/* hoist */.l)(journal_namespaceObject, "unstable_getServerSideProps")

        // Create and export the route module that will be consumed.
        const options = {"definition":{"kind":"PAGES","page":"/journal","pathname":"/journal","bundlePath":"","filename":""}}
        const routeModule = new (module_default())({
          ...options,
          components: {
            App: _app["default"],
            Document: (_document_default()),
          },
          userland: journal_namespaceObject,
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
var __webpack_exports__ = __webpack_require__.X(0, [940,812,664,857], () => (__webpack_exec__(316)));
module.exports = __webpack_exports__;

})();