if(typeof loadCss==='function')loadCss('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap');
if(typeof loadCss==='function')loadCss('https://edus.ir/assets/fonts/GoogleMaterial/Material-Symbols-Outlined.css');

if(typeof window!=='undefined'){
 window.ClientAppConfig=window.ClientAppConfig||{};
 window.ClientAppConfig.APP_RAYA_SERVICE_ID='irancell-lms';
}
export const IRANCELL_BOOT_CONFIG=Object.freeze({defaultRoute:'splash',hashPrefix:'#/',language:'fa',direction:'rtl',safeUnknownRoutes:true,analyticsEnabled:true,prototypeCatalogueEnabled:Boolean(typeof window!=='undefined'&&window.ClientAppConfig?.IRANCELL_ENABLE_PROTOTYPE_CATALOG===true),serviceId:'irancell-lms'});
