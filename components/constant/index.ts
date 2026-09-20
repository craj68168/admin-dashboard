// =================================================
// GENDER
// Matches: Profile.gender
// =================================================

export const GENDER = [
  {
    value: "Male",
    key: "male",
  },
  {
    value: "Female",
    key: "female",
  },
  {
    value: "Other",
    key: "other",
  },
] as const;

// =================================================
// CURRENT VISA STATUS
// Requirement: Visa Type = Current Visa Status
// Matches: Client.currentVisaStatus
// =================================================

export const CURRENT_VISA_STATUS_OPTIONS = [
  {
    value: "student",
    key: "student",
  },
  {
    value: "dependent",
    key: "dependent",
  },
  {
    value: "designatedActivitiesJobHunting",
    key: "designatedActivitiesJobHunting",
  },
  {
    value: "designatedActivities",
    key: "designatedActivities",
  },
  {
    value: "engineerHumanitiesInternationalServices",
    key: "engineerHumanitiesInternationalServices",
  },
  {
    value: "specifiedSkilledWorker1",
    key: "specifiedSkilledWorker1",
  },
  {
    value: "specifiedSkilledWorker2",
    key: "specifiedSkilledWorker2",
  },
  {
    value: "skilledLabor",
    key: "skilledLabor",
  },
  {
    value: "technicalInternTraining",
    key: "technicalInternTraining",
  },
  {
    value: "intra-companyTransferee",
    key: "intraCompanyTransferee",
  },
  {
    value: "nursingCare",
    key: "nursingCare",
  },
  {
    value: "highlySkilledProfessional",
    key: "highlySkilledProfessional",
  },
  {
    value: "businessManager",
    key: "businessManager",
  },
  {
    value: "permanentResident",
    key: "permanentResident",
  },
  {
    value: "spouseChildOfJapaneseNational",
    key: "spouseChildOfJapaneseNational",
  },
  {
    value: "spouseChildOfPermanentResident",
    key: "spouseChildOfPermanentResident",
  },
  {
    value: "longTermResident",
    key: "longTermResident",
  },
  {
    value: "other",
    key: "other",
  },
] as const;

export const EDUCATION_TYPE_OPTIONS = [
  {
    value: "Japanese Language School",
    key: "japaneseLanguageSchool",
  },
  {
    value: "Vocational School",
    key: "vocationalSchool",
  },
  {
    value: "University",
    key: "university",
  },
  {
    value: "Junior College",
    key: "juniorCollege",
  },
  {
    value: "High School",
    key: "highSchool",
  },
  {
    value: "Technical College",
    key: "technicalCollege",
  },
  {
    value: "International School",
    key: "internationalSchool",
  },
  {
    value: "Other",
    key: "other",
  },
] as const;

// =================================================
// PREFERRED CATEGORY
// Requirement: COE Status = Prefer Category
// Matches: Client.preferCategory
// =================================================

export const PREFER_CATEGORY_OPTIONS = [
  {
    value: "newJob",
    key: "newJob",
  },
  {
    value: "jobChange",
    key: "jobChange",
  },
  {
    value: "dependentVisaRenewal",
    key: "dependentVisaRenewal",
  },
  {
    value: "visaServiceOnlyRenewal",
    key: "visaServiceOnlyRenewal",
  },
  {
    value: "visaServiceOnlyChange",
    key: "visaServiceOnlyChange",
  },
  {
    value: "otherVisaService",
    key: "otherVisaService",
  },
] as const;

// =================================================
// CURRENT STAGE
// Matches: Client.currentStage
// =================================================

export const CURRENT_STAGES = [
  {
    value: "registeredPaid",
    key: "registeredPaid",
  },
  {
    value: "vacancySearching",
    key: "vacancySearching",
  },
  {
    value: "interviewFixedPreparation",
    key: "interviewFixedPreparation",
  },
  {
    value: "interviewFailed",
    key: "interviewFailed",
  },
  {
    value: "jobOfferReceived",
    key: "jobOfferReceived",
  },
  {
    value: "jobOfferAccepted",
    key: "jobOfferAccepted",
  },
  {
    value: "jobOfferRejected",
    key: "jobOfferNotAccepted",
  },
  {
    value: "visaDocumentsSubmitted",
    key: "visaDocumentsSubmitted",
  },
  {
    value: "visaAppliedResultWaiting",
    key: "visaAppliedResultWaiting",
  },
  {
    value: "visaApproved",
    key: "visaApproved",
  },
  {
    value: "visaRejected",
    key: "visaRejected",
  },
  {
    value: "companyJoining",
    key: "companyJoining",
  },
  {
    value: "employmentStartedCompanyJoined",
    key: "employmentStartedCompanyJoined",
  },
  {
    value: "visaRenewal1Year",
    key: "visaRenewal1Year",
  },
  {
    value: "visaRenewal3Years",
    key: "visaRenewal3Years",
  },
  {
    value: "visaRenewal5Years",
    key: "visaRenewal5Years",
  },
  {
    value: "returntoNepal",
    key: "returnToNepal",
  },
] as const;

