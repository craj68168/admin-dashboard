"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { createTranslator, useLocale } from "next-intl";

import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import {
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  GENDER,
  NATIONALITIES,
  JAPANESE_LEVELS,
  PREFECTURE_OPTIONS,
  EDUCATION_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/components/constant";

import { useClientFormHook } from "./hook";
import type { ClientFormProps } from "./type";
import { getPortalPaths } from "@/lib/portal-routes";

const messages = {
  "en": {
    "noOptionsText": "No options found",
    "registrationStageFallback": "Registered / Paid",
    "breadcrumbs": {
      "dashboard": "Dashboard",
      "clients": "Clients",
      "create": "Create Client",
      "edit": "Edit Client"
    },
    "header": {
      "createTitle": "Create Client",
      "editTitle": "Edit Client",
      "createDescription": "Enter client details, assign staff and confirm the registration payment.",
      "editDescription": "Update the client's profile, documents and recruitment details."
    },
    "sections": {
      "basic": {
        "title": "Basic Information"
      },
      "address": {
        "title": "Address"
      },
      "immigration": {
        "title": "Immigration"
      },
      "recruitment": {
        "title": "Recruitment",
        "createDescription": "Set the preferred category, assigned staff and starting stage.",
        "editDescription": "Review the assigned staff, preferred category and current stage."
      },
      "registrationPayment": {
        "title": "Registration payment",
        "description": "The client is created only after the full registration fee is confirmed. Partial payment is not supported."
      },
      "education": {
        "title": "Education"
      },
      "qualifications": {
        "title": "Japanese language & qualifications"
      },
      "employment": {
        "title": "Employment history"
      },
      "skills": {
        "title": "Skills & career summary"
      },
      "application": {
        "title": "Japanese application content"
      },
      "documents": {
        "title": "Documents"
      }
    },
    "fields": {
      "fullName": "Full name",
      "furigana": "Furigana",
      "phone": "Phone",
      "email": "Email",
      "dateOfBirth": "Date of birth",
      "gender": "Gender",
      "nationality": "Nationality",
      "postalCode": "Postal code",
      "prefecture": "Prefecture",
      "address": "Address",
      "currentVisaStatus": "Current visa status",
      "residenceExpiryDate": "Residence expiry date",
      "passportNumber": "Passport number",
      "passportExpiryDate": "Passport expiry date",
      "preferCategory": "Preferred category",
      "assignedStaff": "Assigned staff",
      "intake": "Intake",
      "currentStage": "Current stage",
      "paymentMethod": "Payment method",
      "paymentDate": "Payment date",
      "bankName": "Bank name",
      "referenceNumber": "Reference number",
      "receiptNumber": "Receipt number",
      "paymentNote": "Payment note",
      "educationType": "School type",
      "schoolName": "School name",
      "major": "Major / course",
      "enrollmentDate": "Enrollment date",
      "graduationDate": "Graduation date",
      "graduationStatus": "Graduation status",
      "japaneseLanguageLevel": "Japanese language level",
      "qualificationName": "Qualification / certificate",
      "levelOrScore": "Level / score",
      "issuer": "Issuer",
      "acquiredDate": "Acquired date",
      "expiryDate": "Expiry date",
      "note": "Note",
      "companyName": "Company name",
      "employmentType": "Employment type",
      "department": "Department",
      "jobTitle": "Job title",
      "workLocation": "Work location",
      "startDate": "Start date",
      "endDate": "End date",
      "currentlyEmployed": "Currently employed",
      "responsibilities": "Responsibilities / main duties",
      "achievements": "Achievements",
      "skills": "Skills",
      "skillsHelper": "Separate skills with commas or new lines.",
      "careerSummary": "Career summary / work summary",
      "motivation": "Motivation",
      "selfPR": "Self PR",
      "desiredConditions": "Desired conditions"
    },
    "placeholders": {
      "gender": "Search gender",
      "nationality": "Search nationality",
      "prefecture": "Search prefecture",
      "currentVisaStatus": "Search visa status",
      "preferCategory": "Search preferred category",
      "assignedStaff": "Search staff",
      "paymentMethod": "Search payment method",
      "educationType": "Search school type",
      "graduationStatus": "Search graduation status",
      "japaneseLanguageLevel": "Search Japanese level",
      "employmentType": "Search employment type"
    },
    "assignedStaff": {
      "autoAssigned": "Automatically assigned"
    },
    "registrationPayment": {
      "fullPaymentRequired": "Full payment required",
      "registrationFee": "Registration fee",
      "stageMasterNote": "The amount is controlled by the Stage Master. It cannot be changed from this form."
    },
    "paymentMethods": {
      "bankTransfer": "Bank Transfer",
      "cash": "Cash"
    },
    "graduationStatus": {
      "graduated": "Graduated",
      "expectedGraduation": "Expected graduation",
      "currentlyEnrolled": "Currently enrolled",
      "withdrawn": "Withdrawn"
    },
    "education": {
      "itemTitle": "Education {number}",
      "add": "Add education"
    },
    "qualifications": {
      "itemTitle": "Qualification {number}",
      "add": "Add qualification"
    },
    "employment": {
      "itemTitle": "Employment {number}",
      "add": "Add employment"
    },
    "documents": {
      "photo": {
        "title": "Candidate photo",
        "select": "Select photo",
        "replace": "Replace photo",
        "existing": "Existing photo is kept unless replaced.",
        "empty": "No photo selected. Use a 3:4 portrait.",
        "previewAlt": "Candidate photo preview"
      },
      "cv": {
        "title": "Original applicant CV",
        "select": "Select CV",
        "replace": "Replace CV",
        "existing": "Existing CV is kept unless replaced.",
        "empty": "No CV selected. PDF only."
      }
    },
    "actions": {
      "cancel": "Cancel",
      "processing": "Processing...",
      "update": "Update client",
      "confirmPaymentCreate": "Confirm ¥{amount} payment & create client",
      "removeItem": "Remove {item}"
    },
    "validation": {
      "fullNameRequired": "Full name is required.",
      "phoneRequired": "Phone number is required.",
      "emailInvalid": "Please enter a valid email.",
      "currentVisaStatusRequired": "Current visa status is required.",
      "preferCategoryRequired": "Preferred category is required.",
      "assignedStaffRequired": "Please select an assigned staff member.",
      "paymentMethodRequired": "Payment method is required.",
      "paymentDateRequired": "Payment date is required.",
      "invalid": "Please check this field.",
      "max20": "Please enter 20 characters or fewer.",
      "max30": "Please enter 30 characters or fewer.",
      "max50": "Please enter 50 characters or fewer.",
      "max100": "Please enter 100 characters or fewer.",
      "max200": "Please enter 200 characters or fewer.",
      "max500": "Please enter 500 characters or fewer.",
      "max1000": "Please enter 1000 characters or fewer.",
      "max2000": "Please enter 2000 characters or fewer.",
      "max3000": "Please enter 3000 characters or fewer.",
      "max5000": "Please enter 5000 characters or fewer."
    },
    "messages": {
      "registrationStageLoadFailed": "Failed to load registration stage.",
      "registrationStageMissing": "The active registration/payment stage was not found.",
      "registrationStageAmountInvalid": "The registration/payment stage must have an amount greater than ¥0.",
      "registrationInvalid": "Registration stage is not configured correctly.",
      "updateFailed": "Failed to update client.",
      "registerFailed": "Failed to register client."
    },
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "Authenticated user ID was not found.",
      "authenticatedUserInformationIsMissing": "Authenticated user information is missing.",
      "authenticationRequired": "Authentication required",
      "cVTypeMustBeCombinedRirekishoOrCareer": "CV type must be combined, rirekisho or career.",
      "cannotAssignAClientToAnInactiveStaffMember": "Cannot assign a client to an inactive staff member.",
      "changeTheClientStageFromTheProgressSectionSoStageHistoryAndPaymentRulesArePreserved": "Change the client stage from the Progress section so stage history and payment rules are preserved.",
      "clientIDIsRequired": "Client ID is required.",
      "clientAssignedSuccessfully": "Client assigned successfully.",
      "clientNotFound": "Client not found.",
      "clientProfileNotFound": "Client profile not found.",
      "clientUpdatedSuccessfully": "Client updated successfully.",
      "clientProfileAndStageHistoryDeletedSuccessfully": "Client, profile and stage history deleted successfully.",
      "duplicateClientProfileOrPaymentDataExists": "Duplicate client, profile or payment data exists.",
      "duplicateDataExists": "Duplicate data exists.",
      "exportFormatMustBeCsvPdfOrXlsx": "Export format must be csv, pdf or xlsx.",
      "failedToAssignClient": "Failed to assign client.",
      "failedToDeleteClient": "Failed to delete client.",
      "failedToExportClients": "Failed to export clients.",
      "failedToGenerateJapaneseCV": "Failed to generate Japanese CV.",
      "failedToGetClient": "Failed to get client.",
      "failedToGetClients": "Failed to get clients.",
      "failedToRegisterClient": "Failed to register client.",
      "failedToUpdateClient": "Failed to update client.",
      "internalServerError": "Internal Server Error",
      "invalidOrExpiredToken": "Invalid or expired token",
      "invalidTokenFormat": "Invalid token format",
      "invalidUserRole": "Invalid user role",
      "paymentDateIsInvalid": "Payment date is invalid.",
      "paymentDateIsRequired": "Payment date is required.",
      "paymentMethodMustBeBankTransferOrCash": "Payment method must be Bank Transfer or Cash.",
      "pleaseSelectAStaffMember": "Please select a staff member.",
      "registrationPaymentConfirmedAndClientRegisteredSuccessfully": "Registration payment confirmed and client registered successfully.",
      "registrationStageRegisteredPaidDoesNotExistOrIsInactive": "Registration stage \"registeredPaid\" does not exist or is inactive.",
      "serverError": "Server error",
      "staffIDWasNotFoundForTheLoggedInUser": "Staff ID was not found for the logged-in user.",
      "staffCannotReassignClients": "Staff cannot reassign clients.",
      "theRegisteredPaidStageMustHaveAnAmountGreaterThan0": "The \"Registered / Paid\" stage must have an amount greater than ¥0.",
      "theSelectedStaffMemberIsInactive": "The selected staff member is inactive.",
      "thisClientHasPaymentRecordsAndCannotBePermanentlyDeletedUseArchiveWhenArchiveSupportIsAdded": "This client has payment records and cannot be permanently deleted. Use archive when archive support is added.",
      "tokenExpired": "Token expired",
      "tokenNotProvided": "Token not provided",
      "userAccountNoLongerExists": "User account no longer exists",
      "youAreNotAuthorizedToAccessThisClient": "You are not authorized to access this client.",
      "youAreNotAuthorizedToAccessThisResource": "You are not authorized to access this resource",
      "youAreNotAuthorizedToEditThisClient": "You are not authorized to edit this client.",
      "youAreNotAuthorizedToGenerateThisClientSCV": "You are not authorized to generate this client's CV.",
      "yourAccountHasBeenDisabled": "Your account has been disabled",
      "assignedStaffCannotBeEmpty": "assignedStaff cannot be empty.",
      "fullNamePhoneAndCurrentVisaStatusAreRequired": "fullName, phone and currentVisaStatus are required.",
      "staffIdIsRequired": "staffId is required.",
      "somethingWentWrong": "Something went wrong",
      "networkError": "Network Error",
      "failedToFetch": "Failed to fetch",
      "requestAborted": "Request aborted",
      "canceled": "canceled",
      "fieldEducation": "Education",
      "fieldEmploymentHistory": "Employment history",
      "fieldQualifications": "Qualifications",
      "fieldSkills": "Skills",
      "validationError": "Please check the submitted information.",
      "aStageWithTheSameKeyOrStageIDAlreadyExists": "A stage with the same key or stage ID already exists.",
      "aStageWithTheSameNameAlreadyExists": "A stage with the same name already exists.",
      "aStageWithTheSameValueAlreadyExists": "A stage with the same value already exists.",
      "aValidStageNameIsRequiredToGenerateTheStageKey": "A valid stage name is required to generate the stage key.",
      "deactivateItInstead": "Deactivate it instead.",
      "failedToCreateStage": "Failed to create stage.",
      "failedToDeleteStage": "Failed to delete stage.",
      "failedToGetStage": "Failed to get stage.",
      "failedToGetStages": "Failed to get stages.",
      "failedToUpdateStageStatus": "Failed to update stage status.",
      "failedToUpdateStage": "Failed to update stage.",
      "stageIDCannotBeChanged": "Stage ID cannot be changed.",
      "stageIDIsRequired": "Stage ID is required.",
      "stageActivatedSuccessfully": "Stage activated successfully.",
      "stageAmountMustBeAWholeNumberGreaterThanOrEqualTo0": "Stage amount must be a whole number greater than or equal to 0.",
      "stageCreatedSuccessfully": "Stage created successfully.",
      "stageDeactivatedSuccessfully": "Stage deactivated successfully.",
      "stageDeletedSuccessfully": "Stage deleted successfully.",
      "stageKeyCannotBeChanged": "Stage key cannot be changed.",
      "stageNameCannotBeEmpty": "Stage name cannot be empty.",
      "stageNameIsRequired": "Stage name is required.",
      "stageNotFound": "Stage not found.",
      "stageUpdatedSuccessfully": "Stage updated successfully.",
      "theGeneratedStageKeyIsInvalid": "The generated stage key is invalid.",
      "displayOrderMustBeAPositiveWholeNumber2": "displayOrder must be a positive whole number.",
      "isActiveMustBeTrueOrFalse": "isActive must be true or false."
    },
    "requestFailed": "Request failed with status code {status}.",
    "requestTimeout": "The request timed out. Please try again.",
    "staffNotFound": "Staff {id} not found.",
    "options": {
      "gender": {
        "male": "Male",
        "female": "Female",
        "other": "Other"
      },
      "currentVisaStatus": {
        "student": "Student",
        "dependent": "Dependent",
        "designatedActivitiesJobHunting": "Designated Activities - Job Hunting",
        "designatedActivities": "Designated Activities - Other",
        "engineerHumanitiesInternationalServices": "Engineer / Humanities / International Services",
        "specifiedSkilledWorker1": "Specified Skilled Worker 1",
        "specifiedSkilledWorker2": "Specified Skilled Worker 2",
        "skilledLabor": "Skilled Labor",
        "technicalInternTraining": "Technical Intern Training",
        "intraCompanyTransferee": "Intra-company Transferee",
        "nursingCare": "Nursing Care",
        "highlySkilledProfessional": "Highly Skilled Professional",
        "businessManager": "Business Manager",
        "permanentResident": "Permanent Resident",
        "spouseChildOfJapaneseNational": "Spouse / Child of Japanese National",
        "spouseChildOfPermanentResident": "Spouse / Child of Permanent Resident",
        "longTermResident": "Long-Term Resident",
        "other": "Other"
      },
      "preferCategory": {
        "newJob": "Shushoku / New Job",
        "jobChange": "Tenshoku / Job Change",
        "dependentVisaRenewal": "Dependent Visa Renewal",
        "visaServiceOnlyRenewal": "Visa Service Only / Renewal",
        "visaServiceOnlyChange": "Visa Service Only / Change",
        "otherVisaService": "Other Visa Service"
      },
      "currentStage": {
        "registeredPaid": "Registered / Paid",
        "vacancySearching": "Vacancy Searching",
        "interviewFixedPreparation": "Interview Fixed / Preparation",
        "interviewFailed": "Interview Failed",
        "jobOfferReceived": "Naitei / Job Offer Received",
        "jobOfferAccepted": "Job Offer Accepted",
        "jobOfferNotAccepted": "Job Offer Not Accepted",
        "visaDocumentsSubmitted": "Visa Documents Submitted",
        "visaAppliedResultWaiting": "Visa Applied / Result Waiting",
        "visaApproved": "Visa Approved",
        "visaRejected": "Visa Rejected",
        "companyJoining": "Waiting for Nyusha / Company Joining",
        "employmentStartedCompanyJoined": "Employment Started / Company Joined",
        "visaRenewal1Year": "Visa Renewal - 1 Year",
        "visaRenewal3Years": "Visa Renewal - 3 Years",
        "visaRenewal5Years": "Visa Renewal - 5 Years",
        "returnToNepal": "Return to Nepal"
      },
      "nationality": {
        "nepali": "Nepali",
        "indian": "Indian",
        "pakistani": "Pakistani",
        "bangladeshi": "Bangladeshi",
        "sriLankan": "Sri Lankan",
        "vietnamese": "Vietnamese",
        "myanmar": "Myanmar",
        "indonesian": "Indonesian",
        "filipino": "Filipino",
        "chinese": "Chinese",
        "other": "Other"
      },
      "statusOfResidence": {
        "student": "Student",
        "dependent": "Dependent",
        "engineerSpecialistInHumanitiesInternationalServices": "Engineer / Specialist in Humanities / International Services",
        "specifiedSkilledWorkerNo1": "Specified Skilled Worker No. 1",
        "specifiedSkilledWorkerNo2": "Specified Skilled Worker No. 2",
        "technicalInternTraining": "Technical Intern Training",
        "designatedActivities": "Designated Activities",
        "highlySkilledProfessional": "Highly Skilled Professional",
        "skilledLabor": "Skilled Labor",
        "intraCompanyTransferee": "Intra-company Transferee",
        "nursingCare": "Nursing Care",
        "businessManager": "Business Manager",
        "instructor": "Instructor",
        "researcher": "Researcher",
        "professor": "Professor",
        "medicalServices": "Medical Services",
        "permanentResident": "Permanent Resident",
        "longTermResident": "Long-Term Resident",
        "spouseOrChildOfJapaneseNational": "Spouse or Child of Japanese National",
        "spouseOrChildOfPermanentResident": "Spouse or Child of Permanent Resident",
        "culturalActivities": "Cultural Activities",
        "trainee": "Trainee",
        "other": "Other"
      },
      "japaneseLanguageLevel": {
        "n1": "N1",
        "n2": "N2",
        "n3": "N3",
        "n4": "N4",
        "n5": "N5",
        "none": "No JLPT / None"
      },
      "educationType": {
        "japaneseLanguageSchool": "Japanese Language School",
        "vocationalSchool": "Vocational School",
        "university": "University",
        "juniorCollege": "Junior College",
        "highSchool": "High School",
        "technicalCollege": "Technical College",
        "internationalSchool": "International School",
        "other": "Other"
      },
      "employmentType": {
        "partTime": "Part-time",
        "fullTime": "Full-time / Regular Employee",
        "contract": "Contract Employee",
        "temporaryDispatchEmployee": "Temporary / Dispatch Employee",
        "other": "Other"
      },
      "prefecture": {
        "hokkaido": "Hokkaido",
        "aomori": "Aomori",
        "iwate": "Iwate",
        "miyagi": "Miyagi",
        "akita": "Akita",
        "yamagata": "Yamagata",
        "fukushima": "Fukushima",
        "ibaraki": "Ibaraki",
        "tochigi": "Tochigi",
        "gunma": "Gunma",
        "saitama": "Saitama",
        "chiba": "Chiba",
        "tokyo": "Tokyo",
        "kanagawa": "Kanagawa",
        "niigata": "Niigata",
        "toyama": "Toyama",
        "ishikawa": "Ishikawa",
        "fukui": "Fukui",
        "yamanashi": "Yamanashi",
        "nagano": "Nagano",
        "gifu": "Gifu",
        "shizuoka": "Shizuoka",
        "aichi": "Aichi",
        "mie": "Mie",
        "shiga": "Shiga",
        "kyoto": "Kyoto",
        "osaka": "Osaka",
        "hyogo": "Hyogo",
        "nara": "Nara",
        "wakayama": "Wakayama",
        "tottori": "Tottori",
        "shimane": "Shimane",
        "okayama": "Okayama",
        "hiroshima": "Hiroshima",
        "yamaguchi": "Yamaguchi",
        "tokushima": "Tokushima",
        "kagawa": "Kagawa",
        "ehime": "Ehime",
        "kochi": "Kochi",
        "fukuoka": "Fukuoka",
        "saga": "Saga",
        "nagasaki": "Nagasaki",
        "kumamoto": "Kumamoto",
        "oita": "Oita",
        "miyazaki": "Miyazaki",
        "kagoshima": "Kagoshima",
        "okinawa": "Okinawa"
      }
    },
    "stages": {
      "registeredPaid": "Registered / Paid",
      "vacancySearching": "Vacancy Searching",
      "interviewFixedPreparation": "Interview Fixed / Preparation",
      "interviewFailed": "Interview Failed",
      "jobOfferReceived": "Naitei / Job Offer Received",
      "jobOfferAccepted": "Job Offer Accepted",
      "jobOfferNotAccepted": "Job Offer Not Accepted",
      "visaDocumentsSubmitted": "Visa Documents Submitted",
      "visaAppliedResultWaiting": "Visa Applied / Result Waiting",
      "visaApproved": "Visa Approved",
      "visaRejected": "Visa Rejected",
      "companyJoining": "Waiting for Nyusha / Company Joining",
      "employmentStartedCompanyJoined": "Employment Started / Company Joined",
      "visaRenewal1Year": "Visa Renewal - 1 Year",
      "visaRenewal3Years": "Visa Renewal - 3 Years",
      "visaRenewal5Years": "Visa Renewal - 5 Years",
      "returnToNepal": "Return to Nepal",
      "new": "New",
      "documentCollection": "Document Collection",
      "processing": "Processing",
      "cOEApplied": "COE Applied",
      "cOEReceived": "COE Received",
      "visaApplied": "Visa Applied",
      "departed": "Departed",
      "arrivedInJapan": "Arrived in Japan",
      "registrationPending": "Registration Pending",
      "registeredVacancySearching": "Registered / Vacancy Searching",
      "legacyPayment": "Legacy Payment"
    },
    "autocomplete": {
      "clear": "Clear",
      "open": "Open",
      "close": "Close"
    }
  },
  "ja": {
    "noOptionsText": "候補が見つかりません",
    "registrationStageFallback": "登録済み / 支払済み",
    "breadcrumbs": {
      "dashboard": "ダッシュボード",
      "clients": "顧客",
      "create": "顧客を作成",
      "edit": "顧客を編集"
    },
    "header": {
      "createTitle": "顧客を作成",
      "editTitle": "顧客を編集",
      "createDescription": "顧客情報を入力し、担当スタッフを割り当て、登録料の支払いを確認します。",
      "editDescription": "顧客のプロフィール、書類、採用情報を更新します。"
    },
    "sections": {
      "basic": {
        "title": "基本情報"
      },
      "address": {
        "title": "住所"
      },
      "immigration": {
        "title": "在留・パスポート情報"
      },
      "recruitment": {
        "title": "採用情報",
        "createDescription": "希望カテゴリー、担当スタッフ、開始ステージを設定します。",
        "editDescription": "担当スタッフ、希望カテゴリー、現在のステージを確認します。"
      },
      "registrationPayment": {
        "title": "登録料支払い",
        "description": "登録料の全額支払いを確認した後に顧客を作成します。一部入金には対応していません。"
      },
      "education": {
        "title": "学歴"
      },
      "qualifications": {
        "title": "日本語能力・資格"
      },
      "employment": {
        "title": "職歴"
      },
      "skills": {
        "title": "スキル・職務要約"
      },
      "application": {
        "title": "日本語申請内容"
      },
      "documents": {
        "title": "書類"
      }
    },
    "fields": {
      "fullName": "氏名",
      "furigana": "フリガナ",
      "phone": "電話番号",
      "email": "メール",
      "dateOfBirth": "生年月日",
      "gender": "性別",
      "nationality": "国籍",
      "postalCode": "郵便番号",
      "prefecture": "都道府県",
      "address": "住所",
      "currentVisaStatus": "現在の在留資格",
      "residenceExpiryDate": "在留期限",
      "passportNumber": "パスポート番号",
      "passportExpiryDate": "パスポート有効期限",
      "preferCategory": "希望カテゴリー",
      "assignedStaff": "担当スタッフ",
      "intake": "入学時期",
      "currentStage": "現在のステージ",
      "paymentMethod": "支払方法",
      "paymentDate": "支払日",
      "bankName": "銀行名",
      "referenceNumber": "参照番号",
      "receiptNumber": "領収書番号",
      "paymentNote": "支払いメモ",
      "educationType": "学校種別",
      "schoolName": "学校名",
      "major": "専攻・コース",
      "enrollmentDate": "入学日",
      "graduationDate": "卒業日",
      "graduationStatus": "卒業状況",
      "japaneseLanguageLevel": "日本語レベル",
      "qualificationName": "資格・証明書",
      "levelOrScore": "レベル・スコア",
      "issuer": "発行機関",
      "acquiredDate": "取得日",
      "expiryDate": "有効期限",
      "note": "メモ",
      "companyName": "会社名",
      "employmentType": "雇用形態",
      "department": "部署",
      "jobTitle": "職種・役職",
      "workLocation": "勤務地",
      "startDate": "開始日",
      "endDate": "終了日",
      "currentlyEmployed": "現在勤務中",
      "responsibilities": "業務内容・主な職務",
      "achievements": "実績",
      "skills": "スキル",
      "skillsHelper": "スキルはカンマまたは改行で区切って入力してください。",
      "careerSummary": "職務要約",
      "motivation": "志望動機",
      "selfPR": "自己PR",
      "desiredConditions": "本人希望記入欄"
    },
    "placeholders": {
      "gender": "性別を検索",
      "nationality": "国籍を検索",
      "prefecture": "都道府県を検索",
      "currentVisaStatus": "在留資格を検索",
      "preferCategory": "希望カテゴリーを検索",
      "assignedStaff": "スタッフを検索",
      "paymentMethod": "支払方法を検索",
      "educationType": "学校種別を検索",
      "graduationStatus": "卒業状況を検索",
      "japaneseLanguageLevel": "日本語レベルを検索",
      "employmentType": "雇用形態を検索"
    },
    "assignedStaff": {
      "autoAssigned": "自動割り当て"
    },
    "registrationPayment": {
      "fullPaymentRequired": "全額支払いが必要です",
      "registrationFee": "登録料",
      "stageMasterNote": "金額はステージマスターで管理されています。このフォームからは変更できません。"
    },
    "paymentMethods": {
      "bankTransfer": "銀行振込",
      "cash": "現金"
    },
    "graduationStatus": {
      "graduated": "卒業",
      "expectedGraduation": "卒業見込み",
      "currentlyEnrolled": "在学中",
      "withdrawn": "中退"
    },
    "education": {
      "itemTitle": "学歴 {number}",
      "add": "学歴を追加"
    },
    "qualifications": {
      "itemTitle": "資格 {number}",
      "add": "資格を追加"
    },
    "employment": {
      "itemTitle": "職歴 {number}",
      "add": "職歴を追加"
    },
    "documents": {
      "photo": {
        "title": "候補者写真",
        "select": "写真を選択",
        "replace": "写真を変更",
        "existing": "既存の写真は、変更しない限り保持されます。",
        "empty": "写真が選択されていません。3:4の証明写真を使用してください。",
        "previewAlt": "候補者写真プレビュー"
      },
      "cv": {
        "title": "応募者の履歴書",
        "select": "履歴書を選択",
        "replace": "履歴書を変更",
        "existing": "既存の履歴書は、変更しない限り保持されます。",
        "empty": "履歴書が選択されていません。PDFのみ対応しています。"
      }
    },
    "actions": {
      "cancel": "キャンセル",
      "processing": "処理中...",
      "update": "顧客を更新",
      "confirmPaymentCreate": "¥{amount}の支払いを確認して顧客を作成",
      "removeItem": "{item}を削除"
    },
    "validation": {
      "fullNameRequired": "氏名を入力してください。",
      "phoneRequired": "電話番号を入力してください。",
      "emailInvalid": "有効なメールアドレスを入力してください。",
      "currentVisaStatusRequired": "現在の在留資格を選択してください。",
      "preferCategoryRequired": "希望カテゴリーを選択してください。",
      "assignedStaffRequired": "担当スタッフを選択してください。",
      "paymentMethodRequired": "支払方法を選択してください。",
      "paymentDateRequired": "支払日を入力してください。",
      "invalid": "入力内容を確認してください。",
      "max20": "20文字以内で入力してください。",
      "max30": "30文字以内で入力してください。",
      "max50": "50文字以内で入力してください。",
      "max100": "100文字以内で入力してください。",
      "max200": "200文字以内で入力してください。",
      "max500": "500文字以内で入力してください。",
      "max1000": "1000文字以内で入力してください。",
      "max2000": "2000文字以内で入力してください。",
      "max3000": "3000文字以内で入力してください。",
      "max5000": "5000文字以内で入力してください。"
    },
    "messages": {
      "registrationStageLoadFailed": "登録ステージを読み込めませんでした。",
      "registrationStageMissing": "有効な登録・支払いステージが見つかりません。",
      "registrationStageAmountInvalid": "登録・支払いステージの金額は0円より大きくしてください。",
      "registrationInvalid": "登録ステージが正しく設定されていません。",
      "updateFailed": "顧客情報を更新できませんでした。",
      "registerFailed": "顧客を登録できませんでした。"
    },
    "serverMessages": {
      "authenticatedUserIDWasNotFound": "認証済みユーザーのIDが見つかりません。",
      "authenticatedUserInformationIsMissing": "認証済みユーザーの情報がありません。",
      "authenticationRequired": "ログインが必要です。",
      "cVTypeMustBeCombinedRirekishoOrCareer": "履歴書の種類はcombined、rirekisho、careerのいずれかを指定してください。",
      "cannotAssignAClientToAnInactiveStaffMember": "無効なスタッフに顧客を割り当てることはできません。",
      "changeTheClientStageFromTheProgressSectionSoStageHistoryAndPaymentRulesArePreserved": "ステージ履歴と入金ルールを維持するため、「進捗」から顧客のステージを変更してください。",
      "clientIDIsRequired": "顧客IDを指定してください。",
      "clientAssignedSuccessfully": "顧客を割り当てました。",
      "clientNotFound": "顧客が見つかりません。",
      "clientProfileNotFound": "顧客のプロフィールが見つかりません。",
      "clientUpdatedSuccessfully": "顧客情報を更新しました。",
      "clientProfileAndStageHistoryDeletedSuccessfully": "顧客、プロフィール、ステージ履歴を削除しました。",
      "duplicateClientProfileOrPaymentDataExists": "顧客、プロフィール、または入金データが重複しています。",
      "duplicateDataExists": "データが重複しています。",
      "exportFormatMustBeCsvPdfOrXlsx": "出力形式はCSV、PDF、XLSXのいずれかを指定してください。",
      "failedToAssignClient": "顧客を割り当てられませんでした。",
      "failedToDeleteClient": "顧客を削除できませんでした。",
      "failedToExportClients": "顧客データを出力できませんでした。",
      "failedToGenerateJapaneseCV": "日本語の履歴書を作成できませんでした。",
      "failedToGetClient": "顧客情報を取得できませんでした。",
      "failedToGetClients": "顧客一覧を取得できませんでした。",
      "failedToRegisterClient": "顧客を登録できませんでした。",
      "failedToUpdateClient": "顧客情報を更新できませんでした。",
      "internalServerError": "サーバー内部でエラーが発生しました。",
      "invalidOrExpiredToken": "認証トークンが無効か、期限切れです。",
      "invalidTokenFormat": "認証トークンの形式が正しくありません。",
      "invalidUserRole": "ユーザー権限が正しくありません。",
      "paymentDateIsInvalid": "入金日が正しくありません。",
      "paymentDateIsRequired": "入金日を入力してください。",
      "paymentMethodMustBeBankTransferOrCash": "支払方法は銀行振込または現金を選択してください。",
      "pleaseSelectAStaffMember": "スタッフを選択してください。",
      "registrationPaymentConfirmedAndClientRegisteredSuccessfully": "登録料の入金を確認し、顧客を登録しました。",
      "registrationStageRegisteredPaidDoesNotExistOrIsInactive": "登録ステージ「registeredPaid」が存在しないか、無効になっています。",
      "serverError": "サーバーエラーが発生しました。",
      "staffIDWasNotFoundForTheLoggedInUser": "ログイン中のユーザーのスタッフIDが見つかりません。",
      "staffCannotReassignClients": "スタッフは顧客の担当者を変更できません。",
      "theRegisteredPaidStageMustHaveAnAmountGreaterThan0": "「登録済み / 支払済み」ステージの金額は0円より大きくしてください。",
      "theSelectedStaffMemberIsInactive": "選択したスタッフは無効になっています。",
      "thisClientHasPaymentRecordsAndCannotBePermanentlyDeletedUseArchiveWhenArchiveSupportIsAdded": "この顧客には入金記録があるため、完全に削除できません。アーカイブ機能の追加後にアーカイブしてください。",
      "tokenExpired": "認証トークンの有効期限が切れています。",
      "tokenNotProvided": "認証トークンが指定されていません。",
      "userAccountNoLongerExists": "ユーザーアカウントが存在しません。",
      "youAreNotAuthorizedToAccessThisClient": "この顧客にアクセスする権限がありません。",
      "youAreNotAuthorizedToAccessThisResource": "この情報にアクセスする権限がありません。",
      "youAreNotAuthorizedToEditThisClient": "この顧客を編集する権限がありません。",
      "youAreNotAuthorizedToGenerateThisClientSCV": "この顧客の履歴書を作成する権限がありません。",
      "yourAccountHasBeenDisabled": "アカウントは無効になっています。",
      "assignedStaffCannotBeEmpty": "担当スタッフを指定してください。",
      "fullNamePhoneAndCurrentVisaStatusAreRequired": "氏名、電話番号、在留資格を入力してください。",
      "staffIdIsRequired": "スタッフIDを指定してください。",
      "somethingWentWrong": "エラーが発生しました。もう一度お試しください。",
      "networkError": "ネットワークに接続できません。接続を確認してください。",
      "failedToFetch": "データを取得できませんでした。接続を確認してください。",
      "requestAborted": "リクエストが中断されました。",
      "canceled": "リクエストがキャンセルされました。",
      "fieldEducation": "学歴",
      "fieldEmploymentHistory": "職歴",
      "fieldQualifications": "資格",
      "fieldSkills": "スキル",
      "validationError": "送信した情報に誤りがあります。入力内容を確認してください。",
      "aStageWithTheSameKeyOrStageIDAlreadyExists": "同じキーまたはステージIDのステージがすでに存在します。",
      "aStageWithTheSameNameAlreadyExists": "同じ名前のステージがすでに存在します。",
      "aStageWithTheSameValueAlreadyExists": "同じ値のステージがすでに存在します。",
      "aValidStageNameIsRequiredToGenerateTheStageKey": "ステージキーの生成には有効なステージ名が必要です。",
      "deactivateItInstead": "代わりに無効にしてください。",
      "failedToCreateStage": "ステージを作成できませんでした。",
      "failedToDeleteStage": "ステージを削除できませんでした。",
      "failedToGetStage": "ステージを取得できませんでした。",
      "failedToGetStages": "ステージ一覧を取得できませんでした。",
      "failedToUpdateStageStatus": "ステージのステータスを更新できませんでした。",
      "failedToUpdateStage": "ステージを更新できませんでした。",
      "stageIDCannotBeChanged": "ステージIDは変更できません。",
      "stageIDIsRequired": "ステージIDを指定してください。",
      "stageActivatedSuccessfully": "ステージを有効にしました。",
      "stageAmountMustBeAWholeNumberGreaterThanOrEqualTo0": "ステージの金額は0以上の整数で入力してください。",
      "stageCreatedSuccessfully": "ステージを作成しました。",
      "stageDeactivatedSuccessfully": "ステージを無効にしました。",
      "stageDeletedSuccessfully": "ステージを削除しました。",
      "stageKeyCannotBeChanged": "ステージキーは変更できません。",
      "stageNameCannotBeEmpty": "ステージ名を入力してください。",
      "stageNameIsRequired": "ステージ名を入力してください。",
      "stageNotFound": "ステージが見つかりません。",
      "stageUpdatedSuccessfully": "ステージを更新しました。",
      "theGeneratedStageKeyIsInvalid": "生成されたステージキーが正しくありません。",
      "displayOrderMustBeAPositiveWholeNumber2": "表示順は正の整数で入力してください。",
      "isActiveMustBeTrueOrFalse": "有効状態はtrueまたはfalseで指定してください。"
    },
    "requestFailed": "リクエストに失敗しました（ステータスコード：{status}）。",
    "requestTimeout": "リクエストがタイムアウトしました。もう一度お試しください。",
    "staffNotFound": "スタッフ{id}が見つかりません。",
    "options": {
      "gender": {
        "male": "男性",
        "female": "女性",
        "other": "その他"
      },
      "currentVisaStatus": {
        "student": "留学",
        "dependent": "家族滞在",
        "designatedActivitiesJobHunting": "特定活動・就職活動",
        "designatedActivities": "特定活動・その他",
        "engineerHumanitiesInternationalServices": "技術・人文知識・国際業務",
        "specifiedSkilledWorker1": "特定技能1号",
        "specifiedSkilledWorker2": "特定技能2号",
        "skilledLabor": "技能",
        "technicalInternTraining": "技能実習",
        "intraCompanyTransferee": "企業内転勤",
        "nursingCare": "介護",
        "highlySkilledProfessional": "高度専門職",
        "businessManager": "経営・管理",
        "permanentResident": "永住者",
        "spouseChildOfJapaneseNational": "日本人の配偶者等",
        "spouseChildOfPermanentResident": "永住者の配偶者等",
        "longTermResident": "定住者",
        "other": "その他"
      },
      "preferCategory": {
        "newJob": "就職 / 新規就職",
        "jobChange": "転職",
        "dependentVisaRenewal": "家族滞在ビザ更新",
        "visaServiceOnlyRenewal": "ビザ手続きのみ / 更新",
        "visaServiceOnlyChange": "ビザ手続きのみ / 変更",
        "otherVisaService": "その他のビザ手続き"
      },
      "currentStage": {
        "registeredPaid": "登録済み / 支払済み",
        "vacancySearching": "求人検索中",
        "interviewFixedPreparation": "面接確定 / 準備中",
        "interviewFailed": "面接不合格",
        "jobOfferReceived": "内定 / オファー受領",
        "jobOfferAccepted": "内定承諾",
        "jobOfferNotAccepted": "内定未承諾",
        "visaDocumentsSubmitted": "ビザ書類提出済み",
        "visaAppliedResultWaiting": "ビザ申請済み / 結果待ち",
        "visaApproved": "ビザ承認",
        "visaRejected": "ビザ却下",
        "companyJoining": "入社待ち",
        "employmentStartedCompanyJoined": "勤務開始 / 入社済み",
        "visaRenewal1Year": "ビザ更新 - 1年",
        "visaRenewal3Years": "ビザ更新 - 3年",
        "visaRenewal5Years": "ビザ更新 - 5年",
        "returnToNepal": "ネパールへ帰国"
      },
      "nationality": {
        "nepali": "ネパール",
        "indian": "インド",
        "pakistani": "パキスタン",
        "bangladeshi": "バングラデシュ",
        "sriLankan": "スリランカ",
        "vietnamese": "ベトナム",
        "myanmar": "ミャンマー",
        "indonesian": "インドネシア",
        "filipino": "フィリピン",
        "chinese": "中国",
        "other": "その他"
      },
      "statusOfResidence": {
        "student": "留学",
        "dependent": "家族滞在",
        "engineerSpecialistInHumanitiesInternationalServices": "技術・人文知識・国際業務",
        "specifiedSkilledWorkerNo1": "特定技能1号",
        "specifiedSkilledWorkerNo2": "特定技能2号",
        "technicalInternTraining": "技能実習",
        "designatedActivities": "特定活動",
        "highlySkilledProfessional": "高度専門職",
        "skilledLabor": "技能",
        "intraCompanyTransferee": "企業内転勤",
        "nursingCare": "介護",
        "businessManager": "経営・管理",
        "instructor": "教育",
        "researcher": "研究",
        "professor": "教授",
        "medicalServices": "医療",
        "permanentResident": "永住者",
        "longTermResident": "定住者",
        "spouseOrChildOfJapaneseNational": "日本人の配偶者等",
        "spouseOrChildOfPermanentResident": "永住者の配偶者等",
        "culturalActivities": "文化活動",
        "trainee": "研修",
        "other": "その他"
      },
      "japaneseLanguageLevel": {
        "n1": "N1",
        "n2": "N2",
        "n3": "N3",
        "n4": "N4",
        "n5": "N5",
        "none": "JLPTなし / 未取得"
      },
      "educationType": {
        "japaneseLanguageSchool": "日本語学校",
        "vocationalSchool": "専門学校",
        "university": "大学",
        "juniorCollege": "短期大学",
        "highSchool": "高等学校",
        "technicalCollege": "高等専門学校",
        "internationalSchool": "インターナショナルスクール",
        "other": "その他"
      },
      "employmentType": {
        "partTime": "アルバイト",
        "fullTime": "正社員",
        "contract": "契約社員",
        "temporaryDispatchEmployee": "派遣社員",
        "other": "その他"
      },
      "prefecture": {
        "hokkaido": "北海道",
        "aomori": "青森県",
        "iwate": "岩手県",
        "miyagi": "宮城県",
        "akita": "秋田県",
        "yamagata": "山形県",
        "fukushima": "福島県",
        "ibaraki": "茨城県",
        "tochigi": "栃木県",
        "gunma": "群馬県",
        "saitama": "埼玉県",
        "chiba": "千葉県",
        "tokyo": "東京都",
        "kanagawa": "神奈川県",
        "niigata": "新潟県",
        "toyama": "富山県",
        "ishikawa": "石川県",
        "fukui": "福井県",
        "yamanashi": "山梨県",
        "nagano": "長野県",
        "gifu": "岐阜県",
        "shizuoka": "静岡県",
        "aichi": "愛知県",
        "mie": "三重県",
        "shiga": "滋賀県",
        "kyoto": "京都府",
        "osaka": "大阪府",
        "hyogo": "兵庫県",
        "nara": "奈良県",
        "wakayama": "和歌山県",
        "tottori": "鳥取県",
        "shimane": "島根県",
        "okayama": "岡山県",
        "hiroshima": "広島県",
        "yamaguchi": "山口県",
        "tokushima": "徳島県",
        "kagawa": "香川県",
        "ehime": "愛媛県",
        "kochi": "高知県",
        "fukuoka": "福岡県",
        "saga": "佐賀県",
        "nagasaki": "長崎県",
        "kumamoto": "熊本県",
        "oita": "大分県",
        "miyazaki": "宮崎県",
        "kagoshima": "鹿児島県",
        "okinawa": "沖縄県"
      }
    },
    "stages": {
      "registeredPaid": "登録済み / 支払済み",
      "vacancySearching": "求人検索中",
      "interviewFixedPreparation": "面接確定 / 準備中",
      "interviewFailed": "面接不合格",
      "jobOfferReceived": "内定 / オファー受領",
      "jobOfferAccepted": "内定承諾",
      "jobOfferNotAccepted": "内定未承諾",
      "visaDocumentsSubmitted": "ビザ書類提出済み",
      "visaAppliedResultWaiting": "ビザ申請済み / 結果待ち",
      "visaApproved": "ビザ承認",
      "visaRejected": "ビザ却下",
      "companyJoining": "入社待ち",
      "employmentStartedCompanyJoined": "勤務開始 / 入社済み",
      "visaRenewal1Year": "ビザ更新 - 1年",
      "visaRenewal3Years": "ビザ更新 - 3年",
      "visaRenewal5Years": "ビザ更新 - 5年",
      "returnToNepal": "ネパールへ帰国",
      "new": "新規",
      "documentCollection": "書類収集中",
      "processing": "処理中",
      "cOEApplied": "COE申請済み",
      "cOEReceived": "COE受領済み",
      "visaApplied": "ビザ申請済み",
      "departed": "出国済み",
      "arrivedInJapan": "日本到着",
      "registrationPending": "登録待ち",
      "registeredVacancySearching": "登録済み / 求人検索中",
      "legacyPayment": "過去の入金"
    },
    "autocomplete": {
      "clear": "クリア",
      "open": "開く",
      "close": "閉じる"
    }
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"]});
}

const normalizeMessage = (value: string) => value.trim().replace(/\.+$/, "").toLowerCase();
const serverMessageKeys = new Map(Object.entries(messages.en.serverMessages).map(([key, value]) => [normalizeMessage(value), key]));

function translateServerMessage(message: string | null | undefined, locale: string, t: ReturnType<typeof useLocalTranslations>, fallback: keyof typeof messages.en.messages) {
  if (typeof message !== "string" || !message.trim()) return t(("messages." + fallback) as never);
  if (message.startsWith("messages.") && t.has(message as never)) return t(message as never);
  const key = serverMessageKeys.get(normalizeMessage(message));
  if (key) return t(("serverMessages." + key) as never);
  const httpError = /^Request failed with status code (\d+)\.?$/i.exec(message.trim());
  if (httpError) return t("requestFailed", {status: httpError[1]});
  if (/^timeout of \d+ms exceeded/i.test(message)) return t("requestTimeout");
  const staffError = /^Staff (.+) not found\.?$/i.exec(message.trim());
  if (staffError) return t("staffNotFound", {id: staffError[1]});
  if (locale !== "ja" || /^[\u3040-\u30ff\u3400-\u9fff]/u.test(message)) return message;
  if (/validation failed|cast to .+ failed/i.test(message)) return t("serverMessages.validationError");
  if (/E11000|duplicate key/i.test(message)) return t("serverMessages.duplicateDataExists");
  return t(("messages." + fallback) as never);
}

function translateValidationError(message: string | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!message) return undefined;
  return t.has(message as never) ? t(message as never) : t("validation.invalid");
}

