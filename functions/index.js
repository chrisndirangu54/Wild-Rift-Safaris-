const{onCall,HttpsError}=require('firebase-functions/v2/https');const{initializeApp}=require('firebase-admin/app');initializeApp();
exports.planJourney=onCall({enforceAppCheck:true},async(req)=>{if(!req.auth)throw new HttpsError('unauthenticated','Sign in required.');const{interests=[],days=5,budget=''}=req.data||{};return{mode:'grounded-stub',message:'AI provider not configured. Use this callable as the secure server boundary for a grounded itinerary model.',request:{interests:Array.isArray(interests)?interests.slice(0,10):[],days:Math.min(30,Math.max(1,Number(days)||5)),budget:String(budget).slice(0,100)}}});
exports.createPaymentIntent=onCall({enforceAppCheck:true},async(req)=>{if(!req.auth)throw new HttpsError('unauthenticated','Sign in required.');throw new HttpsError('failed-precondition','No payment provider is configured. Never collect or store raw card details in Firestore.');});
const admin=require('./admin');const expedia=require('./expedia');exports.bootstrapAdmin=admin.bootstrapAdmin;exports.integrationStatus=admin.integrationStatus;exports.integrationCatalog=admin.integrationCatalog;exports.expediaLodgingAvailability=expedia.expediaLodgingAvailability;

const providers=require('./providers');exports.providerStatus=providers.providerStatus;exports.weatherContext=providers.weatherContext;exports.translateGuide=providers.translateGuide;exports.synthesizeGuide=providers.synthesizeGuide;exports.identifySpecies=providers.identifySpecies;

const contentEngine=require('./contentEngine');exports.contentSignals=contentEngine.contentSignals;exports.generateBlogDraft=contentEngine.generateBlogDraft;exports.pushDraftToStrapi=contentEngine.pushDraftToStrapi;

const flights=require('./flights');exports.searchFlights=flights.searchFlights;exports.refreshFlightOffer=flights.refreshFlightOffer;exports.flightBookingReadiness=flights.flightBookingReadiness;

const transfers=require('./transfers');exports.transferProviderStatus=transfers.transferProviderStatus;exports.quoteExternalTransfer=transfers.quoteExternalTransfer;

const expediaCars=require('./expediaCars');const expediaFlights=require('./expediaFlights');exports.searchExpediaCars=expediaCars.searchExpediaCars;exports.expediaFlightStatus=expediaFlights.expediaFlightStatus;exports.searchExpediaFlights=expediaFlights.searchExpediaFlights;

const telemetry=require('./telemetry');
exports.movebankPublicStudy=telemetry.movebankPublicStudy;
exports.telemetryProviders=telemetry.telemetryProviders;

const wildVision=require('./wildVision');
exports.analyzeWildlifeFrame=wildVision.analyzeWildlifeFrame;
exports.wildVisionStatus=wildVision.wildVisionStatus;

const quests=require('./quests');
exports.generateTripQuest=quests.generateTripQuest;
exports.questPolicy=quests.questPolicy;

const safety=require('./safety');
exports.wearableCapabilities=safety.wearableCapabilities;
exports.emergencyEscalationStatus=safety.emergencyEscalationStatus;
exports.createEmergencyRequest=safety.createEmergencyRequest;

const storyStudio=require('./storyStudio');
exports.storyAiStatus=storyStudio.storyAiStatus;
exports.storyAiDraft=storyStudio.storyAiDraft;

const progression=require('./progression');
exports.getExplorerProgress=progression.getExplorerProgress;
exports.awardExplorerXP=progression.awardExplorerXP;
exports.xpPolicy=progression.xpPolicy;

const livingAfrica=require('./livingAfrica');
exports.recordWildlifeEvent=livingAfrica.recordWildlifeEvent;
exports.reviewWildlifeEvent=livingAfrica.reviewWildlifeEvent;
exports.africaRightNow=livingAfrica.africaRightNow;
exports.registerCameraSource=livingAfrica.registerCameraSource;

const automation=require('./automation');
exports.sampleWildlifeSources=automation.sampleWildlifeSources;
exports.buildDynamicQuests=automation.buildDynamicQuests;
exports.evaluateAchievements=automation.evaluateAchievements;

const twinGraph=require('./twinGraph');
exports.twinDestination=twinGraph.twinDestination;
exports.twinPlan=twinGraph.twinPlan;
exports.twinContext=twinGraph.twinContext;

const graphIngestion=require('./graphIngestion');
exports.ingestGraphNode=graphIngestion.ingestGraphNode;
exports.ingestGraphEdge=graphIngestion.ingestGraphEdge;
exports.reviewGraphRecord=graphIngestion.reviewGraphRecord;
exports.graphIngestionSchema=graphIngestion.graphIngestionSchema;

const graphConnectors=require('./graphConnectors');
exports.ingestGeoJSON=graphConnectors.ingestGeoJSON;
exports.ingest3DAsset=graphConnectors.ingest3DAsset;
exports.ingestPartnerInventory=graphConnectors.ingestPartnerInventory;
exports.ingestGuideApplication=graphConnectors.ingestGuideApplication;
exports.ingestDocumentCandidates=graphConnectors.ingestDocumentCandidates;
exports.reviewGraphCandidate=graphConnectors.reviewGraphCandidate;
const connectorAutomation=require('./connectorAutomation');
exports.syncVerifiedGuides=connectorAutomation.syncVerifiedGuides;
exports.processGraphIngestionJobs=connectorAutomation.processGraphIngestionJobs;