// =================================================
// CLIENT STATUS
// Derived automatically by backend from currentStage
// Useful for display/filtering.
// Do NOT use as editable Create Client field.
// =================================================

export const CLIENT_STATUSES = [
  {
    value: "Registered/Paid",
    key: "registeredPaid",
  },
  {
    value: "Vacancy Searching",
    key: "vacancySearching",
  },
  {
    value: "Interview Fixed / Preparation",
    key: "interviewFixedPreparation",
  },
  {
    value: "Interview Failed",
    key: "interviewFailed",
  },
  {
    value: "Naitei / Job Offer Received",
    key: "jobOfferReceived",
  },
  {
    value: "Job Offer Accepted",
    key: "jobOfferAccepted",
  },
  {
    value: "Job Offer Rejected",
    key: "jobOfferNotAccepted",
  },
  {
    value: "Visa Documents Submitted",
    key: "visaDocumentsSubmitted",
  },
  {
    value: "Visa Applied / Result Waiting",
    key: "visaAppliedResultWaiting",
  },
  {
    value: "Visa Approved",
    key: "visaApproved",
  },
  {
    value: "Visa Rejected",
    key: "visaRejected",
  },
  {
    value: "Waiting for Nyusha / Company Joining",
    key: "companyJoining",
  },
  {
    value: "Employment Started/Company Joined",
    key: "employmentStartedCompanyJoined",
  },
  {
    value: "Visa Renewal - 1 Year",
    key: "visaRenewal1Year",
  },
  {
    value: "Visa Renewal - 3 Years",
    key: "visaRenewal3Years",
  },
  {
    value: "Visa Renewal - 5 Years",
    key: "visaRenewal5Years",
  },
  {
    value: "Return to Nepal",
    key: "returnToNepal",
  },
] as const;

// =================================================
// NATIONALITY
// Matches: Profile.nationality
// =================================================

export const NATIONALITIES = [
  {
    value: "nepali",
    key: "nepali",
  },
  {
    value: "indian",
    key: "indian",
  },
  {
    value: "pakistani",
    key: "pakistani",
  },
  {
    value: "bangladeshi",
    key: "bangladeshi",
  },
  {
    // Exact current backend value
    value: "sri Lankan",
    key: "sriLankan",
  },
  {
    value: "vietnamese",
    key: "vietnamese",
  },
  {
    value: "myanmar",
    key: "myanmar",
  },
  {
    value: "indonesian",
    key: "indonesian",
  },
  {
    value: "filipino",
    key: "filipino",
  },
  {
    value: "chinese",
    key: "chinese",
  },
  {
    value: "other",
    key: "other",
  },
] as const;

// =================================================
// STATUS OF RESIDENCE
// Matches: Profile.StatusOfResidence
// =================================================

export const STATUS_OF_RESIDENCE_OPTIONS = [
  {
    value: "student",
    key: "student",
  },
  {
    value: "dependent",
    key: "dependent",
  },
  {
    value: "engineerSpecialistInHumanitiesInternationalServices",
    key: "engineerSpecialistInHumanitiesInternationalServices",
  },
  {
    value: "specifiedSkilledWorkerNo1",
    key: "specifiedSkilledWorkerNo1",
  },
  {
    value: "specifiedSkilledWorkerNo2",
    key: "specifiedSkilledWorkerNo2",
  },
  {
    value: "technicalInternTraining",
    key: "technicalInternTraining",
  },
  {
    value: "designatedActivities",
    key: "designatedActivities",
  },
  {
    value: "highlySkilledProfessional",
    key: "highlySkilledProfessional",
  },
  {
    value: "skilledLabor",
    key: "skilledLabor",
  },
  {
    // Exact current backend value
    value: "intra-companyTransferee",
    key: "intraCompanyTransferee",
  },
  {
    value: "nursingCare",
    key: "nursingCare",
  },
  {
    value: "businessManager",
    key: "businessManager",
  },
  {
    value: "instructor",
    key: "instructor",
  },
  {
    value: "researcher",
    key: "researcher",
  },
  {
    value: "professor",
    key: "professor",
  },
  {
    value: "medicalServices",
    key: "medicalServices",
  },
  {
    value: "permanentResident",
    key: "permanentResident",
  },
  {
    // Exact current backend value
    value: "long-TermResident",
    key: "longTermResident",
  },
  {
    value: "spouseOrChildOfJapaneseNational",
    key: "spouseOrChildOfJapaneseNational",
  },
  {
    value: "spouseOrChildOfPermanentResident",
    key: "spouseOrChildOfPermanentResident",
  },
  {
    value: "culturalActivities",
    key: "culturalActivities",
  },
  {
    value: "trainee",
    key: "trainee",
  },
  {
    // Exact current backend value
    value: "other (その他)",
    key: "other",
  },
] as const;

