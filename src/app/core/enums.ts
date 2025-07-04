
export enum DocMetaStatus {
    Live = 'live', // All documents are Live by default
    Delete = 'delete', // This is for Recursive delete to be done via cloud function
    Suspend = 'suspend'
}

export enum UserGender {
    Male = 'male',
    Female = 'female',
    NotAnswered = ''
}

export enum UserPronoun {
    She = 'She / Her',
    He = 'He / Him',
    Other = 'They / Them',
    // Ze = 'Ze / Zir',
    // Ey = 'Ey / Em',
    // NotToSay = 'Prefer not to say'
}

export enum PermissionLevel {
    PrimaryParent = 'primary-parent',
    Parent = 'parent',
    HealthProfessional = 'health-professional',
    Basic = 'basic'
}

export enum Labeling {
    'primary-parent' = 'Primary Parent',
    'parent' = 'Parent',
    'health-professional' = 'Health Professional',
    'basic' = 'Basic',
}

export enum LabelingTrn {
    'primary-parent' = 'app.apps/pet-parent.copy.xo6WHxHusAAPBhOTBVNn',
    'parent' = 'app.apps/pet-parent.copy.oNrSkBrP33P8OAvcZOKX',
    'health-professional' = 'app.apps/pet-parent.copy.lGWUVmHe2aTBqsjqOzum',
    'basic' = 'app.apps/pet-parent.copy.kqyu2DQuBSHPF6vfzP6M',
}

export enum ObservationMedium {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    Video = 'video'
}

export enum ScanStatus {
    Pending = 'Pending',
    Uploaded = 'Uploaded',
    Extracted = 'Extracted',
    TypeDetected = 'TypeDetected',
    AIAnalysed = 'AIAnalysed',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    ExtractFailed = 'ExtractFailed',
    DetectionFailed = 'DetectionFailed',
    AIAnalyseFailed = 'AIAnalyseFailed',
    Failed = 'Failed'
}

export enum PlaylistItemStatus {
    Locked = 'locked',
    Pending = 'pending',
    Process = 'process',
    Processing = 'processing',
    Available = 'available',
    PendingAudio = 'pending-audio',
    Playable = 'playable',
    Resume = 'resume',
    Completed = 'completed',
    Error = 'error'
}
export enum MaleSterilization {
    NotSterilized = 'Not Sterilized',
    Neutered = 'Neutered',
    NotSure = 'Not Sure'
}

export enum FemaleSterilization {
    NotSterilized = 'Not Sterilized',
    Speyed = 'Speyed',
    NotSure = 'Not Sure'
}

export enum Notification {
    None = 'none',
    App = 'app',
    Email = 'email',
    Both = 'both'
}

export enum NotificationType {
    NewEmail = 'new_email',
    NewEpisode = 'new_episode',
    NewSummary = 'new_summary',
    WeightSchedule = 'weight_schedule',
    InboxImported = 'inbox_imported',
    VetVideoCall = 'vet_video_call',
    Medication = 'medication',
    Supplement = 'supplement',
    Meal = 'meal',
    Food = 'food',
    Treat = 'treat',
    InsuranceRejected = 'insurance_rejected',
}

export enum HealthRecordStatus {
    Closed = 'closed',
    InProgress = 'in-progress',
    Open = 'open',
    Cancelled = 'cancelled',
    Analysed = 'analysed',
}

export enum RemoteConfigs {
    OfferDocRef = 'offer_doc_ref',
    FeatureSOS = 'feature_sos',
    FeatureBilling = 'feature_billing',
    FeatureVoiceObservation = 'feature_voice_observation',
    FeatureFaces = 'feature_feces',
    FeatureVideoObservation = 'feature_video_observation',
    FeatureDiet = 'feature_diet',
    FeatureHeatCycle = 'feature_heat_cycle',
    FeatureTravel = 'feature_travel'
}

export enum FAEvents {