const stageMessageKeys: Readonly<Record<string, keyof typeof messages.en.stages>> = {
  "legacy payment": "legacyPayment",
  "registered/paid": "registeredPaid",
  "registeredpaid": "registeredPaid",
  "vacancy searching": "vacancySearching",
  "vacancysearching": "vacancySearching",
  "interview fixed/preparation": "interviewFixedPreparation",
  "interviewfixedpreparation": "interviewFixedPreparation",
  "interview failed": "interviewFailed",
  "interviewfailed": "interviewFailed",
  "naitei/job offer received": "jobOfferReceived",
  "jobofferreceived": "jobOfferReceived",
  "job offer accepted": "jobOfferAccepted",
  "jobofferaccepted": "jobOfferAccepted",
  "job offer rejected": "jobOfferNotAccepted",
  "joboffernotaccepted": "jobOfferNotAccepted",
  "visa documents submitted": "visaDocumentsSubmitted",
  "visadocumentssubmitted": "visaDocumentsSubmitted",
  "visa applied/result waiting": "visaAppliedResultWaiting",
  "visaappliedresultwaiting": "visaAppliedResultWaiting",
  "visa approved": "visaApproved",
  "visaapproved": "visaApproved",
  "visa rejected": "visaRejected",
  "visarejected": "visaRejected",
  "waiting for nyusha/company joining": "companyJoining",
  "companyjoining": "companyJoining",
  "employment started/company joined": "employmentStartedCompanyJoined",
  "employmentstartedcompanyjoined": "employmentStartedCompanyJoined",
  "visa renewal - 1 year": "visaRenewal1Year",
  "visarenewal1year": "visaRenewal1Year",
  "visa renewal - 3 years": "visaRenewal3Years",
  "visarenewal3years": "visaRenewal3Years",
  "visa renewal - 5 years": "visaRenewal5Years",
  "visarenewal5years": "visaRenewal5Years",
  "return to nepal": "returnToNepal",
  "returntonepal": "returnToNepal",
  "job offer not accepted": "jobOfferNotAccepted",
  "new": "new",
  "document collection": "documentCollection",
  "processing": "processing",
  "coe applied": "cOEApplied",
  "coe received": "cOEReceived",
  "visa applied": "visaApplied",
  "departed": "departed",
  "arrived in japan": "arrivedInJapan",
  "registration pending": "registrationPending",
  "registered/vacancy searching": "registeredVacancySearching"
};
function translateStage(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!value) return "-";
  const key = stageMessageKeys[value.trim().toLowerCase().replace(/\s*\/\s*/g, "/")];
  return key ? t(`stages.${key}`) : value;
}