// =================================================
// JAPANESE PROFICIENCY LEVEL
// =================================================

export const JAPANESE_LEVELS = [
  {
    value: "n1",
    key: "n1",
  },
  {
    value: "n2",
    key: "n2",
  },
  {
    value: "n3",
    key: "n3",
  },
  {
    value: "n4",
    key: "n4",
  },
  {
    value: "n5",
    key: "n5",
  },
  {
    value: "none",
    key: "none",
  },
] as const;

// =================================================
// EMPLOYMENT TYPE
// Matches: Profile.employmentHistory.employmentType
// =================================================

export const EMPLOYMENT_TYPE_OPTIONS = [
  {
    value: "part-time",
    key: "partTime",
  },
  {
    value: "full-time",
    key: "fullTime",
  },
  {
    value: "contract",
    key: "contract",
  },
  {
    value: "temporaryDispatchEmployee",
    key: "temporaryDispatchEmployee",
  },
  {
    value: "other",
    key: "other",
  },
] as const;

// =================================================
// PREFECTURES
// Matches: Profile.prefecture
// =================================================

export const PREFECTURE_OPTIONS = [
  { value: "hokkaido", key: "hokkaido" },
  { value: "aomori", key: "aomori" },
  { value: "iwate", key: "iwate" },
  { value: "miyagi", key: "miyagi" },
  { value: "akita", key: "akita" },
  { value: "yamagata", key: "yamagata" },
  { value: "fukushima", key: "fukushima" },

  { value: "ibaraki", key: "ibaraki" },
  { value: "tochigi", key: "tochigi" },
  { value: "gunma", key: "gunma" },
  { value: "saitama", key: "saitama" },
  { value: "chiba", key: "chiba" },
  { value: "tokyo", key: "tokyo" },
  { value: "kanagawa", key: "kanagawa" },

  { value: "niigata", key: "niigata" },
  { value: "toyama", key: "toyama" },
  { value: "ishikawa", key: "ishikawa" },
  { value: "fukui", key: "fukui" },
  { value: "yamanashi", key: "yamanashi" },
  { value: "nagano", key: "nagano" },
  { value: "gifu", key: "gifu" },
  { value: "shizuoka", key: "shizuoka" },
  { value: "aichi", key: "aichi" },

  { value: "mie", key: "mie" },
  { value: "shiga", key: "shiga" },
  { value: "kyoto", key: "kyoto" },
  { value: "osaka", key: "osaka" },
  { value: "hyogo", key: "hyogo" },
  { value: "nara", key: "nara" },
  { value: "wakayama", key: "wakayama" },

  { value: "tottori", key: "tottori" },
  { value: "shimane", key: "shimane" },
  { value: "okayama", key: "okayama" },
  { value: "hiroshima", key: "hiroshima" },
  { value: "yamaguchi", key: "yamaguchi" },

  { value: "tokushima", key: "tokushima" },
  { value: "kagawa", key: "kagawa" },
  { value: "ehime", key: "ehime" },
  { value: "kochi", key: "kochi" },

  { value: "fukuoka", key: "fukuoka" },
  { value: "saga", key: "saga" },
  { value: "nagasaki", key: "nagasaki" },
  { value: "kumamoto", key: "kumamoto" },
  { value: "oita", key: "oita" },
  { value: "miyazaki", key: "miyazaki" },
  { value: "kagoshima", key: "kagoshima" },

  { value: "okinawa", key: "okinawa" },
] as const;