    FirstOpen = 'first_open', // Triggered when a user launches the app for the first time after installation.
    SessionStart = 'session_start', // Logged when a user engages with the app, marking the beginning of a session.
    UserEngagement = 'user_engagement', // Captured periodically as users interact with the app.
    Login = 'login', // When a user logs in to the app.
    Method = 'method', // The method used for login (e.g., "email", "Google", "Phone", "Apple")
    SignUp = 'sign_up', // When a user creates a new account.
    AnimalId = 'animal_id', // The ID of the animal
    UserId = 'user_id', // The ID of the user
    AppLaunched = 'app_launched',
    OnboardingCompliance = 'onboarding_compliance',
    OnboardingPayment = 'onboarding_payment',
    OnboardingPetMedicals = 'onboarding_pet_medicals',
    OnboardingPetPassport = 'onboarding_pet_passport',
    OnboardingPetPhoto = 'onboarding_pet_photo',
    OnboardingPetProfile = 'onboarding_pet_profile',
    OnboardingPlan = 'onboarding_plan',
    OnboardingPushNotifications = 'onboarding_push_notifications',
    OnboardingTerms = 'onboarding_terms',
    OnboardingWelcome = 'onboarding_welcome',
    LoggedIn = 'logged_in',
    SwitchedPet = 'switched_pet',
    UserDetailsUpdated = 'user_details_updated',
    PaymentMethodAdded = 'payment_method_added',
    LanguageChanged = 'language_changed',
    AppReloaded = 'app_reloaded',
    LoggedOut = 'logged_out',
    HealthRecordClosed = 'health_record_closed',
    PlaylistOpened = 'playlist_opened',
    PlaylistPlayed = 'playlist_played',
    PlaylistClosed = 'playlist_closed',
    PetDetailsUpdated = 'pet_details_updated',
    PassportScanned = 'passport_scanned',
    HealthRecordAdded = 'health_record_added', // not implememted
    ObservationAudioRecorded = 'audio_recorded',
    LocationAdded = 'location_added',
    OpenedPage = 'opened_page',
    SendFeedback = 'send_feedback'
}

export enum InboxMessageStatus {
    Pending = 'pending',
    Analyzing = 'analyzing',
    New = 'new',
    Import = 'import',
    Importing = 'importing',
    Imported = 'imported',
    Failed = 'failed',
    Retry = 'retry',
    Spam = 'spam',
    Read = 'read'
}

export enum Calendar {
    Gregorian = 'Gregorian',
    Japanese = 'Japanese',
    Buddhist = 'Buddhist'
}

export enum Temperature {
    'Celsius (°C)' = '°C',
    'Fahrenheit (°F)' = '°F'
}

export enum MeasurementSystem {
    Metric = 'Metric',
    US = 'US',
    UK = 'UK'
}

export enum DaysofWeek {
    'Monday' = '1',
    'Tuesday' = '2',
    'Wednesday' = '3',
    'Thursday' = '4',
    'Friday' = '5',
    'Saturday' = '6',
    'Sunday' = '7'
}

export enum DateFormat {
    'dd/MM/yyyy G' = 'dd/MM/yyyy G',
    'dd/M/yy' = 'dd/M/yy',
    'M/dd/yy' = 'M/dd/yy',
    'dd/MM/yyyy' = 'dd/MM/yyyy',
    'dd.MM.yyyy' = 'dd.MM.yyyy',
    'dd-MM-yyyy' = 'dd-MM-yyyy',
    'yyyy/M/dd' = 'yyyy/M/dd',
    'yyyy.MM.dd' = 'yyyy.MM.dd',
    'yyyy-MM-dd' = 'yyyy-MM-dd',
}

export enum TimeFormat {
    '12-hours' = 'hh:mm a',
    '24-hours' = 'HH:mm'
}

export enum NumberFormat {
    '12,34,567.89' = '12,34,567.89',
    '12.34.567,89' = '12.34.567,89',
    '12 34 567.89' = '12 34 567.89',
    '12 34 567,89' = '12 34 567,89'
}

export enum TaskStatus {
    Completed = 'completed',
    Pending = 'pending',
    InProgress = 'in-progress'
}

export enum Application {
    Pro = 'PetParentPro',
    Admin = 'PetParentTeam',
    App = 'PetParentApp'
}

export enum ChecklistItemTypeTitlePolicy {
    Required = 'required',
    Locked = 'locked'
}

export enum ChecklistItemTypeDescriptionPolicy {
    Required = 'required',
    Optional = 'optional',
    Locked = 'locked'
}