// =================================================
// DESIGN TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16,122,100,0.09)";
const PAGE_BG = "#F4F6F5";
const SURFACE = "#FFFFFF";
const SURFACE_ALT = "#F8FAF9";
const BORDER = "rgba(17,24,39,0.09)";
const INK = "#111827";
const MUTED = "#6B7280";

const WARNING = "#B45309";
const WARNING_DARK = "#92400E";
const WARNING_SOFT = "#FFFBEB";

const cardSx = {
  p: { xs: 1.75, sm: 2.25, md: 2.5 },
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  bgcolor: SURFACE,
  boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
};

const fieldSx = {
  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: SURFACE,
    "& fieldset": {
      borderColor: BORDER,
    },
    "&:hover fieldset": {
      borderColor: "rgba(16,122,100,0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },
  },
  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    fontSize: 11.5,
  },
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
  gap: 1.5,
};

const grid2Sx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: 1.5,
};

const outlineButtonSx = {
  alignSelf: "flex-start",
  minHeight: 34,
  px: 1.5,
  color: BRAND,
  borderColor: "rgba(16,122,100,0.35)",
  bgcolor: SURFACE,
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    borderColor: BRAND,
    bgcolor: BRAND_SOFT,
  },
} as const;

const dateProps = {
  type: "date",
  slotProps: {
    inputLabel: {
      shrink: true,
    },
  },
} as const;

