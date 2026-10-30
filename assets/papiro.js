document.addEventListener('DOMContentLoaded',()=>{
  const article=document.getElementById('article-scroll');
  const sidebar=document.getElementById('sidebar-scroll');
  const bar=document.getElementById('context-bar');
  const thumb=document.getElementById('context-thumb');
  let active=null,hideTimer=null;

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    const href=a.getAttribute('href'); if(!href||href==='#')return;
    a.addEventListener('click',e=>{
      const target=document.querySelector(href);
      if(target&&article.contains(target)){
        e.preventDefault(); if (window.matchMedia('(max-width:1030px)').matches) target.scrollIntoView({behavior:'smooth',block:'start'});
        else article.scrollTo({top:articlePosition(target)-18,behavior:'smooth'});
      }
    });
  });

  function updateBar(){
    if(!active)return;
    const visible=active.clientHeight,total=active.scrollHeight;
    if(total<=visible){bar.classList.remove('visible');return}
    const track=bar.clientHeight,th=Math.max(34,track*Math.max(.07,visible/total));
    const progress=(active.scrollTop/(total-visible))||0;
    thumb.style.height=th+'px'; thumb.style.transform=`translateY(${(track-th)*progress}px)`;
  }
  function setActive(p){active=p;bar.classList.add('visible');updateBar();clearTimeout(hideTimer)}
  function maybeHide(){clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(!article.matches(':hover')&&!sidebar.matches(':hover'))bar.classList.remove('visible')},120)}
  [article,sidebar].forEach(p=>{p.addEventListener('mouseenter',()=>setActive(p));p.addEventListener('mousemove',()=>setActive(p),{passive:true});p.addEventListener('mouseleave',maybeHide);p.addEventListener('scroll',updateBar,{passive:true})});

  const links=[...sidebar.querySelectorAll('a[href^="#"]')];

  // El índice está agrupado por tipo (Contenido, Figuras, Tablas), pero la
  // selección activa debe seguir el orden REAL del documento. Si se itera
  // en el orden del sidebar, una figura previa puede quedar activa incluso
  // después de entrar en la sección siguiente.
  function articlePosition(el){
    const articleRect=article.getBoundingClientRect();
    const rect=el.getBoundingClientRect();
    return rect.top-articleRect.top+article.scrollTop;
  }

  function navigationEntries(){
    return links
      .map(link=>{
        const target=document.querySelector(link.getAttribute('href'));
        return target?{link,target,position:articlePosition(target)}:null;
      })
      .filter(Boolean)
      .sort((a,b)=>a.position-b.position);
  }

  function activeSection(){
    const y=article.scrollTop+120;
    const entries=navigationEntries();
    let current=entries.length?entries[0]:null;
    for(const entry of entries){
      if(entry.position<=y) current=entry;
      else break;
    }
    links.forEach(a=>a.classList.remove('active'));
    if(current) current.link.classList.add('active');
  }
  article.addEventListener('scroll',activeSection,{passive:true});
  window.addEventListener('resize',activeSection,{passive:true});
  activeSection();
});