export enum DogBreedStandards {
    FCI = 'fci',
    AKC = 'akc',
    UKC = 'ukc',
    CKC = 'ckc',
    RSCE = 'rsce',
    KC = 'kc',
}

export enum MessagingStatus {
    Sent = 'sent',
    Failed = 'failed',
    Delivered = 'delivered',
    Undelivered = 'undelivered',
    Queued = 'queued'
}

export enum InsuranceStatus {
    Active = 'active',
    Cancelled = 'cancelled',
    Expired = 'expired',
    InComplete = 'in-complete',
    Pending = 'pending',
    Registered = 'registered',
    Rejected = 'rejected',
    Submitted = 'submitted',
}

export enum InsuranceStatusTrn {
    'active' = 'app.apps/pet-parent.copy.s7fNtrGXogHl7UgfJg0F',
    'cancelled' = 'app.apps/pet-parent.copy.RM4qSAss0PKUUz45VTpy',
    'expired' = 'app.apps/pet-parent.copy.ZLunOoZoBP3AGV8jTjvx',
    'in-complete' = 'app.apps/pet-parent.copy.PIq7wB9A2tr1Ur01ce56',
    'pending' = 'app.apps/pet-parent.copy.fJUocdI4qRH9AX6ir7ir',
    'registered' = 'app.apps/pet-parent.copy.qdvuWjt5Q8tsUxNb9dub',
    'rejected' = 'app.apps/pet-parent.copy.XlXjN6HaYo7wR7s92NXG',
    'submitted' = 'app.apps/pet-parent.copy.ei79pnOms3fRUE3H04ui',
}

export enum nutrients {
    'calories' = 'app.apps/pet-parent/pages/app-nutrition-details.copy.XPy2FOHv2wt69ACGpgU1',
    'carbs' = 'app.apps/pet-parent/pages/app-nutrition-details.copy.C9VKIP4iZbGd9eedJMg1',
    'protein' = 'app.apps/pet-parent/pages/app-nutrition-details.copy.bxOb3tg723kFCvnwjZxo',
    'fat' = 'app.apps/pet-parent/pages/app-nutrition-details.copy.HqCnD5XM7cNpY7oRp9f9'
}

export enum carbs {
    'carbs' = 'app.apps/pet-parent/pages/app-nutrition-details.copy.C9VKIP4iZbGd9eedJMg1',
    'fiber' = 'app.apps/pet-parent.copy.euFAHw21cKLVL1sbcDRh',
    'sugar' = 'app.apps/pet-parent.copy.bxwnocuonZh0bo5AoeTO',
}

export enum fat {
    'fat' = 'app.apps/pet-parent.copy.NvMrWmzlgHrd5tHmQNgT',
    'saturated' = 'app.apps/pet-parent.copy.YyOZBoBO1IUIK5znmS5q',
    'unsaturated' = 'app.apps/pet-parent.copy.Nf9sv0go7hslKdnTTA0I'
}

export enum minerals {
    'calcium' = 'app.apps/pet-parent.copy.BVFP4sdtXspxGq9X8Rnn',
    'cholesterol' = 'app.apps/pet-parent.copy.AelDRjR582zbdax5ZhHD',
    'iron' = 'app.apps/pet-parent.copy.x1ma0BgUcI2XT02kDtQ1',
    'potassium' = 'app.apps/pet-parent.copy.DYFDRBsA91G6jFPpcMly',
    'sodium' = 'app.apps/pet-parent.copy.k9fRSxnhZFjCjAgsTcwz'
}

export enum ChecklistStatus {
    'active' = 'Active',
    'pending' = 'Pending',
    'skipped' = 'Skipped',
    'unavailable' = 'Unavailable'
}

export enum GoogleMapRequestType {
    'GetDetails' = 'getDetails',
    'TextSearch' = 'textSearch',
    'FindPlaceFromQuery' = 'findPlaceFromQuery',
    'Route' = 'route',
    'NearbySearch' = 'nearbySearch',
    'GeocoderRequest' = 'geocoderRequest'
}

export enum MemberStatus {
    Initiated = 'initiated',
    Completed = 'completed',
    Expired = 'expired',
}

