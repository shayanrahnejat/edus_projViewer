// Vazirmatn is owned by the mounted application runtime. Keep one guarded icon-font request here.
(function IrancellBootLoadMaterialSymbols(){
 if(typeof loadCss!=='function')return;
 const href='https://edus.ir/assets/fonts/GoogleMaterial/Material-Symbols-Outlined.css';
 if(typeof document!=='undefined'&&document.head?.querySelector(`link[href="${href}"]`))return;
 loadCss(href);
})();

if(typeof window!=='undefined'){
 window.ClientAppConfig=window.ClientAppConfig||{};
 window.ClientAppConfig.APP_RAYA_SERVICE_ID='irancell-lms';
}
loadCss('https://edus.ir/assets/fonts/GoogleMaterial/Material-Symbols-Outlined.css');

export const IRANCELL_BOOT_CONFIG=Object.freeze({defaultRoute:'splash',hashPrefix:'#/',language:'fa',direction:'rtl',safeUnknownRoutes:true,analyticsEnabled:true,prototypeCatalogueEnabled:Boolean(typeof window!=='undefined'&&window.ClientAppConfig?.IRANCELL_ENABLE_PROTOTYPE_CATALOG===true),serviceId:'irancell-lms'});

