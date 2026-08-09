export function IrancellAuthLoginWithCredentials(username,password){return{type:'IRANCELL_AUTH_LOGIN_CREDENTIALS',username,password};}
export function IrancellAuthRequestOtp(mobile,purpose='login'){return{type:'IRANCELL_AUTH_REQUEST_OTP',mobile,purpose};}
export function IrancellAuthRegisterWithKisti(mobile){return{type:'IRANCELL_AUTH_REGISTER_KISTI',mobile};}
export function IrancellAuthCompleteRegistration(username,password){return{type:'IRANCELL_AUTH_COMPLETE_REGISTRATION',username,password};}
export function IrancellAuthVerifyOtp(otp){return{type:'IRANCELL_AUTH_VERIFY_OTP',otp};}
export function IrancellAuthSelectRole(role){return{type:'IRANCELL_AUTH_SELECT_ROLE',role};}
export function IrancellAuthLogout(){return{type:'IRANCELL_AUTH_LOGOUT'};}