// =================================================
// AUTOCOMPLETE
// =================================================

type FormOption = {
  value: string;
  label: string;
};

type FormAutocompleteProps = {
  label: string;
  value?: string | null;
  options: FormOption[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  noOptionsText?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: ReactNode;
};

const FormAutocomplete = ({
  label,
  value = "",
  options,
  onChange,
  onBlur,
  placeholder,
  noOptionsText,
  required = false,
  disabled = false,
  error = false,
  helperText,
}: FormAutocompleteProps) => {
  const t = useLocalTranslations();

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      clearOnEscape
      disabled={disabled}
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) =>
        option.value === selected.value
      }
      onChange={(_event, option) => {
        onChange(option?.value ?? "");
      }}
      onBlur={onBlur}
      noOptionsText={noOptionsText ?? t("noOptionsText")}
      clearText={t("autocomplete.clear")}
      openText={t("autocomplete.open")}
      closeText={t("autocomplete.close")}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.value}
          sx={{
            fontSize: 14,
          }}
        >
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          size="small"
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          sx={fieldSx}
        />
      )}
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          bgcolor: SURFACE,
        },
      }}
    />
  );
};

// =================================================
// FILE URL
// =================================================

const getUploadedFileUrl = (filePath?: string | null) => {
  if (!filePath) {
    return "";
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api";

  const backendUrl = apiUrl.replace(/\/api\/?$/, "");

  const normalizedPath = filePath.replace(/\\/g, "/");

  return `${backendUrl}/${normalizedPath.replace(/^\/+/, "")}`;
};

// =================================================
// FORM SECTION
// =================================================

const FormSection = ({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Paper elevation={0} component="section" sx={cardSx}>
    <Box
      sx={{
        display: "flex",
        alignItems: description ? "flex-start" : "center",
        gap: 1.25,
        mb: 1.75,
      }}
    >
      <Box
        aria-hidden
        sx={{
          flexShrink: 0,
          width: 24,
          height: 24,
          mt: description ? 0.1 : 0,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          bgcolor: BRAND_SOFT,
          color: BRAND,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {step}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h2"
          sx={{
            color: INK,
            fontSize: 15.5,
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              mt: 0.25,
              color: MUTED,
              fontSize: 12.5,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>

    {children}
  </Paper>
);

// =================================================
// REPEAT CARD
// =================================================

const RepeatCard = ({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) => (
  <RepeatCardContent title={title} onRemove={onRemove}>
    {children}
  </RepeatCardContent>
);

const RepeatCardContent = ({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) => {
  const t = useLocalTranslations();

  return (
    <Box
      sx={{
        position: "relative",
        p: { xs: 1.5, sm: 1.75 },
        pl: { xs: 2, sm: 2.25 },
        border: `1px solid ${BORDER}`,
        borderRadius: 2.5,
        bgcolor: SURFACE_ALT,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          bgcolor: BRAND,
          opacity: 0.7,
        },
      }}
    >
      <Box
        sx={{
          mb: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: INK,
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <IconButton
          type="button"
          size="small"
          aria-label={t("actions.removeItem", { item: title })}
          onClick={onRemove}
          sx={{
            color: MUTED,
            "&:hover": {
              color: "#B91C1C",
              bgcolor: "#FEF2F2",
            },
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {children}
    </Box>
  );
};

// =================================================
// STACK
// =================================================

const Stack = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
    }}
  >
    {children}
  </Box>
);

// =================================================
// UPLOAD CARD
// =================================================

const UploadCard = ({
  title,
  buttonLabel,
  accept,
  statusText,
  onSelect,
  preview,
}: {
  title: string;
  buttonLabel: string;
  accept: string;
  statusText: string;
  onSelect: (file: File) => void;
  preview: ReactNode;
}) => (
  <Box
    sx={{
      p: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 1.75,
      border: `1px solid ${BORDER}`,
      borderRadius: 2.5,
      bgcolor: SURFACE_ALT,
    }}
  >
    {preview}

    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{
          color: INK,
          fontSize: 13.5,
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.25,
          mb: 1,
          color: MUTED,
          fontSize: 12,
          lineHeight: 1.45,
          wordBreak: "break-word",
        }}
      >
        {statusText}
      </Typography>

      <Button
        component="label"
        variant="outlined"
        size="small"
        startIcon={<UploadFileOutlinedIcon />}
        sx={outlineButtonSx}
      >
        {buttonLabel}

        <input
          hidden
          type="file"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onSelect(file);
            }
          }}
        />
      </Button>
    </Box>
  </Box>
);

// =================================================
// CLIENT FORM
// =================================================

const ClientForm = ({ clientId }: ClientFormProps) => {
  const t = useLocalTranslations();
  const locale = useLocale();

  const {
    isEditMode,
    role,
    user,

    control,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,

    onSubmit,

    client,

    existingClientImage,
    existingCv,

    registrationStage,
    registrationAmount,
    registrationConfigError,
    isStageLoading,

    staffOptions,
    isStaffLoading,

    isLoading,
    isSaving,
    submitError,

    handleCancel,
  } = useClientFormHook(clientId);
  const paths = getPortalPaths(role);

  // =================================================
  // ARRAYS
  // =================================================

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control,
    name: "qualifications",
  });

  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control,
    name: "employmentHistory",
  });

  // =================================================
  // WATCH
  // =================================================

  const selectedClientImage = watch("clientImage");
  const selectedCv = watch("cv");
  const paymentMethod = watch("paymentMethod");

  // =================================================
  // PHOTO PREVIEW
  // =================================================

  const photoPreviewUrl = useMemo(() => {
    if (selectedClientImage instanceof File) {
      return URL.createObjectURL(selectedClientImage);
    }

    return "";
  }, [selectedClientImage]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const existingPhotoUrl =
    typeof existingClientImage === "string"
      ? getUploadedFileUrl(existingClientImage)
      : "";

  const photoSrc = photoPreviewUrl || existingPhotoUrl;

  // =================================================
  // OPTIONS
  // =================================================

  const visaOptions = CURRENT_VISA_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`options.currentVisaStatus.${option.key}` as never),
  }));

  const categoryOptions = PREFER_CATEGORY_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`options.preferCategory.${option.key}` as never),
  }));

  const genderOptions = GENDER.map((option) => ({
    value: option.value,
    label: t(`options.gender.${option.key}` as never),
  }));

  const nationalityOptions = NATIONALITIES.map((option) => ({
    value: option.value,
    label: t(`options.nationality.${option.key}` as never),
  }));

  const prefectureOptions = PREFECTURE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`options.prefecture.${option.key}` as never),
  }));

  const japaneseOptions = JAPANESE_LEVELS.map((option) => ({
    value: option.value,
    label: t(`options.japaneseLanguageLevel.${option.key}` as never),
  }));

  const educationTypeOptions = EDUCATION_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`options.educationType.${option.key}` as never),
  }));

  const employmentTypeOptions = EMPLOYMENT_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`options.employmentType.${option.key}` as never),
  }));

  const assignedStaffOptions = staffOptions.map((staff) => ({
    value: staff.staffId,
    label: `${staff.name} (${staff.staffId})`,
  }));

  const paymentMethodOptions = [
    {
      value: "Bank Transfer",
      label: t("paymentMethods.bankTransfer"),
    },
    {
      value: "Cash",
      label: t("paymentMethods.cash"),
    },
  ];

  const graduationStatusOptions = [
    {
      value: "graduated",
      label: t("graduationStatus.graduated"),
    },
    {
      value: "expectedGraduation",
      label: t("graduationStatus.expectedGraduation"),
    },
    {
      value: "currentlyEnrolled",
      label: t("graduationStatus.currentlyEnrolled"),
    },
    {
      value: "withdrawn",
      label: t("graduationStatus.withdrawn"),
    },
  ];

  // Create has one extra registration payment section.
  const offset = isEditMode ? 0 : 1;

  // =================================================
  // LOADING
  // =================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

  // =================================================
  // PAGE
  // =================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PAGE_BG,
        px: { xs: 1.5, sm: 3, md: 4 },
        pt: { xs: 1.5, md: 2 },
        pb: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
        }}
      >
        {/* BREADCRUMB */}

        <Box sx={{ mb: 1.5 }}>
          <Breadcrumb
            items={[
              {
                label: t("breadcrumbs.dashboard"),
                href: paths.dashboard,
              },
              {
                label: t("breadcrumbs.clients"),
                href: paths.clients,
              },
              {
                label: isEditMode
                  ? t("breadcrumbs.edit")
                  : t("breadcrumbs.create"),
                current: true,
              },
            ]}
          />
        </Box>

        {/* HEADER */}

        <Box sx={{ mb: 2 }}>
          <Typography
            component="h1"
            sx={{
              color: INK,
              fontSize: { xs: 21, md: 26 },
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {isEditMode ? t("header.editTitle") : t("header.createTitle")}
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              color: MUTED,
              fontSize: 13,
            }}
          >
            {isEditMode
              ? t("header.editDescription")
              : t("header.createDescription")}
          </Typography>
        </Box>

        {/* ERRORS */}

        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              borderRadius: 2,
            }}
          >
            {translateServerMessage(submitError, locale, t, isEditMode ? "updateFailed" : "registerFailed")}
          </Alert>
        )}

        {!isEditMode && registrationConfigError && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              borderRadius: 2,
            }}
          >
            {translateServerMessage(registrationConfigError, locale, t, "registrationStageLoadFailed")}
          </Alert>
        )}

        {/* FORM */}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* =================================================
          1 BASIC INFORMATION
          ================================================= */}

          <FormSection step={1} title={t("sections.basic.title")}>
            {" "}
            <Box sx={gridSx}>
              <TextField
                {...register("fullName")}
                label={t("fields.fullName")}
                required
                size="small"
                error={Boolean(errors.fullName)}
                helperText={translateValidationError(errors.fullName?.message, t)}
                sx={fieldSx}
              />

              <TextField
                {...register("furigana")}
                label={t("fields.furigana")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("phone")}
                label={t("fields.phone")}
                required
                size="small"
                error={Boolean(errors.phone)}
                helperText={translateValidationError(errors.phone?.message, t)}
                sx={fieldSx}
              />

              <TextField
                {...register("email")}
                label={t("fields.email")}
                size="small"
                error={Boolean(errors.email)}
                helperText={translateValidationError(errors.email?.message, t)}
                sx={fieldSx}
              />

              <TextField
                {...register("dateOfBirth")}
                {...dateProps}
                label={t("fields.dateOfBirth")}
                size="small"
                sx={fieldSx}
              />

              {/* GENDER AUTOCOMPLETE */}

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.gender")}
                    value={field.value}
                    options={genderOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.gender")}
                  />
                )}
              />

              {/* NATIONALITY AUTOCOMPLETE */}

              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.nationality")}
                    value={field.value}
                    options={nationalityOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.nationality")}
                  />
                )}
              />
            </Box>
          </FormSection>

          {/* =================================================
          2 ADDRESS
          ================================================= */}

          <FormSection step={2} title={t("sections.address.title")}>
            <Box sx={gridSx}>
              <TextField
                {...register("postalCode")}
                label={t("fields.postalCode")}
                size="small"
                sx={fieldSx}
              />

              {/* PREFECTURE AUTOCOMPLETE */}

              <Controller
                name="prefecture"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.prefecture")}
                    value={field.value}
                    options={prefectureOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
placeholder={t("placeholders.prefecture")}
                  />
                )}
              />

              <TextField
                {...register("address")}
                label={t("fields.address")}
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          3 IMMIGRATION
          ================================================= */}

          <FormSection step={3} title={t("sections.immigration.title")}>
            <Box sx={gridSx}>
              {/* VISA AUTOCOMPLETE */}

              <Controller
                name="currentVisaStatus"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    required
                    label={t("fields.currentVisaStatus")}
                    value={field.value}
                    options={visaOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.currentVisaStatus")}
                    error={Boolean(errors.currentVisaStatus)}
                    helperText={translateValidationError(errors.currentVisaStatus?.message, t)}
                  />
                )}
              />

              <TextField
                {...register("residenceExpiryDate")}
                {...dateProps}
                label={t("fields.residenceExpiryDate")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportNumber")}
                label={t("fields.passportNumber")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("passportExpiryDate")}
                {...dateProps}
                label={t("fields.passportExpiryDate")}
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          4 RECRUITMENT
          ================================================= */}

          <FormSection
            step={4}
            title={t("sections.recruitment.title")}
            description={
              isEditMode
                ? t("sections.recruitment.editDescription")
                : t("sections.recruitment.createDescription")
            }
          >
            <Box sx={gridSx}>
              {/* CATEGORY AUTOCOMPLETE */}

              <Controller
                name="preferCategory"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    label={t("fields.preferCategory")}
                    value={field.value}
                    options={categoryOptions}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("placeholders.preferCategory")}
                    error={Boolean(errors.preferCategory)}
                    helperText={translateValidationError(errors.preferCategory?.message, t)}
                  />
                )}
              />

              {/* STAFF AUTOCOMPLETE */}

              {role === "superadmin" ? (
                <Controller
                  name="assignedStaff"
                  control={control}
                  render={({ field }) => (
                    <FormAutocomplete
                      required
                      label={t("fields.assignedStaff")}
                      value={field.value}
                      options={assignedStaffOptions}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isStaffLoading}
                      placeholder={t("placeholders.assignedStaff")}
                      error={Boolean(errors.assignedStaff)}
                      helperText={translateValidationError(errors.assignedStaff?.message, t)}
                    />
                  )}
                />
              ) : (
                <TextField
                  label={t("fields.assignedStaff")}
                  value={user?.staffId || t("assignedStaff.autoAssigned")}
                  disabled
                  size="small"
                  sx={fieldSx}
                />
              )}

              <TextField
                {...register("intake")}
                label={t("fields.intake")}
                size="small"
                sx={fieldSx}
              />

              <TextField
                label={t("fields.currentStage")}
                value={
                  isEditMode
                    ? translateStage(client?.currentStageDetails?.name || client?.clientStatus || client?.currentStage, t)
                    : registrationStage?.name ? translateStage(registrationStage.name, t) : t("registrationStageFallback")
                }
                disabled
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          5 REGISTRATION PAYMENT
          ================================================= */}

          {!isEditMode && (
            <FormSection
              step={5}
              title={t("sections.registrationPayment.title")}
              description={t("sections.registrationPayment.description")}
            >
              {isStageLoading ? (
                <Box
                  sx={{
                    py: 2,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress
                    size={22}
                    sx={{
                      color: BRAND,
                    }}
                  />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 1.5,
                      px: 1.75,
                      py: 1.25,
                      border: "1px solid rgba(180,83,9,0.2)",
                      borderRadius: 2.5,
                      bgcolor: WARNING_SOFT,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: WARNING,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {t("registrationPayment.fullPaymentRequired")}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.2,
                          color: INK,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {registrationStage?.name ? translateStage(registrationStage.name, t) : t("registrationStageFallback")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          color: MUTED,
                          fontSize: 11.5,
                        }}
                      >
                        {t("registrationPayment.registrationFee")}
                      </Typography>

                      <Typography
                        sx={{
                          color: WARNING,
                          fontSize: { xs: 20, sm: 22 },
                          fontWeight: 800,
                          lineHeight: 1.2,
                        }}
                      >
                        ¥{registrationAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      mb: 1.5,
                      py: 0,
                      borderRadius: 2,
                      fontSize: 13,
                    }}
                  >
                    {t("registrationPayment.stageMasterNote")}
                  </Alert>

                  <Box sx={gridSx}>
                    {/* PAYMENT METHOD AUTOCOMPLETE */}

                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <FormAutocomplete
                          required
                          label={t("fields.paymentMethod")}
                          value={field.value}
                          options={paymentMethodOptions}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("placeholders.paymentMethod")}
                          error={Boolean(errors.paymentMethod)}
                          helperText={translateValidationError(errors.paymentMethod?.message, t)}
                        />
                      )}
                    />

                    <TextField
                      {...register("paymentDate")}
                      {...dateProps}
                      required
                      label={t("fields.paymentDate")}
                      size="small"
                      error={Boolean(errors.paymentDate)}
                      helperText={translateValidationError(errors.paymentDate?.message, t)}
                      sx={fieldSx}
                    />

                    {paymentMethod === "Bank Transfer" && (
                      <>
                        <TextField
                          {...register("bankName")}
                          label={t("fields.bankName")}
                          size="small"
                          sx={fieldSx}
                        />

                        <TextField
                          {...register("referenceNumber")}
                          label={t("fields.referenceNumber")}
                          size="small"
                          sx={fieldSx}
                        />
                      </>
                    )}

                    <TextField
                      {...register("receiptNumber")}
                      label={t("fields.receiptNumber")}
                      size="small"
                      sx={fieldSx}
                    />
                  </Box>

                  <TextField
                    {...register("paymentNote")}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label={t("fields.paymentNote")}
                    sx={{
                      ...fieldSx,
                      mt: 1.5,
                    }}
                  />
                </>
              )}
            </FormSection>
          )}

          {/* =================================================
          EDUCATION
          ================================================= */}

          <FormSection step={5 + offset} title={t("sections.education.title")}>
            <Stack>
              {educationFields.map((item, index) => (
                <RepeatCard
                  key={item.id}
                  title={t("education.itemTitle", { number: index + 1 })}
                  onRemove={() => removeEducation(index)}
                >
                  <Box sx={gridSx}>
                    {/* EDUCATION TYPE AUTOCOMPLETE */}

                    <Controller
                      name={`education.${index}.educationType`}
                      control={control}
                      render={({ field }) => (
                        <FormAutocomplete
                          label={t("fields.educationType")}
                          value={field.value}
                          options={educationTypeOptions}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("placeholders.educationType")}
                        />
                      )}
                    />

                    <TextField
                      {...register(`education.${index}.schoolName`)}
                      label={t("fields.schoolName")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.major`)}
                      label={t("fields.major")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.enrollmentDate`)}
                      {...dateProps}
                      label={t("fields.enrollmentDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`education.${index}.graduationDate`)}
                      {...dateProps}
                      label={t("fields.graduationDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    {/* GRADUATION STATUS AUTOCOMPLETE */}

                    <Controller
                      name={`education.${index}.graduationStatus`}
                      control={control}
                      render={({ field }) => (
                        <FormAutocomplete
                          label={t("fields.graduationStatus")}
                          value={field.value}
                          options={graduationStatusOptions}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("placeholders.graduationStatus")}
                        />
                      )}
                    />
                  </Box>
                </RepeatCard>
              ))}

              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  appendEducation({
                    schoolName: "",
                    educationType: "",
                    enrollmentDate: "",
                    graduationDate: "",
                    graduationStatus: "",
                    major: "",
                  })
                }
                sx={outlineButtonSx}
              >
                {t("education.add")}
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          JAPANESE & QUALIFICATIONS
          ================================================= */}

          <FormSection
            step={6 + offset}
            title={t("sections.qualifications.title")}
          >
            <Stack>
              {/* JAPANESE LEVEL AUTOCOMPLETE */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: 320,
                  },
                }}
              >
                <Controller
                  name="japaneseLanguageLevel"
                  control={control}
                  render={({ field }) => (
                    <FormAutocomplete
                      label={t("fields.japaneseLanguageLevel")}
                      value={field.value}
                      options={japaneseOptions}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={t("placeholders.japaneseLanguageLevel")}
                    />
                  )}
                />
              </Box>

              {qualificationFields.map((item, index) => (
                <RepeatCard
                  key={item.id}
                  title={t("qualifications.itemTitle", { number: index + 1 })}
                  onRemove={() => removeQualification(index)}
                >
                  <Box sx={gridSx}>
                    <TextField
                      {...register(`qualifications.${index}.name`)}
                      label={t("fields.qualificationName")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.levelOrScore`)}
                      label={t("fields.levelOrScore")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.issuer`)}
                      label={t("fields.issuer")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.acquiredDate`)}
                      {...dateProps}
                      label={t("fields.acquiredDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.expiryDate`)}
                      {...dateProps}
                      label={t("fields.expiryDate")}
                      size="small"
                      sx={fieldSx}
                    />

                    <TextField
                      {...register(`qualifications.${index}.note`)}
                      label={t("fields.note")}
                      size="small"
                      sx={fieldSx}
                    />
                  </Box>
                </RepeatCard>
              ))}

              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  appendQualification({
                    name: "",
                    levelOrScore: "",
                    acquiredDate: "",
                    expiryDate: "",
                    issuer: "",
                    note: "",
                  })
                }
                sx={outlineButtonSx}
              >
                {t("qualifications.add")}
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          EMPLOYMENT HISTORY
          ================================================= */}

          <FormSection step={7 + offset} title={t("sections.employment.title")}>
            <Stack>
              {employmentFields.map((item, index) => {
                const isCurrent = watch(`employmentHistory.${index}.isCurrent`);

                return (
                  <RepeatCard
                    key={item.id}
                    title={t("employment.itemTitle", { number: index + 1 })}
                    onRemove={() => removeEmployment(index)}
                  >
                    <Box sx={gridSx}>
                      <TextField
                        {...register(`employmentHistory.${index}.companyName`)}
                        label={t("fields.companyName")}
                        size="small"
                        sx={fieldSx}
                      />

                      {/* EMPLOYMENT TYPE AUTOCOMPLETE */}

                      <Controller
                        name={`employmentHistory.${index}.employmentType`}
                        control={control}
                        render={({ field }) => (
                          <FormAutocomplete
                            label={t("fields.employmentType")}
                            value={field.value}
                            options={employmentTypeOptions}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={t("placeholders.employmentType")}
                          />
                        )}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.department`)}
                        label={t("fields.department")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.jobTitle`)}
                        label={t("fields.jobTitle")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.workLocation`)}
                        label={t("fields.workLocation")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.startDate`)}
                        {...dateProps}
                        label={t("fields.startDate")}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.endDate`)}
                        {...dateProps}
                        label={t("fields.endDate")}
                        disabled={isCurrent}
                        size="small"
                        sx={fieldSx}
                      />

                      <Controller
                        name={`employmentHistory.${index}.isCurrent`}
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            sx={{
                              m: 0,
                              "& .MuiFormControlLabel-label": {
                                fontSize: 13.5,
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                checked={Boolean(field.value)}
                                onChange={(event) => {
                                  field.onChange(event.target.checked);

                                  if (event.target.checked) {
                                    setValue(
                                      `employmentHistory.${index}.endDate`,
                                      "",
                                    );
                                  }
                                }}
                                sx={{
                                  color: BRAND,
                                  "&.Mui-checked": {
                                    color: BRAND,
                                  },
                                }}
                              />
                            }
                            label={t("fields.currentlyEmployed")}
                          />
                        )}
                      />
                    </Box>

                    <Box
                      sx={{
                        ...grid2Sx,
                        mt: 1.5,
                      }}
                    >
                      <TextField
                        {...register(
                          `employmentHistory.${index}.responsibilities`,
                        )}
                        label={t("fields.responsibilities")}
                        multiline
                        minRows={3}
                        size="small"
                        sx={fieldSx}
                      />

                      <TextField
                        {...register(`employmentHistory.${index}.achievements`)}
                        label={t("fields.achievements")}
                        multiline
                        minRows={3}
                        size="small"
                        sx={fieldSx}
                      />
                    </Box>
                  </RepeatCard>
                );
              })}

              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  appendEmployment({
                    companyName: "",
                    employmentType: "",
                    department: "",
                    jobTitle: "",
                    workLocation: "",
                    startDate: "",
                    endDate: "",
                    isCurrent: false,
                    responsibilities: "",
                    achievements: "",
                  })
                }
                sx={outlineButtonSx}
              >
                {t("employment.add")}
              </Button>
            </Stack>
          </FormSection>

          {/* =================================================
          SKILLS
          ================================================= */}

          <FormSection step={8 + offset} title={t("sections.skills.title")}>
            <Box sx={grid2Sx}>
              <TextField
                {...register("skillsText")}
                label={t("fields.skills")}
                multiline
                minRows={3}
                size="small"
                helperText={t("fields.skillsHelper")}
                sx={fieldSx}
              />

              <TextField
                {...register("careerSummary")}
                label={t("fields.careerSummary")}
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />
            </Box>
          </FormSection>

          {/* =================================================
          JAPANESE APPLICATION
          ================================================= */}

          <FormSection step={9 + offset} title={t("sections.application.title")}>
            <Stack>
              <TextField
                {...register("motivation")}
                label={t("fields.motivation")}
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("selfPR")}
                label={t("fields.selfPR")}
                multiline
                minRows={3}
                size="small"
                sx={fieldSx}
              />

              <TextField
                {...register("desiredConditions")}
                label={t("fields.desiredConditions")}
                multiline
                minRows={2}
                size="small"
                sx={fieldSx}
              />
            </Stack>
          </FormSection>

          {/* =================================================
          DOCUMENTS
          ================================================= */}

          <FormSection step={10 + offset} title={t("sections.documents.title")}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <UploadCard
                title={t("documents.photo.title")}
                buttonLabel={
                  photoSrc
                    ? t("documents.photo.replace")
                    : t("documents.photo.select")
                }
                accept="image/*"
                statusText={
                  selectedClientImage instanceof File
                    ? selectedClientImage.name
                    : existingClientImage
                      ? t("documents.photo.existing")
                      : t("documents.photo.empty")
                }
                onSelect={(file) =>
                  setValue("clientImage", file, {
                    shouldDirty: true,
                  })
                }
                preview={
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 72,
                      aspectRatio: "3 / 4",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: `1px solid ${BORDER}`,
                      bgcolor: BRAND_SOFT,
                      color: BRAND,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {photoSrc ? (
                      <Box
                        component="img"
                        src={photoSrc}
                        alt={t("documents.photo.previewAlt")}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          display: "block",
                        }}
                      />
                    ) : (
                      <PersonOutlineRoundedIcon />
                    )}
                  </Box>
                }
              />

              <UploadCard
                title={t("documents.cv.title")}
                buttonLabel={
                  selectedCv instanceof File || existingCv
                    ? t("documents.cv.replace")
                    : t("documents.cv.select")
                }
                accept=".pdf"
                statusText={
                  selectedCv instanceof File
                    ? selectedCv.name
                    : existingCv
                      ? t("documents.cv.existing")
                      : t("documents.cv.empty")
                }
                onSelect={(file) =>
                  setValue("cv", file, {
                    shouldDirty: true,
                  })
                }
                preview={
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 72,
                      height: 96,
                      borderRadius: 2,
                      border: `1px solid ${BORDER}`,
                      bgcolor: BRAND_SOFT,
                      color: BRAND,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <DescriptionOutlinedIcon />
                  </Box>
                }
              />
            </Box>
          </FormSection>

          {/* =================================================
          ACTION BAR
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              ...cardSx,
              p: { xs: 1.25, sm: 1.5 },
              position: "sticky",
              bottom: 12,
              zIndex: 5,
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 28px -12px rgba(17,24,39,0.28)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              "& > button": {
                minHeight: 42,
                px: 2.25,
                textTransform: "none",
                fontWeight: 600,
              },
            }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={isSaving}
              onClick={handleCancel}
              sx={{
                flexShrink: 0,
                borderColor: BORDER,
                color: MUTED,
                bgcolor: SURFACE,
                "&:hover": {
                  borderColor: MUTED,
                  bgcolor: SURFACE,
                },
              }}
            >
              {t("actions.cancel")}
            </Button>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={
                isSaving ||
                (!isEditMode &&
                  (isStageLoading || Boolean(registrationConfigError)))
              }
              startIcon={
                isSaving ? (
                  <CircularProgress size={15} color="inherit" />
                ) : isEditMode ? (
                  <SaveOutlinedIcon />
                ) : (
                  <PaymentsOutlinedIcon />
                )
              }
              sx={{
                flex: {
                  xs: 1,
                  sm: "0 1 auto",
                },
                bgcolor: isEditMode ? BRAND : WARNING,
                color: "#ffffff",
                fontWeight: 700,
                lineHeight: 1.25,
                "&:hover": {
                  bgcolor: isEditMode ? BRAND_HOVER : WARNING_DARK,
                },
              }}
            >
              {isSaving
                ? t("actions.processing")
                : isEditMode
                  ? t("actions.update")
                  : t("actions.confirmPaymentCreate", {
                      amount: registrationAmount.toLocaleString(),
                    })}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientForm;
