import { r as d, j as m, a as U, u as Q, b as Z, s as L, m as B, d as _, $ as A, x as V, n as K, c as ee, e as te, g as b, C as se, S as re, w as ne, I as oe, f as ie, h as ae, t as ce } from "./index-BRfvj-qr.js";
function G(h, y, g) {
  return Math.min(Math.max(h, y), g);
}
const r = {
  east: 1,
  north: 8,
  south: 2,
  west: 4
};
function le({
  onResizeStart: h,
  onResizeEnd: y,
  buttonRef: g,
  imageRef: C,
  maxWidth: S,
  editor: E,
  showCaption: M,
  setShowCaption: D,
  captionsEnabled: j
}) {
  const $ = d.useRef(null), v = d.useRef({
    priority: "",
    value: "default"
  }), P = d.useRef({
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: !1,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0
  }), l = E.getRootElement(), x = S || (l !== null ? l.getBoundingClientRect().width - 20 : 100), H = l !== null ? l.getBoundingClientRect().height - 20 : 100, R = 100, X = 100, n = (e) => {
    const s = e === r.east || e === r.west, t = e === r.north || e === r.south, w = e & r.north && e & r.west || e & r.south && e & r.east, u = s ? "ew" : t ? "ns" : w ? "nwse" : "nesw";
    l !== null && l.style.setProperty(
      "cursor",
      `${u}-resize`,
      "important"
    ), document.body !== null && (document.body.style.setProperty(
      "cursor",
      `${u}-resize`,
      "important"
    ), v.current.value = document.body.style.getPropertyValue(
      "-webkit-user-select"
    ), v.current.priority = document.body.style.getPropertyPriority(
      "-webkit-user-select"
    ), document.body.style.setProperty(
      "-webkit-user-select",
      "none",
      "important"
    ));
  }, N = () => {
    l !== null && l.style.setProperty("cursor", "text"), document.body !== null && (document.body.style.setProperty("cursor", "default"), document.body.style.setProperty(
      "-webkit-user-select",
      v.current.value,
      v.current.priority
    ));
  }, z = (e, s) => {
    if (!E.isEditable())
      return;
    const t = C.current, w = $.current;
    if (t !== null && w !== null) {
      e.preventDefault();
      const { width: u, height: f } = t.getBoundingClientRect(), a = U(t), o = P.current;
      o.startWidth = u, o.startHeight = f, o.ratio = u / f, o.currentWidth = u, o.currentHeight = f, o.startX = e.clientX / a, o.startY = e.clientY / a, o.isResizing = !0, o.direction = s, n(s), h(), w.classList.add("image-control-wrapper--resizing"), t.style.height = `${f}px`, t.style.width = `${u}px`, document.addEventListener("pointermove", W), document.addEventListener("pointerup", I);
    }
  }, W = (e) => {
    const s = C.current, t = P.current, w = t.direction & (r.east | r.west), u = t.direction & (r.south | r.north);
    if (s !== null && t.isResizing) {
      const f = U(s);
      if (w && u) {
        let a = Math.floor(t.startX - e.clientX / f);
        a = t.direction & r.east ? -a : a;
        const o = G(
          t.startWidth + a,
          R,
          x
        ), Y = o / t.ratio;
        s.style.width = `${o}px`, s.style.height = `${Y}px`, t.currentHeight = Y, t.currentWidth = o;
      } else if (u) {
        let a = Math.floor(t.startY - e.clientY / f);
        a = t.direction & r.south ? -a : a;
        const o = G(
          t.startHeight + a,
          X,
          H
        );
        s.style.height = `${o}px`, t.currentHeight = o;
      } else {
        let a = Math.floor(t.startX - e.clientX / f);
        a = t.direction & r.east ? -a : a;
        const o = G(
          t.startWidth + a,
          R,
          x
        );
        s.style.width = `${o}px`, t.currentWidth = o;
      }
    }
  }, I = () => {
    const e = C.current, s = P.current, t = $.current;
    if (e !== null && t !== null && s.isResizing) {
      const w = s.currentWidth, u = s.currentHeight;
      s.startWidth = 0, s.startHeight = 0, s.ratio = 0, s.startX = 0, s.startY = 0, s.currentWidth = 0, s.currentHeight = 0, s.isResizing = !1, t.classList.remove("image-control-wrapper--resizing"), N(), y(w, u), document.removeEventListener("pointermove", W), document.removeEventListener("pointerup", I);
    }
  };
  return /* @__PURE__ */ m.jsxs("div", { ref: $, children: [
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-n",
        onPointerDown: (e) => {
          z(e, r.north);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-ne",
        onPointerDown: (e) => {
          z(e, r.north | r.east);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-e",
        onPointerDown: (e) => {
          z(e, r.east);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-se",
        onPointerDown: (e) => {
          z(e, r.south | r.east);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-s",
        onPointerDown: (e) => {
          z(e, r.south);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-sw",
        onPointerDown: (e) => {
          z(e, r.south | r.west);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-w",
        onPointerDown: (e) => {
          z(e, r.west);
        }
      }
    ),
    /* @__PURE__ */ m.jsx(
      "div",
      {
        className: "image-resizer image-resizer-nw",
        onPointerDown: (e) => {
          z(e, r.north | r.west);
        }
      }
    )
  ] });
}
const F = /* @__PURE__ */ new Set(), O = ce();
function ue(h) {
  if (!F.has(h))
    throw new Promise((y) => {
      const g = new Image();
      g.src = h, g.onload = () => {
        F.add(h), y(null);
      }, g.onerror = () => {
        F.add(h);
      };
    });
}
function de({
  altText: h,
  className: y,
  imageRef: g,
  src: C,
  width: S,
  height: E,
  maxWidth: M,
  onError: D
}) {
  return ue(C), /* @__PURE__ */ m.jsx(
    "img",
    {
      className: y || void 0,
      src: C,
      alt: h,
      ref: g,
      style: {
        height: E,
        maxWidth: M,
        width: S
      },
      onError: D,
      draggable: "false"
    }
  );
}
function ge({
  src: h,
  altText: y,
  nodeKey: g,
  width: C,
  height: S,
  maxWidth: E,
  resizable: M,
  showCaption: D,
  caption: j,
  captionsEnabled: $
}) {
  const v = d.useRef(null), P = d.useRef(null), [l, x, H] = Q(g), [R, X] = d.useState(!1), [n] = Z(), [N, z] = d.useState(null), W = d.useRef(null), [I, e] = d.useState(!1), s = d.useCallback(
    (c) => {
      if (l && L(B())) {
        c.preventDefault();
        const p = _(g);
        if (A(p))
          return p.remove(), !0;
      }
      return !1;
    },
    [l, g]
  ), t = d.useCallback(
    (c) => {
      const i = B(), p = P.current;
      if (l && L(i) && i.getNodes().length === 1) {
        if (D)
          return V(null), c.preventDefault(), j.focus(), !0;
        if (p !== null && p !== document.activeElement)
          return c.preventDefault(), p.focus(), !0;
      }
      return !1;
    },
    [j, l, D]
  ), w = d.useCallback(
    (c) => W.current === j || P.current === c.target ? (V(null), n.update(() => {
      x(!0);
      const i = n.getRootElement();
      i !== null && i.focus();
    }), !0) : !1,
    [j, n, x]
  ), u = d.useCallback(
    (c) => {
      const i = c;
      return R ? !0 : i.target === v.current ? (i.shiftKey ? x(!l) : (H(), x(!0)), !0) : !1;
    },
    [R, l, x, H]
  ), f = d.useCallback(
    (c) => {
      n.getEditorState().read(() => {
        const i = B();
        c.target.tagName === "IMG" && K(i) && i.getNodes().length === 1 && n.dispatchCommand(
          O,
          c
        );
      });
    },
    [n]
  );
  d.useEffect(() => {
    let c = !0;
    const i = n.getRootElement(), p = ee(
      n.registerUpdateListener(({ editorState: k }) => {
        c && z(k.read(() => B()));
      }),
      n.registerCommand(
        ae,
        (k, J) => (W.current = J, !1),
        b
      ),
      n.registerCommand(
        ie,
        u,
        b
      ),
      n.registerCommand(
        O,
        u,
        b
      ),
      n.registerCommand(
        oe,
        (k) => k.target === v.current ? (k.preventDefault(), !0) : !1,
        b
      ),
      n.registerCommand(
        ne,
        s,
        b
      ),
      n.registerCommand(
        re,
        s,
        b
      ),
      n.registerCommand(se, t, b),
      n.registerCommand(
        te,
        w,
        b
      )
    );
    return i == null || i.addEventListener("contextmenu", f), () => {
      c = !1, p(), i == null || i.removeEventListener("contextmenu", f);
    };
  }, [
    H,
    n,
    R,
    l,
    g,
    s,
    t,
    w,
    u,
    f,
    x
  ]);
  const a = () => {
    n.update(() => {
      const c = _(g);
      A(c) && c.setShowCaption(!0);
    });
  }, o = (c, i) => {
    setTimeout(() => {
      X(!1);
    }, 200), n.update(() => {
      const p = _(g);
      A(p) && p.setWidthAndHeight(c, i);
    });
  }, Y = () => {
    X(!0);
  }, q = l && L(N) && !R, T = l || R;
  return /* @__PURE__ */ m.jsx(d.Suspense, { fallback: null, children: /* @__PURE__ */ m.jsxs(m.Fragment, { children: [
    /* @__PURE__ */ m.jsx("div", { draggable: q, children: I ? "Broken Image" : /* @__PURE__ */ m.jsx(
      de,
      {
        className: T ? `focused ${L(N) ? "draggable" : ""}` : null,
        src: h,
        altText: y,
        imageRef: v,
        width: C,
        height: S,
        maxWidth: E,
        onError: () => e(!0)
      }
    ) }),
    M && L(N) && T && /* @__PURE__ */ m.jsx(
      le,
      {
        showCaption: D,
        setShowCaption: a,
        editor: n,
        buttonRef: P,
        imageRef: v,
        maxWidth: E,
        onResizeStart: Y,
        onResizeEnd: o,
        captionsEnabled: !I && $
      }
    )
  ] }) });
}
export {
  O as RIGHT_CLICK_IMAGE_COMMAND,
  ge as default
};
