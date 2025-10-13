import{n as x,j as r,L as h}from"./index-DiK8qNwB.js";/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],f=x("arrow-right",g),j=({to:e,href:o,onClick:n,children:i,variant:l="secondary",size:d="md",className:u="",disabled:s=!1,external:c=!1})=>{const v=`
    inline-flex items-center gap-3 rounded-full font-semibold 
    transition-all duration-300 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed transform
    group shadow-md glass-button glass-interactive
    ${{sm:"px-3 py-1.5 text-xs",md:"px-4 py-2 text-sm",lg:"px-6 py-3 text-base"}[d]} ${u}
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
        `;default:return""}},m=()=>r.jsx("span",{className:"ml-1/2 flex-shrink-0",children:r.jsx(f,{size:16})}),a=r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"relative",children:i}),(e||o)&&r.jsx(m,{})]}),t={className:`${v} ${p()}`,disabled:s};return e&&!s?r.jsx(h,{to:e,...t,children:a}):o&&!s?r.jsx("a",{href:o,...t,target:c?"_blank":void 0,rel:c?"noopener noreferrer":void 0,children:a}):r.jsx("button",{onClick:n,...t,children:a})};export{j as P};
