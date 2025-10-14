import{g as m,j as r,L as g}from"./index-BiXXeQ0D.js";/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],f=m("arrow-right",h),j=({to:e,href:o,onClick:c,children:i,variant:l="secondary",size:u="md",className:d="",disabled:s=!1,external:n=!1})=>{const v=`
    inline-flex items-center gap-3 rounded-full font-semibold 
    transition-all duration-300 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed transform
    group glass-button glass-interactive
    ${{sm:"px-3 py-1.5 text-xs",md:"px-4 py-2 text-sm",lg:"px-6 py-3 text-base"}[u]} ${d}
  `,p=()=>{switch(l){case"primary":return`
          text-white border-0 shadow-lg glass-bold
          bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-pink)] to-[var(--accent-orange)]
          hover:from-[var(--accent-pink)] hover:via-[var(--accent-red)] hover:to-[var(--accent-yellow)]
          focus:ring-[var(--primary-color)]
        `;case"secondary":return`
          text-[var(--text-primary)] border border-[var(--border-color)]/30
          hover:text-[var(--primary-color)] hover:border-[var(--primary-color)]/50
          focus:ring-[var(--primary-color)]
        `;case"accent":return`
          text-[var(--success-color)] border border-[var(--success-color)]/40
          hover:bg-[var(--success-color)]/80 hover:text-white hover:border-[var(--success-color)]
          focus:ring-[var(--success-color)]
        `;default:return""}},x=()=>r.jsx("span",{className:"transition-all duration-200 group-hover:translate-x-1/12 ml-1/2 flex-shrink-0",children:r.jsx(f,{size:16})}),t=r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"relative",children:i}),(e||o)&&r.jsx(x,{})]}),a={className:`${v} ${p()}`,disabled:s};return e&&!s?r.jsx(g,{to:e,...a,children:t}):o&&!s?r.jsx("a",{href:o,...a,target:n?"_blank":void 0,rel:n?"noopener noreferrer":void 0,children:t}):r.jsx("button",{onClick:c,...a,children:t})};export{j as P};
