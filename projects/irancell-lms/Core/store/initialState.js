const IRANCELL_SEED_NOW=new Date();
const IRANCELL_SEED_CLASS_START=new Date(IRANCELL_SEED_NOW.getTime()+10*60000).toISOString();
const IRANCELL_SEED_BULK_DATA=(()=>{
 const result={
  usersById:{},
  relationshipsById:{},
  providerVerification:{},
  conversationsById:{},
  problemsById:{},
  recommendationsByProblemId:{},
  catalogueById:{},
  contentIds:[],
  watchProgress:{},
  studentOneEnrollments:{},
  enrollmentsByUserId:{},
  requestsById:{},
  offersById:{},
  providersById:{},
  availability:{},
  consentDocumentsById:{},
  consentGatesBySessionId:{},
  paymentsById:{},
  escrowByOrderId:{},
  paymentInvoicesById:{},
  refundsById:{},
  sessionsById:{},
  roomsById:{},
  attendanceBySessionId:{},
  ratingsById:{},
  complaintsById:{},
  qualityScoresByProviderId:{},
  notificationsById:{},
  unreadCount:0,
  familyProfilesByParentId:{},
  familyWalletsByParentId:{},
  childProgressById:{},
  activeClassCountByChildId:{},
  controlsByChildId:{},
  securityByParentId:{},
  familyInvoicesById:{},
  familyPendingPaymentsById:{},
  familyNotificationsById:{},
  supportTicketsById:{},
  privacyRequestsById:{},
  auditEvents:[]
 };
 const subjects=['ریاضی','فیزیک','شیمی','زیست‌شناسی','زبان انگلیسی','علوم','فارسی','هندسه','آمار','برنامه‌نویسی'];
 const topics=['معادلات','نیرو و حرکت','ساختار اتم','سلول و ژنتیک','مکالمه و گرامر','انرژی','نگارش','اشکال هندسی','احتمال','تفکر الگوریتمی'];
 const grades=['پایه پنجم','پایه ششم','پایه هفتم','پایه هشتم','پایه نهم','پایه دهم','پایه یازدهم','پایه دوازدهم'];
 const firstNames=['آراد','رها','سارا','نیما','پارسا','یسنا','محمد','هلیا','امیرعلی','نازنین','کیان','مهسا','سام','ترانه','علی','آوا','بردیا','پرنیا','یاسین','غزل'];
 const lastNames=['احمدی','محمدی','رضایی','کریمی','حسینی','مرادی','شریفی','اکبری','جعفری','صادقی','کاظمی','موسوی','نوری','حیدری','عباسی','رحیمی','قاسمی','زمانی','یزدانی','سلطانی'];
 const requestStatuses=['published','offers_received','selected','cancelled'];
 const classStatuses=['scheduled','ready','active','completed'];
 const paymentStatuses=['pending','paid','failed','paid'];
 const consentStatuses=['pending','signed','signed','expired'];
 const complaintStatuses=['submitted','reviewing','provider_response','resolved'];
 const supportStatuses=['open','waiting_support','needs_student_reply','resolved'];
 result.enrollmentsByUserId['student-1']={};

 for(let index=1;index<=20;index+=1){
  const suffix=String(index).padStart(2,'0');
  const mobileSuffix=String(index).padStart(6,'0');
  const subject=subjects[(index-1)%subjects.length];
  const topic=topics[(index-1)%topics.length];
  const grade=grades[(index-1)%grades.length];
  const firstName=firstNames[index-1];
  const lastName=lastNames[index-1];
  const studentId=`student-mock-${suffix}`;
  const parentId=`parent-mock-${suffix}`;
  const teacherId=`teacher-mock-${suffix}`;
  const academyId=`academy-mock-${suffix}`;
  const contentProviderId=`content-provider-mock-${suffix}`;
  const adminId=`admin-mock-${suffix}`;
  const contentId=`content-mock-${suffix}`;
  const conversationId=`conversation-mock-${suffix}`;
  const problemId=`problem-mock-${suffix}`;
  const requestId=`request-mock-${suffix}`;
  const offerId=`offer-mock-${suffix}`;
  const classId=`class-mock-${suffix}`;
  const roomId=`room-mock-${suffix}`;
  const consentId=`consent-mock-${suffix}`;
  const orderId=`order-mock-${suffix}`;
  const ratingId=`rating-mock-${suffix}`;
  const complaintId=`complaint-mock-${suffix}`;
  const createdAt=new Date(IRANCELL_SEED_NOW.getTime()-index*3*3600000).toISOString();
  const updatedAt=new Date(IRANCELL_SEED_NOW.getTime()-index*2*3600000).toISOString();
  const startAt=new Date(IRANCELL_SEED_NOW.getTime()+(index-5)*6*3600000).toISOString();
  const preferredTime=new Date(IRANCELL_SEED_NOW.getTime()+(index+1)*8*3600000).toISOString();
  const providerId=index%2===0?academyId:teacherId;
  const providerRole=index%2===0?'academy':'teacher';
  const coursePrice=index%5===0?0:450000+index*55000;
  const progress=(index*17)%101;
  const paymentStatus=paymentStatuses[(index-1)%paymentStatuses.length];
  const classStatus=classStatuses[(index-1)%classStatuses.length];
  const consentStatus=consentStatuses[(index-1)%consentStatuses.length];

  result.usersById[studentId]={
   id:studentId,
   username:`student${suffix}`,
   name:`${firstName} ${lastName}`,
   firstName,
   lastName,
   mobile:`09131${mobileSuffix}`,
   email:`student${suffix}@fixture.ir`,
   roles:['student'],
   status:'active',
   age:10+(index%9),
   grade,
   credentialPassword:'123456',
   credentialConfigured:true,
   registrationSource:'fixture'
  };
  result.usersById[parentId]={
   id:parentId,
   username:`parent${suffix}`,
   name:`ولی ${firstName} ${lastName}`,
   firstName:`ولی ${firstName}`,
   lastName,
   mobile:`09132${mobileSuffix}`,
   email:`parent${suffix}@fixture.ir`,
   roles:['parent'],
   status:'active',
   credentialPassword:'123456',
   credentialConfigured:true,
   registrationSource:'fixture'
  };
  result.usersById[teacherId]={
   id:teacherId,
   username:`teacher${suffix}`,
   name:`استاد ${firstName} ${lastName}`,
   firstName,
   lastName,
   mobile:`09133${mobileSuffix}`,
   email:`teacher${suffix}@fixture.ir`,
   roles:['teacher'],
   status:'active',
   credentialPassword:'123456',
   credentialConfigured:true,
   registrationSource:'fixture',
   profileCompletion:70+(index%30),
   verificationStatus:index%7===0?'pending':'verified'
  };
  result.usersById[academyId]={
   id:academyId,
   username:`academy${suffix}`,
   name:`آکادمی ${subject} ${lastName}`,
   organizationName:`آکادمی ${subject} ${lastName}`,
   mobile:`09134${mobileSuffix}`,
   email:`academy${suffix}@fixture.ir`,
   roles:['academy'],
   status:'active',
   credentialPassword:'123456',
   credentialConfigured:true,
   registrationSource:'fixture'
  };
  result.usersById[contentProviderId]={
   id:contentProviderId,
   username:`content${suffix}`,
   name:`استودیو محتوای ${subject} ${suffix}`,
   organizationName:`استودیو محتوای ${subject} ${suffix}`,
   mobile:`09135${mobileSuffix}`,
   email:`content${suffix}@fixture.ir`,
   roles:['content-provider'],
   status:'active',
   credentialPassword:'123456',
   credentialConfigured:true,
   registrationSource:'fixture'
  };
  result.usersById[adminId]={
   id:adminId,
   username:`admin${suffix}`,
   name:`مدیر عملیات ${suffix}`,
   firstName:'مدیر',
   lastName:`عملیات ${suffix}`,
   mobile:`09136${mobileSuffix}`,
   email:`admin${suffix}@fixture.ir`,
   roles:['admin'],
   status:'active',
   credentialPassword:'123456',
   credentialConfigured:true,
   registrationSource:'fixture'
  };

  result.relationshipsById[`relationship-mock-${suffix}`]={
   id:`relationship-mock-${suffix}`,
   parentId,
   childId:studentId,
   status:'active',
   verifiedAt:createdAt
  };
  result.providerVerification[teacherId]={status:index%7===0?'pending':'verified',updatedAt};
  result.providerVerification[academyId]={status:index%8===0?'pending':'verified',updatedAt};

  result.providersById[teacherId]={
   id:teacherId,
   type:'teacher',
   name:`استاد ${firstName} ${lastName}`,
   subjects:[subject,subjects[index%subjects.length]],
   rating:Number((4.1+(index%9)/10).toFixed(1)),
   completedClasses:25+index*14,
   priceFrom:220000+index*12000,
   verificationStatus:index%7===0?'pending':'verified',
   profileCompletion:70+(index%30),
   settlementAmount:600000+index*175000,
   monthlyIncome:2500000+index*490000,
   experienceYears:2+(index%13),
   onTimeRate:85+(index%15),
   validComplaintRate:index%4,
   bio:`مدرس ${subject} با تمرکز بر ${topic} و حل مسئله.`,
   payoutRequests:[]
  };
  result.providersById[academyId]={
   id:academyId,
   type:'academy',
   name:`آکادمی ${subject} ${lastName}`,
   subjects:[subject,subjects[index%subjects.length],subjects[(index+1)%subjects.length]],
   rating:Number((4+(index%10)/10).toFixed(1)),
   completedClasses:100+index*41,
   priceFrom:200000+index*10000,
   verificationStatus:index%8===0?'pending':'verified',
   assignedTeacherName:`استاد ${firstName} ${lastName}`,
   bio:`آموزشگاه تخصصی ${subject} با پشتیبانی آموزشی و برنامه‌ریزی منظم.`
  };
  result.availability[teacherId]=[`امروز ${16+(index%5)}:۰۰`,`فردا ${15+(index%6)}:۳۰`];
  result.availability[academyId]=[`فردا ${14+(index%7)}:۰۰`,`پنجشنبه ${16+(index%5)}:۳۰`];

  result.catalogueById[contentId]={
   id:contentId,
   title:`${topic} در ${subject}؛ دوره کاربردی ${suffix}`,
   subject,
   grade,
   topic,
   duration:600+index*75,
   rating:Number((4+(index%10)/10).toFixed(1)),
   views:1800+index*1375,
   level:index%3===0?'پیشرفته':index%3===1?'مقدماتی':'متوسط',
   provider:`استودیو محتوای ${subject} ${suffix}`,
   providerId:contentProviderId,
   instructor:`استاد ${firstName} ${lastName}`,
   deliveryType:index%6===0?'live':'video',
   price:coursePrice,
   status:'published',
   description:`آموزش مرحله‌به‌مرحله ${topic} در درس ${subject} همراه با مثال، تمرین و ارزیابی.`
  };
  result.contentIds.push(contentId);
  result.watchProgress[contentId]=progress;
  result.studentOneEnrollments[contentId]={
   id:`student-1:${contentId}`,
   userId:'student-1',
   contentId,
   status:progress>=100?'completed':'active',
   deliveryType:index%6===0?'live':'video',
   priceAtEnrollment:coursePrice,
   enrolledAt:createdAt,
   updatedAt,
   ...(progress>=100?{completedAt:updatedAt}:{})
  };
  result.enrollmentsByUserId[studentId]={
   [contentId]:{
    id:`${studentId}:${contentId}`,
    userId:studentId,
    contentId,
    status:progress>=100?'completed':'active',
    deliveryType:index%6===0?'live':'video',
    priceAtEnrollment:coursePrice,
    enrolledAt:createdAt,
    updatedAt,
    ...(progress>=100?{completedAt:updatedAt}:{})
   }
  };

  result.conversationsById[conversationId]={
   id:conversationId,
   ownerId:'student-1',
   problemIds:[problemId],
   createdAt,
   updatedAt
  };
  result.problemsById[problemId]={
   id:problemId,
   ownerId:'student-1',
   conversationId,
   text:`${topic} در درس ${subject} را مرحله‌به‌مرحله توضیح بده.`,
   subject,
   grade,
   topic,
   intent:'learning_help',
   urgency:index%5===0?'فوری':'عادی',
   attachmentName:index%4===0?`تمرین-${suffix}.pdf`:'',
   status:'answered',
   createdAt,
   answeredAt:updatedAt
  };
  result.recommendationsByProblemId[problemId]={
   id:`recommendation-mock-${suffix}`,
   problemId,
   type:'content',
   confidence:Number((.75+(index%20)/100).toFixed(2)),
   answer:`برای یادگیری ${topic} ابتدا مفهوم پایه را مرور کن، سپس مثال حل‌شده را ببین و در پایان تمرین مشابه انجام بده.`,
   contentIds:[contentId],
   nextActions:['مشاهده محتوای مرتبط','حل تمرین','درخواست مدرس'],
   resolvedAt:updatedAt
  };

  result.requestsById[requestId]={
   id:requestId,
   ownerId:'student-1',
   studentId:'student-1',
   subject,
   grade,
   topic,
   preferredTime,
   budget:500000+index*45000,
   urgency:index%5===0?'فوری':'عادی',
   description:`برای یادگیری ${topic} و رفع اشکال درس ${subject} به مدرس نیاز دارم.`,
   status:requestStatuses[(index-1)%requestStatuses.length],
   createdAt
  };
  result.offersById[offerId]={
   id:offerId,
   requestId,
   providerId,
   providerRole,
   price:240000+index*18000,
   proposedTime:preferredTime,
   assignedTeacherName:`استاد ${firstName} ${lastName}`,
   status:index%6===0?'withdrawn':index%5===0?'selected':'active',
   createdAt:updatedAt
  };

  result.consentDocumentsById[consentId]={
   id:consentId,
   sessionId:classId,
   childId:'student-1',
   parentId:'parent-1',
   status:consentStatus,
   createdAt,
   expiresAt:new Date(IRANCELL_SEED_NOW.getTime()+(index+7)*86400000).toISOString(),
   documentText:`رضایت‌نامه حضور دانش‌آموز در کلاس ${subject} با موضوع ${topic}.`,
   ...(consentStatus==='signed'?{signedAt:updatedAt,signatureMethod:'fixture'}:{})
  };
  result.consentGatesBySessionId[classId]={
   sessionId:classId,
   status:consentStatus,
   parentId:'parent-1',
   childId:'student-1'
  };

  result.paymentsById[orderId]={
   id:orderId,
   orderId,
   sessionId:classId,
   providerId,
   amount:coursePrice||250000+index*12000,
   status:paymentStatus,
   createdAt,
   updatedAt
  };
  result.paymentInvoicesById[`invoice-mock-${suffix}`]={
   id:`invoice-mock-${suffix}`,
   orderId,
   ownerId:'parent-1',
   title:`صورتحساب کلاس ${subject} ${suffix}`,
   amount:coursePrice||250000+index*12000,
   status:paymentStatus==='paid'?'paid':'unpaid',
   createdAt
  };
  if(paymentStatus==='paid'){
   result.escrowByOrderId[orderId]={
    orderId,
    amount:coursePrice||250000+index*12000,
    status:classStatus==='completed'?'released':'held',
    heldAt:createdAt,
    ...(classStatus==='completed'?{releasedAt:updatedAt}:{})
   };
  }
  if(index%7===0){
   result.refundsById[`refund-mock-${suffix}`]={
    id:`refund-mock-${suffix}`,
    orderId,
    amount:Math.round((coursePrice||250000)*.5),
    status:index%14===0?'paid':'requested',
    reason:'لغو یا اختلال در برگزاری کلاس',
    createdAt
   };
  }

  result.sessionsById[classId]={
   id:classId,
   title:`کلاس ${subject}: ${topic}`,
   subjectLabel:`${subject} ${grade}`,
   providerDisplayName:providerRole==='academy'?`آکادمی ${subject} ${lastName}`:`استاد ${firstName} ${lastName}`,
   scheduleLabel:`${index%2?'فردا':'امروز'}، ساعت ${15+(index%6)}:${index%2?'۳۰':'۰۰'}`,
   studentId:'student-1',
   providerId,
   participantIds:['student-1',providerId],
   startAt,
   status:classStatus,
   requiresConsent:index%3!==0,
   isPaid:paymentStatus==='paid',
   orderId,
   consentDocumentId:consentId,
   roomId:classStatus==='active'||classStatus==='completed'?roomId:null,
   createdAt
  };
  result.roomsById[roomId]={
   id:roomId,
   sessionId:classId,
   providerId,
   status:classStatus==='completed'?'closed':classStatus==='active'?'open':'scheduled',
   createdAt
  };
  result.attendanceBySessionId[classId]={
   sessionId:classId,
   participants:{
    'student-1':{
     participantId:'student-1',
     joinedAt:classStatus==='scheduled'?null:updatedAt,
     status:classStatus==='scheduled'?'not_joined':'present'
    },
    [providerId]:{
     participantId:providerId,
     joinedAt:classStatus==='scheduled'?null:updatedAt,
     status:classStatus==='scheduled'?'not_joined':'present'
    }
   }
  };

  result.ratingsById[ratingId]={
   id:ratingId,
   sessionId:classId,
   providerId,
   studentId:'student-1',
   score:3+(index%3),
   comment:`تجربه کلاس ${subject} شماره ${suffix} مناسب بود.`,
   createdAt:updatedAt
  };
  result.complaintsById[complaintId]={
   id:complaintId,
   ownerId:index%2===0?'parent-1':'student-1',
   role:index%2===0?'parent':'student',
   sessionId:classId,
   orderId,
   providerId,
   category:index%3===0?'technical':index%3===1?'quality':'schedule',
   title:`بررسی کلاس ${subject} ${suffix}`,
   description:`درخواست بررسی جزئیات کلاس ${subject} و وضعیت ارائه خدمت.`,
   status:complaintStatuses[(index-1)%complaintStatuses.length],
   createdAt,
   updatedAt
  };
  result.qualityScoresByProviderId[providerId]=80+(index%20);

  const notificationId=`notification-mock-${suffix}`;
  const notificationRead=index%3===0;
  result.notificationsById[notificationId]={
   id:notificationId,
   ownerId:'student-1',
   title:index%4===0?'پاسخ جدید چیستی':index%4===1?'پیشنهاد جدید مدرس':index%4===2?'یادآوری کلاس':'ادامه دوره',
   body:`اعلان آزمایشی ${suffix} برای بررسی عملکرد فهرست، جزئیات و وضعیت خوانده‌شده.`,
   route:index%4===0?`student/chats?problem=${problemId}`:index%4===1?`student/offers?request=${requestId}`:index%4===2?`class/${classId}`:`student/binayi/course/${contentId}`,
   read:notificationRead,
   createdAt
  };
  if(!notificationRead)result.unreadCount+=1;

  result.familyProfilesByParentId[parentId]={
   nationalIdMasked:`${suffix}••••${String(5000+index).slice(-4)}`,
   email:`parent${suffix}@fixture.ir`,
   emergencyMobile:`09130${mobileSuffix}`,
   address:`تهران، خیابان نمونه، پلاک ${index}`,
   city:'تهران',
   province:'تهران',
   verified:true,
   secondaryGuardianName:`سرپرست دوم ${firstName} ${lastName}`
  };
  result.familyWalletsByParentId[parentId]={
   balance:500000+index*175000,
   lastTransactionAt:updatedAt
  };
  result.childProgressById[studentId]=progress;
  result.activeClassCountByChildId[studentId]=index%5;
  result.controlsByChildId[studentId]={
   onlineClass:true,
   recordedContent:index%6!==0,
   askTeacher:true,
   directPayment:index%4===0,
   parentApprovalForClass:index%2===0,
   parentApprovalForPanelExit:index%3!==0,
   dailyHours:1+(index%4),
   allowedFrom:`${14+(index%4)}:00`,
   allowedTo:`${19+(index%4)}:00`
  };
  result.securityByParentId[parentId]={
   passwordActive:true,
   pinActive:index%2===0,
   faceIdActive:index%3===0,
   fingerprintActive:index%2!==0,
   connectedDevices:1+(index%4),
   activeSessions:1+(index%2),
   lastLoginAt:updatedAt
  };
  result.familyInvoicesById[`family-invoice-mock-${suffix}`]={
   id:`family-invoice-mock-${suffix}`,
   parentId:'parent-1',
   childId:'student-1',
   title:`کلاس ${subject} شماره ${suffix}`,
   amount:coursePrice||260000+index*10000,
   status:index%4===0?'unpaid':'paid',
   createdAt
  };
  result.familyPendingPaymentsById[`family-payment-mock-${suffix}`]={
   id:`family-payment-mock-${suffix}`,
   parentId:'parent-1',
   childId:'student-1',
   title:`پرداخت خدمت آموزشی ${subject} ${suffix}`,
   amount:coursePrice||260000+index*10000,
   status:index%4===0?'failed':'pending',
   orderId,
   createdAt
  };
  result.familyNotificationsById[`family-notification-mock-${suffix}`]={
   id:`family-notification-mock-${suffix}`,
   parentId:'parent-1',
   category:index%5===0?'support':index%5===1?'class':index%5===2?'children':index%5===3?'payments':'consent',
   importance:index%6===0?'important':'normal',
   title:`اعلان خانواده ${suffix}`,
   body:`جزئیات آزمایشی مربوط به ${subject} و وضعیت آموزشی دانش‌آموز.`,
   actionLabel:index%3===0?'مشاهده جزئیات':'',
   route:index%2===0?'parent/children':'parent/classes',
   read:index%3===0,
   createdAt
  };

  result.supportTicketsById[`support-student-mock-${suffix}`]={
   id:`support-student-mock-${suffix}`,
   ownerId:'student-1',
   role:'student',
   subject:`پشتیبانی ${subject} ${suffix}`,
   message:`درخواست بررسی بخش ${topic} و عملکرد خدمت آموزشی.`,
   category:index%3===0?'class':index%3===1?'account':'content',
   relatedService:`خدمت ${subject}`,
   responseMethod:'app',
   classBlocking:index%8===0,
   status:supportStatuses[(index-1)%supportStatuses.length],
   unreadForStudent:index%4===0,
   messages:[{
    id:`support-student-message-mock-${suffix}`,
    author:index%2===0?'support':'student',
    text:`پیام آزمایشی پشتیبانی برای درخواست ${suffix}.`,
    createdAt:updatedAt
   }],
   createdAt,
   updatedAt
  };
  result.supportTicketsById[`support-parent-mock-${suffix}`]={
   id:`support-parent-mock-${suffix}`,
   ownerId:'parent-1',
   role:'parent',
   subject:`درخواست خانواده ${subject} ${suffix}`,
   message:`نیاز به بررسی وضعیت آموزشی و کلاس فرزند در بخش ${subject}.`,
   category:index%3===0?'class':index%3===1?'payment':'child',
   relatedService:`کلاس ${subject}`,
   childId:'student-1',
   responseMethod:'app',
   classBlocking:index%9===0,
   status:supportStatuses[index%supportStatuses.length],
   unreadForStudent:false,
   messages:[{
    id:`support-parent-message-mock-${suffix}`,
    author:'support',
    text:`پاسخ آزمایشی پشتیبانی خانواده برای درخواست ${suffix}.`,
    createdAt:updatedAt
   }],
   createdAt,
   updatedAt
  };

  result.privacyRequestsById[`privacy-request-mock-${suffix}`]={
   id:`privacy-request-mock-${suffix}`,
   ownerId:'student-1',
   type:index%3===0?'account_deletion':index%3===1?'data_export':'history_deletion',
   scope:index%3===2?'chisti_history':'account',
   status:index%4===0?'completed':index%4===1?'queued':index%4===2?'processing':'failed',
   createdAt,
   updatedAt,
   expiresAt:new Date(IRANCELL_SEED_NOW.getTime()+(index+3)*86400000).toISOString()
  };
  result.auditEvents.push({
   id:`audit-event-mock-${suffix}`,
   actorId:index%2===0?'admin-1':'student-1',
   action:index%5===0?'payment.reviewed':index%5===1?'content.opened':index%5===2?'class.updated':index%5===3?'support.created':'privacy.requested',
   entityType:index%2===0?'class':'content',
   entityId:index%2===0?classId:contentId,
   createdAt,
   traceId:`trace-mock-${suffix}`
  });
 }

 return Object.freeze(result);
})();
export const IRANCELL_INITIAL_STATE=Object.freeze({
 session:{token:null,currentUserId:null,candidateUserId:null,availableRoles:[],activeRole:null,status:'anonymous',mobile:null,pendingMobile:null,otpPurpose:null,requiresOnboarding:false},
 identity:{usersById:{
  'student-1':{id:'student-1',name:'آراد احمدی',mobile:'09120000001',roles:['student'],status:'active',age:13,grade:'پایه هفتم'},
  'parent-1':{id:'parent-1',name:'امیر احمدی',mobile:'09120000002',roles:['parent'],status:'active'},
  'teacher-1':{id:'teacher-1',name:'محمد رضایی',mobile:'09120000003',roles:['teacher'],status:'active'},
  'academy-1':{id:'academy-1',name:'آکادمی آینده روشن',mobile:'09120000004',roles:['academy'],status:'active'},
  'content-1':{id:'content-1',name:'استودیو آموزش نو',mobile:'09120000005',roles:['content-provider'],status:'active'},
  'admin-1':{id:'admin-1',name:'مدیر عملیات',mobile:'09120000006',roles:['admin'],status:'active'},
  'student-2':{id:'student-2',name:'رها محمدی',mobile:'09120000007',roles:['student'],status:'active',age:15,grade:'پایه نهم'},
  'parent-2':{id:'parent-2',name:'مریم محمدی',mobile:'09120000008',roles:['parent'],status:'active'},
  'teacher-2':{id:'teacher-2',name:'استاد علیرضا ناصری',mobile:'09120000009',roles:['teacher'],status:'active'},
  'academy-2':{id:'academy-2',name:'آکادمی ریاضی آرا',mobile:'09120000010',roles:['academy'],status:'active'},
  'student-3':{id:'student-3',name:'سارا احمدی',mobile:'09120000011',roles:['student'],status:'active',age:11,grade:'پایه پنجم'},
  'student-4':{id:'student-4',name:'نیما احمدی',mobile:'09120000012',roles:['student'],status:'active',age:16,grade:'پایه دهم'},
  'teacher-3':{id:'teacher-3',name:'مدرس جدید',mobile:'09120000013',roles:['teacher'],status:'active'},
  ...IRANCELL_SEED_BULK_DATA.usersById
 },relationshipsById:{
  'relationship-1':{id:'relationship-1',parentId:'parent-1',childId:'student-1',status:'active',verifiedAt:IRANCELL_SEED_NOW.toISOString()},
  'relationship-2':{id:'relationship-2',parentId:'parent-2',childId:'student-2',status:'active',verifiedAt:IRANCELL_SEED_NOW.toISOString()},
  'relationship-3':{id:'relationship-3',parentId:'parent-1',childId:'student-3',status:'active',verifiedAt:IRANCELL_SEED_NOW.toISOString()},
  'relationship-4':{id:'relationship-4',parentId:'parent-1',childId:'student-4',status:'active',verifiedAt:IRANCELL_SEED_NOW.toISOString()},
  ...IRANCELL_SEED_BULK_DATA.relationshipsById
 },permissions:{},providerVerification:{'teacher-1':{status:'verified'},'teacher-2':{status:'verified'},'teacher-3':{status:'pending'},'academy-1':{status:'verified'},'academy-2':{status:'verified'},...IRANCELL_SEED_BULK_DATA.providerVerification}},
 chisti:{conversationsById:{
  'conversation-demo-1':{id:'conversation-demo-1',ownerId:'student-1',problemIds:['problem-demo-1'],createdAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000).toISOString(),updatedAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.conversationsById
 },problemsById:{
  'problem-demo-1':{id:'problem-demo-1',ownerId:'student-1',text:'معادله درجه دوم را چطور مرحله‌به‌مرحله حل کنم؟',subject:'ریاضی',grade:'پایه هفتم',topic:'معادله درجه دوم',intent:'learning_help',urgency:'عادی',attachmentName:'',status:'answered',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000).toISOString(),answeredAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000+45000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.problemsById
 },recommendationsByProblemId:{
  'problem-demo-1':{id:'recommendation-demo-1',problemId:'problem-demo-1',type:'content',confidence:.94,answer:'برای حل معادله درجه دوم ابتدا آن را به فرم ax²+bx+c=0 تبدیل کن. سپس ضرایب a، b و c را مشخص کن، دلتا را از رابطه b²−4ac به‌دست بیاور و با توجه به علامت دلتا ریشه‌ها را محاسبه کن. برای بعضی سؤال‌ها تجزیه از فرمول دلتا سریع‌تر است.',contentIds:['content-math-1'],nextActions:['مشاهده ویدیوی مرتبط','تمرین مشابه','درخواست مدرس'],resolvedAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000+45000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.recommendationsByProblemId
 },activeConversationId:null,activeJob:null,lastCompletedProblemId:null,status:'ready',error:null},
 content:{catalogueById:{
  'content-math-1':{id:'content-math-1',title:'تابع درجه دوم در ۱۲ دقیقه',subject:'ریاضی',grade:'دهم',topic:'تابع درجه دوم',duration:720,rating:4.8,views:18500,level:'متوسط',provider:'استودیو آموزش نو',instructor:'دکتر مریم رضایی',deliveryType:'video',price:1200000,status:'published',description:'آموزش نمودار، رأس سهمی و حل نمونه سؤال.'},
  'content-physics-1':{id:'content-physics-1',title:'قانون دوم نیوتن با مثال',subject:'فیزیک',grade:'دهم',topic:'دینامیک',duration:960,rating:4.7,views:12100,level:'متوسط',provider:'آکادمی آینده روشن',instructor:'مهندس رضا شریفی',deliveryType:'video',price:980000,status:'published',description:'حل مرحله‌ای مسئله‌های نیرو و شتاب.'},
  'content-english-1':{id:'content-english-1',title:'زمان حال کامل بدون ابهام',subject:'زبان انگلیسی',grade:'یازدهم',topic:'Present Perfect',duration:840,rating:4.6,views:9400,level:'مقدماتی',provider:'استودیو آموزش نو',instructor:'استاد سارا احمدی',deliveryType:'video',price:760000,status:'published',description:'ساختار، کاربرد و تمرین کوتاه.'},
  ...IRANCELL_SEED_BULK_DATA.catalogueById
 },search:'',recommendations:['content-math-1','content-physics-1','content-english-1',...IRANCELL_SEED_BULK_DATA.contentIds],watchProgress:{'content-math-1':68,'content-physics-1':34,'content-english-1':100,...IRANCELL_SEED_BULK_DATA.watchProgress},ratings:{},enrollmentsByUserId:{
  'student-1':{
   'content-math-1':{id:'student-1:content-math-1',userId:'student-1',contentId:'content-math-1',status:'active',deliveryType:'video',enrolledAt:new Date(IRANCELL_SEED_NOW.getTime()-8*86400000).toISOString()},
   'content-physics-1':{id:'student-1:content-physics-1',userId:'student-1',contentId:'content-physics-1',status:'active',deliveryType:'video',enrolledAt:new Date(IRANCELL_SEED_NOW.getTime()-5*86400000).toISOString()},
   'content-english-1':{id:'student-1:content-english-1',userId:'student-1',contentId:'content-english-1',status:'completed',deliveryType:'video',enrolledAt:new Date(IRANCELL_SEED_NOW.getTime()-20*86400000).toISOString(),completedAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000).toISOString()},
   ...IRANCELL_SEED_BULK_DATA.studentOneEnrollments
  },
  ...IRANCELL_SEED_BULK_DATA.enrollmentsByUserId
 },selectedContentId:null,selectedView:'course',status:'ready'},
 marketplace:{requestsById:{
  'request-demo-1':{id:'request-demo-1',ownerId:'student-1',studentId:'student-1',subject:'ریاضی',grade:'هفتم',topic:'حل معادله دیفرانسیل درجه دوم',preferredTime:new Date(IRANCELL_SEED_NOW.getTime()+86400000).toISOString(),urgency:'عادی',description:'برای حل مرحله‌ای مسئله و رفع اشکال نیاز به مدرس دارم.',status:'offers_received',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-3*60*60000).toISOString()},
  'request-demo-2':{id:'request-demo-2',ownerId:'student-1',studentId:'student-1',subject:'شیمی',grade:'هفتم',topic:'رفع اشکال شیمی آلی - فصل ۲',preferredTime:new Date(IRANCELL_SEED_NOW.getTime()+2*86400000).toISOString(),urgency:'عادی',description:'برای مرور فصل دوم و حل تمرین به راهنمایی نیاز دارم.',status:'published',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-30*60*60000).toISOString()},
  'request-demo-3':{id:'request-demo-3',ownerId:'student-2',studentId:'student-2',subject:'فیزیک',grade:'نهم',topic:'نیرو و قوانین نیوتن',preferredTime:new Date(IRANCELL_SEED_NOW.getTime()+3*86400000).toISOString(),urgency:'فوری',description:'برای امتحان هفته آینده به مرور قوانین نیوتن و حل مسئله نیاز دارم.',status:'offers_received',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-70*60000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.requestsById
 },offersById:{
  'offer-demo-1':{id:'offer-demo-1',requestId:'request-demo-1',providerId:'teacher-1',providerRole:'teacher',price:310000,proposedTime:new Date(IRANCELL_SEED_NOW.getTime()+86400000).toISOString(),assignedTeacherName:'دکتر نازنین احمدی',status:'active',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-110*60000).toISOString()},
  'offer-demo-2':{id:'offer-demo-2',requestId:'request-demo-1',providerId:'academy-1',providerRole:'academy',price:275000,proposedTime:new Date(IRANCELL_SEED_NOW.getTime()+90000000).toISOString(),assignedTeacherName:'مهندس رضا شریفی',status:'active',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-95*60000).toISOString()},
  'offer-demo-3':{id:'offer-demo-3',requestId:'request-demo-1',providerId:'teacher-1',providerRole:'teacher',price:290000,proposedTime:new Date(IRANCELL_SEED_NOW.getTime()+93600000).toISOString(),assignedTeacherName:'استاد علیرضا ناصری',status:'active',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-80*60000).toISOString()},
  'offer-demo-4':{id:'offer-demo-4',requestId:'request-demo-3',providerId:'teacher-2',providerRole:'teacher',price:265000,proposedTime:new Date(IRANCELL_SEED_NOW.getTime()+3*86400000).toISOString(),assignedTeacherName:'استاد علیرضا ناصری',status:'active',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-45*60000).toISOString()},
  'offer-demo-5':{id:'offer-demo-5',requestId:'request-demo-3',providerId:'academy-2',providerRole:'academy',price:235000,proposedTime:new Date(IRANCELL_SEED_NOW.getTime()+3*86400000+3600000).toISOString(),assignedTeacherName:'مهندس پویا زمانی',status:'active',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-35*60000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.offersById
 },providersById:{
  'teacher-1':{id:'teacher-1',type:'teacher',name:'محمد رضایی',subjects:['ریاضی','فیزیک'],rating:4.8,completedClasses:47,priceFrom:280000,verificationStatus:'verified',profileCompletion:80,settlementAmount:3450000,monthlyIncome:8200000,experienceYears:9,onTimeRate:96,validComplaintRate:1,bio:'مدرس مستقل ریاضی و فیزیک با تمرکز بر حل مسئله، رفع اشکال و آمادگی آزمون.',payoutRequests:[]},
  'teacher-2':{id:'teacher-2',type:'teacher',name:'استاد علیرضا ناصری',subjects:['فیزیک','ریاضی','کنکور'],rating:4.8,completedClasses:418,priceFrom:250000,verificationStatus:'verified',profileCompletion:92,settlementAmount:4800000,monthlyIncome:11200000,experienceYears:11,onTimeRate:98,validComplaintRate:1,bio:'مدرس مستقل فیزیک و ریاضی با تمرکز بر حل مسئله و آمادگی آزمون.',payoutRequests:[]},
  'academy-1':{id:'academy-1',type:'academy',name:'آکادمی آینده روشن',subjects:['ریاضی','فیزیک','شیمی'],rating:4.7,completedClasses:1250,priceFrom:240000,verificationStatus:'verified',assignedTeacherName:'مهندس رضا شریفی',bio:'آموزشگاه دارای مجوز با تضمین جایگزینی مدرس.'},
  'academy-2':{id:'academy-2',type:'academy',name:'آکادمی ریاضی آرا',subjects:['ریاضی','فیزیک','کنکور'],rating:4.8,completedClasses:930,priceFrom:225000,verificationStatus:'verified',assignedTeacherName:'مهندس پویا زمانی',bio:'آموزشگاه تخصصی ریاضی و فیزیک با پشتیبانی خانواده و برنامه‌ریزی آموزشی.'},
  ...IRANCELL_SEED_BULK_DATA.providersById
 },availability:{'teacher-1':['امروز ۱۸:۳۰','فردا ۱۷:۰۰'],'teacher-2':['امروز ۱۹:۰۰','فردا ۱۶:۳۰'],'academy-1':['امروز ۲۰:۰۰','فردا ۱۹:۳۰'],'academy-2':['فردا ۱۵:۳۰','پنجشنبه ۱۸:۰۰'],...IRANCELL_SEED_BULK_DATA.availability},selectedOfferId:null},
 consent:{documentsById:{
  'consent-demo-1':{id:'consent-demo-1',sessionId:'class-demo-1',childId:'student-1',parentId:'parent-1',status:'pending',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-25*60000).toISOString(),expiresAt:new Date(IRANCELL_SEED_NOW.getTime()+7*86400000).toISOString(),documentText:'رضایت‌نامه حضور آراد احمدی در کلاس آنلاین ریاضی مهندسی با تأمین‌کننده تأییدشده.'},
  ...IRANCELL_SEED_BULK_DATA.consentDocumentsById
 },gatesBySessionId:{'class-demo-1':{sessionId:'class-demo-1',status:'pending',parentId:'parent-1',childId:'student-1'},...IRANCELL_SEED_BULK_DATA.consentGatesBySessionId}},
 payment:{paymentsById:{
  'order-demo-1':{id:'order-demo-1',orderId:'order-demo-1',sessionId:'class-demo-1',providerId:'academy-1',amount:275000,status:'pending',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-20*60000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.paymentsById
 },escrowByOrderId:{...IRANCELL_SEED_BULK_DATA.escrowByOrderId},invoicesById:{...IRANCELL_SEED_BULK_DATA.paymentInvoicesById},refundsById:{...IRANCELL_SEED_BULK_DATA.refundsById}},
 classroom:{sessionsById:{
  'class-demo-1':{id:'class-demo-1',title:'ریاضی مهندسی',subjectLabel:'ریاضی مهندسی',providerDisplayName:'آکادمی ریاضی آرا',scheduleLabel:'فردا، ساعت ۱۶:۰۰',studentId:'student-1',providerId:'academy-1',participantIds:['student-1','academy-1'],startAt:new Date(IRANCELL_SEED_NOW.getTime()+24*60*60000).toISOString(),status:'scheduled',requiresConsent:true,isPaid:true,orderId:'order-demo-1',consentDocumentId:'consent-demo-1',roomId:null},
  'class-demo-2':{id:'class-demo-2',title:'فیزیک کنکور (پیشرفته)',subjectLabel:'فیزیک کنکور (پیشرفته)',providerDisplayName:'استاد علیرضا ناصری',scheduleLabel:'شنبه، ساعت ۱۸:۳۰',studentId:'student-1',providerId:'teacher-1',participantIds:['student-1','teacher-1'],startAt:new Date(IRANCELL_SEED_NOW.getTime()+4*24*60*60000).toISOString(),status:'scheduled',requiresConsent:false,isPaid:false,orderId:null,consentDocumentId:null,roomId:null},
  'class-demo-3':{id:'class-demo-3',title:'قوانین نیوتن و حل مسئله',subjectLabel:'فیزیک پایه نهم',providerDisplayName:'استاد علیرضا ناصری',scheduleLabel:'فردا، ساعت ۱۷:۳۰',studentId:'student-2',providerId:'teacher-2',participantIds:['student-2','teacher-2'],startAt:new Date(IRANCELL_SEED_NOW.getTime()+28*60*60000).toISOString(),status:'scheduled',requiresConsent:false,isPaid:false,orderId:null,consentDocumentId:null,roomId:null},
  ...IRANCELL_SEED_BULK_DATA.sessionsById
 },roomsById:{...IRANCELL_SEED_BULK_DATA.roomsById},attendanceBySessionId:{...IRANCELL_SEED_BULK_DATA.attendanceBySessionId}},
 quality:{ratingsById:{...IRANCELL_SEED_BULK_DATA.ratingsById},complaintsById:{...IRANCELL_SEED_BULK_DATA.complaintsById},qualityScoresByProviderId:{'teacher-1':94,'teacher-2':92,'academy-1':89,'academy-2':93,...IRANCELL_SEED_BULK_DATA.qualityScoresByProviderId}},
 notifications:{itemsById:{
  'notification-1':{id:'notification-1',ownerId:'student-1',title:'خوش آمدید',body:'مسیر یادگیری خود را با پرسیدن یک سؤال شروع کنید.',route:'student/chisti',read:false,createdAt:IRANCELL_SEED_NOW.toISOString()},
  'notification-2':{id:'notification-2',ownerId:'student-1',title:'پیشنهادهای جدید برای درخواست ریاضی',body:'چند مدرس و آموزشگاه تأییدشده برای درخواست شما پیشنهاد ارسال کرده‌اند.',route:'student/offers?request=request-demo-1',read:false,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-18*60000).toISOString()},
  'notification-3':{id:'notification-3',ownerId:'student-1',title:'ادامه مسیر یادگیری',body:'ویدیوی تابع درجه دوم را از ۶۸٪ ادامه بده.',route:'student/binayi/course/content-math-1',read:true,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-5*3600000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.notificationsById
 },unreadCount:2+IRANCELL_SEED_BULK_DATA.unreadCount,deliveryState:'ready'},
 admin:{filters:{},queues:{providerReview:0,complaints:0,paymentUnknown:0},reports:{mau:128420,gmv:3680000000,chistiResolution:61.4,paidConversion:18.2,consentCompletion:92.8,classSuccess:97.1},systemHealth:{identity:'healthy',chisti:'healthy',content:'healthy',payment:'healthy',dialogi:'healthy',notifications:'degraded'}},
 settings:{demo:{enabled:true,showQuickProfiles:true,showGuidedExamples:true,offlineSimulation:false},appearance:{fontScale:'comfortable'}},
 family:{
  profilesByParentId:{
   'parent-1':{nationalIdMasked:'۰۰۱••••۶۷۸۹',email:'example@mail.com',emergencyMobile:'',address:'خیابان آزادی، کوچه گل‌ها',city:'تهران',province:'تهران',verified:true,secondaryGuardianName:'خانم احمدی'},
   'parent-2':{nationalIdMasked:'۰۰۲••••۴۳۲۱',email:'maryam@example.com',emergencyMobile:'',address:'خیابان ولیعصر',city:'تهران',province:'تهران',verified:true,secondaryGuardianName:'علی محمدی'},
   ...IRANCELL_SEED_BULK_DATA.familyProfilesByParentId
  },
  walletsByParentId:{
   'parent-1':{balance:2450000,lastTransactionAt:IRANCELL_SEED_NOW.toISOString()},
   'parent-2':{balance:980000,lastTransactionAt:new Date(IRANCELL_SEED_NOW.getTime()-86400000).toISOString()},
   ...IRANCELL_SEED_BULK_DATA.familyWalletsByParentId
  },
  childProgressById:{'student-1':75,'student-2':68,'student-3':60,'student-4':45,...IRANCELL_SEED_BULK_DATA.childProgressById},
  activeClassCountByChildId:{'student-1':2,'student-2':1,'student-3':1,'student-4':0,...IRANCELL_SEED_BULK_DATA.activeClassCountByChildId},
  controlsByChildId:{
   'student-1':{onlineClass:true,recordedContent:true,askTeacher:true,directPayment:false,parentApprovalForClass:true,parentApprovalForPanelExit:true,dailyHours:2,allowedFrom:'16:00',allowedTo:'20:00'},
   'student-2':{onlineClass:true,recordedContent:true,askTeacher:true,directPayment:false,parentApprovalForClass:true,parentApprovalForPanelExit:false,dailyHours:3,allowedFrom:'15:00',allowedTo:'21:00'},
   'student-3':{onlineClass:true,recordedContent:true,askTeacher:true,directPayment:false,parentApprovalForClass:true,parentApprovalForPanelExit:true,dailyHours:2,allowedFrom:'16:00',allowedTo:'20:00'},
   'student-4':{onlineClass:true,recordedContent:true,askTeacher:true,directPayment:false,parentApprovalForClass:false,parentApprovalForPanelExit:true,dailyHours:3,allowedFrom:'15:00',allowedTo:'21:00'},
   ...IRANCELL_SEED_BULK_DATA.controlsByChildId
  },
  securityByParentId:{
   'parent-1':{passwordActive:true,pinActive:true,faceIdActive:true,fingerprintActive:true,connectedDevices:2,activeSessions:1,lastLoginAt:IRANCELL_SEED_NOW.toISOString()},
   'parent-2':{passwordActive:true,pinActive:false,faceIdActive:false,fingerprintActive:true,connectedDevices:1,activeSessions:1,lastLoginAt:IRANCELL_SEED_NOW.toISOString()},
   ...IRANCELL_SEED_BULK_DATA.securityByParentId
  },
  invoicesById:{
   'family-invoice-1':{id:'family-invoice-1',parentId:'parent-1',title:'کلاس آنلاین ریاضی آراد',amount:180000,status:'paid',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000).toISOString()},
   'family-invoice-2':{id:'family-invoice-2',parentId:'parent-1',title:'بسته ویدیویی علوم سارا',amount:590000,status:'paid',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-5*86400000).toISOString()},
   ...IRANCELL_SEED_BULK_DATA.familyInvoicesById
  },
  pendingPaymentsById:{
   'family-payment-1':{id:'family-payment-1',parentId:'parent-1',childId:'student-1',title:'پرداخت کلاس خصوصی آراد',amount:450000,status:'pending',orderId:'order-demo-1',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-20*60000).toISOString()},
   ...IRANCELL_SEED_BULK_DATA.familyPendingPaymentsById
  },
  notificationItemsById:{
   'family-notification-1':{id:'family-notification-1',parentId:'parent-1',category:'class',importance:'normal',title:'یادآوری شروع کلاس',body:'کلاس ریاضی علی محمدی تا ۳۰ دقیقه دیگر شروع می‌شود.',actionLabel:'ورود به کلاس',route:'parent/classes',read:false,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-20*60000).toISOString()},
   'family-notification-2':{id:'family-notification-2',parentId:'parent-1',category:'children',importance:'action',title:'درخواست تأیید رزرو',body:'سارا احمدی برای رزرو کلاس علوم نیاز به تأیید شما دارد.',actionLabel:'بررسی درخواست',route:'parent/consents',read:false,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-2*3600000).toISOString()},
   'family-notification-3':{id:'family-notification-3',parentId:'parent-1',category:'security',importance:'important',title:'هشدار امنیتی حساب',body:'ورود جدیدی به حساب خانواده از یک دستگاه ناشناس شناسایی شد.',actionLabel:'بررسی امنیت حساب',route:'parent/profile/security',read:false,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-86400000).toISOString()},
   'family-notification-4':{id:'family-notification-4',parentId:'parent-1',category:'payments',importance:'normal',title:'پرداخت موفق',body:'پرداخت کلاس خصوصی زبان برای علی محمدی با موفقیت انجام شد.',actionLabel:'',route:'parent/payments',read:true,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-86400000-3*3600000).toISOString()},
   'family-notification-5':{id:'family-notification-5',parentId:'parent-1',category:'children',importance:'normal',title:'گزارش فعالیت فرزند',body:'گزارش هفتگی فعالیت آموزشی سارا احمدی آماده مشاهده است.',actionLabel:'مشاهده گزارش',route:'parent/reports',read:true,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-2*86400000).toISOString()},
   'family-notification-6':{id:'family-notification-6',parentId:'parent-1',category:'support',importance:'normal',title:'پاسخ پشتیبانی',body:'درخواست شما درباره مشکل ورود به کلاس پاسخ داده شد.',actionLabel:'مشاهده پاسخ',route:'parent/support/requests',read:true,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-3*86400000).toISOString()},
   'family-notification-7':{id:'family-notification-7',parentId:'parent-1',category:'consent',importance:'normal',title:'رضایت‌نامه امضا شد',body:'رضایت‌نامه کلاس آنلاین علی محمدی با موفقیت ثبت شد.',actionLabel:'',route:'parent/consents',read:true,createdAt:new Date(IRANCELL_SEED_NOW.getTime()-4*86400000).toISOString()},
   ...IRANCELL_SEED_BULK_DATA.familyNotificationsById
  }
 },
 support:{ticketsById:{
  'support-demo-1':{id:'support-demo-1',ownerId:'student-1',role:'student',subject:'ورود به کلاس آنلاین',message:'لینک کلاس برای من فعال نبود و نیاز به بررسی داشتم.',category:'class',relatedService:'کلاس ریاضی',responseMethod:'app',classBlocking:false,status:'resolved',unreadForStudent:false,messages:[{id:'support-message-demo-1',author:'support',text:'وضعیت رضایت و پرداخت بررسی شد. پس از تکمیل رضایت خانواده، لینک امن کلاس در بازه ورود فعال می‌شود.',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-3*3600000).toISOString()}],createdAt:new Date(IRANCELL_SEED_NOW.getTime()-5*3600000).toISOString(),updatedAt:new Date(IRANCELL_SEED_NOW.getTime()-3*3600000).toISOString()},
  'support-family-demo-1':{id:'support-family-demo-1',ownerId:'parent-1',role:'parent',subject:'مشکل ورود به کلاس',message:'نمی‌توانم وارد کلاس ریاضی شوم.',category:'class',relatedService:'کلاس ریاضی آراد',childId:'student-1',responseMethod:'app',classBlocking:true,status:'needs_student_reply',unreadForStudent:true,messages:[{id:'support-family-message-1',author:'support',text:'لطفاً بررسی کنید رضایت‌نامه کلاس و پرداخت مربوط به آراد تکمیل شده باشد.',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-80*60000).toISOString()}],createdAt:new Date(IRANCELL_SEED_NOW.getTime()-2*3600000).toISOString(),updatedAt:new Date(IRANCELL_SEED_NOW.getTime()-80*60000).toISOString()},
  'support-family-demo-2':{id:'support-family-demo-2',ownerId:'parent-1',role:'parent',subject:'بازیابی رمز حساب',message:'مشکل حساب کاربری خانواده برطرف شد.',category:'account',relatedService:'حساب خانواده',childId:'',responseMethod:'app',classBlocking:false,status:'resolved',unreadForStudent:false,messages:[{id:'support-family-message-2',author:'support',text:'مشکل حساب بررسی و رفع شد. اکنون می‌توانید وارد حساب شوید.',createdAt:new Date(IRANCELL_SEED_NOW.getTime()-3*86400000).toISOString()}],createdAt:new Date(IRANCELL_SEED_NOW.getTime()-4*86400000).toISOString(),updatedAt:new Date(IRANCELL_SEED_NOW.getTime()-3*86400000).toISOString()},
  ...IRANCELL_SEED_BULK_DATA.supportTicketsById
 }},
 privacy:{requestsById:{...IRANCELL_SEED_BULK_DATA.privacyRequestsById}},
 analytics:{eventQueue:[],consentFlags:{analytics:true},traceContext:{traceId:'trace-bootstrap'}},audit:{events:[...IRANCELL_SEED_BULK_DATA.auditEvents]},
 ui:{routeState:{route:'splash',params:{}},navigationHistory:[],modals:{},toasts:[],loading:{},fieldErrors:{},offline:false,parentGate:null}
});
if(typeof globalThis!=='undefined')globalThis.__IRANCELL_LMS_INITIAL_STATE__=IRANCELL_INITIAL_STATE;
