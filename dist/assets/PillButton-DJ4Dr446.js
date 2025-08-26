import{j as r,L as x}from"./index-BJL_EZoJ.js";const g=({to:e,href:o,onClick:c,children:l,variant:i="secondary",size:d="md",className:u="",disabled:s=!1,external:n=!1})=>{const v=`
    inline-flex items-center gap-3 rounded-full font-semibold 
    transition-all duration-300 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 
    disabled:cursor-not-allowed transform hover:scale-105
    group shadow-md hover:shadow-lg glass-button glass-interactive
    ${{sm:"px-3 py-1.5 text-xs",md:"px-4 py-2 text-sm",lg:"px-6 py-3 text-base"}[d]} ${u}
  `,m=()=>{switch(i){case"primary":return`
          text-white border-0 shadow-lg glass-bold
          bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-pink)] to-[var(--accent-orange)]
          hover:from-[var(--accent-pink)] hover:via-[var(--accent-red)] hover:to-[var(--accent-yellow)]
          focus:ring-[var(--primary-color)] backdrop-blur-sm
        `;case"secondary":return`
          text-[var(--text-primary)] border border-[var(--border-color)]/30
          hover:text-[var(--primary-color)] hover:border-[var(--primary-color)]/50
          focus:ring-[var(--primary-color)] backdrop-blur-md
        `;case"accent":return`
          text-[var(--success-color)] border border-[var(--success-color)]/40
          hover:bg-[var(--success-color)]/80 hover:text-white hover:border-[var(--success-color)]
          focus:ring-[var(--success-color)] backdrop-blur-md
        `;default:return""}},p=()=>r.jsx("span",{className:"transition-transform duration-200 group-hover:translate-x-1 ml-1 flex-shrink-0",children:"→"}),a=r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"relative",children:l}),(e||o)&&r.jsx(p,{})]}),t={className:`${v} ${m()}`,disabled:s};return e&&!s?r.jsx(x,{to:e,...t,children:a}):o&&!s?r.jsx("a",{href:o,...t,target:n?"_blank":void 0,rel:n?"noopener noreferrer":void 0,children:a}):r.jsx("button",{onClick:c,...t,children:a})};export{g as P};
