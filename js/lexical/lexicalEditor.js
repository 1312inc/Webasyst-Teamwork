var lf = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Hv(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Vg = { exports: {} }, Tl = {}, Hg = { exports: {} }, ne = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Li = Symbol.for("react.element"), Kv = Symbol.for("react.portal"), Qv = Symbol.for("react.fragment"), Gv = Symbol.for("react.strict_mode"), Jv = Symbol.for("react.profiler"), Yv = Symbol.for("react.provider"), Zv = Symbol.for("react.context"), Xv = Symbol.for("react.forward_ref"), qv = Symbol.for("react.suspense"), e0 = Symbol.for("react.memo"), t0 = Symbol.for("react.lazy"), af = Symbol.iterator;
function n0(t) {
  return t === null || typeof t != "object" ? null : (t = af && t[af] || t["@@iterator"], typeof t == "function" ? t : null);
}
var Kg = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, Qg = Object.assign, Gg = {};
function ho(t, e, n) {
  this.props = t, this.context = e, this.refs = Gg, this.updater = n || Kg;
}
ho.prototype.isReactComponent = {};
ho.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
ho.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function Jg() {
}
Jg.prototype = ho.prototype;
function Oc(t, e, n) {
  this.props = t, this.context = e, this.refs = Gg, this.updater = n || Kg;
}
var Ac = Oc.prototype = new Jg();
Ac.constructor = Oc;
Qg(Ac, ho.prototype);
Ac.isPureReactComponent = !0;
var uf = Array.isArray, Yg = Object.prototype.hasOwnProperty, Fc = { current: null }, Zg = { key: !0, ref: !0, __self: !0, __source: !0 };
function Xg(t, e, n) {
  var r, o = {}, i = null, s = null;
  if (e != null) for (r in e.ref !== void 0 && (s = e.ref), e.key !== void 0 && (i = "" + e.key), e) Yg.call(e, r) && !Zg.hasOwnProperty(r) && (o[r] = e[r]);
  var l = arguments.length - 2;
  if (l === 1) o.children = n;
  else if (1 < l) {
    for (var a = Array(l), u = 0; u < l; u++) a[u] = arguments[u + 2];
    o.children = a;
  }
  if (t && t.defaultProps) for (r in l = t.defaultProps, l) o[r] === void 0 && (o[r] = l[r]);
  return { $$typeof: Li, type: t, key: i, ref: s, props: o, _owner: Fc.current };
}
function r0(t, e) {
  return { $$typeof: Li, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function Pc(t) {
  return typeof t == "object" && t !== null && t.$$typeof === Li;
}
function o0(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(n) {
    return e[n];
  });
}
var cf = /\/+/g;
function va(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? o0("" + t.key) : e.toString(36);
}
function ys(t, e, n, r, o) {
  var i = typeof t;
  (i === "undefined" || i === "boolean") && (t = null);
  var s = !1;
  if (t === null) s = !0;
  else switch (i) {
    case "string":
    case "number":
      s = !0;
      break;
    case "object":
      switch (t.$$typeof) {
        case Li:
        case Kv:
          s = !0;
      }
  }
  if (s) return s = t, o = o(s), t = r === "" ? "." + va(s, 0) : r, uf(o) ? (n = "", t != null && (n = t.replace(cf, "$&/") + "/"), ys(o, e, n, "", function(u) {
    return u;
  })) : o != null && (Pc(o) && (o = r0(o, n + (!o.key || s && s.key === o.key ? "" : ("" + o.key).replace(cf, "$&/") + "/") + t)), e.push(o)), 1;
  if (s = 0, r = r === "" ? "." : r + ":", uf(t)) for (var l = 0; l < t.length; l++) {
    i = t[l];
    var a = r + va(i, l);
    s += ys(i, e, n, a, o);
  }
  else if (a = n0(t), typeof a == "function") for (t = a.call(t), l = 0; !(i = t.next()).done; ) i = i.value, a = r + va(i, l++), s += ys(i, e, n, a, o);
  else if (i === "object") throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return s;
}
function Gi(t, e, n) {
  if (t == null) return t;
  var r = [], o = 0;
  return ys(t, r, "", "", function(i) {
    return e.call(n, i, o++);
  }), r;
}
function i0(t) {
  if (t._status === -1) {
    var e = t._result;
    e = e(), e.then(function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 1, t._result = n);
    }, function(n) {
      (t._status === 0 || t._status === -1) && (t._status = 2, t._result = n);
    }), t._status === -1 && (t._status = 0, t._result = e);
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var rt = { current: null }, vs = { transition: null }, s0 = { ReactCurrentDispatcher: rt, ReactCurrentBatchConfig: vs, ReactCurrentOwner: Fc };
function qg() {
  throw Error("act(...) is not supported in production builds of React.");
}
ne.Children = { map: Gi, forEach: function(t, e, n) {
  Gi(t, function() {
    e.apply(this, arguments);
  }, n);
}, count: function(t) {
  var e = 0;
  return Gi(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return Gi(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!Pc(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
ne.Component = ho;
ne.Fragment = Qv;
ne.Profiler = Jv;
ne.PureComponent = Oc;
ne.StrictMode = Gv;
ne.Suspense = qv;
ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = s0;
ne.act = qg;
ne.cloneElement = function(t, e, n) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var r = Qg({}, t.props), o = t.key, i = t.ref, s = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (i = e.ref, s = Fc.current), e.key !== void 0 && (o = "" + e.key), t.type && t.type.defaultProps) var l = t.type.defaultProps;
    for (a in e) Yg.call(e, a) && !Zg.hasOwnProperty(a) && (r[a] = e[a] === void 0 && l !== void 0 ? l[a] : e[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    l = Array(a);
    for (var u = 0; u < a; u++) l[u] = arguments[u + 2];
    r.children = l;
  }
  return { $$typeof: Li, type: t.type, key: o, ref: i, props: r, _owner: s };
};
ne.createContext = function(t) {
  return t = { $$typeof: Zv, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: Yv, _context: t }, t.Consumer = t;
};
ne.createElement = Xg;
ne.createFactory = function(t) {
  var e = Xg.bind(null, t);
  return e.type = t, e;
};
ne.createRef = function() {
  return { current: null };
};
ne.forwardRef = function(t) {
  return { $$typeof: Xv, render: t };
};
ne.isValidElement = Pc;
ne.lazy = function(t) {
  return { $$typeof: t0, _payload: { _status: -1, _result: t }, _init: i0 };
};
ne.memo = function(t, e) {
  return { $$typeof: e0, type: t, compare: e === void 0 ? null : e };
};
ne.startTransition = function(t) {
  var e = vs.transition;
  vs.transition = {};
  try {
    t();
  } finally {
    vs.transition = e;
  }
};
ne.unstable_act = qg;
ne.useCallback = function(t, e) {
  return rt.current.useCallback(t, e);
};
ne.useContext = function(t) {
  return rt.current.useContext(t);
};
ne.useDebugValue = function() {
};
ne.useDeferredValue = function(t) {
  return rt.current.useDeferredValue(t);
};
ne.useEffect = function(t, e) {
  return rt.current.useEffect(t, e);
};
ne.useId = function() {
  return rt.current.useId();
};
ne.useImperativeHandle = function(t, e, n) {
  return rt.current.useImperativeHandle(t, e, n);
};
ne.useInsertionEffect = function(t, e) {
  return rt.current.useInsertionEffect(t, e);
};
ne.useLayoutEffect = function(t, e) {
  return rt.current.useLayoutEffect(t, e);
};
ne.useMemo = function(t, e) {
  return rt.current.useMemo(t, e);
};
ne.useReducer = function(t, e, n) {
  return rt.current.useReducer(t, e, n);
};
ne.useRef = function(t) {
  return rt.current.useRef(t);
};
ne.useState = function(t) {
  return rt.current.useState(t);
};
ne.useSyncExternalStore = function(t, e, n) {
  return rt.current.useSyncExternalStore(t, e, n);
};
ne.useTransition = function() {
  return rt.current.useTransition();
};
ne.version = "18.3.1";
Hg.exports = ne;
var T = Hg.exports;
const l0 = /* @__PURE__ */ Hv(T);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var a0 = T, u0 = Symbol.for("react.element"), c0 = Symbol.for("react.fragment"), d0 = Object.prototype.hasOwnProperty, f0 = a0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p0 = { key: !0, ref: !0, __self: !0, __source: !0 };
function eh(t, e, n) {
  var r, o = {}, i = null, s = null;
  n !== void 0 && (i = "" + n), e.key !== void 0 && (i = "" + e.key), e.ref !== void 0 && (s = e.ref);
  for (r in e) d0.call(e, r) && !p0.hasOwnProperty(r) && (o[r] = e[r]);
  if (t && t.defaultProps) for (r in e = t.defaultProps, e) o[r] === void 0 && (o[r] = e[r]);
  return { $$typeof: u0, type: t, key: i, ref: s, props: o, _owner: f0.current };
}
Tl.Fragment = c0;
Tl.jsx = eh;
Tl.jsxs = eh;
Vg.exports = Tl;
var O = Vg.exports, au = {}, th = { exports: {} }, xt = {}, nh = { exports: {} }, rh = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(t) {
  function e(L, U) {
    var K = L.length;
    L.push(U);
    e: for (; 0 < K; ) {
      var q = K - 1 >>> 1, Z = L[q];
      if (0 < o(Z, U)) L[q] = U, L[K] = Z, K = q;
      else break e;
    }
  }
  function n(L) {
    return L.length === 0 ? null : L[0];
  }
  function r(L) {
    if (L.length === 0) return null;
    var U = L[0], K = L.pop();
    if (K !== U) {
      L[0] = K;
      e: for (var q = 0, Z = L.length, Ve = Z >>> 1; q < Ve; ) {
        var le = 2 * (q + 1) - 1, Te = L[le], ae = le + 1, be = L[ae];
        if (0 > o(Te, K)) ae < Z && 0 > o(be, Te) ? (L[q] = be, L[ae] = K, q = ae) : (L[q] = Te, L[le] = K, q = le);
        else if (ae < Z && 0 > o(be, K)) L[q] = be, L[ae] = K, q = ae;
        else break e;
      }
    }
    return U;
  }
  function o(L, U) {
    var K = L.sortIndex - U.sortIndex;
    return K !== 0 ? K : L.id - U.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    t.unstable_now = function() {
      return i.now();
    };
  } else {
    var s = Date, l = s.now();
    t.unstable_now = function() {
      return s.now() - l;
    };
  }
  var a = [], u = [], c = 1, p = null, f = 3, m = !1, h = !1, y = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, d = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function g(L) {
    for (var U = n(u); U !== null; ) {
      if (U.callback === null) r(u);
      else if (U.startTime <= L) r(u), U.sortIndex = U.expirationTime, e(a, U);
      else break;
      U = n(u);
    }
  }
  function x(L) {
    if (y = !1, g(L), !h) if (n(a) !== null) h = !0, G(w);
    else {
      var U = n(u);
      U !== null && te(x, U.startTime - L);
    }
  }
  function w(L, U) {
    h = !1, y && (y = !1, v(C), C = -1), m = !0;
    var K = f;
    try {
      for (g(U), p = n(a); p !== null && (!(p.expirationTime > U) || L && !D()); ) {
        var q = p.callback;
        if (typeof q == "function") {
          p.callback = null, f = p.priorityLevel;
          var Z = q(p.expirationTime <= U);
          U = t.unstable_now(), typeof Z == "function" ? p.callback = Z : p === n(a) && r(a), g(U);
        } else r(a);
        p = n(a);
      }
      if (p !== null) var Ve = !0;
      else {
        var le = n(u);
        le !== null && te(x, le.startTime - U), Ve = !1;
      }
      return Ve;
    } finally {
      p = null, f = K, m = !1;
    }
  }
  var S = !1, k = null, C = -1, E = 5, N = -1;
  function D() {
    return !(t.unstable_now() - N < E);
  }
  function z() {
    if (k !== null) {
      var L = t.unstable_now();
      N = L;
      var U = !0;
      try {
        U = k(!0, L);
      } finally {
        U ? H() : (S = !1, k = null);
      }
    } else S = !1;
  }
  var H;
  if (typeof d == "function") H = function() {
    d(z);
  };
  else if (typeof MessageChannel < "u") {
    var j = new MessageChannel(), J = j.port2;
    j.port1.onmessage = z, H = function() {
      J.postMessage(null);
    };
  } else H = function() {
    _(z, 0);
  };
  function G(L) {
    k = L, S || (S = !0, H());
  }
  function te(L, U) {
    C = _(function() {
      L(t.unstable_now());
    }, U);
  }
  t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function(L) {
    L.callback = null;
  }, t.unstable_continueExecution = function() {
    h || m || (h = !0, G(w));
  }, t.unstable_forceFrameRate = function(L) {
    0 > L || 125 < L ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : E = 0 < L ? Math.floor(1e3 / L) : 5;
  }, t.unstable_getCurrentPriorityLevel = function() {
    return f;
  }, t.unstable_getFirstCallbackNode = function() {
    return n(a);
  }, t.unstable_next = function(L) {
    switch (f) {
      case 1:
      case 2:
      case 3:
        var U = 3;
        break;
      default:
        U = f;
    }
    var K = f;
    f = U;
    try {
      return L();
    } finally {
      f = K;
    }
  }, t.unstable_pauseExecution = function() {
  }, t.unstable_requestPaint = function() {
  }, t.unstable_runWithPriority = function(L, U) {
    switch (L) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        L = 3;
    }
    var K = f;
    f = L;
    try {
      return U();
    } finally {
      f = K;
    }
  }, t.unstable_scheduleCallback = function(L, U, K) {
    var q = t.unstable_now();
    switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? q + K : q) : K = q, L) {
      case 1:
        var Z = -1;
        break;
      case 2:
        Z = 250;
        break;
      case 5:
        Z = 1073741823;
        break;
      case 4:
        Z = 1e4;
        break;
      default:
        Z = 5e3;
    }
    return Z = K + Z, L = { id: c++, callback: U, priorityLevel: L, startTime: K, expirationTime: Z, sortIndex: -1 }, K > q ? (L.sortIndex = K, e(u, L), n(a) === null && L === n(u) && (y ? (v(C), C = -1) : y = !0, te(x, K - q))) : (L.sortIndex = Z, e(a, L), h || m || (h = !0, G(w))), L;
  }, t.unstable_shouldYield = D, t.unstable_wrapCallback = function(L) {
    var U = f;
    return function() {
      var K = f;
      f = U;
      try {
        return L.apply(this, arguments);
      } finally {
        f = K;
      }
    };
  };
})(rh);
nh.exports = rh;
var g0 = nh.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h0 = T, vt = g0;
function R(t) {
  for (var e = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, n = 1; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var oh = /* @__PURE__ */ new Set(), ci = {};
function Cr(t, e) {
  no(t, e), no(t + "Capture", e);
}
function no(t, e) {
  for (ci[t] = e, t = 0; t < e.length; t++) oh.add(e[t]);
}
var yn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), uu = Object.prototype.hasOwnProperty, m0 = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, df = {}, ff = {};
function y0(t) {
  return uu.call(ff, t) ? !0 : uu.call(df, t) ? !1 : m0.test(t) ? ff[t] = !0 : (df[t] = !0, !1);
}
function v0(t, e, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof e) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r ? !1 : n !== null ? !n.acceptsBooleans : (t = t.toLowerCase().slice(0, 5), t !== "data-" && t !== "aria-");
    default:
      return !1;
  }
}
function _0(t, e, n, r) {
  if (e === null || typeof e > "u" || v0(t, e, n, r)) return !0;
  if (r) return !1;
  if (n !== null) switch (n.type) {
    case 3:
      return !e;
    case 4:
      return e === !1;
    case 5:
      return isNaN(e);
    case 6:
      return isNaN(e) || 1 > e;
  }
  return !1;
}
function ot(t, e, n, r, o, i, s) {
  this.acceptsBooleans = e === 2 || e === 3 || e === 4, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = t, this.type = e, this.sanitizeURL = i, this.removeEmptyString = s;
}
var Be = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t) {
  Be[t] = new ot(t, 0, !1, t, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(t) {
  var e = t[0];
  Be[e] = new ot(e, 1, !1, t[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(t) {
  Be[t] = new ot(t, 2, !1, t.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(t) {
  Be[t] = new ot(t, 2, !1, t, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t) {
  Be[t] = new ot(t, 3, !1, t.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(t) {
  Be[t] = new ot(t, 3, !0, t, null, !1, !1);
});
["capture", "download"].forEach(function(t) {
  Be[t] = new ot(t, 4, !1, t, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(t) {
  Be[t] = new ot(t, 6, !1, t, null, !1, !1);
});
["rowSpan", "start"].forEach(function(t) {
  Be[t] = new ot(t, 5, !1, t.toLowerCase(), null, !1, !1);
});
var $c = /[\-:]([a-z])/g;
function Lc(t) {
  return t[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t) {
  var e = t.replace(
    $c,
    Lc
  );
  Be[e] = new ot(e, 1, !1, t, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t) {
  var e = t.replace($c, Lc);
  Be[e] = new ot(e, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(t) {
  var e = t.replace($c, Lc);
  Be[e] = new ot(e, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(t) {
  Be[t] = new ot(t, 1, !1, t.toLowerCase(), null, !1, !1);
});
Be.xlinkHref = new ot("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(t) {
  Be[t] = new ot(t, 1, !1, t.toLowerCase(), null, !0, !0);
});
function Ic(t, e, n, r) {
  var o = Be.hasOwnProperty(e) ? Be[e] : null;
  (o !== null ? o.type !== 0 : r || !(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (_0(e, n, o, r) && (n = null), r || o === null ? y0(e) && (n === null ? t.removeAttribute(e) : t.setAttribute(e, "" + n)) : o.mustUseProperty ? t[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (e = o.attributeName, r = o.attributeNamespace, n === null ? t.removeAttribute(e) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? t.setAttributeNS(r, e, n) : t.setAttribute(e, n))));
}
var kn = h0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ji = Symbol.for("react.element"), Rr = Symbol.for("react.portal"), Dr = Symbol.for("react.fragment"), Rc = Symbol.for("react.strict_mode"), cu = Symbol.for("react.profiler"), ih = Symbol.for("react.provider"), sh = Symbol.for("react.context"), Dc = Symbol.for("react.forward_ref"), du = Symbol.for("react.suspense"), fu = Symbol.for("react.suspense_list"), Mc = Symbol.for("react.memo"), Tn = Symbol.for("react.lazy"), lh = Symbol.for("react.offscreen"), pf = Symbol.iterator;
function bo(t) {
  return t === null || typeof t != "object" ? null : (t = pf && t[pf] || t["@@iterator"], typeof t == "function" ? t : null);
}
var xe = Object.assign, _a;
function jo(t) {
  if (_a === void 0) try {
    throw Error();
  } catch (n) {
    var e = n.stack.trim().match(/\n( *(at )?)/);
    _a = e && e[1] || "";
  }
  return `
` + _a + t;
}
var xa = !1;
function wa(t, e) {
  if (!t || xa) return "";
  xa = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (e) if (e = function() {
      throw Error();
    }, Object.defineProperty(e.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(e, []);
      } catch (u) {
        var r = u;
      }
      Reflect.construct(t, [], e);
    } else {
      try {
        e.call();
      } catch (u) {
        r = u;
      }
      t.call(e.prototype);
    }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      t();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (var o = u.stack.split(`
`), i = r.stack.split(`
`), s = o.length - 1, l = i.length - 1; 1 <= s && 0 <= l && o[s] !== i[l]; ) l--;
      for (; 1 <= s && 0 <= l; s--, l--) if (o[s] !== i[l]) {
        if (s !== 1 || l !== 1)
          do
            if (s--, l--, 0 > l || o[s] !== i[l]) {
              var a = `
` + o[s].replace(" at new ", " at ");
              return t.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", t.displayName)), a;
            }
          while (1 <= s && 0 <= l);
        break;
      }
    }
  } finally {
    xa = !1, Error.prepareStackTrace = n;
  }
  return (t = t ? t.displayName || t.name : "") ? jo(t) : "";
}
function x0(t) {
  switch (t.tag) {
    case 5:
      return jo(t.type);
    case 16:
      return jo("Lazy");
    case 13:
      return jo("Suspense");
    case 19:
      return jo("SuspenseList");
    case 0:
    case 2:
    case 15:
      return t = wa(t.type, !1), t;
    case 11:
      return t = wa(t.type.render, !1), t;
    case 1:
      return t = wa(t.type, !0), t;
    default:
      return "";
  }
}
function pu(t) {
  if (t == null) return null;
  if (typeof t == "function") return t.displayName || t.name || null;
  if (typeof t == "string") return t;
  switch (t) {
    case Dr:
      return "Fragment";
    case Rr:
      return "Portal";
    case cu:
      return "Profiler";
    case Rc:
      return "StrictMode";
    case du:
      return "Suspense";
    case fu:
      return "SuspenseList";
  }
  if (typeof t == "object") switch (t.$$typeof) {
    case sh:
      return (t.displayName || "Context") + ".Consumer";
    case ih:
      return (t._context.displayName || "Context") + ".Provider";
    case Dc:
      var e = t.render;
      return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
    case Mc:
      return e = t.displayName || null, e !== null ? e : pu(t.type) || "Memo";
    case Tn:
      e = t._payload, t = t._init;
      try {
        return pu(t(e));
      } catch {
      }
  }
  return null;
}
function w0(t) {
  var e = t.type;
  switch (t.tag) {
    case 24:
      return "Cache";
    case 9:
      return (e.displayName || "Context") + ".Consumer";
    case 10:
      return (e._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return t = e.render, t = t.displayName || t.name || "", e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return e;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return pu(e);
    case 8:
      return e === Rc ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof e == "function") return e.displayName || e.name || null;
      if (typeof e == "string") return e;
  }
  return null;
}
function Kn(t) {
  switch (typeof t) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return t;
    case "object":
      return t;
    default:
      return "";
  }
}
function ah(t) {
  var e = t.type;
  return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
}
function S0(t) {
  var e = ah(t) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e), r = "" + t[e];
  if (!t.hasOwnProperty(e) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var o = n.get, i = n.set;
    return Object.defineProperty(t, e, { configurable: !0, get: function() {
      return o.call(this);
    }, set: function(s) {
      r = "" + s, i.call(this, s);
    } }), Object.defineProperty(t, e, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(s) {
      r = "" + s;
    }, stopTracking: function() {
      t._valueTracker = null, delete t[e];
    } };
  }
}
function Yi(t) {
  t._valueTracker || (t._valueTracker = S0(t));
}
function uh(t) {
  if (!t) return !1;
  var e = t._valueTracker;
  if (!e) return !0;
  var n = e.getValue(), r = "";
  return t && (r = ah(t) ? t.checked ? "true" : "false" : t.value), t = r, t !== n ? (e.setValue(t), !0) : !1;
}
function $s(t) {
  if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
  try {
    return t.activeElement || t.body;
  } catch {
    return t.body;
  }
}
function gu(t, e) {
  var n = e.checked;
  return xe({}, e, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? t._wrapperState.initialChecked });
}
function gf(t, e) {
  var n = e.defaultValue == null ? "" : e.defaultValue, r = e.checked != null ? e.checked : e.defaultChecked;
  n = Kn(e.value != null ? e.value : n), t._wrapperState = { initialChecked: r, initialValue: n, controlled: e.type === "checkbox" || e.type === "radio" ? e.checked != null : e.value != null };
}
function ch(t, e) {
  e = e.checked, e != null && Ic(t, "checked", e, !1);
}
function hu(t, e) {
  ch(t, e);
  var n = Kn(e.value), r = e.type;
  if (n != null) r === "number" ? (n === 0 && t.value === "" || t.value != n) && (t.value = "" + n) : t.value !== "" + n && (t.value = "" + n);
  else if (r === "submit" || r === "reset") {
    t.removeAttribute("value");
    return;
  }
  e.hasOwnProperty("value") ? mu(t, e.type, n) : e.hasOwnProperty("defaultValue") && mu(t, e.type, Kn(e.defaultValue)), e.checked == null && e.defaultChecked != null && (t.defaultChecked = !!e.defaultChecked);
}
function hf(t, e, n) {
  if (e.hasOwnProperty("value") || e.hasOwnProperty("defaultValue")) {
    var r = e.type;
    if (!(r !== "submit" && r !== "reset" || e.value !== void 0 && e.value !== null)) return;
    e = "" + t._wrapperState.initialValue, n || e === t.value || (t.value = e), t.defaultValue = e;
  }
  n = t.name, n !== "" && (t.name = ""), t.defaultChecked = !!t._wrapperState.initialChecked, n !== "" && (t.name = n);
}
function mu(t, e, n) {
  (e !== "number" || $s(t.ownerDocument) !== t) && (n == null ? t.defaultValue = "" + t._wrapperState.initialValue : t.defaultValue !== "" + n && (t.defaultValue = "" + n));
}
var Bo = Array.isArray;
function Jr(t, e, n, r) {
  if (t = t.options, e) {
    e = {};
    for (var o = 0; o < n.length; o++) e["$" + n[o]] = !0;
    for (n = 0; n < t.length; n++) o = e.hasOwnProperty("$" + t[n].value), t[n].selected !== o && (t[n].selected = o), o && r && (t[n].defaultSelected = !0);
  } else {
    for (n = "" + Kn(n), e = null, o = 0; o < t.length; o++) {
      if (t[o].value === n) {
        t[o].selected = !0, r && (t[o].defaultSelected = !0);
        return;
      }
      e !== null || t[o].disabled || (e = t[o]);
    }
    e !== null && (e.selected = !0);
  }
}
function yu(t, e) {
  if (e.dangerouslySetInnerHTML != null) throw Error(R(91));
  return xe({}, e, { value: void 0, defaultValue: void 0, children: "" + t._wrapperState.initialValue });
}
function mf(t, e) {
  var n = e.value;
  if (n == null) {
    if (n = e.children, e = e.defaultValue, n != null) {
      if (e != null) throw Error(R(92));
      if (Bo(n)) {
        if (1 < n.length) throw Error(R(93));
        n = n[0];
      }
      e = n;
    }
    e == null && (e = ""), n = e;
  }
  t._wrapperState = { initialValue: Kn(n) };
}
function dh(t, e) {
  var n = Kn(e.value), r = Kn(e.defaultValue);
  n != null && (n = "" + n, n !== t.value && (t.value = n), e.defaultValue == null && t.defaultValue !== n && (t.defaultValue = n)), r != null && (t.defaultValue = "" + r);
}
function yf(t) {
  var e = t.textContent;
  e === t._wrapperState.initialValue && e !== "" && e !== null && (t.value = e);
}
function fh(t) {
  switch (t) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function vu(t, e) {
  return t == null || t === "http://www.w3.org/1999/xhtml" ? fh(e) : t === "http://www.w3.org/2000/svg" && e === "foreignObject" ? "http://www.w3.org/1999/xhtml" : t;
}
var Zi, ph = function(t) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(e, n, r, o) {
    MSApp.execUnsafeLocalFunction(function() {
      return t(e, n, r, o);
    });
  } : t;
}(function(t, e) {
  if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t) t.innerHTML = e;
  else {
    for (Zi = Zi || document.createElement("div"), Zi.innerHTML = "<svg>" + e.valueOf().toString() + "</svg>", e = Zi.firstChild; t.firstChild; ) t.removeChild(t.firstChild);
    for (; e.firstChild; ) t.appendChild(e.firstChild);
  }
});
function di(t, e) {
  if (e) {
    var n = t.firstChild;
    if (n && n === t.lastChild && n.nodeType === 3) {
      n.nodeValue = e;
      return;
    }
  }
  t.textContent = e;
}
var Zo = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
}, k0 = ["Webkit", "ms", "Moz", "O"];
Object.keys(Zo).forEach(function(t) {
  k0.forEach(function(e) {
    e = e + t.charAt(0).toUpperCase() + t.substring(1), Zo[e] = Zo[t];
  });
});
function gh(t, e, n) {
  return e == null || typeof e == "boolean" || e === "" ? "" : n || typeof e != "number" || e === 0 || Zo.hasOwnProperty(t) && Zo[t] ? ("" + e).trim() : e + "px";
}
function hh(t, e) {
  t = t.style;
  for (var n in e) if (e.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, o = gh(n, e[n], r);
    n === "float" && (n = "cssFloat"), r ? t.setProperty(n, o) : t[n] = o;
  }
}
var C0 = xe({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function _u(t, e) {
  if (e) {
    if (C0[t] && (e.children != null || e.dangerouslySetInnerHTML != null)) throw Error(R(137, t));
    if (e.dangerouslySetInnerHTML != null) {
      if (e.children != null) throw Error(R(60));
      if (typeof e.dangerouslySetInnerHTML != "object" || !("__html" in e.dangerouslySetInnerHTML)) throw Error(R(61));
    }
    if (e.style != null && typeof e.style != "object") throw Error(R(62));
  }
}
function xu(t, e) {
  if (t.indexOf("-") === -1) return typeof e.is == "string";
  switch (t) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var wu = null;
function zc(t) {
  return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
}
var Su = null, Yr = null, Zr = null;
function vf(t) {
  if (t = Di(t)) {
    if (typeof Su != "function") throw Error(R(280));
    var e = t.stateNode;
    e && (e = Fl(e), Su(t.stateNode, t.type, e));
  }
}
function mh(t) {
  Yr ? Zr ? Zr.push(t) : Zr = [t] : Yr = t;
}
function yh() {
  if (Yr) {
    var t = Yr, e = Zr;
    if (Zr = Yr = null, vf(t), e) for (t = 0; t < e.length; t++) vf(e[t]);
  }
}
function vh(t, e) {
  return t(e);
}
function _h() {
}
var Sa = !1;
function xh(t, e, n) {
  if (Sa) return t(e, n);
  Sa = !0;
  try {
    return vh(t, e, n);
  } finally {
    Sa = !1, (Yr !== null || Zr !== null) && (_h(), yh());
  }
}
function fi(t, e) {
  var n = t.stateNode;
  if (n === null) return null;
  var r = Fl(n);
  if (r === null) return null;
  n = r[e];
  e: switch (e) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (t = t.type, r = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !r;
      break e;
    default:
      t = !1;
  }
  if (t) return null;
  if (n && typeof n != "function") throw Error(R(231, e, typeof n));
  return n;
}
var ku = !1;
if (yn) try {
  var Oo = {};
  Object.defineProperty(Oo, "passive", { get: function() {
    ku = !0;
  } }), window.addEventListener("test", Oo, Oo), window.removeEventListener("test", Oo, Oo);
} catch {
  ku = !1;
}
function E0(t, e, n, r, o, i, s, l, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    e.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var Xo = !1, Ls = null, Is = !1, Cu = null, T0 = { onError: function(t) {
  Xo = !0, Ls = t;
} };
function N0(t, e, n, r, o, i, s, l, a) {
  Xo = !1, Ls = null, E0.apply(T0, arguments);
}
function b0(t, e, n, r, o, i, s, l, a) {
  if (N0.apply(this, arguments), Xo) {
    if (Xo) {
      var u = Ls;
      Xo = !1, Ls = null;
    } else throw Error(R(198));
    Is || (Is = !0, Cu = u);
  }
}
function Er(t) {
  var e = t, n = t;
  if (t.alternate) for (; e.return; ) e = e.return;
  else {
    t = e;
    do
      e = t, e.flags & 4098 && (n = e.return), t = e.return;
    while (t);
  }
  return e.tag === 3 ? n : null;
}
function wh(t) {
  if (t.tag === 13) {
    var e = t.memoizedState;
    if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
  }
  return null;
}
function _f(t) {
  if (Er(t) !== t) throw Error(R(188));
}
function O0(t) {
  var e = t.alternate;
  if (!e) {
    if (e = Er(t), e === null) throw Error(R(188));
    return e !== t ? null : t;
  }
  for (var n = t, r = e; ; ) {
    var o = n.return;
    if (o === null) break;
    var i = o.alternate;
    if (i === null) {
      if (r = o.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (o.child === i.child) {
      for (i = o.child; i; ) {
        if (i === n) return _f(o), t;
        if (i === r) return _f(o), e;
        i = i.sibling;
      }
      throw Error(R(188));
    }
    if (n.return !== r.return) n = o, r = i;
    else {
      for (var s = !1, l = o.child; l; ) {
        if (l === n) {
          s = !0, n = o, r = i;
          break;
        }
        if (l === r) {
          s = !0, r = o, n = i;
          break;
        }
        l = l.sibling;
      }
      if (!s) {
        for (l = i.child; l; ) {
          if (l === n) {
            s = !0, n = i, r = o;
            break;
          }
          if (l === r) {
            s = !0, r = i, n = o;
            break;
          }
          l = l.sibling;
        }
        if (!s) throw Error(R(189));
      }
    }
    if (n.alternate !== r) throw Error(R(190));
  }
  if (n.tag !== 3) throw Error(R(188));
  return n.stateNode.current === n ? t : e;
}
function Sh(t) {
  return t = O0(t), t !== null ? kh(t) : null;
}
function kh(t) {
  if (t.tag === 5 || t.tag === 6) return t;
  for (t = t.child; t !== null; ) {
    var e = kh(t);
    if (e !== null) return e;
    t = t.sibling;
  }
  return null;
}
var Ch = vt.unstable_scheduleCallback, xf = vt.unstable_cancelCallback, A0 = vt.unstable_shouldYield, F0 = vt.unstable_requestPaint, ke = vt.unstable_now, P0 = vt.unstable_getCurrentPriorityLevel, jc = vt.unstable_ImmediatePriority, Eh = vt.unstable_UserBlockingPriority, Rs = vt.unstable_NormalPriority, $0 = vt.unstable_LowPriority, Th = vt.unstable_IdlePriority, Nl = null, Jt = null;
function L0(t) {
  if (Jt && typeof Jt.onCommitFiberRoot == "function") try {
    Jt.onCommitFiberRoot(Nl, t, void 0, (t.current.flags & 128) === 128);
  } catch {
  }
}
var Dt = Math.clz32 ? Math.clz32 : D0, I0 = Math.log, R0 = Math.LN2;
function D0(t) {
  return t >>>= 0, t === 0 ? 32 : 31 - (I0(t) / R0 | 0) | 0;
}
var Xi = 64, qi = 4194304;
function Uo(t) {
  switch (t & -t) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return t & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return t;
  }
}
function Ds(t, e) {
  var n = t.pendingLanes;
  if (n === 0) return 0;
  var r = 0, o = t.suspendedLanes, i = t.pingedLanes, s = n & 268435455;
  if (s !== 0) {
    var l = s & ~o;
    l !== 0 ? r = Uo(l) : (i &= s, i !== 0 && (r = Uo(i)));
  } else s = n & ~o, s !== 0 ? r = Uo(s) : i !== 0 && (r = Uo(i));
  if (r === 0) return 0;
  if (e !== 0 && e !== r && !(e & o) && (o = r & -r, i = e & -e, o >= i || o === 16 && (i & 4194240) !== 0)) return e;
  if (r & 4 && (r |= n & 16), e = t.entangledLanes, e !== 0) for (t = t.entanglements, e &= r; 0 < e; ) n = 31 - Dt(e), o = 1 << n, r |= t[n], e &= ~o;
  return r;
}
function M0(t, e) {
  switch (t) {
    case 1:
    case 2:
    case 4:
      return e + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function z0(t, e) {
  for (var n = t.suspendedLanes, r = t.pingedLanes, o = t.expirationTimes, i = t.pendingLanes; 0 < i; ) {
    var s = 31 - Dt(i), l = 1 << s, a = o[s];
    a === -1 ? (!(l & n) || l & r) && (o[s] = M0(l, e)) : a <= e && (t.expiredLanes |= l), i &= ~l;
  }
}
function Eu(t) {
  return t = t.pendingLanes & -1073741825, t !== 0 ? t : t & 1073741824 ? 1073741824 : 0;
}
function Nh() {
  var t = Xi;
  return Xi <<= 1, !(Xi & 4194240) && (Xi = 64), t;
}
function ka(t) {
  for (var e = [], n = 0; 31 > n; n++) e.push(t);
  return e;
}
function Ii(t, e, n) {
  t.pendingLanes |= e, e !== 536870912 && (t.suspendedLanes = 0, t.pingedLanes = 0), t = t.eventTimes, e = 31 - Dt(e), t[e] = n;
}
function j0(t, e) {
  var n = t.pendingLanes & ~e;
  t.pendingLanes = e, t.suspendedLanes = 0, t.pingedLanes = 0, t.expiredLanes &= e, t.mutableReadLanes &= e, t.entangledLanes &= e, e = t.entanglements;
  var r = t.eventTimes;
  for (t = t.expirationTimes; 0 < n; ) {
    var o = 31 - Dt(n), i = 1 << o;
    e[o] = 0, r[o] = -1, t[o] = -1, n &= ~i;
  }
}
function Bc(t, e) {
  var n = t.entangledLanes |= e;
  for (t = t.entanglements; n; ) {
    var r = 31 - Dt(n), o = 1 << r;
    o & e | t[r] & e && (t[r] |= e), n &= ~o;
  }
}
var ue = 0;
function bh(t) {
  return t &= -t, 1 < t ? 4 < t ? t & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Oh, Uc, Ah, Fh, Ph, Tu = !1, es = [], In = null, Rn = null, Dn = null, pi = /* @__PURE__ */ new Map(), gi = /* @__PURE__ */ new Map(), On = [], B0 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function wf(t, e) {
  switch (t) {
    case "focusin":
    case "focusout":
      In = null;
      break;
    case "dragenter":
    case "dragleave":
      Rn = null;
      break;
    case "mouseover":
    case "mouseout":
      Dn = null;
      break;
    case "pointerover":
    case "pointerout":
      pi.delete(e.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      gi.delete(e.pointerId);
  }
}
function Ao(t, e, n, r, o, i) {
  return t === null || t.nativeEvent !== i ? (t = { blockedOn: e, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [o] }, e !== null && (e = Di(e), e !== null && Uc(e)), t) : (t.eventSystemFlags |= r, e = t.targetContainers, o !== null && e.indexOf(o) === -1 && e.push(o), t);
}
function U0(t, e, n, r, o) {
  switch (e) {
    case "focusin":
      return In = Ao(In, t, e, n, r, o), !0;
    case "dragenter":
      return Rn = Ao(Rn, t, e, n, r, o), !0;
    case "mouseover":
      return Dn = Ao(Dn, t, e, n, r, o), !0;
    case "pointerover":
      var i = o.pointerId;
      return pi.set(i, Ao(pi.get(i) || null, t, e, n, r, o)), !0;
    case "gotpointercapture":
      return i = o.pointerId, gi.set(i, Ao(gi.get(i) || null, t, e, n, r, o)), !0;
  }
  return !1;
}
function $h(t) {
  var e = lr(t.target);
  if (e !== null) {
    var n = Er(e);
    if (n !== null) {
      if (e = n.tag, e === 13) {
        if (e = wh(n), e !== null) {
          t.blockedOn = e, Ph(t.priority, function() {
            Ah(n);
          });
          return;
        }
      } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  t.blockedOn = null;
}
function _s(t) {
  if (t.blockedOn !== null) return !1;
  for (var e = t.targetContainers; 0 < e.length; ) {
    var n = Nu(t.domEventName, t.eventSystemFlags, e[0], t.nativeEvent);
    if (n === null) {
      n = t.nativeEvent;
      var r = new n.constructor(n.type, n);
      wu = r, n.target.dispatchEvent(r), wu = null;
    } else return e = Di(n), e !== null && Uc(e), t.blockedOn = n, !1;
    e.shift();
  }
  return !0;
}
function Sf(t, e, n) {
  _s(t) && n.delete(e);
}
function W0() {
  Tu = !1, In !== null && _s(In) && (In = null), Rn !== null && _s(Rn) && (Rn = null), Dn !== null && _s(Dn) && (Dn = null), pi.forEach(Sf), gi.forEach(Sf);
}
function Fo(t, e) {
  t.blockedOn === e && (t.blockedOn = null, Tu || (Tu = !0, vt.unstable_scheduleCallback(vt.unstable_NormalPriority, W0)));
}
function hi(t) {
  function e(o) {
    return Fo(o, t);
  }
  if (0 < es.length) {
    Fo(es[0], t);
    for (var n = 1; n < es.length; n++) {
      var r = es[n];
      r.blockedOn === t && (r.blockedOn = null);
    }
  }
  for (In !== null && Fo(In, t), Rn !== null && Fo(Rn, t), Dn !== null && Fo(Dn, t), pi.forEach(e), gi.forEach(e), n = 0; n < On.length; n++) r = On[n], r.blockedOn === t && (r.blockedOn = null);
  for (; 0 < On.length && (n = On[0], n.blockedOn === null); ) $h(n), n.blockedOn === null && On.shift();
}
var Xr = kn.ReactCurrentBatchConfig, Ms = !0;
function V0(t, e, n, r) {
  var o = ue, i = Xr.transition;
  Xr.transition = null;
  try {
    ue = 1, Wc(t, e, n, r);
  } finally {
    ue = o, Xr.transition = i;
  }
}
function H0(t, e, n, r) {
  var o = ue, i = Xr.transition;
  Xr.transition = null;
  try {
    ue = 4, Wc(t, e, n, r);
  } finally {
    ue = o, Xr.transition = i;
  }
}
function Wc(t, e, n, r) {
  if (Ms) {
    var o = Nu(t, e, n, r);
    if (o === null) $a(t, e, r, zs, n), wf(t, r);
    else if (U0(o, t, e, n, r)) r.stopPropagation();
    else if (wf(t, r), e & 4 && -1 < B0.indexOf(t)) {
      for (; o !== null; ) {
        var i = Di(o);
        if (i !== null && Oh(i), i = Nu(t, e, n, r), i === null && $a(t, e, r, zs, n), i === o) break;
        o = i;
      }
      o !== null && r.stopPropagation();
    } else $a(t, e, r, null, n);
  }
}
var zs = null;
function Nu(t, e, n, r) {
  if (zs = null, t = zc(r), t = lr(t), t !== null) if (e = Er(t), e === null) t = null;
  else if (n = e.tag, n === 13) {
    if (t = wh(e), t !== null) return t;
    t = null;
  } else if (n === 3) {
    if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
    t = null;
  } else e !== t && (t = null);
  return zs = t, null;
}
function Lh(t) {
  switch (t) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (P0()) {
        case jc:
          return 1;
        case Eh:
          return 4;
        case Rs:
        case $0:
          return 16;
        case Th:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Fn = null, Vc = null, xs = null;
function Ih() {
  if (xs) return xs;
  var t, e = Vc, n = e.length, r, o = "value" in Fn ? Fn.value : Fn.textContent, i = o.length;
  for (t = 0; t < n && e[t] === o[t]; t++) ;
  var s = n - t;
  for (r = 1; r <= s && e[n - r] === o[i - r]; r++) ;
  return xs = o.slice(t, 1 < r ? 1 - r : void 0);
}
function ws(t) {
  var e = t.keyCode;
  return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
}
function ts() {
  return !0;
}
function kf() {
  return !1;
}
function wt(t) {
  function e(n, r, o, i, s) {
    this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = s, this.currentTarget = null;
    for (var l in t) t.hasOwnProperty(l) && (n = t[l], this[l] = n ? n(i) : i[l]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? ts : kf, this.isPropagationStopped = kf, this;
  }
  return xe(e.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = ts);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = ts);
  }, persist: function() {
  }, isPersistent: ts }), e;
}
var mo = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(t) {
  return t.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, Hc = wt(mo), Ri = xe({}, mo, { view: 0, detail: 0 }), K0 = wt(Ri), Ca, Ea, Po, bl = xe({}, Ri, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Kc, button: 0, buttons: 0, relatedTarget: function(t) {
  return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
}, movementX: function(t) {
  return "movementX" in t ? t.movementX : (t !== Po && (Po && t.type === "mousemove" ? (Ca = t.screenX - Po.screenX, Ea = t.screenY - Po.screenY) : Ea = Ca = 0, Po = t), Ca);
}, movementY: function(t) {
  return "movementY" in t ? t.movementY : Ea;
} }), Cf = wt(bl), Q0 = xe({}, bl, { dataTransfer: 0 }), G0 = wt(Q0), J0 = xe({}, Ri, { relatedTarget: 0 }), Ta = wt(J0), Y0 = xe({}, mo, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Z0 = wt(Y0), X0 = xe({}, mo, { clipboardData: function(t) {
  return "clipboardData" in t ? t.clipboardData : window.clipboardData;
} }), q0 = wt(X0), e_ = xe({}, mo, { data: 0 }), Ef = wt(e_), t_ = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, n_ = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, r_ = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function o_(t) {
  var e = this.nativeEvent;
  return e.getModifierState ? e.getModifierState(t) : (t = r_[t]) ? !!e[t] : !1;
}
function Kc() {
  return o_;
}
var i_ = xe({}, Ri, { key: function(t) {
  if (t.key) {
    var e = t_[t.key] || t.key;
    if (e !== "Unidentified") return e;
  }
  return t.type === "keypress" ? (t = ws(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? n_[t.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Kc, charCode: function(t) {
  return t.type === "keypress" ? ws(t) : 0;
}, keyCode: function(t) {
  return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
}, which: function(t) {
  return t.type === "keypress" ? ws(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
} }), s_ = wt(i_), l_ = xe({}, bl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Tf = wt(l_), a_ = xe({}, Ri, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Kc }), u_ = wt(a_), c_ = xe({}, mo, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), d_ = wt(c_), f_ = xe({}, bl, {
  deltaX: function(t) {
    return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
  },
  deltaY: function(t) {
    return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), p_ = wt(f_), g_ = [9, 13, 27, 32], Qc = yn && "CompositionEvent" in window, qo = null;
yn && "documentMode" in document && (qo = document.documentMode);
var h_ = yn && "TextEvent" in window && !qo, Rh = yn && (!Qc || qo && 8 < qo && 11 >= qo), Nf = " ", bf = !1;
function Dh(t, e) {
  switch (t) {
    case "keyup":
      return g_.indexOf(e.keyCode) !== -1;
    case "keydown":
      return e.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Mh(t) {
  return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
}
var Mr = !1;
function m_(t, e) {
  switch (t) {
    case "compositionend":
      return Mh(e);
    case "keypress":
      return e.which !== 32 ? null : (bf = !0, Nf);
    case "textInput":
      return t = e.data, t === Nf && bf ? null : t;
    default:
      return null;
  }
}
function y_(t, e) {
  if (Mr) return t === "compositionend" || !Qc && Dh(t, e) ? (t = Ih(), xs = Vc = Fn = null, Mr = !1, t) : null;
  switch (t) {
    case "paste":
      return null;
    case "keypress":
      if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
        if (e.char && 1 < e.char.length) return e.char;
        if (e.which) return String.fromCharCode(e.which);
      }
      return null;
    case "compositionend":
      return Rh && e.locale !== "ko" ? null : e.data;
    default:
      return null;
  }
}
var v_ = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function Of(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e === "input" ? !!v_[t.type] : e === "textarea";
}
function zh(t, e, n, r) {
  mh(r), e = js(e, "onChange"), 0 < e.length && (n = new Hc("onChange", "change", null, n, r), t.push({ event: n, listeners: e }));
}
var ei = null, mi = null;
function __(t) {
  Yh(t, 0);
}
function Ol(t) {
  var e = Br(t);
  if (uh(e)) return t;
}
function x_(t, e) {
  if (t === "change") return e;
}
var jh = !1;
if (yn) {
  var Na;
  if (yn) {
    var ba = "oninput" in document;
    if (!ba) {
      var Af = document.createElement("div");
      Af.setAttribute("oninput", "return;"), ba = typeof Af.oninput == "function";
    }
    Na = ba;
  } else Na = !1;
  jh = Na && (!document.documentMode || 9 < document.documentMode);
}
function Ff() {
  ei && (ei.detachEvent("onpropertychange", Bh), mi = ei = null);
}
function Bh(t) {
  if (t.propertyName === "value" && Ol(mi)) {
    var e = [];
    zh(e, mi, t, zc(t)), xh(__, e);
  }
}
function w_(t, e, n) {
  t === "focusin" ? (Ff(), ei = e, mi = n, ei.attachEvent("onpropertychange", Bh)) : t === "focusout" && Ff();
}
function S_(t) {
  if (t === "selectionchange" || t === "keyup" || t === "keydown") return Ol(mi);
}
function k_(t, e) {
  if (t === "click") return Ol(e);
}
function C_(t, e) {
  if (t === "input" || t === "change") return Ol(e);
}
function E_(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var jt = typeof Object.is == "function" ? Object.is : E_;
function yi(t, e) {
  if (jt(t, e)) return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
  var n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!uu.call(e, o) || !jt(t[o], e[o])) return !1;
  }
  return !0;
}
function Pf(t) {
  for (; t && t.firstChild; ) t = t.firstChild;
  return t;
}
function $f(t, e) {
  var n = Pf(t);
  t = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = t + n.textContent.length, t <= e && r >= e) return { node: n, offset: e - t };
      t = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Pf(n);
  }
}
function Uh(t, e) {
  return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Uh(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
}
function Wh() {
  for (var t = window, e = $s(); e instanceof t.HTMLIFrameElement; ) {
    try {
      var n = typeof e.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) t = e.contentWindow;
    else break;
    e = $s(t.document);
  }
  return e;
}
function Gc(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
}
function T_(t) {
  var e = Wh(), n = t.focusedElem, r = t.selectionRange;
  if (e !== n && n && n.ownerDocument && Uh(n.ownerDocument.documentElement, n)) {
    if (r !== null && Gc(n)) {
      if (e = r.start, t = r.end, t === void 0 && (t = e), "selectionStart" in n) n.selectionStart = e, n.selectionEnd = Math.min(t, n.value.length);
      else if (t = (e = n.ownerDocument || document) && e.defaultView || window, t.getSelection) {
        t = t.getSelection();
        var o = n.textContent.length, i = Math.min(r.start, o);
        r = r.end === void 0 ? i : Math.min(r.end, o), !t.extend && i > r && (o = r, r = i, i = o), o = $f(n, i);
        var s = $f(
          n,
          r
        );
        o && s && (t.rangeCount !== 1 || t.anchorNode !== o.node || t.anchorOffset !== o.offset || t.focusNode !== s.node || t.focusOffset !== s.offset) && (e = e.createRange(), e.setStart(o.node, o.offset), t.removeAllRanges(), i > r ? (t.addRange(e), t.extend(s.node, s.offset)) : (e.setEnd(s.node, s.offset), t.addRange(e)));
      }
    }
    for (e = [], t = n; t = t.parentNode; ) t.nodeType === 1 && e.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < e.length; n++) t = e[n], t.element.scrollLeft = t.left, t.element.scrollTop = t.top;
  }
}
var N_ = yn && "documentMode" in document && 11 >= document.documentMode, zr = null, bu = null, ti = null, Ou = !1;
function Lf(t, e, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Ou || zr == null || zr !== $s(r) || (r = zr, "selectionStart" in r && Gc(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), ti && yi(ti, r) || (ti = r, r = js(bu, "onSelect"), 0 < r.length && (e = new Hc("onSelect", "select", null, e, n), t.push({ event: e, listeners: r }), e.target = zr)));
}
function ns(t, e) {
  var n = {};
  return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
}
var jr = { animationend: ns("Animation", "AnimationEnd"), animationiteration: ns("Animation", "AnimationIteration"), animationstart: ns("Animation", "AnimationStart"), transitionend: ns("Transition", "TransitionEnd") }, Oa = {}, Vh = {};
yn && (Vh = document.createElement("div").style, "AnimationEvent" in window || (delete jr.animationend.animation, delete jr.animationiteration.animation, delete jr.animationstart.animation), "TransitionEvent" in window || delete jr.transitionend.transition);
function Al(t) {
  if (Oa[t]) return Oa[t];
  if (!jr[t]) return t;
  var e = jr[t], n;
  for (n in e) if (e.hasOwnProperty(n) && n in Vh) return Oa[t] = e[n];
  return t;
}
var Hh = Al("animationend"), Kh = Al("animationiteration"), Qh = Al("animationstart"), Gh = Al("transitionend"), Jh = /* @__PURE__ */ new Map(), If = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Jn(t, e) {
  Jh.set(t, e), Cr(e, [t]);
}
for (var Aa = 0; Aa < If.length; Aa++) {
  var Fa = If[Aa], b_ = Fa.toLowerCase(), O_ = Fa[0].toUpperCase() + Fa.slice(1);
  Jn(b_, "on" + O_);
}
Jn(Hh, "onAnimationEnd");
Jn(Kh, "onAnimationIteration");
Jn(Qh, "onAnimationStart");
Jn("dblclick", "onDoubleClick");
Jn("focusin", "onFocus");
Jn("focusout", "onBlur");
Jn(Gh, "onTransitionEnd");
no("onMouseEnter", ["mouseout", "mouseover"]);
no("onMouseLeave", ["mouseout", "mouseover"]);
no("onPointerEnter", ["pointerout", "pointerover"]);
no("onPointerLeave", ["pointerout", "pointerover"]);
Cr("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
Cr("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
Cr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Cr("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
Cr("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
Cr("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Wo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), A_ = new Set("cancel close invalid load scroll toggle".split(" ").concat(Wo));
function Rf(t, e, n) {
  var r = t.type || "unknown-event";
  t.currentTarget = n, b0(r, e, void 0, t), t.currentTarget = null;
}
function Yh(t, e) {
  e = (e & 4) !== 0;
  for (var n = 0; n < t.length; n++) {
    var r = t[n], o = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (e) for (var s = r.length - 1; 0 <= s; s--) {
        var l = r[s], a = l.instance, u = l.currentTarget;
        if (l = l.listener, a !== i && o.isPropagationStopped()) break e;
        Rf(o, l, u), i = a;
      }
      else for (s = 0; s < r.length; s++) {
        if (l = r[s], a = l.instance, u = l.currentTarget, l = l.listener, a !== i && o.isPropagationStopped()) break e;
        Rf(o, l, u), i = a;
      }
    }
  }
  if (Is) throw t = Cu, Is = !1, Cu = null, t;
}
function fe(t, e) {
  var n = e[Lu];
  n === void 0 && (n = e[Lu] = /* @__PURE__ */ new Set());
  var r = t + "__bubble";
  n.has(r) || (Zh(e, t, 2, !1), n.add(r));
}
function Pa(t, e, n) {
  var r = 0;
  e && (r |= 4), Zh(n, t, r, e);
}
var rs = "_reactListening" + Math.random().toString(36).slice(2);
function vi(t) {
  if (!t[rs]) {
    t[rs] = !0, oh.forEach(function(n) {
      n !== "selectionchange" && (A_.has(n) || Pa(n, !1, t), Pa(n, !0, t));
    });
    var e = t.nodeType === 9 ? t : t.ownerDocument;
    e === null || e[rs] || (e[rs] = !0, Pa("selectionchange", !1, e));
  }
}
function Zh(t, e, n, r) {
  switch (Lh(e)) {
    case 1:
      var o = V0;
      break;
    case 4:
      o = H0;
      break;
    default:
      o = Wc;
  }
  n = o.bind(null, e, n, t), o = void 0, !ku || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (o = !0), r ? o !== void 0 ? t.addEventListener(e, n, { capture: !0, passive: o }) : t.addEventListener(e, n, !0) : o !== void 0 ? t.addEventListener(e, n, { passive: o }) : t.addEventListener(e, n, !1);
}
function $a(t, e, n, r, o) {
  var i = r;
  if (!(e & 1) && !(e & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var s = r.tag;
    if (s === 3 || s === 4) {
      var l = r.stateNode.containerInfo;
      if (l === o || l.nodeType === 8 && l.parentNode === o) break;
      if (s === 4) for (s = r.return; s !== null; ) {
        var a = s.tag;
        if ((a === 3 || a === 4) && (a = s.stateNode.containerInfo, a === o || a.nodeType === 8 && a.parentNode === o)) return;
        s = s.return;
      }
      for (; l !== null; ) {
        if (s = lr(l), s === null) return;
        if (a = s.tag, a === 5 || a === 6) {
          r = i = s;
          continue e;
        }
        l = l.parentNode;
      }
    }
    r = r.return;
  }
  xh(function() {
    var u = i, c = zc(n), p = [];
    e: {
      var f = Jh.get(t);
      if (f !== void 0) {
        var m = Hc, h = t;
        switch (t) {
          case "keypress":
            if (ws(n) === 0) break e;
          case "keydown":
          case "keyup":
            m = s_;
            break;
          case "focusin":
            h = "focus", m = Ta;
            break;
          case "focusout":
            h = "blur", m = Ta;
            break;
          case "beforeblur":
          case "afterblur":
            m = Ta;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            m = Cf;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            m = G0;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            m = u_;
            break;
          case Hh:
          case Kh:
          case Qh:
            m = Z0;
            break;
          case Gh:
            m = d_;
            break;
          case "scroll":
            m = K0;
            break;
          case "wheel":
            m = p_;
            break;
          case "copy":
          case "cut":
          case "paste":
            m = q0;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            m = Tf;
        }
        var y = (e & 4) !== 0, _ = !y && t === "scroll", v = y ? f !== null ? f + "Capture" : null : f;
        y = [];
        for (var d = u, g; d !== null; ) {
          g = d;
          var x = g.stateNode;
          if (g.tag === 5 && x !== null && (g = x, v !== null && (x = fi(d, v), x != null && y.push(_i(d, x, g)))), _) break;
          d = d.return;
        }
        0 < y.length && (f = new m(f, h, null, n, c), p.push({ event: f, listeners: y }));
      }
    }
    if (!(e & 7)) {
      e: {
        if (f = t === "mouseover" || t === "pointerover", m = t === "mouseout" || t === "pointerout", f && n !== wu && (h = n.relatedTarget || n.fromElement) && (lr(h) || h[vn])) break e;
        if ((m || f) && (f = c.window === c ? c : (f = c.ownerDocument) ? f.defaultView || f.parentWindow : window, m ? (h = n.relatedTarget || n.toElement, m = u, h = h ? lr(h) : null, h !== null && (_ = Er(h), h !== _ || h.tag !== 5 && h.tag !== 6) && (h = null)) : (m = null, h = u), m !== h)) {
          if (y = Cf, x = "onMouseLeave", v = "onMouseEnter", d = "mouse", (t === "pointerout" || t === "pointerover") && (y = Tf, x = "onPointerLeave", v = "onPointerEnter", d = "pointer"), _ = m == null ? f : Br(m), g = h == null ? f : Br(h), f = new y(x, d + "leave", m, n, c), f.target = _, f.relatedTarget = g, x = null, lr(c) === u && (y = new y(v, d + "enter", h, n, c), y.target = g, y.relatedTarget = _, x = y), _ = x, m && h) t: {
            for (y = m, v = h, d = 0, g = y; g; g = Or(g)) d++;
            for (g = 0, x = v; x; x = Or(x)) g++;
            for (; 0 < d - g; ) y = Or(y), d--;
            for (; 0 < g - d; ) v = Or(v), g--;
            for (; d--; ) {
              if (y === v || v !== null && y === v.alternate) break t;
              y = Or(y), v = Or(v);
            }
            y = null;
          }
          else y = null;
          m !== null && Df(p, f, m, y, !1), h !== null && _ !== null && Df(p, _, h, y, !0);
        }
      }
      e: {
        if (f = u ? Br(u) : window, m = f.nodeName && f.nodeName.toLowerCase(), m === "select" || m === "input" && f.type === "file") var w = x_;
        else if (Of(f)) if (jh) w = C_;
        else {
          w = S_;
          var S = w_;
        }
        else (m = f.nodeName) && m.toLowerCase() === "input" && (f.type === "checkbox" || f.type === "radio") && (w = k_);
        if (w && (w = w(t, u))) {
          zh(p, w, n, c);
          break e;
        }
        S && S(t, f, u), t === "focusout" && (S = f._wrapperState) && S.controlled && f.type === "number" && mu(f, "number", f.value);
      }
      switch (S = u ? Br(u) : window, t) {
        case "focusin":
          (Of(S) || S.contentEditable === "true") && (zr = S, bu = u, ti = null);
          break;
        case "focusout":
          ti = bu = zr = null;
          break;
        case "mousedown":
          Ou = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Ou = !1, Lf(p, n, c);
          break;
        case "selectionchange":
          if (N_) break;
        case "keydown":
        case "keyup":
          Lf(p, n, c);
      }
      var k;
      if (Qc) e: {
        switch (t) {
          case "compositionstart":
            var C = "onCompositionStart";
            break e;
          case "compositionend":
            C = "onCompositionEnd";
            break e;
          case "compositionupdate":
            C = "onCompositionUpdate";
            break e;
        }
        C = void 0;
      }
      else Mr ? Dh(t, n) && (C = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (C = "onCompositionStart");
      C && (Rh && n.locale !== "ko" && (Mr || C !== "onCompositionStart" ? C === "onCompositionEnd" && Mr && (k = Ih()) : (Fn = c, Vc = "value" in Fn ? Fn.value : Fn.textContent, Mr = !0)), S = js(u, C), 0 < S.length && (C = new Ef(C, t, null, n, c), p.push({ event: C, listeners: S }), k ? C.data = k : (k = Mh(n), k !== null && (C.data = k)))), (k = h_ ? m_(t, n) : y_(t, n)) && (u = js(u, "onBeforeInput"), 0 < u.length && (c = new Ef("onBeforeInput", "beforeinput", null, n, c), p.push({ event: c, listeners: u }), c.data = k));
    }
    Yh(p, e);
  });
}
function _i(t, e, n) {
  return { instance: t, listener: e, currentTarget: n };
}
function js(t, e) {
  for (var n = e + "Capture", r = []; t !== null; ) {
    var o = t, i = o.stateNode;
    o.tag === 5 && i !== null && (o = i, i = fi(t, n), i != null && r.unshift(_i(t, i, o)), i = fi(t, e), i != null && r.push(_i(t, i, o))), t = t.return;
  }
  return r;
}
function Or(t) {
  if (t === null) return null;
  do
    t = t.return;
  while (t && t.tag !== 5);
  return t || null;
}
function Df(t, e, n, r, o) {
  for (var i = e._reactName, s = []; n !== null && n !== r; ) {
    var l = n, a = l.alternate, u = l.stateNode;
    if (a !== null && a === r) break;
    l.tag === 5 && u !== null && (l = u, o ? (a = fi(n, i), a != null && s.unshift(_i(n, a, l))) : o || (a = fi(n, i), a != null && s.push(_i(n, a, l)))), n = n.return;
  }
  s.length !== 0 && t.push({ event: e, listeners: s });
}
var F_ = /\r\n?/g, P_ = /\u0000|\uFFFD/g;
function Mf(t) {
  return (typeof t == "string" ? t : "" + t).replace(F_, `
`).replace(P_, "");
}
function os(t, e, n) {
  if (e = Mf(e), Mf(t) !== e && n) throw Error(R(425));
}
function Bs() {
}
var Au = null, Fu = null;
function Pu(t, e) {
  return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
}
var $u = typeof setTimeout == "function" ? setTimeout : void 0, $_ = typeof clearTimeout == "function" ? clearTimeout : void 0, zf = typeof Promise == "function" ? Promise : void 0, L_ = typeof queueMicrotask == "function" ? queueMicrotask : typeof zf < "u" ? function(t) {
  return zf.resolve(null).then(t).catch(I_);
} : $u;
function I_(t) {
  setTimeout(function() {
    throw t;
  });
}
function La(t, e) {
  var n = e, r = 0;
  do {
    var o = n.nextSibling;
    if (t.removeChild(n), o && o.nodeType === 8) if (n = o.data, n === "/$") {
      if (r === 0) {
        t.removeChild(o), hi(e);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = o;
  } while (n);
  hi(e);
}
function Mn(t) {
  for (; t != null; t = t.nextSibling) {
    var e = t.nodeType;
    if (e === 1 || e === 3) break;
    if (e === 8) {
      if (e = t.data, e === "$" || e === "$!" || e === "$?") break;
      if (e === "/$") return null;
    }
  }
  return t;
}
function jf(t) {
  t = t.previousSibling;
  for (var e = 0; t; ) {
    if (t.nodeType === 8) {
      var n = t.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (e === 0) return t;
        e--;
      } else n === "/$" && e++;
    }
    t = t.previousSibling;
  }
  return null;
}
var yo = Math.random().toString(36).slice(2), Ht = "__reactFiber$" + yo, xi = "__reactProps$" + yo, vn = "__reactContainer$" + yo, Lu = "__reactEvents$" + yo, R_ = "__reactListeners$" + yo, D_ = "__reactHandles$" + yo;
function lr(t) {
  var e = t[Ht];
  if (e) return e;
  for (var n = t.parentNode; n; ) {
    if (e = n[vn] || n[Ht]) {
      if (n = e.alternate, e.child !== null || n !== null && n.child !== null) for (t = jf(t); t !== null; ) {
        if (n = t[Ht]) return n;
        t = jf(t);
      }
      return e;
    }
    t = n, n = t.parentNode;
  }
  return null;
}
function Di(t) {
  return t = t[Ht] || t[vn], !t || t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3 ? null : t;
}
function Br(t) {
  if (t.tag === 5 || t.tag === 6) return t.stateNode;
  throw Error(R(33));
}
function Fl(t) {
  return t[xi] || null;
}
var Iu = [], Ur = -1;
function Yn(t) {
  return { current: t };
}
function pe(t) {
  0 > Ur || (t.current = Iu[Ur], Iu[Ur] = null, Ur--);
}
function de(t, e) {
  Ur++, Iu[Ur] = t.current, t.current = e;
}
var Qn = {}, Ye = Yn(Qn), at = Yn(!1), hr = Qn;
function ro(t, e) {
  var n = t.type.contextTypes;
  if (!n) return Qn;
  var r = t.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === e) return r.__reactInternalMemoizedMaskedChildContext;
  var o = {}, i;
  for (i in n) o[i] = e[i];
  return r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = e, t.__reactInternalMemoizedMaskedChildContext = o), o;
}
function ut(t) {
  return t = t.childContextTypes, t != null;
}
function Us() {
  pe(at), pe(Ye);
}
function Bf(t, e, n) {
  if (Ye.current !== Qn) throw Error(R(168));
  de(Ye, e), de(at, n);
}
function Xh(t, e, n) {
  var r = t.stateNode;
  if (e = e.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in e)) throw Error(R(108, w0(t) || "Unknown", o));
  return xe({}, n, r);
}
function Ws(t) {
  return t = (t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext || Qn, hr = Ye.current, de(Ye, t), de(at, at.current), !0;
}
function Uf(t, e, n) {
  var r = t.stateNode;
  if (!r) throw Error(R(169));
  n ? (t = Xh(t, e, hr), r.__reactInternalMemoizedMergedChildContext = t, pe(at), pe(Ye), de(Ye, t)) : pe(at), de(at, n);
}
var un = null, Pl = !1, Ia = !1;
function qh(t) {
  un === null ? un = [t] : un.push(t);
}
function M_(t) {
  Pl = !0, qh(t);
}
function Zn() {
  if (!Ia && un !== null) {
    Ia = !0;
    var t = 0, e = ue;
    try {
      var n = un;
      for (ue = 1; t < n.length; t++) {
        var r = n[t];
        do
          r = r(!0);
        while (r !== null);
      }
      un = null, Pl = !1;
    } catch (o) {
      throw un !== null && (un = un.slice(t + 1)), Ch(jc, Zn), o;
    } finally {
      ue = e, Ia = !1;
    }
  }
  return null;
}
var Wr = [], Vr = 0, Vs = null, Hs = 0, kt = [], Ct = 0, mr = null, dn = 1, fn = "";
function ir(t, e) {
  Wr[Vr++] = Hs, Wr[Vr++] = Vs, Vs = t, Hs = e;
}
function em(t, e, n) {
  kt[Ct++] = dn, kt[Ct++] = fn, kt[Ct++] = mr, mr = t;
  var r = dn;
  t = fn;
  var o = 32 - Dt(r) - 1;
  r &= ~(1 << o), n += 1;
  var i = 32 - Dt(e) + o;
  if (30 < i) {
    var s = o - o % 5;
    i = (r & (1 << s) - 1).toString(32), r >>= s, o -= s, dn = 1 << 32 - Dt(e) + o | n << o | r, fn = i + t;
  } else dn = 1 << i | n << o | r, fn = t;
}
function Jc(t) {
  t.return !== null && (ir(t, 1), em(t, 1, 0));
}
function Yc(t) {
  for (; t === Vs; ) Vs = Wr[--Vr], Wr[Vr] = null, Hs = Wr[--Vr], Wr[Vr] = null;
  for (; t === mr; ) mr = kt[--Ct], kt[Ct] = null, fn = kt[--Ct], kt[Ct] = null, dn = kt[--Ct], kt[Ct] = null;
}
var yt = null, mt = null, me = !1, Rt = null;
function tm(t, e) {
  var n = Et(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = e, n.return = t, e = t.deletions, e === null ? (t.deletions = [n], t.flags |= 16) : e.push(n);
}
function Wf(t, e) {
  switch (t.tag) {
    case 5:
      var n = t.type;
      return e = e.nodeType !== 1 || n.toLowerCase() !== e.nodeName.toLowerCase() ? null : e, e !== null ? (t.stateNode = e, yt = t, mt = Mn(e.firstChild), !0) : !1;
    case 6:
      return e = t.pendingProps === "" || e.nodeType !== 3 ? null : e, e !== null ? (t.stateNode = e, yt = t, mt = null, !0) : !1;
    case 13:
      return e = e.nodeType !== 8 ? null : e, e !== null ? (n = mr !== null ? { id: dn, overflow: fn } : null, t.memoizedState = { dehydrated: e, treeContext: n, retryLane: 1073741824 }, n = Et(18, null, null, 0), n.stateNode = e, n.return = t, t.child = n, yt = t, mt = null, !0) : !1;
    default:
      return !1;
  }
}
function Ru(t) {
  return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
}
function Du(t) {
  if (me) {
    var e = mt;
    if (e) {
      var n = e;
      if (!Wf(t, e)) {
        if (Ru(t)) throw Error(R(418));
        e = Mn(n.nextSibling);
        var r = yt;
        e && Wf(t, e) ? tm(r, n) : (t.flags = t.flags & -4097 | 2, me = !1, yt = t);
      }
    } else {
      if (Ru(t)) throw Error(R(418));
      t.flags = t.flags & -4097 | 2, me = !1, yt = t;
    }
  }
}
function Vf(t) {
  for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; ) t = t.return;
  yt = t;
}
function is(t) {
  if (t !== yt) return !1;
  if (!me) return Vf(t), me = !0, !1;
  var e;
  if ((e = t.tag !== 3) && !(e = t.tag !== 5) && (e = t.type, e = e !== "head" && e !== "body" && !Pu(t.type, t.memoizedProps)), e && (e = mt)) {
    if (Ru(t)) throw nm(), Error(R(418));
    for (; e; ) tm(t, e), e = Mn(e.nextSibling);
  }
  if (Vf(t), t.tag === 13) {
    if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(R(317));
    e: {
      for (t = t.nextSibling, e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$") {
            if (e === 0) {
              mt = Mn(t.nextSibling);
              break e;
            }
            e--;
          } else n !== "$" && n !== "$!" && n !== "$?" || e++;
        }
        t = t.nextSibling;
      }
      mt = null;
    }
  } else mt = yt ? Mn(t.stateNode.nextSibling) : null;
  return !0;
}
function nm() {
  for (var t = mt; t; ) t = Mn(t.nextSibling);
}
function oo() {
  mt = yt = null, me = !1;
}
function Zc(t) {
  Rt === null ? Rt = [t] : Rt.push(t);
}
var z_ = kn.ReactCurrentBatchConfig;
function $o(t, e, n) {
  if (t = n.ref, t !== null && typeof t != "function" && typeof t != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(R(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(R(147, t));
      var o = r, i = "" + t;
      return e !== null && e.ref !== null && typeof e.ref == "function" && e.ref._stringRef === i ? e.ref : (e = function(s) {
        var l = o.refs;
        s === null ? delete l[i] : l[i] = s;
      }, e._stringRef = i, e);
    }
    if (typeof t != "string") throw Error(R(284));
    if (!n._owner) throw Error(R(290, t));
  }
  return t;
}
function ss(t, e) {
  throw t = Object.prototype.toString.call(e), Error(R(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
}
function Hf(t) {
  var e = t._init;
  return e(t._payload);
}
function rm(t) {
  function e(v, d) {
    if (t) {
      var g = v.deletions;
      g === null ? (v.deletions = [d], v.flags |= 16) : g.push(d);
    }
  }
  function n(v, d) {
    if (!t) return null;
    for (; d !== null; ) e(v, d), d = d.sibling;
    return null;
  }
  function r(v, d) {
    for (v = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? v.set(d.key, d) : v.set(d.index, d), d = d.sibling;
    return v;
  }
  function o(v, d) {
    return v = Un(v, d), v.index = 0, v.sibling = null, v;
  }
  function i(v, d, g) {
    return v.index = g, t ? (g = v.alternate, g !== null ? (g = g.index, g < d ? (v.flags |= 2, d) : g) : (v.flags |= 2, d)) : (v.flags |= 1048576, d);
  }
  function s(v) {
    return t && v.alternate === null && (v.flags |= 2), v;
  }
  function l(v, d, g, x) {
    return d === null || d.tag !== 6 ? (d = Ua(g, v.mode, x), d.return = v, d) : (d = o(d, g), d.return = v, d);
  }
  function a(v, d, g, x) {
    var w = g.type;
    return w === Dr ? c(v, d, g.props.children, x, g.key) : d !== null && (d.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Tn && Hf(w) === d.type) ? (x = o(d, g.props), x.ref = $o(v, d, g), x.return = v, x) : (x = bs(g.type, g.key, g.props, null, v.mode, x), x.ref = $o(v, d, g), x.return = v, x);
  }
  function u(v, d, g, x) {
    return d === null || d.tag !== 4 || d.stateNode.containerInfo !== g.containerInfo || d.stateNode.implementation !== g.implementation ? (d = Wa(g, v.mode, x), d.return = v, d) : (d = o(d, g.children || []), d.return = v, d);
  }
  function c(v, d, g, x, w) {
    return d === null || d.tag !== 7 ? (d = dr(g, v.mode, x, w), d.return = v, d) : (d = o(d, g), d.return = v, d);
  }
  function p(v, d, g) {
    if (typeof d == "string" && d !== "" || typeof d == "number") return d = Ua("" + d, v.mode, g), d.return = v, d;
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Ji:
          return g = bs(d.type, d.key, d.props, null, v.mode, g), g.ref = $o(v, null, d), g.return = v, g;
        case Rr:
          return d = Wa(d, v.mode, g), d.return = v, d;
        case Tn:
          var x = d._init;
          return p(v, x(d._payload), g);
      }
      if (Bo(d) || bo(d)) return d = dr(d, v.mode, g, null), d.return = v, d;
      ss(v, d);
    }
    return null;
  }
  function f(v, d, g, x) {
    var w = d !== null ? d.key : null;
    if (typeof g == "string" && g !== "" || typeof g == "number") return w !== null ? null : l(v, d, "" + g, x);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case Ji:
          return g.key === w ? a(v, d, g, x) : null;
        case Rr:
          return g.key === w ? u(v, d, g, x) : null;
        case Tn:
          return w = g._init, f(
            v,
            d,
            w(g._payload),
            x
          );
      }
      if (Bo(g) || bo(g)) return w !== null ? null : c(v, d, g, x, null);
      ss(v, g);
    }
    return null;
  }
  function m(v, d, g, x, w) {
    if (typeof x == "string" && x !== "" || typeof x == "number") return v = v.get(g) || null, l(d, v, "" + x, w);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case Ji:
          return v = v.get(x.key === null ? g : x.key) || null, a(d, v, x, w);
        case Rr:
          return v = v.get(x.key === null ? g : x.key) || null, u(d, v, x, w);
        case Tn:
          var S = x._init;
          return m(v, d, g, S(x._payload), w);
      }
      if (Bo(x) || bo(x)) return v = v.get(g) || null, c(d, v, x, w, null);
      ss(d, x);
    }
    return null;
  }
  function h(v, d, g, x) {
    for (var w = null, S = null, k = d, C = d = 0, E = null; k !== null && C < g.length; C++) {
      k.index > C ? (E = k, k = null) : E = k.sibling;
      var N = f(v, k, g[C], x);
      if (N === null) {
        k === null && (k = E);
        break;
      }
      t && k && N.alternate === null && e(v, k), d = i(N, d, C), S === null ? w = N : S.sibling = N, S = N, k = E;
    }
    if (C === g.length) return n(v, k), me && ir(v, C), w;
    if (k === null) {
      for (; C < g.length; C++) k = p(v, g[C], x), k !== null && (d = i(k, d, C), S === null ? w = k : S.sibling = k, S = k);
      return me && ir(v, C), w;
    }
    for (k = r(v, k); C < g.length; C++) E = m(k, v, C, g[C], x), E !== null && (t && E.alternate !== null && k.delete(E.key === null ? C : E.key), d = i(E, d, C), S === null ? w = E : S.sibling = E, S = E);
    return t && k.forEach(function(D) {
      return e(v, D);
    }), me && ir(v, C), w;
  }
  function y(v, d, g, x) {
    var w = bo(g);
    if (typeof w != "function") throw Error(R(150));
    if (g = w.call(g), g == null) throw Error(R(151));
    for (var S = w = null, k = d, C = d = 0, E = null, N = g.next(); k !== null && !N.done; C++, N = g.next()) {
      k.index > C ? (E = k, k = null) : E = k.sibling;
      var D = f(v, k, N.value, x);
      if (D === null) {
        k === null && (k = E);
        break;
      }
      t && k && D.alternate === null && e(v, k), d = i(D, d, C), S === null ? w = D : S.sibling = D, S = D, k = E;
    }
    if (N.done) return n(
      v,
      k
    ), me && ir(v, C), w;
    if (k === null) {
      for (; !N.done; C++, N = g.next()) N = p(v, N.value, x), N !== null && (d = i(N, d, C), S === null ? w = N : S.sibling = N, S = N);
      return me && ir(v, C), w;
    }
    for (k = r(v, k); !N.done; C++, N = g.next()) N = m(k, v, C, N.value, x), N !== null && (t && N.alternate !== null && k.delete(N.key === null ? C : N.key), d = i(N, d, C), S === null ? w = N : S.sibling = N, S = N);
    return t && k.forEach(function(z) {
      return e(v, z);
    }), me && ir(v, C), w;
  }
  function _(v, d, g, x) {
    if (typeof g == "object" && g !== null && g.type === Dr && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case Ji:
          e: {
            for (var w = g.key, S = d; S !== null; ) {
              if (S.key === w) {
                if (w = g.type, w === Dr) {
                  if (S.tag === 7) {
                    n(v, S.sibling), d = o(S, g.props.children), d.return = v, v = d;
                    break e;
                  }
                } else if (S.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Tn && Hf(w) === S.type) {
                  n(v, S.sibling), d = o(S, g.props), d.ref = $o(v, S, g), d.return = v, v = d;
                  break e;
                }
                n(v, S);
                break;
              } else e(v, S);
              S = S.sibling;
            }
            g.type === Dr ? (d = dr(g.props.children, v.mode, x, g.key), d.return = v, v = d) : (x = bs(g.type, g.key, g.props, null, v.mode, x), x.ref = $o(v, d, g), x.return = v, v = x);
          }
          return s(v);
        case Rr:
          e: {
            for (S = g.key; d !== null; ) {
              if (d.key === S) if (d.tag === 4 && d.stateNode.containerInfo === g.containerInfo && d.stateNode.implementation === g.implementation) {
                n(v, d.sibling), d = o(d, g.children || []), d.return = v, v = d;
                break e;
              } else {
                n(v, d);
                break;
              }
              else e(v, d);
              d = d.sibling;
            }
            d = Wa(g, v.mode, x), d.return = v, v = d;
          }
          return s(v);
        case Tn:
          return S = g._init, _(v, d, S(g._payload), x);
      }
      if (Bo(g)) return h(v, d, g, x);
      if (bo(g)) return y(v, d, g, x);
      ss(v, g);
    }
    return typeof g == "string" && g !== "" || typeof g == "number" ? (g = "" + g, d !== null && d.tag === 6 ? (n(v, d.sibling), d = o(d, g), d.return = v, v = d) : (n(v, d), d = Ua(g, v.mode, x), d.return = v, v = d), s(v)) : n(v, d);
  }
  return _;
}
var io = rm(!0), om = rm(!1), Ks = Yn(null), Qs = null, Hr = null, Xc = null;
function qc() {
  Xc = Hr = Qs = null;
}
function ed(t) {
  var e = Ks.current;
  pe(Ks), t._currentValue = e;
}
function Mu(t, e, n) {
  for (; t !== null; ) {
    var r = t.alternate;
    if ((t.childLanes & e) !== e ? (t.childLanes |= e, r !== null && (r.childLanes |= e)) : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e), t === n) break;
    t = t.return;
  }
}
function qr(t, e) {
  Qs = t, Xc = Hr = null, t = t.dependencies, t !== null && t.firstContext !== null && (t.lanes & e && (lt = !0), t.firstContext = null);
}
function Nt(t) {
  var e = t._currentValue;
  if (Xc !== t) if (t = { context: t, memoizedValue: e, next: null }, Hr === null) {
    if (Qs === null) throw Error(R(308));
    Hr = t, Qs.dependencies = { lanes: 0, firstContext: t };
  } else Hr = Hr.next = t;
  return e;
}
var ar = null;
function td(t) {
  ar === null ? ar = [t] : ar.push(t);
}
function im(t, e, n, r) {
  var o = e.interleaved;
  return o === null ? (n.next = n, td(e)) : (n.next = o.next, o.next = n), e.interleaved = n, _n(t, r);
}
function _n(t, e) {
  t.lanes |= e;
  var n = t.alternate;
  for (n !== null && (n.lanes |= e), n = t, t = t.return; t !== null; ) t.childLanes |= e, n = t.alternate, n !== null && (n.childLanes |= e), n = t, t = t.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Nn = !1;
function nd(t) {
  t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function sm(t, e) {
  t = t.updateQueue, e.updateQueue === t && (e.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, effects: t.effects });
}
function hn(t, e) {
  return { eventTime: t, lane: e, tag: 0, payload: null, callback: null, next: null };
}
function zn(t, e, n) {
  var r = t.updateQueue;
  if (r === null) return null;
  if (r = r.shared, re & 2) {
    var o = r.pending;
    return o === null ? e.next = e : (e.next = o.next, o.next = e), r.pending = e, _n(t, n);
  }
  return o = r.interleaved, o === null ? (e.next = e, td(r)) : (e.next = o.next, o.next = e), r.interleaved = e, _n(t, n);
}
function Ss(t, e, n) {
  if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194240) !== 0)) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, Bc(t, n);
  }
}
function Kf(t, e) {
  var n = t.updateQueue, r = t.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var o = null, i = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var s = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        i === null ? o = i = s : i = i.next = s, n = n.next;
      } while (n !== null);
      i === null ? o = i = e : i = i.next = e;
    } else o = i = e;
    n = { baseState: r.baseState, firstBaseUpdate: o, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, t.updateQueue = n;
    return;
  }
  t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
}
function Gs(t, e, n, r) {
  var o = t.updateQueue;
  Nn = !1;
  var i = o.firstBaseUpdate, s = o.lastBaseUpdate, l = o.shared.pending;
  if (l !== null) {
    o.shared.pending = null;
    var a = l, u = a.next;
    a.next = null, s === null ? i = u : s.next = u, s = a;
    var c = t.alternate;
    c !== null && (c = c.updateQueue, l = c.lastBaseUpdate, l !== s && (l === null ? c.firstBaseUpdate = u : l.next = u, c.lastBaseUpdate = a));
  }
  if (i !== null) {
    var p = o.baseState;
    s = 0, c = u = a = null, l = i;
    do {
      var f = l.lane, m = l.eventTime;
      if ((r & f) === f) {
        c !== null && (c = c.next = {
          eventTime: m,
          lane: 0,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null
        });
        e: {
          var h = t, y = l;
          switch (f = e, m = n, y.tag) {
            case 1:
              if (h = y.payload, typeof h == "function") {
                p = h.call(m, p, f);
                break e;
              }
              p = h;
              break e;
            case 3:
              h.flags = h.flags & -65537 | 128;
            case 0:
              if (h = y.payload, f = typeof h == "function" ? h.call(m, p, f) : h, f == null) break e;
              p = xe({}, p, f);
              break e;
            case 2:
              Nn = !0;
          }
        }
        l.callback !== null && l.lane !== 0 && (t.flags |= 64, f = o.effects, f === null ? o.effects = [l] : f.push(l));
      } else m = { eventTime: m, lane: f, tag: l.tag, payload: l.payload, callback: l.callback, next: null }, c === null ? (u = c = m, a = p) : c = c.next = m, s |= f;
      if (l = l.next, l === null) {
        if (l = o.shared.pending, l === null) break;
        f = l, l = f.next, f.next = null, o.lastBaseUpdate = f, o.shared.pending = null;
      }
    } while (!0);
    if (c === null && (a = p), o.baseState = a, o.firstBaseUpdate = u, o.lastBaseUpdate = c, e = o.shared.interleaved, e !== null) {
      o = e;
      do
        s |= o.lane, o = o.next;
      while (o !== e);
    } else i === null && (o.shared.lanes = 0);
    vr |= s, t.lanes = s, t.memoizedState = p;
  }
}
function Qf(t, e, n) {
  if (t = e.effects, e.effects = null, t !== null) for (e = 0; e < t.length; e++) {
    var r = t[e], o = r.callback;
    if (o !== null) {
      if (r.callback = null, r = n, typeof o != "function") throw Error(R(191, o));
      o.call(r);
    }
  }
}
var Mi = {}, Yt = Yn(Mi), wi = Yn(Mi), Si = Yn(Mi);
function ur(t) {
  if (t === Mi) throw Error(R(174));
  return t;
}
function rd(t, e) {
  switch (de(Si, e), de(wi, t), de(Yt, Mi), t = e.nodeType, t) {
    case 9:
    case 11:
      e = (e = e.documentElement) ? e.namespaceURI : vu(null, "");
      break;
    default:
      t = t === 8 ? e.parentNode : e, e = t.namespaceURI || null, t = t.tagName, e = vu(e, t);
  }
  pe(Yt), de(Yt, e);
}
function so() {
  pe(Yt), pe(wi), pe(Si);
}
function lm(t) {
  ur(Si.current);
  var e = ur(Yt.current), n = vu(e, t.type);
  e !== n && (de(wi, t), de(Yt, n));
}
function od(t) {
  wi.current === t && (pe(Yt), pe(wi));
}
var ve = Yn(0);
function Js(t) {
  for (var e = t; e !== null; ) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return e;
    } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
      if (e.flags & 128) return e;
    } else if (e.child !== null) {
      e.child.return = e, e = e.child;
      continue;
    }
    if (e === t) break;
    for (; e.sibling === null; ) {
      if (e.return === null || e.return === t) return null;
      e = e.return;
    }
    e.sibling.return = e.return, e = e.sibling;
  }
  return null;
}
var Ra = [];
function id() {
  for (var t = 0; t < Ra.length; t++) Ra[t]._workInProgressVersionPrimary = null;
  Ra.length = 0;
}
var ks = kn.ReactCurrentDispatcher, Da = kn.ReactCurrentBatchConfig, yr = 0, _e = null, Oe = null, Pe = null, Ys = !1, ni = !1, ki = 0, j_ = 0;
function Ke() {
  throw Error(R(321));
}
function sd(t, e) {
  if (e === null) return !1;
  for (var n = 0; n < e.length && n < t.length; n++) if (!jt(t[n], e[n])) return !1;
  return !0;
}
function ld(t, e, n, r, o, i) {
  if (yr = i, _e = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, ks.current = t === null || t.memoizedState === null ? V_ : H_, t = n(r, o), ni) {
    i = 0;
    do {
      if (ni = !1, ki = 0, 25 <= i) throw Error(R(301));
      i += 1, Pe = Oe = null, e.updateQueue = null, ks.current = K_, t = n(r, o);
    } while (ni);
  }
  if (ks.current = Zs, e = Oe !== null && Oe.next !== null, yr = 0, Pe = Oe = _e = null, Ys = !1, e) throw Error(R(300));
  return t;
}
function ad() {
  var t = ki !== 0;
  return ki = 0, t;
}
function Vt() {
  var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return Pe === null ? _e.memoizedState = Pe = t : Pe = Pe.next = t, Pe;
}
function bt() {
  if (Oe === null) {
    var t = _e.alternate;
    t = t !== null ? t.memoizedState : null;
  } else t = Oe.next;
  var e = Pe === null ? _e.memoizedState : Pe.next;
  if (e !== null) Pe = e, Oe = t;
  else {
    if (t === null) throw Error(R(310));
    Oe = t, t = { memoizedState: Oe.memoizedState, baseState: Oe.baseState, baseQueue: Oe.baseQueue, queue: Oe.queue, next: null }, Pe === null ? _e.memoizedState = Pe = t : Pe = Pe.next = t;
  }
  return Pe;
}
function Ci(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function Ma(t) {
  var e = bt(), n = e.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = t;
  var r = Oe, o = r.baseQueue, i = n.pending;
  if (i !== null) {
    if (o !== null) {
      var s = o.next;
      o.next = i.next, i.next = s;
    }
    r.baseQueue = o = i, n.pending = null;
  }
  if (o !== null) {
    i = o.next, r = r.baseState;
    var l = s = null, a = null, u = i;
    do {
      var c = u.lane;
      if ((yr & c) === c) a !== null && (a = a.next = { lane: 0, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }), r = u.hasEagerState ? u.eagerState : t(r, u.action);
      else {
        var p = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null
        };
        a === null ? (l = a = p, s = r) : a = a.next = p, _e.lanes |= c, vr |= c;
      }
      u = u.next;
    } while (u !== null && u !== i);
    a === null ? s = r : a.next = l, jt(r, e.memoizedState) || (lt = !0), e.memoizedState = r, e.baseState = s, e.baseQueue = a, n.lastRenderedState = r;
  }
  if (t = n.interleaved, t !== null) {
    o = t;
    do
      i = o.lane, _e.lanes |= i, vr |= i, o = o.next;
    while (o !== t);
  } else o === null && (n.lanes = 0);
  return [e.memoizedState, n.dispatch];
}
function za(t) {
  var e = bt(), n = e.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = t;
  var r = n.dispatch, o = n.pending, i = e.memoizedState;
  if (o !== null) {
    n.pending = null;
    var s = o = o.next;
    do
      i = t(i, s.action), s = s.next;
    while (s !== o);
    jt(i, e.memoizedState) || (lt = !0), e.memoizedState = i, e.baseQueue === null && (e.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function am() {
}
function um(t, e) {
  var n = _e, r = bt(), o = e(), i = !jt(r.memoizedState, o);
  if (i && (r.memoizedState = o, lt = !0), r = r.queue, ud(fm.bind(null, n, r, t), [t]), r.getSnapshot !== e || i || Pe !== null && Pe.memoizedState.tag & 1) {
    if (n.flags |= 2048, Ei(9, dm.bind(null, n, r, o, e), void 0, null), Re === null) throw Error(R(349));
    yr & 30 || cm(n, e, o);
  }
  return o;
}
function cm(t, e, n) {
  t.flags |= 16384, t = { getSnapshot: e, value: n }, e = _e.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, _e.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
}
function dm(t, e, n, r) {
  e.value = n, e.getSnapshot = r, pm(e) && gm(t);
}
function fm(t, e, n) {
  return n(function() {
    pm(e) && gm(t);
  });
}
function pm(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !jt(t, n);
  } catch {
    return !0;
  }
}
function gm(t) {
  var e = _n(t, 1);
  e !== null && Mt(e, t, 1, -1);
}
function Gf(t) {
  var e = Vt();
  return typeof t == "function" && (t = t()), e.memoizedState = e.baseState = t, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Ci, lastRenderedState: t }, e.queue = t, t = t.dispatch = W_.bind(null, _e, t), [e.memoizedState, t];
}
function Ei(t, e, n, r) {
  return t = { tag: t, create: e, destroy: n, deps: r, next: null }, e = _e.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, _e.updateQueue = e, e.lastEffect = t.next = t) : (n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (r = n.next, n.next = t, t.next = r, e.lastEffect = t)), t;
}
function hm() {
  return bt().memoizedState;
}
function Cs(t, e, n, r) {
  var o = Vt();
  _e.flags |= t, o.memoizedState = Ei(1 | e, n, void 0, r === void 0 ? null : r);
}
function $l(t, e, n, r) {
  var o = bt();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Oe !== null) {
    var s = Oe.memoizedState;
    if (i = s.destroy, r !== null && sd(r, s.deps)) {
      o.memoizedState = Ei(e, n, i, r);
      return;
    }
  }
  _e.flags |= t, o.memoizedState = Ei(1 | e, n, i, r);
}
function Jf(t, e) {
  return Cs(8390656, 8, t, e);
}
function ud(t, e) {
  return $l(2048, 8, t, e);
}
function mm(t, e) {
  return $l(4, 2, t, e);
}
function ym(t, e) {
  return $l(4, 4, t, e);
}
function vm(t, e) {
  if (typeof e == "function") return t = t(), e(t), function() {
    e(null);
  };
  if (e != null) return t = t(), e.current = t, function() {
    e.current = null;
  };
}
function _m(t, e, n) {
  return n = n != null ? n.concat([t]) : null, $l(4, 4, vm.bind(null, e, t), n);
}
function cd() {
}
function xm(t, e) {
  var n = bt();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && sd(e, r[1]) ? r[0] : (n.memoizedState = [t, e], t);
}
function wm(t, e) {
  var n = bt();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && sd(e, r[1]) ? r[0] : (t = t(), n.memoizedState = [t, e], t);
}
function Sm(t, e, n) {
  return yr & 21 ? (jt(n, e) || (n = Nh(), _e.lanes |= n, vr |= n, t.baseState = !0), e) : (t.baseState && (t.baseState = !1, lt = !0), t.memoizedState = n);
}
function B_(t, e) {
  var n = ue;
  ue = n !== 0 && 4 > n ? n : 4, t(!0);
  var r = Da.transition;
  Da.transition = {};
  try {
    t(!1), e();
  } finally {
    ue = n, Da.transition = r;
  }
}
function km() {
  return bt().memoizedState;
}
function U_(t, e, n) {
  var r = Bn(t);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Cm(t)) Em(e, n);
  else if (n = im(t, e, n, r), n !== null) {
    var o = et();
    Mt(n, t, r, o), Tm(n, e, r);
  }
}
function W_(t, e, n) {
  var r = Bn(t), o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Cm(t)) Em(e, o);
  else {
    var i = t.alternate;
    if (t.lanes === 0 && (i === null || i.lanes === 0) && (i = e.lastRenderedReducer, i !== null)) try {
      var s = e.lastRenderedState, l = i(s, n);
      if (o.hasEagerState = !0, o.eagerState = l, jt(l, s)) {
        var a = e.interleaved;
        a === null ? (o.next = o, td(e)) : (o.next = a.next, a.next = o), e.interleaved = o;
        return;
      }
    } catch {
    } finally {
    }
    n = im(t, e, o, r), n !== null && (o = et(), Mt(n, t, r, o), Tm(n, e, r));
  }
}
function Cm(t) {
  var e = t.alternate;
  return t === _e || e !== null && e === _e;
}
function Em(t, e) {
  ni = Ys = !0;
  var n = t.pending;
  n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
}
function Tm(t, e, n) {
  if (n & 4194240) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, Bc(t, n);
  }
}
var Zs = { readContext: Nt, useCallback: Ke, useContext: Ke, useEffect: Ke, useImperativeHandle: Ke, useInsertionEffect: Ke, useLayoutEffect: Ke, useMemo: Ke, useReducer: Ke, useRef: Ke, useState: Ke, useDebugValue: Ke, useDeferredValue: Ke, useTransition: Ke, useMutableSource: Ke, useSyncExternalStore: Ke, useId: Ke, unstable_isNewReconciler: !1 }, V_ = { readContext: Nt, useCallback: function(t, e) {
  return Vt().memoizedState = [t, e === void 0 ? null : e], t;
}, useContext: Nt, useEffect: Jf, useImperativeHandle: function(t, e, n) {
  return n = n != null ? n.concat([t]) : null, Cs(
    4194308,
    4,
    vm.bind(null, e, t),
    n
  );
}, useLayoutEffect: function(t, e) {
  return Cs(4194308, 4, t, e);
}, useInsertionEffect: function(t, e) {
  return Cs(4, 2, t, e);
}, useMemo: function(t, e) {
  var n = Vt();
  return e = e === void 0 ? null : e, t = t(), n.memoizedState = [t, e], t;
}, useReducer: function(t, e, n) {
  var r = Vt();
  return e = n !== void 0 ? n(e) : e, r.memoizedState = r.baseState = e, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: e }, r.queue = t, t = t.dispatch = U_.bind(null, _e, t), [r.memoizedState, t];
}, useRef: function(t) {
  var e = Vt();
  return t = { current: t }, e.memoizedState = t;
}, useState: Gf, useDebugValue: cd, useDeferredValue: function(t) {
  return Vt().memoizedState = t;
}, useTransition: function() {
  var t = Gf(!1), e = t[0];
  return t = B_.bind(null, t[1]), Vt().memoizedState = t, [e, t];
}, useMutableSource: function() {
}, useSyncExternalStore: function(t, e, n) {
  var r = _e, o = Vt();
  if (me) {
    if (n === void 0) throw Error(R(407));
    n = n();
  } else {
    if (n = e(), Re === null) throw Error(R(349));
    yr & 30 || cm(r, e, n);
  }
  o.memoizedState = n;
  var i = { value: n, getSnapshot: e };
  return o.queue = i, Jf(fm.bind(
    null,
    r,
    i,
    t
  ), [t]), r.flags |= 2048, Ei(9, dm.bind(null, r, i, n, e), void 0, null), n;
}, useId: function() {
  var t = Vt(), e = Re.identifierPrefix;
  if (me) {
    var n = fn, r = dn;
    n = (r & ~(1 << 32 - Dt(r) - 1)).toString(32) + n, e = ":" + e + "R" + n, n = ki++, 0 < n && (e += "H" + n.toString(32)), e += ":";
  } else n = j_++, e = ":" + e + "r" + n.toString(32) + ":";
  return t.memoizedState = e;
}, unstable_isNewReconciler: !1 }, H_ = {
  readContext: Nt,
  useCallback: xm,
  useContext: Nt,
  useEffect: ud,
  useImperativeHandle: _m,
  useInsertionEffect: mm,
  useLayoutEffect: ym,
  useMemo: wm,
  useReducer: Ma,
  useRef: hm,
  useState: function() {
    return Ma(Ci);
  },
  useDebugValue: cd,
  useDeferredValue: function(t) {
    var e = bt();
    return Sm(e, Oe.memoizedState, t);
  },
  useTransition: function() {
    var t = Ma(Ci)[0], e = bt().memoizedState;
    return [t, e];
  },
  useMutableSource: am,
  useSyncExternalStore: um,
  useId: km,
  unstable_isNewReconciler: !1
}, K_ = { readContext: Nt, useCallback: xm, useContext: Nt, useEffect: ud, useImperativeHandle: _m, useInsertionEffect: mm, useLayoutEffect: ym, useMemo: wm, useReducer: za, useRef: hm, useState: function() {
  return za(Ci);
}, useDebugValue: cd, useDeferredValue: function(t) {
  var e = bt();
  return Oe === null ? e.memoizedState = t : Sm(e, Oe.memoizedState, t);
}, useTransition: function() {
  var t = za(Ci)[0], e = bt().memoizedState;
  return [t, e];
}, useMutableSource: am, useSyncExternalStore: um, useId: km, unstable_isNewReconciler: !1 };
function $t(t, e) {
  if (t && t.defaultProps) {
    e = xe({}, e), t = t.defaultProps;
    for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    return e;
  }
  return e;
}
function zu(t, e, n, r) {
  e = t.memoizedState, n = n(r, e), n = n == null ? e : xe({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
}
var Ll = { isMounted: function(t) {
  return (t = t._reactInternals) ? Er(t) === t : !1;
}, enqueueSetState: function(t, e, n) {
  t = t._reactInternals;
  var r = et(), o = Bn(t), i = hn(r, o);
  i.payload = e, n != null && (i.callback = n), e = zn(t, i, o), e !== null && (Mt(e, t, o, r), Ss(e, t, o));
}, enqueueReplaceState: function(t, e, n) {
  t = t._reactInternals;
  var r = et(), o = Bn(t), i = hn(r, o);
  i.tag = 1, i.payload = e, n != null && (i.callback = n), e = zn(t, i, o), e !== null && (Mt(e, t, o, r), Ss(e, t, o));
}, enqueueForceUpdate: function(t, e) {
  t = t._reactInternals;
  var n = et(), r = Bn(t), o = hn(n, r);
  o.tag = 2, e != null && (o.callback = e), e = zn(t, o, r), e !== null && (Mt(e, t, r, n), Ss(e, t, r));
} };
function Yf(t, e, n, r, o, i, s) {
  return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(r, i, s) : e.prototype && e.prototype.isPureReactComponent ? !yi(n, r) || !yi(o, i) : !0;
}
function Nm(t, e, n) {
  var r = !1, o = Qn, i = e.contextType;
  return typeof i == "object" && i !== null ? i = Nt(i) : (o = ut(e) ? hr : Ye.current, r = e.contextTypes, i = (r = r != null) ? ro(t, o) : Qn), e = new e(n, i), t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null, e.updater = Ll, t.stateNode = e, e._reactInternals = t, r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = o, t.__reactInternalMemoizedMaskedChildContext = i), e;
}
function Zf(t, e, n, r) {
  t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, r), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, r), e.state !== t && Ll.enqueueReplaceState(e, e.state, null);
}
function ju(t, e, n, r) {
  var o = t.stateNode;
  o.props = n, o.state = t.memoizedState, o.refs = {}, nd(t);
  var i = e.contextType;
  typeof i == "object" && i !== null ? o.context = Nt(i) : (i = ut(e) ? hr : Ye.current, o.context = ro(t, i)), o.state = t.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (zu(t, e, i, n), o.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (e = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), e !== o.state && Ll.enqueueReplaceState(o, o.state, null), Gs(t, n, o, r), o.state = t.memoizedState), typeof o.componentDidMount == "function" && (t.flags |= 4194308);
}
function lo(t, e) {
  try {
    var n = "", r = e;
    do
      n += x0(r), r = r.return;
    while (r);
    var o = n;
  } catch (i) {
    o = `
Error generating stack: ` + i.message + `
` + i.stack;
  }
  return { value: t, source: e, stack: o, digest: null };
}
function ja(t, e, n) {
  return { value: t, source: null, stack: n ?? null, digest: e ?? null };
}
function Bu(t, e) {
  try {
    console.error(e.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var Q_ = typeof WeakMap == "function" ? WeakMap : Map;
function bm(t, e, n) {
  n = hn(-1, n), n.tag = 3, n.payload = { element: null };
  var r = e.value;
  return n.callback = function() {
    qs || (qs = !0, Zu = r), Bu(t, e);
  }, n;
}
function Om(t, e, n) {
  n = hn(-1, n), n.tag = 3;
  var r = t.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = e.value;
    n.payload = function() {
      return r(o);
    }, n.callback = function() {
      Bu(t, e);
    };
  }
  var i = t.stateNode;
  return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
    Bu(t, e), typeof r != "function" && (jn === null ? jn = /* @__PURE__ */ new Set([this]) : jn.add(this));
    var s = e.stack;
    this.componentDidCatch(e.value, { componentStack: s !== null ? s : "" });
  }), n;
}
function Xf(t, e, n) {
  var r = t.pingCache;
  if (r === null) {
    r = t.pingCache = new Q_();
    var o = /* @__PURE__ */ new Set();
    r.set(e, o);
  } else o = r.get(e), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(e, o));
  o.has(n) || (o.add(n), t = l1.bind(null, t, e, n), e.then(t, t));
}
function qf(t) {
  do {
    var e;
    if ((e = t.tag === 13) && (e = t.memoizedState, e = e !== null ? e.dehydrated !== null : !0), e) return t;
    t = t.return;
  } while (t !== null);
  return null;
}
function ep(t, e, n, r, o) {
  return t.mode & 1 ? (t.flags |= 65536, t.lanes = o, t) : (t === e ? t.flags |= 65536 : (t.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (e = hn(-1, 1), e.tag = 2, zn(n, e, 1))), n.lanes |= 1), t);
}
var G_ = kn.ReactCurrentOwner, lt = !1;
function Xe(t, e, n, r) {
  e.child = t === null ? om(e, null, n, r) : io(e, t.child, n, r);
}
function tp(t, e, n, r, o) {
  n = n.render;
  var i = e.ref;
  return qr(e, o), r = ld(t, e, n, r, i, o), n = ad(), t !== null && !lt ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~o, xn(t, e, o)) : (me && n && Jc(e), e.flags |= 1, Xe(t, e, r, o), e.child);
}
function np(t, e, n, r, o) {
  if (t === null) {
    var i = n.type;
    return typeof i == "function" && !vd(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (e.tag = 15, e.type = i, Am(t, e, i, r, o)) : (t = bs(n.type, null, r, e, e.mode, o), t.ref = e.ref, t.return = e, e.child = t);
  }
  if (i = t.child, !(t.lanes & o)) {
    var s = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : yi, n(s, r) && t.ref === e.ref) return xn(t, e, o);
  }
  return e.flags |= 1, t = Un(i, r), t.ref = e.ref, t.return = e, e.child = t;
}
function Am(t, e, n, r, o) {
  if (t !== null) {
    var i = t.memoizedProps;
    if (yi(i, r) && t.ref === e.ref) if (lt = !1, e.pendingProps = r = i, (t.lanes & o) !== 0) t.flags & 131072 && (lt = !0);
    else return e.lanes = t.lanes, xn(t, e, o);
  }
  return Uu(t, e, n, r, o);
}
function Fm(t, e, n) {
  var r = e.pendingProps, o = r.children, i = t !== null ? t.memoizedState : null;
  if (r.mode === "hidden") if (!(e.mode & 1)) e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(Qr, pt), pt |= n;
  else {
    if (!(n & 1073741824)) return t = i !== null ? i.baseLanes | n : n, e.lanes = e.childLanes = 1073741824, e.memoizedState = { baseLanes: t, cachePool: null, transitions: null }, e.updateQueue = null, de(Qr, pt), pt |= t, null;
    e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, de(Qr, pt), pt |= r;
  }
  else i !== null ? (r = i.baseLanes | n, e.memoizedState = null) : r = n, de(Qr, pt), pt |= r;
  return Xe(t, e, o, n), e.child;
}
function Pm(t, e) {
  var n = e.ref;
  (t === null && n !== null || t !== null && t.ref !== n) && (e.flags |= 512, e.flags |= 2097152);
}
function Uu(t, e, n, r, o) {
  var i = ut(n) ? hr : Ye.current;
  return i = ro(e, i), qr(e, o), n = ld(t, e, n, r, i, o), r = ad(), t !== null && !lt ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~o, xn(t, e, o)) : (me && r && Jc(e), e.flags |= 1, Xe(t, e, n, o), e.child);
}
function rp(t, e, n, r, o) {
  if (ut(n)) {
    var i = !0;
    Ws(e);
  } else i = !1;
  if (qr(e, o), e.stateNode === null) Es(t, e), Nm(e, n, r), ju(e, n, r, o), r = !0;
  else if (t === null) {
    var s = e.stateNode, l = e.memoizedProps;
    s.props = l;
    var a = s.context, u = n.contextType;
    typeof u == "object" && u !== null ? u = Nt(u) : (u = ut(n) ? hr : Ye.current, u = ro(e, u));
    var c = n.getDerivedStateFromProps, p = typeof c == "function" || typeof s.getSnapshotBeforeUpdate == "function";
    p || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (l !== r || a !== u) && Zf(e, s, r, u), Nn = !1;
    var f = e.memoizedState;
    s.state = f, Gs(e, r, s, o), a = e.memoizedState, l !== r || f !== a || at.current || Nn ? (typeof c == "function" && (zu(e, n, c, r), a = e.memoizedState), (l = Nn || Yf(e, n, l, r, f, a, u)) ? (p || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = r, e.memoizedState = a), s.props = r, s.state = a, s.context = u, r = l) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), r = !1);
  } else {
    s = e.stateNode, sm(t, e), l = e.memoizedProps, u = e.type === e.elementType ? l : $t(e.type, l), s.props = u, p = e.pendingProps, f = s.context, a = n.contextType, typeof a == "object" && a !== null ? a = Nt(a) : (a = ut(n) ? hr : Ye.current, a = ro(e, a));
    var m = n.getDerivedStateFromProps;
    (c = typeof m == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (l !== p || f !== a) && Zf(e, s, r, a), Nn = !1, f = e.memoizedState, s.state = f, Gs(e, r, s, o);
    var h = e.memoizedState;
    l !== p || f !== h || at.current || Nn ? (typeof m == "function" && (zu(e, n, m, r), h = e.memoizedState), (u = Nn || Yf(e, n, u, r, f, h, a) || !1) ? (c || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(r, h, a), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(r, h, a)), typeof s.componentDidUpdate == "function" && (e.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || l === t.memoizedProps && f === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && f === t.memoizedState || (e.flags |= 1024), e.memoizedProps = r, e.memoizedState = h), s.props = r, s.state = h, s.context = a, r = u) : (typeof s.componentDidUpdate != "function" || l === t.memoizedProps && f === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && f === t.memoizedState || (e.flags |= 1024), r = !1);
  }
  return Wu(t, e, n, r, i, o);
}
function Wu(t, e, n, r, o, i) {
  Pm(t, e);
  var s = (e.flags & 128) !== 0;
  if (!r && !s) return o && Uf(e, n, !1), xn(t, e, i);
  r = e.stateNode, G_.current = e;
  var l = s && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return e.flags |= 1, t !== null && s ? (e.child = io(e, t.child, null, i), e.child = io(e, null, l, i)) : Xe(t, e, l, i), e.memoizedState = r.state, o && Uf(e, n, !0), e.child;
}
function $m(t) {
  var e = t.stateNode;
  e.pendingContext ? Bf(t, e.pendingContext, e.pendingContext !== e.context) : e.context && Bf(t, e.context, !1), rd(t, e.containerInfo);
}
function op(t, e, n, r, o) {
  return oo(), Zc(o), e.flags |= 256, Xe(t, e, n, r), e.child;
}
var Vu = { dehydrated: null, treeContext: null, retryLane: 0 };
function Hu(t) {
  return { baseLanes: t, cachePool: null, transitions: null };
}
function Lm(t, e, n) {
  var r = e.pendingProps, o = ve.current, i = !1, s = (e.flags & 128) !== 0, l;
  if ((l = s) || (l = t !== null && t.memoizedState === null ? !1 : (o & 2) !== 0), l ? (i = !0, e.flags &= -129) : (t === null || t.memoizedState !== null) && (o |= 1), de(ve, o & 1), t === null)
    return Du(e), t = e.memoizedState, t !== null && (t = t.dehydrated, t !== null) ? (e.mode & 1 ? t.data === "$!" ? e.lanes = 8 : e.lanes = 1073741824 : e.lanes = 1, null) : (s = r.children, t = r.fallback, i ? (r = e.mode, i = e.child, s = { mode: "hidden", children: s }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = s) : i = Dl(s, r, 0, null), t = dr(t, r, n, null), i.return = e, t.return = e, i.sibling = t, e.child = i, e.child.memoizedState = Hu(n), e.memoizedState = Vu, t) : dd(e, s));
  if (o = t.memoizedState, o !== null && (l = o.dehydrated, l !== null)) return J_(t, e, s, r, l, o, n);
  if (i) {
    i = r.fallback, s = e.mode, o = t.child, l = o.sibling;
    var a = { mode: "hidden", children: r.children };
    return !(s & 1) && e.child !== o ? (r = e.child, r.childLanes = 0, r.pendingProps = a, e.deletions = null) : (r = Un(o, a), r.subtreeFlags = o.subtreeFlags & 14680064), l !== null ? i = Un(l, i) : (i = dr(i, s, n, null), i.flags |= 2), i.return = e, r.return = e, r.sibling = i, e.child = r, r = i, i = e.child, s = t.child.memoizedState, s = s === null ? Hu(n) : { baseLanes: s.baseLanes | n, cachePool: null, transitions: s.transitions }, i.memoizedState = s, i.childLanes = t.childLanes & ~n, e.memoizedState = Vu, r;
  }
  return i = t.child, t = i.sibling, r = Un(i, { mode: "visible", children: r.children }), !(e.mode & 1) && (r.lanes = n), r.return = e, r.sibling = null, t !== null && (n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t)), e.child = r, e.memoizedState = null, r;
}
function dd(t, e) {
  return e = Dl({ mode: "visible", children: e }, t.mode, 0, null), e.return = t, t.child = e;
}
function ls(t, e, n, r) {
  return r !== null && Zc(r), io(e, t.child, null, n), t = dd(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t;
}
function J_(t, e, n, r, o, i, s) {
  if (n)
    return e.flags & 256 ? (e.flags &= -257, r = ja(Error(R(422))), ls(t, e, s, r)) : e.memoizedState !== null ? (e.child = t.child, e.flags |= 128, null) : (i = r.fallback, o = e.mode, r = Dl({ mode: "visible", children: r.children }, o, 0, null), i = dr(i, o, s, null), i.flags |= 2, r.return = e, i.return = e, r.sibling = i, e.child = r, e.mode & 1 && io(e, t.child, null, s), e.child.memoizedState = Hu(s), e.memoizedState = Vu, i);
  if (!(e.mode & 1)) return ls(t, e, s, null);
  if (o.data === "$!") {
    if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
    return r = l, i = Error(R(419)), r = ja(i, r, void 0), ls(t, e, s, r);
  }
  if (l = (s & t.childLanes) !== 0, lt || l) {
    if (r = Re, r !== null) {
      switch (s & -s) {
        case 4:
          o = 2;
          break;
        case 16:
          o = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          o = 32;
          break;
        case 536870912:
          o = 268435456;
          break;
        default:
          o = 0;
      }
      o = o & (r.suspendedLanes | s) ? 0 : o, o !== 0 && o !== i.retryLane && (i.retryLane = o, _n(t, o), Mt(r, t, o, -1));
    }
    return yd(), r = ja(Error(R(421))), ls(t, e, s, r);
  }
  return o.data === "$?" ? (e.flags |= 128, e.child = t.child, e = a1.bind(null, t), o._reactRetry = e, null) : (t = i.treeContext, mt = Mn(o.nextSibling), yt = e, me = !0, Rt = null, t !== null && (kt[Ct++] = dn, kt[Ct++] = fn, kt[Ct++] = mr, dn = t.id, fn = t.overflow, mr = e), e = dd(e, r.children), e.flags |= 4096, e);
}
function ip(t, e, n) {
  t.lanes |= e;
  var r = t.alternate;
  r !== null && (r.lanes |= e), Mu(t.return, e, n);
}
function Ba(t, e, n, r, o) {
  var i = t.memoizedState;
  i === null ? t.memoizedState = { isBackwards: e, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o } : (i.isBackwards = e, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = o);
}
function Im(t, e, n) {
  var r = e.pendingProps, o = r.revealOrder, i = r.tail;
  if (Xe(t, e, r.children, n), r = ve.current, r & 2) r = r & 1 | 2, e.flags |= 128;
  else {
    if (t !== null && t.flags & 128) e: for (t = e.child; t !== null; ) {
      if (t.tag === 13) t.memoizedState !== null && ip(t, n, e);
      else if (t.tag === 19) ip(t, n, e);
      else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break e;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) break e;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    r &= 1;
  }
  if (de(ve, r), !(e.mode & 1)) e.memoizedState = null;
  else switch (o) {
    case "forwards":
      for (n = e.child, o = null; n !== null; ) t = n.alternate, t !== null && Js(t) === null && (o = n), n = n.sibling;
      n = o, n === null ? (o = e.child, e.child = null) : (o = n.sibling, n.sibling = null), Ba(e, !1, o, n, i);
      break;
    case "backwards":
      for (n = null, o = e.child, e.child = null; o !== null; ) {
        if (t = o.alternate, t !== null && Js(t) === null) {
          e.child = o;
          break;
        }
        t = o.sibling, o.sibling = n, n = o, o = t;
      }
      Ba(e, !0, n, null, i);
      break;
    case "together":
      Ba(e, !1, null, null, void 0);
      break;
    default:
      e.memoizedState = null;
  }
  return e.child;
}
function Es(t, e) {
  !(e.mode & 1) && t !== null && (t.alternate = null, e.alternate = null, e.flags |= 2);
}
function xn(t, e, n) {
  if (t !== null && (e.dependencies = t.dependencies), vr |= e.lanes, !(n & e.childLanes)) return null;
  if (t !== null && e.child !== t.child) throw Error(R(153));
  if (e.child !== null) {
    for (t = e.child, n = Un(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; ) t = t.sibling, n = n.sibling = Un(t, t.pendingProps), n.return = e;
    n.sibling = null;
  }
  return e.child;
}
function Y_(t, e, n) {
  switch (e.tag) {
    case 3:
      $m(e), oo();
      break;
    case 5:
      lm(e);
      break;
    case 1:
      ut(e.type) && Ws(e);
      break;
    case 4:
      rd(e, e.stateNode.containerInfo);
      break;
    case 10:
      var r = e.type._context, o = e.memoizedProps.value;
      de(Ks, r._currentValue), r._currentValue = o;
      break;
    case 13:
      if (r = e.memoizedState, r !== null)
        return r.dehydrated !== null ? (de(ve, ve.current & 1), e.flags |= 128, null) : n & e.child.childLanes ? Lm(t, e, n) : (de(ve, ve.current & 1), t = xn(t, e, n), t !== null ? t.sibling : null);
      de(ve, ve.current & 1);
      break;
    case 19:
      if (r = (n & e.childLanes) !== 0, t.flags & 128) {
        if (r) return Im(t, e, n);
        e.flags |= 128;
      }
      if (o = e.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), de(ve, ve.current), r) break;
      return null;
    case 22:
    case 23:
      return e.lanes = 0, Fm(t, e, n);
  }
  return xn(t, e, n);
}
var Rm, Ku, Dm, Mm;
Rm = function(t, e) {
  for (var n = e.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) t.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === e) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
Ku = function() {
};
Dm = function(t, e, n, r) {
  var o = t.memoizedProps;
  if (o !== r) {
    t = e.stateNode, ur(Yt.current);
    var i = null;
    switch (n) {
      case "input":
        o = gu(t, o), r = gu(t, r), i = [];
        break;
      case "select":
        o = xe({}, o, { value: void 0 }), r = xe({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        o = yu(t, o), r = yu(t, r), i = [];
        break;
      default:
        typeof o.onClick != "function" && typeof r.onClick == "function" && (t.onclick = Bs);
    }
    _u(n, r);
    var s;
    n = null;
    for (u in o) if (!r.hasOwnProperty(u) && o.hasOwnProperty(u) && o[u] != null) if (u === "style") {
      var l = o[u];
      for (s in l) l.hasOwnProperty(s) && (n || (n = {}), n[s] = "");
    } else u !== "dangerouslySetInnerHTML" && u !== "children" && u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (ci.hasOwnProperty(u) ? i || (i = []) : (i = i || []).push(u, null));
    for (u in r) {
      var a = r[u];
      if (l = o != null ? o[u] : void 0, r.hasOwnProperty(u) && a !== l && (a != null || l != null)) if (u === "style") if (l) {
        for (s in l) !l.hasOwnProperty(s) || a && a.hasOwnProperty(s) || (n || (n = {}), n[s] = "");
        for (s in a) a.hasOwnProperty(s) && l[s] !== a[s] && (n || (n = {}), n[s] = a[s]);
      } else n || (i || (i = []), i.push(
        u,
        n
      )), n = a;
      else u === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, l = l ? l.__html : void 0, a != null && l !== a && (i = i || []).push(u, a)) : u === "children" ? typeof a != "string" && typeof a != "number" || (i = i || []).push(u, "" + a) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && (ci.hasOwnProperty(u) ? (a != null && u === "onScroll" && fe("scroll", t), i || l === a || (i = [])) : (i = i || []).push(u, a));
    }
    n && (i = i || []).push("style", n);
    var u = i;
    (e.updateQueue = u) && (e.flags |= 4);
  }
};
Mm = function(t, e, n, r) {
  n !== r && (e.flags |= 4);
};
function Lo(t, e) {
  if (!me) switch (t.tailMode) {
    case "hidden":
      e = t.tail;
      for (var n = null; e !== null; ) e.alternate !== null && (n = e), e = e.sibling;
      n === null ? t.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = t.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : r.sibling = null;
  }
}
function Qe(t) {
  var e = t.alternate !== null && t.alternate.child === t.child, n = 0, r = 0;
  if (e) for (var o = t.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags & 14680064, r |= o.flags & 14680064, o.return = t, o = o.sibling;
  else for (o = t.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = t, o = o.sibling;
  return t.subtreeFlags |= r, t.childLanes = n, e;
}
function Z_(t, e, n) {
  var r = e.pendingProps;
  switch (Yc(e), e.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Qe(e), null;
    case 1:
      return ut(e.type) && Us(), Qe(e), null;
    case 3:
      return r = e.stateNode, so(), pe(at), pe(Ye), id(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (t === null || t.child === null) && (is(e) ? e.flags |= 4 : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, Rt !== null && (ec(Rt), Rt = null))), Ku(t, e), Qe(e), null;
    case 5:
      od(e);
      var o = ur(Si.current);
      if (n = e.type, t !== null && e.stateNode != null) Dm(t, e, n, r, o), t.ref !== e.ref && (e.flags |= 512, e.flags |= 2097152);
      else {
        if (!r) {
          if (e.stateNode === null) throw Error(R(166));
          return Qe(e), null;
        }
        if (t = ur(Yt.current), is(e)) {
          r = e.stateNode, n = e.type;
          var i = e.memoizedProps;
          switch (r[Ht] = e, r[xi] = i, t = (e.mode & 1) !== 0, n) {
            case "dialog":
              fe("cancel", r), fe("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              fe("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < Wo.length; o++) fe(Wo[o], r);
              break;
            case "source":
              fe("error", r);
              break;
            case "img":
            case "image":
            case "link":
              fe(
                "error",
                r
              ), fe("load", r);
              break;
            case "details":
              fe("toggle", r);
              break;
            case "input":
              gf(r, i), fe("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, fe("invalid", r);
              break;
            case "textarea":
              mf(r, i), fe("invalid", r);
          }
          _u(n, i), o = null;
          for (var s in i) if (i.hasOwnProperty(s)) {
            var l = i[s];
            s === "children" ? typeof l == "string" ? r.textContent !== l && (i.suppressHydrationWarning !== !0 && os(r.textContent, l, t), o = ["children", l]) : typeof l == "number" && r.textContent !== "" + l && (i.suppressHydrationWarning !== !0 && os(
              r.textContent,
              l,
              t
            ), o = ["children", "" + l]) : ci.hasOwnProperty(s) && l != null && s === "onScroll" && fe("scroll", r);
          }
          switch (n) {
            case "input":
              Yi(r), hf(r, i, !0);
              break;
            case "textarea":
              Yi(r), yf(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Bs);
          }
          r = o, e.updateQueue = r, r !== null && (e.flags |= 4);
        } else {
          s = o.nodeType === 9 ? o : o.ownerDocument, t === "http://www.w3.org/1999/xhtml" && (t = fh(n)), t === "http://www.w3.org/1999/xhtml" ? n === "script" ? (t = s.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild)) : typeof r.is == "string" ? t = s.createElement(n, { is: r.is }) : (t = s.createElement(n), n === "select" && (s = t, r.multiple ? s.multiple = !0 : r.size && (s.size = r.size))) : t = s.createElementNS(t, n), t[Ht] = e, t[xi] = r, Rm(t, e, !1, !1), e.stateNode = t;
          e: {
            switch (s = xu(n, r), n) {
              case "dialog":
                fe("cancel", t), fe("close", t), o = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                fe("load", t), o = r;
                break;
              case "video":
              case "audio":
                for (o = 0; o < Wo.length; o++) fe(Wo[o], t);
                o = r;
                break;
              case "source":
                fe("error", t), o = r;
                break;
              case "img":
              case "image":
              case "link":
                fe(
                  "error",
                  t
                ), fe("load", t), o = r;
                break;
              case "details":
                fe("toggle", t), o = r;
                break;
              case "input":
                gf(t, r), o = gu(t, r), fe("invalid", t);
                break;
              case "option":
                o = r;
                break;
              case "select":
                t._wrapperState = { wasMultiple: !!r.multiple }, o = xe({}, r, { value: void 0 }), fe("invalid", t);
                break;
              case "textarea":
                mf(t, r), o = yu(t, r), fe("invalid", t);
                break;
              default:
                o = r;
            }
            _u(n, o), l = o;
            for (i in l) if (l.hasOwnProperty(i)) {
              var a = l[i];
              i === "style" ? hh(t, a) : i === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && ph(t, a)) : i === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && di(t, a) : typeof a == "number" && di(t, "" + a) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (ci.hasOwnProperty(i) ? a != null && i === "onScroll" && fe("scroll", t) : a != null && Ic(t, i, a, s));
            }
            switch (n) {
              case "input":
                Yi(t), hf(t, r, !1);
                break;
              case "textarea":
                Yi(t), yf(t);
                break;
              case "option":
                r.value != null && t.setAttribute("value", "" + Kn(r.value));
                break;
              case "select":
                t.multiple = !!r.multiple, i = r.value, i != null ? Jr(t, !!r.multiple, i, !1) : r.defaultValue != null && Jr(
                  t,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof o.onClick == "function" && (t.onclick = Bs);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (e.flags |= 4);
        }
        e.ref !== null && (e.flags |= 512, e.flags |= 2097152);
      }
      return Qe(e), null;
    case 6:
      if (t && e.stateNode != null) Mm(t, e, t.memoizedProps, r);
      else {
        if (typeof r != "string" && e.stateNode === null) throw Error(R(166));
        if (n = ur(Si.current), ur(Yt.current), is(e)) {
          if (r = e.stateNode, n = e.memoizedProps, r[Ht] = e, (i = r.nodeValue !== n) && (t = yt, t !== null)) switch (t.tag) {
            case 3:
              os(r.nodeValue, n, (t.mode & 1) !== 0);
              break;
            case 5:
              t.memoizedProps.suppressHydrationWarning !== !0 && os(r.nodeValue, n, (t.mode & 1) !== 0);
          }
          i && (e.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Ht] = e, e.stateNode = r;
      }
      return Qe(e), null;
    case 13:
      if (pe(ve), r = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
        if (me && mt !== null && e.mode & 1 && !(e.flags & 128)) nm(), oo(), e.flags |= 98560, i = !1;
        else if (i = is(e), r !== null && r.dehydrated !== null) {
          if (t === null) {
            if (!i) throw Error(R(318));
            if (i = e.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(R(317));
            i[Ht] = e;
          } else oo(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
          Qe(e), i = !1;
        } else Rt !== null && (ec(Rt), Rt = null), i = !0;
        if (!i) return e.flags & 65536 ? e : null;
      }
      return e.flags & 128 ? (e.lanes = n, e) : (r = r !== null, r !== (t !== null && t.memoizedState !== null) && r && (e.child.flags |= 8192, e.mode & 1 && (t === null || ve.current & 1 ? Fe === 0 && (Fe = 3) : yd())), e.updateQueue !== null && (e.flags |= 4), Qe(e), null);
    case 4:
      return so(), Ku(t, e), t === null && vi(e.stateNode.containerInfo), Qe(e), null;
    case 10:
      return ed(e.type._context), Qe(e), null;
    case 17:
      return ut(e.type) && Us(), Qe(e), null;
    case 19:
      if (pe(ve), i = e.memoizedState, i === null) return Qe(e), null;
      if (r = (e.flags & 128) !== 0, s = i.rendering, s === null) if (r) Lo(i, !1);
      else {
        if (Fe !== 0 || t !== null && t.flags & 128) for (t = e.child; t !== null; ) {
          if (s = Js(t), s !== null) {
            for (e.flags |= 128, Lo(i, !1), r = s.updateQueue, r !== null && (e.updateQueue = r, e.flags |= 4), e.subtreeFlags = 0, r = n, n = e.child; n !== null; ) i = n, t = r, i.flags &= 14680066, s = i.alternate, s === null ? (i.childLanes = 0, i.lanes = t, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = s.childLanes, i.lanes = s.lanes, i.child = s.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = s.memoizedProps, i.memoizedState = s.memoizedState, i.updateQueue = s.updateQueue, i.type = s.type, t = s.dependencies, i.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), n = n.sibling;
            return de(ve, ve.current & 1 | 2), e.child;
          }
          t = t.sibling;
        }
        i.tail !== null && ke() > ao && (e.flags |= 128, r = !0, Lo(i, !1), e.lanes = 4194304);
      }
      else {
        if (!r) if (t = Js(s), t !== null) {
          if (e.flags |= 128, r = !0, n = t.updateQueue, n !== null && (e.updateQueue = n, e.flags |= 4), Lo(i, !0), i.tail === null && i.tailMode === "hidden" && !s.alternate && !me) return Qe(e), null;
        } else 2 * ke() - i.renderingStartTime > ao && n !== 1073741824 && (e.flags |= 128, r = !0, Lo(i, !1), e.lanes = 4194304);
        i.isBackwards ? (s.sibling = e.child, e.child = s) : (n = i.last, n !== null ? n.sibling = s : e.child = s, i.last = s);
      }
      return i.tail !== null ? (e = i.tail, i.rendering = e, i.tail = e.sibling, i.renderingStartTime = ke(), e.sibling = null, n = ve.current, de(ve, r ? n & 1 | 2 : n & 1), e) : (Qe(e), null);
    case 22:
    case 23:
      return md(), r = e.memoizedState !== null, t !== null && t.memoizedState !== null !== r && (e.flags |= 8192), r && e.mode & 1 ? pt & 1073741824 && (Qe(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Qe(e), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(R(156, e.tag));
}
function X_(t, e) {
  switch (Yc(e), e.tag) {
    case 1:
      return ut(e.type) && Us(), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 3:
      return so(), pe(at), pe(Ye), id(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
    case 5:
      return od(e), null;
    case 13:
      if (pe(ve), t = e.memoizedState, t !== null && t.dehydrated !== null) {
        if (e.alternate === null) throw Error(R(340));
        oo();
      }
      return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 19:
      return pe(ve), null;
    case 4:
      return so(), null;
    case 10:
      return ed(e.type._context), null;
    case 22:
    case 23:
      return md(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var as = !1, Ge = !1, q_ = typeof WeakSet == "function" ? WeakSet : Set, V = null;
function Kr(t, e) {
  var n = t.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    we(t, e, r);
  }
  else n.current = null;
}
function Qu(t, e, n) {
  try {
    n();
  } catch (r) {
    we(t, e, r);
  }
}
var sp = !1;
function e1(t, e) {
  if (Au = Ms, t = Wh(), Gc(t)) {
    if ("selectionStart" in t) var n = { start: t.selectionStart, end: t.selectionEnd };
    else e: {
      n = (n = t.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var o = r.anchorOffset, i = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, i.nodeType;
        } catch {
          n = null;
          break e;
        }
        var s = 0, l = -1, a = -1, u = 0, c = 0, p = t, f = null;
        t: for (; ; ) {
          for (var m; p !== n || o !== 0 && p.nodeType !== 3 || (l = s + o), p !== i || r !== 0 && p.nodeType !== 3 || (a = s + r), p.nodeType === 3 && (s += p.nodeValue.length), (m = p.firstChild) !== null; )
            f = p, p = m;
          for (; ; ) {
            if (p === t) break t;
            if (f === n && ++u === o && (l = s), f === i && ++c === r && (a = s), (m = p.nextSibling) !== null) break;
            p = f, f = p.parentNode;
          }
          p = m;
        }
        n = l === -1 || a === -1 ? null : { start: l, end: a };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Fu = { focusedElem: t, selectionRange: n }, Ms = !1, V = e; V !== null; ) if (e = V, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, V = t;
  else for (; V !== null; ) {
    e = V;
    try {
      var h = e.alternate;
      if (e.flags & 1024) switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (h !== null) {
            var y = h.memoizedProps, _ = h.memoizedState, v = e.stateNode, d = v.getSnapshotBeforeUpdate(e.elementType === e.type ? y : $t(e.type, y), _);
            v.__reactInternalSnapshotBeforeUpdate = d;
          }
          break;
        case 3:
          var g = e.stateNode.containerInfo;
          g.nodeType === 1 ? g.textContent = "" : g.nodeType === 9 && g.documentElement && g.removeChild(g.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(R(163));
      }
    } catch (x) {
      we(e, e.return, x);
    }
    if (t = e.sibling, t !== null) {
      t.return = e.return, V = t;
      break;
    }
    V = e.return;
  }
  return h = sp, sp = !1, h;
}
function ri(t, e, n) {
  var r = e.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var o = r = r.next;
    do {
      if ((o.tag & t) === t) {
        var i = o.destroy;
        o.destroy = void 0, i !== void 0 && Qu(e, n, i);
      }
      o = o.next;
    } while (o !== r);
  }
}
function Il(t, e) {
  if (e = e.updateQueue, e = e !== null ? e.lastEffect : null, e !== null) {
    var n = e = e.next;
    do {
      if ((n.tag & t) === t) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== e);
  }
}
function Gu(t) {
  var e = t.ref;
  if (e !== null) {
    var n = t.stateNode;
    switch (t.tag) {
      case 5:
        t = n;
        break;
      default:
        t = n;
    }
    typeof e == "function" ? e(t) : e.current = t;
  }
}
function zm(t) {
  var e = t.alternate;
  e !== null && (t.alternate = null, zm(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && (delete e[Ht], delete e[xi], delete e[Lu], delete e[R_], delete e[D_])), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
}
function jm(t) {
  return t.tag === 5 || t.tag === 3 || t.tag === 4;
}
function lp(t) {
  e: for (; ; ) {
    for (; t.sibling === null; ) {
      if (t.return === null || jm(t.return)) return null;
      t = t.return;
    }
    for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
      if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
      t.child.return = t, t = t.child;
    }
    if (!(t.flags & 2)) return t.stateNode;
  }
}
function Ju(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.nodeType === 8 ? n.parentNode.insertBefore(t, e) : n.insertBefore(t, e) : (n.nodeType === 8 ? (e = n.parentNode, e.insertBefore(t, n)) : (e = n, e.appendChild(t)), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = Bs));
  else if (r !== 4 && (t = t.child, t !== null)) for (Ju(t, e, n), t = t.sibling; t !== null; ) Ju(t, e, n), t = t.sibling;
}
function Yu(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
  else if (r !== 4 && (t = t.child, t !== null)) for (Yu(t, e, n), t = t.sibling; t !== null; ) Yu(t, e, n), t = t.sibling;
}
var Me = null, It = !1;
function Cn(t, e, n) {
  for (n = n.child; n !== null; ) Bm(t, e, n), n = n.sibling;
}
function Bm(t, e, n) {
  if (Jt && typeof Jt.onCommitFiberUnmount == "function") try {
    Jt.onCommitFiberUnmount(Nl, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      Ge || Kr(n, e);
    case 6:
      var r = Me, o = It;
      Me = null, Cn(t, e, n), Me = r, It = o, Me !== null && (It ? (t = Me, n = n.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(n) : t.removeChild(n)) : Me.removeChild(n.stateNode));
      break;
    case 18:
      Me !== null && (It ? (t = Me, n = n.stateNode, t.nodeType === 8 ? La(t.parentNode, n) : t.nodeType === 1 && La(t, n), hi(t)) : La(Me, n.stateNode));
      break;
    case 4:
      r = Me, o = It, Me = n.stateNode.containerInfo, It = !0, Cn(t, e, n), Me = r, It = o;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Ge && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        o = r = r.next;
        do {
          var i = o, s = i.destroy;
          i = i.tag, s !== void 0 && (i & 2 || i & 4) && Qu(n, e, s), o = o.next;
        } while (o !== r);
      }
      Cn(t, e, n);
      break;
    case 1:
      if (!Ge && (Kr(n, e), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (l) {
        we(n, e, l);
      }
      Cn(t, e, n);
      break;
    case 21:
      Cn(t, e, n);
      break;
    case 22:
      n.mode & 1 ? (Ge = (r = Ge) || n.memoizedState !== null, Cn(t, e, n), Ge = r) : Cn(t, e, n);
      break;
    default:
      Cn(t, e, n);
  }
}
function ap(t) {
  var e = t.updateQueue;
  if (e !== null) {
    t.updateQueue = null;
    var n = t.stateNode;
    n === null && (n = t.stateNode = new q_()), e.forEach(function(r) {
      var o = u1.bind(null, t, r);
      n.has(r) || (n.add(r), r.then(o, o));
    });
  }
}
function At(t, e) {
  var n = e.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var o = n[r];
    try {
      var i = t, s = e, l = s;
      e: for (; l !== null; ) {
        switch (l.tag) {
          case 5:
            Me = l.stateNode, It = !1;
            break e;
          case 3:
            Me = l.stateNode.containerInfo, It = !0;
            break e;
          case 4:
            Me = l.stateNode.containerInfo, It = !0;
            break e;
        }
        l = l.return;
      }
      if (Me === null) throw Error(R(160));
      Bm(i, s, o), Me = null, It = !1;
      var a = o.alternate;
      a !== null && (a.return = null), o.return = null;
    } catch (u) {
      we(o, e, u);
    }
  }
  if (e.subtreeFlags & 12854) for (e = e.child; e !== null; ) Um(e, t), e = e.sibling;
}
function Um(t, e) {
  var n = t.alternate, r = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (At(e, t), Wt(t), r & 4) {
        try {
          ri(3, t, t.return), Il(3, t);
        } catch (y) {
          we(t, t.return, y);
        }
        try {
          ri(5, t, t.return);
        } catch (y) {
          we(t, t.return, y);
        }
      }
      break;
    case 1:
      At(e, t), Wt(t), r & 512 && n !== null && Kr(n, n.return);
      break;
    case 5:
      if (At(e, t), Wt(t), r & 512 && n !== null && Kr(n, n.return), t.flags & 32) {
        var o = t.stateNode;
        try {
          di(o, "");
        } catch (y) {
          we(t, t.return, y);
        }
      }
      if (r & 4 && (o = t.stateNode, o != null)) {
        var i = t.memoizedProps, s = n !== null ? n.memoizedProps : i, l = t.type, a = t.updateQueue;
        if (t.updateQueue = null, a !== null) try {
          l === "input" && i.type === "radio" && i.name != null && ch(o, i), xu(l, s);
          var u = xu(l, i);
          for (s = 0; s < a.length; s += 2) {
            var c = a[s], p = a[s + 1];
            c === "style" ? hh(o, p) : c === "dangerouslySetInnerHTML" ? ph(o, p) : c === "children" ? di(o, p) : Ic(o, c, p, u);
          }
          switch (l) {
            case "input":
              hu(o, i);
              break;
            case "textarea":
              dh(o, i);
              break;
            case "select":
              var f = o._wrapperState.wasMultiple;
              o._wrapperState.wasMultiple = !!i.multiple;
              var m = i.value;
              m != null ? Jr(o, !!i.multiple, m, !1) : f !== !!i.multiple && (i.defaultValue != null ? Jr(
                o,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : Jr(o, !!i.multiple, i.multiple ? [] : "", !1));
          }
          o[xi] = i;
        } catch (y) {
          we(t, t.return, y);
        }
      }
      break;
    case 6:
      if (At(e, t), Wt(t), r & 4) {
        if (t.stateNode === null) throw Error(R(162));
        o = t.stateNode, i = t.memoizedProps;
        try {
          o.nodeValue = i;
        } catch (y) {
          we(t, t.return, y);
        }
      }
      break;
    case 3:
      if (At(e, t), Wt(t), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        hi(e.containerInfo);
      } catch (y) {
        we(t, t.return, y);
      }
      break;
    case 4:
      At(e, t), Wt(t);
      break;
    case 13:
      At(e, t), Wt(t), o = t.child, o.flags & 8192 && (i = o.memoizedState !== null, o.stateNode.isHidden = i, !i || o.alternate !== null && o.alternate.memoizedState !== null || (gd = ke())), r & 4 && ap(t);
      break;
    case 22:
      if (c = n !== null && n.memoizedState !== null, t.mode & 1 ? (Ge = (u = Ge) || c, At(e, t), Ge = u) : At(e, t), Wt(t), r & 8192) {
        if (u = t.memoizedState !== null, (t.stateNode.isHidden = u) && !c && t.mode & 1) for (V = t, c = t.child; c !== null; ) {
          for (p = V = c; V !== null; ) {
            switch (f = V, m = f.child, f.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                ri(4, f, f.return);
                break;
              case 1:
                Kr(f, f.return);
                var h = f.stateNode;
                if (typeof h.componentWillUnmount == "function") {
                  r = f, n = f.return;
                  try {
                    e = r, h.props = e.memoizedProps, h.state = e.memoizedState, h.componentWillUnmount();
                  } catch (y) {
                    we(r, n, y);
                  }
                }
                break;
              case 5:
                Kr(f, f.return);
                break;
              case 22:
                if (f.memoizedState !== null) {
                  cp(p);
                  continue;
                }
            }
            m !== null ? (m.return = f, V = m) : cp(p);
          }
          c = c.sibling;
        }
        e: for (c = null, p = t; ; ) {
          if (p.tag === 5) {
            if (c === null) {
              c = p;
              try {
                o = p.stateNode, u ? (i = o.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (l = p.stateNode, a = p.memoizedProps.style, s = a != null && a.hasOwnProperty("display") ? a.display : null, l.style.display = gh("display", s));
              } catch (y) {
                we(t, t.return, y);
              }
            }
          } else if (p.tag === 6) {
            if (c === null) try {
              p.stateNode.nodeValue = u ? "" : p.memoizedProps;
            } catch (y) {
              we(t, t.return, y);
            }
          } else if ((p.tag !== 22 && p.tag !== 23 || p.memoizedState === null || p === t) && p.child !== null) {
            p.child.return = p, p = p.child;
            continue;
          }
          if (p === t) break e;
          for (; p.sibling === null; ) {
            if (p.return === null || p.return === t) break e;
            c === p && (c = null), p = p.return;
          }
          c === p && (c = null), p.sibling.return = p.return, p = p.sibling;
        }
      }
      break;
    case 19:
      At(e, t), Wt(t), r & 4 && ap(t);
      break;
    case 21:
      break;
    default:
      At(
        e,
        t
      ), Wt(t);
  }
}
function Wt(t) {
  var e = t.flags;
  if (e & 2) {
    try {
      e: {
        for (var n = t.return; n !== null; ) {
          if (jm(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(R(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (di(o, ""), r.flags &= -33);
          var i = lp(t);
          Yu(t, i, o);
          break;
        case 3:
        case 4:
          var s = r.stateNode.containerInfo, l = lp(t);
          Ju(t, l, s);
          break;
        default:
          throw Error(R(161));
      }
    } catch (a) {
      we(t, t.return, a);
    }
    t.flags &= -3;
  }
  e & 4096 && (t.flags &= -4097);
}
function t1(t, e, n) {
  V = t, Wm(t);
}
function Wm(t, e, n) {
  for (var r = (t.mode & 1) !== 0; V !== null; ) {
    var o = V, i = o.child;
    if (o.tag === 22 && r) {
      var s = o.memoizedState !== null || as;
      if (!s) {
        var l = o.alternate, a = l !== null && l.memoizedState !== null || Ge;
        l = as;
        var u = Ge;
        if (as = s, (Ge = a) && !u) for (V = o; V !== null; ) s = V, a = s.child, s.tag === 22 && s.memoizedState !== null ? dp(o) : a !== null ? (a.return = s, V = a) : dp(o);
        for (; i !== null; ) V = i, Wm(i), i = i.sibling;
        V = o, as = l, Ge = u;
      }
      up(t);
    } else o.subtreeFlags & 8772 && i !== null ? (i.return = o, V = i) : up(t);
  }
}
function up(t) {
  for (; V !== null; ) {
    var e = V;
    if (e.flags & 8772) {
      var n = e.alternate;
      try {
        if (e.flags & 8772) switch (e.tag) {
          case 0:
          case 11:
          case 15:
            Ge || Il(5, e);
            break;
          case 1:
            var r = e.stateNode;
            if (e.flags & 4 && !Ge) if (n === null) r.componentDidMount();
            else {
              var o = e.elementType === e.type ? n.memoizedProps : $t(e.type, n.memoizedProps);
              r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var i = e.updateQueue;
            i !== null && Qf(e, i, r);
            break;
          case 3:
            var s = e.updateQueue;
            if (s !== null) {
              if (n = null, e.child !== null) switch (e.child.tag) {
                case 5:
                  n = e.child.stateNode;
                  break;
                case 1:
                  n = e.child.stateNode;
              }
              Qf(e, s, n);
            }
            break;
          case 5:
            var l = e.stateNode;
            if (n === null && e.flags & 4) {
              n = l;
              var a = e.memoizedProps;
              switch (e.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a.autoFocus && n.focus();
                  break;
                case "img":
                  a.src && (n.src = a.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (e.memoizedState === null) {
              var u = e.alternate;
              if (u !== null) {
                var c = u.memoizedState;
                if (c !== null) {
                  var p = c.dehydrated;
                  p !== null && hi(p);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(R(163));
        }
        Ge || e.flags & 512 && Gu(e);
      } catch (f) {
        we(e, e.return, f);
      }
    }
    if (e === t) {
      V = null;
      break;
    }
    if (n = e.sibling, n !== null) {
      n.return = e.return, V = n;
      break;
    }
    V = e.return;
  }
}
function cp(t) {
  for (; V !== null; ) {
    var e = V;
    if (e === t) {
      V = null;
      break;
    }
    var n = e.sibling;
    if (n !== null) {
      n.return = e.return, V = n;
      break;
    }
    V = e.return;
  }
}
function dp(t) {
  for (; V !== null; ) {
    var e = V;
    try {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          var n = e.return;
          try {
            Il(4, e);
          } catch (a) {
            we(e, n, a);
          }
          break;
        case 1:
          var r = e.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = e.return;
            try {
              r.componentDidMount();
            } catch (a) {
              we(e, o, a);
            }
          }
          var i = e.return;
          try {
            Gu(e);
          } catch (a) {
            we(e, i, a);
          }
          break;
        case 5:
          var s = e.return;
          try {
            Gu(e);
          } catch (a) {
            we(e, s, a);
          }
      }
    } catch (a) {
      we(e, e.return, a);
    }
    if (e === t) {
      V = null;
      break;
    }
    var l = e.sibling;
    if (l !== null) {
      l.return = e.return, V = l;
      break;
    }
    V = e.return;
  }
}
var n1 = Math.ceil, Xs = kn.ReactCurrentDispatcher, fd = kn.ReactCurrentOwner, Tt = kn.ReactCurrentBatchConfig, re = 0, Re = null, Ne = null, je = 0, pt = 0, Qr = Yn(0), Fe = 0, Ti = null, vr = 0, Rl = 0, pd = 0, oi = null, it = null, gd = 0, ao = 1 / 0, an = null, qs = !1, Zu = null, jn = null, us = !1, Pn = null, el = 0, ii = 0, Xu = null, Ts = -1, Ns = 0;
function et() {
  return re & 6 ? ke() : Ts !== -1 ? Ts : Ts = ke();
}
function Bn(t) {
  return t.mode & 1 ? re & 2 && je !== 0 ? je & -je : z_.transition !== null ? (Ns === 0 && (Ns = Nh()), Ns) : (t = ue, t !== 0 || (t = window.event, t = t === void 0 ? 16 : Lh(t.type)), t) : 1;
}
function Mt(t, e, n, r) {
  if (50 < ii) throw ii = 0, Xu = null, Error(R(185));
  Ii(t, n, r), (!(re & 2) || t !== Re) && (t === Re && (!(re & 2) && (Rl |= n), Fe === 4 && An(t, je)), ct(t, r), n === 1 && re === 0 && !(e.mode & 1) && (ao = ke() + 500, Pl && Zn()));
}
function ct(t, e) {
  var n = t.callbackNode;
  z0(t, e);
  var r = Ds(t, t === Re ? je : 0);
  if (r === 0) n !== null && xf(n), t.callbackNode = null, t.callbackPriority = 0;
  else if (e = r & -r, t.callbackPriority !== e) {
    if (n != null && xf(n), e === 1) t.tag === 0 ? M_(fp.bind(null, t)) : qh(fp.bind(null, t)), L_(function() {
      !(re & 6) && Zn();
    }), n = null;
    else {
      switch (bh(r)) {
        case 1:
          n = jc;
          break;
        case 4:
          n = Eh;
          break;
        case 16:
          n = Rs;
          break;
        case 536870912:
          n = Th;
          break;
        default:
          n = Rs;
      }
      n = Zm(n, Vm.bind(null, t));
    }
    t.callbackPriority = e, t.callbackNode = n;
  }
}
function Vm(t, e) {
  if (Ts = -1, Ns = 0, re & 6) throw Error(R(327));
  var n = t.callbackNode;
  if (eo() && t.callbackNode !== n) return null;
  var r = Ds(t, t === Re ? je : 0);
  if (r === 0) return null;
  if (r & 30 || r & t.expiredLanes || e) e = tl(t, r);
  else {
    e = r;
    var o = re;
    re |= 2;
    var i = Km();
    (Re !== t || je !== e) && (an = null, ao = ke() + 500, cr(t, e));
    do
      try {
        i1();
        break;
      } catch (l) {
        Hm(t, l);
      }
    while (!0);
    qc(), Xs.current = i, re = o, Ne !== null ? e = 0 : (Re = null, je = 0, e = Fe);
  }
  if (e !== 0) {
    if (e === 2 && (o = Eu(t), o !== 0 && (r = o, e = qu(t, o))), e === 1) throw n = Ti, cr(t, 0), An(t, r), ct(t, ke()), n;
    if (e === 6) An(t, r);
    else {
      if (o = t.current.alternate, !(r & 30) && !r1(o) && (e = tl(t, r), e === 2 && (i = Eu(t), i !== 0 && (r = i, e = qu(t, i))), e === 1)) throw n = Ti, cr(t, 0), An(t, r), ct(t, ke()), n;
      switch (t.finishedWork = o, t.finishedLanes = r, e) {
        case 0:
        case 1:
          throw Error(R(345));
        case 2:
          sr(t, it, an);
          break;
        case 3:
          if (An(t, r), (r & 130023424) === r && (e = gd + 500 - ke(), 10 < e)) {
            if (Ds(t, 0) !== 0) break;
            if (o = t.suspendedLanes, (o & r) !== r) {
              et(), t.pingedLanes |= t.suspendedLanes & o;
              break;
            }
            t.timeoutHandle = $u(sr.bind(null, t, it, an), e);
            break;
          }
          sr(t, it, an);
          break;
        case 4:
          if (An(t, r), (r & 4194240) === r) break;
          for (e = t.eventTimes, o = -1; 0 < r; ) {
            var s = 31 - Dt(r);
            i = 1 << s, s = e[s], s > o && (o = s), r &= ~i;
          }
          if (r = o, r = ke() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * n1(r / 1960)) - r, 10 < r) {
            t.timeoutHandle = $u(sr.bind(null, t, it, an), r);
            break;
          }
          sr(t, it, an);
          break;
        case 5:
          sr(t, it, an);
          break;
        default:
          throw Error(R(329));
      }
    }
  }
  return ct(t, ke()), t.callbackNode === n ? Vm.bind(null, t) : null;
}
function qu(t, e) {
  var n = oi;
  return t.current.memoizedState.isDehydrated && (cr(t, e).flags |= 256), t = tl(t, e), t !== 2 && (e = it, it = n, e !== null && ec(e)), t;
}
function ec(t) {
  it === null ? it = t : it.push.apply(it, t);
}
function r1(t) {
  for (var e = t; ; ) {
    if (e.flags & 16384) {
      var n = e.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var o = n[r], i = o.getSnapshot;
        o = o.value;
        try {
          if (!jt(i(), o)) return !1;
        } catch {
          return !1;
        }
      }
    }
    if (n = e.child, e.subtreeFlags & 16384 && n !== null) n.return = e, e = n;
    else {
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return !0;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
  }
  return !0;
}
function An(t, e) {
  for (e &= ~pd, e &= ~Rl, t.suspendedLanes |= e, t.pingedLanes &= ~e, t = t.expirationTimes; 0 < e; ) {
    var n = 31 - Dt(e), r = 1 << n;
    t[n] = -1, e &= ~r;
  }
}
function fp(t) {
  if (re & 6) throw Error(R(327));
  eo();
  var e = Ds(t, 0);
  if (!(e & 1)) return ct(t, ke()), null;
  var n = tl(t, e);
  if (t.tag !== 0 && n === 2) {
    var r = Eu(t);
    r !== 0 && (e = r, n = qu(t, r));
  }
  if (n === 1) throw n = Ti, cr(t, 0), An(t, e), ct(t, ke()), n;
  if (n === 6) throw Error(R(345));
  return t.finishedWork = t.current.alternate, t.finishedLanes = e, sr(t, it, an), ct(t, ke()), null;
}
function hd(t, e) {
  var n = re;
  re |= 1;
  try {
    return t(e);
  } finally {
    re = n, re === 0 && (ao = ke() + 500, Pl && Zn());
  }
}
function _r(t) {
  Pn !== null && Pn.tag === 0 && !(re & 6) && eo();
  var e = re;
  re |= 1;
  var n = Tt.transition, r = ue;
  try {
    if (Tt.transition = null, ue = 1, t) return t();
  } finally {
    ue = r, Tt.transition = n, re = e, !(re & 6) && Zn();
  }
}
function md() {
  pt = Qr.current, pe(Qr);
}
function cr(t, e) {
  t.finishedWork = null, t.finishedLanes = 0;
  var n = t.timeoutHandle;
  if (n !== -1 && (t.timeoutHandle = -1, $_(n)), Ne !== null) for (n = Ne.return; n !== null; ) {
    var r = n;
    switch (Yc(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Us();
        break;
      case 3:
        so(), pe(at), pe(Ye), id();
        break;
      case 5:
        od(r);
        break;
      case 4:
        so();
        break;
      case 13:
        pe(ve);
        break;
      case 19:
        pe(ve);
        break;
      case 10:
        ed(r.type._context);
        break;
      case 22:
      case 23:
        md();
    }
    n = n.return;
  }
  if (Re = t, Ne = t = Un(t.current, null), je = pt = e, Fe = 0, Ti = null, pd = Rl = vr = 0, it = oi = null, ar !== null) {
    for (e = 0; e < ar.length; e++) if (n = ar[e], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var o = r.next, i = n.pending;
      if (i !== null) {
        var s = i.next;
        i.next = o, r.next = s;
      }
      n.pending = r;
    }
    ar = null;
  }
  return t;
}
function Hm(t, e) {
  do {
    var n = Ne;
    try {
      if (qc(), ks.current = Zs, Ys) {
        for (var r = _e.memoizedState; r !== null; ) {
          var o = r.queue;
          o !== null && (o.pending = null), r = r.next;
        }
        Ys = !1;
      }
      if (yr = 0, Pe = Oe = _e = null, ni = !1, ki = 0, fd.current = null, n === null || n.return === null) {
        Fe = 1, Ti = e, Ne = null;
        break;
      }
      e: {
        var i = t, s = n.return, l = n, a = e;
        if (e = je, l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
          var u = a, c = l, p = c.tag;
          if (!(c.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var f = c.alternate;
            f ? (c.updateQueue = f.updateQueue, c.memoizedState = f.memoizedState, c.lanes = f.lanes) : (c.updateQueue = null, c.memoizedState = null);
          }
          var m = qf(s);
          if (m !== null) {
            m.flags &= -257, ep(m, s, l, i, e), m.mode & 1 && Xf(i, u, e), e = m, a = u;
            var h = e.updateQueue;
            if (h === null) {
              var y = /* @__PURE__ */ new Set();
              y.add(a), e.updateQueue = y;
            } else h.add(a);
            break e;
          } else {
            if (!(e & 1)) {
              Xf(i, u, e), yd();
              break e;
            }
            a = Error(R(426));
          }
        } else if (me && l.mode & 1) {
          var _ = qf(s);
          if (_ !== null) {
            !(_.flags & 65536) && (_.flags |= 256), ep(_, s, l, i, e), Zc(lo(a, l));
            break e;
          }
        }
        i = a = lo(a, l), Fe !== 4 && (Fe = 2), oi === null ? oi = [i] : oi.push(i), i = s;
        do {
          switch (i.tag) {
            case 3:
              i.flags |= 65536, e &= -e, i.lanes |= e;
              var v = bm(i, a, e);
              Kf(i, v);
              break e;
            case 1:
              l = a;
              var d = i.type, g = i.stateNode;
              if (!(i.flags & 128) && (typeof d.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && (jn === null || !jn.has(g)))) {
                i.flags |= 65536, e &= -e, i.lanes |= e;
                var x = Om(i, l, e);
                Kf(i, x);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      Gm(n);
    } catch (w) {
      e = w, Ne === n && n !== null && (Ne = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function Km() {
  var t = Xs.current;
  return Xs.current = Zs, t === null ? Zs : t;
}
function yd() {
  (Fe === 0 || Fe === 3 || Fe === 2) && (Fe = 4), Re === null || !(vr & 268435455) && !(Rl & 268435455) || An(Re, je);
}
function tl(t, e) {
  var n = re;
  re |= 2;
  var r = Km();
  (Re !== t || je !== e) && (an = null, cr(t, e));
  do
    try {
      o1();
      break;
    } catch (o) {
      Hm(t, o);
    }
  while (!0);
  if (qc(), re = n, Xs.current = r, Ne !== null) throw Error(R(261));
  return Re = null, je = 0, Fe;
}
function o1() {
  for (; Ne !== null; ) Qm(Ne);
}
function i1() {
  for (; Ne !== null && !A0(); ) Qm(Ne);
}
function Qm(t) {
  var e = Ym(t.alternate, t, pt);
  t.memoizedProps = t.pendingProps, e === null ? Gm(t) : Ne = e, fd.current = null;
}
function Gm(t) {
  var e = t;
  do {
    var n = e.alternate;
    if (t = e.return, e.flags & 32768) {
      if (n = X_(n, e), n !== null) {
        n.flags &= 32767, Ne = n;
        return;
      }
      if (t !== null) t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null;
      else {
        Fe = 6, Ne = null;
        return;
      }
    } else if (n = Z_(n, e, pt), n !== null) {
      Ne = n;
      return;
    }
    if (e = e.sibling, e !== null) {
      Ne = e;
      return;
    }
    Ne = e = t;
  } while (e !== null);
  Fe === 0 && (Fe = 5);
}
function sr(t, e, n) {
  var r = ue, o = Tt.transition;
  try {
    Tt.transition = null, ue = 1, s1(t, e, n, r);
  } finally {
    Tt.transition = o, ue = r;
  }
  return null;
}
function s1(t, e, n, r) {
  do
    eo();
  while (Pn !== null);
  if (re & 6) throw Error(R(327));
  n = t.finishedWork;
  var o = t.finishedLanes;
  if (n === null) return null;
  if (t.finishedWork = null, t.finishedLanes = 0, n === t.current) throw Error(R(177));
  t.callbackNode = null, t.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (j0(t, i), t === Re && (Ne = Re = null, je = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || us || (us = !0, Zm(Rs, function() {
    return eo(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = Tt.transition, Tt.transition = null;
    var s = ue;
    ue = 1;
    var l = re;
    re |= 4, fd.current = null, e1(t, n), Um(n, t), T_(Fu), Ms = !!Au, Fu = Au = null, t.current = n, t1(n), F0(), re = l, ue = s, Tt.transition = i;
  } else t.current = n;
  if (us && (us = !1, Pn = t, el = o), i = t.pendingLanes, i === 0 && (jn = null), L0(n.stateNode), ct(t, ke()), e !== null) for (r = t.onRecoverableError, n = 0; n < e.length; n++) o = e[n], r(o.value, { componentStack: o.stack, digest: o.digest });
  if (qs) throw qs = !1, t = Zu, Zu = null, t;
  return el & 1 && t.tag !== 0 && eo(), i = t.pendingLanes, i & 1 ? t === Xu ? ii++ : (ii = 0, Xu = t) : ii = 0, Zn(), null;
}
function eo() {
  if (Pn !== null) {
    var t = bh(el), e = Tt.transition, n = ue;
    try {
      if (Tt.transition = null, ue = 16 > t ? 16 : t, Pn === null) var r = !1;
      else {
        if (t = Pn, Pn = null, el = 0, re & 6) throw Error(R(331));
        var o = re;
        for (re |= 4, V = t.current; V !== null; ) {
          var i = V, s = i.child;
          if (V.flags & 16) {
            var l = i.deletions;
            if (l !== null) {
              for (var a = 0; a < l.length; a++) {
                var u = l[a];
                for (V = u; V !== null; ) {
                  var c = V;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ri(8, c, i);
                  }
                  var p = c.child;
                  if (p !== null) p.return = c, V = p;
                  else for (; V !== null; ) {
                    c = V;
                    var f = c.sibling, m = c.return;
                    if (zm(c), c === u) {
                      V = null;
                      break;
                    }
                    if (f !== null) {
                      f.return = m, V = f;
                      break;
                    }
                    V = m;
                  }
                }
              }
              var h = i.alternate;
              if (h !== null) {
                var y = h.child;
                if (y !== null) {
                  h.child = null;
                  do {
                    var _ = y.sibling;
                    y.sibling = null, y = _;
                  } while (y !== null);
                }
              }
              V = i;
            }
          }
          if (i.subtreeFlags & 2064 && s !== null) s.return = i, V = s;
          else e: for (; V !== null; ) {
            if (i = V, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                ri(9, i, i.return);
            }
            var v = i.sibling;
            if (v !== null) {
              v.return = i.return, V = v;
              break e;
            }
            V = i.return;
          }
        }
        var d = t.current;
        for (V = d; V !== null; ) {
          s = V;
          var g = s.child;
          if (s.subtreeFlags & 2064 && g !== null) g.return = s, V = g;
          else e: for (s = d; V !== null; ) {
            if (l = V, l.flags & 2048) try {
              switch (l.tag) {
                case 0:
                case 11:
                case 15:
                  Il(9, l);
              }
            } catch (w) {
              we(l, l.return, w);
            }
            if (l === s) {
              V = null;
              break e;
            }
            var x = l.sibling;
            if (x !== null) {
              x.return = l.return, V = x;
              break e;
            }
            V = l.return;
          }
        }
        if (re = o, Zn(), Jt && typeof Jt.onPostCommitFiberRoot == "function") try {
          Jt.onPostCommitFiberRoot(Nl, t);
        } catch {
        }
        r = !0;
      }
      return r;
    } finally {
      ue = n, Tt.transition = e;
    }
  }
  return !1;
}
function pp(t, e, n) {
  e = lo(n, e), e = bm(t, e, 1), t = zn(t, e, 1), e = et(), t !== null && (Ii(t, 1, e), ct(t, e));
}
function we(t, e, n) {
  if (t.tag === 3) pp(t, t, n);
  else for (; e !== null; ) {
    if (e.tag === 3) {
      pp(e, t, n);
      break;
    } else if (e.tag === 1) {
      var r = e.stateNode;
      if (typeof e.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (jn === null || !jn.has(r))) {
        t = lo(n, t), t = Om(e, t, 1), e = zn(e, t, 1), t = et(), e !== null && (Ii(e, 1, t), ct(e, t));
        break;
      }
    }
    e = e.return;
  }
}
function l1(t, e, n) {
  var r = t.pingCache;
  r !== null && r.delete(e), e = et(), t.pingedLanes |= t.suspendedLanes & n, Re === t && (je & n) === n && (Fe === 4 || Fe === 3 && (je & 130023424) === je && 500 > ke() - gd ? cr(t, 0) : pd |= n), ct(t, e);
}
function Jm(t, e) {
  e === 0 && (t.mode & 1 ? (e = qi, qi <<= 1, !(qi & 130023424) && (qi = 4194304)) : e = 1);
  var n = et();
  t = _n(t, e), t !== null && (Ii(t, e, n), ct(t, n));
}
function a1(t) {
  var e = t.memoizedState, n = 0;
  e !== null && (n = e.retryLane), Jm(t, n);
}
function u1(t, e) {
  var n = 0;
  switch (t.tag) {
    case 13:
      var r = t.stateNode, o = t.memoizedState;
      o !== null && (n = o.retryLane);
      break;
    case 19:
      r = t.stateNode;
      break;
    default:
      throw Error(R(314));
  }
  r !== null && r.delete(e), Jm(t, n);
}
var Ym;
Ym = function(t, e, n) {
  if (t !== null) if (t.memoizedProps !== e.pendingProps || at.current) lt = !0;
  else {
    if (!(t.lanes & n) && !(e.flags & 128)) return lt = !1, Y_(t, e, n);
    lt = !!(t.flags & 131072);
  }
  else lt = !1, me && e.flags & 1048576 && em(e, Hs, e.index);
  switch (e.lanes = 0, e.tag) {
    case 2:
      var r = e.type;
      Es(t, e), t = e.pendingProps;
      var o = ro(e, Ye.current);
      qr(e, n), o = ld(null, e, r, t, o, n);
      var i = ad();
      return e.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (e.tag = 1, e.memoizedState = null, e.updateQueue = null, ut(r) ? (i = !0, Ws(e)) : i = !1, e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, nd(e), o.updater = Ll, e.stateNode = o, o._reactInternals = e, ju(e, r, t, n), e = Wu(null, e, r, !0, i, n)) : (e.tag = 0, me && i && Jc(e), Xe(null, e, o, n), e = e.child), e;
    case 16:
      r = e.elementType;
      e: {
        switch (Es(t, e), t = e.pendingProps, o = r._init, r = o(r._payload), e.type = r, o = e.tag = d1(r), t = $t(r, t), o) {
          case 0:
            e = Uu(null, e, r, t, n);
            break e;
          case 1:
            e = rp(null, e, r, t, n);
            break e;
          case 11:
            e = tp(null, e, r, t, n);
            break e;
          case 14:
            e = np(null, e, r, $t(r.type, t), n);
            break e;
        }
        throw Error(R(
          306,
          r,
          ""
        ));
      }
      return e;
    case 0:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : $t(r, o), Uu(t, e, r, o, n);
    case 1:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : $t(r, o), rp(t, e, r, o, n);
    case 3:
      e: {
        if ($m(e), t === null) throw Error(R(387));
        r = e.pendingProps, i = e.memoizedState, o = i.element, sm(t, e), Gs(e, r, null, n);
        var s = e.memoizedState;
        if (r = s.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, e.updateQueue.baseState = i, e.memoizedState = i, e.flags & 256) {
          o = lo(Error(R(423)), e), e = op(t, e, r, n, o);
          break e;
        } else if (r !== o) {
          o = lo(Error(R(424)), e), e = op(t, e, r, n, o);
          break e;
        } else for (mt = Mn(e.stateNode.containerInfo.firstChild), yt = e, me = !0, Rt = null, n = om(e, null, r, n), e.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (oo(), r === o) {
            e = xn(t, e, n);
            break e;
          }
          Xe(t, e, r, n);
        }
        e = e.child;
      }
      return e;
    case 5:
      return lm(e), t === null && Du(e), r = e.type, o = e.pendingProps, i = t !== null ? t.memoizedProps : null, s = o.children, Pu(r, o) ? s = null : i !== null && Pu(r, i) && (e.flags |= 32), Pm(t, e), Xe(t, e, s, n), e.child;
    case 6:
      return t === null && Du(e), null;
    case 13:
      return Lm(t, e, n);
    case 4:
      return rd(e, e.stateNode.containerInfo), r = e.pendingProps, t === null ? e.child = io(e, null, r, n) : Xe(t, e, r, n), e.child;
    case 11:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : $t(r, o), tp(t, e, r, o, n);
    case 7:
      return Xe(t, e, e.pendingProps, n), e.child;
    case 8:
      return Xe(t, e, e.pendingProps.children, n), e.child;
    case 12:
      return Xe(t, e, e.pendingProps.children, n), e.child;
    case 10:
      e: {
        if (r = e.type._context, o = e.pendingProps, i = e.memoizedProps, s = o.value, de(Ks, r._currentValue), r._currentValue = s, i !== null) if (jt(i.value, s)) {
          if (i.children === o.children && !at.current) {
            e = xn(t, e, n);
            break e;
          }
        } else for (i = e.child, i !== null && (i.return = e); i !== null; ) {
          var l = i.dependencies;
          if (l !== null) {
            s = i.child;
            for (var a = l.firstContext; a !== null; ) {
              if (a.context === r) {
                if (i.tag === 1) {
                  a = hn(-1, n & -n), a.tag = 2;
                  var u = i.updateQueue;
                  if (u !== null) {
                    u = u.shared;
                    var c = u.pending;
                    c === null ? a.next = a : (a.next = c.next, c.next = a), u.pending = a;
                  }
                }
                i.lanes |= n, a = i.alternate, a !== null && (a.lanes |= n), Mu(
                  i.return,
                  n,
                  e
                ), l.lanes |= n;
                break;
              }
              a = a.next;
            }
          } else if (i.tag === 10) s = i.type === e.type ? null : i.child;
          else if (i.tag === 18) {
            if (s = i.return, s === null) throw Error(R(341));
            s.lanes |= n, l = s.alternate, l !== null && (l.lanes |= n), Mu(s, n, e), s = i.sibling;
          } else s = i.child;
          if (s !== null) s.return = i;
          else for (s = i; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            if (i = s.sibling, i !== null) {
              i.return = s.return, s = i;
              break;
            }
            s = s.return;
          }
          i = s;
        }
        Xe(t, e, o.children, n), e = e.child;
      }
      return e;
    case 9:
      return o = e.type, r = e.pendingProps.children, qr(e, n), o = Nt(o), r = r(o), e.flags |= 1, Xe(t, e, r, n), e.child;
    case 14:
      return r = e.type, o = $t(r, e.pendingProps), o = $t(r.type, o), np(t, e, r, o, n);
    case 15:
      return Am(t, e, e.type, e.pendingProps, n);
    case 17:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : $t(r, o), Es(t, e), e.tag = 1, ut(r) ? (t = !0, Ws(e)) : t = !1, qr(e, n), Nm(e, r, o), ju(e, r, o, n), Wu(null, e, r, !0, t, n);
    case 19:
      return Im(t, e, n);
    case 22:
      return Fm(t, e, n);
  }
  throw Error(R(156, e.tag));
};
function Zm(t, e) {
  return Ch(t, e);
}
function c1(t, e, n, r) {
  this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function Et(t, e, n, r) {
  return new c1(t, e, n, r);
}
function vd(t) {
  return t = t.prototype, !(!t || !t.isReactComponent);
}
function d1(t) {
  if (typeof t == "function") return vd(t) ? 1 : 0;
  if (t != null) {
    if (t = t.$$typeof, t === Dc) return 11;
    if (t === Mc) return 14;
  }
  return 2;
}
function Un(t, e) {
  var n = t.alternate;
  return n === null ? (n = Et(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 14680064, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n;
}
function bs(t, e, n, r, o, i) {
  var s = 2;
  if (r = t, typeof t == "function") vd(t) && (s = 1);
  else if (typeof t == "string") s = 5;
  else e: switch (t) {
    case Dr:
      return dr(n.children, o, i, e);
    case Rc:
      s = 8, o |= 8;
      break;
    case cu:
      return t = Et(12, n, e, o | 2), t.elementType = cu, t.lanes = i, t;
    case du:
      return t = Et(13, n, e, o), t.elementType = du, t.lanes = i, t;
    case fu:
      return t = Et(19, n, e, o), t.elementType = fu, t.lanes = i, t;
    case lh:
      return Dl(n, o, i, e);
    default:
      if (typeof t == "object" && t !== null) switch (t.$$typeof) {
        case ih:
          s = 10;
          break e;
        case sh:
          s = 9;
          break e;
        case Dc:
          s = 11;
          break e;
        case Mc:
          s = 14;
          break e;
        case Tn:
          s = 16, r = null;
          break e;
      }
      throw Error(R(130, t == null ? t : typeof t, ""));
  }
  return e = Et(s, n, e, o), e.elementType = t, e.type = r, e.lanes = i, e;
}
function dr(t, e, n, r) {
  return t = Et(7, t, r, e), t.lanes = n, t;
}
function Dl(t, e, n, r) {
  return t = Et(22, t, r, e), t.elementType = lh, t.lanes = n, t.stateNode = { isHidden: !1 }, t;
}
function Ua(t, e, n) {
  return t = Et(6, t, null, e), t.lanes = n, t;
}
function Wa(t, e, n) {
  return e = Et(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, e;
}
function f1(t, e, n, r, o) {
  this.tag = e, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ka(0), this.expirationTimes = ka(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ka(0), this.identifierPrefix = r, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
}
function _d(t, e, n, r, o, i, s, l, a) {
  return t = new f1(t, e, n, l, a), e === 1 ? (e = 1, i === !0 && (e |= 8)) : e = 0, i = Et(3, null, null, e), t.current = i, i.stateNode = t, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, nd(i), t;
}
function p1(t, e, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Rr, key: r == null ? null : "" + r, children: t, containerInfo: e, implementation: n };
}
function Xm(t) {
  if (!t) return Qn;
  t = t._reactInternals;
  e: {
    if (Er(t) !== t || t.tag !== 1) throw Error(R(170));
    var e = t;
    do {
      switch (e.tag) {
        case 3:
          e = e.stateNode.context;
          break e;
        case 1:
          if (ut(e.type)) {
            e = e.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      e = e.return;
    } while (e !== null);
    throw Error(R(171));
  }
  if (t.tag === 1) {
    var n = t.type;
    if (ut(n)) return Xh(t, n, e);
  }
  return e;
}
function qm(t, e, n, r, o, i, s, l, a) {
  return t = _d(n, r, !0, t, o, i, s, l, a), t.context = Xm(null), n = t.current, r = et(), o = Bn(n), i = hn(r, o), i.callback = e ?? null, zn(n, i, o), t.current.lanes = o, Ii(t, o, r), ct(t, r), t;
}
function Ml(t, e, n, r) {
  var o = e.current, i = et(), s = Bn(o);
  return n = Xm(n), e.context === null ? e.context = n : e.pendingContext = n, e = hn(i, s), e.payload = { element: t }, r = r === void 0 ? null : r, r !== null && (e.callback = r), t = zn(o, e, s), t !== null && (Mt(t, o, s, i), Ss(t, o, s)), s;
}
function nl(t) {
  if (t = t.current, !t.child) return null;
  switch (t.child.tag) {
    case 5:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
function gp(t, e) {
  if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
    var n = t.retryLane;
    t.retryLane = n !== 0 && n < e ? n : e;
  }
}
function xd(t, e) {
  gp(t, e), (t = t.alternate) && gp(t, e);
}
function g1() {
  return null;
}
var ey = typeof reportError == "function" ? reportError : function(t) {
  console.error(t);
};
function wd(t) {
  this._internalRoot = t;
}
zl.prototype.render = wd.prototype.render = function(t) {
  var e = this._internalRoot;
  if (e === null) throw Error(R(409));
  Ml(t, e, null, null);
};
zl.prototype.unmount = wd.prototype.unmount = function() {
  var t = this._internalRoot;
  if (t !== null) {
    this._internalRoot = null;
    var e = t.containerInfo;
    _r(function() {
      Ml(null, t, null, null);
    }), e[vn] = null;
  }
};
function zl(t) {
  this._internalRoot = t;
}
zl.prototype.unstable_scheduleHydration = function(t) {
  if (t) {
    var e = Fh();
    t = { blockedOn: null, target: t, priority: e };
    for (var n = 0; n < On.length && e !== 0 && e < On[n].priority; n++) ;
    On.splice(n, 0, t), n === 0 && $h(t);
  }
};
function Sd(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
}
function jl(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11 && (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "));
}
function hp() {
}
function h1(t, e, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var u = nl(s);
        i.call(u);
      };
    }
    var s = qm(e, r, t, 0, null, !1, !1, "", hp);
    return t._reactRootContainer = s, t[vn] = s.current, vi(t.nodeType === 8 ? t.parentNode : t), _r(), s;
  }
  for (; o = t.lastChild; ) t.removeChild(o);
  if (typeof r == "function") {
    var l = r;
    r = function() {
      var u = nl(a);
      l.call(u);
    };
  }
  var a = _d(t, 0, !1, null, null, !1, !1, "", hp);
  return t._reactRootContainer = a, t[vn] = a.current, vi(t.nodeType === 8 ? t.parentNode : t), _r(function() {
    Ml(e, a, n, r);
  }), a;
}
function Bl(t, e, n, r, o) {
  var i = n._reactRootContainer;
  if (i) {
    var s = i;
    if (typeof o == "function") {
      var l = o;
      o = function() {
        var a = nl(s);
        l.call(a);
      };
    }
    Ml(e, s, t, o);
  } else s = h1(n, e, t, o, r);
  return nl(s);
}
Oh = function(t) {
  switch (t.tag) {
    case 3:
      var e = t.stateNode;
      if (e.current.memoizedState.isDehydrated) {
        var n = Uo(e.pendingLanes);
        n !== 0 && (Bc(e, n | 1), ct(e, ke()), !(re & 6) && (ao = ke() + 500, Zn()));
      }
      break;
    case 13:
      _r(function() {
        var r = _n(t, 1);
        if (r !== null) {
          var o = et();
          Mt(r, t, 1, o);
        }
      }), xd(t, 1);
  }
};
Uc = function(t) {
  if (t.tag === 13) {
    var e = _n(t, 134217728);
    if (e !== null) {
      var n = et();
      Mt(e, t, 134217728, n);
    }
    xd(t, 134217728);
  }
};
Ah = function(t) {
  if (t.tag === 13) {
    var e = Bn(t), n = _n(t, e);
    if (n !== null) {
      var r = et();
      Mt(n, t, e, r);
    }
    xd(t, e);
  }
};
Fh = function() {
  return ue;
};
Ph = function(t, e) {
  var n = ue;
  try {
    return ue = t, e();
  } finally {
    ue = n;
  }
};
Su = function(t, e, n) {
  switch (e) {
    case "input":
      if (hu(t, n), e = n.name, n.type === "radio" && e != null) {
        for (n = t; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + e) + '][type="radio"]'), e = 0; e < n.length; e++) {
          var r = n[e];
          if (r !== t && r.form === t.form) {
            var o = Fl(r);
            if (!o) throw Error(R(90));
            uh(r), hu(r, o);
          }
        }
      }
      break;
    case "textarea":
      dh(t, n);
      break;
    case "select":
      e = n.value, e != null && Jr(t, !!n.multiple, e, !1);
  }
};
vh = hd;
_h = _r;
var m1 = { usingClientEntryPoint: !1, Events: [Di, Br, Fl, mh, yh, hd] }, Io = { findFiberByHostInstance: lr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, y1 = { bundleType: Io.bundleType, version: Io.version, rendererPackageName: Io.rendererPackageName, rendererConfig: Io.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: kn.ReactCurrentDispatcher, findHostInstanceByFiber: function(t) {
  return t = Sh(t), t === null ? null : t.stateNode;
}, findFiberByHostInstance: Io.findFiberByHostInstance || g1, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var cs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!cs.isDisabled && cs.supportsFiber) try {
    Nl = cs.inject(y1), Jt = cs;
  } catch {
  }
}
xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = m1;
xt.createPortal = function(t, e) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Sd(e)) throw Error(R(200));
  return p1(t, e, null, n);
};
xt.createRoot = function(t, e) {
  if (!Sd(t)) throw Error(R(299));
  var n = !1, r = "", o = ey;
  return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (r = e.identifierPrefix), e.onRecoverableError !== void 0 && (o = e.onRecoverableError)), e = _d(t, 1, !1, null, null, n, !1, r, o), t[vn] = e.current, vi(t.nodeType === 8 ? t.parentNode : t), new wd(e);
};
xt.findDOMNode = function(t) {
  if (t == null) return null;
  if (t.nodeType === 1) return t;
  var e = t._reactInternals;
  if (e === void 0)
    throw typeof t.render == "function" ? Error(R(188)) : (t = Object.keys(t).join(","), Error(R(268, t)));
  return t = Sh(e), t = t === null ? null : t.stateNode, t;
};
xt.flushSync = function(t) {
  return _r(t);
};
xt.hydrate = function(t, e, n) {
  if (!jl(e)) throw Error(R(200));
  return Bl(null, t, e, !0, n);
};
xt.hydrateRoot = function(t, e, n) {
  if (!Sd(t)) throw Error(R(405));
  var r = n != null && n.hydratedSources || null, o = !1, i = "", s = ey;
  if (n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (s = n.onRecoverableError)), e = qm(e, null, t, 1, n ?? null, o, !1, i, s), t[vn] = e.current, vi(t), r) for (t = 0; t < r.length; t++) n = r[t], o = n._getVersion, o = o(n._source), e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [n, o] : e.mutableSourceEagerHydrationData.push(
    n,
    o
  );
  return new zl(e);
};
xt.render = function(t, e, n) {
  if (!jl(e)) throw Error(R(200));
  return Bl(null, t, e, !1, n);
};
xt.unmountComponentAtNode = function(t) {
  if (!jl(t)) throw Error(R(40));
  return t._reactRootContainer ? (_r(function() {
    Bl(null, null, t, !1, function() {
      t._reactRootContainer = null, t[vn] = null;
    });
  }), !0) : !1;
};
xt.unstable_batchedUpdates = hd;
xt.unstable_renderSubtreeIntoContainer = function(t, e, n, r) {
  if (!jl(n)) throw Error(R(200));
  if (t == null || t._reactInternals === void 0) throw Error(R(38));
  return Bl(t, e, n, !1, r);
};
xt.version = "18.3.1-next-f1338f8080-20240426";
function ty() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ty);
    } catch (t) {
      console.error(t);
    }
}
ty(), th.exports = xt;
var Xt = th.exports, mp = Xt;
au.createRoot = mp.createRoot, au.hydrateRoot = mp.hydrateRoot;
function v1(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var _1 = v1(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const ny = T.createContext(null);
function x1(t, e) {
  let n = null;
  return { getTheme: function() {
    return e ?? (n != null ? n.getTheme() : null);
  } };
}
function Se() {
  const t = T.useContext(ny);
  return t == null && _1(8), t;
}
function rn(t) {
  return {};
}
const Tr = {}, w1 = {}, Ul = {}, Zt = {}, Wn = {}, uo = {}, fr = {}, vo = {}, rl = {}, co = {}, fo = {}, gt = {}, Wl = {}, Vl = {}, kd = {}, Hl = {}, S1 = {}, Kl = {}, k1 = {}, Ql = {}, Gl = {}, xr = {}, ry = {}, _o = {}, Jl = {}, Yl = {}, Cd = {}, C1 = {}, E1 = {}, yp = {}, Ed = {}, T1 = {}, Td = {}, oy = {}, N1 = {}, zi = {}, Zl = {}, ol = {}, b1 = {}, O1 = {}, Vo = {}, Ho = {}, Nd = {}, Xl = {}, A1 = {};
function F1(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var B = F1(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const Ut = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, P1 = Ut && "documentMode" in document ? document.documentMode : null, Ft = Ut && /Mac|iPod|iPhone|iPad/.test(navigator.platform), Vn = Ut && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent), il = !(!Ut || !("InputEvent" in window) || P1) && "getTargetRanges" in new window.InputEvent("input"), bd = Ut && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), ql = Ut && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, $1 = Ut && /Android/.test(navigator.userAgent), iy = Ut && /^(?=.*Chrome).*/i.test(navigator.userAgent), L1 = Ut && $1 && iy, Od = Ut && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !iy, ji = 1, Xn = 3, wr = 0, sy = 1, po = 2, I1 = 0, R1 = 1, D1 = 2, sl = 4, ll = 8, M1 = 240 | (3 | sl | ll), Ad = 1, Fd = 2, Pd = 3, $d = 4, Ld = 5, Id = 6, ea = bd || ql || Od ? " " : "​", wn = `

`, z1 = Vn ? " " : ea, ly = "֑-߿יִ-﷽ﹰ-ﻼ", ay = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿", j1 = new RegExp("^[^" + ay + "]*[" + ly + "]"), B1 = new RegExp("^[^" + ly + "]*[" + ay + "]"), mn = { bold: 1, code: 16, highlight: 128, italic: 2, strikethrough: sl, subscript: 32, superscript: 64, underline: ll }, U1 = { directionless: 1, unmergeable: 2 }, vp = { center: Fd, end: Id, justify: $d, left: Ad, right: Pd, start: Ld }, W1 = { [Fd]: "center", [Id]: "end", [$d]: "justify", [Ad]: "left", [Pd]: "right", [Ld]: "start" }, V1 = { normal: 0, segmented: 2, token: 1 }, H1 = { [I1]: "normal", [D1]: "segmented", [R1]: "token" };
function al(...t) {
  const e = [];
  for (const n of t) if (n && typeof n == "string") for (const [r] of n.matchAll(/\S+/g)) e.push(r);
  return e;
}
const K1 = 100;
let tc = !1, Rd = 0;
function Q1(t) {
  Rd = t.timeStamp;
}
function Va(t, e, n) {
  return e.__lexicalLineBreak === t || t[`__lexicalKey_${n._key}`] !== void 0;
}
function G1(t, e, n) {
  const r = qt(n._window);
  let o = null, i = null;
  r !== null && r.anchorNode === t && (o = r.anchorOffset, i = r.focusOffset);
  const s = t.nodeValue;
  s !== null && Bd(e, s, o, i, !1);
}
function J1(t, e, n) {
  if (A(t)) {
    const r = t.anchor.getNode();
    if (r.is(n) && t.format !== r.getFormat()) return !1;
  }
  return e.nodeType === Xn && n.isAttached();
}
function uy(t, e, n) {
  tc = !0;
  const r = performance.now() - Rd > K1;
  try {
    ht(t, () => {
      const o = $() || function(f) {
        return f.getEditorState().read(() => {
          const m = $();
          return m !== null ? m.clone() : null;
        });
      }(t), i = /* @__PURE__ */ new Map(), s = t.getRootElement(), l = t._editorState, a = t._blockCursorElement;
      let u = !1, c = "";
      for (let f = 0; f < e.length; f++) {
        const m = e[f], h = m.type, y = m.target;
        let _ = Sn(y, l);
        if (!(_ === null && y !== s || se(_))) {
          if (h === "characterData") r && I(_) && J1(o, y, _) && G1(y, _, t);
          else if (h === "childList") {
            u = !0;
            const v = m.addedNodes;
            for (let x = 0; x < v.length; x++) {
              const w = v[x], S = gy(w), k = w.parentNode;
              if (k != null && w !== a && S === null && (w.nodeName !== "BR" || !Va(w, k, t))) {
                if (Vn) {
                  const C = w.innerText || w.nodeValue;
                  C && (c += C);
                }
                k.removeChild(w);
              }
            }
            const d = m.removedNodes, g = d.length;
            if (g > 0) {
              let x = 0;
              for (let w = 0; w < g; w++) {
                const S = d[w];
                (S.nodeName === "BR" && Va(S, y, t) || a === S) && (y.appendChild(S), x++);
              }
              g !== x && (y === s && (_ = my(l)), i.set(y, _));
            }
          }
        }
      }
      if (i.size > 0) for (const [f, m] of i) if (b(m)) {
        const h = m.getChildrenKeys();
        let y = f.firstChild;
        for (let _ = 0; _ < h.length; _++) {
          const v = h[_], d = t.getElementByKey(v);
          d !== null && (y == null ? (f.appendChild(d), y = d) : y !== d && f.replaceChild(d, y), y = y.nextSibling);
        }
      } else I(m) && m.markDirty();
      const p = n.takeRecords();
      if (p.length > 0) {
        for (let f = 0; f < p.length; f++) {
          const m = p[f], h = m.addedNodes, y = m.target;
          for (let _ = 0; _ < h.length; _++) {
            const v = h[_], d = v.parentNode;
            d == null || v.nodeName !== "BR" || Va(v, y, t) || d.removeChild(v);
          }
        }
        n.takeRecords();
      }
      o !== null && (u && (o.dirty = !0, De(o)), Vn && wy(t) && o.insertRawText(c));
    });
  } finally {
    tc = !1;
  }
}
function cy(t) {
  const e = t._observer;
  e !== null && uy(t, e.takeRecords(), e);
}
function dy(t) {
  (function(e) {
    Rd === 0 && ra(e).addEventListener("textInput", Q1, !0);
  })(t), t._observer = new MutationObserver((e, n) => {
    uy(t, e, n);
  });
}
function _p(t, e) {
  const n = t.__mode, r = t.__format, o = t.__style, i = e.__mode, s = e.__format, l = e.__style;
  return !(n !== null && n !== i || r !== null && r !== s || o !== null && o !== l);
}
function xp(t, e) {
  const n = t.mergeWithSibling(e), r = Ee()._normalizedNodes;
  return r.add(t.__key), r.add(e.__key), n;
}
function wp(t) {
  let e, n, r = t;
  if (r.__text !== "" || !r.isSimpleText() || r.isUnmergeable()) {
    for (; (e = r.getPreviousSibling()) !== null && I(e) && e.isSimpleText() && !e.isUnmergeable(); ) {
      if (e.__text !== "") {
        if (_p(e, r)) {
          r = xp(e, r);
          break;
        }
        break;
      }
      e.remove();
    }
    for (; (n = r.getNextSibling()) !== null && I(n) && n.isSimpleText() && !n.isUnmergeable(); ) {
      if (n.__text !== "") {
        if (_p(r, n)) {
          r = xp(r, n);
          break;
        }
        break;
      }
      n.remove();
    }
  } else r.remove();
}
function fy(t) {
  return Sp(t.anchor), Sp(t.focus), t;
}
function Sp(t) {
  for (; t.type === "element"; ) {
    const e = t.getNode(), n = t.offset;
    let r, o;
    if (n === e.getChildrenSize() ? (r = e.getChildAtIndex(n - 1), o = !0) : (r = e.getChildAtIndex(n), o = !1), I(r)) {
      t.set(r.__key, o ? r.getTextContentSize() : 0, "text");
      break;
    }
    if (!b(r)) break;
    t.set(r.__key, o ? r.getChildrenSize() : 0, "element");
  }
}
let Y1 = 1;
const Z1 = typeof queueMicrotask == "function" ? queueMicrotask : (t) => {
  Promise.resolve().then(t);
};
function Dd(t) {
  const e = document.activeElement;
  if (e === null) return !1;
  const n = e.nodeName;
  return se(Sn(t)) && (n === "INPUT" || n === "TEXTAREA" || e.contentEditable === "true" && e.__lexicalEditor == null);
}
function Bi(t, e, n) {
  const r = t.getRootElement();
  try {
    return r !== null && r.contains(e) && r.contains(n) && e !== null && !Dd(e) && py(e) === t;
  } catch {
    return !1;
  }
}
function py(t) {
  let e = t;
  for (; e != null; ) {
    const n = e.__lexicalEditor;
    if (n != null) return n;
    e = na(e);
  }
  return null;
}
function Pr(t) {
  return t.isToken() || t.isSegmented();
}
function X1(t) {
  return t.nodeType === Xn;
}
function ul(t) {
  let e = t;
  for (; e != null; ) {
    if (X1(e)) return e;
    e = e.firstChild;
  }
  return null;
}
function nc(t, e, n) {
  const r = mn[e];
  if (n !== null && (t & r) == (n & r)) return t;
  let o = t ^ r;
  return e === "subscript" ? o &= ~mn.superscript : e === "superscript" && (o &= ~mn.subscript), o;
}
function Md(t) {
  return I(t) || Hn(t) || se(t);
}
function q1(t, e) {
  if (e != null) return void (t.__key = e);
  st(), Uy();
  const n = Ee(), r = sn(), o = "" + Y1++;
  r._nodeMap.set(o, t), b(t) ? n._dirtyElements.set(o, !0) : n._dirtyLeaves.add(o), n._cloneNotNeeded.add(o), n._dirtyType = sy, t.__key = o;
}
function pr(t) {
  const e = t.getParent();
  if (e !== null) {
    const n = t.getWritable(), r = e.getWritable(), o = t.getPreviousSibling(), i = t.getNextSibling();
    if (o === null) if (i !== null) {
      const s = i.getWritable();
      r.__first = i.__key, s.__prev = null;
    } else r.__first = null;
    else {
      const s = o.getWritable();
      if (i !== null) {
        const l = i.getWritable();
        l.__prev = s.__key, s.__next = l.__key;
      } else s.__next = null;
      n.__prev = null;
    }
    if (i === null) if (o !== null) {
      const s = o.getWritable();
      r.__last = o.__key, s.__next = null;
    } else r.__last = null;
    else {
      const s = i.getWritable();
      if (o !== null) {
        const l = o.getWritable();
        l.__next = s.__key, s.__prev = l.__key;
      } else s.__prev = null;
      n.__next = null;
    }
    r.__size--, n.__parent = null;
  }
}
function cl(t) {
  Uy();
  const e = t.getLatest(), n = e.__parent, r = sn(), o = Ee(), i = r._nodeMap, s = o._dirtyElements;
  n !== null && function(a, u, c) {
    let p = a;
    for (; p !== null; ) {
      if (c.has(p)) return;
      const f = u.get(p);
      if (f === void 0) break;
      c.set(p, !1), p = f.__parent;
    }
  }(n, i, s);
  const l = e.__key;
  o._dirtyType = sy, b(t) ? s.set(l, !0) : o._dirtyLeaves.add(l);
}
function ze(t) {
  st();
  const e = Ee(), n = e._compositionKey;
  if (t !== n) {
    if (e._compositionKey = t, n !== null) {
      const r = Ce(n);
      r !== null && r.getWritable();
    }
    if (t !== null) {
      const r = Ce(t);
      r !== null && r.getWritable();
    }
  }
}
function $n() {
  return Vi() ? null : Ee()._compositionKey;
}
function Ce(t, e) {
  const n = (e || sn())._nodeMap.get(t);
  return n === void 0 ? null : n;
}
function gy(t, e) {
  const n = t[`__lexicalKey_${Ee()._key}`];
  return n !== void 0 ? Ce(n, e) : null;
}
function Sn(t, e) {
  let n = t;
  for (; n != null; ) {
    const r = gy(n, e);
    if (r !== null) return r;
    n = na(n);
  }
  return null;
}
function hy(t) {
  const e = t._decorators, n = Object.assign({}, e);
  return t._pendingDecorators = n, n;
}
function kp(t) {
  return t.read(() => ye().getTextContent());
}
function ye() {
  return my(sn());
}
function my(t) {
  return t._nodeMap.get("root");
}
function De(t) {
  st();
  const e = sn();
  t !== null && (t.dirty = !0, t.setCachedNodes(null)), e._selection = t;
}
function Gr(t) {
  const e = Ee(), n = function(r, o) {
    let i = r;
    for (; i != null; ) {
      const s = i[`__lexicalKey_${o._key}`];
      if (s !== void 0) return s;
      i = na(i);
    }
    return null;
  }(t, e);
  return n === null ? t === e.getRootElement() ? Ce("root") : null : Ce(n);
}
function Cp(t, e) {
  return e ? t.getTextContentSize() : 0;
}
function yy(t) {
  return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(t);
}
function zd(t) {
  const e = [];
  let n = t;
  for (; n !== null; ) e.push(n), n = n._parentEditor;
  return e;
}
function vy() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);
}
function _y(t) {
  return t.nodeType === Xn ? t.nodeValue : null;
}
function jd(t, e, n) {
  const r = qt(e._window);
  if (r === null) return;
  const o = r.anchorNode;
  let { anchorOffset: i, focusOffset: s } = r;
  if (o !== null) {
    let l = _y(o);
    const a = Sn(o);
    if (l !== null && I(a)) {
      if (l === ea && n) {
        const u = n.length;
        l = n, i = u, s = u;
      }
      l !== null && Bd(a, l, i, s, t);
    }
  }
}
function Bd(t, e, n, r, o) {
  let i = t;
  if (i.isAttached() && (o || !i.isDirty())) {
    const s = i.isComposing();
    let l = e;
    (s || o) && e[e.length - 1] === ea && (l = e.slice(0, -1));
    const a = i.getTextContent();
    if (o || l !== a) {
      if (l === "") {
        if (ze(null), bd || ql || Od) i.remove();
        else {
          const y = Ee();
          setTimeout(() => {
            y.update(() => {
              i.isAttached() && i.remove();
            });
          }, 20);
        }
        return;
      }
      const u = i.getParent(), c = wo(), p = i.getTextContentSize(), f = $n(), m = i.getKey();
      if (i.isToken() || f !== null && m === f && !s || A(c) && (u !== null && !u.canInsertTextBefore() && c.anchor.offset === 0 || c.anchor.key === t.__key && c.anchor.offset === 0 && !i.canInsertTextBefore() && !s || c.focus.key === t.__key && c.focus.offset === p && !i.canInsertTextAfter() && !s)) return void i.markDirty();
      const h = $();
      if (!A(h) || n === null || r === null) return void i.setTextContent(l);
      if (h.setTextNodeRange(i, n, i, r), i.isSegmented()) {
        const y = oe(i.getTextContent());
        i.replace(y), i = y;
      }
      i.setTextContent(l);
    }
  }
}
function ex(t, e) {
  if (e.isSegmented()) return !0;
  if (!t.isCollapsed()) return !1;
  const n = t.anchor.offset, r = e.getParentOrThrow(), o = e.isToken();
  return n === 0 ? !e.canInsertTextBefore() || !r.canInsertTextBefore() && !e.isComposing() || o || function(i) {
    const s = i.getPreviousSibling();
    return (I(s) || b(s) && s.isInline()) && !s.canInsertTextAfter();
  }(e) : n === e.getTextContentSize() && (!e.canInsertTextAfter() || !r.canInsertTextAfter() && !e.isComposing() || o);
}
function Ep(t) {
  return t === "ArrowLeft";
}
function Tp(t) {
  return t === "ArrowRight";
}
function Ko(t, e) {
  return Ft ? t : e;
}
function Np(t) {
  return t === "Enter";
}
function Ro(t) {
  return t === "Backspace";
}
function Do(t) {
  return t === "Delete";
}
function bp(t, e, n) {
  return t.toLowerCase() === "a" && Ko(e, n);
}
function xy() {
  const t = ye();
  De(fy(t.select(0, t.getChildrenSize())));
}
function si(t, e) {
  t.__lexicalClassNameCache === void 0 && (t.__lexicalClassNameCache = {});
  const n = t.__lexicalClassNameCache, r = n[e];
  if (r !== void 0) return r;
  const o = t[e];
  if (typeof o == "string") {
    const i = al(o);
    return n[e] = i, i;
  }
  return o;
}
function Ud(t, e, n, r, o) {
  if (n.size === 0) return;
  const i = r.__type, s = r.__key, l = e.get(i);
  l === void 0 && B(33, i);
  const a = l.klass;
  let u = t.get(a);
  u === void 0 && (u = /* @__PURE__ */ new Map(), t.set(a, u));
  const c = u.get(s), p = c === "destroyed" && o === "created";
  (c === void 0 || p) && u.set(s, p ? "updated" : o);
}
function Wd(t) {
  const e = sn(), n = e._readOnly, r = t.getType(), o = e._nodeMap, i = [];
  for (const [, s] of o) s instanceof t && s.__type === r && (n || s.isAttached()) && i.push(s);
  return i;
}
function Op(t, e, n) {
  const r = t.getParent();
  let o = n, i = t;
  return r !== null && (e && n === 0 ? (o = i.getIndexWithinParent(), i = r) : e || n !== i.getChildrenSize() || (o = i.getIndexWithinParent() + 1, i = r)), i.getChildAtIndex(e ? o - 1 : o);
}
function Ni(t, e) {
  const n = t.offset;
  if (t.type === "element")
    return Op(t.getNode(), e, n);
  {
    const r = t.getNode();
    if (e && n === 0 || !e && n === r.getTextContentSize()) {
      const o = e ? r.getPreviousSibling() : r.getNextSibling();
      return o === null ? Op(r.getParentOrThrow(), e, r.getIndexWithinParent() + (e ? 0 : 1)) : o;
    }
  }
  return null;
}
function wy(t) {
  const e = ra(t).event, n = e && e.inputType;
  return n === "insertFromPaste" || n === "insertFromPasteAsQuotation";
}
function W(t, e, n) {
  return Wy(t, e, n);
}
function ta(t) {
  return !Je(t) && !t.isLastChild() && !t.isInline();
}
function dl(t, e) {
  const n = t._keyToDOMMap.get(e);
  return n === void 0 && B(75, e), n;
}
function na(t) {
  const e = t.assignedSlot || t.parentElement;
  return e !== null && e.nodeType === 11 ? e.host : e;
}
function fl(t, e) {
  let n = t.getParent();
  for (; n !== null; ) {
    if (n.is(e)) return !0;
    n = n.getParent();
  }
  return !1;
}
function ra(t) {
  const e = t._window;
  return e === null && B(78), e;
}
function tx(t) {
  let e = t.getParentOrThrow();
  for (; e !== null; ) {
    if (_t(e)) return e;
    e = e.getParentOrThrow();
  }
  return e;
}
function _t(t) {
  return Je(t) || b(t) && t.isShadowRoot();
}
function We(t) {
  const e = Ee(), n = t.constructor.getType(), r = e._nodes.get(n);
  r === void 0 && B(97);
  const o = r.replace;
  if (o !== null) {
    const i = o(t);
    return i instanceof t.constructor || B(98), i;
  }
  return t;
}
function Ha(t, e) {
  !Je(t.getParent()) || b(e) || se(e) || B(99);
}
function Ka(t) {
  return (se(t) || b(t) && !t.canBeEmpty()) && !t.isInline();
}
function Vd(t, e, n) {
  n.style.removeProperty("caret-color"), e._blockCursorElement = null;
  const r = t.parentElement;
  r !== null && r.removeChild(t);
}
function nx(t, e, n) {
  let r = t._blockCursorElement;
  if (A(n) && n.isCollapsed() && n.anchor.type === "element" && e.contains(document.activeElement)) {
    const o = n.anchor, i = o.getNode(), s = o.offset;
    let l = !1, a = null;
    if (s === i.getChildrenSize())
      Ka(i.getChildAtIndex(s - 1)) && (l = !0);
    else {
      const u = i.getChildAtIndex(s);
      if (Ka(u)) {
        const c = u.getPreviousSibling();
        (c === null || Ka(c)) && (l = !0, a = t.getElementByKey(u.__key));
      }
    }
    if (l) {
      const u = t.getElementByKey(i.__key);
      return r === null && (t._blockCursorElement = r = function(c) {
        const p = c.theme, f = document.createElement("div");
        f.contentEditable = "false", f.setAttribute("data-lexical-cursor", "true");
        let m = p.blockCursor;
        if (m !== void 0) {
          if (typeof m == "string") {
            const h = al(m);
            m = p.blockCursor = h;
          }
          m !== void 0 && f.classList.add(...m);
        }
        return f;
      }(t._config)), e.style.caretColor = "transparent", void (a === null ? u.appendChild(r) : u.insertBefore(r, a));
    }
  }
  r !== null && Vd(r, t, e);
}
function qt(t) {
  return Ut ? (t || window).getSelection() : null;
}
function rx(t) {
  return on(t) && t.tagName === "A";
}
function on(t) {
  return t.nodeType === 1;
}
function ox(t) {
  const e = new RegExp(/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/, "i");
  return t.nodeName.match(e) !== null;
}
function ix(t) {
  const e = new RegExp(/^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|td|tfoot|ul|video)$/, "i");
  return t.nodeName.match(e) !== null;
}
function $r(t) {
  if (Je(t) || se(t) && !t.isInline()) return !0;
  if (!b(t) || _t(t)) return !1;
  const e = t.getFirstChild(), n = e === null || Hn(e) || I(e) || e.isInline();
  return !t.isInline() && t.canBeEmpty() !== !1 && n;
}
function Qa(t, e) {
  let n = t;
  for (; n !== null && n.getParent() !== null && !e(n); ) n = n.getParentOrThrow();
  return e(n) ? n : null;
}
function Sy(t, e, n, r, o, i) {
  let s = t.getFirstChild();
  for (; s !== null; ) {
    const l = s.__key;
    s.__parent === e && (b(s) && Sy(s, l, n, r, o, i), n.has(l) || i.delete(l), o.push(l)), s = s.getNextSibling();
  }
}
let Gn, tt, bi, oa, rc, oc, Sr, zt, ic, Oi, Ae = "", qe = "", Pt = null, cn = "", ky = !1, Hd = !1, Os = null;
function pl(t, e) {
  const n = Sr.get(t);
  if (e !== null) {
    const r = ac(t);
    r.parentNode === e && e.removeChild(r);
  }
  if (zt.has(t) || tt._keyToDOMMap.delete(t), b(n)) {
    const r = hl(n, Sr);
    sc(r, 0, r.length - 1, null);
  }
  n !== void 0 && Ud(Oi, bi, oa, n, "destroyed");
}
function sc(t, e, n, r) {
  let o = e;
  for (; o <= n; ++o) {
    const i = t[o];
    i !== void 0 && pl(i, r);
  }
}
function or(t, e) {
  t.setProperty("text-align", e);
}
const sx = "40px";
function Cy(t, e) {
  const n = Gn.theme.indent;
  if (typeof n == "string") {
    const o = t.classList.contains(n);
    e > 0 && !o ? t.classList.add(n) : e < 1 && o && t.classList.remove(n);
  }
  const r = getComputedStyle(t).getPropertyValue("--lexical-indent-base-value") || sx;
  t.style.setProperty("padding-inline-start", e === 0 ? "" : `calc(${e} * ${r})`);
}
function Ey(t, e) {
  const n = t.style;
  e === 0 ? or(n, "") : e === Ad ? or(n, "left") : e === Fd ? or(n, "center") : e === Pd ? or(n, "right") : e === $d ? or(n, "justify") : e === Ld ? or(n, "start") : e === Id && or(n, "end");
}
function gl(t, e, n) {
  const r = zt.get(t);
  r === void 0 && B(60);
  const o = r.createDOM(Gn, tt);
  if (function(i, s, l) {
    const a = l._keyToDOMMap;
    s["__lexicalKey_" + l._key] = i, a.set(i, s);
  }(t, o, tt), I(r) ? o.setAttribute("data-lexical-text", "true") : se(r) && o.setAttribute("data-lexical-decorator", "true"), b(r)) {
    const i = r.__indent, s = r.__size;
    if (i !== 0 && Cy(o, i), s !== 0) {
      const a = s - 1;
      (function(u, c, p, f) {
        const m = qe;
        qe = "", lc(u, p, 0, c, f, null), Ny(p, f), qe = m;
      })(hl(r, zt), a, r, o);
    }
    const l = r.__format;
    l !== 0 && Ey(o, l), r.isInline() || Ty(null, r, o), ta(r) && (Ae += wn, cn += wn);
  } else {
    const i = r.getTextContent();
    if (se(r)) {
      const s = r.decorate(tt, Gn);
      s !== null && by(t, s), o.contentEditable = "false";
    } else I(r) && (r.isDirectionless() || (qe += i));
    Ae += i, cn += i;
  }
  if (e !== null) if (n != null) e.insertBefore(o, n);
  else {
    const i = e.__lexicalLineBreak;
    i != null ? e.insertBefore(o, i) : e.appendChild(o);
  }
  return Ud(Oi, bi, oa, r, "created"), o;
}
function lc(t, e, n, r, o, i) {
  const s = Ae;
  Ae = "";
  let l = n;
  for (; l <= r; ++l) {
    gl(t[l], o, i);
    const a = zt.get(t[l]);
    a !== null && Pt === null && I(a) && (Pt = a.getFormat());
  }
  ta(e) && (Ae += wn), o.__lexicalTextContent = Ae, Ae = s + Ae;
}
function Ap(t, e) {
  const n = e.get(t);
  return Hn(n) || se(n) && n.isInline();
}
function Ty(t, e, n) {
  const r = t !== null && (t.__size === 0 || Ap(t.__last, Sr)), o = e.__size === 0 || Ap(e.__last, zt);
  if (r) {
    if (!o) {
      const i = n.__lexicalLineBreak;
      i != null && n.removeChild(i), n.__lexicalLineBreak = null;
    }
  } else if (o) {
    const i = document.createElement("br");
    n.__lexicalLineBreak = i, n.appendChild(i);
  }
}
function Ny(t, e) {
  const n = e.__lexicalDirTextContent, r = e.__lexicalDir;
  if (n !== qe || r !== Os) {
    const i = qe === "", s = i ? Os : (o = qe, j1.test(o) ? "rtl" : B1.test(o) ? "ltr" : null);
    if (s !== r) {
      const l = e.classList, a = Gn.theme;
      let u = r !== null ? a[r] : void 0, c = s !== null ? a[s] : void 0;
      if (u !== void 0) {
        if (typeof u == "string") {
          const p = al(u);
          u = a[r] = p;
        }
        l.remove(...u);
      }
      if (s === null || i && s === "ltr") e.removeAttribute("dir");
      else {
        if (c !== void 0) {
          if (typeof c == "string") {
            const p = al(c);
            c = a[s] = p;
          }
          c !== void 0 && l.add(...c);
        }
        e.dir = s;
      }
      Hd || (t.getWritable().__dir = s);
    }
    Os = s, e.__lexicalDirTextContent = qe, e.__lexicalDir = s;
  }
  var o;
}
function lx(t, e, n) {
  const r = qe;
  var o;
  qe = "", Pt = null, function(i, s, l) {
    const a = Ae, u = i.__size, c = s.__size;
    if (Ae = "", u === 1 && c === 1) {
      const p = i.__first, f = s.__first;
      if (p === f) Qo(p, l);
      else {
        const h = ac(p), y = gl(f, null, null);
        l.replaceChild(y, h), pl(p, null);
      }
      const m = zt.get(f);
      Pt === null && I(m) && (Pt = m.getFormat());
    } else {
      const p = hl(i, Sr), f = hl(s, zt);
      if (u === 0) c !== 0 && lc(f, s, 0, c - 1, l, null);
      else if (c === 0) {
        if (u !== 0) {
          const m = l.__lexicalLineBreak == null;
          sc(p, 0, u - 1, m ? null : l), m && (l.textContent = "");
        }
      } else (function(m, h, y, _, v, d) {
        const g = _ - 1, x = v - 1;
        let w, S, k = (N = d, N.firstChild), C = 0, E = 0;
        for (var N; C <= g && E <= x; ) {
          const H = h[C], j = y[E];
          if (H === j) k = Ga(Qo(j, d)), C++, E++;
          else {
            w === void 0 && (w = new Set(h)), S === void 0 && (S = new Set(y));
            const G = S.has(H), te = w.has(j);
            if (G) if (te) {
              const L = dl(tt, j);
              L === k ? k = Ga(Qo(j, d)) : (k != null ? d.insertBefore(L, k) : d.appendChild(L), Qo(j, d)), C++, E++;
            } else gl(j, d, k), E++;
            else k = Ga(ac(H)), pl(H, d), C++;
          }
          const J = zt.get(j);
          J !== null && Pt === null && I(J) && (Pt = J.getFormat());
        }
        const D = C > g, z = E > x;
        if (D && !z) {
          const H = y[x + 1];
          lc(y, m, E, x, d, H === void 0 ? null : tt.getElementByKey(H));
        } else z && !D && sc(h, C, g, d);
      })(s, p, f, u, c, l);
    }
    ta(s) && (Ae += wn), l.__lexicalTextContent = Ae, Ae = a + Ae;
  }(t, e, n), Ny(e, n), Bt(o = e) && Pt != null && Pt !== o.__textFormat && o.setTextFormat(Pt), qe = r, Pt = null;
}
function hl(t, e) {
  const n = [];
  let r = t.__first;
  for (; r !== null; ) {
    const o = e.get(r);
    o === void 0 && B(101), n.push(r), r = o.__next;
  }
  return n;
}
function Qo(t, e) {
  const n = Sr.get(t);
  let r = zt.get(t);
  n !== void 0 && r !== void 0 || B(61);
  const o = ky || oc.has(t) || rc.has(t), i = dl(tt, t);
  if (n === r && !o) {
    if (b(n)) {
      const s = i.__lexicalTextContent;
      s !== void 0 && (Ae += s, cn += s);
      const l = i.__lexicalDirTextContent;
      l !== void 0 && (qe += l);
    } else {
      const s = n.getTextContent();
      I(n) && !n.isDirectionless() && (qe += s), cn += s, Ae += s;
    }
    return i;
  }
  if (n !== r && o && Ud(Oi, bi, oa, r, "updated"), r.updateDOM(n, i, Gn)) {
    const s = gl(t, null, null);
    return e === null && B(62), e.replaceChild(s, i), pl(t, null), s;
  }
  if (b(n) && b(r)) {
    const s = r.__indent;
    s !== n.__indent && Cy(i, s);
    const l = r.__format;
    l !== n.__format && Ey(i, l), o && (lx(n, r, i), Je(r) || r.isInline() || Ty(n, r, i)), ta(r) && (Ae += wn, cn += wn);
  } else {
    const s = r.getTextContent();
    if (se(r)) {
      const l = r.decorate(tt, Gn);
      l !== null && by(t, l);
    } else I(r) && !r.isDirectionless() && (qe += s);
    Ae += s, cn += s;
  }
  if (!Hd && Je(r) && r.__cachedText !== cn) {
    const s = r.getWritable();
    s.__cachedText = cn, r = s;
  }
  return i;
}
function by(t, e) {
  let n = tt._pendingDecorators;
  const r = tt._decorators;
  if (n === null) {
    if (r[t] === e) return;
    n = hy(tt);
  }
  n[t] = e;
}
function Ga(t) {
  let e = t.nextSibling;
  return e !== null && e === tt._blockCursorElement && (e = e.nextSibling), e;
}
function ax(t, e, n, r, o, i) {
  Ae = "", cn = "", qe = "", ky = r === po, Os = null, tt = n, Gn = n._config, bi = n._nodes, oa = tt._listeners.mutation, rc = o, oc = i, Sr = t._nodeMap, zt = e._nodeMap, Hd = e._readOnly, ic = new Map(n._keyToDOMMap);
  const s = /* @__PURE__ */ new Map();
  return Oi = s, Qo("root", null), tt = void 0, bi = void 0, rc = void 0, oc = void 0, Sr = void 0, zt = void 0, Gn = void 0, ic = void 0, Oi = void 0, s;
}
function ac(t) {
  const e = ic.get(t);
  return e === void 0 && B(75, t), e;
}
const ln = Object.freeze({}), uc = 30, cc = [["keydown", function(t, e) {
  if (li = t.timeStamp, Oy = t.key, e.isComposing()) return;
  const { key: n, shiftKey: r, ctrlKey: o, metaKey: i, altKey: s } = t;
  W(e, kd, t) || n != null && (function(l, a, u, c) {
    return Tp(l) && !a && !c && !u;
  }(n, o, s, i) ? W(e, Hl, t) : function(l, a, u, c, p) {
    return Tp(l) && !c && !u && (a || p);
  }(n, o, r, s, i) ? W(e, S1, t) : function(l, a, u, c) {
    return Ep(l) && !a && !c && !u;
  }(n, o, s, i) ? W(e, Kl, t) : function(l, a, u, c, p) {
    return Ep(l) && !c && !u && (a || p);
  }(n, o, r, s, i) ? W(e, k1, t) : /* @__PURE__ */ function(l, a, u) {
    return /* @__PURE__ */ function(c) {
      return c === "ArrowUp";
    }(l) && !a && !u;
  }(n, o, i) ? W(e, Ql, t) : /* @__PURE__ */ function(l, a, u) {
    return /* @__PURE__ */ function(c) {
      return c === "ArrowDown";
    }(l) && !a && !u;
  }(n, o, i) ? W(e, Gl, t) : function(l, a) {
    return Np(l) && a;
  }(n, r) ? (ai = !0, W(e, xr, t)) : /* @__PURE__ */ function(l) {
    return l === " ";
  }(n) ? W(e, ry, t) : function(l, a) {
    return Ft && a && l.toLowerCase() === "o";
  }(n, o) ? (t.preventDefault(), ai = !0, W(e, Wn, !0)) : function(l, a) {
    return Np(l) && !a;
  }(n, r) ? (ai = !1, W(e, xr, t)) : function(l, a, u, c) {
    return Ft ? !a && !u && (Ro(l) || l.toLowerCase() === "h" && c) : !(c || a || u) && Ro(l);
  }(n, s, i, o) ? Ro(n) ? W(e, _o, t) : (t.preventDefault(), W(e, Zt, !0)) : /* @__PURE__ */ function(l) {
    return l === "Escape";
  }(n) ? W(e, Jl, t) : function(l, a, u, c, p) {
    return Ft ? !(u || c || p) && (Do(l) || l.toLowerCase() === "d" && a) : !(a || c || p) && Do(l);
  }(n, o, r, s, i) ? Do(n) ? W(e, Yl, t) : (t.preventDefault(), W(e, Zt, !1)) : function(l, a, u) {
    return Ro(l) && (Ft ? a : u);
  }(n, s, o) ? (t.preventDefault(), W(e, co, !0)) : function(l, a, u) {
    return Do(l) && (Ft ? a : u);
  }(n, s, o) ? (t.preventDefault(), W(e, co, !1)) : function(l, a) {
    return Ft && a && Ro(l);
  }(n, i) ? (t.preventDefault(), W(e, fo, !0)) : function(l, a) {
    return Ft && a && Do(l);
  }(n, i) ? (t.preventDefault(), W(e, fo, !1)) : function(l, a, u, c) {
    return l.toLowerCase() === "b" && !a && Ko(u, c);
  }(n, s, i, o) ? (t.preventDefault(), W(e, gt, "bold")) : function(l, a, u, c) {
    return l.toLowerCase() === "u" && !a && Ko(u, c);
  }(n, s, i, o) ? (t.preventDefault(), W(e, gt, "underline")) : function(l, a, u, c) {
    return l.toLowerCase() === "i" && !a && Ko(u, c);
  }(n, s, i, o) ? (t.preventDefault(), W(e, gt, "italic")) : /* @__PURE__ */ function(l, a, u, c) {
    return l === "Tab" && !a && !u && !c;
  }(n, s, o, i) ? W(e, Cd, t) : function(l, a, u, c) {
    return l.toLowerCase() === "z" && !a && Ko(u, c);
  }(n, r, i, o) ? (t.preventDefault(), W(e, Wl, void 0)) : function(l, a, u, c) {
    return Ft ? l.toLowerCase() === "z" && u && a : l.toLowerCase() === "y" && c || l.toLowerCase() === "z" && c && a;
  }(n, r, i, o) ? (t.preventDefault(), W(e, Vl, void 0)) : $e(e._editorState._selection) ? function(l, a, u, c) {
    return !a && l.toLowerCase() === "c" && (Ft ? u : c);
  }(n, r, i, o) ? (t.preventDefault(), W(e, zi, t)) : function(l, a, u, c) {
    return !a && l.toLowerCase() === "x" && (Ft ? u : c);
  }(n, r, i, o) ? (t.preventDefault(), W(e, Zl, t)) : bp(n, i, o) && (t.preventDefault(), W(e, ol, t)) : !Vn && bp(n, i, o) && (t.preventDefault(), W(e, ol, t)), /* @__PURE__ */ function(l, a, u, c) {
    return l || a || u || c;
  }(o, r, s, i) && W(e, A1, t));
}], ["pointerdown", function(t, e) {
  const n = t.target, r = t.pointerType;
  n instanceof Node && r !== "touch" && ht(e, () => {
    se(Sn(n)) || (fc = !0);
  });
}], ["compositionstart", function(t, e) {
  ht(e, () => {
    const n = $();
    if (A(n) && !e.isComposing()) {
      const r = n.anchor, o = n.anchor.getNode();
      ze(r.key), (t.timeStamp < li + uc || r.type === "element" || !n.isCollapsed() || o.getFormat() !== n.format || I(o) && o.getStyle() !== n.style) && W(e, fr, z1);
    }
  });
}], ["compositionend", function(t, e) {
  Vn ? Mo = !0 : ht(e, () => {
    Ja(e, t.data);
  });
}], ["input", function(t, e) {
  t.stopPropagation(), ht(e, () => {
    const n = $(), r = t.data, o = $y(t);
    if (r != null && A(n) && Py(n, o, r, t.timeStamp, !1)) {
      Mo && (Ja(e, r), Mo = !1);
      const i = n.anchor.getNode(), s = qt(e._window);
      if (s === null) return;
      const l = n.isBackward(), a = l ? n.anchor.offset : n.focus.offset, u = l ? n.focus.offset : n.anchor.offset;
      il && !n.isCollapsed() && I(i) && s.anchorNode !== null && i.getTextContent().slice(0, a) + r + i.getTextContent().slice(a + u) === _y(s.anchorNode) || W(e, fr, r);
      const c = r.length;
      Vn && c > 1 && t.inputType === "insertCompositionText" && !e.isComposing() && (n.anchor.offset -= c), bd || ql || Od || !e.isComposing() || (li = 0, ze(null));
    } else
      jd(!1, e, r !== null ? r : void 0), Mo && (Ja(e, r || void 0), Mo = !1);
    st(), cy(Ee());
  }), Lr = null;
}], ["click", function(t, e) {
  ht(e, () => {
    const n = $(), r = qt(e._window), o = wo();
    if (r) {
      if (A(n)) {
        const i = n.anchor, s = i.getNode();
        i.type === "element" && i.offset === 0 && n.isCollapsed() && !Je(s) && ye().getChildrenSize() === 1 && s.getTopLevelElementOrThrow().isEmpty() && o !== null && n.is(o) ? (r.removeAllRanges(), n.dirty = !0) : t.detail === 3 && !n.isCollapsed() && s !== n.focus.getNode() && (b(s) ? s.select(0) : s.getParentOrThrow().select(0));
      } else if (t.pointerType === "touch") {
        const i = r.anchorNode;
        if (i !== null) {
          const s = i.nodeType;
          (s === ji || s === Xn) && De(Gd(o, r, e, t));
        }
      }
    }
    W(e, Ul, t);
  });
}], ["cut", ln], ["copy", ln], ["dragstart", ln], ["dragover", ln], ["dragend", ln], ["paste", ln], ["focus", ln], ["blur", ln], ["drop", ln]];
il && cc.push(["beforeinput", (t, e) => function(n, r) {
  const o = n.inputType, i = $y(n);
  o === "deleteCompositionText" || Vn && wy(r) || o !== "insertCompositionText" && ht(r, () => {
    const s = $();
    if (o === "deleteContentBackward") {
      if (s === null) {
        const m = wo();
        if (!A(m)) return;
        De(m.clone());
      }
      if (A(s)) {
        const m = s.anchor.key === s.focus.key;
        if (l = n.timeStamp, Oy === "MediaLast" && l < li + uc && r.isComposing() && m) {
          if (ze(null), li = 0, setTimeout(() => {
            ht(r, () => {
              ze(null);
            });
          }, uc), A(s)) {
            const h = s.anchor.getNode();
            h.markDirty(), s.format = h.getFormat(), I(h) || B(142), s.style = h.getStyle();
          }
        } else {
          ze(null), n.preventDefault();
          const h = s.anchor.getNode().getTextContent(), y = s.anchor.offset === 0 && s.focus.offset === h.length;
          L1 && m && !y || W(r, Zt, !0);
        }
        return;
      }
    }
    var l;
    if (!A(s)) return;
    const a = n.data;
    Lr !== null && jd(!1, r, Lr), s.dirty && Lr === null || !s.isCollapsed() || Je(s.anchor.getNode()) || i === null || s.applyDOMRange(i), Lr = null;
    const u = s.anchor, c = s.focus, p = u.getNode(), f = c.getNode();
    if (o !== "insertText" && o !== "insertTranspose") switch (n.preventDefault(), o) {
      case "insertFromYank":
      case "insertFromDrop":
      case "insertReplacementText":
        W(r, fr, n);
        break;
      case "insertFromComposition":
        ze(null), W(r, fr, n);
        break;
      case "insertLineBreak":
        ze(null), W(r, Wn, !1);
        break;
      case "insertParagraph":
        ze(null), ai && !ql ? (ai = !1, W(r, Wn, !1)) : W(r, uo, void 0);
        break;
      case "insertFromPaste":
      case "insertFromPasteAsQuotation":
        W(r, vo, n);
        break;
      case "deleteByComposition":
        (function(m, h) {
          return m !== h || b(m) || b(h) || !m.isToken() || !h.isToken();
        })(p, f) && W(r, rl, n);
        break;
      case "deleteByDrag":
      case "deleteByCut":
        W(r, rl, n);
        break;
      case "deleteContent":
        W(r, Zt, !1);
        break;
      case "deleteWordBackward":
        W(r, co, !0);
        break;
      case "deleteWordForward":
        W(r, co, !1);
        break;
      case "deleteHardLineBackward":
      case "deleteSoftLineBackward":
        W(r, fo, !0);
        break;
      case "deleteContentForward":
      case "deleteHardLineForward":
      case "deleteSoftLineForward":
        W(r, fo, !1);
        break;
      case "formatStrikeThrough":
        W(r, gt, "strikethrough");
        break;
      case "formatBold":
        W(r, gt, "bold");
        break;
      case "formatItalic":
        W(r, gt, "italic");
        break;
      case "formatUnderline":
        W(r, gt, "underline");
        break;
      case "historyUndo":
        W(r, Wl, void 0);
        break;
      case "historyRedo":
        W(r, Vl, void 0);
    }
    else {
      if (a === `
`) n.preventDefault(), W(r, Wn, !1);
      else if (a === wn) n.preventDefault(), W(r, uo, void 0);
      else if (a == null && n.dataTransfer) {
        const m = n.dataTransfer.getData("text/plain");
        n.preventDefault(), s.insertRawText(m);
      } else a != null && Py(s, i, a, n.timeStamp, !0) ? (n.preventDefault(), W(r, fr, a)) : Lr = a;
      Ay = n.timeStamp;
    }
  });
}(t, e)]);
let li = 0, Oy = null, Ay = 0, Lr = null;
const ml = /* @__PURE__ */ new WeakMap();
let dc = !1, fc = !1, ai = !1, Mo = !1, Fy = [0, "", 0, "root", 0];
function Py(t, e, n, r, o) {
  const i = t.anchor, s = t.focus, l = i.getNode(), a = Ee(), u = qt(a._window), c = u !== null ? u.anchorNode : null, p = i.key, f = a.getElementByKey(p), m = n.length;
  return p !== s.key || !I(l) || (!o && (!il || Ay < r + 50) || l.isDirty() && m < 2 || yy(n)) && i.offset !== s.offset && !l.isComposing() || Pr(l) || l.isDirty() && m > 1 || (o || !il) && f !== null && !l.isComposing() && c !== ul(f) || u !== null && e !== null && (!e.collapsed || e.startContainer !== u.anchorNode || e.startOffset !== u.anchorOffset) || l.getFormat() !== t.format || l.getStyle() !== t.style || ex(t, l);
}
function Fp(t, e) {
  return t !== null && t.nodeValue !== null && t.nodeType === Xn && e !== 0 && e !== t.nodeValue.length;
}
function Pp(t, e, n) {
  const { anchorNode: r, anchorOffset: o, focusNode: i, focusOffset: s } = t;
  dc && (dc = !1, Fp(r, o) && Fp(i, s)) || ht(e, () => {
    if (!n) return void De(null);
    if (!Bi(e, r, i)) return;
    const l = $();
    if (A(l)) {
      const a = l.anchor, u = a.getNode();
      if (l.isCollapsed()) {
        t.type === "Range" && t.anchorNode === t.focusNode && (l.dirty = !0);
        const c = ra(e).event, p = c ? c.timeStamp : performance.now(), [f, m, h, y, _] = Fy, v = ye(), d = e.isComposing() === !1 && v.getTextContent() === "";
        if (p < _ + 200 && a.offset === h && a.key === y) l.format = f, l.style = m;
        else if (a.type === "text") I(u) || B(141), l.format = u.getFormat(), l.style = u.getStyle();
        else if (a.type === "element" && !d) {
          const g = a.getNode();
          g instanceof So && g.getChildrenSize() === 0 ? l.format = g.getTextFormat() : l.format = 0, l.style = "";
        }
      } else {
        const c = a.key, p = l.focus.key, f = l.getNodes(), m = f.length, h = l.isBackward(), y = h ? s : o, _ = h ? o : s, v = h ? p : c, d = h ? c : p;
        let g = M1, x = !1;
        for (let w = 0; w < m; w++) {
          const S = f[w], k = S.getTextContentSize();
          if (I(S) && k !== 0 && !(w === 0 && S.__key === v && y === k || w === m - 1 && S.__key === d && _ === 0) && (x = !0, g &= S.getFormat(), g === 0)) break;
        }
        l.format = x ? g : 0;
      }
    }
    W(e, Tr, void 0);
  });
}
function $y(t) {
  if (!t.getTargetRanges) return null;
  const e = t.getTargetRanges();
  return e.length === 0 ? null : e[0];
}
function Ja(t, e) {
  const n = t._compositionKey;
  if (ze(null), n !== null && e != null) {
    if (e === "") {
      const r = Ce(n), o = ul(t.getElementByKey(n));
      return void (o !== null && o.nodeValue !== null && I(r) && Bd(r, o.nodeValue, null, null, !0));
    }
    if (e[e.length - 1] === `
`) {
      const r = $();
      if (A(r)) {
        const o = r.focus;
        return r.anchor.set(o.key, o.offset, o.type), void W(t, xr, null);
      }
    }
  }
  jd(!0, t, e);
}
function Ly(t) {
  let e = t.__lexicalEventHandles;
  return e === void 0 && (e = [], t.__lexicalEventHandles = e), e;
}
const to = /* @__PURE__ */ new Map();
function Iy(t) {
  const e = t.target, n = qt(e == null ? null : e.nodeType === 9 ? e.defaultView : e.ownerDocument.defaultView);
  if (n === null) return;
  const r = py(n.anchorNode);
  if (r === null) return;
  fc && (fc = !1, ht(r, () => {
    const u = wo(), c = n.anchorNode;
    if (c === null) return;
    const p = c.nodeType;
    p !== ji && p !== Xn || De(Gd(u, n, r, t));
  }));
  const o = zd(r), i = o[o.length - 1], s = i._key, l = to.get(s), a = l || i;
  a !== r && Pp(n, a, !1), Pp(n, r, !0), r !== i ? to.set(s, r) : l && to.delete(s);
}
function $p(t) {
  t._lexicalHandled = !0;
}
function Lp(t) {
  return t._lexicalHandled === !0;
}
function ux(t) {
  const e = t.ownerDocument, n = ml.get(e);
  n === void 0 && B(162);
  const r = n - 1;
  r >= 0 || B(164), ml.set(e, r), r === 0 && e.removeEventListener("selectionchange", Iy);
  const o = t.__lexicalEditor;
  o != null && (function(s) {
    if (s._parentEditor !== null) {
      const l = zd(s), a = l[l.length - 1]._key;
      to.get(a) === s && to.delete(a);
    } else to.delete(s._key);
  }(o), t.__lexicalEditor = null);
  const i = Ly(t);
  for (let s = 0; s < i.length; s++) i[s]();
  t.__lexicalEventHandles = [];
}
function pc(t, e, n) {
  st();
  const r = t.__key, o = t.getParent();
  if (o === null) return;
  const i = function(l) {
    const a = $();
    if (!A(a) || !b(l)) return a;
    const { anchor: u, focus: c } = a, p = u.getNode(), f = c.getNode();
    return fl(p, l) && u.set(l.__key, 0, "element"), fl(f, l) && c.set(l.__key, 0, "element"), a;
  }(t);
  let s = !1;
  if (A(i) && e) {
    const l = i.anchor, a = i.focus;
    l.key === r && (vl(l, t, o, t.getPreviousSibling(), t.getNextSibling()), s = !0), a.key === r && (vl(a, t, o, t.getPreviousSibling(), t.getNextSibling()), s = !0);
  } else $e(i) && e && t.isSelected() && t.selectPrevious();
  if (A(i) && e && !s) {
    const l = t.getIndexWithinParent();
    pr(t), yl(i, o, l, -1);
  } else pr(t);
  n || _t(o) || o.canBeEmpty() || !o.isEmpty() || pc(o, e), e && Je(o) && o.isEmpty() && o.selectEnd();
}
class ia {
  static getType() {
    B(64, this.name);
  }
  static clone(e) {
    B(65, this.name);
  }
  constructor(e) {
    this.__type = this.constructor.getType(), this.__parent = null, this.__prev = null, this.__next = null, q1(this, e);
  }
  getType() {
    return this.__type;
  }
  isInline() {
    B(137, this.constructor.name);
  }
  isAttached() {
    let e = this.__key;
    for (; e !== null; ) {
      if (e === "root") return !0;
      const n = Ce(e);
      if (n === null) break;
      e = n.__parent;
    }
    return !1;
  }
  isSelected(e) {
    const n = e || $();
    if (n == null) return !1;
    const r = n.getNodes().some((o) => o.__key === this.__key);
    return (I(this) || !A(n) || n.anchor.type !== "element" || n.focus.type !== "element" || n.anchor.key !== n.focus.key || n.anchor.offset !== n.focus.offset) && r;
  }
  getKey() {
    return this.__key;
  }
  getIndexWithinParent() {
    const e = this.getParent();
    if (e === null) return -1;
    let n = e.getFirstChild(), r = 0;
    for (; n !== null; ) {
      if (this.is(n)) return r;
      r++, n = n.getNextSibling();
    }
    return -1;
  }
  getParent() {
    const e = this.getLatest().__parent;
    return e === null ? null : Ce(e);
  }
  getParentOrThrow() {
    const e = this.getParent();
    return e === null && B(66, this.__key), e;
  }
  getTopLevelElement() {
    let e = this;
    for (; e !== null; ) {
      const n = e.getParent();
      if (_t(n)) return b(e) || B(138), e;
      e = n;
    }
    return null;
  }
  getTopLevelElementOrThrow() {
    const e = this.getTopLevelElement();
    return e === null && B(67, this.__key), e;
  }
  getParents() {
    const e = [];
    let n = this.getParent();
    for (; n !== null; ) e.push(n), n = n.getParent();
    return e;
  }
  getParentKeys() {
    const e = [];
    let n = this.getParent();
    for (; n !== null; ) e.push(n.__key), n = n.getParent();
    return e;
  }
  getPreviousSibling() {
    const e = this.getLatest().__prev;
    return e === null ? null : Ce(e);
  }
  getPreviousSiblings() {
    const e = [], n = this.getParent();
    if (n === null) return e;
    let r = n.getFirstChild();
    for (; r !== null && !r.is(this); ) e.push(r), r = r.getNextSibling();
    return e;
  }
  getNextSibling() {
    const e = this.getLatest().__next;
    return e === null ? null : Ce(e);
  }
  getNextSiblings() {
    const e = [];
    let n = this.getNextSibling();
    for (; n !== null; ) e.push(n), n = n.getNextSibling();
    return e;
  }
  getCommonAncestor(e) {
    const n = this.getParents(), r = e.getParents();
    b(this) && n.unshift(this), b(e) && r.unshift(e);
    const o = n.length, i = r.length;
    if (o === 0 || i === 0 || n[o - 1] !== r[i - 1]) return null;
    const s = new Set(r);
    for (let l = 0; l < o; l++) {
      const a = n[l];
      if (s.has(a)) return a;
    }
    return null;
  }
  is(e) {
    return e != null && this.__key === e.__key;
  }
  isBefore(e) {
    if (this === e) return !1;
    if (e.isParentOf(this)) return !0;
    if (this.isParentOf(e)) return !1;
    const n = this.getCommonAncestor(e);
    let r = 0, o = 0, i = this;
    for (; ; ) {
      const s = i.getParentOrThrow();
      if (s === n) {
        r = i.getIndexWithinParent();
        break;
      }
      i = s;
    }
    for (i = e; ; ) {
      const s = i.getParentOrThrow();
      if (s === n) {
        o = i.getIndexWithinParent();
        break;
      }
      i = s;
    }
    return r < o;
  }
  isParentOf(e) {
    const n = this.__key;
    if (n === e.__key) return !1;
    let r = e;
    for (; r !== null; ) {
      if (r.__key === n) return !0;
      r = r.getParent();
    }
    return !1;
  }
  getNodesBetween(e) {
    const n = this.isBefore(e), r = [], o = /* @__PURE__ */ new Set();
    let i = this;
    for (; i !== null; ) {
      const s = i.__key;
      if (o.has(s) || (o.add(s), r.push(i)), i === e) break;
      const l = b(i) ? n ? i.getFirstChild() : i.getLastChild() : null;
      if (l !== null) {
        i = l;
        continue;
      }
      const a = n ? i.getNextSibling() : i.getPreviousSibling();
      if (a !== null) {
        i = a;
        continue;
      }
      const u = i.getParentOrThrow();
      if (o.has(u.__key) || r.push(u), u === e) break;
      let c = null, p = u;
      do {
        if (p === null && B(68), c = n ? p.getNextSibling() : p.getPreviousSibling(), p = p.getParent(), p === null) break;
        c !== null || o.has(p.__key) || r.push(p);
      } while (c === null);
      i = c;
    }
    return n || r.reverse(), r;
  }
  isDirty() {
    const e = Ee()._dirtyLeaves;
    return e !== null && e.has(this.__key);
  }
  getLatest() {
    const e = Ce(this.__key);
    return e === null && B(113), e;
  }
  getWritable() {
    st();
    const e = sn(), n = Ee(), r = e._nodeMap, o = this.__key, i = this.getLatest(), s = i.__parent, l = n._cloneNotNeeded, a = $();
    if (a !== null && a.setCachedNodes(null), l.has(o)) return cl(i), i;
    const u = i.constructor.clone(i);
    return u.__parent = s, u.__next = i.__next, u.__prev = i.__prev, b(i) && b(u) ? (Bt(i) && Bt(u) && (u.__textFormat = i.__textFormat), u.__first = i.__first, u.__last = i.__last, u.__size = i.__size, u.__indent = i.__indent, u.__format = i.__format, u.__dir = i.__dir) : I(i) && I(u) && (u.__format = i.__format, u.__style = i.__style, u.__mode = i.__mode, u.__detail = i.__detail), l.add(o), u.__key = o, cl(u), r.set(o, u), u;
  }
  getTextContent() {
    return "";
  }
  getTextContentSize() {
    return this.getTextContent().length;
  }
  createDOM(e, n) {
    B(70);
  }
  updateDOM(e, n, r) {
    B(71);
  }
  exportDOM(e) {
    return { element: this.createDOM(e._config, e) };
  }
  exportJSON() {
    B(72);
  }
  static importJSON(e) {
    B(18, this.name);
  }
  static transform() {
    return null;
  }
  remove(e) {
    pc(this, !0, e);
  }
  replace(e, n) {
    st();
    let r = $();
    r !== null && (r = r.clone()), Ha(this, e);
    const o = this.getLatest(), i = this.__key, s = e.__key, l = e.getWritable(), a = this.getParentOrThrow().getWritable(), u = a.__size;
    pr(l);
    const c = o.getPreviousSibling(), p = o.getNextSibling(), f = o.__prev, m = o.__next, h = o.__parent;
    if (pc(o, !1, !0), c === null ? a.__first = s : c.getWritable().__next = s, l.__prev = f, p === null ? a.__last = s : p.getWritable().__prev = s, l.__next = m, l.__parent = h, a.__size = u, n && (b(this) && b(l) || B(139), this.getChildren().forEach((y) => {
      l.append(y);
    })), A(r)) {
      De(r);
      const y = r.anchor, _ = r.focus;
      y.key === i && zp(y, l), _.key === i && zp(_, l);
    }
    return $n() === i && ze(s), l;
  }
  insertAfter(e, n = !0) {
    st(), Ha(this, e);
    const r = this.getWritable(), o = e.getWritable(), i = o.getParent(), s = $();
    let l = !1, a = !1;
    if (i !== null) {
      const m = e.getIndexWithinParent();
      if (pr(o), A(s)) {
        const h = i.__key, y = s.anchor, _ = s.focus;
        l = y.type === "element" && y.key === h && y.offset === m + 1, a = _.type === "element" && _.key === h && _.offset === m + 1;
      }
    }
    const u = this.getNextSibling(), c = this.getParentOrThrow().getWritable(), p = o.__key, f = r.__next;
    if (u === null ? c.__last = p : u.getWritable().__prev = p, c.__size++, r.__next = p, o.__next = f, o.__prev = r.__key, o.__parent = r.__parent, n && A(s)) {
      const m = this.getIndexWithinParent();
      yl(s, c, m + 1);
      const h = c.__key;
      l && s.anchor.set(h, m + 2, "element"), a && s.focus.set(h, m + 2, "element");
    }
    return e;
  }
  insertBefore(e, n = !0) {
    st(), Ha(this, e);
    const r = this.getWritable(), o = e.getWritable(), i = o.__key;
    pr(o);
    const s = this.getPreviousSibling(), l = this.getParentOrThrow().getWritable(), a = r.__prev, u = this.getIndexWithinParent();
    s === null ? l.__first = i : s.getWritable().__next = i, l.__size++, r.__prev = i, o.__prev = a, o.__next = r.__key, o.__parent = r.__parent;
    const c = $();
    return n && A(c) && yl(c, this.getParentOrThrow(), u), e;
  }
  isParentRequired() {
    return !1;
  }
  createParentElementNode() {
    return ge();
  }
  selectStart() {
    return this.selectPrevious();
  }
  selectEnd() {
    return this.selectNext(0, 0);
  }
  selectPrevious(e, n) {
    st();
    const r = this.getPreviousSibling(), o = this.getParentOrThrow();
    if (r === null) return o.select(0, 0);
    if (b(r)) return r.select();
    if (!I(r)) {
      const i = r.getIndexWithinParent() + 1;
      return o.select(i, i);
    }
    return r.select(e, n);
  }
  selectNext(e, n) {
    st();
    const r = this.getNextSibling(), o = this.getParentOrThrow();
    if (r === null) return o.select();
    if (b(r)) return r.select(0, 0);
    if (!I(r)) {
      const i = r.getIndexWithinParent();
      return o.select(i, i);
    }
    return r.select(e, n);
  }
  markDirty() {
    this.getWritable();
  }
}
class Ui extends ia {
  static getType() {
    return "linebreak";
  }
  static clone(e) {
    return new Ui(e.__key);
  }
  constructor(e) {
    super(e);
  }
  getTextContent() {
    return `
`;
  }
  createDOM() {
    return document.createElement("br");
  }
  updateDOM() {
    return !1;
  }
  static importDOM() {
    return { br: (e) => function(n) {
      const r = n.parentElement;
      if (r !== null) {
        const o = r.firstChild;
        if (o === n || o.nextSibling === n && Ip(o)) {
          const i = r.lastChild;
          if (i === n || i.previousSibling === n && Ip(i)) return !0;
        }
      }
      return !1;
    }(e) ? null : { conversion: cx, priority: 0 } };
  }
  static importJSON(e) {
    return en();
  }
  exportJSON() {
    return { type: "linebreak", version: 1 };
  }
}
function cx(t) {
  return { node: en() };
}
function en() {
  return We(new Ui());
}
function Hn(t) {
  return t instanceof Ui;
}
function Ip(t) {
  return t.nodeType === Xn && /^( |\t|\r?\n)+$/.test(t.textContent || "");
}
function Ya(t, e) {
  return 16 & e ? "code" : 128 & e ? "mark" : 32 & e ? "sub" : 64 & e ? "sup" : null;
}
function Za(t, e) {
  return 1 & e ? "strong" : 2 & e ? "em" : "span";
}
function Ry(t, e, n, r, o) {
  const i = r.classList;
  let s = si(o, "base");
  s !== void 0 && i.add(...s), s = si(o, "underlineStrikethrough");
  let l = !1;
  const a = e & ll && e & sl;
  s !== void 0 && (n & ll && n & sl ? (l = !0, a || i.add(...s)) : a && i.remove(...s));
  for (const u in mn) {
    const c = mn[u];
    if (s = si(o, u), s !== void 0) if (n & c) {
      if (l && (u === "underline" || u === "strikethrough")) {
        e & c && i.remove(...s);
        continue;
      }
      e & c && (!a || u !== "underline") && u !== "strikethrough" || i.add(...s);
    } else e & c && i.remove(...s);
  }
}
function Dy(t, e, n) {
  const r = e.firstChild, o = n.isComposing(), i = t + (o ? ea : "");
  if (r == null) e.textContent = i;
  else {
    const s = r.nodeValue;
    if (s !== i) if (o || Vn) {
      const [l, a, u] = function(c, p) {
        const f = c.length, m = p.length;
        let h = 0, y = 0;
        for (; h < f && h < m && c[h] === p[h]; ) h++;
        for (; y + h < f && y + h < m && c[f - y - 1] === p[m - y - 1]; ) y++;
        return [h, f - h - y, p.slice(h, m - y)];
      }(s, i);
      a !== 0 && r.deleteData(l, a), r.insertData(l, u);
    } else r.nodeValue = i;
  }
}
function Rp(t, e, n, r, o, i) {
  Dy(o, t, e);
  const s = i.theme.text;
  s !== void 0 && Ry(0, 0, r, t, s);
}
function ds(t, e) {
  const n = document.createElement(e);
  return n.appendChild(t), n;
}
class qn extends ia {
  static getType() {
    return "text";
  }
  static clone(e) {
    return new qn(e.__text, e.__key);
  }
  constructor(e, n) {
    super(n), this.__text = e, this.__format = 0, this.__style = "", this.__mode = 0, this.__detail = 0;
  }
  getFormat() {
    return this.getLatest().__format;
  }
  getDetail() {
    return this.getLatest().__detail;
  }
  getMode() {
    const e = this.getLatest();
    return H1[e.__mode];
  }
  getStyle() {
    return this.getLatest().__style;
  }
  isToken() {
    return this.getLatest().__mode === 1;
  }
  isComposing() {
    return this.__key === $n();
  }
  isSegmented() {
    return this.getLatest().__mode === 2;
  }
  isDirectionless() {
    return !!(1 & this.getLatest().__detail);
  }
  isUnmergeable() {
    return !!(2 & this.getLatest().__detail);
  }
  hasFormat(e) {
    const n = mn[e];
    return !!(this.getFormat() & n);
  }
  isSimpleText() {
    return this.__type === "text" && this.__mode === 0;
  }
  getTextContent() {
    return this.getLatest().__text;
  }
  getFormatFlags(e, n) {
    return nc(this.getLatest().__format, e, n);
  }
  canHaveFormat() {
    return !0;
  }
  createDOM(e, n) {
    const r = this.__format, o = Ya(0, r), i = Za(0, r), s = o === null ? i : o, l = document.createElement(s);
    let a = l;
    this.hasFormat("code") && l.setAttribute("spellcheck", "false"), o !== null && (a = document.createElement(i), l.appendChild(a)), Rp(a, this, 0, r, this.__text, e);
    const u = this.__style;
    return u !== "" && (l.style.cssText = u), l;
  }
  updateDOM(e, n, r) {
    const o = this.__text, i = e.__format, s = this.__format, l = Ya(0, i), a = Ya(0, s), u = Za(0, i), c = Za(0, s);
    if ((l === null ? u : l) !== (a === null ? c : a)) return !0;
    if (l === a && u !== c) {
      const y = n.firstChild;
      y == null && B(48);
      const _ = document.createElement(c);
      return Rp(_, this, 0, s, o, r), n.replaceChild(_, y), !1;
    }
    let p = n;
    a !== null && l !== null && (p = n.firstChild, p == null && B(49)), Dy(o, p, this);
    const f = r.theme.text;
    f !== void 0 && i !== s && Ry(0, i, s, p, f);
    const m = e.__style, h = this.__style;
    return m !== h && (n.style.cssText = h), !1;
  }
  static importDOM() {
    return { "#text": () => ({ conversion: gx, priority: 0 }), b: () => ({ conversion: fx, priority: 0 }), code: () => ({ conversion: En, priority: 0 }), em: () => ({ conversion: En, priority: 0 }), i: () => ({ conversion: En, priority: 0 }), s: () => ({ conversion: En, priority: 0 }), span: () => ({ conversion: dx, priority: 0 }), strong: () => ({ conversion: En, priority: 0 }), sub: () => ({ conversion: En, priority: 0 }), sup: () => ({ conversion: En, priority: 0 }), u: () => ({ conversion: En, priority: 0 }) };
  }
  static importJSON(e) {
    const n = oe(e.text);
    return n.setFormat(e.format), n.setDetail(e.detail), n.setMode(e.mode), n.setStyle(e.style), n;
  }
  exportDOM(e) {
    let { element: n } = super.exportDOM(e);
    return n !== null && on(n) || B(132), n.style.whiteSpace = "pre-wrap", this.hasFormat("bold") && (n = ds(n, "b")), this.hasFormat("italic") && (n = ds(n, "i")), this.hasFormat("strikethrough") && (n = ds(n, "s")), this.hasFormat("underline") && (n = ds(n, "u")), { element: n };
  }
  exportJSON() {
    return { detail: this.getDetail(), format: this.getFormat(), mode: this.getMode(), style: this.getStyle(), text: this.getTextContent(), type: "text", version: 1 };
  }
  selectionTransform(e, n) {
  }
  setFormat(e) {
    const n = this.getWritable();
    return n.__format = typeof e == "string" ? mn[e] : e, n;
  }
  setDetail(e) {
    const n = this.getWritable();
    return n.__detail = typeof e == "string" ? U1[e] : e, n;
  }
  setStyle(e) {
    const n = this.getWritable();
    return n.__style = e, n;
  }
  toggleFormat(e) {
    const n = nc(this.getFormat(), e, null);
    return this.setFormat(n);
  }
  toggleDirectionless() {
    const e = this.getWritable();
    return e.__detail ^= 1, e;
  }
  toggleUnmergeable() {
    const e = this.getWritable();
    return e.__detail ^= 2, e;
  }
  setMode(e) {
    const n = V1[e];
    if (this.__mode === n) return this;
    const r = this.getWritable();
    return r.__mode = n, r;
  }
  setTextContent(e) {
    if (this.__text === e) return this;
    const n = this.getWritable();
    return n.__text = e, n;
  }
  select(e, n) {
    st();
    let r = e, o = n;
    const i = $(), s = this.getTextContent(), l = this.__key;
    if (typeof s == "string") {
      const a = s.length;
      r === void 0 && (r = a), o === void 0 && (o = a);
    } else r = 0, o = 0;
    if (!A(i)) return jy(l, r, l, o, "text", "text");
    {
      const a = $n();
      a !== i.anchor.key && a !== i.focus.key || ze(l), i.setTextNodeRange(this, r, this, o);
    }
    return i;
  }
  selectStart() {
    return this.select(0, 0);
  }
  selectEnd() {
    const e = this.getTextContentSize();
    return this.select(e, e);
  }
  spliceText(e, n, r, o) {
    const i = this.getWritable(), s = i.__text, l = r.length;
    let a = e;
    a < 0 && (a = l + a, a < 0 && (a = 0));
    const u = $();
    if (o && A(u)) {
      const p = e + l;
      u.setTextNodeRange(i, p, i, p);
    }
    const c = s.slice(0, a) + r + s.slice(a + n);
    return i.__text = c, i;
  }
  canInsertTextBefore() {
    return !0;
  }
  canInsertTextAfter() {
    return !0;
  }
  splitText(...e) {
    st();
    const n = this.getLatest(), r = n.getTextContent(), o = n.__key, i = $n(), s = new Set(e), l = [], a = r.length;
    let u = "";
    for (let k = 0; k < a; k++) u !== "" && s.has(k) && (l.push(u), u = ""), u += r[k];
    u !== "" && l.push(u);
    const c = l.length;
    if (c === 0) return [];
    if (l[0] === r) return [n];
    const p = l[0], f = n.getParentOrThrow();
    let m;
    const h = n.getFormat(), y = n.getStyle(), _ = n.__detail;
    let v = !1;
    n.isSegmented() ? (m = oe(p), m.__format = h, m.__style = y, m.__detail = _, v = !0) : (m = n.getWritable(), m.__text = p);
    const d = $(), g = [m];
    let x = p.length;
    for (let k = 1; k < c; k++) {
      const C = l[k], E = C.length, N = oe(C).getWritable();
      N.__format = h, N.__style = y, N.__detail = _;
      const D = N.__key, z = x + E;
      if (A(d)) {
        const H = d.anchor, j = d.focus;
        H.key === o && H.type === "text" && H.offset > x && H.offset <= z && (H.key = D, H.offset -= x, d.dirty = !0), j.key === o && j.type === "text" && j.offset > x && j.offset <= z && (j.key = D, j.offset -= x, d.dirty = !0);
      }
      i === o && ze(D), x = z, g.push(N);
    }
    (function(k) {
      const C = k.getPreviousSibling(), E = k.getNextSibling();
      C !== null && cl(C), E !== null && cl(E);
    })(this);
    const w = f.getWritable(), S = this.getIndexWithinParent();
    return v ? (w.splice(S, 0, g), this.remove()) : w.splice(S, 1, g), A(d) && yl(d, f, S, c - 1), g;
  }
  mergeWithSibling(e) {
    const n = e === this.getPreviousSibling();
    n || e === this.getNextSibling() || B(50);
    const r = this.__key, o = e.__key, i = this.__text, s = i.length;
    $n() === o && ze(r);
    const l = $();
    if (A(l)) {
      const p = l.anchor, f = l.focus;
      p !== null && p.key === o && (Hp(p, n, r, e, s), l.dirty = !0), f !== null && f.key === o && (Hp(f, n, r, e, s), l.dirty = !0);
    }
    const a = e.__text, u = n ? a + i : i + a;
    this.setTextContent(u);
    const c = this.getWritable();
    return e.remove(), c;
  }
  isTextEntity() {
    return !1;
  }
}
function dx(t) {
  return { forChild: Kd(t.style), node: null };
}
function fx(t) {
  const e = t, n = e.style.fontWeight === "normal";
  return { forChild: Kd(e.style, n ? void 0 : "bold"), node: null };
}
const Dp = /* @__PURE__ */ new WeakMap();
function px(t) {
  return t.nodeName === "PRE" || t.nodeType === ji && t.style !== void 0 && t.style.whiteSpace !== void 0 && t.style.whiteSpace.startsWith("pre");
}
function gx(t) {
  const e = t;
  t.parentElement === null && B(129);
  let n = e.textContent || "";
  if (function(r) {
    let o, i = r.parentNode;
    const s = [r];
    for (; i !== null && (o = Dp.get(i)) === void 0 && !px(i); ) s.push(i), i = i.parentNode;
    const l = o === void 0 ? i : o;
    for (let a = 0; a < s.length; a++) Dp.set(s[a], l);
    return l;
  }(e) !== null) {
    const r = n.split(/(\r?\n|\t)/), o = [], i = r.length;
    for (let s = 0; s < i; s++) {
      const l = r[s];
      l === `
` || l === `\r
` ? o.push(en()) : l === "	" ? o.push(xo()) : l !== "" && o.push(oe(l));
    }
    return { node: o };
  }
  if (n = n.replace(/\r/g, "").replace(/[ \t\n]+/g, " "), n === "") return { node: null };
  if (n[0] === " ") {
    let r = e, o = !0;
    for (; r !== null && (r = Mp(r, !1)) !== null; ) {
      const i = r.textContent || "";
      if (i.length > 0) {
        /[ \t\n]$/.test(i) && (n = n.slice(1)), o = !1;
        break;
      }
    }
    o && (n = n.slice(1));
  }
  if (n[n.length - 1] === " ") {
    let r = e, o = !0;
    for (; r !== null && (r = Mp(r, !0)) !== null; )
      if ((r.textContent || "").replace(/^( |\t|\r?\n)+/, "").length > 0) {
        o = !1;
        break;
      }
    o && (n = n.slice(0, n.length - 1));
  }
  return n === "" ? { node: null } : { node: oe(n) };
}
function Mp(t, e) {
  let n = t;
  for (; ; ) {
    let r;
    for (; (r = e ? n.nextSibling : n.previousSibling) === null; ) {
      const i = n.parentElement;
      if (i === null) return null;
      n = i;
    }
    if (n = r, n.nodeType === ji) {
      const i = n.style.display;
      if (i === "" && !ox(n) || i !== "" && !i.startsWith("inline")) return null;
    }
    let o = n;
    for (; (o = e ? n.firstChild : n.lastChild) !== null; ) n = o;
    if (n.nodeType === Xn) return n;
    if (n.nodeName === "BR") return null;
  }
}
const hx = { code: "code", em: "italic", i: "italic", s: "strikethrough", strong: "bold", sub: "subscript", sup: "superscript", u: "underline" };
function En(t) {
  const e = hx[t.nodeName.toLowerCase()];
  return e === void 0 ? { node: null } : { forChild: Kd(t.style, e), node: null };
}
function oe(t = "") {
  return We(new qn(t));
}
function I(t) {
  return t instanceof qn;
}
function Kd(t, e) {
  const n = t.fontWeight, r = t.textDecoration.split(" "), o = n === "700" || n === "bold", i = r.includes("line-through"), s = t.fontStyle === "italic", l = r.includes("underline"), a = t.verticalAlign;
  return (u) => (I(u) && (o && !u.hasFormat("bold") && u.toggleFormat("bold"), i && !u.hasFormat("strikethrough") && u.toggleFormat("strikethrough"), s && !u.hasFormat("italic") && u.toggleFormat("italic"), l && !u.hasFormat("underline") && u.toggleFormat("underline"), a !== "sub" || u.hasFormat("subscript") || u.toggleFormat("subscript"), a !== "super" || u.hasFormat("superscript") || u.toggleFormat("superscript"), e && !u.hasFormat(e) && u.toggleFormat(e)), u);
}
class Wi extends qn {
  static getType() {
    return "tab";
  }
  static clone(e) {
    const n = new Wi(e.__key);
    return n.__text = e.__text, n.__format = e.__format, n.__style = e.__style, n;
  }
  constructor(e) {
    super("	", e), this.__detail = 2;
  }
  static importDOM() {
    return null;
  }
  static importJSON(e) {
    const n = xo();
    return n.setFormat(e.format), n.setStyle(e.style), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), type: "tab", version: 1 };
  }
  setTextContent(e) {
    B(126);
  }
  setDetail(e) {
    B(127);
  }
  setMode(e) {
    B(128);
  }
  canInsertTextBefore() {
    return !1;
  }
  canInsertTextAfter() {
    return !1;
  }
}
function xo() {
  return We(new Wi());
}
function Qd(t) {
  return t instanceof Wi;
}
class mx {
  constructor(e, n, r) {
    this._selection = null, this.key = e, this.offset = n, this.type = r;
  }
  is(e) {
    return this.key === e.key && this.offset === e.offset && this.type === e.type;
  }
  isBefore(e) {
    let n = this.getNode(), r = e.getNode();
    const o = this.offset, i = e.offset;
    if (b(n)) {
      const s = n.getDescendantByIndex(o);
      n = s ?? n;
    }
    if (b(r)) {
      const s = r.getDescendantByIndex(i);
      r = s ?? r;
    }
    return n === r ? o < i : n.isBefore(r);
  }
  getNode() {
    const e = Ce(this.key);
    return e === null && B(20), e;
  }
  set(e, n, r) {
    const o = this._selection, i = this.key;
    this.key = e, this.offset = n, this.type = r, Vi() || ($n() === i && ze(e), o !== null && (o.setCachedNodes(null), o.dirty = !0));
  }
}
function tn(t, e, n) {
  return new mx(t, e, n);
}
function Xa(t, e) {
  let n = e.__key, r = t.offset, o = "element";
  if (I(e)) {
    o = "text";
    const i = e.getTextContentSize();
    r > i && (r = i);
  } else if (!b(e)) {
    const i = e.getNextSibling();
    if (I(i)) n = i.__key, r = 0, o = "text";
    else {
      const s = e.getParent();
      s && (n = s.__key, r = e.getIndexWithinParent() + 1);
    }
  }
  t.set(n, r, o);
}
function zp(t, e) {
  if (b(e)) {
    const n = e.getLastDescendant();
    b(n) || I(n) ? Xa(t, n) : Xa(t, e);
  } else Xa(t, e);
}
function bn(t, e, n, r) {
  t.key = e, t.offset = n, t.type = r;
}
class sa {
  constructor(e) {
    this._cachedNodes = null, this._nodes = e, this.dirty = !1;
  }
  getCachedNodes() {
    return this._cachedNodes;
  }
  setCachedNodes(e) {
    this._cachedNodes = e;
  }
  is(e) {
    if (!$e(e)) return !1;
    const n = this._nodes, r = e._nodes;
    return n.size === r.size && Array.from(n).every((o) => r.has(o));
  }
  isCollapsed() {
    return !1;
  }
  isBackward() {
    return !1;
  }
  getStartEndPoints() {
    return null;
  }
  add(e) {
    this.dirty = !0, this._nodes.add(e), this._cachedNodes = null;
  }
  delete(e) {
    this.dirty = !0, this._nodes.delete(e), this._cachedNodes = null;
  }
  clear() {
    this.dirty = !0, this._nodes.clear(), this._cachedNodes = null;
  }
  has(e) {
    return this._nodes.has(e);
  }
  clone() {
    return new sa(new Set(this._nodes));
  }
  extract() {
    return this.getNodes();
  }
  insertRawText(e) {
  }
  insertText() {
  }
  insertNodes(e) {
    const n = this.getNodes(), r = n.length, o = n[r - 1];
    let i;
    if (I(o)) i = o.select();
    else {
      const s = o.getIndexWithinParent() + 1;
      i = o.getParentOrThrow().select(s, s);
    }
    i.insertNodes(e);
    for (let s = 0; s < r; s++) n[s].remove();
  }
  getNodes() {
    const e = this._cachedNodes;
    if (e !== null) return e;
    const n = this._nodes, r = [];
    for (const o of n) {
      const i = Ce(o);
      i !== null && r.push(i);
    }
    return Vi() || (this._cachedNodes = r), r;
  }
  getTextContent() {
    const e = this.getNodes();
    let n = "";
    for (let r = 0; r < e.length; r++) n += e[r].getTextContent();
    return n;
  }
}
function A(t) {
  return t instanceof er;
}
class er {
  constructor(e, n, r, o) {
    this.anchor = e, this.focus = n, e._selection = this, n._selection = this, this._cachedNodes = null, this.format = r, this.style = o, this.dirty = !1;
  }
  getCachedNodes() {
    return this._cachedNodes;
  }
  setCachedNodes(e) {
    this._cachedNodes = e;
  }
  is(e) {
    return !!A(e) && this.anchor.is(e.anchor) && this.focus.is(e.focus) && this.format === e.format && this.style === e.style;
  }
  isCollapsed() {
    return this.anchor.is(this.focus);
  }
  getNodes() {
    const e = this._cachedNodes;
    if (e !== null) return e;
    const n = this.anchor, r = this.focus, o = n.isBefore(r), i = o ? n : r, s = o ? r : n;
    let l = i.getNode(), a = s.getNode();
    const u = i.offset, c = s.offset;
    if (b(l)) {
      const f = l.getDescendantByIndex(u);
      l = f ?? l;
    }
    if (b(a)) {
      let f = a.getDescendantByIndex(c);
      f !== null && f !== l && a.getChildAtIndex(c) === f && (f = f.getPreviousSibling()), a = f ?? a;
    }
    let p;
    return p = l.is(a) ? b(l) && l.getChildrenSize() > 0 ? [] : [l] : l.getNodesBetween(a), Vi() || (this._cachedNodes = p), p;
  }
  setTextNodeRange(e, n, r, o) {
    bn(this.anchor, e.__key, n, "text"), bn(this.focus, r.__key, o, "text"), this._cachedNodes = null, this.dirty = !0;
  }
  getTextContent() {
    const e = this.getNodes();
    if (e.length === 0) return "";
    const n = e[0], r = e[e.length - 1], o = this.anchor, i = this.focus, s = o.isBefore(i), [l, a] = gc(this);
    let u = "", c = !0;
    for (let p = 0; p < e.length; p++) {
      const f = e[p];
      if (b(f) && !f.isInline()) c || (u += `
`), c = !f.isEmpty();
      else if (c = !1, I(f)) {
        let m = f.getTextContent();
        f === n ? f === r ? o.type === "element" && i.type === "element" && i.offset !== o.offset || (m = l < a ? m.slice(l, a) : m.slice(a, l)) : m = s ? m.slice(l) : m.slice(a) : f === r && (m = s ? m.slice(0, a) : m.slice(0, l)), u += m;
      } else !se(f) && !Hn(f) || f === r && this.isCollapsed() || (u += f.getTextContent());
    }
    return u;
  }
  applyDOMRange(e) {
    const n = Ee(), r = n.getEditorState()._selection, o = zy(e.startContainer, e.startOffset, e.endContainer, e.endOffset, n, r);
    if (o === null) return;
    const [i, s] = o;
    bn(this.anchor, i.key, i.offset, i.type), bn(this.focus, s.key, s.offset, s.type), this._cachedNodes = null;
  }
  clone() {
    const e = this.anchor, n = this.focus;
    return new er(tn(e.key, e.offset, e.type), tn(n.key, n.offset, n.type), this.format, this.style);
  }
  toggleFormat(e) {
    this.format = nc(this.format, e, null), this.dirty = !0;
  }
  setStyle(e) {
    this.style = e, this.dirty = !0;
  }
  hasFormat(e) {
    const n = mn[e];
    return !!(this.format & n);
  }
  insertRawText(e) {
    const n = e.split(/(\r?\n|\t)/), r = [], o = n.length;
    for (let i = 0; i < o; i++) {
      const s = n[i];
      s === `
` || s === `\r
` ? r.push(en()) : s === "	" ? r.push(xo()) : r.push(oe(s));
    }
    this.insertNodes(r);
  }
  insertText(e) {
    const n = this.anchor, r = this.focus, o = this.format, i = this.style;
    let s = n, l = r;
    !this.isCollapsed() && r.isBefore(n) && (s = r, l = n), s.type === "element" && function(_, v, d, g) {
      const x = _.getNode(), w = x.getChildAtIndex(_.offset), S = oe(), k = Je(x) ? ge().append(S) : S;
      S.setFormat(d), S.setStyle(g), w === null ? x.append(k) : w.insertBefore(k), _.is(v) && v.set(S.__key, 0, "text"), _.set(S.__key, 0, "text");
    }(s, l, o, i);
    const a = s.offset;
    let u = l.offset;
    const c = this.getNodes(), p = c.length;
    let f = c[0];
    I(f) || B(26);
    const m = f.getTextContent().length, h = f.getParentOrThrow();
    let y = c[p - 1];
    if (p === 1 && l.type === "element" && (u = m, l.set(s.key, u, "text")), this.isCollapsed() && a === m && (f.isSegmented() || f.isToken() || !f.canInsertTextAfter() || !h.canInsertTextAfter() && f.getNextSibling() === null)) {
      let _ = f.getNextSibling();
      if (I(_) && _.canInsertTextBefore() && !Pr(_) || (_ = oe(), _.setFormat(o), h.canInsertTextAfter() ? f.insertAfter(_) : h.insertAfter(_)), _.select(0, 0), f = _, e !== "") return void this.insertText(e);
    } else if (this.isCollapsed() && a === 0 && (f.isSegmented() || f.isToken() || !f.canInsertTextBefore() || !h.canInsertTextBefore() && f.getPreviousSibling() === null)) {
      let _ = f.getPreviousSibling();
      if (I(_) && !Pr(_) || (_ = oe(), _.setFormat(o), h.canInsertTextBefore() ? f.insertBefore(_) : h.insertBefore(_)), _.select(), f = _, e !== "") return void this.insertText(e);
    } else if (f.isSegmented() && a !== m) {
      const _ = oe(f.getTextContent());
      _.setFormat(o), f.replace(_), f = _;
    } else if (!this.isCollapsed() && e !== "") {
      const _ = y.getParent();
      if (!h.canInsertTextBefore() || !h.canInsertTextAfter() || b(_) && (!_.canInsertTextBefore() || !_.canInsertTextAfter())) return this.insertText(""), My(this.anchor, this.focus, null), void this.insertText(e);
    }
    if (p === 1) {
      if (f.isToken()) {
        const g = oe(e);
        return g.select(), void f.replace(g);
      }
      const _ = f.getFormat(), v = f.getStyle();
      if (a !== u || _ === o && v === i) {
        if (Qd(f)) {
          const g = oe(e);
          return g.setFormat(o), g.setStyle(i), g.select(), void f.replace(g);
        }
      } else {
        if (f.getTextContent() !== "") {
          const g = oe(e);
          if (g.setFormat(o), g.setStyle(i), g.select(), a === 0) f.insertBefore(g, !1);
          else {
            const [x] = f.splitText(a);
            x.insertAfter(g, !1);
          }
          return void (g.isComposing() && this.anchor.type === "text" && (this.anchor.offset -= e.length));
        }
        f.setFormat(o), f.setStyle(i);
      }
      const d = u - a;
      f = f.spliceText(a, d, e, !0), f.getTextContent() === "" ? f.remove() : this.anchor.type === "text" && (f.isComposing() ? this.anchor.offset -= e.length : (this.format = _, this.style = v));
    } else {
      const _ = /* @__PURE__ */ new Set([...f.getParentKeys(), ...y.getParentKeys()]), v = b(f) ? f : f.getParentOrThrow();
      let d = b(y) ? y : y.getParentOrThrow(), g = y;
      if (!v.is(d) && d.isInline()) do
        g = d, d = d.getParentOrThrow();
      while (d.isInline());
      if (l.type === "text" && (u !== 0 || y.getTextContent() === "") || l.type === "element" && y.getIndexWithinParent() < u) if (I(y) && !y.isToken() && u !== y.getTextContentSize()) {
        if (y.isSegmented()) {
          const C = oe(y.getTextContent());
          y.replace(C), y = C;
        }
        Je(l.getNode()) || l.type !== "text" || (y = y.spliceText(0, u, "")), _.add(y.__key);
      } else {
        const C = y.getParentOrThrow();
        C.canBeEmpty() || C.getChildrenSize() !== 1 ? y.remove() : C.remove();
      }
      else _.add(y.__key);
      const x = d.getChildren(), w = new Set(c), S = v.is(d), k = v.isInline() && f.getNextSibling() === null ? v : f;
      for (let C = x.length - 1; C >= 0; C--) {
        const E = x[C];
        if (E.is(f) || b(E) && E.isParentOf(f)) break;
        E.isAttached() && (!w.has(E) || E.is(g) ? S || k.insertAfter(E, !1) : E.remove());
      }
      if (!S) {
        let C = d, E = null;
        for (; C !== null; ) {
          const N = C.getChildren(), D = N.length;
          (D === 0 || N[D - 1].is(E)) && (_.delete(C.__key), E = C), C = C.getParent();
        }
      }
      if (f.isToken()) if (a === m) f.select();
      else {
        const C = oe(e);
        C.select(), f.replace(C);
      }
      else f = f.spliceText(a, m - a, e, !0), f.getTextContent() === "" ? f.remove() : f.isComposing() && this.anchor.type === "text" && (this.anchor.offset -= e.length);
      for (let C = 1; C < p; C++) {
        const E = c[C], N = E.__key;
        _.has(N) || E.remove();
      }
    }
  }
  removeText() {
    this.insertText("");
  }
  formatText(e) {
    if (this.isCollapsed()) return this.toggleFormat(e), void ze(null);
    const n = this.getNodes(), r = [];
    for (const d of n) I(d) && r.push(d);
    const o = r.length;
    if (o === 0) return this.toggleFormat(e), void ze(null);
    const i = this.anchor, s = this.focus, l = this.isBackward(), a = l ? s : i, u = l ? i : s;
    let c = 0, p = r[0], f = a.type === "element" ? 0 : a.offset;
    if (a.type === "text" && f === p.getTextContentSize() && (c = 1, p = r[1], f = 0), p == null) return;
    const m = p.getFormatFlags(e, null), h = o - 1;
    let y = r[h];
    const _ = u.type === "text" ? u.offset : y.getTextContentSize();
    if (p.is(y)) {
      if (f === _) return;
      if (Pr(p) || f === 0 && _ === p.getTextContentSize()) p.setFormat(m);
      else {
        const d = p.splitText(f, _), g = f === 0 ? d[0] : d[1];
        g.setFormat(m), a.type === "text" && a.set(g.__key, 0, "text"), u.type === "text" && u.set(g.__key, _ - f, "text");
      }
      return void (this.format = m);
    }
    f === 0 || Pr(p) || ([, p] = p.splitText(f), f = 0), p.setFormat(m);
    const v = y.getFormatFlags(e, m);
    _ > 0 && (_ === y.getTextContentSize() || Pr(y) || ([y] = y.splitText(_)), y.setFormat(v));
    for (let d = c + 1; d < h; d++) {
      const g = r[d], x = g.getFormatFlags(e, v);
      g.setFormat(x);
    }
    a.type === "text" && a.set(p.__key, f, "text"), u.type === "text" && u.set(y.__key, _, "text"), this.format = m | v;
  }
  insertNodes(e) {
    if (e.length === 0) return;
    if (this.anchor.key === "root") {
      this.insertParagraph();
      const h = $();
      return A(h) || B(134), h.insertNodes(e);
    }
    const n = Qa((this.isBackward() ? this.focus : this.anchor).getNode(), $r), r = e[e.length - 1];
    if ("__language" in n && b(n)) {
      if ("__language" in e[0]) this.insertText(e[0].getTextContent());
      else {
        const h = qa(this);
        n.splice(h, 0, e), r.selectEnd();
      }
      return;
    }
    if (!e.some((h) => (b(h) || se(h)) && !h.isInline())) {
      b(n) || B(135);
      const h = qa(this);
      return n.splice(h, 0, e), void r.selectEnd();
    }
    const o = function(h) {
      const y = ge();
      let _ = null;
      for (let v = 0; v < h.length; v++) {
        const d = h[v], g = Hn(d);
        if (g || se(d) && d.isInline() || b(d) && d.isInline() || I(d) || d.isParentRequired()) {
          if (_ === null && (_ = d.createParentElementNode(), y.append(_), g)) continue;
          _ !== null && _.append(d);
        } else y.append(d), _ = null;
      }
      return y;
    }(e), i = o.getLastDescendant(), s = o.getChildren(), l = (h) => "__value" in h && "__checked" in h, a = !b(n) || !n.isEmpty() ? this.insertParagraph() : null, u = s[s.length - 1];
    let c = s[0];
    var p;
    b(p = c) && $r(p) && !p.isEmpty() && b(n) && (!n.isEmpty() || l(n)) && (b(n) || B(135), n.append(...c.getChildren()), c = s[1]), c && function(h, y, _) {
      const v = y.getParentOrThrow().getLastChild();
      let d = y;
      const g = [y];
      for (; d !== v; ) d.getNextSibling() || B(140), d = d.getNextSibling(), g.push(d);
      let x = h;
      for (const w of g) x = x.insertAfter(w);
    }(n, c);
    const f = Qa(i, $r);
    a && b(f) && (l(a) || $r(u)) && (f.append(...a.getChildren()), a.remove()), b(n) && n.isEmpty() && n.remove(), i.selectEnd();
    const m = b(n) ? n.getLastChild() : null;
    Hn(m) && f !== n && m.remove();
  }
  insertParagraph() {
    if (this.anchor.key === "root") {
      const s = ge();
      return ye().splice(this.anchor.offset, 0, [s]), s.select(), s;
    }
    const e = qa(this), n = Qa(this.anchor.getNode(), $r);
    b(n) || B(136);
    const r = n.getChildAtIndex(e), o = r ? [r, ...r.getNextSiblings()] : [], i = n.insertNewAfter(this, !1);
    return i ? (i.append(...o), i.selectStart(), i) : null;
  }
  insertLineBreak(e) {
    const n = en();
    if (this.insertNodes([n]), e) {
      const r = n.getParentOrThrow(), o = n.getIndexWithinParent();
      r.select(o, o);
    }
  }
  extract() {
    const e = this.getNodes(), n = e.length, r = n - 1, o = this.anchor, i = this.focus;
    let s = e[0], l = e[r];
    const [a, u] = gc(this);
    if (n === 0) return [];
    if (n === 1) {
      if (I(s) && !this.isCollapsed()) {
        const p = a > u ? u : a, f = a > u ? a : u, m = s.splitText(p, f), h = p === 0 ? m[0] : m[1];
        return h != null ? [h] : [];
      }
      return [s];
    }
    const c = o.isBefore(i);
    if (I(s)) {
      const p = c ? a : u;
      p === s.getTextContentSize() ? e.shift() : p !== 0 && ([, s] = s.splitText(p), e[0] = s);
    }
    if (I(l)) {
      const p = l.getTextContent().length, f = c ? u : a;
      f === 0 ? e.pop() : f !== p && ([l] = l.splitText(f), e[r] = l);
    }
    return e;
  }
  modify(e, n, r) {
    const o = this.focus, i = this.anchor, s = e === "move", l = Ni(o, n);
    if (se(l) && !l.isIsolated()) {
      if (s && l.isKeyboardSelectable()) {
        const m = mc();
        return m.add(l.__key), void De(m);
      }
      const f = n ? l.getPreviousSibling() : l.getNextSibling();
      if (I(f)) {
        const m = f.__key, h = n ? f.getTextContent().length : 0;
        return o.set(m, h, "text"), void (s && i.set(m, h, "text"));
      }
      {
        const m = l.getParentOrThrow();
        let h, y;
        return b(f) ? (y = f.__key, h = n ? f.getChildrenSize() : 0) : (h = l.getIndexWithinParent(), y = m.__key, n || h++), o.set(y, h, "element"), void (s && i.set(y, h, "element"));
      }
    }
    const a = Ee(), u = qt(a._window);
    if (!u) return;
    const c = a._blockCursorElement, p = a._rootElement;
    if (p === null || c === null || !b(l) || l.isInline() || l.canBeEmpty() || Vd(c, a, p), function(f, m, h, y) {
      f.modify(m, h, y);
    }(u, e, n ? "backward" : "forward", r), u.rangeCount > 0) {
      const f = u.getRangeAt(0), m = this.anchor.getNode(), h = Je(m) ? m : tx(m);
      if (this.applyDOMRange(f), this.dirty = !0, !s) {
        const y = this.getNodes(), _ = [];
        let v = !1;
        for (let d = 0; d < y.length; d++) {
          const g = y[d];
          fl(g, h) ? _.push(g) : v = !0;
        }
        if (v && _.length > 0) if (n) {
          const d = _[0];
          b(d) ? d.selectStart() : d.getParentOrThrow().selectStart();
        } else {
          const d = _[_.length - 1];
          b(d) ? d.selectEnd() : d.getParentOrThrow().selectEnd();
        }
        u.anchorNode === f.startContainer && u.anchorOffset === f.startOffset || function(d) {
          const g = d.focus, x = d.anchor, w = x.key, S = x.offset, k = x.type;
          bn(x, g.key, g.offset, g.type), bn(g, w, S, k), d._cachedNodes = null;
        }(this);
      }
    }
  }
  forwardDeletion(e, n, r) {
    if (!r && (e.type === "element" && b(n) && e.offset === n.getChildrenSize() || e.type === "text" && e.offset === n.getTextContentSize())) {
      const o = n.getParent(), i = n.getNextSibling() || (o === null ? null : o.getNextSibling());
      if (b(i) && i.isShadowRoot()) return !0;
    }
    return !1;
  }
  deleteCharacter(e) {
    const n = this.isCollapsed();
    if (this.isCollapsed()) {
      const r = this.anchor;
      let o = r.getNode();
      if (this.forwardDeletion(r, o, e)) return;
      const i = this.focus, s = Ni(i, e);
      if (se(s) && !s.isIsolated()) {
        if (s.isKeyboardSelectable() && b(o) && o.getChildrenSize() === 0) {
          o.remove();
          const l = mc();
          l.add(s.__key), De(l);
        } else
          s.remove(), Ee().dispatchCommand(Tr, void 0);
        return;
      }
      if (!e && b(s) && b(o) && o.isEmpty()) return o.remove(), void s.selectStart();
      if (this.modify("extend", e, "character"), this.isCollapsed()) {
        if (e && r.offset === 0 && (r.type === "element" ? r.getNode() : r.getNode().getParentOrThrow()).collapseAtStart(this))
          return;
      } else {
        const l = i.type === "text" ? i.getNode() : null;
        if (o = r.type === "text" ? r.getNode() : null, l !== null && l.isSegmented()) {
          const a = i.offset, u = l.getTextContentSize();
          if (l.is(o) || e && a !== u || !e && a !== 0) return void Bp(l, e, a);
        } else if (o !== null && o.isSegmented()) {
          const a = r.offset, u = o.getTextContentSize();
          if (o.is(l) || e && a !== 0 || !e && a !== u) return void Bp(o, e, a);
        }
        (function(a, u) {
          const c = a.anchor, p = a.focus, f = c.getNode(), m = p.getNode();
          if (f === m && c.type === "text" && p.type === "text") {
            const h = c.offset, y = p.offset, _ = h < y, v = _ ? h : y, d = _ ? y : h, g = d - 1;
            v !== g && (yy(f.getTextContent().slice(v, d)) || (u ? p.offset = g : c.offset = g));
          }
        })(this, e);
      }
    }
    if (this.removeText(), e && !n && this.isCollapsed() && this.anchor.type === "element" && this.anchor.offset === 0) {
      const r = this.anchor.getNode();
      r.isEmpty() && Je(r.getParent()) && r.getIndexWithinParent() === 0 && r.collapseAtStart(this);
    }
  }
  deleteLine(e) {
    if (this.isCollapsed()) {
      const n = this.anchor.type === "element";
      if (n && this.insertText(" "), this.modify("extend", e, "lineboundary"), (e ? this.focus : this.anchor).offset === 0 && this.modify("extend", e, "character"), n) {
        const r = e ? this.anchor : this.focus;
        r.set(r.key, r.offset + 1, r.type);
      }
    }
    this.removeText();
  }
  deleteWord(e) {
    if (this.isCollapsed()) {
      const n = this.anchor, r = n.getNode();
      if (this.forwardDeletion(n, r, e)) return;
      this.modify("extend", e, "word");
    }
    this.removeText();
  }
  isBackward() {
    return this.focus.isBefore(this.anchor);
  }
  getStartEndPoints() {
    return [this.anchor, this.focus];
  }
}
function $e(t) {
  return t instanceof sa;
}
function jp(t) {
  const e = t.offset;
  if (t.type === "text") return e;
  const n = t.getNode();
  return e === n.getChildrenSize() ? n.getTextContent().length : 0;
}
function gc(t) {
  const e = t.getStartEndPoints();
  if (e === null) return [0, 0];
  const [n, r] = e;
  return n.type === "element" && r.type === "element" && n.key === r.key && n.offset === r.offset ? [0, 0] : [jp(n), jp(r)];
}
function Bp(t, e, n) {
  const r = t, o = r.getTextContent().split(/(?=\s)/g), i = o.length;
  let s = 0, l = 0;
  for (let u = 0; u < i; u++) {
    const c = u === i - 1;
    if (l = s, s += o[u].length, e && s === n || s > n || c) {
      o.splice(u, 1), c && (l = void 0);
      break;
    }
  }
  const a = o.join("").trim();
  a === "" ? r.remove() : (r.setTextContent(a), r.select(l, l));
}
function Up(t, e, n, r) {
  let o, i = e;
  if (t.nodeType === ji) {
    let s = !1;
    const l = t.childNodes, a = l.length, u = r._blockCursorElement;
    i === a && (s = !0, i = a - 1);
    let c = l[i], p = !1;
    if (c === u) c = l[i + 1], p = !0;
    else if (u !== null) {
      const f = u.parentNode;
      t === f && e > Array.prototype.indexOf.call(f.children, u) && i--;
    }
    if (o = Gr(c), I(o)) i = Cp(o, s);
    else {
      let f = Gr(t);
      if (f === null) return null;
      if (b(f)) {
        i = Math.min(f.getChildrenSize(), i);
        let m = f.getChildAtIndex(i);
        if (b(m) && function(h, y, _) {
          const v = h.getParent();
          return _ === null || v === null || !v.canBeEmpty() || v !== _.getNode();
        }(m, 0, n)) {
          const h = s ? m.getLastDescendant() : m.getFirstDescendant();
          h === null ? f = m : (m = h, f = b(m) ? m : m.getParentOrThrow()), i = 0;
        }
        I(m) ? (o = m, f = null, i = Cp(m, s)) : m !== f && s && !p && i++;
      } else {
        const m = f.getIndexWithinParent();
        i = e === 0 && se(f) && Gr(t) === f ? m : m + 1, f = f.getParentOrThrow();
      }
      if (b(f)) return tn(f.__key, i, "element");
    }
  } else o = Gr(t);
  return I(o) ? tn(o.__key, i, "text") : null;
}
function Wp(t, e, n) {
  const r = t.offset, o = t.getNode();
  if (r === 0) {
    const i = o.getPreviousSibling(), s = o.getParent();
    if (e) {
      if ((n || !e) && i === null && b(s) && s.isInline()) {
        const l = s.getPreviousSibling();
        I(l) && (t.key = l.__key, t.offset = l.getTextContent().length);
      }
    } else b(i) && !n && i.isInline() ? (t.key = i.__key, t.offset = i.getChildrenSize(), t.type = "element") : I(i) && (t.key = i.__key, t.offset = i.getTextContent().length);
  } else if (r === o.getTextContent().length) {
    const i = o.getNextSibling(), s = o.getParent();
    if (e && b(i) && i.isInline()) t.key = i.__key, t.offset = 0, t.type = "element";
    else if ((n || e) && i === null && b(s) && s.isInline() && !s.canInsertTextAfter()) {
      const l = s.getNextSibling();
      I(l) && (t.key = l.__key, t.offset = 0);
    }
  }
}
function My(t, e, n) {
  if (t.type === "text" && e.type === "text") {
    const r = t.isBefore(e), o = t.is(e);
    Wp(t, r, o), Wp(e, !r, o), o && (e.key = t.key, e.offset = t.offset, e.type = t.type);
    const i = Ee();
    if (i.isComposing() && i._compositionKey !== t.key && A(n)) {
      const s = n.anchor, l = n.focus;
      bn(t, s.key, s.offset, s.type), bn(e, l.key, l.offset, l.type);
    }
  }
}
function zy(t, e, n, r, o, i) {
  if (t === null || n === null || !Bi(o, t, n)) return null;
  const s = Up(t, e, A(i) ? i.anchor : null, o);
  if (s === null) return null;
  const l = Up(n, r, A(i) ? i.focus : null, o);
  if (l === null) return null;
  if (s.type === "element" && l.type === "element") {
    const a = Gr(t), u = Gr(n);
    if (se(a) && se(u)) return null;
  }
  return My(s, l, i), [s, l];
}
function hc(t) {
  return b(t) && !t.isInline();
}
function jy(t, e, n, r, o, i) {
  const s = sn(), l = new er(tn(t, e, o), tn(n, r, i), 0, "");
  return l.dirty = !0, s._selection = l, l;
}
function By() {
  const t = tn("root", 0, "element"), e = tn("root", 0, "element");
  return new er(t, e, 0, "");
}
function mc() {
  return new sa(/* @__PURE__ */ new Set());
}
function Gd(t, e, n, r) {
  const o = n._window;
  if (o === null) return null;
  const i = r || o.event, s = i ? i.type : void 0, l = s === "selectionchange", a = !tc && (l || s === "beforeinput" || s === "compositionstart" || s === "compositionend" || s === "click" && i && i.detail === 3 || s === "drop" || s === void 0);
  let u, c, p, f;
  if (A(t) && !a) return t.clone();
  if (e === null) return null;
  if (u = e.anchorNode, c = e.focusNode, p = e.anchorOffset, f = e.focusOffset, l && A(t) && !Bi(n, u, c)) return t.clone();
  const m = zy(u, p, c, f, n, t);
  if (m === null) return null;
  const [h, y] = m;
  return new er(h, y, A(t) ? t.format : 0, A(t) ? t.style : "");
}
function $() {
  return sn()._selection;
}
function wo() {
  return Ee()._editorState._selection;
}
function yl(t, e, n, r = 1) {
  const o = t.anchor, i = t.focus, s = o.getNode(), l = i.getNode();
  if (!e.is(s) && !e.is(l)) return;
  const a = e.__key;
  if (t.isCollapsed()) {
    const u = o.offset;
    if (n <= u && r > 0 || n < u && r < 0) {
      const c = Math.max(0, u + r);
      o.set(a, c, "element"), i.set(a, c, "element"), Vp(t);
    }
  } else {
    const u = t.isBackward(), c = u ? i : o, p = c.getNode(), f = u ? o : i, m = f.getNode();
    if (e.is(p)) {
      const h = c.offset;
      (n <= h && r > 0 || n < h && r < 0) && c.set(a, Math.max(0, h + r), "element");
    }
    if (e.is(m)) {
      const h = f.offset;
      (n <= h && r > 0 || n < h && r < 0) && f.set(a, Math.max(0, h + r), "element");
    }
  }
  Vp(t);
}
function Vp(t) {
  const e = t.anchor, n = e.offset, r = t.focus, o = r.offset, i = e.getNode(), s = r.getNode();
  if (t.isCollapsed()) {
    if (!b(i)) return;
    const l = i.getChildrenSize(), a = n >= l, u = a ? i.getChildAtIndex(l - 1) : i.getChildAtIndex(n);
    if (I(u)) {
      let c = 0;
      a && (c = u.getTextContentSize()), e.set(u.__key, c, "text"), r.set(u.__key, c, "text");
    }
  } else {
    if (b(i)) {
      const l = i.getChildrenSize(), a = n >= l, u = a ? i.getChildAtIndex(l - 1) : i.getChildAtIndex(n);
      if (I(u)) {
        let c = 0;
        a && (c = u.getTextContentSize()), e.set(u.__key, c, "text");
      }
    }
    if (b(s)) {
      const l = s.getChildrenSize(), a = o >= l, u = a ? s.getChildAtIndex(l - 1) : s.getChildAtIndex(o);
      if (I(u)) {
        let c = 0;
        a && (c = u.getTextContentSize()), r.set(u.__key, c, "text");
      }
    }
  }
}
function vl(t, e, n, r, o) {
  let i = null, s = 0, l = null;
  r !== null ? (i = r.__key, I(r) ? (s = r.getTextContentSize(), l = "text") : b(r) && (s = r.getChildrenSize(), l = "element")) : o !== null && (i = o.__key, I(o) ? l = "text" : b(o) && (l = "element")), i !== null && l !== null ? t.set(i, s, l) : (s = e.getIndexWithinParent(), s === -1 && (s = n.getChildrenSize()), t.set(n.__key, s, "element"));
}
function Hp(t, e, n, r, o) {
  t.type === "text" ? (t.key = n, e || (t.offset += o)) : t.offset > r.getIndexWithinParent() && (t.offset -= 1);
}
function yx(t, e, n, r, o, i, s) {
  const l = r.anchorNode, a = r.focusNode, u = r.anchorOffset, c = r.focusOffset, p = document.activeElement;
  if (o.has("collaboration") && p !== i || p !== null && Dd(p)) return;
  if (!A(e)) return void (t !== null && Bi(n, l, a) && r.removeAllRanges());
  const f = e.anchor, m = e.focus, h = f.key, y = m.key, _ = dl(n, h), v = dl(n, y), d = f.offset, g = m.offset, x = e.format, w = e.style, S = e.isCollapsed();
  let k = _, C = v, E = !1;
  if (f.type === "text") {
    k = ul(_);
    const J = f.getNode();
    E = J.getFormat() !== x || J.getStyle() !== w;
  } else A(t) && t.anchor.type === "text" && (E = !0);
  var N, D, z, H, j;
  if (m.type === "text" && (C = ul(v)), k !== null && C !== null && (S && (t === null || E || A(t) && (t.format !== x || t.style !== w)) && (N = x, D = w, z = d, H = h, j = performance.now(), Fy = [N, D, z, H, j]), u !== d || c !== g || l !== k || a !== C || r.type === "Range" && S || (p !== null && i.contains(p) || i.focus({ preventScroll: !0 }), f.type === "element"))) {
    try {
      r.setBaseAndExtent(k, d, C, g);
    } catch {
    }
    if (!o.has("skip-scroll-into-view") && e.isCollapsed() && i !== null && i === document.activeElement) {
      const J = e instanceof er && e.anchor.type === "element" ? k.childNodes[d] || null : r.rangeCount > 0 ? r.getRangeAt(0) : null;
      if (J !== null) {
        let G;
        if (J instanceof Text) {
          const te = document.createRange();
          te.selectNode(J), G = te.getBoundingClientRect();
        } else G = J.getBoundingClientRect();
        (function(te, L, U) {
          const K = U.ownerDocument, q = K.defaultView;
          if (q === null) return;
          let { top: Z, bottom: Ve } = L, le = 0, Te = 0, ae = U;
          for (; ae !== null; ) {
            const be = ae === K.body;
            if (be) le = 0, Te = ra(te).innerHeight;
            else {
              const F = ae.getBoundingClientRect();
              le = F.top, Te = F.bottom;
            }
            let Ze = 0;
            if (Z < le ? Ze = -(le - Z) : Ve > Te && (Ze = Ve - Te), Ze !== 0) if (be) q.scrollBy(0, Ze);
            else {
              const F = ae.scrollTop;
              ae.scrollTop += Ze;
              const P = ae.scrollTop - F;
              Z -= P, Ve -= P;
            }
            if (be) break;
            ae = na(ae);
          }
        })(n, G, i);
      }
    }
    dc = !0;
  }
}
function yc(t) {
  let e = $() || wo();
  e === null && (e = ye().selectEnd()), e.insertNodes(t);
}
function qa(t) {
  let e = t;
  t.isCollapsed() || e.removeText();
  const n = $();
  A(n) && (e = n), A(e) || B(161);
  const r = e.anchor;
  let o = r.getNode(), i = r.offset;
  for (; !$r(o); ) [o, i] = vx(o, i);
  return i;
}
function vx(t, e) {
  const n = t.getParent();
  if (!n) {
    const o = ge();
    return ye().append(o), o.select(), [ye(), 0];
  }
  if (I(t)) {
    const o = t.splitText(e);
    if (o.length === 0) return [n, t.getIndexWithinParent()];
    const i = e === 0 ? 0 : 1;
    return [n, o[0].getIndexWithinParent() + i];
  }
  if (!b(t) || e === 0) return [n, t.getIndexWithinParent()];
  const r = t.getChildAtIndex(e);
  if (r) {
    const o = new er(tn(t.__key, e, "element"), tn(t.__key, e, "element"), 0, ""), i = t.insertNewAfter(o);
    i && i.append(r, ...r.getNextSiblings());
  }
  return [n, t.getIndexWithinParent() + 1];
}
let Le = null, Ie = null, dt = !1, eu = !1, As = 0;
const Kp = { characterData: !0, childList: !0, subtree: !0 };
function Vi() {
  return dt || Le !== null && Le._readOnly;
}
function st() {
  dt && B(13);
}
function Uy() {
  As > 99 && B(14);
}
function sn() {
  return Le === null && B(15), Le;
}
function Ee() {
  return Ie === null && B(16), Ie;
}
function _x() {
  return Ie;
}
function Qp(t, e, n) {
  const r = e.__type, o = function(l, a) {
    const u = l._nodes.get(a);
    return u === void 0 && B(30, a), u;
  }(t, r);
  let i = n.get(r);
  i === void 0 && (i = Array.from(o.transforms), n.set(r, i));
  const s = i.length;
  for (let l = 0; l < s && (i[l](e), e.isAttached()); l++) ;
}
function Gp(t, e) {
  return t !== void 0 && t.__key !== e && t.isAttached();
}
function xx(t) {
  return Jd(t, Ee()._nodes);
}
function Jd(t, e) {
  const n = t.type, r = e.get(n);
  r === void 0 && B(17, n);
  const o = r.klass;
  t.type !== o.getType() && B(18, o.name);
  const i = o.importJSON(t), s = t.children;
  if (b(i) && Array.isArray(s)) for (let l = 0; l < s.length; l++) {
    const a = Jd(s[l], e);
    i.append(a);
  }
  return i;
}
function Jp(t, e) {
  const n = Le, r = dt, o = Ie;
  Le = t, dt = !0, Ie = null;
  try {
    return e();
  } finally {
    Le = n, dt = r, Ie = o;
  }
}
function gr(t, e) {
  const n = t._pendingEditorState, r = t._rootElement, o = t._headless || r === null;
  if (n === null) return;
  const i = t._editorState, s = i._selection, l = n._selection, a = t._dirtyType !== wr, u = Le, c = dt, p = Ie, f = t._updating, m = t._observer;
  let h = null;
  if (t._pendingEditorState = null, t._editorState = n, !o && a && m !== null) {
    Ie = t, Le = n, dt = !1, t._updating = !0;
    try {
      const S = t._dirtyType, k = t._dirtyElements, C = t._dirtyLeaves;
      m.disconnect(), h = ax(i, n, t, S, k, C);
    } catch (S) {
      if (S instanceof Error && t._onError(S), eu) throw S;
      return Qy(t, null, r, n), dy(t), t._dirtyType = po, eu = !0, gr(t, i), void (eu = !1);
    } finally {
      m.observe(r, Kp), t._updating = f, Le = u, dt = c, Ie = p;
    }
  }
  n._readOnly || (n._readOnly = !0);
  const y = t._dirtyLeaves, _ = t._dirtyElements, v = t._normalizedNodes, d = t._updateTags, g = t._deferred;
  a && (t._dirtyType = wr, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements = /* @__PURE__ */ new Map(), t._normalizedNodes = /* @__PURE__ */ new Set(), t._updateTags = /* @__PURE__ */ new Set()), function(S, k) {
    const C = S._decorators;
    let E = S._pendingDecorators || C;
    const N = k._nodeMap;
    let D;
    for (D in E) N.has(D) || (E === C && (E = hy(S)), delete E[D]);
  }(t, n);
  const x = o ? null : qt(t._window);
  if (t._editable && x !== null && (a || l === null || l.dirty)) {
    Ie = t, Le = n;
    try {
      if (m !== null && m.disconnect(), a || l === null || l.dirty) {
        const S = t._blockCursorElement;
        S !== null && Vd(S, t, r), yx(s, l, t, x, d, r);
      }
      nx(t, r, l), m !== null && m.observe(r, Kp);
    } finally {
      Ie = p, Le = u;
    }
  }
  h !== null && function(S, k, C, E, N) {
    const D = Array.from(S._listeners.mutation), z = D.length;
    for (let H = 0; H < z; H++) {
      const [j, J] = D[H], G = k.get(J);
      G !== void 0 && j(G, { dirtyLeaves: E, prevEditorState: N, updateTags: C });
    }
  }(t, h, d, y, i), A(l) || l === null || s !== null && s.is(l) || t.dispatchCommand(Tr, void 0);
  const w = t._pendingDecorators;
  w !== null && (t._decorators = w, t._pendingDecorators = null, ui("decorator", t, !0, w)), function(S, k, C) {
    const E = kp(k), N = kp(C);
    E !== N && ui("textcontent", S, !0, N);
  }(t, e || i, n), ui("update", t, !0, { dirtyElements: _, dirtyLeaves: y, editorState: n, normalizedNodes: v, prevEditorState: e || i, tags: d }), function(S, k) {
    if (S._deferred = [], k.length !== 0) {
      const C = S._updating;
      S._updating = !0;
      try {
        for (let E = 0; E < k.length; E++) k[E]();
      } finally {
        S._updating = C;
      }
    }
  }(t, g), function(S) {
    const k = S._updates;
    if (k.length !== 0) {
      const C = k.shift();
      if (C) {
        const [E, N] = C;
        Vy(S, E, N);
      }
    }
  }(t);
}
function ui(t, e, n, ...r) {
  const o = e._updating;
  e._updating = n;
  try {
    const i = Array.from(e._listeners[t]);
    for (let s = 0; s < i.length; s++) i[s].apply(null, r);
  } finally {
    e._updating = o;
  }
}
function Wy(t, e, n) {
  if (t._updating === !1 || Ie !== t) {
    let o = !1;
    return t.update(() => {
      o = Wy(t, e, n);
    }), o;
  }
  const r = zd(t);
  for (let o = 4; o >= 0; o--) for (let i = 0; i < r.length; i++) {
    const s = r[i]._commands.get(e);
    if (s !== void 0) {
      const l = s[o];
      if (l !== void 0) {
        const a = Array.from(l), u = a.length;
        for (let c = 0; c < u; c++) if (a[c](n, t) === !0) return !0;
      }
    }
  }
  return !1;
}
function Yp(t, e) {
  const n = t._updates;
  let r = e || !1;
  for (; n.length !== 0; ) {
    const o = n.shift();
    if (o) {
      const [i, s] = o;
      let l, a;
      s !== void 0 && (l = s.onUpdate, a = s.tag, s.skipTransforms && (r = !0), l && t._deferred.push(l), a && t._updateTags.add(a)), i();
    }
  }
  return r;
}
function Vy(t, e, n) {
  const r = t._updateTags;
  let o, i, s = !1, l = !1;
  n !== void 0 && (o = n.onUpdate, i = n.tag, i != null && r.add(i), s = n.skipTransforms || !1, l = n.discrete || !1), o && t._deferred.push(o);
  const a = t._editorState;
  let u = t._pendingEditorState, c = !1;
  (u === null || u._readOnly) && (u = t._pendingEditorState = new la(new Map((u || a)._nodeMap)), c = !0), u._flushSync = l;
  const p = Le, f = dt, m = Ie, h = t._updating;
  Le = u, dt = !1, t._updating = !0, Ie = t;
  try {
    c && (t._headless ? a._selection !== null && (u._selection = a._selection.clone()) : u._selection = function(d) {
      const g = d.getEditorState()._selection, x = qt(d._window);
      return A(g) || g == null ? Gd(g, x, d, null) : g.clone();
    }(t));
    const _ = t._compositionKey;
    e(), s = Yp(t, s), function(d, g) {
      const x = g.getEditorState()._selection, w = d._selection;
      if (A(w)) {
        const S = w.anchor, k = w.focus;
        let C;
        if (S.type === "text" && (C = S.getNode(), C.selectionTransform(x, w)), k.type === "text") {
          const E = k.getNode();
          C !== E && E.selectionTransform(x, w);
        }
      }
    }(u, t), t._dirtyType !== wr && (s ? function(d, g) {
      const x = g._dirtyLeaves, w = d._nodeMap;
      for (const S of x) {
        const k = w.get(S);
        I(k) && k.isAttached() && k.isSimpleText() && !k.isUnmergeable() && wp(k);
      }
    }(u, t) : function(d, g) {
      const x = g._dirtyLeaves, w = g._dirtyElements, S = d._nodeMap, k = $n(), C = /* @__PURE__ */ new Map();
      let E = x, N = E.size, D = w, z = D.size;
      for (; N > 0 || z > 0; ) {
        if (N > 0) {
          g._dirtyLeaves = /* @__PURE__ */ new Set();
          for (const H of E) {
            const j = S.get(H);
            I(j) && j.isAttached() && j.isSimpleText() && !j.isUnmergeable() && wp(j), j !== void 0 && Gp(j, k) && Qp(g, j, C), x.add(H);
          }
          if (E = g._dirtyLeaves, N = E.size, N > 0) {
            As++;
            continue;
          }
        }
        g._dirtyLeaves = /* @__PURE__ */ new Set(), g._dirtyElements = /* @__PURE__ */ new Map();
        for (const H of D) {
          const j = H[0], J = H[1];
          if (j !== "root" && !J) continue;
          const G = S.get(j);
          G !== void 0 && Gp(G, k) && Qp(g, G, C), w.set(j, J);
        }
        E = g._dirtyLeaves, N = E.size, D = g._dirtyElements, z = D.size, As++;
      }
      g._dirtyLeaves = x, g._dirtyElements = w;
    }(u, t), Yp(t), function(d, g, x, w) {
      const S = d._nodeMap, k = g._nodeMap, C = [];
      for (const [E] of w) {
        const N = k.get(E);
        N !== void 0 && (N.isAttached() || (b(N) && Sy(N, E, S, k, C, w), S.has(E) || w.delete(E), C.push(E)));
      }
      for (const E of C) k.delete(E);
      for (const E of x) {
        const N = k.get(E);
        N === void 0 || N.isAttached() || (S.has(E) || x.delete(E), k.delete(E));
      }
    }(a, u, t._dirtyLeaves, t._dirtyElements)), _ !== t._compositionKey && (u._flushSync = !0);
    const v = u._selection;
    if (A(v)) {
      const d = u._nodeMap, g = v.anchor.key, x = v.focus.key;
      d.get(g) !== void 0 && d.get(x) !== void 0 || B(19);
    } else $e(v) && v._nodes.size === 0 && (u._selection = null);
  } catch (_) {
    return _ instanceof Error && t._onError(_), t._pendingEditorState = a, t._dirtyType = po, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements.clear(), void gr(t);
  } finally {
    Le = p, dt = f, Ie = m, t._updating = h, As = 0;
  }
  t._dirtyType !== wr || function(_, v) {
    const d = v.getEditorState()._selection, g = _._selection;
    if (g !== null) {
      if (g.dirty || !g.is(d)) return !0;
    } else if (d !== null) return !0;
    return !1;
  }(u, t) ? u._flushSync ? (u._flushSync = !1, gr(t)) : c && Z1(() => {
    gr(t);
  }) : (u._flushSync = !1, c && (r.clear(), t._deferred = [], t._pendingEditorState = null));
}
function ht(t, e, n) {
  t._updating ? t._updates.push([e, n]) : Vy(t, e, n);
}
class St extends ia {
  constructor(e) {
    super(e), this.__first = null, this.__last = null, this.__size = 0, this.__format = 0, this.__indent = 0, this.__dir = null;
  }
  getFormat() {
    return this.getLatest().__format;
  }
  getFormatType() {
    const e = this.getFormat();
    return W1[e] || "";
  }
  getIndent() {
    return this.getLatest().__indent;
  }
  getChildren() {
    const e = [];
    let n = this.getFirstChild();
    for (; n !== null; ) e.push(n), n = n.getNextSibling();
    return e;
  }
  getChildrenKeys() {
    const e = [];
    let n = this.getFirstChild();
    for (; n !== null; ) e.push(n.__key), n = n.getNextSibling();
    return e;
  }
  getChildrenSize() {
    return this.getLatest().__size;
  }
  isEmpty() {
    return this.getChildrenSize() === 0;
  }
  isDirty() {
    const e = Ee()._dirtyElements;
    return e !== null && e.has(this.__key);
  }
  isLastChild() {
    const e = this.getLatest(), n = this.getParentOrThrow().getLastChild();
    return n !== null && n.is(e);
  }
  getAllTextNodes() {
    const e = [];
    let n = this.getFirstChild();
    for (; n !== null; ) {
      if (I(n) && e.push(n), b(n)) {
        const r = n.getAllTextNodes();
        e.push(...r);
      }
      n = n.getNextSibling();
    }
    return e;
  }
  getFirstDescendant() {
    let e = this.getFirstChild();
    for (; b(e); ) {
      const n = e.getFirstChild();
      if (n === null) break;
      e = n;
    }
    return e;
  }
  getLastDescendant() {
    let e = this.getLastChild();
    for (; b(e); ) {
      const n = e.getLastChild();
      if (n === null) break;
      e = n;
    }
    return e;
  }
  getDescendantByIndex(e) {
    const n = this.getChildren(), r = n.length;
    if (e >= r) {
      const i = n[r - 1];
      return b(i) && i.getLastDescendant() || i || null;
    }
    const o = n[e];
    return b(o) && o.getFirstDescendant() || o || null;
  }
  getFirstChild() {
    const e = this.getLatest().__first;
    return e === null ? null : Ce(e);
  }
  getFirstChildOrThrow() {
    const e = this.getFirstChild();
    return e === null && B(45, this.__key), e;
  }
  getLastChild() {
    const e = this.getLatest().__last;
    return e === null ? null : Ce(e);
  }
  getLastChildOrThrow() {
    const e = this.getLastChild();
    return e === null && B(96, this.__key), e;
  }
  getChildAtIndex(e) {
    const n = this.getChildrenSize();
    let r, o;
    if (e < n / 2) {
      for (r = this.getFirstChild(), o = 0; r !== null && o <= e; ) {
        if (o === e) return r;
        r = r.getNextSibling(), o++;
      }
      return null;
    }
    for (r = this.getLastChild(), o = n - 1; r !== null && o >= e; ) {
      if (o === e) return r;
      r = r.getPreviousSibling(), o--;
    }
    return null;
  }
  getTextContent() {
    let e = "";
    const n = this.getChildren(), r = n.length;
    for (let o = 0; o < r; o++) {
      const i = n[o];
      e += i.getTextContent(), b(i) && o !== r - 1 && !i.isInline() && (e += wn);
    }
    return e;
  }
  getTextContentSize() {
    let e = 0;
    const n = this.getChildren(), r = n.length;
    for (let o = 0; o < r; o++) {
      const i = n[o];
      e += i.getTextContentSize(), b(i) && o !== r - 1 && !i.isInline() && (e += wn.length);
    }
    return e;
  }
  getDirection() {
    return this.getLatest().__dir;
  }
  hasFormat(e) {
    if (e !== "") {
      const n = vp[e];
      return !!(this.getFormat() & n);
    }
    return !1;
  }
  select(e, n) {
    st();
    const r = $();
    let o = e, i = n;
    const s = this.getChildrenSize();
    if (!this.canBeEmpty()) {
      if (e === 0 && n === 0) {
        const a = this.getFirstChild();
        if (I(a) || b(a)) return a.select(0, 0);
      } else if (!(e !== void 0 && e !== s || n !== void 0 && n !== s)) {
        const a = this.getLastChild();
        if (I(a) || b(a)) return a.select();
      }
    }
    o === void 0 && (o = s), i === void 0 && (i = s);
    const l = this.__key;
    return A(r) ? (r.anchor.set(l, o, "element"), r.focus.set(l, i, "element"), r.dirty = !0, r) : jy(l, o, l, i, "element", "element");
  }
  selectStart() {
    const e = this.getFirstDescendant();
    return e ? e.selectStart() : this.select();
  }
  selectEnd() {
    const e = this.getLastDescendant();
    return e ? e.selectEnd() : this.select();
  }
  clear() {
    const e = this.getWritable();
    return this.getChildren().forEach((n) => n.remove()), e;
  }
  append(...e) {
    return this.splice(this.getChildrenSize(), 0, e);
  }
  setDirection(e) {
    const n = this.getWritable();
    return n.__dir = e, n;
  }
  setFormat(e) {
    return this.getWritable().__format = e !== "" ? vp[e] : 0, this;
  }
  setIndent(e) {
    return this.getWritable().__indent = e, this;
  }
  splice(e, n, r) {
    const o = r.length, i = this.getChildrenSize(), s = this.getWritable(), l = s.__key, a = [], u = [], c = this.getChildAtIndex(e + n);
    let p = null, f = i - n + o;
    if (e !== 0) if (e === i) p = this.getLastChild();
    else {
      const h = this.getChildAtIndex(e);
      h !== null && (p = h.getPreviousSibling());
    }
    if (n > 0) {
      let h = p === null ? this.getFirstChild() : p.getNextSibling();
      for (let y = 0; y < n; y++) {
        h === null && B(100);
        const _ = h.getNextSibling(), v = h.__key;
        pr(h.getWritable()), u.push(v), h = _;
      }
    }
    let m = p;
    for (let h = 0; h < o; h++) {
      const y = r[h];
      m !== null && y.is(m) && (p = m = m.getPreviousSibling());
      const _ = y.getWritable();
      _.__parent === l && f--, pr(_);
      const v = y.__key;
      if (m === null) s.__first = v, _.__prev = null;
      else {
        const d = m.getWritable();
        d.__next = v, _.__prev = d.__key;
      }
      y.__key === l && B(76), _.__parent = l, a.push(v), m = y;
    }
    if (e + n === i)
      m !== null && (m.getWritable().__next = null, s.__last = m.__key);
    else if (c !== null) {
      const h = c.getWritable();
      if (m !== null) {
        const y = m.getWritable();
        h.__prev = m.__key, y.__next = c.__key;
      } else h.__prev = null;
    }
    if (s.__size = f, u.length) {
      const h = $();
      if (A(h)) {
        const y = new Set(u), _ = new Set(a), { anchor: v, focus: d } = h;
        Zp(v, y, _) && vl(v, v.getNode(), this, p, c), Zp(d, y, _) && vl(d, d.getNode(), this, p, c), f !== 0 || this.canBeEmpty() || _t(this) || this.remove();
      }
    }
    return s;
  }
  exportJSON() {
    return { children: [], direction: this.getDirection(), format: this.getFormatType(), indent: this.getIndent(), type: "element", version: 1 };
  }
  insertNewAfter(e, n) {
    return null;
  }
  canIndent() {
    return !0;
  }
  collapseAtStart(e) {
    return !1;
  }
  excludeFromCopy(e) {
    return !1;
  }
  canReplaceWith(e) {
    return !0;
  }
  canInsertAfter(e) {
    return !0;
  }
  canBeEmpty() {
    return !0;
  }
  canInsertTextBefore() {
    return !0;
  }
  canInsertTextAfter() {
    return !0;
  }
  isInline() {
    return !1;
  }
  isShadowRoot() {
    return !1;
  }
  canMergeWith(e) {
    return !1;
  }
  extractWithChild(e, n, r) {
    return !1;
  }
}
function b(t) {
  return t instanceof St;
}
function Zp(t, e, n) {
  let r = t.getNode();
  for (; r; ) {
    const o = r.__key;
    if (e.has(o) && !n.has(o)) return !0;
    r = r.getParent();
  }
  return !1;
}
class Hy extends ia {
  constructor(e) {
    super(e);
  }
  decorate(e, n) {
    B(47);
  }
  isIsolated() {
    return !1;
  }
  isInline() {
    return !0;
  }
  isKeyboardSelectable() {
    return !0;
  }
}
function se(t) {
  return t instanceof Hy;
}
class Hi extends St {
  static getType() {
    return "root";
  }
  static clone() {
    return new Hi();
  }
  constructor() {
    super("root"), this.__cachedText = null;
  }
  getTopLevelElementOrThrow() {
    B(51);
  }
  getTextContent() {
    const e = this.__cachedText;
    return !Vi() && Ee()._dirtyType !== wr || e === null ? super.getTextContent() : e;
  }
  remove() {
    B(52);
  }
  replace(e) {
    B(53);
  }
  insertBefore(e) {
    B(54);
  }
  insertAfter(e) {
    B(55);
  }
  updateDOM(e, n) {
    return !1;
  }
  append(...e) {
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      b(r) || se(r) || B(56);
    }
    return super.append(...e);
  }
  static importJSON(e) {
    const n = ye();
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportJSON() {
    return { children: [], direction: this.getDirection(), format: this.getFormatType(), indent: this.getIndent(), type: "root", version: 1 };
  }
  collapseAtStart() {
    return !0;
  }
}
function Je(t) {
  return t instanceof Hi;
}
function Yd() {
  return new la(/* @__PURE__ */ new Map([["root", new Hi()]]));
}
function Ky(t) {
  const e = t.exportJSON(), n = t.constructor;
  if (e.type !== n.getType() && B(130, n.name), b(t)) {
    const r = e.children;
    Array.isArray(r) || B(59, n.name);
    const o = t.getChildren();
    for (let i = 0; i < o.length; i++) {
      const s = Ky(o[i]);
      r.push(s);
    }
  }
  return e;
}
class la {
  constructor(e, n) {
    this._nodeMap = e, this._selection = n || null, this._flushSync = !1, this._readOnly = !1;
  }
  isEmpty() {
    return this._nodeMap.size === 1 && this._selection === null;
  }
  read(e) {
    return Jp(this, e);
  }
  clone(e) {
    const n = new la(this._nodeMap, e === void 0 ? this._selection : e);
    return n._readOnly = !0, n;
  }
  toJSON() {
    return Jp(this, () => ({ root: Ky(ye()) }));
  }
}
class Zd extends St {
  static getType() {
    return "artificial";
  }
  createDOM(e) {
    return document.createElement("div");
  }
}
class So extends St {
  constructor(e) {
    super(e), this.__textFormat = 0;
  }
  static getType() {
    return "paragraph";
  }
  getTextFormat() {
    return this.getLatest().__textFormat;
  }
  setTextFormat(e) {
    const n = this.getWritable();
    return n.__textFormat = e, n;
  }
  hasTextFormat(e) {
    const n = mn[e];
    return !!(this.getTextFormat() & n);
  }
  static clone(e) {
    return new So(e.__key);
  }
  createDOM(e) {
    const n = document.createElement("p"), r = si(e.theme, "paragraph");
    return r !== void 0 && n.classList.add(...r), n;
  }
  updateDOM(e, n, r) {
    return !1;
  }
  static importDOM() {
    return { p: (e) => ({ conversion: wx, priority: 0 }) };
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n && on(n)) {
      this.isEmpty() && n.append(document.createElement("br"));
      const r = this.getFormatType();
      n.style.textAlign = r;
      const o = this.getDirection();
      o && (n.dir = o);
      const i = this.getIndent();
      i > 0 && (n.style.textIndent = 20 * i + "px");
    }
    return { element: n };
  }
  static importJSON(e) {
    const n = ge();
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n.setTextFormat(e.textFormat), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), textFormat: this.getTextFormat(), type: "paragraph", version: 1 };
  }
  insertNewAfter(e, n) {
    const r = ge();
    r.setTextFormat(e.format);
    const o = this.getDirection();
    return r.setDirection(o), r.setFormat(this.getFormatType()), this.insertAfter(r, n), r;
  }
  collapseAtStart() {
    const e = this.getChildren();
    if (e.length === 0 || I(e[0]) && e[0].getTextContent().trim() === "") {
      if (this.getNextSibling() !== null) return this.selectNext(), this.remove(), !0;
      if (this.getPreviousSibling() !== null) return this.selectPrevious(), this.remove(), !0;
    }
    return !1;
  }
}
function wx(t) {
  const e = ge();
  if (t.style) {
    e.setFormat(t.style.textAlign);
    const n = parseInt(t.style.textIndent, 10) / 20;
    n > 0 && e.setIndent(n);
  }
  return { node: e };
}
function ge() {
  return We(new So());
}
function Bt(t) {
  return t instanceof So;
}
const Y = 0, ie = 1, Ai = 2, Sx = 4;
function Qy(t, e, n, r) {
  const o = t._keyToDOMMap;
  o.clear(), t._editorState = Yd(), t._pendingEditorState = r, t._compositionKey = null, t._dirtyType = wr, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements.clear(), t._normalizedNodes = /* @__PURE__ */ new Set(), t._updateTags = /* @__PURE__ */ new Set(), t._updates = [], t._blockCursorElement = null;
  const i = t._observer;
  i !== null && (i.disconnect(), t._observer = null), e !== null && (e.textContent = ""), n !== null && (n.textContent = "", o.set("root", n));
}
function kx(t) {
  const e = t || {}, n = _x(), r = e.theme || {}, o = t === void 0 ? n : e.parentEditor || null, i = e.disableEvents || !1, s = Yd(), l = e.namespace || (o !== null ? o._config.namespace : vy()), a = e.editorState, u = [Hi, qn, Ui, Wi, So, Zd, ...e.nodes || []], { onError: c, html: p } = e, f = e.editable === void 0 || e.editable;
  let m;
  if (t === void 0 && n !== null) m = n._nodes;
  else {
    m = /* @__PURE__ */ new Map();
    for (let y = 0; y < u.length; y++) {
      let _ = u[y], v = null, d = null;
      if (typeof _ != "function") {
        const S = _;
        _ = S.replace, v = S.with, d = S.withKlass || null;
      }
      const g = _.getType(), x = _.transform(), w = /* @__PURE__ */ new Set();
      x !== null && w.add(x), m.set(g, { exportDOM: p && p.export ? p.export.get(_) : void 0, klass: _, replace: v, replaceWithKlass: d, transforms: w });
    }
  }
  const h = new Cx(s, o, m, { disableEvents: i, namespace: l, theme: r }, c || console.error, function(y, _) {
    const v = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set(), g = (x) => {
      Object.keys(x).forEach((w) => {
        let S = v.get(w);
        S === void 0 && (S = [], v.set(w, S)), S.push(x[w]);
      });
    };
    return y.forEach((x) => {
      const w = x.klass.importDOM;
      if (w == null || d.has(w)) return;
      d.add(w);
      const S = w.call(x.klass);
      S !== null && g(S);
    }), _ && g(_), v;
  }(m, p ? p.import : void 0), f);
  return a !== void 0 && (h._pendingEditorState = a, h._dirtyType = po), h;
}
class Cx {
  constructor(e, n, r, o, i, s, l) {
    this._parentEditor = n, this._rootElement = null, this._editorState = e, this._pendingEditorState = null, this._compositionKey = null, this._deferred = [], this._keyToDOMMap = /* @__PURE__ */ new Map(), this._updates = [], this._updating = !1, this._listeners = { decorator: /* @__PURE__ */ new Set(), editable: /* @__PURE__ */ new Set(), mutation: /* @__PURE__ */ new Map(), root: /* @__PURE__ */ new Set(), textcontent: /* @__PURE__ */ new Set(), update: /* @__PURE__ */ new Set() }, this._commands = /* @__PURE__ */ new Map(), this._config = o, this._nodes = r, this._decorators = {}, this._pendingDecorators = null, this._dirtyType = wr, this._cloneNotNeeded = /* @__PURE__ */ new Set(), this._dirtyLeaves = /* @__PURE__ */ new Set(), this._dirtyElements = /* @__PURE__ */ new Map(), this._normalizedNodes = /* @__PURE__ */ new Set(), this._updateTags = /* @__PURE__ */ new Set(), this._observer = null, this._key = vy(), this._onError = i, this._htmlConversions = s, this._editable = l, this._headless = n !== null && n._headless, this._window = null, this._blockCursorElement = null;
  }
  isComposing() {
    return this._compositionKey != null;
  }
  registerUpdateListener(e) {
    const n = this._listeners.update;
    return n.add(e), () => {
      n.delete(e);
    };
  }
  registerEditableListener(e) {
    const n = this._listeners.editable;
    return n.add(e), () => {
      n.delete(e);
    };
  }
  registerDecoratorListener(e) {
    const n = this._listeners.decorator;
    return n.add(e), () => {
      n.delete(e);
    };
  }
  registerTextContentListener(e) {
    const n = this._listeners.textcontent;
    return n.add(e), () => {
      n.delete(e);
    };
  }
  registerRootListener(e) {
    const n = this._listeners.root;
    return e(this._rootElement, null), n.add(e), () => {
      e(null, this._rootElement), n.delete(e);
    };
  }
  registerCommand(e, n, r) {
    r === void 0 && B(35);
    const o = this._commands;
    o.has(e) || o.set(e, [/* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set()]);
    const i = o.get(e);
    i === void 0 && B(36, String(e));
    const s = i[r];
    return s.add(n), () => {
      s.delete(n), i.every((l) => l.size === 0) && o.delete(e);
    };
  }
  registerMutationListener(e, n) {
    let r = this._nodes.get(e.getType());
    r === void 0 && B(37, e.name);
    let o = e, i = null;
    for (; i = r.replaceWithKlass; ) o = i, r = this._nodes.get(i.getType()), r === void 0 && B(37, i.name);
    const s = this._listeners.mutation;
    return s.set(n, o), () => {
      s.delete(n);
    };
  }
  registerNodeTransformToKlass(e, n) {
    const r = e.getType(), o = this._nodes.get(r);
    return o === void 0 && B(37, e.name), o.transforms.add(n), o;
  }
  registerNodeTransform(e, n) {
    const r = this.registerNodeTransformToKlass(e, n), o = [r], i = r.replaceWithKlass;
    if (i != null) {
      const a = this.registerNodeTransformToKlass(i, n);
      o.push(a);
    }
    var s, l;
    return s = this, l = e.getType(), ht(s, () => {
      const a = sn();
      if (a.isEmpty()) return;
      if (l === "root") return void ye().markDirty();
      const u = a._nodeMap;
      for (const [, c] of u) c.markDirty();
    }, s._pendingEditorState === null ? { tag: "history-merge" } : void 0), () => {
      o.forEach((a) => a.transforms.delete(n));
    };
  }
  hasNode(e) {
    return this._nodes.has(e.getType());
  }
  hasNodes(e) {
    return e.every(this.hasNode.bind(this));
  }
  dispatchCommand(e, n) {
    return W(this, e, n);
  }
  getDecorators() {
    return this._decorators;
  }
  getRootElement() {
    return this._rootElement;
  }
  getKey() {
    return this._key;
  }
  setRootElement(e) {
    const n = this._rootElement;
    if (e !== n) {
      const r = si(this._config.theme, "root"), o = this._pendingEditorState || this._editorState;
      if (this._rootElement = e, Qy(this, n, e, o), n !== null && (this._config.disableEvents || ux(n), r != null && n.classList.remove(...r)), e !== null) {
        const i = function(l) {
          const a = l.ownerDocument;
          return a && a.defaultView || null;
        }(e), s = e.style;
        s.userSelect = "text", s.whiteSpace = "pre-wrap", s.wordBreak = "break-word", e.setAttribute("data-lexical-editor", "true"), this._window = i, this._dirtyType = po, dy(this), this._updateTags.add("history-merge"), gr(this), this._config.disableEvents || function(l, a) {
          const u = l.ownerDocument, c = ml.get(u);
          (c === void 0 || c < 1) && u.addEventListener("selectionchange", Iy), ml.set(u, (c || 0) + 1), l.__lexicalEditor = a;
          const p = Ly(l);
          for (let f = 0; f < cc.length; f++) {
            const [m, h] = cc[f], y = typeof h == "function" ? (_) => {
              Lp(_) || ($p(_), (a.isEditable() || m === "click") && h(_, a));
            } : (_) => {
              if (Lp(_)) return;
              $p(_);
              const v = a.isEditable();
              switch (m) {
                case "cut":
                  return v && W(a, Zl, _);
                case "copy":
                  return W(a, zi, _);
                case "paste":
                  return v && W(a, vo, _);
                case "dragstart":
                  return v && W(a, Td, _);
                case "dragover":
                  return v && W(a, oy, _);
                case "dragend":
                  return v && W(a, N1, _);
                case "focus":
                  return v && W(a, Nd, _);
                case "blur":
                  return v && W(a, Xl, _);
                case "drop":
                  return v && W(a, Ed, _);
              }
            };
            l.addEventListener(m, y), p.push(() => {
              l.removeEventListener(m, y);
            });
          }
        }(e, this), r != null && e.classList.add(...r);
      } else this._editorState = o, this._pendingEditorState = null, this._window = null;
      ui("root", this, !1, e, n);
    }
  }
  getElementByKey(e) {
    return this._keyToDOMMap.get(e) || null;
  }
  getEditorState() {
    return this._editorState;
  }
  setEditorState(e, n) {
    e.isEmpty() && B(38), cy(this);
    const r = this._pendingEditorState, o = this._updateTags, i = n !== void 0 ? n.tag : null;
    r === null || r.isEmpty() || (i != null && o.add(i), gr(this)), this._pendingEditorState = e, this._dirtyType = po, this._dirtyElements.set("root", !1), this._compositionKey = null, i != null && o.add(i), gr(this);
  }
  parseEditorState(e, n) {
    return function(r, o, i) {
      const s = Yd(), l = Le, a = dt, u = Ie, c = o._dirtyElements, p = o._dirtyLeaves, f = o._cloneNotNeeded, m = o._dirtyType;
      o._dirtyElements = /* @__PURE__ */ new Map(), o._dirtyLeaves = /* @__PURE__ */ new Set(), o._cloneNotNeeded = /* @__PURE__ */ new Set(), o._dirtyType = 0, Le = s, dt = !1, Ie = o;
      try {
        const h = o._nodes;
        Jd(r.root, h), i && i(), s._readOnly = !0;
      } catch (h) {
        h instanceof Error && o._onError(h);
      } finally {
        o._dirtyElements = c, o._dirtyLeaves = p, o._cloneNotNeeded = f, o._dirtyType = m, Le = l, dt = a, Ie = u;
      }
      return s;
    }(typeof e == "string" ? JSON.parse(e) : e, this, n);
  }
  update(e, n) {
    ht(this, e, n);
  }
  focus(e, n = {}) {
    const r = this._rootElement;
    r !== null && (r.setAttribute("autocapitalize", "off"), ht(this, () => {
      const o = $(), i = ye();
      o !== null ? o.dirty = !0 : i.getChildrenSize() !== 0 && (n.defaultSelection === "rootStart" ? i.selectStart() : i.selectEnd());
    }, { onUpdate: () => {
      r.removeAttribute("autocapitalize"), e && e();
    }, tag: "focus" }), this._pendingEditorState === null && r.removeAttribute("autocapitalize"));
  }
  blur() {
    const e = this._rootElement;
    e !== null && e.blur();
    const n = qt(this._window);
    n !== null && n.removeAllRanges();
  }
  isEditable() {
    return this._editable;
  }
  setEditable(e) {
    this._editable !== e && (this._editable = e, ui("editable", this, !0, e));
  }
  toJSON() {
    return { editorState: this._editorState.toJSON() };
  }
}
const Gy = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Ex = Gy ? T.useLayoutEffect : T.useEffect, fs = { tag: "history-merge" };
function Tx({ initialConfig: t, children: e }) {
  const n = T.useMemo(() => {
    const { theme: r, namespace: o, editor__DEPRECATED: i, nodes: s, onError: l, editorState: a, html: u } = t, c = x1(null, r);
    let p = i || null;
    if (p === null) {
      const f = kx({ editable: t.editable, html: u, namespace: o, nodes: s, onError: (m) => l(m, f), theme: r });
      (function(m, h) {
        if (h !== null) {
          if (h === void 0) m.update(() => {
            const y = ye();
            if (y.isEmpty()) {
              const _ = ge();
              y.append(_);
              const v = Gy ? document.activeElement : null;
              ($() !== null || v !== null && v === m.getRootElement()) && _.select();
            }
          }, fs);
          else if (h !== null) switch (typeof h) {
            case "string": {
              const y = m.parseEditorState(h);
              m.setEditorState(y, fs);
              break;
            }
            case "object":
              m.setEditorState(h, fs);
              break;
            case "function":
              m.update(() => {
                ye().isEmpty() && h(m);
              }, fs);
          }
        }
      })(f, a), p = f;
    }
    return [p, c];
  }, []);
  return Ex(() => {
    const r = t.editable, [o] = n;
    o.setEditable(r === void 0 || r);
  }, []), O.jsx(ny.Provider, { value: n, children: e });
}
const Nx = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function bx(t) {
  return { initialValueFn: () => t.isEditable(), subscribe: (e) => t.registerEditableListener(e) };
}
function Jy() {
  return function(t) {
    const [e] = Se(), n = T.useMemo(() => t(e), [e, t]), r = T.useRef(n.initialValueFn()), [o, i] = T.useState(r.current);
    return Nx(() => {
      const { initialValueFn: s, subscribe: l } = n, a = s();
      return r.current !== a && (r.current = a, i(a)), l((u) => {
        r.current = u, i(u);
      });
    }, [n, t]), o;
  }(bx);
}
function Ox() {
  return ye().getTextContent();
}
function Ax(t, e = !0) {
  if (t) return !1;
  let n = Ox();
  return e && (n = n.trim()), n === "";
}
function Fx(t) {
  if (!Ax(t, !1)) return !1;
  const e = ye().getChildren(), n = e.length;
  if (n > 1) return !1;
  for (let r = 0; r < n; r++) {
    const o = e[r];
    if (se(o)) return !1;
    if (b(o)) {
      if (!Bt(o) || o.__indent !== 0) return !1;
      const i = o.getChildren(), s = i.length;
      for (let l = 0; l < s; l++) {
        const a = i[r];
        if (!I(a)) return !1;
      }
    }
  }
  return !0;
}
function Yy(t) {
  return () => Fx(t);
}
function Px(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
Px(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
function $x(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Zy = $x(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const Lx = /* @__PURE__ */ new Map();
function Ix(t) {
  const e = {}, n = t.split(";");
  for (const r of n) if (r !== "") {
    const [o, i] = r.split(/:([^]+)/);
    o && i && (e[o.trim()] = i.trim());
  }
  return e;
}
function Xy(t) {
  const e = t.constructor.clone(t);
  return e.__parent = t.__parent, e.__next = t.__next, e.__prev = t.__prev, b(t) && b(e) ? (r = t, (n = e).__first = r.__first, n.__last = r.__last, n.__size = r.__size, n.__format = r.__format, n.__indent = r.__indent, n.__dir = r.__dir, n) : I(t) && I(e) ? function(o, i) {
    return o.__format = i.__format, o.__style = i.__style, o.__mode = i.__mode, o.__detail = i.__detail, o;
  }(e, t) : Bt(t) && Bt(e) ? function(o, i) {
    return o.__textFormat = i.__textFormat, o;
  }(e, t) : e;
  var n, r;
}
function qy(t, e) {
  const n = t.getStartEndPoints();
  if (e.isSelected(t) && !e.isSegmented() && !e.isToken() && n !== null) {
    const [r, o] = n, i = t.isBackward(), s = r.getNode(), l = o.getNode(), a = e.is(s), u = e.is(l);
    if (a || u) {
      const [c, p] = gc(t), f = s.is(l), m = e.is(i ? l : s), h = e.is(i ? s : l);
      let y, _ = 0;
      return f ? (_ = c > p ? p : c, y = c > p ? c : p) : m ? (_ = i ? p : c, y = void 0) : h && (_ = 0, y = i ? c : p), e.__text = e.__text.slice(_, y), e;
    }
  }
  return e;
}
function Xp(t) {
  if (t.type === "text") return t.offset === t.getNode().getTextContentSize();
  const e = t.getNode();
  return b(e) || Zy(177), t.offset === e.getChildrenSize();
}
function Rx(t) {
  const e = t.getStyle(), n = Ix(e);
  Lx.set(e, n);
}
function qp(t) {
  return t.getNode().isAttached();
}
function Dx(t) {
  let e = t;
  for (; e !== null && !_t(e); ) {
    const n = e.getLatest(), r = e.getParent();
    n.getChildrenSize() === 0 && e.remove(!0), e = r;
  }
}
function zo(t, e, n = null) {
  const r = t.getStartEndPoints(), o = r ? r[0] : null, i = t.getNodes(), s = i.length;
  if (o !== null && (s === 0 || s === 1 && o.type === "element" && o.getNode().getChildrenSize() === 0)) {
    const u = o.type === "text" ? o.getNode().getParentOrThrow() : o.getNode(), c = u.getChildren();
    let p = e();
    return p.setFormat(u.getFormatType()), p.setIndent(u.getIndent()), c.forEach((f) => p.append(f)), n && (p = n.append(p)), void u.replace(p);
  }
  let l = null, a = [];
  for (let u = 0; u < s; u++) {
    const c = i[u];
    _t(c) ? (tu(t, a, a.length, e, n), a = [], l = c) : l === null || l !== null && fl(c, l) ? a.push(c) : (tu(t, a, a.length, e, n), a = [c]);
  }
  tu(t, a, a.length, e, n);
}
function tu(t, e, n, r, o = null) {
  if (e.length === 0) return;
  const i = e[0], s = /* @__PURE__ */ new Map(), l = [];
  let a = b(i) ? i : i.getParentOrThrow();
  a.isInline() && (a = a.getParentOrThrow());
  let u = !1;
  for (; a !== null; ) {
    const h = a.getPreviousSibling();
    if (h !== null) {
      a = h, u = !0;
      break;
    }
    if (a = a.getParentOrThrow(), _t(a)) break;
  }
  const c = /* @__PURE__ */ new Set();
  for (let h = 0; h < n; h++) {
    const y = e[h];
    b(y) && y.getChildrenSize() === 0 && c.add(y.getKey());
  }
  const p = /* @__PURE__ */ new Set();
  for (let h = 0; h < n; h++) {
    const y = e[h];
    let _ = y.getParent();
    if (_ !== null && _.isInline() && (_ = _.getParent()), _ !== null && Md(y) && !p.has(y.getKey())) {
      const v = _.getKey();
      if (s.get(v) === void 0) {
        const d = r();
        d.setFormat(_.getFormatType()), d.setIndent(_.getIndent()), l.push(d), s.set(v, d), _.getChildren().forEach((g) => {
          d.append(g), p.add(g.getKey()), b(g) && g.getChildrenKeys().forEach((x) => p.add(x));
        }), Dx(_);
      }
    } else if (c.has(y.getKey())) {
      b(y) || Zy(179);
      const v = r();
      v.setFormat(y.getFormatType()), v.setIndent(y.getIndent()), l.push(v), y.remove(!0);
    }
  }
  if (o !== null) for (let h = 0; h < l.length; h++) {
    const y = l[h];
    o.append(y);
  }
  let f = null;
  if (_t(a)) if (u) if (o !== null) a.insertAfter(o);
  else for (let h = l.length - 1; h >= 0; h--) {
    const y = l[h];
    a.insertAfter(y);
  }
  else {
    const h = a.getFirstChild();
    if (b(h) && (a = h), h === null) if (o) a.append(o);
    else for (let y = 0; y < l.length; y++) {
      const _ = l[y];
      a.append(_), f = _;
    }
    else if (o !== null) h.insertBefore(o);
    else for (let y = 0; y < l.length; y++) {
      const _ = l[y];
      h.insertBefore(_), f = _;
    }
  }
  else if (o) a.insertAfter(o);
  else for (let h = l.length - 1; h >= 0; h--) {
    const y = l[h];
    a.insertAfter(y), f = y;
  }
  const m = wo();
  A(m) && qp(m.anchor) && qp(m.focus) ? De(m.clone()) : f !== null ? f.selectEnd() : t.dirty = !0;
}
function _l(t, e) {
  const n = Ni(t.focus, e);
  return se(n) && !n.isIsolated() || b(n) && !n.isInline() && !n.canBeEmpty();
}
function Mx(t, e, n, r) {
  t.modify(e ? "extend" : "move", n, r);
}
function zx(t) {
  const e = t.anchor.getNode();
  return (Je(e) ? e : e.getParentOrThrow()).getDirection() === "rtl";
}
function xl(t, e, n) {
  const r = zx(t);
  Mx(t, e, n ? !r : r, "character");
}
function jx(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Bx = jx(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const ev = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Ux = ev && "documentMode" in document ? document.documentMode : null;
!(!ev || !("InputEvent" in window) || Ux) && "getTargetRanges" in new window.InputEvent("input");
function tv(...t) {
  const e = [];
  for (const n of t) if (n && typeof n == "string") for (const [r] of n.matchAll(/\S+/g)) e.push(r);
  return e;
}
function Ue(...t) {
  return () => {
    t.forEach((e) => e());
  };
}
function Ot(t, ...e) {
  const n = tv(...e);
  n.length > 0 && t.classList.add(...n);
}
function Xd(t, ...e) {
  const n = tv(...e);
  n.length > 0 && t.classList.remove(...n);
}
function nv(t, e) {
  let n = t;
  for (; n != null; ) {
    if (n instanceof e) return n;
    n = n.getParent();
  }
  return null;
}
function Wx(t) {
  const e = aa(t, (n) => b(n) && !n.isInline());
  return b(e) || Bx(4, t.__key), e;
}
const aa = (t, e) => {
  let n = t;
  for (; n !== ye() && n != null; ) {
    if (e(n)) return n;
    n = n.getParent();
  }
  return null;
};
function pn(t, e) {
  return t !== null && Object.getPrototypeOf(t).constructor.name === e.name;
}
function rv(t) {
  const e = window.location.origin, n = (r) => {
    if (r.origin !== e) return;
    const o = t.getRootElement();
    if (document.activeElement !== o) return;
    const i = r.data;
    if (typeof i == "string") {
      let s;
      try {
        s = JSON.parse(i);
      } catch {
        return;
      }
      if (s && s.protocol === "nuanria_messaging" && s.type === "request") {
        const l = s.payload;
        if (l && l.functionId === "makeChanges") {
          const a = l.args;
          if (a) {
            const [u, c, p, f, m, h] = a;
            t.update(() => {
              const y = $();
              if (A(y)) {
                const _ = y.anchor;
                let v = _.getNode(), d = 0, g = 0;
                if (I(v) && u >= 0 && c >= 0 && (d = u, g = u + c, y.setTextNodeRange(v, d, v, g)), d === g && p === "" || (y.insertRawText(p), v = _.getNode()), I(v)) {
                  d = f, g = f + m;
                  const x = v.getTextContentSize();
                  d = d > x ? x : d, g = g > x ? x : g, y.setTextNodeRange(v, d, v, g);
                }
                r.stopImmediatePropagation();
              }
            });
          }
        }
      }
    }
  };
  return window.addEventListener("message", n, !0), () => {
    window.removeEventListener("message", n, !0);
  };
}
function Vx(t, e) {
  const n = e.body ? e.body.childNodes : [];
  let r = [];
  const o = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (!iv.has(s.nodeName)) {
      const l = sv(s, t, o, !1);
      l !== null && (r = r.concat(l));
    }
  }
  return function(i) {
    for (const s of i) s.getNextSibling() instanceof Zd && s.insertAfter(en());
    for (const s of i) {
      const l = s.getChildren();
      for (const a of l) s.insertBefore(a);
      s.remove();
    }
  }(o), r;
}
function Hx(t, e) {
  if (typeof document > "u" || typeof window > "u" && global.window === void 0) throw new Error("To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom before calling this function.");
  const n = document.createElement("div"), r = ye().getChildren();
  for (let o = 0; o < r.length; o++)
    ov(t, r[o], n, e);
  return n.innerHTML;
}
function ov(t, e, n, r = null) {
  let o = r === null || e.isSelected(r);
  const i = b(e) && e.excludeFromCopy("html");
  let s = e;
  if (r !== null) {
    let m = Xy(e);
    m = I(m) && r !== null ? qy(r, m) : m, s = m;
  }
  const l = b(s) ? s.getChildren() : [], a = t._nodes.get(s.getType());
  let u;
  u = a && a.exportDOM !== void 0 ? a.exportDOM(t, s) : s.exportDOM(t);
  const { element: c, after: p } = u;
  if (!c) return !1;
  const f = document.createDocumentFragment();
  for (let m = 0; m < l.length; m++) {
    const h = l[m], y = ov(t, h, f, r);
    !o && b(e) && y && e.extractWithChild(h, r, "html") && (o = !0);
  }
  if (o && !i) {
    if (on(c) && c.append(f), n.append(c), p) {
      const m = p.call(s, c);
      m && c.replaceWith(m);
    }
  } else n.append(f);
  return o;
}
const iv = /* @__PURE__ */ new Set(["STYLE", "SCRIPT"]);
function sv(t, e, n, r, o = /* @__PURE__ */ new Map(), i) {
  let s = [];
  if (iv.has(t.nodeName)) return s;
  let l = null;
  const a = function(h, y) {
    const { nodeName: _ } = h, v = y._htmlConversions.get(_.toLowerCase());
    let d = null;
    if (v !== void 0) for (const g of v) {
      const x = g(h);
      x !== null && (d === null || (d.priority || 0) < (x.priority || 0)) && (d = x);
    }
    return d !== null ? d.conversion : null;
  }(t, e), u = a ? a(t) : null;
  let c = null;
  if (u !== null) {
    c = u.after;
    const h = u.node;
    if (l = Array.isArray(h) ? h[h.length - 1] : h, l !== null) {
      for (const [, y] of o) if (l = y(l, i), !l) break;
      l && s.push(...Array.isArray(h) ? h : [l]);
    }
    u.forChild != null && o.set(t.nodeName, u.forChild);
  }
  const p = t.childNodes;
  let f = [];
  const m = (l == null || !_t(l)) && (l != null && hc(l) || r);
  for (let h = 0; h < p.length; h++) f.push(...sv(p[h], e, n, m, new Map(o), l));
  return c != null && (f = c(f)), ix(t) && (f = Kx(t, f, m ? () => {
    const h = new Zd();
    return n.push(h), h;
  } : ge)), l == null ? s = s.concat(f) : b(l) && l.append(...f), s;
}
function Kx(t, e, n) {
  const r = t.style.textAlign, o = [];
  let i = [];
  for (let s = 0; s < e.length; s++) {
    const l = e[s];
    if (hc(l)) l.setFormat(r), o.push(l);
    else if (i.push(l), s === e.length - 1 || s < e.length - 1 && hc(e[s + 1])) {
      const a = n();
      a.setFormat(r), a.append(...i), o.push(a), i = [];
    }
  }
  return o;
}
function Qx(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var wl = Qx(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const Gx = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, lv = (t) => Gx ? (t || window).getSelection() : null;
function av(t) {
  const e = $();
  return e == null && wl(166), A(e) && e.isCollapsed() || e.getNodes().length === 0 ? "" : Hx(t, e);
}
function Jx(t) {
  const e = $();
  return e == null && wl(166), A(e) && e.isCollapsed() || e.getNodes().length === 0 ? null : JSON.stringify(Yx(t, e));
}
function eg(t, e) {
  const n = t.getData("text/plain") || t.getData("text/uri-list");
  n != null && e.insertRawText(n);
}
function tg(t, e, n) {
  const r = t.getData("application/x-lexical-editor");
  if (r) try {
    const s = JSON.parse(r);
    if (s.namespace === n._config.namespace && Array.isArray(s.nodes))
      return ng(n, Zx(s.nodes), e);
  } catch {
  }
  const o = t.getData("text/html");
  if (o) try {
    const s = new DOMParser().parseFromString(o, "text/html");
    return ng(n, Vx(n, s), e);
  } catch {
  }
  const i = t.getData("text/plain") || t.getData("text/uri-list");
  if (i != null) if (A(e)) {
    const s = i.split(/(\r?\n|\t)/);
    s[s.length - 1] === "" && s.pop();
    for (let l = 0; l < s.length; l++) {
      const a = $();
      if (A(a)) {
        const u = s[l];
        u === `
` || u === `\r
` ? a.insertParagraph() : u === "	" ? a.insertNodes([xo()]) : a.insertText(u);
      }
    }
  } else e.insertRawText(i);
}
function ng(t, e, n) {
  t.dispatchCommand(w1, { nodes: e, selection: n }) || n.insertNodes(e);
}
function uv(t, e, n, r = []) {
  let o = e === null || n.isSelected(e);
  const i = b(n) && n.excludeFromCopy("html");
  let s = n;
  if (e !== null) {
    let u = Xy(n);
    u = I(u) && e !== null ? qy(e, u) : u, s = u;
  }
  const l = b(s) ? s.getChildren() : [], a = function(u) {
    const c = u.exportJSON(), p = u.constructor;
    if (c.type !== p.getType() && wl(58, p.name), b(u)) {
      const f = c.children;
      Array.isArray(f) || wl(59, p.name);
    }
    return c;
  }(s);
  if (I(s)) {
    const u = s.__text;
    u.length > 0 ? a.text = u : o = !1;
  }
  for (let u = 0; u < l.length; u++) {
    const c = l[u], p = uv(t, e, c, a.children);
    !o && b(n) && p && n.extractWithChild(c, e, "clone") && (o = !0);
  }
  if (o && !i) r.push(a);
  else if (Array.isArray(a.children)) for (let u = 0; u < a.children.length; u++) {
    const c = a.children[u];
    r.push(c);
  }
  return o;
}
function Yx(t, e) {
  const n = [], r = ye().getChildren();
  for (let o = 0; o < r.length; o++)
    uv(t, e, r[o], n);
  return { namespace: t._config.namespace, nodes: n };
}
function Zx(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const r = t[n], o = xx(r);
    I(o) && Rx(o), e.push(o);
  }
  return e;
}
let Ar = null;
async function rg(t, e) {
  if (Ar !== null) return !1;
  if (e !== null) return new Promise((l, a) => {
    t.update(() => {
      l(og(t, e));
    });
  });
  const n = t.getRootElement(), r = t._window == null ? window.document : t._window.document, o = lv(t._window);
  if (n === null || o === null) return !1;
  const i = r.createElement("span");
  i.style.cssText = "position: fixed; top: -1000px;", i.append(r.createTextNode("#")), n.append(i);
  const s = new Range();
  return s.setStart(i, 0), s.setEnd(i, 1), o.removeAllRanges(), o.addRange(s), new Promise((l, a) => {
    const u = t.registerCommand(zi, (c) => (pn(c, ClipboardEvent) && (u(), Ar !== null && (window.clearTimeout(Ar), Ar = null), l(og(t, c))), !0), Sx);
    Ar = window.setTimeout(() => {
      u(), Ar = null, l(!1);
    }, 50), r.execCommand("copy"), i.remove();
  });
}
function og(t, e) {
  const n = lv(t._window);
  if (!n) return !1;
  const r = n.anchorNode, o = n.focusNode;
  if (r !== null && o !== null && !Bi(t, r, o)) return !1;
  e.preventDefault();
  const i = e.clipboardData, s = $();
  if (i === null || s === null) return !1;
  const l = av(t), a = Jx(t);
  let u = "";
  return s !== null && (u = s.getTextContent()), l !== null && i.setData("text/html", l), a !== null && i.setData("application/x-lexical-editor", a), i.setData("text/plain", u), !0;
}
function ig(t, e) {
  if (document.caretRangeFromPoint !== void 0) {
    const n = document.caretRangeFromPoint(t, e);
    return n === null ? null : { node: n.startContainer, offset: n.startOffset };
  }
  if (document.caretPositionFromPoint !== "undefined") {
    const n = document.caretPositionFromPoint(t, e);
    return n === null ? null : { node: n.offsetNode, offset: n.offset };
  }
  return null;
}
const ko = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Xx = ko && "documentMode" in document ? document.documentMode : null, qx = !(!ko || !("InputEvent" in window) || Xx) && "getTargetRanges" in new window.InputEvent("input"), ew = ko && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), tw = ko && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, nw = ko && /^(?=.*Chrome).*/i.test(navigator.userAgent), rw = ko && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !nw, sg = rn();
class Co extends St {
  static getType() {
    return "quote";
  }
  static clone(e) {
    return new Co(e.__key);
  }
  constructor(e) {
    super(e);
  }
  createDOM(e) {
    const n = document.createElement("blockquote");
    return Ot(n, e.theme.quote), n;
  }
  updateDOM(e, n) {
    return !1;
  }
  static importDOM() {
    return { blockquote: (e) => ({ conversion: ow, priority: 0 }) };
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n && on(n)) {
      this.isEmpty() && n.append(document.createElement("br"));
      const r = this.getFormatType();
      n.style.textAlign = r;
      const o = this.getDirection();
      o && (n.dir = o);
    }
    return { element: n };
  }
  static importJSON(e) {
    const n = ua();
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), type: "quote" };
  }
  insertNewAfter(e, n) {
    const r = ge(), o = this.getDirection();
    return r.setDirection(o), this.insertAfter(r, n), r;
  }
  collapseAtStart() {
    const e = ge();
    return this.getChildren().forEach((n) => e.append(n)), this.replace(e), !0;
  }
}
function ua() {
  return We(new Co());
}
function vc(t) {
  return t instanceof Co;
}
let ca = class cv extends St {
  static getType() {
    return "heading";
  }
  static clone(e) {
    return new cv(e.__tag, e.__key);
  }
  constructor(e, n) {
    super(n), this.__tag = e;
  }
  getTag() {
    return this.__tag;
  }
  createDOM(e) {
    const n = this.__tag, r = document.createElement(n), o = e.theme.heading;
    if (o !== void 0) {
      const i = o[n];
      Ot(r, i);
    }
    return r;
  }
  updateDOM(e, n) {
    return !1;
  }
  static importDOM() {
    return { h1: (e) => ({ conversion: Fr, priority: 0 }), h2: (e) => ({ conversion: Fr, priority: 0 }), h3: (e) => ({ conversion: Fr, priority: 0 }), h4: (e) => ({ conversion: Fr, priority: 0 }), h5: (e) => ({ conversion: Fr, priority: 0 }), h6: (e) => ({ conversion: Fr, priority: 0 }), p: (e) => {
      const n = e.firstChild;
      return n !== null && lg(n) ? { conversion: () => ({ node: null }), priority: 3 } : null;
    }, span: (e) => lg(e) ? { conversion: (n) => ({ node: Ln("h1") }), priority: 3 } : null };
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n && on(n)) {
      this.isEmpty() && n.append(document.createElement("br"));
      const r = this.getFormatType();
      n.style.textAlign = r;
      const o = this.getDirection();
      o && (n.dir = o);
    }
    return { element: n };
  }
  static importJSON(e) {
    const n = Ln(e.tag);
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), tag: this.getTag(), type: "heading", version: 1 };
  }
  insertNewAfter(e, n = !0) {
    const r = e ? e.anchor.offset : 0, o = r !== this.getTextContentSize() && e ? Ln(this.getTag()) : ge(), i = this.getDirection();
    if (o.setDirection(i), this.insertAfter(o, n), r === 0 && !this.isEmpty() && e) {
      const s = ge();
      s.select(), this.replace(s, !0);
    }
    return o;
  }
  collapseAtStart() {
    const e = this.isEmpty() ? ge() : Ln(this.getTag());
    return this.getChildren().forEach((n) => e.append(n)), this.replace(e), !0;
  }
  extractWithChild() {
    return !0;
  }
};
function lg(t) {
  return t.nodeName.toLowerCase() === "span" && t.style.fontSize === "26pt";
}
function Fr(t) {
  const e = t.nodeName.toLowerCase();
  let n = null;
  return e !== "h1" && e !== "h2" && e !== "h3" && e !== "h4" && e !== "h5" && e !== "h6" || (n = Ln(e), t.style !== null && n.setFormat(t.style.textAlign)), { node: n };
}
function ow(t) {
  const e = ua();
  return t.style !== null && e.setFormat(t.style.textAlign), { node: e };
}
function Ln(t) {
  return We(new ca(t));
}
function dv(t) {
  return t instanceof ca;
}
function ps(t) {
  let e = null;
  if (pn(t, DragEvent) ? e = t.dataTransfer : pn(t, ClipboardEvent) && (e = t.clipboardData), e === null) return [!1, [], !1];
  const n = e.types, r = n.includes("Files"), o = n.includes("text/html") || n.includes("text/plain");
  return [r, Array.from(e.files), o];
}
function ag(t) {
  const e = $();
  if (!A(e)) return !1;
  const n = /* @__PURE__ */ new Set(), r = e.getNodes();
  for (let o = 0; o < r.length; o++) {
    const i = r[o], s = i.getKey();
    if (n.has(s)) continue;
    const l = aa(i, (u) => b(u) && !u.isInline());
    if (l === null) continue;
    const a = l.getKey();
    l.canIndent() && !n.has(a) && (n.add(a), t(l));
  }
  return n.size > 0;
}
function gs(t) {
  const e = Sn(t);
  return se(e);
}
function iw(t) {
  return Ue(t.registerCommand(Ul, (e) => {
    const n = $();
    return !!$e(n) && (n.clear(), !0);
  }, 0), t.registerCommand(Zt, (e) => {
    const n = $();
    return !!A(n) && (n.deleteCharacter(e), !0);
  }, Y), t.registerCommand(co, (e) => {
    const n = $();
    return !!A(n) && (n.deleteWord(e), !0);
  }, Y), t.registerCommand(fo, (e) => {
    const n = $();
    return !!A(n) && (n.deleteLine(e), !0);
  }, Y), t.registerCommand(fr, (e) => {
    const n = $();
    if (typeof e == "string") n !== null && n.insertText(e);
    else {
      if (n === null) return !1;
      const r = e.dataTransfer;
      if (r != null) tg(r, n, t);
      else if (A(n)) {
        const o = e.data;
        return o && n.insertText(o), !0;
      }
    }
    return !0;
  }, Y), t.registerCommand(rl, () => {
    const e = $();
    return !!A(e) && (e.removeText(), !0);
  }, Y), t.registerCommand(gt, (e) => {
    const n = $();
    return !!A(n) && (n.formatText(e), !0);
  }, Y), t.registerCommand(T1, (e) => {
    const n = $();
    if (!A(n) && !$e(n)) return !1;
    const r = n.getNodes();
    for (const o of r) {
      const i = aa(o, (s) => b(s) && !s.isInline());
      i !== null && i.setFormat(e);
    }
    return !0;
  }, Y), t.registerCommand(Wn, (e) => {
    const n = $();
    return !!A(n) && (n.insertLineBreak(e), !0);
  }, Y), t.registerCommand(uo, () => {
    const e = $();
    return !!A(e) && (e.insertParagraph(), !0);
  }, Y), t.registerCommand(C1, () => (yc([xo()]), !0), Y), t.registerCommand(E1, () => ag((e) => {
    const n = e.getIndent();
    e.setIndent(n + 1);
  }), Y), t.registerCommand(yp, () => ag((e) => {
    const n = e.getIndent();
    n > 0 && e.setIndent(n - 1);
  }), Y), t.registerCommand(Ql, (e) => {
    const n = $();
    if ($e(n) && !gs(e.target)) {
      const r = n.getNodes();
      if (r.length > 0) return r[0].selectPrevious(), !0;
    } else if (A(n)) {
      const r = Ni(n.focus, !0);
      if (!e.shiftKey && se(r) && !r.isIsolated() && !r.isInline()) return r.selectPrevious(), e.preventDefault(), !0;
    }
    return !1;
  }, Y), t.registerCommand(Gl, (e) => {
    const n = $();
    if ($e(n)) {
      const r = n.getNodes();
      if (r.length > 0) return r[0].selectNext(0, 0), !0;
    } else if (A(n)) {
      if (function(o) {
        const i = o.focus;
        return i.key === "root" && i.offset === ye().getChildrenSize();
      }(n)) return e.preventDefault(), !0;
      const r = Ni(n.focus, !1);
      if (!e.shiftKey && se(r) && !r.isIsolated() && !r.isInline()) return r.selectNext(), e.preventDefault(), !0;
    }
    return !1;
  }, Y), t.registerCommand(Kl, (e) => {
    const n = $();
    if ($e(n)) {
      const r = n.getNodes();
      if (r.length > 0) return e.preventDefault(), r[0].selectPrevious(), !0;
    }
    if (!A(n)) return !1;
    if (_l(n, !0)) {
      const r = e.shiftKey;
      return e.preventDefault(), xl(n, r, !0), !0;
    }
    return !1;
  }, Y), t.registerCommand(Hl, (e) => {
    const n = $();
    if ($e(n) && !gs(e.target)) {
      const o = n.getNodes();
      if (o.length > 0) return e.preventDefault(), o[0].selectNext(0, 0), !0;
    }
    if (!A(n)) return !1;
    const r = e.shiftKey;
    return !!_l(n, !1) && (e.preventDefault(), xl(n, r, !1), !0);
  }, Y), t.registerCommand(_o, (e) => {
    if (gs(e.target)) return !1;
    const n = $();
    if (!A(n)) return !1;
    e.preventDefault();
    const { anchor: r } = n, o = r.getNode();
    return n.isCollapsed() && r.offset === 0 && !Je(o) && Wx(o).getIndent() > 0 ? t.dispatchCommand(yp, void 0) : t.dispatchCommand(Zt, !0);
  }, Y), t.registerCommand(Yl, (e) => {
    if (gs(e.target)) return !1;
    const n = $();
    return !!A(n) && (e.preventDefault(), t.dispatchCommand(Zt, !1));
  }, Y), t.registerCommand(xr, (e) => {
    const n = $();
    if (!A(n)) return !1;
    if (e !== null) {
      if ((tw || ew || rw) && qx) return !1;
      if (e.preventDefault(), e.shiftKey) return t.dispatchCommand(Wn, !1);
    }
    return t.dispatchCommand(uo, void 0);
  }, Y), t.registerCommand(Jl, () => {
    const e = $();
    return !!A(e) && (t.blur(), !0);
  }, Y), t.registerCommand(Ed, (e) => {
    const [, n] = ps(e);
    if (n.length > 0) {
      const o = ig(e.clientX, e.clientY);
      if (o !== null) {
        const { offset: i, node: s } = o, l = Sn(s);
        if (l !== null) {
          const a = By();
          if (I(l)) a.anchor.set(l.getKey(), i, "text"), a.focus.set(l.getKey(), i, "text");
          else {
            const c = l.getParentOrThrow().getKey(), p = l.getIndexWithinParent() + 1;
            a.anchor.set(c, p, "element"), a.focus.set(c, p, "element");
          }
          const u = fy(a);
          De(u);
        }
        t.dispatchCommand(sg, n);
      }
      return e.preventDefault(), !0;
    }
    const r = $();
    return !!A(r);
  }, Y), t.registerCommand(Td, (e) => {
    const [n] = ps(e), r = $();
    return !(n && !A(r));
  }, Y), t.registerCommand(oy, (e) => {
    const [n] = ps(e), r = $();
    if (n && !A(r)) return !1;
    const o = ig(e.clientX, e.clientY);
    if (o !== null) {
      const i = Sn(o.node);
      se(i) && e.preventDefault();
    }
    return !0;
  }, Y), t.registerCommand(ol, () => (xy(), !0), Y), t.registerCommand(zi, (e) => (rg(t, pn(e, ClipboardEvent) ? e : null), !0), Y), t.registerCommand(Zl, (e) => (async function(n, r) {
    await rg(r, pn(n, ClipboardEvent) ? n : null), r.update(() => {
      const o = $();
      A(o) ? o.removeText() : $e(o) && o.getNodes().forEach((i) => i.remove());
    });
  }(e, t), !0), Y), t.registerCommand(vo, (e) => {
    const [, n, r] = ps(e);
    return n.length > 0 && !r ? (t.dispatchCommand(sg, n), !0) : Dd(e.target) ? !1 : $() !== null && (function(o, i) {
      o.preventDefault(), i.update(() => {
        const s = $(), l = pn(o, InputEvent) || pn(o, KeyboardEvent) ? null : o.clipboardData;
        l != null && s !== null && tg(l, s, i);
      }, { tag: "paste" });
    }(e, t), !0);
  }, Y));
}
const _c = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function ug(t) {
  return t.getEditorState().read(Yy(t.isComposing()));
}
function sw({ contentEditable: t, placeholder: e, ErrorBoundary: n }) {
  const [r] = Se(), o = function(i, s) {
    const [l, a] = T.useState(() => i.getDecorators());
    return _c(() => i.registerDecoratorListener((u) => {
      Xt.flushSync(() => {
        a(u);
      });
    }), [i]), T.useEffect(() => {
      a(i.getDecorators());
    }, [i]), T.useMemo(() => {
      const u = [], c = Object.keys(l);
      for (let p = 0; p < c.length; p++) {
        const f = c[p], m = O.jsx(s, { onError: (y) => i._onError(y), children: O.jsx(T.Suspense, { fallback: null, children: l[f] }) }), h = i.getElementByKey(f);
        h !== null && u.push(Xt.createPortal(m, h, f));
      }
      return u;
    }, [s, l, i]);
  }(r, n);
  return function(i) {
    _c(() => Ue(iw(i), rv(i)), [i]);
  }(r), O.jsxs(O.Fragment, { children: [t, O.jsx(lw, { content: e }), o] });
}
function lw({ content: t }) {
  const [e] = Se(), n = function(o) {
    const [i, s] = T.useState(() => ug(o));
    return _c(() => {
      function l() {
        const a = ug(o);
        s(a);
      }
      return l(), Ue(o.registerUpdateListener(() => {
        l();
      }), o.registerEditableListener(() => {
        l();
      }));
    }, [o]), i;
  }(e), r = Jy();
  return n ? typeof t == "function" ? t(r) : t : null;
}
const Eo = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, aw = Eo && "documentMode" in document ? document.documentMode : null, uw = !(!Eo || !("InputEvent" in window) || aw) && "getTargetRanges" in new window.InputEvent("input"), cw = Eo && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), dw = Eo && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, fw = Eo && /^(?=.*Chrome).*/i.test(navigator.userAgent), pw = Eo && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !fw;
function cg(t, e) {
  e.update(() => {
    if (t !== null) {
      const n = pn(t, KeyboardEvent) ? null : t.clipboardData, r = $();
      if (r !== null && n != null) {
        t.preventDefault();
        const o = av(e);
        o !== null && n.setData("text/html", o), n.setData("text/plain", r.getTextContent());
      }
    }
  });
}
function gw(t) {
  return Ue(t.registerCommand(Zt, (e) => {
    const n = $();
    return !!A(n) && (n.deleteCharacter(e), !0);
  }, Y), t.registerCommand(co, (e) => {
    const n = $();
    return !!A(n) && (n.deleteWord(e), !0);
  }, Y), t.registerCommand(fo, (e) => {
    const n = $();
    return !!A(n) && (n.deleteLine(e), !0);
  }, Y), t.registerCommand(fr, (e) => {
    const n = $();
    if (!A(n)) return !1;
    if (typeof e == "string") n.insertText(e);
    else {
      const r = e.dataTransfer;
      if (r != null) eg(r, n);
      else {
        const o = e.data;
        o && n.insertText(o);
      }
    }
    return !0;
  }, Y), t.registerCommand(rl, () => {
    const e = $();
    return !!A(e) && (e.removeText(), !0);
  }, Y), t.registerCommand(Wn, (e) => {
    const n = $();
    return !!A(n) && (n.insertLineBreak(e), !0);
  }, Y), t.registerCommand(uo, () => {
    const e = $();
    return !!A(e) && (e.insertLineBreak(), !0);
  }, Y), t.registerCommand(Kl, (e) => {
    const n = $();
    if (!A(n)) return !1;
    const r = e, o = r.shiftKey;
    return !!_l(n, !0) && (r.preventDefault(), xl(n, o, !0), !0);
  }, Y), t.registerCommand(Hl, (e) => {
    const n = $();
    if (!A(n)) return !1;
    const r = e, o = r.shiftKey;
    return !!_l(n, !1) && (r.preventDefault(), xl(n, o, !1), !0);
  }, Y), t.registerCommand(_o, (e) => {
    const n = $();
    return !!A(n) && (e.preventDefault(), t.dispatchCommand(Zt, !0));
  }, Y), t.registerCommand(Yl, (e) => {
    const n = $();
    return !!A(n) && (e.preventDefault(), t.dispatchCommand(Zt, !1));
  }, Y), t.registerCommand(xr, (e) => {
    const n = $();
    if (!A(n)) return !1;
    if (e !== null) {
      if ((dw || cw || pw) && uw) return !1;
      e.preventDefault();
    }
    return t.dispatchCommand(Wn, !1);
  }, Y), t.registerCommand(ol, () => (xy(), !0), Y), t.registerCommand(zi, (e) => {
    const n = $();
    return !!A(n) && (cg(e, t), !0);
  }, Y), t.registerCommand(Zl, (e) => {
    const n = $();
    return !!A(n) && (function(r, o) {
      cg(r, o), o.update(() => {
        const i = $();
        A(i) && i.removeText();
      });
    }(e, t), !0);
  }, Y), t.registerCommand(vo, (e) => {
    const n = $();
    return !!A(n) && (function(r, o) {
      r.preventDefault(), o.update(() => {
        const i = $(), { clipboardData: s } = r;
        s != null && A(i) && eg(s, i);
      }, { tag: "paste" });
    }(e, t), !0);
  }, Y), t.registerCommand(Ed, (e) => {
    const n = $();
    return !!A(n) && (e.preventDefault(), !0);
  }, Y), t.registerCommand(Td, (e) => {
    const n = $();
    return !!A(n) && (e.preventDefault(), !0);
  }, Y));
}
const xc = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function dg(t) {
  return t.getEditorState().read(Yy(t.isComposing()));
}
function hw({ contentEditable: t, placeholder: e, ErrorBoundary: n }) {
  const [r] = Se(), o = function(i, s) {
    const [l, a] = T.useState(() => i.getDecorators());
    return xc(() => i.registerDecoratorListener((u) => {
      Xt.flushSync(() => {
        a(u);
      });
    }), [i]), T.useEffect(() => {
      a(i.getDecorators());
    }, [i]), T.useMemo(() => {
      const u = [], c = Object.keys(l);
      for (let p = 0; p < c.length; p++) {
        const f = c[p], m = O.jsx(s, { onError: (y) => i._onError(y), children: O.jsx(T.Suspense, { fallback: null, children: l[f] }) }), h = i.getElementByKey(f);
        h !== null && u.push(Xt.createPortal(m, h, f));
      }
      return u;
    }, [s, l, i]);
  }(r, n);
  return function(i) {
    xc(() => Ue(gw(i), rv(i)), [i]);
  }(r), O.jsxs(O.Fragment, { children: [t, O.jsx(mw, { content: e }), o] });
}
function mw({ content: t }) {
  const [e] = Se(), n = function(o) {
    const [i, s] = T.useState(() => dg(o));
    return xc(() => {
      function l() {
        const a = dg(o);
        s(a);
      }
      return l(), Ue(o.registerUpdateListener(() => {
        l();
      }), o.registerEditableListener(() => {
        l();
      }));
    }, [o]), i;
  }(e), r = Jy();
  return n ? typeof t == "function" ? t(r) : t : null;
}
function wc(t, e) {
  return wc = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, wc(t, e);
}
var fg = { error: null }, yw = function(t) {
  var e, n;
  function r() {
    for (var i, s = arguments.length, l = new Array(s), a = 0; a < s; a++) l[a] = arguments[a];
    return (i = t.call.apply(t, [this].concat(l)) || this).state = fg, i.resetErrorBoundary = function() {
      for (var u, c = arguments.length, p = new Array(c), f = 0; f < c; f++) p[f] = arguments[f];
      i.props.onReset == null || (u = i.props).onReset.apply(u, p), i.reset();
    }, i;
  }
  n = t, (e = r).prototype = Object.create(n.prototype), e.prototype.constructor = e, wc(e, n), r.getDerivedStateFromError = function(i) {
    return { error: i };
  };
  var o = r.prototype;
  return o.reset = function() {
    this.setState(fg);
  }, o.componentDidCatch = function(i, s) {
    var l, a;
    (l = (a = this.props).onError) == null || l.call(a, i, s);
  }, o.componentDidUpdate = function(i, s) {
    var l, a, u, c, p = this.state.error, f = this.props.resetKeys;
    p !== null && s.error !== null && ((u = i.resetKeys) === void 0 && (u = []), (c = f) === void 0 && (c = []), u.length !== c.length || u.some(function(m, h) {
      return !Object.is(m, c[h]);
    })) && ((l = (a = this.props).onResetKeysChange) == null || l.call(a, i.resetKeys, f), this.reset());
  }, o.render = function() {
    var i = this.state.error, s = this.props, l = s.fallbackRender, a = s.FallbackComponent, u = s.fallback;
    if (i !== null) {
      var c = { error: i, resetErrorBoundary: this.resetErrorBoundary };
      if (T.isValidElement(u)) return u;
      if (typeof l == "function") return l(c);
      if (a) return T.createElement(a, c);
      throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");
    }
    return this.props.children;
  }, r;
}(T.Component);
function vw({ children: t, onError: e }) {
  return O.jsx(yw, { fallback: O.jsx("div", { style: { border: "1px solid #f00", color: "#f00", padding: "8px" }, children: "An error was thrown." }), onError: e, children: t });
}
const _w = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function xw({ ariaActiveDescendant: t, ariaAutoComplete: e, ariaControls: n, ariaDescribedBy: r, ariaExpanded: o, ariaLabel: i, ariaLabelledBy: s, ariaMultiline: l, ariaOwns: a, ariaRequired: u, autoCapitalize: c, className: p, id: f, role: m = "textbox", spellCheck: h = !0, style: y, tabIndex: _, "data-testid": v, ...d }) {
  const [g] = Se(), [x, w] = T.useState(!1), S = T.useCallback((k) => {
    k && k.ownerDocument && k.ownerDocument.defaultView && g.setRootElement(k);
  }, [g]);
  return _w(() => (w(g.isEditable()), g.registerEditableListener((k) => {
    w(k);
  })), [g]), O.jsx("div", { ...d, "aria-activedescendant": x ? t : void 0, "aria-autocomplete": x ? e : "none", "aria-controls": x ? n : void 0, "aria-describedby": r, "aria-expanded": x && m === "combobox" ? !!o : void 0, "aria-label": i, "aria-labelledby": s, "aria-multiline": l, "aria-owns": x ? a : void 0, "aria-readonly": !x || void 0, "aria-required": u, autoCapitalize: c, className: p, contentEditable: x, "data-testid": v, id: f, ref: S, role: m, spellCheck: h, style: y, tabIndex: _ });
}
function ww({ defaultSelection: t }) {
  const [e] = Se();
  return T.useEffect(() => {
    e.focus(() => {
      const n = document.activeElement, r = e.getRootElement();
      r === null || n !== null && r.contains(n) || r.focus({ preventScroll: !0 });
    }, { defaultSelection: t });
  }, [t, e]), null;
}
const hs = 0, Sc = 1, kc = 2, Lt = 0, Sw = 1, pg = 2, kw = 3, Cw = 4;
function Ew(t, e, n, r, o) {
  if (t === null || n.size === 0 && r.size === 0 && !o) return Lt;
  const i = e._selection, s = t._selection;
  if (o) return Sw;
  if (!(A(i) && A(s) && s.isCollapsed() && i.isCollapsed())) return Lt;
  const l = function(v, d, g) {
    const x = v._nodeMap, w = [];
    for (const S of d) {
      const k = x.get(S);
      k !== void 0 && w.push(k);
    }
    for (const [S, k] of g) {
      if (!k) continue;
      const C = x.get(S);
      C === void 0 || Je(C) || w.push(C);
    }
    return w;
  }(e, n, r);
  if (l.length === 0) return Lt;
  if (l.length > 1) {
    const v = e._nodeMap, d = v.get(i.anchor.key), g = v.get(s.anchor.key);
    return d && g && !t._nodeMap.has(d.__key) && I(d) && d.__text.length === 1 && i.anchor.offset === 1 ? pg : Lt;
  }
  const a = l[0], u = t._nodeMap.get(a.__key);
  if (!I(u) || !I(a) || u.__mode !== a.__mode) return Lt;
  const c = u.__text, p = a.__text;
  if (c === p) return Lt;
  const f = i.anchor, m = s.anchor;
  if (f.key !== m.key || f.type !== "text") return Lt;
  const h = f.offset, y = m.offset, _ = p.length - c.length;
  return _ === 1 && y === h - 1 ? pg : _ === -1 && y === h + 1 ? kw : _ === -1 && y === h ? Cw : Lt;
}
function Tw(t, e) {
  let n = Date.now(), r = Lt;
  return (o, i, s, l, a, u) => {
    const c = Date.now();
    if (u.has("historic")) return r = Lt, n = c, kc;
    const p = Ew(o, i, l, a, t.isComposing()), f = (() => {
      const m = s === null || s.editor === t, h = u.has("history-push");
      if (!h && m && u.has("history-merge")) return hs;
      if (o === null) return Sc;
      const y = i._selection;
      return l.size > 0 || a.size > 0 ? h === !1 && p !== Lt && p === r && c < n + e && m || l.size === 1 && function(_, v, d) {
        const g = v._nodeMap.get(_), x = d._nodeMap.get(_), w = v._selection, S = d._selection;
        let k = !1;
        return A(w) && A(S) && (k = w.anchor.type === "element" && w.focus.type === "element" && S.anchor.type === "text" && S.focus.type === "text"), !(k || !I(g) || !I(x)) && g.__type === x.__type && g.__text === x.__text && g.__mode === x.__mode && g.__detail === x.__detail && g.__style === x.__style && g.__format === x.__format && g.__parent === x.__parent;
      }(Array.from(l)[0], o, i) ? hs : Sc : y !== null ? hs : kc;
    })();
    return n = c, r = p, f;
  };
}
function gg(t) {
  t.undoStack = [], t.redoStack = [], t.current = null;
}
function Nw(t, e, n) {
  const r = Tw(t, n);
  return Ue(t.registerCommand(Wl, () => (function(i, s) {
    const l = s.redoStack, a = s.undoStack;
    if (a.length !== 0) {
      const u = s.current, c = a.pop();
      u !== null && (l.push(u), i.dispatchCommand(Vo, !0)), a.length === 0 && i.dispatchCommand(Ho, !1), s.current = c || null, c && c.editor.setEditorState(c.editorState, { tag: "historic" });
    }
  }(t, e), !0), Y), t.registerCommand(Vl, () => (function(i, s) {
    const l = s.redoStack, a = s.undoStack;
    if (l.length !== 0) {
      const u = s.current;
      u !== null && (a.push(u), i.dispatchCommand(Ho, !0));
      const c = l.pop();
      l.length === 0 && i.dispatchCommand(Vo, !1), s.current = c || null, c && c.editor.setEditorState(c.editorState, { tag: "historic" });
    }
  }(t, e), !0), Y), t.registerCommand(b1, () => (gg(e), !1), Y), t.registerCommand(O1, () => (gg(e), t.dispatchCommand(Vo, !1), t.dispatchCommand(Ho, !1), !0), Y), t.registerUpdateListener(({ editorState: i, prevEditorState: s, dirtyLeaves: l, dirtyElements: a, tags: u }) => {
    const c = e.current, p = e.redoStack, f = e.undoStack, m = c === null ? null : c.editorState;
    if (c !== null && i === m) return;
    const h = r(s, i, c, l, a, u);
    if (h === Sc) p.length !== 0 && (e.redoStack = [], t.dispatchCommand(Vo, !1)), c !== null && (f.push({ ...c }), t.dispatchCommand(Ho, !0));
    else if (h === kc) return;
    e.current = { editor: t, editorState: i };
  }));
}
function bw() {
  return { current: null, redoStack: [], undoStack: [] };
}
function Ow({ externalHistoryState: t }) {
  const [e] = Se();
  return function(n, r, o = 1e3) {
    const i = T.useMemo(() => r || bw(), [r]);
    T.useEffect(() => Nw(n, i, o), [o, n, i]);
  }(e, t), null;
}
const fv = /^(\d+(?:\.\d+)?)px$/, Sl = { BOTH: 3, COLUMN: 2, NO_STATUS: 0, ROW: 1 };
let qd = class pv extends St {
  static getType() {
    return "tablecell";
  }
  static clone(e) {
    const n = new pv(e.__headerState, e.__colSpan, e.__width, e.__key);
    return n.__rowSpan = e.__rowSpan, n.__backgroundColor = e.__backgroundColor, n;
  }
  static importDOM() {
    return { td: (e) => ({ conversion: hg, priority: 0 }), th: (e) => ({ conversion: hg, priority: 0 }) };
  }
  static importJSON(e) {
    const n = e.colSpan || 1, r = e.rowSpan || 1, o = gv(e.headerState, n, e.width || void 0);
    return o.__rowSpan = r, o.__backgroundColor = e.backgroundColor || null, o;
  }
  constructor(e = Sl.NO_STATUS, n = 1, r, o) {
    super(o), this.__colSpan = n, this.__rowSpan = 1, this.__headerState = e, this.__width = r, this.__backgroundColor = null;
  }
  createDOM(e) {
    const n = document.createElement(this.getTag());
    return this.__width && (n.style.width = `${this.__width}px`), this.__colSpan > 1 && (n.colSpan = this.__colSpan), this.__rowSpan > 1 && (n.rowSpan = this.__rowSpan), this.__backgroundColor !== null && (n.style.backgroundColor = this.__backgroundColor), Ot(n, e.theme.tableCell, this.hasHeader() && e.theme.tableCellHeader), n;
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n) {
      const r = n;
      r.style.border = "1px solid black", this.__colSpan > 1 && (r.colSpan = this.__colSpan), this.__rowSpan > 1 && (r.rowSpan = this.__rowSpan), r.style.width = `${this.getWidth() || 75}px`, r.style.verticalAlign = "top", r.style.textAlign = "start";
      const o = this.getBackgroundColor();
      o !== null ? r.style.backgroundColor = o : this.hasHeader() && (r.style.backgroundColor = "#f2f3f5");
    }
    return { element: n };
  }
  exportJSON() {
    return { ...super.exportJSON(), backgroundColor: this.getBackgroundColor(), colSpan: this.__colSpan, headerState: this.__headerState, rowSpan: this.__rowSpan, type: "tablecell", width: this.getWidth() };
  }
  getColSpan() {
    return this.__colSpan;
  }
  setColSpan(e) {
    return this.getWritable().__colSpan = e, this;
  }
  getRowSpan() {
    return this.__rowSpan;
  }
  setRowSpan(e) {
    return this.getWritable().__rowSpan = e, this;
  }
  getTag() {
    return this.hasHeader() ? "th" : "td";
  }
  setHeaderStyles(e) {
    return this.getWritable().__headerState = e, this.__headerState;
  }
  getHeaderStyles() {
    return this.getLatest().__headerState;
  }
  setWidth(e) {
    return this.getWritable().__width = e, this.__width;
  }
  getWidth() {
    return this.getLatest().__width;
  }
  getBackgroundColor() {
    return this.getLatest().__backgroundColor;
  }
  setBackgroundColor(e) {
    this.getWritable().__backgroundColor = e;
  }
  toggleHeaderStyle(e) {
    const n = this.getWritable();
    return (n.__headerState & e) === e ? n.__headerState -= e : n.__headerState += e, n;
  }
  hasHeaderState(e) {
    return (this.getHeaderStyles() & e) === e;
  }
  hasHeader() {
    return this.getLatest().__headerState !== Sl.NO_STATUS;
  }
  updateDOM(e) {
    return e.__headerState !== this.__headerState || e.__width !== this.__width || e.__colSpan !== this.__colSpan || e.__rowSpan !== this.__rowSpan || e.__backgroundColor !== this.__backgroundColor;
  }
  isShadowRoot() {
    return !0;
  }
  collapseAtStart() {
    return !0;
  }
  canBeEmpty() {
    return !1;
  }
  canIndent() {
    return !1;
  }
};
function hg(t) {
  const e = t, n = t.nodeName.toLowerCase();
  let r;
  fv.test(e.style.width) && (r = parseFloat(e.style.width));
  const o = gv(n === "th" ? Sl.ROW : Sl.NO_STATUS, e.colSpan, r);
  o.__rowSpan = e.rowSpan;
  const i = e.style.backgroundColor;
  i !== "" && (o.__backgroundColor = i);
  const s = e.style, l = s.textDecoration.split(" "), a = s.fontWeight === "700" || s.fontWeight === "bold", u = l.includes("line-through"), c = s.fontStyle === "italic", p = l.includes("underline");
  return { after: (f) => (f.length === 0 && f.push(ge()), f), forChild: (f, m) => {
    if (hv(m) && !b(f)) {
      const h = ge();
      return Hn(f) && f.getTextContent() === `
` ? null : (I(f) && (a && f.toggleFormat("bold"), u && f.toggleFormat("strikethrough"), c && f.toggleFormat("italic"), p && f.toggleFormat("underline")), h.append(f), h);
    }
    return f;
  }, node: o };
}
function gv(t, e = 1, n) {
  return We(new qd(t, e, n));
}
function hv(t) {
  return t instanceof qd;
}
let ef = class mv extends St {
  static getType() {
    return "tablerow";
  }
  static clone(e) {
    return new mv(e.__height, e.__key);
  }
  static importDOM() {
    return { tr: (e) => ({ conversion: Aw, priority: 0 }) };
  }
  static importJSON(e) {
    return yv(e.height);
  }
  constructor(e, n) {
    super(n), this.__height = e;
  }
  exportJSON() {
    return { ...super.exportJSON(), ...this.getHeight() && { height: this.getHeight() }, type: "tablerow", version: 1 };
  }
  createDOM(e) {
    const n = document.createElement("tr");
    return this.__height && (n.style.height = `${this.__height}px`), Ot(n, e.theme.tableRow), n;
  }
  isShadowRoot() {
    return !0;
  }
  setHeight(e) {
    return this.getWritable().__height = e, this.__height;
  }
  getHeight() {
    return this.getLatest().__height;
  }
  updateDOM(e) {
    return e.__height !== this.__height;
  }
  canBeEmpty() {
    return !1;
  }
  canIndent() {
    return !1;
  }
};
function Aw(t) {
  const e = t;
  let n;
  return fv.test(e.style.height) && (n = parseFloat(e.style.height)), { node: yv(n) };
}
function yv(t) {
  return We(new ef(t));
}
function Fw(t) {
  return t instanceof ef;
}
function Pw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
Pw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
let vv = class _v extends St {
  static getType() {
    return "table";
  }
  static clone(e) {
    return new _v(e.__key);
  }
  static importDOM() {
    return { table: (e) => ({ conversion: $w, priority: 1 }) };
  }
  static importJSON(e) {
    return xv();
  }
  constructor(e) {
    super(e);
  }
  exportJSON() {
    return { ...super.exportJSON(), type: "table", version: 1 };
  }
  createDOM(e, n) {
    const r = document.createElement("table");
    return Ot(r, e.theme.table), r;
  }
  updateDOM() {
    return !1;
  }
  exportDOM(e) {
    return { ...super.exportDOM(e), after: (n) => {
      if (n) {
        const r = n.cloneNode(), o = document.createElement("colgroup"), i = document.createElement("tbody");
        on(n) && i.append(...n.children);
        const s = this.getFirstChildOrThrow();
        if (!Fw(s)) throw new Error("Expected to find row node.");
        const l = s.getChildrenSize();
        for (let a = 0; a < l; a++) {
          const u = document.createElement("col");
          o.append(u);
        }
        return r.replaceChildren(o, i), r;
      }
    } };
  }
  canBeEmpty() {
    return !1;
  }
  isShadowRoot() {
    return !0;
  }
  getCordsFromCellNode(e, n) {
    const { rows: r, domRows: o } = n;
    for (let i = 0; i < r; i++) {
      const s = o[i];
      if (s == null) continue;
      const l = s.findIndex((a) => {
        if (!a) return;
        const { elem: u } = a;
        return Sn(u) === e;
      });
      if (l !== -1) return { x: l, y: i };
    }
    throw new Error("Cell not found in table.");
  }
  getDOMCellFromCords(e, n, r) {
    const { domRows: o } = r, i = o[n];
    if (i == null) return null;
    const s = i[e];
    return s ?? null;
  }
  getDOMCellFromCordsOrThrow(e, n, r) {
    const o = this.getDOMCellFromCords(e, n, r);
    if (!o) throw new Error("Cell not found at cords.");
    return o;
  }
  getCellNodeFromCords(e, n, r) {
    const o = this.getDOMCellFromCords(e, n, r);
    if (o == null) return null;
    const i = Sn(o.elem);
    return hv(i) ? i : null;
  }
  getCellNodeFromCordsOrThrow(e, n, r) {
    const o = this.getCellNodeFromCords(e, n, r);
    if (!o) throw new Error("Node at cords not TableCellNode.");
    return o;
  }
  canSelectBefore() {
    return !0;
  }
  canIndent() {
    return !1;
  }
};
function $w(t) {
  return { node: xv() };
}
function xv() {
  return We(new vv());
}
function Lw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var gn = Lw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
function Iw(t) {
  let e = 1, n = t.getParent();
  for (; n != null; ) {
    if (he(n)) {
      const r = n.getParent();
      if (ee(r)) {
        e++, n = r.getParent();
        continue;
      }
      gn(40);
    }
    return e;
  }
  return e;
}
function Cc(t) {
  let e = t.getParent();
  ee(e) || gn(40);
  let n = e;
  for (; n !== null; ) n = n.getParent(), ee(n) && (e = n);
  return e;
}
function wv(t) {
  let e = [];
  const n = t.getChildren().filter(he);
  for (let r = 0; r < n.length; r++) {
    const o = n[r], i = o.getFirstChild();
    ee(i) ? e = e.concat(wv(i)) : e.push(o);
  }
  return e;
}
function Kt(t) {
  return he(t) && ee(t.getFirstChild());
}
function mg(t) {
  return ft().append(t);
}
function Sv(t, e) {
  return he(t) && (e.length === 0 || e.length === 1 && t.is(e[0]) && t.getChildrenSize() === 0);
}
function yg(t, e) {
  t.update(() => {
    const n = $();
    if (n !== null) {
      const r = n.getNodes();
      if (A(n)) {
        const i = n.getStartEndPoints();
        i === null && gn(143);
        const [s] = i, l = s.getNode(), a = l.getParent();
        if (Sv(l, r)) {
          const u = nt(e);
          if (_t(a)) {
            l.replace(u);
            const c = ft();
            b(l) && (c.setFormat(l.getFormatType()), c.setIndent(l.getIndent())), u.append(c);
          } else if (he(l)) {
            const c = l.getParentOrThrow();
            kr(u, c.getChildren()), c.replace(u);
          }
          return;
        }
      }
      const o = /* @__PURE__ */ new Set();
      for (let i = 0; i < r.length; i++) {
        const s = r[i];
        if (!b(s) || !s.isEmpty() || he(s) || o.has(s.getKey())) {
          if (Md(s)) {
            let l = s.getParent();
            for (; l != null; ) {
              const a = l.getKey();
              if (ee(l)) {
                if (!o.has(a)) {
                  const u = nt(e);
                  kr(u, l.getChildren()), l.replace(u), o.add(a);
                }
                break;
              }
              {
                const u = l.getParent();
                if (_t(u) && !o.has(a)) {
                  o.add(a), vg(l, e);
                  break;
                }
                l = u;
              }
            }
          }
        } else vg(s, e);
      }
    }
  });
}
function kr(t, e) {
  t.splice(t.getChildrenSize(), 0, e);
}
function vg(t, e) {
  if (ee(t)) return t;
  const n = t.getPreviousSibling(), r = t.getNextSibling(), o = ft();
  if (o.setFormat(t.getFormatType()), o.setIndent(t.getIndent()), kr(o, t.getChildren()), ee(n) && e === n.getListType()) return n.append(o), t.remove(), ee(r) && e === r.getListType() && (kr(n, r.getChildren()), r.remove()), n;
  if (ee(r) && e === r.getListType()) return r.getFirstChildOrThrow().insertBefore(o), t.remove(), r;
  {
    const i = nt(e);
    return i.append(o), t.replace(i), i;
  }
}
function tf(t, e) {
  const n = t.getLastChild(), r = e.getFirstChild();
  n && r && Kt(n) && Kt(r) && (tf(n.getFirstChild(), r.getFirstChild()), r.remove());
  const o = e.getChildren();
  o.length > 0 && t.append(...o), e.remove();
}
function Rw(t) {
  t.update(() => {
    const e = $();
    if (A(e)) {
      const n = /* @__PURE__ */ new Set(), r = e.getNodes(), o = e.anchor.getNode();
      if (Sv(o, r)) n.add(Cc(o));
      else for (let i = 0; i < r.length; i++) {
        const s = r[i];
        if (Md(s)) {
          const l = nv(s, Nr);
          l != null && n.add(Cc(l));
        }
      }
      for (const i of n) {
        let s = i;
        const l = wv(i);
        for (const a of l) {
          const u = ge();
          kr(u, a.getChildren()), s.insertAfter(u), s = u, a.__key === e.anchor.key && e.anchor.set(u.getKey(), 0, "element"), a.__key === e.focus.key && e.focus.set(u.getKey(), 0, "element"), a.remove();
        }
        i.remove();
      }
    }
  });
}
function Dw(t) {
  const e = /* @__PURE__ */ new Set();
  if (Kt(t) || e.has(t.getKey())) return;
  const n = t.getParent(), r = t.getNextSibling(), o = t.getPreviousSibling();
  if (Kt(r) && Kt(o)) {
    const i = o.getFirstChild();
    if (ee(i)) {
      i.append(t);
      const s = r.getFirstChild();
      ee(s) && (kr(i, s.getChildren()), r.remove(), e.add(r.getKey()));
    }
  } else if (Kt(r)) {
    const i = r.getFirstChild();
    if (ee(i)) {
      const s = i.getFirstChild();
      s !== null && s.insertBefore(t);
    }
  } else if (Kt(o)) {
    const i = o.getFirstChild();
    ee(i) && i.append(t);
  } else if (ee(n)) {
    const i = ft(), s = nt(n.getListType());
    i.append(s), s.append(t), o ? o.insertAfter(i) : r ? r.insertBefore(i) : n.append(i);
  }
}
function Mw(t) {
  if (Kt(t)) return;
  const e = t.getParent(), n = e ? e.getParent() : void 0;
  if (ee(n ? n.getParent() : void 0) && he(n) && ee(e)) {
    const r = e ? e.getFirstChild() : void 0, o = e ? e.getLastChild() : void 0;
    if (t.is(r)) n.insertBefore(t), e.isEmpty() && n.remove();
    else if (t.is(o)) n.insertAfter(t), e.isEmpty() && n.remove();
    else {
      const i = e.getListType(), s = ft(), l = nt(i);
      s.append(l), t.getPreviousSiblings().forEach((c) => l.append(c));
      const a = ft(), u = nt(i);
      a.append(u), kr(u, t.getNextSiblings()), n.insertBefore(s), n.insertAfter(a), n.replace(t);
    }
  }
}
function zw() {
  const t = $();
  if (!A(t) || !t.isCollapsed()) return !1;
  const e = t.anchor.getNode();
  if (!he(e) || e.getChildrenSize() !== 0) return !1;
  const n = Cc(e), r = e.getParent();
  ee(r) || gn(40);
  const o = r.getParent();
  let i;
  if (_t(o)) i = ge(), n.insertAfter(i);
  else {
    if (!he(o)) return !1;
    i = ft(), o.insertAfter(i);
  }
  i.select();
  const s = e.getNextSiblings();
  if (s.length > 0) {
    const l = nt(r.getListType());
    if (Bt(i)) i.insertAfter(l);
    else {
      const a = ft();
      a.append(l), i.insertAfter(a);
    }
    s.forEach((a) => {
      a.remove(), l.append(a);
    });
  }
  return function(l) {
    let a = l;
    for (; a.getNextSibling() == null && a.getPreviousSibling() == null; ) {
      const u = a.getParent();
      if (u == null || !he(a) && !ee(a)) break;
      a = u;
    }
    a.remove();
  }(e), !0;
}
function kl(...t) {
  const e = [];
  for (const n of t) if (n && typeof n == "string") for (const [r] of n.matchAll(/\S+/g)) e.push(r);
  return e;
}
let Nr = class kv extends St {
  static getType() {
    return "listitem";
  }
  static clone(e) {
    return new kv(e.__value, e.__checked, e.__key);
  }
  constructor(e, n, r) {
    super(r), this.__value = e === void 0 ? 1 : e, this.__checked = n;
  }
  createDOM(e) {
    const n = document.createElement("li"), r = this.getParent();
    return ee(r) && r.getListType() === "check" && xg(n, this, null), n.value = this.__value, _g(n, e.theme, this), n;
  }
  updateDOM(e, n, r) {
    const o = this.getParent();
    return ee(o) && o.getListType() === "check" && xg(n, this, e), n.value = this.__value, _g(n, r.theme, this), !1;
  }
  static transform() {
    return (e) => {
      if (he(e) || gn(144), e.__checked == null) return;
      const n = e.getParent();
      ee(n) && n.getListType() !== "check" && e.getChecked() != null && e.setChecked(void 0);
    };
  }
  static importDOM() {
    return { li: () => ({ conversion: jw, priority: 0 }) };
  }
  static importJSON(e) {
    const n = ft();
    return n.setChecked(e.checked), n.setValue(e.value), n.setFormat(e.format), n.setDirection(e.direction), n;
  }
  exportDOM(e) {
    const n = this.createDOM(e._config);
    return n.style.textAlign = this.getFormatType(), { element: n };
  }
  exportJSON() {
    return { ...super.exportJSON(), checked: this.getChecked(), type: "listitem", value: this.getValue(), version: 1 };
  }
  append(...e) {
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      if (b(r) && this.canMergeWith(r)) {
        const o = r.getChildren();
        this.append(...o), r.remove();
      } else super.append(r);
    }
    return this;
  }
  replace(e, n) {
    if (he(e)) return super.replace(e);
    this.setIndent(0);
    const r = this.getParentOrThrow();
    if (!ee(r)) return e;
    if (r.__first === this.getKey()) r.insertBefore(e);
    else if (r.__last === this.getKey()) r.insertAfter(e);
    else {
      const o = nt(r.getListType());
      let i = this.getNextSibling();
      for (; i; ) {
        const s = i;
        i = i.getNextSibling(), o.append(s);
      }
      r.insertAfter(e), e.insertAfter(o);
    }
    return n && (b(e) || gn(139), this.getChildren().forEach((o) => {
      e.append(o);
    })), this.remove(), r.getChildrenSize() === 0 && r.remove(), e;
  }
  insertAfter(e, n = !0) {
    const r = this.getParentOrThrow();
    if (ee(r) || gn(39), he(e)) return super.insertAfter(e, n);
    const o = this.getNextSiblings();
    if (r.insertAfter(e, n), o.length !== 0) {
      const i = nt(r.getListType());
      o.forEach((s) => i.append(s)), e.insertAfter(i, n);
    }
    return e;
  }
  remove(e) {
    const n = this.getPreviousSibling(), r = this.getNextSibling();
    super.remove(e), n && r && Kt(n) && Kt(r) && (tf(n.getFirstChild(), r.getFirstChild()), r.remove());
  }
  insertNewAfter(e, n = !0) {
    const r = ft(this.__checked == null && void 0);
    return this.insertAfter(r, n), r;
  }
  collapseAtStart(e) {
    const n = ge();
    this.getChildren().forEach((s) => n.append(s));
    const r = this.getParentOrThrow(), o = r.getParentOrThrow(), i = he(o);
    if (r.getChildrenSize() === 1) if (i) r.remove(), o.select();
    else {
      r.insertBefore(n), r.remove();
      const s = e.anchor, l = e.focus, a = n.getKey();
      s.type === "element" && s.getNode().is(this) && s.set(a, s.offset, "element"), l.type === "element" && l.getNode().is(this) && l.set(a, l.offset, "element");
    }
    else r.insertBefore(n), this.remove();
    return !0;
  }
  getValue() {
    return this.getLatest().__value;
  }
  setValue(e) {
    this.getWritable().__value = e;
  }
  getChecked() {
    return this.getLatest().__checked;
  }
  setChecked(e) {
    this.getWritable().__checked = e;
  }
  toggleChecked() {
    this.setChecked(!this.__checked);
  }
  getIndent() {
    const e = this.getParent();
    if (e === null) return this.getLatest().__indent;
    let n = e.getParentOrThrow(), r = 0;
    for (; he(n); ) n = n.getParentOrThrow().getParentOrThrow(), r++;
    return r;
  }
  setIndent(e) {
    typeof e == "number" && e > -1 || gn(117);
    let n = this.getIndent();
    for (; n !== e; ) n < e ? (Dw(this), n++) : (Mw(this), n--);
    return this;
  }
  canInsertAfter(e) {
    return he(e);
  }
  canReplaceWith(e) {
    return he(e);
  }
  canMergeWith(e) {
    return Bt(e) || he(e);
  }
  extractWithChild(e, n) {
    if (!A(n)) return !1;
    const r = n.anchor.getNode(), o = n.focus.getNode();
    return this.isParentOf(r) && this.isParentOf(o) && this.getTextContent().length === n.getTextContent().length;
  }
  isParentRequired() {
    return !0;
  }
  createParentElementNode() {
    return nt("bullet");
  }
};
function _g(t, e, n) {
  const r = [], o = [], i = e.list, s = i ? i.listitem : void 0;
  let l;
  if (i && i.nested && (l = i.nested.listitem), s !== void 0 && r.push(...kl(s)), i) {
    const a = n.getParent(), u = ee(a) && a.getListType() === "check", c = n.getChecked();
    u && !c || o.push(i.listitemUnchecked), u && c || o.push(i.listitemChecked), u && r.push(c ? i.listitemChecked : i.listitemUnchecked);
  }
  if (l !== void 0) {
    const a = kl(l);
    n.getChildren().some((u) => ee(u)) ? r.push(...a) : o.push(...a);
  }
  o.length > 0 && Xd(t, ...o), r.length > 0 && Ot(t, ...r);
}
function xg(t, e, n, r) {
  ee(e.getFirstChild()) ? (t.removeAttribute("role"), t.removeAttribute("tabIndex"), t.removeAttribute("aria-checked")) : (t.setAttribute("role", "checkbox"), t.setAttribute("tabIndex", "-1"), n && e.__checked === n.__checked || t.setAttribute("aria-checked", e.getChecked() ? "true" : "false"));
}
function jw(t) {
  if (t.classList.contains("task-list-item")) {
    for (const n of t.children) if (n.tagName === "INPUT") return Bw(n);
  }
  const e = t.getAttribute("aria-checked");
  return { node: ft(e === "true" || e !== "false" && void 0) };
}
function Bw(t) {
  return t.getAttribute("type") !== "checkbox" ? { node: null } : { node: ft(t.hasAttribute("checked")) };
}
function ft(t) {
  return We(new Nr(void 0, t));
}
function he(t) {
  return t instanceof Nr;
}
let br = class Cv extends St {
  static getType() {
    return "list";
  }
  static clone(e) {
    const n = e.__listType || kg[e.__tag];
    return new Cv(n, e.__start, e.__key);
  }
  constructor(e, n, r) {
    super(r);
    const o = kg[e] || e;
    this.__listType = o, this.__tag = o === "number" ? "ol" : "ul", this.__start = n;
  }
  getTag() {
    return this.__tag;
  }
  setListType(e) {
    const n = this.getWritable();
    n.__listType = e, n.__tag = e === "number" ? "ol" : "ul";
  }
  getListType() {
    return this.__listType;
  }
  getStart() {
    return this.__start;
  }
  createDOM(e, n) {
    const r = this.__tag, o = document.createElement(r);
    return this.__start !== 1 && o.setAttribute("start", String(this.__start)), o.__lexicalListType = this.__listType, wg(o, e.theme, this), o;
  }
  updateDOM(e, n, r) {
    return e.__tag !== this.__tag || (wg(n, r.theme, this), !1);
  }
  static transform() {
    return (e) => {
      ee(e) || gn(163), function(n) {
        const r = n.getNextSibling();
        ee(r) && n.getListType() === r.getListType() && tf(n, r);
      }(e), function(n) {
        const r = n.getListType() !== "check";
        let o = n.getStart();
        for (const i of n.getChildren()) he(i) && (i.getValue() !== o && i.setValue(o), r && i.getChecked() != null && i.setChecked(void 0), ee(i.getFirstChild()) || o++);
      }(e);
    };
  }
  static importDOM() {
    return { ol: () => ({ conversion: Sg, priority: 0 }), ul: () => ({ conversion: Sg, priority: 0 }) };
  }
  static importJSON(e) {
    const n = nt(e.listType, e.start);
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    return n && on(n) && (this.__start !== 1 && n.setAttribute("start", String(this.__start)), this.__listType === "check" && n.setAttribute("__lexicalListType", "check")), { element: n };
  }
  exportJSON() {
    return { ...super.exportJSON(), listType: this.getListType(), start: this.getStart(), tag: this.getTag(), type: "list", version: 1 };
  }
  canBeEmpty() {
    return !1;
  }
  canIndent() {
    return !1;
  }
  append(...e) {
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      if (he(r)) super.append(r);
      else {
        const o = ft();
        if (ee(r)) o.append(r);
        else if (b(r)) {
          const i = oe(r.getTextContent());
          o.append(i);
        } else o.append(r);
        super.append(o);
      }
    }
    return this;
  }
  extractWithChild(e) {
    return he(e);
  }
};
function wg(t, e, n) {
  const r = [], o = [], i = e.list;
  if (i !== void 0) {
    const s = i[`${n.__tag}Depth`] || [], l = Iw(n) - 1, a = l % s.length, u = s[a], c = i[n.__tag];
    let p;
    const f = i.nested, m = i.checklist;
    if (f !== void 0 && f.list && (p = f.list), c !== void 0 && r.push(c), m !== void 0 && n.__listType === "check" && r.push(m), u !== void 0) {
      r.push(...kl(u));
      for (let h = 0; h < s.length; h++) h !== a && o.push(n.__tag + h);
    }
    if (p !== void 0) {
      const h = kl(p);
      l > 1 ? r.push(...h) : o.push(...h);
    }
  }
  o.length > 0 && Xd(t, ...o), r.length > 0 && Ot(t, ...r);
}
function Uw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (he(r)) {
      e.push(r);
      const o = r.getChildren();
      o.length > 1 && o.forEach((i) => {
        ee(i) && e.push(mg(i));
      });
    } else e.push(mg(r));
  }
  return e;
}
function Sg(t) {
  const e = t.nodeName.toLowerCase();
  let n = null;
  return e === "ol" ? n = nt("number", t.start) : e === "ul" && (n = function(r) {
    if (r.getAttribute("__lexicallisttype") === "check" || r.classList.contains("contains-task-list")) return !0;
    for (const o of r.childNodes) if (on(o) && o.hasAttribute("aria-checked")) return !0;
    return !1;
  }(t) ? nt("check") : nt("bullet")), { after: Uw, node: n };
}
const kg = { ol: "number", ul: "bullet" };
function nt(t, e = 1) {
  return We(new br(t, e));
}
function ee(t) {
  return t instanceof br;
}
const Ev = rn(), Tv = rn(), Ec = rn();
var Ww = { exports: {} };
(function(t) {
  var e = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var n = function(r) {
    var o = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, i = 0, s = {}, l = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: r.Prism && r.Prism.manual,
      /**
       * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
       * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
       * own worker, you don't want it to do this.
       *
       * By setting this value to `true`, Prism will not add its own listeners to the worker.
       *
       * You obviously have to change this value before Prism executes. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.disableWorkerMessageHandler = true;
       * // Load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      disableWorkerMessageHandler: r.Prism && r.Prism.disableWorkerMessageHandler,
      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: function d(g) {
          return g instanceof a ? new a(g.type, d(g.content), g.alias) : Array.isArray(g) ? g.map(d) : g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
        },
        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: function(d) {
          return Object.prototype.toString.call(d).slice(8, -1);
        },
        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function(d) {
          return d.__id || Object.defineProperty(d, "__id", { value: ++i }), d.__id;
        },
        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: function d(g, x) {
          x = x || {};
          var w, S;
          switch (l.util.type(g)) {
            case "Object":
              if (S = l.util.objId(g), x[S])
                return x[S];
              w = /** @type {Record<string, any>} */
              {}, x[S] = w;
              for (var k in g)
                g.hasOwnProperty(k) && (w[k] = d(g[k], x));
              return (
                /** @type {any} */
                w
              );
            case "Array":
              return S = l.util.objId(g), x[S] ? x[S] : (w = [], x[S] = w, /** @type {Array} */
              /** @type {any} */
              g.forEach(function(C, E) {
                w[E] = d(C, x);
              }), /** @type {any} */
              w);
            default:
              return g;
          }
        },
        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: function(d) {
          for (; d; ) {
            var g = o.exec(d.className);
            if (g)
              return g[1].toLowerCase();
            d = d.parentElement;
          }
          return "none";
        },
        /**
         * Sets the Prism `language-xxxx` class of the given element.
         *
         * @param {Element} element
         * @param {string} language
         * @returns {void}
         */
        setLanguage: function(d, g) {
          d.className = d.className.replace(RegExp(o, "gi"), ""), d.classList.add("language-" + g);
        },
        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: function() {
          if (typeof document > "u")
            return null;
          if ("currentScript" in document)
            return (
              /** @type {any} */
              document.currentScript
            );
          try {
            throw new Error();
          } catch (w) {
            var d = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(w.stack) || [])[1];
            if (d) {
              var g = document.getElementsByTagName("script");
              for (var x in g)
                if (g[x].src == d)
                  return g[x];
            }
            return null;
          }
        },
        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: function(d, g, x) {
          for (var w = "no-" + g; d; ) {
            var S = d.classList;
            if (S.contains(g))
              return !0;
            if (S.contains(w))
              return !1;
            d = d.parentElement;
          }
          return !!x;
        }
      },
      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * The grammar for plain, unformatted text.
         */
        plain: s,
        plaintext: s,
        text: s,
        txt: s,
        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: function(d, g) {
          var x = l.util.clone(l.languages[d]);
          for (var w in g)
            x[w] = g[w];
          return x;
        },
        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: function(d, g, x, w) {
          w = w || /** @type {any} */
          l.languages;
          var S = w[d], k = {};
          for (var C in S)
            if (S.hasOwnProperty(C)) {
              if (C == g)
                for (var E in x)
                  x.hasOwnProperty(E) && (k[E] = x[E]);
              x.hasOwnProperty(C) || (k[C] = S[C]);
            }
          var N = w[d];
          return w[d] = k, l.languages.DFS(l.languages, function(D, z) {
            z === N && D != d && (this[D] = k);
          }), k;
        },
        // Traverse a language definition with Depth First Search
        DFS: function d(g, x, w, S) {
          S = S || {};
          var k = l.util.objId;
          for (var C in g)
            if (g.hasOwnProperty(C)) {
              x.call(g, C, g[C], w || C);
              var E = g[C], N = l.util.type(E);
              N === "Object" && !S[k(E)] ? (S[k(E)] = !0, d(E, x, null, S)) : N === "Array" && !S[k(E)] && (S[k(E)] = !0, d(E, x, C, S));
            }
        }
      },
      plugins: {},
      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: function(d, g) {
        l.highlightAllUnder(document, d, g);
      },
      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. `before-all-elements-highlight`
       * 3. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: function(d, g, x) {
        var w = {
          callback: x,
          container: d,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        l.hooks.run("before-highlightall", w), w.elements = Array.prototype.slice.apply(w.container.querySelectorAll(w.selector)), l.hooks.run("before-all-elements-highlight", w);
        for (var S = 0, k; k = w.elements[S++]; )
          l.highlightElement(k, g === !0, w.callback);
      },
      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
       * the element's language.
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: function(d, g, x) {
        var w = l.util.getLanguage(d), S = l.languages[w];
        l.util.setLanguage(d, w);
        var k = d.parentElement;
        k && k.nodeName.toLowerCase() === "pre" && l.util.setLanguage(k, w);
        var C = d.textContent, E = {
          element: d,
          language: w,
          grammar: S,
          code: C
        };
        function N(z) {
          E.highlightedCode = z, l.hooks.run("before-insert", E), E.element.innerHTML = E.highlightedCode, l.hooks.run("after-highlight", E), l.hooks.run("complete", E), x && x.call(E.element);
        }
        if (l.hooks.run("before-sanity-check", E), k = E.element.parentElement, k && k.nodeName.toLowerCase() === "pre" && !k.hasAttribute("tabindex") && k.setAttribute("tabindex", "0"), !E.code) {
          l.hooks.run("complete", E), x && x.call(E.element);
          return;
        }
        if (l.hooks.run("before-highlight", E), !E.grammar) {
          N(l.util.encode(E.code));
          return;
        }
        if (g && r.Worker) {
          var D = new Worker(l.filename);
          D.onmessage = function(z) {
            N(z.data);
          }, D.postMessage(JSON.stringify({
            language: E.language,
            code: E.code,
            immediateClose: !0
          }));
        } else
          N(l.highlight(E.code, E.grammar, E.language));
      },
      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: function(d, g, x) {
        var w = {
          code: d,
          grammar: g,
          language: x
        };
        if (l.hooks.run("before-tokenize", w), !w.grammar)
          throw new Error('The language "' + w.language + '" has no grammar.');
        return w.tokens = l.tokenize(w.code, w.grammar), l.hooks.run("after-tokenize", w), a.stringify(l.util.encode(w.tokens), w.language);
      },
      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: function(d, g) {
        var x = g.rest;
        if (x) {
          for (var w in x)
            g[w] = x[w];
          delete g.rest;
        }
        var S = new p();
        return f(S, S.head, d), c(d, S, g, S.head, 0), h(S);
      },
      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},
        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: function(d, g) {
          var x = l.hooks.all;
          x[d] = x[d] || [], x[d].push(g);
        },
        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: function(d, g) {
          var x = l.hooks.all[d];
          if (!(!x || !x.length))
            for (var w = 0, S; S = x[w++]; )
              S(g);
        }
      },
      Token: a
    };
    r.Prism = l;
    function a(d, g, x, w) {
      this.type = d, this.content = g, this.alias = x, this.length = (w || "").length | 0;
    }
    a.stringify = function d(g, x) {
      if (typeof g == "string")
        return g;
      if (Array.isArray(g)) {
        var w = "";
        return g.forEach(function(N) {
          w += d(N, x);
        }), w;
      }
      var S = {
        type: g.type,
        content: d(g.content, x),
        tag: "span",
        classes: ["token", g.type],
        attributes: {},
        language: x
      }, k = g.alias;
      k && (Array.isArray(k) ? Array.prototype.push.apply(S.classes, k) : S.classes.push(k)), l.hooks.run("wrap", S);
      var C = "";
      for (var E in S.attributes)
        C += " " + E + '="' + (S.attributes[E] || "").replace(/"/g, "&quot;") + '"';
      return "<" + S.tag + ' class="' + S.classes.join(" ") + '"' + C + ">" + S.content + "</" + S.tag + ">";
    };
    function u(d, g, x, w) {
      d.lastIndex = g;
      var S = d.exec(x);
      if (S && w && S[1]) {
        var k = S[1].length;
        S.index += k, S[0] = S[0].slice(k);
      }
      return S;
    }
    function c(d, g, x, w, S, k) {
      for (var C in x)
        if (!(!x.hasOwnProperty(C) || !x[C])) {
          var E = x[C];
          E = Array.isArray(E) ? E : [E];
          for (var N = 0; N < E.length; ++N) {
            if (k && k.cause == C + "," + N)
              return;
            var D = E[N], z = D.inside, H = !!D.lookbehind, j = !!D.greedy, J = D.alias;
            if (j && !D.pattern.global) {
              var G = D.pattern.toString().match(/[imsuy]*$/)[0];
              D.pattern = RegExp(D.pattern.source, G + "g");
            }
            for (var te = D.pattern || D, L = w.next, U = S; L !== g.tail && !(k && U >= k.reach); U += L.value.length, L = L.next) {
              var K = L.value;
              if (g.length > d.length)
                return;
              if (!(K instanceof a)) {
                var q = 1, Z;
                if (j) {
                  if (Z = u(te, U, d, H), !Z || Z.index >= d.length)
                    break;
                  var ae = Z.index, Ve = Z.index + Z[0].length, le = U;
                  for (le += L.value.length; ae >= le; )
                    L = L.next, le += L.value.length;
                  if (le -= L.value.length, U = le, L.value instanceof a)
                    continue;
                  for (var Te = L; Te !== g.tail && (le < Ve || typeof Te.value == "string"); Te = Te.next)
                    q++, le += Te.value.length;
                  q--, K = d.slice(U, le), Z.index -= U;
                } else if (Z = u(te, 0, K, H), !Z)
                  continue;
                var ae = Z.index, be = Z[0], Ze = K.slice(0, ae), F = K.slice(ae + be.length), P = U + K.length;
                k && P > k.reach && (k.reach = P);
                var M = L.prev;
                Ze && (M = f(g, M, Ze), U += Ze.length), m(g, M, q);
                var Q = new a(C, z ? l.tokenize(be, z) : be, J, be);
                if (L = f(g, M, Q), F && f(g, L, F), q > 1) {
                  var X = {
                    cause: C + "," + N,
                    reach: P
                  };
                  c(d, g, x, L.prev, U, X), k && X.reach > k.reach && (k.reach = X.reach);
                }
              }
            }
          }
        }
    }
    function p() {
      var d = { value: null, prev: null, next: null }, g = { value: null, prev: d, next: null };
      d.next = g, this.head = d, this.tail = g, this.length = 0;
    }
    function f(d, g, x) {
      var w = g.next, S = { value: x, prev: g, next: w };
      return g.next = S, w.prev = S, d.length++, S;
    }
    function m(d, g, x) {
      for (var w = g.next, S = 0; S < x && w !== d.tail; S++)
        w = w.next;
      g.next = w, w.prev = g, d.length -= S;
    }
    function h(d) {
      for (var g = [], x = d.head.next; x !== d.tail; )
        g.push(x.value), x = x.next;
      return g;
    }
    if (!r.document)
      return r.addEventListener && (l.disableWorkerMessageHandler || r.addEventListener("message", function(d) {
        var g = JSON.parse(d.data), x = g.language, w = g.code, S = g.immediateClose;
        r.postMessage(l.highlight(w, l.languages[x], x)), S && r.close();
      }, !1)), l;
    var y = l.util.currentScript();
    y && (l.filename = y.src, y.hasAttribute("data-manual") && (l.manual = !0));
    function _() {
      l.manual || l.highlightAll();
    }
    if (!l.manual) {
      var v = document.readyState;
      v === "loading" || v === "interactive" && y && y.defer ? document.addEventListener("DOMContentLoaded", _) : window.requestAnimationFrame ? window.requestAnimationFrame(_) : window.setTimeout(_, 16);
    }
    return l;
  }(e);
  t.exports && (t.exports = n), typeof lf < "u" && (lf.Prism = n), n.languages.markup = {
    comment: {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: !0
    },
    prolog: {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: !0
    },
    doctype: {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null
          // see below
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: !0
        },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        name: /[^\s<>'"]+/
      }
    },
    cdata: {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: !0
    },
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              {
                pattern: /^(\s*)["']|["']$/,
                lookbehind: !0
              }
            ]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
      },
      /&#x?[\da-f]{1,8};/i
    ]
  }, n.languages.markup.tag.inside["attr-value"].inside.entity = n.languages.markup.entity, n.languages.markup.doctype.inside["internal-subset"].inside = n.languages.markup, n.hooks.add("wrap", function(r) {
    r.type === "entity" && (r.attributes.title = r.content.replace(/&amp;/, "&"));
  }), Object.defineProperty(n.languages.markup.tag, "addInlined", {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function(o, i) {
      var s = {};
      s["language-" + i] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: n.languages[i]
      }, s.cdata = /^<!\[CDATA\[|\]\]>$/i;
      var l = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: s
        }
      };
      l["language-" + i] = {
        pattern: /[\s\S]+/,
        inside: n.languages[i]
      };
      var a = {};
      a[o] = {
        pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
          return o;
        }), "i"),
        lookbehind: !0,
        greedy: !0,
        inside: l
      }, n.languages.insertBefore("markup", "cdata", a);
    }
  }), Object.defineProperty(n.languages.markup.tag, "addAttribute", {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function(r, o) {
      n.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          /(^|["'\s])/.source + "(?:" + r + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          "i"
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [o, "language-" + o],
                inside: n.languages[o]
              },
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                /"|'/
              ]
            }
          }
        }
      });
    }
  }), n.languages.html = n.languages.markup, n.languages.mathml = n.languages.markup, n.languages.svg = n.languages.markup, n.languages.xml = n.languages.extend("markup", {}), n.languages.ssml = n.languages.xml, n.languages.atom = n.languages.xml, n.languages.rss = n.languages.xml, function(r) {
    var o = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    r.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + o.source + ")*?" + /(?:;|(?=\s*\{))/.source),
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector"
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0
          }
          // See rest below
        }
      },
      url: {
        // https://drafts.csswg.org/css-values-3/#urls
        pattern: RegExp("\\burl\\((?:" + o.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
        greedy: !0,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp("^" + o.source + "$"),
            alias: "url"
          }
        }
      },
      selector: {
        pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + o.source + ")*(?=\\s*\\{)"),
        lookbehind: !0
      },
      string: {
        pattern: o,
        greedy: !0
      },
      property: {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: !0
      },
      important: /!important\b/i,
      function: {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: !0
      },
      punctuation: /[(){};:,]/
    }, r.languages.css.atrule.inside.rest = r.languages.css;
    var i = r.languages.markup;
    i && (i.tag.addInlined("style", "css"), i.tag.addAttribute("style", "css"));
  }(n), n.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0
    },
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
  }, n.languages.javascript = n.languages.extend("clike", {
    "class-name": [
      n.languages.clike["class-name"],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: !0
      }
    ],
    keyword: [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: !0
      },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
      }
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
        /(^|[^\w$])/.source + "(?:" + // constant
        (/NaN|Infinity/.source + "|" + // binary integer
        /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
        /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
        /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
        /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
        /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
      ),
      lookbehind: !0
    },
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  }), n.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, n.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: RegExp(
        // lookbehind
        // eslint-disable-next-line regexp/no-dupe-characters-character-class
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
        // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
        // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
        // with the only syntax, so we have to define 2 different regex patterns.
        /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
        /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
        /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: n.languages.regex
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/
      }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    "function-variable": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function"
    },
    parameter: [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: n.languages.javascript
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: n.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: n.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: n.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }), n.languages.insertBefore("javascript", "string", {
    hashbang: {
      pattern: /^#!.*/,
      greedy: !0,
      alias: "comment"
    },
    "template-string": {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": {
          pattern: /^`|`$/,
          alias: "string"
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            },
            rest: n.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    },
    "string-property": {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: "property"
    }
  }), n.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: "property"
    }
  }), n.languages.markup && (n.languages.markup.tag.addInlined("script", "javascript"), n.languages.markup.tag.addAttribute(
    /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
    "javascript"
  )), n.languages.js = n.languages.javascript, function() {
    if (typeof n > "u" || typeof document > "u")
      return;
    Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
    var r = "Loading…", o = function(y, _) {
      return "✖ Error " + y + " while fetching file: " + _;
    }, i = "✖ Error: File does not exist or is empty", s = {
      js: "javascript",
      py: "python",
      rb: "ruby",
      ps1: "powershell",
      psm1: "powershell",
      sh: "bash",
      bat: "batch",
      h: "c",
      tex: "latex"
    }, l = "data-src-status", a = "loading", u = "loaded", c = "failed", p = "pre[data-src]:not([" + l + '="' + u + '"]):not([' + l + '="' + a + '"])';
    function f(y, _, v) {
      var d = new XMLHttpRequest();
      d.open("GET", y, !0), d.onreadystatechange = function() {
        d.readyState == 4 && (d.status < 400 && d.responseText ? _(d.responseText) : d.status >= 400 ? v(o(d.status, d.statusText)) : v(i));
      }, d.send(null);
    }
    function m(y) {
      var _ = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(y || "");
      if (_) {
        var v = Number(_[1]), d = _[2], g = _[3];
        return d ? g ? [v, Number(g)] : [v, void 0] : [v, v];
      }
    }
    n.hooks.add("before-highlightall", function(y) {
      y.selector += ", " + p;
    }), n.hooks.add("before-sanity-check", function(y) {
      var _ = (
        /** @type {HTMLPreElement} */
        y.element
      );
      if (_.matches(p)) {
        y.code = "", _.setAttribute(l, a);
        var v = _.appendChild(document.createElement("CODE"));
        v.textContent = r;
        var d = _.getAttribute("data-src"), g = y.language;
        if (g === "none") {
          var x = (/\.(\w+)$/.exec(d) || [, "none"])[1];
          g = s[x] || x;
        }
        n.util.setLanguage(v, g), n.util.setLanguage(_, g);
        var w = n.plugins.autoloader;
        w && w.loadLanguages(g), f(
          d,
          function(S) {
            _.setAttribute(l, u);
            var k = m(_.getAttribute("data-range"));
            if (k) {
              var C = S.split(/\r\n?|\n/g), E = k[0], N = k[1] == null ? C.length : k[1];
              E < 0 && (E += C.length), E = Math.max(0, Math.min(E - 1, C.length)), N < 0 && (N += C.length), N = Math.max(0, Math.min(N, C.length)), S = C.slice(E, N).join(`
`), _.hasAttribute("data-start") || _.setAttribute("data-start", String(E + 1));
            }
            v.textContent = S, n.highlightElement(v);
          },
          function(S) {
            _.setAttribute(l, c), v.textContent = S;
          }
        );
      }
    }), n.plugins.fileHighlight = {
      /**
       * Executes the File Highlight plugin for all matching `pre` elements under the given container.
       *
       * Note: Elements which are already loaded or currently loading will not be touched by this method.
       *
       * @param {ParentNode} [container=document]
       */
      highlight: function(_) {
        for (var v = (_ || document).querySelectorAll(p), d = 0, g; g = v[d++]; )
          n.highlightElement(g);
      }
    };
    var h = !1;
    n.fileHighlight = function() {
      h || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), h = !0), n.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  }();
})(Ww);
Prism.languages.clike = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: !0,
      greedy: !0
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: !0,
      greedy: !0
    }
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: !0
    }
  ],
  keyword: [
    {
      pattern: /((?:^|\})\s*)catch\b/,
      lookbehind: !0
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0
    }
  ],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: RegExp(
      /(^|[^\w$])/.source + "(?:" + // constant
      (/NaN|Infinity/.source + "|" + // binary integer
      /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
      /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
      /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
      /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
      /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
    ),
    lookbehind: !0
  },
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: RegExp(
      // lookbehind
      // eslint-disable-next-line regexp/no-dupe-characters-character-class
      /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
      // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
      // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
      // with the only syntax, so we have to define 2 different regex patterns.
      /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
      /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
      /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
    ),
    lookbehind: !0,
    greedy: !0,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: !0,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-delimiter": /^\/|\/$/,
      "regex-flags": /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  "function-variable": {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function"
  },
  parameter: [
    {
      pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
      lookbehind: !0,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
      lookbehind: !0,
      inside: Prism.languages.javascript
    }
  ],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore("javascript", "string", {
  hashbang: {
    pattern: /^#!.*/,
    greedy: !0,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "property"
  }
});
Prism.languages.insertBefore("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: !0,
    alias: "property"
  }
});
Prism.languages.markup && (Prism.languages.markup.tag.addInlined("script", "javascript"), Prism.languages.markup.tag.addAttribute(
  /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
  "javascript"
));
Prism.languages.js = Prism.languages.javascript;
Prism.languages.markup = {
  comment: {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: !0
  },
  prolog: {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: !0
  },
  doctype: {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null
        // see below
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: !0
      },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/
    }
  },
  cdata: {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: !0
  },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/
        }
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            {
              pattern: /^=/,
              alias: "attr-equals"
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }
          ]
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/
        }
      }
    }
  },
  entity: [
    {
      pattern: /&[\da-z]{1,8};/i,
      alias: "named-entity"
    },
    /&#x?[\da-f]{1,8};/i
  ]
};
Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity;
Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup;
Prism.hooks.add("wrap", function(t) {
  t.type === "entity" && (t.attributes.title = t.content.replace(/&amp;/, "&"));
});
Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function(e, n) {
    var r = {};
    r["language-" + n] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: !0,
      inside: Prism.languages[n]
    }, r.cdata = /^<!\[CDATA\[|\]\]>$/i;
    var o = {
      "included-cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: r
      }
    };
    o["language-" + n] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[n]
    };
    var i = {};
    i[e] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
        return e;
      }), "i"),
      lookbehind: !0,
      greedy: !0,
      inside: o
    }, Prism.languages.insertBefore("markup", "cdata", i);
  }
});
Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function(t, e) {
    Prism.languages.markup.tag.inside["special-attr"].push({
      pattern: RegExp(
        /(^|["'\s])/.source + "(?:" + t + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
        "i"
      ),
      lookbehind: !0,
      inside: {
        "attr-name": /^[^\s=]+/,
        "attr-value": {
          pattern: /=[\s\S]+/,
          inside: {
            value: {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: !0,
              alias: [e, "language-" + e],
              inside: Prism.languages[e]
            },
            punctuation: [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              /"|'/
            ]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend("markup", {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;
(function(t) {
  var e = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;
  function n(c) {
    return c = c.replace(/<inner>/g, function() {
      return e;
    }), RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + c + ")");
  }
  var r = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source, o = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, function() {
    return r;
  }), i = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;
  t.languages.markdown = t.languages.extend("markup", {}), t.languages.insertBefore("markdown", "prolog", {
    "front-matter-block": {
      pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        punctuation: /^---|---$/,
        "front-matter": {
          pattern: /\S+(?:\s+\S+)*/,
          alias: ["yaml", "language-yaml"],
          inside: t.languages.yaml
        }
      }
    },
    blockquote: {
      // > ...
      pattern: /^>(?:[\t ]*>)*/m,
      alias: "punctuation"
    },
    table: {
      pattern: RegExp("^" + o + i + "(?:" + o + ")*", "m"),
      inside: {
        "table-data-rows": {
          pattern: RegExp("^(" + o + i + ")(?:" + o + ")*$"),
          lookbehind: !0,
          inside: {
            "table-data": {
              pattern: RegExp(r),
              inside: t.languages.markdown
            },
            punctuation: /\|/
          }
        },
        "table-line": {
          pattern: RegExp("^(" + o + ")" + i + "$"),
          lookbehind: !0,
          inside: {
            punctuation: /\||:?-{3,}:?/
          }
        },
        "table-header-row": {
          pattern: RegExp("^" + o + "$"),
          inside: {
            "table-header": {
              pattern: RegExp(r),
              alias: "important",
              inside: t.languages.markdown
            },
            punctuation: /\|/
          }
        }
      }
    },
    code: [
      {
        // Prefixed by 4 spaces or 1 tab and preceded by an empty line
        pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
        lookbehind: !0,
        alias: "keyword"
      },
      {
        // ```optional language
        // code block
        // ```
        pattern: /^```[\s\S]*?^```$/m,
        greedy: !0,
        inside: {
          "code-block": {
            pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
            lookbehind: !0
          },
          "code-language": {
            pattern: /^(```).+/,
            lookbehind: !0
          },
          punctuation: /```/
        }
      }
    ],
    title: [
      {
        // title 1
        // =======
        // title 2
        // -------
        pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
        alias: "important",
        inside: {
          punctuation: /==+$|--+$/
        }
      },
      {
        // # title 1
        // ###### title 6
        pattern: /(^\s*)#.+/m,
        lookbehind: !0,
        alias: "important",
        inside: {
          punctuation: /^#+|#+$/
        }
      }
    ],
    hr: {
      // ***
      // ---
      // * * *
      // -----------
      pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
      lookbehind: !0,
      alias: "punctuation"
    },
    list: {
      // * item
      // + item
      // - item
      // 1. item
      pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
      lookbehind: !0,
      alias: "punctuation"
    },
    "url-reference": {
      // [id]: http://example.com "Optional title"
      // [id]: http://example.com 'Optional title'
      // [id]: http://example.com (Optional title)
      // [id]: <http://example.com> "Optional title"
      pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
      inside: {
        variable: {
          pattern: /^(!?\[)[^\]]+/,
          lookbehind: !0
        },
        string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
        punctuation: /^[\[\]!:]|[<>]/
      },
      alias: "url"
    },
    bold: {
      // **strong**
      // __strong__
      // allow one nested instance of italic text using the same delimiter
      pattern: n(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),
      lookbehind: !0,
      greedy: !0,
      inside: {
        content: {
          pattern: /(^..)[\s\S]+(?=..$)/,
          lookbehind: !0,
          inside: {}
          // see below
        },
        punctuation: /\*\*|__/
      }
    },
    italic: {
      // *em*
      // _em_
      // allow one nested instance of bold text using the same delimiter
      pattern: n(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source),
      lookbehind: !0,
      greedy: !0,
      inside: {
        content: {
          pattern: /(^.)[\s\S]+(?=.$)/,
          lookbehind: !0,
          inside: {}
          // see below
        },
        punctuation: /[*_]/
      }
    },
    strike: {
      // ~~strike through~~
      // ~strike~
      // eslint-disable-next-line regexp/strict
      pattern: n(/(~~?)(?:(?!~)<inner>)+\2/.source),
      lookbehind: !0,
      greedy: !0,
      inside: {
        content: {
          pattern: /(^~~?)[\s\S]+(?=\1$)/,
          lookbehind: !0,
          inside: {}
          // see below
        },
        punctuation: /~~?/
      }
    },
    "code-snippet": {
      // `code`
      // ``code``
      pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
      lookbehind: !0,
      greedy: !0,
      alias: ["code", "keyword"]
    },
    url: {
      // [example](http://example.com "Optional title")
      // [example][id]
      // [example] [id]
      pattern: n(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source),
      lookbehind: !0,
      greedy: !0,
      inside: {
        operator: /^!/,
        content: {
          pattern: /(^\[)[^\]]+(?=\])/,
          lookbehind: !0,
          inside: {}
          // see below
        },
        variable: {
          pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
          lookbehind: !0
        },
        url: {
          pattern: /(^\]\()[^\s)]+/,
          lookbehind: !0
        },
        string: {
          pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
          lookbehind: !0
        }
      }
    }
  }), ["url", "bold", "italic", "strike"].forEach(function(c) {
    ["url", "bold", "italic", "strike", "code-snippet"].forEach(function(p) {
      c !== p && (t.languages.markdown[c].inside.content.inside[p] = t.languages.markdown[p]);
    });
  }), t.hooks.add("after-tokenize", function(c) {
    if (c.language !== "markdown" && c.language !== "md")
      return;
    function p(f) {
      if (!(!f || typeof f == "string"))
        for (var m = 0, h = f.length; m < h; m++) {
          var y = f[m];
          if (y.type !== "code") {
            p(y.content);
            continue;
          }
          var _ = y.content[1], v = y.content[3];
          if (_ && v && _.type === "code-language" && v.type === "code-block" && typeof _.content == "string") {
            var d = _.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp");
            d = (/[a-z][\w-]*/i.exec(d) || [""])[0].toLowerCase();
            var g = "language-" + d;
            v.alias ? typeof v.alias == "string" ? v.alias = [v.alias, g] : v.alias.push(g) : v.alias = [g];
          }
        }
    }
    p(c.tokens);
  }), t.hooks.add("wrap", function(c) {
    if (c.type === "code-block") {
      for (var p = "", f = 0, m = c.classes.length; f < m; f++) {
        var h = c.classes[f], y = /language-(.+)/.exec(h);
        if (y) {
          p = y[1];
          break;
        }
      }
      var _ = t.languages[p];
      if (_)
        c.content = t.highlight(u(c.content), _, p);
      else if (p && p !== "none" && t.plugins.autoloader) {
        var v = "md-" + (/* @__PURE__ */ new Date()).valueOf() + "-" + Math.floor(Math.random() * 1e16);
        c.attributes.id = v, t.plugins.autoloader.loadLanguages(p, function() {
          var d = document.getElementById(v);
          d && (d.innerHTML = t.highlight(d.textContent, t.languages[p], p));
        });
      }
    }
  });
  var s = RegExp(t.languages.markup.tag.pattern.source, "gi"), l = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"'
  }, a = String.fromCodePoint || String.fromCharCode;
  function u(c) {
    var p = c.replace(s, "");
    return p = p.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function(f, m) {
      if (m = m.toLowerCase(), m[0] === "#") {
        var h;
        return m[1] === "x" ? h = parseInt(m.slice(2), 16) : h = Number(m.slice(1)), a(h);
      } else {
        var y = l[m];
        return y || f;
      }
    }), p;
  }
  t.languages.md = t.languages.markdown;
})(Prism);
Prism.languages.c = Prism.languages.extend("clike", {
  comment: {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: !0
  },
  string: {
    // https://en.cppreference.com/w/c/language/string_literal
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: !0
  },
  keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number: /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
});
Prism.languages.insertBefore("c", "string", {
  char: {
    // https://en.cppreference.com/w/c/language/character_constant
    pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
    greedy: !0
  }
});
Prism.languages.insertBefore("c", "string", {
  macro: {
    // allow for multiline macro definitions
    // spaces after the # character compile fine with gcc
    pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: !0,
    greedy: !0,
    alias: "property",
    inside: {
      string: [
        {
          // highlight the path of the include statement as a string
          pattern: /^(#\s*include\s*)<[^>]+>/,
          lookbehind: !0
        },
        Prism.languages.c.string
      ],
      char: Prism.languages.c.char,
      comment: Prism.languages.c.comment,
      "macro-name": [
        {
          pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
          lookbehind: !0
        },
        {
          pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
          lookbehind: !0,
          alias: "function"
        }
      ],
      // highlight macro directives as keywords
      directive: {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: !0,
        alias: "keyword"
      },
      "directive-hash": /^#/,
      punctuation: /##|\\(?=[\r\n])/,
      expression: {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c
      }
    }
  }
});
Prism.languages.insertBefore("c", "function", {
  // highlight predefined macros as constants
  constant: /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
});
delete Prism.languages.c.boolean;
(function(t) {
  var e = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  t.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + e.source + ")*?" + /(?:;|(?=\s*\{))/.source),
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: "selector"
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: !0
        }
        // See rest below
      }
    },
    url: {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp("\\burl\\((?:" + e.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: {
          pattern: RegExp("^" + e.source + "$"),
          alias: "url"
        }
      }
    },
    selector: {
      pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + e.source + ")*(?=\\s*\\{)"),
      lookbehind: !0
    },
    string: {
      pattern: e,
      greedy: !0
    },
    property: {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: !0
    },
    important: /!important\b/i,
    function: {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: !0
    },
    punctuation: /[(){};:,]/
  }, t.languages.css.atrule.inside.rest = t.languages.css;
  var n = t.languages.markup;
  n && (n.tag.addInlined("style", "css"), n.tag.addAttribute("style", "css"));
})(Prism);
Prism.languages.objectivec = Prism.languages.extend("c", {
  string: {
    pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: !0
  },
  keyword: /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
  operator: /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
});
delete Prism.languages.objectivec["class-name"];
Prism.languages.objc = Prism.languages.objectivec;
Prism.languages.sql = {
  comment: {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: !0
  },
  variable: [
    {
      pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
      greedy: !0
    },
    /@[\w.$]+/
  ],
  string: {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: !0,
    lookbehind: !0
  },
  identifier: {
    pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
    greedy: !0,
    lookbehind: !0,
    inside: {
      punctuation: /^`|`$/
    }
  },
  function: /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  // Should we highlight user defined functions too?
  keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
  number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  operator: /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  punctuation: /[;[\]()`,.]/
};
(function(t) {
  var e = t.languages.powershell = {
    comment: [
      {
        pattern: /(^|[^`])<#[\s\S]*?#>/,
        lookbehind: !0
      },
      {
        pattern: /(^|[^`])#.*/,
        lookbehind: !0
      }
    ],
    string: [
      {
        pattern: /"(?:`[\s\S]|[^`"])*"/,
        greedy: !0,
        inside: null
        // see below
      },
      {
        pattern: /'(?:[^']|'')*'/,
        greedy: !0
      }
    ],
    // Matches name spaces as well as casts, attribute decorators. Force starting with letter to avoid matching array indices
    // Supports two levels of nested brackets (e.g. `[OutputType([System.Collections.Generic.List[int]])]`)
    namespace: /\[[a-z](?:\[(?:\[[^\]]*\]|[^\[\]])*\]|[^\[\]])*\]/i,
    boolean: /\$(?:false|true)\b/i,
    variable: /\$\w+\b/,
    // Cmdlets and aliases. Aliases should come last, otherwise "write" gets preferred over "write-host" for example
    // Get-Command | ?{ $_.ModuleName -match "Microsoft.PowerShell.(Util|Core|Management)" }
    // Get-Alias | ?{ $_.ReferencedCommand.Module.Name -match "Microsoft.PowerShell.(Util|Core|Management)" }
    function: [
      /\b(?:Add|Approve|Assert|Backup|Block|Checkpoint|Clear|Close|Compare|Complete|Compress|Confirm|Connect|Convert|ConvertFrom|ConvertTo|Copy|Debug|Deny|Disable|Disconnect|Dismount|Edit|Enable|Enter|Exit|Expand|Export|Find|ForEach|Format|Get|Grant|Group|Hide|Import|Initialize|Install|Invoke|Join|Limit|Lock|Measure|Merge|Move|New|Open|Optimize|Out|Ping|Pop|Protect|Publish|Push|Read|Receive|Redo|Register|Remove|Rename|Repair|Request|Reset|Resize|Resolve|Restart|Restore|Resume|Revoke|Save|Search|Select|Send|Set|Show|Skip|Sort|Split|Start|Step|Stop|Submit|Suspend|Switch|Sync|Tee|Test|Trace|Unblock|Undo|Uninstall|Unlock|Unprotect|Unpublish|Unregister|Update|Use|Wait|Watch|Where|Write)-[a-z]+\b/i,
      /\b(?:ac|cat|chdir|clc|cli|clp|clv|compare|copy|cp|cpi|cpp|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|fc|fl|ft|fw|gal|gbp|gc|gci|gcs|gdr|gi|gl|gm|gp|gps|group|gsv|gu|gv|gwmi|iex|ii|ipal|ipcsv|ipsn|irm|iwmi|iwr|kill|lp|ls|measure|mi|mount|move|mp|mv|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rd|rdr|ren|ri|rm|rmdir|rni|rnp|rp|rv|rvpa|rwmi|sal|saps|sasv|sbp|sc|select|set|shcm|si|sl|sleep|sls|sort|sp|spps|spsv|start|sv|swmi|tee|trcm|type|write)\b/i
    ],
    // per http://technet.microsoft.com/en-us/library/hh847744.aspx
    keyword: /\b(?:Begin|Break|Catch|Class|Continue|Data|Define|Do|DynamicParam|Else|ElseIf|End|Exit|Filter|Finally|For|ForEach|From|Function|If|InlineScript|Parallel|Param|Process|Return|Sequence|Switch|Throw|Trap|Try|Until|Using|Var|While|Workflow)\b/i,
    operator: {
      pattern: /(^|\W)(?:!|-(?:b?(?:and|x?or)|as|(?:Not)?(?:Contains|In|Like|Match)|eq|ge|gt|is(?:Not)?|Join|le|lt|ne|not|Replace|sh[lr])\b|-[-=]?|\+[+=]?|[*\/%]=?)/i,
      lookbehind: !0
    },
    punctuation: /[|{}[\];(),.]/
  };
  e.string[0].inside = {
    function: {
      // Allow for one level of nesting
      pattern: /(^|[^`])\$\((?:\$\([^\r\n()]*\)|(?!\$\()[^\r\n)])*\)/,
      lookbehind: !0,
      inside: e
    },
    boolean: e.boolean,
    variable: e.variable
  };
})(Prism);
Prism.languages.python = {
  comment: {
    pattern: /(^|[^\\])#.*/,
    lookbehind: !0,
    greedy: !0
  },
  "string-interpolation": {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          "format-spec": {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: !0
          },
          "conversion-option": {
            pattern: /![sra](?=[:}]$)/,
            alias: "punctuation"
          },
          rest: null
        }
      },
      string: /[\s\S]+/
    }
  },
  "triple-quoted-string": {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: !0
  },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: !0
  },
  "class-name": {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: !0
  },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: !0,
    alias: ["annotation", "punctuation"],
    inside: {
      punctuation: /\./
    }
  },
  keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python;
Prism.languages.py = Prism.languages.python;
(function(t) {
  for (var e = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source, n = 0; n < 2; n++)
    e = e.replace(/<self>/g, function() {
      return e;
    });
  e = e.replace(/<self>/g, function() {
    return /[^\s\S]/.source;
  }), t.languages.rust = {
    comment: [
      {
        pattern: RegExp(/(^|[^\\])/.source + e),
        lookbehind: !0,
        greedy: !0
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
      }
    ],
    string: {
      pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
      greedy: !0
    },
    char: {
      pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
      greedy: !0
    },
    attribute: {
      pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
      greedy: !0,
      alias: "attr-name",
      inside: {
        string: null
        // see below
      }
    },
    // Closure params should not be confused with bitwise OR |
    "closure-params": {
      pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        "closure-punctuation": {
          pattern: /^\||\|$/,
          alias: "punctuation"
        },
        rest: null
        // see below
      }
    },
    "lifetime-annotation": {
      pattern: /'\w+/,
      alias: "symbol"
    },
    "fragment-specifier": {
      pattern: /(\$\w+:)[a-z]+/,
      lookbehind: !0,
      alias: "punctuation"
    },
    variable: /\$\w+/,
    "function-definition": {
      pattern: /(\bfn\s+)\w+/,
      lookbehind: !0,
      alias: "function"
    },
    "type-definition": {
      pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
      lookbehind: !0,
      alias: "class-name"
    },
    "module-declaration": [
      {
        pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
        lookbehind: !0,
        alias: "namespace"
      },
      {
        pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
        lookbehind: !0,
        alias: "namespace",
        inside: {
          punctuation: /::/
        }
      }
    ],
    keyword: [
      // https://github.com/rust-lang/reference/blob/master/src/keywords.md
      /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
      // primitives and str
      // https://doc.rust-lang.org/stable/rust-by-example/primitives.html
      /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/
    ],
    // functions can technically start with an upper-case letter, but this will introduce a lot of false positives
    // and Rust's naming conventions recommend snake_case anyway.
    // https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
    function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
    macro: {
      pattern: /\b\w+!/,
      alias: "property"
    },
    constant: /\b[A-Z_][A-Z_\d]+\b/,
    "class-name": /\b[A-Z]\w*\b/,
    namespace: {
      pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
      inside: {
        punctuation: /::/
      }
    },
    // Hex, oct, bin, dec numbers with visual separators and type suffix
    number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
    boolean: /\b(?:false|true)\b/,
    punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
    operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
  }, t.languages.rust["closure-params"].inside.rest = t.languages.rust, t.languages.rust.attribute.inside.string = t.languages.rust.string;
})(Prism);
Prism.languages.swift = {
  comment: {
    // Nested comments are supported up to 2 levels
    pattern: /(^|[^\\:])(?:\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\/)/,
    lookbehind: !0,
    greedy: !0
  },
  "string-literal": [
    // https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html
    {
      pattern: RegExp(
        /(^|[^"#])/.source + "(?:" + /"(?:\\(?:\((?:[^()]|\([^()]*\))*\)|\r\n|[^(])|[^\\\r\n"])*"/.source + "|" + /"""(?:\\(?:\((?:[^()]|\([^()]*\))*\)|[^(])|[^\\"]|"(?!""))*"""/.source + ")" + /(?!["#])/.source
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /(\\\()(?:[^()]|\([^()]*\))*(?=\))/,
          lookbehind: !0,
          inside: null
          // see below
        },
        "interpolation-punctuation": {
          pattern: /^\)|\\\($/,
          alias: "punctuation"
        },
        punctuation: /\\(?=[\r\n])/,
        string: /[\s\S]+/
      }
    },
    {
      pattern: RegExp(
        /(^|[^"#])(#+)/.source + "(?:" + /"(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|\r\n|[^#])|[^\\\r\n])*?"/.source + "|" + /"""(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|[^#])|[^\\])*?"""/.source + ")\\2"
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /(\\#+\()(?:[^()]|\([^()]*\))*(?=\))/,
          lookbehind: !0,
          inside: null
          // see below
        },
        "interpolation-punctuation": {
          pattern: /^\)|\\#+\($/,
          alias: "punctuation"
        },
        string: /[\s\S]+/
      }
    }
  ],
  directive: {
    // directives with conditions
    pattern: RegExp(
      /#/.source + "(?:" + (/(?:elseif|if)\b/.source + "(?:[ 	]*" + /(?:![ \t]*)?(?:\b\w+\b(?:[ \t]*\((?:[^()]|\([^()]*\))*\))?|\((?:[^()]|\([^()]*\))*\))(?:[ \t]*(?:&&|\|\|))?/.source + ")+") + "|" + /(?:else|endif)\b/.source + ")"
    ),
    alias: "property",
    inside: {
      "directive-name": /^#\w+/,
      boolean: /\b(?:false|true)\b/,
      number: /\b\d+(?:\.\d+)*\b/,
      operator: /!|&&|\|\||[<>]=?/,
      punctuation: /[(),]/
    }
  },
  literal: {
    pattern: /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
    alias: "constant"
  },
  "other-directive": {
    pattern: /#\w+\b/,
    alias: "property"
  },
  attribute: {
    pattern: /@\w+/,
    alias: "atrule"
  },
  "function-definition": {
    pattern: /(\bfunc\s+)\w+/,
    lookbehind: !0,
    alias: "function"
  },
  label: {
    // https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html#ID141
    pattern: /\b(break|continue)\s+\w+|\b[a-zA-Z_]\w*(?=\s*:\s*(?:for|repeat|while)\b)/,
    lookbehind: !0,
    alias: "important"
  },
  keyword: /\b(?:Any|Protocol|Self|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|get|guard|higherThan|if|import|in|indirect|infix|init|inout|internal|is|isolated|lazy|left|let|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|set|some|static|struct|subscript|super|switch|throw|throws|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
  boolean: /\b(?:false|true)\b/,
  nil: {
    pattern: /\bnil\b/,
    alias: "constant"
  },
  "short-argument": /\$\d+\b/,
  omit: {
    pattern: /\b_\b/,
    alias: "keyword"
  },
  number: /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
  // A class name must start with an upper-case letter and be either 1 letter long or contain a lower-case letter.
  "class-name": /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  constant: /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
  // Operators are generic in Swift. Developers can even create new operators (e.g. +++).
  // https://docs.swift.org/swift-book/ReferenceManual/zzSummaryOfTheGrammar.html#ID481
  // This regex only supports ASCII operators.
  operator: /[-+*/%=!<>&|^~?]+|\.[.\-+*/%=!<>&|^~?]+/,
  punctuation: /[{}[\]();,.:\\]/
};
Prism.languages.swift["string-literal"].forEach(function(t) {
  t.inside.interpolation.inside = Prism.languages.swift;
});
(function(t) {
  t.languages.typescript = t.languages.extend("javascript", {
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: !0,
      greedy: !0,
      inside: null
      // see below
    },
    builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
  }), t.languages.typescript.keyword.push(
    /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
    // keywords that have to be followed by an identifier
    /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
    // This is for `import type *, {}`
    /\btype\b(?=\s*(?:[\{*]|$))/
  ), delete t.languages.typescript.parameter, delete t.languages.typescript["literal-property"];
  var e = t.languages.extend("typescript", {});
  delete e["class-name"], t.languages.typescript["class-name"].inside = e, t.languages.insertBefore("typescript", "function", {
    decorator: {
      pattern: /@[$\w\xA0-\uFFFF]+/,
      inside: {
        at: {
          pattern: /^@/,
          alias: "operator"
        },
        function: /^[\s\S]+/
      }
    },
    "generic-function": {
      // e.g. foo<T extends "bar" | "baz">( ...
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
      greedy: !0,
      inside: {
        function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
        generic: {
          pattern: /<[\s\S]+/,
          // everything after the first <
          alias: "class-name",
          inside: e
        }
      }
    }
  }), t.languages.ts = t.languages.typescript;
})(Prism);
(function(t) {
  var e = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/, n = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source, r = {
    pattern: RegExp(/(^|[^\w.])/.source + n + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
    lookbehind: !0,
    inside: {
      namespace: {
        pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
        inside: {
          punctuation: /\./
        }
      },
      punctuation: /\./
    }
  };
  t.languages.java = t.languages.extend("clike", {
    string: {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: !0,
      greedy: !0
    },
    "class-name": [
      r,
      {
        // variables, parameters, and constructor references
        // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
        pattern: RegExp(/(^|[^\w.])/.source + n + /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),
        lookbehind: !0,
        inside: r.inside
      },
      {
        // class names based on keyword
        // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
        pattern: RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source + n + /[A-Z]\w*\b/.source),
        lookbehind: !0,
        inside: r.inside
      }
    ],
    keyword: e,
    function: [
      t.languages.clike.function,
      {
        pattern: /(::\s*)[a-z_]\w*/,
        lookbehind: !0
      }
    ],
    number: /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: !0
    },
    constant: /\b[A-Z][A-Z_\d]+\b/
  }), t.languages.insertBefore("java", "string", {
    "triple-quoted-string": {
      // http://openjdk.java.net/jeps/355#Description
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: !0,
      alias: "string"
    },
    char: {
      pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
      greedy: !0
    }
  }), t.languages.insertBefore("java", "class-name", {
    annotation: {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: !0,
      alias: "punctuation"
    },
    generics: {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
      inside: {
        "class-name": r,
        keyword: e,
        punctuation: /[<>(),.:]/,
        operator: /[?&|]/
      }
    },
    import: [
      {
        pattern: RegExp(/(\bimport\s+)/.source + n + /(?:[A-Z]\w*|\*)(?=\s*;)/.source),
        lookbehind: !0,
        inside: {
          namespace: r.inside.namespace,
          punctuation: /\./,
          operator: /\*/,
          "class-name": /\w+/
        }
      },
      {
        pattern: RegExp(/(\bimport\s+static\s+)/.source + n + /(?:\w+|\*)(?=\s*;)/.source),
        lookbehind: !0,
        alias: "static",
        inside: {
          namespace: r.inside.namespace,
          static: /\b\w+$/,
          punctuation: /\./,
          operator: /\*/,
          "class-name": /\w+/
        }
      }
    ],
    namespace: {
      pattern: RegExp(
        /(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g, function() {
          return e.source;
        })
      ),
      lookbehind: !0,
      inside: {
        punctuation: /\./
      }
    }
  });
})(Prism);
(function(t) {
  var e = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/, n = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function() {
    return e.source;
  });
  t.languages.cpp = t.languages.extend("c", {
    "class-name": [
      {
        pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(/<keyword>/g, function() {
          return e.source;
        })),
        lookbehind: !0
      },
      // This is intended to capture the class name of method implementations like:
      //   void foo::bar() const {}
      // However! The `foo` in the above example could also be a namespace, so we only capture the class name if
      // it starts with an uppercase letter. This approximation should give decent results.
      /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
      // This will capture the class name before destructors like:
      //   Foo::~Foo() {}
      /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
      // This also intends to capture the class name of method implementations but here the class has template
      // parameters, so it can't be a namespace (until C++ adds generic namespaces).
      /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
    ],
    keyword: e,
    number: {
      pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: !0
    },
    operator: />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    boolean: /\b(?:false|true)\b/
  }), t.languages.insertBefore("cpp", "string", {
    module: {
      // https://en.cppreference.com/w/cpp/language/modules
      pattern: RegExp(
        /(\b(?:import|module)\s+)/.source + "(?:" + // header-name
        /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source + "|" + // module name or partition or both
        /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, function() {
          return n;
        }) + ")"
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        string: /^[<"][\s\S]+/,
        operator: /:/,
        punctuation: /\./
      }
    },
    "raw-string": {
      pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
      alias: "string",
      greedy: !0
    }
  }), t.languages.insertBefore("cpp", "keyword", {
    "generic-function": {
      pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
      inside: {
        function: /^\w+/,
        generic: {
          pattern: /<[\s\S]+/,
          alias: "class-name",
          inside: t.languages.cpp
        }
      }
    }
  }), t.languages.insertBefore("cpp", "operator", {
    "double-colon": {
      pattern: /::/,
      alias: "punctuation"
    }
  }), t.languages.insertBefore("cpp", "class-name", {
    // the base clause is an optional list of parent classes
    // https://en.cppreference.com/w/cpp/language/class
    "base-clause": {
      pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
      lookbehind: !0,
      greedy: !0,
      inside: t.languages.extend("cpp", {})
    }
  }), t.languages.insertBefore("inside", "double-colon", {
    // All untokenized words that are not namespaces should be class names
    "class-name": /\b[a-z_]\w*\b(?!\s*::)/i
  }, t.languages.cpp["base-clause"]);
})(Prism);
function Vw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
Vw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const Cg = (t) => t != null && window.Prism.languages.hasOwnProperty(t) ? t : void 0;
function Nv(t, e) {
  for (const n of t.childNodes) {
    if (on(n) && n.tagName === e) return !0;
    Nv(n, e);
  }
  return !1;
}
const Go = "data-highlight-language";
let da = class bv extends St {
  static getType() {
    return "code";
  }
  static clone(e) {
    return new bv(e.__language, e.__key);
  }
  constructor(e, n) {
    super(n), this.__language = Cg(e);
  }
  createDOM(e) {
    const n = document.createElement("code");
    Ot(n, e.theme.code), n.setAttribute("spellcheck", "false");
    const r = this.getLanguage();
    return r && n.setAttribute(Go, r), n;
  }
  updateDOM(e, n, r) {
    const o = this.__language, i = e.__language;
    return o ? o !== i && n.setAttribute(Go, o) : i && n.removeAttribute(Go), !1;
  }
  exportDOM(e) {
    const n = document.createElement("pre");
    Ot(n, e._config.theme.code), n.setAttribute("spellcheck", "false");
    const r = this.getLanguage();
    return r && n.setAttribute(Go, r), { element: n };
  }
  static importDOM() {
    return { code: (e) => e.textContent != null && (/\r?\n/.test(e.textContent) || Nv(e, "BR")) ? { conversion: Eg, priority: 1 } : null, div: () => ({ conversion: Hw, priority: 1 }), pre: () => ({ conversion: Eg, priority: 0 }), table: (e) => nu(e) ? { conversion: Kw, priority: 3 } : null, td: (e) => {
      const n = e, r = n.closest("table");
      return n.classList.contains("js-file-line") || r && nu(r) ? { conversion: Tg, priority: 3 } : null;
    }, tr: (e) => {
      const n = e.closest("table");
      return n && nu(n) ? { conversion: Tg, priority: 3 } : null;
    } };
  }
  static importJSON(e) {
    const n = tr(e.language);
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), language: this.getLanguage(), type: "code", version: 1 };
  }
  insertNewAfter(e, n = !0) {
    const r = this.getChildren(), o = r.length;
    if (o >= 2 && r[o - 1].getTextContent() === `
` && r[o - 2].getTextContent() === `
` && e.isCollapsed() && e.anchor.key === this.__key && e.anchor.offset === o) {
      r[o - 1].remove(), r[o - 2].remove();
      const a = ge();
      return this.insertAfter(a, n), a;
    }
    const { anchor: i, focus: s } = e, l = (i.isBefore(s) ? i : s).getNode();
    if (I(l)) {
      let a = Yw(l);
      const u = [];
      for (; ; ) if (Qd(a)) u.push(xo()), a = a.getNextSibling();
      else {
        if (!Fv(a)) break;
        {
          let _ = 0;
          const v = a.getTextContent(), d = a.getTextContentSize();
          for (; _ < d && v[_] === " "; ) _++;
          if (_ !== 0 && u.push(Av(" ".repeat(_))), _ !== d) break;
          a = a.getNextSibling();
        }
      }
      const c = l.splitText(i.offset)[0], p = i.offset === 0 ? 0 : 1, f = c.getIndexWithinParent() + p, m = l.getParentOrThrow(), h = [en(), ...u];
      m.splice(f, 0, h);
      const y = u[u.length - 1];
      y ? y.select() : i.offset === 0 ? c.selectPrevious() : c.getNextSibling().selectNext(0, 0);
    }
    if (Cl(l)) {
      const { offset: a } = e.anchor;
      l.splice(a, 0, [en()]), l.select(a + 1, a + 1);
    }
    return null;
  }
  canIndent() {
    return !1;
  }
  collapseAtStart() {
    const e = ge();
    return this.getChildren().forEach((n) => e.append(n)), this.replace(e), !0;
  }
  setLanguage(e) {
    this.getWritable().__language = Cg(e);
  }
  getLanguage() {
    return this.getLatest().__language;
  }
};
function tr(t) {
  return We(new da(t));
}
function Cl(t) {
  return t instanceof da;
}
function Eg(t) {
  return { node: tr(t.getAttribute(Go)) };
}
function Hw(t) {
  const e = t, n = Ng(e);
  return n || function(r) {
    let o = r.parentElement;
    for (; o !== null; ) {
      if (Ng(o)) return !0;
      o = o.parentElement;
    }
    return !1;
  }(e) ? { node: n ? tr() : null } : { node: null };
}
function Kw() {
  return { node: tr() };
}
function Tg() {
  return { node: null };
}
function Ng(t) {
  return t.style.fontFamily.match("monospace") !== null;
}
function nu(t) {
  return t.classList.contains("js-file-line-container");
}
const Qw = "javascript", Gw = () => Qw, Jw = () => Object.keys(window.Prism.languages).filter((t) => typeof window.Prism.languages[t] != "function").sort();
let nf = class Ov extends qn {
  constructor(e, n, r) {
    super(e, r), this.__highlightType = n;
  }
  static getType() {
    return "code-highlight";
  }
  static clone(e) {
    return new Ov(e.__text, e.__highlightType || void 0, e.__key);
  }
  getHighlightType() {
    return this.getLatest().__highlightType;
  }
  canHaveFormat() {
    return !1;
  }
  createDOM(e) {
    const n = super.createDOM(e), r = ru(e.theme, this.__highlightType);
    return Ot(n, r), n;
  }
  updateDOM(e, n, r) {
    const o = super.updateDOM(e, n, r), i = ru(r.theme, e.__highlightType), s = ru(r.theme, this.__highlightType);
    return i !== s && (i && Xd(n, i), s && Ot(n, s)), o;
  }
  static importJSON(e) {
    const n = Av(e.text, e.highlightType);
    return n.setFormat(e.format), n.setDetail(e.detail), n.setMode(e.mode), n.setStyle(e.style), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), highlightType: this.getHighlightType(), type: "code-highlight", version: 1 };
  }
  setFormat(e) {
    return this;
  }
  isParentRequired() {
    return !0;
  }
  createParentElementNode() {
    return tr();
  }
};
function ru(t, e) {
  return e && t && t.codeHighlight && t.codeHighlight[e];
}
function Av(t, e) {
  return We(new nf(t, e));
}
function Fv(t) {
  return t instanceof nf;
}
function Yw(t) {
  let e = t, n = t;
  for (; Fv(n) || Qd(n); ) e = n, n = n.getPreviousSibling();
  return e;
}
const Zw = /* @__PURE__ */ new Set(["http:", "https:", "mailto:", "sms:", "tel:"]);
class nr extends St {
  static getType() {
    return "link";
  }
  static clone(e) {
    return new nr(e.__url, { rel: e.__rel, target: e.__target, title: e.__title }, e.__key);
  }
  constructor(e, n = {}, r) {
    super(r);
    const { target: o = null, rel: i = null, title: s = null } = n;
    this.__url = e, this.__target = o, this.__rel = i, this.__title = s;
  }
  createDOM(e) {
    const n = document.createElement("a");
    return n.href = this.sanitizeUrl(this.__url), this.__target !== null && (n.target = this.__target), this.__rel !== null && (n.rel = this.__rel), this.__title !== null && (n.title = this.__title), Ot(n, e.theme.link), n;
  }
  updateDOM(e, n, r) {
    const o = this.__url, i = this.__target, s = this.__rel, l = this.__title;
    return o !== e.__url && (n.href = o), i !== e.__target && (i ? n.target = i : n.removeAttribute("target")), s !== e.__rel && (s ? n.rel = s : n.removeAttribute("rel")), l !== e.__title && (l ? n.title = l : n.removeAttribute("title")), !1;
  }
  static importDOM() {
    return { a: (e) => ({ conversion: Xw, priority: 1 }) };
  }
  static importJSON(e) {
    const n = Fi(e.url, { rel: e.rel, target: e.target, title: e.title });
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  sanitizeUrl(e) {
    try {
      const n = new URL(e);
      if (!Zw.has(n.protocol)) return "about:blank";
    } catch {
      return e;
    }
    return e;
  }
  exportJSON() {
    return { ...super.exportJSON(), rel: this.getRel(), target: this.getTarget(), title: this.getTitle(), type: "link", url: this.getURL(), version: 1 };
  }
  getURL() {
    return this.getLatest().__url;
  }
  setURL(e) {
    this.getWritable().__url = e;
  }
  getTarget() {
    return this.getLatest().__target;
  }
  setTarget(e) {
    this.getWritable().__target = e;
  }
  getRel() {
    return this.getLatest().__rel;
  }
  setRel(e) {
    this.getWritable().__rel = e;
  }
  getTitle() {
    return this.getLatest().__title;
  }
  setTitle(e) {
    this.getWritable().__title = e;
  }
  insertNewAfter(e, n = !0) {
    const r = Fi(this.__url, { rel: this.__rel, target: this.__target, title: this.__title });
    return this.insertAfter(r, n), r;
  }
  canInsertTextBefore() {
    return !1;
  }
  canInsertTextAfter() {
    return !1;
  }
  canBeEmpty() {
    return !1;
  }
  isInline() {
    return !0;
  }
  extractWithChild(e, n, r) {
    if (!A(n)) return !1;
    const o = n.anchor.getNode(), i = n.focus.getNode();
    return this.isParentOf(o) && this.isParentOf(i) && n.getTextContent().length > 0;
  }
}
function Xw(t) {
  let e = null;
  if (rx(t)) {
    const n = t.textContent;
    (n !== null && n !== "" || t.children.length > 0) && (e = Fi(t.getAttribute("href") || "", { rel: t.getAttribute("rel"), target: t.getAttribute("target"), title: t.getAttribute("title") }));
  }
  return { node: e };
}
function Fi(t, e) {
  return We(new nr(t, e));
}
function Qt(t) {
  return t instanceof nr;
}
class fa extends nr {
  static getType() {
    return "autolink";
  }
  static clone(e) {
    return new fa(e.__url, { rel: e.__rel, target: e.__target, title: e.__title }, e.__key);
  }
  static importJSON(e) {
    const n = bg(e.url, { rel: e.rel, target: e.target, title: e.title });
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  static importDOM() {
    return null;
  }
  exportJSON() {
    return { ...super.exportJSON(), type: "autolink", version: 1 };
  }
  insertNewAfter(e, n = !0) {
    const r = this.getParentOrThrow().insertNewAfter(e, n);
    if (b(r)) {
      const o = bg(this.__url, { rel: this.__rel, target: this.__target, title: this.__title });
      return r.append(o), o;
    }
    return null;
  }
}
function bg(t, e) {
  return We(new fa(t, e));
}
const Pi = rn();
function ou(t, e = {}) {
  const { target: n, title: r } = e, o = e.rel === void 0 ? "noreferrer" : e.rel, i = $();
  if (!A(i)) return;
  const s = i.extract();
  if (t === null) s.forEach((l) => {
    const a = l.getParent();
    if (Qt(a)) {
      const u = a.getChildren();
      for (let c = 0; c < u.length; c++) a.insertBefore(u[c]);
      a.remove();
    }
  });
  else {
    if (s.length === 1) {
      const u = function(c, p) {
        let f = c;
        for (; f !== null && f.getParent() !== null && !p(f); ) f = f.getParentOrThrow();
        return p(f) ? f : null;
      }(s[0], Qt);
      if (u !== null) return u.setURL(t), n !== void 0 && u.setTarget(n), o !== null && u.setRel(o), void (r !== void 0 && u.setTitle(r));
    }
    let l = null, a = null;
    s.forEach((u) => {
      const c = u.getParent();
      if (c !== a && c !== null && (!b(u) || u.isInline())) {
        if (Qt(c)) return a = c, c.setURL(t), n !== void 0 && c.setTarget(n), o !== null && a.setRel(o), void (r !== void 0 && a.setTitle(r));
        if (c.is(l) || (l = c, a = Fi(t, { rel: o, target: n, title: r }), Qt(c) ? u.getPreviousSibling() === null ? c.insertBefore(a) : c.insertAfter(a) : u.insertBefore(a)), Qt(u)) {
          if (u.is(a)) return;
          if (a !== null) {
            const p = u.getChildren();
            for (let f = 0; f < p.length; f++) a.append(p[f]);
          }
          u.remove();
        } else a !== null && a.append(u);
      }
    });
  }
}
function qw({ validateUrl: t }) {
  const [e] = Se();
  return T.useEffect(() => {
    if (!e.hasNodes([nr])) throw new Error("LinkPlugin: LinkNode not registered on editor");
    return Ue(e.registerCommand(Pi, (n) => {
      if (n === null) return ou(n), !0;
      if (typeof n == "string") return !(t !== void 0 && !t(n)) && (ou(n), !0);
      {
        const { url: r, target: o, rel: i, title: s } = n;
        return ou(r, { rel: i, target: o, title: s }), !0;
      }
    }, ie), t !== void 0 ? e.registerCommand(vo, (n) => {
      const r = $();
      if (!A(r) || r.isCollapsed() || !pn(n, ClipboardEvent)) return !1;
      const o = n;
      if (o.clipboardData === null) return !1;
      const i = o.clipboardData.getData("text");
      return !!t(i) && !r.getNodes().some((s) => b(s)) && (e.dispatchCommand(Pi, i), n.preventDefault(), !0);
    }, ie) : () => {
    });
  }, [e, t]), null;
}
function eS() {
  const [t] = Se();
  return T.useEffect(() => {
    if (!t.hasNodes([br, Nr])) throw new Error("ListPlugin: ListNode and/or ListItemNode not registered on editor");
  }, [t]), function(e) {
    T.useEffect(() => Ue(e.registerCommand(Tv, () => (yg(e, "number"), !0), ie), e.registerCommand(Ev, () => (yg(e, "bullet"), !0), ie), e.registerCommand(Ec, () => (Rw(e), !0), ie), e.registerCommand(uo, () => !!zw(), ie)), [e]);
  }(t), null;
}
const tS = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect, Og = (t) => {
  const e = document.getElementById("typeahead-menu");
  if (!e) return;
  const n = e.getBoundingClientRect();
  n.top + n.height > window.innerHeight && e.scrollIntoView({ block: "center" }), n.top < 0 && e.scrollIntoView({ block: "center" }), t.scrollIntoView({ block: "nearest" });
};
function Ag(t, e) {
  const n = t.getBoundingClientRect(), r = e.getBoundingClientRect();
  return n.top > r.top && n.top < r.bottom;
}
function nS(t, e, n, r) {
  const [o] = Se();
  T.useEffect(() => {
    if (e != null && t != null) {
      const i = o.getRootElement(), s = i != null ? function(p, f) {
        let m = getComputedStyle(p);
        const h = m.position === "absolute", y = /(auto|scroll)/;
        if (m.position === "fixed") return document.body;
        for (let _ = p; _ = _.parentElement; ) if (m = getComputedStyle(_), (!h || m.position !== "static") && y.test(m.overflow + m.overflowY + m.overflowX)) return _;
        return document.body;
      }(i) : document.body;
      let l = !1, a = Ag(e, s);
      const u = function() {
        l || (window.requestAnimationFrame(function() {
          n(), l = !1;
        }), l = !0);
        const p = Ag(e, s);
        p !== a && (a = p, r != null && r(p));
      }, c = new ResizeObserver(n);
      return window.addEventListener("resize", n), document.addEventListener("scroll", u, { capture: !0, passive: !0 }), c.observe(e), () => {
        c.unobserve(e), window.removeEventListener("resize", n), document.removeEventListener("scroll", u, !0);
      };
    }
  }, [e, o, r, n, t]);
}
const Fg = rn();
function rS({ close: t, editor: e, anchorElementRef: n, resolution: r, options: o, menuRenderFn: i, onSelectOption: s, shouldSplitNodeWithQuery: l = !1, commandPriority: a = ie }) {
  const [u, c] = T.useState(null), p = r.match && r.match.matchingString;
  T.useEffect(() => {
    c(0);
  }, [p]);
  const f = T.useCallback((h) => {
    e.update(() => {
      const y = r.match != null && l ? function(_) {
        const v = $();
        if (!A(v) || !v.isCollapsed()) return null;
        const d = v.anchor;
        if (d.type !== "text") return null;
        const g = d.getNode();
        if (!g.isSimpleText()) return null;
        const x = d.offset, w = g.getTextContent().slice(0, x), S = _.replaceableString.length, k = x - function(E, N, D) {
          let z = D;
          for (let H = z; H <= N.length; H++) E.substr(-H) === N.substr(0, H) && (z = H);
          return z;
        }(w, _.matchingString, S);
        if (k < 0) return null;
        let C;
        return k === 0 ? [C] = g.splitText(x) : [, C] = g.splitText(k, x), C;
      }(r.match) : null;
      s(h, y, t, r.match ? r.match.matchingString : "");
    });
  }, [e, l, r.match, s, t]), m = T.useCallback((h) => {
    const y = e.getRootElement();
    y !== null && (y.setAttribute("aria-activedescendant", "typeahead-item-" + h), c(h));
  }, [e]);
  return T.useEffect(() => () => {
    const h = e.getRootElement();
    h !== null && h.removeAttribute("aria-activedescendant");
  }, [e]), tS(() => {
    o === null ? c(null) : u === null && m(0);
  }, [o, u, m]), T.useEffect(() => Ue(e.registerCommand(Fg, ({ option: h }) => !(!h.ref || h.ref.current == null) && (Og(h.ref.current), !0), a)), [e, m, a]), T.useEffect(() => Ue(e.registerCommand(Gl, (h) => {
    const y = h;
    if (o !== null && o.length && u !== null) {
      const _ = u !== o.length - 1 ? u + 1 : 0;
      m(_);
      const v = o[_];
      v.ref != null && v.ref.current && e.dispatchCommand(Fg, { index: _, option: v }), y.preventDefault(), y.stopImmediatePropagation();
    }
    return !0;
  }, a), e.registerCommand(Ql, (h) => {
    const y = h;
    if (o !== null && o.length && u !== null) {
      const _ = u !== 0 ? u - 1 : o.length - 1;
      m(_);
      const v = o[_];
      v.ref != null && v.ref.current && Og(v.ref.current), y.preventDefault(), y.stopImmediatePropagation();
    }
    return !0;
  }, a), e.registerCommand(Jl, (h) => {
    const y = h;
    return y.preventDefault(), y.stopImmediatePropagation(), t(), !0;
  }, a), e.registerCommand(Cd, (h) => {
    const y = h;
    return o !== null && u !== null && o[u] != null && (y.preventDefault(), y.stopImmediatePropagation(), f(o[u]), !0);
  }, a), e.registerCommand(xr, (h) => o !== null && u !== null && o[u] != null && (h !== null && (h.preventDefault(), h.stopImmediatePropagation()), f(o[u]), !0), a)), [f, t, e, o, u, m, a]), i(n, T.useMemo(() => ({ options: o, selectOptionAndCleanUp: f, selectedIndex: u, setHighlightedIndex: c }), [f, u, o]), r.match ? r.match.matchingString : "");
}
function oS({ options: t, onQueryChange: e, onSelectOption: n, onOpen: r, onClose: o, menuRenderFn: i, triggerFn: s, anchorClassName: l, commandPriority: a = ie, parent: u }) {
  const [c] = Se(), [p, f] = T.useState(null), m = function(_, v, d, g = document.body) {
    const [x] = Se(), w = T.useRef(document.createElement("div")), S = T.useCallback(() => {
      w.current.style.top = w.current.style.bottom;
      const C = x.getRootElement(), E = w.current, N = E.firstChild;
      if (C !== null && _ !== null) {
        const { left: D, top: z, width: H, height: j } = _.getRect(), J = w.current.offsetHeight;
        if (E.style.top = `${z + window.pageYOffset + J + 3}px`, E.style.left = `${D + window.pageXOffset}px`, E.style.height = `${j}px`, E.style.width = `${H}px`, N !== null) {
          N.style.top = `${z}`;
          const G = N.getBoundingClientRect(), te = G.height, L = G.width, U = C.getBoundingClientRect();
          D + L > U.right && (E.style.left = `${U.right - L + window.pageXOffset}px`), (z + te > window.innerHeight || z + te > U.bottom) && z - U.top > te + j && (E.style.top = z - te + window.pageYOffset - j + "px");
        }
        E.isConnected || (d != null && (E.className = d), E.setAttribute("aria-label", "Typeahead menu"), E.setAttribute("id", "typeahead-menu"), E.setAttribute("role", "listbox"), E.style.display = "block", E.style.position = "absolute", g.append(E)), w.current = E, C.setAttribute("aria-controls", "typeahead-menu");
      }
    }, [x, _, d, g]);
    T.useEffect(() => {
      const C = x.getRootElement();
      if (_ !== null) return S(), () => {
        C !== null && C.removeAttribute("aria-controls");
        const E = w.current;
        E !== null && E.isConnected && E.remove();
      };
    }, [x, S, _]);
    const k = T.useCallback((C) => {
      _ !== null && (C || v(null));
    }, [_, v]);
    return nS(_, w.current, S, k), w;
  }(p, f, l, u), h = T.useCallback(() => {
    f(null), o != null && p !== null && o();
  }, [o, p]), y = T.useCallback((_) => {
    f(_), r != null && p === null && r(_);
  }, [r, p]);
  return T.useEffect(() => {
    const _ = c.registerUpdateListener(() => {
      c.getEditorState().read(() => {
        const v = c._window || window, d = v.document.createRange(), g = $(), x = function(k) {
          let C = null;
          return k.getEditorState().read(() => {
            const E = $();
            A(E) && (C = function(N) {
              const D = N.anchor;
              if (D.type !== "text") return null;
              const z = D.getNode();
              if (!z.isSimpleText()) return null;
              const H = D.offset;
              return z.getTextContent().slice(0, H);
            }(E));
          }), C;
        }(c);
        if (!A(g) || !g.isCollapsed() || x === null || d === null) return void h();
        const w = s(x, c);
        if (e(w ? w.matchingString : null), w !== null && !function(k, C) {
          return C === 0 && k.getEditorState().read(() => {
            const E = $();
            if (A(E)) {
              const N = E.anchor.getNode().getPreviousSibling();
              return I(N) && N.isTextEntity();
            }
            return !1;
          });
        }(c, w.leadOffset) && function(C, E, N) {
          const D = N.getSelection();
          if (D === null || !D.isCollapsed) return !1;
          const z = D.anchorNode, H = C, j = D.anchorOffset;
          if (z == null || j == null) return !1;
          try {
            E.setStart(z, H), E.setEnd(z, j);
          } catch {
            return !1;
          }
          return !0;
        }(w.leadOffset, d, v) !== null)
          return S = () => y({ getRect: () => d.getBoundingClientRect(), match: w }), void (T.startTransition ? T.startTransition(S) : S());
        var S;
        h();
      });
    });
    return () => {
      _();
    };
  }, [c, s, e, p, h, y]), p === null || c === null ? null : O.jsx(rS, { close: h, resolution: p, editor: c, anchorElementRef: m, options: t, menuRenderFn: i, shouldSplitNodeWithQuery: !0, onSelectOption: n, commandPriority: a });
}
const iS = "​";
class pa extends qn {
  static getType() {
    return "zeroWidth";
  }
  static clone(e) {
    return new pa(e.__textContent, e.__key);
  }
  static importJSON(e) {
    return sS();
  }
  constructor(e, n) {
    super(iS, n), this.__textContent = e;
  }
  exportJSON() {
    return Object.assign(Object.assign({}, super.exportJSON()), { text: "", type: "zeroWidth" });
  }
  updateDOM() {
    return !1;
  }
  static importDOM() {
    return null;
  }
  exportDOM(e) {
    return { element: null };
  }
  isTextEntity() {
    return !0;
  }
  getTextContent() {
    return this.__textContent;
  }
}
function sS(t = "") {
  const e = new pa(t);
  return e.setMode("segmented"), We(e);
}
function ga(t) {
  return t instanceof pa;
}
const Pv = `\\.,\\*\\?\\$\\|#{}\\(\\)\\^\\[\\]\\\\/!%'"~=<>_:;`, lS = "\\(", aS = (t) => "(?:" + t.join("|") + ")", $v = (t, e) => (t.length === 0 ? "" : "(?!" + t.join("|") + ")") + "[^\\s" + e + "]", uS = 75;
function Tc(t, e, n) {
  return new RegExp($v(e, n)).test(t);
}
function Jo(t, e) {
  const n = $();
  if (!n || !A(n))
    return;
  const r = n.anchor, o = n.focus, i = n.getNodes();
  if (r.key !== o.key || r.offset !== o.offset || i.length === 0)
    return;
  const [s] = i, l = ga(s) ? s.getPreviousSibling() : s;
  if (!l)
    return;
  const a = I(l) && l.isSimpleText(), u = r.type === "text" ? r.offset : 0, c = Gt(l), p = u === 0, f = c.length === u, m = c.charAt(u - 1), h = c.charAt(u), y = Tc(m, t, e), _ = Tc(h, t, e), v = /\s/.test(m), d = /\s/.test(h), g = ma(l), x = ha(l), w = {
    node: l,
    offset: u,
    isTextNode: a,
    textContent: c,
    selection: n,
    prevNode: g,
    nextNode: x,
    cursorAtStartOfNode: p,
    cursorAtEndOfNode: f,
    wordCharBeforeCursor: y,
    wordCharAfterCursor: _,
    spaceBeforeCursor: v,
    spaceAfterCursor: d
  };
  return a ? Object.assign(Object.assign({}, w), { isTextNode: !0, node: l }) : Object.assign(Object.assign({}, w), { isTextNode: !1, node: l });
}
function ha(t) {
  let e = t.getNextSibling();
  for (; e !== null && ga(e); )
    e = e.getNextSibling();
  return e;
}
function ma(t) {
  let e = t.getPreviousSibling();
  for (; e !== null && ga(e); )
    e = e.getPreviousSibling();
  return e;
}
function Gt(t) {
  return ga(t) ? "" : t.getTextContent();
}
function cS(t, e) {
  return typeof t == "string" || typeof t == "boolean" ? t : e === null ? !1 : typeof t == "object" ? t[e] : !1;
}
function dS(t, e) {
  return typeof t == "number" || t === !1 ? t : typeof t > "u" ? 5 : e === null ? !1 : typeof t == "object" ? t[e] : 5;
}
function fS(t) {
  const e = t.getLastDescendant();
  return b(e) || I(e) ? e : se(e) ? e.getParent() : t;
}
function rf() {
  const t = ye(), e = fS(t), n = e && e.getKey(), r = b(e) ? e.getChildrenSize() : I(e) ? Gt(e).length : 0, o = b(e) ? "element" : "text";
  if (n) {
    const i = By();
    i.anchor.set(n, r, o), i.focus.set(n, r, o), De(i);
  }
}
class Nc {
  constructor(e, n, r) {
    this.value = e, this.displayValue = n, this.data = r, this.key = r ? JSON.stringify(Object.assign(Object.assign({}, r), { value: e })) : e, this.displayValue = n ?? e, this.ref = { current: null }, this.setRefElement = this.setRefElement.bind(this);
  }
  setRefElement(e) {
    this.ref = { current: e };
  }
}
function Pg(t) {
  const e = $();
  if (!A(e) || !e.isCollapsed())
    return null;
  const n = e.anchor;
  if (n.type !== "text")
    return null;
  const r = n.getNode();
  if (!r.isSimpleText())
    return null;
  const o = n.offset, i = Gt(r).slice(0, o), s = t.replaceableString.length, l = pS(i, t.matchingString, s), a = o - l;
  if (a < 0)
    return null;
  let u;
  return a === 0 ? [u] = r.splitText(o) : [, u] = r.splitText(a, o), u;
}
function pS(t, e, n) {
  let r = n;
  for (let o = r; o <= e.length; o++)
    t.substring(-o) === e.substring(0, o) && (r = o);
  return r;
}
const To = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", gS = To && /iPad|iPhone|iPod/.test(navigator.userAgent) && // @ts-ignore
!window.MSStream, Yo = To && window.matchMedia("(pointer: coarse)").matches;
function $g(t, e) {
  return t.getEditorState().read(() => {
    const n = Ce(e);
    return n !== null && n.isSelected();
  });
}
function hS(t) {
  const [e] = Se(), [n, r] = T.useState(() => $g(e, t));
  return T.useEffect(() => {
    let o = !0;
    const i = e.registerUpdateListener(() => {
      o && r($g(e, t));
    });
    return () => {
      o = !1, i();
    };
  }, [e, t]), [n, T.useCallback((o) => {
    e.update(() => {
      let i = $();
      $e(i) || (i = mc(), De(i)), $e(i) && (o ? i.add(t) : i.delete(t));
    });
  }, [e, t]), T.useCallback(() => {
    e.update(() => {
      const o = $();
      $e(o) && o.clear();
    });
  }, [e])];
}
const mS = To ? T.useLayoutEffect : T.useEffect, of = () => {
  const [t] = Se(), [e, n] = T.useState(() => To ? t.getRootElement() === document.activeElement : !1);
  return mS(() => Ue(t.registerCommand(Nd, () => (n(!0), !1), Ai), t.registerCommand(Xl, () => (n(!1), !1), Ai)), [t]), e;
};
function yS(t) {
  const { value: e, trigger: n, data: r, className: o, classNameFocused: i, classNames: s, nodeKey: l, component: a } = t, [u] = Se(), c = of(), [p, f, m] = hS(l), h = T.useRef(null), y = n + e, _ = T.useMemo(() => {
    if (o) {
      const k = [o];
      return p && c && i && k.push(i), k.join(" ").trim() || void 0;
    }
    return "";
  }, [p, o, i, c]), v = T.useCallback((k) => {
    if (p && $e($())) {
      k.preventDefault();
      const C = Ce(l);
      Ir(C) && C.remove();
    }
    return !1;
  }, [p, l]), d = T.useCallback((k) => {
    const C = Ce(l);
    if (!C || !C.isSelected())
      return !1;
    let E = !1;
    const N = ma(C);
    return b(N) && (N.selectEnd(), E = !0), I(N) && (N.select(), E = !0), se(N) && (N.selectNext(), E = !0), N === null && (C.selectPrevious(), E = !0), E && k.preventDefault(), E;
  }, [l]), g = T.useCallback((k) => {
    const C = Ce(l);
    if (!C || !C.isSelected())
      return !1;
    let E = !1;
    const N = ha(C);
    return b(N) && (N.selectStart(), E = !0), I(N) && (N.select(0, 0), E = !0), se(N) && (N.selectPrevious(), E = !0), N === null && (C.selectNext(), E = !0), E && k.preventDefault(), E;
  }, [l]), x = T.useCallback((k) => {
    var C;
    return k.target === h.current || !((C = h.current) === null || C === void 0) && C.contains(k.target) ? (k.shiftKey || m(), f(!0), !0) : !1;
  }, [m, f]), w = T.useCallback(() => {
    const k = Ce(l);
    if (!k || !k.isSelected())
      return !1;
    const C = $();
    return $e(C) && De(null), !1;
  }, [l]), S = T.useCallback(() => gS && p ? (f(!1), !0) : !1, [p, f]);
  return T.useEffect(() => {
    const k = Ue(u.registerCommand(Ul, x, ie), u.registerCommand(Yl, v, ie), u.registerCommand(_o, v, ie), u.registerCommand(Kl, d, ie), u.registerCommand(Hl, g, ie), u.registerCommand(Xl, w, ie), u.registerCommand(Tr, S, ie));
    return () => {
      k();
    };
  }, [
    u,
    d,
    g,
    x,
    v,
    w,
    S
  ]), a ? O.jsx(a, { ref: h, trigger: n, value: e, data: r, className: _, "data-beautiful-mention": y, children: y }) : s ? O.jsxs("span", { ref: h, className: p && s.containerFocused ? s.containerFocused : s.container, "data-beautiful-mention": y, children: [O.jsx("span", { className: s.trigger, children: n }), O.jsx("span", { className: s.value, children: e })] }) : O.jsx("span", { ref: h, className: _, "data-beautiful-mention": y, children: y });
}
function vS(t) {
  const e = t.getAttribute("data-lexical-beautiful-mention-trigger"), n = t.getAttribute("data-lexical-beautiful-mention-value");
  let r;
  const o = t.getAttribute("data-lexical-beautiful-mention-data");
  if (o)
    try {
      r = JSON.parse(o);
    } catch (i) {
      console.warn("Failed to parse data attribute of beautiful mention node", i);
    }
  return e != null && n !== null ? { node: $i(e, n, r) } : null;
}
class nn extends Hy {
  static getType() {
    return "beautifulMention";
  }
  static clone(e) {
    return new nn(e.__trigger, e.__value, e.__data, e.__key);
  }
  constructor(e, n, r, o) {
    super(o), this.__trigger = e, this.__value = n, this.__data = r;
  }
  createDOM() {
    return document.createElement("span");
  }
  updateDOM() {
    return !1;
  }
  exportDOM() {
    const e = document.createElement("span");
    return e.setAttribute("data-lexical-beautiful-mention", "true"), e.setAttribute("data-lexical-beautiful-mention-trigger", this.__trigger), e.setAttribute("data-lexical-beautiful-mention-value", this.__value), this.__data && e.setAttribute("data-lexical-beautiful-mention-data", JSON.stringify(this.__data)), e.textContent = this.getTextContent(), { element: e };
  }
  static importDOM() {
    return {
      span: (e) => e.hasAttribute("data-lexical-beautiful-mention") ? {
        conversion: vS,
        priority: 1
      } : null
    };
  }
  static importJSON(e) {
    return $i(e.trigger, e.value, e.data);
  }
  exportJSON() {
    const e = this.__data;
    return Object.assign(Object.assign({ trigger: this.__trigger, value: this.__value }, e ? { data: e } : {}), { type: "beautifulMention", version: 1 });
  }
  getTextContent() {
    const e = this.getLatest();
    return e.__trigger + e.__value;
  }
  getTrigger() {
    return this.getLatest().__trigger;
  }
  getValue() {
    return this.getLatest().__value;
  }
  setValue(e) {
    const n = this.getWritable();
    n.__value = e;
  }
  getData() {
    return this.getLatest().__data;
  }
  setData(e) {
    const n = this.getWritable();
    n.__data = e;
  }
  component() {
    return null;
  }
  decorate(e, n) {
    const { className: r, classNameFocused: o, classNames: i } = this.getCssClassesFromTheme(n);
    return O.jsx(yS, { nodeKey: this.getKey(), trigger: this.getTrigger(), value: this.getValue(), data: this.getData(), className: r, classNameFocused: o, classNames: i, component: this.component() });
  }
  getCssClassesFromTheme(e) {
    const n = e.theme.beautifulMentions || {}, r = Object.entries(n).find(([u]) => new RegExp(u).test(this.__trigger)), o = r && r[0], i = r && r[1], s = typeof i == "string" ? i : void 0, l = s && typeof n[o + "Focused"] == "string" ? n[o + "Focused"] : void 0;
    return {
      className: s,
      classNameFocused: l,
      classNames: r && typeof i != "string" ? i : void 0
    };
  }
}
function $i(t, e, n) {
  const r = new nn(t, e, n);
  return We(r);
}
function Ir(t) {
  return t instanceof nn;
}
const _S = rn(), xS = rn(), wS = rn(), SS = rn();
function Lv(t, e, n) {
  return Iv(t, e, n);
}
function kS(t, e, n, r, o) {
  return Iv(t, e, n, r, o);
}
function Iv(t, e, n, r, o) {
  const i = Jo(t, e);
  if (!i)
    return !1;
  const { node: s, selection: l, wordCharBeforeCursor: a, wordCharAfterCursor: u, cursorAtStartOfNode: c, cursorAtEndOfNode: p, prevNode: f, nextNode: m } = i, h = r ? $i(n, r, o) : oe(n);
  if (!(Bt(s) && c) && !I(s))
    return l.insertNodes([oe(" "), h]), !0;
  let y = null;
  const _ = [];
  return (a || c && f !== null && !I(f)) && _.push(oe(" ")), _.push(h), (u || p && m !== null && !I(m)) && (y = oe(" "), _.push(y)), l.insertNodes(_), _.length > 1 && (I(h) ? h.select() : y && y.selectPrevious()), !0;
}
function CS(t, e, n = !0) {
  let r = !1, o = null, i = null;
  const s = Wd(nn);
  for (const l of s) {
    const a = l.getTrigger() === t, u = l.getValue() === e;
    a && (u || !e) && (o = ma(l), i = ha(l), l.remove(), r = !0, I(o) && Gt(o).endsWith(" ") && i && Gt(i).startsWith(" ") && o.setTextContent(Gt(o).slice(0, -1)), i === null && I(o) && Gt(o).endsWith(" ") && o.setTextContent(Gt(o).trimEnd()));
  }
  return r && n ? Rv(o, i) : n || De(null), r;
}
function ES(t, e, n, r = !0) {
  const o = Wd(nn);
  let i = null;
  for (const s of o) {
    const l = s.getTrigger() === t, a = s.getValue() === n;
    l && (a || !n) && (i = s, s.setValue(e));
  }
  if (i && r) {
    const s = ma(i), l = ha(i);
    Rv(s, l), l && I(l) ? l.select(0, 0) : rf();
  } else r || De(null);
  return i !== null;
}
function Rv(t, e) {
  e && I(e) ? e.select(0, 0) : t && I(t) ? t.select() : rf();
}
class iu extends Nc {
  constructor(e, n, r, o = {}) {
    super(n, r, o), this.itemType = e, this.comboboxItem = {
      itemType: e,
      value: n,
      displayValue: r,
      data: o
    }, this.menuOption = new Nc(n, r, o);
  }
}
function su(t) {
  let e = null;
  return t.getEditorState().read(() => {
    const n = $();
    A(n) && (e = TS(n));
  }), e;
}
function TS(t) {
  const e = t.anchor;
  if (e.type !== "text")
    return null;
  const n = e.getNode();
  if (!n.isSimpleText())
    return null;
  const r = e.offset;
  return Gt(n).slice(0, r);
}
function NS(t) {
  return t.key.length === 1 && !t.ctrlKey && !t.altKey && !t.metaKey && !t.repeat;
}
function bS(t, e, n) {
  const [r] = Se(), [o, i] = T.useState(e || null), [s, l] = T.useState(null);
  return T.useEffect(() => {
    if (e) {
      i(e);
      return;
    }
    return r.registerRootListener((a) => {
      a && i(a.parentElement);
    });
  }, [r, e]), T.useEffect(() => {
    if (!o)
      return;
    if (!t) {
      s && (s.remove(), l(null));
      return;
    }
    const { height: a } = o.getBoundingClientRect(), u = s || document.createElement("div");
    u.style.position = "absolute", u.style.left = "0", u.style.right = "0", u.style.paddingTop = `${a}px`, o.prepend(u), s || l(u);
    const c = new ResizeObserver(([p]) => {
      u.style.paddingTop = `${p.contentRect.height}px`;
    });
    return c.observe(o), setTimeout(() => {
      u.className = n || "";
    }), () => {
      c.disconnect(), o.removeChild(u);
    };
  }, [o, t, s, n]), s;
}
function OS(t, e) {
  const n = t.split(/\s/).pop() || t, r = t !== n ? t.lastIndexOf(n) : 0;
  return e.some((i) => i.startsWith(n) && i !== n) ? {
    leadOffset: r,
    matchingString: n,
    replaceableString: n
  } : null;
}
function AS(t) {
  const { onSelectOption: e, triggers: n, punctuation: r, loading: o, triggerFn: i, onQueryChange: s, onReset: l, comboboxAnchor: a, comboboxAnchorClassName: u, comboboxComponent: c = "div", comboboxItemComponent: p = "div", onComboboxOpen: f, onComboboxClose: m, onComboboxFocusChange: h, comboboxAdditionalItems: y = [], onComboboxItemSelect: _ } = t, v = of(), [d] = Se(), [g, x] = T.useState(null), [w, S] = T.useState(null), [k, C] = T.useState(null), [E, N] = T.useState(null), D = t.options.length === 0 ? "trigger" : "value", z = T.useMemo(() => {
    const F = y.map((P) => new iu("additional", P.value, P.displayValue, P.data));
    if (D === "trigger") {
      const P = n.map((M) => new iu("trigger", M, M));
      return !E || P.every((M) => !M.value.startsWith(E)) ? [...P, ...F] : [
        ...P.filter((M) => M.value.startsWith(E)),
        ...F
      ];
    }
    return [
      ...t.options.map((P) => new iu("value", P.value, P.displayValue, P.data)),
      ...F
    ];
  }, [
    y,
    D,
    t.options,
    n,
    E
  ]), [H, j] = T.useState(t.comboboxOpen || !1), J = bS(H, a, u), G = T.useCallback((F) => {
    Yo || x(F);
  }, []), te = T.useCallback((F) => {
    var P;
    const Q = (P = z[F].ref) === null || P === void 0 ? void 0 : P.current;
    Q && Q.scrollIntoView({ block: "nearest" });
  }, [z]), L = T.useCallback((F, P) => {
    if (!v)
      return !1;
    let M;
    return P === "up" ? g === null ? M = z.length - 1 : g === 0 ? M = null : M = g - 1 : g === null ? M = 0 : g === z.length - 1 ? M = null : M = g + 1, G(M), M && te(M), F.preventDefault(), F.stopImmediatePropagation(), !0;
  }, [v, g, z.length, te, G]), U = T.useCallback((F) => {
    G(F), te(F);
  }, [te, G]), K = T.useCallback(() => {
    G(null);
  }, [G]), q = T.useCallback((F) => {
    const P = z[F];
    _ == null || _(P.comboboxItem), P.itemType !== "additional" && (d.update(() => {
      const M = k ? Pg(k) : null;
      e(P.menuOption, M);
    }), C(null), s(null), N(null), G(null));
  }, [
    z,
    d,
    s,
    G,
    _,
    k,
    e
  ]), Z = T.useCallback((F) => {
    const P = z[F];
    _ == null || _(P.comboboxItem), P.itemType !== "additional" && (d.update(() => {
      const M = w ? Pg(w) : null;
      if (M) {
        const Q = oe(P.value);
        M.replace(Q), Q.select();
      } else
        Lv(n, r, P.value);
    }), S(null), N(null), G(0));
  }, [
    z,
    d,
    G,
    _,
    w,
    n,
    r
  ]), Ve = T.useCallback((F) => {
    D === "trigger" && Z(F), D === "value" && q(F);
  }, [D, Z, q]), le = T.useCallback((F) => {
    if (!v || g === null)
      return !1;
    let P = !1;
    return D === "trigger" && (P = !0, Z(g)), D === "value" && (P = !0, q(g)), P && (F.preventDefault(), F.stopImmediatePropagation()), P;
  }, [v, q, Z, D, g]), Te = T.useCallback(() => {
    const F = su(d), P = F ? F.substring(0, F.length - 1) : void 0;
    return (!P || !P.trim()) && G(null), !1;
  }, [d, G]), ae = T.useCallback((F) => {
    if (j(!0), !NS(F))
      return !1;
    const P = su(d), Q = (P === null ? F.key : P + F.key).trim();
    return z.some((X) => X.displayValue.startsWith(Q) && Q.length <= X.displayValue.length) ? G(0) : D === "trigger" && G(null), !1;
  }, [d, z, D, G]), be = T.useCallback(() => (j(!0), !1), []), Ze = T.useCallback(() => (j(!1), E || (N(null), S(null), C(null)), !1), [E]);
  return T.useEffect(() => Ue(d.registerCommand(Gl, (F) => L(F, "down"), ie), d.registerCommand(Ql, (F) => L(F, "up"), ie), d.registerCommand(xr, le, Ai), d.registerCommand(Cd, le, ie), d.registerCommand(_o, Te, ie), d.registerCommand(kd, ae, ie), d.registerCommand(Nd, be, Ai), d.registerCommand(Ul, () => (H || j(!0), !1), ie), d.registerCommand(Jl, () => (j(!1), !1), ie)), [
    d,
    H,
    L,
    le,
    Te,
    ae,
    be
  ]), T.useEffect(() => {
    const F = () => {
      d.getEditorState().read(() => {
        const P = su(d);
        if (P === null) {
          l(), S(null), C(null), s(null), N(null);
          return;
        }
        const M = OS(P, n);
        if (S(M), M) {
          N(M.matchingString), C(null);
          return;
        }
        const Q = i(P, d);
        if (C(Q), s(Q ? Q.matchingString : null), Q && Q.matchingString) {
          N(Q.matchingString);
          return;
        }
        N(null);
      });
    };
    return d.registerUpdateListener(F);
  }, [d, i, s, l, n]), T.useEffect(() => {
    j(t.comboboxOpen || !1);
  }, [t.comboboxOpen]), T.useEffect(() => {
    H ? f == null || f() : (x(null), m == null || m());
  }, [f, m, H]), T.useEffect(() => {
    g !== null && z[g] ? h == null || h(z[g].comboboxItem) : h == null || h(null);
  }, [g, z, h]), T.useEffect(() => {
    if (!To)
      return;
    const F = d.getRootElement(), P = (M) => {
      J && !J.contains(M.target) && F && !F.contains(M.target) && Ze();
    };
    return document.addEventListener("mousedown", P), () => {
      document.removeEventListener("mousedown", P);
    };
  }, [J, d, Ze]), !H || !J ? null : Xt.createPortal(O.jsx(c, { loading: o, itemType: D, role: "menu", "aria-activedescendant": g !== null && z[g] ? z[g].displayValue : "", "aria-label": "Choose trigger and value", "aria-hidden": !H, children: z.map((F, P) => O.jsx(p, { selected: P === g, role: "menuitem", "aria-selected": g === P, "aria-label": `Choose ${F.value}`, item: F.comboboxItem, ref: F.setRefElement, onClick: () => Ve(P), onMouseEnter: () => U(P), onMouseLeave: K, onMouseDown: (M) => M.preventDefault(), children: F.displayValue }, F.key)) }), J);
}
function FS(t, e) {
  const [n, r] = T.useState(t);
  return T.useEffect(() => {
    const o = setTimeout(() => {
      r(t);
    }, e);
    return () => clearTimeout(o);
  }, [t, e]), n;
}
function PS(t) {
  const { queryString: e, trigger: n, searchDelay: r, items: o, onSearch: i, justSelectedAnOption: s } = t, l = FS(e, r), [a, u] = T.useState(!1), [c, p] = T.useState([]), [f, m] = T.useState(null);
  return T.useEffect(() => {
    if (!o)
      return;
    if (n === null) {
      p([]), m(null);
      return;
    }
    const h = Object.entries(o).find(([_]) => new RegExp(_).test(n));
    if (!h)
      return;
    const y = e ? h[1].filter((_) => (typeof _ == "string" ? _ : _.value).toLowerCase().includes(e.toLowerCase())) : [...h[1]];
    p(y), m(e);
  }, [o, n, e]), T.useEffect(() => {
    if (i) {
      if (n === null || l === null) {
        p([]), m(null);
        return;
      }
      u(!0), m(l), i(n, s != null && s.current ? "" : l).then((h) => p(h)).finally(() => u(!1)), s != null && s.current && (s.current = !1);
    }
  }, [l, i, n, s]), T.useMemo(() => ({ loading: a, results: c, query: f }), [a, c, f]);
}
var $S = function(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(t); o < r.length; o++)
      e.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[o]) && (n[r[o]] = t[r[o]]);
  return n;
};
class ms extends Nc {
  constructor(e, n, r, o) {
    super(n, r, o), this.trigger = e, this.menuItem = {
      trigger: e,
      value: n,
      displayValue: r,
      data: o
    };
  }
}
const LS = (t) => "(?:\\.[ |$]|\\s|[" + t + "]|)";
function IS(t, e, n, r) {
  return new RegExp((e ? `(^|\\s|${e})(` : "(^|\\s)(") + aS(t) + "((?:" + $v(t, n) + (r ? LS(n) : "") + "){0," + uS + "}))$");
}
function Lg(t, e, n, r, o) {
  const i = IS(e, n, r, o).exec(t);
  if (i !== null) {
    const s = i[1], l = i[2], a = i[3];
    if (l.length >= 1)
      return {
        leadOffset: i.index + s.length,
        matchingString: a,
        replaceableString: l
      };
  }
  return null;
}
function RS(t) {
  const { items: e, onSearch: n, searchDelay: r = t.onSearch ? 250 : 0, allowSpaces: o = !0, insertOnBlur: i = !0, menuComponent: s = "ul", menuItemComponent: l = "li", emptyComponent: a, menuAnchorClassName: u, showMentionsOnDelete: c, showCurrentMentionsAsSuggestions: p = !0, mentionEnclosure: f, onMenuOpen: m, onMenuClose: h, onMenuItemSelect: y, punctuation: _ = Pv, preTriggerChars: v = lS } = t, d = T.useRef(!1), g = of(), x = T.useMemo(() => t.triggers || Object.keys(e || {}), [t.triggers, e]), [w] = Se(), [S, k] = T.useState(null), [C, E] = T.useState(null), { results: N, loading: D, query: z } = PS({
    queryString: S,
    searchDelay: r,
    trigger: C,
    items: e,
    onSearch: n,
    justSelectedAnOption: d
  }), H = T.useRef(), j = T.useRef(null), J = cS(t.creatable, C), G = dS(t.menuItemLimit, C), te = T.useMemo(() => {
    if (!C)
      return [];
    let F = N.map((M) => {
      if (typeof M == "string")
        return new ms(C, M, M);
      {
        const { value: Q } = M, X = $S(M, ["value"]);
        return new ms(C, Q, Q, X);
      }
    });
    if (G !== !1 && G > 0 && (F = F.slice(0, G)), (!n || !D && z !== null) && p && w.getEditorState().read(() => {
      const M = Wd(nn);
      for (const Q of M) {
        const X = Q.getValue(), ce = Q.getData();
        Q.getTrigger() === C && (z === null || Q.getValue().startsWith(z)) && F.every((He) => He.value !== X) && F.push(new ms(C, X, X, ce));
      }
    }), z && F.every((M) => M.displayValue !== z)) {
      const M = typeof J == "string" ? J.replace("{{name}}", z) : typeof J > "u" || J ? `Add "${z}"` : void 0;
      M && F.push(new ms(C, z, M));
    }
    return F;
  }, [
    N,
    n,
    D,
    z,
    w,
    C,
    J,
    G,
    p
  ]), L = !!te.length || D, U = T.useCallback(() => {
    E(null);
  }, []), K = T.useCallback((F, P, M) => {
    w.update(() => {
      if (!C)
        return;
      const X = !!J && F.value !== F.displayValue && f && /\s/.test(F.value) ? (
        // if the value has spaces, wrap it in the enclosure
        f + F.value + f
      ) : F.value, ce = $i(C, X, F.data);
      P && P.replace(ce), M == null || M(), d.current = !0;
    });
  }, [w, C, J, f]), q = T.useCallback((F, P, M) => {
    C && (y == null || y({
      trigger: C,
      value: F.value,
      displayValue: F.displayValue,
      data: F.data
    }), K(F, P, M));
  }, [K, y, C]), Z = T.useCallback((F) => {
    const P = Jo(x, _);
    if (P != null && P.isTextNode && P.wordCharAfterCursor)
      return null;
    const M = Lg(F, x, v, _, o);
    if (M) {
      const { replaceableString: Q, matchingString: X } = M, ce = Q.lastIndexOf(X), He = ce === -1 ? Q : Q.substring(0, ce) + Q.substring(ce + X.length);
      if (E(He || null), M.replaceableString)
        return M;
    } else
      E(null);
    return null;
  }, [v, o, _, x]), Ve = T.useCallback(() => {
    const F = H.current;
    let P = typeof F == "number" ? te[F] : void 0;
    const M = te.find((Qi) => Qi.value !== Qi.displayValue);
    if (M && (Yo || P === null) && (P = M), !P)
      return !1;
    const Q = Jo(x, _);
    if (!C || !Q || !Q.isTextNode)
      return !1;
    const X = Q.node, ce = Gt(X), He = Lg(ce, x, v, _, !1);
    if (He === null)
      return !1;
    const rr = ce.search(new RegExp(`${He.replaceableString}\\s?$`));
    if (rr === -1)
      return !1;
    const Ki = $i(C, P.value, P.data);
    return w.update(() => {
      X.setTextContent(ce.substring(0, rr)), X.insertAfter(Ki), Ki.selectNext();
    }, { tag: "history-merge" }), !0;
  }, [w, te, v, _, C, x]), le = T.useCallback(() => {
    const F = $();
    if ((!F || $e(F)) && j.current) {
      const P = j.current.clone();
      De(P);
    } else F || rf();
    j.current && (j.current = null);
  }, []), Te = T.useCallback((F) => {
    if (!c)
      return !1;
    const P = Jo(x, _);
    if (P) {
      const { node: M, prevNode: Q, offset: X } = P, ce = Ir(M) ? M : Ir(Q) && X === 0 ? Q : null;
      if (ce) {
        const He = ce.getTrigger();
        return ce.replace(oe(He)), F.preventDefault(), !0;
      }
    }
    return !1;
  }, [c, x, _]), ae = T.useCallback((F = !1) => {
    const P = Jo(x, _);
    if (!P)
      return !1;
    const { node: M, offset: Q, isTextNode: X, textContent: ce, prevNode: He, nextNode: rr, wordCharAfterCursor: Ki, cursorAtStartOfNode: Qi, cursorAtEndOfNode: Wv } = P;
    if (X && Qi && Ir(He) && M.insertBefore(oe(" ")), X && Wv && Ir(rr) && M.insertAfter(oe(" ")), X && F && Ki) {
      const Vv = ce.substring(0, Q) + " " + ce.substring(Q);
      M.setTextContent(Vv);
    }
    Ir(M) && rr === null && M.insertAfter(oe(" "));
  }, [_, x]), be = T.useCallback((F) => {
    const { key: P, metaKey: M, ctrlKey: Q } = F, X = P.length === 1, ce = x.some((rr) => P === rr), He = Tc(P, x, _);
    return !X || !He && !ce || M || Q || ae(ce), !1;
  }, [ae, _, x]), Ze = T.useCallback((F) => {
    var P;
    const M = (P = F.clipboardData) === null || P === void 0 ? void 0 : P.getData("text/plain"), Q = M && M.charAt(0), X = x.some((He) => Q === He), ce = Q && new RegExp(`[\\s${_}]`).test(Q);
    return (X || !ce) && ae(), !1;
  }, [ae, x, _]);
  return T.useEffect(() => {
    if (!w.hasNodes([nn]))
      throw new Error("BeautifulMentionsPlugin: BeautifulMentionNode not registered on editor");
    return Ue(w.registerCommand(Tr, () => {
      const F = $();
      return F && !$e(F) && (j.current = F), !1;
    }, ie), w.registerCommand(kd, be, ie), w.registerCommand(_o, Te, ie), w.registerCommand(Xl, () => i ? Ve() : !1, ie), w.registerCommand(ry, () => !o && J ? Ve() : !1, ie), w.registerCommand(_S, ({ trigger: F, value: P, data: M, focus: Q = !0 }) => {
      le();
      const X = kS(x, _, F, P, M);
      return Q || De(null), X;
    }, ie), w.registerCommand(xS, ({ trigger: F, value: P, focus: M }) => CS(F, P, M), ie), w.registerCommand(wS, ({ trigger: F, newValue: P, value: M, focus: Q }) => ES(F, P, M, Q), ie), w.registerCommand(SS, ({ trigger: F }) => (le(), Lv(x, _, F)), ie), w.registerCommand(vo, Ze, ie));
  }, [
    w,
    x,
    _,
    o,
    i,
    J,
    g,
    Ve,
    be,
    Te,
    Ze,
    le
  ]), T.useEffect(() => {
    L && g ? m == null || m() : h == null || h(), L && !g && U();
  }, [m, h, L, g, U]), To ? t.combobox ? O.jsx(AS, { options: te, loading: D, onQueryChange: k, onSelectOption: K, onReset: () => E(null), triggerFn: Z, triggers: x, punctuation: _, creatable: J, comboboxOpen: t.comboboxOpen, comboboxAnchor: t.comboboxAnchor, comboboxAnchorClassName: t.comboboxAnchorClassName, comboboxComponent: t.comboboxComponent, comboboxItemComponent: t.comboboxItemComponent, comboboxAdditionalItems: t.comboboxAdditionalItems, onComboboxOpen: t.onComboboxOpen, onComboboxClose: t.onComboboxClose, onComboboxFocusChange: t.onComboboxFocusChange, onComboboxItemSelect: t.onComboboxItemSelect }) : O.jsx(oS, { commandPriority: Ai, onQueryChange: k, onSelectOption: q, triggerFn: Z, options: te, anchorClassName: u, onClose: U, menuRenderFn: (F, { selectedIndex: P, selectOptionAndCleanUp: M, setHighlightedIndex: Q }) => (H.current = P, F.current && te.length === 0 && z && !D && g && a ? Xt.createPortal(O.jsx(a, {}), F.current) : F.current && L ? Xt.createPortal(O.jsx(s, { loading: D, role: "menu", "aria-label": "Choose a mention", "aria-hidden": !L, "aria-activedescendant": !Yo && P !== null && te[P] ? te[P].displayValue : "", children: te.map((X, ce) => O.jsx(l, Object.assign({ tabIndex: -1, selected: !Yo && P === ce, ref: X.setRefElement, role: "menuitem", "aria-selected": !Yo && P === ce, "aria-label": `Choose ${X.value}`, item: X.menuItem, itemValue: X.value, label: X.displayValue }, X.data, { onClick: () => {
    Q(ce), M(X);
  }, onMouseDown: (He) => {
    He.preventDefault();
  }, onMouseEnter: () => {
    Q(ce);
  }, children: X.displayValue }), X.key)) }), F.current) : null) }) : null;
}
const DS = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function MS({ ignoreHistoryMergeTagChange: t = !0, ignoreSelectionChange: e = !1, onChange: n }) {
  const [r] = Se();
  return DS(() => {
    if (n) return r.registerUpdateListener(({ editorState: o, dirtyElements: i, dirtyLeaves: s, prevEditorState: l, tags: a }) => {
      e && i.size === 0 && s.size === 0 || t && a.has("history-merge") || l.isEmpty() || n(o, r, a);
    });
  }, [r, t, e, n]), null;
}
const Fs = 1, zS = /* @__PURE__ */ new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol"
]), jS = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};
function Ig() {
  return /* @__PURE__ */ O.jsx("div", { className: "divider" });
}
function Rg(t, e) {
  e === null ? (t.style.opacity = "0", t.style.top = "-1000px", t.style.left = "-1000px") : (t.style.opacity = "1", t.style.top = `${e.top + e.height + window.pageYOffset + 10}px`, t.style.left = `${e.left + window.pageXOffset - t.offsetWidth / 2 + e.width / 2}px`);
}
function BS({ editor: t }) {
  const e = T.useRef(null), n = T.useRef(null), r = T.useRef(!1), [o, i] = T.useState(""), [s, l] = T.useState(!1), [a, u] = T.useState(null), c = T.useCallback(() => {
    const p = $();
    if (A(p)) {
      const _ = Dv(p), v = _.getParent();
      Qt(v) ? i(v.getURL()) : Qt(_) ? i(_.getURL()) : i("");
    }
    const f = e.current, m = window.getSelection(), h = document.activeElement;
    if (f === null)
      return;
    const y = t.getRootElement();
    if (p !== null && !m.isCollapsed && y !== null && y.contains(m.anchorNode)) {
      const _ = m.getRangeAt(0);
      let v;
      if (m.anchorNode === y) {
        let d = y;
        for (; d.firstElementChild != null; )
          d = d.firstElementChild;
        v = d.getBoundingClientRect();
      } else
        v = _.getBoundingClientRect();
      r.current || Rg(f, v), u(p);
    } else (!h || h.className !== "link-input") && (Rg(f, null), u(null), l(!1), i(""));
    return !0;
  }, [t]);
  return T.useEffect(() => Ue(
    t.registerUpdateListener(({ editorState: p }) => {
      p.read(() => {
        c();
      });
    }),
    t.registerCommand(
      Tr,
      () => (c(), !0),
      Fs
    )
  ), [t, c]), T.useEffect(() => {
    t.getEditorState().read(() => {
      c();
    });
  }, [t, c]), T.useEffect(() => {
    s && n.current && n.current.focus();
  }, [s]), /* @__PURE__ */ O.jsx("div", { ref: e, className: "link-editor", children: s ? /* @__PURE__ */ O.jsx(
    "input",
    {
      ref: n,
      className: "link-input",
      value: o,
      onChange: (p) => {
        i(p.target.value);
      },
      onKeyDown: (p) => {
        p.key === "Enter" ? (p.preventDefault(), a !== null && (o !== "" && t.dispatchCommand(Pi, o), l(!1))) : p.key === "Escape" && (p.preventDefault(), l(!1));
      }
    }
  ) : /* @__PURE__ */ O.jsx(O.Fragment, { children: /* @__PURE__ */ O.jsxs("div", { className: "link-input", children: [
    /* @__PURE__ */ O.jsx("a", { href: o, target: "_blank", rel: "noopener noreferrer", children: o }),
    /* @__PURE__ */ O.jsx(
      "div",
      {
        className: "link-edit",
        role: "button",
        tabIndex: 0,
        onMouseDown: (p) => p.preventDefault(),
        onClick: () => {
          l(!0);
        }
      }
    )
  ] }) }) });
}
function US({ onChange: t, className: e, options: n, value: r }) {
  return /* @__PURE__ */ O.jsxs("select", { className: e, onChange: t, value: r, children: [
    /* @__PURE__ */ O.jsx("option", { hidden: !0, value: "" }),
    n.map((o) => /* @__PURE__ */ O.jsx("option", { value: o, children: o }, o))
  ] });
}
function Dv(t) {
  const e = t.anchor, n = t.focus, r = t.anchor.getNode(), o = t.focus.getNode();
  return r === o ? r : t.isBackward() ? Xp(n) ? r : o : Xp(e) ? o : r;
}
function WS({
  editor: t,
  blockType: e,
  toolbarRef: n,
  setShowBlockOptionsDropDown: r
}) {
  const o = T.useRef(null);
  T.useEffect(() => {
    const f = n.current, m = o.current;
    if (f !== null && m !== null) {
      const { top: h, left: y } = f.getBoundingClientRect();
      m.style.top = `${h + 40}px`, m.style.left = `${y}px`;
    }
  }, [o, n]), T.useEffect(() => {
    const f = o.current, m = n.current;
    if (f !== null && m !== null) {
      const h = (y) => {
        const _ = y.target;
        !f.contains(_) && !m.contains(_) && r(!1);
      };
      return document.addEventListener("click", h), () => {
        document.removeEventListener("click", h);
      };
    }
  }, [o, r, n]);
  const i = () => {
    e !== "paragraph" && t.update(() => {
      const f = $();
      A(f) && zo(f, () => ge());
    }), r(!1);
  }, s = () => {
    e !== "h1" && t.update(() => {
      const f = $();
      A(f) && zo(f, () => Ln("h1"));
    }), r(!1);
  }, l = () => {
    e !== "h2" && t.update(() => {
      const f = $();
      A(f) && zo(f, () => Ln("h2"));
    }), r(!1);
  }, a = () => {
    e !== "ul" ? t.dispatchCommand(Ev) : t.dispatchCommand(Ec), r(!1);
  }, u = () => {
    e !== "ol" ? t.dispatchCommand(Tv) : t.dispatchCommand(Ec), r(!1);
  }, c = () => {
    e !== "quote" && t.update(() => {
      const f = $();
      A(f) && zo(f, () => ua());
    }), r(!1);
  }, p = () => {
    e !== "code" && t.update(() => {
      const f = $();
      A(f) && zo(f, () => tr());
    }), r(!1);
  };
  return /* @__PURE__ */ O.jsxs("div", { className: "dropdown", ref: o, children: [
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: i, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon paragraph" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Normal" }),
      e === "paragraph" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: s, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon large-heading" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Large Heading" }),
      e === "h1" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: l, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon small-heading" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Small Heading" }),
      e === "h2" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: a, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon bullet-list" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Bullet List" }),
      e === "ul" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: u, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon numbered-list" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Numbered List" }),
      e === "ol" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: c, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon quote" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Quote" }),
      e === "quote" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ O.jsxs("button", { className: "item", onClick: p, children: [
      /* @__PURE__ */ O.jsx("span", { className: "icon code" }),
      /* @__PURE__ */ O.jsx("span", { className: "text", children: "Code Block" }),
      e === "code" && /* @__PURE__ */ O.jsx("span", { className: "active" })
    ] })
  ] });
}
function VS() {
  const [t] = Se(), e = T.useRef(null), [n, r] = T.useState(!1), [o, i] = T.useState(!1), [s, l] = T.useState("paragraph"), [a, u] = T.useState(null), [c, p] = T.useState(
    !1
  ), [f, m] = T.useState(""), [h, y] = T.useState(!1), [_, v] = T.useState(!1), [d, g] = T.useState(!1), [x, w] = T.useState(!1), [S, k] = T.useState(!1), [C, E] = T.useState(!1), N = T.useCallback(() => {
    const j = $();
    if (A(j)) {
      const J = j.anchor.getNode(), G = J.getKey() === "root" ? J : J.getTopLevelElementOrThrow(), te = G.getKey();
      if (t.getElementByKey(te) !== null)
        if (u(te), ee(G)) {
          const q = nv(J, br), Z = q ? q.getTag() : G.getTag();
          l(Z);
        } else {
          const q = dv(G) ? G.getTag() : G.getType();
          l(q), Cl(G) && m(G.getLanguage() || Gw());
        }
      v(j.hasFormat("bold")), g(j.hasFormat("italic")), w(j.hasFormat("underline")), k(j.hasFormat("strikethrough")), E(j.hasFormat("code"));
      const U = Dv(j), K = U.getParent();
      Qt(K) || Qt(U) ? y(!0) : y(!1);
    }
  }, [t]);
  T.useEffect(() => Ue(
    t.registerUpdateListener(({ editorState: j }) => {
      j.read(() => {
        N();
      });
    }),
    t.registerCommand(
      Tr,
      (j, J) => (N(), !1),
      Fs
    ),
    t.registerCommand(
      Ho,
      (j) => (r(j), !1),
      Fs
    ),
    t.registerCommand(
      Vo,
      (j) => (i(j), !1),
      Fs
    )
  ), [t, N]);
  const D = T.useMemo(() => Jw(), []), z = T.useCallback(
    (j) => {
      t.update(() => {
        if (a !== null) {
          const J = Ce(a);
          Cl(J) && J.setLanguage(j.target.value);
        }
      });
    },
    [t, a]
  ), H = T.useCallback(() => {
    h ? t.dispatchCommand(Pi, null) : t.dispatchCommand(Pi, "https://");
  }, [t, h]);
  return /* @__PURE__ */ O.jsxs("div", { className: "toolbar", ref: e, children: [
    /* @__PURE__ */ O.jsx(
      "button",
      {
        disabled: !n,
        onClick: () => {
          t.dispatchCommand(Wl, void 0);
        },
        className: "toolbar-item spaced",
        "aria-label": "Undo",
        children: /* @__PURE__ */ O.jsx("i", { className: "format undo" })
      }
    ),
    /* @__PURE__ */ O.jsx(
      "button",
      {
        disabled: !o,
        onClick: () => {
          t.dispatchCommand(Vl, void 0);
        },
        className: "toolbar-item",
        "aria-label": "Redo",
        children: /* @__PURE__ */ O.jsx("i", { className: "format redo" })
      }
    ),
    /* @__PURE__ */ O.jsx(Ig, {}),
    zS.has(s) && /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
      /* @__PURE__ */ O.jsxs(
        "button",
        {
          className: "toolbar-item block-controls",
          onClick: () => p(!c),
          "aria-label": "Formatting Options",
          children: [
            /* @__PURE__ */ O.jsx("span", { className: "icon block-type " + s }),
            /* @__PURE__ */ O.jsx("span", { className: "text", children: jS[s] }),
            /* @__PURE__ */ O.jsx("i", { className: "chevron-down" })
          ]
        }
      ),
      c && Xt.createPortal(
        /* @__PURE__ */ O.jsx(
          WS,
          {
            editor: t,
            blockType: s,
            toolbarRef: e,
            setShowBlockOptionsDropDown: p
          }
        ),
        document.body
      ),
      /* @__PURE__ */ O.jsx(Ig, {})
    ] }),
    s === "code" ? /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
      /* @__PURE__ */ O.jsx(
        US,
        {
          className: "toolbar-item code-language",
          onChange: z,
          options: D,
          value: f
        }
      ),
      /* @__PURE__ */ O.jsx("i", { className: "chevron-down inside" })
    ] }) : /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
      /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(gt, "bold");
          },
          className: "toolbar-item spaced " + (_ ? "active" : ""),
          "aria-label": "Format Bold",
          children: /* @__PURE__ */ O.jsx("i", { className: "format bold" })
        }
      ),
      /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(gt, "italic");
          },
          className: "toolbar-item spaced " + (d ? "active" : ""),
          "aria-label": "Format Italics",
          children: /* @__PURE__ */ O.jsx("i", { className: "format italic" })
        }
      ),
      /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(gt, "underline");
          },
          className: "toolbar-item spaced " + (x ? "active" : ""),
          "aria-label": "Format Underline",
          children: /* @__PURE__ */ O.jsx("i", { className: "format underline" })
        }
      ),
      /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(gt, "strikethrough");
          },
          className: "toolbar-item spaced " + (S ? "active" : ""),
          "aria-label": "Format Strikethrough",
          children: /* @__PURE__ */ O.jsx("i", { className: "format strikethrough" })
        }
      ),
      /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(gt, "code");
          },
          className: "toolbar-item spaced " + (C ? "active" : ""),
          "aria-label": "Insert Code",
          children: /* @__PURE__ */ O.jsx("i", { className: "format code" })
        }
      ),
      /* @__PURE__ */ O.jsx(
        "button",
        {
          onClick: H,
          className: "toolbar-item spaced " + (h ? "active" : ""),
          "aria-label": "Insert Link",
          children: /* @__PURE__ */ O.jsx("i", { className: "format link" })
        }
      ),
      h && Xt.createPortal(/* @__PURE__ */ O.jsx(BS, { editor: t }), document.body)
    ] })
  ] });
}
const HS = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5"
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem"
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem"
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code"
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable"
  }
};
function KS(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const QS = (t) => "(?:" + t.map((e) => KS(e)).join("|") + ")";
function GS(t, e) {
  const n = Object.keys(t), r = [];
  if (n.length) {
    const o = new RegExp("(?<=\\s|^|\\()" + QS(n) + "(?![^\\s])", "g");
    let i;
    for (o.lastIndex = 0; (i = o.exec(e)) !== null; )
      r.push({
        value: i[0],
        index: i.index
      });
  }
  return r;
}
function JS(t, e, n, r) {
  const o = GS(t, e), i = [];
  let s = 0;
  if (o.forEach(({ value: l, index: a }) => {
    if (a > s) {
      const u = e.substring(s, a);
      i.push({ type: "text", value: u });
    }
    i.push({
      type: "mention",
      value: l
    }), s = a + l.length;
  }), s < e.length) {
    const l = e.substring(s);
    i.push({ type: "text", value: l });
  }
  return i;
}
function YS(t, e, n, r = Pv) {
  const o = JS(t, e), i = [];
  for (const s of o)
    if (s.type === "text")
      i.push(oe(s.value));
    else {
      const l = t[s.value];
      i.push(new go(l.entity_type === "tag" ? "#" : "@", l.markdown_code, { data: { ...l, richMode: !0 } }));
    }
  return i;
}
function ZS(t, e) {
  return YS(t, e);
}
function XS(t, e) {
  const n = {};
  for (const r of t) {
    const o = e(r);
    n[o] ? n[o].push(r) : n[o] = [r];
  }
  return n;
}
function Mv(t) {
  const e = XS(t, (n) => n.type);
  return { element: e.element || [], textFormat: e["text-format"] || [], textMatch: e["text-match"] || [] };
}
const Dg = /[!-/:-@[-`{-~\s]/, qS = /^\s{0,3}$/;
function bc(t) {
  if (!Bt(t)) return !1;
  const e = t.getFirstChild();
  return e == null || t.getChildrenSize() === 1 && I(e) && qS.test(e.getTextContent());
}
function ek(t, e, n, r) {
  for (const o of e) {
    const i = o.export(t, (s) => El(s, n, r));
    if (i != null) return i;
  }
  return b(t) ? El(t, n, r) : se(t) ? t.getTextContent() : null;
}
function El(t, e, n) {
  const r = [], o = t.getChildren();
  e: for (const i of o) {
    for (const s of n) {
      const l = s.export(i, (a) => El(a, e, n), (a, u) => Mg(a, u, e));
      if (l != null) {
        r.push(l);
        continue e;
      }
    }
    Hn(i) ? r.push(`
`) : I(i) ? r.push(Mg(i, i.getTextContent(), e)) : b(i) ? r.push(El(i, e, n)) : se(i) && r.push(i.getTextContent());
  }
  return r.join("");
}
function Mg(t, e, n) {
  const r = e.trim();
  let o = r;
  const i = /* @__PURE__ */ new Set();
  for (const s of n) {
    const l = s.format[0], a = s.tag;
    lu(t, l) && !i.has(l) && (i.add(l), lu(zg(t, !0), l) || (o = a + o), lu(zg(t, !1), l) || (o += a));
  }
  return e.replace(r, () => o);
}
function zg(t, e) {
  let n = e ? t.getPreviousSibling() : t.getNextSibling();
  if (!n) {
    const r = t.getParentOrThrow();
    r.isInline() && (n = e ? r.getPreviousSibling() : r.getNextSibling());
  }
  for (; n; ) {
    if (b(n)) {
      if (!n.isInline()) break;
      const r = e ? n.getLastDescendant() : n.getFirstDescendant();
      if (I(r)) return r;
      n = e ? n.getPreviousSibling() : n.getNextSibling();
    }
    if (I(n)) return n;
    if (!b(n)) return null;
  }
  return null;
}
function lu(t, e) {
  return I(t) && t.hasFormat(e);
}
const No = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, tk = No && "documentMode" in document ? document.documentMode : null;
No && "InputEvent" in window && !tk && new window.InputEvent("input");
const jg = No && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), Bg = No && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, nk = No && /^(?=.*Chrome).*/i.test(navigator.userAgent), Ug = No && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !nk, Wg = /^[ \t]*```(\w{1,10})?\s?$/;
function rk(t, e = !1) {
  const n = Mv(t), r = function(o) {
    const i = {}, s = {}, l = [], a = "(?<![\\\\])";
    for (const u of o) {
      const { tag: c } = u;
      i[c] = u;
      const p = c.replace(/(\*|\^|\+)/g, "\\$1");
      l.push(p), s[c] = jg || Bg || Ug ? new RegExp(`(${p})(?![${p}\\s])(.*?[^${p}\\s])${p}(?!${p})`) : new RegExp(`(?<![\\\\${p}])(${p})((\\\\${p})?.*?[^${p}\\s](\\\\${p})?)((?<!\\\\)|(?<=\\\\\\\\))(${p})(?![\\\\${p}])`);
    }
    return { fullMatchRegExpByTag: s, openTagsRegExp: new RegExp((jg || Bg || Ug ? "" : `${a}`) + "(" + l.join("|") + ")", "g"), transformersByTag: i };
  }(n.textFormat);
  return (o, i) => {
    const s = o.split(`
`), l = s.length, a = i || ye();
    a.clear();
    for (let c = 0; c < l; c++) {
      const p = s[c], [f, m] = ik(s, c, a);
      f == null ? ok(p, a, n.element, r, n.textMatch) : c = m;
    }
    const u = a.getChildren();
    for (const c of u) !e && bc(c) && a.getChildrenSize() > 1 && c.remove();
    $() !== null && a.selectEnd();
  };
}
function ok(t, e, n, r, o) {
  const i = t.trim(), s = oe(i), l = ge();
  l.append(s), e.append(l);
  for (const { regExp: a, replace: u } of n) {
    const c = t.match(a);
    if (c) {
      s.setTextContent(t.slice(c[0].length)), u(l, [s], c, !0);
      break;
    }
  }
  if (Ps(s, r, o), l.isAttached() && i.length > 0) {
    const a = l.getPreviousSibling();
    if (Bt(a) || vc(a) || ee(a)) {
      let u = a;
      if (ee(a)) {
        const c = a.getLastDescendant();
        u = c == null ? null : aa(c, he);
      }
      u != null && u.getTextContentSize() > 0 && (u.splice(u.getChildrenSize(), 0, [en(), ...l.getChildren()]), l.remove());
    }
  }
}
function ik(t, e, n) {
  const r = t[e].match(Wg);
  if (r) {
    let o = e;
    const i = t.length;
    for (; ++o < i; )
      if (t[o].match(Wg)) {
        const s = tr(r[1]), l = oe(t.slice(e + 1, o).join(`
`));
        return s.append(l), n.append(s), [s, o];
      }
  }
  return [null, e];
}
function Ps(t, e, n) {
  const r = t.getTextContent(), o = function(u, c) {
    const p = u.match(c.openTagsRegExp);
    if (p == null) return null;
    for (const f of p) {
      const m = f.replace(/^\s/, ""), h = c.fullMatchRegExpByTag[m];
      if (h == null) continue;
      const y = u.match(h), _ = c.transformersByTag[m];
      if (y != null && _ != null) {
        if (_.intraword !== !1) return y;
        const { index: v = 0 } = y, d = u[v - 1], g = u[v + y[0].length];
        if ((!d || Dg.test(d)) && (!g || Dg.test(g))) return y;
      }
    }
    return null;
  }(r, e);
  if (!o) return void zv(t, n);
  let i, s, l;
  if (o[0] === r) i = t;
  else {
    const u = o.index || 0, c = u + o[0].length;
    u === 0 ? [i, s] = t.splitText(c) : [l, i, s] = t.splitText(u, c);
  }
  i.setTextContent(o[2]);
  const a = e.transformersByTag[o[1]];
  if (a) for (const u of a.format) i.hasFormat(u) || i.toggleFormat(u);
  i.hasFormat("code") || Ps(i, e, n), l && Ps(l, e, n), s && Ps(s, e, n);
}
function zv(t, e) {
  let n = t;
  e: for (; n; ) {
    for (const r of e) {
      const o = n.getTextContent().match(r.importRegExp);
      if (!o) continue;
      const i = o.index || 0, s = i + o[0].length;
      let l, a;
      i === 0 ? [l, n] = n.splitText(s) : [, l, a] = n.splitText(i, s), a && zv(a, e), r.replace(l, o);
      continue e;
    }
    break;
  }
}
function sk(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
sk(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const jv = (t) => (e, n, r) => {
  const o = t(r);
  o.append(...n), e.replace(o), o.select(0, 0);
}, Bv = (t) => (e, n, r) => {
  const o = e.getPreviousSibling(), i = e.getNextSibling(), s = ft(t === "check" ? r[3] === "x" : void 0);
  if (ee(i) && i.getListType() === t) {
    const a = i.getFirstChild();
    a !== null ? a.insertBefore(s) : i.append(s), e.remove();
  } else if (ee(o) && o.getListType() === t) o.append(s), e.remove();
  else {
    const a = nt(t, t === "number" ? Number(r[2]) : void 0);
    a.append(s), e.replace(a);
  }
  s.append(...n), s.select(0, 0);
  const l = function(a) {
    const u = a.match(/\t/g), c = a.match(/ /g);
    let p = 0;
    return u && (p += u.length), c && (p += Math.floor(c.length / 4)), p;
  }(r[1]);
  l && s.setIndent(l);
}, sf = (t, e, n) => {
  const r = [], o = t.getChildren();
  let i = 0;
  for (const s of o) if (he(s)) {
    if (s.getChildrenSize() === 1) {
      const c = s.getFirstChild();
      if (ee(c)) {
        r.push(sf(c, e, n + 1));
        continue;
      }
    }
    const l = " ".repeat(4 * n), a = t.getListType(), u = a === "number" ? `${t.getStart() + i}. ` : a === "check" ? `- [${s.getChecked() ? "x" : " "}] ` : "- ";
    r.push(l + u + e(s)), i++;
  }
  return r.join(`
`);
}, lk = { dependencies: [ca], export: (t, e) => {
  if (!dv(t)) return null;
  const n = Number(t.getTag().slice(1));
  return "#".repeat(n) + " " + e(t);
}, regExp: /^(#{1,6})\s/, replace: jv((t) => {
  const e = "h" + t[1].length;
  return Ln(e);
}), type: "element" }, ak = { dependencies: [Co], export: (t, e) => {
  if (!vc(t)) return null;
  const n = e(t).split(`
`), r = [];
  for (const o of n) r.push("> " + o);
  return r.join(`
`);
}, regExp: /^>\s/, replace: (t, e, n, r) => {
  if (r) {
    const i = t.getPreviousSibling();
    if (vc(i)) return i.splice(i.getChildrenSize(), 0, [en(), ...e]), i.select(0, 0), void t.remove();
  }
  const o = ua();
  o.append(...e), t.replace(o), o.select(0, 0);
}, type: "element" }, uk = { dependencies: [da], export: (t) => {
  if (!Cl(t)) return null;
  const e = t.getTextContent();
  return "```" + (t.getLanguage() || "") + (e ? `
` + e : "") + "\n```";
}, regExp: /^[ \t]*```(\w{1,10})?\s/, replace: jv((t) => tr(t ? t[1] : void 0)), type: "element" }, ck = { dependencies: [br, Nr], export: (t, e) => ee(t) ? sf(t, e, 0) : null, regExp: /^(\s*)[-*+]\s/, replace: Bv("bullet"), type: "element" }, dk = { dependencies: [br, Nr], export: (t, e) => ee(t) ? sf(t, e, 0) : null, regExp: /^(\s*)(\d{1,})\.\s/, replace: Bv("number"), type: "element" }, fk = { format: ["code"], tag: "`", type: "text-format" }, pk = { format: ["highlight"], tag: "==", type: "text-format" }, gk = { format: ["bold", "italic"], tag: "***", type: "text-format" }, hk = { format: ["bold", "italic"], intraword: !1, tag: "___", type: "text-format" }, mk = { format: ["bold"], tag: "**", type: "text-format" }, yk = { format: ["bold"], intraword: !1, tag: "__", type: "text-format" }, vk = { format: ["strikethrough"], tag: "~~", type: "text-format" }, _k = { format: ["italic"], tag: "*", type: "text-format" }, xk = { format: ["italic"], intraword: !1, tag: "_", type: "text-format" }, wk = { dependencies: [nr], export: (t, e, n) => {
  if (!Qt(t)) return null;
  const r = t.getTitle(), o = r ? `[${t.getTextContent()}](${t.getURL()} "${r}")` : `[${t.getTextContent()}](${t.getURL()})`, i = t.getFirstChild();
  return t.getChildrenSize() === 1 && I(i) ? n(i, o) : o;
}, importRegExp: /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))/, regExp: /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))$/, replace: (t, e) => {
  const [, n, r, o] = e, i = Fi(r, { title: o }), s = oe(n);
  s.setFormat(t.getFormat()), i.append(s), t.replace(i);
}, trigger: ")", type: "text-match" }, Sk = [lk, ak, uk, ck, dk], kk = [fk, gk, hk, mk, yk, pk, _k, xk, vk], Ck = [wk], ya = [...Sk, ...kk, ...Ck];
function Ek(t, e = ya, n, r = !1) {
  return rk(e, r)(t, n);
}
function Tk(t = ya, e, n = !1) {
  return function(o, i = !1) {
    const s = Mv(o), l = !i, a = s.textFormat.filter((u) => u.format.length === 1);
    return (u) => {
      const c = [], p = (u || ye()).getChildren();
      for (let f = 0; f < p.length; f++) {
        const m = p[f], h = ek(m, s.element, a, s.textMatch);
        h != null && c.push(l && f > 0 && !bc(m) && !bc(p[f - 1]) ? `
`.concat(h) : h);
      }
      return c.join(`
`);
    };
  }(t, n)(e);
}
function Nk({ loading: t, ...e }) {
  return t ? /* @__PURE__ */ O.jsx("div", { className: "top-[2px] m-0 min-w-[8rem] max-w-[14rem] overflow-hidden rounded-md border bg-white p-2.5 text-sm text-popover-foreground shadow-md", children: "Loading..." }) : /* @__PURE__ */ O.jsx(
    "ul",
    {
      style: {
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      },
      className: "absolute z-50 top-[2px] m-0 min-w-[8rem] max-w-[14rem] overflow-hidden rounded-md border bg-white p-1 text-popover-foreground shadow-md",
      ...e
    }
  );
}
const Uv = T.forwardRef(({ selected: t, item: e, itemValue: n, ...r }, o) => {
  const { data: i } = r, s = i.entity_type === "tag" ? e.trigger : i.entity_image ? /* @__PURE__ */ O.jsx("img", { src: i.entity_image, className: `mr-2 w-4 h-4 ${i.entity_type === "user" ? "rounded-full" : ""}` }) : e.trigger;
  return /* @__PURE__ */ O.jsxs(
    "li",
    {
      ref: o,
      className: `relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none overflow-hidden ${t ? "bg-blue-300 text-accent-foreground" : ""}`,
      ...r,
      children: [
        s,
        /* @__PURE__ */ O.jsx("div", { className: "flex-auto whitespace-nowrap overflow-hidden text-ellipsis", children: i.entity_title })
      ]
    }
  );
});
Uv.displayName = "MenuItem";
function bk() {
  return /* @__PURE__ */ O.jsx("div", { className: "editor-placeholder", children: "Play around..." });
}
const Ok = {
  "@": "inline-block break-words",
  "#": "inline-block break-words"
}, Ak = {
  "@": "px-1 mx-2/3 mx-px align-baseline inline-block rounded break-words leading-5 dark:bg-gray-100 bg-gray-100",
  "#": "px-1 mx-2/3 mx-px align-baseline inline-block rounded break-words leading-5 dark:bg-green-100 bg-green-100"
}, Fk = T.forwardRef(({ trigger: t, value: e, data: n, children: r, ...o }, i) => {
  let s = n.data.richMode ? n.data.entity_link_name : n.data.markdown_code;
  const l = n.data.richMode ? n.data.entity_type === "tag" ? "#" : n.data.entity_image ? /* @__PURE__ */ O.jsx("img", { src: n.data.entity_image, className: `relative mr-1 top-[2px] w-4 h-4 float-left ${n.data.entity_type === "user" ? "rounded-full" : ""}` }) : "" : "";
  return /* @__PURE__ */ O.jsxs("div", { ...o, ref: i, title: e, children: [
    l,
    s
  ] });
});
class go extends nn {
  static getType() {
    return "custom-beautifulMention";
  }
  static clone(e) {
    return new go(e.__trigger, e.__value, e.__data, e.__key);
  }
  static importJSON(e) {
    return new go(e.trigger, e.value, e.data);
  }
  getTextContent() {
    return this.getLatest().__value;
  }
  exportJSON() {
    const e = this.__data;
    return Object.assign(Object.assign({ trigger: this.__trigger, value: this.__value }, e ? { data: e } : {}), { type: "custom-beautifulMention", version: 1 });
  }
  component() {
    return Fk;
  }
  decorate(e, n) {
    return super.decorate(e, n);
  }
}
const Pk = async (t, e, n, r) => {
  const o = await fetch(
    `?module=tasks&action=${t === "#" ? "entityAutocomplete" : "mentionAutocomplete"}&task_id=${r}&term=${e}`
  ), { data: i } = await o.json();
  return i.map((s) => ({ value: s.markdown_code, data: { ...s, richMode: n } }));
}, $k = ({ initialElement: t, richMode: e, taskLinks: n }) => {
  const [r] = Se();
  return T.useEffect(() => {
    r.update(() => {
      if (e) {
        const o = ye(), i = ge();
        o.append(i);
        const l = ZS(n, t.value).reduce((a, u) => {
          const c = oe(" ");
          return u.__type !== "custom-beautifulMention" ? (Ek(u.__text, ya, i), [...a, ...i.getChildren()[0].getChildren(), c]) : [...a, u, c];
        }, []);
        console.log(l), i.remove(), yc(l);
      } else
        yc([oe(t.value)]);
    });
  }, [r]), null;
};
function Lk(t, e) {
  t.read(() => {
    const n = Tk(ya);
    e.value = n;
  });
}
const Ik = (t) => ({
  theme: {
    ...HS,
    beautifulMentions: t ? Ak : Ok
  },
  onError(e) {
    throw e;
  },
  nodes: [
    go,
    {
      replace: nn,
      with: (e) => new go(
        e.getTrigger(),
        e.getValue(),
        e.getData()
      )
    },
    ca,
    br,
    Nr,
    Co,
    da,
    nf,
    vv,
    qd,
    ef,
    fa,
    nr
  ]
});
function Rk({ initialElement: t, richMode: e, taskLinks: n, taskId: r }) {
  const o = e ? sw : hw, i = Ik(e);
  return /* @__PURE__ */ O.jsx(Tx, { initialConfig: i, children: /* @__PURE__ */ O.jsxs("div", { className: "editor-container", children: [
    e && /* @__PURE__ */ O.jsx(VS, {}),
    /* @__PURE__ */ O.jsxs("div", { className: "editor-inner", children: [
      /* @__PURE__ */ O.jsx(
        o,
        {
          contentEditable: /* @__PURE__ */ O.jsx(xw, { className: "editor-input" }),
          placeholder: /* @__PURE__ */ O.jsx(bk, {}),
          ErrorBoundary: vw
        }
      ),
      /* @__PURE__ */ O.jsx(
        RS,
        {
          triggers: ["@", "#"],
          allowSpaces: !1,
          onSearch: (...s) => Pk(...s, e, r),
          menuComponent: Nk,
          menuItemComponent: Uv
        }
      ),
      /* @__PURE__ */ O.jsx(MS, { onChange: (s) => Lk(s, t) }),
      /* @__PURE__ */ O.jsx(
        $k,
        {
          initialElement: t,
          richMode: e,
          taskLinks: n
        }
      ),
      /* @__PURE__ */ O.jsx(ww, {}),
      e && /* @__PURE__ */ O.jsx(eS, {}),
      e && /* @__PURE__ */ O.jsx(qw, {}),
      /* @__PURE__ */ O.jsx(Ow, {})
    ] })
  ] }) });
}
function Dk(t, e) {
  const n = document.createElement("div");
  n.classList = "lexical";
  const r = typeof t.dataset.richMode < "u", o = t.dataset.taskId ?? "";
  t.parentElement.insertBefore(n, t), t.style.display = "none", au.createRoot(n).render(
    /* @__PURE__ */ O.jsx(l0.StrictMode, { children: /* @__PURE__ */ O.jsx(Rk, { initialElement: t, richMode: r, taskLinks: e, taskId: o }) })
  );
}
export {
  Dk as createLexicalInstance
};
