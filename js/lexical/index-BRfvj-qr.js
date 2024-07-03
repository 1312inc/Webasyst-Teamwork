var kf = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sv(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var dh = { exports: {} }, Fl = {}, fh = { exports: {} }, te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zi = Symbol.for("react.element"), Cv = Symbol.for("react.portal"), kv = Symbol.for("react.fragment"), Ev = Symbol.for("react.strict_mode"), Tv = Symbol.for("react.profiler"), Nv = Symbol.for("react.provider"), bv = Symbol.for("react.context"), Av = Symbol.for("react.forward_ref"), Ov = Symbol.for("react.suspense"), Pv = Symbol.for("react.memo"), $v = Symbol.for("react.lazy"), Ef = Symbol.iterator;
function Fv(t) {
  return t === null || typeof t != "object" ? null : (t = Ef && t[Ef] || t["@@iterator"], typeof t == "function" ? t : null);
}
var ph = { isMounted: function() {
  return !1;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, gh = Object.assign, hh = {};
function yo(t, e, n) {
  this.props = t, this.context = e, this.refs = hh, this.updater = n || ph;
}
yo.prototype.isReactComponent = {};
yo.prototype.setState = function(t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, t, e, "setState");
};
yo.prototype.forceUpdate = function(t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function mh() {
}
mh.prototype = yo.prototype;
function Hc(t, e, n) {
  this.props = t, this.context = e, this.refs = hh, this.updater = n || ph;
}
var Vc = Hc.prototype = new mh();
Vc.constructor = Hc;
gh(Vc, yo.prototype);
Vc.isPureReactComponent = !0;
var Tf = Array.isArray, yh = Object.prototype.hasOwnProperty, Kc = { current: null }, _h = { key: !0, ref: !0, __self: !0, __source: !0 };
function vh(t, e, n) {
  var r, o = {}, i = null, s = null;
  if (e != null) for (r in e.ref !== void 0 && (s = e.ref), e.key !== void 0 && (i = "" + e.key), e) yh.call(e, r) && !_h.hasOwnProperty(r) && (o[r] = e[r]);
  var l = arguments.length - 2;
  if (l === 1) o.children = n;
  else if (1 < l) {
    for (var a = Array(l), u = 0; u < l; u++) a[u] = arguments[u + 2];
    o.children = a;
  }
  if (t && t.defaultProps) for (r in l = t.defaultProps, l) o[r] === void 0 && (o[r] = l[r]);
  return { $$typeof: zi, type: t, key: i, ref: s, props: o, _owner: Kc.current };
}
function Lv(t, e) {
  return { $$typeof: zi, type: t.type, key: e, ref: t.ref, props: t.props, _owner: t._owner };
}
function Qc(t) {
  return typeof t == "object" && t !== null && t.$$typeof === zi;
}
function Iv(t) {
  var e = { "=": "=0", ":": "=2" };
  return "$" + t.replace(/[=:]/g, function(n) {
    return e[n];
  });
}
var Nf = /\/+/g;
function Aa(t, e) {
  return typeof t == "object" && t !== null && t.key != null ? Iv("" + t.key) : e.toString(36);
}
function Ss(t, e, n, r, o) {
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
        case zi:
        case Cv:
          s = !0;
      }
  }
  if (s) return s = t, o = o(s), t = r === "" ? "." + Aa(s, 0) : r, Tf(o) ? (n = "", t != null && (n = t.replace(Nf, "$&/") + "/"), Ss(o, e, n, "", function(u) {
    return u;
  })) : o != null && (Qc(o) && (o = Lv(o, n + (!o.key || s && s.key === o.key ? "" : ("" + o.key).replace(Nf, "$&/") + "/") + t)), e.push(o)), 1;
  if (s = 0, r = r === "" ? "." : r + ":", Tf(t)) for (var l = 0; l < t.length; l++) {
    i = t[l];
    var a = r + Aa(i, l);
    s += Ss(i, e, n, a, o);
  }
  else if (a = Fv(t), typeof a == "function") for (t = a.call(t), l = 0; !(i = t.next()).done; ) i = i.value, a = r + Aa(i, l++), s += Ss(i, e, n, a, o);
  else if (i === "object") throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
  return s;
}
function es(t, e, n) {
  if (t == null) return t;
  var r = [], o = 0;
  return Ss(t, r, "", "", function(i) {
    return e.call(n, i, o++);
  }), r;
}
function Dv(t) {
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
var rt = { current: null }, Cs = { transition: null }, Rv = { ReactCurrentDispatcher: rt, ReactCurrentBatchConfig: Cs, ReactCurrentOwner: Kc };
function xh() {
  throw Error("act(...) is not supported in production builds of React.");
}
te.Children = { map: es, forEach: function(t, e, n) {
  es(t, function() {
    e.apply(this, arguments);
  }, n);
}, count: function(t) {
  var e = 0;
  return es(t, function() {
    e++;
  }), e;
}, toArray: function(t) {
  return es(t, function(e) {
    return e;
  }) || [];
}, only: function(t) {
  if (!Qc(t)) throw Error("React.Children.only expected to receive a single React element child.");
  return t;
} };
te.Component = yo;
te.Fragment = kv;
te.Profiler = Tv;
te.PureComponent = Hc;
te.StrictMode = Ev;
te.Suspense = Ov;
te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Rv;
te.act = xh;
te.cloneElement = function(t, e, n) {
  if (t == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + t + ".");
  var r = gh({}, t.props), o = t.key, i = t.ref, s = t._owner;
  if (e != null) {
    if (e.ref !== void 0 && (i = e.ref, s = Kc.current), e.key !== void 0 && (o = "" + e.key), t.type && t.type.defaultProps) var l = t.type.defaultProps;
    for (a in e) yh.call(e, a) && !_h.hasOwnProperty(a) && (r[a] = e[a] === void 0 && l !== void 0 ? l[a] : e[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    l = Array(a);
    for (var u = 0; u < a; u++) l[u] = arguments[u + 2];
    r.children = l;
  }
  return { $$typeof: zi, type: t.type, key: o, ref: i, props: r, _owner: s };
};
te.createContext = function(t) {
  return t = { $$typeof: bv, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, t.Provider = { $$typeof: Nv, _context: t }, t.Consumer = t;
};
te.createElement = vh;
te.createFactory = function(t) {
  var e = vh.bind(null, t);
  return e.type = t, e;
};
te.createRef = function() {
  return { current: null };
};
te.forwardRef = function(t) {
  return { $$typeof: Av, render: t };
};
te.isValidElement = Qc;
te.lazy = function(t) {
  return { $$typeof: $v, _payload: { _status: -1, _result: t }, _init: Dv };
};
te.memo = function(t, e) {
  return { $$typeof: Pv, type: t, compare: e === void 0 ? null : e };
};
te.startTransition = function(t) {
  var e = Cs.transition;
  Cs.transition = {};
  try {
    t();
  } finally {
    Cs.transition = e;
  }
};
te.unstable_act = xh;
te.useCallback = function(t, e) {
  return rt.current.useCallback(t, e);
};
te.useContext = function(t) {
  return rt.current.useContext(t);
};
te.useDebugValue = function() {
};
te.useDeferredValue = function(t) {
  return rt.current.useDeferredValue(t);
};
te.useEffect = function(t, e) {
  return rt.current.useEffect(t, e);
};
te.useId = function() {
  return rt.current.useId();
};
te.useImperativeHandle = function(t, e, n) {
  return rt.current.useImperativeHandle(t, e, n);
};
te.useInsertionEffect = function(t, e) {
  return rt.current.useInsertionEffect(t, e);
};
te.useLayoutEffect = function(t, e) {
  return rt.current.useLayoutEffect(t, e);
};
te.useMemo = function(t, e) {
  return rt.current.useMemo(t, e);
};
te.useReducer = function(t, e, n) {
  return rt.current.useReducer(t, e, n);
};
te.useRef = function(t) {
  return rt.current.useRef(t);
};
te.useState = function(t) {
  return rt.current.useState(t);
};
te.useSyncExternalStore = function(t, e, n) {
  return rt.current.useSyncExternalStore(t, e, n);
};
te.useTransition = function() {
  return rt.current.useTransition();
};
te.version = "18.3.1";
fh.exports = te;
var T = fh.exports;
const Mv = /* @__PURE__ */ Sv(T);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zv = T, jv = Symbol.for("react.element"), Bv = Symbol.for("react.fragment"), Uv = Object.prototype.hasOwnProperty, Wv = zv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Hv = { key: !0, ref: !0, __self: !0, __source: !0 };
function wh(t, e, n) {
  var r, o = {}, i = null, s = null;
  n !== void 0 && (i = "" + n), e.key !== void 0 && (i = "" + e.key), e.ref !== void 0 && (s = e.ref);
  for (r in e) Uv.call(e, r) && !Hv.hasOwnProperty(r) && (o[r] = e[r]);
  if (t && t.defaultProps) for (r in e = t.defaultProps, e) o[r] === void 0 && (o[r] = e[r]);
  return { $$typeof: jv, type: t, key: i, ref: s, props: o, _owner: Wv.current };
}
Fl.Fragment = Bv;
Fl.jsx = wh;
Fl.jsxs = wh;
dh.exports = Fl;
var N = dh.exports, wu = {}, Sh = { exports: {} }, xt = {}, Ch = { exports: {} }, kh = {};
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
  function e(F, W) {
    var j = F.length;
    F.push(W);
    e: for (; 0 < j; ) {
      var X = j - 1 >>> 1, J = F[X];
      if (0 < o(J, W)) F[X] = W, F[j] = J, j = X;
      else break e;
    }
  }
  function n(F) {
    return F.length === 0 ? null : F[0];
  }
  function r(F) {
    if (F.length === 0) return null;
    var W = F[0], j = F.pop();
    if (j !== W) {
      F[0] = j;
      e: for (var X = 0, J = F.length, ge = J >>> 1; X < ge; ) {
        var ie = 2 * (X + 1) - 1, Te = F[ie], se = ie + 1, Ne = F[se];
        if (0 > o(Te, j)) se < J && 0 > o(Ne, Te) ? (F[X] = Ne, F[se] = j, X = se) : (F[X] = Te, F[ie] = j, X = ie);
        else if (se < J && 0 > o(Ne, j)) F[X] = Ne, F[se] = j, X = se;
        else break e;
      }
    }
    return W;
  }
  function o(F, W) {
    var j = F.sortIndex - W.sortIndex;
    return j !== 0 ? j : F.id - W.id;
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
  var a = [], u = [], c = 1, p = null, d = 3, m = !1, h = !1, y = !1, v = typeof setTimeout == "function" ? setTimeout : null, _ = typeof clearTimeout == "function" ? clearTimeout : null, f = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function g(F) {
    for (var W = n(u); W !== null; ) {
      if (W.callback === null) r(u);
      else if (W.startTime <= F) r(u), W.sortIndex = W.expirationTime, e(a, W);
      else break;
      W = n(u);
    }
  }
  function x(F) {
    if (y = !1, g(F), !h) if (n(a) !== null) h = !0, Y(w);
    else {
      var W = n(u);
      W !== null && ne(x, W.startTime - F);
    }
  }
  function w(F, W) {
    h = !1, y && (y = !1, _(k), k = -1), m = !0;
    var j = d;
    try {
      for (g(W), p = n(a); p !== null && (!(p.expirationTime > W) || F && !R()); ) {
        var X = p.callback;
        if (typeof X == "function") {
          p.callback = null, d = p.priorityLevel;
          var J = X(p.expirationTime <= W);
          W = t.unstable_now(), typeof J == "function" ? p.callback = J : p === n(a) && r(a), g(W);
        } else r(a);
        p = n(a);
      }
      if (p !== null) var ge = !0;
      else {
        var ie = n(u);
        ie !== null && ne(x, ie.startTime - W), ge = !1;
      }
      return ge;
    } finally {
      p = null, d = j, m = !1;
    }
  }
  var S = !1, C = null, k = -1, E = 5, b = -1;
  function R() {
    return !(t.unstable_now() - b < E);
  }
  function z() {
    if (C !== null) {
      var F = t.unstable_now();
      b = F;
      var W = !0;
      try {
        W = C(!0, F);
      } finally {
        W ? V() : (S = !1, C = null);
      }
    } else S = !1;
  }
  var V;
  if (typeof f == "function") V = function() {
    f(z);
  };
  else if (typeof MessageChannel < "u") {
    var K = new MessageChannel(), Z = K.port2;
    K.port1.onmessage = z, V = function() {
      Z.postMessage(null);
    };
  } else V = function() {
    v(z, 0);
  };
  function Y(F) {
    C = F, S || (S = !0, V());
  }
  function ne(F, W) {
    k = v(function() {
      F(t.unstable_now());
    }, W);
  }
  t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function(F) {
    F.callback = null;
  }, t.unstable_continueExecution = function() {
    h || m || (h = !0, Y(w));
  }, t.unstable_forceFrameRate = function(F) {
    0 > F || 125 < F ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : E = 0 < F ? Math.floor(1e3 / F) : 5;
  }, t.unstable_getCurrentPriorityLevel = function() {
    return d;
  }, t.unstable_getFirstCallbackNode = function() {
    return n(a);
  }, t.unstable_next = function(F) {
    switch (d) {
      case 1:
      case 2:
      case 3:
        var W = 3;
        break;
      default:
        W = d;
    }
    var j = d;
    d = W;
    try {
      return F();
    } finally {
      d = j;
    }
  }, t.unstable_pauseExecution = function() {
  }, t.unstable_requestPaint = function() {
  }, t.unstable_runWithPriority = function(F, W) {
    switch (F) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        F = 3;
    }
    var j = d;
    d = F;
    try {
      return W();
    } finally {
      d = j;
    }
  }, t.unstable_scheduleCallback = function(F, W, j) {
    var X = t.unstable_now();
    switch (typeof j == "object" && j !== null ? (j = j.delay, j = typeof j == "number" && 0 < j ? X + j : X) : j = X, F) {
      case 1:
        var J = -1;
        break;
      case 2:
        J = 250;
        break;
      case 5:
        J = 1073741823;
        break;
      case 4:
        J = 1e4;
        break;
      default:
        J = 5e3;
    }
    return J = j + J, F = { id: c++, callback: W, priorityLevel: F, startTime: j, expirationTime: J, sortIndex: -1 }, j > X ? (F.sortIndex = j, e(u, F), n(a) === null && F === n(u) && (y ? (_(k), k = -1) : y = !0, ne(x, j - X))) : (F.sortIndex = J, e(a, F), h || m || (h = !0, Y(w))), F;
  }, t.unstable_shouldYield = R, t.unstable_wrapCallback = function(F) {
    var W = d;
    return function() {
      var j = d;
      d = W;
      try {
        return F.apply(this, arguments);
      } finally {
        d = j;
      }
    };
  };
})(kh);
Ch.exports = kh;
var Vv = Ch.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Kv = T, vt = Vv;
function D(t) {
  for (var e = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, n = 1; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var Eh = /* @__PURE__ */ new Set(), gi = {};
function Er(t, e) {
  oo(t, e), oo(t + "Capture", e);
}
function oo(t, e) {
  for (gi[t] = e, t = 0; t < e.length; t++) Eh.add(e[t]);
}
var _n = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Su = Object.prototype.hasOwnProperty, Qv = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, bf = {}, Af = {};
function Gv(t) {
  return Su.call(Af, t) ? !0 : Su.call(bf, t) ? !1 : Qv.test(t) ? Af[t] = !0 : (bf[t] = !0, !1);
}
function Jv(t, e, n, r) {
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
function Yv(t, e, n, r) {
  if (e === null || typeof e > "u" || Jv(t, e, n, r)) return !0;
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
var Ve = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t) {
  Ve[t] = new ot(t, 0, !1, t, null, !1, !1);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(t) {
  var e = t[0];
  Ve[e] = new ot(e, 1, !1, t[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(t) {
  Ve[t] = new ot(t, 2, !1, t.toLowerCase(), null, !1, !1);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(t) {
  Ve[t] = new ot(t, 2, !1, t, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t) {
  Ve[t] = new ot(t, 3, !1, t.toLowerCase(), null, !1, !1);
});
["checked", "multiple", "muted", "selected"].forEach(function(t) {
  Ve[t] = new ot(t, 3, !0, t, null, !1, !1);
});
["capture", "download"].forEach(function(t) {
  Ve[t] = new ot(t, 4, !1, t, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function(t) {
  Ve[t] = new ot(t, 6, !1, t, null, !1, !1);
});
["rowSpan", "start"].forEach(function(t) {
  Ve[t] = new ot(t, 5, !1, t.toLowerCase(), null, !1, !1);
});
var Gc = /[\-:]([a-z])/g;
function Jc(t) {
  return t[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t) {
  var e = t.replace(
    Gc,
    Jc
  );
  Ve[e] = new ot(e, 1, !1, t, null, !1, !1);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t) {
  var e = t.replace(Gc, Jc);
  Ve[e] = new ot(e, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(t) {
  var e = t.replace(Gc, Jc);
  Ve[e] = new ot(e, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function(t) {
  Ve[t] = new ot(t, 1, !1, t.toLowerCase(), null, !1, !1);
});
Ve.xlinkHref = new ot("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(t) {
  Ve[t] = new ot(t, 1, !1, t.toLowerCase(), null, !0, !0);
});
function Yc(t, e, n, r) {
  var o = Ve.hasOwnProperty(e) ? Ve[e] : null;
  (o !== null ? o.type !== 0 : r || !(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (Yv(e, n, o, r) && (n = null), r || o === null ? Gv(e) && (n === null ? t.removeAttribute(e) : t.setAttribute(e, "" + n)) : o.mustUseProperty ? t[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (e = o.attributeName, r = o.attributeNamespace, n === null ? t.removeAttribute(e) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? t.setAttributeNS(r, e, n) : t.setAttribute(e, n))));
}
var Cn = Kv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ts = Symbol.for("react.element"), Rr = Symbol.for("react.portal"), Mr = Symbol.for("react.fragment"), Zc = Symbol.for("react.strict_mode"), Cu = Symbol.for("react.profiler"), Th = Symbol.for("react.provider"), Nh = Symbol.for("react.context"), Xc = Symbol.for("react.forward_ref"), ku = Symbol.for("react.suspense"), Eu = Symbol.for("react.suspense_list"), qc = Symbol.for("react.memo"), Tn = Symbol.for("react.lazy"), bh = Symbol.for("react.offscreen"), Of = Symbol.iterator;
function Po(t) {
  return t === null || typeof t != "object" ? null : (t = Of && t[Of] || t["@@iterator"], typeof t == "function" ? t : null);
}
var Ce = Object.assign, Oa;
function Wo(t) {
  if (Oa === void 0) try {
    throw Error();
  } catch (n) {
    var e = n.stack.trim().match(/\n( *(at )?)/);
    Oa = e && e[1] || "";
  }
  return `
` + Oa + t;
}
var Pa = !1;
function $a(t, e) {
  if (!t || Pa) return "";
  Pa = !0;
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
    Pa = !1, Error.prepareStackTrace = n;
  }
  return (t = t ? t.displayName || t.name : "") ? Wo(t) : "";
}
function Zv(t) {
  switch (t.tag) {
    case 5:
      return Wo(t.type);
    case 16:
      return Wo("Lazy");
    case 13:
      return Wo("Suspense");
    case 19:
      return Wo("SuspenseList");
    case 0:
    case 2:
    case 15:
      return t = $a(t.type, !1), t;
    case 11:
      return t = $a(t.type.render, !1), t;
    case 1:
      return t = $a(t.type, !0), t;
    default:
      return "";
  }
}
function Tu(t) {
  if (t == null) return null;
  if (typeof t == "function") return t.displayName || t.name || null;
  if (typeof t == "string") return t;
  switch (t) {
    case Mr:
      return "Fragment";
    case Rr:
      return "Portal";
    case Cu:
      return "Profiler";
    case Zc:
      return "StrictMode";
    case ku:
      return "Suspense";
    case Eu:
      return "SuspenseList";
  }
  if (typeof t == "object") switch (t.$$typeof) {
    case Nh:
      return (t.displayName || "Context") + ".Consumer";
    case Th:
      return (t._context.displayName || "Context") + ".Provider";
    case Xc:
      var e = t.render;
      return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
    case qc:
      return e = t.displayName || null, e !== null ? e : Tu(t.type) || "Memo";
    case Tn:
      e = t._payload, t = t._init;
      try {
        return Tu(t(e));
      } catch {
      }
  }
  return null;
}
function Xv(t) {
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
      return Tu(e);
    case 8:
      return e === Zc ? "StrictMode" : "Mode";
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
function Ah(t) {
  var e = t.type;
  return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
}
function qv(t) {
  var e = Ah(t) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e), r = "" + t[e];
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
function ns(t) {
  t._valueTracker || (t._valueTracker = qv(t));
}
function Oh(t) {
  if (!t) return !1;
  var e = t._valueTracker;
  if (!e) return !0;
  var n = e.getValue(), r = "";
  return t && (r = Ah(t) ? t.checked ? "true" : "false" : t.value), t = r, t !== n ? (e.setValue(t), !0) : !1;
}
function zs(t) {
  if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
  try {
    return t.activeElement || t.body;
  } catch {
    return t.body;
  }
}
function Nu(t, e) {
  var n = e.checked;
  return Ce({}, e, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? t._wrapperState.initialChecked });
}
function Pf(t, e) {
  var n = e.defaultValue == null ? "" : e.defaultValue, r = e.checked != null ? e.checked : e.defaultChecked;
  n = Kn(e.value != null ? e.value : n), t._wrapperState = { initialChecked: r, initialValue: n, controlled: e.type === "checkbox" || e.type === "radio" ? e.checked != null : e.value != null };
}
function Ph(t, e) {
  e = e.checked, e != null && Yc(t, "checked", e, !1);
}
function bu(t, e) {
  Ph(t, e);
  var n = Kn(e.value), r = e.type;
  if (n != null) r === "number" ? (n === 0 && t.value === "" || t.value != n) && (t.value = "" + n) : t.value !== "" + n && (t.value = "" + n);
  else if (r === "submit" || r === "reset") {
    t.removeAttribute("value");
    return;
  }
  e.hasOwnProperty("value") ? Au(t, e.type, n) : e.hasOwnProperty("defaultValue") && Au(t, e.type, Kn(e.defaultValue)), e.checked == null && e.defaultChecked != null && (t.defaultChecked = !!e.defaultChecked);
}
function $f(t, e, n) {
  if (e.hasOwnProperty("value") || e.hasOwnProperty("defaultValue")) {
    var r = e.type;
    if (!(r !== "submit" && r !== "reset" || e.value !== void 0 && e.value !== null)) return;
    e = "" + t._wrapperState.initialValue, n || e === t.value || (t.value = e), t.defaultValue = e;
  }
  n = t.name, n !== "" && (t.name = ""), t.defaultChecked = !!t._wrapperState.initialChecked, n !== "" && (t.name = n);
}
function Au(t, e, n) {
  (e !== "number" || zs(t.ownerDocument) !== t) && (n == null ? t.defaultValue = "" + t._wrapperState.initialValue : t.defaultValue !== "" + n && (t.defaultValue = "" + n));
}
var Ho = Array.isArray;
function Zr(t, e, n, r) {
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
function Ou(t, e) {
  if (e.dangerouslySetInnerHTML != null) throw Error(D(91));
  return Ce({}, e, { value: void 0, defaultValue: void 0, children: "" + t._wrapperState.initialValue });
}
function Ff(t, e) {
  var n = e.value;
  if (n == null) {
    if (n = e.children, e = e.defaultValue, n != null) {
      if (e != null) throw Error(D(92));
      if (Ho(n)) {
        if (1 < n.length) throw Error(D(93));
        n = n[0];
      }
      e = n;
    }
    e == null && (e = ""), n = e;
  }
  t._wrapperState = { initialValue: Kn(n) };
}
function $h(t, e) {
  var n = Kn(e.value), r = Kn(e.defaultValue);
  n != null && (n = "" + n, n !== t.value && (t.value = n), e.defaultValue == null && t.defaultValue !== n && (t.defaultValue = n)), r != null && (t.defaultValue = "" + r);
}
function Lf(t) {
  var e = t.textContent;
  e === t._wrapperState.initialValue && e !== "" && e !== null && (t.value = e);
}
function Fh(t) {
  switch (t) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Pu(t, e) {
  return t == null || t === "http://www.w3.org/1999/xhtml" ? Fh(e) : t === "http://www.w3.org/2000/svg" && e === "foreignObject" ? "http://www.w3.org/1999/xhtml" : t;
}
var rs, Lh = function(t) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(e, n, r, o) {
    MSApp.execUnsafeLocalFunction(function() {
      return t(e, n, r, o);
    });
  } : t;
}(function(t, e) {
  if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t) t.innerHTML = e;
  else {
    for (rs = rs || document.createElement("div"), rs.innerHTML = "<svg>" + e.valueOf().toString() + "</svg>", e = rs.firstChild; t.firstChild; ) t.removeChild(t.firstChild);
    for (; e.firstChild; ) t.appendChild(e.firstChild);
  }
});
function hi(t, e) {
  if (e) {
    var n = t.firstChild;
    if (n && n === t.lastChild && n.nodeType === 3) {
      n.nodeValue = e;
      return;
    }
  }
  t.textContent = e;
}
var ei = {
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
}, e0 = ["Webkit", "ms", "Moz", "O"];
Object.keys(ei).forEach(function(t) {
  e0.forEach(function(e) {
    e = e + t.charAt(0).toUpperCase() + t.substring(1), ei[e] = ei[t];
  });
});
function Ih(t, e, n) {
  return e == null || typeof e == "boolean" || e === "" ? "" : n || typeof e != "number" || e === 0 || ei.hasOwnProperty(t) && ei[t] ? ("" + e).trim() : e + "px";
}
function Dh(t, e) {
  t = t.style;
  for (var n in e) if (e.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, o = Ih(n, e[n], r);
    n === "float" && (n = "cssFloat"), r ? t.setProperty(n, o) : t[n] = o;
  }
}
var t0 = Ce({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
function $u(t, e) {
  if (e) {
    if (t0[t] && (e.children != null || e.dangerouslySetInnerHTML != null)) throw Error(D(137, t));
    if (e.dangerouslySetInnerHTML != null) {
      if (e.children != null) throw Error(D(60));
      if (typeof e.dangerouslySetInnerHTML != "object" || !("__html" in e.dangerouslySetInnerHTML)) throw Error(D(61));
    }
    if (e.style != null && typeof e.style != "object") throw Error(D(62));
  }
}
function Fu(t, e) {
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
var Lu = null;
function ed(t) {
  return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
}
var Iu = null, Xr = null, qr = null;
function If(t) {
  if (t = Ui(t)) {
    if (typeof Iu != "function") throw Error(D(280));
    var e = t.stateNode;
    e && (e = Ml(e), Iu(t.stateNode, t.type, e));
  }
}
function Rh(t) {
  Xr ? qr ? qr.push(t) : qr = [t] : Xr = t;
}
function Mh() {
  if (Xr) {
    var t = Xr, e = qr;
    if (qr = Xr = null, If(t), e) for (t = 0; t < e.length; t++) If(e[t]);
  }
}
function zh(t, e) {
  return t(e);
}
function jh() {
}
var Fa = !1;
function Bh(t, e, n) {
  if (Fa) return t(e, n);
  Fa = !0;
  try {
    return zh(t, e, n);
  } finally {
    Fa = !1, (Xr !== null || qr !== null) && (jh(), Mh());
  }
}
function mi(t, e) {
  var n = t.stateNode;
  if (n === null) return null;
  var r = Ml(n);
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
  if (n && typeof n != "function") throw Error(D(231, e, typeof n));
  return n;
}
var Du = !1;
if (_n) try {
  var $o = {};
  Object.defineProperty($o, "passive", { get: function() {
    Du = !0;
  } }), window.addEventListener("test", $o, $o), window.removeEventListener("test", $o, $o);
} catch {
  Du = !1;
}
function n0(t, e, n, r, o, i, s, l, a) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    e.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var ti = !1, js = null, Bs = !1, Ru = null, r0 = { onError: function(t) {
  ti = !0, js = t;
} };
function o0(t, e, n, r, o, i, s, l, a) {
  ti = !1, js = null, n0.apply(r0, arguments);
}
function i0(t, e, n, r, o, i, s, l, a) {
  if (o0.apply(this, arguments), ti) {
    if (ti) {
      var u = js;
      ti = !1, js = null;
    } else throw Error(D(198));
    Bs || (Bs = !0, Ru = u);
  }
}
function Tr(t) {
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
function Uh(t) {
  if (t.tag === 13) {
    var e = t.memoizedState;
    if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
  }
  return null;
}
function Df(t) {
  if (Tr(t) !== t) throw Error(D(188));
}
function s0(t) {
  var e = t.alternate;
  if (!e) {
    if (e = Tr(t), e === null) throw Error(D(188));
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
        if (i === n) return Df(o), t;
        if (i === r) return Df(o), e;
        i = i.sibling;
      }
      throw Error(D(188));
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
        if (!s) throw Error(D(189));
      }
    }
    if (n.alternate !== r) throw Error(D(190));
  }
  if (n.tag !== 3) throw Error(D(188));
  return n.stateNode.current === n ? t : e;
}
function Wh(t) {
  return t = s0(t), t !== null ? Hh(t) : null;
}
function Hh(t) {
  if (t.tag === 5 || t.tag === 6) return t;
  for (t = t.child; t !== null; ) {
    var e = Hh(t);
    if (e !== null) return e;
    t = t.sibling;
  }
  return null;
}
var Vh = vt.unstable_scheduleCallback, Rf = vt.unstable_cancelCallback, l0 = vt.unstable_shouldYield, a0 = vt.unstable_requestPaint, be = vt.unstable_now, u0 = vt.unstable_getCurrentPriorityLevel, td = vt.unstable_ImmediatePriority, Kh = vt.unstable_UserBlockingPriority, Us = vt.unstable_NormalPriority, c0 = vt.unstable_LowPriority, Qh = vt.unstable_IdlePriority, Ll = null, en = null;
function d0(t) {
  if (en && typeof en.onCommitFiberRoot == "function") try {
    en.onCommitFiberRoot(Ll, t, void 0, (t.current.flags & 128) === 128);
  } catch {
  }
}
var zt = Math.clz32 ? Math.clz32 : g0, f0 = Math.log, p0 = Math.LN2;
function g0(t) {
  return t >>>= 0, t === 0 ? 32 : 31 - (f0(t) / p0 | 0) | 0;
}
var os = 64, is = 4194304;
function Vo(t) {
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
function Ws(t, e) {
  var n = t.pendingLanes;
  if (n === 0) return 0;
  var r = 0, o = t.suspendedLanes, i = t.pingedLanes, s = n & 268435455;
  if (s !== 0) {
    var l = s & ~o;
    l !== 0 ? r = Vo(l) : (i &= s, i !== 0 && (r = Vo(i)));
  } else s = n & ~o, s !== 0 ? r = Vo(s) : i !== 0 && (r = Vo(i));
  if (r === 0) return 0;
  if (e !== 0 && e !== r && !(e & o) && (o = r & -r, i = e & -e, o >= i || o === 16 && (i & 4194240) !== 0)) return e;
  if (r & 4 && (r |= n & 16), e = t.entangledLanes, e !== 0) for (t = t.entanglements, e &= r; 0 < e; ) n = 31 - zt(e), o = 1 << n, r |= t[n], e &= ~o;
  return r;
}
function h0(t, e) {
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
function m0(t, e) {
  for (var n = t.suspendedLanes, r = t.pingedLanes, o = t.expirationTimes, i = t.pendingLanes; 0 < i; ) {
    var s = 31 - zt(i), l = 1 << s, a = o[s];
    a === -1 ? (!(l & n) || l & r) && (o[s] = h0(l, e)) : a <= e && (t.expiredLanes |= l), i &= ~l;
  }
}
function Mu(t) {
  return t = t.pendingLanes & -1073741825, t !== 0 ? t : t & 1073741824 ? 1073741824 : 0;
}
function Gh() {
  var t = os;
  return os <<= 1, !(os & 4194240) && (os = 64), t;
}
function La(t) {
  for (var e = [], n = 0; 31 > n; n++) e.push(t);
  return e;
}
function ji(t, e, n) {
  t.pendingLanes |= e, e !== 536870912 && (t.suspendedLanes = 0, t.pingedLanes = 0), t = t.eventTimes, e = 31 - zt(e), t[e] = n;
}
function y0(t, e) {
  var n = t.pendingLanes & ~e;
  t.pendingLanes = e, t.suspendedLanes = 0, t.pingedLanes = 0, t.expiredLanes &= e, t.mutableReadLanes &= e, t.entangledLanes &= e, e = t.entanglements;
  var r = t.eventTimes;
  for (t = t.expirationTimes; 0 < n; ) {
    var o = 31 - zt(n), i = 1 << o;
    e[o] = 0, r[o] = -1, t[o] = -1, n &= ~i;
  }
}
function nd(t, e) {
  var n = t.entangledLanes |= e;
  for (t = t.entanglements; n; ) {
    var r = 31 - zt(n), o = 1 << r;
    o & e | t[r] & e && (t[r] |= e), n &= ~o;
  }
}
var ue = 0;
function Jh(t) {
  return t &= -t, 1 < t ? 4 < t ? t & 268435455 ? 16 : 536870912 : 4 : 1;
}
var Yh, rd, Zh, Xh, qh, zu = !1, ss = [], In = null, Dn = null, Rn = null, yi = /* @__PURE__ */ new Map(), _i = /* @__PURE__ */ new Map(), An = [], _0 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Mf(t, e) {
  switch (t) {
    case "focusin":
    case "focusout":
      In = null;
      break;
    case "dragenter":
    case "dragleave":
      Dn = null;
      break;
    case "mouseover":
    case "mouseout":
      Rn = null;
      break;
    case "pointerover":
    case "pointerout":
      yi.delete(e.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      _i.delete(e.pointerId);
  }
}
function Fo(t, e, n, r, o, i) {
  return t === null || t.nativeEvent !== i ? (t = { blockedOn: e, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [o] }, e !== null && (e = Ui(e), e !== null && rd(e)), t) : (t.eventSystemFlags |= r, e = t.targetContainers, o !== null && e.indexOf(o) === -1 && e.push(o), t);
}
function v0(t, e, n, r, o) {
  switch (e) {
    case "focusin":
      return In = Fo(In, t, e, n, r, o), !0;
    case "dragenter":
      return Dn = Fo(Dn, t, e, n, r, o), !0;
    case "mouseover":
      return Rn = Fo(Rn, t, e, n, r, o), !0;
    case "pointerover":
      var i = o.pointerId;
      return yi.set(i, Fo(yi.get(i) || null, t, e, n, r, o)), !0;
    case "gotpointercapture":
      return i = o.pointerId, _i.set(i, Fo(_i.get(i) || null, t, e, n, r, o)), !0;
  }
  return !1;
}
function em(t) {
  var e = ar(t.target);
  if (e !== null) {
    var n = Tr(e);
    if (n !== null) {
      if (e = n.tag, e === 13) {
        if (e = Uh(n), e !== null) {
          t.blockedOn = e, qh(t.priority, function() {
            Zh(n);
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
function ks(t) {
  if (t.blockedOn !== null) return !1;
  for (var e = t.targetContainers; 0 < e.length; ) {
    var n = ju(t.domEventName, t.eventSystemFlags, e[0], t.nativeEvent);
    if (n === null) {
      n = t.nativeEvent;
      var r = new n.constructor(n.type, n);
      Lu = r, n.target.dispatchEvent(r), Lu = null;
    } else return e = Ui(n), e !== null && rd(e), t.blockedOn = n, !1;
    e.shift();
  }
  return !0;
}
function zf(t, e, n) {
  ks(t) && n.delete(e);
}
function x0() {
  zu = !1, In !== null && ks(In) && (In = null), Dn !== null && ks(Dn) && (Dn = null), Rn !== null && ks(Rn) && (Rn = null), yi.forEach(zf), _i.forEach(zf);
}
function Lo(t, e) {
  t.blockedOn === e && (t.blockedOn = null, zu || (zu = !0, vt.unstable_scheduleCallback(vt.unstable_NormalPriority, x0)));
}
function vi(t) {
  function e(o) {
    return Lo(o, t);
  }
  if (0 < ss.length) {
    Lo(ss[0], t);
    for (var n = 1; n < ss.length; n++) {
      var r = ss[n];
      r.blockedOn === t && (r.blockedOn = null);
    }
  }
  for (In !== null && Lo(In, t), Dn !== null && Lo(Dn, t), Rn !== null && Lo(Rn, t), yi.forEach(e), _i.forEach(e), n = 0; n < An.length; n++) r = An[n], r.blockedOn === t && (r.blockedOn = null);
  for (; 0 < An.length && (n = An[0], n.blockedOn === null); ) em(n), n.blockedOn === null && An.shift();
}
var eo = Cn.ReactCurrentBatchConfig, Hs = !0;
function w0(t, e, n, r) {
  var o = ue, i = eo.transition;
  eo.transition = null;
  try {
    ue = 1, od(t, e, n, r);
  } finally {
    ue = o, eo.transition = i;
  }
}
function S0(t, e, n, r) {
  var o = ue, i = eo.transition;
  eo.transition = null;
  try {
    ue = 4, od(t, e, n, r);
  } finally {
    ue = o, eo.transition = i;
  }
}
function od(t, e, n, r) {
  if (Hs) {
    var o = ju(t, e, n, r);
    if (o === null) Ha(t, e, r, Vs, n), Mf(t, r);
    else if (v0(o, t, e, n, r)) r.stopPropagation();
    else if (Mf(t, r), e & 4 && -1 < _0.indexOf(t)) {
      for (; o !== null; ) {
        var i = Ui(o);
        if (i !== null && Yh(i), i = ju(t, e, n, r), i === null && Ha(t, e, r, Vs, n), i === o) break;
        o = i;
      }
      o !== null && r.stopPropagation();
    } else Ha(t, e, r, null, n);
  }
}
var Vs = null;
function ju(t, e, n, r) {
  if (Vs = null, t = ed(r), t = ar(t), t !== null) if (e = Tr(t), e === null) t = null;
  else if (n = e.tag, n === 13) {
    if (t = Uh(e), t !== null) return t;
    t = null;
  } else if (n === 3) {
    if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
    t = null;
  } else e !== t && (t = null);
  return Vs = t, null;
}
function tm(t) {
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
      switch (u0()) {
        case td:
          return 1;
        case Kh:
          return 4;
        case Us:
        case c0:
          return 16;
        case Qh:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Pn = null, id = null, Es = null;
function nm() {
  if (Es) return Es;
  var t, e = id, n = e.length, r, o = "value" in Pn ? Pn.value : Pn.textContent, i = o.length;
  for (t = 0; t < n && e[t] === o[t]; t++) ;
  var s = n - t;
  for (r = 1; r <= s && e[n - r] === o[i - r]; r++) ;
  return Es = o.slice(t, 1 < r ? 1 - r : void 0);
}
function Ts(t) {
  var e = t.keyCode;
  return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
}
function ls() {
  return !0;
}
function jf() {
  return !1;
}
function wt(t) {
  function e(n, r, o, i, s) {
    this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = s, this.currentTarget = null;
    for (var l in t) t.hasOwnProperty(l) && (n = t[l], this[l] = n ? n(i) : i[l]);
    return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? ls : jf, this.isPropagationStopped = jf, this;
  }
  return Ce(e.prototype, { preventDefault: function() {
    this.defaultPrevented = !0;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = ls);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = ls);
  }, persist: function() {
  }, isPersistent: ls }), e;
}
var _o = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(t) {
  return t.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, sd = wt(_o), Bi = Ce({}, _o, { view: 0, detail: 0 }), C0 = wt(Bi), Ia, Da, Io, Il = Ce({}, Bi, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ld, button: 0, buttons: 0, relatedTarget: function(t) {
  return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
}, movementX: function(t) {
  return "movementX" in t ? t.movementX : (t !== Io && (Io && t.type === "mousemove" ? (Ia = t.screenX - Io.screenX, Da = t.screenY - Io.screenY) : Da = Ia = 0, Io = t), Ia);
}, movementY: function(t) {
  return "movementY" in t ? t.movementY : Da;
} }), Bf = wt(Il), k0 = Ce({}, Il, { dataTransfer: 0 }), E0 = wt(k0), T0 = Ce({}, Bi, { relatedTarget: 0 }), Ra = wt(T0), N0 = Ce({}, _o, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), b0 = wt(N0), A0 = Ce({}, _o, { clipboardData: function(t) {
  return "clipboardData" in t ? t.clipboardData : window.clipboardData;
} }), O0 = wt(A0), P0 = Ce({}, _o, { data: 0 }), Uf = wt(P0), $0 = {
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
}, F0 = {
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
}, L0 = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function I0(t) {
  var e = this.nativeEvent;
  return e.getModifierState ? e.getModifierState(t) : (t = L0[t]) ? !!e[t] : !1;
}
function ld() {
  return I0;
}
var D0 = Ce({}, Bi, { key: function(t) {
  if (t.key) {
    var e = $0[t.key] || t.key;
    if (e !== "Unidentified") return e;
  }
  return t.type === "keypress" ? (t = Ts(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? F0[t.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ld, charCode: function(t) {
  return t.type === "keypress" ? Ts(t) : 0;
}, keyCode: function(t) {
  return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
}, which: function(t) {
  return t.type === "keypress" ? Ts(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
} }), R0 = wt(D0), M0 = Ce({}, Il, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Wf = wt(M0), z0 = Ce({}, Bi, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ld }), j0 = wt(z0), B0 = Ce({}, _o, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), U0 = wt(B0), W0 = Ce({}, Il, {
  deltaX: function(t) {
    return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
  },
  deltaY: function(t) {
    return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), H0 = wt(W0), V0 = [9, 13, 27, 32], ad = _n && "CompositionEvent" in window, ni = null;
_n && "documentMode" in document && (ni = document.documentMode);
var K0 = _n && "TextEvent" in window && !ni, rm = _n && (!ad || ni && 8 < ni && 11 >= ni), Hf = " ", Vf = !1;
function om(t, e) {
  switch (t) {
    case "keyup":
      return V0.indexOf(e.keyCode) !== -1;
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
function im(t) {
  return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
}
var zr = !1;
function Q0(t, e) {
  switch (t) {
    case "compositionend":
      return im(e);
    case "keypress":
      return e.which !== 32 ? null : (Vf = !0, Hf);
    case "textInput":
      return t = e.data, t === Hf && Vf ? null : t;
    default:
      return null;
  }
}
function G0(t, e) {
  if (zr) return t === "compositionend" || !ad && om(t, e) ? (t = nm(), Es = id = Pn = null, zr = !1, t) : null;
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
      return rm && e.locale !== "ko" ? null : e.data;
    default:
      return null;
  }
}
var J0 = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
function Kf(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e === "input" ? !!J0[t.type] : e === "textarea";
}
function sm(t, e, n, r) {
  Rh(r), e = Ks(e, "onChange"), 0 < e.length && (n = new sd("onChange", "change", null, n, r), t.push({ event: n, listeners: e }));
}
var ri = null, xi = null;
function Y0(t) {
  ym(t, 0);
}
function Dl(t) {
  var e = Ur(t);
  if (Oh(e)) return t;
}
function Z0(t, e) {
  if (t === "change") return e;
}
var lm = !1;
if (_n) {
  var Ma;
  if (_n) {
    var za = "oninput" in document;
    if (!za) {
      var Qf = document.createElement("div");
      Qf.setAttribute("oninput", "return;"), za = typeof Qf.oninput == "function";
    }
    Ma = za;
  } else Ma = !1;
  lm = Ma && (!document.documentMode || 9 < document.documentMode);
}
function Gf() {
  ri && (ri.detachEvent("onpropertychange", am), xi = ri = null);
}
function am(t) {
  if (t.propertyName === "value" && Dl(xi)) {
    var e = [];
    sm(e, xi, t, ed(t)), Bh(Y0, e);
  }
}
function X0(t, e, n) {
  t === "focusin" ? (Gf(), ri = e, xi = n, ri.attachEvent("onpropertychange", am)) : t === "focusout" && Gf();
}
function q0(t) {
  if (t === "selectionchange" || t === "keyup" || t === "keydown") return Dl(xi);
}
function ex(t, e) {
  if (t === "click") return Dl(e);
}
function tx(t, e) {
  if (t === "input" || t === "change") return Dl(e);
}
function nx(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var Ut = typeof Object.is == "function" ? Object.is : nx;
function wi(t, e) {
  if (Ut(t, e)) return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
  var n = Object.keys(t), r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!Su.call(e, o) || !Ut(t[o], e[o])) return !1;
  }
  return !0;
}
function Jf(t) {
  for (; t && t.firstChild; ) t = t.firstChild;
  return t;
}
function Yf(t, e) {
  var n = Jf(t);
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
    n = Jf(n);
  }
}
function um(t, e) {
  return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? um(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
}
function cm() {
  for (var t = window, e = zs(); e instanceof t.HTMLIFrameElement; ) {
    try {
      var n = typeof e.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) t = e.contentWindow;
    else break;
    e = zs(t.document);
  }
  return e;
}
function ud(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
}
function rx(t) {
  var e = cm(), n = t.focusedElem, r = t.selectionRange;
  if (e !== n && n && n.ownerDocument && um(n.ownerDocument.documentElement, n)) {
    if (r !== null && ud(n)) {
      if (e = r.start, t = r.end, t === void 0 && (t = e), "selectionStart" in n) n.selectionStart = e, n.selectionEnd = Math.min(t, n.value.length);
      else if (t = (e = n.ownerDocument || document) && e.defaultView || window, t.getSelection) {
        t = t.getSelection();
        var o = n.textContent.length, i = Math.min(r.start, o);
        r = r.end === void 0 ? i : Math.min(r.end, o), !t.extend && i > r && (o = r, r = i, i = o), o = Yf(n, i);
        var s = Yf(
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
var ox = _n && "documentMode" in document && 11 >= document.documentMode, jr = null, Bu = null, oi = null, Uu = !1;
function Zf(t, e, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Uu || jr == null || jr !== zs(r) || (r = jr, "selectionStart" in r && ud(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), oi && wi(oi, r) || (oi = r, r = Ks(Bu, "onSelect"), 0 < r.length && (e = new sd("onSelect", "select", null, e, n), t.push({ event: e, listeners: r }), e.target = jr)));
}
function as(t, e) {
  var n = {};
  return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
}
var Br = { animationend: as("Animation", "AnimationEnd"), animationiteration: as("Animation", "AnimationIteration"), animationstart: as("Animation", "AnimationStart"), transitionend: as("Transition", "TransitionEnd") }, ja = {}, dm = {};
_n && (dm = document.createElement("div").style, "AnimationEvent" in window || (delete Br.animationend.animation, delete Br.animationiteration.animation, delete Br.animationstart.animation), "TransitionEvent" in window || delete Br.transitionend.transition);
function Rl(t) {
  if (ja[t]) return ja[t];
  if (!Br[t]) return t;
  var e = Br[t], n;
  for (n in e) if (e.hasOwnProperty(n) && n in dm) return ja[t] = e[n];
  return t;
}
var fm = Rl("animationend"), pm = Rl("animationiteration"), gm = Rl("animationstart"), hm = Rl("transitionend"), mm = /* @__PURE__ */ new Map(), Xf = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function Jn(t, e) {
  mm.set(t, e), Er(e, [t]);
}
for (var Ba = 0; Ba < Xf.length; Ba++) {
  var Ua = Xf[Ba], ix = Ua.toLowerCase(), sx = Ua[0].toUpperCase() + Ua.slice(1);
  Jn(ix, "on" + sx);
}
Jn(fm, "onAnimationEnd");
Jn(pm, "onAnimationIteration");
Jn(gm, "onAnimationStart");
Jn("dblclick", "onDoubleClick");
Jn("focusin", "onFocus");
Jn("focusout", "onBlur");
Jn(hm, "onTransitionEnd");
oo("onMouseEnter", ["mouseout", "mouseover"]);
oo("onMouseLeave", ["mouseout", "mouseover"]);
oo("onPointerEnter", ["pointerout", "pointerover"]);
oo("onPointerLeave", ["pointerout", "pointerover"]);
Er("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
Er("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
Er("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Er("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
Er("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
Er("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var Ko = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), lx = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ko));
function qf(t, e, n) {
  var r = t.type || "unknown-event";
  t.currentTarget = n, i0(r, e, void 0, t), t.currentTarget = null;
}
function ym(t, e) {
  e = (e & 4) !== 0;
  for (var n = 0; n < t.length; n++) {
    var r = t[n], o = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (e) for (var s = r.length - 1; 0 <= s; s--) {
        var l = r[s], a = l.instance, u = l.currentTarget;
        if (l = l.listener, a !== i && o.isPropagationStopped()) break e;
        qf(o, l, u), i = a;
      }
      else for (s = 0; s < r.length; s++) {
        if (l = r[s], a = l.instance, u = l.currentTarget, l = l.listener, a !== i && o.isPropagationStopped()) break e;
        qf(o, l, u), i = a;
      }
    }
  }
  if (Bs) throw t = Ru, Bs = !1, Ru = null, t;
}
function he(t, e) {
  var n = e[Qu];
  n === void 0 && (n = e[Qu] = /* @__PURE__ */ new Set());
  var r = t + "__bubble";
  n.has(r) || (_m(e, t, 2, !1), n.add(r));
}
function Wa(t, e, n) {
  var r = 0;
  e && (r |= 4), _m(n, t, r, e);
}
var us = "_reactListening" + Math.random().toString(36).slice(2);
function Si(t) {
  if (!t[us]) {
    t[us] = !0, Eh.forEach(function(n) {
      n !== "selectionchange" && (lx.has(n) || Wa(n, !1, t), Wa(n, !0, t));
    });
    var e = t.nodeType === 9 ? t : t.ownerDocument;
    e === null || e[us] || (e[us] = !0, Wa("selectionchange", !1, e));
  }
}
function _m(t, e, n, r) {
  switch (tm(e)) {
    case 1:
      var o = w0;
      break;
    case 4:
      o = S0;
      break;
    default:
      o = od;
  }
  n = o.bind(null, e, n, t), o = void 0, !Du || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (o = !0), r ? o !== void 0 ? t.addEventListener(e, n, { capture: !0, passive: o }) : t.addEventListener(e, n, !0) : o !== void 0 ? t.addEventListener(e, n, { passive: o }) : t.addEventListener(e, n, !1);
}
function Ha(t, e, n, r, o) {
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
        if (s = ar(l), s === null) return;
        if (a = s.tag, a === 5 || a === 6) {
          r = i = s;
          continue e;
        }
        l = l.parentNode;
      }
    }
    r = r.return;
  }
  Bh(function() {
    var u = i, c = ed(n), p = [];
    e: {
      var d = mm.get(t);
      if (d !== void 0) {
        var m = sd, h = t;
        switch (t) {
          case "keypress":
            if (Ts(n) === 0) break e;
          case "keydown":
          case "keyup":
            m = R0;
            break;
          case "focusin":
            h = "focus", m = Ra;
            break;
          case "focusout":
            h = "blur", m = Ra;
            break;
          case "beforeblur":
          case "afterblur":
            m = Ra;
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
            m = Bf;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            m = E0;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            m = j0;
            break;
          case fm:
          case pm:
          case gm:
            m = b0;
            break;
          case hm:
            m = U0;
            break;
          case "scroll":
            m = C0;
            break;
          case "wheel":
            m = H0;
            break;
          case "copy":
          case "cut":
          case "paste":
            m = O0;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            m = Wf;
        }
        var y = (e & 4) !== 0, v = !y && t === "scroll", _ = y ? d !== null ? d + "Capture" : null : d;
        y = [];
        for (var f = u, g; f !== null; ) {
          g = f;
          var x = g.stateNode;
          if (g.tag === 5 && x !== null && (g = x, _ !== null && (x = mi(f, _), x != null && y.push(Ci(f, x, g)))), v) break;
          f = f.return;
        }
        0 < y.length && (d = new m(d, h, null, n, c), p.push({ event: d, listeners: y }));
      }
    }
    if (!(e & 7)) {
      e: {
        if (d = t === "mouseover" || t === "pointerover", m = t === "mouseout" || t === "pointerout", d && n !== Lu && (h = n.relatedTarget || n.fromElement) && (ar(h) || h[vn])) break e;
        if ((m || d) && (d = c.window === c ? c : (d = c.ownerDocument) ? d.defaultView || d.parentWindow : window, m ? (h = n.relatedTarget || n.toElement, m = u, h = h ? ar(h) : null, h !== null && (v = Tr(h), h !== v || h.tag !== 5 && h.tag !== 6) && (h = null)) : (m = null, h = u), m !== h)) {
          if (y = Bf, x = "onMouseLeave", _ = "onMouseEnter", f = "mouse", (t === "pointerout" || t === "pointerover") && (y = Wf, x = "onPointerLeave", _ = "onPointerEnter", f = "pointer"), v = m == null ? d : Ur(m), g = h == null ? d : Ur(h), d = new y(x, f + "leave", m, n, c), d.target = v, d.relatedTarget = g, x = null, ar(c) === u && (y = new y(_, f + "enter", h, n, c), y.target = g, y.relatedTarget = v, x = y), v = x, m && h) t: {
            for (y = m, _ = h, f = 0, g = y; g; g = Or(g)) f++;
            for (g = 0, x = _; x; x = Or(x)) g++;
            for (; 0 < f - g; ) y = Or(y), f--;
            for (; 0 < g - f; ) _ = Or(_), g--;
            for (; f--; ) {
              if (y === _ || _ !== null && y === _.alternate) break t;
              y = Or(y), _ = Or(_);
            }
            y = null;
          }
          else y = null;
          m !== null && ep(p, d, m, y, !1), h !== null && v !== null && ep(p, v, h, y, !0);
        }
      }
      e: {
        if (d = u ? Ur(u) : window, m = d.nodeName && d.nodeName.toLowerCase(), m === "select" || m === "input" && d.type === "file") var w = Z0;
        else if (Kf(d)) if (lm) w = tx;
        else {
          w = q0;
          var S = X0;
        }
        else (m = d.nodeName) && m.toLowerCase() === "input" && (d.type === "checkbox" || d.type === "radio") && (w = ex);
        if (w && (w = w(t, u))) {
          sm(p, w, n, c);
          break e;
        }
        S && S(t, d, u), t === "focusout" && (S = d._wrapperState) && S.controlled && d.type === "number" && Au(d, "number", d.value);
      }
      switch (S = u ? Ur(u) : window, t) {
        case "focusin":
          (Kf(S) || S.contentEditable === "true") && (jr = S, Bu = u, oi = null);
          break;
        case "focusout":
          oi = Bu = jr = null;
          break;
        case "mousedown":
          Uu = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Uu = !1, Zf(p, n, c);
          break;
        case "selectionchange":
          if (ox) break;
        case "keydown":
        case "keyup":
          Zf(p, n, c);
      }
      var C;
      if (ad) e: {
        switch (t) {
          case "compositionstart":
            var k = "onCompositionStart";
            break e;
          case "compositionend":
            k = "onCompositionEnd";
            break e;
          case "compositionupdate":
            k = "onCompositionUpdate";
            break e;
        }
        k = void 0;
      }
      else zr ? om(t, n) && (k = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (k = "onCompositionStart");
      k && (rm && n.locale !== "ko" && (zr || k !== "onCompositionStart" ? k === "onCompositionEnd" && zr && (C = nm()) : (Pn = c, id = "value" in Pn ? Pn.value : Pn.textContent, zr = !0)), S = Ks(u, k), 0 < S.length && (k = new Uf(k, t, null, n, c), p.push({ event: k, listeners: S }), C ? k.data = C : (C = im(n), C !== null && (k.data = C)))), (C = K0 ? Q0(t, n) : G0(t, n)) && (u = Ks(u, "onBeforeInput"), 0 < u.length && (c = new Uf("onBeforeInput", "beforeinput", null, n, c), p.push({ event: c, listeners: u }), c.data = C));
    }
    ym(p, e);
  });
}
function Ci(t, e, n) {
  return { instance: t, listener: e, currentTarget: n };
}
function Ks(t, e) {
  for (var n = e + "Capture", r = []; t !== null; ) {
    var o = t, i = o.stateNode;
    o.tag === 5 && i !== null && (o = i, i = mi(t, n), i != null && r.unshift(Ci(t, i, o)), i = mi(t, e), i != null && r.push(Ci(t, i, o))), t = t.return;
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
function ep(t, e, n, r, o) {
  for (var i = e._reactName, s = []; n !== null && n !== r; ) {
    var l = n, a = l.alternate, u = l.stateNode;
    if (a !== null && a === r) break;
    l.tag === 5 && u !== null && (l = u, o ? (a = mi(n, i), a != null && s.unshift(Ci(n, a, l))) : o || (a = mi(n, i), a != null && s.push(Ci(n, a, l)))), n = n.return;
  }
  s.length !== 0 && t.push({ event: e, listeners: s });
}
var ax = /\r\n?/g, ux = /\u0000|\uFFFD/g;
function tp(t) {
  return (typeof t == "string" ? t : "" + t).replace(ax, `
`).replace(ux, "");
}
function cs(t, e, n) {
  if (e = tp(e), tp(t) !== e && n) throw Error(D(425));
}
function Qs() {
}
var Wu = null, Hu = null;
function Vu(t, e) {
  return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
}
var Ku = typeof setTimeout == "function" ? setTimeout : void 0, cx = typeof clearTimeout == "function" ? clearTimeout : void 0, np = typeof Promise == "function" ? Promise : void 0, dx = typeof queueMicrotask == "function" ? queueMicrotask : typeof np < "u" ? function(t) {
  return np.resolve(null).then(t).catch(fx);
} : Ku;
function fx(t) {
  setTimeout(function() {
    throw t;
  });
}
function Va(t, e) {
  var n = e, r = 0;
  do {
    var o = n.nextSibling;
    if (t.removeChild(n), o && o.nodeType === 8) if (n = o.data, n === "/$") {
      if (r === 0) {
        t.removeChild(o), vi(e);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = o;
  } while (n);
  vi(e);
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
function rp(t) {
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
var vo = Math.random().toString(36).slice(2), Yt = "__reactFiber$" + vo, ki = "__reactProps$" + vo, vn = "__reactContainer$" + vo, Qu = "__reactEvents$" + vo, px = "__reactListeners$" + vo, gx = "__reactHandles$" + vo;
function ar(t) {
  var e = t[Yt];
  if (e) return e;
  for (var n = t.parentNode; n; ) {
    if (e = n[vn] || n[Yt]) {
      if (n = e.alternate, e.child !== null || n !== null && n.child !== null) for (t = rp(t); t !== null; ) {
        if (n = t[Yt]) return n;
        t = rp(t);
      }
      return e;
    }
    t = n, n = t.parentNode;
  }
  return null;
}
function Ui(t) {
  return t = t[Yt] || t[vn], !t || t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3 ? null : t;
}
function Ur(t) {
  if (t.tag === 5 || t.tag === 6) return t.stateNode;
  throw Error(D(33));
}
function Ml(t) {
  return t[ki] || null;
}
var Gu = [], Wr = -1;
function Yn(t) {
  return { current: t };
}
function me(t) {
  0 > Wr || (t.current = Gu[Wr], Gu[Wr] = null, Wr--);
}
function pe(t, e) {
  Wr++, Gu[Wr] = t.current, t.current = e;
}
var Qn = {}, Ze = Yn(Qn), at = Yn(!1), mr = Qn;
function io(t, e) {
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
function Gs() {
  me(at), me(Ze);
}
function op(t, e, n) {
  if (Ze.current !== Qn) throw Error(D(168));
  pe(Ze, e), pe(at, n);
}
function vm(t, e, n) {
  var r = t.stateNode;
  if (e = e.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in e)) throw Error(D(108, Xv(t) || "Unknown", o));
  return Ce({}, n, r);
}
function Js(t) {
  return t = (t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext || Qn, mr = Ze.current, pe(Ze, t), pe(at, at.current), !0;
}
function ip(t, e, n) {
  var r = t.stateNode;
  if (!r) throw Error(D(169));
  n ? (t = vm(t, e, mr), r.__reactInternalMemoizedMergedChildContext = t, me(at), me(Ze), pe(Ze, t)) : me(at), pe(at, n);
}
var cn = null, zl = !1, Ka = !1;
function xm(t) {
  cn === null ? cn = [t] : cn.push(t);
}
function hx(t) {
  zl = !0, xm(t);
}
function Zn() {
  if (!Ka && cn !== null) {
    Ka = !0;
    var t = 0, e = ue;
    try {
      var n = cn;
      for (ue = 1; t < n.length; t++) {
        var r = n[t];
        do
          r = r(!0);
        while (r !== null);
      }
      cn = null, zl = !1;
    } catch (o) {
      throw cn !== null && (cn = cn.slice(t + 1)), Vh(td, Zn), o;
    } finally {
      ue = e, Ka = !1;
    }
  }
  return null;
}
var Hr = [], Vr = 0, Ys = null, Zs = 0, Ct = [], kt = 0, yr = null, fn = 1, pn = "";
function ir(t, e) {
  Hr[Vr++] = Zs, Hr[Vr++] = Ys, Ys = t, Zs = e;
}
function wm(t, e, n) {
  Ct[kt++] = fn, Ct[kt++] = pn, Ct[kt++] = yr, yr = t;
  var r = fn;
  t = pn;
  var o = 32 - zt(r) - 1;
  r &= ~(1 << o), n += 1;
  var i = 32 - zt(e) + o;
  if (30 < i) {
    var s = o - o % 5;
    i = (r & (1 << s) - 1).toString(32), r >>= s, o -= s, fn = 1 << 32 - zt(e) + o | n << o | r, pn = i + t;
  } else fn = 1 << i | n << o | r, pn = t;
}
function cd(t) {
  t.return !== null && (ir(t, 1), wm(t, 1, 0));
}
function dd(t) {
  for (; t === Ys; ) Ys = Hr[--Vr], Hr[Vr] = null, Zs = Hr[--Vr], Hr[Vr] = null;
  for (; t === yr; ) yr = Ct[--kt], Ct[kt] = null, pn = Ct[--kt], Ct[kt] = null, fn = Ct[--kt], Ct[kt] = null;
}
var _t = null, yt = null, xe = !1, Mt = null;
function Sm(t, e) {
  var n = Et(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = e, n.return = t, e = t.deletions, e === null ? (t.deletions = [n], t.flags |= 16) : e.push(n);
}
function sp(t, e) {
  switch (t.tag) {
    case 5:
      var n = t.type;
      return e = e.nodeType !== 1 || n.toLowerCase() !== e.nodeName.toLowerCase() ? null : e, e !== null ? (t.stateNode = e, _t = t, yt = Mn(e.firstChild), !0) : !1;
    case 6:
      return e = t.pendingProps === "" || e.nodeType !== 3 ? null : e, e !== null ? (t.stateNode = e, _t = t, yt = null, !0) : !1;
    case 13:
      return e = e.nodeType !== 8 ? null : e, e !== null ? (n = yr !== null ? { id: fn, overflow: pn } : null, t.memoizedState = { dehydrated: e, treeContext: n, retryLane: 1073741824 }, n = Et(18, null, null, 0), n.stateNode = e, n.return = t, t.child = n, _t = t, yt = null, !0) : !1;
    default:
      return !1;
  }
}
function Ju(t) {
  return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
}
function Yu(t) {
  if (xe) {
    var e = yt;
    if (e) {
      var n = e;
      if (!sp(t, e)) {
        if (Ju(t)) throw Error(D(418));
        e = Mn(n.nextSibling);
        var r = _t;
        e && sp(t, e) ? Sm(r, n) : (t.flags = t.flags & -4097 | 2, xe = !1, _t = t);
      }
    } else {
      if (Ju(t)) throw Error(D(418));
      t.flags = t.flags & -4097 | 2, xe = !1, _t = t;
    }
  }
}
function lp(t) {
  for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; ) t = t.return;
  _t = t;
}
function ds(t) {
  if (t !== _t) return !1;
  if (!xe) return lp(t), xe = !0, !1;
  var e;
  if ((e = t.tag !== 3) && !(e = t.tag !== 5) && (e = t.type, e = e !== "head" && e !== "body" && !Vu(t.type, t.memoizedProps)), e && (e = yt)) {
    if (Ju(t)) throw Cm(), Error(D(418));
    for (; e; ) Sm(t, e), e = Mn(e.nextSibling);
  }
  if (lp(t), t.tag === 13) {
    if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(D(317));
    e: {
      for (t = t.nextSibling, e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$") {
            if (e === 0) {
              yt = Mn(t.nextSibling);
              break e;
            }
            e--;
          } else n !== "$" && n !== "$!" && n !== "$?" || e++;
        }
        t = t.nextSibling;
      }
      yt = null;
    }
  } else yt = _t ? Mn(t.stateNode.nextSibling) : null;
  return !0;
}
function Cm() {
  for (var t = yt; t; ) t = Mn(t.nextSibling);
}
function so() {
  yt = _t = null, xe = !1;
}
function fd(t) {
  Mt === null ? Mt = [t] : Mt.push(t);
}
var mx = Cn.ReactCurrentBatchConfig;
function Do(t, e, n) {
  if (t = n.ref, t !== null && typeof t != "function" && typeof t != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(D(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(D(147, t));
      var o = r, i = "" + t;
      return e !== null && e.ref !== null && typeof e.ref == "function" && e.ref._stringRef === i ? e.ref : (e = function(s) {
        var l = o.refs;
        s === null ? delete l[i] : l[i] = s;
      }, e._stringRef = i, e);
    }
    if (typeof t != "string") throw Error(D(284));
    if (!n._owner) throw Error(D(290, t));
  }
  return t;
}
function fs(t, e) {
  throw t = Object.prototype.toString.call(e), Error(D(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
}
function ap(t) {
  var e = t._init;
  return e(t._payload);
}
function km(t) {
  function e(_, f) {
    if (t) {
      var g = _.deletions;
      g === null ? (_.deletions = [f], _.flags |= 16) : g.push(f);
    }
  }
  function n(_, f) {
    if (!t) return null;
    for (; f !== null; ) e(_, f), f = f.sibling;
    return null;
  }
  function r(_, f) {
    for (_ = /* @__PURE__ */ new Map(); f !== null; ) f.key !== null ? _.set(f.key, f) : _.set(f.index, f), f = f.sibling;
    return _;
  }
  function o(_, f) {
    return _ = Un(_, f), _.index = 0, _.sibling = null, _;
  }
  function i(_, f, g) {
    return _.index = g, t ? (g = _.alternate, g !== null ? (g = g.index, g < f ? (_.flags |= 2, f) : g) : (_.flags |= 2, f)) : (_.flags |= 1048576, f);
  }
  function s(_) {
    return t && _.alternate === null && (_.flags |= 2), _;
  }
  function l(_, f, g, x) {
    return f === null || f.tag !== 6 ? (f = qa(g, _.mode, x), f.return = _, f) : (f = o(f, g), f.return = _, f);
  }
  function a(_, f, g, x) {
    var w = g.type;
    return w === Mr ? c(_, f, g.props.children, x, g.key) : f !== null && (f.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Tn && ap(w) === f.type) ? (x = o(f, g.props), x.ref = Do(_, f, g), x.return = _, x) : (x = Fs(g.type, g.key, g.props, null, _.mode, x), x.ref = Do(_, f, g), x.return = _, x);
  }
  function u(_, f, g, x) {
    return f === null || f.tag !== 4 || f.stateNode.containerInfo !== g.containerInfo || f.stateNode.implementation !== g.implementation ? (f = eu(g, _.mode, x), f.return = _, f) : (f = o(f, g.children || []), f.return = _, f);
  }
  function c(_, f, g, x, w) {
    return f === null || f.tag !== 7 ? (f = fr(g, _.mode, x, w), f.return = _, f) : (f = o(f, g), f.return = _, f);
  }
  function p(_, f, g) {
    if (typeof f == "string" && f !== "" || typeof f == "number") return f = qa("" + f, _.mode, g), f.return = _, f;
    if (typeof f == "object" && f !== null) {
      switch (f.$$typeof) {
        case ts:
          return g = Fs(f.type, f.key, f.props, null, _.mode, g), g.ref = Do(_, null, f), g.return = _, g;
        case Rr:
          return f = eu(f, _.mode, g), f.return = _, f;
        case Tn:
          var x = f._init;
          return p(_, x(f._payload), g);
      }
      if (Ho(f) || Po(f)) return f = fr(f, _.mode, g, null), f.return = _, f;
      fs(_, f);
    }
    return null;
  }
  function d(_, f, g, x) {
    var w = f !== null ? f.key : null;
    if (typeof g == "string" && g !== "" || typeof g == "number") return w !== null ? null : l(_, f, "" + g, x);
    if (typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case ts:
          return g.key === w ? a(_, f, g, x) : null;
        case Rr:
          return g.key === w ? u(_, f, g, x) : null;
        case Tn:
          return w = g._init, d(
            _,
            f,
            w(g._payload),
            x
          );
      }
      if (Ho(g) || Po(g)) return w !== null ? null : c(_, f, g, x, null);
      fs(_, g);
    }
    return null;
  }
  function m(_, f, g, x, w) {
    if (typeof x == "string" && x !== "" || typeof x == "number") return _ = _.get(g) || null, l(f, _, "" + x, w);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case ts:
          return _ = _.get(x.key === null ? g : x.key) || null, a(f, _, x, w);
        case Rr:
          return _ = _.get(x.key === null ? g : x.key) || null, u(f, _, x, w);
        case Tn:
          var S = x._init;
          return m(_, f, g, S(x._payload), w);
      }
      if (Ho(x) || Po(x)) return _ = _.get(g) || null, c(f, _, x, w, null);
      fs(f, x);
    }
    return null;
  }
  function h(_, f, g, x) {
    for (var w = null, S = null, C = f, k = f = 0, E = null; C !== null && k < g.length; k++) {
      C.index > k ? (E = C, C = null) : E = C.sibling;
      var b = d(_, C, g[k], x);
      if (b === null) {
        C === null && (C = E);
        break;
      }
      t && C && b.alternate === null && e(_, C), f = i(b, f, k), S === null ? w = b : S.sibling = b, S = b, C = E;
    }
    if (k === g.length) return n(_, C), xe && ir(_, k), w;
    if (C === null) {
      for (; k < g.length; k++) C = p(_, g[k], x), C !== null && (f = i(C, f, k), S === null ? w = C : S.sibling = C, S = C);
      return xe && ir(_, k), w;
    }
    for (C = r(_, C); k < g.length; k++) E = m(C, _, k, g[k], x), E !== null && (t && E.alternate !== null && C.delete(E.key === null ? k : E.key), f = i(E, f, k), S === null ? w = E : S.sibling = E, S = E);
    return t && C.forEach(function(R) {
      return e(_, R);
    }), xe && ir(_, k), w;
  }
  function y(_, f, g, x) {
    var w = Po(g);
    if (typeof w != "function") throw Error(D(150));
    if (g = w.call(g), g == null) throw Error(D(151));
    for (var S = w = null, C = f, k = f = 0, E = null, b = g.next(); C !== null && !b.done; k++, b = g.next()) {
      C.index > k ? (E = C, C = null) : E = C.sibling;
      var R = d(_, C, b.value, x);
      if (R === null) {
        C === null && (C = E);
        break;
      }
      t && C && R.alternate === null && e(_, C), f = i(R, f, k), S === null ? w = R : S.sibling = R, S = R, C = E;
    }
    if (b.done) return n(
      _,
      C
    ), xe && ir(_, k), w;
    if (C === null) {
      for (; !b.done; k++, b = g.next()) b = p(_, b.value, x), b !== null && (f = i(b, f, k), S === null ? w = b : S.sibling = b, S = b);
      return xe && ir(_, k), w;
    }
    for (C = r(_, C); !b.done; k++, b = g.next()) b = m(C, _, k, b.value, x), b !== null && (t && b.alternate !== null && C.delete(b.key === null ? k : b.key), f = i(b, f, k), S === null ? w = b : S.sibling = b, S = b);
    return t && C.forEach(function(z) {
      return e(_, z);
    }), xe && ir(_, k), w;
  }
  function v(_, f, g, x) {
    if (typeof g == "object" && g !== null && g.type === Mr && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
      switch (g.$$typeof) {
        case ts:
          e: {
            for (var w = g.key, S = f; S !== null; ) {
              if (S.key === w) {
                if (w = g.type, w === Mr) {
                  if (S.tag === 7) {
                    n(_, S.sibling), f = o(S, g.props.children), f.return = _, _ = f;
                    break e;
                  }
                } else if (S.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Tn && ap(w) === S.type) {
                  n(_, S.sibling), f = o(S, g.props), f.ref = Do(_, S, g), f.return = _, _ = f;
                  break e;
                }
                n(_, S);
                break;
              } else e(_, S);
              S = S.sibling;
            }
            g.type === Mr ? (f = fr(g.props.children, _.mode, x, g.key), f.return = _, _ = f) : (x = Fs(g.type, g.key, g.props, null, _.mode, x), x.ref = Do(_, f, g), x.return = _, _ = x);
          }
          return s(_);
        case Rr:
          e: {
            for (S = g.key; f !== null; ) {
              if (f.key === S) if (f.tag === 4 && f.stateNode.containerInfo === g.containerInfo && f.stateNode.implementation === g.implementation) {
                n(_, f.sibling), f = o(f, g.children || []), f.return = _, _ = f;
                break e;
              } else {
                n(_, f);
                break;
              }
              else e(_, f);
              f = f.sibling;
            }
            f = eu(g, _.mode, x), f.return = _, _ = f;
          }
          return s(_);
        case Tn:
          return S = g._init, v(_, f, S(g._payload), x);
      }
      if (Ho(g)) return h(_, f, g, x);
      if (Po(g)) return y(_, f, g, x);
      fs(_, g);
    }
    return typeof g == "string" && g !== "" || typeof g == "number" ? (g = "" + g, f !== null && f.tag === 6 ? (n(_, f.sibling), f = o(f, g), f.return = _, _ = f) : (n(_, f), f = qa(g, _.mode, x), f.return = _, _ = f), s(_)) : n(_, f);
  }
  return v;
}
var lo = km(!0), Em = km(!1), Xs = Yn(null), qs = null, Kr = null, pd = null;
function gd() {
  pd = Kr = qs = null;
}
function hd(t) {
  var e = Xs.current;
  me(Xs), t._currentValue = e;
}
function Zu(t, e, n) {
  for (; t !== null; ) {
    var r = t.alternate;
    if ((t.childLanes & e) !== e ? (t.childLanes |= e, r !== null && (r.childLanes |= e)) : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e), t === n) break;
    t = t.return;
  }
}
function to(t, e) {
  qs = t, pd = Kr = null, t = t.dependencies, t !== null && t.firstContext !== null && (t.lanes & e && (lt = !0), t.firstContext = null);
}
function Nt(t) {
  var e = t._currentValue;
  if (pd !== t) if (t = { context: t, memoizedValue: e, next: null }, Kr === null) {
    if (qs === null) throw Error(D(308));
    Kr = t, qs.dependencies = { lanes: 0, firstContext: t };
  } else Kr = Kr.next = t;
  return e;
}
var ur = null;
function md(t) {
  ur === null ? ur = [t] : ur.push(t);
}
function Tm(t, e, n, r) {
  var o = e.interleaved;
  return o === null ? (n.next = n, md(e)) : (n.next = o.next, o.next = n), e.interleaved = n, xn(t, r);
}
function xn(t, e) {
  t.lanes |= e;
  var n = t.alternate;
  for (n !== null && (n.lanes |= e), n = t, t = t.return; t !== null; ) t.childLanes |= e, n = t.alternate, n !== null && (n.childLanes |= e), n = t, t = t.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Nn = !1;
function yd(t) {
  t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function Nm(t, e) {
  t = t.updateQueue, e.updateQueue === t && (e.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, effects: t.effects });
}
function mn(t, e) {
  return { eventTime: t, lane: e, tag: 0, payload: null, callback: null, next: null };
}
function zn(t, e, n) {
  var r = t.updateQueue;
  if (r === null) return null;
  if (r = r.shared, oe & 2) {
    var o = r.pending;
    return o === null ? e.next = e : (e.next = o.next, o.next = e), r.pending = e, xn(t, n);
  }
  return o = r.interleaved, o === null ? (e.next = e, md(r)) : (e.next = o.next, o.next = e), r.interleaved = e, xn(t, n);
}
function Ns(t, e, n) {
  if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194240) !== 0)) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, nd(t, n);
  }
}
function up(t, e) {
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
function el(t, e, n, r) {
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
      var d = l.lane, m = l.eventTime;
      if ((r & d) === d) {
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
          switch (d = e, m = n, y.tag) {
            case 1:
              if (h = y.payload, typeof h == "function") {
                p = h.call(m, p, d);
                break e;
              }
              p = h;
              break e;
            case 3:
              h.flags = h.flags & -65537 | 128;
            case 0:
              if (h = y.payload, d = typeof h == "function" ? h.call(m, p, d) : h, d == null) break e;
              p = Ce({}, p, d);
              break e;
            case 2:
              Nn = !0;
          }
        }
        l.callback !== null && l.lane !== 0 && (t.flags |= 64, d = o.effects, d === null ? o.effects = [l] : d.push(l));
      } else m = { eventTime: m, lane: d, tag: l.tag, payload: l.payload, callback: l.callback, next: null }, c === null ? (u = c = m, a = p) : c = c.next = m, s |= d;
      if (l = l.next, l === null) {
        if (l = o.shared.pending, l === null) break;
        d = l, l = d.next, d.next = null, o.lastBaseUpdate = d, o.shared.pending = null;
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
function cp(t, e, n) {
  if (t = e.effects, e.effects = null, t !== null) for (e = 0; e < t.length; e++) {
    var r = t[e], o = r.callback;
    if (o !== null) {
      if (r.callback = null, r = n, typeof o != "function") throw Error(D(191, o));
      o.call(r);
    }
  }
}
var Wi = {}, tn = Yn(Wi), Ei = Yn(Wi), Ti = Yn(Wi);
function cr(t) {
  if (t === Wi) throw Error(D(174));
  return t;
}
function _d(t, e) {
  switch (pe(Ti, e), pe(Ei, t), pe(tn, Wi), t = e.nodeType, t) {
    case 9:
    case 11:
      e = (e = e.documentElement) ? e.namespaceURI : Pu(null, "");
      break;
    default:
      t = t === 8 ? e.parentNode : e, e = t.namespaceURI || null, t = t.tagName, e = Pu(e, t);
  }
  me(tn), pe(tn, e);
}
function ao() {
  me(tn), me(Ei), me(Ti);
}
function bm(t) {
  cr(Ti.current);
  var e = cr(tn.current), n = Pu(e, t.type);
  e !== n && (pe(Ei, t), pe(tn, n));
}
function vd(t) {
  Ei.current === t && (me(tn), me(Ei));
}
var we = Yn(0);
function tl(t) {
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
var Qa = [];
function xd() {
  for (var t = 0; t < Qa.length; t++) Qa[t]._workInProgressVersionPrimary = null;
  Qa.length = 0;
}
var bs = Cn.ReactCurrentDispatcher, Ga = Cn.ReactCurrentBatchConfig, _r = 0, Se = null, Pe = null, Re = null, nl = !1, ii = !1, Ni = 0, yx = 0;
function Qe() {
  throw Error(D(321));
}
function wd(t, e) {
  if (e === null) return !1;
  for (var n = 0; n < e.length && n < t.length; n++) if (!Ut(t[n], e[n])) return !1;
  return !0;
}
function Sd(t, e, n, r, o, i) {
  if (_r = i, Se = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, bs.current = t === null || t.memoizedState === null ? wx : Sx, t = n(r, o), ii) {
    i = 0;
    do {
      if (ii = !1, Ni = 0, 25 <= i) throw Error(D(301));
      i += 1, Re = Pe = null, e.updateQueue = null, bs.current = Cx, t = n(r, o);
    } while (ii);
  }
  if (bs.current = rl, e = Pe !== null && Pe.next !== null, _r = 0, Re = Pe = Se = null, nl = !1, e) throw Error(D(300));
  return t;
}
function Cd() {
  var t = Ni !== 0;
  return Ni = 0, t;
}
function Jt() {
  var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return Re === null ? Se.memoizedState = Re = t : Re = Re.next = t, Re;
}
function bt() {
  if (Pe === null) {
    var t = Se.alternate;
    t = t !== null ? t.memoizedState : null;
  } else t = Pe.next;
  var e = Re === null ? Se.memoizedState : Re.next;
  if (e !== null) Re = e, Pe = t;
  else {
    if (t === null) throw Error(D(310));
    Pe = t, t = { memoizedState: Pe.memoizedState, baseState: Pe.baseState, baseQueue: Pe.baseQueue, queue: Pe.queue, next: null }, Re === null ? Se.memoizedState = Re = t : Re = Re.next = t;
  }
  return Re;
}
function bi(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function Ja(t) {
  var e = bt(), n = e.queue;
  if (n === null) throw Error(D(311));
  n.lastRenderedReducer = t;
  var r = Pe, o = r.baseQueue, i = n.pending;
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
      if ((_r & c) === c) a !== null && (a = a.next = { lane: 0, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }), r = u.hasEagerState ? u.eagerState : t(r, u.action);
      else {
        var p = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null
        };
        a === null ? (l = a = p, s = r) : a = a.next = p, Se.lanes |= c, vr |= c;
      }
      u = u.next;
    } while (u !== null && u !== i);
    a === null ? s = r : a.next = l, Ut(r, e.memoizedState) || (lt = !0), e.memoizedState = r, e.baseState = s, e.baseQueue = a, n.lastRenderedState = r;
  }
  if (t = n.interleaved, t !== null) {
    o = t;
    do
      i = o.lane, Se.lanes |= i, vr |= i, o = o.next;
    while (o !== t);
  } else o === null && (n.lanes = 0);
  return [e.memoizedState, n.dispatch];
}
function Ya(t) {
  var e = bt(), n = e.queue;
  if (n === null) throw Error(D(311));
  n.lastRenderedReducer = t;
  var r = n.dispatch, o = n.pending, i = e.memoizedState;
  if (o !== null) {
    n.pending = null;
    var s = o = o.next;
    do
      i = t(i, s.action), s = s.next;
    while (s !== o);
    Ut(i, e.memoizedState) || (lt = !0), e.memoizedState = i, e.baseQueue === null && (e.baseState = i), n.lastRenderedState = i;
  }
  return [i, r];
}
function Am() {
}
function Om(t, e) {
  var n = Se, r = bt(), o = e(), i = !Ut(r.memoizedState, o);
  if (i && (r.memoizedState = o, lt = !0), r = r.queue, kd(Fm.bind(null, n, r, t), [t]), r.getSnapshot !== e || i || Re !== null && Re.memoizedState.tag & 1) {
    if (n.flags |= 2048, Ai(9, $m.bind(null, n, r, o, e), void 0, null), je === null) throw Error(D(349));
    _r & 30 || Pm(n, e, o);
  }
  return o;
}
function Pm(t, e, n) {
  t.flags |= 16384, t = { getSnapshot: e, value: n }, e = Se.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, Se.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
}
function $m(t, e, n, r) {
  e.value = n, e.getSnapshot = r, Lm(e) && Im(t);
}
function Fm(t, e, n) {
  return n(function() {
    Lm(e) && Im(t);
  });
}
function Lm(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !Ut(t, n);
  } catch {
    return !0;
  }
}
function Im(t) {
  var e = xn(t, 1);
  e !== null && jt(e, t, 1, -1);
}
function dp(t) {
  var e = Jt();
  return typeof t == "function" && (t = t()), e.memoizedState = e.baseState = t, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: bi, lastRenderedState: t }, e.queue = t, t = t.dispatch = xx.bind(null, Se, t), [e.memoizedState, t];
}
function Ai(t, e, n, r) {
  return t = { tag: t, create: e, destroy: n, deps: r, next: null }, e = Se.updateQueue, e === null ? (e = { lastEffect: null, stores: null }, Se.updateQueue = e, e.lastEffect = t.next = t) : (n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (r = n.next, n.next = t, t.next = r, e.lastEffect = t)), t;
}
function Dm() {
  return bt().memoizedState;
}
function As(t, e, n, r) {
  var o = Jt();
  Se.flags |= t, o.memoizedState = Ai(1 | e, n, void 0, r === void 0 ? null : r);
}
function jl(t, e, n, r) {
  var o = bt();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Pe !== null) {
    var s = Pe.memoizedState;
    if (i = s.destroy, r !== null && wd(r, s.deps)) {
      o.memoizedState = Ai(e, n, i, r);
      return;
    }
  }
  Se.flags |= t, o.memoizedState = Ai(1 | e, n, i, r);
}
function fp(t, e) {
  return As(8390656, 8, t, e);
}
function kd(t, e) {
  return jl(2048, 8, t, e);
}
function Rm(t, e) {
  return jl(4, 2, t, e);
}
function Mm(t, e) {
  return jl(4, 4, t, e);
}
function zm(t, e) {
  if (typeof e == "function") return t = t(), e(t), function() {
    e(null);
  };
  if (e != null) return t = t(), e.current = t, function() {
    e.current = null;
  };
}
function jm(t, e, n) {
  return n = n != null ? n.concat([t]) : null, jl(4, 4, zm.bind(null, e, t), n);
}
function Ed() {
}
function Bm(t, e) {
  var n = bt();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && wd(e, r[1]) ? r[0] : (n.memoizedState = [t, e], t);
}
function Um(t, e) {
  var n = bt();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && wd(e, r[1]) ? r[0] : (t = t(), n.memoizedState = [t, e], t);
}
function Wm(t, e, n) {
  return _r & 21 ? (Ut(n, e) || (n = Gh(), Se.lanes |= n, vr |= n, t.baseState = !0), e) : (t.baseState && (t.baseState = !1, lt = !0), t.memoizedState = n);
}
function _x(t, e) {
  var n = ue;
  ue = n !== 0 && 4 > n ? n : 4, t(!0);
  var r = Ga.transition;
  Ga.transition = {};
  try {
    t(!1), e();
  } finally {
    ue = n, Ga.transition = r;
  }
}
function Hm() {
  return bt().memoizedState;
}
function vx(t, e, n) {
  var r = Bn(t);
  if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Vm(t)) Km(e, n);
  else if (n = Tm(t, e, n, r), n !== null) {
    var o = et();
    jt(n, t, r, o), Qm(n, e, r);
  }
}
function xx(t, e, n) {
  var r = Bn(t), o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Vm(t)) Km(e, o);
  else {
    var i = t.alternate;
    if (t.lanes === 0 && (i === null || i.lanes === 0) && (i = e.lastRenderedReducer, i !== null)) try {
      var s = e.lastRenderedState, l = i(s, n);
      if (o.hasEagerState = !0, o.eagerState = l, Ut(l, s)) {
        var a = e.interleaved;
        a === null ? (o.next = o, md(e)) : (o.next = a.next, a.next = o), e.interleaved = o;
        return;
      }
    } catch {
    } finally {
    }
    n = Tm(t, e, o, r), n !== null && (o = et(), jt(n, t, r, o), Qm(n, e, r));
  }
}
function Vm(t) {
  var e = t.alternate;
  return t === Se || e !== null && e === Se;
}
function Km(t, e) {
  ii = nl = !0;
  var n = t.pending;
  n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
}
function Qm(t, e, n) {
  if (n & 4194240) {
    var r = e.lanes;
    r &= t.pendingLanes, n |= r, e.lanes = n, nd(t, n);
  }
}
var rl = { readContext: Nt, useCallback: Qe, useContext: Qe, useEffect: Qe, useImperativeHandle: Qe, useInsertionEffect: Qe, useLayoutEffect: Qe, useMemo: Qe, useReducer: Qe, useRef: Qe, useState: Qe, useDebugValue: Qe, useDeferredValue: Qe, useTransition: Qe, useMutableSource: Qe, useSyncExternalStore: Qe, useId: Qe, unstable_isNewReconciler: !1 }, wx = { readContext: Nt, useCallback: function(t, e) {
  return Jt().memoizedState = [t, e === void 0 ? null : e], t;
}, useContext: Nt, useEffect: fp, useImperativeHandle: function(t, e, n) {
  return n = n != null ? n.concat([t]) : null, As(
    4194308,
    4,
    zm.bind(null, e, t),
    n
  );
}, useLayoutEffect: function(t, e) {
  return As(4194308, 4, t, e);
}, useInsertionEffect: function(t, e) {
  return As(4, 2, t, e);
}, useMemo: function(t, e) {
  var n = Jt();
  return e = e === void 0 ? null : e, t = t(), n.memoizedState = [t, e], t;
}, useReducer: function(t, e, n) {
  var r = Jt();
  return e = n !== void 0 ? n(e) : e, r.memoizedState = r.baseState = e, t = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: e }, r.queue = t, t = t.dispatch = vx.bind(null, Se, t), [r.memoizedState, t];
}, useRef: function(t) {
  var e = Jt();
  return t = { current: t }, e.memoizedState = t;
}, useState: dp, useDebugValue: Ed, useDeferredValue: function(t) {
  return Jt().memoizedState = t;
}, useTransition: function() {
  var t = dp(!1), e = t[0];
  return t = _x.bind(null, t[1]), Jt().memoizedState = t, [e, t];
}, useMutableSource: function() {
}, useSyncExternalStore: function(t, e, n) {
  var r = Se, o = Jt();
  if (xe) {
    if (n === void 0) throw Error(D(407));
    n = n();
  } else {
    if (n = e(), je === null) throw Error(D(349));
    _r & 30 || Pm(r, e, n);
  }
  o.memoizedState = n;
  var i = { value: n, getSnapshot: e };
  return o.queue = i, fp(Fm.bind(
    null,
    r,
    i,
    t
  ), [t]), r.flags |= 2048, Ai(9, $m.bind(null, r, i, n, e), void 0, null), n;
}, useId: function() {
  var t = Jt(), e = je.identifierPrefix;
  if (xe) {
    var n = pn, r = fn;
    n = (r & ~(1 << 32 - zt(r) - 1)).toString(32) + n, e = ":" + e + "R" + n, n = Ni++, 0 < n && (e += "H" + n.toString(32)), e += ":";
  } else n = yx++, e = ":" + e + "r" + n.toString(32) + ":";
  return t.memoizedState = e;
}, unstable_isNewReconciler: !1 }, Sx = {
  readContext: Nt,
  useCallback: Bm,
  useContext: Nt,
  useEffect: kd,
  useImperativeHandle: jm,
  useInsertionEffect: Rm,
  useLayoutEffect: Mm,
  useMemo: Um,
  useReducer: Ja,
  useRef: Dm,
  useState: function() {
    return Ja(bi);
  },
  useDebugValue: Ed,
  useDeferredValue: function(t) {
    var e = bt();
    return Wm(e, Pe.memoizedState, t);
  },
  useTransition: function() {
    var t = Ja(bi)[0], e = bt().memoizedState;
    return [t, e];
  },
  useMutableSource: Am,
  useSyncExternalStore: Om,
  useId: Hm,
  unstable_isNewReconciler: !1
}, Cx = { readContext: Nt, useCallback: Bm, useContext: Nt, useEffect: kd, useImperativeHandle: jm, useInsertionEffect: Rm, useLayoutEffect: Mm, useMemo: Um, useReducer: Ya, useRef: Dm, useState: function() {
  return Ya(bi);
}, useDebugValue: Ed, useDeferredValue: function(t) {
  var e = bt();
  return Pe === null ? e.memoizedState = t : Wm(e, Pe.memoizedState, t);
}, useTransition: function() {
  var t = Ya(bi)[0], e = bt().memoizedState;
  return [t, e];
}, useMutableSource: Am, useSyncExternalStore: Om, useId: Hm, unstable_isNewReconciler: !1 };
function It(t, e) {
  if (t && t.defaultProps) {
    e = Ce({}, e), t = t.defaultProps;
    for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    return e;
  }
  return e;
}
function Xu(t, e, n, r) {
  e = t.memoizedState, n = n(r, e), n = n == null ? e : Ce({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
}
var Bl = { isMounted: function(t) {
  return (t = t._reactInternals) ? Tr(t) === t : !1;
}, enqueueSetState: function(t, e, n) {
  t = t._reactInternals;
  var r = et(), o = Bn(t), i = mn(r, o);
  i.payload = e, n != null && (i.callback = n), e = zn(t, i, o), e !== null && (jt(e, t, o, r), Ns(e, t, o));
}, enqueueReplaceState: function(t, e, n) {
  t = t._reactInternals;
  var r = et(), o = Bn(t), i = mn(r, o);
  i.tag = 1, i.payload = e, n != null && (i.callback = n), e = zn(t, i, o), e !== null && (jt(e, t, o, r), Ns(e, t, o));
}, enqueueForceUpdate: function(t, e) {
  t = t._reactInternals;
  var n = et(), r = Bn(t), o = mn(n, r);
  o.tag = 2, e != null && (o.callback = e), e = zn(t, o, r), e !== null && (jt(e, t, r, n), Ns(e, t, r));
} };
function pp(t, e, n, r, o, i, s) {
  return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(r, i, s) : e.prototype && e.prototype.isPureReactComponent ? !wi(n, r) || !wi(o, i) : !0;
}
function Gm(t, e, n) {
  var r = !1, o = Qn, i = e.contextType;
  return typeof i == "object" && i !== null ? i = Nt(i) : (o = ut(e) ? mr : Ze.current, r = e.contextTypes, i = (r = r != null) ? io(t, o) : Qn), e = new e(n, i), t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null, e.updater = Bl, t.stateNode = e, e._reactInternals = t, r && (t = t.stateNode, t.__reactInternalMemoizedUnmaskedChildContext = o, t.__reactInternalMemoizedMaskedChildContext = i), e;
}
function gp(t, e, n, r) {
  t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, r), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, r), e.state !== t && Bl.enqueueReplaceState(e, e.state, null);
}
function qu(t, e, n, r) {
  var o = t.stateNode;
  o.props = n, o.state = t.memoizedState, o.refs = {}, yd(t);
  var i = e.contextType;
  typeof i == "object" && i !== null ? o.context = Nt(i) : (i = ut(e) ? mr : Ze.current, o.context = io(t, i)), o.state = t.memoizedState, i = e.getDerivedStateFromProps, typeof i == "function" && (Xu(t, e, i, n), o.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (e = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), e !== o.state && Bl.enqueueReplaceState(o, o.state, null), el(t, n, o, r), o.state = t.memoizedState), typeof o.componentDidMount == "function" && (t.flags |= 4194308);
}
function uo(t, e) {
  try {
    var n = "", r = e;
    do
      n += Zv(r), r = r.return;
    while (r);
    var o = n;
  } catch (i) {
    o = `
Error generating stack: ` + i.message + `
` + i.stack;
  }
  return { value: t, source: e, stack: o, digest: null };
}
function Za(t, e, n) {
  return { value: t, source: null, stack: n ?? null, digest: e ?? null };
}
function ec(t, e) {
  try {
    console.error(e.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var kx = typeof WeakMap == "function" ? WeakMap : Map;
function Jm(t, e, n) {
  n = mn(-1, n), n.tag = 3, n.payload = { element: null };
  var r = e.value;
  return n.callback = function() {
    il || (il = !0, cc = r), ec(t, e);
  }, n;
}
function Ym(t, e, n) {
  n = mn(-1, n), n.tag = 3;
  var r = t.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = e.value;
    n.payload = function() {
      return r(o);
    }, n.callback = function() {
      ec(t, e);
    };
  }
  var i = t.stateNode;
  return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
    ec(t, e), typeof r != "function" && (jn === null ? jn = /* @__PURE__ */ new Set([this]) : jn.add(this));
    var s = e.stack;
    this.componentDidCatch(e.value, { componentStack: s !== null ? s : "" });
  }), n;
}
function hp(t, e, n) {
  var r = t.pingCache;
  if (r === null) {
    r = t.pingCache = new kx();
    var o = /* @__PURE__ */ new Set();
    r.set(e, o);
  } else o = r.get(e), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(e, o));
  o.has(n) || (o.add(n), t = Mx.bind(null, t, e, n), e.then(t, t));
}
function mp(t) {
  do {
    var e;
    if ((e = t.tag === 13) && (e = t.memoizedState, e = e !== null ? e.dehydrated !== null : !0), e) return t;
    t = t.return;
  } while (t !== null);
  return null;
}
function yp(t, e, n, r, o) {
  return t.mode & 1 ? (t.flags |= 65536, t.lanes = o, t) : (t === e ? t.flags |= 65536 : (t.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (e = mn(-1, 1), e.tag = 2, zn(n, e, 1))), n.lanes |= 1), t);
}
var Ex = Cn.ReactCurrentOwner, lt = !1;
function Xe(t, e, n, r) {
  e.child = t === null ? Em(e, null, n, r) : lo(e, t.child, n, r);
}
function _p(t, e, n, r, o) {
  n = n.render;
  var i = e.ref;
  return to(e, o), r = Sd(t, e, n, r, i, o), n = Cd(), t !== null && !lt ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~o, wn(t, e, o)) : (xe && n && cd(e), e.flags |= 1, Xe(t, e, r, o), e.child);
}
function vp(t, e, n, r, o) {
  if (t === null) {
    var i = n.type;
    return typeof i == "function" && !Fd(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (e.tag = 15, e.type = i, Zm(t, e, i, r, o)) : (t = Fs(n.type, null, r, e, e.mode, o), t.ref = e.ref, t.return = e, e.child = t);
  }
  if (i = t.child, !(t.lanes & o)) {
    var s = i.memoizedProps;
    if (n = n.compare, n = n !== null ? n : wi, n(s, r) && t.ref === e.ref) return wn(t, e, o);
  }
  return e.flags |= 1, t = Un(i, r), t.ref = e.ref, t.return = e, e.child = t;
}
function Zm(t, e, n, r, o) {
  if (t !== null) {
    var i = t.memoizedProps;
    if (wi(i, r) && t.ref === e.ref) if (lt = !1, e.pendingProps = r = i, (t.lanes & o) !== 0) t.flags & 131072 && (lt = !0);
    else return e.lanes = t.lanes, wn(t, e, o);
  }
  return tc(t, e, n, r, o);
}
function Xm(t, e, n) {
  var r = e.pendingProps, o = r.children, i = t !== null ? t.memoizedState : null;
  if (r.mode === "hidden") if (!(e.mode & 1)) e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, pe(Gr, gt), gt |= n;
  else {
    if (!(n & 1073741824)) return t = i !== null ? i.baseLanes | n : n, e.lanes = e.childLanes = 1073741824, e.memoizedState = { baseLanes: t, cachePool: null, transitions: null }, e.updateQueue = null, pe(Gr, gt), gt |= t, null;
    e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, pe(Gr, gt), gt |= r;
  }
  else i !== null ? (r = i.baseLanes | n, e.memoizedState = null) : r = n, pe(Gr, gt), gt |= r;
  return Xe(t, e, o, n), e.child;
}
function qm(t, e) {
  var n = e.ref;
  (t === null && n !== null || t !== null && t.ref !== n) && (e.flags |= 512, e.flags |= 2097152);
}
function tc(t, e, n, r, o) {
  var i = ut(n) ? mr : Ze.current;
  return i = io(e, i), to(e, o), n = Sd(t, e, n, r, i, o), r = Cd(), t !== null && !lt ? (e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~o, wn(t, e, o)) : (xe && r && cd(e), e.flags |= 1, Xe(t, e, n, o), e.child);
}
function xp(t, e, n, r, o) {
  if (ut(n)) {
    var i = !0;
    Js(e);
  } else i = !1;
  if (to(e, o), e.stateNode === null) Os(t, e), Gm(e, n, r), qu(e, n, r, o), r = !0;
  else if (t === null) {
    var s = e.stateNode, l = e.memoizedProps;
    s.props = l;
    var a = s.context, u = n.contextType;
    typeof u == "object" && u !== null ? u = Nt(u) : (u = ut(n) ? mr : Ze.current, u = io(e, u));
    var c = n.getDerivedStateFromProps, p = typeof c == "function" || typeof s.getSnapshotBeforeUpdate == "function";
    p || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (l !== r || a !== u) && gp(e, s, r, u), Nn = !1;
    var d = e.memoizedState;
    s.state = d, el(e, r, s, o), a = e.memoizedState, l !== r || d !== a || at.current || Nn ? (typeof c == "function" && (Xu(e, n, c, r), a = e.memoizedState), (l = Nn || pp(e, n, l, r, d, a, u)) ? (p || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = r, e.memoizedState = a), s.props = r, s.state = a, s.context = u, r = l) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), r = !1);
  } else {
    s = e.stateNode, Nm(t, e), l = e.memoizedProps, u = e.type === e.elementType ? l : It(e.type, l), s.props = u, p = e.pendingProps, d = s.context, a = n.contextType, typeof a == "object" && a !== null ? a = Nt(a) : (a = ut(n) ? mr : Ze.current, a = io(e, a));
    var m = n.getDerivedStateFromProps;
    (c = typeof m == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (l !== p || d !== a) && gp(e, s, r, a), Nn = !1, d = e.memoizedState, s.state = d, el(e, r, s, o);
    var h = e.memoizedState;
    l !== p || d !== h || at.current || Nn ? (typeof m == "function" && (Xu(e, n, m, r), h = e.memoizedState), (u = Nn || pp(e, n, u, r, d, h, a) || !1) ? (c || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(r, h, a), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(r, h, a)), typeof s.componentDidUpdate == "function" && (e.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || l === t.memoizedProps && d === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && d === t.memoizedState || (e.flags |= 1024), e.memoizedProps = r, e.memoizedState = h), s.props = r, s.state = h, s.context = a, r = u) : (typeof s.componentDidUpdate != "function" || l === t.memoizedProps && d === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || l === t.memoizedProps && d === t.memoizedState || (e.flags |= 1024), r = !1);
  }
  return nc(t, e, n, r, i, o);
}
function nc(t, e, n, r, o, i) {
  qm(t, e);
  var s = (e.flags & 128) !== 0;
  if (!r && !s) return o && ip(e, n, !1), wn(t, e, i);
  r = e.stateNode, Ex.current = e;
  var l = s && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return e.flags |= 1, t !== null && s ? (e.child = lo(e, t.child, null, i), e.child = lo(e, null, l, i)) : Xe(t, e, l, i), e.memoizedState = r.state, o && ip(e, n, !0), e.child;
}
function ey(t) {
  var e = t.stateNode;
  e.pendingContext ? op(t, e.pendingContext, e.pendingContext !== e.context) : e.context && op(t, e.context, !1), _d(t, e.containerInfo);
}
function wp(t, e, n, r, o) {
  return so(), fd(o), e.flags |= 256, Xe(t, e, n, r), e.child;
}
var rc = { dehydrated: null, treeContext: null, retryLane: 0 };
function oc(t) {
  return { baseLanes: t, cachePool: null, transitions: null };
}
function ty(t, e, n) {
  var r = e.pendingProps, o = we.current, i = !1, s = (e.flags & 128) !== 0, l;
  if ((l = s) || (l = t !== null && t.memoizedState === null ? !1 : (o & 2) !== 0), l ? (i = !0, e.flags &= -129) : (t === null || t.memoizedState !== null) && (o |= 1), pe(we, o & 1), t === null)
    return Yu(e), t = e.memoizedState, t !== null && (t = t.dehydrated, t !== null) ? (e.mode & 1 ? t.data === "$!" ? e.lanes = 8 : e.lanes = 1073741824 : e.lanes = 1, null) : (s = r.children, t = r.fallback, i ? (r = e.mode, i = e.child, s = { mode: "hidden", children: s }, !(r & 1) && i !== null ? (i.childLanes = 0, i.pendingProps = s) : i = Hl(s, r, 0, null), t = fr(t, r, n, null), i.return = e, t.return = e, i.sibling = t, e.child = i, e.child.memoizedState = oc(n), e.memoizedState = rc, t) : Td(e, s));
  if (o = t.memoizedState, o !== null && (l = o.dehydrated, l !== null)) return Tx(t, e, s, r, l, o, n);
  if (i) {
    i = r.fallback, s = e.mode, o = t.child, l = o.sibling;
    var a = { mode: "hidden", children: r.children };
    return !(s & 1) && e.child !== o ? (r = e.child, r.childLanes = 0, r.pendingProps = a, e.deletions = null) : (r = Un(o, a), r.subtreeFlags = o.subtreeFlags & 14680064), l !== null ? i = Un(l, i) : (i = fr(i, s, n, null), i.flags |= 2), i.return = e, r.return = e, r.sibling = i, e.child = r, r = i, i = e.child, s = t.child.memoizedState, s = s === null ? oc(n) : { baseLanes: s.baseLanes | n, cachePool: null, transitions: s.transitions }, i.memoizedState = s, i.childLanes = t.childLanes & ~n, e.memoizedState = rc, r;
  }
  return i = t.child, t = i.sibling, r = Un(i, { mode: "visible", children: r.children }), !(e.mode & 1) && (r.lanes = n), r.return = e, r.sibling = null, t !== null && (n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t)), e.child = r, e.memoizedState = null, r;
}
function Td(t, e) {
  return e = Hl({ mode: "visible", children: e }, t.mode, 0, null), e.return = t, t.child = e;
}
function ps(t, e, n, r) {
  return r !== null && fd(r), lo(e, t.child, null, n), t = Td(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t;
}
function Tx(t, e, n, r, o, i, s) {
  if (n)
    return e.flags & 256 ? (e.flags &= -257, r = Za(Error(D(422))), ps(t, e, s, r)) : e.memoizedState !== null ? (e.child = t.child, e.flags |= 128, null) : (i = r.fallback, o = e.mode, r = Hl({ mode: "visible", children: r.children }, o, 0, null), i = fr(i, o, s, null), i.flags |= 2, r.return = e, i.return = e, r.sibling = i, e.child = r, e.mode & 1 && lo(e, t.child, null, s), e.child.memoizedState = oc(s), e.memoizedState = rc, i);
  if (!(e.mode & 1)) return ps(t, e, s, null);
  if (o.data === "$!") {
    if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
    return r = l, i = Error(D(419)), r = Za(i, r, void 0), ps(t, e, s, r);
  }
  if (l = (s & t.childLanes) !== 0, lt || l) {
    if (r = je, r !== null) {
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
      o = o & (r.suspendedLanes | s) ? 0 : o, o !== 0 && o !== i.retryLane && (i.retryLane = o, xn(t, o), jt(r, t, o, -1));
    }
    return $d(), r = Za(Error(D(421))), ps(t, e, s, r);
  }
  return o.data === "$?" ? (e.flags |= 128, e.child = t.child, e = zx.bind(null, t), o._reactRetry = e, null) : (t = i.treeContext, yt = Mn(o.nextSibling), _t = e, xe = !0, Mt = null, t !== null && (Ct[kt++] = fn, Ct[kt++] = pn, Ct[kt++] = yr, fn = t.id, pn = t.overflow, yr = e), e = Td(e, r.children), e.flags |= 4096, e);
}
function Sp(t, e, n) {
  t.lanes |= e;
  var r = t.alternate;
  r !== null && (r.lanes |= e), Zu(t.return, e, n);
}
function Xa(t, e, n, r, o) {
  var i = t.memoizedState;
  i === null ? t.memoizedState = { isBackwards: e, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o } : (i.isBackwards = e, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = o);
}
function ny(t, e, n) {
  var r = e.pendingProps, o = r.revealOrder, i = r.tail;
  if (Xe(t, e, r.children, n), r = we.current, r & 2) r = r & 1 | 2, e.flags |= 128;
  else {
    if (t !== null && t.flags & 128) e: for (t = e.child; t !== null; ) {
      if (t.tag === 13) t.memoizedState !== null && Sp(t, n, e);
      else if (t.tag === 19) Sp(t, n, e);
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
  if (pe(we, r), !(e.mode & 1)) e.memoizedState = null;
  else switch (o) {
    case "forwards":
      for (n = e.child, o = null; n !== null; ) t = n.alternate, t !== null && tl(t) === null && (o = n), n = n.sibling;
      n = o, n === null ? (o = e.child, e.child = null) : (o = n.sibling, n.sibling = null), Xa(e, !1, o, n, i);
      break;
    case "backwards":
      for (n = null, o = e.child, e.child = null; o !== null; ) {
        if (t = o.alternate, t !== null && tl(t) === null) {
          e.child = o;
          break;
        }
        t = o.sibling, o.sibling = n, n = o, o = t;
      }
      Xa(e, !0, n, null, i);
      break;
    case "together":
      Xa(e, !1, null, null, void 0);
      break;
    default:
      e.memoizedState = null;
  }
  return e.child;
}
function Os(t, e) {
  !(e.mode & 1) && t !== null && (t.alternate = null, e.alternate = null, e.flags |= 2);
}
function wn(t, e, n) {
  if (t !== null && (e.dependencies = t.dependencies), vr |= e.lanes, !(n & e.childLanes)) return null;
  if (t !== null && e.child !== t.child) throw Error(D(153));
  if (e.child !== null) {
    for (t = e.child, n = Un(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; ) t = t.sibling, n = n.sibling = Un(t, t.pendingProps), n.return = e;
    n.sibling = null;
  }
  return e.child;
}
function Nx(t, e, n) {
  switch (e.tag) {
    case 3:
      ey(e), so();
      break;
    case 5:
      bm(e);
      break;
    case 1:
      ut(e.type) && Js(e);
      break;
    case 4:
      _d(e, e.stateNode.containerInfo);
      break;
    case 10:
      var r = e.type._context, o = e.memoizedProps.value;
      pe(Xs, r._currentValue), r._currentValue = o;
      break;
    case 13:
      if (r = e.memoizedState, r !== null)
        return r.dehydrated !== null ? (pe(we, we.current & 1), e.flags |= 128, null) : n & e.child.childLanes ? ty(t, e, n) : (pe(we, we.current & 1), t = wn(t, e, n), t !== null ? t.sibling : null);
      pe(we, we.current & 1);
      break;
    case 19:
      if (r = (n & e.childLanes) !== 0, t.flags & 128) {
        if (r) return ny(t, e, n);
        e.flags |= 128;
      }
      if (o = e.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), pe(we, we.current), r) break;
      return null;
    case 22:
    case 23:
      return e.lanes = 0, Xm(t, e, n);
  }
  return wn(t, e, n);
}
var ry, ic, oy, iy;
ry = function(t, e) {
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
ic = function() {
};
oy = function(t, e, n, r) {
  var o = t.memoizedProps;
  if (o !== r) {
    t = e.stateNode, cr(tn.current);
    var i = null;
    switch (n) {
      case "input":
        o = Nu(t, o), r = Nu(t, r), i = [];
        break;
      case "select":
        o = Ce({}, o, { value: void 0 }), r = Ce({}, r, { value: void 0 }), i = [];
        break;
      case "textarea":
        o = Ou(t, o), r = Ou(t, r), i = [];
        break;
      default:
        typeof o.onClick != "function" && typeof r.onClick == "function" && (t.onclick = Qs);
    }
    $u(n, r);
    var s;
    n = null;
    for (u in o) if (!r.hasOwnProperty(u) && o.hasOwnProperty(u) && o[u] != null) if (u === "style") {
      var l = o[u];
      for (s in l) l.hasOwnProperty(s) && (n || (n = {}), n[s] = "");
    } else u !== "dangerouslySetInnerHTML" && u !== "children" && u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (gi.hasOwnProperty(u) ? i || (i = []) : (i = i || []).push(u, null));
    for (u in r) {
      var a = r[u];
      if (l = o != null ? o[u] : void 0, r.hasOwnProperty(u) && a !== l && (a != null || l != null)) if (u === "style") if (l) {
        for (s in l) !l.hasOwnProperty(s) || a && a.hasOwnProperty(s) || (n || (n = {}), n[s] = "");
        for (s in a) a.hasOwnProperty(s) && l[s] !== a[s] && (n || (n = {}), n[s] = a[s]);
      } else n || (i || (i = []), i.push(
        u,
        n
      )), n = a;
      else u === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, l = l ? l.__html : void 0, a != null && l !== a && (i = i || []).push(u, a)) : u === "children" ? typeof a != "string" && typeof a != "number" || (i = i || []).push(u, "" + a) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && (gi.hasOwnProperty(u) ? (a != null && u === "onScroll" && he("scroll", t), i || l === a || (i = [])) : (i = i || []).push(u, a));
    }
    n && (i = i || []).push("style", n);
    var u = i;
    (e.updateQueue = u) && (e.flags |= 4);
  }
};
iy = function(t, e, n, r) {
  n !== r && (e.flags |= 4);
};
function Ro(t, e) {
  if (!xe) switch (t.tailMode) {
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
function Ge(t) {
  var e = t.alternate !== null && t.alternate.child === t.child, n = 0, r = 0;
  if (e) for (var o = t.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags & 14680064, r |= o.flags & 14680064, o.return = t, o = o.sibling;
  else for (o = t.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = t, o = o.sibling;
  return t.subtreeFlags |= r, t.childLanes = n, e;
}
function bx(t, e, n) {
  var r = e.pendingProps;
  switch (dd(e), e.tag) {
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
      return Ge(e), null;
    case 1:
      return ut(e.type) && Gs(), Ge(e), null;
    case 3:
      return r = e.stateNode, ao(), me(at), me(Ze), xd(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (t === null || t.child === null) && (ds(e) ? e.flags |= 4 : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, Mt !== null && (pc(Mt), Mt = null))), ic(t, e), Ge(e), null;
    case 5:
      vd(e);
      var o = cr(Ti.current);
      if (n = e.type, t !== null && e.stateNode != null) oy(t, e, n, r, o), t.ref !== e.ref && (e.flags |= 512, e.flags |= 2097152);
      else {
        if (!r) {
          if (e.stateNode === null) throw Error(D(166));
          return Ge(e), null;
        }
        if (t = cr(tn.current), ds(e)) {
          r = e.stateNode, n = e.type;
          var i = e.memoizedProps;
          switch (r[Yt] = e, r[ki] = i, t = (e.mode & 1) !== 0, n) {
            case "dialog":
              he("cancel", r), he("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              he("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < Ko.length; o++) he(Ko[o], r);
              break;
            case "source":
              he("error", r);
              break;
            case "img":
            case "image":
            case "link":
              he(
                "error",
                r
              ), he("load", r);
              break;
            case "details":
              he("toggle", r);
              break;
            case "input":
              Pf(r, i), he("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!i.multiple }, he("invalid", r);
              break;
            case "textarea":
              Ff(r, i), he("invalid", r);
          }
          $u(n, i), o = null;
          for (var s in i) if (i.hasOwnProperty(s)) {
            var l = i[s];
            s === "children" ? typeof l == "string" ? r.textContent !== l && (i.suppressHydrationWarning !== !0 && cs(r.textContent, l, t), o = ["children", l]) : typeof l == "number" && r.textContent !== "" + l && (i.suppressHydrationWarning !== !0 && cs(
              r.textContent,
              l,
              t
            ), o = ["children", "" + l]) : gi.hasOwnProperty(s) && l != null && s === "onScroll" && he("scroll", r);
          }
          switch (n) {
            case "input":
              ns(r), $f(r, i, !0);
              break;
            case "textarea":
              ns(r), Lf(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Qs);
          }
          r = o, e.updateQueue = r, r !== null && (e.flags |= 4);
        } else {
          s = o.nodeType === 9 ? o : o.ownerDocument, t === "http://www.w3.org/1999/xhtml" && (t = Fh(n)), t === "http://www.w3.org/1999/xhtml" ? n === "script" ? (t = s.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild)) : typeof r.is == "string" ? t = s.createElement(n, { is: r.is }) : (t = s.createElement(n), n === "select" && (s = t, r.multiple ? s.multiple = !0 : r.size && (s.size = r.size))) : t = s.createElementNS(t, n), t[Yt] = e, t[ki] = r, ry(t, e, !1, !1), e.stateNode = t;
          e: {
            switch (s = Fu(n, r), n) {
              case "dialog":
                he("cancel", t), he("close", t), o = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                he("load", t), o = r;
                break;
              case "video":
              case "audio":
                for (o = 0; o < Ko.length; o++) he(Ko[o], t);
                o = r;
                break;
              case "source":
                he("error", t), o = r;
                break;
              case "img":
              case "image":
              case "link":
                he(
                  "error",
                  t
                ), he("load", t), o = r;
                break;
              case "details":
                he("toggle", t), o = r;
                break;
              case "input":
                Pf(t, r), o = Nu(t, r), he("invalid", t);
                break;
              case "option":
                o = r;
                break;
              case "select":
                t._wrapperState = { wasMultiple: !!r.multiple }, o = Ce({}, r, { value: void 0 }), he("invalid", t);
                break;
              case "textarea":
                Ff(t, r), o = Ou(t, r), he("invalid", t);
                break;
              default:
                o = r;
            }
            $u(n, o), l = o;
            for (i in l) if (l.hasOwnProperty(i)) {
              var a = l[i];
              i === "style" ? Dh(t, a) : i === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && Lh(t, a)) : i === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && hi(t, a) : typeof a == "number" && hi(t, "" + a) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (gi.hasOwnProperty(i) ? a != null && i === "onScroll" && he("scroll", t) : a != null && Yc(t, i, a, s));
            }
            switch (n) {
              case "input":
                ns(t), $f(t, r, !1);
                break;
              case "textarea":
                ns(t), Lf(t);
                break;
              case "option":
                r.value != null && t.setAttribute("value", "" + Kn(r.value));
                break;
              case "select":
                t.multiple = !!r.multiple, i = r.value, i != null ? Zr(t, !!r.multiple, i, !1) : r.defaultValue != null && Zr(
                  t,
                  !!r.multiple,
                  r.defaultValue,
                  !0
                );
                break;
              default:
                typeof o.onClick == "function" && (t.onclick = Qs);
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
      return Ge(e), null;
    case 6:
      if (t && e.stateNode != null) iy(t, e, t.memoizedProps, r);
      else {
        if (typeof r != "string" && e.stateNode === null) throw Error(D(166));
        if (n = cr(Ti.current), cr(tn.current), ds(e)) {
          if (r = e.stateNode, n = e.memoizedProps, r[Yt] = e, (i = r.nodeValue !== n) && (t = _t, t !== null)) switch (t.tag) {
            case 3:
              cs(r.nodeValue, n, (t.mode & 1) !== 0);
              break;
            case 5:
              t.memoizedProps.suppressHydrationWarning !== !0 && cs(r.nodeValue, n, (t.mode & 1) !== 0);
          }
          i && (e.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Yt] = e, e.stateNode = r;
      }
      return Ge(e), null;
    case 13:
      if (me(we), r = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
        if (xe && yt !== null && e.mode & 1 && !(e.flags & 128)) Cm(), so(), e.flags |= 98560, i = !1;
        else if (i = ds(e), r !== null && r.dehydrated !== null) {
          if (t === null) {
            if (!i) throw Error(D(318));
            if (i = e.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(D(317));
            i[Yt] = e;
          } else so(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
          Ge(e), i = !1;
        } else Mt !== null && (pc(Mt), Mt = null), i = !0;
        if (!i) return e.flags & 65536 ? e : null;
      }
      return e.flags & 128 ? (e.lanes = n, e) : (r = r !== null, r !== (t !== null && t.memoizedState !== null) && r && (e.child.flags |= 8192, e.mode & 1 && (t === null || we.current & 1 ? Le === 0 && (Le = 3) : $d())), e.updateQueue !== null && (e.flags |= 4), Ge(e), null);
    case 4:
      return ao(), ic(t, e), t === null && Si(e.stateNode.containerInfo), Ge(e), null;
    case 10:
      return hd(e.type._context), Ge(e), null;
    case 17:
      return ut(e.type) && Gs(), Ge(e), null;
    case 19:
      if (me(we), i = e.memoizedState, i === null) return Ge(e), null;
      if (r = (e.flags & 128) !== 0, s = i.rendering, s === null) if (r) Ro(i, !1);
      else {
        if (Le !== 0 || t !== null && t.flags & 128) for (t = e.child; t !== null; ) {
          if (s = tl(t), s !== null) {
            for (e.flags |= 128, Ro(i, !1), r = s.updateQueue, r !== null && (e.updateQueue = r, e.flags |= 4), e.subtreeFlags = 0, r = n, n = e.child; n !== null; ) i = n, t = r, i.flags &= 14680066, s = i.alternate, s === null ? (i.childLanes = 0, i.lanes = t, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = s.childLanes, i.lanes = s.lanes, i.child = s.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = s.memoizedProps, i.memoizedState = s.memoizedState, i.updateQueue = s.updateQueue, i.type = s.type, t = s.dependencies, i.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }), n = n.sibling;
            return pe(we, we.current & 1 | 2), e.child;
          }
          t = t.sibling;
        }
        i.tail !== null && be() > co && (e.flags |= 128, r = !0, Ro(i, !1), e.lanes = 4194304);
      }
      else {
        if (!r) if (t = tl(s), t !== null) {
          if (e.flags |= 128, r = !0, n = t.updateQueue, n !== null && (e.updateQueue = n, e.flags |= 4), Ro(i, !0), i.tail === null && i.tailMode === "hidden" && !s.alternate && !xe) return Ge(e), null;
        } else 2 * be() - i.renderingStartTime > co && n !== 1073741824 && (e.flags |= 128, r = !0, Ro(i, !1), e.lanes = 4194304);
        i.isBackwards ? (s.sibling = e.child, e.child = s) : (n = i.last, n !== null ? n.sibling = s : e.child = s, i.last = s);
      }
      return i.tail !== null ? (e = i.tail, i.rendering = e, i.tail = e.sibling, i.renderingStartTime = be(), e.sibling = null, n = we.current, pe(we, r ? n & 1 | 2 : n & 1), e) : (Ge(e), null);
    case 22:
    case 23:
      return Pd(), r = e.memoizedState !== null, t !== null && t.memoizedState !== null !== r && (e.flags |= 8192), r && e.mode & 1 ? gt & 1073741824 && (Ge(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Ge(e), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(D(156, e.tag));
}
function Ax(t, e) {
  switch (dd(e), e.tag) {
    case 1:
      return ut(e.type) && Gs(), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 3:
      return ao(), me(at), me(Ze), xd(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
    case 5:
      return vd(e), null;
    case 13:
      if (me(we), t = e.memoizedState, t !== null && t.dehydrated !== null) {
        if (e.alternate === null) throw Error(D(340));
        so();
      }
      return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
    case 19:
      return me(we), null;
    case 4:
      return ao(), null;
    case 10:
      return hd(e.type._context), null;
    case 22:
    case 23:
      return Pd(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var gs = !1, Je = !1, Ox = typeof WeakSet == "function" ? WeakSet : Set, H = null;
function Qr(t, e) {
  var n = t.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    ke(t, e, r);
  }
  else n.current = null;
}
function sc(t, e, n) {
  try {
    n();
  } catch (r) {
    ke(t, e, r);
  }
}
var Cp = !1;
function Px(t, e) {
  if (Wu = Hs, t = cm(), ud(t)) {
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
        var s = 0, l = -1, a = -1, u = 0, c = 0, p = t, d = null;
        t: for (; ; ) {
          for (var m; p !== n || o !== 0 && p.nodeType !== 3 || (l = s + o), p !== i || r !== 0 && p.nodeType !== 3 || (a = s + r), p.nodeType === 3 && (s += p.nodeValue.length), (m = p.firstChild) !== null; )
            d = p, p = m;
          for (; ; ) {
            if (p === t) break t;
            if (d === n && ++u === o && (l = s), d === i && ++c === r && (a = s), (m = p.nextSibling) !== null) break;
            p = d, d = p.parentNode;
          }
          p = m;
        }
        n = l === -1 || a === -1 ? null : { start: l, end: a };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Hu = { focusedElem: t, selectionRange: n }, Hs = !1, H = e; H !== null; ) if (e = H, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, H = t;
  else for (; H !== null; ) {
    e = H;
    try {
      var h = e.alternate;
      if (e.flags & 1024) switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (h !== null) {
            var y = h.memoizedProps, v = h.memoizedState, _ = e.stateNode, f = _.getSnapshotBeforeUpdate(e.elementType === e.type ? y : It(e.type, y), v);
            _.__reactInternalSnapshotBeforeUpdate = f;
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
          throw Error(D(163));
      }
    } catch (x) {
      ke(e, e.return, x);
    }
    if (t = e.sibling, t !== null) {
      t.return = e.return, H = t;
      break;
    }
    H = e.return;
  }
  return h = Cp, Cp = !1, h;
}
function si(t, e, n) {
  var r = e.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var o = r = r.next;
    do {
      if ((o.tag & t) === t) {
        var i = o.destroy;
        o.destroy = void 0, i !== void 0 && sc(e, n, i);
      }
      o = o.next;
    } while (o !== r);
  }
}
function Ul(t, e) {
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
function lc(t) {
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
function sy(t) {
  var e = t.alternate;
  e !== null && (t.alternate = null, sy(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && (delete e[Yt], delete e[ki], delete e[Qu], delete e[px], delete e[gx])), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
}
function ly(t) {
  return t.tag === 5 || t.tag === 3 || t.tag === 4;
}
function kp(t) {
  e: for (; ; ) {
    for (; t.sibling === null; ) {
      if (t.return === null || ly(t.return)) return null;
      t = t.return;
    }
    for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
      if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
      t.child.return = t, t = t.child;
    }
    if (!(t.flags & 2)) return t.stateNode;
  }
}
function ac(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.nodeType === 8 ? n.parentNode.insertBefore(t, e) : n.insertBefore(t, e) : (n.nodeType === 8 ? (e = n.parentNode, e.insertBefore(t, n)) : (e = n, e.appendChild(t)), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = Qs));
  else if (r !== 4 && (t = t.child, t !== null)) for (ac(t, e, n), t = t.sibling; t !== null; ) ac(t, e, n), t = t.sibling;
}
function uc(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
  else if (r !== 4 && (t = t.child, t !== null)) for (uc(t, e, n), t = t.sibling; t !== null; ) uc(t, e, n), t = t.sibling;
}
var Ue = null, Rt = !1;
function kn(t, e, n) {
  for (n = n.child; n !== null; ) ay(t, e, n), n = n.sibling;
}
function ay(t, e, n) {
  if (en && typeof en.onCommitFiberUnmount == "function") try {
    en.onCommitFiberUnmount(Ll, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      Je || Qr(n, e);
    case 6:
      var r = Ue, o = Rt;
      Ue = null, kn(t, e, n), Ue = r, Rt = o, Ue !== null && (Rt ? (t = Ue, n = n.stateNode, t.nodeType === 8 ? t.parentNode.removeChild(n) : t.removeChild(n)) : Ue.removeChild(n.stateNode));
      break;
    case 18:
      Ue !== null && (Rt ? (t = Ue, n = n.stateNode, t.nodeType === 8 ? Va(t.parentNode, n) : t.nodeType === 1 && Va(t, n), vi(t)) : Va(Ue, n.stateNode));
      break;
    case 4:
      r = Ue, o = Rt, Ue = n.stateNode.containerInfo, Rt = !0, kn(t, e, n), Ue = r, Rt = o;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Je && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        o = r = r.next;
        do {
          var i = o, s = i.destroy;
          i = i.tag, s !== void 0 && (i & 2 || i & 4) && sc(n, e, s), o = o.next;
        } while (o !== r);
      }
      kn(t, e, n);
      break;
    case 1:
      if (!Je && (Qr(n, e), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (l) {
        ke(n, e, l);
      }
      kn(t, e, n);
      break;
    case 21:
      kn(t, e, n);
      break;
    case 22:
      n.mode & 1 ? (Je = (r = Je) || n.memoizedState !== null, kn(t, e, n), Je = r) : kn(t, e, n);
      break;
    default:
      kn(t, e, n);
  }
}
function Ep(t) {
  var e = t.updateQueue;
  if (e !== null) {
    t.updateQueue = null;
    var n = t.stateNode;
    n === null && (n = t.stateNode = new Ox()), e.forEach(function(r) {
      var o = jx.bind(null, t, r);
      n.has(r) || (n.add(r), r.then(o, o));
    });
  }
}
function $t(t, e) {
  var n = e.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var o = n[r];
    try {
      var i = t, s = e, l = s;
      e: for (; l !== null; ) {
        switch (l.tag) {
          case 5:
            Ue = l.stateNode, Rt = !1;
            break e;
          case 3:
            Ue = l.stateNode.containerInfo, Rt = !0;
            break e;
          case 4:
            Ue = l.stateNode.containerInfo, Rt = !0;
            break e;
        }
        l = l.return;
      }
      if (Ue === null) throw Error(D(160));
      ay(i, s, o), Ue = null, Rt = !1;
      var a = o.alternate;
      a !== null && (a.return = null), o.return = null;
    } catch (u) {
      ke(o, e, u);
    }
  }
  if (e.subtreeFlags & 12854) for (e = e.child; e !== null; ) uy(e, t), e = e.sibling;
}
function uy(t, e) {
  var n = t.alternate, r = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ($t(e, t), Gt(t), r & 4) {
        try {
          si(3, t, t.return), Ul(3, t);
        } catch (y) {
          ke(t, t.return, y);
        }
        try {
          si(5, t, t.return);
        } catch (y) {
          ke(t, t.return, y);
        }
      }
      break;
    case 1:
      $t(e, t), Gt(t), r & 512 && n !== null && Qr(n, n.return);
      break;
    case 5:
      if ($t(e, t), Gt(t), r & 512 && n !== null && Qr(n, n.return), t.flags & 32) {
        var o = t.stateNode;
        try {
          hi(o, "");
        } catch (y) {
          ke(t, t.return, y);
        }
      }
      if (r & 4 && (o = t.stateNode, o != null)) {
        var i = t.memoizedProps, s = n !== null ? n.memoizedProps : i, l = t.type, a = t.updateQueue;
        if (t.updateQueue = null, a !== null) try {
          l === "input" && i.type === "radio" && i.name != null && Ph(o, i), Fu(l, s);
          var u = Fu(l, i);
          for (s = 0; s < a.length; s += 2) {
            var c = a[s], p = a[s + 1];
            c === "style" ? Dh(o, p) : c === "dangerouslySetInnerHTML" ? Lh(o, p) : c === "children" ? hi(o, p) : Yc(o, c, p, u);
          }
          switch (l) {
            case "input":
              bu(o, i);
              break;
            case "textarea":
              $h(o, i);
              break;
            case "select":
              var d = o._wrapperState.wasMultiple;
              o._wrapperState.wasMultiple = !!i.multiple;
              var m = i.value;
              m != null ? Zr(o, !!i.multiple, m, !1) : d !== !!i.multiple && (i.defaultValue != null ? Zr(
                o,
                !!i.multiple,
                i.defaultValue,
                !0
              ) : Zr(o, !!i.multiple, i.multiple ? [] : "", !1));
          }
          o[ki] = i;
        } catch (y) {
          ke(t, t.return, y);
        }
      }
      break;
    case 6:
      if ($t(e, t), Gt(t), r & 4) {
        if (t.stateNode === null) throw Error(D(162));
        o = t.stateNode, i = t.memoizedProps;
        try {
          o.nodeValue = i;
        } catch (y) {
          ke(t, t.return, y);
        }
      }
      break;
    case 3:
      if ($t(e, t), Gt(t), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        vi(e.containerInfo);
      } catch (y) {
        ke(t, t.return, y);
      }
      break;
    case 4:
      $t(e, t), Gt(t);
      break;
    case 13:
      $t(e, t), Gt(t), o = t.child, o.flags & 8192 && (i = o.memoizedState !== null, o.stateNode.isHidden = i, !i || o.alternate !== null && o.alternate.memoizedState !== null || (Ad = be())), r & 4 && Ep(t);
      break;
    case 22:
      if (c = n !== null && n.memoizedState !== null, t.mode & 1 ? (Je = (u = Je) || c, $t(e, t), Je = u) : $t(e, t), Gt(t), r & 8192) {
        if (u = t.memoizedState !== null, (t.stateNode.isHidden = u) && !c && t.mode & 1) for (H = t, c = t.child; c !== null; ) {
          for (p = H = c; H !== null; ) {
            switch (d = H, m = d.child, d.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                si(4, d, d.return);
                break;
              case 1:
                Qr(d, d.return);
                var h = d.stateNode;
                if (typeof h.componentWillUnmount == "function") {
                  r = d, n = d.return;
                  try {
                    e = r, h.props = e.memoizedProps, h.state = e.memoizedState, h.componentWillUnmount();
                  } catch (y) {
                    ke(r, n, y);
                  }
                }
                break;
              case 5:
                Qr(d, d.return);
                break;
              case 22:
                if (d.memoizedState !== null) {
                  Np(p);
                  continue;
                }
            }
            m !== null ? (m.return = d, H = m) : Np(p);
          }
          c = c.sibling;
        }
        e: for (c = null, p = t; ; ) {
          if (p.tag === 5) {
            if (c === null) {
              c = p;
              try {
                o = p.stateNode, u ? (i = o.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (l = p.stateNode, a = p.memoizedProps.style, s = a != null && a.hasOwnProperty("display") ? a.display : null, l.style.display = Ih("display", s));
              } catch (y) {
                ke(t, t.return, y);
              }
            }
          } else if (p.tag === 6) {
            if (c === null) try {
              p.stateNode.nodeValue = u ? "" : p.memoizedProps;
            } catch (y) {
              ke(t, t.return, y);
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
      $t(e, t), Gt(t), r & 4 && Ep(t);
      break;
    case 21:
      break;
    default:
      $t(
        e,
        t
      ), Gt(t);
  }
}
function Gt(t) {
  var e = t.flags;
  if (e & 2) {
    try {
      e: {
        for (var n = t.return; n !== null; ) {
          if (ly(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(D(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (hi(o, ""), r.flags &= -33);
          var i = kp(t);
          uc(t, i, o);
          break;
        case 3:
        case 4:
          var s = r.stateNode.containerInfo, l = kp(t);
          ac(t, l, s);
          break;
        default:
          throw Error(D(161));
      }
    } catch (a) {
      ke(t, t.return, a);
    }
    t.flags &= -3;
  }
  e & 4096 && (t.flags &= -4097);
}
function $x(t, e, n) {
  H = t, cy(t);
}
function cy(t, e, n) {
  for (var r = (t.mode & 1) !== 0; H !== null; ) {
    var o = H, i = o.child;
    if (o.tag === 22 && r) {
      var s = o.memoizedState !== null || gs;
      if (!s) {
        var l = o.alternate, a = l !== null && l.memoizedState !== null || Je;
        l = gs;
        var u = Je;
        if (gs = s, (Je = a) && !u) for (H = o; H !== null; ) s = H, a = s.child, s.tag === 22 && s.memoizedState !== null ? bp(o) : a !== null ? (a.return = s, H = a) : bp(o);
        for (; i !== null; ) H = i, cy(i), i = i.sibling;
        H = o, gs = l, Je = u;
      }
      Tp(t);
    } else o.subtreeFlags & 8772 && i !== null ? (i.return = o, H = i) : Tp(t);
  }
}
function Tp(t) {
  for (; H !== null; ) {
    var e = H;
    if (e.flags & 8772) {
      var n = e.alternate;
      try {
        if (e.flags & 8772) switch (e.tag) {
          case 0:
          case 11:
          case 15:
            Je || Ul(5, e);
            break;
          case 1:
            var r = e.stateNode;
            if (e.flags & 4 && !Je) if (n === null) r.componentDidMount();
            else {
              var o = e.elementType === e.type ? n.memoizedProps : It(e.type, n.memoizedProps);
              r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var i = e.updateQueue;
            i !== null && cp(e, i, r);
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
              cp(e, s, n);
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
                  p !== null && vi(p);
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
            throw Error(D(163));
        }
        Je || e.flags & 512 && lc(e);
      } catch (d) {
        ke(e, e.return, d);
      }
    }
    if (e === t) {
      H = null;
      break;
    }
    if (n = e.sibling, n !== null) {
      n.return = e.return, H = n;
      break;
    }
    H = e.return;
  }
}
function Np(t) {
  for (; H !== null; ) {
    var e = H;
    if (e === t) {
      H = null;
      break;
    }
    var n = e.sibling;
    if (n !== null) {
      n.return = e.return, H = n;
      break;
    }
    H = e.return;
  }
}
function bp(t) {
  for (; H !== null; ) {
    var e = H;
    try {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          var n = e.return;
          try {
            Ul(4, e);
          } catch (a) {
            ke(e, n, a);
          }
          break;
        case 1:
          var r = e.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = e.return;
            try {
              r.componentDidMount();
            } catch (a) {
              ke(e, o, a);
            }
          }
          var i = e.return;
          try {
            lc(e);
          } catch (a) {
            ke(e, i, a);
          }
          break;
        case 5:
          var s = e.return;
          try {
            lc(e);
          } catch (a) {
            ke(e, s, a);
          }
      }
    } catch (a) {
      ke(e, e.return, a);
    }
    if (e === t) {
      H = null;
      break;
    }
    var l = e.sibling;
    if (l !== null) {
      l.return = e.return, H = l;
      break;
    }
    H = e.return;
  }
}
var Fx = Math.ceil, ol = Cn.ReactCurrentDispatcher, Nd = Cn.ReactCurrentOwner, Tt = Cn.ReactCurrentBatchConfig, oe = 0, je = null, Oe = null, He = 0, gt = 0, Gr = Yn(0), Le = 0, Oi = null, vr = 0, Wl = 0, bd = 0, li = null, it = null, Ad = 0, co = 1 / 0, un = null, il = !1, cc = null, jn = null, hs = !1, $n = null, sl = 0, ai = 0, dc = null, Ps = -1, $s = 0;
function et() {
  return oe & 6 ? be() : Ps !== -1 ? Ps : Ps = be();
}
function Bn(t) {
  return t.mode & 1 ? oe & 2 && He !== 0 ? He & -He : mx.transition !== null ? ($s === 0 && ($s = Gh()), $s) : (t = ue, t !== 0 || (t = window.event, t = t === void 0 ? 16 : tm(t.type)), t) : 1;
}
function jt(t, e, n, r) {
  if (50 < ai) throw ai = 0, dc = null, Error(D(185));
  ji(t, n, r), (!(oe & 2) || t !== je) && (t === je && (!(oe & 2) && (Wl |= n), Le === 4 && On(t, He)), ct(t, r), n === 1 && oe === 0 && !(e.mode & 1) && (co = be() + 500, zl && Zn()));
}
function ct(t, e) {
  var n = t.callbackNode;
  m0(t, e);
  var r = Ws(t, t === je ? He : 0);
  if (r === 0) n !== null && Rf(n), t.callbackNode = null, t.callbackPriority = 0;
  else if (e = r & -r, t.callbackPriority !== e) {
    if (n != null && Rf(n), e === 1) t.tag === 0 ? hx(Ap.bind(null, t)) : xm(Ap.bind(null, t)), dx(function() {
      !(oe & 6) && Zn();
    }), n = null;
    else {
      switch (Jh(r)) {
        case 1:
          n = td;
          break;
        case 4:
          n = Kh;
          break;
        case 16:
          n = Us;
          break;
        case 536870912:
          n = Qh;
          break;
        default:
          n = Us;
      }
      n = _y(n, dy.bind(null, t));
    }
    t.callbackPriority = e, t.callbackNode = n;
  }
}
function dy(t, e) {
  if (Ps = -1, $s = 0, oe & 6) throw Error(D(327));
  var n = t.callbackNode;
  if (no() && t.callbackNode !== n) return null;
  var r = Ws(t, t === je ? He : 0);
  if (r === 0) return null;
  if (r & 30 || r & t.expiredLanes || e) e = ll(t, r);
  else {
    e = r;
    var o = oe;
    oe |= 2;
    var i = py();
    (je !== t || He !== e) && (un = null, co = be() + 500, dr(t, e));
    do
      try {
        Dx();
        break;
      } catch (l) {
        fy(t, l);
      }
    while (!0);
    gd(), ol.current = i, oe = o, Oe !== null ? e = 0 : (je = null, He = 0, e = Le);
  }
  if (e !== 0) {
    if (e === 2 && (o = Mu(t), o !== 0 && (r = o, e = fc(t, o))), e === 1) throw n = Oi, dr(t, 0), On(t, r), ct(t, be()), n;
    if (e === 6) On(t, r);
    else {
      if (o = t.current.alternate, !(r & 30) && !Lx(o) && (e = ll(t, r), e === 2 && (i = Mu(t), i !== 0 && (r = i, e = fc(t, i))), e === 1)) throw n = Oi, dr(t, 0), On(t, r), ct(t, be()), n;
      switch (t.finishedWork = o, t.finishedLanes = r, e) {
        case 0:
        case 1:
          throw Error(D(345));
        case 2:
          sr(t, it, un);
          break;
        case 3:
          if (On(t, r), (r & 130023424) === r && (e = Ad + 500 - be(), 10 < e)) {
            if (Ws(t, 0) !== 0) break;
            if (o = t.suspendedLanes, (o & r) !== r) {
              et(), t.pingedLanes |= t.suspendedLanes & o;
              break;
            }
            t.timeoutHandle = Ku(sr.bind(null, t, it, un), e);
            break;
          }
          sr(t, it, un);
          break;
        case 4:
          if (On(t, r), (r & 4194240) === r) break;
          for (e = t.eventTimes, o = -1; 0 < r; ) {
            var s = 31 - zt(r);
            i = 1 << s, s = e[s], s > o && (o = s), r &= ~i;
          }
          if (r = o, r = be() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Fx(r / 1960)) - r, 10 < r) {
            t.timeoutHandle = Ku(sr.bind(null, t, it, un), r);
            break;
          }
          sr(t, it, un);
          break;
        case 5:
          sr(t, it, un);
          break;
        default:
          throw Error(D(329));
      }
    }
  }
  return ct(t, be()), t.callbackNode === n ? dy.bind(null, t) : null;
}
function fc(t, e) {
  var n = li;
  return t.current.memoizedState.isDehydrated && (dr(t, e).flags |= 256), t = ll(t, e), t !== 2 && (e = it, it = n, e !== null && pc(e)), t;
}
function pc(t) {
  it === null ? it = t : it.push.apply(it, t);
}
function Lx(t) {
  for (var e = t; ; ) {
    if (e.flags & 16384) {
      var n = e.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var o = n[r], i = o.getSnapshot;
        o = o.value;
        try {
          if (!Ut(i(), o)) return !1;
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
function On(t, e) {
  for (e &= ~bd, e &= ~Wl, t.suspendedLanes |= e, t.pingedLanes &= ~e, t = t.expirationTimes; 0 < e; ) {
    var n = 31 - zt(e), r = 1 << n;
    t[n] = -1, e &= ~r;
  }
}
function Ap(t) {
  if (oe & 6) throw Error(D(327));
  no();
  var e = Ws(t, 0);
  if (!(e & 1)) return ct(t, be()), null;
  var n = ll(t, e);
  if (t.tag !== 0 && n === 2) {
    var r = Mu(t);
    r !== 0 && (e = r, n = fc(t, r));
  }
  if (n === 1) throw n = Oi, dr(t, 0), On(t, e), ct(t, be()), n;
  if (n === 6) throw Error(D(345));
  return t.finishedWork = t.current.alternate, t.finishedLanes = e, sr(t, it, un), ct(t, be()), null;
}
function Od(t, e) {
  var n = oe;
  oe |= 1;
  try {
    return t(e);
  } finally {
    oe = n, oe === 0 && (co = be() + 500, zl && Zn());
  }
}
function xr(t) {
  $n !== null && $n.tag === 0 && !(oe & 6) && no();
  var e = oe;
  oe |= 1;
  var n = Tt.transition, r = ue;
  try {
    if (Tt.transition = null, ue = 1, t) return t();
  } finally {
    ue = r, Tt.transition = n, oe = e, !(oe & 6) && Zn();
  }
}
function Pd() {
  gt = Gr.current, me(Gr);
}
function dr(t, e) {
  t.finishedWork = null, t.finishedLanes = 0;
  var n = t.timeoutHandle;
  if (n !== -1 && (t.timeoutHandle = -1, cx(n)), Oe !== null) for (n = Oe.return; n !== null; ) {
    var r = n;
    switch (dd(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Gs();
        break;
      case 3:
        ao(), me(at), me(Ze), xd();
        break;
      case 5:
        vd(r);
        break;
      case 4:
        ao();
        break;
      case 13:
        me(we);
        break;
      case 19:
        me(we);
        break;
      case 10:
        hd(r.type._context);
        break;
      case 22:
      case 23:
        Pd();
    }
    n = n.return;
  }
  if (je = t, Oe = t = Un(t.current, null), He = gt = e, Le = 0, Oi = null, bd = Wl = vr = 0, it = li = null, ur !== null) {
    for (e = 0; e < ur.length; e++) if (n = ur[e], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var o = r.next, i = n.pending;
      if (i !== null) {
        var s = i.next;
        i.next = o, r.next = s;
      }
      n.pending = r;
    }
    ur = null;
  }
  return t;
}
function fy(t, e) {
  do {
    var n = Oe;
    try {
      if (gd(), bs.current = rl, nl) {
        for (var r = Se.memoizedState; r !== null; ) {
          var o = r.queue;
          o !== null && (o.pending = null), r = r.next;
        }
        nl = !1;
      }
      if (_r = 0, Re = Pe = Se = null, ii = !1, Ni = 0, Nd.current = null, n === null || n.return === null) {
        Le = 1, Oi = e, Oe = null;
        break;
      }
      e: {
        var i = t, s = n.return, l = n, a = e;
        if (e = He, l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
          var u = a, c = l, p = c.tag;
          if (!(c.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var d = c.alternate;
            d ? (c.updateQueue = d.updateQueue, c.memoizedState = d.memoizedState, c.lanes = d.lanes) : (c.updateQueue = null, c.memoizedState = null);
          }
          var m = mp(s);
          if (m !== null) {
            m.flags &= -257, yp(m, s, l, i, e), m.mode & 1 && hp(i, u, e), e = m, a = u;
            var h = e.updateQueue;
            if (h === null) {
              var y = /* @__PURE__ */ new Set();
              y.add(a), e.updateQueue = y;
            } else h.add(a);
            break e;
          } else {
            if (!(e & 1)) {
              hp(i, u, e), $d();
              break e;
            }
            a = Error(D(426));
          }
        } else if (xe && l.mode & 1) {
          var v = mp(s);
          if (v !== null) {
            !(v.flags & 65536) && (v.flags |= 256), yp(v, s, l, i, e), fd(uo(a, l));
            break e;
          }
        }
        i = a = uo(a, l), Le !== 4 && (Le = 2), li === null ? li = [i] : li.push(i), i = s;
        do {
          switch (i.tag) {
            case 3:
              i.flags |= 65536, e &= -e, i.lanes |= e;
              var _ = Jm(i, a, e);
              up(i, _);
              break e;
            case 1:
              l = a;
              var f = i.type, g = i.stateNode;
              if (!(i.flags & 128) && (typeof f.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && (jn === null || !jn.has(g)))) {
                i.flags |= 65536, e &= -e, i.lanes |= e;
                var x = Ym(i, l, e);
                up(i, x);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      hy(n);
    } catch (w) {
      e = w, Oe === n && n !== null && (Oe = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function py() {
  var t = ol.current;
  return ol.current = rl, t === null ? rl : t;
}
function $d() {
  (Le === 0 || Le === 3 || Le === 2) && (Le = 4), je === null || !(vr & 268435455) && !(Wl & 268435455) || On(je, He);
}
function ll(t, e) {
  var n = oe;
  oe |= 2;
  var r = py();
  (je !== t || He !== e) && (un = null, dr(t, e));
  do
    try {
      Ix();
      break;
    } catch (o) {
      fy(t, o);
    }
  while (!0);
  if (gd(), oe = n, ol.current = r, Oe !== null) throw Error(D(261));
  return je = null, He = 0, Le;
}
function Ix() {
  for (; Oe !== null; ) gy(Oe);
}
function Dx() {
  for (; Oe !== null && !l0(); ) gy(Oe);
}
function gy(t) {
  var e = yy(t.alternate, t, gt);
  t.memoizedProps = t.pendingProps, e === null ? hy(t) : Oe = e, Nd.current = null;
}
function hy(t) {
  var e = t;
  do {
    var n = e.alternate;
    if (t = e.return, e.flags & 32768) {
      if (n = Ax(n, e), n !== null) {
        n.flags &= 32767, Oe = n;
        return;
      }
      if (t !== null) t.flags |= 32768, t.subtreeFlags = 0, t.deletions = null;
      else {
        Le = 6, Oe = null;
        return;
      }
    } else if (n = bx(n, e, gt), n !== null) {
      Oe = n;
      return;
    }
    if (e = e.sibling, e !== null) {
      Oe = e;
      return;
    }
    Oe = e = t;
  } while (e !== null);
  Le === 0 && (Le = 5);
}
function sr(t, e, n) {
  var r = ue, o = Tt.transition;
  try {
    Tt.transition = null, ue = 1, Rx(t, e, n, r);
  } finally {
    Tt.transition = o, ue = r;
  }
  return null;
}
function Rx(t, e, n, r) {
  do
    no();
  while ($n !== null);
  if (oe & 6) throw Error(D(327));
  n = t.finishedWork;
  var o = t.finishedLanes;
  if (n === null) return null;
  if (t.finishedWork = null, t.finishedLanes = 0, n === t.current) throw Error(D(177));
  t.callbackNode = null, t.callbackPriority = 0;
  var i = n.lanes | n.childLanes;
  if (y0(t, i), t === je && (Oe = je = null, He = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || hs || (hs = !0, _y(Us, function() {
    return no(), null;
  })), i = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || i) {
    i = Tt.transition, Tt.transition = null;
    var s = ue;
    ue = 1;
    var l = oe;
    oe |= 4, Nd.current = null, Px(t, n), uy(n, t), rx(Hu), Hs = !!Wu, Hu = Wu = null, t.current = n, $x(n), a0(), oe = l, ue = s, Tt.transition = i;
  } else t.current = n;
  if (hs && (hs = !1, $n = t, sl = o), i = t.pendingLanes, i === 0 && (jn = null), d0(n.stateNode), ct(t, be()), e !== null) for (r = t.onRecoverableError, n = 0; n < e.length; n++) o = e[n], r(o.value, { componentStack: o.stack, digest: o.digest });
  if (il) throw il = !1, t = cc, cc = null, t;
  return sl & 1 && t.tag !== 0 && no(), i = t.pendingLanes, i & 1 ? t === dc ? ai++ : (ai = 0, dc = t) : ai = 0, Zn(), null;
}
function no() {
  if ($n !== null) {
    var t = Jh(sl), e = Tt.transition, n = ue;
    try {
      if (Tt.transition = null, ue = 16 > t ? 16 : t, $n === null) var r = !1;
      else {
        if (t = $n, $n = null, sl = 0, oe & 6) throw Error(D(331));
        var o = oe;
        for (oe |= 4, H = t.current; H !== null; ) {
          var i = H, s = i.child;
          if (H.flags & 16) {
            var l = i.deletions;
            if (l !== null) {
              for (var a = 0; a < l.length; a++) {
                var u = l[a];
                for (H = u; H !== null; ) {
                  var c = H;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      si(8, c, i);
                  }
                  var p = c.child;
                  if (p !== null) p.return = c, H = p;
                  else for (; H !== null; ) {
                    c = H;
                    var d = c.sibling, m = c.return;
                    if (sy(c), c === u) {
                      H = null;
                      break;
                    }
                    if (d !== null) {
                      d.return = m, H = d;
                      break;
                    }
                    H = m;
                  }
                }
              }
              var h = i.alternate;
              if (h !== null) {
                var y = h.child;
                if (y !== null) {
                  h.child = null;
                  do {
                    var v = y.sibling;
                    y.sibling = null, y = v;
                  } while (y !== null);
                }
              }
              H = i;
            }
          }
          if (i.subtreeFlags & 2064 && s !== null) s.return = i, H = s;
          else e: for (; H !== null; ) {
            if (i = H, i.flags & 2048) switch (i.tag) {
              case 0:
              case 11:
              case 15:
                si(9, i, i.return);
            }
            var _ = i.sibling;
            if (_ !== null) {
              _.return = i.return, H = _;
              break e;
            }
            H = i.return;
          }
        }
        var f = t.current;
        for (H = f; H !== null; ) {
          s = H;
          var g = s.child;
          if (s.subtreeFlags & 2064 && g !== null) g.return = s, H = g;
          else e: for (s = f; H !== null; ) {
            if (l = H, l.flags & 2048) try {
              switch (l.tag) {
                case 0:
                case 11:
                case 15:
                  Ul(9, l);
              }
            } catch (w) {
              ke(l, l.return, w);
            }
            if (l === s) {
              H = null;
              break e;
            }
            var x = l.sibling;
            if (x !== null) {
              x.return = l.return, H = x;
              break e;
            }
            H = l.return;
          }
        }
        if (oe = o, Zn(), en && typeof en.onPostCommitFiberRoot == "function") try {
          en.onPostCommitFiberRoot(Ll, t);
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
function Op(t, e, n) {
  e = uo(n, e), e = Jm(t, e, 1), t = zn(t, e, 1), e = et(), t !== null && (ji(t, 1, e), ct(t, e));
}
function ke(t, e, n) {
  if (t.tag === 3) Op(t, t, n);
  else for (; e !== null; ) {
    if (e.tag === 3) {
      Op(e, t, n);
      break;
    } else if (e.tag === 1) {
      var r = e.stateNode;
      if (typeof e.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (jn === null || !jn.has(r))) {
        t = uo(n, t), t = Ym(e, t, 1), e = zn(e, t, 1), t = et(), e !== null && (ji(e, 1, t), ct(e, t));
        break;
      }
    }
    e = e.return;
  }
}
function Mx(t, e, n) {
  var r = t.pingCache;
  r !== null && r.delete(e), e = et(), t.pingedLanes |= t.suspendedLanes & n, je === t && (He & n) === n && (Le === 4 || Le === 3 && (He & 130023424) === He && 500 > be() - Ad ? dr(t, 0) : bd |= n), ct(t, e);
}
function my(t, e) {
  e === 0 && (t.mode & 1 ? (e = is, is <<= 1, !(is & 130023424) && (is = 4194304)) : e = 1);
  var n = et();
  t = xn(t, e), t !== null && (ji(t, e, n), ct(t, n));
}
function zx(t) {
  var e = t.memoizedState, n = 0;
  e !== null && (n = e.retryLane), my(t, n);
}
function jx(t, e) {
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
      throw Error(D(314));
  }
  r !== null && r.delete(e), my(t, n);
}
var yy;
yy = function(t, e, n) {
  if (t !== null) if (t.memoizedProps !== e.pendingProps || at.current) lt = !0;
  else {
    if (!(t.lanes & n) && !(e.flags & 128)) return lt = !1, Nx(t, e, n);
    lt = !!(t.flags & 131072);
  }
  else lt = !1, xe && e.flags & 1048576 && wm(e, Zs, e.index);
  switch (e.lanes = 0, e.tag) {
    case 2:
      var r = e.type;
      Os(t, e), t = e.pendingProps;
      var o = io(e, Ze.current);
      to(e, n), o = Sd(null, e, r, t, o, n);
      var i = Cd();
      return e.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (e.tag = 1, e.memoizedState = null, e.updateQueue = null, ut(r) ? (i = !0, Js(e)) : i = !1, e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, yd(e), o.updater = Bl, e.stateNode = o, o._reactInternals = e, qu(e, r, t, n), e = nc(null, e, r, !0, i, n)) : (e.tag = 0, xe && i && cd(e), Xe(null, e, o, n), e = e.child), e;
    case 16:
      r = e.elementType;
      e: {
        switch (Os(t, e), t = e.pendingProps, o = r._init, r = o(r._payload), e.type = r, o = e.tag = Ux(r), t = It(r, t), o) {
          case 0:
            e = tc(null, e, r, t, n);
            break e;
          case 1:
            e = xp(null, e, r, t, n);
            break e;
          case 11:
            e = _p(null, e, r, t, n);
            break e;
          case 14:
            e = vp(null, e, r, It(r.type, t), n);
            break e;
        }
        throw Error(D(
          306,
          r,
          ""
        ));
      }
      return e;
    case 0:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : It(r, o), tc(t, e, r, o, n);
    case 1:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : It(r, o), xp(t, e, r, o, n);
    case 3:
      e: {
        if (ey(e), t === null) throw Error(D(387));
        r = e.pendingProps, i = e.memoizedState, o = i.element, Nm(t, e), el(e, r, null, n);
        var s = e.memoizedState;
        if (r = s.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, e.updateQueue.baseState = i, e.memoizedState = i, e.flags & 256) {
          o = uo(Error(D(423)), e), e = wp(t, e, r, n, o);
          break e;
        } else if (r !== o) {
          o = uo(Error(D(424)), e), e = wp(t, e, r, n, o);
          break e;
        } else for (yt = Mn(e.stateNode.containerInfo.firstChild), _t = e, xe = !0, Mt = null, n = Em(e, null, r, n), e.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (so(), r === o) {
            e = wn(t, e, n);
            break e;
          }
          Xe(t, e, r, n);
        }
        e = e.child;
      }
      return e;
    case 5:
      return bm(e), t === null && Yu(e), r = e.type, o = e.pendingProps, i = t !== null ? t.memoizedProps : null, s = o.children, Vu(r, o) ? s = null : i !== null && Vu(r, i) && (e.flags |= 32), qm(t, e), Xe(t, e, s, n), e.child;
    case 6:
      return t === null && Yu(e), null;
    case 13:
      return ty(t, e, n);
    case 4:
      return _d(e, e.stateNode.containerInfo), r = e.pendingProps, t === null ? e.child = lo(e, null, r, n) : Xe(t, e, r, n), e.child;
    case 11:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : It(r, o), _p(t, e, r, o, n);
    case 7:
      return Xe(t, e, e.pendingProps, n), e.child;
    case 8:
      return Xe(t, e, e.pendingProps.children, n), e.child;
    case 12:
      return Xe(t, e, e.pendingProps.children, n), e.child;
    case 10:
      e: {
        if (r = e.type._context, o = e.pendingProps, i = e.memoizedProps, s = o.value, pe(Xs, r._currentValue), r._currentValue = s, i !== null) if (Ut(i.value, s)) {
          if (i.children === o.children && !at.current) {
            e = wn(t, e, n);
            break e;
          }
        } else for (i = e.child, i !== null && (i.return = e); i !== null; ) {
          var l = i.dependencies;
          if (l !== null) {
            s = i.child;
            for (var a = l.firstContext; a !== null; ) {
              if (a.context === r) {
                if (i.tag === 1) {
                  a = mn(-1, n & -n), a.tag = 2;
                  var u = i.updateQueue;
                  if (u !== null) {
                    u = u.shared;
                    var c = u.pending;
                    c === null ? a.next = a : (a.next = c.next, c.next = a), u.pending = a;
                  }
                }
                i.lanes |= n, a = i.alternate, a !== null && (a.lanes |= n), Zu(
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
            if (s = i.return, s === null) throw Error(D(341));
            s.lanes |= n, l = s.alternate, l !== null && (l.lanes |= n), Zu(s, n, e), s = i.sibling;
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
      return o = e.type, r = e.pendingProps.children, to(e, n), o = Nt(o), r = r(o), e.flags |= 1, Xe(t, e, r, n), e.child;
    case 14:
      return r = e.type, o = It(r, e.pendingProps), o = It(r.type, o), vp(t, e, r, o, n);
    case 15:
      return Zm(t, e, e.type, e.pendingProps, n);
    case 17:
      return r = e.type, o = e.pendingProps, o = e.elementType === r ? o : It(r, o), Os(t, e), e.tag = 1, ut(r) ? (t = !0, Js(e)) : t = !1, to(e, n), Gm(e, r, o), qu(e, r, o, n), nc(null, e, r, !0, t, n);
    case 19:
      return ny(t, e, n);
    case 22:
      return Xm(t, e, n);
  }
  throw Error(D(156, e.tag));
};
function _y(t, e) {
  return Vh(t, e);
}
function Bx(t, e, n, r) {
  this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function Et(t, e, n, r) {
  return new Bx(t, e, n, r);
}
function Fd(t) {
  return t = t.prototype, !(!t || !t.isReactComponent);
}
function Ux(t) {
  if (typeof t == "function") return Fd(t) ? 1 : 0;
  if (t != null) {
    if (t = t.$$typeof, t === Xc) return 11;
    if (t === qc) return 14;
  }
  return 2;
}
function Un(t, e) {
  var n = t.alternate;
  return n === null ? (n = Et(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 14680064, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n;
}
function Fs(t, e, n, r, o, i) {
  var s = 2;
  if (r = t, typeof t == "function") Fd(t) && (s = 1);
  else if (typeof t == "string") s = 5;
  else e: switch (t) {
    case Mr:
      return fr(n.children, o, i, e);
    case Zc:
      s = 8, o |= 8;
      break;
    case Cu:
      return t = Et(12, n, e, o | 2), t.elementType = Cu, t.lanes = i, t;
    case ku:
      return t = Et(13, n, e, o), t.elementType = ku, t.lanes = i, t;
    case Eu:
      return t = Et(19, n, e, o), t.elementType = Eu, t.lanes = i, t;
    case bh:
      return Hl(n, o, i, e);
    default:
      if (typeof t == "object" && t !== null) switch (t.$$typeof) {
        case Th:
          s = 10;
          break e;
        case Nh:
          s = 9;
          break e;
        case Xc:
          s = 11;
          break e;
        case qc:
          s = 14;
          break e;
        case Tn:
          s = 16, r = null;
          break e;
      }
      throw Error(D(130, t == null ? t : typeof t, ""));
  }
  return e = Et(s, n, e, o), e.elementType = t, e.type = r, e.lanes = i, e;
}
function fr(t, e, n, r) {
  return t = Et(7, t, r, e), t.lanes = n, t;
}
function Hl(t, e, n, r) {
  return t = Et(22, t, r, e), t.elementType = bh, t.lanes = n, t.stateNode = { isHidden: !1 }, t;
}
function qa(t, e, n) {
  return t = Et(6, t, null, e), t.lanes = n, t;
}
function eu(t, e, n) {
  return e = Et(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, e;
}
function Wx(t, e, n, r, o) {
  this.tag = e, this.containerInfo = t, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = La(0), this.expirationTimes = La(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = La(0), this.identifierPrefix = r, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
}
function Ld(t, e, n, r, o, i, s, l, a) {
  return t = new Wx(t, e, n, l, a), e === 1 ? (e = 1, i === !0 && (e |= 8)) : e = 0, i = Et(3, null, null, e), t.current = i, i.stateNode = t, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, yd(i), t;
}
function Hx(t, e, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Rr, key: r == null ? null : "" + r, children: t, containerInfo: e, implementation: n };
}
function vy(t) {
  if (!t) return Qn;
  t = t._reactInternals;
  e: {
    if (Tr(t) !== t || t.tag !== 1) throw Error(D(170));
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
    throw Error(D(171));
  }
  if (t.tag === 1) {
    var n = t.type;
    if (ut(n)) return vm(t, n, e);
  }
  return e;
}
function xy(t, e, n, r, o, i, s, l, a) {
  return t = Ld(n, r, !0, t, o, i, s, l, a), t.context = vy(null), n = t.current, r = et(), o = Bn(n), i = mn(r, o), i.callback = e ?? null, zn(n, i, o), t.current.lanes = o, ji(t, o, r), ct(t, r), t;
}
function Vl(t, e, n, r) {
  var o = e.current, i = et(), s = Bn(o);
  return n = vy(n), e.context === null ? e.context = n : e.pendingContext = n, e = mn(i, s), e.payload = { element: t }, r = r === void 0 ? null : r, r !== null && (e.callback = r), t = zn(o, e, s), t !== null && (jt(t, o, s, i), Ns(t, o, s)), s;
}
function al(t) {
  if (t = t.current, !t.child) return null;
  switch (t.child.tag) {
    case 5:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
function Pp(t, e) {
  if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
    var n = t.retryLane;
    t.retryLane = n !== 0 && n < e ? n : e;
  }
}
function Id(t, e) {
  Pp(t, e), (t = t.alternate) && Pp(t, e);
}
function Vx() {
  return null;
}
var wy = typeof reportError == "function" ? reportError : function(t) {
  console.error(t);
};
function Dd(t) {
  this._internalRoot = t;
}
Kl.prototype.render = Dd.prototype.render = function(t) {
  var e = this._internalRoot;
  if (e === null) throw Error(D(409));
  Vl(t, e, null, null);
};
Kl.prototype.unmount = Dd.prototype.unmount = function() {
  var t = this._internalRoot;
  if (t !== null) {
    this._internalRoot = null;
    var e = t.containerInfo;
    xr(function() {
      Vl(null, t, null, null);
    }), e[vn] = null;
  }
};
function Kl(t) {
  this._internalRoot = t;
}
Kl.prototype.unstable_scheduleHydration = function(t) {
  if (t) {
    var e = Xh();
    t = { blockedOn: null, target: t, priority: e };
    for (var n = 0; n < An.length && e !== 0 && e < An[n].priority; n++) ;
    An.splice(n, 0, t), n === 0 && em(t);
  }
};
function Rd(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
}
function Ql(t) {
  return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11 && (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "));
}
function $p() {
}
function Kx(t, e, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var u = al(s);
        i.call(u);
      };
    }
    var s = xy(e, r, t, 0, null, !1, !1, "", $p);
    return t._reactRootContainer = s, t[vn] = s.current, Si(t.nodeType === 8 ? t.parentNode : t), xr(), s;
  }
  for (; o = t.lastChild; ) t.removeChild(o);
  if (typeof r == "function") {
    var l = r;
    r = function() {
      var u = al(a);
      l.call(u);
    };
  }
  var a = Ld(t, 0, !1, null, null, !1, !1, "", $p);
  return t._reactRootContainer = a, t[vn] = a.current, Si(t.nodeType === 8 ? t.parentNode : t), xr(function() {
    Vl(e, a, n, r);
  }), a;
}
function Gl(t, e, n, r, o) {
  var i = n._reactRootContainer;
  if (i) {
    var s = i;
    if (typeof o == "function") {
      var l = o;
      o = function() {
        var a = al(s);
        l.call(a);
      };
    }
    Vl(e, s, t, o);
  } else s = Kx(n, e, t, o, r);
  return al(s);
}
Yh = function(t) {
  switch (t.tag) {
    case 3:
      var e = t.stateNode;
      if (e.current.memoizedState.isDehydrated) {
        var n = Vo(e.pendingLanes);
        n !== 0 && (nd(e, n | 1), ct(e, be()), !(oe & 6) && (co = be() + 500, Zn()));
      }
      break;
    case 13:
      xr(function() {
        var r = xn(t, 1);
        if (r !== null) {
          var o = et();
          jt(r, t, 1, o);
        }
      }), Id(t, 1);
  }
};
rd = function(t) {
  if (t.tag === 13) {
    var e = xn(t, 134217728);
    if (e !== null) {
      var n = et();
      jt(e, t, 134217728, n);
    }
    Id(t, 134217728);
  }
};
Zh = function(t) {
  if (t.tag === 13) {
    var e = Bn(t), n = xn(t, e);
    if (n !== null) {
      var r = et();
      jt(n, t, e, r);
    }
    Id(t, e);
  }
};
Xh = function() {
  return ue;
};
qh = function(t, e) {
  var n = ue;
  try {
    return ue = t, e();
  } finally {
    ue = n;
  }
};
Iu = function(t, e, n) {
  switch (e) {
    case "input":
      if (bu(t, n), e = n.name, n.type === "radio" && e != null) {
        for (n = t; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + e) + '][type="radio"]'), e = 0; e < n.length; e++) {
          var r = n[e];
          if (r !== t && r.form === t.form) {
            var o = Ml(r);
            if (!o) throw Error(D(90));
            Oh(r), bu(r, o);
          }
        }
      }
      break;
    case "textarea":
      $h(t, n);
      break;
    case "select":
      e = n.value, e != null && Zr(t, !!n.multiple, e, !1);
  }
};
zh = Od;
jh = xr;
var Qx = { usingClientEntryPoint: !1, Events: [Ui, Ur, Ml, Rh, Mh, Od] }, Mo = { findFiberByHostInstance: ar, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Gx = { bundleType: Mo.bundleType, version: Mo.version, rendererPackageName: Mo.rendererPackageName, rendererConfig: Mo.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Cn.ReactCurrentDispatcher, findHostInstanceByFiber: function(t) {
  return t = Wh(t), t === null ? null : t.stateNode;
}, findFiberByHostInstance: Mo.findFiberByHostInstance || Vx, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var ms = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!ms.isDisabled && ms.supportsFiber) try {
    Ll = ms.inject(Gx), en = ms;
  } catch {
  }
}
xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Qx;
xt.createPortal = function(t, e) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Rd(e)) throw Error(D(200));
  return Hx(t, e, null, n);
};
xt.createRoot = function(t, e) {
  if (!Rd(t)) throw Error(D(299));
  var n = !1, r = "", o = wy;
  return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (r = e.identifierPrefix), e.onRecoverableError !== void 0 && (o = e.onRecoverableError)), e = Ld(t, 1, !1, null, null, n, !1, r, o), t[vn] = e.current, Si(t.nodeType === 8 ? t.parentNode : t), new Dd(e);
};
xt.findDOMNode = function(t) {
  if (t == null) return null;
  if (t.nodeType === 1) return t;
  var e = t._reactInternals;
  if (e === void 0)
    throw typeof t.render == "function" ? Error(D(188)) : (t = Object.keys(t).join(","), Error(D(268, t)));
  return t = Wh(e), t = t === null ? null : t.stateNode, t;
};
xt.flushSync = function(t) {
  return xr(t);
};
xt.hydrate = function(t, e, n) {
  if (!Ql(e)) throw Error(D(200));
  return Gl(null, t, e, !0, n);
};
xt.hydrateRoot = function(t, e, n) {
  if (!Rd(t)) throw Error(D(405));
  var r = n != null && n.hydratedSources || null, o = !1, i = "", s = wy;
  if (n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (s = n.onRecoverableError)), e = xy(e, null, t, 1, n ?? null, o, !1, i, s), t[vn] = e.current, Si(t), r) for (t = 0; t < r.length; t++) n = r[t], o = n._getVersion, o = o(n._source), e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [n, o] : e.mutableSourceEagerHydrationData.push(
    n,
    o
  );
  return new Kl(e);
};
xt.render = function(t, e, n) {
  if (!Ql(e)) throw Error(D(200));
  return Gl(null, t, e, !1, n);
};
xt.unmountComponentAtNode = function(t) {
  if (!Ql(t)) throw Error(D(40));
  return t._reactRootContainer ? (xr(function() {
    Gl(null, null, t, !1, function() {
      t._reactRootContainer = null, t[vn] = null;
    });
  }), !0) : !1;
};
xt.unstable_batchedUpdates = Od;
xt.unstable_renderSubtreeIntoContainer = function(t, e, n, r) {
  if (!Ql(n)) throw Error(D(200));
  if (t == null || t._reactInternals === void 0) throw Error(D(38));
  return Gl(t, e, n, !1, r);
};
xt.version = "18.3.1-next-f1338f8080-20240426";
function Sy() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Sy);
    } catch (t) {
      console.error(t);
    }
}
Sy(), Sh.exports = xt;
var At = Sh.exports, Fp = At;
wu.createRoot = Fp.createRoot, wu.hydrateRoot = Fp.hydrateRoot;
function Jx(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Yx = Jx(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const Cy = T.createContext(null);
function Zx(t, e) {
  let n = null;
  return { getTheme: function() {
    return e ?? (n != null ? n.getTheme() : null);
  } };
}
function fe() {
  const t = T.useContext(Cy);
  return t == null && Yx(8), t;
}
function Kt(t) {
  return {};
}
const Nr = {}, Xx = {}, Jl = {}, nn = {}, Wn = {}, fo = {}, pr = {}, xo = {}, ul = {}, po = {}, go = {}, ht = {}, Yl = {}, Zl = {}, Md = {}, Xl = {}, qx = {}, ql = {}, e1 = {}, ea = {}, ta = {}, wr = {}, ky = {}, wo = {}, na = {}, ra = {}, zd = {}, t1 = {}, n1 = {}, Lp = {}, Hi = {}, r1 = {}, oa = {}, ia = {}, o1 = {}, Vi = {}, sa = {}, cl = {}, i1 = {}, s1 = {}, Qo = {}, Go = {}, jd = {}, la = {}, l1 = {};
function a1(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var B = a1(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const Qt = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, u1 = Qt && "documentMode" in document ? document.documentMode : null, Ft = Qt && /Mac|iPod|iPhone|iPad/.test(navigator.platform), Hn = Qt && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent), dl = !(!Qt || !("InputEvent" in window) || u1) && "getTargetRanges" in new window.InputEvent("input"), Bd = Qt && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), aa = Qt && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, c1 = Qt && /Android/.test(navigator.userAgent), Ey = Qt && /^(?=.*Chrome).*/i.test(navigator.userAgent), d1 = Qt && c1 && Ey, Ud = Qt && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !Ey, Ki = 1, Xn = 3, Sr = 0, Ty = 1, ho = 2, f1 = 0, p1 = 1, g1 = 2, fl = 4, pl = 8, h1 = 240 | (3 | fl | pl), Wd = 1, Hd = 2, Vd = 3, Kd = 4, Qd = 5, Gd = 6, ua = Bd || aa || Ud ? " " : "​", Sn = `

`, m1 = Hn ? " " : ua, Ny = "֑-߿יִ-﷽ﹰ-ﻼ", by = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿", y1 = new RegExp("^[^" + by + "]*[" + Ny + "]"), _1 = new RegExp("^[^" + Ny + "]*[" + by + "]"), yn = { bold: 1, code: 16, highlight: 128, italic: 2, strikethrough: fl, subscript: 32, superscript: 64, underline: pl }, v1 = { directionless: 1, unmergeable: 2 }, Ip = { center: Hd, end: Gd, justify: Kd, left: Wd, right: Vd, start: Qd }, x1 = { [Hd]: "center", [Gd]: "end", [Kd]: "justify", [Wd]: "left", [Vd]: "right", [Qd]: "start" }, w1 = { normal: 0, segmented: 2, token: 1 }, S1 = { [f1]: "normal", [g1]: "segmented", [p1]: "token" };
function gl(...t) {
  const e = [];
  for (const n of t) if (n && typeof n == "string") for (const [r] of n.matchAll(/\S+/g)) e.push(r);
  return e;
}
const C1 = 100;
let gc = !1, Jd = 0;
function k1(t) {
  Jd = t.timeStamp;
}
function tu(t, e, n) {
  return e.__lexicalLineBreak === t || t[`__lexicalKey_${n._key}`] !== void 0;
}
function E1(t, e, n) {
  const r = rn(n._window);
  let o = null, i = null;
  r !== null && r.anchorNode === t && (o = r.anchorOffset, i = r.focusOffset);
  const s = t.nodeValue;
  s !== null && ef(e, s, o, i, !1);
}
function T1(t, e, n) {
  if (O(t)) {
    const r = t.anchor.getNode();
    if (r.is(n) && t.format !== r.getFormat()) return !1;
  }
  return e.nodeType === Xn && n.isAttached();
}
function Ay(t, e, n) {
  gc = !0;
  const r = performance.now() - Jd > C1;
  try {
    mt(t, () => {
      const o = $() || function(d) {
        return d.getEditorState().read(() => {
          const m = $();
          return m !== null ? m.clone() : null;
        });
      }(t), i = /* @__PURE__ */ new Map(), s = t.getRootElement(), l = t._editorState, a = t._blockCursorElement;
      let u = !1, c = "";
      for (let d = 0; d < e.length; d++) {
        const m = e[d], h = m.type, y = m.target;
        let v = Wt(y, l);
        if (!(v === null && y !== s || ae(v))) {
          if (h === "characterData") r && I(v) && T1(o, y, v) && E1(y, v, t);
          else if (h === "childList") {
            u = !0;
            const _ = m.addedNodes;
            for (let x = 0; x < _.length; x++) {
              const w = _[x], S = Ly(w), C = w.parentNode;
              if (C != null && w !== a && S === null && (w.nodeName !== "BR" || !tu(w, C, t))) {
                if (Hn) {
                  const k = w.innerText || w.nodeValue;
                  k && (c += k);
                }
                C.removeChild(w);
              }
            }
            const f = m.removedNodes, g = f.length;
            if (g > 0) {
              let x = 0;
              for (let w = 0; w < g; w++) {
                const S = f[w];
                (S.nodeName === "BR" && tu(S, y, t) || a === S) && (y.appendChild(S), x++);
              }
              g !== x && (y === s && (v = Dy(l)), i.set(y, v));
            }
          }
        }
      }
      if (i.size > 0) for (const [d, m] of i) if (A(m)) {
        const h = m.getChildrenKeys();
        let y = d.firstChild;
        for (let v = 0; v < h.length; v++) {
          const _ = h[v], f = t.getElementByKey(_);
          f !== null && (y == null ? (d.appendChild(f), y = f) : y !== f && d.replaceChild(f, y), y = y.nextSibling);
        }
      } else I(m) && m.markDirty();
      const p = n.takeRecords();
      if (p.length > 0) {
        for (let d = 0; d < p.length; d++) {
          const m = p[d], h = m.addedNodes, y = m.target;
          for (let v = 0; v < h.length; v++) {
            const _ = h[v], f = _.parentNode;
            f == null || _.nodeName !== "BR" || tu(_, y, t) || f.removeChild(_);
          }
        }
        n.takeRecords();
      }
      o !== null && (u && (o.dirty = !0, Ie(o)), Hn && By(t) && o.insertRawText(c));
    });
  } finally {
    gc = !1;
  }
}
function Oy(t) {
  const e = t._observer;
  e !== null && Ay(t, e.takeRecords(), e);
}
function Py(t) {
  (function(e) {
    Jd === 0 && fa(e).addEventListener("textInput", k1, !0);
  })(t), t._observer = new MutationObserver((e, n) => {
    Ay(t, e, n);
  });
}
function Dp(t, e) {
  const n = t.__mode, r = t.__format, o = t.__style, i = e.__mode, s = e.__format, l = e.__style;
  return !(n !== null && n !== i || r !== null && r !== s || o !== null && o !== l);
}
function Rp(t, e) {
  const n = t.mergeWithSibling(e), r = Ae()._normalizedNodes;
  return r.add(t.__key), r.add(e.__key), n;
}
function Mp(t) {
  let e, n, r = t;
  if (r.__text !== "" || !r.isSimpleText() || r.isUnmergeable()) {
    for (; (e = r.getPreviousSibling()) !== null && I(e) && e.isSimpleText() && !e.isUnmergeable(); ) {
      if (e.__text !== "") {
        if (Dp(e, r)) {
          r = Rp(e, r);
          break;
        }
        break;
      }
      e.remove();
    }
    for (; (n = r.getNextSibling()) !== null && I(n) && n.isSimpleText() && !n.isUnmergeable(); ) {
      if (n.__text !== "") {
        if (Dp(r, n)) {
          r = Rp(r, n);
          break;
        }
        break;
      }
      n.remove();
    }
  } else r.remove();
}
function $y(t) {
  return zp(t.anchor), zp(t.focus), t;
}
function zp(t) {
  for (; t.type === "element"; ) {
    const e = t.getNode(), n = t.offset;
    let r, o;
    if (n === e.getChildrenSize() ? (r = e.getChildAtIndex(n - 1), o = !0) : (r = e.getChildAtIndex(n), o = !1), I(r)) {
      t.set(r.__key, o ? r.getTextContentSize() : 0, "text");
      break;
    }
    if (!A(r)) break;
    t.set(r.__key, o ? r.getChildrenSize() : 0, "element");
  }
}
let N1 = 1;
const b1 = typeof queueMicrotask == "function" ? queueMicrotask : (t) => {
  Promise.resolve().then(t);
};
function Yd(t) {
  const e = document.activeElement;
  if (e === null) return !1;
  const n = e.nodeName;
  return ae(Wt(t)) && (n === "INPUT" || n === "TEXTAREA" || e.contentEditable === "true" && e.__lexicalEditor == null);
}
function Qi(t, e, n) {
  const r = t.getRootElement();
  try {
    return r !== null && r.contains(e) && r.contains(n) && e !== null && !Yd(e) && Fy(e) === t;
  } catch {
    return !1;
  }
}
function Fy(t) {
  let e = t;
  for (; e != null; ) {
    const n = e.__lexicalEditor;
    if (n != null) return n;
    e = da(e);
  }
  return null;
}
function Fr(t) {
  return t.isToken() || t.isSegmented();
}
function A1(t) {
  return t.nodeType === Xn;
}
function hl(t) {
  let e = t;
  for (; e != null; ) {
    if (A1(e)) return e;
    e = e.firstChild;
  }
  return null;
}
function hc(t, e, n) {
  const r = yn[e];
  if (n !== null && (t & r) == (n & r)) return t;
  let o = t ^ r;
  return e === "subscript" ? o &= ~yn.superscript : e === "superscript" && (o &= ~yn.subscript), o;
}
function Zd(t) {
  return I(t) || Vn(t) || ae(t);
}
function O1(t, e) {
  if (e != null) return void (t.__key = e);
  st(), l_();
  const n = Ae(), r = ln(), o = "" + N1++;
  r._nodeMap.set(o, t), A(t) ? n._dirtyElements.set(o, !0) : n._dirtyLeaves.add(o), n._cloneNotNeeded.add(o), n._dirtyType = Ty, t.__key = o;
}
function gr(t) {
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
function ml(t) {
  l_();
  const e = t.getLatest(), n = e.__parent, r = ln(), o = Ae(), i = r._nodeMap, s = o._dirtyElements;
  n !== null && function(a, u, c) {
    let p = a;
    for (; p !== null; ) {
      if (c.has(p)) return;
      const d = u.get(p);
      if (d === void 0) break;
      c.set(p, !1), p = d.__parent;
    }
  }(n, i, s);
  const l = e.__key;
  o._dirtyType = Ty, A(t) ? s.set(l, !0) : o._dirtyLeaves.add(l);
}
function We(t) {
  st();
  const e = Ae(), n = e._compositionKey;
  if (t !== n) {
    if (e._compositionKey = t, n !== null) {
      const r = Ee(n);
      r !== null && r.getWritable();
    }
    if (t !== null) {
      const r = Ee(t);
      r !== null && r.getWritable();
    }
  }
}
function Fn() {
  return Yi() ? null : Ae()._compositionKey;
}
function Ee(t, e) {
  const n = (e || ln())._nodeMap.get(t);
  return n === void 0 ? null : n;
}
function Ly(t, e) {
  const n = t[`__lexicalKey_${Ae()._key}`];
  return n !== void 0 ? Ee(n, e) : null;
}
function Wt(t, e) {
  let n = t;
  for (; n != null; ) {
    const r = Ly(n, e);
    if (r !== null) return r;
    n = da(n);
  }
  return null;
}
function Iy(t) {
  const e = t._decorators, n = Object.assign({}, e);
  return t._pendingDecorators = n, n;
}
function jp(t) {
  return t.read(() => ye().getTextContent());
}
function ye() {
  return Dy(ln());
}
function Dy(t) {
  return t._nodeMap.get("root");
}
function Ie(t) {
  st();
  const e = ln();
  t !== null && (t.dirty = !0, t.setCachedNodes(null)), e._selection = t;
}
function Jr(t) {
  const e = Ae(), n = function(r, o) {
    let i = r;
    for (; i != null; ) {
      const s = i[`__lexicalKey_${o._key}`];
      if (s !== void 0) return s;
      i = da(i);
    }
    return null;
  }(t, e);
  return n === null ? t === e.getRootElement() ? Ee("root") : null : Ee(n);
}
function Bp(t, e) {
  return e ? t.getTextContentSize() : 0;
}
function Ry(t) {
  return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(t);
}
function Xd(t) {
  const e = [];
  let n = t;
  for (; n !== null; ) e.push(n), n = n._parentEditor;
  return e;
}
function My() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);
}
function zy(t) {
  return t.nodeType === Xn ? t.nodeValue : null;
}
function qd(t, e, n) {
  const r = rn(e._window);
  if (r === null) return;
  const o = r.anchorNode;
  let { anchorOffset: i, focusOffset: s } = r;
  if (o !== null) {
    let l = zy(o);
    const a = Wt(o);
    if (l !== null && I(a)) {
      if (l === ua && n) {
        const u = n.length;
        l = n, i = u, s = u;
      }
      l !== null && ef(a, l, i, s, t);
    }
  }
}
function ef(t, e, n, r, o) {
  let i = t;
  if (i.isAttached() && (o || !i.isDirty())) {
    const s = i.isComposing();
    let l = e;
    (s || o) && e[e.length - 1] === ua && (l = e.slice(0, -1));
    const a = i.getTextContent();
    if (o || l !== a) {
      if (l === "") {
        if (We(null), Bd || aa || Ud) i.remove();
        else {
          const y = Ae();
          setTimeout(() => {
            y.update(() => {
              i.isAttached() && i.remove();
            });
          }, 20);
        }
        return;
      }
      const u = i.getParent(), c = Co(), p = i.getTextContentSize(), d = Fn(), m = i.getKey();
      if (i.isToken() || d !== null && m === d && !s || O(c) && (u !== null && !u.canInsertTextBefore() && c.anchor.offset === 0 || c.anchor.key === t.__key && c.anchor.offset === 0 && !i.canInsertTextBefore() && !s || c.focus.key === t.__key && c.focus.offset === p && !i.canInsertTextAfter() && !s)) return void i.markDirty();
      const h = $();
      if (!O(h) || n === null || r === null) return void i.setTextContent(l);
      if (h.setTextNodeRange(i, n, i, r), i.isSegmented()) {
        const y = le(i.getTextContent());
        i.replace(y), i = y;
      }
      i.setTextContent(l);
    }
  }
}
function P1(t, e) {
  if (e.isSegmented()) return !0;
  if (!t.isCollapsed()) return !1;
  const n = t.anchor.offset, r = e.getParentOrThrow(), o = e.isToken();
  return n === 0 ? !e.canInsertTextBefore() || !r.canInsertTextBefore() && !e.isComposing() || o || function(i) {
    const s = i.getPreviousSibling();
    return (I(s) || A(s) && s.isInline()) && !s.canInsertTextAfter();
  }(e) : n === e.getTextContentSize() && (!e.canInsertTextAfter() || !r.canInsertTextAfter() && !e.isComposing() || o);
}
function Up(t) {
  return t === "ArrowLeft";
}
function Wp(t) {
  return t === "ArrowRight";
}
function Jo(t, e) {
  return Ft ? t : e;
}
function Hp(t) {
  return t === "Enter";
}
function zo(t) {
  return t === "Backspace";
}
function jo(t) {
  return t === "Delete";
}
function Vp(t, e, n) {
  return t.toLowerCase() === "a" && Jo(e, n);
}
function jy() {
  const t = ye();
  Ie($y(t.select(0, t.getChildrenSize())));
}
function ui(t, e) {
  t.__lexicalClassNameCache === void 0 && (t.__lexicalClassNameCache = {});
  const n = t.__lexicalClassNameCache, r = n[e];
  if (r !== void 0) return r;
  const o = t[e];
  if (typeof o == "string") {
    const i = gl(o);
    return n[e] = i, i;
  }
  return o;
}
function tf(t, e, n, r, o) {
  if (n.size === 0) return;
  const i = r.__type, s = r.__key, l = e.get(i);
  l === void 0 && B(33, i);
  const a = l.klass;
  let u = t.get(a);
  u === void 0 && (u = /* @__PURE__ */ new Map(), t.set(a, u));
  const c = u.get(s), p = c === "destroyed" && o === "created";
  (c === void 0 || p) && u.set(s, p ? "updated" : o);
}
function Pi(t) {
  const e = ln(), n = e._readOnly, r = t.getType(), o = e._nodeMap, i = [];
  for (const [, s] of o) s instanceof t && s.__type === r && (n || s.isAttached()) && i.push(s);
  return i;
}
function Kp(t, e, n) {
  const r = t.getParent();
  let o = n, i = t;
  return r !== null && (e && n === 0 ? (o = i.getIndexWithinParent(), i = r) : e || n !== i.getChildrenSize() || (o = i.getIndexWithinParent() + 1, i = r)), i.getChildAtIndex(e ? o - 1 : o);
}
function $i(t, e) {
  const n = t.offset;
  if (t.type === "element")
    return Kp(t.getNode(), e, n);
  {
    const r = t.getNode();
    if (e && n === 0 || !e && n === r.getTextContentSize()) {
      const o = e ? r.getPreviousSibling() : r.getNextSibling();
      return o === null ? Kp(r.getParentOrThrow(), e, r.getIndexWithinParent() + (e ? 0 : 1)) : o;
    }
  }
  return null;
}
function By(t) {
  const e = fa(t).event, n = e && e.inputType;
  return n === "insertFromPaste" || n === "insertFromPasteAsQuotation";
}
function U(t, e, n) {
  return a_(t, e, n);
}
function ca(t) {
  return !Ye(t) && !t.isLastChild() && !t.isInline();
}
function yl(t, e) {
  const n = t._keyToDOMMap.get(e);
  return n === void 0 && B(75, e), n;
}
function da(t) {
  const e = t.assignedSlot || t.parentElement;
  return e !== null && e.nodeType === 11 ? e.host : e;
}
function _l(t, e) {
  let n = t.getParent();
  for (; n !== null; ) {
    if (n.is(e)) return !0;
    n = n.getParent();
  }
  return !1;
}
function fa(t) {
  const e = t._window;
  return e === null && B(78), e;
}
function $1(t) {
  let e = t.getParentOrThrow();
  for (; e !== null; ) {
    if (ft(e)) return e;
    e = e.getParentOrThrow();
  }
  return e;
}
function ft(t) {
  return Ye(t) || A(t) && t.isShadowRoot();
}
function Be(t) {
  const e = Ae(), n = t.constructor.getType(), r = e._nodes.get(n);
  r === void 0 && B(97);
  const o = r.replace;
  if (o !== null) {
    const i = o(t);
    return i instanceof t.constructor || B(98), i;
  }
  return t;
}
function nu(t, e) {
  !Ye(t.getParent()) || A(e) || ae(e) || B(99);
}
function ru(t) {
  return (ae(t) || A(t) && !t.canBeEmpty()) && !t.isInline();
}
function nf(t, e, n) {
  n.style.removeProperty("caret-color"), e._blockCursorElement = null;
  const r = t.parentElement;
  r !== null && r.removeChild(t);
}
function F1(t, e, n) {
  let r = t._blockCursorElement;
  if (O(n) && n.isCollapsed() && n.anchor.type === "element" && e.contains(document.activeElement)) {
    const o = n.anchor, i = o.getNode(), s = o.offset;
    let l = !1, a = null;
    if (s === i.getChildrenSize())
      ru(i.getChildAtIndex(s - 1)) && (l = !0);
    else {
      const u = i.getChildAtIndex(s);
      if (ru(u)) {
        const c = u.getPreviousSibling();
        (c === null || ru(c)) && (l = !0, a = t.getElementByKey(u.__key));
      }
    }
    if (l) {
      const u = t.getElementByKey(i.__key);
      return r === null && (t._blockCursorElement = r = function(c) {
        const p = c.theme, d = document.createElement("div");
        d.contentEditable = "false", d.setAttribute("data-lexical-cursor", "true");
        let m = p.blockCursor;
        if (m !== void 0) {
          if (typeof m == "string") {
            const h = gl(m);
            m = p.blockCursor = h;
          }
          m !== void 0 && d.classList.add(...m);
        }
        return d;
      }(t._config)), e.style.caretColor = "transparent", void (a === null ? u.appendChild(r) : u.insertBefore(r, a));
    }
  }
  r !== null && nf(r, t, e);
}
function rn(t) {
  return Qt ? (t || window).getSelection() : null;
}
function L1(t) {
  return sn(t) && t.tagName === "A";
}
function sn(t) {
  return t.nodeType === 1;
}
function I1(t) {
  const e = new RegExp(/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/, "i");
  return t.nodeName.match(e) !== null;
}
function D1(t) {
  const e = new RegExp(/^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|td|tfoot|ul|video)$/, "i");
  return t.nodeName.match(e) !== null;
}
function Lr(t) {
  if (Ye(t) || ae(t) && !t.isInline()) return !0;
  if (!A(t) || ft(t)) return !1;
  const e = t.getFirstChild(), n = e === null || Vn(e) || I(e) || e.isInline();
  return !t.isInline() && t.canBeEmpty() !== !1 && n;
}
function ou(t, e) {
  let n = t;
  for (; n !== null && n.getParent() !== null && !e(n); ) n = n.getParentOrThrow();
  return e(n) ? n : null;
}
function Uy(t, e, n, r, o, i) {
  let s = t.getFirstChild();
  for (; s !== null; ) {
    const l = s.__key;
    s.__parent === e && (A(s) && Uy(s, l, n, r, o, i), n.has(l) || i.delete(l), o.push(l)), s = s.getNextSibling();
  }
}
let Gn, tt, Fi, pa, mc, yc, Cr, Bt, _c, Li, Fe = "", qe = "", Lt = null, dn = "", Wy = !1, rf = !1, Ls = null;
function vl(t, e) {
  const n = Cr.get(t);
  if (e !== null) {
    const r = wc(t);
    r.parentNode === e && e.removeChild(r);
  }
  if (Bt.has(t) || tt._keyToDOMMap.delete(t), A(n)) {
    const r = wl(n, Cr);
    vc(r, 0, r.length - 1, null);
  }
  n !== void 0 && tf(Li, Fi, pa, n, "destroyed");
}
function vc(t, e, n, r) {
  let o = e;
  for (; o <= n; ++o) {
    const i = t[o];
    i !== void 0 && vl(i, r);
  }
}
function or(t, e) {
  t.setProperty("text-align", e);
}
const R1 = "40px";
function Hy(t, e) {
  const n = Gn.theme.indent;
  if (typeof n == "string") {
    const o = t.classList.contains(n);
    e > 0 && !o ? t.classList.add(n) : e < 1 && o && t.classList.remove(n);
  }
  const r = getComputedStyle(t).getPropertyValue("--lexical-indent-base-value") || R1;
  t.style.setProperty("padding-inline-start", e === 0 ? "" : `calc(${e} * ${r})`);
}
function Vy(t, e) {
  const n = t.style;
  e === 0 ? or(n, "") : e === Wd ? or(n, "left") : e === Hd ? or(n, "center") : e === Vd ? or(n, "right") : e === Kd ? or(n, "justify") : e === Qd ? or(n, "start") : e === Gd && or(n, "end");
}
function xl(t, e, n) {
  const r = Bt.get(t);
  r === void 0 && B(60);
  const o = r.createDOM(Gn, tt);
  if (function(i, s, l) {
    const a = l._keyToDOMMap;
    s["__lexicalKey_" + l._key] = i, a.set(i, s);
  }(t, o, tt), I(r) ? o.setAttribute("data-lexical-text", "true") : ae(r) && o.setAttribute("data-lexical-decorator", "true"), A(r)) {
    const i = r.__indent, s = r.__size;
    if (i !== 0 && Hy(o, i), s !== 0) {
      const a = s - 1;
      (function(u, c, p, d) {
        const m = qe;
        qe = "", xc(u, p, 0, c, d, null), Qy(p, d), qe = m;
      })(wl(r, Bt), a, r, o);
    }
    const l = r.__format;
    l !== 0 && Vy(o, l), r.isInline() || Ky(null, r, o), ca(r) && (Fe += Sn, dn += Sn);
  } else {
    const i = r.getTextContent();
    if (ae(r)) {
      const s = r.decorate(tt, Gn);
      s !== null && Gy(t, s), o.contentEditable = "false";
    } else I(r) && (r.isDirectionless() || (qe += i));
    Fe += i, dn += i;
  }
  if (e !== null) if (n != null) e.insertBefore(o, n);
  else {
    const i = e.__lexicalLineBreak;
    i != null ? e.insertBefore(o, i) : e.appendChild(o);
  }
  return tf(Li, Fi, pa, r, "created"), o;
}
function xc(t, e, n, r, o, i) {
  const s = Fe;
  Fe = "";
  let l = n;
  for (; l <= r; ++l) {
    xl(t[l], o, i);
    const a = Bt.get(t[l]);
    a !== null && Lt === null && I(a) && (Lt = a.getFormat());
  }
  ca(e) && (Fe += Sn), o.__lexicalTextContent = Fe, Fe = s + Fe;
}
function Qp(t, e) {
  const n = e.get(t);
  return Vn(n) || ae(n) && n.isInline();
}
function Ky(t, e, n) {
  const r = t !== null && (t.__size === 0 || Qp(t.__last, Cr)), o = e.__size === 0 || Qp(e.__last, Bt);
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
function Qy(t, e) {
  const n = e.__lexicalDirTextContent, r = e.__lexicalDir;
  if (n !== qe || r !== Ls) {
    const i = qe === "", s = i ? Ls : (o = qe, y1.test(o) ? "rtl" : _1.test(o) ? "ltr" : null);
    if (s !== r) {
      const l = e.classList, a = Gn.theme;
      let u = r !== null ? a[r] : void 0, c = s !== null ? a[s] : void 0;
      if (u !== void 0) {
        if (typeof u == "string") {
          const p = gl(u);
          u = a[r] = p;
        }
        l.remove(...u);
      }
      if (s === null || i && s === "ltr") e.removeAttribute("dir");
      else {
        if (c !== void 0) {
          if (typeof c == "string") {
            const p = gl(c);
            c = a[s] = p;
          }
          c !== void 0 && l.add(...c);
        }
        e.dir = s;
      }
      rf || (t.getWritable().__dir = s);
    }
    Ls = s, e.__lexicalDirTextContent = qe, e.__lexicalDir = s;
  }
  var o;
}
function M1(t, e, n) {
  const r = qe;
  var o;
  qe = "", Lt = null, function(i, s, l) {
    const a = Fe, u = i.__size, c = s.__size;
    if (Fe = "", u === 1 && c === 1) {
      const p = i.__first, d = s.__first;
      if (p === d) Yo(p, l);
      else {
        const h = wc(p), y = xl(d, null, null);
        l.replaceChild(y, h), vl(p, null);
      }
      const m = Bt.get(d);
      Lt === null && I(m) && (Lt = m.getFormat());
    } else {
      const p = wl(i, Cr), d = wl(s, Bt);
      if (u === 0) c !== 0 && xc(d, s, 0, c - 1, l, null);
      else if (c === 0) {
        if (u !== 0) {
          const m = l.__lexicalLineBreak == null;
          vc(p, 0, u - 1, m ? null : l), m && (l.textContent = "");
        }
      } else (function(m, h, y, v, _, f) {
        const g = v - 1, x = _ - 1;
        let w, S, C = (b = f, b.firstChild), k = 0, E = 0;
        for (var b; k <= g && E <= x; ) {
          const V = h[k], K = y[E];
          if (V === K) C = iu(Yo(K, f)), k++, E++;
          else {
            w === void 0 && (w = new Set(h)), S === void 0 && (S = new Set(y));
            const Y = S.has(V), ne = w.has(K);
            if (Y) if (ne) {
              const F = yl(tt, K);
              F === C ? C = iu(Yo(K, f)) : (C != null ? f.insertBefore(F, C) : f.appendChild(F), Yo(K, f)), k++, E++;
            } else xl(K, f, C), E++;
            else C = iu(wc(V)), vl(V, f), k++;
          }
          const Z = Bt.get(K);
          Z !== null && Lt === null && I(Z) && (Lt = Z.getFormat());
        }
        const R = k > g, z = E > x;
        if (R && !z) {
          const V = y[x + 1];
          xc(y, m, E, x, f, V === void 0 ? null : tt.getElementByKey(V));
        } else z && !R && vc(h, k, g, f);
      })(s, p, d, u, c, l);
    }
    ca(s) && (Fe += Sn), l.__lexicalTextContent = Fe, Fe = a + Fe;
  }(t, e, n), Qy(e, n), Vt(o = e) && Lt != null && Lt !== o.__textFormat && o.setTextFormat(Lt), qe = r, Lt = null;
}
function wl(t, e) {
  const n = [];
  let r = t.__first;
  for (; r !== null; ) {
    const o = e.get(r);
    o === void 0 && B(101), n.push(r), r = o.__next;
  }
  return n;
}
function Yo(t, e) {
  const n = Cr.get(t);
  let r = Bt.get(t);
  n !== void 0 && r !== void 0 || B(61);
  const o = Wy || yc.has(t) || mc.has(t), i = yl(tt, t);
  if (n === r && !o) {
    if (A(n)) {
      const s = i.__lexicalTextContent;
      s !== void 0 && (Fe += s, dn += s);
      const l = i.__lexicalDirTextContent;
      l !== void 0 && (qe += l);
    } else {
      const s = n.getTextContent();
      I(n) && !n.isDirectionless() && (qe += s), dn += s, Fe += s;
    }
    return i;
  }
  if (n !== r && o && tf(Li, Fi, pa, r, "updated"), r.updateDOM(n, i, Gn)) {
    const s = xl(t, null, null);
    return e === null && B(62), e.replaceChild(s, i), vl(t, null), s;
  }
  if (A(n) && A(r)) {
    const s = r.__indent;
    s !== n.__indent && Hy(i, s);
    const l = r.__format;
    l !== n.__format && Vy(i, l), o && (M1(n, r, i), Ye(r) || r.isInline() || Ky(n, r, i)), ca(r) && (Fe += Sn, dn += Sn);
  } else {
    const s = r.getTextContent();
    if (ae(r)) {
      const l = r.decorate(tt, Gn);
      l !== null && Gy(t, l);
    } else I(r) && !r.isDirectionless() && (qe += s);
    Fe += s, dn += s;
  }
  if (!rf && Ye(r) && r.__cachedText !== dn) {
    const s = r.getWritable();
    s.__cachedText = dn, r = s;
  }
  return i;
}
function Gy(t, e) {
  let n = tt._pendingDecorators;
  const r = tt._decorators;
  if (n === null) {
    if (r[t] === e) return;
    n = Iy(tt);
  }
  n[t] = e;
}
function iu(t) {
  let e = t.nextSibling;
  return e !== null && e === tt._blockCursorElement && (e = e.nextSibling), e;
}
function z1(t, e, n, r, o, i) {
  Fe = "", dn = "", qe = "", Wy = r === ho, Ls = null, tt = n, Gn = n._config, Fi = n._nodes, pa = tt._listeners.mutation, mc = o, yc = i, Cr = t._nodeMap, Bt = e._nodeMap, rf = e._readOnly, _c = new Map(n._keyToDOMMap);
  const s = /* @__PURE__ */ new Map();
  return Li = s, Yo("root", null), tt = void 0, Fi = void 0, mc = void 0, yc = void 0, Cr = void 0, Bt = void 0, Gn = void 0, _c = void 0, Li = void 0, s;
}
function wc(t) {
  const e = _c.get(t);
  return e === void 0 && B(75, t), e;
}
const an = Object.freeze({}), Sc = 30, Cc = [["keydown", function(t, e) {
  if (ci = t.timeStamp, Jy = t.key, e.isComposing()) return;
  const { key: n, shiftKey: r, ctrlKey: o, metaKey: i, altKey: s } = t;
  U(e, Md, t) || n != null && (function(l, a, u, c) {
    return Wp(l) && !a && !c && !u;
  }(n, o, s, i) ? U(e, Xl, t) : function(l, a, u, c, p) {
    return Wp(l) && !c && !u && (a || p);
  }(n, o, r, s, i) ? U(e, qx, t) : function(l, a, u, c) {
    return Up(l) && !a && !c && !u;
  }(n, o, s, i) ? U(e, ql, t) : function(l, a, u, c, p) {
    return Up(l) && !c && !u && (a || p);
  }(n, o, r, s, i) ? U(e, e1, t) : /* @__PURE__ */ function(l, a, u) {
    return /* @__PURE__ */ function(c) {
      return c === "ArrowUp";
    }(l) && !a && !u;
  }(n, o, i) ? U(e, ea, t) : /* @__PURE__ */ function(l, a, u) {
    return /* @__PURE__ */ function(c) {
      return c === "ArrowDown";
    }(l) && !a && !u;
  }(n, o, i) ? U(e, ta, t) : function(l, a) {
    return Hp(l) && a;
  }(n, r) ? (di = !0, U(e, wr, t)) : /* @__PURE__ */ function(l) {
    return l === " ";
  }(n) ? U(e, ky, t) : function(l, a) {
    return Ft && a && l.toLowerCase() === "o";
  }(n, o) ? (t.preventDefault(), di = !0, U(e, Wn, !0)) : function(l, a) {
    return Hp(l) && !a;
  }(n, r) ? (di = !1, U(e, wr, t)) : function(l, a, u, c) {
    return Ft ? !a && !u && (zo(l) || l.toLowerCase() === "h" && c) : !(c || a || u) && zo(l);
  }(n, s, i, o) ? zo(n) ? U(e, wo, t) : (t.preventDefault(), U(e, nn, !0)) : /* @__PURE__ */ function(l) {
    return l === "Escape";
  }(n) ? U(e, na, t) : function(l, a, u, c, p) {
    return Ft ? !(u || c || p) && (jo(l) || l.toLowerCase() === "d" && a) : !(a || c || p) && jo(l);
  }(n, o, r, s, i) ? jo(n) ? U(e, ra, t) : (t.preventDefault(), U(e, nn, !1)) : function(l, a, u) {
    return zo(l) && (Ft ? a : u);
  }(n, s, o) ? (t.preventDefault(), U(e, po, !0)) : function(l, a, u) {
    return jo(l) && (Ft ? a : u);
  }(n, s, o) ? (t.preventDefault(), U(e, po, !1)) : function(l, a) {
    return Ft && a && zo(l);
  }(n, i) ? (t.preventDefault(), U(e, go, !0)) : function(l, a) {
    return Ft && a && jo(l);
  }(n, i) ? (t.preventDefault(), U(e, go, !1)) : function(l, a, u, c) {
    return l.toLowerCase() === "b" && !a && Jo(u, c);
  }(n, s, i, o) ? (t.preventDefault(), U(e, ht, "bold")) : function(l, a, u, c) {
    return l.toLowerCase() === "u" && !a && Jo(u, c);
  }(n, s, i, o) ? (t.preventDefault(), U(e, ht, "underline")) : function(l, a, u, c) {
    return l.toLowerCase() === "i" && !a && Jo(u, c);
  }(n, s, i, o) ? (t.preventDefault(), U(e, ht, "italic")) : /* @__PURE__ */ function(l, a, u, c) {
    return l === "Tab" && !a && !u && !c;
  }(n, s, o, i) ? U(e, zd, t) : function(l, a, u, c) {
    return l.toLowerCase() === "z" && !a && Jo(u, c);
  }(n, r, i, o) ? (t.preventDefault(), U(e, Yl, void 0)) : function(l, a, u, c) {
    return Ft ? l.toLowerCase() === "z" && u && a : l.toLowerCase() === "y" && c || l.toLowerCase() === "z" && c && a;
  }(n, r, i, o) ? (t.preventDefault(), U(e, Zl, void 0)) : $e(e._editorState._selection) ? function(l, a, u, c) {
    return !a && l.toLowerCase() === "c" && (Ft ? u : c);
  }(n, r, i, o) ? (t.preventDefault(), U(e, Vi, t)) : function(l, a, u, c) {
    return !a && l.toLowerCase() === "x" && (Ft ? u : c);
  }(n, r, i, o) ? (t.preventDefault(), U(e, sa, t)) : Vp(n, i, o) && (t.preventDefault(), U(e, cl, t)) : !Hn && Vp(n, i, o) && (t.preventDefault(), U(e, cl, t)), /* @__PURE__ */ function(l, a, u, c) {
    return l || a || u || c;
  }(o, r, s, i) && U(e, l1, t));
}], ["pointerdown", function(t, e) {
  const n = t.target, r = t.pointerType;
  n instanceof Node && r !== "touch" && mt(e, () => {
    ae(Wt(n)) || (Ec = !0);
  });
}], ["compositionstart", function(t, e) {
  mt(e, () => {
    const n = $();
    if (O(n) && !e.isComposing()) {
      const r = n.anchor, o = n.anchor.getNode();
      We(r.key), (t.timeStamp < ci + Sc || r.type === "element" || !n.isCollapsed() || o.getFormat() !== n.format || I(o) && o.getStyle() !== n.style) && U(e, pr, m1);
    }
  });
}], ["compositionend", function(t, e) {
  Hn ? Bo = !0 : mt(e, () => {
    su(e, t.data);
  });
}], ["input", function(t, e) {
  t.stopPropagation(), mt(e, () => {
    const n = $(), r = t.data, o = qy(t);
    if (r != null && O(n) && Xy(n, o, r, t.timeStamp, !1)) {
      Bo && (su(e, r), Bo = !1);
      const i = n.anchor.getNode(), s = rn(e._window);
      if (s === null) return;
      const l = n.isBackward(), a = l ? n.anchor.offset : n.focus.offset, u = l ? n.focus.offset : n.anchor.offset;
      dl && !n.isCollapsed() && I(i) && s.anchorNode !== null && i.getTextContent().slice(0, a) + r + i.getTextContent().slice(a + u) === zy(s.anchorNode) || U(e, pr, r);
      const c = r.length;
      Hn && c > 1 && t.inputType === "insertCompositionText" && !e.isComposing() && (n.anchor.offset -= c), Bd || aa || Ud || !e.isComposing() || (ci = 0, We(null));
    } else
      qd(!1, e, r !== null ? r : void 0), Bo && (su(e, r || void 0), Bo = !1);
    st(), Oy(Ae());
  }), Ir = null;
}], ["click", function(t, e) {
  mt(e, () => {
    const n = $(), r = rn(e._window), o = Co();
    if (r) {
      if (O(n)) {
        const i = n.anchor, s = i.getNode();
        i.type === "element" && i.offset === 0 && n.isCollapsed() && !Ye(s) && ye().getChildrenSize() === 1 && s.getTopLevelElementOrThrow().isEmpty() && o !== null && n.is(o) ? (r.removeAllRanges(), n.dirty = !0) : t.detail === 3 && !n.isCollapsed() && s !== n.focus.getNode() && (A(s) ? s.select(0) : s.getParentOrThrow().select(0));
      } else if (t.pointerType === "touch") {
        const i = r.anchorNode;
        if (i !== null) {
          const s = i.nodeType;
          (s === Ki || s === Xn) && Ie(af(o, r, e, t));
        }
      }
    }
    U(e, Jl, t);
  });
}], ["cut", an], ["copy", an], ["dragstart", an], ["dragover", an], ["dragend", an], ["paste", an], ["focus", an], ["blur", an], ["drop", an]];
dl && Cc.push(["beforeinput", (t, e) => function(n, r) {
  const o = n.inputType, i = qy(n);
  o === "deleteCompositionText" || Hn && By(r) || o !== "insertCompositionText" && mt(r, () => {
    const s = $();
    if (o === "deleteContentBackward") {
      if (s === null) {
        const m = Co();
        if (!O(m)) return;
        Ie(m.clone());
      }
      if (O(s)) {
        const m = s.anchor.key === s.focus.key;
        if (l = n.timeStamp, Jy === "MediaLast" && l < ci + Sc && r.isComposing() && m) {
          if (We(null), ci = 0, setTimeout(() => {
            mt(r, () => {
              We(null);
            });
          }, Sc), O(s)) {
            const h = s.anchor.getNode();
            h.markDirty(), s.format = h.getFormat(), I(h) || B(142), s.style = h.getStyle();
          }
        } else {
          We(null), n.preventDefault();
          const h = s.anchor.getNode().getTextContent(), y = s.anchor.offset === 0 && s.focus.offset === h.length;
          d1 && m && !y || U(r, nn, !0);
        }
        return;
      }
    }
    var l;
    if (!O(s)) return;
    const a = n.data;
    Ir !== null && qd(!1, r, Ir), s.dirty && Ir === null || !s.isCollapsed() || Ye(s.anchor.getNode()) || i === null || s.applyDOMRange(i), Ir = null;
    const u = s.anchor, c = s.focus, p = u.getNode(), d = c.getNode();
    if (o !== "insertText" && o !== "insertTranspose") switch (n.preventDefault(), o) {
      case "insertFromYank":
      case "insertFromDrop":
      case "insertReplacementText":
        U(r, pr, n);
        break;
      case "insertFromComposition":
        We(null), U(r, pr, n);
        break;
      case "insertLineBreak":
        We(null), U(r, Wn, !1);
        break;
      case "insertParagraph":
        We(null), di && !aa ? (di = !1, U(r, Wn, !1)) : U(r, fo, void 0);
        break;
      case "insertFromPaste":
      case "insertFromPasteAsQuotation":
        U(r, xo, n);
        break;
      case "deleteByComposition":
        (function(m, h) {
          return m !== h || A(m) || A(h) || !m.isToken() || !h.isToken();
        })(p, d) && U(r, ul, n);
        break;
      case "deleteByDrag":
      case "deleteByCut":
        U(r, ul, n);
        break;
      case "deleteContent":
        U(r, nn, !1);
        break;
      case "deleteWordBackward":
        U(r, po, !0);
        break;
      case "deleteWordForward":
        U(r, po, !1);
        break;
      case "deleteHardLineBackward":
      case "deleteSoftLineBackward":
        U(r, go, !0);
        break;
      case "deleteContentForward":
      case "deleteHardLineForward":
      case "deleteSoftLineForward":
        U(r, go, !1);
        break;
      case "formatStrikeThrough":
        U(r, ht, "strikethrough");
        break;
      case "formatBold":
        U(r, ht, "bold");
        break;
      case "formatItalic":
        U(r, ht, "italic");
        break;
      case "formatUnderline":
        U(r, ht, "underline");
        break;
      case "historyUndo":
        U(r, Yl, void 0);
        break;
      case "historyRedo":
        U(r, Zl, void 0);
    }
    else {
      if (a === `
`) n.preventDefault(), U(r, Wn, !1);
      else if (a === Sn) n.preventDefault(), U(r, fo, void 0);
      else if (a == null && n.dataTransfer) {
        const m = n.dataTransfer.getData("text/plain");
        n.preventDefault(), s.insertRawText(m);
      } else a != null && Xy(s, i, a, n.timeStamp, !0) ? (n.preventDefault(), U(r, pr, a)) : Ir = a;
      Yy = n.timeStamp;
    }
  });
}(t, e)]);
let ci = 0, Jy = null, Yy = 0, Ir = null;
const Sl = /* @__PURE__ */ new WeakMap();
let kc = !1, Ec = !1, di = !1, Bo = !1, Zy = [0, "", 0, "root", 0];
function Xy(t, e, n, r, o) {
  const i = t.anchor, s = t.focus, l = i.getNode(), a = Ae(), u = rn(a._window), c = u !== null ? u.anchorNode : null, p = i.key, d = a.getElementByKey(p), m = n.length;
  return p !== s.key || !I(l) || (!o && (!dl || Yy < r + 50) || l.isDirty() && m < 2 || Ry(n)) && i.offset !== s.offset && !l.isComposing() || Fr(l) || l.isDirty() && m > 1 || (o || !dl) && d !== null && !l.isComposing() && c !== hl(d) || u !== null && e !== null && (!e.collapsed || e.startContainer !== u.anchorNode || e.startOffset !== u.anchorOffset) || l.getFormat() !== t.format || l.getStyle() !== t.style || P1(t, l);
}
function Gp(t, e) {
  return t !== null && t.nodeValue !== null && t.nodeType === Xn && e !== 0 && e !== t.nodeValue.length;
}
function Jp(t, e, n) {
  const { anchorNode: r, anchorOffset: o, focusNode: i, focusOffset: s } = t;
  kc && (kc = !1, Gp(r, o) && Gp(i, s)) || mt(e, () => {
    if (!n) return void Ie(null);
    if (!Qi(e, r, i)) return;
    const l = $();
    if (O(l)) {
      const a = l.anchor, u = a.getNode();
      if (l.isCollapsed()) {
        t.type === "Range" && t.anchorNode === t.focusNode && (l.dirty = !0);
        const c = fa(e).event, p = c ? c.timeStamp : performance.now(), [d, m, h, y, v] = Zy, _ = ye(), f = e.isComposing() === !1 && _.getTextContent() === "";
        if (p < v + 200 && a.offset === h && a.key === y) l.format = d, l.style = m;
        else if (a.type === "text") I(u) || B(141), l.format = u.getFormat(), l.style = u.getStyle();
        else if (a.type === "element" && !f) {
          const g = a.getNode();
          g instanceof ko && g.getChildrenSize() === 0 ? l.format = g.getTextFormat() : l.format = 0, l.style = "";
        }
      } else {
        const c = a.key, p = l.focus.key, d = l.getNodes(), m = d.length, h = l.isBackward(), y = h ? s : o, v = h ? o : s, _ = h ? p : c, f = h ? c : p;
        let g = h1, x = !1;
        for (let w = 0; w < m; w++) {
          const S = d[w], C = S.getTextContentSize();
          if (I(S) && C !== 0 && !(w === 0 && S.__key === _ && y === C || w === m - 1 && S.__key === f && v === 0) && (x = !0, g &= S.getFormat(), g === 0)) break;
        }
        l.format = x ? g : 0;
      }
    }
    U(e, Nr, void 0);
  });
}
function qy(t) {
  if (!t.getTargetRanges) return null;
  const e = t.getTargetRanges();
  return e.length === 0 ? null : e[0];
}
function su(t, e) {
  const n = t._compositionKey;
  if (We(null), n !== null && e != null) {
    if (e === "") {
      const r = Ee(n), o = hl(t.getElementByKey(n));
      return void (o !== null && o.nodeValue !== null && I(r) && ef(r, o.nodeValue, null, null, !0));
    }
    if (e[e.length - 1] === `
`) {
      const r = $();
      if (O(r)) {
        const o = r.focus;
        return r.anchor.set(o.key, o.offset, o.type), void U(t, wr, null);
      }
    }
  }
  qd(!0, t, e);
}
function e_(t) {
  let e = t.__lexicalEventHandles;
  return e === void 0 && (e = [], t.__lexicalEventHandles = e), e;
}
const ro = /* @__PURE__ */ new Map();
function t_(t) {
  const e = t.target, n = rn(e == null ? null : e.nodeType === 9 ? e.defaultView : e.ownerDocument.defaultView);
  if (n === null) return;
  const r = Fy(n.anchorNode);
  if (r === null) return;
  Ec && (Ec = !1, mt(r, () => {
    const u = Co(), c = n.anchorNode;
    if (c === null) return;
    const p = c.nodeType;
    p !== Ki && p !== Xn || Ie(af(u, n, r, t));
  }));
  const o = Xd(r), i = o[o.length - 1], s = i._key, l = ro.get(s), a = l || i;
  a !== r && Jp(n, a, !1), Jp(n, r, !0), r !== i ? ro.set(s, r) : l && ro.delete(s);
}
function Yp(t) {
  t._lexicalHandled = !0;
}
function Zp(t) {
  return t._lexicalHandled === !0;
}
function j1(t) {
  const e = t.ownerDocument, n = Sl.get(e);
  n === void 0 && B(162);
  const r = n - 1;
  r >= 0 || B(164), Sl.set(e, r), r === 0 && e.removeEventListener("selectionchange", t_);
  const o = t.__lexicalEditor;
  o != null && (function(s) {
    if (s._parentEditor !== null) {
      const l = Xd(s), a = l[l.length - 1]._key;
      ro.get(a) === s && ro.delete(a);
    } else ro.delete(s._key);
  }(o), t.__lexicalEditor = null);
  const i = e_(t);
  for (let s = 0; s < i.length; s++) i[s]();
  t.__lexicalEventHandles = [];
}
function Tc(t, e, n) {
  st();
  const r = t.__key, o = t.getParent();
  if (o === null) return;
  const i = function(l) {
    const a = $();
    if (!O(a) || !A(l)) return a;
    const { anchor: u, focus: c } = a, p = u.getNode(), d = c.getNode();
    return _l(p, l) && u.set(l.__key, 0, "element"), _l(d, l) && c.set(l.__key, 0, "element"), a;
  }(t);
  let s = !1;
  if (O(i) && e) {
    const l = i.anchor, a = i.focus;
    l.key === r && (kl(l, t, o, t.getPreviousSibling(), t.getNextSibling()), s = !0), a.key === r && (kl(a, t, o, t.getPreviousSibling(), t.getNextSibling()), s = !0);
  } else $e(i) && e && t.isSelected() && t.selectPrevious();
  if (O(i) && e && !s) {
    const l = t.getIndexWithinParent();
    gr(t), Cl(i, o, l, -1);
  } else gr(t);
  n || ft(o) || o.canBeEmpty() || !o.isEmpty() || Tc(o, e), e && Ye(o) && o.isEmpty() && o.selectEnd();
}
class ga {
  static getType() {
    B(64, this.name);
  }
  static clone(e) {
    B(65, this.name);
  }
  constructor(e) {
    this.__type = this.constructor.getType(), this.__parent = null, this.__prev = null, this.__next = null, O1(this, e);
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
      const n = Ee(e);
      if (n === null) break;
      e = n.__parent;
    }
    return !1;
  }
  isSelected(e) {
    const n = e || $();
    if (n == null) return !1;
    const r = n.getNodes().some((o) => o.__key === this.__key);
    return (I(this) || !O(n) || n.anchor.type !== "element" || n.focus.type !== "element" || n.anchor.key !== n.focus.key || n.anchor.offset !== n.focus.offset) && r;
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
    return e === null ? null : Ee(e);
  }
  getParentOrThrow() {
    const e = this.getParent();
    return e === null && B(66, this.__key), e;
  }
  getTopLevelElement() {
    let e = this;
    for (; e !== null; ) {
      const n = e.getParent();
      if (ft(n)) return A(e) || B(138), e;
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
    return e === null ? null : Ee(e);
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
    return e === null ? null : Ee(e);
  }
  getNextSiblings() {
    const e = [];
    let n = this.getNextSibling();
    for (; n !== null; ) e.push(n), n = n.getNextSibling();
    return e;
  }
  getCommonAncestor(e) {
    const n = this.getParents(), r = e.getParents();
    A(this) && n.unshift(this), A(e) && r.unshift(e);
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
      const l = A(i) ? n ? i.getFirstChild() : i.getLastChild() : null;
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
    const e = Ae()._dirtyLeaves;
    return e !== null && e.has(this.__key);
  }
  getLatest() {
    const e = Ee(this.__key);
    return e === null && B(113), e;
  }
  getWritable() {
    st();
    const e = ln(), n = Ae(), r = e._nodeMap, o = this.__key, i = this.getLatest(), s = i.__parent, l = n._cloneNotNeeded, a = $();
    if (a !== null && a.setCachedNodes(null), l.has(o)) return ml(i), i;
    const u = i.constructor.clone(i);
    return u.__parent = s, u.__next = i.__next, u.__prev = i.__prev, A(i) && A(u) ? (Vt(i) && Vt(u) && (u.__textFormat = i.__textFormat), u.__first = i.__first, u.__last = i.__last, u.__size = i.__size, u.__indent = i.__indent, u.__format = i.__format, u.__dir = i.__dir) : I(i) && I(u) && (u.__format = i.__format, u.__style = i.__style, u.__mode = i.__mode, u.__detail = i.__detail), l.add(o), u.__key = o, ml(u), r.set(o, u), u;
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
    Tc(this, !0, e);
  }
  replace(e, n) {
    st();
    let r = $();
    r !== null && (r = r.clone()), nu(this, e);
    const o = this.getLatest(), i = this.__key, s = e.__key, l = e.getWritable(), a = this.getParentOrThrow().getWritable(), u = a.__size;
    gr(l);
    const c = o.getPreviousSibling(), p = o.getNextSibling(), d = o.__prev, m = o.__next, h = o.__parent;
    if (Tc(o, !1, !0), c === null ? a.__first = s : c.getWritable().__next = s, l.__prev = d, p === null ? a.__last = s : p.getWritable().__prev = s, l.__next = m, l.__parent = h, a.__size = u, n && (A(this) && A(l) || B(139), this.getChildren().forEach((y) => {
      l.append(y);
    })), O(r)) {
      Ie(r);
      const y = r.anchor, v = r.focus;
      y.key === i && ng(y, l), v.key === i && ng(v, l);
    }
    return Fn() === i && We(s), l;
  }
  insertAfter(e, n = !0) {
    st(), nu(this, e);
    const r = this.getWritable(), o = e.getWritable(), i = o.getParent(), s = $();
    let l = !1, a = !1;
    if (i !== null) {
      const m = e.getIndexWithinParent();
      if (gr(o), O(s)) {
        const h = i.__key, y = s.anchor, v = s.focus;
        l = y.type === "element" && y.key === h && y.offset === m + 1, a = v.type === "element" && v.key === h && v.offset === m + 1;
      }
    }
    const u = this.getNextSibling(), c = this.getParentOrThrow().getWritable(), p = o.__key, d = r.__next;
    if (u === null ? c.__last = p : u.getWritable().__prev = p, c.__size++, r.__next = p, o.__next = d, o.__prev = r.__key, o.__parent = r.__parent, n && O(s)) {
      const m = this.getIndexWithinParent();
      Cl(s, c, m + 1);
      const h = c.__key;
      l && s.anchor.set(h, m + 2, "element"), a && s.focus.set(h, m + 2, "element");
    }
    return e;
  }
  insertBefore(e, n = !0) {
    st(), nu(this, e);
    const r = this.getWritable(), o = e.getWritable(), i = o.__key;
    gr(o);
    const s = this.getPreviousSibling(), l = this.getParentOrThrow().getWritable(), a = r.__prev, u = this.getIndexWithinParent();
    s === null ? l.__first = i : s.getWritable().__next = i, l.__size++, r.__prev = i, o.__prev = a, o.__next = r.__key, o.__parent = r.__parent;
    const c = $();
    return n && O(c) && Cl(c, this.getParentOrThrow(), u), e;
  }
  isParentRequired() {
    return !1;
  }
  createParentElementNode() {
    return de();
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
    if (A(r)) return r.select();
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
    if (A(r)) return r.select(0, 0);
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
class Gi extends ga {
  static getType() {
    return "linebreak";
  }
  static clone(e) {
    return new Gi(e.__key);
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
        if (o === n || o.nextSibling === n && Xp(o)) {
          const i = r.lastChild;
          if (i === n || i.previousSibling === n && Xp(i)) return !0;
        }
      }
      return !1;
    }(e) ? null : { conversion: B1, priority: 0 } };
  }
  static importJSON(e) {
    return Ht();
  }
  exportJSON() {
    return { type: "linebreak", version: 1 };
  }
}
function B1(t) {
  return { node: Ht() };
}
function Ht() {
  return Be(new Gi());
}
function Vn(t) {
  return t instanceof Gi;
}
function Xp(t) {
  return t.nodeType === Xn && /^( |\t|\r?\n)+$/.test(t.textContent || "");
}
function lu(t, e) {
  return 16 & e ? "code" : 128 & e ? "mark" : 32 & e ? "sub" : 64 & e ? "sup" : null;
}
function au(t, e) {
  return 1 & e ? "strong" : 2 & e ? "em" : "span";
}
function n_(t, e, n, r, o) {
  const i = r.classList;
  let s = ui(o, "base");
  s !== void 0 && i.add(...s), s = ui(o, "underlineStrikethrough");
  let l = !1;
  const a = e & pl && e & fl;
  s !== void 0 && (n & pl && n & fl ? (l = !0, a || i.add(...s)) : a && i.remove(...s));
  for (const u in yn) {
    const c = yn[u];
    if (s = ui(o, u), s !== void 0) if (n & c) {
      if (l && (u === "underline" || u === "strikethrough")) {
        e & c && i.remove(...s);
        continue;
      }
      e & c && (!a || u !== "underline") && u !== "strikethrough" || i.add(...s);
    } else e & c && i.remove(...s);
  }
}
function r_(t, e, n) {
  const r = e.firstChild, o = n.isComposing(), i = t + (o ? ua : "");
  if (r == null) e.textContent = i;
  else {
    const s = r.nodeValue;
    if (s !== i) if (o || Hn) {
      const [l, a, u] = function(c, p) {
        const d = c.length, m = p.length;
        let h = 0, y = 0;
        for (; h < d && h < m && c[h] === p[h]; ) h++;
        for (; y + h < d && y + h < m && c[d - y - 1] === p[m - y - 1]; ) y++;
        return [h, d - h - y, p.slice(h, m - y)];
      }(s, i);
      a !== 0 && r.deleteData(l, a), r.insertData(l, u);
    } else r.nodeValue = i;
  }
}
function qp(t, e, n, r, o, i) {
  r_(o, t, e);
  const s = i.theme.text;
  s !== void 0 && n_(0, 0, r, t, s);
}
function ys(t, e) {
  const n = document.createElement(e);
  return n.appendChild(t), n;
}
class qn extends ga {
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
    return S1[e.__mode];
  }
  getStyle() {
    return this.getLatest().__style;
  }
  isToken() {
    return this.getLatest().__mode === 1;
  }
  isComposing() {
    return this.__key === Fn();
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
    const n = yn[e];
    return !!(this.getFormat() & n);
  }
  isSimpleText() {
    return this.__type === "text" && this.__mode === 0;
  }
  getTextContent() {
    return this.getLatest().__text;
  }
  getFormatFlags(e, n) {
    return hc(this.getLatest().__format, e, n);
  }
  canHaveFormat() {
    return !0;
  }
  createDOM(e, n) {
    const r = this.__format, o = lu(0, r), i = au(0, r), s = o === null ? i : o, l = document.createElement(s);
    let a = l;
    this.hasFormat("code") && l.setAttribute("spellcheck", "false"), o !== null && (a = document.createElement(i), l.appendChild(a)), qp(a, this, 0, r, this.__text, e);
    const u = this.__style;
    return u !== "" && (l.style.cssText = u), l;
  }
  updateDOM(e, n, r) {
    const o = this.__text, i = e.__format, s = this.__format, l = lu(0, i), a = lu(0, s), u = au(0, i), c = au(0, s);
    if ((l === null ? u : l) !== (a === null ? c : a)) return !0;
    if (l === a && u !== c) {
      const y = n.firstChild;
      y == null && B(48);
      const v = document.createElement(c);
      return qp(v, this, 0, s, o, r), n.replaceChild(v, y), !1;
    }
    let p = n;
    a !== null && l !== null && (p = n.firstChild, p == null && B(49)), r_(o, p, this);
    const d = r.theme.text;
    d !== void 0 && i !== s && n_(0, i, s, p, d);
    const m = e.__style, h = this.__style;
    return m !== h && (n.style.cssText = h), !1;
  }
  static importDOM() {
    return { "#text": () => ({ conversion: V1, priority: 0 }), b: () => ({ conversion: W1, priority: 0 }), code: () => ({ conversion: En, priority: 0 }), em: () => ({ conversion: En, priority: 0 }), i: () => ({ conversion: En, priority: 0 }), s: () => ({ conversion: En, priority: 0 }), span: () => ({ conversion: U1, priority: 0 }), strong: () => ({ conversion: En, priority: 0 }), sub: () => ({ conversion: En, priority: 0 }), sup: () => ({ conversion: En, priority: 0 }), u: () => ({ conversion: En, priority: 0 }) };
  }
  static importJSON(e) {
    const n = le(e.text);
    return n.setFormat(e.format), n.setDetail(e.detail), n.setMode(e.mode), n.setStyle(e.style), n;
  }
  exportDOM(e) {
    let { element: n } = super.exportDOM(e);
    return n !== null && sn(n) || B(132), n.style.whiteSpace = "pre-wrap", this.hasFormat("bold") && (n = ys(n, "b")), this.hasFormat("italic") && (n = ys(n, "i")), this.hasFormat("strikethrough") && (n = ys(n, "s")), this.hasFormat("underline") && (n = ys(n, "u")), { element: n };
  }
  exportJSON() {
    return { detail: this.getDetail(), format: this.getFormat(), mode: this.getMode(), style: this.getStyle(), text: this.getTextContent(), type: "text", version: 1 };
  }
  selectionTransform(e, n) {
  }
  setFormat(e) {
    const n = this.getWritable();
    return n.__format = typeof e == "string" ? yn[e] : e, n;
  }
  setDetail(e) {
    const n = this.getWritable();
    return n.__detail = typeof e == "string" ? v1[e] : e, n;
  }
  setStyle(e) {
    const n = this.getWritable();
    return n.__style = e, n;
  }
  toggleFormat(e) {
    const n = hc(this.getFormat(), e, null);
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
    const n = w1[e];
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
    if (!O(i)) return s_(l, r, l, o, "text", "text");
    {
      const a = Fn();
      a !== i.anchor.key && a !== i.focus.key || We(l), i.setTextNodeRange(this, r, this, o);
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
    if (o && O(u)) {
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
    const n = this.getLatest(), r = n.getTextContent(), o = n.__key, i = Fn(), s = new Set(e), l = [], a = r.length;
    let u = "";
    for (let C = 0; C < a; C++) u !== "" && s.has(C) && (l.push(u), u = ""), u += r[C];
    u !== "" && l.push(u);
    const c = l.length;
    if (c === 0) return [];
    if (l[0] === r) return [n];
    const p = l[0], d = n.getParentOrThrow();
    let m;
    const h = n.getFormat(), y = n.getStyle(), v = n.__detail;
    let _ = !1;
    n.isSegmented() ? (m = le(p), m.__format = h, m.__style = y, m.__detail = v, _ = !0) : (m = n.getWritable(), m.__text = p);
    const f = $(), g = [m];
    let x = p.length;
    for (let C = 1; C < c; C++) {
      const k = l[C], E = k.length, b = le(k).getWritable();
      b.__format = h, b.__style = y, b.__detail = v;
      const R = b.__key, z = x + E;
      if (O(f)) {
        const V = f.anchor, K = f.focus;
        V.key === o && V.type === "text" && V.offset > x && V.offset <= z && (V.key = R, V.offset -= x, f.dirty = !0), K.key === o && K.type === "text" && K.offset > x && K.offset <= z && (K.key = R, K.offset -= x, f.dirty = !0);
      }
      i === o && We(R), x = z, g.push(b);
    }
    (function(C) {
      const k = C.getPreviousSibling(), E = C.getNextSibling();
      k !== null && ml(k), E !== null && ml(E);
    })(this);
    const w = d.getWritable(), S = this.getIndexWithinParent();
    return _ ? (w.splice(S, 0, g), this.remove()) : w.splice(S, 1, g), O(f) && Cl(f, d, S, c - 1), g;
  }
  mergeWithSibling(e) {
    const n = e === this.getPreviousSibling();
    n || e === this.getNextSibling() || B(50);
    const r = this.__key, o = e.__key, i = this.__text, s = i.length;
    Fn() === o && We(r);
    const l = $();
    if (O(l)) {
      const p = l.anchor, d = l.focus;
      p !== null && p.key === o && (ag(p, n, r, e, s), l.dirty = !0), d !== null && d.key === o && (ag(d, n, r, e, s), l.dirty = !0);
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
function U1(t) {
  return { forChild: of(t.style), node: null };
}
function W1(t) {
  const e = t, n = e.style.fontWeight === "normal";
  return { forChild: of(e.style, n ? void 0 : "bold"), node: null };
}
const eg = /* @__PURE__ */ new WeakMap();
function H1(t) {
  return t.nodeName === "PRE" || t.nodeType === Ki && t.style !== void 0 && t.style.whiteSpace !== void 0 && t.style.whiteSpace.startsWith("pre");
}
function V1(t) {
  const e = t;
  t.parentElement === null && B(129);
  let n = e.textContent || "";
  if (function(r) {
    let o, i = r.parentNode;
    const s = [r];
    for (; i !== null && (o = eg.get(i)) === void 0 && !H1(i); ) s.push(i), i = i.parentNode;
    const l = o === void 0 ? i : o;
    for (let a = 0; a < s.length; a++) eg.set(s[a], l);
    return l;
  }(e) !== null) {
    const r = n.split(/(\r?\n|\t)/), o = [], i = r.length;
    for (let s = 0; s < i; s++) {
      const l = r[s];
      l === `
` || l === `\r
` ? o.push(Ht()) : l === "	" ? o.push(So()) : l !== "" && o.push(le(l));
    }
    return { node: o };
  }
  if (n = n.replace(/\r/g, "").replace(/[ \t\n]+/g, " "), n === "") return { node: null };
  if (n[0] === " ") {
    let r = e, o = !0;
    for (; r !== null && (r = tg(r, !1)) !== null; ) {
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
    for (; r !== null && (r = tg(r, !0)) !== null; )
      if ((r.textContent || "").replace(/^( |\t|\r?\n)+/, "").length > 0) {
        o = !1;
        break;
      }
    o && (n = n.slice(0, n.length - 1));
  }
  return n === "" ? { node: null } : { node: le(n) };
}
function tg(t, e) {
  let n = t;
  for (; ; ) {
    let r;
    for (; (r = e ? n.nextSibling : n.previousSibling) === null; ) {
      const i = n.parentElement;
      if (i === null) return null;
      n = i;
    }
    if (n = r, n.nodeType === Ki) {
      const i = n.style.display;
      if (i === "" && !I1(n) || i !== "" && !i.startsWith("inline")) return null;
    }
    let o = n;
    for (; (o = e ? n.firstChild : n.lastChild) !== null; ) n = o;
    if (n.nodeType === Xn) return n;
    if (n.nodeName === "BR") return null;
  }
}
const K1 = { code: "code", em: "italic", i: "italic", s: "strikethrough", strong: "bold", sub: "subscript", sup: "superscript", u: "underline" };
function En(t) {
  const e = K1[t.nodeName.toLowerCase()];
  return e === void 0 ? { node: null } : { forChild: of(t.style, e), node: null };
}
function le(t = "") {
  return Be(new qn(t));
}
function I(t) {
  return t instanceof qn;
}
function of(t, e) {
  const n = t.fontWeight, r = t.textDecoration.split(" "), o = n === "700" || n === "bold", i = r.includes("line-through"), s = t.fontStyle === "italic", l = r.includes("underline"), a = t.verticalAlign;
  return (u) => (I(u) && (o && !u.hasFormat("bold") && u.toggleFormat("bold"), i && !u.hasFormat("strikethrough") && u.toggleFormat("strikethrough"), s && !u.hasFormat("italic") && u.toggleFormat("italic"), l && !u.hasFormat("underline") && u.toggleFormat("underline"), a !== "sub" || u.hasFormat("subscript") || u.toggleFormat("subscript"), a !== "super" || u.hasFormat("superscript") || u.toggleFormat("superscript"), e && !u.hasFormat(e) && u.toggleFormat(e)), u);
}
class Ji extends qn {
  static getType() {
    return "tab";
  }
  static clone(e) {
    const n = new Ji(e.__key);
    return n.__text = e.__text, n.__format = e.__format, n.__style = e.__style, n;
  }
  constructor(e) {
    super("	", e), this.__detail = 2;
  }
  static importDOM() {
    return null;
  }
  static importJSON(e) {
    const n = So();
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
function So() {
  return Be(new Ji());
}
function sf(t) {
  return t instanceof Ji;
}
class Q1 {
  constructor(e, n, r) {
    this._selection = null, this.key = e, this.offset = n, this.type = r;
  }
  is(e) {
    return this.key === e.key && this.offset === e.offset && this.type === e.type;
  }
  isBefore(e) {
    let n = this.getNode(), r = e.getNode();
    const o = this.offset, i = e.offset;
    if (A(n)) {
      const s = n.getDescendantByIndex(o);
      n = s ?? n;
    }
    if (A(r)) {
      const s = r.getDescendantByIndex(i);
      r = s ?? r;
    }
    return n === r ? o < i : n.isBefore(r);
  }
  getNode() {
    const e = Ee(this.key);
    return e === null && B(20), e;
  }
  set(e, n, r) {
    const o = this._selection, i = this.key;
    this.key = e, this.offset = n, this.type = r, Yi() || (Fn() === i && We(e), o !== null && (o.setCachedNodes(null), o.dirty = !0));
  }
}
function on(t, e, n) {
  return new Q1(t, e, n);
}
function uu(t, e) {
  let n = e.__key, r = t.offset, o = "element";
  if (I(e)) {
    o = "text";
    const i = e.getTextContentSize();
    r > i && (r = i);
  } else if (!A(e)) {
    const i = e.getNextSibling();
    if (I(i)) n = i.__key, r = 0, o = "text";
    else {
      const s = e.getParent();
      s && (n = s.__key, r = e.getIndexWithinParent() + 1);
    }
  }
  t.set(n, r, o);
}
function ng(t, e) {
  if (A(e)) {
    const n = e.getLastDescendant();
    A(n) || I(n) ? uu(t, n) : uu(t, e);
  } else uu(t, e);
}
function bn(t, e, n, r) {
  t.key = e, t.offset = n, t.type = r;
}
class ha {
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
    return new ha(new Set(this._nodes));
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
      const i = Ee(o);
      i !== null && r.push(i);
    }
    return Yi() || (this._cachedNodes = r), r;
  }
  getTextContent() {
    const e = this.getNodes();
    let n = "";
    for (let r = 0; r < e.length; r++) n += e[r].getTextContent();
    return n;
  }
}
function O(t) {
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
    return !!O(e) && this.anchor.is(e.anchor) && this.focus.is(e.focus) && this.format === e.format && this.style === e.style;
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
    if (A(l)) {
      const d = l.getDescendantByIndex(u);
      l = d ?? l;
    }
    if (A(a)) {
      let d = a.getDescendantByIndex(c);
      d !== null && d !== l && a.getChildAtIndex(c) === d && (d = d.getPreviousSibling()), a = d ?? a;
    }
    let p;
    return p = l.is(a) ? A(l) && l.getChildrenSize() > 0 ? [] : [l] : l.getNodesBetween(a), Yi() || (this._cachedNodes = p), p;
  }
  setTextNodeRange(e, n, r, o) {
    bn(this.anchor, e.__key, n, "text"), bn(this.focus, r.__key, o, "text"), this._cachedNodes = null, this.dirty = !0;
  }
  getTextContent() {
    const e = this.getNodes();
    if (e.length === 0) return "";
    const n = e[0], r = e[e.length - 1], o = this.anchor, i = this.focus, s = o.isBefore(i), [l, a] = Nc(this);
    let u = "", c = !0;
    for (let p = 0; p < e.length; p++) {
      const d = e[p];
      if (A(d) && !d.isInline()) c || (u += `
`), c = !d.isEmpty();
      else if (c = !1, I(d)) {
        let m = d.getTextContent();
        d === n ? d === r ? o.type === "element" && i.type === "element" && i.offset !== o.offset || (m = l < a ? m.slice(l, a) : m.slice(a, l)) : m = s ? m.slice(l) : m.slice(a) : d === r && (m = s ? m.slice(0, a) : m.slice(0, l)), u += m;
      } else !ae(d) && !Vn(d) || d === r && this.isCollapsed() || (u += d.getTextContent());
    }
    return u;
  }
  applyDOMRange(e) {
    const n = Ae(), r = n.getEditorState()._selection, o = i_(e.startContainer, e.startOffset, e.endContainer, e.endOffset, n, r);
    if (o === null) return;
    const [i, s] = o;
    bn(this.anchor, i.key, i.offset, i.type), bn(this.focus, s.key, s.offset, s.type), this._cachedNodes = null;
  }
  clone() {
    const e = this.anchor, n = this.focus;
    return new er(on(e.key, e.offset, e.type), on(n.key, n.offset, n.type), this.format, this.style);
  }
  toggleFormat(e) {
    this.format = hc(this.format, e, null), this.dirty = !0;
  }
  setStyle(e) {
    this.style = e, this.dirty = !0;
  }
  hasFormat(e) {
    const n = yn[e];
    return !!(this.format & n);
  }
  insertRawText(e) {
    const n = e.split(/(\r?\n|\t)/), r = [], o = n.length;
    for (let i = 0; i < o; i++) {
      const s = n[i];
      s === `
` || s === `\r
` ? r.push(Ht()) : s === "	" ? r.push(So()) : r.push(le(s));
    }
    this.insertNodes(r);
  }
  insertText(e) {
    const n = this.anchor, r = this.focus, o = this.format, i = this.style;
    let s = n, l = r;
    !this.isCollapsed() && r.isBefore(n) && (s = r, l = n), s.type === "element" && function(v, _, f, g) {
      const x = v.getNode(), w = x.getChildAtIndex(v.offset), S = le(), C = Ye(x) ? de().append(S) : S;
      S.setFormat(f), S.setStyle(g), w === null ? x.append(C) : w.insertBefore(C), v.is(_) && _.set(S.__key, 0, "text"), v.set(S.__key, 0, "text");
    }(s, l, o, i);
    const a = s.offset;
    let u = l.offset;
    const c = this.getNodes(), p = c.length;
    let d = c[0];
    I(d) || B(26);
    const m = d.getTextContent().length, h = d.getParentOrThrow();
    let y = c[p - 1];
    if (p === 1 && l.type === "element" && (u = m, l.set(s.key, u, "text")), this.isCollapsed() && a === m && (d.isSegmented() || d.isToken() || !d.canInsertTextAfter() || !h.canInsertTextAfter() && d.getNextSibling() === null)) {
      let v = d.getNextSibling();
      if (I(v) && v.canInsertTextBefore() && !Fr(v) || (v = le(), v.setFormat(o), h.canInsertTextAfter() ? d.insertAfter(v) : h.insertAfter(v)), v.select(0, 0), d = v, e !== "") return void this.insertText(e);
    } else if (this.isCollapsed() && a === 0 && (d.isSegmented() || d.isToken() || !d.canInsertTextBefore() || !h.canInsertTextBefore() && d.getPreviousSibling() === null)) {
      let v = d.getPreviousSibling();
      if (I(v) && !Fr(v) || (v = le(), v.setFormat(o), h.canInsertTextBefore() ? d.insertBefore(v) : h.insertBefore(v)), v.select(), d = v, e !== "") return void this.insertText(e);
    } else if (d.isSegmented() && a !== m) {
      const v = le(d.getTextContent());
      v.setFormat(o), d.replace(v), d = v;
    } else if (!this.isCollapsed() && e !== "") {
      const v = y.getParent();
      if (!h.canInsertTextBefore() || !h.canInsertTextAfter() || A(v) && (!v.canInsertTextBefore() || !v.canInsertTextAfter())) return this.insertText(""), o_(this.anchor, this.focus, null), void this.insertText(e);
    }
    if (p === 1) {
      if (d.isToken()) {
        const g = le(e);
        return g.select(), void d.replace(g);
      }
      const v = d.getFormat(), _ = d.getStyle();
      if (a !== u || v === o && _ === i) {
        if (sf(d)) {
          const g = le(e);
          return g.setFormat(o), g.setStyle(i), g.select(), void d.replace(g);
        }
      } else {
        if (d.getTextContent() !== "") {
          const g = le(e);
          if (g.setFormat(o), g.setStyle(i), g.select(), a === 0) d.insertBefore(g, !1);
          else {
            const [x] = d.splitText(a);
            x.insertAfter(g, !1);
          }
          return void (g.isComposing() && this.anchor.type === "text" && (this.anchor.offset -= e.length));
        }
        d.setFormat(o), d.setStyle(i);
      }
      const f = u - a;
      d = d.spliceText(a, f, e, !0), d.getTextContent() === "" ? d.remove() : this.anchor.type === "text" && (d.isComposing() ? this.anchor.offset -= e.length : (this.format = v, this.style = _));
    } else {
      const v = /* @__PURE__ */ new Set([...d.getParentKeys(), ...y.getParentKeys()]), _ = A(d) ? d : d.getParentOrThrow();
      let f = A(y) ? y : y.getParentOrThrow(), g = y;
      if (!_.is(f) && f.isInline()) do
        g = f, f = f.getParentOrThrow();
      while (f.isInline());
      if (l.type === "text" && (u !== 0 || y.getTextContent() === "") || l.type === "element" && y.getIndexWithinParent() < u) if (I(y) && !y.isToken() && u !== y.getTextContentSize()) {
        if (y.isSegmented()) {
          const k = le(y.getTextContent());
          y.replace(k), y = k;
        }
        Ye(l.getNode()) || l.type !== "text" || (y = y.spliceText(0, u, "")), v.add(y.__key);
      } else {
        const k = y.getParentOrThrow();
        k.canBeEmpty() || k.getChildrenSize() !== 1 ? y.remove() : k.remove();
      }
      else v.add(y.__key);
      const x = f.getChildren(), w = new Set(c), S = _.is(f), C = _.isInline() && d.getNextSibling() === null ? _ : d;
      for (let k = x.length - 1; k >= 0; k--) {
        const E = x[k];
        if (E.is(d) || A(E) && E.isParentOf(d)) break;
        E.isAttached() && (!w.has(E) || E.is(g) ? S || C.insertAfter(E, !1) : E.remove());
      }
      if (!S) {
        let k = f, E = null;
        for (; k !== null; ) {
          const b = k.getChildren(), R = b.length;
          (R === 0 || b[R - 1].is(E)) && (v.delete(k.__key), E = k), k = k.getParent();
        }
      }
      if (d.isToken()) if (a === m) d.select();
      else {
        const k = le(e);
        k.select(), d.replace(k);
      }
      else d = d.spliceText(a, m - a, e, !0), d.getTextContent() === "" ? d.remove() : d.isComposing() && this.anchor.type === "text" && (this.anchor.offset -= e.length);
      for (let k = 1; k < p; k++) {
        const E = c[k], b = E.__key;
        v.has(b) || E.remove();
      }
    }
  }
  removeText() {
    this.insertText("");
  }
  formatText(e) {
    if (this.isCollapsed()) return this.toggleFormat(e), void We(null);
    const n = this.getNodes(), r = [];
    for (const f of n) I(f) && r.push(f);
    const o = r.length;
    if (o === 0) return this.toggleFormat(e), void We(null);
    const i = this.anchor, s = this.focus, l = this.isBackward(), a = l ? s : i, u = l ? i : s;
    let c = 0, p = r[0], d = a.type === "element" ? 0 : a.offset;
    if (a.type === "text" && d === p.getTextContentSize() && (c = 1, p = r[1], d = 0), p == null) return;
    const m = p.getFormatFlags(e, null), h = o - 1;
    let y = r[h];
    const v = u.type === "text" ? u.offset : y.getTextContentSize();
    if (p.is(y)) {
      if (d === v) return;
      if (Fr(p) || d === 0 && v === p.getTextContentSize()) p.setFormat(m);
      else {
        const f = p.splitText(d, v), g = d === 0 ? f[0] : f[1];
        g.setFormat(m), a.type === "text" && a.set(g.__key, 0, "text"), u.type === "text" && u.set(g.__key, v - d, "text");
      }
      return void (this.format = m);
    }
    d === 0 || Fr(p) || ([, p] = p.splitText(d), d = 0), p.setFormat(m);
    const _ = y.getFormatFlags(e, m);
    v > 0 && (v === y.getTextContentSize() || Fr(y) || ([y] = y.splitText(v)), y.setFormat(_));
    for (let f = c + 1; f < h; f++) {
      const g = r[f], x = g.getFormatFlags(e, _);
      g.setFormat(x);
    }
    a.type === "text" && a.set(p.__key, d, "text"), u.type === "text" && u.set(y.__key, v, "text"), this.format = m | _;
  }
  insertNodes(e) {
    if (e.length === 0) return;
    if (this.anchor.key === "root") {
      this.insertParagraph();
      const h = $();
      return O(h) || B(134), h.insertNodes(e);
    }
    const n = ou((this.isBackward() ? this.focus : this.anchor).getNode(), Lr), r = e[e.length - 1];
    if ("__language" in n && A(n)) {
      if ("__language" in e[0]) this.insertText(e[0].getTextContent());
      else {
        const h = cu(this);
        n.splice(h, 0, e), r.selectEnd();
      }
      return;
    }
    if (!e.some((h) => (A(h) || ae(h)) && !h.isInline())) {
      A(n) || B(135);
      const h = cu(this);
      return n.splice(h, 0, e), void r.selectEnd();
    }
    const o = function(h) {
      const y = de();
      let v = null;
      for (let _ = 0; _ < h.length; _++) {
        const f = h[_], g = Vn(f);
        if (g || ae(f) && f.isInline() || A(f) && f.isInline() || I(f) || f.isParentRequired()) {
          if (v === null && (v = f.createParentElementNode(), y.append(v), g)) continue;
          v !== null && v.append(f);
        } else y.append(f), v = null;
      }
      return y;
    }(e), i = o.getLastDescendant(), s = o.getChildren(), l = (h) => "__value" in h && "__checked" in h, a = !A(n) || !n.isEmpty() ? this.insertParagraph() : null, u = s[s.length - 1];
    let c = s[0];
    var p;
    A(p = c) && Lr(p) && !p.isEmpty() && A(n) && (!n.isEmpty() || l(n)) && (A(n) || B(135), n.append(...c.getChildren()), c = s[1]), c && function(h, y, v) {
      const _ = y.getParentOrThrow().getLastChild();
      let f = y;
      const g = [y];
      for (; f !== _; ) f.getNextSibling() || B(140), f = f.getNextSibling(), g.push(f);
      let x = h;
      for (const w of g) x = x.insertAfter(w);
    }(n, c);
    const d = ou(i, Lr);
    a && A(d) && (l(a) || Lr(u)) && (d.append(...a.getChildren()), a.remove()), A(n) && n.isEmpty() && n.remove(), i.selectEnd();
    const m = A(n) ? n.getLastChild() : null;
    Vn(m) && d !== n && m.remove();
  }
  insertParagraph() {
    if (this.anchor.key === "root") {
      const s = de();
      return ye().splice(this.anchor.offset, 0, [s]), s.select(), s;
    }
    const e = cu(this), n = ou(this.anchor.getNode(), Lr);
    A(n) || B(136);
    const r = n.getChildAtIndex(e), o = r ? [r, ...r.getNextSiblings()] : [], i = n.insertNewAfter(this, !1);
    return i ? (i.append(...o), i.selectStart(), i) : null;
  }
  insertLineBreak(e) {
    const n = Ht();
    if (this.insertNodes([n]), e) {
      const r = n.getParentOrThrow(), o = n.getIndexWithinParent();
      r.select(o, o);
    }
  }
  extract() {
    const e = this.getNodes(), n = e.length, r = n - 1, o = this.anchor, i = this.focus;
    let s = e[0], l = e[r];
    const [a, u] = Nc(this);
    if (n === 0) return [];
    if (n === 1) {
      if (I(s) && !this.isCollapsed()) {
        const p = a > u ? u : a, d = a > u ? a : u, m = s.splitText(p, d), h = p === 0 ? m[0] : m[1];
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
      const p = l.getTextContent().length, d = c ? u : a;
      d === 0 ? e.pop() : d !== p && ([l] = l.splitText(d), e[r] = l);
    }
    return e;
  }
  modify(e, n, r) {
    const o = this.focus, i = this.anchor, s = e === "move", l = $i(o, n);
    if (ae(l) && !l.isIsolated()) {
      if (s && l.isKeyboardSelectable()) {
        const m = Ac();
        return m.add(l.__key), void Ie(m);
      }
      const d = n ? l.getPreviousSibling() : l.getNextSibling();
      if (I(d)) {
        const m = d.__key, h = n ? d.getTextContent().length : 0;
        return o.set(m, h, "text"), void (s && i.set(m, h, "text"));
      }
      {
        const m = l.getParentOrThrow();
        let h, y;
        return A(d) ? (y = d.__key, h = n ? d.getChildrenSize() : 0) : (h = l.getIndexWithinParent(), y = m.__key, n || h++), o.set(y, h, "element"), void (s && i.set(y, h, "element"));
      }
    }
    const a = Ae(), u = rn(a._window);
    if (!u) return;
    const c = a._blockCursorElement, p = a._rootElement;
    if (p === null || c === null || !A(l) || l.isInline() || l.canBeEmpty() || nf(c, a, p), function(d, m, h, y) {
      d.modify(m, h, y);
    }(u, e, n ? "backward" : "forward", r), u.rangeCount > 0) {
      const d = u.getRangeAt(0), m = this.anchor.getNode(), h = Ye(m) ? m : $1(m);
      if (this.applyDOMRange(d), this.dirty = !0, !s) {
        const y = this.getNodes(), v = [];
        let _ = !1;
        for (let f = 0; f < y.length; f++) {
          const g = y[f];
          _l(g, h) ? v.push(g) : _ = !0;
        }
        if (_ && v.length > 0) if (n) {
          const f = v[0];
          A(f) ? f.selectStart() : f.getParentOrThrow().selectStart();
        } else {
          const f = v[v.length - 1];
          A(f) ? f.selectEnd() : f.getParentOrThrow().selectEnd();
        }
        u.anchorNode === d.startContainer && u.anchorOffset === d.startOffset || function(f) {
          const g = f.focus, x = f.anchor, w = x.key, S = x.offset, C = x.type;
          bn(x, g.key, g.offset, g.type), bn(g, w, S, C), f._cachedNodes = null;
        }(this);
      }
    }
  }
  forwardDeletion(e, n, r) {
    if (!r && (e.type === "element" && A(n) && e.offset === n.getChildrenSize() || e.type === "text" && e.offset === n.getTextContentSize())) {
      const o = n.getParent(), i = n.getNextSibling() || (o === null ? null : o.getNextSibling());
      if (A(i) && i.isShadowRoot()) return !0;
    }
    return !1;
  }
  deleteCharacter(e) {
    const n = this.isCollapsed();
    if (this.isCollapsed()) {
      const r = this.anchor;
      let o = r.getNode();
      if (this.forwardDeletion(r, o, e)) return;
      const i = this.focus, s = $i(i, e);
      if (ae(s) && !s.isIsolated()) {
        if (s.isKeyboardSelectable() && A(o) && o.getChildrenSize() === 0) {
          o.remove();
          const l = Ac();
          l.add(s.__key), Ie(l);
        } else
          s.remove(), Ae().dispatchCommand(Nr, void 0);
        return;
      }
      if (!e && A(s) && A(o) && o.isEmpty()) return o.remove(), void s.selectStart();
      if (this.modify("extend", e, "character"), this.isCollapsed()) {
        if (e && r.offset === 0 && (r.type === "element" ? r.getNode() : r.getNode().getParentOrThrow()).collapseAtStart(this))
          return;
      } else {
        const l = i.type === "text" ? i.getNode() : null;
        if (o = r.type === "text" ? r.getNode() : null, l !== null && l.isSegmented()) {
          const a = i.offset, u = l.getTextContentSize();
          if (l.is(o) || e && a !== u || !e && a !== 0) return void og(l, e, a);
        } else if (o !== null && o.isSegmented()) {
          const a = r.offset, u = o.getTextContentSize();
          if (o.is(l) || e && a !== 0 || !e && a !== u) return void og(o, e, a);
        }
        (function(a, u) {
          const c = a.anchor, p = a.focus, d = c.getNode(), m = p.getNode();
          if (d === m && c.type === "text" && p.type === "text") {
            const h = c.offset, y = p.offset, v = h < y, _ = v ? h : y, f = v ? y : h, g = f - 1;
            _ !== g && (Ry(d.getTextContent().slice(_, f)) || (u ? p.offset = g : c.offset = g));
          }
        })(this, e);
      }
    }
    if (this.removeText(), e && !n && this.isCollapsed() && this.anchor.type === "element" && this.anchor.offset === 0) {
      const r = this.anchor.getNode();
      r.isEmpty() && Ye(r.getParent()) && r.getIndexWithinParent() === 0 && r.collapseAtStart(this);
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
  return t instanceof ha;
}
function rg(t) {
  const e = t.offset;
  if (t.type === "text") return e;
  const n = t.getNode();
  return e === n.getChildrenSize() ? n.getTextContent().length : 0;
}
function Nc(t) {
  const e = t.getStartEndPoints();
  if (e === null) return [0, 0];
  const [n, r] = e;
  return n.type === "element" && r.type === "element" && n.key === r.key && n.offset === r.offset ? [0, 0] : [rg(n), rg(r)];
}
function og(t, e, n) {
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
function ig(t, e, n, r) {
  let o, i = e;
  if (t.nodeType === Ki) {
    let s = !1;
    const l = t.childNodes, a = l.length, u = r._blockCursorElement;
    i === a && (s = !0, i = a - 1);
    let c = l[i], p = !1;
    if (c === u) c = l[i + 1], p = !0;
    else if (u !== null) {
      const d = u.parentNode;
      t === d && e > Array.prototype.indexOf.call(d.children, u) && i--;
    }
    if (o = Jr(c), I(o)) i = Bp(o, s);
    else {
      let d = Jr(t);
      if (d === null) return null;
      if (A(d)) {
        i = Math.min(d.getChildrenSize(), i);
        let m = d.getChildAtIndex(i);
        if (A(m) && function(h, y, v) {
          const _ = h.getParent();
          return v === null || _ === null || !_.canBeEmpty() || _ !== v.getNode();
        }(m, 0, n)) {
          const h = s ? m.getLastDescendant() : m.getFirstDescendant();
          h === null ? d = m : (m = h, d = A(m) ? m : m.getParentOrThrow()), i = 0;
        }
        I(m) ? (o = m, d = null, i = Bp(m, s)) : m !== d && s && !p && i++;
      } else {
        const m = d.getIndexWithinParent();
        i = e === 0 && ae(d) && Jr(t) === d ? m : m + 1, d = d.getParentOrThrow();
      }
      if (A(d)) return on(d.__key, i, "element");
    }
  } else o = Jr(t);
  return I(o) ? on(o.__key, i, "text") : null;
}
function sg(t, e, n) {
  const r = t.offset, o = t.getNode();
  if (r === 0) {
    const i = o.getPreviousSibling(), s = o.getParent();
    if (e) {
      if ((n || !e) && i === null && A(s) && s.isInline()) {
        const l = s.getPreviousSibling();
        I(l) && (t.key = l.__key, t.offset = l.getTextContent().length);
      }
    } else A(i) && !n && i.isInline() ? (t.key = i.__key, t.offset = i.getChildrenSize(), t.type = "element") : I(i) && (t.key = i.__key, t.offset = i.getTextContent().length);
  } else if (r === o.getTextContent().length) {
    const i = o.getNextSibling(), s = o.getParent();
    if (e && A(i) && i.isInline()) t.key = i.__key, t.offset = 0, t.type = "element";
    else if ((n || e) && i === null && A(s) && s.isInline() && !s.canInsertTextAfter()) {
      const l = s.getNextSibling();
      I(l) && (t.key = l.__key, t.offset = 0);
    }
  }
}
function o_(t, e, n) {
  if (t.type === "text" && e.type === "text") {
    const r = t.isBefore(e), o = t.is(e);
    sg(t, r, o), sg(e, !r, o), o && (e.key = t.key, e.offset = t.offset, e.type = t.type);
    const i = Ae();
    if (i.isComposing() && i._compositionKey !== t.key && O(n)) {
      const s = n.anchor, l = n.focus;
      bn(t, s.key, s.offset, s.type), bn(e, l.key, l.offset, l.type);
    }
  }
}
function i_(t, e, n, r, o, i) {
  if (t === null || n === null || !Qi(o, t, n)) return null;
  const s = ig(t, e, O(i) ? i.anchor : null, o);
  if (s === null) return null;
  const l = ig(n, r, O(i) ? i.focus : null, o);
  if (l === null) return null;
  if (s.type === "element" && l.type === "element") {
    const a = Jr(t), u = Jr(n);
    if (ae(a) && ae(u)) return null;
  }
  return o_(s, l, i), [s, l];
}
function bc(t) {
  return A(t) && !t.isInline();
}
function s_(t, e, n, r, o, i) {
  const s = ln(), l = new er(on(t, e, o), on(n, r, i), 0, "");
  return l.dirty = !0, s._selection = l, l;
}
function lf() {
  const t = on("root", 0, "element"), e = on("root", 0, "element");
  return new er(t, e, 0, "");
}
function Ac() {
  return new ha(/* @__PURE__ */ new Set());
}
function af(t, e, n, r) {
  const o = n._window;
  if (o === null) return null;
  const i = r || o.event, s = i ? i.type : void 0, l = s === "selectionchange", a = !gc && (l || s === "beforeinput" || s === "compositionstart" || s === "compositionend" || s === "click" && i && i.detail === 3 || s === "drop" || s === void 0);
  let u, c, p, d;
  if (O(t) && !a) return t.clone();
  if (e === null) return null;
  if (u = e.anchorNode, c = e.focusNode, p = e.anchorOffset, d = e.focusOffset, l && O(t) && !Qi(n, u, c)) return t.clone();
  const m = i_(u, p, c, d, n, t);
  if (m === null) return null;
  const [h, y] = m;
  return new er(h, y, O(t) ? t.format : 0, O(t) ? t.style : "");
}
function $() {
  return ln()._selection;
}
function Co() {
  return Ae()._editorState._selection;
}
function Cl(t, e, n, r = 1) {
  const o = t.anchor, i = t.focus, s = o.getNode(), l = i.getNode();
  if (!e.is(s) && !e.is(l)) return;
  const a = e.__key;
  if (t.isCollapsed()) {
    const u = o.offset;
    if (n <= u && r > 0 || n < u && r < 0) {
      const c = Math.max(0, u + r);
      o.set(a, c, "element"), i.set(a, c, "element"), lg(t);
    }
  } else {
    const u = t.isBackward(), c = u ? i : o, p = c.getNode(), d = u ? o : i, m = d.getNode();
    if (e.is(p)) {
      const h = c.offset;
      (n <= h && r > 0 || n < h && r < 0) && c.set(a, Math.max(0, h + r), "element");
    }
    if (e.is(m)) {
      const h = d.offset;
      (n <= h && r > 0 || n < h && r < 0) && d.set(a, Math.max(0, h + r), "element");
    }
  }
  lg(t);
}
function lg(t) {
  const e = t.anchor, n = e.offset, r = t.focus, o = r.offset, i = e.getNode(), s = r.getNode();
  if (t.isCollapsed()) {
    if (!A(i)) return;
    const l = i.getChildrenSize(), a = n >= l, u = a ? i.getChildAtIndex(l - 1) : i.getChildAtIndex(n);
    if (I(u)) {
      let c = 0;
      a && (c = u.getTextContentSize()), e.set(u.__key, c, "text"), r.set(u.__key, c, "text");
    }
  } else {
    if (A(i)) {
      const l = i.getChildrenSize(), a = n >= l, u = a ? i.getChildAtIndex(l - 1) : i.getChildAtIndex(n);
      if (I(u)) {
        let c = 0;
        a && (c = u.getTextContentSize()), e.set(u.__key, c, "text");
      }
    }
    if (A(s)) {
      const l = s.getChildrenSize(), a = o >= l, u = a ? s.getChildAtIndex(l - 1) : s.getChildAtIndex(o);
      if (I(u)) {
        let c = 0;
        a && (c = u.getTextContentSize()), r.set(u.__key, c, "text");
      }
    }
  }
}
function kl(t, e, n, r, o) {
  let i = null, s = 0, l = null;
  r !== null ? (i = r.__key, I(r) ? (s = r.getTextContentSize(), l = "text") : A(r) && (s = r.getChildrenSize(), l = "element")) : o !== null && (i = o.__key, I(o) ? l = "text" : A(o) && (l = "element")), i !== null && l !== null ? t.set(i, s, l) : (s = e.getIndexWithinParent(), s === -1 && (s = n.getChildrenSize()), t.set(n.__key, s, "element"));
}
function ag(t, e, n, r, o) {
  t.type === "text" ? (t.key = n, e || (t.offset += o)) : t.offset > r.getIndexWithinParent() && (t.offset -= 1);
}
function G1(t, e, n, r, o, i, s) {
  const l = r.anchorNode, a = r.focusNode, u = r.anchorOffset, c = r.focusOffset, p = document.activeElement;
  if (o.has("collaboration") && p !== i || p !== null && Yd(p)) return;
  if (!O(e)) return void (t !== null && Qi(n, l, a) && r.removeAllRanges());
  const d = e.anchor, m = e.focus, h = d.key, y = m.key, v = yl(n, h), _ = yl(n, y), f = d.offset, g = m.offset, x = e.format, w = e.style, S = e.isCollapsed();
  let C = v, k = _, E = !1;
  if (d.type === "text") {
    C = hl(v);
    const Z = d.getNode();
    E = Z.getFormat() !== x || Z.getStyle() !== w;
  } else O(t) && t.anchor.type === "text" && (E = !0);
  var b, R, z, V, K;
  if (m.type === "text" && (k = hl(_)), C !== null && k !== null && (S && (t === null || E || O(t) && (t.format !== x || t.style !== w)) && (b = x, R = w, z = f, V = h, K = performance.now(), Zy = [b, R, z, V, K]), u !== f || c !== g || l !== C || a !== k || r.type === "Range" && S || (p !== null && i.contains(p) || i.focus({ preventScroll: !0 }), d.type === "element"))) {
    try {
      r.setBaseAndExtent(C, f, k, g);
    } catch {
    }
    if (!o.has("skip-scroll-into-view") && e.isCollapsed() && i !== null && i === document.activeElement) {
      const Z = e instanceof er && e.anchor.type === "element" ? C.childNodes[f] || null : r.rangeCount > 0 ? r.getRangeAt(0) : null;
      if (Z !== null) {
        let Y;
        if (Z instanceof Text) {
          const ne = document.createRange();
          ne.selectNode(Z), Y = ne.getBoundingClientRect();
        } else Y = Z.getBoundingClientRect();
        (function(ne, F, W) {
          const j = W.ownerDocument, X = j.defaultView;
          if (X === null) return;
          let { top: J, bottom: ge } = F, ie = 0, Te = 0, se = W;
          for (; se !== null; ) {
            const Ne = se === j.body;
            if (Ne) ie = 0, Te = fa(ne).innerHeight;
            else {
              const P = se.getBoundingClientRect();
              ie = P.top, Te = P.bottom;
            }
            let _e = 0;
            if (J < ie ? _e = -(ie - J) : ge > Te && (_e = ge - Te), _e !== 0) if (Ne) X.scrollBy(0, _e);
            else {
              const P = se.scrollTop;
              se.scrollTop += _e;
              const L = se.scrollTop - P;
              J -= L, ge -= L;
            }
            if (Ne) break;
            se = da(se);
          }
        })(n, Y, i);
      }
    }
    kc = !0;
  }
}
function uf(t) {
  let e = $() || Co();
  e === null && (e = ye().selectEnd()), e.insertNodes(t);
}
function cu(t) {
  let e = t;
  t.isCollapsed() || e.removeText();
  const n = $();
  O(n) && (e = n), O(e) || B(161);
  const r = e.anchor;
  let o = r.getNode(), i = r.offset;
  for (; !Lr(o); ) [o, i] = J1(o, i);
  return i;
}
function J1(t, e) {
  const n = t.getParent();
  if (!n) {
    const o = de();
    return ye().append(o), o.select(), [ye(), 0];
  }
  if (I(t)) {
    const o = t.splitText(e);
    if (o.length === 0) return [n, t.getIndexWithinParent()];
    const i = e === 0 ? 0 : 1;
    return [n, o[0].getIndexWithinParent() + i];
  }
  if (!A(t) || e === 0) return [n, t.getIndexWithinParent()];
  const r = t.getChildAtIndex(e);
  if (r) {
    const o = new er(on(t.__key, e, "element"), on(t.__key, e, "element"), 0, ""), i = t.insertNewAfter(o);
    i && i.append(r, ...r.getNextSiblings());
  }
  return [n, t.getIndexWithinParent() + 1];
}
let Me = null, ze = null, dt = !1, du = !1, Is = 0;
const ug = { characterData: !0, childList: !0, subtree: !0 };
function Yi() {
  return dt || Me !== null && Me._readOnly;
}
function st() {
  dt && B(13);
}
function l_() {
  Is > 99 && B(14);
}
function ln() {
  return Me === null && B(15), Me;
}
function Ae() {
  return ze === null && B(16), ze;
}
function Y1() {
  return ze;
}
function cg(t, e, n) {
  const r = e.__type, o = function(l, a) {
    const u = l._nodes.get(a);
    return u === void 0 && B(30, a), u;
  }(t, r);
  let i = n.get(r);
  i === void 0 && (i = Array.from(o.transforms), n.set(r, i));
  const s = i.length;
  for (let l = 0; l < s && (i[l](e), e.isAttached()); l++) ;
}
function dg(t, e) {
  return t !== void 0 && t.__key !== e && t.isAttached();
}
function Z1(t) {
  return cf(t, Ae()._nodes);
}
function cf(t, e) {
  const n = t.type, r = e.get(n);
  r === void 0 && B(17, n);
  const o = r.klass;
  t.type !== o.getType() && B(18, o.name);
  const i = o.importJSON(t), s = t.children;
  if (A(i) && Array.isArray(s)) for (let l = 0; l < s.length; l++) {
    const a = cf(s[l], e);
    i.append(a);
  }
  return i;
}
function fg(t, e) {
  const n = Me, r = dt, o = ze;
  Me = t, dt = !0, ze = null;
  try {
    return e();
  } finally {
    Me = n, dt = r, ze = o;
  }
}
function hr(t, e) {
  const n = t._pendingEditorState, r = t._rootElement, o = t._headless || r === null;
  if (n === null) return;
  const i = t._editorState, s = i._selection, l = n._selection, a = t._dirtyType !== Sr, u = Me, c = dt, p = ze, d = t._updating, m = t._observer;
  let h = null;
  if (t._pendingEditorState = null, t._editorState = n, !o && a && m !== null) {
    ze = t, Me = n, dt = !1, t._updating = !0;
    try {
      const S = t._dirtyType, C = t._dirtyElements, k = t._dirtyLeaves;
      m.disconnect(), h = z1(i, n, t, S, C, k);
    } catch (S) {
      if (S instanceof Error && t._onError(S), du) throw S;
      return d_(t, null, r, n), Py(t), t._dirtyType = ho, du = !0, hr(t, i), void (du = !1);
    } finally {
      m.observe(r, ug), t._updating = d, Me = u, dt = c, ze = p;
    }
  }
  n._readOnly || (n._readOnly = !0);
  const y = t._dirtyLeaves, v = t._dirtyElements, _ = t._normalizedNodes, f = t._updateTags, g = t._deferred;
  a && (t._dirtyType = Sr, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements = /* @__PURE__ */ new Map(), t._normalizedNodes = /* @__PURE__ */ new Set(), t._updateTags = /* @__PURE__ */ new Set()), function(S, C) {
    const k = S._decorators;
    let E = S._pendingDecorators || k;
    const b = C._nodeMap;
    let R;
    for (R in E) b.has(R) || (E === k && (E = Iy(S)), delete E[R]);
  }(t, n);
  const x = o ? null : rn(t._window);
  if (t._editable && x !== null && (a || l === null || l.dirty)) {
    ze = t, Me = n;
    try {
      if (m !== null && m.disconnect(), a || l === null || l.dirty) {
        const S = t._blockCursorElement;
        S !== null && nf(S, t, r), G1(s, l, t, x, f, r);
      }
      F1(t, r, l), m !== null && m.observe(r, ug);
    } finally {
      ze = p, Me = u;
    }
  }
  h !== null && function(S, C, k, E, b) {
    const R = Array.from(S._listeners.mutation), z = R.length;
    for (let V = 0; V < z; V++) {
      const [K, Z] = R[V], Y = C.get(Z);
      Y !== void 0 && K(Y, { dirtyLeaves: E, prevEditorState: b, updateTags: k });
    }
  }(t, h, f, y, i), O(l) || l === null || s !== null && s.is(l) || t.dispatchCommand(Nr, void 0);
  const w = t._pendingDecorators;
  w !== null && (t._decorators = w, t._pendingDecorators = null, fi("decorator", t, !0, w)), function(S, C, k) {
    const E = jp(C), b = jp(k);
    E !== b && fi("textcontent", S, !0, b);
  }(t, e || i, n), fi("update", t, !0, { dirtyElements: v, dirtyLeaves: y, editorState: n, normalizedNodes: _, prevEditorState: e || i, tags: f }), function(S, C) {
    if (S._deferred = [], C.length !== 0) {
      const k = S._updating;
      S._updating = !0;
      try {
        for (let E = 0; E < C.length; E++) C[E]();
      } finally {
        S._updating = k;
      }
    }
  }(t, g), function(S) {
    const C = S._updates;
    if (C.length !== 0) {
      const k = C.shift();
      if (k) {
        const [E, b] = k;
        u_(S, E, b);
      }
    }
  }(t);
}
function fi(t, e, n, ...r) {
  const o = e._updating;
  e._updating = n;
  try {
    const i = Array.from(e._listeners[t]);
    for (let s = 0; s < i.length; s++) i[s].apply(null, r);
  } finally {
    e._updating = o;
  }
}
function a_(t, e, n) {
  if (t._updating === !1 || ze !== t) {
    let o = !1;
    return t.update(() => {
      o = a_(t, e, n);
    }), o;
  }
  const r = Xd(t);
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
function pg(t, e) {
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
function u_(t, e, n) {
  const r = t._updateTags;
  let o, i, s = !1, l = !1;
  n !== void 0 && (o = n.onUpdate, i = n.tag, i != null && r.add(i), s = n.skipTransforms || !1, l = n.discrete || !1), o && t._deferred.push(o);
  const a = t._editorState;
  let u = t._pendingEditorState, c = !1;
  (u === null || u._readOnly) && (u = t._pendingEditorState = new ma(new Map((u || a)._nodeMap)), c = !0), u._flushSync = l;
  const p = Me, d = dt, m = ze, h = t._updating;
  Me = u, dt = !1, t._updating = !0, ze = t;
  try {
    c && (t._headless ? a._selection !== null && (u._selection = a._selection.clone()) : u._selection = function(f) {
      const g = f.getEditorState()._selection, x = rn(f._window);
      return O(g) || g == null ? af(g, x, f, null) : g.clone();
    }(t));
    const v = t._compositionKey;
    e(), s = pg(t, s), function(f, g) {
      const x = g.getEditorState()._selection, w = f._selection;
      if (O(w)) {
        const S = w.anchor, C = w.focus;
        let k;
        if (S.type === "text" && (k = S.getNode(), k.selectionTransform(x, w)), C.type === "text") {
          const E = C.getNode();
          k !== E && E.selectionTransform(x, w);
        }
      }
    }(u, t), t._dirtyType !== Sr && (s ? function(f, g) {
      const x = g._dirtyLeaves, w = f._nodeMap;
      for (const S of x) {
        const C = w.get(S);
        I(C) && C.isAttached() && C.isSimpleText() && !C.isUnmergeable() && Mp(C);
      }
    }(u, t) : function(f, g) {
      const x = g._dirtyLeaves, w = g._dirtyElements, S = f._nodeMap, C = Fn(), k = /* @__PURE__ */ new Map();
      let E = x, b = E.size, R = w, z = R.size;
      for (; b > 0 || z > 0; ) {
        if (b > 0) {
          g._dirtyLeaves = /* @__PURE__ */ new Set();
          for (const V of E) {
            const K = S.get(V);
            I(K) && K.isAttached() && K.isSimpleText() && !K.isUnmergeable() && Mp(K), K !== void 0 && dg(K, C) && cg(g, K, k), x.add(V);
          }
          if (E = g._dirtyLeaves, b = E.size, b > 0) {
            Is++;
            continue;
          }
        }
        g._dirtyLeaves = /* @__PURE__ */ new Set(), g._dirtyElements = /* @__PURE__ */ new Map();
        for (const V of R) {
          const K = V[0], Z = V[1];
          if (K !== "root" && !Z) continue;
          const Y = S.get(K);
          Y !== void 0 && dg(Y, C) && cg(g, Y, k), w.set(K, Z);
        }
        E = g._dirtyLeaves, b = E.size, R = g._dirtyElements, z = R.size, Is++;
      }
      g._dirtyLeaves = x, g._dirtyElements = w;
    }(u, t), pg(t), function(f, g, x, w) {
      const S = f._nodeMap, C = g._nodeMap, k = [];
      for (const [E] of w) {
        const b = C.get(E);
        b !== void 0 && (b.isAttached() || (A(b) && Uy(b, E, S, C, k, w), S.has(E) || w.delete(E), k.push(E)));
      }
      for (const E of k) C.delete(E);
      for (const E of x) {
        const b = C.get(E);
        b === void 0 || b.isAttached() || (S.has(E) || x.delete(E), C.delete(E));
      }
    }(a, u, t._dirtyLeaves, t._dirtyElements)), v !== t._compositionKey && (u._flushSync = !0);
    const _ = u._selection;
    if (O(_)) {
      const f = u._nodeMap, g = _.anchor.key, x = _.focus.key;
      f.get(g) !== void 0 && f.get(x) !== void 0 || B(19);
    } else $e(_) && _._nodes.size === 0 && (u._selection = null);
  } catch (v) {
    return v instanceof Error && t._onError(v), t._pendingEditorState = a, t._dirtyType = ho, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements.clear(), void hr(t);
  } finally {
    Me = p, dt = d, ze = m, t._updating = h, Is = 0;
  }
  t._dirtyType !== Sr || function(v, _) {
    const f = _.getEditorState()._selection, g = v._selection;
    if (g !== null) {
      if (g.dirty || !g.is(f)) return !0;
    } else if (f !== null) return !0;
    return !1;
  }(u, t) ? u._flushSync ? (u._flushSync = !1, hr(t)) : c && b1(() => {
    hr(t);
  }) : (u._flushSync = !1, c && (r.clear(), t._deferred = [], t._pendingEditorState = null));
}
function mt(t, e, n) {
  t._updating ? t._updates.push([e, n]) : u_(t, e, n);
}
class St extends ga {
  constructor(e) {
    super(e), this.__first = null, this.__last = null, this.__size = 0, this.__format = 0, this.__indent = 0, this.__dir = null;
  }
  getFormat() {
    return this.getLatest().__format;
  }
  getFormatType() {
    const e = this.getFormat();
    return x1[e] || "";
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
    const e = Ae()._dirtyElements;
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
      if (I(n) && e.push(n), A(n)) {
        const r = n.getAllTextNodes();
        e.push(...r);
      }
      n = n.getNextSibling();
    }
    return e;
  }
  getFirstDescendant() {
    let e = this.getFirstChild();
    for (; A(e); ) {
      const n = e.getFirstChild();
      if (n === null) break;
      e = n;
    }
    return e;
  }
  getLastDescendant() {
    let e = this.getLastChild();
    for (; A(e); ) {
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
      return A(i) && i.getLastDescendant() || i || null;
    }
    const o = n[e];
    return A(o) && o.getFirstDescendant() || o || null;
  }
  getFirstChild() {
    const e = this.getLatest().__first;
    return e === null ? null : Ee(e);
  }
  getFirstChildOrThrow() {
    const e = this.getFirstChild();
    return e === null && B(45, this.__key), e;
  }
  getLastChild() {
    const e = this.getLatest().__last;
    return e === null ? null : Ee(e);
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
      e += i.getTextContent(), A(i) && o !== r - 1 && !i.isInline() && (e += Sn);
    }
    return e;
  }
  getTextContentSize() {
    let e = 0;
    const n = this.getChildren(), r = n.length;
    for (let o = 0; o < r; o++) {
      const i = n[o];
      e += i.getTextContentSize(), A(i) && o !== r - 1 && !i.isInline() && (e += Sn.length);
    }
    return e;
  }
  getDirection() {
    return this.getLatest().__dir;
  }
  hasFormat(e) {
    if (e !== "") {
      const n = Ip[e];
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
        if (I(a) || A(a)) return a.select(0, 0);
      } else if (!(e !== void 0 && e !== s || n !== void 0 && n !== s)) {
        const a = this.getLastChild();
        if (I(a) || A(a)) return a.select();
      }
    }
    o === void 0 && (o = s), i === void 0 && (i = s);
    const l = this.__key;
    return O(r) ? (r.anchor.set(l, o, "element"), r.focus.set(l, i, "element"), r.dirty = !0, r) : s_(l, o, l, i, "element", "element");
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
    return this.getWritable().__format = e !== "" ? Ip[e] : 0, this;
  }
  setIndent(e) {
    return this.getWritable().__indent = e, this;
  }
  splice(e, n, r) {
    const o = r.length, i = this.getChildrenSize(), s = this.getWritable(), l = s.__key, a = [], u = [], c = this.getChildAtIndex(e + n);
    let p = null, d = i - n + o;
    if (e !== 0) if (e === i) p = this.getLastChild();
    else {
      const h = this.getChildAtIndex(e);
      h !== null && (p = h.getPreviousSibling());
    }
    if (n > 0) {
      let h = p === null ? this.getFirstChild() : p.getNextSibling();
      for (let y = 0; y < n; y++) {
        h === null && B(100);
        const v = h.getNextSibling(), _ = h.__key;
        gr(h.getWritable()), u.push(_), h = v;
      }
    }
    let m = p;
    for (let h = 0; h < o; h++) {
      const y = r[h];
      m !== null && y.is(m) && (p = m = m.getPreviousSibling());
      const v = y.getWritable();
      v.__parent === l && d--, gr(v);
      const _ = y.__key;
      if (m === null) s.__first = _, v.__prev = null;
      else {
        const f = m.getWritable();
        f.__next = _, v.__prev = f.__key;
      }
      y.__key === l && B(76), v.__parent = l, a.push(_), m = y;
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
    if (s.__size = d, u.length) {
      const h = $();
      if (O(h)) {
        const y = new Set(u), v = new Set(a), { anchor: _, focus: f } = h;
        gg(_, y, v) && kl(_, _.getNode(), this, p, c), gg(f, y, v) && kl(f, f.getNode(), this, p, c), d !== 0 || this.canBeEmpty() || ft(this) || this.remove();
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
function A(t) {
  return t instanceof St;
}
function gg(t, e, n) {
  let r = t.getNode();
  for (; r; ) {
    const o = r.__key;
    if (e.has(o) && !n.has(o)) return !0;
    r = r.getParent();
  }
  return !1;
}
class df extends ga {
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
function ae(t) {
  return t instanceof df;
}
class Zi extends St {
  static getType() {
    return "root";
  }
  static clone() {
    return new Zi();
  }
  constructor() {
    super("root"), this.__cachedText = null;
  }
  getTopLevelElementOrThrow() {
    B(51);
  }
  getTextContent() {
    const e = this.__cachedText;
    return !Yi() && Ae()._dirtyType !== Sr || e === null ? super.getTextContent() : e;
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
      A(r) || ae(r) || B(56);
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
function Ye(t) {
  return t instanceof Zi;
}
function ff() {
  return new ma(/* @__PURE__ */ new Map([["root", new Zi()]]));
}
function c_(t) {
  const e = t.exportJSON(), n = t.constructor;
  if (e.type !== n.getType() && B(130, n.name), A(t)) {
    const r = e.children;
    Array.isArray(r) || B(59, n.name);
    const o = t.getChildren();
    for (let i = 0; i < o.length; i++) {
      const s = c_(o[i]);
      r.push(s);
    }
  }
  return e;
}
class ma {
  constructor(e, n) {
    this._nodeMap = e, this._selection = n || null, this._flushSync = !1, this._readOnly = !1;
  }
  isEmpty() {
    return this._nodeMap.size === 1 && this._selection === null;
  }
  read(e) {
    return fg(this, e);
  }
  clone(e) {
    const n = new ma(this._nodeMap, e === void 0 ? this._selection : e);
    return n._readOnly = !0, n;
  }
  toJSON() {
    return fg(this, () => ({ root: c_(ye()) }));
  }
}
class pf extends St {
  static getType() {
    return "artificial";
  }
  createDOM(e) {
    return document.createElement("div");
  }
}
class ko extends St {
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
    const n = yn[e];
    return !!(this.getTextFormat() & n);
  }
  static clone(e) {
    return new ko(e.__key);
  }
  createDOM(e) {
    const n = document.createElement("p"), r = ui(e.theme, "paragraph");
    return r !== void 0 && n.classList.add(...r), n;
  }
  updateDOM(e, n, r) {
    return !1;
  }
  static importDOM() {
    return { p: (e) => ({ conversion: X1, priority: 0 }) };
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n && sn(n)) {
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
    const n = de();
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n.setTextFormat(e.textFormat), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), textFormat: this.getTextFormat(), type: "paragraph", version: 1 };
  }
  insertNewAfter(e, n) {
    const r = de();
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
function X1(t) {
  const e = de();
  if (t.style) {
    e.setFormat(t.style.textAlign);
    const n = parseInt(t.style.textIndent, 10) / 20;
    n > 0 && e.setIndent(n);
  }
  return { node: e };
}
function de() {
  return Be(new ko());
}
function Vt(t) {
  return t instanceof ko;
}
const G = 0, re = 1, Ii = 2, Oc = 3, q1 = 4;
function d_(t, e, n, r) {
  const o = t._keyToDOMMap;
  o.clear(), t._editorState = ff(), t._pendingEditorState = r, t._compositionKey = null, t._dirtyType = Sr, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements.clear(), t._normalizedNodes = /* @__PURE__ */ new Set(), t._updateTags = /* @__PURE__ */ new Set(), t._updates = [], t._blockCursorElement = null;
  const i = t._observer;
  i !== null && (i.disconnect(), t._observer = null), e !== null && (e.textContent = ""), n !== null && (n.textContent = "", o.set("root", n));
}
function f_(t) {
  const e = t || {}, n = Y1(), r = e.theme || {}, o = t === void 0 ? n : e.parentEditor || null, i = e.disableEvents || !1, s = ff(), l = e.namespace || (o !== null ? o._config.namespace : My()), a = e.editorState, u = [Zi, qn, Gi, Ji, ko, pf, ...e.nodes || []], { onError: c, html: p } = e, d = e.editable === void 0 || e.editable;
  let m;
  if (t === void 0 && n !== null) m = n._nodes;
  else {
    m = /* @__PURE__ */ new Map();
    for (let y = 0; y < u.length; y++) {
      let v = u[y], _ = null, f = null;
      if (typeof v != "function") {
        const S = v;
        v = S.replace, _ = S.with, f = S.withKlass || null;
      }
      const g = v.getType(), x = v.transform(), w = /* @__PURE__ */ new Set();
      x !== null && w.add(x), m.set(g, { exportDOM: p && p.export ? p.export.get(v) : void 0, klass: v, replace: _, replaceWithKlass: f, transforms: w });
    }
  }
  const h = new ew(s, o, m, { disableEvents: i, namespace: l, theme: r }, c || console.error, function(y, v) {
    const _ = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), g = (x) => {
      Object.keys(x).forEach((w) => {
        let S = _.get(w);
        S === void 0 && (S = [], _.set(w, S)), S.push(x[w]);
      });
    };
    return y.forEach((x) => {
      const w = x.klass.importDOM;
      if (w == null || f.has(w)) return;
      f.add(w);
      const S = w.call(x.klass);
      S !== null && g(S);
    }), v && g(v), _;
  }(m, p ? p.import : void 0), d);
  return a !== void 0 && (h._pendingEditorState = a, h._dirtyType = ho), h;
}
class ew {
  constructor(e, n, r, o, i, s, l) {
    this._parentEditor = n, this._rootElement = null, this._editorState = e, this._pendingEditorState = null, this._compositionKey = null, this._deferred = [], this._keyToDOMMap = /* @__PURE__ */ new Map(), this._updates = [], this._updating = !1, this._listeners = { decorator: /* @__PURE__ */ new Set(), editable: /* @__PURE__ */ new Set(), mutation: /* @__PURE__ */ new Map(), root: /* @__PURE__ */ new Set(), textcontent: /* @__PURE__ */ new Set(), update: /* @__PURE__ */ new Set() }, this._commands = /* @__PURE__ */ new Map(), this._config = o, this._nodes = r, this._decorators = {}, this._pendingDecorators = null, this._dirtyType = Sr, this._cloneNotNeeded = /* @__PURE__ */ new Set(), this._dirtyLeaves = /* @__PURE__ */ new Set(), this._dirtyElements = /* @__PURE__ */ new Map(), this._normalizedNodes = /* @__PURE__ */ new Set(), this._updateTags = /* @__PURE__ */ new Set(), this._observer = null, this._key = My(), this._onError = i, this._htmlConversions = s, this._editable = l, this._headless = n !== null && n._headless, this._window = null, this._blockCursorElement = null;
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
    return s = this, l = e.getType(), mt(s, () => {
      const a = ln();
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
    return U(this, e, n);
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
      const r = ui(this._config.theme, "root"), o = this._pendingEditorState || this._editorState;
      if (this._rootElement = e, d_(this, n, e, o), n !== null && (this._config.disableEvents || j1(n), r != null && n.classList.remove(...r)), e !== null) {
        const i = function(l) {
          const a = l.ownerDocument;
          return a && a.defaultView || null;
        }(e), s = e.style;
        s.userSelect = "text", s.whiteSpace = "pre-wrap", s.wordBreak = "break-word", e.setAttribute("data-lexical-editor", "true"), this._window = i, this._dirtyType = ho, Py(this), this._updateTags.add("history-merge"), hr(this), this._config.disableEvents || function(l, a) {
          const u = l.ownerDocument, c = Sl.get(u);
          (c === void 0 || c < 1) && u.addEventListener("selectionchange", t_), Sl.set(u, (c || 0) + 1), l.__lexicalEditor = a;
          const p = e_(l);
          for (let d = 0; d < Cc.length; d++) {
            const [m, h] = Cc[d], y = typeof h == "function" ? (v) => {
              Zp(v) || (Yp(v), (a.isEditable() || m === "click") && h(v, a));
            } : (v) => {
              if (Zp(v)) return;
              Yp(v);
              const _ = a.isEditable();
              switch (m) {
                case "cut":
                  return _ && U(a, sa, v);
                case "copy":
                  return U(a, Vi, v);
                case "paste":
                  return _ && U(a, xo, v);
                case "dragstart":
                  return _ && U(a, oa, v);
                case "dragover":
                  return _ && U(a, ia, v);
                case "dragend":
                  return _ && U(a, o1, v);
                case "focus":
                  return _ && U(a, jd, v);
                case "blur":
                  return _ && U(a, la, v);
                case "drop":
                  return _ && U(a, Hi, v);
              }
            };
            l.addEventListener(m, y), p.push(() => {
              l.removeEventListener(m, y);
            });
          }
        }(e, this), r != null && e.classList.add(...r);
      } else this._editorState = o, this._pendingEditorState = null, this._window = null;
      fi("root", this, !1, e, n);
    }
  }
  getElementByKey(e) {
    return this._keyToDOMMap.get(e) || null;
  }
  getEditorState() {
    return this._editorState;
  }
  setEditorState(e, n) {
    e.isEmpty() && B(38), Oy(this);
    const r = this._pendingEditorState, o = this._updateTags, i = n !== void 0 ? n.tag : null;
    r === null || r.isEmpty() || (i != null && o.add(i), hr(this)), this._pendingEditorState = e, this._dirtyType = ho, this._dirtyElements.set("root", !1), this._compositionKey = null, i != null && o.add(i), hr(this);
  }
  parseEditorState(e, n) {
    return function(r, o, i) {
      const s = ff(), l = Me, a = dt, u = ze, c = o._dirtyElements, p = o._dirtyLeaves, d = o._cloneNotNeeded, m = o._dirtyType;
      o._dirtyElements = /* @__PURE__ */ new Map(), o._dirtyLeaves = /* @__PURE__ */ new Set(), o._cloneNotNeeded = /* @__PURE__ */ new Set(), o._dirtyType = 0, Me = s, dt = !1, ze = o;
      try {
        const h = o._nodes;
        cf(r.root, h), i && i(), s._readOnly = !0;
      } catch (h) {
        h instanceof Error && o._onError(h);
      } finally {
        o._dirtyElements = c, o._dirtyLeaves = p, o._cloneNotNeeded = d, o._dirtyType = m, Me = l, dt = a, ze = u;
      }
      return s;
    }(typeof e == "string" ? JSON.parse(e) : e, this, n);
  }
  update(e, n) {
    mt(this, e, n);
  }
  focus(e, n = {}) {
    const r = this._rootElement;
    r !== null && (r.setAttribute("autocapitalize", "off"), mt(this, () => {
      const o = $(), i = ye();
      o !== null ? o.dirty = !0 : i.getChildrenSize() !== 0 && (n.defaultSelection === "rootStart" ? i.selectStart() : i.selectEnd());
    }, { onUpdate: () => {
      r.removeAttribute("autocapitalize"), e && e();
    }, tag: "focus" }), this._pendingEditorState === null && r.removeAttribute("autocapitalize"));
  }
  blur() {
    const e = this._rootElement;
    e !== null && e.blur();
    const n = rn(this._window);
    n !== null && n.removeAllRanges();
  }
  isEditable() {
    return this._editable;
  }
  setEditable(e) {
    this._editable !== e && (this._editable = e, fi("editable", this, !0, e));
  }
  toJSON() {
    return { editorState: this._editorState.toJSON() };
  }
}
const p_ = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, tw = p_ ? T.useLayoutEffect : T.useEffect, _s = { tag: "history-merge" };
function nw({ initialConfig: t, children: e }) {
  const n = T.useMemo(() => {
    const { theme: r, namespace: o, editor__DEPRECATED: i, nodes: s, onError: l, editorState: a, html: u } = t, c = Zx(null, r);
    let p = i || null;
    if (p === null) {
      const d = f_({ editable: t.editable, html: u, namespace: o, nodes: s, onError: (m) => l(m, d), theme: r });
      (function(m, h) {
        if (h !== null) {
          if (h === void 0) m.update(() => {
            const y = ye();
            if (y.isEmpty()) {
              const v = de();
              y.append(v);
              const _ = p_ ? document.activeElement : null;
              ($() !== null || _ !== null && _ === m.getRootElement()) && v.select();
            }
          }, _s);
          else if (h !== null) switch (typeof h) {
            case "string": {
              const y = m.parseEditorState(h);
              m.setEditorState(y, _s);
              break;
            }
            case "object":
              m.setEditorState(h, _s);
              break;
            case "function":
              m.update(() => {
                ye().isEmpty() && h(m);
              }, _s);
          }
        }
      })(d, a), p = d;
    }
    return [p, c];
  }, []);
  return tw(() => {
    const r = t.editable, [o] = n;
    o.setEditable(r === void 0 || r);
  }, []), N.jsx(Cy.Provider, { value: n, children: e });
}
const rw = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function ow(t) {
  return { initialValueFn: () => t.isEditable(), subscribe: (e) => t.registerEditableListener(e) };
}
function g_() {
  return function(t) {
    const [e] = fe(), n = T.useMemo(() => t(e), [e, t]), r = T.useRef(n.initialValueFn()), [o, i] = T.useState(r.current);
    return rw(() => {
      const { initialValueFn: s, subscribe: l } = n, a = s();
      return r.current !== a && (r.current = a, i(a)), l((u) => {
        r.current = u, i(u);
      });
    }, [n, t]), o;
  }(ow);
}
function iw() {
  return ye().getTextContent();
}
function sw(t, e = !0) {
  if (t) return !1;
  let n = iw();
  return e && (n = n.trim()), n === "";
}
function lw(t) {
  if (!sw(t, !1)) return !1;
  const e = ye().getChildren(), n = e.length;
  if (n > 1) return !1;
  for (let r = 0; r < n; r++) {
    const o = e[r];
    if (ae(o)) return !1;
    if (A(o)) {
      if (!Vt(o) || o.__indent !== 0) return !1;
      const i = o.getChildren(), s = i.length;
      for (let l = 0; l < s; l++) {
        const a = i[r];
        if (!I(a)) return !1;
      }
    }
  }
  return !0;
}
function h_(t) {
  return () => lw(t);
}
function aw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
aw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
function uw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var m_ = uw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const cw = /* @__PURE__ */ new Map();
function dw(t) {
  const e = {}, n = t.split(";");
  for (const r of n) if (r !== "") {
    const [o, i] = r.split(/:([^]+)/);
    o && i && (e[o.trim()] = i.trim());
  }
  return e;
}
function y_(t) {
  const e = t.constructor.clone(t);
  return e.__parent = t.__parent, e.__next = t.__next, e.__prev = t.__prev, A(t) && A(e) ? (r = t, (n = e).__first = r.__first, n.__last = r.__last, n.__size = r.__size, n.__format = r.__format, n.__indent = r.__indent, n.__dir = r.__dir, n) : I(t) && I(e) ? function(o, i) {
    return o.__format = i.__format, o.__style = i.__style, o.__mode = i.__mode, o.__detail = i.__detail, o;
  }(e, t) : Vt(t) && Vt(e) ? function(o, i) {
    return o.__textFormat = i.__textFormat, o;
  }(e, t) : e;
  var n, r;
}
function __(t, e) {
  const n = t.getStartEndPoints();
  if (e.isSelected(t) && !e.isSegmented() && !e.isToken() && n !== null) {
    const [r, o] = n, i = t.isBackward(), s = r.getNode(), l = o.getNode(), a = e.is(s), u = e.is(l);
    if (a || u) {
      const [c, p] = Nc(t), d = s.is(l), m = e.is(i ? l : s), h = e.is(i ? s : l);
      let y, v = 0;
      return d ? (v = c > p ? p : c, y = c > p ? c : p) : m ? (v = i ? p : c, y = void 0) : h && (v = 0, y = i ? c : p), e.__text = e.__text.slice(v, y), e;
    }
  }
  return e;
}
function hg(t) {
  if (t.type === "text") return t.offset === t.getNode().getTextContentSize();
  const e = t.getNode();
  return A(e) || m_(177), t.offset === e.getChildrenSize();
}
function fw(t) {
  const e = t.getStyle(), n = dw(e);
  cw.set(e, n);
}
function mg(t) {
  return t.getNode().isAttached();
}
function pw(t) {
  let e = t;
  for (; e !== null && !ft(e); ) {
    const n = e.getLatest(), r = e.getParent();
    n.getChildrenSize() === 0 && e.remove(!0), e = r;
  }
}
function Uo(t, e, n = null) {
  const r = t.getStartEndPoints(), o = r ? r[0] : null, i = t.getNodes(), s = i.length;
  if (o !== null && (s === 0 || s === 1 && o.type === "element" && o.getNode().getChildrenSize() === 0)) {
    const u = o.type === "text" ? o.getNode().getParentOrThrow() : o.getNode(), c = u.getChildren();
    let p = e();
    return p.setFormat(u.getFormatType()), p.setIndent(u.getIndent()), c.forEach((d) => p.append(d)), n && (p = n.append(p)), void u.replace(p);
  }
  let l = null, a = [];
  for (let u = 0; u < s; u++) {
    const c = i[u];
    ft(c) ? (fu(t, a, a.length, e, n), a = [], l = c) : l === null || l !== null && _l(c, l) ? a.push(c) : (fu(t, a, a.length, e, n), a = [c]);
  }
  fu(t, a, a.length, e, n);
}
function fu(t, e, n, r, o = null) {
  if (e.length === 0) return;
  const i = e[0], s = /* @__PURE__ */ new Map(), l = [];
  let a = A(i) ? i : i.getParentOrThrow();
  a.isInline() && (a = a.getParentOrThrow());
  let u = !1;
  for (; a !== null; ) {
    const h = a.getPreviousSibling();
    if (h !== null) {
      a = h, u = !0;
      break;
    }
    if (a = a.getParentOrThrow(), ft(a)) break;
  }
  const c = /* @__PURE__ */ new Set();
  for (let h = 0; h < n; h++) {
    const y = e[h];
    A(y) && y.getChildrenSize() === 0 && c.add(y.getKey());
  }
  const p = /* @__PURE__ */ new Set();
  for (let h = 0; h < n; h++) {
    const y = e[h];
    let v = y.getParent();
    if (v !== null && v.isInline() && (v = v.getParent()), v !== null && Zd(y) && !p.has(y.getKey())) {
      const _ = v.getKey();
      if (s.get(_) === void 0) {
        const f = r();
        f.setFormat(v.getFormatType()), f.setIndent(v.getIndent()), l.push(f), s.set(_, f), v.getChildren().forEach((g) => {
          f.append(g), p.add(g.getKey()), A(g) && g.getChildrenKeys().forEach((x) => p.add(x));
        }), pw(v);
      }
    } else if (c.has(y.getKey())) {
      A(y) || m_(179);
      const _ = r();
      _.setFormat(y.getFormatType()), _.setIndent(y.getIndent()), l.push(_), y.remove(!0);
    }
  }
  if (o !== null) for (let h = 0; h < l.length; h++) {
    const y = l[h];
    o.append(y);
  }
  let d = null;
  if (ft(a)) if (u) if (o !== null) a.insertAfter(o);
  else for (let h = l.length - 1; h >= 0; h--) {
    const y = l[h];
    a.insertAfter(y);
  }
  else {
    const h = a.getFirstChild();
    if (A(h) && (a = h), h === null) if (o) a.append(o);
    else for (let y = 0; y < l.length; y++) {
      const v = l[y];
      a.append(v), d = v;
    }
    else if (o !== null) h.insertBefore(o);
    else for (let y = 0; y < l.length; y++) {
      const v = l[y];
      h.insertBefore(v), d = v;
    }
  }
  else if (o) a.insertAfter(o);
  else for (let h = l.length - 1; h >= 0; h--) {
    const y = l[h];
    a.insertAfter(y), d = y;
  }
  const m = Co();
  O(m) && mg(m.anchor) && mg(m.focus) ? Ie(m.clone()) : d !== null ? d.selectEnd() : t.dirty = !0;
}
function El(t, e) {
  const n = $i(t.focus, e);
  return ae(n) && !n.isIsolated() || A(n) && !n.isInline() && !n.canBeEmpty();
}
function gw(t, e, n, r) {
  t.modify(e ? "extend" : "move", n, r);
}
function hw(t) {
  const e = t.anchor.getNode();
  return (Ye(e) ? e : e.getParentOrThrow()).getDirection() === "rtl";
}
function Tl(t, e, n) {
  const r = hw(t);
  gw(t, e, n ? !r : r, "character");
}
function mw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var yw = mw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const gf = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, _w = gf && "documentMode" in document ? document.documentMode : null, vw = gf && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
!(!gf || !("InputEvent" in window) || _w) && "getTargetRanges" in new window.InputEvent("input");
function v_(...t) {
  const e = [];
  for (const n of t) if (n && typeof n == "string") for (const [r] of n.matchAll(/\S+/g)) e.push(r);
  return e;
}
function De(...t) {
  return () => {
    t.forEach((e) => e());
  };
}
const xw = vw;
function Ot(t, ...e) {
  const n = v_(...e);
  n.length > 0 && t.classList.add(...n);
}
function hf(t, ...e) {
  const n = v_(...e);
  n.length > 0 && t.classList.remove(...n);
}
function x_(t, e) {
  for (const n of e) if (t.type.startsWith(n)) return !0;
  return !1;
}
function ww(t, e) {
  const n = t[Symbol.iterator]();
  return new Promise((r, o) => {
    const i = [], s = () => {
      const { done: l, value: a } = n.next();
      if (l) return r(i);
      const u = new FileReader();
      u.addEventListener("error", o), u.addEventListener("load", () => {
        const c = u.result;
        typeof c == "string" && i.push({ file: a, result: c }), s();
      }), x_(a, e) ? u.readAsDataURL(a) : s();
    };
    s();
  });
}
function w_(t, e) {
  let n = t;
  for (; n != null; ) {
    if (n instanceof e) return n;
    n = n.getParent();
  }
  return null;
}
function Sw(t) {
  const e = ya(t, (n) => A(n) && !n.isInline());
  return A(e) || yw(4, t.__key), e;
}
const ya = (t, e) => {
  let n = t;
  for (; n !== ye() && n != null; ) {
    if (e(n)) return n;
    n = n.getParent();
  }
  return null;
};
function Cw(t, e) {
  const n = e();
  return t.replace(n), n.append(t), n;
}
function gn(t, e) {
  return t !== null && Object.getPrototypeOf(t).constructor.name === e.name;
}
function pi(t) {
  if (xw) return 1;
  let e = 1;
  for (; t; ) e *= Number(window.getComputedStyle(t).getPropertyValue("zoom")), t = t.parentElement;
  return e;
}
function S_(t) {
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
            const [u, c, p, d, m, h] = a;
            t.update(() => {
              const y = $();
              if (O(y)) {
                const v = y.anchor;
                let _ = v.getNode(), f = 0, g = 0;
                if (I(_) && u >= 0 && c >= 0 && (f = u, g = u + c, y.setTextNodeRange(_, f, _, g)), f === g && p === "" || (y.insertRawText(p), _ = v.getNode()), I(_)) {
                  f = d, g = d + m;
                  const x = _.getTextContentSize();
                  f = f > x ? x : f, g = g > x ? x : g, y.setTextNodeRange(_, f, _, g);
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
function kw(t, e) {
  const n = e.body ? e.body.childNodes : [];
  let r = [];
  const o = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (!k_.has(s.nodeName)) {
      const l = E_(s, t, o, !1);
      l !== null && (r = r.concat(l));
    }
  }
  return function(i) {
    for (const s of i) s.getNextSibling() instanceof pf && s.insertAfter(Ht());
    for (const s of i) {
      const l = s.getChildren();
      for (const a of l) s.insertBefore(a);
      s.remove();
    }
  }(o), r;
}
function Ew(t, e) {
  if (typeof document > "u" || typeof window > "u" && global.window === void 0) throw new Error("To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom before calling this function.");
  const n = document.createElement("div"), r = ye().getChildren();
  for (let o = 0; o < r.length; o++)
    C_(t, r[o], n, e);
  return n.innerHTML;
}
function C_(t, e, n, r = null) {
  let o = r === null || e.isSelected(r);
  const i = A(e) && e.excludeFromCopy("html");
  let s = e;
  if (r !== null) {
    let m = y_(e);
    m = I(m) && r !== null ? __(r, m) : m, s = m;
  }
  const l = A(s) ? s.getChildren() : [], a = t._nodes.get(s.getType());
  let u;
  u = a && a.exportDOM !== void 0 ? a.exportDOM(t, s) : s.exportDOM(t);
  const { element: c, after: p } = u;
  if (!c) return !1;
  const d = document.createDocumentFragment();
  for (let m = 0; m < l.length; m++) {
    const h = l[m], y = C_(t, h, d, r);
    !o && A(e) && y && e.extractWithChild(h, r, "html") && (o = !0);
  }
  if (o && !i) {
    if (sn(c) && c.append(d), n.append(c), p) {
      const m = p.call(s, c);
      m && c.replaceWith(m);
    }
  } else n.append(d);
  return o;
}
const k_ = /* @__PURE__ */ new Set(["STYLE", "SCRIPT"]);
function E_(t, e, n, r, o = /* @__PURE__ */ new Map(), i) {
  let s = [];
  if (k_.has(t.nodeName)) return s;
  let l = null;
  const a = function(h, y) {
    const { nodeName: v } = h, _ = y._htmlConversions.get(v.toLowerCase());
    let f = null;
    if (_ !== void 0) for (const g of _) {
      const x = g(h);
      x !== null && (f === null || (f.priority || 0) < (x.priority || 0)) && (f = x);
    }
    return f !== null ? f.conversion : null;
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
  let d = [];
  const m = (l == null || !ft(l)) && (l != null && bc(l) || r);
  for (let h = 0; h < p.length; h++) d.push(...E_(p[h], e, n, m, new Map(o), l));
  return c != null && (d = c(d)), D1(t) && (d = Tw(t, d, m ? () => {
    const h = new pf();
    return n.push(h), h;
  } : de)), l == null ? s = s.concat(d) : A(l) && l.append(...d), s;
}
function Tw(t, e, n) {
  const r = t.style.textAlign, o = [];
  let i = [];
  for (let s = 0; s < e.length; s++) {
    const l = e[s];
    if (bc(l)) l.setFormat(r), o.push(l);
    else if (i.push(l), s === e.length - 1 || s < e.length - 1 && bc(e[s + 1])) {
      const a = n();
      a.setFormat(r), a.append(...i), o.push(a), i = [];
    }
  }
  return o;
}
function Nw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Nl = Nw(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const bw = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, T_ = (t) => bw ? (t || window).getSelection() : null;
function N_(t) {
  const e = $();
  return e == null && Nl(166), O(e) && e.isCollapsed() || e.getNodes().length === 0 ? "" : Ew(t, e);
}
function Aw(t) {
  const e = $();
  return e == null && Nl(166), O(e) && e.isCollapsed() || e.getNodes().length === 0 ? null : JSON.stringify(Ow(t, e));
}
function yg(t, e) {
  const n = t.getData("text/plain") || t.getData("text/uri-list");
  n != null && e.insertRawText(n);
}
function _g(t, e, n) {
  const r = t.getData("application/x-lexical-editor");
  if (r) try {
    const s = JSON.parse(r);
    if (s.namespace === n._config.namespace && Array.isArray(s.nodes))
      return vg(n, Pw(s.nodes), e);
  } catch {
  }
  const o = t.getData("text/html");
  if (o) try {
    const s = new DOMParser().parseFromString(o, "text/html");
    return vg(n, kw(n, s), e);
  } catch {
  }
  const i = t.getData("text/plain") || t.getData("text/uri-list");
  if (i != null) if (O(e)) {
    const s = i.split(/(\r?\n|\t)/);
    s[s.length - 1] === "" && s.pop();
    for (let l = 0; l < s.length; l++) {
      const a = $();
      if (O(a)) {
        const u = s[l];
        u === `
` || u === `\r
` ? a.insertParagraph() : u === "	" ? a.insertNodes([So()]) : a.insertText(u);
      }
    }
  } else e.insertRawText(i);
}
function vg(t, e, n) {
  t.dispatchCommand(Xx, { nodes: e, selection: n }) || n.insertNodes(e);
}
function b_(t, e, n, r = []) {
  let o = e === null || n.isSelected(e);
  const i = A(n) && n.excludeFromCopy("html");
  let s = n;
  if (e !== null) {
    let u = y_(n);
    u = I(u) && e !== null ? __(e, u) : u, s = u;
  }
  const l = A(s) ? s.getChildren() : [], a = function(u) {
    const c = u.exportJSON(), p = u.constructor;
    if (c.type !== p.getType() && Nl(58, p.name), A(u)) {
      const d = c.children;
      Array.isArray(d) || Nl(59, p.name);
    }
    return c;
  }(s);
  if (I(s)) {
    const u = s.__text;
    u.length > 0 ? a.text = u : o = !1;
  }
  for (let u = 0; u < l.length; u++) {
    const c = l[u], p = b_(t, e, c, a.children);
    !o && A(n) && p && n.extractWithChild(c, e, "clone") && (o = !0);
  }
  if (o && !i) r.push(a);
  else if (Array.isArray(a.children)) for (let u = 0; u < a.children.length; u++) {
    const c = a.children[u];
    r.push(c);
  }
  return o;
}
function Ow(t, e) {
  const n = [], r = ye().getChildren();
  for (let o = 0; o < r.length; o++)
    b_(t, e, r[o], n);
  return { namespace: t._config.namespace, nodes: n };
}
function Pw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const r = t[n], o = Z1(r);
    I(o) && fw(o), e.push(o);
  }
  return e;
}
let Pr = null;
async function xg(t, e) {
  if (Pr !== null) return !1;
  if (e !== null) return new Promise((l, a) => {
    t.update(() => {
      l(wg(t, e));
    });
  });
  const n = t.getRootElement(), r = t._window == null ? window.document : t._window.document, o = T_(t._window);
  if (n === null || o === null) return !1;
  const i = r.createElement("span");
  i.style.cssText = "position: fixed; top: -1000px;", i.append(r.createTextNode("#")), n.append(i);
  const s = new Range();
  return s.setStart(i, 0), s.setEnd(i, 1), o.removeAllRanges(), o.addRange(s), new Promise((l, a) => {
    const u = t.registerCommand(Vi, (c) => (gn(c, ClipboardEvent) && (u(), Pr !== null && (window.clearTimeout(Pr), Pr = null), l(wg(t, c))), !0), q1);
    Pr = window.setTimeout(() => {
      u(), Pr = null, l(!1);
    }, 50), r.execCommand("copy"), i.remove();
  });
}
function wg(t, e) {
  const n = T_(t._window);
  if (!n) return !1;
  const r = n.anchorNode, o = n.focusNode;
  if (r !== null && o !== null && !Qi(t, r, o)) return !1;
  e.preventDefault();
  const i = e.clipboardData, s = $();
  if (i === null || s === null) return !1;
  const l = N_(t), a = Aw(t);
  let u = "";
  return s !== null && (u = s.getTextContent()), l !== null && i.setData("text/html", l), a !== null && i.setData("application/x-lexical-editor", a), i.setData("text/plain", u), !0;
}
function Sg(t, e) {
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
const Eo = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, $w = Eo && "documentMode" in document ? document.documentMode : null, Fw = !(!Eo || !("InputEvent" in window) || $w) && "getTargetRanges" in new window.InputEvent("input"), Lw = Eo && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), Iw = Eo && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, Dw = Eo && /^(?=.*Chrome).*/i.test(navigator.userAgent), Rw = Eo && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !Dw, Pc = Kt();
class To extends St {
  static getType() {
    return "quote";
  }
  static clone(e) {
    return new To(e.__key);
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
    return { blockquote: (e) => ({ conversion: Mw, priority: 0 }) };
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n && sn(n)) {
      this.isEmpty() && n.append(document.createElement("br"));
      const r = this.getFormatType();
      n.style.textAlign = r;
      const o = this.getDirection();
      o && (n.dir = o);
    }
    return { element: n };
  }
  static importJSON(e) {
    const n = _a();
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportJSON() {
    return { ...super.exportJSON(), type: "quote" };
  }
  insertNewAfter(e, n) {
    const r = de(), o = this.getDirection();
    return r.setDirection(o), this.insertAfter(r, n), r;
  }
  collapseAtStart() {
    const e = de();
    return this.getChildren().forEach((n) => e.append(n)), this.replace(e), !0;
  }
}
function _a() {
  return Be(new To());
}
function $c(t) {
  return t instanceof To;
}
let va = class A_ extends St {
  static getType() {
    return "heading";
  }
  static clone(e) {
    return new A_(e.__tag, e.__key);
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
    return { h1: (e) => ({ conversion: $r, priority: 0 }), h2: (e) => ({ conversion: $r, priority: 0 }), h3: (e) => ({ conversion: $r, priority: 0 }), h4: (e) => ({ conversion: $r, priority: 0 }), h5: (e) => ({ conversion: $r, priority: 0 }), h6: (e) => ({ conversion: $r, priority: 0 }), p: (e) => {
      const n = e.firstChild;
      return n !== null && Cg(n) ? { conversion: () => ({ node: null }), priority: 3 } : null;
    }, span: (e) => Cg(e) ? { conversion: (n) => ({ node: Ln("h1") }), priority: 3 } : null };
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    if (n && sn(n)) {
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
    const r = e ? e.anchor.offset : 0, o = r !== this.getTextContentSize() && e ? Ln(this.getTag()) : de(), i = this.getDirection();
    if (o.setDirection(i), this.insertAfter(o, n), r === 0 && !this.isEmpty() && e) {
      const s = de();
      s.select(), this.replace(s, !0);
    }
    return o;
  }
  collapseAtStart() {
    const e = this.isEmpty() ? de() : Ln(this.getTag());
    return this.getChildren().forEach((n) => e.append(n)), this.replace(e), !0;
  }
  extractWithChild() {
    return !0;
  }
};
function Cg(t) {
  return t.nodeName.toLowerCase() === "span" && t.style.fontSize === "26pt";
}
function $r(t) {
  const e = t.nodeName.toLowerCase();
  let n = null;
  return e !== "h1" && e !== "h2" && e !== "h3" && e !== "h4" && e !== "h5" && e !== "h6" || (n = Ln(e), t.style !== null && n.setFormat(t.style.textAlign)), { node: n };
}
function Mw(t) {
  const e = _a();
  return t.style !== null && e.setFormat(t.style.textAlign), { node: e };
}
function Ln(t) {
  return Be(new va(t));
}
function O_(t) {
  return t instanceof va;
}
function Yr(t) {
  let e = null;
  if (gn(t, DragEvent) ? e = t.dataTransfer : gn(t, ClipboardEvent) && (e = t.clipboardData), e === null) return [!1, [], !1];
  const n = e.types, r = n.includes("Files"), o = n.includes("text/html") || n.includes("text/plain");
  return [r, Array.from(e.files), o];
}
function kg(t) {
  const e = $();
  if (!O(e)) return !1;
  const n = /* @__PURE__ */ new Set(), r = e.getNodes();
  for (let o = 0; o < r.length; o++) {
    const i = r[o], s = i.getKey();
    if (n.has(s)) continue;
    const l = ya(i, (u) => A(u) && !u.isInline());
    if (l === null) continue;
    const a = l.getKey();
    l.canIndent() && !n.has(a) && (n.add(a), t(l));
  }
  return n.size > 0;
}
function vs(t) {
  const e = Wt(t);
  return ae(e);
}
function zw(t) {
  return De(t.registerCommand(Jl, (e) => {
    const n = $();
    return !!$e(n) && (n.clear(), !0);
  }, 0), t.registerCommand(nn, (e) => {
    const n = $();
    return !!O(n) && (n.deleteCharacter(e), !0);
  }, G), t.registerCommand(po, (e) => {
    const n = $();
    return !!O(n) && (n.deleteWord(e), !0);
  }, G), t.registerCommand(go, (e) => {
    const n = $();
    return !!O(n) && (n.deleteLine(e), !0);
  }, G), t.registerCommand(pr, (e) => {
    const n = $();
    if (typeof e == "string") n !== null && n.insertText(e);
    else {
      if (n === null) return !1;
      const r = e.dataTransfer;
      if (r != null) _g(r, n, t);
      else if (O(n)) {
        const o = e.data;
        return o && n.insertText(o), !0;
      }
    }
    return !0;
  }, G), t.registerCommand(ul, () => {
    const e = $();
    return !!O(e) && (e.removeText(), !0);
  }, G), t.registerCommand(ht, (e) => {
    const n = $();
    return !!O(n) && (n.formatText(e), !0);
  }, G), t.registerCommand(r1, (e) => {
    const n = $();
    if (!O(n) && !$e(n)) return !1;
    const r = n.getNodes();
    for (const o of r) {
      const i = ya(o, (s) => A(s) && !s.isInline());
      i !== null && i.setFormat(e);
    }
    return !0;
  }, G), t.registerCommand(Wn, (e) => {
    const n = $();
    return !!O(n) && (n.insertLineBreak(e), !0);
  }, G), t.registerCommand(fo, () => {
    const e = $();
    return !!O(e) && (e.insertParagraph(), !0);
  }, G), t.registerCommand(t1, () => (uf([So()]), !0), G), t.registerCommand(n1, () => kg((e) => {
    const n = e.getIndent();
    e.setIndent(n + 1);
  }), G), t.registerCommand(Lp, () => kg((e) => {
    const n = e.getIndent();
    n > 0 && e.setIndent(n - 1);
  }), G), t.registerCommand(ea, (e) => {
    const n = $();
    if ($e(n) && !vs(e.target)) {
      const r = n.getNodes();
      if (r.length > 0) return r[0].selectPrevious(), !0;
    } else if (O(n)) {
      const r = $i(n.focus, !0);
      if (!e.shiftKey && ae(r) && !r.isIsolated() && !r.isInline()) return r.selectPrevious(), e.preventDefault(), !0;
    }
    return !1;
  }, G), t.registerCommand(ta, (e) => {
    const n = $();
    if ($e(n)) {
      const r = n.getNodes();
      if (r.length > 0) return r[0].selectNext(0, 0), !0;
    } else if (O(n)) {
      if (function(o) {
        const i = o.focus;
        return i.key === "root" && i.offset === ye().getChildrenSize();
      }(n)) return e.preventDefault(), !0;
      const r = $i(n.focus, !1);
      if (!e.shiftKey && ae(r) && !r.isIsolated() && !r.isInline()) return r.selectNext(), e.preventDefault(), !0;
    }
    return !1;
  }, G), t.registerCommand(ql, (e) => {
    const n = $();
    if ($e(n)) {
      const r = n.getNodes();
      if (r.length > 0) return e.preventDefault(), r[0].selectPrevious(), !0;
    }
    if (!O(n)) return !1;
    if (El(n, !0)) {
      const r = e.shiftKey;
      return e.preventDefault(), Tl(n, r, !0), !0;
    }
    return !1;
  }, G), t.registerCommand(Xl, (e) => {
    const n = $();
    if ($e(n) && !vs(e.target)) {
      const o = n.getNodes();
      if (o.length > 0) return e.preventDefault(), o[0].selectNext(0, 0), !0;
    }
    if (!O(n)) return !1;
    const r = e.shiftKey;
    return !!El(n, !1) && (e.preventDefault(), Tl(n, r, !1), !0);
  }, G), t.registerCommand(wo, (e) => {
    if (vs(e.target)) return !1;
    const n = $();
    if (!O(n)) return !1;
    e.preventDefault();
    const { anchor: r } = n, o = r.getNode();
    return n.isCollapsed() && r.offset === 0 && !Ye(o) && Sw(o).getIndent() > 0 ? t.dispatchCommand(Lp, void 0) : t.dispatchCommand(nn, !0);
  }, G), t.registerCommand(ra, (e) => {
    if (vs(e.target)) return !1;
    const n = $();
    return !!O(n) && (e.preventDefault(), t.dispatchCommand(nn, !1));
  }, G), t.registerCommand(wr, (e) => {
    const n = $();
    if (!O(n)) return !1;
    if (e !== null) {
      if ((Iw || Lw || Rw) && Fw) return !1;
      if (e.preventDefault(), e.shiftKey) return t.dispatchCommand(Wn, !1);
    }
    return t.dispatchCommand(fo, void 0);
  }, G), t.registerCommand(na, () => {
    const e = $();
    return !!O(e) && (t.blur(), !0);
  }, G), t.registerCommand(Hi, (e) => {
    const [, n] = Yr(e);
    if (n.length > 0) {
      const o = Sg(e.clientX, e.clientY);
      if (o !== null) {
        const { offset: i, node: s } = o, l = Wt(s);
        if (l !== null) {
          const a = lf();
          if (I(l)) a.anchor.set(l.getKey(), i, "text"), a.focus.set(l.getKey(), i, "text");
          else {
            const c = l.getParentOrThrow().getKey(), p = l.getIndexWithinParent() + 1;
            a.anchor.set(c, p, "element"), a.focus.set(c, p, "element");
          }
          const u = $y(a);
          Ie(u);
        }
        t.dispatchCommand(Pc, n);
      }
      return e.preventDefault(), !0;
    }
    const r = $();
    return !!O(r);
  }, G), t.registerCommand(oa, (e) => {
    const [n] = Yr(e), r = $();
    return !(n && !O(r));
  }, G), t.registerCommand(ia, (e) => {
    const [n] = Yr(e), r = $();
    if (n && !O(r)) return !1;
    const o = Sg(e.clientX, e.clientY);
    if (o !== null) {
      const i = Wt(o.node);
      ae(i) && e.preventDefault();
    }
    return !0;
  }, G), t.registerCommand(cl, () => (jy(), !0), G), t.registerCommand(Vi, (e) => (xg(t, gn(e, ClipboardEvent) ? e : null), !0), G), t.registerCommand(sa, (e) => (async function(n, r) {
    await xg(r, gn(n, ClipboardEvent) ? n : null), r.update(() => {
      const o = $();
      O(o) ? o.removeText() : $e(o) && o.getNodes().forEach((i) => i.remove());
    });
  }(e, t), !0), G), t.registerCommand(xo, (e) => {
    const [, n, r] = Yr(e);
    return n.length > 0 && !r ? (t.dispatchCommand(Pc, n), !0) : Yd(e.target) ? !1 : $() !== null && (function(o, i) {
      o.preventDefault(), i.update(() => {
        const s = $(), l = gn(o, InputEvent) || gn(o, KeyboardEvent) ? null : o.clipboardData;
        l != null && s !== null && _g(l, s, i);
      }, { tag: "paste" });
    }(e, t), !0);
  }, G));
}
const Fc = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function Eg(t) {
  return t.getEditorState().read(h_(t.isComposing()));
}
function jw({ contentEditable: t, placeholder: e, ErrorBoundary: n }) {
  const [r] = fe(), o = function(i, s) {
    const [l, a] = T.useState(() => i.getDecorators());
    return Fc(() => i.registerDecoratorListener((u) => {
      At.flushSync(() => {
        a(u);
      });
    }), [i]), T.useEffect(() => {
      a(i.getDecorators());
    }, [i]), T.useMemo(() => {
      const u = [], c = Object.keys(l);
      for (let p = 0; p < c.length; p++) {
        const d = c[p], m = N.jsx(s, { onError: (y) => i._onError(y), children: N.jsx(T.Suspense, { fallback: null, children: l[d] }) }), h = i.getElementByKey(d);
        h !== null && u.push(At.createPortal(m, h, d));
      }
      return u;
    }, [s, l, i]);
  }(r, n);
  return function(i) {
    Fc(() => De(zw(i), S_(i)), [i]);
  }(r), N.jsxs(N.Fragment, { children: [t, N.jsx(Bw, { content: e }), o] });
}
function Bw({ content: t }) {
  const [e] = fe(), n = function(o) {
    const [i, s] = T.useState(() => Eg(o));
    return Fc(() => {
      function l() {
        const a = Eg(o);
        s(a);
      }
      return l(), De(o.registerUpdateListener(() => {
        l();
      }), o.registerEditableListener(() => {
        l();
      }));
    }, [o]), i;
  }(e), r = g_();
  return n ? typeof t == "function" ? t(r) : t : null;
}
const No = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Uw = No && "documentMode" in document ? document.documentMode : null, Ww = !(!No || !("InputEvent" in window) || Uw) && "getTargetRanges" in new window.InputEvent("input"), Hw = No && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), Vw = No && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, Kw = No && /^(?=.*Chrome).*/i.test(navigator.userAgent), Qw = No && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !Kw;
function Tg(t, e) {
  e.update(() => {
    if (t !== null) {
      const n = gn(t, KeyboardEvent) ? null : t.clipboardData, r = $();
      if (r !== null && n != null) {
        t.preventDefault();
        const o = N_(e);
        o !== null && n.setData("text/html", o), n.setData("text/plain", r.getTextContent());
      }
    }
  });
}
function Gw(t) {
  return De(t.registerCommand(nn, (e) => {
    const n = $();
    return !!O(n) && (n.deleteCharacter(e), !0);
  }, G), t.registerCommand(po, (e) => {
    const n = $();
    return !!O(n) && (n.deleteWord(e), !0);
  }, G), t.registerCommand(go, (e) => {
    const n = $();
    return !!O(n) && (n.deleteLine(e), !0);
  }, G), t.registerCommand(pr, (e) => {
    const n = $();
    if (!O(n)) return !1;
    if (typeof e == "string") n.insertText(e);
    else {
      const r = e.dataTransfer;
      if (r != null) yg(r, n);
      else {
        const o = e.data;
        o && n.insertText(o);
      }
    }
    return !0;
  }, G), t.registerCommand(ul, () => {
    const e = $();
    return !!O(e) && (e.removeText(), !0);
  }, G), t.registerCommand(Wn, (e) => {
    const n = $();
    return !!O(n) && (n.insertLineBreak(e), !0);
  }, G), t.registerCommand(fo, () => {
    const e = $();
    return !!O(e) && (e.insertLineBreak(), !0);
  }, G), t.registerCommand(ql, (e) => {
    const n = $();
    if (!O(n)) return !1;
    const r = e, o = r.shiftKey;
    return !!El(n, !0) && (r.preventDefault(), Tl(n, o, !0), !0);
  }, G), t.registerCommand(Xl, (e) => {
    const n = $();
    if (!O(n)) return !1;
    const r = e, o = r.shiftKey;
    return !!El(n, !1) && (r.preventDefault(), Tl(n, o, !1), !0);
  }, G), t.registerCommand(wo, (e) => {
    const n = $();
    return !!O(n) && (e.preventDefault(), t.dispatchCommand(nn, !0));
  }, G), t.registerCommand(ra, (e) => {
    const n = $();
    return !!O(n) && (e.preventDefault(), t.dispatchCommand(nn, !1));
  }, G), t.registerCommand(wr, (e) => {
    const n = $();
    if (!O(n)) return !1;
    if (e !== null) {
      if ((Vw || Hw || Qw) && Ww) return !1;
      e.preventDefault();
    }
    return t.dispatchCommand(Wn, !1);
  }, G), t.registerCommand(cl, () => (jy(), !0), G), t.registerCommand(Vi, (e) => {
    const n = $();
    return !!O(n) && (Tg(e, t), !0);
  }, G), t.registerCommand(sa, (e) => {
    const n = $();
    return !!O(n) && (function(r, o) {
      Tg(r, o), o.update(() => {
        const i = $();
        O(i) && i.removeText();
      });
    }(e, t), !0);
  }, G), t.registerCommand(xo, (e) => {
    const n = $();
    return !!O(n) && (function(r, o) {
      r.preventDefault(), o.update(() => {
        const i = $(), { clipboardData: s } = r;
        s != null && O(i) && yg(s, i);
      }, { tag: "paste" });
    }(e, t), !0);
  }, G), t.registerCommand(Hi, (e) => {
    const n = $();
    return !!O(n) && (e.preventDefault(), !0);
  }, G), t.registerCommand(oa, (e) => {
    const n = $();
    return !!O(n) && (e.preventDefault(), !0);
  }, G));
}
const Lc = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function Ng(t) {
  return t.getEditorState().read(h_(t.isComposing()));
}
function Jw({ contentEditable: t, placeholder: e, ErrorBoundary: n }) {
  const [r] = fe(), o = function(i, s) {
    const [l, a] = T.useState(() => i.getDecorators());
    return Lc(() => i.registerDecoratorListener((u) => {
      At.flushSync(() => {
        a(u);
      });
    }), [i]), T.useEffect(() => {
      a(i.getDecorators());
    }, [i]), T.useMemo(() => {
      const u = [], c = Object.keys(l);
      for (let p = 0; p < c.length; p++) {
        const d = c[p], m = N.jsx(s, { onError: (y) => i._onError(y), children: N.jsx(T.Suspense, { fallback: null, children: l[d] }) }), h = i.getElementByKey(d);
        h !== null && u.push(At.createPortal(m, h, d));
      }
      return u;
    }, [s, l, i]);
  }(r, n);
  return function(i) {
    Lc(() => De(Gw(i), S_(i)), [i]);
  }(r), N.jsxs(N.Fragment, { children: [t, N.jsx(Yw, { content: e }), o] });
}
function Yw({ content: t }) {
  const [e] = fe(), n = function(o) {
    const [i, s] = T.useState(() => Ng(o));
    return Lc(() => {
      function l() {
        const a = Ng(o);
        s(a);
      }
      return l(), De(o.registerUpdateListener(() => {
        l();
      }), o.registerEditableListener(() => {
        l();
      }));
    }, [o]), i;
  }(e), r = g_();
  return n ? typeof t == "function" ? t(r) : t : null;
}
function Ic(t, e) {
  return Ic = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, Ic(t, e);
}
var bg = { error: null }, Zw = function(t) {
  var e, n;
  function r() {
    for (var i, s = arguments.length, l = new Array(s), a = 0; a < s; a++) l[a] = arguments[a];
    return (i = t.call.apply(t, [this].concat(l)) || this).state = bg, i.resetErrorBoundary = function() {
      for (var u, c = arguments.length, p = new Array(c), d = 0; d < c; d++) p[d] = arguments[d];
      i.props.onReset == null || (u = i.props).onReset.apply(u, p), i.reset();
    }, i;
  }
  n = t, (e = r).prototype = Object.create(n.prototype), e.prototype.constructor = e, Ic(e, n), r.getDerivedStateFromError = function(i) {
    return { error: i };
  };
  var o = r.prototype;
  return o.reset = function() {
    this.setState(bg);
  }, o.componentDidCatch = function(i, s) {
    var l, a;
    (l = (a = this.props).onError) == null || l.call(a, i, s);
  }, o.componentDidUpdate = function(i, s) {
    var l, a, u, c, p = this.state.error, d = this.props.resetKeys;
    p !== null && s.error !== null && ((u = i.resetKeys) === void 0 && (u = []), (c = d) === void 0 && (c = []), u.length !== c.length || u.some(function(m, h) {
      return !Object.is(m, c[h]);
    })) && ((l = (a = this.props).onResetKeysChange) == null || l.call(a, i.resetKeys, d), this.reset());
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
function Xw({ children: t, onError: e }) {
  return N.jsx(Zw, { fallback: N.jsx("div", { style: { border: "1px solid #f00", color: "#f00", padding: "8px" }, children: "An error was thrown." }), onError: e, children: t });
}
const qw = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function eS({ ariaActiveDescendant: t, ariaAutoComplete: e, ariaControls: n, ariaDescribedBy: r, ariaExpanded: o, ariaLabel: i, ariaLabelledBy: s, ariaMultiline: l, ariaOwns: a, ariaRequired: u, autoCapitalize: c, className: p, id: d, role: m = "textbox", spellCheck: h = !0, style: y, tabIndex: v, "data-testid": _, ...f }) {
  const [g] = fe(), [x, w] = T.useState(!1), S = T.useCallback((C) => {
    C && C.ownerDocument && C.ownerDocument.defaultView && g.setRootElement(C);
  }, [g]);
  return qw(() => (w(g.isEditable()), g.registerEditableListener((C) => {
    w(C);
  })), [g]), N.jsx("div", { ...f, "aria-activedescendant": x ? t : void 0, "aria-autocomplete": x ? e : "none", "aria-controls": x ? n : void 0, "aria-describedby": r, "aria-expanded": x && m === "combobox" ? !!o : void 0, "aria-label": i, "aria-labelledby": s, "aria-multiline": l, "aria-owns": x ? a : void 0, "aria-readonly": !x || void 0, "aria-required": u, autoCapitalize: c, className: p, contentEditable: x, "data-testid": _, id: d, ref: S, role: m, spellCheck: h, style: y, tabIndex: v });
}
function tS({ defaultSelection: t }) {
  const [e] = fe();
  return T.useEffect(() => {
    e.focus(() => {
      const n = document.activeElement, r = e.getRootElement();
      r === null || n !== null && r.contains(n) || r.focus({ preventScroll: !0 });
    }, { defaultSelection: t });
  }, [t, e]), null;
}
const xs = 0, Dc = 1, Rc = 2, Dt = 0, nS = 1, Ag = 2, rS = 3, oS = 4;
function iS(t, e, n, r, o) {
  if (t === null || n.size === 0 && r.size === 0 && !o) return Dt;
  const i = e._selection, s = t._selection;
  if (o) return nS;
  if (!(O(i) && O(s) && s.isCollapsed() && i.isCollapsed())) return Dt;
  const l = function(_, f, g) {
    const x = _._nodeMap, w = [];
    for (const S of f) {
      const C = x.get(S);
      C !== void 0 && w.push(C);
    }
    for (const [S, C] of g) {
      if (!C) continue;
      const k = x.get(S);
      k === void 0 || Ye(k) || w.push(k);
    }
    return w;
  }(e, n, r);
  if (l.length === 0) return Dt;
  if (l.length > 1) {
    const _ = e._nodeMap, f = _.get(i.anchor.key), g = _.get(s.anchor.key);
    return f && g && !t._nodeMap.has(f.__key) && I(f) && f.__text.length === 1 && i.anchor.offset === 1 ? Ag : Dt;
  }
  const a = l[0], u = t._nodeMap.get(a.__key);
  if (!I(u) || !I(a) || u.__mode !== a.__mode) return Dt;
  const c = u.__text, p = a.__text;
  if (c === p) return Dt;
  const d = i.anchor, m = s.anchor;
  if (d.key !== m.key || d.type !== "text") return Dt;
  const h = d.offset, y = m.offset, v = p.length - c.length;
  return v === 1 && y === h - 1 ? Ag : v === -1 && y === h + 1 ? rS : v === -1 && y === h ? oS : Dt;
}
function sS(t, e) {
  let n = Date.now(), r = Dt;
  return (o, i, s, l, a, u) => {
    const c = Date.now();
    if (u.has("historic")) return r = Dt, n = c, Rc;
    const p = iS(o, i, l, a, t.isComposing()), d = (() => {
      const m = s === null || s.editor === t, h = u.has("history-push");
      if (!h && m && u.has("history-merge")) return xs;
      if (o === null) return Dc;
      const y = i._selection;
      return l.size > 0 || a.size > 0 ? h === !1 && p !== Dt && p === r && c < n + e && m || l.size === 1 && function(v, _, f) {
        const g = _._nodeMap.get(v), x = f._nodeMap.get(v), w = _._selection, S = f._selection;
        let C = !1;
        return O(w) && O(S) && (C = w.anchor.type === "element" && w.focus.type === "element" && S.anchor.type === "text" && S.focus.type === "text"), !(C || !I(g) || !I(x)) && g.__type === x.__type && g.__text === x.__text && g.__mode === x.__mode && g.__detail === x.__detail && g.__style === x.__style && g.__format === x.__format && g.__parent === x.__parent;
      }(Array.from(l)[0], o, i) ? xs : Dc : y !== null ? xs : Rc;
    })();
    return n = c, r = p, d;
  };
}
function Og(t) {
  t.undoStack = [], t.redoStack = [], t.current = null;
}
function lS(t, e, n) {
  const r = sS(t, n);
  return De(t.registerCommand(Yl, () => (function(i, s) {
    const l = s.redoStack, a = s.undoStack;
    if (a.length !== 0) {
      const u = s.current, c = a.pop();
      u !== null && (l.push(u), i.dispatchCommand(Qo, !0)), a.length === 0 && i.dispatchCommand(Go, !1), s.current = c || null, c && c.editor.setEditorState(c.editorState, { tag: "historic" });
    }
  }(t, e), !0), G), t.registerCommand(Zl, () => (function(i, s) {
    const l = s.redoStack, a = s.undoStack;
    if (l.length !== 0) {
      const u = s.current;
      u !== null && (a.push(u), i.dispatchCommand(Go, !0));
      const c = l.pop();
      l.length === 0 && i.dispatchCommand(Qo, !1), s.current = c || null, c && c.editor.setEditorState(c.editorState, { tag: "historic" });
    }
  }(t, e), !0), G), t.registerCommand(i1, () => (Og(e), !1), G), t.registerCommand(s1, () => (Og(e), t.dispatchCommand(Qo, !1), t.dispatchCommand(Go, !1), !0), G), t.registerUpdateListener(({ editorState: i, prevEditorState: s, dirtyLeaves: l, dirtyElements: a, tags: u }) => {
    const c = e.current, p = e.redoStack, d = e.undoStack, m = c === null ? null : c.editorState;
    if (c !== null && i === m) return;
    const h = r(s, i, c, l, a, u);
    if (h === Dc) p.length !== 0 && (e.redoStack = [], t.dispatchCommand(Qo, !1)), c !== null && (d.push({ ...c }), t.dispatchCommand(Go, !0));
    else if (h === Rc) return;
    e.current = { editor: t, editorState: i };
  }));
}
function aS() {
  return { current: null, redoStack: [], undoStack: [] };
}
function uS({ externalHistoryState: t }) {
  const [e] = fe();
  return function(n, r, o = 1e3) {
    const i = T.useMemo(() => r || aS(), [r]);
    T.useEffect(() => lS(n, i, o), [o, n, i]);
  }(e, t), null;
}
const P_ = /^(\d+(?:\.\d+)?)px$/, bl = { BOTH: 3, COLUMN: 2, NO_STATUS: 0, ROW: 1 };
let mf = class $_ extends St {
  static getType() {
    return "tablecell";
  }
  static clone(e) {
    const n = new $_(e.__headerState, e.__colSpan, e.__width, e.__key);
    return n.__rowSpan = e.__rowSpan, n.__backgroundColor = e.__backgroundColor, n;
  }
  static importDOM() {
    return { td: (e) => ({ conversion: Pg, priority: 0 }), th: (e) => ({ conversion: Pg, priority: 0 }) };
  }
  static importJSON(e) {
    const n = e.colSpan || 1, r = e.rowSpan || 1, o = F_(e.headerState, n, e.width || void 0);
    return o.__rowSpan = r, o.__backgroundColor = e.backgroundColor || null, o;
  }
  constructor(e = bl.NO_STATUS, n = 1, r, o) {
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
    return this.getLatest().__headerState !== bl.NO_STATUS;
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
function Pg(t) {
  const e = t, n = t.nodeName.toLowerCase();
  let r;
  P_.test(e.style.width) && (r = parseFloat(e.style.width));
  const o = F_(n === "th" ? bl.ROW : bl.NO_STATUS, e.colSpan, r);
  o.__rowSpan = e.rowSpan;
  const i = e.style.backgroundColor;
  i !== "" && (o.__backgroundColor = i);
  const s = e.style, l = s.textDecoration.split(" "), a = s.fontWeight === "700" || s.fontWeight === "bold", u = l.includes("line-through"), c = s.fontStyle === "italic", p = l.includes("underline");
  return { after: (d) => (d.length === 0 && d.push(de()), d), forChild: (d, m) => {
    if (L_(m) && !A(d)) {
      const h = de();
      return Vn(d) && d.getTextContent() === `
` ? null : (I(d) && (a && d.toggleFormat("bold"), u && d.toggleFormat("strikethrough"), c && d.toggleFormat("italic"), p && d.toggleFormat("underline")), h.append(d), h);
    }
    return d;
  }, node: o };
}
function F_(t, e = 1, n) {
  return Be(new mf(t, e, n));
}
function L_(t) {
  return t instanceof mf;
}
let yf = class I_ extends St {
  static getType() {
    return "tablerow";
  }
  static clone(e) {
    return new I_(e.__height, e.__key);
  }
  static importDOM() {
    return { tr: (e) => ({ conversion: cS, priority: 0 }) };
  }
  static importJSON(e) {
    return D_(e.height);
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
function cS(t) {
  const e = t;
  let n;
  return P_.test(e.style.height) && (n = parseFloat(e.style.height)), { node: D_(n) };
}
function D_(t) {
  return Be(new yf(t));
}
function dS(t) {
  return t instanceof yf;
}
function fS(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
fS(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
let R_ = class M_ extends St {
  static getType() {
    return "table";
  }
  static clone(e) {
    return new M_(e.__key);
  }
  static importDOM() {
    return { table: (e) => ({ conversion: pS, priority: 1 }) };
  }
  static importJSON(e) {
    return z_();
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
        sn(n) && i.append(...n.children);
        const s = this.getFirstChildOrThrow();
        if (!dS(s)) throw new Error("Expected to find row node.");
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
        return Wt(u) === e;
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
    const i = Wt(o.elem);
    return L_(i) ? i : null;
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
function pS(t) {
  return { node: z_() };
}
function z_() {
  return Be(new R_());
}
function gS(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var hn = gS(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
function hS(t) {
  let e = 1, n = t.getParent();
  for (; n != null; ) {
    if (ve(n)) {
      const r = n.getParent();
      if (ee(r)) {
        e++, n = r.getParent();
        continue;
      }
      hn(40);
    }
    return e;
  }
  return e;
}
function Mc(t) {
  let e = t.getParent();
  ee(e) || hn(40);
  let n = e;
  for (; n !== null; ) n = n.getParent(), ee(n) && (e = n);
  return e;
}
function j_(t) {
  let e = [];
  const n = t.getChildren().filter(ve);
  for (let r = 0; r < n.length; r++) {
    const o = n[r], i = o.getFirstChild();
    ee(i) ? e = e.concat(j_(i)) : e.push(o);
  }
  return e;
}
function Zt(t) {
  return ve(t) && ee(t.getFirstChild());
}
function $g(t) {
  return pt().append(t);
}
function B_(t, e) {
  return ve(t) && (e.length === 0 || e.length === 1 && t.is(e[0]) && t.getChildrenSize() === 0);
}
function Fg(t, e) {
  t.update(() => {
    const n = $();
    if (n !== null) {
      const r = n.getNodes();
      if (O(n)) {
        const i = n.getStartEndPoints();
        i === null && hn(143);
        const [s] = i, l = s.getNode(), a = l.getParent();
        if (B_(l, r)) {
          const u = nt(e);
          if (ft(a)) {
            l.replace(u);
            const c = pt();
            A(l) && (c.setFormat(l.getFormatType()), c.setIndent(l.getIndent())), u.append(c);
          } else if (ve(l)) {
            const c = l.getParentOrThrow();
            kr(u, c.getChildren()), c.replace(u);
          }
          return;
        }
      }
      const o = /* @__PURE__ */ new Set();
      for (let i = 0; i < r.length; i++) {
        const s = r[i];
        if (!A(s) || !s.isEmpty() || ve(s) || o.has(s.getKey())) {
          if (Zd(s)) {
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
                if (ft(u) && !o.has(a)) {
                  o.add(a), Lg(l, e);
                  break;
                }
                l = u;
              }
            }
          }
        } else Lg(s, e);
      }
    }
  });
}
function kr(t, e) {
  t.splice(t.getChildrenSize(), 0, e);
}
function Lg(t, e) {
  if (ee(t)) return t;
  const n = t.getPreviousSibling(), r = t.getNextSibling(), o = pt();
  if (o.setFormat(t.getFormatType()), o.setIndent(t.getIndent()), kr(o, t.getChildren()), ee(n) && e === n.getListType()) return n.append(o), t.remove(), ee(r) && e === r.getListType() && (kr(n, r.getChildren()), r.remove()), n;
  if (ee(r) && e === r.getListType()) return r.getFirstChildOrThrow().insertBefore(o), t.remove(), r;
  {
    const i = nt(e);
    return i.append(o), t.replace(i), i;
  }
}
function _f(t, e) {
  const n = t.getLastChild(), r = e.getFirstChild();
  n && r && Zt(n) && Zt(r) && (_f(n.getFirstChild(), r.getFirstChild()), r.remove());
  const o = e.getChildren();
  o.length > 0 && t.append(...o), e.remove();
}
function mS(t) {
  t.update(() => {
    const e = $();
    if (O(e)) {
      const n = /* @__PURE__ */ new Set(), r = e.getNodes(), o = e.anchor.getNode();
      if (B_(o, r)) n.add(Mc(o));
      else for (let i = 0; i < r.length; i++) {
        const s = r[i];
        if (Zd(s)) {
          const l = w_(s, br);
          l != null && n.add(Mc(l));
        }
      }
      for (const i of n) {
        let s = i;
        const l = j_(i);
        for (const a of l) {
          const u = de();
          kr(u, a.getChildren()), s.insertAfter(u), s = u, a.__key === e.anchor.key && e.anchor.set(u.getKey(), 0, "element"), a.__key === e.focus.key && e.focus.set(u.getKey(), 0, "element"), a.remove();
        }
        i.remove();
      }
    }
  });
}
function yS(t) {
  const e = /* @__PURE__ */ new Set();
  if (Zt(t) || e.has(t.getKey())) return;
  const n = t.getParent(), r = t.getNextSibling(), o = t.getPreviousSibling();
  if (Zt(r) && Zt(o)) {
    const i = o.getFirstChild();
    if (ee(i)) {
      i.append(t);
      const s = r.getFirstChild();
      ee(s) && (kr(i, s.getChildren()), r.remove(), e.add(r.getKey()));
    }
  } else if (Zt(r)) {
    const i = r.getFirstChild();
    if (ee(i)) {
      const s = i.getFirstChild();
      s !== null && s.insertBefore(t);
    }
  } else if (Zt(o)) {
    const i = o.getFirstChild();
    ee(i) && i.append(t);
  } else if (ee(n)) {
    const i = pt(), s = nt(n.getListType());
    i.append(s), s.append(t), o ? o.insertAfter(i) : r ? r.insertBefore(i) : n.append(i);
  }
}
function _S(t) {
  if (Zt(t)) return;
  const e = t.getParent(), n = e ? e.getParent() : void 0;
  if (ee(n ? n.getParent() : void 0) && ve(n) && ee(e)) {
    const r = e ? e.getFirstChild() : void 0, o = e ? e.getLastChild() : void 0;
    if (t.is(r)) n.insertBefore(t), e.isEmpty() && n.remove();
    else if (t.is(o)) n.insertAfter(t), e.isEmpty() && n.remove();
    else {
      const i = e.getListType(), s = pt(), l = nt(i);
      s.append(l), t.getPreviousSiblings().forEach((c) => l.append(c));
      const a = pt(), u = nt(i);
      a.append(u), kr(u, t.getNextSiblings()), n.insertBefore(s), n.insertAfter(a), n.replace(t);
    }
  }
}
function vS() {
  const t = $();
  if (!O(t) || !t.isCollapsed()) return !1;
  const e = t.anchor.getNode();
  if (!ve(e) || e.getChildrenSize() !== 0) return !1;
  const n = Mc(e), r = e.getParent();
  ee(r) || hn(40);
  const o = r.getParent();
  let i;
  if (ft(o)) i = de(), n.insertAfter(i);
  else {
    if (!ve(o)) return !1;
    i = pt(), o.insertAfter(i);
  }
  i.select();
  const s = e.getNextSiblings();
  if (s.length > 0) {
    const l = nt(r.getListType());
    if (Vt(i)) i.insertAfter(l);
    else {
      const a = pt();
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
      if (u == null || !ve(a) && !ee(a)) break;
      a = u;
    }
    a.remove();
  }(e), !0;
}
function Al(...t) {
  const e = [];
  for (const n of t) if (n && typeof n == "string") for (const [r] of n.matchAll(/\S+/g)) e.push(r);
  return e;
}
let br = class U_ extends St {
  static getType() {
    return "listitem";
  }
  static clone(e) {
    return new U_(e.__value, e.__checked, e.__key);
  }
  constructor(e, n, r) {
    super(r), this.__value = e === void 0 ? 1 : e, this.__checked = n;
  }
  createDOM(e) {
    const n = document.createElement("li"), r = this.getParent();
    return ee(r) && r.getListType() === "check" && Dg(n, this, null), n.value = this.__value, Ig(n, e.theme, this), n;
  }
  updateDOM(e, n, r) {
    const o = this.getParent();
    return ee(o) && o.getListType() === "check" && Dg(n, this, e), n.value = this.__value, Ig(n, r.theme, this), !1;
  }
  static transform() {
    return (e) => {
      if (ve(e) || hn(144), e.__checked == null) return;
      const n = e.getParent();
      ee(n) && n.getListType() !== "check" && e.getChecked() != null && e.setChecked(void 0);
    };
  }
  static importDOM() {
    return { li: () => ({ conversion: xS, priority: 0 }) };
  }
  static importJSON(e) {
    const n = pt();
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
      if (A(r) && this.canMergeWith(r)) {
        const o = r.getChildren();
        this.append(...o), r.remove();
      } else super.append(r);
    }
    return this;
  }
  replace(e, n) {
    if (ve(e)) return super.replace(e);
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
    return n && (A(e) || hn(139), this.getChildren().forEach((o) => {
      e.append(o);
    })), this.remove(), r.getChildrenSize() === 0 && r.remove(), e;
  }
  insertAfter(e, n = !0) {
    const r = this.getParentOrThrow();
    if (ee(r) || hn(39), ve(e)) return super.insertAfter(e, n);
    const o = this.getNextSiblings();
    if (r.insertAfter(e, n), o.length !== 0) {
      const i = nt(r.getListType());
      o.forEach((s) => i.append(s)), e.insertAfter(i, n);
    }
    return e;
  }
  remove(e) {
    const n = this.getPreviousSibling(), r = this.getNextSibling();
    super.remove(e), n && r && Zt(n) && Zt(r) && (_f(n.getFirstChild(), r.getFirstChild()), r.remove());
  }
  insertNewAfter(e, n = !0) {
    const r = pt(this.__checked == null && void 0);
    return this.insertAfter(r, n), r;
  }
  collapseAtStart(e) {
    const n = de();
    this.getChildren().forEach((s) => n.append(s));
    const r = this.getParentOrThrow(), o = r.getParentOrThrow(), i = ve(o);
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
    for (; ve(n); ) n = n.getParentOrThrow().getParentOrThrow(), r++;
    return r;
  }
  setIndent(e) {
    typeof e == "number" && e > -1 || hn(117);
    let n = this.getIndent();
    for (; n !== e; ) n < e ? (yS(this), n++) : (_S(this), n--);
    return this;
  }
  canInsertAfter(e) {
    return ve(e);
  }
  canReplaceWith(e) {
    return ve(e);
  }
  canMergeWith(e) {
    return Vt(e) || ve(e);
  }
  extractWithChild(e, n) {
    if (!O(n)) return !1;
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
function Ig(t, e, n) {
  const r = [], o = [], i = e.list, s = i ? i.listitem : void 0;
  let l;
  if (i && i.nested && (l = i.nested.listitem), s !== void 0 && r.push(...Al(s)), i) {
    const a = n.getParent(), u = ee(a) && a.getListType() === "check", c = n.getChecked();
    u && !c || o.push(i.listitemUnchecked), u && c || o.push(i.listitemChecked), u && r.push(c ? i.listitemChecked : i.listitemUnchecked);
  }
  if (l !== void 0) {
    const a = Al(l);
    n.getChildren().some((u) => ee(u)) ? r.push(...a) : o.push(...a);
  }
  o.length > 0 && hf(t, ...o), r.length > 0 && Ot(t, ...r);
}
function Dg(t, e, n, r) {
  ee(e.getFirstChild()) ? (t.removeAttribute("role"), t.removeAttribute("tabIndex"), t.removeAttribute("aria-checked")) : (t.setAttribute("role", "checkbox"), t.setAttribute("tabIndex", "-1"), n && e.__checked === n.__checked || t.setAttribute("aria-checked", e.getChecked() ? "true" : "false"));
}
function xS(t) {
  if (t.classList.contains("task-list-item")) {
    for (const n of t.children) if (n.tagName === "INPUT") return wS(n);
  }
  const e = t.getAttribute("aria-checked");
  return { node: pt(e === "true" || e !== "false" && void 0) };
}
function wS(t) {
  return t.getAttribute("type") !== "checkbox" ? { node: null } : { node: pt(t.hasAttribute("checked")) };
}
function pt(t) {
  return Be(new br(void 0, t));
}
function ve(t) {
  return t instanceof br;
}
let Ar = class W_ extends St {
  static getType() {
    return "list";
  }
  static clone(e) {
    const n = e.__listType || zg[e.__tag];
    return new W_(n, e.__start, e.__key);
  }
  constructor(e, n, r) {
    super(r);
    const o = zg[e] || e;
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
    return this.__start !== 1 && o.setAttribute("start", String(this.__start)), o.__lexicalListType = this.__listType, Rg(o, e.theme, this), o;
  }
  updateDOM(e, n, r) {
    return e.__tag !== this.__tag || (Rg(n, r.theme, this), !1);
  }
  static transform() {
    return (e) => {
      ee(e) || hn(163), function(n) {
        const r = n.getNextSibling();
        ee(r) && n.getListType() === r.getListType() && _f(n, r);
      }(e), function(n) {
        const r = n.getListType() !== "check";
        let o = n.getStart();
        for (const i of n.getChildren()) ve(i) && (i.getValue() !== o && i.setValue(o), r && i.getChecked() != null && i.setChecked(void 0), ee(i.getFirstChild()) || o++);
      }(e);
    };
  }
  static importDOM() {
    return { ol: () => ({ conversion: Mg, priority: 0 }), ul: () => ({ conversion: Mg, priority: 0 }) };
  }
  static importJSON(e) {
    const n = nt(e.listType, e.start);
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  exportDOM(e) {
    const { element: n } = super.exportDOM(e);
    return n && sn(n) && (this.__start !== 1 && n.setAttribute("start", String(this.__start)), this.__listType === "check" && n.setAttribute("__lexicalListType", "check")), { element: n };
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
      if (ve(r)) super.append(r);
      else {
        const o = pt();
        if (ee(r)) o.append(r);
        else if (A(r)) {
          const i = le(r.getTextContent());
          o.append(i);
        } else o.append(r);
        super.append(o);
      }
    }
    return this;
  }
  extractWithChild(e) {
    return ve(e);
  }
};
function Rg(t, e, n) {
  const r = [], o = [], i = e.list;
  if (i !== void 0) {
    const s = i[`${n.__tag}Depth`] || [], l = hS(n) - 1, a = l % s.length, u = s[a], c = i[n.__tag];
    let p;
    const d = i.nested, m = i.checklist;
    if (d !== void 0 && d.list && (p = d.list), c !== void 0 && r.push(c), m !== void 0 && n.__listType === "check" && r.push(m), u !== void 0) {
      r.push(...Al(u));
      for (let h = 0; h < s.length; h++) h !== a && o.push(n.__tag + h);
    }
    if (p !== void 0) {
      const h = Al(p);
      l > 1 ? r.push(...h) : o.push(...h);
    }
  }
  o.length > 0 && hf(t, ...o), r.length > 0 && Ot(t, ...r);
}
function SS(t) {
  const e = [];
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (ve(r)) {
      e.push(r);
      const o = r.getChildren();
      o.length > 1 && o.forEach((i) => {
        ee(i) && e.push($g(i));
      });
    } else e.push($g(r));
  }
  return e;
}
function Mg(t) {
  const e = t.nodeName.toLowerCase();
  let n = null;
  return e === "ol" ? n = nt("number", t.start) : e === "ul" && (n = function(r) {
    if (r.getAttribute("__lexicallisttype") === "check" || r.classList.contains("contains-task-list")) return !0;
    for (const o of r.childNodes) if (sn(o) && o.hasAttribute("aria-checked")) return !0;
    return !1;
  }(t) ? nt("check") : nt("bullet")), { after: SS, node: n };
}
const zg = { ol: "number", ul: "bullet" };
function nt(t, e = 1) {
  return Be(new Ar(t, e));
}
function ee(t) {
  return t instanceof Ar;
}
const H_ = Kt(), V_ = Kt(), zc = Kt();
var CS = { exports: {} };
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
        encode: function f(g) {
          return g instanceof a ? new a(g.type, f(g.content), g.alias) : Array.isArray(g) ? g.map(f) : g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
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
        type: function(f) {
          return Object.prototype.toString.call(f).slice(8, -1);
        },
        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function(f) {
          return f.__id || Object.defineProperty(f, "__id", { value: ++i }), f.__id;
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
        clone: function f(g, x) {
          x = x || {};
          var w, S;
          switch (l.util.type(g)) {
            case "Object":
              if (S = l.util.objId(g), x[S])
                return x[S];
              w = /** @type {Record<string, any>} */
              {}, x[S] = w;
              for (var C in g)
                g.hasOwnProperty(C) && (w[C] = f(g[C], x));
              return (
                /** @type {any} */
                w
              );
            case "Array":
              return S = l.util.objId(g), x[S] ? x[S] : (w = [], x[S] = w, /** @type {Array} */
              /** @type {any} */
              g.forEach(function(k, E) {
                w[E] = f(k, x);
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
        getLanguage: function(f) {
          for (; f; ) {
            var g = o.exec(f.className);
            if (g)
              return g[1].toLowerCase();
            f = f.parentElement;
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
        setLanguage: function(f, g) {
          f.className = f.className.replace(RegExp(o, "gi"), ""), f.classList.add("language-" + g);
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
            var f = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(w.stack) || [])[1];
            if (f) {
              var g = document.getElementsByTagName("script");
              for (var x in g)
                if (g[x].src == f)
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
        isActive: function(f, g, x) {
          for (var w = "no-" + g; f; ) {
            var S = f.classList;
            if (S.contains(g))
              return !0;
            if (S.contains(w))
              return !1;
            f = f.parentElement;
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
        extend: function(f, g) {
          var x = l.util.clone(l.languages[f]);
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
        insertBefore: function(f, g, x, w) {
          w = w || /** @type {any} */
          l.languages;
          var S = w[f], C = {};
          for (var k in S)
            if (S.hasOwnProperty(k)) {
              if (k == g)
                for (var E in x)
                  x.hasOwnProperty(E) && (C[E] = x[E]);
              x.hasOwnProperty(k) || (C[k] = S[k]);
            }
          var b = w[f];
          return w[f] = C, l.languages.DFS(l.languages, function(R, z) {
            z === b && R != f && (this[R] = C);
          }), C;
        },
        // Traverse a language definition with Depth First Search
        DFS: function f(g, x, w, S) {
          S = S || {};
          var C = l.util.objId;
          for (var k in g)
            if (g.hasOwnProperty(k)) {
              x.call(g, k, g[k], w || k);
              var E = g[k], b = l.util.type(E);
              b === "Object" && !S[C(E)] ? (S[C(E)] = !0, f(E, x, null, S)) : b === "Array" && !S[C(E)] && (S[C(E)] = !0, f(E, x, k, S));
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
      highlightAll: function(f, g) {
        l.highlightAllUnder(document, f, g);
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
      highlightAllUnder: function(f, g, x) {
        var w = {
          callback: x,
          container: f,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        l.hooks.run("before-highlightall", w), w.elements = Array.prototype.slice.apply(w.container.querySelectorAll(w.selector)), l.hooks.run("before-all-elements-highlight", w);
        for (var S = 0, C; C = w.elements[S++]; )
          l.highlightElement(C, g === !0, w.callback);
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
      highlightElement: function(f, g, x) {
        var w = l.util.getLanguage(f), S = l.languages[w];
        l.util.setLanguage(f, w);
        var C = f.parentElement;
        C && C.nodeName.toLowerCase() === "pre" && l.util.setLanguage(C, w);
        var k = f.textContent, E = {
          element: f,
          language: w,
          grammar: S,
          code: k
        };
        function b(z) {
          E.highlightedCode = z, l.hooks.run("before-insert", E), E.element.innerHTML = E.highlightedCode, l.hooks.run("after-highlight", E), l.hooks.run("complete", E), x && x.call(E.element);
        }
        if (l.hooks.run("before-sanity-check", E), C = E.element.parentElement, C && C.nodeName.toLowerCase() === "pre" && !C.hasAttribute("tabindex") && C.setAttribute("tabindex", "0"), !E.code) {
          l.hooks.run("complete", E), x && x.call(E.element);
          return;
        }
        if (l.hooks.run("before-highlight", E), !E.grammar) {
          b(l.util.encode(E.code));
          return;
        }
        if (g && r.Worker) {
          var R = new Worker(l.filename);
          R.onmessage = function(z) {
            b(z.data);
          }, R.postMessage(JSON.stringify({
            language: E.language,
            code: E.code,
            immediateClose: !0
          }));
        } else
          b(l.highlight(E.code, E.grammar, E.language));
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
      highlight: function(f, g, x) {
        var w = {
          code: f,
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
      tokenize: function(f, g) {
        var x = g.rest;
        if (x) {
          for (var w in x)
            g[w] = x[w];
          delete g.rest;
        }
        var S = new p();
        return d(S, S.head, f), c(f, S, g, S.head, 0), h(S);
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
        add: function(f, g) {
          var x = l.hooks.all;
          x[f] = x[f] || [], x[f].push(g);
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
        run: function(f, g) {
          var x = l.hooks.all[f];
          if (!(!x || !x.length))
            for (var w = 0, S; S = x[w++]; )
              S(g);
        }
      },
      Token: a
    };
    r.Prism = l;
    function a(f, g, x, w) {
      this.type = f, this.content = g, this.alias = x, this.length = (w || "").length | 0;
    }
    a.stringify = function f(g, x) {
      if (typeof g == "string")
        return g;
      if (Array.isArray(g)) {
        var w = "";
        return g.forEach(function(b) {
          w += f(b, x);
        }), w;
      }
      var S = {
        type: g.type,
        content: f(g.content, x),
        tag: "span",
        classes: ["token", g.type],
        attributes: {},
        language: x
      }, C = g.alias;
      C && (Array.isArray(C) ? Array.prototype.push.apply(S.classes, C) : S.classes.push(C)), l.hooks.run("wrap", S);
      var k = "";
      for (var E in S.attributes)
        k += " " + E + '="' + (S.attributes[E] || "").replace(/"/g, "&quot;") + '"';
      return "<" + S.tag + ' class="' + S.classes.join(" ") + '"' + k + ">" + S.content + "</" + S.tag + ">";
    };
    function u(f, g, x, w) {
      f.lastIndex = g;
      var S = f.exec(x);
      if (S && w && S[1]) {
        var C = S[1].length;
        S.index += C, S[0] = S[0].slice(C);
      }
      return S;
    }
    function c(f, g, x, w, S, C) {
      for (var k in x)
        if (!(!x.hasOwnProperty(k) || !x[k])) {
          var E = x[k];
          E = Array.isArray(E) ? E : [E];
          for (var b = 0; b < E.length; ++b) {
            if (C && C.cause == k + "," + b)
              return;
            var R = E[b], z = R.inside, V = !!R.lookbehind, K = !!R.greedy, Z = R.alias;
            if (K && !R.pattern.global) {
              var Y = R.pattern.toString().match(/[imsuy]*$/)[0];
              R.pattern = RegExp(R.pattern.source, Y + "g");
            }
            for (var ne = R.pattern || R, F = w.next, W = S; F !== g.tail && !(C && W >= C.reach); W += F.value.length, F = F.next) {
              var j = F.value;
              if (g.length > f.length)
                return;
              if (!(j instanceof a)) {
                var X = 1, J;
                if (K) {
                  if (J = u(ne, W, f, V), !J || J.index >= f.length)
                    break;
                  var se = J.index, ge = J.index + J[0].length, ie = W;
                  for (ie += F.value.length; se >= ie; )
                    F = F.next, ie += F.value.length;
                  if (ie -= F.value.length, W = ie, F.value instanceof a)
                    continue;
                  for (var Te = F; Te !== g.tail && (ie < ge || typeof Te.value == "string"); Te = Te.next)
                    X++, ie += Te.value.length;
                  X--, j = f.slice(W, ie), J.index -= W;
                } else if (J = u(ne, 0, j, V), !J)
                  continue;
                var se = J.index, Ne = J[0], _e = j.slice(0, se), P = j.slice(se + Ne.length), L = W + j.length;
                C && L > C.reach && (C.reach = L);
                var M = F.prev;
                _e && (M = d(g, M, _e), W += _e.length), m(g, M, X);
                var Q = new a(k, z ? l.tokenize(Ne, z) : Ne, Z, Ne);
                if (F = d(g, M, Q), P && d(g, F, P), X > 1) {
                  var q = {
                    cause: k + "," + b,
                    reach: L
                  };
                  c(f, g, x, F.prev, W, q), C && q.reach > C.reach && (C.reach = q.reach);
                }
              }
            }
          }
        }
    }
    function p() {
      var f = { value: null, prev: null, next: null }, g = { value: null, prev: f, next: null };
      f.next = g, this.head = f, this.tail = g, this.length = 0;
    }
    function d(f, g, x) {
      var w = g.next, S = { value: x, prev: g, next: w };
      return g.next = S, w.prev = S, f.length++, S;
    }
    function m(f, g, x) {
      for (var w = g.next, S = 0; S < x && w !== f.tail; S++)
        w = w.next;
      g.next = w, w.prev = g, f.length -= S;
    }
    function h(f) {
      for (var g = [], x = f.head.next; x !== f.tail; )
        g.push(x.value), x = x.next;
      return g;
    }
    if (!r.document)
      return r.addEventListener && (l.disableWorkerMessageHandler || r.addEventListener("message", function(f) {
        var g = JSON.parse(f.data), x = g.language, w = g.code, S = g.immediateClose;
        r.postMessage(l.highlight(w, l.languages[x], x)), S && r.close();
      }, !1)), l;
    var y = l.util.currentScript();
    y && (l.filename = y.src, y.hasAttribute("data-manual") && (l.manual = !0));
    function v() {
      l.manual || l.highlightAll();
    }
    if (!l.manual) {
      var _ = document.readyState;
      _ === "loading" || _ === "interactive" && y && y.defer ? document.addEventListener("DOMContentLoaded", v) : window.requestAnimationFrame ? window.requestAnimationFrame(v) : window.setTimeout(v, 16);
    }
    return l;
  }(e);
  t.exports && (t.exports = n), typeof kf < "u" && (kf.Prism = n), n.languages.markup = {
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
    var r = "Loading…", o = function(y, v) {
      return "✖ Error " + y + " while fetching file: " + v;
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
    function d(y, v, _) {
      var f = new XMLHttpRequest();
      f.open("GET", y, !0), f.onreadystatechange = function() {
        f.readyState == 4 && (f.status < 400 && f.responseText ? v(f.responseText) : f.status >= 400 ? _(o(f.status, f.statusText)) : _(i));
      }, f.send(null);
    }
    function m(y) {
      var v = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(y || "");
      if (v) {
        var _ = Number(v[1]), f = v[2], g = v[3];
        return f ? g ? [_, Number(g)] : [_, void 0] : [_, _];
      }
    }
    n.hooks.add("before-highlightall", function(y) {
      y.selector += ", " + p;
    }), n.hooks.add("before-sanity-check", function(y) {
      var v = (
        /** @type {HTMLPreElement} */
        y.element
      );
      if (v.matches(p)) {
        y.code = "", v.setAttribute(l, a);
        var _ = v.appendChild(document.createElement("CODE"));
        _.textContent = r;
        var f = v.getAttribute("data-src"), g = y.language;
        if (g === "none") {
          var x = (/\.(\w+)$/.exec(f) || [, "none"])[1];
          g = s[x] || x;
        }
        n.util.setLanguage(_, g), n.util.setLanguage(v, g);
        var w = n.plugins.autoloader;
        w && w.loadLanguages(g), d(
          f,
          function(S) {
            v.setAttribute(l, u);
            var C = m(v.getAttribute("data-range"));
            if (C) {
              var k = S.split(/\r\n?|\n/g), E = C[0], b = C[1] == null ? k.length : C[1];
              E < 0 && (E += k.length), E = Math.max(0, Math.min(E - 1, k.length)), b < 0 && (b += k.length), b = Math.max(0, Math.min(b, k.length)), S = k.slice(E, b).join(`
`), v.hasAttribute("data-start") || v.setAttribute("data-start", String(E + 1));
            }
            _.textContent = S, n.highlightElement(_);
          },
          function(S) {
            v.setAttribute(l, c), _.textContent = S;
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
      highlight: function(v) {
        for (var _ = (v || document).querySelectorAll(p), f = 0, g; g = _[f++]; )
          n.highlightElement(g);
      }
    };
    var h = !1;
    n.fileHighlight = function() {
      h || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), h = !0), n.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  }();
})(CS);
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
    function p(d) {
      if (!(!d || typeof d == "string"))
        for (var m = 0, h = d.length; m < h; m++) {
          var y = d[m];
          if (y.type !== "code") {
            p(y.content);
            continue;
          }
          var v = y.content[1], _ = y.content[3];
          if (v && _ && v.type === "code-language" && _.type === "code-block" && typeof v.content == "string") {
            var f = v.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp");
            f = (/[a-z][\w-]*/i.exec(f) || [""])[0].toLowerCase();
            var g = "language-" + f;
            _.alias ? typeof _.alias == "string" ? _.alias = [_.alias, g] : _.alias.push(g) : _.alias = [g];
          }
        }
    }
    p(c.tokens);
  }), t.hooks.add("wrap", function(c) {
    if (c.type === "code-block") {
      for (var p = "", d = 0, m = c.classes.length; d < m; d++) {
        var h = c.classes[d], y = /language-(.+)/.exec(h);
        if (y) {
          p = y[1];
          break;
        }
      }
      var v = t.languages[p];
      if (v)
        c.content = t.highlight(u(c.content), v, p);
      else if (p && p !== "none" && t.plugins.autoloader) {
        var _ = "md-" + (/* @__PURE__ */ new Date()).valueOf() + "-" + Math.floor(Math.random() * 1e16);
        c.attributes.id = _, t.plugins.autoloader.loadLanguages(p, function() {
          var f = document.getElementById(_);
          f && (f.innerHTML = t.highlight(f.textContent, t.languages[p], p));
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
    return p = p.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function(d, m) {
      if (m = m.toLowerCase(), m[0] === "#") {
        var h;
        return m[1] === "x" ? h = parseInt(m.slice(2), 16) : h = Number(m.slice(1)), a(h);
      } else {
        var y = l[m];
        return y || d;
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
function kS(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
kS(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const jg = (t) => t != null && window.Prism.languages.hasOwnProperty(t) ? t : void 0;
function K_(t, e) {
  for (const n of t.childNodes) {
    if (sn(n) && n.tagName === e) return !0;
    K_(n, e);
  }
  return !1;
}
const Zo = "data-highlight-language";
let xa = class Q_ extends St {
  static getType() {
    return "code";
  }
  static clone(e) {
    return new Q_(e.__language, e.__key);
  }
  constructor(e, n) {
    super(n), this.__language = jg(e);
  }
  createDOM(e) {
    const n = document.createElement("code");
    Ot(n, e.theme.code), n.setAttribute("spellcheck", "false");
    const r = this.getLanguage();
    return r && n.setAttribute(Zo, r), n;
  }
  updateDOM(e, n, r) {
    const o = this.__language, i = e.__language;
    return o ? o !== i && n.setAttribute(Zo, o) : i && n.removeAttribute(Zo), !1;
  }
  exportDOM(e) {
    const n = document.createElement("pre");
    Ot(n, e._config.theme.code), n.setAttribute("spellcheck", "false");
    const r = this.getLanguage();
    return r && n.setAttribute(Zo, r), { element: n };
  }
  static importDOM() {
    return { code: (e) => e.textContent != null && (/\r?\n/.test(e.textContent) || K_(e, "BR")) ? { conversion: Bg, priority: 1 } : null, div: () => ({ conversion: ES, priority: 1 }), pre: () => ({ conversion: Bg, priority: 0 }), table: (e) => pu(e) ? { conversion: TS, priority: 3 } : null, td: (e) => {
      const n = e, r = n.closest("table");
      return n.classList.contains("js-file-line") || r && pu(r) ? { conversion: Ug, priority: 3 } : null;
    }, tr: (e) => {
      const n = e.closest("table");
      return n && pu(n) ? { conversion: Ug, priority: 3 } : null;
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
      const a = de();
      return this.insertAfter(a, n), a;
    }
    const { anchor: i, focus: s } = e, l = (i.isBefore(s) ? i : s).getNode();
    if (I(l)) {
      let a = OS(l);
      const u = [];
      for (; ; ) if (sf(a)) u.push(So()), a = a.getNextSibling();
      else {
        if (!Y_(a)) break;
        {
          let v = 0;
          const _ = a.getTextContent(), f = a.getTextContentSize();
          for (; v < f && _[v] === " "; ) v++;
          if (v !== 0 && u.push(J_(" ".repeat(v))), v !== f) break;
          a = a.getNextSibling();
        }
      }
      const c = l.splitText(i.offset)[0], p = i.offset === 0 ? 0 : 1, d = c.getIndexWithinParent() + p, m = l.getParentOrThrow(), h = [Ht(), ...u];
      m.splice(d, 0, h);
      const y = u[u.length - 1];
      y ? y.select() : i.offset === 0 ? c.selectPrevious() : c.getNextSibling().selectNext(0, 0);
    }
    if (Ol(l)) {
      const { offset: a } = e.anchor;
      l.splice(a, 0, [Ht()]), l.select(a + 1, a + 1);
    }
    return null;
  }
  canIndent() {
    return !1;
  }
  collapseAtStart() {
    const e = de();
    return this.getChildren().forEach((n) => e.append(n)), this.replace(e), !0;
  }
  setLanguage(e) {
    this.getWritable().__language = jg(e);
  }
  getLanguage() {
    return this.getLatest().__language;
  }
};
function tr(t) {
  return Be(new xa(t));
}
function Ol(t) {
  return t instanceof xa;
}
function Bg(t) {
  return { node: tr(t.getAttribute(Zo)) };
}
function ES(t) {
  const e = t, n = Wg(e);
  return n || function(r) {
    let o = r.parentElement;
    for (; o !== null; ) {
      if (Wg(o)) return !0;
      o = o.parentElement;
    }
    return !1;
  }(e) ? { node: n ? tr() : null } : { node: null };
}
function TS() {
  return { node: tr() };
}
function Ug() {
  return { node: null };
}
function Wg(t) {
  return t.style.fontFamily.match("monospace") !== null;
}
function pu(t) {
  return t.classList.contains("js-file-line-container");
}
const NS = "javascript", bS = () => NS, AS = () => Object.keys(window.Prism.languages).filter((t) => typeof window.Prism.languages[t] != "function").sort();
let vf = class G_ extends qn {
  constructor(e, n, r) {
    super(e, r), this.__highlightType = n;
  }
  static getType() {
    return "code-highlight";
  }
  static clone(e) {
    return new G_(e.__text, e.__highlightType || void 0, e.__key);
  }
  getHighlightType() {
    return this.getLatest().__highlightType;
  }
  canHaveFormat() {
    return !1;
  }
  createDOM(e) {
    const n = super.createDOM(e), r = gu(e.theme, this.__highlightType);
    return Ot(n, r), n;
  }
  updateDOM(e, n, r) {
    const o = super.updateDOM(e, n, r), i = gu(r.theme, e.__highlightType), s = gu(r.theme, this.__highlightType);
    return i !== s && (i && hf(n, i), s && Ot(n, s)), o;
  }
  static importJSON(e) {
    const n = J_(e.text, e.highlightType);
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
function gu(t, e) {
  return e && t && t.codeHighlight && t.codeHighlight[e];
}
function J_(t, e) {
  return Be(new vf(t, e));
}
function Y_(t) {
  return t instanceof vf;
}
function OS(t) {
  let e = t, n = t;
  for (; Y_(n) || sf(n); ) e = n, n = n.getPreviousSibling();
  return e;
}
const PS = /* @__PURE__ */ new Set(["http:", "https:", "mailto:", "sms:", "tel:"]);
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
    return { a: (e) => ({ conversion: $S, priority: 1 }) };
  }
  static importJSON(e) {
    const n = Di(e.url, { rel: e.rel, target: e.target, title: e.title });
    return n.setFormat(e.format), n.setIndent(e.indent), n.setDirection(e.direction), n;
  }
  sanitizeUrl(e) {
    try {
      const n = new URL(e);
      if (!PS.has(n.protocol)) return "about:blank";
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
    const r = Di(this.__url, { rel: this.__rel, target: this.__target, title: this.__title });
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
    if (!O(n)) return !1;
    const o = n.anchor.getNode(), i = n.focus.getNode();
    return this.isParentOf(o) && this.isParentOf(i) && n.getTextContent().length > 0;
  }
}
function $S(t) {
  let e = null;
  if (L1(t)) {
    const n = t.textContent;
    (n !== null && n !== "" || t.children.length > 0) && (e = Di(t.getAttribute("href") || "", { rel: t.getAttribute("rel"), target: t.getAttribute("target"), title: t.getAttribute("title") }));
  }
  return { node: e };
}
function Di(t, e) {
  return Be(new nr(t, e));
}
function Xt(t) {
  return t instanceof nr;
}
class wa extends nr {
  static getType() {
    return "autolink";
  }
  static clone(e) {
    return new wa(e.__url, { rel: e.__rel, target: e.__target, title: e.__title }, e.__key);
  }
  static importJSON(e) {
    const n = Hg(e.url, { rel: e.rel, target: e.target, title: e.title });
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
    if (A(r)) {
      const o = Hg(this.__url, { rel: this.__rel, target: this.__target, title: this.__title });
      return r.append(o), o;
    }
    return null;
  }
}
function Hg(t, e) {
  return Be(new wa(t, e));
}
const Ri = Kt();
function hu(t, e = {}) {
  const { target: n, title: r } = e, o = e.rel === void 0 ? "noreferrer" : e.rel, i = $();
  if (!O(i)) return;
  const s = i.extract();
  if (t === null) s.forEach((l) => {
    const a = l.getParent();
    if (Xt(a)) {
      const u = a.getChildren();
      for (let c = 0; c < u.length; c++) a.insertBefore(u[c]);
      a.remove();
    }
  });
  else {
    if (s.length === 1) {
      const u = function(c, p) {
        let d = c;
        for (; d !== null && d.getParent() !== null && !p(d); ) d = d.getParentOrThrow();
        return p(d) ? d : null;
      }(s[0], Xt);
      if (u !== null) return u.setURL(t), n !== void 0 && u.setTarget(n), o !== null && u.setRel(o), void (r !== void 0 && u.setTitle(r));
    }
    let l = null, a = null;
    s.forEach((u) => {
      const c = u.getParent();
      if (c !== a && c !== null && (!A(u) || u.isInline())) {
        if (Xt(c)) return a = c, c.setURL(t), n !== void 0 && c.setTarget(n), o !== null && a.setRel(o), void (r !== void 0 && a.setTitle(r));
        if (c.is(l) || (l = c, a = Di(t, { rel: o, target: n, title: r }), Xt(c) ? u.getPreviousSibling() === null ? c.insertBefore(a) : c.insertAfter(a) : u.insertBefore(a)), Xt(u)) {
          if (u.is(a)) return;
          if (a !== null) {
            const p = u.getChildren();
            for (let d = 0; d < p.length; d++) a.append(p[d]);
          }
          u.remove();
        } else a !== null && a.append(u);
      }
    });
  }
}
function FS() {
  const [t] = fe();
  return T.useEffect(() => {
    if (!t.hasNodes([Ar, br])) throw new Error("ListPlugin: ListNode and/or ListItemNode not registered on editor");
  }, [t]), function(e) {
    T.useEffect(() => De(e.registerCommand(V_, () => (Fg(e, "number"), !0), re), e.registerCommand(H_, () => (Fg(e, "bullet"), !0), re), e.registerCommand(zc, () => (mS(e), !0), re), e.registerCommand(fo, () => !!vS(), re)), [e]);
  }(t), null;
}
const LS = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect, Vg = (t) => {
  const e = document.getElementById("typeahead-menu");
  if (!e) return;
  const n = e.getBoundingClientRect();
  n.top + n.height > window.innerHeight && e.scrollIntoView({ block: "center" }), n.top < 0 && e.scrollIntoView({ block: "center" }), t.scrollIntoView({ block: "nearest" });
};
function Kg(t, e) {
  const n = t.getBoundingClientRect(), r = e.getBoundingClientRect();
  return n.top > r.top && n.top < r.bottom;
}
function IS(t, e, n, r) {
  const [o] = fe();
  T.useEffect(() => {
    if (e != null && t != null) {
      const i = o.getRootElement(), s = i != null ? function(p, d) {
        let m = getComputedStyle(p);
        const h = m.position === "absolute", y = /(auto|scroll)/;
        if (m.position === "fixed") return document.body;
        for (let v = p; v = v.parentElement; ) if (m = getComputedStyle(v), (!h || m.position !== "static") && y.test(m.overflow + m.overflowY + m.overflowX)) return v;
        return document.body;
      }(i) : document.body;
      let l = !1, a = Kg(e, s);
      const u = function() {
        l || (window.requestAnimationFrame(function() {
          n(), l = !1;
        }), l = !0);
        const p = Kg(e, s);
        p !== a && (a = p, r != null && r(p));
      }, c = new ResizeObserver(n);
      return window.addEventListener("resize", n), document.addEventListener("scroll", u, { capture: !0, passive: !0 }), c.observe(e), () => {
        c.unobserve(e), window.removeEventListener("resize", n), document.removeEventListener("scroll", u, !0);
      };
    }
  }, [e, o, r, n, t]);
}
const Qg = Kt();
function DS({ close: t, editor: e, anchorElementRef: n, resolution: r, options: o, menuRenderFn: i, onSelectOption: s, shouldSplitNodeWithQuery: l = !1, commandPriority: a = re }) {
  const [u, c] = T.useState(null), p = r.match && r.match.matchingString;
  T.useEffect(() => {
    c(0);
  }, [p]);
  const d = T.useCallback((h) => {
    e.update(() => {
      const y = r.match != null && l ? function(v) {
        const _ = $();
        if (!O(_) || !_.isCollapsed()) return null;
        const f = _.anchor;
        if (f.type !== "text") return null;
        const g = f.getNode();
        if (!g.isSimpleText()) return null;
        const x = f.offset, w = g.getTextContent().slice(0, x), S = v.replaceableString.length, C = x - function(E, b, R) {
          let z = R;
          for (let V = z; V <= b.length; V++) E.substr(-V) === b.substr(0, V) && (z = V);
          return z;
        }(w, v.matchingString, S);
        if (C < 0) return null;
        let k;
        return C === 0 ? [k] = g.splitText(x) : [, k] = g.splitText(C, x), k;
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
  }, [e]), LS(() => {
    o === null ? c(null) : u === null && m(0);
  }, [o, u, m]), T.useEffect(() => De(e.registerCommand(Qg, ({ option: h }) => !(!h.ref || h.ref.current == null) && (Vg(h.ref.current), !0), a)), [e, m, a]), T.useEffect(() => De(e.registerCommand(ta, (h) => {
    const y = h;
    if (o !== null && o.length && u !== null) {
      const v = u !== o.length - 1 ? u + 1 : 0;
      m(v);
      const _ = o[v];
      _.ref != null && _.ref.current && e.dispatchCommand(Qg, { index: v, option: _ }), y.preventDefault(), y.stopImmediatePropagation();
    }
    return !0;
  }, a), e.registerCommand(ea, (h) => {
    const y = h;
    if (o !== null && o.length && u !== null) {
      const v = u !== 0 ? u - 1 : o.length - 1;
      m(v);
      const _ = o[v];
      _.ref != null && _.ref.current && Vg(_.ref.current), y.preventDefault(), y.stopImmediatePropagation();
    }
    return !0;
  }, a), e.registerCommand(na, (h) => {
    const y = h;
    return y.preventDefault(), y.stopImmediatePropagation(), t(), !0;
  }, a), e.registerCommand(zd, (h) => {
    const y = h;
    return o !== null && u !== null && o[u] != null && (y.preventDefault(), y.stopImmediatePropagation(), d(o[u]), !0);
  }, a), e.registerCommand(wr, (h) => o !== null && u !== null && o[u] != null && (h !== null && (h.preventDefault(), h.stopImmediatePropagation()), d(o[u]), !0), a)), [d, t, e, o, u, m, a]), i(n, T.useMemo(() => ({ options: o, selectOptionAndCleanUp: d, selectedIndex: u, setHighlightedIndex: c }), [d, u, o]), r.match ? r.match.matchingString : "");
}
function RS({ options: t, onQueryChange: e, onSelectOption: n, onOpen: r, onClose: o, menuRenderFn: i, triggerFn: s, anchorClassName: l, commandPriority: a = re, parent: u }) {
  const [c] = fe(), [p, d] = T.useState(null), m = function(v, _, f, g = document.body) {
    const [x] = fe(), w = T.useRef(document.createElement("div")), S = T.useCallback(() => {
      w.current.style.top = w.current.style.bottom;
      const k = x.getRootElement(), E = w.current, b = E.firstChild;
      if (k !== null && v !== null) {
        const { left: R, top: z, width: V, height: K } = v.getRect(), Z = w.current.offsetHeight;
        if (E.style.top = `${z + window.pageYOffset + Z + 3}px`, E.style.left = `${R + window.pageXOffset}px`, E.style.height = `${K}px`, E.style.width = `${V}px`, b !== null) {
          b.style.top = `${z}`;
          const Y = b.getBoundingClientRect(), ne = Y.height, F = Y.width, W = k.getBoundingClientRect();
          R + F > W.right && (E.style.left = `${W.right - F + window.pageXOffset}px`), (z + ne > window.innerHeight || z + ne > W.bottom) && z - W.top > ne + K && (E.style.top = z - ne + window.pageYOffset - K + "px");
        }
        E.isConnected || (f != null && (E.className = f), E.setAttribute("aria-label", "Typeahead menu"), E.setAttribute("id", "typeahead-menu"), E.setAttribute("role", "listbox"), E.style.display = "block", E.style.position = "absolute", g.append(E)), w.current = E, k.setAttribute("aria-controls", "typeahead-menu");
      }
    }, [x, v, f, g]);
    T.useEffect(() => {
      const k = x.getRootElement();
      if (v !== null) return S(), () => {
        k !== null && k.removeAttribute("aria-controls");
        const E = w.current;
        E !== null && E.isConnected && E.remove();
      };
    }, [x, S, v]);
    const C = T.useCallback((k) => {
      v !== null && (k || _(null));
    }, [v, _]);
    return IS(v, w.current, S, C), w;
  }(p, d, l, u), h = T.useCallback(() => {
    d(null), o != null && p !== null && o();
  }, [o, p]), y = T.useCallback((v) => {
    d(v), r != null && p === null && r(v);
  }, [r, p]);
  return T.useEffect(() => {
    const v = c.registerUpdateListener(() => {
      c.getEditorState().read(() => {
        const _ = c._window || window, f = _.document.createRange(), g = $(), x = function(C) {
          let k = null;
          return C.getEditorState().read(() => {
            const E = $();
            O(E) && (k = function(b) {
              const R = b.anchor;
              if (R.type !== "text") return null;
              const z = R.getNode();
              if (!z.isSimpleText()) return null;
              const V = R.offset;
              return z.getTextContent().slice(0, V);
            }(E));
          }), k;
        }(c);
        if (!O(g) || !g.isCollapsed() || x === null || f === null) return void h();
        const w = s(x, c);
        if (e(w ? w.matchingString : null), w !== null && !function(C, k) {
          return k === 0 && C.getEditorState().read(() => {
            const E = $();
            if (O(E)) {
              const b = E.anchor.getNode().getPreviousSibling();
              return I(b) && b.isTextEntity();
            }
            return !1;
          });
        }(c, w.leadOffset) && function(k, E, b) {
          const R = b.getSelection();
          if (R === null || !R.isCollapsed) return !1;
          const z = R.anchorNode, V = k, K = R.anchorOffset;
          if (z == null || K == null) return !1;
          try {
            E.setStart(z, V), E.setEnd(z, K);
          } catch {
            return !1;
          }
          return !0;
        }(w.leadOffset, f, _) !== null)
          return S = () => y({ getRect: () => f.getBoundingClientRect(), match: w }), void (T.startTransition ? T.startTransition(S) : S());
        var S;
        h();
      });
    });
    return () => {
      v();
    };
  }, [c, s, e, p, h, y]), p === null || c === null ? null : N.jsx(DS, { close: h, resolution: p, editor: c, anchorElementRef: m, options: t, menuRenderFn: i, shouldSplitNodeWithQuery: !0, onSelectOption: n, commandPriority: a });
}
const MS = "​";
class Sa extends qn {
  static getType() {
    return "zeroWidth";
  }
  static clone(e) {
    return new Sa(e.__textContent, e.__key);
  }
  static importJSON(e) {
    return zS();
  }
  constructor(e, n) {
    super(MS, n), this.__textContent = e;
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
function zS(t = "") {
  const e = new Sa(t);
  return e.setMode("segmented"), Be(e);
}
function Ca(t) {
  return t instanceof Sa;
}
const Z_ = `\\.,\\*\\?\\$\\|#{}\\(\\)\\^\\[\\]\\\\/!%'"~=<>_:;`, jS = "\\(", BS = (t) => "(?:" + t.join("|") + ")", X_ = (t, e) => (t.length === 0 ? "" : "(?!" + t.join("|") + ")") + "[^\\s" + e + "]", US = 75;
function jc(t, e, n) {
  return new RegExp(X_(e, n)).test(t);
}
function Xo(t, e) {
  const n = $();
  if (!n || !O(n))
    return;
  const r = n.anchor, o = n.focus, i = n.getNodes();
  if (r.key !== o.key || r.offset !== o.offset || i.length === 0)
    return;
  const [s] = i, l = Ca(s) ? s.getPreviousSibling() : s;
  if (!l)
    return;
  const a = I(l) && l.isSimpleText(), u = r.type === "text" ? r.offset : 0, c = qt(l), p = u === 0, d = c.length === u, m = c.charAt(u - 1), h = c.charAt(u), y = jc(m, t, e), v = jc(h, t, e), _ = /\s/.test(m), f = /\s/.test(h), g = Ea(l), x = ka(l), w = {
    node: l,
    offset: u,
    isTextNode: a,
    textContent: c,
    selection: n,
    prevNode: g,
    nextNode: x,
    cursorAtStartOfNode: p,
    cursorAtEndOfNode: d,
    wordCharBeforeCursor: y,
    wordCharAfterCursor: v,
    spaceBeforeCursor: _,
    spaceAfterCursor: f
  };
  return a ? Object.assign(Object.assign({}, w), { isTextNode: !0, node: l }) : Object.assign(Object.assign({}, w), { isTextNode: !1, node: l });
}
function ka(t) {
  let e = t.getNextSibling();
  for (; e !== null && Ca(e); )
    e = e.getNextSibling();
  return e;
}
function Ea(t) {
  let e = t.getPreviousSibling();
  for (; e !== null && Ca(e); )
    e = e.getPreviousSibling();
  return e;
}
function qt(t) {
  return Ca(t) ? "" : t.getTextContent();
}
function WS(t, e) {
  return typeof t == "string" || typeof t == "boolean" ? t : e === null ? !1 : typeof t == "object" ? t[e] : !1;
}
function HS(t, e) {
  return typeof t == "number" || t === !1 ? t : typeof t > "u" ? 5 : e === null ? !1 : typeof t == "object" ? t[e] : 5;
}
function VS(t) {
  const e = t.getLastDescendant();
  return A(e) || I(e) ? e : ae(e) ? e.getParent() : t;
}
function xf() {
  const t = ye(), e = VS(t), n = e && e.getKey(), r = A(e) ? e.getChildrenSize() : I(e) ? qt(e).length : 0, o = A(e) ? "element" : "text";
  if (n) {
    const i = lf();
    i.anchor.set(n, r, o), i.focus.set(n, r, o), Ie(i);
  }
}
class Bc {
  constructor(e, n, r) {
    this.value = e, this.displayValue = n, this.data = r, this.key = r ? JSON.stringify(Object.assign(Object.assign({}, r), { value: e })) : e, this.displayValue = n ?? e, this.ref = { current: null }, this.setRefElement = this.setRefElement.bind(this);
  }
  setRefElement(e) {
    this.ref = { current: e };
  }
}
function Gg(t) {
  const e = $();
  if (!O(e) || !e.isCollapsed())
    return null;
  const n = e.anchor;
  if (n.type !== "text")
    return null;
  const r = n.getNode();
  if (!r.isSimpleText())
    return null;
  const o = n.offset, i = qt(r).slice(0, o), s = t.replaceableString.length, l = KS(i, t.matchingString, s), a = o - l;
  if (a < 0)
    return null;
  let u;
  return a === 0 ? [u] = r.splitText(o) : [, u] = r.splitText(a, o), u;
}
function KS(t, e, n) {
  let r = n;
  for (let o = r; o <= e.length; o++)
    t.substring(-o) === e.substring(0, o) && (r = o);
  return r;
}
const bo = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", QS = bo && /iPad|iPhone|iPod/.test(navigator.userAgent) && // @ts-ignore
!window.MSStream, qo = bo && window.matchMedia("(pointer: coarse)").matches;
function Jg(t, e) {
  return t.getEditorState().read(() => {
    const n = Ee(e);
    return n !== null && n.isSelected();
  });
}
function GS(t) {
  const [e] = fe(), [n, r] = T.useState(() => Jg(e, t));
  return T.useEffect(() => {
    let o = !0;
    const i = e.registerUpdateListener(() => {
      o && r(Jg(e, t));
    });
    return () => {
      o = !1, i();
    };
  }, [e, t]), [n, T.useCallback((o) => {
    e.update(() => {
      let i = $();
      $e(i) || (i = Ac(), Ie(i)), $e(i) && (o ? i.add(t) : i.delete(t));
    });
  }, [e, t]), T.useCallback(() => {
    e.update(() => {
      const o = $();
      $e(o) && o.clear();
    });
  }, [e])];
}
const JS = bo ? T.useLayoutEffect : T.useEffect, wf = () => {
  const [t] = fe(), [e, n] = T.useState(() => bo ? t.getRootElement() === document.activeElement : !1);
  return JS(() => De(t.registerCommand(jd, () => (n(!0), !1), Ii), t.registerCommand(la, () => (n(!1), !1), Ii)), [t]), e;
};
function YS(t) {
  const { value: e, trigger: n, data: r, className: o, classNameFocused: i, classNames: s, nodeKey: l, component: a } = t, [u] = fe(), c = wf(), [p, d, m] = GS(l), h = T.useRef(null), y = n + e, v = T.useMemo(() => {
    if (o) {
      const C = [o];
      return p && c && i && C.push(i), C.join(" ").trim() || void 0;
    }
    return "";
  }, [p, o, i, c]), _ = T.useCallback((C) => {
    if (p && $e($())) {
      C.preventDefault();
      const k = Ee(l);
      Dr(k) && k.remove();
    }
    return !1;
  }, [p, l]), f = T.useCallback((C) => {
    const k = Ee(l);
    if (!k || !k.isSelected())
      return !1;
    let E = !1;
    const b = Ea(k);
    return A(b) && (b.selectEnd(), E = !0), I(b) && (b.select(), E = !0), ae(b) && (b.selectNext(), E = !0), b === null && (k.selectPrevious(), E = !0), E && C.preventDefault(), E;
  }, [l]), g = T.useCallback((C) => {
    const k = Ee(l);
    if (!k || !k.isSelected())
      return !1;
    let E = !1;
    const b = ka(k);
    return A(b) && (b.selectStart(), E = !0), I(b) && (b.select(0, 0), E = !0), ae(b) && (b.selectPrevious(), E = !0), b === null && (k.selectNext(), E = !0), E && C.preventDefault(), E;
  }, [l]), x = T.useCallback((C) => {
    var k;
    return C.target === h.current || !((k = h.current) === null || k === void 0) && k.contains(C.target) ? (C.shiftKey || m(), d(!0), !0) : !1;
  }, [m, d]), w = T.useCallback(() => {
    const C = Ee(l);
    if (!C || !C.isSelected())
      return !1;
    const k = $();
    return $e(k) && Ie(null), !1;
  }, [l]), S = T.useCallback(() => QS && p ? (d(!1), !0) : !1, [p, d]);
  return T.useEffect(() => {
    const C = De(u.registerCommand(Jl, x, re), u.registerCommand(ra, _, re), u.registerCommand(wo, _, re), u.registerCommand(ql, f, re), u.registerCommand(Xl, g, re), u.registerCommand(la, w, re), u.registerCommand(Nr, S, re));
    return () => {
      C();
    };
  }, [
    u,
    f,
    g,
    x,
    _,
    w,
    S
  ]), a ? N.jsx(a, { ref: h, trigger: n, value: e, data: r, className: v, "data-beautiful-mention": y, children: y }) : s ? N.jsxs("span", { ref: h, className: p && s.containerFocused ? s.containerFocused : s.container, "data-beautiful-mention": y, children: [N.jsx("span", { className: s.trigger, children: n }), N.jsx("span", { className: s.value, children: e })] }) : N.jsx("span", { ref: h, className: v, "data-beautiful-mention": y, children: y });
}
function ZS(t) {
  const e = t.getAttribute("data-lexical-beautiful-mention-trigger"), n = t.getAttribute("data-lexical-beautiful-mention-value");
  let r;
  const o = t.getAttribute("data-lexical-beautiful-mention-data");
  if (o)
    try {
      r = JSON.parse(o);
    } catch (i) {
      console.warn("Failed to parse data attribute of beautiful mention node", i);
    }
  return e != null && n !== null ? { node: Mi(e, n, r) } : null;
}
class Pt extends df {
  static getType() {
    return "beautifulMention";
  }
  static clone(e) {
    return new Pt(e.__trigger, e.__value, e.__data, e.__key);
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
        conversion: ZS,
        priority: 1
      } : null
    };
  }
  static importJSON(e) {
    return Mi(e.trigger, e.value, e.data);
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
    return N.jsx(YS, { nodeKey: this.getKey(), trigger: this.getTrigger(), value: this.getValue(), data: this.getData(), className: r, classNameFocused: o, classNames: i, component: this.component() });
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
function Mi(t, e, n) {
  const r = new Pt(t, e, n);
  return Be(r);
}
function Dr(t) {
  return t instanceof Pt;
}
const q_ = Kt(), ev = Kt(), tv = Kt(), nv = Kt();
function rv(t, e, n) {
  return ov(t, e, n);
}
function XS(t, e, n, r, o) {
  return ov(t, e, n, r, o);
}
function ov(t, e, n, r, o) {
  const i = Xo(t, e);
  if (!i)
    return !1;
  const { node: s, selection: l, wordCharBeforeCursor: a, wordCharAfterCursor: u, cursorAtStartOfNode: c, cursorAtEndOfNode: p, prevNode: d, nextNode: m } = i, h = r ? Mi(n, r, o) : le(n);
  if (!(Vt(s) && c) && !I(s))
    return l.insertNodes([le(" "), h]), !0;
  let y = null;
  const v = [];
  return (a || c && d !== null && !I(d)) && v.push(le(" ")), v.push(h), (u || p && m !== null && !I(m)) && (y = le(" "), v.push(y)), l.insertNodes(v), v.length > 1 && (I(h) ? h.select() : y && y.selectPrevious()), !0;
}
function qS(t, e, n = !0) {
  let r = !1, o = null, i = null;
  const s = Pi(Pt);
  for (const l of s) {
    const a = l.getTrigger() === t, u = l.getValue() === e;
    a && (u || !e) && (o = Ea(l), i = ka(l), l.remove(), r = !0, I(o) && qt(o).endsWith(" ") && i && qt(i).startsWith(" ") && o.setTextContent(qt(o).slice(0, -1)), i === null && I(o) && qt(o).endsWith(" ") && o.setTextContent(qt(o).trimEnd()));
  }
  return r && n ? iv(o, i) : n || Ie(null), r;
}
function eC(t, e, n, r = !0) {
  const o = Pi(Pt);
  let i = null;
  for (const s of o) {
    const l = s.getTrigger() === t, a = s.getValue() === n;
    l && (a || !n) && (i = s, s.setValue(e));
  }
  if (i && r) {
    const s = Ea(i), l = ka(i);
    iv(s, l), l && I(l) ? l.select(0, 0) : xf();
  } else r || Ie(null);
  return i !== null;
}
function iv(t, e) {
  e && I(e) ? e.select(0, 0) : t && I(t) ? t.select() : xf();
}
class mu extends Bc {
  constructor(e, n, r, o = {}) {
    super(n, r, o), this.itemType = e, this.comboboxItem = {
      itemType: e,
      value: n,
      displayValue: r,
      data: o
    }, this.menuOption = new Bc(n, r, o);
  }
}
function yu(t) {
  let e = null;
  return t.getEditorState().read(() => {
    const n = $();
    O(n) && (e = tC(n));
  }), e;
}
function tC(t) {
  const e = t.anchor;
  if (e.type !== "text")
    return null;
  const n = e.getNode();
  if (!n.isSimpleText())
    return null;
  const r = e.offset;
  return qt(n).slice(0, r);
}
function nC(t) {
  return t.key.length === 1 && !t.ctrlKey && !t.altKey && !t.metaKey && !t.repeat;
}
function rC(t, e, n) {
  const [r] = fe(), [o, i] = T.useState(e || null), [s, l] = T.useState(null);
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
function oC(t, e) {
  const n = t.split(/\s/).pop() || t, r = t !== n ? t.lastIndexOf(n) : 0;
  return e.some((i) => i.startsWith(n) && i !== n) ? {
    leadOffset: r,
    matchingString: n,
    replaceableString: n
  } : null;
}
function iC(t) {
  const { onSelectOption: e, triggers: n, punctuation: r, loading: o, triggerFn: i, onQueryChange: s, onReset: l, comboboxAnchor: a, comboboxAnchorClassName: u, comboboxComponent: c = "div", comboboxItemComponent: p = "div", onComboboxOpen: d, onComboboxClose: m, onComboboxFocusChange: h, comboboxAdditionalItems: y = [], onComboboxItemSelect: v } = t, _ = wf(), [f] = fe(), [g, x] = T.useState(null), [w, S] = T.useState(null), [C, k] = T.useState(null), [E, b] = T.useState(null), R = t.options.length === 0 ? "trigger" : "value", z = T.useMemo(() => {
    const P = y.map((L) => new mu("additional", L.value, L.displayValue, L.data));
    if (R === "trigger") {
      const L = n.map((M) => new mu("trigger", M, M));
      return !E || L.every((M) => !M.value.startsWith(E)) ? [...L, ...P] : [
        ...L.filter((M) => M.value.startsWith(E)),
        ...P
      ];
    }
    return [
      ...t.options.map((L) => new mu("value", L.value, L.displayValue, L.data)),
      ...P
    ];
  }, [
    y,
    R,
    t.options,
    n,
    E
  ]), [V, K] = T.useState(t.comboboxOpen || !1), Z = rC(V, a, u), Y = T.useCallback((P) => {
    qo || x(P);
  }, []), ne = T.useCallback((P) => {
    var L;
    const Q = (L = z[P].ref) === null || L === void 0 ? void 0 : L.current;
    Q && Q.scrollIntoView({ block: "nearest" });
  }, [z]), F = T.useCallback((P, L) => {
    if (!_)
      return !1;
    let M;
    return L === "up" ? g === null ? M = z.length - 1 : g === 0 ? M = null : M = g - 1 : g === null ? M = 0 : g === z.length - 1 ? M = null : M = g + 1, Y(M), M && ne(M), P.preventDefault(), P.stopImmediatePropagation(), !0;
  }, [_, g, z.length, ne, Y]), W = T.useCallback((P) => {
    Y(P), ne(P);
  }, [ne, Y]), j = T.useCallback(() => {
    Y(null);
  }, [Y]), X = T.useCallback((P) => {
    const L = z[P];
    v == null || v(L.comboboxItem), L.itemType !== "additional" && (f.update(() => {
      const M = C ? Gg(C) : null;
      e(L.menuOption, M);
    }), k(null), s(null), b(null), Y(null));
  }, [
    z,
    f,
    s,
    Y,
    v,
    C,
    e
  ]), J = T.useCallback((P) => {
    const L = z[P];
    v == null || v(L.comboboxItem), L.itemType !== "additional" && (f.update(() => {
      const M = w ? Gg(w) : null;
      if (M) {
        const Q = le(L.value);
        M.replace(Q), Q.select();
      } else
        rv(n, r, L.value);
    }), S(null), b(null), Y(0));
  }, [
    z,
    f,
    Y,
    v,
    w,
    n,
    r
  ]), ge = T.useCallback((P) => {
    R === "trigger" && J(P), R === "value" && X(P);
  }, [R, J, X]), ie = T.useCallback((P) => {
    if (!_ || g === null)
      return !1;
    let L = !1;
    return R === "trigger" && (L = !0, J(g)), R === "value" && (L = !0, X(g)), L && (P.preventDefault(), P.stopImmediatePropagation()), L;
  }, [_, X, J, R, g]), Te = T.useCallback(() => {
    const P = yu(f), L = P ? P.substring(0, P.length - 1) : void 0;
    return (!L || !L.trim()) && Y(null), !1;
  }, [f, Y]), se = T.useCallback((P) => {
    if (K(!0), !nC(P))
      return !1;
    const L = yu(f), Q = (L === null ? P.key : L + P.key).trim();
    return z.some((q) => q.displayValue.startsWith(Q) && Q.length <= q.displayValue.length) ? Y(0) : R === "trigger" && Y(null), !1;
  }, [f, z, R, Y]), Ne = T.useCallback(() => (K(!0), !1), []), _e = T.useCallback(() => (K(!1), E || (b(null), S(null), k(null)), !1), [E]);
  return T.useEffect(() => De(f.registerCommand(ta, (P) => F(P, "down"), re), f.registerCommand(ea, (P) => F(P, "up"), re), f.registerCommand(wr, ie, Ii), f.registerCommand(zd, ie, re), f.registerCommand(wo, Te, re), f.registerCommand(Md, se, re), f.registerCommand(jd, Ne, Ii), f.registerCommand(Jl, () => (V || K(!0), !1), re), f.registerCommand(na, () => (K(!1), !1), re)), [
    f,
    V,
    F,
    ie,
    Te,
    se,
    Ne
  ]), T.useEffect(() => {
    const P = () => {
      f.getEditorState().read(() => {
        const L = yu(f);
        if (L === null) {
          l(), S(null), k(null), s(null), b(null);
          return;
        }
        const M = oC(L, n);
        if (S(M), M) {
          b(M.matchingString), k(null);
          return;
        }
        const Q = i(L, f);
        if (k(Q), s(Q ? Q.matchingString : null), Q && Q.matchingString) {
          b(Q.matchingString);
          return;
        }
        b(null);
      });
    };
    return f.registerUpdateListener(P);
  }, [f, i, s, l, n]), T.useEffect(() => {
    K(t.comboboxOpen || !1);
  }, [t.comboboxOpen]), T.useEffect(() => {
    V ? d == null || d() : (x(null), m == null || m());
  }, [d, m, V]), T.useEffect(() => {
    g !== null && z[g] ? h == null || h(z[g].comboboxItem) : h == null || h(null);
  }, [g, z, h]), T.useEffect(() => {
    if (!bo)
      return;
    const P = f.getRootElement(), L = (M) => {
      Z && !Z.contains(M.target) && P && !P.contains(M.target) && _e();
    };
    return document.addEventListener("mousedown", L), () => {
      document.removeEventListener("mousedown", L);
    };
  }, [Z, f, _e]), !V || !Z ? null : At.createPortal(N.jsx(c, { loading: o, itemType: R, role: "menu", "aria-activedescendant": g !== null && z[g] ? z[g].displayValue : "", "aria-label": "Choose trigger and value", "aria-hidden": !V, children: z.map((P, L) => N.jsx(p, { selected: L === g, role: "menuitem", "aria-selected": g === L, "aria-label": `Choose ${P.value}`, item: P.comboboxItem, ref: P.setRefElement, onClick: () => ge(L), onMouseEnter: () => W(L), onMouseLeave: j, onMouseDown: (M) => M.preventDefault(), children: P.displayValue }, P.key)) }), Z);
}
function sC(t, e) {
  const [n, r] = T.useState(t);
  return T.useEffect(() => {
    const o = setTimeout(() => {
      r(t);
    }, e);
    return () => clearTimeout(o);
  }, [t, e]), n;
}
function lC(t) {
  const { queryString: e, trigger: n, searchDelay: r, items: o, onSearch: i, justSelectedAnOption: s } = t, l = sC(e, r), [a, u] = T.useState(!1), [c, p] = T.useState([]), [d, m] = T.useState(null);
  return T.useEffect(() => {
    if (!o)
      return;
    if (n === null) {
      p([]), m(null);
      return;
    }
    const h = Object.entries(o).find(([v]) => new RegExp(v).test(n));
    if (!h)
      return;
    const y = e ? h[1].filter((v) => (typeof v == "string" ? v : v.value).toLowerCase().includes(e.toLowerCase())) : [...h[1]];
    p(y), m(e);
  }, [o, n, e]), T.useEffect(() => {
    if (i) {
      if (n === null || l === null) {
        p([]), m(null);
        return;
      }
      u(!0), m(l), i(n, s != null && s.current ? "" : l).then((h) => p(h)).finally(() => u(!1)), s != null && s.current && (s.current = !1);
    }
  }, [l, i, n, s]), T.useMemo(() => ({ loading: a, results: c, query: d }), [a, c, d]);
}
var aC = function(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(t); o < r.length; o++)
      e.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[o]) && (n[r[o]] = t[r[o]]);
  return n;
};
class ws extends Bc {
  constructor(e, n, r, o) {
    super(n, r, o), this.trigger = e, this.menuItem = {
      trigger: e,
      value: n,
      displayValue: r,
      data: o
    };
  }
}
const uC = (t) => "(?:\\.[ |$]|\\s|[" + t + "]|)";
function cC(t, e, n, r) {
  return new RegExp((e ? `(^|\\s|${e})(` : "(^|\\s)(") + BS(t) + "((?:" + X_(t, n) + (r ? uC(n) : "") + "){0," + US + "}))$");
}
function Yg(t, e, n, r, o) {
  const i = cC(e, n, r, o).exec(t);
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
function dC(t) {
  const { items: e, onSearch: n, searchDelay: r = t.onSearch ? 250 : 0, allowSpaces: o = !0, insertOnBlur: i = !0, menuComponent: s = "ul", menuItemComponent: l = "li", emptyComponent: a, menuAnchorClassName: u, showMentionsOnDelete: c, showCurrentMentionsAsSuggestions: p = !0, mentionEnclosure: d, onMenuOpen: m, onMenuClose: h, onMenuItemSelect: y, punctuation: v = Z_, preTriggerChars: _ = jS } = t, f = T.useRef(!1), g = wf(), x = T.useMemo(() => t.triggers || Object.keys(e || {}), [t.triggers, e]), [w] = fe(), [S, C] = T.useState(null), [k, E] = T.useState(null), { results: b, loading: R, query: z } = lC({
    queryString: S,
    searchDelay: r,
    trigger: k,
    items: e,
    onSearch: n,
    justSelectedAnOption: f
  }), V = T.useRef(), K = T.useRef(null), Z = WS(t.creatable, k), Y = HS(t.menuItemLimit, k), ne = T.useMemo(() => {
    if (!k)
      return [];
    let P = b.map((M) => {
      if (typeof M == "string")
        return new ws(k, M, M);
      {
        const { value: Q } = M, q = aC(M, ["value"]);
        return new ws(k, Q, Q, q);
      }
    });
    if (Y !== !1 && Y > 0 && (P = P.slice(0, Y)), (!n || !R && z !== null) && p && w.getEditorState().read(() => {
      const M = Pi(Pt);
      for (const Q of M) {
        const q = Q.getValue(), ce = Q.getData();
        Q.getTrigger() === k && (z === null || Q.getValue().startsWith(z)) && P.every((Ke) => Ke.value !== q) && P.push(new ws(k, q, q, ce));
      }
    }), z && P.every((M) => M.displayValue !== z)) {
      const M = typeof Z == "string" ? Z.replace("{{name}}", z) : typeof Z > "u" || Z ? `Add "${z}"` : void 0;
      M && P.push(new ws(k, z, M));
    }
    return P;
  }, [
    b,
    n,
    R,
    z,
    w,
    k,
    Z,
    Y,
    p
  ]), F = !!ne.length || R, W = T.useCallback(() => {
    E(null);
  }, []), j = T.useCallback((P, L, M) => {
    w.update(() => {
      if (!k)
        return;
      const q = !!Z && P.value !== P.displayValue && d && /\s/.test(P.value) ? (
        // if the value has spaces, wrap it in the enclosure
        d + P.value + d
      ) : P.value, ce = Mi(k, q, P.data);
      L && L.replace(ce), M == null || M(), f.current = !0;
    });
  }, [w, k, Z, d]), X = T.useCallback((P, L, M) => {
    k && (y == null || y({
      trigger: k,
      value: P.value,
      displayValue: P.displayValue,
      data: P.data
    }), j(P, L, M));
  }, [j, y, k]), J = T.useCallback((P) => {
    const L = Xo(x, v);
    if (L != null && L.isTextNode && L.wordCharAfterCursor)
      return null;
    const M = Yg(P, x, _, v, o);
    if (M) {
      const { replaceableString: Q, matchingString: q } = M, ce = Q.lastIndexOf(q), Ke = ce === -1 ? Q : Q.substring(0, ce) + Q.substring(ce + q.length);
      if (E(Ke || null), M.replaceableString)
        return M;
    } else
      E(null);
    return null;
  }, [_, o, v, x]), ge = T.useCallback(() => {
    const P = V.current;
    let L = typeof P == "number" ? ne[P] : void 0;
    const M = ne.find((qi) => qi.value !== qi.displayValue);
    if (M && (qo || L === null) && (L = M), !L)
      return !1;
    const Q = Xo(x, v);
    if (!k || !Q || !Q.isTextNode)
      return !1;
    const q = Q.node, ce = qt(q), Ke = Yg(ce, x, _, v, !1);
    if (Ke === null)
      return !1;
    const rr = ce.search(new RegExp(`${Ke.replaceableString}\\s?$`));
    if (rr === -1)
      return !1;
    const Xi = Mi(k, L.value, L.data);
    return w.update(() => {
      q.setTextContent(ce.substring(0, rr)), q.insertAfter(Xi), Xi.selectNext();
    }, { tag: "history-merge" }), !0;
  }, [w, ne, _, v, k, x]), ie = T.useCallback(() => {
    const P = $();
    if ((!P || $e(P)) && K.current) {
      const L = K.current.clone();
      Ie(L);
    } else P || xf();
    K.current && (K.current = null);
  }, []), Te = T.useCallback((P) => {
    if (!c)
      return !1;
    const L = Xo(x, v);
    if (L) {
      const { node: M, prevNode: Q, offset: q } = L, ce = Dr(M) ? M : Dr(Q) && q === 0 ? Q : null;
      if (ce) {
        const Ke = ce.getTrigger();
        return ce.replace(le(Ke)), P.preventDefault(), !0;
      }
    }
    return !1;
  }, [c, x, v]), se = T.useCallback((P = !1) => {
    const L = Xo(x, v);
    if (!L)
      return !1;
    const { node: M, offset: Q, isTextNode: q, textContent: ce, prevNode: Ke, nextNode: rr, wordCharAfterCursor: Xi, cursorAtStartOfNode: qi, cursorAtEndOfNode: xv } = L;
    if (q && qi && Dr(Ke) && M.insertBefore(le(" ")), q && xv && Dr(rr) && M.insertAfter(le(" ")), q && P && Xi) {
      const wv = ce.substring(0, Q) + " " + ce.substring(Q);
      M.setTextContent(wv);
    }
    Dr(M) && rr === null && M.insertAfter(le(" "));
  }, [v, x]), Ne = T.useCallback((P) => {
    const { key: L, metaKey: M, ctrlKey: Q } = P, q = L.length === 1, ce = x.some((rr) => L === rr), Ke = jc(L, x, v);
    return !q || !Ke && !ce || M || Q || se(ce), !1;
  }, [se, v, x]), _e = T.useCallback((P) => {
    var L;
    const M = (L = P.clipboardData) === null || L === void 0 ? void 0 : L.getData("text/plain"), Q = M && M.charAt(0), q = x.some((Ke) => Q === Ke), ce = Q && new RegExp(`[\\s${v}]`).test(Q);
    return (q || !ce) && se(), !1;
  }, [se, x, v]);
  return T.useEffect(() => {
    if (!w.hasNodes([Pt]))
      throw new Error("BeautifulMentionsPlugin: BeautifulMentionNode not registered on editor");
    return De(w.registerCommand(Nr, () => {
      const P = $();
      return P && !$e(P) && (K.current = P), !1;
    }, re), w.registerCommand(Md, Ne, re), w.registerCommand(wo, Te, re), w.registerCommand(la, () => i ? ge() : !1, re), w.registerCommand(ky, () => !o && Z ? ge() : !1, re), w.registerCommand(q_, ({ trigger: P, value: L, data: M, focus: Q = !0 }) => {
      ie();
      const q = XS(x, v, P, L, M);
      return Q || Ie(null), q;
    }, re), w.registerCommand(ev, ({ trigger: P, value: L, focus: M }) => qS(P, L, M), re), w.registerCommand(tv, ({ trigger: P, newValue: L, value: M, focus: Q }) => eC(P, L, M, Q), re), w.registerCommand(nv, ({ trigger: P }) => (ie(), rv(x, v, P)), re), w.registerCommand(xo, _e, re));
  }, [
    w,
    x,
    v,
    o,
    i,
    Z,
    g,
    ge,
    Ne,
    Te,
    _e,
    ie
  ]), T.useEffect(() => {
    F && g ? m == null || m() : h == null || h(), F && !g && W();
  }, [m, h, F, g, W]), bo ? t.combobox ? N.jsx(iC, { options: ne, loading: R, onQueryChange: C, onSelectOption: j, onReset: () => E(null), triggerFn: J, triggers: x, punctuation: v, creatable: Z, comboboxOpen: t.comboboxOpen, comboboxAnchor: t.comboboxAnchor, comboboxAnchorClassName: t.comboboxAnchorClassName, comboboxComponent: t.comboboxComponent, comboboxItemComponent: t.comboboxItemComponent, comboboxAdditionalItems: t.comboboxAdditionalItems, onComboboxOpen: t.onComboboxOpen, onComboboxClose: t.onComboboxClose, onComboboxFocusChange: t.onComboboxFocusChange, onComboboxItemSelect: t.onComboboxItemSelect }) : N.jsx(RS, { commandPriority: Ii, onQueryChange: C, onSelectOption: X, triggerFn: J, options: ne, anchorClassName: u, onClose: W, menuRenderFn: (P, { selectedIndex: L, selectOptionAndCleanUp: M, setHighlightedIndex: Q }) => (V.current = L, P.current && ne.length === 0 && z && !R && g && a ? At.createPortal(N.jsx(a, {}), P.current) : P.current && F ? At.createPortal(N.jsx(s, { loading: R, role: "menu", "aria-label": "Choose a mention", "aria-hidden": !F, "aria-activedescendant": !qo && L !== null && ne[L] ? ne[L].displayValue : "", children: ne.map((q, ce) => N.jsx(l, Object.assign({ tabIndex: -1, selected: !qo && L === ce, ref: q.setRefElement, role: "menuitem", "aria-selected": !qo && L === ce, "aria-label": `Choose ${q.value}`, item: q.menuItem, itemValue: q.value, label: q.displayValue }, q.data, { onClick: () => {
    Q(ce), M(q);
  }, onMouseDown: (Ke) => {
    Ke.preventDefault();
  }, onMouseEnter: () => {
    Q(ce);
  }, children: q.displayValue }), q.key)) }), P.current) : null) }) : null;
}
function fC() {
  const [t] = fe(), e = T.useCallback((l) => t.dispatchCommand(q_, l), [t]), n = T.useCallback((l) => t.dispatchCommand(ev, l), [t]), r = T.useCallback((l) => t.dispatchCommand(tv, l), [t]), o = T.useCallback(({ value: l, trigger: a }) => t.getEditorState().read(() => {
    const u = Pi(Pt);
    return l ? u.some((c) => c.getTrigger() === a && c.getValue() === l) : u.some((c) => c.getTrigger() === a);
  }), [t]), i = T.useCallback((l) => t.dispatchCommand(nv, l), [t]);
  return {
    getMentions: T.useCallback(() => t.getEditorState().read(() => Pi(Pt).map((l) => {
      const { trigger: a, value: u, data: c } = l.exportJSON();
      return { trigger: a, value: u, data: c };
    })), [t]),
    insertMention: e,
    removeMentions: n,
    renameMentions: r,
    hasMentions: o,
    openMentionMenu: i
  };
}
const pC = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0 ? T.useLayoutEffect : T.useEffect;
function gC({ ignoreHistoryMergeTagChange: t = !0, ignoreSelectionChange: e = !1, onChange: n }) {
  const [r] = fe();
  return pC(() => {
    if (n) return r.registerUpdateListener(({ editorState: o, dirtyElements: i, dirtyLeaves: s, prevEditorState: l, tags: a }) => {
      e && i.size === 0 && s.size === 0 || t && a.has("history-merge") || l.isEmpty() || n(o, r, a);
    });
  }, [r, t, e, n]), null;
}
function hC({
  onClose: t,
  children: e,
  title: n,
  closeOnClickOutside: r
}) {
  const o = T.useRef(null);
  return T.useEffect(() => {
    o.current !== null && o.current.focus();
  }, []), T.useEffect(() => {
    let i = null;
    const s = (u) => {
      u.key === "Escape" && t();
    }, l = (u) => {
      const c = u.target;
      o.current !== null && !o.current.contains(c) && r && t();
    }, a = o.current;
    return a !== null && (i = a.parentElement, i !== null && i.addEventListener("click", l)), window.addEventListener("keydown", s), () => {
      window.removeEventListener("keydown", s), i !== null && (i == null || i.removeEventListener("click", l));
    };
  }, [r, t]), /* @__PURE__ */ N.jsx("div", { className: "Modal__overlay", role: "dialog", children: /* @__PURE__ */ N.jsxs("div", { className: "Modal__modal", tabIndex: -1, ref: o, children: [
    /* @__PURE__ */ N.jsx("h2", { className: "Modal__title", children: n }),
    /* @__PURE__ */ N.jsx(
      "button",
      {
        className: "Modal__closeButton",
        "aria-label": "Close modal",
        type: "button",
        onClick: t,
        children: "X"
      }
    ),
    /* @__PURE__ */ N.jsx("div", { className: "Modal__content", children: e })
  ] }) });
}
function mC({
  onClose: t,
  children: e,
  title: n,
  closeOnClickOutside: r = !1
}) {
  return At.createPortal(
    /* @__PURE__ */ N.jsx(
      hC,
      {
        onClose: t,
        title: n,
        closeOnClickOutside: r,
        children: e
      }
    ),
    document.body
  );
}
function yC() {
  const [t, e] = T.useState(null), n = T.useCallback(() => {
    e(null);
  }, []), r = T.useMemo(() => {
    if (t === null)
      return null;
    const { title: i, content: s, closeOnClickOutside: l } = t;
    return /* @__PURE__ */ N.jsx(
      mC,
      {
        onClose: n,
        title: i,
        closeOnClickOutside: l,
        children: s
      }
    );
  }, [t, n]), o = T.useCallback(
    (i, s, l = !1) => {
      e({
        closeOnClickOutside: l,
        content: s(n),
        title: i
      });
    },
    [n]
  );
  return [r, o];
}
const _C = T.lazy(() => import("./ImageComponent-BVQvvm8P.js"));
function vC(t) {
  return t.parentElement != null && t.parentElement.tagName === "LI" && t.previousSibling === null && t.getAttribute("aria-roledescription") === "checkbox";
}
function xC(t) {
  const e = t;
  if (e.src.startsWith("file:///") || vC(e))
    return null;
  const { alt: n, src: r, width: o, height: i } = e;
  return { node: Ta({ altText: n, height: i, src: r, width: o }) };
}
class Ao extends df {
  static getType() {
    return "image";
  }
  static clone(e) {
    return new Ao(
      e.__src,
      e.__altText,
      e.__maxWidth,
      e.__width,
      e.__height,
      e.__showCaption,
      e.__caption,
      e.__captionsEnabled,
      e.__key
    );
  }
  static importJSON(e) {
    const { altText: n, height: r, width: o, maxWidth: i, caption: s, src: l, showCaption: a } = e, u = Ta({
      altText: n,
      height: r,
      maxWidth: i,
      showCaption: a,
      src: l,
      width: o
    }), c = u.__caption, p = c.parseEditorState(s.editorState);
    return p.isEmpty() || c.setEditorState(p), u;
  }
  exportDOM() {
    const e = document.createElement("img");
    return e.setAttribute("src", this.__src), e.setAttribute("alt", this.__altText), e.setAttribute("width", this.__width.toString()), e.setAttribute("height", this.__height.toString()), { element: e };
  }
  static importDOM() {
    return {
      img: (e) => ({
        conversion: xC,
        priority: 0
      })
    };
  }
  constructor(e, n, r, o, i, s, l, a, u) {
    super(u), this.__src = e, this.__altText = n, this.__maxWidth = r, this.__width = o || "inherit", this.__height = i || "inherit", this.__showCaption = s || !1, this.__caption = l || f_({
      nodes: []
    }), this.__captionsEnabled = a || a === void 0;
  }
  exportJSON() {
    return {
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width
    };
  }
  setWidthAndHeight(e, n) {
    const r = this.getWritable();
    r.__width = e, r.__height = n;
  }
  setShowCaption(e) {
    const n = this.getWritable();
    n.__showCaption = e;
  }
  // View
  createDOM(e) {
    const n = document.createElement("span"), o = e.theme.image;
    return o !== void 0 && (n.className = o), n;
  }
  updateDOM() {
    return !1;
  }
  getSrc() {
    return this.__src;
  }
  getAltText() {
    return this.__altText;
  }
  decorate() {
    return /* @__PURE__ */ N.jsx(T.Suspense, { fallback: null, children: /* @__PURE__ */ N.jsx(
      _C,
      {
        src: this.__src,
        altText: this.__altText,
        width: this.__width,
        height: this.__height,
        maxWidth: this.__maxWidth,
        nodeKey: this.getKey(),
        showCaption: this.__showCaption,
        caption: this.__caption,
        captionsEnabled: this.__captionsEnabled,
        resizable: !0
      }
    ) });
  }
}
function Ta({
  altText: t,
  height: e,
  maxWidth: n = 500,
  captionsEnabled: r,
  src: o,
  width: i,
  showCaption: s,
  caption: l,
  key: a
}) {
  return Be(
    new Ao(
      o,
      t,
      n,
      i,
      e,
      s,
      l,
      r,
      a
    )
  );
}
function sv(t) {
  return t instanceof Ao;
}
function wC(...t) {
  return t.filter(Boolean).join(" ");
}
function Pl({
  "data-test-id": t,
  children: e,
  className: n,
  onClick: r,
  disabled: o,
  small: i,
  title: s
}) {
  return /* @__PURE__ */ N.jsx(
    "button",
    {
      disabled: o,
      className: wC(
        "Button__root",
        o && "Button__disabled",
        i && "Button__small",
        n
      ),
      onClick: r,
      title: s,
      "aria-label": s,
      ...t && { "data-test-id": t },
      children: e
    }
  );
}
function SC({ children: t }) {
  return /* @__PURE__ */ N.jsx("div", { className: "DialogButtonsList", children: t });
}
function lv({
  "data-test-id": t,
  children: e
}) {
  return /* @__PURE__ */ N.jsx("div", { className: "DialogActions", "data-test-id": t, children: e });
}
function CC({
  accept: t,
  label: e,
  onChange: n,
  "data-test-id": r
}) {
  return /* @__PURE__ */ N.jsxs("div", { className: "Input__wrapper", children: [
    /* @__PURE__ */ N.jsx("label", { className: "Input__label", children: e }),
    /* @__PURE__ */ N.jsx(
      "input",
      {
        type: "file",
        accept: t,
        className: "Input__input",
        onChange: (o) => n(o.target.files),
        "data-test-id": r
      }
    )
  ] });
}
function kC({
  label: t,
  value: e,
  onChange: n,
  placeholder: r = "",
  "data-test-id": o,
  type: i = "text"
}) {
  return /* @__PURE__ */ N.jsxs("div", { className: "Input__wrapper", children: [
    /* @__PURE__ */ N.jsx("label", { className: "Input__label", children: t }),
    /* @__PURE__ */ N.jsx(
      "input",
      {
        type: i,
        className: "Input__input",
        placeholder: r,
        value: e,
        onChange: (s) => {
          n(s.target.value);
        },
        "data-test-id": o
      }
    )
  ] });
}
const EC = (t) => (t || window).getSelection(), Na = Kt();
function TC({
  onClick: t
}) {
  const [e, n] = T.useState(""), r = e === "";
  return /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
    /* @__PURE__ */ N.jsx(
      kC,
      {
        label: "Image URL",
        placeholder: "i.e. https://source.unsplash.com/random",
        onChange: n,
        value: e,
        "data-test-id": "image-modal-url-input"
      }
    ),
    /* @__PURE__ */ N.jsx(lv, { children: /* @__PURE__ */ N.jsx(
      Pl,
      {
        "data-test-id": "image-modal-confirm-btn",
        disabled: r,
        onClick: () => t({ altText: "", src: e }),
        children: "Confirm"
      }
    ) })
  ] });
}
function NC({
  onClick: t
}) {
  const [e, n] = T.useState(null), r = e === null, o = () => {
    if (!e) return;
    const i = new FormData();
    i.append("image[]", e[0], e[0].name), i.append("task_uuid", "51743286-8c9c-4968-8476-993b93149e93"), fetch("?module=attachments&action=imageUpload", {
      method: "post",
      body: i
    }).then((s) => s.json()).then(({ data: s }) => {
      const l = Object.values(s)[0];
      t({ altText: "", src: l });
    }).catch((s) => {
      console.error(s);
    });
  };
  return /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
    /* @__PURE__ */ N.jsx(
      CC,
      {
        label: "Image Upload",
        onChange: n,
        accept: "image/*",
        "data-test-id": "image-modal-file-upload"
      }
    ),
    /* @__PURE__ */ N.jsx(lv, { children: /* @__PURE__ */ N.jsx(
      Pl,
      {
        "data-test-id": "image-modal-file-upload-btn",
        disabled: r,
        onClick: o,
        children: "Confirm"
      }
    ) })
  ] });
}
function bC({
  activeEditor: t,
  onClose: e
}) {
  const [n, r] = T.useState(null), o = T.useRef(!1);
  T.useEffect(() => {
    o.current = !1;
    const s = (l) => {
      o.current = l.altKey;
    };
    return document.addEventListener("keydown", s), () => {
      document.removeEventListener("keydown", s);
    };
  }, [t]);
  const i = (s) => {
    t.dispatchCommand(Na, s), e();
  };
  return /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
    !n && /* @__PURE__ */ N.jsxs(SC, { children: [
      /* @__PURE__ */ N.jsx(
        Pl,
        {
          "data-test-id": "image-modal-option-url",
          onClick: () => r("url"),
          children: "URL"
        }
      ),
      /* @__PURE__ */ N.jsx(
        Pl,
        {
          "data-test-id": "image-modal-option-file",
          onClick: () => r("file"),
          children: "File"
        }
      )
    ] }),
    n === "url" && /* @__PURE__ */ N.jsx(TC, { onClick: i }),
    n === "file" && /* @__PURE__ */ N.jsx(NC, { onClick: i })
  ] });
}
function AC({
  captionsEnabled: t
}) {
  const [e] = fe();
  return T.useEffect(() => {
    if (!e.hasNodes([Ao]))
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    return De(
      e.registerCommand(
        Na,
        (n) => {
          const r = Ta(n);
          return uf([r]), ft(r.getParentOrThrow()) && Cw(r, de).selectEnd(), !0;
        },
        G
      ),
      e.registerCommand(
        oa,
        (n) => PC(n),
        Oc
      ),
      e.registerCommand(
        ia,
        (n) => $C(n),
        re
      ),
      e.registerCommand(
        Hi,
        (n) => FC(n, e),
        Oc
      )
    );
  }, [t, e]), null;
}
const OC = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", av = document.createElement("img");
av.src = OC;
function PC(t) {
  const e = Sf();
  if (!e)
    return !1;
  const n = t.dataTransfer;
  return n ? (n.setData("text/plain", "_"), n.setDragImage(av, 0, 0), n.setData(
    "application/x-lexical-drag",
    JSON.stringify({
      data: {
        altText: e.__altText,
        caption: e.__caption,
        height: e.__height,
        key: e.getKey(),
        maxWidth: e.__maxWidth,
        showCaption: e.__showCaption,
        src: e.__src,
        width: e.__width
      },
      type: "image"
    })
  ), !0) : !1;
}
function $C(t) {
  return Sf() ? (uv(t) || t.preventDefault(), !0) : !1;
}
function FC(t, e) {
  const n = Sf();
  if (!n)
    return !1;
  const r = LC(t);
  if (!r)
    return !1;
  if (t.preventDefault(), uv(t)) {
    const o = IC(t);
    n.remove();
    const i = lf();
    o != null && i.applyDOMRange(o), Ie(i), e.dispatchCommand(Na, r);
  }
  return !0;
}
function Sf() {
  const t = $();
  if (!$e(t))
    return null;
  const n = t.getNodes()[0];
  return sv(n) ? n : null;
}
function LC(t) {
  var o;
  const e = (o = t.dataTransfer) == null ? void 0 : o.getData("application/x-lexical-drag");
  if (!e)
    return null;
  const { type: n, data: r } = JSON.parse(e);
  return n !== "image" ? null : r;
}
function uv(t) {
  const e = t.target;
  return !!(e && e instanceof HTMLElement && !e.closest("code, span.editor-image") && e.parentElement && e.parentElement.closest("div.ContentEditable__root"));
}
function IC(t) {
  let e;
  const n = t.target, r = n == null ? null : n.nodeType === 9 ? n.defaultView : n.ownerDocument.defaultView, o = EC(r);
  if (document.caretRangeFromPoint)
    e = document.caretRangeFromPoint(t.clientX, t.clientY);
  else if (t.rangeParent && o !== null)
    o.collapse(t.rangeParent, t.rangeOffset || 0), e = o.getRangeAt(0);
  else
    throw Error("Cannot get the selection when dragging");
  return e;
}
const Ds = 1, DC = /* @__PURE__ */ new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol"
]), RC = {
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
function Zg() {
  return /* @__PURE__ */ N.jsx("div", { className: "divider" });
}
function Xg(t, e) {
  e === null ? (t.style.opacity = "0", t.style.top = "-1000px", t.style.left = "-1000px") : (t.style.opacity = "1", t.style.top = `${e.top + e.height + window.pageYOffset + 10}px`, t.style.left = `${e.left + window.pageXOffset - t.offsetWidth / 2 + e.width / 2}px`);
}
function MC({ editor: t }) {
  const e = T.useRef(null), n = T.useRef(null), r = T.useRef(!1), [o, i] = T.useState(""), [s, l] = T.useState(!1), [a, u] = T.useState(null), c = T.useCallback(() => {
    const p = $();
    if (O(p)) {
      const v = cv(p), _ = v.getParent();
      Xt(_) ? i(_.getURL()) : Xt(v) ? i(v.getURL()) : i("");
    }
    const d = e.current, m = window.getSelection(), h = document.activeElement;
    if (d === null)
      return;
    const y = t.getRootElement();
    if (p !== null && !m.isCollapsed && y !== null && y.contains(m.anchorNode)) {
      const v = m.getRangeAt(0);
      let _;
      if (m.anchorNode === y) {
        let f = y;
        for (; f.firstElementChild != null; )
          f = f.firstElementChild;
        _ = f.getBoundingClientRect();
      } else
        _ = v.getBoundingClientRect();
      r.current || Xg(d, _), u(p);
    } else (!h || h.className !== "link-input") && (Xg(d, null), u(null), l(!1), i(""));
    return !0;
  }, [t]);
  return T.useEffect(() => De(
    t.registerUpdateListener(({ editorState: p }) => {
      p.read(() => {
        c();
      });
    }),
    t.registerCommand(
      Nr,
      () => (c(), !0),
      Ds
    )
  ), [t, c]), T.useEffect(() => {
    t.getEditorState().read(() => {
      c();
    });
  }, [t, c]), T.useEffect(() => {
    s && n.current && n.current.focus();
  }, [s]), /* @__PURE__ */ N.jsx("div", { ref: e, className: "link-editor", children: s ? /* @__PURE__ */ N.jsx(
    "input",
    {
      ref: n,
      className: "link-input",
      value: o,
      onChange: (p) => {
        i(p.target.value);
      },
      onKeyDown: (p) => {
        p.key === "Enter" ? (p.preventDefault(), a !== null && (o !== "" && t.dispatchCommand(Ri, o), l(!1))) : p.key === "Escape" && (p.preventDefault(), l(!1));
      }
    }
  ) : /* @__PURE__ */ N.jsx(N.Fragment, { children: /* @__PURE__ */ N.jsxs("div", { className: "link-input", children: [
    /* @__PURE__ */ N.jsx("a", { href: o, target: "_blank", rel: "noopener noreferrer", children: o }),
    /* @__PURE__ */ N.jsx(
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
function zC({ onChange: t, className: e, options: n, value: r }) {
  return /* @__PURE__ */ N.jsxs("select", { className: e, onChange: t, value: r, children: [
    /* @__PURE__ */ N.jsx("option", { hidden: !0, value: "" }),
    n.map((o) => /* @__PURE__ */ N.jsx("option", { value: o, children: o }, o))
  ] });
}
function cv(t) {
  const e = t.anchor, n = t.focus, r = t.anchor.getNode(), o = t.focus.getNode();
  return r === o ? r : t.isBackward() ? hg(n) ? r : o : hg(e) ? o : r;
}
function jC({
  editor: t,
  blockType: e,
  toolbarRef: n,
  setShowBlockOptionsDropDown: r
}) {
  const o = T.useRef(null);
  T.useEffect(() => {
    const d = n.current, m = o.current;
    if (d !== null && m !== null) {
      const { top: h, left: y } = d.getBoundingClientRect();
      m.style.top = `${h + 40}px`, m.style.left = `${y}px`;
    }
  }, [o, n]), T.useEffect(() => {
    const d = o.current, m = n.current;
    if (d !== null && m !== null) {
      const h = (y) => {
        const v = y.target;
        !d.contains(v) && !m.contains(v) && r(!1);
      };
      return document.addEventListener("click", h), () => {
        document.removeEventListener("click", h);
      };
    }
  }, [o, r, n]);
  const i = () => {
    e !== "paragraph" && t.update(() => {
      const d = $();
      O(d) && Uo(d, () => de());
    }), r(!1);
  }, s = () => {
    e !== "h1" && t.update(() => {
      const d = $();
      O(d) && Uo(d, () => Ln("h1"));
    }), r(!1);
  }, l = () => {
    e !== "h2" && t.update(() => {
      const d = $();
      O(d) && Uo(d, () => Ln("h2"));
    }), r(!1);
  }, a = () => {
    e !== "ul" ? t.dispatchCommand(H_) : t.dispatchCommand(zc), r(!1);
  }, u = () => {
    e !== "ol" ? t.dispatchCommand(V_) : t.dispatchCommand(zc), r(!1);
  }, c = () => {
    e !== "quote" && t.update(() => {
      const d = $();
      O(d) && Uo(d, () => _a());
    }), r(!1);
  }, p = () => {
    e !== "code" && t.update(() => {
      const d = $();
      O(d) && Uo(d, () => tr());
    }), r(!1);
  };
  return /* @__PURE__ */ N.jsxs("div", { className: "lexical-dropdown", ref: o, children: [
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: i, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon paragraph" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Normal" }),
      e === "paragraph" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: s, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon large-heading" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Large Heading" }),
      e === "h1" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: l, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon small-heading" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Small Heading" }),
      e === "h2" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: a, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon bullet-list" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Bullet List" }),
      e === "ul" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: u, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon numbered-list" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Numbered List" }),
      e === "ol" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: c, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon quote" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Quote" }),
      e === "quote" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] }),
    /* @__PURE__ */ N.jsxs("button", { className: "item", onClick: p, children: [
      /* @__PURE__ */ N.jsx("span", { className: "icon code" }),
      /* @__PURE__ */ N.jsx("span", { className: "text", children: "Code Block" }),
      e === "code" && /* @__PURE__ */ N.jsx("span", { className: "active" })
    ] })
  ] });
}
function BC() {
  const [t] = fe(), [e, n] = T.useState(t), r = T.useRef(null), [o, i] = T.useState(!1), [s, l] = T.useState(!1), [a, u] = T.useState("paragraph"), [c, p] = T.useState(null), [d, m] = T.useState(
    !1
  ), [h, y] = T.useState(""), [v, _] = T.useState(!1), [f, g] = T.useState(!1), [x, w] = T.useState(!1), [S, C] = T.useState(!1), [k, E] = T.useState(!1), [b, R] = T.useState(!1), [z, V] = T.useState(!1), [K, Z] = yC(), Y = T.useCallback(() => {
    var X;
    const j = $();
    if (O(j)) {
      if (e !== t && $isEditorIsNestedEditor(e)) {
        const _e = e.getRootElement();
        V(
          !!((X = _e == null ? void 0 : _e.parentElement) != null && X.classList.contains(
            "image-caption-container"
          ))
        );
      } else
        V(!1);
      const J = j.anchor.getNode(), ge = J.getKey() === "root" ? J : J.getTopLevelElementOrThrow(), ie = ge.getKey();
      if (t.getElementByKey(ie) !== null)
        if (p(ie), ee(ge)) {
          const _e = w_(J, Ar), P = _e ? _e.getTag() : ge.getTag();
          u(P);
        } else {
          const _e = O_(ge) ? ge.getTag() : ge.getType();
          u(_e), Ol(ge) && y(ge.getLanguage() || bS());
        }
      g(j.hasFormat("bold")), w(j.hasFormat("italic")), C(j.hasFormat("underline")), E(j.hasFormat("strikethrough")), R(j.hasFormat("code"));
      const se = cv(j), Ne = se.getParent();
      Xt(Ne) || Xt(se) ? _(!0) : _(!1);
    }
  }, [t]);
  T.useEffect(() => De(
    t.registerUpdateListener(({ editorState: j }) => {
      j.read(() => {
        Y();
      });
    }),
    t.registerCommand(
      Nr,
      (j, X) => (Y(), !1),
      Ds
    ),
    t.registerCommand(
      Go,
      (j) => (i(j), !1),
      Ds
    ),
    t.registerCommand(
      Qo,
      (j) => (l(j), !1),
      Ds
    )
  ), [t, Y]);
  const ne = T.useMemo(() => AS(), []), F = T.useCallback(
    (j) => {
      t.update(() => {
        if (c !== null) {
          const X = Ee(c);
          Ol(X) && X.setLanguage(j.target.value);
        }
      });
    },
    [t, c]
  ), W = T.useCallback(() => {
    v ? t.dispatchCommand(Ri, null) : t.dispatchCommand(Ri, "https://");
  }, [t, v]);
  return /* @__PURE__ */ N.jsxs("div", { className: "toolbar", ref: r, children: [
    /* @__PURE__ */ N.jsx(
      "button",
      {
        disabled: !o,
        onClick: () => {
          t.dispatchCommand(Yl, void 0);
        },
        className: "toolbar-item spaced",
        "aria-label": "Undo",
        children: /* @__PURE__ */ N.jsx("i", { className: "format undo" })
      }
    ),
    /* @__PURE__ */ N.jsx(
      "button",
      {
        disabled: !s,
        onClick: () => {
          t.dispatchCommand(Zl, void 0);
        },
        className: "toolbar-item",
        "aria-label": "Redo",
        children: /* @__PURE__ */ N.jsx("i", { className: "format redo" })
      }
    ),
    /* @__PURE__ */ N.jsx(Zg, {}),
    DC.has(a) && /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsxs(
        "button",
        {
          className: "toolbar-item block-controls",
          onClick: () => m(!d),
          "aria-label": "Formatting Options",
          children: [
            /* @__PURE__ */ N.jsx("span", { className: "icon block-type " + a }),
            /* @__PURE__ */ N.jsx("span", { className: "text", children: RC[a] }),
            /* @__PURE__ */ N.jsx("i", { className: "chevron-down" })
          ]
        }
      ),
      d && At.createPortal(
        /* @__PURE__ */ N.jsx(
          jC,
          {
            editor: t,
            blockType: a,
            toolbarRef: r,
            setShowBlockOptionsDropDown: m
          }
        ),
        document.body
      ),
      /* @__PURE__ */ N.jsx(Zg, {})
    ] }),
    a === "code" ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(
        zC,
        {
          className: "toolbar-item code-language",
          onChange: F,
          options: ne,
          value: h
        }
      ),
      /* @__PURE__ */ N.jsx("i", { className: "chevron-down inside" })
    ] }) : /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(ht, "bold");
          },
          className: "toolbar-item spaced " + (f ? "active" : ""),
          "aria-label": "Format Bold",
          children: /* @__PURE__ */ N.jsx("i", { className: "format bold" })
        }
      ),
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(ht, "italic");
          },
          className: "toolbar-item spaced " + (x ? "active" : ""),
          "aria-label": "Format Italics",
          children: /* @__PURE__ */ N.jsx("i", { className: "format italic" })
        }
      ),
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(ht, "underline");
          },
          className: "toolbar-item spaced " + (S ? "active" : ""),
          "aria-label": "Format Underline",
          children: /* @__PURE__ */ N.jsx("i", { className: "format underline" })
        }
      ),
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(ht, "strikethrough");
          },
          className: "toolbar-item spaced " + (k ? "active" : ""),
          "aria-label": "Format Strikethrough",
          children: /* @__PURE__ */ N.jsx("i", { className: "format strikethrough" })
        }
      ),
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: () => {
            t.dispatchCommand(ht, "code");
          },
          className: "toolbar-item spaced " + (b ? "active" : ""),
          "aria-label": "Insert Code",
          children: /* @__PURE__ */ N.jsx("i", { className: "format code" })
        }
      ),
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: W,
          className: "toolbar-item spaced " + (v ? "active" : ""),
          "aria-label": "Insert Link",
          children: /* @__PURE__ */ N.jsx("i", { className: "format link" })
        }
      ),
      /* @__PURE__ */ N.jsx(
        "button",
        {
          onClick: () => {
            Z("Insert Image", (j) => /* @__PURE__ */ N.jsx(
              bC,
              {
                activeEditor: t,
                onClose: j
              }
            ));
          },
          className: "toolbar-item spaced " + (z ? "active" : ""),
          "aria-label": "Insert Image",
          children: /* @__PURE__ */ N.jsx("i", { className: "format image" })
        }
      ),
      v && At.createPortal(/* @__PURE__ */ N.jsx(MC, { editor: t }), document.body)
    ] }),
    K
  ] });
}
const qg = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp"
];
function UC() {
  const [t] = fe();
  return T.useEffect(() => t.registerCommand(
    Pc,
    (e) => ((async () => {
      const n = await ww(
        e,
        [qg].flatMap((r) => r)
      );
      for (const { file: r, result: o } of n)
        x_(r, qg) && t.dispatchCommand(Na, {
          altText: r.name,
          src: o
        });
    })(), !0),
    re
  ), [t]), null;
}
function _u(t) {
  return t instanceof HTMLElement;
}
class dv {
  constructor(e, n) {
    this._x = e, this._y = n;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  equals({ x: e, y: n }) {
    return this.x === e && this.y === n;
  }
  calcDeltaXTo({ x: e }) {
    return this.x - e;
  }
  calcDeltaYTo({ y: e }) {
    return this.y - e;
  }
  calcHorizontalDistanceTo(e) {
    return Math.abs(this.calcDeltaXTo(e));
  }
  calcVerticalDistance(e) {
    return Math.abs(this.calcDeltaYTo(e));
  }
  calcDistanceTo(e) {
    return Math.sqrt(
      Math.pow(this.calcDeltaXTo(e), 2) + Math.pow(this.calcDeltaYTo(e), 2)
    );
  }
}
function WC(t) {
  return t instanceof dv;
}
class lr {
  constructor(e, n, r, o) {
    const [i, s] = n <= o ? [n, o] : [o, n], [l, a] = e <= r ? [e, r] : [r, e];
    this._top = i, this._right = a, this._left = l, this._bottom = s;
  }
  get top() {
    return this._top;
  }
  get right() {
    return this._right;
  }
  get bottom() {
    return this._bottom;
  }
  get left() {
    return this._left;
  }
  get width() {
    return Math.abs(this._left - this._right);
  }
  get height() {
    return Math.abs(this._bottom - this._top);
  }
  equals({ top: e, left: n, bottom: r, right: o }) {
    return e === this._top && r === this._bottom && n === this._left && o === this._right;
  }
  contains(e) {
    if (WC(e)) {
      const { x: n, y: r } = e, o = r < this._top, i = r > this._bottom, s = n < this._left, l = n > this._right;
      return {
        reason: {
          isOnBottomSide: i,
          isOnLeftSide: s,
          isOnRightSide: l,
          isOnTopSide: o
        },
        result: !o && !i && !s && !l
      };
    } else {
      const { top: n, left: r, bottom: o, right: i } = e;
      return n >= this._top && n <= this._bottom && o >= this._top && o <= this._bottom && r >= this._left && r <= this._right && i >= this._left && i <= this._right;
    }
  }
  intersectsWith(e) {
    const { left: n, top: r, width: o, height: i } = e, { left: s, top: l, width: a, height: u } = this, c = n + o >= s + a ? n + o : s + a, p = r + i >= l + u ? r + i : l + u, d = n <= s ? n : s, m = r <= l ? r : l;
    return c - d <= o + a && p - m <= i + u;
  }
  generateNewRect({
    left: e = this.left,
    top: n = this.top,
    right: r = this.right,
    bottom: o = this.bottom
  }) {
    return new lr(e, n, r, o);
  }
  static fromLTRB(e, n, r, o) {
    return new lr(e, n, r, o);
  }
  static fromLWTH(e, n, r, o) {
    return new lr(e, r, e + n, r + o);
  }
  static fromPoints(e, n) {
    const { y: r, x: o } = e, { y: i, x: s } = n;
    return lr.fromLTRB(o, r, s, i);
  }
  static fromDOM(e) {
    const { top: n, width: r, left: o, height: i } = e.getBoundingClientRect();
    return lr.fromLWTH(o, r, n, i);
  }
}
const Uc = 4, HC = 2, VC = "draggable-block-menu", eh = "application/x-lexical-drag-block", th = 28, KC = 1, QC = -1, nh = 0;
let Rs = 1 / 0;
function GC(t) {
  return t === 0 ? 1 / 0 : Rs >= 0 && Rs < t ? Rs : Math.floor(t / 2);
}
function JC(t) {
  return t.getEditorState().read(() => ye().getChildrenKeys());
}
function fv(t) {
  const e = (a, u) => a ? parseFloat(window.getComputedStyle(a)[u]) : 0, { marginTop: n, marginBottom: r } = window.getComputedStyle(t), o = e(
    t.previousElementSibling,
    "marginBottom"
  ), i = e(
    t.nextElementSibling,
    "marginTop"
  ), s = Math.max(
    parseFloat(n),
    o
  );
  return { marginBottom: Math.max(
    parseFloat(r),
    i
  ), marginTop: s };
}
function vu(t, e, n, r = !1) {
  const o = t.getBoundingClientRect(), i = JC(e);
  let s = null;
  return e.getEditorState().read(() => {
    if (r) {
      const [u, c] = [
        e.getElementByKey(i[0]),
        e.getElementByKey(i[i.length - 1])
      ], [p, d] = [
        u == null ? void 0 : u.getBoundingClientRect(),
        c == null ? void 0 : c.getBoundingClientRect()
      ];
      if (p && d) {
        const m = pi(u), h = pi(c);
        if (n.y / m < p.top ? s = u : n.y / h > d.bottom && (s = c), s)
          return;
      }
    }
    let l = GC(i.length), a = nh;
    for (; l >= 0 && l < i.length; ) {
      const u = i[l], c = e.getElementByKey(u);
      if (c === null)
        break;
      const p = pi(c), d = new dv(n.x / p, n.y / p), m = lr.fromDOM(c), { marginTop: h, marginBottom: y } = fv(c), v = m.generateNewRect({
        bottom: m.bottom + y,
        left: o.left,
        right: o.right,
        top: m.top - h
      }), {
        result: _,
        reason: { isOnTopSide: f, isOnBottomSide: g }
      } = v.contains(d);
      if (_) {
        s = c, Rs = l;
        break;
      }
      a === nh && (f ? a = QC : g ? a = KC : a = 1 / 0), l += a;
    }
  }), s;
}
function YC(t) {
  return !!t.closest(`.${VC}`);
}
function ZC(t, e, n) {
  if (!t) {
    e.style.opacity = "0", e.style.transform = "translate(-10000px, -10000px)";
    return;
  }
  const r = t.getBoundingClientRect(), o = window.getComputedStyle(t), i = e.getBoundingClientRect(), s = n.getBoundingClientRect(), l = r.top + (parseInt(o.lineHeight, 10) - i.height) / 2 - s.top, a = Uc;
  e.style.opacity = "1", e.style.transform = `translate(${a}px, ${l}px)`;
}
function XC(t, e) {
  const { transform: n } = e.style;
  e.style.transform = "translateZ(0)", t.setDragImage(e, 0, 0), setTimeout(() => {
    e.style.transform = n;
  });
}
function qC(t, e, n, r) {
  const { top: o, height: i } = e.getBoundingClientRect(), { top: s, width: l } = r.getBoundingClientRect(), { marginTop: a, marginBottom: u } = fv(e);
  let c = o;
  n >= o ? c += i + u / 2 : c -= a / 2;
  const p = c - s - HC, d = th - Uc;
  t.style.transform = `translate(${d}px, ${p}px)`, t.style.width = `${l - (th - Uc) * 2}px`, t.style.opacity = ".4";
}
function ek(t) {
  t && (t.style.opacity = "0", t.style.transform = "translate(-10000px, -10000px)");
}
function tk(t, e, n) {
  const r = e.parentElement, o = T.useRef(null), i = T.useRef(null), s = T.useRef(!1), [l, a] = T.useState(null);
  T.useEffect(() => {
    function p(m) {
      const h = m.target;
      if (!_u(h)) {
        a(null);
        return;
      }
      if (YC(h))
        return;
      const y = vu(e, t, m);
      a(y);
    }
    function d() {
      a(null);
    }
    return r == null || r.addEventListener("mousemove", p), r == null || r.addEventListener("mouseleave", d), () => {
      r == null || r.removeEventListener("mousemove", p), r == null || r.removeEventListener("mouseleave", d);
    };
  }, [r, e, t]), T.useEffect(() => {
    o.current && ZC(l, o.current, e);
  }, [e, l]), T.useEffect(() => {
    function p(m) {
      if (!s.current)
        return !1;
      const [h] = Yr(m);
      if (h)
        return !1;
      const { pageY: y, target: v } = m;
      if (!_u(v))
        return !1;
      const _ = vu(e, t, m, !0), f = i.current;
      return _ === null || f === null ? !1 : (qC(
        f,
        _,
        y / pi(v),
        e
      ), m.preventDefault(), !0);
    }
    function d(m) {
      if (!s.current)
        return !1;
      const [h] = Yr(m);
      if (h)
        return !1;
      const { target: y, dataTransfer: v, pageY: _ } = m, f = (v == null ? void 0 : v.getData(eh)) || "", g = Ee(f);
      if (!g || !_u(y))
        return !1;
      const x = vu(e, t, m, !0);
      if (!x)
        return !1;
      const w = Wt(x);
      if (!w)
        return !1;
      if (w === g)
        return !0;
      const S = x.getBoundingClientRect().top;
      return _ / pi(y) >= S ? w.insertAfter(g) : w.insertBefore(g), a(null), !0;
    }
    return De(
      t.registerCommand(
        ia,
        (m) => p(m),
        re
      ),
      t.registerCommand(
        Hi,
        (m) => d(m),
        Oc
      )
    );
  }, [e, t]);
  function u(p) {
    const d = p.dataTransfer;
    if (!d || !l)
      return;
    XC(d, l);
    let m = "";
    t.update(() => {
      const h = Wt(l);
      h && (m = h.getKey());
    }), s.current = !0, d.setData(eh, m);
  }
  function c() {
    s.current = !1, ek(i.current);
  }
  return At.createPortal(
    /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(
        "div",
        {
          className: "icon draggable-block-menu",
          ref: o,
          draggable: !0,
          onDragStart: u,
          onDragEnd: c,
          children: /* @__PURE__ */ N.jsx("div", { className: n ? "icon" : "" })
        }
      ),
      /* @__PURE__ */ N.jsx("div", { className: "draggable-block-target-line", ref: i })
    ] }),
    e
  );
}
function nk({
  anchorElem: t = document.body
}) {
  const [e] = fe();
  return tk(e, t, e._editable);
}
function rk({ validateUrl: t }) {
  const [e] = fe();
  return T.useEffect(() => {
    if (!e.hasNodes([nr])) throw new Error("LinkPlugin: LinkNode not registered on editor");
    return De(e.registerCommand(Ri, (n) => {
      if (n === null) return hu(n), !0;
      if (typeof n == "string") return !(t !== void 0 && !t(n)) && (hu(n), !0);
      {
        const { url: r, target: o, rel: i, title: s } = n;
        return hu(r, { rel: i, target: o, title: s }), !0;
      }
    }, re), t !== void 0 ? e.registerCommand(xo, (n) => {
      const r = $();
      if (!O(r) || r.isCollapsed() || !gn(n, ClipboardEvent)) return !1;
      const o = n;
      if (o.clipboardData === null) return !1;
      const i = o.clipboardData.getData("text");
      return !!t(i) && !r.getNodes().some((s) => A(s)) && (e.dispatchCommand(Ri, i), n.preventDefault(), !0);
    }, re) : () => {
    });
  }, [e, t]), null;
}
const ok = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/
);
function ik(t) {
  return t === "https://" || ok.test(t);
}
function sk() {
  return /* @__PURE__ */ N.jsx(rk, { validateUrl: ik });
}
const lk = {
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
function ak(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const uk = (t) => "(?:" + t.map((e) => ak(e)).join("|") + ")";
function ck(t, e) {
  const n = Object.keys(t), r = [];
  if (n.length) {
    const o = new RegExp(uk(n), "g");
    let i;
    for (o.lastIndex = 0; (i = o.exec(e)) !== null; )
      r.push({
        value: i[0],
        index: i.index
      });
  }
  return r;
}
function dk(t, e, n, r) {
  const o = ck(t, e), i = [];
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
function fk(t, e, n, r = Z_) {
  const o = dk(t, e), i = [];
  for (const s of o)
    if (s.type === "text")
      i.push(le(s.value));
    else {
      const l = t[s.value];
      i.push(new mo(l.entity_type === "tag" ? "#" : "@", l.markdown_code, { data: { ...l, richMode: !0 } }));
    }
  return i;
}
function pk(t, e) {
  return fk(t, e);
}
function gk(t, e) {
  const n = {};
  for (const r of t) {
    const o = e(r);
    n[o] ? n[o].push(r) : n[o] = [r];
  }
  return n;
}
function pv(t) {
  const e = gk(t, (n) => n.type);
  return { element: e.element || [], textFormat: e["text-format"] || [], textMatch: e["text-match"] || [] };
}
const rh = /[!-/:-@[-`{-~\s]/, hk = /^\s{0,3}$/;
function Wc(t) {
  if (!Vt(t)) return !1;
  const e = t.getFirstChild();
  return e == null || t.getChildrenSize() === 1 && I(e) && hk.test(e.getTextContent());
}
function mk(t, e, n, r) {
  for (const o of e) {
    const i = o.export(t, (s) => $l(s, n, r));
    if (i != null) return i;
  }
  return A(t) ? $l(t, n, r) : ae(t) ? t.getTextContent() : null;
}
function $l(t, e, n) {
  const r = [], o = t.getChildren();
  e: for (const i of o) {
    for (const s of n) {
      const l = s.export(i, (a) => $l(a, e, n), (a, u) => oh(a, u, e));
      if (l != null) {
        r.push(l);
        continue e;
      }
    }
    Vn(i) ? r.push(`
`) : I(i) ? r.push(oh(i, i.getTextContent(), e)) : A(i) ? r.push($l(i, e, n)) : ae(i) && r.push(i.getTextContent());
  }
  return r.join("");
}
function oh(t, e, n) {
  const r = e.trim();
  let o = r;
  const i = /* @__PURE__ */ new Set();
  for (const s of n) {
    const l = s.format[0], a = s.tag;
    xu(t, l) && !i.has(l) && (i.add(l), xu(ih(t, !0), l) || (o = a + o), xu(ih(t, !1), l) || (o += a));
  }
  return e.replace(r, () => o);
}
function ih(t, e) {
  let n = e ? t.getPreviousSibling() : t.getNextSibling();
  if (!n) {
    const r = t.getParentOrThrow();
    r.isInline() && (n = e ? r.getPreviousSibling() : r.getNextSibling());
  }
  for (; n; ) {
    if (A(n)) {
      if (!n.isInline()) break;
      const r = e ? n.getLastDescendant() : n.getFirstDescendant();
      if (I(r)) return r;
      n = e ? n.getPreviousSibling() : n.getNextSibling();
    }
    if (I(n)) return n;
    if (!A(n)) return null;
  }
  return null;
}
function xu(t, e) {
  return I(t) && t.hasFormat(e);
}
const Oo = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, yk = Oo && "documentMode" in document ? document.documentMode : null;
Oo && "InputEvent" in window && !yk && new window.InputEvent("input");
const sh = Oo && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), lh = Oo && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, _k = Oo && /^(?=.*Chrome).*/i.test(navigator.userAgent), ah = Oo && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !_k, uh = /^[ \t]*```(\w{1,10})?\s?$/;
function vk(t, e = !1) {
  const n = pv(t), r = function(o) {
    const i = {}, s = {}, l = [], a = "(?<![\\\\])";
    for (const u of o) {
      const { tag: c } = u;
      i[c] = u;
      const p = c.replace(/(\*|\^|\+)/g, "\\$1");
      l.push(p), s[c] = sh || lh || ah ? new RegExp(`(${p})(?![${p}\\s])(.*?[^${p}\\s])${p}(?!${p})`) : new RegExp(`(?<![\\\\${p}])(${p})((\\\\${p})?.*?[^${p}\\s](\\\\${p})?)((?<!\\\\)|(?<=\\\\\\\\))(${p})(?![\\\\${p}])`);
    }
    return { fullMatchRegExpByTag: s, openTagsRegExp: new RegExp((sh || lh || ah ? "" : `${a}`) + "(" + l.join("|") + ")", "g"), transformersByTag: i };
  }(n.textFormat);
  return (o, i) => {
    const s = o.split(`
`), l = s.length, a = i || ye();
    a.clear();
    for (let c = 0; c < l; c++) {
      const p = s[c], [d, m] = wk(s, c, a);
      d == null ? xk(p, a, n.element, r, n.textMatch) : c = m;
    }
    const u = a.getChildren();
    for (const c of u) !e && Wc(c) && a.getChildrenSize() > 1 && c.remove();
    $() !== null && a.selectEnd();
  };
}
function xk(t, e, n, r, o) {
  const i = t.trim(), s = le(i), l = de();
  l.append(s), e.append(l);
  for (const { regExp: a, replace: u } of n) {
    const c = t.match(a);
    if (c) {
      s.setTextContent(t.slice(c[0].length)), u(l, [s], c, !0);
      break;
    }
  }
  if (Ms(s, r, o), l.isAttached() && i.length > 0) {
    const a = l.getPreviousSibling();
    if (Vt(a) || $c(a) || ee(a)) {
      let u = a;
      if (ee(a)) {
        const c = a.getLastDescendant();
        u = c == null ? null : ya(c, ve);
      }
      u != null && u.getTextContentSize() > 0 && (u.splice(u.getChildrenSize(), 0, [Ht(), ...l.getChildren()]), l.remove());
    }
  }
}
function wk(t, e, n) {
  const r = t[e].match(uh);
  if (r) {
    let o = e;
    const i = t.length;
    for (; ++o < i; )
      if (t[o].match(uh)) {
        const s = tr(r[1]), l = le(t.slice(e + 1, o).join(`
`));
        return s.append(l), n.append(s), [s, o];
      }
  }
  return [null, e];
}
function Ms(t, e, n) {
  const r = t.getTextContent(), o = function(u, c) {
    const p = u.match(c.openTagsRegExp);
    if (p == null) return null;
    for (const d of p) {
      const m = d.replace(/^\s/, ""), h = c.fullMatchRegExpByTag[m];
      if (h == null) continue;
      const y = u.match(h), v = c.transformersByTag[m];
      if (y != null && v != null) {
        if (v.intraword !== !1) return y;
        const { index: _ = 0 } = y, f = u[_ - 1], g = u[_ + y[0].length];
        if ((!f || rh.test(f)) && (!g || rh.test(g))) return y;
      }
    }
    return null;
  }(r, e);
  if (!o) return void gv(t, n);
  let i, s, l;
  if (o[0] === r) i = t;
  else {
    const u = o.index || 0, c = u + o[0].length;
    u === 0 ? [i, s] = t.splitText(c) : [l, i, s] = t.splitText(u, c);
  }
  i.setTextContent(o[2]);
  const a = e.transformersByTag[o[1]];
  if (a) for (const u of a.format) i.hasFormat(u) || i.toggleFormat(u);
  i.hasFormat("code") || Ms(i, e, n), l && Ms(l, e, n), s && Ms(s, e, n);
}
function gv(t, e) {
  let n = t;
  e: for (; n; ) {
    for (const r of e) {
      const o = n.getTextContent().match(r.importRegExp);
      if (!o) continue;
      const i = o.index || 0, s = i + o[0].length;
      let l, a;
      i === 0 ? [l, n] = n.splitText(s) : [, l, a] = n.splitText(i, s), a && gv(a, e), r.replace(l, o);
      continue e;
    }
    break;
  }
}
function Sk(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
Sk(function(t) {
  const e = new URLSearchParams();
  e.append("code", t);
  for (let n = 1; n < arguments.length; n++) e.append("v", arguments[n]);
  throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
});
const hv = (t) => (e, n, r) => {
  const o = t(r);
  o.append(...n), e.replace(o), o.select(0, 0);
}, mv = (t) => (e, n, r) => {
  const o = e.getPreviousSibling(), i = e.getNextSibling(), s = pt(t === "check" ? r[3] === "x" : void 0);
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
}, Cf = (t, e, n) => {
  const r = [], o = t.getChildren();
  let i = 0;
  for (const s of o) if (ve(s)) {
    if (s.getChildrenSize() === 1) {
      const c = s.getFirstChild();
      if (ee(c)) {
        r.push(Cf(c, e, n + 1));
        continue;
      }
    }
    const l = " ".repeat(4 * n), a = t.getListType(), u = a === "number" ? `${t.getStart() + i}. ` : a === "check" ? `- [${s.getChecked() ? "x" : " "}] ` : "- ";
    r.push(l + u + e(s)), i++;
  }
  return r.join(`
`);
}, Ck = { dependencies: [va], export: (t, e) => {
  if (!O_(t)) return null;
  const n = Number(t.getTag().slice(1));
  return "#".repeat(n) + " " + e(t);
}, regExp: /^(#{1,6})\s/, replace: hv((t) => {
  const e = "h" + t[1].length;
  return Ln(e);
}), type: "element" }, kk = { dependencies: [To], export: (t, e) => {
  if (!$c(t)) return null;
  const n = e(t).split(`
`), r = [];
  for (const o of n) r.push("> " + o);
  return r.join(`
`);
}, regExp: /^>\s/, replace: (t, e, n, r) => {
  if (r) {
    const i = t.getPreviousSibling();
    if ($c(i)) return i.splice(i.getChildrenSize(), 0, [Ht(), ...e]), i.select(0, 0), void t.remove();
  }
  const o = _a();
  o.append(...e), t.replace(o), o.select(0, 0);
}, type: "element" }, Ek = { dependencies: [xa], export: (t) => {
  if (!Ol(t)) return null;
  const e = t.getTextContent();
  return "```" + (t.getLanguage() || "") + (e ? `
` + e : "") + "\n```";
}, regExp: /^[ \t]*```(\w{1,10})?\s/, replace: hv((t) => tr(t ? t[1] : void 0)), type: "element" }, Tk = { dependencies: [Ar, br], export: (t, e) => ee(t) ? Cf(t, e, 0) : null, regExp: /^(\s*)[-*+]\s/, replace: mv("bullet"), type: "element" }, Nk = { dependencies: [Ar, br], export: (t, e) => ee(t) ? Cf(t, e, 0) : null, regExp: /^(\s*)(\d{1,})\.\s/, replace: mv("number"), type: "element" }, bk = { format: ["code"], tag: "`", type: "text-format" }, Ak = { format: ["highlight"], tag: "==", type: "text-format" }, Ok = { format: ["bold", "italic"], tag: "***", type: "text-format" }, Pk = { format: ["bold", "italic"], intraword: !1, tag: "___", type: "text-format" }, $k = { format: ["bold"], tag: "**", type: "text-format" }, Fk = { format: ["bold"], intraword: !1, tag: "__", type: "text-format" }, Lk = { format: ["strikethrough"], tag: "~~", type: "text-format" }, Ik = { format: ["italic"], tag: "*", type: "text-format" }, Dk = { format: ["italic"], intraword: !1, tag: "_", type: "text-format" }, Rk = { dependencies: [nr], export: (t, e, n) => {
  if (!Xt(t)) return null;
  const r = t.getTitle(), o = r ? `[${t.getTextContent()}](${t.getURL()} "${r}")` : `[${t.getTextContent()}](${t.getURL()})`, i = t.getFirstChild();
  return t.getChildrenSize() === 1 && I(i) ? n(i, o) : o;
}, importRegExp: /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))/, regExp: /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))$/, replace: (t, e) => {
  const [, n, r, o] = e, i = Di(r, { title: o }), s = le(n);
  s.setFormat(t.getFormat()), i.append(s), t.replace(i);
}, trigger: ")", type: "text-match" }, yv = [Ck, kk, Ek, Tk, Nk], Mk = [bk, Ok, Pk, $k, Fk, Ak, Ik, Dk, Lk], zk = [Rk], ba = [...yv, ...Mk, ...zk];
function ch(t, e = ba, n, r = !1) {
  return vk(e, r)(t, n);
}
function jk(t = ba, e, n = !1) {
  return function(o, i = !1) {
    const s = pv(o), l = !i, a = s.textFormat.filter((u) => u.format.length === 1);
    return (u) => {
      const c = [], p = (u || ye()).getChildren();
      for (let d = 0; d < p.length; d++) {
        const m = p[d], h = mk(m, s.element, a, s.textMatch);
        h != null && c.push(l && d > 0 && !Wc(m) && !Wc(p[d - 1]) ? `
`.concat(h) : h);
      }
      return c.join(`
`);
    };
  }(t, n)(e);
}
function Bk({ loading: t, ...e }) {
  return t ? /* @__PURE__ */ N.jsx("div", { className: "top-[2px] m-0 min-w-[8rem] max-w-[14rem] overflow-hidden rounded-md border bg-white p-2.5 text-sm text-popover-foreground shadow-md", children: "Loading..." }) : /* @__PURE__ */ N.jsx(
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
const _v = T.forwardRef(({ selected: t, item: e, itemValue: n, ...r }, o) => {
  const { data: i } = r, s = i.entity_type === "tag" ? e.trigger : i.entity_image ? /* @__PURE__ */ N.jsx("img", { src: i.entity_image, className: `mr-2 w-4 h-4 ${i.entity_type === "user" ? "rounded-full" : ""}` }) : e.trigger;
  return /* @__PURE__ */ N.jsxs(
    "li",
    {
      ref: o,
      className: `relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none overflow-hidden ${t ? "bg-blue-300 text-accent-foreground" : ""}`,
      ...r,
      children: [
        s,
        /* @__PURE__ */ N.jsx("div", { className: "flex-auto whitespace-nowrap overflow-hidden text-ellipsis", children: i.entity_title })
      ]
    }
  );
});
_v.displayName = "MenuItem";
const vv = {
  export: (t, e, n) => sv(t) ? `![${t.getAltText()}](${t.getSrc()})` : null,
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (t, e) => {
    const [, n, r] = e, o = Ta({ altText: n, src: r });
    t.replace(o);
  },
  trigger: ")",
  type: "text-match"
};
function Uk() {
  return /* @__PURE__ */ N.jsx("div", { className: "editor-placeholder", children: "Play around..." });
}
const Wk = {
  "@": "inline-block break-words",
  "#": "inline-block break-words"
}, Hk = {
  "@": "px-1 mx-2/3 mx-px align-baseline inline-block rounded break-words leading-5 dark:bg-gray-100 bg-gray-100",
  "#": "px-1 mx-2/3 mx-px align-baseline inline-block rounded break-words leading-5 dark:bg-green-100 bg-green-100"
}, Vk = T.forwardRef(({ trigger: t, value: e, data: n, children: r, ...o }, i) => {
  let s = n ? n.data.richMode ? n.data.entity_link_name : n.data.markdown_code : "s";
  const l = n && n.data.richMode ? n.data.entity_type === "tag" ? "#" : n.data.entity_image ? /* @__PURE__ */ N.jsx("img", { src: n.data.entity_image, className: `relative mr-1 top-[2px] w-4 h-4 float-left ${n.data.entity_type === "user" ? "rounded-full" : ""}` }) : "" : "";
  return /* @__PURE__ */ N.jsxs("div", { ...o, ref: i, title: e, children: [
    l,
    s
  ] });
});
class mo extends Pt {
  static getType() {
    return "custom-beautifulMention";
  }
  static clone(e) {
    return new mo(e.__trigger, e.__value, e.__data, e.__key);
  }
  static importJSON(e) {
    return new mo(e.trigger, e.value, e.data);
  }
  getTextContent() {
    return this.getLatest().__value;
  }
  exportJSON() {
    const e = this.__data;
    return Object.assign(Object.assign({ trigger: this.__trigger, value: this.__value }, e ? { data: e } : {}), { type: "custom-beautifulMention", version: 1 });
  }
  component() {
    return Vk;
  }
  decorate(e, n) {
    return super.decorate(e, n);
  }
}
const Kk = async (t, e, n, r) => {
  const o = await fetch(
    `?module=tasks&action=${t === "#" ? "entityAutocomplete" : "mentionAutocomplete"}&task_id=${r}&term=${e}`
  ), { data: i } = await o.json();
  return i.map((s) => ({ value: s.markdown_code, data: { ...s, richMode: n } }));
}, Qk = ({ initialElement: t, richMode: e, taskLinks: n }) => {
  const [r] = fe();
  return T.useEffect(() => {
    r.update(() => {
      if (e) {
        const o = ye(), i = de();
        o.clear(), o.append(i), ch(t.value, yv, i);
        for (const s of i.getChildren()) {
          const l = pk(n, s.getTextContent()), a = de();
          o.append(a);
          const u = l.reduce((c, p) => {
            if (p.__type !== "custom-beautifulMention") {
              const d = de();
              i.append(d);
              const h = p.__text.replace(/^([^\n\S]+)|([^\n\S]+)$/g, (v, _, f) => {
                if (_)
                  return "".repeat(_.length);
                if (f)
                  return "".repeat(f.length);
              });
              ch(h, [...ba, vv], d, !0);
              const y = d.getChildren().reduce((v, _, f) => [...v, ...f > 0 ? [Ht()] : [], ..._.getChildren()], []);
              return [...c, ...y];
            }
            return [...c, p];
          }, []);
          a.append(...u);
        }
        i.remove();
      } else
        uf([le(t.value)]);
    });
  }, [r]), null;
}, Gk = ({ controls: t }) => {
  const [e] = fe(), { openMentionMenu: n } = fC(), r = t.querySelectorAll(".t-form-line-autocomplete-chip"), o = (s) => {
    s.preventDefault();
  }, i = (s) => {
    s.preventDefault();
    const l = s.currentTarget.dataset.type === "at" ? "@" : "#";
    n({ trigger: l });
  };
  T.useEffect(() => (e.update(() => {
    r.forEach((s) => {
      s.addEventListener("mousedown", o), s.addEventListener("click", i);
    });
  }), () => {
    r.forEach((s) => {
      s.removeEventListener("mousedown", o), s.removeEventListener("click", i);
    });
  }));
};
function Jk(t, e) {
  t.read(() => {
    const n = jk([...ba, vv]);
    e.value = n;
  });
}
const Yk = (t) => ({
  theme: {
    ...lk,
    beautifulMentions: t ? Hk : Wk
  },
  onError(e) {
    throw e;
  },
  nodes: [
    mo,
    {
      replace: Pt,
      with: (e) => new mo(
        e.getTrigger(),
        e.getValue(),
        e.getData()
      )
    },
    va,
    Ar,
    br,
    To,
    xa,
    vf,
    R_,
    mf,
    yf,
    wa,
    nr,
    Ao
  ]
});
function Zk({ initialElement: t, richMode: e, taskLinks: n, taskId: r, controls: o }) {
  const i = e ? jw : Jw, s = Yk(e), [l, a] = T.useState(null), u = (c) => {
    c !== null && a(c);
  };
  return /* @__PURE__ */ N.jsx(nw, { initialConfig: s, children: /* @__PURE__ */ N.jsxs("div", { className: "editor-container", children: [
    e && /* @__PURE__ */ N.jsx(BC, {}),
    /* @__PURE__ */ N.jsxs("div", { className: "editor-inner", children: [
      /* @__PURE__ */ N.jsx(
        i,
        {
          contentEditable: /* @__PURE__ */ N.jsx("div", { className: "editor-scroller", children: /* @__PURE__ */ N.jsx("div", { className: "editor", ref: u, children: /* @__PURE__ */ N.jsx(eS, { className: "editor-input" }) }) }),
          placeholder: /* @__PURE__ */ N.jsx(Uk, {}),
          ErrorBoundary: Xw
        }
      ),
      /* @__PURE__ */ N.jsx(
        dC,
        {
          triggers: ["@", "#"],
          allowSpaces: !1,
          onSearch: (...c) => Kk(...c, e, r),
          menuComponent: Bk,
          menuItemComponent: _v
        }
      ),
      /* @__PURE__ */ N.jsx(gC, { onChange: (c) => Jk(c, t) }),
      /* @__PURE__ */ N.jsx(
        Qk,
        {
          initialElement: t,
          richMode: e,
          taskLinks: n
        }
      ),
      /* @__PURE__ */ N.jsx(tS, {}),
      e && /* @__PURE__ */ N.jsx(UC, {}),
      e && /* @__PURE__ */ N.jsx(AC, {}),
      e && /* @__PURE__ */ N.jsx(FS, {}),
      e && /* @__PURE__ */ N.jsx(sk, {}),
      o && /* @__PURE__ */ N.jsx(Gk, { controls: o }),
      /* @__PURE__ */ N.jsx(uS, {}),
      l && /* @__PURE__ */ N.jsx(nk, { anchorElem: l })
    ] })
  ] }) });
}
function Xk(t, e, n) {
  const r = document.createElement("div");
  r.classList = "lexical-editor";
  const o = typeof t.dataset.richMode < "u", i = t.dataset.taskId ?? "";
  t.parentElement.insertBefore(r, t), t.style.display = "none", wu.createRoot(r).render(
    /* @__PURE__ */ N.jsx(Mv.StrictMode, { children: /* @__PURE__ */ N.jsx(Zk, { initialElement: t, richMode: o, taskLinks: e, taskId: i, controls: n }) })
  );
}
export {
  sv as $,
  wr as C,
  oa as I,
  wo as S,
  pi as a,
  fe as b,
  De as c,
  Ee as d,
  na as e,
  Jl as f,
  re as g,
  Nr as h,
  Xk as i,
  N as j,
  $ as m,
  O as n,
  T as r,
  $e as s,
  Kt as t,
  GS as u,
  ra as w,
  Ie as x
};