export enum TagsBatchStatus {
    Pending = 'pending',
    Ordered = 'ordered',
    Available = 'available',
    Activated = 'activated',
    Shipped = 'shipped'
}

export enum LocationStatus {
    Pending = 'pending',
    Crawled = 'crawled',
    Managed = 'managed'
}


export enum SendGridTemplate {
    InvitePro = 'd-d4c1360989854e5a8e81a2ca27e22065',
    ReleaseNotes = 'd-1ed1b8aca38b4736a77098781254da14',
    CareTeamInvite = 'd-0830c91fd00a432aa53dbb1700216eaa',
    CareTeamInviteWithoutProfile = 'd-2a652cc2decf4c8abfaa1090f2bd380a',
}

export enum LiveUpdateMode {
    Prompt = "prompt",// we have to prompt user to update (default)
    Force = "force"
}
export enum LiveUpdateStatus {
    Published = "published",
    Draft = "draft"
}

export enum ActivationCodeStatus {
    Pending = 'pending',
    Redeemed = 'redeemed',
}

export enum SubscriptionStatus {
    Active = 'active',
    InActive = 'in-active'
}

export enum SubscriptionPlatorm {
    Ios = 'ios',
    Android = 'android',
    Web = 'web',
    Pos = 'pos'
}

export enum SubscriptionSource {
    InAppPurchaseAndroid = 'in-app-purchase-android',
    InAppPurchaseIos = 'in-app-purchase-ios',
    Stripe = 'stripe',
    ActivationCode = 'activation-code'
}

export enum ProfessionalRole {
    Developer = 'developer',
    Admin = 'admin',
    Manager = 'manager',
    HealthAdmin = 'health-admin',
    HealthProfessional = 'health-professional',
    Behaviorist = 'behaviorist',
    Support = 'support'
}


export enum SCAN_STATUS {
    PROCESS = 'Process',
    EXTRACTED = 'Extracted',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    TYPE_DETECTED = 'TypeDetected',
    TYPE_DETECTION_FAILED = 'TypeDetectionFailed',
    TYPE_DETECTION_ERROR = 'TypeDetectionError',
    AI_ANALYSED = 'AIAnalysed',
    AI_ANALYSE_FAILED = 'AIAnalyseFailed',
    ERROR = 'Error',
    FEATURE_NOT_AVAILABLE_ERROR = 'FeatureNotAvailableError',
    BRAND_OR_NAME_NOT_DETECTED_ERROR = 'BrandOrNameNotDetectedError',
    INTAKE_ITEM_DOES_NOT_EXISTS_ERROR = 'IntakeItemDoesNotExistError',
}

export enum SCAN_STATUS_DESC {
    // Processing
    PROCESS = 'Processing...',
    TYPE_DETECTING = 'Detecting content type...',
    AI_ANALYSING = 'Analyzing with AI...',

    // Successful completions
    EXTRACTED = 'Text extracted.',
    COMPLETED = 'Analysis completed.',
    TYPE_DETECTED = 'Content type detected.',
    AI_ANALYSED = 'AI analysis completed.',

    // Failures
    CANCELLED = 'Analysis canceled.',
    FAILED = 'Analysis failed.',
    TYPE_DETECTION_FAILED = 'Failed to detect content type.',
    TYPE_DETECTION_ERROR = 'Scanned document type not matched.',
    AI_ANALYSE_FAILED = 'Failed to analyze content.',
    ERROR = 'Unexpected error.',
    FEATURE_NOT_AVAILABLE_ERROR = 'Feature not available for processing this scan type.',
    BRAND_OR_NAME_NOT_DETECTED_ERROR = 'Error in detecting "Brand" and "Name".',
    INTAKE_ITEM_DOES_NOT_EXISTS_ERROR = 'Intake item does not exist.',
}

export enum PreferencesKey {
    // ALC
    feedback = 'feedback',
    hasPets = 'hasPets',
    login = 'login',
    messagesIntro = 'messagesIntro',
    notifications = 'notifications',
    observationIntro = 'observationIntro',
    selectedPetId = 'selectedPetId',
    terms = 'terms',
    welcome = 'welcome',
    // others
    lang = 'lang',
    lastPausedAt = 'lastPausedAt',
    appearance = 'appearance',
    developer = 'developer',
}